"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Line, LinePath } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Dataset A: Hubble's 1929 original 24 galaxies ───────────────────────────
// Approximate (distance Mpc, velocity km/s) pairs reconstructed from the
// original PNAS 15(3) paper. Slope ≈ 500 km/s/Mpc — Hubble's estimate,
// inflated ~7× by miscalibrated Cepheid zero-points (confused classical Cepheids
// with W Virginis variables; the scale was corrected by Baade in 1952).
const HUBBLE_1929: ReadonlyArray<{ dist: number; vel: number }> = [
  { dist: 0.032, vel: 170 },
  { dist: 0.034, vel: 290 },
  { dist: 0.214, vel: 200 },
  { dist: 0.263, vel: -220 },
  { dist: 0.275, vel: 300 },
  { dist: 0.275, vel: -70 },
  { dist: 0.45,  vel: 300 },
  { dist: 0.5,   vel: -130 },
  { dist: 0.5,   vel: 650 },
  { dist: 0.63,  vel: 150 },
  { dist: 0.63,  vel: 920 },
  { dist: 0.8,   vel: 500 },
  { dist: 0.9,   vel: 960 },
  { dist: 0.9,   vel: 720 },
  { dist: 0.9,   vel: 450 },
  { dist: 1.0,   vel: 500 },
  { dist: 1.1,   vel: 850 },
  { dist: 1.1,   vel: 450 },
  { dist: 1.4,   vel: 710 },
  { dist: 1.5,   vel: 1090 },
  { dist: 1.7,   vel: 700 },
  { dist: 1.7,   vel: 1100 },
  { dist: 2.0,   vel: 1000 },
  { dist: 2.0,   vel: 700 },
];

// ─── Dataset B: modern distance-ladder (Cepheids + SNe Ia) ───────────────────
// Illustrative points consistent with H₀ ≈ 70 km/s/Mpc. Distances from the
// Carnegie-Chicago Hubble Program and SH0ES ladder; velocities corrected for
// Local Group infall. Not an exact reproduction of any single survey.
const MODERN: ReadonlyArray<{ dist: number; vel: number }> = [
  { dist: 5,   vel: 350 },
  { dist: 6,   vel: 420 },
  { dist: 8,   vel: 560 },
  { dist: 10,  vel: 700 },
  { dist: 12,  vel: 840 },
  { dist: 14,  vel: 980 },
  { dist: 16,  vel: 1120 },
  { dist: 18,  vel: 1260 },
  { dist: 20,  vel: 1400 },
  { dist: 24,  vel: 1680 },
  { dist: 28,  vel: 1960 },
  { dist: 32,  vel: 2240 },
  { dist: 38,  vel: 2660 },
  { dist: 44,  vel: 3080 },
  { dist: 50,  vel: 3500 },
  { dist: 58,  vel: 4060 },
  { dist: 65,  vel: 4550 },
  { dist: 75,  vel: 5250 },
  { dist: 85,  vel: 5950 },
  { dist: 100, vel: 7000 },
];

interface Props {
  width: number;
  height: number;
}

// Two-panel layout: left panel shows Hubble 1929 range (0–2.2 Mpc, −400–1300 km/s);
// right panel shows the modern range (0–105 Mpc, 0–7500 km/s). A thin divider
// separates them. Both panels share the same y-axis label and scale type.
export function HubbleDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 16, bottom: 50, left: 62 };
  const dividerWidth = 12;
  const totalIW = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Split inner width: left panel gets 30%, right panel gets 70%.
  const leftPanelW = Math.floor(totalIW * 0.30);
  const rightPanelW = Math.max(0, totalIW - leftPanelW - dividerWidth);
  const rightPanelX = leftPanelW + dividerWidth;

  // ── Left panel scales (Hubble 1929) ──
  const xScaleLeft = useMemo(
    () => scaleLinear({ domain: [0, 2.2], range: [0, leftPanelW] }),
    [leftPanelW],
  );
  const yScaleLeft = useMemo(
    () => scaleLinear({ domain: [-400, 1300], range: [ih, 0], nice: true }),
    [ih],
  );

  // ── Right panel scales (modern) ──
  const xScaleRight = useMemo(
    () => scaleLinear({ domain: [0, 105], range: [0, rightPanelW] }),
    [rightPanelW],
  );
  const yScaleRight = useMemo(
    () => scaleLinear({ domain: [0, 7500], range: [ih, 0], nice: true }),
    [ih],
  );

  // ── Best-fit lines (pre-computed slopes, not regression) ──
  // Left panel: H₀ = 500 km/s/Mpc — Hubble 1929 estimate.
  const h1929Line = useMemo(() => {
    return [
      { x: xScaleLeft(0), y: yScaleLeft(0) },
      { x: xScaleLeft(2.2), y: yScaleLeft(500 * 2.2) },
    ];
  }, [xScaleLeft, yScaleLeft]);

  // Right panel: H₀ = 70 km/s/Mpc — modern distance-ladder.
  const modernLine = useMemo(() => {
    return [
      { x: xScaleRight(0), y: yScaleRight(0) },
      { x: xScaleRight(105), y: yScaleRight(70 * 105) },
    ];
  }, [xScaleRight, yScaleRight]);

  const yTicksLeft = yScaleLeft.ticks(5);
  const yTicksRight = yScaleRight.ticks(5);

  // ── Anchor reference positions ──
  // Hubble 1929 data point: pick the point at dist≈1.5, vel≈1090 (top cluster)
  const anchor1929 = HUBBLE_1929[19]; // dist 1.5, vel 1090
  const p1929X = xScaleLeft(anchor1929.dist);
  const p1929Y = yScaleLeft(anchor1929.vel);

  // Modern data point: pick dist≈50, vel≈3500
  const anchorModern = MODERN[14]; // dist 50, vel 3500
  const pModernX = xScaleRight(anchorModern.dist);
  const pModernY = yScaleRight(anchorModern.vel);

  // Slope line midpoints
  const slope1929Mid = { x: xScaleLeft(1.1), y: yScaleLeft(500 * 1.1) };
  const slopeModernMid = { x: xScaleRight(50), y: yScaleRight(70 * 50) };

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, x),
    y: Math.max(0, y),
    width: Math.max(1, w),
    height: Math.max(1, h),
  });

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Hubble diagram: distance vs recession velocity, comparing Hubble 1929 and modern H₀ measurements"
    >
      <Group left={margin.left} top={margin.top}>

        {/* ── Panel labels ── */}
        <text
          x={leftPanelW / 2}
          y={-8}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          HUBBLE 1929
        </text>
        <text
          x={rightPanelX + rightPanelW / 2}
          y={-8}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          MODERN (DISTANCE LADDER)
        </text>

        {/* ── Divider ── */}
        <g data-data-layer="true">
          <line
            x1={leftPanelW + dividerWidth / 2}
            x2={leftPanelW + dividerWidth / 2}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeDasharray="3 3"
          />
          <text
            x={leftPanelW + dividerWidth / 2}
            y={ih / 2 - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
            transform={`rotate(-90, ${leftPanelW + dividerWidth / 2}, ${ih / 2 - 8})`}
          >
            AXIS BREAK
          </text>
        </g>

        {/* ════════════════════════════════════════════
            LEFT PANEL — Hubble 1929
        ════════════════════════════════════════════ */}
        <g>
          {/* Gridlines */}
          <g data-data-layer="true">
            {yTicksLeft.map((t) => (
              <line
                key={`lg-${t}`}
                x1={0}
                x2={leftPanelW}
                y1={yScaleLeft(t)}
                y2={yScaleLeft(t)}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
            ))}
            {/* zero velocity line */}
            <line
              x1={0}
              x2={leftPanelW}
              y1={yScaleLeft(0)}
              y2={yScaleLeft(0)}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
            />
          </g>

          {/* Hubble 1929 best-fit line (H₀ ≈ 500) */}
          <ExplainAnchor
            selector="hubble-1929-slope"
            index={3}
            pin={{ x: slope1929Mid.x + 10, y: slope1929Mid.y - 14 }}
            rect={clampRect(xScaleLeft(0.6), yScaleLeft(600), xScaleLeft(1.8) - xScaleLeft(0.6), yScaleLeft(200) - yScaleLeft(600))}
          >
            <g data-data-layer="true">
              <Line
                from={h1929Line[0]}
                to={h1929Line[1]}
                stroke="var(--color-ink)"
                strokeWidth={1.4}
                strokeDasharray="5 3"
              />
              <text
                x={xScaleLeft(0.7)}
                y={yScaleLeft(500 * 0.7) - 7}
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink)"
              >
                H₀ ≈ 500
              </text>
            </g>
          </ExplainAnchor>

          {/* Hubble 1929 data points */}
          <g data-data-layer="true">
            {HUBBLE_1929.map((d, i) => (
              <circle
                key={`h29-${i}`}
                cx={xScaleLeft(d.dist)}
                cy={yScaleLeft(d.vel)}
                r={2.8}
                fill="var(--color-ink)"
                opacity={0.75}
              />
            ))}
          </g>

          {/* Hubble 1929 data point anchor */}
          <ExplainAnchor
            selector="hubble-1929-point"
            index={1}
            pin={{ x: p1929X + 14, y: p1929Y - 12 }}
            rect={clampRect(p1929X - 8, p1929Y - 8, 16, 16)}
          >
            <g />
          </ExplainAnchor>

          {/* Left x-axis */}
          <ExplainAnchor
            selector="x-axis"
            index={5}
            pin={{ x: leftPanelW / 2, y: ih + 32 }}
            rect={{ x: 0, y: ih, width: leftPanelW, height: margin.bottom }}
          >
            <line x1={0} x2={leftPanelW} y1={ih} y2={ih} stroke="var(--color-ink-mute)" />
            {xScaleLeft.ticks(4).map((t) => {
              const tx = xScaleLeft(t);
              return (
                <g key={`xt-${t}`}>
                  <line x1={tx} x2={tx} y1={ih} y2={ih + 4} stroke="var(--color-ink-mute)" />
                  <text
                    x={tx}
                    y={ih + 14}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {t}
                  </text>
                </g>
              );
            })}
          </ExplainAnchor>
        </g>

        {/* ════════════════════════════════════════════
            RIGHT PANEL — Modern distance ladder
        ════════════════════════════════════════════ */}
        <g transform={`translate(${rightPanelX}, 0)`}>
          {/* Gridlines */}
          <g data-data-layer="true">
            {yTicksRight.map((t) => (
              <line
                key={`rg-${t}`}
                x1={0}
                x2={rightPanelW}
                y1={yScaleRight(t)}
                y2={yScaleRight(t)}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
            ))}
          </g>

          {/* Modern best-fit line (H₀ ≈ 70) */}
          <ExplainAnchor
            selector="modern-slope"
            index={4}
            pin={{ x: slopeModernMid.x + 10, y: slopeModernMid.y - 14 }}
            rect={clampRect(xScaleRight(30), yScaleRight(4000), xScaleRight(70) - xScaleRight(30), yScaleRight(1500) - yScaleRight(4000))}
          >
            <g data-data-layer="true">
              <Line
                from={modernLine[0]}
                to={modernLine[1]}
                stroke="var(--color-ink-mute)"
                strokeWidth={1.4}
                strokeDasharray="5 3"
              />
              <text
                x={xScaleRight(40)}
                y={yScaleRight(70 * 40) - 7}
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink-mute)"
              >
                H₀ ≈ 70
              </text>
            </g>
          </ExplainAnchor>

          {/* Modern data points */}
          <g data-data-layer="true">
            {MODERN.map((d, i) => (
              <circle
                key={`mod-${i}`}
                cx={xScaleRight(d.dist)}
                cy={yScaleRight(d.vel)}
                r={2.8}
                fill="var(--color-ink)"
                opacity={0.45}
              />
            ))}
          </g>

          {/* Modern data point anchor */}
          <ExplainAnchor
            selector="modern-point"
            index={2}
            pin={{ x: pModernX + 14, y: pModernY - 12 }}
            rect={clampRect(pModernX - 8, pModernY - 8, 16, 16)}
          >
            <g />
          </ExplainAnchor>

          {/* Right x-axis */}
          <line x1={0} x2={rightPanelW} y1={ih} y2={ih} stroke="var(--color-ink-mute)" />
          {xScaleRight.ticks(5).map((t) => {
            const tx = xScaleRight(t);
            return (
              <g key={`rxt-${t}`}>
                <line x1={tx} x2={tx} y1={ih} y2={ih + 4} stroke="var(--color-ink-mute)" />
                <text
                  x={tx}
                  y={ih + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {t}
                </text>
              </g>
            );
          })}
        </g>

        {/* ── Shared x-axis label ── */}
        <text
          x={totalIW / 2}
          y={ih + 38}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          DISTANCE (Mpc)
        </text>

        {/* ── Y-axis (left panel) ── */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScaleLeft}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-margin.left + 4}
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            VELOCITY (km/s)
          </text>
        </ExplainAnchor>

        {/* ── Origin anchor ── */}
        <ExplainAnchor
          selector="origin"
          index={7}
          pin={{ x: -10, y: yScaleLeft(0) + 12 }}
          rect={clampRect(0, yScaleLeft(100), 30, yScaleLeft(-100) - yScaleLeft(100))}
        >
          <g data-data-layer="true">
            <circle
              cx={xScaleLeft(0)}
              cy={yScaleLeft(0)}
              r={3}
              fill="none"
              stroke="var(--color-ink-mute)"
              strokeWidth={1.2}
            />
          </g>
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
