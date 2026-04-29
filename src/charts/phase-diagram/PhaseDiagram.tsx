"use client";

import { Group } from "@visx/group";
import { scaleLinear, scaleLog } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Temperature (K) on x, pressure (Pa) on log y.
// Water's three key landmarks:
//   Triple point:  T = 273.16 K,  P = 611.657 Pa
//   Critical point: T = 647.1 K,  P = 22.064 MPa = 2.2064e7 Pa
//   Melting anomaly: curve leans LEFT (negative dP/dT) above the triple point.
// The three boundary curves are hand-rolled for visual fidelity, not
// thermodynamic precision.

const TRIPLE: readonly [number, number] = [273.16, 611.657];
const CRITICAL: readonly [number, number] = [647.1, 2.2064e7];

// Sublimation curve (solid/gas): rises sharply from low-T, low-P up to triple
// point. Exponential-like shape — a handful of hand-picked points suffice.
const SUBLIMATION: ReadonlyArray<[number, number]> = [
  [200, 0.16],
  [220, 3.0],
  [240, 27],
  [255, 100],
  [265, 260],
  [270, 450],
  [TRIPLE[0], TRIPLE[1]],
];

// Melting curve (solid/liquid): very steep, leans slightly LEFT going up
// (water's anomaly — negative dP/dT). Anchored at the triple point.
const MELTING: ReadonlyArray<[number, number]> = [
  [TRIPLE[0], TRIPLE[1]],
  [273.13, 1.0e4],
  [273.08, 1.0e5],
  [273.0, 5.0e5],
  [272.9, 2.0e6],
  [272.7, 1.0e7],
  [272.5, 1.0e8],
];

// Vaporisation curve (liquid/gas): Clausius-Clapeyron-ish, from triple
// point up to the critical point.
const VAPORISATION: ReadonlyArray<[number, number]> = [
  [TRIPLE[0], TRIPLE[1]],
  [300, 3.5e3],
  [323, 1.2e4],
  [353, 4.7e4],
  [373.15, 1.013e5],
  [400, 2.5e5],
  [450, 9.3e5],
  [500, 2.6e6],
  [550, 6.1e6],
  [600, 1.25e7],
  [630, 1.85e7],
  [CRITICAL[0], CRITICAL[1]],
];

export function PhaseDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [200, 700], range: [0, iw] });
  const yScale = scaleLog({ domain: [100, 1e8], range: [ih, 0], base: 10 });

  // Convert a (T, P) series to an SVG polyline "x,y x,y …" string.
  const toPoints = (pts: ReadonlyArray<[number, number]>) =>
    pts.map(([T, P]) => `${xScale(T).toFixed(2)},${yScale(P).toFixed(2)}`).join(" ");

  // Region label positions, chosen inside each polygon visually.
  const solidLabel = { x: xScale(235), y: yScale(3e6) };
  const liquidLabel = { x: xScale(400), y: yScale(3e6) };
  const gasLabel = { x: xScale(500), y: yScale(3e3) };

  const tripleXY = { x: xScale(TRIPLE[0]), y: yScale(TRIPLE[1]) };
  const criticalXY = { x: xScale(CRITICAL[0]), y: yScale(CRITICAL[1]) };

  // Region-shading polygons — built from the boundary curves plus the plot
  // corners. Ordered so the shaded polygons tile the plot rect.
  const topLeft: [number, number] = [200, 1e8];
  const topRight: [number, number] = [700, 1e8];
  const bottomLeft: [number, number] = [200, 100];
  const bottomRight: [number, number] = [700, 100];

  // Solid (ice): top-left of melting curve + above sublimation curve.
  //   top-left corner → down the melting curve (reversed, top-down) → along
  //   sublimation curve (reversed, triple → low-T) → back to top-left.
  const solidPoly: ReadonlyArray<[number, number]> = [
    topLeft,
    ...MELTING.slice().reverse(),
    ...SUBLIMATION.slice().reverse(),
  ];

  // Liquid: bounded by melting curve (left), top edge, right edge down to
  // the critical point, and vaporisation curve back down to the triple point.
  const liquidPoly: ReadonlyArray<[number, number]> = [
    ...MELTING,
    topRight,
    [CRITICAL[0], 1e8],
    ...VAPORISATION.slice().reverse(),
  ];

  // Gas: below sublimation + vaporisation curves, to the right of the
  // critical point for the supercritical wedge we're ignoring at this scale.
  const gasPoly: ReadonlyArray<[number, number]> = [
    bottomLeft,
    ...SUBLIMATION,
    ...VAPORISATION,
    [CRITICAL[0], 100],
    bottomRight,
  ];

  // Anchor rects — clamp every rect to the plot area.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => ({
    x: Math.max(0, Math.min(iw, r.x)),
    y: Math.max(0, Math.min(ih, r.y)),
    width: Math.max(0, Math.min(iw - Math.max(0, Math.min(iw, r.x)), r.width)),
    height: Math.max(0, Math.min(ih - Math.max(0, Math.min(ih, r.y)), r.height)),
  });

  // Melting-curve anomaly — pin on the curve mid-way up.
  const meltingMid = MELTING[3]; // [273.0, 5e5]
  const meltingMidXY = { x: xScale(meltingMid[0]), y: yScale(meltingMid[1]) };

  // Vaporisation anchor — pick a point mid-curve for hover.
  const vapMid = VAPORISATION[4]; // boiling point at 1 atm
  const vapMidXY = { x: xScale(vapMid[0]), y: yScale(vapMid[1]) };

  return (
    <svg width={width} height={height} role="img" aria-label="Phase diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Plot backdrop */}
        <rect x={0} y={0} width={iw} height={ih} fill="var(--color-surface)" />

        <g data-data-layer="true">
          {/* Solid region */}
          <polygon
            points={toPoints(solidPoly)}
            fill="var(--color-ink)"
            fillOpacity={0.14}
            stroke="none"
          />
          {/* Liquid region */}
          <polygon
            points={toPoints(liquidPoly)}
            fill="var(--color-ink)"
            fillOpacity={0.08}
            stroke="none"
          />
          {/* Gas region */}
          <polygon
            points={toPoints(gasPoly)}
            fill="var(--color-ink)"
            fillOpacity={0.03}
            stroke="none"
          />

          {/* Phase-boundary curves */}
          <polyline
            points={toPoints(SUBLIMATION)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={toPoints(MELTING)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <polyline
            points={toPoints(VAPORISATION)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Region labels */}
          <text
            x={solidLabel.x}
            y={solidLabel.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            SOLID
          </text>
          <text
            x={liquidLabel.x}
            y={liquidLabel.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            LIQUID
          </text>
          <text
            x={gasLabel.x}
            y={gasLabel.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            GAS
          </text>

          {/* Triple point marker */}
          <circle
            cx={tripleXY.x}
            cy={tripleXY.y}
            r={3.5}
            fill="var(--color-ink)"
          />
          {/* Critical point marker — hollow circle to distinguish */}
          <circle
            cx={criticalXY.x}
            cy={criticalXY.y}
            r={3.8}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
        </g>

        {/* Plot border */}
        <rect
          x={0}
          y={0}
          width={iw}
          height={ih}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={1}
        />

        {/* 1. Triple point */}
        <ExplainAnchor
          selector="triple-point"
          index={1}
          pin={{ x: Math.max(14, tripleXY.x - 26), y: Math.min(ih - 6, tripleXY.y + 16) }}
          rect={clamp({ x: tripleXY.x - 10, y: tripleXY.y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Solid region */}
        <ExplainAnchor
          selector="solid-region"
          index={2}
          pin={{ x: solidLabel.x, y: Math.max(16, solidLabel.y - 20) }}
          rect={clamp({
            x: 0,
            y: 0,
            width: Math.max(0, xScale(TRIPLE[0]) - 4),
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Liquid region */}
        <ExplainAnchor
          selector="liquid-region"
          index={3}
          pin={{ x: liquidLabel.x, y: Math.max(16, liquidLabel.y - 20) }}
          rect={clamp({
            x: Math.max(0, xScale(TRIPLE[0]) + 2),
            y: 0,
            width: Math.max(0, xScale(CRITICAL[0]) - xScale(TRIPLE[0]) - 4),
            height: Math.max(0, yScale(TRIPLE[1])),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Gas region */}
        <ExplainAnchor
          selector="gas-region"
          index={4}
          pin={{ x: gasLabel.x, y: Math.min(ih - 10, gasLabel.y + 20) }}
          rect={clamp({
            x: Math.max(0, xScale(TRIPLE[0])),
            y: Math.max(0, yScale(TRIPLE[1])),
            width: iw - Math.max(0, xScale(TRIPLE[0])),
            height: ih - Math.max(0, yScale(TRIPLE[1])),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Vaporisation curve (liquid → gas boundary) */}
        <ExplainAnchor
          selector="vaporisation-curve"
          index={5}
          pin={{ x: Math.min(iw - 14, vapMidXY.x + 30), y: Math.max(14, vapMidXY.y - 14) }}
          rect={clamp({
            x: Math.max(0, vapMidXY.x - 24),
            y: Math.max(0, vapMidXY.y - 10),
            width: 48,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Critical point */}
        <ExplainAnchor
          selector="critical-point"
          index={6}
          pin={{ x: Math.min(iw - 14, criticalXY.x + 22), y: Math.max(14, criticalXY.y - 14) }}
          rect={clamp({ x: criticalXY.x - 10, y: criticalXY.y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Melting-curve anomaly — water's negative dP/dT lean */}
        <ExplainAnchor
          selector="melting-anomaly"
          index={7}
          pin={{ x: Math.max(14, meltingMidXY.x - 42), y: meltingMidXY.y }}
          rect={clamp({
            x: Math.max(0, meltingMidXY.x - 10),
            y: Math.max(0, meltingMidXY.y - 40),
            width: 20,
            height: 80,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={6}
          tickFormat={(v) => String(v)}
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
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          TEMPERATURE (K)
        </text>

        {/* Y-axis (log pressure) */}
        <AxisLeft
          scale={yScale}
          numTicks={6}
          tickFormat={(v) => {
            const n = Number(v);
            const exp = Math.round(Math.log10(n));
            return `1e${exp}`;
          }}
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
          x={-margin.left + 6}
          y={-6}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          PRESSURE (Pa)
        </text>
      </Group>
    </svg>
  );
}

