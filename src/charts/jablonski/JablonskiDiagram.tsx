"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// A Jabłoński diagram plots electronic energy up the y-axis. Each electronic
// state gets a thick horizontal line with thinner vibrational sub-levels above
// it. Photophysical processes are drawn as arrows between states:
//
//   Absorption      — straight up, violet  (S0 → S1, S0 → S2)
//   Internal Conv.  — squiggly, vertical   (S2 → S1 vibrational relaxation)
//   Fluorescence    — straight down, cyan  (S1 → S0)
//   Intersystem     — squiggly, diagonal   (S1 → T1)
//   Phosphorescence — straight down, red   (T1 → S0, long, slow)
//
// Singlets (S) are drawn on the left; the triplet (T1) sits at lower energy
// than S1 and is offset to the right so the spin-multiplicity split is visible.

type Multiplicity = "singlet" | "triplet";

interface State {
  id: "S0" | "S1" | "S2" | "T1";
  label: string;
  // Energy in arbitrary units (0 = ground). Higher = further up the plot.
  energy: number;
  multiplicity: Multiplicity;
  // How many vibrational sub-levels to draw above the electronic line.
  vibLevels: number;
}

const STATES: ReadonlyArray<State> = [
  { id: "S0", label: "S₀", energy: 0, multiplicity: "singlet", vibLevels: 4 },
  { id: "S1", label: "S₁", energy: 58, multiplicity: "singlet", vibLevels: 3 },
  { id: "S2", label: "S₂", energy: 92, multiplicity: "singlet", vibLevels: 3 },
  { id: "T1", label: "T₁", energy: 42, multiplicity: "triplet", vibLevels: 3 },
];

export function JablonskiDiagram({ width, height }: Props) {
  // Wider right margin so T1 label + phosphorescence wavelength label breathe.
  const margin = { top: 20, right: 72, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Map energy to y-coord (0 → bottom, 100 → top).
  const eMax = 100;
  const yOf = (energy: number) => ih - (energy / eMax) * ih;

  // Singlet block occupies the left 62% of the plot, triplet block the right
  // 28% — with a visual gap between them that reinforces the spin split.
  const singletX0 = 0;
  const singletX1 = iw * 0.62;
  const tripletX0 = iw * 0.68;
  const tripletX1 = iw;

  function stateBounds(s: State) {
    if (s.multiplicity === "singlet") {
      return { x0: singletX0, x1: singletX1 };
    }
    return { x0: tripletX0, x1: tripletX1 };
  }

  // Vibrational sub-levels stack above the electronic line at decreasing
  // energy spacing (anharmonic-ish) — visual convention, not quantitative.
  const vibSpacing = 6; // px between sub-levels
  function vibY(s: State, i: number) {
    // i=0 is the electronic line itself. Sub-levels stack above (up-screen).
    return yOf(s.energy) - i * vibSpacing;
  }

  const stateById = new Map(STATES.map((s) => [s.id, s]));
  const s0 = stateById.get("S0")!;
  const s1 = stateById.get("S1")!;
  const s2 = stateById.get("S2")!;
  const t1 = stateById.get("T1")!;

  // Absorption arrows rise from two different sub-levels inside the S0 block,
  // so they don't overlap.
  const absS0S1X = singletX0 + (singletX1 - singletX0) * 0.28;
  const absS0S2X = singletX0 + (singletX1 - singletX0) * 0.46;
  // Fluorescence arrow leaves S1 one gamete-width to the right of the S0->S1
  // absorption — it ends at S0 at a slightly lower vibrational sub-level
  // (shifted emission wavelength, i.e. Stokes shift).
  const fluorX = singletX0 + (singletX1 - singletX0) * 0.64;

  // Internal conversion: squiggly vertical line from S2 down to S1's top
  // vibrational sub-level, near the right of the singlet block.
  const icX = singletX0 + (singletX1 - singletX0) * 0.82;

  // Intersystem crossing: squiggly line from S1 (right edge) to T1 (left edge).
  const iscFromX = singletX1 - 4;
  const iscFromY = yOf(s1.energy);
  const iscToX = tripletX0 + 4;
  const iscToY = yOf(t1.energy);

  // Phosphorescence: T1 straight down to S0 (on the triplet side).
  const phosX = tripletX0 + (tripletX1 - tripletX0) * 0.5;

  // ---- Squiggly-line helper (horizontal or vertical sine-wave path) ----
  function squigglyPath(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    amplitude = 2.5,
    wavelength = 6,
  ): string {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const length = Math.hypot(dx, dy);
    if (length < 1) return `M ${x1} ${y1} L ${x2} ${y2}`;
    const ux = dx / length;
    const uy = dy / length;
    // Perpendicular unit vector.
    const nx = -uy;
    const ny = ux;
    const steps = Math.max(4, Math.round(length / (wavelength / 2)));
    let d = `M ${x1} ${y1}`;
    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      const baseX = x1 + dx * t;
      const baseY = y1 + dy * t;
      const phase = Math.sin((t * length * Math.PI * 2) / wavelength);
      const offX = nx * amplitude * phase;
      const offY = ny * amplitude * phase;
      d += ` L ${baseX + offX} ${baseY + offY}`;
    }
    return d;
  }

  // Arrowhead triangle pointing along direction (ux, uy) at tip (tx, ty).
  function arrowHead(
    tx: number,
    ty: number,
    ux: number,
    uy: number,
    size = 5,
  ): string {
    const nx = -uy;
    const ny = ux;
    const bx = tx - ux * size;
    const by = ty - uy * size;
    const p2x = bx + nx * (size * 0.55);
    const p2y = by + ny * (size * 0.55);
    const p3x = bx - nx * (size * 0.55);
    const p3y = by - ny * (size * 0.55);
    return `${tx},${ty} ${p2x},${p2y} ${p3x},${p3y}`;
  }

  // Process colours — distinct so each arrow reads as a different rate process.
  const COL_ABSORPTION = "#6b4ed6"; // violet
  const COL_FLUORESCENCE = "#2a8fb8"; // cyan
  const COL_INTERNAL = "var(--color-ink-mute)";
  const COL_ISC = "var(--color-ink-mute)";
  const COL_PHOSPHORESCENCE = "#c24a3a"; // red

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Jablonski diagram"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Energy y-axis rail */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {/* Upward tick arrow at top */}
          <polygon
            points={`${0},${-2} ${-3.5},${5} ${3.5},${5}`}
            fill="var(--color-ink-mute)"
          />
          <text
            x={-10}
            y={ih / 2}
            transform={`rotate(-90, -10, ${ih / 2})`}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            ENERGY
          </text>
        </g>

        {/* State lines + vibrational sub-levels */}
        <g data-data-layer="true">
          {STATES.map((s) => {
            const { x0, x1 } = stateBounds(s);
            const y = yOf(s.energy);
            return (
              <g key={s.id}>
                {/* Electronic state line (thick) */}
                <line
                  x1={x0}
                  x2={x1}
                  y1={y}
                  y2={y}
                  stroke="var(--color-ink)"
                  strokeWidth={2.2}
                  strokeLinecap="round"
                />
                {/* Vibrational sub-levels above (thin, shorter) */}
                {Array.from({ length: s.vibLevels }).map((_, i) => {
                  const vy = vibY(s, i + 1);
                  const inset = (x1 - x0) * 0.08;
                  return (
                    <line
                      key={`vib-${s.id}-${i}`}
                      x1={x0 + inset}
                      x2={x1 - inset}
                      y1={vy}
                      y2={vy}
                      stroke="var(--color-ink-mute)"
                      strokeWidth={1}
                      opacity={0.7}
                    />
                  );
                })}
                {/* State label — left of the singlet block, right of the triplet */}
                {s.multiplicity === "singlet" ? (
                  <text
                    x={x0 - 6}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={12}
                    fontWeight={500}
                    fill="var(--color-ink)"
                  >
                    {s.label}
                  </text>
                ) : (
                  <text
                    x={x1 + 6}
                    y={y}
                    textAnchor="start"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={12}
                    fontWeight={500}
                    fill="var(--color-ink)"
                  >
                    {s.label}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Absorption arrows (S0 -> S1, S0 -> S2) */}
        <g data-data-layer="true">
          {[
            { x: absS0S1X, yFrom: yOf(s0.energy), yTo: yOf(s1.energy) + 2 },
            { x: absS0S2X, yFrom: yOf(s0.energy), yTo: yOf(s2.energy) + 2 },
          ].map((a, i) => (
            <g key={`abs-${i}`}>
              <line
                x1={a.x}
                x2={a.x}
                y1={a.yFrom}
                y2={a.yTo}
                stroke={COL_ABSORPTION}
                strokeWidth={1.6}
              />
              <polygon
                points={arrowHead(a.x, a.yTo, 0, -1, 5)}
                fill={COL_ABSORPTION}
              />
            </g>
          ))}
          <text
            x={absS0S2X + 8}
            y={(yOf(s0.energy) + yOf(s2.energy)) / 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill={COL_ABSORPTION}
          >
            ABS hv
          </text>
        </g>

        {/* Fluorescence (S1 -> S0), cyan, straight down */}
        <g data-data-layer="true">
          {(() => {
            const yFrom = yOf(s1.energy);
            const yTo = yOf(s0.energy) - vibSpacing * 1.2; // Stokes-shift landing
            return (
              <g>
                <line
                  x1={fluorX}
                  x2={fluorX}
                  y1={yFrom}
                  y2={yTo}
                  stroke={COL_FLUORESCENCE}
                  strokeWidth={1.6}
                />
                <polygon
                  points={arrowHead(fluorX, yTo, 0, 1, 5)}
                  fill={COL_FLUORESCENCE}
                />
                <text
                  x={fluorX + 6}
                  y={(yFrom + yTo) / 2}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill={COL_FLUORESCENCE}
                >
                  FLUOR hv′
                </text>
              </g>
            );
          })()}
        </g>

        {/* Internal conversion (S2 -> S1), squiggly vertical */}
        <g data-data-layer="true">
          {(() => {
            const yFrom = yOf(s2.energy);
            const yTo = yOf(s1.energy) + 2;
            const d = squigglyPath(icX, yFrom, icX, yTo, 2.2, 5);
            return (
              <g>
                <path
                  d={d}
                  fill="none"
                  stroke={COL_INTERNAL}
                  strokeWidth={1.2}
                />
                <polygon
                  points={arrowHead(icX, yTo, 0, 1, 4.5)}
                  fill={COL_INTERNAL}
                />
                <text
                  x={icX + 6}
                  y={(yFrom + yTo) / 2}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  IC
                </text>
              </g>
            );
          })()}
        </g>

        {/* Intersystem crossing (S1 -> T1), squiggly diagonal */}
        <g data-data-layer="true">
          {(() => {
            const d = squigglyPath(iscFromX, iscFromY, iscToX, iscToY, 2.2, 5);
            const dx = iscToX - iscFromX;
            const dy = iscToY - iscFromY;
            const len = Math.hypot(dx, dy);
            return (
              <g>
                <path
                  d={d}
                  fill="none"
                  stroke={COL_ISC}
                  strokeWidth={1.2}
                />
                <polygon
                  points={arrowHead(iscToX, iscToY, dx / len, dy / len, 4.5)}
                  fill={COL_ISC}
                />
                <text
                  x={(iscFromX + iscToX) / 2}
                  y={(iscFromY + iscToY) / 2 - 6}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  ISC
                </text>
              </g>
            );
          })()}
        </g>

        {/* Phosphorescence (T1 -> S0), red, straight down */}
        <g data-data-layer="true">
          {(() => {
            const yFrom = yOf(t1.energy);
            const yTo = yOf(s0.energy) - 2;
            return (
              <g>
                <line
                  x1={phosX}
                  x2={phosX}
                  y1={yFrom}
                  y2={yTo}
                  stroke={COL_PHOSPHORESCENCE}
                  strokeWidth={1.6}
                  strokeDasharray="5 3"
                />
                <polygon
                  points={arrowHead(phosX, yTo, 0, 1, 5)}
                  fill={COL_PHOSPHORESCENCE}
                />
                <text
                  x={phosX + 6}
                  y={(yFrom + yTo) / 2}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill={COL_PHOSPHORESCENCE}
                >
                  PHOS hv″
                </text>
              </g>
            );
          })()}
        </g>

        {/* Caption under S0 */}
        <g data-data-layer="true">
          <text
            x={iw / 2}
            y={ih + 28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PHOTOPHYSICAL STATE DIAGRAM
          </text>
        </g>

        {/* --- Anchors --- */}

        {/* 1. Electronic state line — anchor on S1 (canonical excited singlet) */}
        <ExplainAnchor
          selector="electronic-state"
          index={1}
          pin={{ x: singletX1 + 8, y: yOf(s1.energy) - 12 }}
          rect={{
            x: singletX0,
            y: yOf(s1.energy) - 4,
            width: singletX1 - singletX0,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Vibrational sub-levels — anchor on the stack above S1 */}
        <ExplainAnchor
          selector="vibrational-sublevels"
          index={2}
          pin={{ x: singletX0 - 22, y: yOf(s1.energy) - vibSpacing * 2 }}
          rect={{
            x: singletX0,
            y: yOf(s1.energy) - vibSpacing * (s1.vibLevels + 0.5),
            width: singletX1 - singletX0,
            height: vibSpacing * (s1.vibLevels + 0.5),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Absorption arrows (violet) */}
        <ExplainAnchor
          selector="absorption"
          index={3}
          pin={{
            x: absS0S1X - 14,
            y: (yOf(s0.energy) + yOf(s1.energy)) / 2,
          }}
          rect={{
            x: Math.min(absS0S1X, absS0S2X) - 4,
            y: yOf(s2.energy),
            width: Math.abs(absS0S2X - absS0S1X) + 8,
            height: yOf(s0.energy) - yOf(s2.energy),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Fluorescence (cyan, S1 -> S0) */}
        <ExplainAnchor
          selector="fluorescence"
          index={4}
          pin={{ x: fluorX + 30, y: (yOf(s1.energy) + yOf(s0.energy)) / 2 }}
          rect={{
            x: fluorX - 4,
            y: yOf(s1.energy),
            width: 8,
            height: yOf(s0.energy) - yOf(s1.energy),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Intersystem crossing (squiggly S1 -> T1) */}
        <ExplainAnchor
          selector="intersystem-crossing"
          index={5}
          pin={{ x: (iscFromX + iscToX) / 2, y: (iscFromY + iscToY) / 2 + 14 }}
          rect={{
            x: Math.min(iscFromX, iscToX) - 4,
            y: Math.min(iscFromY, iscToY) - 4,
            width: Math.abs(iscToX - iscFromX) + 8,
            height: Math.abs(iscToY - iscFromY) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Phosphorescence (red, T1 -> S0) */}
        <ExplainAnchor
          selector="phosphorescence"
          index={6}
          pin={{ x: phosX + 30, y: (yOf(t1.energy) + yOf(s0.energy)) / 2 }}
          rect={{
            x: phosX - 4,
            y: yOf(t1.energy),
            width: 8,
            height: yOf(s0.energy) - yOf(t1.energy),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Triplet state (T1) — the spin-flipped band */}
        <ExplainAnchor
          selector="triplet-state"
          index={7}
          pin={{ x: tripletX1 + 28, y: yOf(t1.energy) - 8 }}
          rect={{
            x: tripletX0,
            y: yOf(t1.energy) - 4,
            width: tripletX1 - tripletX0,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
