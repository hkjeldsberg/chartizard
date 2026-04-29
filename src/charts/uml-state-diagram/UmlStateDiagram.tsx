"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Harel-style statechart. Same underlying FSM semantics for flat regions, but
// with the hierarchy extension: a composite state contains sub-states and
// entire sub-machines execute inside its boundary.
type StateKind = "simple" | "composite" | "sub";

interface StateSpec {
  id: string;
  label: string;
  kind: StateKind;
  // Layout-space centre (0..100 × 0..100).
  cx: number;
  cy: number;
  // Composite states: larger boundary sized in layout-space.
  compositeW?: number;
  compositeH?: number;
}

interface Transition {
  from: string;
  to: string;
  // UML form: event [guard] / action. Any of the three may be omitted.
  label: string;
  route?: "straight" | "elbow-v" | "elbow-h";
  selfLoop?: boolean;
}

// Order-lifecycle statechart. "Processing" is a composite state containing
// the sub-machine Picking → Packing — the Harel extension over a flat FSM.
const STATES: ReadonlyArray<StateSpec> = [
  { id: "draft", label: "Draft", kind: "simple", cx: 20, cy: 14 },
  { id: "submitted", label: "Submitted", kind: "simple", cx: 48, cy: 14 },
  { id: "approved", label: "Approved", kind: "simple", cx: 76, cy: 14 },
  { id: "rejected", label: "Rejected", kind: "simple", cx: 76, cy: 36 },
  // Composite "Processing" — enlarged rounded-rectangle whose boundary
  // visually contains Picking and Packing.
  {
    id: "processing",
    label: "Processing",
    kind: "composite",
    cx: 36,
    cy: 66,
    compositeW: 58,
    compositeH: 28,
  },
  { id: "picking", label: "Picking", kind: "sub", cx: 22, cy: 68 },
  { id: "packing", label: "Packing", kind: "sub", cx: 50, cy: 68 },
  { id: "shipped", label: "Shipped", kind: "simple", cx: 84, cy: 66 },
  { id: "delivered", label: "Delivered", kind: "simple", cx: 84, cy: 92 },
];

const TRANSITIONS: ReadonlyArray<Transition> = [
  { from: "draft", to: "draft", label: "edit / save", selfLoop: true },
  { from: "draft", to: "submitted", label: "submit", route: "straight" },
  { from: "submitted", to: "approved", label: "approve [credit_ok]", route: "straight" },
  { from: "submitted", to: "rejected", label: "reject", route: "elbow-v" },
  { from: "approved", to: "processing", label: "start / queue", route: "elbow-v" },
  // Sub-state → sub-state (inside the composite).
  { from: "picking", to: "packing", label: "picked", route: "straight" },
  { from: "processing", to: "shipped", label: "dispatched", route: "straight" },
  { from: "shipped", to: "delivered", label: "delivered", route: "straight" },
];

// Simple-state node size in layout-space.
const STATE_W = 22;
const STATE_H = 10;
// Sub-state (smaller, fits inside the composite).
const SUB_W = 20;
const SUB_H = 9;
// Rounded corner radius (px).
const RADIUS_PX = 8;

export function UmlStateDiagram({ width, height }: Props) {
  const margin = { top: 18, right: 22, bottom: 18, left: 36 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(STATES.map((s) => [s.id, s]));

  interface Box {
    x: number;
    y: number;
    w: number;
    h: number;
    cx: number;
    cy: number;
  }

  function boxOf(s: StateSpec): Box {
    const cx = px(s.cx);
    const cy = py(s.cy);
    if (s.kind === "composite") {
      const w = px(s.compositeW ?? 55);
      const h = py(s.compositeH ?? 28);
      return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
    }
    if (s.kind === "sub") {
      const w = px(SUB_W);
      const h = py(SUB_H);
      return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
    }
    const w = px(STATE_W);
    const h = py(STATE_H);
    return { x: cx - w / 2, y: cy - h / 2, w, h, cx, cy };
  }

  // Perimeter anchor for rounded rectangles — approximated as rectangle.
  function anchorOf(s: StateSpec, towards: { x: number; y: number }) {
    const b = boxOf(s);
    const dx = towards.x - b.cx;
    const dy = towards.y - b.cy;
    if (Math.abs(dy) * b.w >= Math.abs(dx) * b.h) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: b.cx, y: b.cy + (sign * b.h) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: b.cx + (sign * b.w) / 2, y: b.cy };
  }

  interface EdgeGeom {
    d: string;
    tipX: number;
    tipY: number;
    tipAngle: number;
    labelX: number;
    labelY: number;
  }

  function edgeGeom(t: Transition): EdgeGeom {
    const from = byId.get(t.from)!;
    const to = byId.get(t.to)!;
    if (t.selfLoop) {
      // Curved self-loop: leaves the top-left of the state, re-enters the
      // top-right — two distinct tangent angles so it reads as a loop, not a
      // circle tangent to a single point.
      const b = boxOf(from);
      const leftX = b.cx - b.w * 0.22;
      const rightX = b.cx + b.w * 0.22;
      const topY = b.y;
      const controlX = b.cx;
      const controlY = topY - 22;
      return {
        d: `M ${leftX} ${topY} Q ${controlX} ${controlY} ${rightX} ${topY}`,
        tipX: rightX,
        tipY: topY,
        tipAngle: 90, // arrow points down into the state edge
        labelX: controlX,
        labelY: controlY + 2,
      };
    }
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const a = anchorOf(from, toC);
    const b = anchorOf(to, fromC);
    if (t.route === "elbow-v") {
      return {
        d: `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`,
        tipX: b.x,
        tipY: b.y,
        tipAngle: b.x >= a.x ? 0 : 180,
        labelX: (a.x + b.x) / 2,
        labelY: b.y - 4,
      };
    }
    if (t.route === "elbow-h") {
      return {
        d: `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`,
        tipX: b.x,
        tipY: b.y,
        tipAngle: b.y >= a.y ? 90 : -90,
        labelX: b.x + 4,
        labelY: (a.y + b.y) / 2,
      };
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    return {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      tipX: b.x,
      tipY: b.y,
      tipAngle: (Math.atan2(dy, dx) * 180) / Math.PI,
      labelX: (a.x + b.x) / 2,
      labelY: (a.y + b.y) / 2 - 6,
    };
  }

  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.5;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.5;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  function renderState(s: StateSpec) {
    const b = boxOf(s);
    if (s.kind === "composite") {
      // Boundary + small "name tab" rounded-rect at the top-left holding the
      // composite's label, per UML 2.0 statechart notation.
      const tabW = 58;
      const tabH = 16;
      return (
        <g key={s.id}>
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx={RADIUS_PX + 4}
            ry={RADIUS_PX + 4}
            fill="var(--color-ink)"
            fillOpacity={0.02}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          {/* name tab */}
          <rect
            x={b.x + 6}
            y={b.y - tabH / 2}
            width={tabW}
            height={tabH}
            rx={RADIUS_PX}
            ry={RADIUS_PX}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <text
            x={b.x + 6 + tabW / 2}
            y={b.y + 3.5}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {s.label}
          </text>
        </g>
      );
    }
    return (
      <g key={s.id}>
        <rect
          x={b.x}
          y={b.y}
          width={b.w}
          height={b.h}
          rx={RADIUS_PX}
          ry={RADIUS_PX}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <text
          x={b.cx}
          y={b.cy + 3.5}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={s.kind === "sub" ? 9 : 10}
          fill="var(--color-ink)"
        >
          {s.label}
        </text>
      </g>
    );
  }

  // Initial-state indicator: small filled circle left of Draft with a short
  // arrow into it.
  const draftBox = boxOf(byId.get("draft")!);
  const initDotR = 4;
  const initDotX = draftBox.x - 18;
  const initDotY = draftBox.cy;
  const initLineEndX = draftBox.x - 2;

  // Final-state marker: bullseye below Delivered with an arrow into it.
  const deliveredBox = boxOf(byId.get("delivered")!);
  const finalCx = deliveredBox.cx;
  const finalCy = deliveredBox.y + deliveredBox.h + 14;
  const finalOuterR = 6;
  const finalInnerR = 3;

  // Compute edge geometries.
  const edges = TRANSITIONS.map((t) => ({ t, g: edgeGeom(t) }));

  // Reference nodes for anchors.
  const compositeNode = byId.get("processing")!;
  const compositeBox = boxOf(compositeNode);
  const subNode = byId.get("picking")!;
  const subBox = boxOf(subNode);
  const selfLoopEdge = edges.find((e) => e.t.selfLoop)!;
  const transitionEdge = edges.find(
    (e) => e.t.from === "submitted" && e.t.to === "approved",
  )!;
  const regularStateBox = boxOf(byId.get("submitted")!);

  return (
    <svg width={width} height={height} role="img" aria-label="UML State Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Composite boundary drawn first so transitions and sub-states layer on top. */}
        <g data-data-layer="true">
          {STATES.filter((s) => s.kind === "composite").map((s) => renderState(s))}
        </g>

        {/* Transitions — drawn under states but over composite boundary. */}
        <g data-data-layer="true">
          {edges.map(({ t, g }, i) => {
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.2;
            const tipY = g.tipY - Math.sin(rad) * 1.2;
            return (
              <g key={`t-${i}`}>
                <path
                  d={g.d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                  opacity={0.92}
                />
                <polygon
                  points={arrowHead(tipX, tipY, g.tipAngle)}
                  fill="var(--color-ink)"
                  opacity={0.92}
                />
                <text
                  x={g.labelX}
                  y={g.labelY}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {t.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Initial-state marker. */}
        <g data-data-layer="true">
          <circle cx={initDotX} cy={initDotY} r={initDotR} fill="var(--color-ink)" />
          <line
            x1={initDotX + initDotR}
            x2={initLineEndX - 4}
            y1={initDotY}
            y2={initDotY}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <polygon
            points={arrowHead(initLineEndX, initDotY, 0)}
            fill="var(--color-ink)"
          />
        </g>

        {/* Simple and sub states. */}
        <g data-data-layer="true">
          {STATES.filter((s) => s.kind !== "composite").map((s) => renderState(s))}
        </g>

        {/* Final-state bullseye + arrow into it from Delivered. */}
        <g data-data-layer="true">
          <line
            x1={deliveredBox.cx}
            x2={deliveredBox.cx}
            y1={deliveredBox.y + deliveredBox.h}
            y2={finalCy - finalOuterR - 1}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <polygon
            points={arrowHead(finalCx, finalCy - finalOuterR - 1, 90)}
            fill="var(--color-ink)"
          />
          <circle
            cx={finalCx}
            cy={finalCy}
            r={finalOuterR}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          <circle cx={finalCx} cy={finalCy} r={finalInnerR} fill="var(--color-ink)" />
        </g>

        {/* Notation caption — bottom-left reminder of the edge-label form. */}
        <g data-data-layer="true">
          <text
            x={0}
            y={ih + 6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            EDGE LABEL: event [guard] / action
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. initial-state-marker (filled dot + arrow into Draft) */}
        <ExplainAnchor
          selector="initial-state-marker"
          index={1}
          pin={{ x: initDotX - 4, y: Math.max(12, initDotY - 18) }}
          rect={{
            x: Math.max(-margin.left + 2, initDotX - initDotR - 4),
            y: Math.max(0, initDotY - 10),
            width: Math.max(18, initLineEndX - (initDotX - initDotR - 4) + 4),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. state (Submitted — representative simple rounded-rect) */}
        <ExplainAnchor
          selector="state"
          index={2}
          pin={{ x: regularStateBox.cx, y: regularStateBox.y - 12 }}
          rect={{
            x: Math.max(0, regularStateBox.x),
            y: Math.max(0, regularStateBox.y),
            width: Math.min(iw, regularStateBox.w),
            height: Math.min(ih, regularStateBox.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. composite-state (Processing boundary containing Picking / Packing) */}
        <ExplainAnchor
          selector="composite-state"
          index={3}
          pin={{ x: compositeBox.x - 16, y: compositeBox.cy }}
          rect={{
            x: Math.max(0, compositeBox.x),
            y: Math.max(0, compositeBox.y),
            width: Math.min(iw, compositeBox.w),
            height: Math.min(ih, compositeBox.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. sub-state (Picking — nested inside Processing) */}
        <ExplainAnchor
          selector="sub-state"
          index={4}
          pin={{ x: subBox.cx, y: subBox.y + subBox.h + 14 }}
          rect={{
            x: Math.max(0, subBox.x),
            y: Math.max(0, subBox.y),
            width: Math.min(iw, subBox.w),
            height: Math.min(ih, subBox.h),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. transition (Submitted → Approved labelled with event [guard]) */}
        <ExplainAnchor
          selector="transition"
          index={5}
          pin={{ x: transitionEdge.g.labelX, y: transitionEdge.g.labelY - 14 }}
          rect={{
            x: Math.max(
              0,
              Math.min(transitionEdge.g.labelX - 40, iw - 20),
            ),
            y: Math.max(0, transitionEdge.g.labelY - 10),
            width: 80,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. self-loop (Draft edit / save arc) */}
        <ExplainAnchor
          selector="self-loop"
          index={6}
          pin={{ x: selfLoopEdge.g.labelX, y: Math.max(6, selfLoopEdge.g.labelY - 16) }}
          rect={{
            x: Math.max(0, selfLoopEdge.g.labelX - 28),
            y: Math.max(0, selfLoopEdge.g.labelY - 14),
            width: 56,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. final-state (bullseye below Delivered) */}
        <ExplainAnchor
          selector="final-state"
          index={7}
          pin={{ x: finalCx + 18, y: finalCy }}
          rect={{
            x: Math.max(0, finalCx - finalOuterR - 4),
            y: Math.max(0, finalCy - finalOuterR - 4),
            width: (finalOuterR + 4) * 2,
            height: (finalOuterR + 4) * 2,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
