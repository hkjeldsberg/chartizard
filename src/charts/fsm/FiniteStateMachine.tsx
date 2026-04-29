"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Async-request FSM. States are laid out on a hand-positioned map with
// coordinates in a 0..100 × 0..100 space — no force-layout drift.

type StateId = "idle" | "loading" | "success" | "error" | "retrying";

interface StateSpec {
  id: StateId;
  label: string;
  // Centre position in layout space.
  lx: number;
  ly: number;
  // Accepting / terminal state renders with a second inner border.
  accepting?: boolean;
}

const STATES: ReadonlyArray<StateSpec> = [
  { id: "idle", label: "Idle", lx: 20, ly: 28 },
  { id: "loading", label: "Loading", lx: 50, ly: 28 },
  { id: "success", label: "Success", lx: 82, ly: 14, accepting: true },
  { id: "error", label: "Error", lx: 82, ly: 58 },
  { id: "retrying", label: "Retrying", lx: 50, ly: 78 },
];

type EdgeRoute = "straight" | "curve";

interface Transition {
  from: StateId;
  to: StateId;
  // Event [guard] / action — rendered together as the mid-edge label.
  label: string;
  // Curve edges are drawn with a quadratic Bezier and need a perpendicular
  // offset (+ above/left, − below/right of the straight line). Use for edges
  // that would otherwise overlap their reverse.
  route?: EdgeRoute;
  curveOffset?: number;
  // Self-loops render as a top-side arc and carry their own geometry.
  selfLoop?: boolean;
}

const TRANSITIONS: ReadonlyArray<Transition> = [
  { from: "idle", to: "loading", label: "request" },
  { from: "loading", to: "success", label: "200 OK" },
  { from: "loading", to: "error", label: "4xx/5xx" },
  { from: "error", to: "retrying", label: "retry [attempts < 3]", route: "curve", curveOffset: -26 },
  { from: "retrying", to: "loading", label: "fire" },
  { from: "error", to: "idle", label: "reset", route: "curve", curveOffset: 18 },
  { from: "success", to: "idle", label: "reset", route: "curve", curveOffset: -22 },
  { from: "retrying", to: "retrying", label: "backoff [attempts < 3] / wait", selfLoop: true },
];

export function FiniteStateMachine({ width, height }: Props) {
  const margin = { top: 40, right: 32, bottom: 28, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout-space → pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // Rounded-rect state node dimensions.
  const STATE_W = 78;
  const STATE_H = 32;
  const STATE_RX = 14;
  const INSET = 4; // inset for the accepting-state inner border.

  const stateById = new Map<StateId, StateSpec>(STATES.map((s) => [s.id, s]));

  interface Rect {
    cx: number;
    cy: number;
    w: number;
    h: number;
  }

  function rectOf(s: StateSpec): Rect {
    return { cx: px(s.lx), cy: py(s.ly), w: STATE_W, h: STATE_H };
  }

  // Point on a state's rounded-rect perimeter closest to a target direction.
  // Treats the shape as a rectangle — adequate for arrows that enter nearly
  // horizontally or vertically, which is all of our hand-placed layout.
  function anchor(s: StateSpec, towards: { x: number; y: number }) {
    const r = rectOf(s);
    const dx = towards.x - r.cx;
    const dy = towards.y - r.cy;
    if (Math.abs(dy) * r.w >= Math.abs(dx) * r.h) {
      // Leave through top/bottom.
      const sign = dy >= 0 ? 1 : -1;
      return { x: r.cx, y: r.cy + (sign * r.h) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: r.cx + (sign * r.w) / 2, y: r.cy };
  }

  interface EdgeGeom {
    d: string;
    tipX: number;
    tipY: number;
    // Tangent angle (degrees) at the tip — for the arrowhead.
    tipAngle: number;
    // Where to place the mid-edge label.
    labelX: number;
    labelY: number;
  }

  function computeGeom(t: Transition): EdgeGeom {
    const from = stateById.get(t.from)!;
    const to = stateById.get(t.to)!;

    if (t.selfLoop) {
      // Top-side quadratic self-loop, leaving the top-left, re-entering
      // the top-right of the node.
      const r = rectOf(from);
      const leftX = r.cx - r.w * 0.25;
      const rightX = r.cx + r.w * 0.25;
      const topY = r.cy - r.h / 2;
      const controlX = r.cx;
      const controlY = topY - 36;
      const d = `M ${leftX} ${topY} Q ${controlX} ${controlY} ${rightX} ${topY}`;
      return {
        d,
        tipX: rightX,
        tipY: topY,
        // Arrow entering from above the node, pointing down into it.
        tipAngle: 90,
        labelX: controlX,
        labelY: controlY + 2,
      };
    }

    const fromCentre = { x: px(from.lx), y: py(from.ly) };
    const toCentre = { x: px(to.lx), y: py(to.ly) };
    const a = anchor(from, toCentre);
    const b = anchor(to, fromCentre);

    if (t.route === "curve") {
      // Quadratic Bezier: control point offset perpendicular to a→b.
      const mx = (a.x + b.x) / 2;
      const my = (a.y + b.y) / 2;
      const vx = b.x - a.x;
      const vy = b.y - a.y;
      const len = Math.max(1, Math.sqrt(vx * vx + vy * vy));
      const nx = -vy / len;
      const ny = vx / len;
      const off = t.curveOffset ?? 24;
      const cx = mx + nx * off;
      const cy = my + ny * off;
      // Tangent at t=1 is (b − c).
      const tangent = Math.atan2(b.y - cy, b.x - cx);
      const labelX = mx + nx * (off * 0.6);
      const labelY = my + ny * (off * 0.6);
      return {
        d: `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`,
        tipX: b.x,
        tipY: b.y,
        tipAngle: (tangent * 180) / Math.PI,
        labelX,
        labelY,
      };
    }

    const tangent = Math.atan2(b.y - a.y, b.x - a.x);
    return {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      tipX: b.x,
      tipY: b.y,
      tipAngle: (tangent * 180) / Math.PI,
      labelX: (a.x + b.x) / 2,
      labelY: (a.y + b.y) / 2 - 6,
    };
  }

  const geoms = TRANSITIONS.map((t) => ({ t, g: computeGeom(t) }));

  // Initial-state indicator: small filled circle above-left of Idle.
  const idle = stateById.get("idle")!;
  const idleRect = rectOf(idle);
  const initDotR = 5;
  const initDotX = idleRect.cx - idleRect.w / 2 - 24;
  const initDotY = idleRect.cy;
  const initLineEndX = idleRect.cx - idleRect.w / 2 - 2;

  // Representative anchors.
  const loadingState = stateById.get("loading")!;
  const successState = stateById.get("success")!;
  const retryingState = stateById.get("retrying")!;
  const retryingRect = rectOf(retryingState);
  const idleToLoading = geoms.find((e) => e.t.from === "idle" && e.t.to === "loading")!;

  // Helper: arrow-tip triangle from (tipX, tipY) back along tipAngle.
  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 6): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.55;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.55;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Finite state machine">
      <Group left={margin.left} top={margin.top}>
        {/* Transitions — drawn before nodes so nodes paint on top. */}
        <g data-data-layer="true">
          {geoms.map(({ t, g }, i) => {
            // Shorten the tip slightly so the arrowhead sits flush against
            // the node border rather than overlapping it.
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.5;
            const tipY = g.tipY - Math.sin(rad) * 1.5;
            return (
              <g key={`edge-${i}`}>
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

        {/* Initial-state marker: filled dot + short line + arrowhead into Idle. */}
        <g data-data-layer="true">
          <circle cx={initDotX} cy={initDotY} r={initDotR} fill="var(--color-ink)" />
          <line
            x1={initDotX + initDotR}
            x2={initLineEndX - 6}
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

        {/* States (rounded-rect nodes). Accepting state has a second inner border. */}
        <g data-data-layer="true">
          {STATES.map((s) => {
            const r = rectOf(s);
            const x = r.cx - r.w / 2;
            const y = r.cy - r.h / 2;
            return (
              <g key={`state-${s.id}`}>
                <rect
                  x={x}
                  y={y}
                  width={r.w}
                  height={r.h}
                  rx={STATE_RX}
                  ry={STATE_RX}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.4}
                />
                {s.accepting && (
                  <rect
                    x={x + INSET}
                    y={y + INSET}
                    width={r.w - INSET * 2}
                    height={r.h - INSET * 2}
                    rx={STATE_RX - INSET}
                    ry={STATE_RX - INSET}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1}
                  />
                )}
                <text
                  x={r.cx}
                  y={r.cy + 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={11}
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Notation caption — bottom-left reminder of the event [guard] / action form. */}
        <g data-data-layer="true">
          <text
            x={0}
            y={ih + 18}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            EDGE LABEL: event [guard] / action
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. state (Loading — representative rounded-rect) */}
        <ExplainAnchor
          selector="state"
          index={1}
          pin={{ x: px(loadingState.lx), y: py(loadingState.ly) - STATE_H / 2 - 14 }}
          rect={{
            x: Math.max(0, px(loadingState.lx) - STATE_W / 2),
            y: Math.max(0, py(loadingState.ly) - STATE_H / 2),
            width: STATE_W,
            height: STATE_H,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. initial-state (filled dot → Idle) */}
        <ExplainAnchor
          selector="initial-state"
          index={2}
          pin={{ x: initDotX, y: Math.max(14, initDotY - 20) }}
          rect={{
            x: Math.max(0, initDotX - initDotR - 4),
            y: Math.max(0, initDotY - 10),
            width: Math.min(iw, initLineEndX - (initDotX - initDotR - 4) + 4),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. accepting-state (Success — double border) */}
        <ExplainAnchor
          selector="accepting-state"
          index={3}
          pin={{ x: px(successState.lx) + STATE_W / 2 + 4, y: py(successState.ly) - STATE_H / 2 - 10 }}
          rect={{
            x: Math.max(0, px(successState.lx) - STATE_W / 2),
            y: Math.max(0, py(successState.ly) - STATE_H / 2),
            width: STATE_W,
            height: STATE_H,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. transition (idle → loading straight edge) */}
        <ExplainAnchor
          selector="transition"
          index={4}
          pin={{ x: idleToLoading.g.labelX, y: idleToLoading.g.labelY - 14 }}
          rect={{
            x: Math.min(idleToLoading.g.labelX - 28, iw - 1),
            y: Math.max(0, idleToLoading.g.labelY - 8),
            width: 56,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. self-loop (Retrying backoff arc) */}
        <ExplainAnchor
          selector="self-loop"
          index={5}
          pin={{ x: retryingRect.cx, y: retryingRect.cy - retryingRect.h / 2 - 46 }}
          rect={{
            x: Math.max(0, retryingRect.cx - retryingRect.w * 0.4),
            y: Math.max(0, retryingRect.cy - retryingRect.h / 2 - 42),
            width: retryingRect.w * 0.8,
            height: 42,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. guard-action (notation caption) */}
        <ExplainAnchor
          selector="guard-action"
          index={6}
          pin={{ x: Math.min(iw - 12, 190), y: ih + 14 }}
          rect={{
            x: 0,
            y: Math.max(0, ih + 6),
            width: Math.min(iw, 240),
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
