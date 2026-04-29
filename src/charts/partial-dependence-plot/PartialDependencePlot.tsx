"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// PDP data-story: housing price model, feature = square footage (500–5000 sq ft).
// Shape: flat for low sq-ft, steep rise 1500–3000, plateau above 3500.
// Y = average predicted price in $thousands.

const PDP_POINTS: { x: number; y: number }[] = [
  { x: 500, y: 115 },
  { x: 750, y: 118 },
  { x: 1000, y: 122 },
  { x: 1250, y: 130 },
  { x: 1500, y: 148 },
  { x: 1750, y: 195 },
  { x: 2000, y: 280 },
  { x: 2250, y: 390 },
  { x: 2500, y: 510 },
  { x: 2750, y: 620 },
  { x: 3000, y: 700 },
  { x: 3250, y: 750 },
  { x: 3500, y: 775 },
  { x: 3750, y: 788 },
  { x: 4000, y: 795 },
  { x: 4250, y: 800 },
  { x: 4500, y: 803 },
  { x: 4750, y: 805 },
  { x: 5000, y: 806 },
];

// ICE lines: 20 individual trajectories with per-individual offsets and slopes.
// Seeded LCG so renders are deterministic.
function makeRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

const ICE_COUNT = 20;

function generateIceLines(): { x: number; y: number }[][] {
  const rand = makeRand(42);
  const lines: { x: number; y: number }[][] = [];
  for (let i = 0; i < ICE_COUNT; i++) {
    // Each ICE line = PDP curve shifted by an individual intercept + mild slope
    // perturbation. This mimics realistic heterogeneity.
    const intercept = gaussian(rand) * 60;
    const slopeMult = 0.6 + rand() * 0.8; // 0.6 to 1.4 slope multiplier
    const line = PDP_POINTS.map(({ x, y }) => {
      // Warp the plateau region slightly per individual
      const perturbedY = intercept + (y - 115) * slopeMult + 115;
      return { x, y: Math.max(60, Math.min(950, perturbedY)) };
    });
    lines.push(line);
  }
  return lines;
}

const ICE_LINES = generateIceLines();

// Inflection region: knee of the PDP curve around x=1500–3000
const KNEE_X_START = 1500;
const KNEE_X_END = 3000;

interface Props {
  width: number;
  height: number;
}

export function PartialDependencePlot({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 48, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = useMemo(
    () => scaleLinear({ domain: [500, 5000], range: [0, iw] }),
    [iw],
  );

  const yScale = useMemo(
    () => scaleLinear({ domain: [60, 880], range: [ih, 0], nice: true }),
    [ih],
  );

  const ticksY = yScale.ticks(5);

  // Knee / inflection region rect (x coords in SVG space)
  const kneeX1 = xScale(KNEE_X_START);
  const kneeX2 = xScale(KNEE_X_END);

  // PDP curve midpoint for pin placement
  const pdpMidX = xScale(2250);
  const pdpMidY = yScale(390);

  // ICE pin: near one of the outer ICE lines at x=2000
  const icePinX = xScale(2000);
  const iceLineY0 = yScale(ICE_LINES[0]?.find((p) => p.x === 2000)?.y ?? 280);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Partial Dependence Plot showing average predicted housing price vs. square footage"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Knee/inflection region highlight — extrapolation caveat at edges
            and the steep-rise zone in the middle */}
        <ExplainAnchor
          selector="inflection-region"
          index={5}
          pin={{ x: kneeX1 - 12, y: ih * 0.3 }}
          rect={{
            x: Math.max(0, kneeX1),
            y: 0,
            width: Math.min(iw, kneeX2) - Math.max(0, kneeX1),
            height: ih,
          }}
        >
          <rect
            x={Math.max(0, kneeX1)}
            y={0}
            width={Math.min(iw, kneeX2) - Math.max(0, kneeX1)}
            height={ih}
            fill="var(--color-ink)"
            fillOpacity={0.05}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* ICE lines — 20 individual conditional expectation trajectories */}
        <ExplainAnchor
          selector="ice-lines"
          index={2}
          pin={{ x: icePinX - 14, y: Math.max(0, iceLineY0 - 20) }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {ICE_LINES.map((line, i) => (
              <LinePath
                key={i}
                data={line}
                x={(d) => xScale(d.x)}
                y={(d) => yScale(d.y)}
                stroke="var(--color-ink)"
                strokeWidth={0.8}
                strokeOpacity={0.18}
                curve={curveMonotoneX}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* PDP average curve */}
        <ExplainAnchor
          selector="pdp-curve"
          index={1}
          pin={{ x: pdpMidX + 12, y: pdpMidY - 18 }}
          rect={{
            x: xScale(1800),
            y: yScale(650),
            width: xScale(3000) - xScale(1800),
            height: yScale(200) - yScale(650),
          }}
        >
          <LinePath
            data={PDP_POINTS}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.y)}
            stroke="var(--color-ink)"
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={3}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${Number(v) / 1000}k`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            SQUARE FOOTAGE
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -46, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `$${Number(v)}k`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-50}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PRED. PRICE
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
