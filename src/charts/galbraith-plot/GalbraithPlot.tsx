"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Galbraith Radial Plot (Galbraith 1988, Technometrics 30(3))
//
// For n measurements θᵢ ± σᵢ, plot the point (1/σᵢ, (θᵢ − θ̄)/σᵢ).
// x-axis: precision (1/σ)
// y-axis: standardised estimate (z-score relative to weighted mean θ̄)
//
// Key properties:
//   – Concordant measurements fall on radial lines close to y = 0.
//   – Discordant outliers appear off the central radial direction.
//   – A right-side "data scale" arc converts radial angle to θ value.
//   – Reference dashed lines at y = ±2 mark the ±2σ concordance band.
//
// Data story: 12 fission-track single-grain ages (Ma).
// ---------------------------------------------------------------------------

type Grain = {
  id: number;
  age: number; // Ma
  sigma: number; // Ma (1-sigma analytical uncertainty)
};

// 10 concordant grains near ~200 Ma, 2 outliers (~500 Ma, ~800 Ma).
// Precision (1/σ) deliberately varies to spread grains along x-axis.
const GRAINS: ReadonlyArray<Grain> = [
  { id: 1,  age: 195, sigma: 18 },
  { id: 2,  age: 202, sigma: 22 },
  { id: 3,  age: 198, sigma: 14 },
  { id: 4,  age: 210, sigma: 30 },
  { id: 5,  age: 188, sigma: 12 },
  { id: 6,  age: 205, sigma: 25 },
  { id: 7,  age: 197, sigma: 16 },
  { id: 8,  age: 215, sigma: 35 },
  { id: 9,  age: 193, sigma: 20 },
  { id: 10, age: 200, sigma: 28 },
  // Discordant outliers
  { id: 11, age: 495, sigma: 45 },  // ~500 Ma old grain
  { id: 12, age: 790, sigma: 70 },  // ~800 Ma inherited grain
];

// Precision-weighted mean: θ̄ = Σ(θᵢ/σᵢ²) / Σ(1/σᵢ²)
function weightedMean(grains: ReadonlyArray<Grain>): number {
  let num = 0;
  let den = 0;
  for (const g of grains) {
    const w = 1 / (g.sigma * g.sigma);
    num += w * g.age;
    den += w;
  }
  return num / den;
}

const THETA_BAR = weightedMean(GRAINS);

// Derived plot coordinates.
type PlotPoint = {
  id: number;
  prec: number;       // 1/σ  (x)
  z: number;          // (θ − θ̄)/σ  (y)
  age: number;        // raw age (for labels)
  outlier: boolean;
};

const POINTS: ReadonlyArray<PlotPoint> = GRAINS.map((g) => ({
  id: g.id,
  prec: 1 / g.sigma,
  z: (g.age - THETA_BAR) / g.sigma,
  age: g.age,
  outlier: g.id >= 11,
}));

// Data-scale arc: for a given θ value the radial line from the origin has
// slope  (θ − θ̄) / (σ · (1/σ)) = (θ − θ̄)  per unit of  1/σ.
// At x = xMax, the data-scale arc maps θ → y = (θ − θ̄) · xMax.
// We'll draw the arc at x = xMax with ticks for selected θ values.

interface Props {
  width: number;
  height: number;
}

export function GalbraithPlot({ width, height }: Props) {
  const margin = { top: 24, right: 72, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const precValues = POINTS.map((p) => p.prec);
  const xMax = Math.max(...precValues);
  const xPad = xMax * 0.12;

  const xScale = scaleLinear({
    domain: [0, xMax + xPad],
    range: [0, iw],
    nice: false,
  });

  // y range: include all z values plus room for ±2 lines
  const zValues = POINTS.map((p) => p.z);
  const yLo = Math.min(-2.5, Math.min(...zValues) - 0.3);
  const yHi = Math.max(2.5, Math.max(...zValues) + 0.3);

  const yScale = scaleLinear({
    domain: [yLo, yHi],
    range: [ih, 0],
    nice: false,
  });

  // ── ±2σ reference lines ──────────────────────────────────────────────────
  const y2pos = yScale(2);
  const y2neg = yScale(-2);

  // ── Data-scale arc on right edge ──────────────────────────────────────────
  // The arc is a vertical line (or slight arc) at x = xMax showing what θ
  // value each radial slope from the origin corresponds to.
  // For a radial line through (xPx, yPx), slope = yPx/xPx → θ = θ̄ + slope.
  // At the right edge xPx = xScale(xMax + xPad) ≈ iw.
  // To draw the data-scale arc we mark θ values at 100 Ma steps.

  const arcX = iw + 4; // just to the right of the plot
  const thetaTicks = [100, 200, 300, 400, 500, 600, 700, 800];
  const arcTicks = thetaTicks.map((theta) => {
    const slope = (theta - THETA_BAR) / 1; // z = (θ − θ̄)/σ → at 1/σ = xMax_plot
    // The y position on the data-scale arc = yScale( slope * xScale.invert(arcX) )
    // But the arc is a straight line from origin, so: y = slope → yPx = yScale(slope)
    // ... actually the radial line at slope s hits x=arcX at y=yScale(s)
    const yPx = yScale(slope);
    return { theta, yPx, inRange: yPx >= 0 && yPx <= ih };
  });

  // ── Representative concordant and outlier points ─────────────────────────
  const concordantRep = POINTS.find((p) => !p.outlier && p.id === 5)!; // grain 5, high precision
  const outlierRep = POINTS.find((p) => p.outlier && p.id === 12)!;    // ~800 Ma

  const crX = xScale(concordantRep.prec);
  const crY = yScale(concordantRep.z);
  const orX = xScale(outlierRep.prec);
  const orY = yScale(outlierRep.z);

  // ── Common-age radial line from origin through (xMax, 0) ─────────────────
  // When θᵢ = θ̄, z = 0 → horizontal line y = 0.
  const y0 = yScale(0);

  return (
    <svg width={width} height={height} role="img" aria-label="Galbraith radial plot">
      <Group left={margin.left} top={margin.top}>
        {/* ── Background grid ── */}
        <g data-data-layer="true">
          {yScale.ticks(6).map((t) => (
            <line
              key={`grid-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.6}
            />
          ))}
        </g>

        {/* ── ±2σ reference lines ── */}
        <ExplainAnchor
          selector="sigma-lines"
          index={2}
          pin={{ x: iw - 8, y: Math.max(0, y2pos - 10) }}
          rect={{ x: 0, y: Math.max(0, y2pos - 3), width: iw, height: Math.max(1, y2neg - y2pos + 6) }}
        >
          <g data-data-layer="true">
            <line
              x1={0} x2={iw}
              y1={y2pos} y2={y2pos}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <line
              x1={0} x2={iw}
              y1={y2neg} y2={y2neg}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={y2pos - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={8.5}
              fill="var(--color-ink-mute)"
            >
              +2σ
            </text>
            <text
              x={iw - 2}
              y={y2neg + 10}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={8.5}
              fill="var(--color-ink-mute)"
            >
              −2σ
            </text>
          </g>
        </ExplainAnchor>

        {/* ── Common-age radial line (y = 0, central direction) ── */}
        <ExplainAnchor
          selector="common-age-line"
          index={5}
          pin={{ x: iw / 2, y: Math.max(0, y0 - 10) }}
          rect={{ x: 0, y: Math.max(0, y0 - 4), width: iw, height: 8 }}
        >
          <line
            x1={0} x2={iw}
            y1={y0} y2={y0}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* ── Data-scale arc (right side) ── */}
        <ExplainAnchor
          selector="data-scale-arc"
          index={3}
          pin={{ x: Math.min(iw - 2, iw + margin.right - 8), y: ih / 2 }}
          rect={{ x: iw, y: 0, width: margin.right, height: ih }}
        >
          <g>
            {/* Vertical line representing the arc */}
            <line
              x1={iw + 2} x2={iw + 2}
              y1={0} y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              data-data-layer="true"
            />
            {/* Tick marks and labels for each θ value */}
            {arcTicks.filter((t) => t.inRange).map(({ theta, yPx }) => (
              <g key={`arc-tick-${theta}`}>
                <line
                  x1={iw + 2} x2={iw + 8}
                  y1={yPx} y2={yPx}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                />
                <text
                  x={iw + 12}
                  y={yPx + 1}
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {theta}
                </text>
              </g>
            ))}
            <text
              x={iw + 36}
              y={-10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8.5}
              fill="var(--color-ink-mute)"
            >
              Ma
            </text>
          </g>
        </ExplainAnchor>

        {/* ── Radial lines from origin to each point (visual guide) ── */}
        <g data-data-layer="true" opacity={0.15}>
          {POINTS.map((p) => (
            <line
              key={`ray-${p.id}`}
              x1={0} y1={y0}
              x2={xScale(p.prec)}
              y2={yScale(p.z)}
              stroke="var(--color-ink)"
              strokeWidth={0.6}
            />
          ))}
        </g>

        {/* ── All data points ── */}
        <g data-data-layer="true">
          {POINTS.map((p) => (
            <circle
              key={`pt-${p.id}`}
              cx={xScale(p.prec)}
              cy={yScale(p.z)}
              r={p.outlier ? 4 : 3}
              fill="var(--color-ink)"
              fillOpacity={p.outlier ? 1 : 0.75}
            />
          ))}
        </g>

        {/* ── Anchor 4: concordant point ── */}
        <ExplainAnchor
          selector="concordant-point"
          index={4}
          pin={{ x: Math.min(iw - 4, crX + 10), y: Math.max(4, crY - 10) }}
          rect={{ x: Math.max(0, crX - 6), y: Math.max(0, crY - 6), width: 12, height: 12 }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 6: outlier point ── */}
        <ExplainAnchor
          selector="outlier-point"
          index={6}
          pin={{ x: Math.min(iw - 4, orX + 10), y: Math.max(4, orY - 10) }}
          rect={{ x: Math.max(0, orX - 6), y: Math.max(0, orY - 6), width: 12, height: 12 }}
        >
          <g />
        </ExplainAnchor>

        {/* ── X-axis ── */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v).toFixed(2)}`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            1/σᵢ  (PRECISION)
          </text>
        </ExplainAnchor>

        {/* ── Y-axis ── */}
        <AxisLeft
          scale={yScale}
          numTicks={6}
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
          x={-ih / 2}
          y={-44}
          transform="rotate(-90)"
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          (θᵢ − θ̄) / σᵢ
        </text>
      </Group>
    </svg>
  );
}
