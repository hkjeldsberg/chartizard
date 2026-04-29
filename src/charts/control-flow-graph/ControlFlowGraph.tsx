"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Allen/IBM 1970 CFG. Nodes are:
//   - entry / exit  : small ovals
//   - basic-block   : rectangle with monospace multi-line content
//                     (first statement + ellipsis + last statement — the
//                     abbreviation every compiler text uses when the block
//                     holds more than two statements)
//   - conditional   : diamond with a predicate
// Edges are directed. Conditional edges carry T/F labels. One edge is a
// back-edge (the loop) and is routed around the forward flow on the left
// side so it never crosses a forward arrow.

type NodeKind = "entry" | "exit" | "block" | "cond";

interface NodeSpec {
  id: string;
  kind: NodeKind;
  // Centre in layout space (0..100 × 0..100).
  cx: number;
  cy: number;
  // Size in layout space.
  w: number;
  h: number;
  // For blocks, two lines of code plus an ellipsis between them. For
  // conditionals, a single predicate. For entry/exit, a single word.
  line1?: string;
  line2?: string;
  label?: string;
}

interface EdgeSpec {
  from: string;
  to: string;
  // T/F label on a conditional's outgoing edge.
  branch?: "T" | "F";
  // Routing strategy. "straight" draws a single segment. "elbow-l" elbows
  // left-then-down/up. "elbow-r" elbows right-then-down/up. "back" is the
  // curved back-edge that routes around the forward flow (hand-drawn path).
  route?: "straight" | "elbow-l" | "elbow-r" | "back";
}

const NODES: ReadonlyArray<NodeSpec> = [
  { id: "entry", kind: "entry", cx: 50, cy: 5, w: 18, h: 7, label: "entry" },
  {
    id: "block1",
    kind: "block",
    cx: 50,
    cy: 18,
    w: 34,
    h: 12,
    line1: "x = 0",
    line2: "...",
  },
  {
    id: "cond1",
    kind: "cond",
    cx: 50,
    cy: 38,
    w: 26,
    h: 14,
    label: "x < n?",
  },
  {
    id: "block2",
    kind: "block",
    cx: 50,
    cy: 56,
    w: 34,
    h: 12,
    line1: "y = f(x)",
    line2: "...",
  },
  {
    id: "cond2",
    kind: "cond",
    cx: 50,
    cy: 72,
    w: 26,
    h: 14,
    label: "y > 0?",
  },
  {
    id: "block3",
    kind: "block",
    cx: 28,
    cy: 86,
    w: 28,
    h: 10,
    line1: "x += 1",
    line2: "...",
  },
  {
    id: "block4",
    kind: "block",
    cx: 76,
    cy: 86,
    w: 30,
    h: 10,
    line1: "handle_error()",
    line2: "...",
  },
  { id: "exit", kind: "exit", cx: 50, cy: 97, w: 16, h: 6, label: "exit" },
];

const EDGES: ReadonlyArray<EdgeSpec> = [
  { from: "entry", to: "block1", route: "straight" },
  { from: "block1", to: "cond1", route: "straight" },
  { from: "cond1", to: "block2", branch: "T", route: "straight" },
  { from: "cond1", to: "exit", branch: "F", route: "elbow-r" },
  { from: "block2", to: "cond2", route: "straight" },
  { from: "cond2", to: "block3", branch: "T", route: "elbow-l" },
  { from: "cond2", to: "block4", branch: "F", route: "elbow-r" },
  // Back-edge: block3 → cond1. Routed around the left side of the graph so
  // it does NOT cross any forward edge. Loops in a CFG are exactly this
  // pattern — a back-edge into a dominator.
  { from: "block3", to: "cond1", route: "back" },
  { from: "block4", to: "exit", route: "elbow-l" },
];

export function ControlFlowGraph({ width, height }: Props) {
  const margin = { top: 22, right: 28, bottom: 32, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // Perimeter anchor for a node given a direction vector. Treats blocks as
  // rectangles and conditions as diamonds.
  function anchor(n: NodeSpec, towards: { x: number; y: number }) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const w = px(n.w);
    const h = py(n.h);
    const dx = towards.x - cx;
    const dy = towards.y - cy;

    if (n.kind === "cond") {
      // Diamond: project onto the rhombus. For simplicity, pick the nearest
      // of the 4 vertex directions by sign of dx/dy.
      if (Math.abs(dy) >= Math.abs(dx)) {
        // top or bottom vertex
        const sign = dy >= 0 ? 1 : -1;
        return { x: cx, y: cy + (sign * h) / 2 };
      }
      const sign = dx >= 0 ? 1 : -1;
      return { x: cx + (sign * w) / 2, y: cy };
    }
    // Rectangle / oval bounding box.
    if (Math.abs(dy) * w >= Math.abs(dx) * h) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: cx, y: cy + (sign * h) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: cx + (sign * w) / 2, y: cy };
  }

  interface EdgeGeom {
    d: string;
    tipX: number;
    tipY: number;
    tipAngle: number;
    labelX: number;
    labelY: number;
  }

  function edgeGeom(e: EdgeSpec): EdgeGeom {
    const from = nodeById.get(e.from)!;
    const to = nodeById.get(e.to)!;
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const a = anchor(from, toCentre);
    const b = anchor(to, fromCentre);

    if (e.route === "back") {
      // Back-edge: start at block3's left side, curve out to the far-left
      // margin, climb past the forward flow, and re-enter cond1 from the
      // left. Uses a cubic Bezier with control points far to the left of
      // both nodes so the curve hugs the left gutter.
      const startX = px(from.cx) - px(from.w) / 2;
      const startY = py(from.cy);
      const endX = px(to.cx) - px(to.w) / 2;
      const endY = py(to.cy);
      const gutterX = Math.max(8, Math.min(startX, endX) - 34);
      const d = `M ${startX} ${startY} C ${gutterX} ${startY}, ${gutterX} ${endY}, ${endX} ${endY}`;
      // Tangent at t=1 on a cubic B(t) = (1-t)^3 P0 + 3(1-t)^2 t P1 + 3(1-t) t^2 P2 + t^3 P3
      // B'(1) = 3(P3 - P2). P2 = (gutterX, endY); P3 = (endX, endY). So tangent is (endX - gutterX, 0) → 0°.
      const tipAngle = 0;
      // Label midway along the gutter, slightly offset further left.
      const labelX = Math.max(6, gutterX - 8);
      const labelY = (startY + endY) / 2;
      return { d, tipX: endX, tipY: endY, tipAngle, labelX, labelY };
    }

    if (e.route === "elbow-l") {
      // Leave from the bottom (or top) of the source, then elbow left to the
      // target's top/bottom. Used for cond2 → block3 and block4 → exit.
      const d = `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
      // Tip enters horizontally if we arrived via the horizontal leg.
      const horiz = Math.abs(b.x - a.x) > 1;
      const tipAngle = horiz ? (b.x > a.x ? 0 : 180) : b.y > a.y ? 90 : -90;
      return {
        d,
        tipX: b.x,
        tipY: b.y,
        tipAngle,
        labelX: (a.x + b.x) / 2,
        labelY: a.y - 6,
      };
    }
    if (e.route === "elbow-r") {
      // Same as elbow-l but places the label on the opposite side.
      const d = `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
      const horiz = Math.abs(b.x - a.x) > 1;
      const tipAngle = horiz ? (b.x > a.x ? 0 : 180) : b.y > a.y ? 90 : -90;
      return {
        d,
        tipX: b.x,
        tipY: b.y,
        tipAngle,
        labelX: (a.x + b.x) / 2,
        labelY: a.y - 6,
      };
    }
    // Straight segment.
    const tipAngle = (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;
    return {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      tipX: b.x,
      tipY: b.y,
      tipAngle,
      labelX: (a.x + b.x) / 2 + 6,
      labelY: (a.y + b.y) / 2 + 3,
    };
  }

  const edgeGeoms = EDGES.map((e) => ({ e, g: edgeGeom(e) }));

  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.55;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.55;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  function renderShape(n: NodeSpec) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const w = px(n.w);
    const h = py(n.h);
    const x = cx - w / 2;
    const y = cy - h / 2;

    if (n.kind === "entry" || n.kind === "exit") {
      return (
        <rect
          key={`s-${n.id}`}
          x={x}
          y={y}
          width={w}
          height={h}
          rx={h / 2}
          ry={h / 2}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
      );
    }
    if (n.kind === "block") {
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
    // Diamond.
    const points = `${cx},${y} ${x + w},${cy} ${cx},${y + h} ${x},${cy}`;
    return (
      <polygon
        key={`s-${n.id}`}
        points={points}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
    );
  }

  function renderLabel(n: NodeSpec) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    if (n.kind === "entry" || n.kind === "exit") {
      return (
        <text
          key={`l-${n.id}`}
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-soft)"
        >
          {n.label}
        </text>
      );
    }
    if (n.kind === "cond") {
      return (
        <text
          key={`l-${n.id}`}
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          fill="var(--color-ink)"
        >
          {n.label}
        </text>
      );
    }
    // Basic block — two monospace lines (first statement, ellipsis/last).
    return (
      <g key={`l-${n.id}`}>
        <text
          x={cx}
          y={cy - 2}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          fill="var(--color-ink)"
        >
          {n.line1}
        </text>
        <text
          x={cx}
          y={cy + 10}
          textAnchor="middle"
          fontFamily="monospace"
          fontSize={10}
          fill="var(--color-ink-soft)"
        >
          {n.line2}
        </text>
      </g>
    );
  }

  // Resolve representative anchor targets.
  const entryNode = nodeById.get("entry")!;
  const blockNode = nodeById.get("block1")!;
  const condNode = nodeById.get("cond1")!;
  const exitNode = nodeById.get("exit")!;
  const tEdge = edgeGeoms.find((eg) => eg.e.from === "cond1" && eg.e.to === "block2")!; // T label
  const backEdge = edgeGeoms.find((eg) => eg.e.from === "block3" && eg.e.to === "cond1")!;

  // Cyclomatic-complexity readout: E − N + 2 for a connected CFG.
  const complexity = EDGES.length - NODES.length + 2;
  const readoutX = Math.max(0, iw - 112);
  const readoutY = Math.max(0, ih - 4);

  return (
    <svg width={width} height={height} role="img" aria-label="Control Flow Graph">
      <Group left={margin.left} top={margin.top}>
        {/* Edges first so nodes paint on top. */}
        <g data-data-layer="true">
          {edgeGeoms.map(({ e, g }, i) => {
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.5;
            const tipY = g.tipY - Math.sin(rad) * 1.5;
            const isBack = e.route === "back";
            return (
              <g key={`edge-${i}`}>
                <path
                  d={g.d}
                  fill="none"
                  stroke={isBack ? "var(--color-ink-mute)" : "var(--color-ink)"}
                  strokeWidth={1.2}
                  strokeDasharray={isBack ? "4 3" : undefined}
                  opacity={isBack ? 0.85 : 0.92}
                />
                <polygon
                  points={arrowHead(tipX, tipY, g.tipAngle)}
                  fill={isBack ? "var(--color-ink-mute)" : "var(--color-ink)"}
                  opacity={isBack ? 0.85 : 0.92}
                />
                {e.branch && (
                  <text
                    x={g.labelX}
                    y={g.labelY}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink-soft)"
                  >
                    {e.branch}
                  </text>
                )}
                {isBack && (
                  <text
                    x={g.labelX}
                    y={g.labelY}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-mute)"
                  >
                    loop
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">{NODES.map((n) => renderShape(n))}</g>

        {/* Labels */}
        <g data-data-layer="true">{NODES.map((n) => renderLabel(n))}</g>

        {/* Cyclomatic-complexity readout (bottom-right). E − N + 2 is McCabe's
            formula; rendering it inline lets the CFG carry its own metric. */}
        <g data-data-layer="true">
          <text
            x={readoutX}
            y={readoutY}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {`E=${EDGES.length}  N=${NODES.length}  M=E−N+2=${complexity}`}
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. entry-node (oval) */}
        <ExplainAnchor
          selector="entry-node"
          index={1}
          pin={{
            x: px(entryNode.cx) + px(entryNode.w) / 2 + 14,
            y: py(entryNode.cy),
          }}
          rect={{
            x: Math.max(0, px(entryNode.cx) - px(entryNode.w) / 2),
            y: Math.max(0, py(entryNode.cy) - py(entryNode.h) / 2),
            width: Math.min(iw, px(entryNode.w)),
            height: Math.min(ih, py(entryNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. basic-block (rectangle with code) */}
        <ExplainAnchor
          selector="basic-block"
          index={2}
          pin={{
            x: Math.max(6, px(blockNode.cx) - px(blockNode.w) / 2 - 14),
            y: py(blockNode.cy),
          }}
          rect={{
            x: Math.max(0, px(blockNode.cx) - px(blockNode.w) / 2),
            y: Math.max(0, py(blockNode.cy) - py(blockNode.h) / 2),
            width: Math.min(iw, px(blockNode.w)),
            height: Math.min(ih, py(blockNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. conditional (diamond) */}
        <ExplainAnchor
          selector="conditional"
          index={3}
          pin={{
            x: Math.max(6, px(condNode.cx) - px(condNode.w) / 2 - 14),
            y: py(condNode.cy),
          }}
          rect={{
            x: Math.max(0, px(condNode.cx) - px(condNode.w) / 2),
            y: Math.max(0, py(condNode.cy) - py(condNode.h) / 2),
            width: Math.min(iw, px(condNode.w)),
            height: Math.min(ih, py(condNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. tf-label (T on cond1 → block2) */}
        <ExplainAnchor
          selector="tf-label"
          index={4}
          pin={{ x: Math.min(iw - 6, tEdge.g.labelX + 18), y: tEdge.g.labelY + 2 }}
          rect={{
            x: Math.max(0, Math.min(iw - 8, tEdge.g.labelX - 8)),
            y: Math.max(0, tEdge.g.labelY - 10),
            width: 24,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. back-edge (loop) — route lives in the left gutter */}
        <ExplainAnchor
          selector="back-edge"
          index={5}
          pin={{ x: Math.max(8, backEdge.g.labelX - 10), y: backEdge.g.labelY }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(py(condNode.cy), py(nodeById.get("block3")!.cy)) - 4),
            width: Math.max(
              8,
              Math.min(iw, px(nodeById.get("block3")!.cx) - px(nodeById.get("block3")!.w) / 2),
            ),
            height: Math.max(
              8,
              Math.abs(py(nodeById.get("block3")!.cy) - py(condNode.cy)) + 8,
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. exit-node (oval) */}
        <ExplainAnchor
          selector="exit-node"
          index={6}
          pin={{
            x: px(exitNode.cx) + px(exitNode.w) / 2 + 14,
            y: py(exitNode.cy),
          }}
          rect={{
            x: Math.max(0, px(exitNode.cx) - px(exitNode.w) / 2),
            y: Math.max(0, py(exitNode.cy) - py(exitNode.h) / 2),
            width: Math.min(iw, px(exitNode.w)),
            height: Math.min(ih, py(exitNode.h)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. cyclomatic-complexity (bottom-right readout) */}
        <ExplainAnchor
          selector="cyclomatic-complexity"
          index={7}
          pin={{ x: Math.min(iw - 6, readoutX - 10), y: readoutY - 2 }}
          rect={{
            x: Math.max(0, readoutX - 6),
            y: Math.max(0, readoutY - 12),
            width: Math.min(iw - Math.max(0, readoutX - 6), 150),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
