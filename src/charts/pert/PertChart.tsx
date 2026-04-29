"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

interface Task {
  id: string;
  name: string;
  duration: number;
  // Position in a 0..100 × 0..100 layout space (centre of the node).
  lx: number;
  ly: number;
  // Forward pass — earliest start / earliest finish.
  es: number;
  ef: number;
  // Backward pass — latest start / latest finish.
  ls: number;
  lf: number;
  // Slack = LS - ES. 0 → critical.
  critical: boolean;
}

// 8-task small-software-release network. ES/EF/LS/LF are pre-computed (see
// module docblock below) so rendering is pure geometry — no CPM passes at
// render time.
//
// Forward pass (ES, EF):
//   A(3): 0→3      B(5, after A): 3→8     C(7, after A): 3→10
//   D(4, after B,C): 10→14                 E(3, after D): 14→17
//   F(2, after C): 10→12                   G(2, after D): 14→16
//   H(1, after E,F,G): 17→18
//
// Backward pass (LS, LF) anchored at project LF = 18:
//   H: 17→18   G: 15→17   F: 15→17   E: 14→17   D: 10→14
//   C: 3→10    B: 5→10    A: 0→3
//
// Slack (LS-ES): A=0 B=2 C=0 D=0 E=0 F=5 G=1 H=0
// → Critical path = A → C → D → E → H, total 18d.
const TASKS: ReadonlyArray<Task> = [
  { id: "A", name: "Design",       duration: 3, lx: 8,  ly: 50, es: 0,  ef: 3,  ls: 0,  lf: 3,  critical: true },
  { id: "B", name: "Front-end",    duration: 5, lx: 30, ly: 22, es: 3,  ef: 8,  ls: 5,  lf: 10, critical: false },
  { id: "C", name: "Back-end API", duration: 7, lx: 30, ly: 60, es: 3,  ef: 10, ls: 3,  lf: 10, critical: true },
  { id: "D", name: "Integration",  duration: 4, lx: 52, ly: 42, es: 10, ef: 14, ls: 10, lf: 14, critical: true },
  { id: "F", name: "Docs",         duration: 2, lx: 52, ly: 82, es: 10, ef: 12, ls: 15, lf: 17, critical: false },
  { id: "E", name: "QA",           duration: 3, lx: 74, ly: 30, es: 14, ef: 17, ls: 14, lf: 17, critical: true },
  { id: "G", name: "Deploy prep",  duration: 2, lx: 74, ly: 62, es: 14, ef: 16, ls: 15, lf: 17, critical: false },
  { id: "H", name: "Launch",       duration: 1, lx: 94, ly: 46, es: 17, ef: 18, ls: 17, lf: 18, critical: true },
];

interface Dep {
  from: string;
  to: string;
}

const DEPS: ReadonlyArray<Dep> = [
  { from: "A", to: "B" },
  { from: "A", to: "C" },
  { from: "B", to: "D" },
  { from: "C", to: "D" },
  { from: "C", to: "F" },
  { from: "D", to: "E" },
  { from: "D", to: "G" },
  { from: "E", to: "H" },
  { from: "F", to: "H" },
  { from: "G", to: "H" },
];

export function PertChart({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 56, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Node box size (pixels).
  const boxW = Math.max(60, Math.min(iw * 0.14, 88));
  const boxH = Math.max(44, Math.min(ih * 0.22, 62));

  // Layout-space → pixels (centre of node).
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const taskById = new Map(TASKS.map((t) => [t.id, t]));

  // Box rect (x,y at top-left) from a task's centre.
  function boxRect(t: Task) {
    const cx = px(t.lx);
    const cy = py(t.ly);
    return {
      cx,
      cy,
      x: cx - boxW / 2,
      y: cy - boxH / 2,
      w: boxW,
      h: boxH,
    };
  }

  // Arrow: exit the source box on its right side at the centre, enter the
  // target box on its left side at the centre. A small bend lets two arrows
  // to the same target stack cleanly (crude but sufficient for 8 nodes).
  function arrowGeom(dep: Dep) {
    const from = taskById.get(dep.from)!;
    const to = taskById.get(dep.to)!;
    const fr = boxRect(from);
    const tr = boxRect(to);
    const sx = fr.x + fr.w;
    const sy = fr.cy;
    const tx = tr.x;
    const ty = tr.cy;
    // Elbow at the horizontal midpoint.
    const midX = sx + (tx - sx) / 2;
    const d =
      Math.abs(sy - ty) < 2
        ? `M ${sx} ${sy} L ${tx} ${ty}`
        : `M ${sx} ${sy} L ${midX} ${sy} L ${midX} ${ty} L ${tx} ${ty}`;
    const critical = from.critical && to.critical;
    return {
      dep,
      d,
      sx,
      sy,
      tx,
      ty,
      midX,
      midY: (sy + ty) / 2,
      critical,
    };
  }

  const arrows = DEPS.map(arrowGeom);

  // Representative anchor targets.
  const criticalNode = taskById.get("D")!; // on the critical path
  const slackNode = taskById.get("F")!;    // has 5d slack
  const criticalRect = boxRect(criticalNode);
  const slackRect = boxRect(slackNode);
  const criticalArrow = arrows.find((a) => a.dep.from === "C" && a.dep.to === "D")!;
  const dependencyArrow = arrows.find((a) => a.dep.from === "D" && a.dep.to === "G")!;

  // Legend position (bottom-right, just inside the plot area).
  const legendW = 196;
  const legendH = 28;
  const legendX = Math.max(0, iw - legendW - 2);
  const legendY = ih + 18;

  return (
    <svg width={width} height={height} role="img" aria-label="PERT chart">
      <Group left={margin.left} top={margin.top}>
        {/* Arrows first so nodes paint on top. Draw non-critical first, then
            critical — that way the thicker red criticals overlap cleanly. */}
        <g data-data-layer="true">
          {[...arrows]
            .sort((a, b) => Number(a.critical) - Number(b.critical))
            .map((a, i) => {
              const headSize = 5;
              // Arrow tip comes in horizontally from the left — angle = 0.
              const rad = 0;
              const backX = a.tx - 2;
              const backY = a.ty;
              const p1x = backX;
              const p1y = backY;
              const p2x =
                backX -
                Math.cos(rad) * headSize +
                Math.cos(rad - Math.PI / 2) * (headSize * 0.55);
              const p2y =
                backY -
                Math.sin(rad) * headSize +
                Math.sin(rad - Math.PI / 2) * (headSize * 0.55);
              const p3x =
                backX -
                Math.cos(rad) * headSize -
                Math.cos(rad - Math.PI / 2) * (headSize * 0.55);
              const p3y =
                backY -
                Math.sin(rad) * headSize -
                Math.sin(rad - Math.PI / 2) * (headSize * 0.55);
              const stroke = a.critical ? "#b33a3a" : "var(--color-ink-mute)";
              const strokeW = a.critical ? 2 : 1.1;
              const opacity = a.critical ? 1 : 0.85;
              return (
                <g key={`arr-${i}`}>
                  <path
                    d={a.d}
                    fill="none"
                    stroke={stroke}
                    strokeWidth={strokeW}
                    opacity={opacity}
                  />
                  <polygon
                    points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
                    fill={stroke}
                    opacity={opacity}
                  />
                </g>
              );
            })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {TASKS.map((t) => {
            const r = boxRect(t);
            const midX = r.x + r.w / 2;
            const midY = r.y + r.h / 2;
            const stroke = t.critical ? "#b33a3a" : "var(--color-ink)";
            const strokeW = t.critical ? 1.8 : 1;
            return (
              <g key={`node-${t.id}`}>
                {/* outer border */}
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={2}
                  ry={2}
                  fill="var(--color-surface)"
                  stroke={stroke}
                  strokeWidth={strokeW}
                />
                {/* internal cross — 4-panel divider */}
                <line x1={midX} y1={r.y} x2={midX} y2={r.y + r.h} stroke={stroke} strokeWidth={0.8} opacity={0.7} />
                <line x1={r.x} y1={midY} x2={r.x + r.w} y2={midY} stroke={stroke} strokeWidth={0.8} opacity={0.7} />

                {/* ES (top-left) */}
                <text
                  x={r.x + 4}
                  y={r.y + 10}
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {t.es}
                </text>
                {/* EF (top-right) */}
                <text
                  x={r.x + r.w - 4}
                  y={r.y + 10}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {t.ef}
                </text>
                {/* LS (bottom-left) */}
                <text
                  x={r.x + 4}
                  y={r.y + r.h - 4}
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {t.ls}
                </text>
                {/* LF (bottom-right) */}
                <text
                  x={r.x + r.w - 4}
                  y={r.y + r.h - 4}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {t.lf}
                </text>
                {/* Task name + duration (centre) */}
                <text
                  x={midX}
                  y={midY - 1}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9.5}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {t.id}: {t.name}
                </text>
                <text
                  x={midX}
                  y={midY + 10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8.5}
                  fill="var(--color-ink)"
                >
                  {t.duration}d
                </text>
              </g>
            );
          })}
        </g>

        {/* Legend (bottom-right) */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          <rect
            x={0}
            y={0}
            width={legendW}
            height={legendH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {/* critical swatch */}
          <line x1={8} y1={10} x2={26} y2={10} stroke="#b33a3a" strokeWidth={2} />
          <text x={30} y={13} fontFamily="var(--font-mono)" fontSize={8.5} fill="var(--color-ink)">
            CRITICAL PATH (18d)
          </text>
          {/* slack swatch */}
          <line x1={8} y1={22} x2={26} y2={22} stroke="var(--color-ink-mute)" strokeWidth={1.2} />
          <text x={30} y={25} fontFamily="var(--font-mono)" fontSize={8.5} fill="var(--color-ink)">
            WITH SLACK
          </text>
        </g>

        {/* -------- Anchors (6) -------- */}

        {/* 1. Task node — 4-panel ES/EF/LS/LF layout (on critical path D) */}
        <ExplainAnchor
          selector="task-node"
          index={1}
          pin={{ x: criticalRect.cx, y: criticalRect.y - 14 }}
          rect={{
            x: criticalRect.x,
            y: criticalRect.y,
            width: criticalRect.w,
            height: criticalRect.h,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Critical-path arrow — the C → D edge */}
        <ExplainAnchor
          selector="critical-path-arrow"
          index={2}
          pin={{ x: criticalArrow.midX, y: criticalArrow.midY - 14 }}
          rect={{
            x: Math.min(criticalArrow.sx, criticalArrow.tx) - 4,
            y: Math.min(criticalArrow.sy, criticalArrow.ty) - 6,
            width: Math.abs(criticalArrow.tx - criticalArrow.sx) + 8,
            height: Math.max(14, Math.abs(criticalArrow.ty - criticalArrow.sy) + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Dependency arrow — a non-critical edge (D → G, 1d slack) */}
        <ExplainAnchor
          selector="dependency-arrow"
          index={3}
          pin={{ x: dependencyArrow.midX, y: dependencyArrow.midY + 14 }}
          rect={{
            x: Math.min(dependencyArrow.sx, dependencyArrow.tx) - 4,
            y: Math.min(dependencyArrow.sy, dependencyArrow.ty) - 6,
            width: Math.abs(dependencyArrow.tx - dependencyArrow.sx) + 8,
            height: Math.max(14, Math.abs(dependencyArrow.ty - dependencyArrow.sy) + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Slack node — the F (Docs) node, which has 5d of slack */}
        <ExplainAnchor
          selector="slack-node"
          index={4}
          pin={{ x: slackRect.cx, y: slackRect.y + slackRect.h + 14 }}
          rect={{
            x: slackRect.x,
            y: slackRect.y,
            width: slackRect.w,
            height: slackRect.h,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Three-point estimation — pinned on the smallest-duration node
             (H) so we have somewhere definite to place the PERT vs CPM
             distinction. The anchor explains the data under the 'd' cell. */}
        <ExplainAnchor
          selector="three-point-estimate"
          index={5}
          pin={{ x: boxRect(taskById.get("H")!).cx, y: boxRect(taskById.get("H")!).y - 14 }}
          rect={{
            x: boxRect(taskById.get("H")!).x,
            y: boxRect(taskById.get("H")!).y,
            width: boxRect(taskById.get("H")!).w,
            height: boxRect(taskById.get("H")!).h,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Legend */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: legendX - 14, y: legendY + legendH / 2 }}
          rect={{
            x: legendX,
            y: legendY,
            width: legendW,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
