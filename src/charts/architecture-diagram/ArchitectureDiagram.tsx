"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// C4-model-inspired lightweight architecture view. Three columns, left to
// right: external actors, internal services, data stores / external systems.
// The shape vocabulary carries the kind of each box:
//   - service  → rounded rectangle, solid fill
//   - database → cylinder (rectangle + top/bottom ellipses)
//   - queue    → stadium / pill
//   - external → rounded rectangle with a dashed border
//
// Edges are Manhattan-routed (axis-aligned L / Z segments only) with a
// protocol label above the midpoint and a data-description label below.

type Kind = "service" | "database" | "queue" | "external";

interface Box {
  id: string;
  kind: Kind;
  name: string;
  // Layout-space centre (0..100 × 0..100).
  cx: number;
  cy: number;
  // Layout-space width / height.
  w: number;
  h: number;
}

interface Edge {
  from: string;
  to: string;
  protocol: string;
  data: string;
  // Preferred routing shape:
  //   "h"   — straight horizontal (same y)
  //   "v"   — straight vertical (same x)
  //   "hv"  — go horizontal then vertical (L)
  //   "vh"  — go vertical then horizontal (L, mirror)
  //   "hvh" — horizontal, vertical, horizontal (Z — for same-row jogs)
  shape: "h" | "v" | "hv" | "vh" | "hvh";
}

const BOXES: ReadonlyArray<Box> = [
  // Column 1 — external actors (left).
  { id: "user", kind: "external", name: "User\n(browser)", cx: 10, cy: 18, w: 16, h: 14 },
  { id: "stripe", kind: "external", name: "Stripe API\n(3rd party)", cx: 10, cy: 72, w: 16, h: 14 },

  // Column 2 — internal services (centre, flowing top → bottom).
  { id: "web", kind: "service", name: "Web\nFrontend", cx: 32, cy: 18, w: 14, h: 12 },
  { id: "gw", kind: "service", name: "API\nGateway", cx: 32, cy: 44, w: 14, h: 12 },
  { id: "auth", kind: "service", name: "Auth", cx: 52, cy: 16, w: 12, h: 10 },
  { id: "order", kind: "service", name: "Order", cx: 52, cy: 34, w: 12, h: 10 },
  { id: "payment", kind: "service", name: "Payment", cx: 52, cy: 54, w: 12, h: 10 },
  { id: "shipping", kind: "service", name: "Shipping", cx: 52, cy: 74, w: 12, h: 10 },

  // Column 3 — data stores + outbound externals (right).
  { id: "pg", kind: "database", name: "Postgres", cx: 78, cy: 28, w: 14, h: 12 },
  { id: "redis", kind: "database", name: "Redis\ncache", cx: 78, cy: 44, w: 14, h: 12 },
  { id: "sqs", kind: "queue", name: "SQS queue", cx: 78, cy: 62, w: 14, h: 10 },
  { id: "fedex", kind: "external", name: "FedEx API", cx: 78, cy: 80, w: 14, h: 10 },
];

const EDGES: ReadonlyArray<Edge> = [
  { from: "user", to: "web", protocol: "HTTPS", data: "page views", shape: "h" },
  { from: "web", to: "gw", protocol: "HTTPS", data: "API calls", shape: "v" },
  { from: "gw", to: "auth", protocol: "gRPC", data: "auth tokens", shape: "hv" },
  { from: "gw", to: "order", protocol: "gRPC", data: "orders", shape: "hv" },
  { from: "gw", to: "payment", protocol: "gRPC", data: "payments", shape: "hv" },
  { from: "gw", to: "shipping", protocol: "gRPC", data: "shipments", shape: "hv" },
  { from: "order", to: "pg", protocol: "SQL", data: "orders", shape: "hv" },
  { from: "order", to: "redis", protocol: "cache", data: "sessions", shape: "h" },
  { from: "payment", to: "stripe", protocol: "HTTPS", data: "charges", shape: "hvh" },
  { from: "payment", to: "sqs", protocol: "AMQP", data: "async", shape: "hv" },
  { from: "sqs", to: "shipping", protocol: "AMQP", data: "async", shape: "vh" },
  { from: "shipping", to: "fedex", protocol: "HTTPS", data: "labels", shape: "hv" },
];

export function ArchitectureDiagram({ width, height }: Props) {
  const margin = { top: 22, right: 14, bottom: 14, left: 14 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(BOXES.map((b) => [b.id, b]));

  function rectOf(b: Box) {
    const w = px(b.w);
    const h = py(b.h);
    const x = px(b.cx) - w / 2;
    const y = py(b.cy) - h / 2;
    return { x, y, w, h, cx: x + w / 2, cy: y + h / 2 };
  }

  // Return an attach point on a box's edge closest to a given outward side.
  function attachOf(b: Box, side: "left" | "right" | "top" | "bottom") {
    const r = rectOf(b);
    if (side === "left") return { x: r.x, y: r.cy };
    if (side === "right") return { x: r.x + r.w, y: r.cy };
    if (side === "top") return { x: r.cx, y: r.y };
    return { x: r.cx, y: r.y + r.h };
  }

  // Resolve which edge sides an Edge enters/exits from its shape hint.
  function sidesFor(e: Edge): { from: "left" | "right" | "top" | "bottom"; to: "left" | "right" | "top" | "bottom" } {
    const from = byId.get(e.from)!;
    const to = byId.get(e.to)!;
    // Horizontal segment dominant → exit right, enter left (or reverse).
    const goingRight = to.cx > from.cx;
    const goingDown = to.cy > from.cy;
    if (e.shape === "h") {
      return { from: goingRight ? "right" : "left", to: goingRight ? "left" : "right" };
    }
    if (e.shape === "v") {
      return { from: goingDown ? "bottom" : "top", to: goingDown ? "top" : "bottom" };
    }
    if (e.shape === "hv") {
      // Exit sideways, enter top/bottom on the destination.
      return {
        from: goingRight ? "right" : "left",
        to: goingDown ? "top" : "bottom",
      };
    }
    if (e.shape === "vh") {
      return {
        from: goingDown ? "bottom" : "top",
        to: goingRight ? "left" : "right",
      };
    }
    // hvh — exit sideways, enter sideways (goes out, over, back in).
    return {
      from: goingRight ? "right" : "left",
      to: goingRight ? "left" : "right",
    };
  }

  // Build the polyline points for a Manhattan-routed edge.
  function routePath(e: Edge): { points: Array<{ x: number; y: number }>; midX: number; midY: number } {
    const from = byId.get(e.from)!;
    const to = byId.get(e.to)!;
    const sides = sidesFor(e);
    const a = attachOf(from, sides.from);
    const b = attachOf(to, sides.to);
    let points: Array<{ x: number; y: number }>;
    if (e.shape === "h" || e.shape === "v") {
      points = [a, b];
    } else if (e.shape === "hv") {
      // L-shape: horizontal first, then vertical.
      points = [a, { x: b.x, y: a.y }, b];
    } else if (e.shape === "vh") {
      // L-shape: vertical first, then horizontal.
      points = [a, { x: a.x, y: b.y }, b];
    } else {
      // Z-shape: horizontal, vertical (at midpoint), horizontal.
      const midX = (a.x + b.x) / 2;
      points = [a, { x: midX, y: a.y }, { x: midX, y: b.y }, b];
    }
    // Midpoint of the longest segment for label placement.
    let longest = { len: 0, mx: (a.x + b.x) / 2, my: (a.y + b.y) / 2 };
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const len = Math.abs(p2.x - p1.x) + Math.abs(p2.y - p1.y);
      if (len > longest.len) {
        longest = { len, mx: (p1.x + p2.x) / 2, my: (p1.y + p2.y) / 2 };
      }
    }
    return { points, midX: longest.mx, midY: longest.my };
  }

  // SVG path string from polyline points.
  function pointsToD(points: Array<{ x: number; y: number }>): string {
    return points
      .map((p, i) => (i === 0 ? `M ${p.x} ${p.y}` : `L ${p.x} ${p.y}`))
      .join(" ");
  }

  // Direction angle (degrees) of the final segment for the arrowhead.
  function finalAngle(points: Array<{ x: number; y: number }>): number {
    const p1 = points[points.length - 2];
    const p2 = points[points.length - 1];
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  }

  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.55;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.55;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  // Render a box with the correct shape vocabulary.
  function renderShape(b: Box) {
    const r = rectOf(b);
    if (b.kind === "service") {
      return (
        <rect
          key={`s-${b.id}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={4}
          ry={4}
          fill="var(--color-ink)"
          fillOpacity={0.14}
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
      );
    }
    if (b.kind === "external") {
      return (
        <rect
          key={`s-${b.id}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={4}
          ry={4}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
          strokeDasharray="4 3"
        />
      );
    }
    if (b.kind === "queue") {
      // Stadium / pill — fully rounded ends.
      const rx = r.h / 2;
      return (
        <rect
          key={`s-${b.id}`}
          x={r.x}
          y={r.y}
          width={r.w}
          height={r.h}
          rx={rx}
          ry={rx}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
      );
    }
    // Database — cylinder. Body rect + top ellipse + bottom ellipse (top arc).
    const ellipseRy = Math.min(5, r.h * 0.18);
    return (
      <g key={`s-${b.id}`}>
        {/* Body rectangle with side walls */}
        <rect
          x={r.x}
          y={r.y + ellipseRy}
          width={r.w}
          height={Math.max(0, r.h - 2 * ellipseRy)}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {/* Remove top+bottom of body by overdrawing with surface-colored vertical lines only.
            Easier: draw left + right side lines explicitly, then overlay ellipses. */}
        <line
          x1={r.x}
          y1={r.y + ellipseRy}
          x2={r.x}
          y2={r.y + r.h - ellipseRy}
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        <line
          x1={r.x + r.w}
          y1={r.y + ellipseRy}
          x2={r.x + r.w}
          y2={r.y + r.h - ellipseRy}
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {/* Top ellipse — full oval (gives the rim) */}
        <ellipse
          cx={r.cx}
          cy={r.y + ellipseRy}
          rx={r.w / 2}
          ry={ellipseRy}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
        {/* Bottom arc — visible front half only */}
        <path
          d={`M ${r.x} ${r.y + r.h - ellipseRy} A ${r.w / 2} ${ellipseRy} 0 0 0 ${r.x + r.w} ${r.y + r.h - ellipseRy}`}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.3}
        />
      </g>
    );
  }

  // Label text: two-line names use "\n" as the separator.
  function renderLabel(b: Box) {
    const r = rectOf(b);
    const lines = b.name.split("\n");
    const lineH = 11;
    const totalH = lines.length * lineH;
    const startY = r.cy - totalH / 2 + lineH * 0.75;
    // For cylinders, nudge label below the top rim so it doesn't collide.
    const yNudge = b.kind === "database" ? 2 : 0;
    return (
      <g key={`l-${b.id}`}>
        {lines.map((ln, i) => (
          <text
            key={`lbl-${b.id}-${i}`}
            x={r.cx}
            y={startY + i * lineH + yNudge}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9.5}
            fontWeight={b.kind === "service" ? 600 : 500}
            fill="var(--color-ink)"
          >
            {ln}
          </text>
        ))}
      </g>
    );
  }

  // Pre-compute every edge's geometry.
  const edgeGeoms = EDGES.map((e) => ({ e, g: routePath(e) }));

  // Representative geometries for anchors.
  const orderBox = byId.get("order")!;
  const orderRect = rectOf(orderBox);
  const pgBox = byId.get("pg")!;
  const pgRect = rectOf(pgBox);
  const sqsBox = byId.get("sqs")!;
  const sqsRect = rectOf(sqsBox);
  const stripeBox = byId.get("stripe")!;
  const stripeRect = rectOf(stripeBox);
  // The representative Manhattan-routed arrow is Gateway → Order (an L turn).
  const representativeEdge = edgeGeoms.find(
    (eg) => eg.e.from === "gw" && eg.e.to === "order",
  )!;
  // External-system boundary: the dashed frame around the "3rd-party" column.
  // We'll draw it subtly enclosing Stripe + FedEx so the anchor has something
  // to rest on.
  const externalFrame = {
    x: Math.max(0, px(2)),
    y: Math.max(0, py(62)),
    w: Math.min(iw, px(22)),
    h: Math.min(ih, py(28)),
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Architecture Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Column headings */}
        <g data-data-layer="true">
          <text
            x={px(10)}
            y={-8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ACTORS
          </text>
          <text
            x={px(42)}
            y={-8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            SERVICES
          </text>
          <text
            x={px(78)}
            y={-8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            STORES · EXTERNAL
          </text>
        </g>

        {/* External-system boundary — a dashed frame around 3rd-party actors.
            Drawn first so the Stripe/FedEx rectangles paint on top. */}
        <g data-data-layer="true">
          <rect
            x={externalFrame.x}
            y={externalFrame.y}
            width={externalFrame.w}
            height={externalFrame.h}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="5 4"
            opacity={0.55}
          />
          <text
            x={externalFrame.x + externalFrame.w / 2}
            y={externalFrame.y - 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            THIRD-PARTY BOUNDARY
          </text>
        </g>

        {/* Edges — drawn below shapes so the boxes occlude the line ends. */}
        <g data-data-layer="true">
          {edgeGeoms.map(({ e, g }, i) => {
            const ang = finalAngle(g.points);
            const tip = g.points[g.points.length - 1];
            // Pull the tip back a hair so it sits flush.
            const rad = (ang * Math.PI) / 180;
            const tipX = tip.x - Math.cos(rad) * 1.2;
            const tipY = tip.y - Math.sin(rad) * 1.2;
            // External edges (into a dashed/external box) get a dashed line.
            const to = byId.get(e.to)!;
            const dashed = to.kind === "external";
            return (
              <g key={`edge-${i}`}>
                <path
                  d={pointsToD(g.points)}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                  strokeDasharray={dashed ? "4 3" : undefined}
                  opacity={0.85}
                />
                <polygon
                  points={arrowHead(tipX, tipY, ang)}
                  fill="var(--color-ink)"
                  opacity={0.85}
                />
                {/* Protocol label above the midpoint; data label below. */}
                <text
                  x={g.midX}
                  y={g.midY - 3}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8.5}
                  fill="var(--color-ink)"
                >
                  {e.protocol}
                </text>
                <text
                  x={g.midX}
                  y={g.midY + 9}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {e.data}
                </text>
              </g>
            );
          })}
        </g>

        {/* Shapes — services, databases, queues, externals. */}
        <g data-data-layer="true">{BOXES.map((b) => renderShape(b))}</g>

        {/* Labels — on top of shapes. */}
        <g data-data-layer="true">{BOXES.map((b) => renderLabel(b))}</g>

        {/* ----- Anchors ----- */}

        {/* 1. service — the Order service rectangle (solid rounded rect). */}
        <ExplainAnchor
          selector="service"
          index={1}
          pin={{ x: orderRect.cx, y: Math.max(10, orderRect.y - 10) }}
          rect={{
            x: Math.max(0, orderRect.x),
            y: Math.max(0, orderRect.y),
            width: Math.min(iw, orderRect.w),
            height: Math.min(ih, orderRect.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. database — the Postgres cylinder. */}
        <ExplainAnchor
          selector="database"
          index={2}
          pin={{ x: Math.min(iw - 10, pgRect.x + pgRect.w + 10), y: pgRect.cy }}
          rect={{
            x: Math.max(0, pgRect.x),
            y: Math.max(0, pgRect.y),
            width: Math.min(iw, pgRect.w),
            height: Math.min(ih, pgRect.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. queue — the SQS stadium. */}
        <ExplainAnchor
          selector="queue"
          index={3}
          pin={{ x: Math.min(iw - 10, sqsRect.x + sqsRect.w + 10), y: sqsRect.cy }}
          rect={{
            x: Math.max(0, sqsRect.x),
            y: Math.max(0, sqsRect.y),
            width: Math.min(iw, sqsRect.w),
            height: Math.min(ih, sqsRect.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. external — the Stripe dashed-border rectangle. */}
        <ExplainAnchor
          selector="external"
          index={4}
          pin={{ x: stripeRect.cx, y: Math.max(10, stripeRect.y - 10) }}
          rect={{
            x: Math.max(0, stripeRect.x),
            y: Math.max(0, stripeRect.y),
            width: Math.min(iw, stripeRect.w),
            height: Math.min(ih, stripeRect.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. manhattan-arrow — a representative L-routed arrow with a
            protocol label (Gateway → Order, gRPC). */}
        <ExplainAnchor
          selector="manhattan-arrow"
          index={5}
          pin={{ x: representativeEdge.g.midX, y: representativeEdge.g.midY - 16 }}
          rect={{
            x: Math.max(
              0,
              Math.min(...representativeEdge.g.points.map((p) => p.x)) - 4,
            ),
            y: Math.max(
              0,
              Math.min(...representativeEdge.g.points.map((p) => p.y)) - 4,
            ),
            width: Math.max(
              16,
              Math.max(...representativeEdge.g.points.map((p) => p.x)) -
                Math.min(...representativeEdge.g.points.map((p) => p.x)) +
                8,
            ),
            height: Math.max(
              16,
              Math.max(...representativeEdge.g.points.map((p) => p.y)) -
                Math.min(...representativeEdge.g.points.map((p) => p.y)) +
                8,
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. protocol-label — pick the Gateway→Order edge midpoint label
            (gRPC / orders). Anchor lives over the label text itself. */}
        <ExplainAnchor
          selector="protocol-label"
          index={6}
          pin={{ x: representativeEdge.g.midX, y: representativeEdge.g.midY + 24 }}
          rect={{
            x: Math.max(0, representativeEdge.g.midX - 28),
            y: Math.max(0, representativeEdge.g.midY - 10),
            width: 56,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. external-boundary — the dashed frame around Stripe / FedEx. */}
        <ExplainAnchor
          selector="external-boundary"
          index={7}
          pin={{
            x: externalFrame.x + externalFrame.w - 12,
            y: Math.max(8, externalFrame.y - 10),
          }}
          rect={{
            x: externalFrame.x,
            y: Math.max(0, externalFrame.y - 12),
            width: externalFrame.w,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
