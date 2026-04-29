"use client";

import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Strong-acid + strong-base: 25 mL of 0.1 M HCl titrated by 0.1 M NaOH.
// Hand-tabulated (volume mL, pH) pairs.
const STRONG_STRONG: ReadonlyArray<{ v: number; ph: number }> = [
  { v: 0, ph: 1.0 },
  { v: 5, ph: 1.3 },
  { v: 10, ph: 1.5 },
  { v: 15, ph: 1.8 },
  { v: 20, ph: 2.3 },
  { v: 23, ph: 2.9 },
  { v: 24, ph: 3.3 },
  { v: 24.5, ph: 3.7 },
  { v: 24.9, ph: 4.3 },
  { v: 25.0, ph: 7.0 },
  { v: 25.1, ph: 9.7 },
  { v: 25.5, ph: 10.3 },
  { v: 26, ph: 10.7 },
  { v: 27, ph: 11.1 },
  { v: 30, ph: 11.7 },
  { v: 40, ph: 12.2 },
  { v: 50, ph: 12.5 },
];

// Weak-acid + strong-base: 0.1 M acetic acid (pKa ≈ 4.76) + 0.1 M NaOH.
// Equivalence point at pH ≈ 8.7 (conjugate base dominant).
const WEAK_STRONG: ReadonlyArray<{ v: number; ph: number }> = [
  { v: 0, ph: 2.9 },
  { v: 5, ph: 4.1 },
  { v: 10, ph: 4.56 },
  { v: 12.5, ph: 4.76 },
  { v: 15, ph: 4.96 },
  { v: 20, ph: 5.36 },
  { v: 23, ph: 6.0 },
  { v: 24, ph: 6.5 },
  { v: 24.9, ph: 7.5 },
  { v: 25.0, ph: 8.7 },
  { v: 25.1, ph: 10.0 },
  { v: 26, ph: 10.7 },
  { v: 30, ph: 11.3 },
  { v: 40, ph: 11.9 },
  { v: 50, ph: 12.3 },
];

interface Props {
  width: number;
  height: number;
}

export function TitrationCurve({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 50], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 14], range: [ih, 0] });

  // Equivalence point at v = 25 mL
  const eqX = xScale(25);
  const eqY7 = yScale(7);

  // Half-equivalence point for weak-strong at v = 12.5 mL, pH = pKa ≈ 4.76
  const halfEqX = xScale(12.5);
  const halfEqY = yScale(4.76);

  // Buffer region: roughly v = 5–23 mL for the weak-acid curve
  const bufferMidX = xScale(12);
  const bufferMidY = yScale(4.5);

  // Excess-base plateau: v = 35–50 mL, pH ≈ 11.5–12.5
  const plateauX = xScale(38);
  const plateauY = yScale(12.0);

  return (
    <svg width={width} height={height} role="img" aria-label="Titration curve">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(7).map((t) => (
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

        {/* Equivalence-point dashed vertical line */}
        <g data-data-layer="true">
          <line
            x1={eqX}
            y1={0}
            x2={eqX}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.55}
          />
          {/* Equivalence point annotation */}
          <text
            x={eqX + 4}
            y={yScale(7) - 8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            equivalence
          </text>
          <text
            x={eqX + 4}
            y={yScale(7) + 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            point (pH 7)
          </text>
        </g>

        {/* Weak-acid curve (lower curve) */}
        <ExplainAnchor
          selector="weak-acid-curve"
          index={3}
          pin={{ x: xScale(18), y: yScale(5.5) - 16 }}
          rect={{ x: xScale(5), y: yScale(9), width: xScale(24) - xScale(5), height: yScale(3) - yScale(9) }}
        >
          <LinePath
            data={WEAK_STRONG as { v: number; ph: number }[]}
            x={(d) => xScale(d.v)}
            y={(d) => yScale(d.ph)}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="6 3"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Strong-acid curve (main curve) */}
        <ExplainAnchor
          selector="strong-acid-curve"
          index={2}
          pin={{ x: xScale(20), y: yScale(3.5) - 16 }}
          rect={{ x: xScale(10), y: yScale(12), width: xScale(30) - xScale(10), height: yScale(1) - yScale(12) }}
        >
          <LinePath
            data={STRONG_STRONG as { v: number; ph: number }[]}
            x={(d) => xScale(d.v)}
            y={(d) => yScale(d.ph)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Half-equivalence pKa reading on weak-acid curve */}
        <ExplainAnchor
          selector="half-equivalence"
          index={4}
          pin={{ x: halfEqX + 14, y: halfEqY - 14 }}
          rect={{ x: Math.max(0, halfEqX - 10), y: Math.max(0, halfEqY - 10), width: 20, height: 20 }}
        >
          <g data-data-layer="true">
            <circle
              cx={halfEqX}
              cy={halfEqY}
              r={4}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <text
              x={halfEqX - 4}
              y={halfEqY - 10}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
              textAnchor="end"
            >
              pKa ≈ 4.76
            </text>
          </g>
        </ExplainAnchor>

        {/* Equivalence point marker + anchor */}
        <ExplainAnchor
          selector="equivalence-point"
          index={5}
          pin={{ x: eqX - 20, y: eqY7 - 16 }}
          rect={{ x: Math.max(0, eqX - 8), y: Math.max(0, eqY7 - 8), width: 16, height: 16 }}
        >
          <g data-data-layer="true">
            <circle
              cx={eqX}
              cy={eqY7}
              r={4}
              fill="var(--color-ink)"
            />
          </g>
        </ExplainAnchor>

        {/* Excess-base plateau anchor */}
        <ExplainAnchor
          selector="excess-base-plateau"
          index={6}
          pin={{ x: plateauX, y: plateauY - 14 }}
          rect={{ x: xScale(30), y: yScale(13), width: Math.max(0, iw - xScale(30)), height: yScale(11) - yScale(13) }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TITRANT ADDED (mL)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={7}
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            pH
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
