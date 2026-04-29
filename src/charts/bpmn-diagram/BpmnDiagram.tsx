"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Element kinds modelled here. BPMN 2.0 has many more — this subset is
// sufficient for the expense-approval narrative and for the anchors.
type NodeKind =
  | "start"             // thin-stroke circle
  | "intermediate"      // double-stroke circle (timer glyph inside)
  | "end"               // thick-stroke circle
  | "activity"          // rounded rectangle (user task)
  | "gateway-exclusive" // diamond with × glyph
  | "gateway-parallel"; // diamond with + glyph (unused in this process but
                        //  reserved — rendered only if referenced by NODES)

interface Node {
  id: string;
  kind: NodeKind;
  // Layout in 0..100 × 0..100 space. Converted to pixel coords by px/py.
  lx: number;
  ly: number;
  label?: string; // centred below (activity) or just below (events/gateways)
  subLabel?: string; // secondary text under label (gateway question)
}

// Expense approval: Submit → amount<$500? → Auto-Approve (top) OR
// Manager Review (bottom, with timer escalation) → merge → Record → End.
const NODES: ReadonlyArray<Node> = [
  { id: "start",    kind: "start",              lx: 6,  ly: 50, label: "Expense submitted" },
  { id: "submit",   kind: "activity",           lx: 20, ly: 50, label: "Submit Expense" },
  { id: "g-split",  kind: "gateway-exclusive",  lx: 36, ly: 50, label: "amount < $500?" },
  { id: "auto",     kind: "activity",           lx: 54, ly: 22, label: "Auto-Approve" },
  { id: "review",   kind: "activity",           lx: 54, ly: 78, label: "Manager Review" },
  { id: "timer",    kind: "intermediate",       lx: 66, ly: 78, label: "3-day escalation" },
  { id: "g-merge",  kind: "gateway-exclusive",  lx: 72, ly: 50 },
  { id: "record",   kind: "activity",           lx: 85, ly: 50, label: "Record in Ledger" },
  { id: "end",      kind: "end",                lx: 96, ly: 50, label: "Booked" },
];

interface Flow {
  from: string;
  to: string;
  // optional side labels (e.g. yes/no on a gateway branch)
  label?: string;
  // elbow routing preference — auto by default; "vertical-first" makes the
  // flow go vertically before horizontally (for branches off a gateway).
  route?: "straight" | "h-v-h" | "v-h";
}

const FLOWS: ReadonlyArray<Flow> = [
  { from: "start",   to: "submit",  route: "straight" },
  { from: "submit",  to: "g-split", route: "straight" },
  { from: "g-split", to: "auto",    route: "h-v-h", label: "yes" },
  { from: "g-split", to: "review",  route: "h-v-h", label: "no" },
  { from: "review",  to: "timer",   route: "straight" },
  { from: "timer",   to: "g-merge", route: "h-v-h" },
  { from: "auto",    to: "g-merge", route: "h-v-h" },
  { from: "g-merge", to: "record",  route: "straight" },
  { from: "record",  to: "end",     route: "straight" },
];

export function BpmnDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 24, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Pool spans the full plot area — single-pool diagram. The header strip
  // (where "Accounting" is written) is on the left edge.
  const poolHeaderW = Math.max(22, Math.min(iw * 0.06, 32));
  const poolX = 0;
  const poolY = 0;
  const poolW = iw;
  const poolH = ih;
  // Interior (where nodes live) is the pool minus the left header strip.
  const inX = poolX + poolHeaderW;
  const inY = poolY;
  const inW = poolW - poolHeaderW;
  const inH = poolH;

  const px = (lx: number) => inX + (lx / 100) * inW;
  const py = (ly: number) => inY + (ly / 100) * inH;

  // Sizing.
  const eventR = Math.max(8, Math.min(inW * 0.022, 13));
  const gateR = Math.max(10, Math.min(inW * 0.028, 16));
  const actW = Math.max(50, Math.min(inW * 0.13, 88));
  const actH = Math.max(22, Math.min(inH * 0.16, 34));

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // For routing we need the "anchor on edge" given a direction. Events and
  // gateways are radial; activities are rectangular.
  function edgePoint(n: Node, toward: { x: number; y: number }): { x: number; y: number } {
    const cx = px(n.lx);
    const cy = py(n.ly);
    const dx = toward.x - cx;
    const dy = toward.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    if (n.kind === "activity") {
      // clip ray to rectangle
      const hw = actW / 2;
      const hh = actH / 2;
      const tx = hw / Math.abs(dx || 1e-6);
      const ty = hh / Math.abs(dy || 1e-6);
      const t = Math.min(tx, ty);
      return { x: cx + dx * t, y: cy + dy * t };
    }
    if (n.kind === "gateway-exclusive" || n.kind === "gateway-parallel") {
      // diamond: |x|/r + |y|/r = 1  → t = 1 / (|dx|/r + |dy|/r) * len
      const r = gateR;
      const t = 1 / (Math.abs(dx) / r + Math.abs(dy) / r + 1e-9);
      return { x: cx + dx * t, y: cy + dy * t };
    }
    // event circles
    return { x: cx + (dx / len) * eventR, y: cy + (dy / len) * eventR };
  }

  function flowPath(f: Flow) {
    const from = nodeById.get(f.from)!;
    const to = nodeById.get(f.to)!;
    const fromCentre = { x: px(from.lx), y: py(from.ly) };
    const toCentre = { x: px(to.lx), y: py(to.ly) };
    const s = edgePoint(from, toCentre);
    const t = edgePoint(to, fromCentre);

    if (f.route === "straight" || Math.abs(s.y - t.y) < 1) {
      return {
        d: `M ${s.x} ${s.y} L ${t.x} ${t.y}`,
        tip: t,
        tipAngle: Math.atan2(t.y - s.y, t.x - s.x),
        midX: (s.x + t.x) / 2,
        midY: (s.y + t.y) / 2,
      };
    }
    // h-v-h elbow
    const midX = (fromCentre.x + toCentre.x) / 2;
    const d = `M ${s.x} ${s.y} L ${midX} ${s.y} L ${midX} ${t.y} L ${t.x} ${t.y}`;
    return {
      d,
      tip: t,
      // arrives horizontally
      tipAngle: t.x > fromCentre.x ? 0 : Math.PI,
      midX,
      midY: (s.y + t.y) / 2,
    };
  }

  const flowGeom = FLOWS.map((f) => ({ flow: f, ...flowPath(f) }));

  // Anchor targets.
  const poolLabelY = py(50);
  const startNode = nodeById.get("start")!;
  const activityNode = nodeById.get("submit")!;
  const gatewayNode = nodeById.get("g-split")!;
  const intermediateNode = nodeById.get("timer")!;
  const endNode = nodeById.get("end")!;
  const yesFlow = flowGeom.find((g) => g.flow.from === "submit" && g.flow.to === "g-split")!;

  return (
    <svg width={width} height={height} role="img" aria-label="BPMN diagram">
      <defs>
        {/* Sequence-flow arrowhead: solid filled triangle at line tip. */}
        <marker
          id="bpmn-seq-arrow"
          viewBox="0 0 10 10"
          refX="9"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Pool border */}
          <rect
            x={poolX}
            y={poolY}
            width={poolW}
            height={poolH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          {/* Pool header strip (left edge) */}
          <rect
            x={poolX}
            y={poolY}
            width={poolHeaderW}
            height={poolH}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={poolX + poolHeaderW / 2}
            y={poolLabelY}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
            transform={`rotate(-90, ${poolX + poolHeaderW / 2}, ${poolLabelY})`}
          >
            ACCOUNTING
          </text>
        </g>

        {/* Sequence flows (under nodes) */}
        <g data-data-layer="true">
          {flowGeom.map((g, i) => (
            <g key={`flow-${i}`}>
              <path
                d={g.d}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.1}
                markerEnd="url(#bpmn-seq-arrow)"
              />
              {g.flow.label && (
                <text
                  x={g.midX + 6}
                  y={g.midY - 4}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {g.flow.label}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => {
            const cx = px(n.lx);
            const cy = py(n.ly);
            if (n.kind === "start" || n.kind === "end" || n.kind === "intermediate") {
              const strokeW =
                n.kind === "end" ? 2.6 : n.kind === "start" ? 1 : 1;
              return (
                <g key={`n-${n.id}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={eventR}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={strokeW}
                  />
                  {/* Intermediate event: double border — draw an inner ring. */}
                  {n.kind === "intermediate" && (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={eventR - 3}
                      fill="none"
                      stroke="var(--color-ink)"
                      strokeWidth={1}
                    />
                  )}
                  {/* Timer glyph inside the intermediate event — a clock face. */}
                  {n.kind === "intermediate" && (
                    <g stroke="var(--color-ink)" strokeWidth={0.8} fill="none">
                      <line x1={cx} y1={cy} x2={cx} y2={cy - (eventR - 5)} />
                      <line x1={cx} y1={cy} x2={cx + (eventR - 6)} y2={cy} />
                    </g>
                  )}
                  {n.label && (
                    <text
                      x={cx}
                      y={cy + eventR + 10}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={9}
                      fill="var(--color-ink-soft)"
                    >
                      {n.label}
                    </text>
                  )}
                </g>
              );
            }
            if (n.kind === "activity") {
              return (
                <g key={`n-${n.id}`}>
                  <rect
                    x={cx - actW / 2}
                    y={cy - actH / 2}
                    width={actW}
                    height={actH}
                    rx={6}
                    ry={6}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1.2}
                  />
                  {/* Task-type icon — user-task figure, top-left. */}
                  <g
                    transform={`translate(${cx - actW / 2 + 4}, ${cy - actH / 2 + 4})`}
                    stroke="var(--color-ink)"
                    strokeWidth={0.9}
                    fill="none"
                  >
                    <circle cx={3} cy={3} r={2} />
                    <path d="M 0 9 C 0 5.5, 6 5.5, 6 9" />
                  </g>
                  <text
                    x={cx}
                    y={cy + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={9.5}
                    fill="var(--color-ink)"
                  >
                    {n.label}
                  </text>
                </g>
              );
            }
            // gateway (diamond)
            const glyph = n.kind === "gateway-parallel" ? "+" : "×";
            return (
              <g key={`n-${n.id}`}>
                <polygon
                  points={`${cx},${cy - gateR} ${cx + gateR},${cy} ${cx},${cy + gateR} ${cx - gateR},${cy}`}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={14}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {glyph}
                </text>
                {n.label && (
                  <text
                    x={cx}
                    y={cy + gateR + 11}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {n.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Anchors (6). All render unconditionally. */}

        {/* 1. Pool / swimlane header */}
        <ExplainAnchor
          selector="pool"
          index={1}
          pin={{ x: poolX + poolHeaderW + 10, y: 10 }}
          rect={{
            x: poolX,
            y: poolY,
            width: poolHeaderW,
            height: poolH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Start event */}
        <ExplainAnchor
          selector="start-event"
          index={2}
          pin={{ x: px(startNode.lx), y: py(startNode.ly) - eventR - 14 }}
          rect={{
            x: px(startNode.lx) - eventR - 2,
            y: py(startNode.ly) - eventR - 2,
            width: eventR * 2 + 4,
            height: eventR * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Activity (Submit Expense) */}
        <ExplainAnchor
          selector="activity"
          index={3}
          pin={{ x: px(activityNode.lx), y: py(activityNode.ly) - actH / 2 - 12 }}
          rect={{
            x: px(activityNode.lx) - actW / 2,
            y: py(activityNode.ly) - actH / 2,
            width: actW,
            height: actH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Exclusive gateway */}
        <ExplainAnchor
          selector="exclusive-gateway"
          index={4}
          pin={{ x: px(gatewayNode.lx), y: py(gatewayNode.ly) - gateR - 12 }}
          rect={{
            x: px(gatewayNode.lx) - gateR - 2,
            y: py(gatewayNode.ly) - gateR - 2,
            width: gateR * 2 + 4,
            height: gateR * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Intermediate (timer) event */}
        <ExplainAnchor
          selector="intermediate-event"
          index={5}
          pin={{ x: px(intermediateNode.lx), y: py(intermediateNode.ly) + eventR + 22 }}
          rect={{
            x: px(intermediateNode.lx) - eventR - 2,
            y: py(intermediateNode.ly) - eventR - 2,
            width: eventR * 2 + 4,
            height: eventR * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. End event */}
        <ExplainAnchor
          selector="end-event"
          index={6}
          pin={{ x: px(endNode.lx), y: py(endNode.ly) - eventR - 14 }}
          rect={{
            x: px(endNode.lx) - eventR - 2,
            y: py(endNode.ly) - eventR - 2,
            width: eventR * 2 + 4,
            height: eventR * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Sequence flow — the solid-line directed arrow */}
        <ExplainAnchor
          selector="sequence-flow"
          index={7}
          pin={{ x: yesFlow.midX, y: yesFlow.midY - 12 }}
          rect={{
            x: Math.max(0, yesFlow.midX - 12),
            y: Math.max(0, yesFlow.midY - 6),
            width: 24,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
