"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Yourdon/DeMarco DFD notation:
//   - External entity  → rectangle
//   - Process          → circle (labelled with its number)
//   - Data store       → open-rectangle (two parallel horizontal lines only,
//                        with a left-side "D1" / "D2" tag; NO sides)
//   - Data flow        → labelled directed arrow
//
// The diagram walks a checkout: Customer submits cart, a payment gateway
// authorises, and a confirmation returns. Two Customer rectangles sit on the
// left edge (sending) and again on the left edge below (receiving) — the
// external entity is drawn at each touchpoint so edges never cross the boundary
// of the system itself.

type NodeKind = "entity" | "process" | "store";

interface NodeSpec {
  id: string;
  kind: NodeKind;
  // Centre in layout space (0..100 × 0..100).
  cx: number;
  cy: number;
  // Dimensions in layout space.
  w: number;
  h: number;
  // Primary label.
  label: string;
  // Process number (rendered inside the circle, small, below the label).
  num?: string;
  // Data-store tag (e.g. "D1"), rendered in the left gutter of an open-rect.
  tag?: string;
}

interface FlowSpec {
  from: string;
  to: string;
  label: string;
}

const NODES: ReadonlyArray<NodeSpec> = [
  // Customer — submits cart (top-left external entity).
  { id: "customer-in", kind: "entity", cx: 9, cy: 24, w: 14, h: 10, label: "Customer" },
  // Process 1: Submit Cart.
  { id: "submit", kind: "process", cx: 29, cy: 24, w: 14, h: 14, label: "Submit Cart", num: "1" },
  // D1: Cart (data store).
  { id: "cart", kind: "store", cx: 49, cy: 24, w: 18, h: 8, label: "Cart", tag: "D1" },
  // Process 2: Validate Payment.
  { id: "validate", kind: "process", cx: 69, cy: 24, w: 14, h: 14, label: "Validate Payment", num: "2" },
  // Payment Gateway (external entity, right edge).
  { id: "gateway", kind: "entity", cx: 90, cy: 50, w: 18, h: 10, label: "Payment Gateway" },
  // Process 3: Confirm Order.
  { id: "confirm", kind: "process", cx: 69, cy: 76, w: 14, h: 14, label: "Confirm Order", num: "3" },
  // D2: Orders (data store).
  { id: "orders", kind: "store", cx: 49, cy: 76, w: 18, h: 8, label: "Orders", tag: "D2" },
  // Process 4: Send Confirmation.
  { id: "send", kind: "process", cx: 29, cy: 76, w: 14, h: 14, label: "Send Confirmation", num: "4" },
  // Customer — receives confirmation (bottom-left external entity).
  { id: "customer-out", kind: "entity", cx: 9, cy: 76, w: 14, h: 10, label: "Customer" },
];

const FLOWS: ReadonlyArray<FlowSpec> = [
  { from: "customer-in", to: "submit", label: "cart items" },
  { from: "submit", to: "cart", label: "cart data" },
  { from: "cart", to: "validate", label: "cart lookup" },
  { from: "validate", to: "gateway", label: "charge request" },
  { from: "gateway", to: "confirm", label: "payment OK" },
  { from: "confirm", to: "orders", label: "new order" },
  { from: "orders", to: "send", label: "order details" },
  { from: "send", to: "customer-out", label: "confirmation" },
];

export function DataFlowDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 32, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout-space → pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // Return the point on a node's bounding box closest to a target direction.
  // For circles we treat the bounding box as a square of side min(w,h).
  function anchor(n: NodeSpec, towards: { x: number; y: number }) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    // Shape-aware half-extents.
    let hw: number;
    let hh: number;
    if (n.kind === "process") {
      // Approximate radius from the smaller of w/h in pixel space.
      const r = Math.min(px(n.w), py(n.h)) / 2;
      hw = r;
      hh = r;
    } else {
      hw = px(n.w) / 2;
      hh = py(n.h) / 2;
    }
    const dx = towards.x - cx;
    const dy = towards.y - cy;

    if (n.kind === "process") {
      // Circle: project the direction vector onto the perimeter.
      const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      return { x: cx + (dx / len) * hw, y: cy + (dy / len) * hh };
    }
    // Rectangle / open-rect: leave through the side with the larger relative
    // overshoot. Open-rectangles only render top/bottom lines, but arrows still
    // enter/exit through the full bounding box.
    if (Math.abs(dy) * hw >= Math.abs(dx) * hh) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: cx, y: cy + sign * hh };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: cx + sign * hw, y: cy };
  }

  interface EdgeGeom {
    d: string;
    tipX: number;
    tipY: number;
    tipAngle: number;
    labelX: number;
    labelY: number;
    // Anchor rect for the edge (used to drive ExplainAnchor for the
    // representative data-flow arrow).
    rect: { x: number; y: number; width: number; height: number };
  }

  function edgeGeom(f: FlowSpec): EdgeGeom {
    const from = nodeById.get(f.from)!;
    const to = nodeById.get(f.to)!;
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const a = anchor(from, toCentre);
    const b = anchor(to, fromCentre);
    const tangent = Math.atan2(b.y - a.y, b.x - a.x);
    const midX = (a.x + b.x) / 2;
    const midY = (a.y + b.y) / 2;
    // Place the label slightly above the midpoint for (mostly) horizontal
    // edges, slightly to the right for vertical edges.
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    let labelX = midX;
    let labelY = midY - 5;
    if (Math.abs(dy) > Math.abs(dx)) {
      labelX = midX + 6;
      labelY = midY + 3;
    }
    const rect = {
      x: Math.min(a.x, b.x) - 4,
      y: Math.min(a.y, b.y) - 6,
      width: Math.abs(b.x - a.x) + 8,
      height: Math.abs(b.y - a.y) + 12,
    };
    return {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      tipX: b.x,
      tipY: b.y,
      tipAngle: (tangent * 180) / Math.PI,
      labelX,
      labelY,
      rect,
    };
  }

  // Precompute geometry for every flow so we can place anchors against real
  // pixel coordinates.
  const flowGeoms = FLOWS.map((f) => ({ f, g: edgeGeom(f) }));

  // Arrow-head triangle rooted at (tipX, tipY) pointing along tipAngle.
  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.55;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.55;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  // Render the correct shape per node kind. Open-rectangles draw ONLY the top
  // and bottom lines (with the left-side D-tag written in the gutter).
  function renderShape(n: NodeSpec) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const w = px(n.w);
    const h = py(n.h);
    const x = cx - w / 2;
    const y = cy - h / 2;

    if (n.kind === "entity") {
      return (
        <rect
          key={`s-${n.id}`}
          x={x}
          y={y}
          width={w}
          height={h}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      );
    }
    if (n.kind === "process") {
      const r = Math.min(w, h) / 2;
      return (
        <circle
          key={`s-${n.id}`}
          cx={cx}
          cy={cy}
          r={r}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      );
    }
    // Open-rectangle data store: just the top + bottom horizontal lines.
    return (
      <g key={`s-${n.id}`}>
        <line x1={x} y1={y} x2={x + w} y2={y} stroke="var(--color-ink)" strokeWidth={1.4} />
        <line
          x1={x}
          y1={y + h}
          x2={x + w}
          y2={y + h}
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      </g>
    );
  }

  function renderLabel(n: NodeSpec) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    if (n.kind === "process") {
      // Label above the process number.
      return (
        <g key={`l-${n.id}`}>
          <text
            x={cx}
            y={cy - 1}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            {n.label}
          </text>
          {n.num && (
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {n.num}
            </text>
          )}
        </g>
      );
    }
    if (n.kind === "store") {
      const w = px(n.w);
      const x = cx - w / 2;
      // Left-gutter tag (e.g. "D1"), separated by a short vertical rule.
      return (
        <g key={`l-${n.id}`}>
          <line
            x1={x + 14}
            y1={cy - py(n.h) / 2}
            x2={x + 14}
            y2={cy + py(n.h) / 2}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {n.tag && (
            <text
              x={x + 3}
              y={cy + 3}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {n.tag}
            </text>
          )}
          <text
            x={x + 18}
            y={cy + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            {n.label}
          </text>
        </g>
      );
    }
    // Entity (rectangle).
    return (
      <text
        key={`l-${n.id}`}
        x={cx}
        y={cy + 3}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fill="var(--color-ink)"
      >
        {n.label}
      </text>
    );
  }

  // Resolve representative nodes for anchors.
  const entityNode = nodeById.get("customer-in")!;
  const processNode = nodeById.get("submit")!;
  const storeNode = nodeById.get("cart")!;
  const representativeFlow = flowGeoms.find(
    (fg) => fg.f.from === "submit" && fg.f.to === "cart",
  )!;
  const processNumberNode = nodeById.get("validate")!; // process with a visible "2" number

  // Level-0 scope indicator: a dashed rectangle framing the processes (the
  // system-under-design). Rendered below so it reads as context, not as a
  // structural element.
  const scope = {
    x: Math.max(0, px(16)),
    y: Math.max(0, py(10)),
    width: Math.min(iw, px(72)),
    height: Math.min(ih, py(82)),
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Data Flow Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Level-0 scope frame (dashed). Processes and stores inside it are
            the system; rectangles outside it are external entities. */}
        <g data-data-layer="true">
          <rect
            x={scope.x}
            y={scope.y}
            width={scope.width}
            height={scope.height}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.55}
          />
          <text
            x={scope.x + 6}
            y={scope.y - 6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            LEVEL-0 SCOPE
          </text>
        </g>

        {/* Data flows drawn first so nodes paint on top. */}
        <g data-data-layer="true">
          {flowGeoms.map(({ f, g }, i) => {
            // Pull the tip back slightly so it sits flush against the node.
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.5;
            const tipY = g.tipY - Math.sin(rad) * 1.5;
            return (
              <g key={`flow-${i}`}>
                <path
                  d={g.d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                  opacity={0.9}
                />
                <polygon
                  points={arrowHead(tipX, tipY, g.tipAngle)}
                  fill="var(--color-ink)"
                  opacity={0.9}
                />
                <text
                  x={g.labelX}
                  y={g.labelY}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {f.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Shapes */}
        <g data-data-layer="true">{NODES.map((n) => renderShape(n))}</g>

        {/* Labels */}
        <g data-data-layer="true">{NODES.map((n) => renderLabel(n))}</g>

        {/* ----- Anchors ----- */}

        {/* 1. external-entity (Customer rectangle, top-left) */}
        <ExplainAnchor
          selector="external-entity"
          index={1}
          pin={{
            x: Math.max(6, px(entityNode.cx) - px(entityNode.w) / 2 - 10),
            y: py(entityNode.cy) - py(entityNode.h) / 2 - 10,
          }}
          rect={{
            x: Math.max(0, px(entityNode.cx) - px(entityNode.w) / 2),
            y: Math.max(0, py(entityNode.cy) - py(entityNode.h) / 2),
            width: Math.min(iw, px(entityNode.w)),
            height: Math.min(ih, py(entityNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. process (circle — Submit Cart) */}
        <ExplainAnchor
          selector="process"
          index={2}
          pin={{
            x: px(processNode.cx),
            y: py(processNode.cy) - Math.min(px(processNode.w), py(processNode.h)) / 2 - 10,
          }}
          rect={{
            x: Math.max(0, px(processNode.cx) - px(processNode.w) / 2),
            y: Math.max(0, py(processNode.cy) - py(processNode.h) / 2),
            width: Math.min(iw, px(processNode.w)),
            height: Math.min(ih, py(processNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. data-store (open-rectangle — D1: Cart) */}
        <ExplainAnchor
          selector="data-store"
          index={3}
          pin={{
            x: px(storeNode.cx),
            y: Math.max(14, py(storeNode.cy) - py(storeNode.h) / 2 - 12),
          }}
          rect={{
            x: Math.max(0, px(storeNode.cx) - px(storeNode.w) / 2),
            y: Math.max(0, py(storeNode.cy) - py(storeNode.h) / 2),
            width: Math.min(iw, px(storeNode.w)),
            height: Math.min(ih, py(storeNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. data-flow (labelled arrow, Submit Cart → D1: Cart) */}
        <ExplainAnchor
          selector="data-flow"
          index={4}
          pin={{ x: representativeFlow.g.labelX, y: representativeFlow.g.labelY - 14 }}
          rect={{
            x: Math.max(0, Math.min(representativeFlow.g.rect.x, iw - 8)),
            y: Math.max(0, Math.min(representativeFlow.g.rect.y, ih - 8)),
            width: Math.min(
              iw - Math.max(0, representativeFlow.g.rect.x),
              representativeFlow.g.rect.width,
            ),
            height: Math.min(
              ih - Math.max(0, representativeFlow.g.rect.y),
              representativeFlow.g.rect.height,
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. process-number ("2" inside the Validate Payment circle) */}
        <ExplainAnchor
          selector="process-number"
          index={5}
          pin={{
            x: px(processNumberNode.cx) + Math.min(px(processNumberNode.w), py(processNumberNode.h)) / 2 + 10,
            y: py(processNumberNode.cy) + 10,
          }}
          rect={{
            x: Math.max(0, px(processNumberNode.cx) - 10),
            y: Math.max(0, py(processNumberNode.cy) + 2),
            width: 20,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. level-0-scope (dashed frame) */}
        <ExplainAnchor
          selector="level-0-scope"
          index={6}
          pin={{ x: scope.x + scope.width - 12, y: Math.max(10, scope.y - 10) }}
          rect={{
            x: scope.x,
            y: Math.max(0, scope.y - 12),
            width: scope.width,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
