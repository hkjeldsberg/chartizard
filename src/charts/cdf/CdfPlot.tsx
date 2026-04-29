"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Abramowitz & Stegun 7.1.26 approximation of erf — max error ~1.5e-7.
// Deterministic; no RNG needed because Φ(x) is analytical.
function erf(x: number): number {
  const sign = x < 0 ? -1 : 1;
  const ax = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * ax);
  const y =
    1 -
    ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-ax * ax);
  return sign * y;
}

// Standard normal CDF.
function phi(x: number): number {
  return 0.5 * (1 + erf(x / Math.SQRT2));
}

interface Props {
  width: number;
  height: number;
}

export function CdfPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const curve = useMemo(() => {
    const n = 201;
    const x0 = -3;
    const x1 = 3;
    const step = (x1 - x0) / (n - 1);
    const pts: { x: number; p: number }[] = [];
    for (let i = 0; i < n; i++) {
      const x = x0 + i * step;
      pts.push({ x, p: phi(x) });
    }
    return pts;
  }, []);

  const xScale = scaleLinear({ domain: [-3, 3], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const medianX = xScale(0);
  const medianY = yScale(0.5);

  // Lower-tail probe at x = -1 (P(X ≤ -1) ≈ 0.159)
  const tailX = xScale(-1);
  const tailY = yScale(phi(-1));

  // Upper-tail probe at x = +2 (P(X ≤ 2) ≈ 0.977)
  const topX = xScale(2);
  const topY = yScale(phi(2));

  return (
    <svg width={width} height={height} role="img" aria-label="CDF plot">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines at 0.25, 0.5, 0.75, 1 */}
        <g data-data-layer="true">
          {[0.25, 0.5, 0.75, 1].map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 1 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* The CDF curve itself */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: xScale(-1.6), y: yScale(phi(-1.6)) - 18 }}
          rect={{
            x: xScale(-2.5),
            y: yScale(0.98),
            width: xScale(2.5) - xScale(-2.5),
            height: yScale(0.02) - yScale(0.98),
          }}
        >
          <LinePath
            data={curve}
            x={(d) => xScale(d.x)}
            y={(d) => yScale(d.p)}
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            curve={curveMonotoneX}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Median crosshair at (0, 0.5) */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={medianX}
            y1={medianY}
            y2={medianY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <line
            x1={medianX}
            x2={medianX}
            y1={medianY}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <circle cx={medianX} cy={medianY} r={3.2} fill="var(--color-ink)" />
        </g>
        <ExplainAnchor
          selector="median"
          index={2}
          pin={{ x: medianX + 14, y: medianY - 14 }}
          rect={{
            x: medianX - 10,
            y: medianY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Lower-tail probe — P(X ≤ -1) */}
        <g data-data-layer="true">
          <circle cx={tailX} cy={tailY} r={2.6} fill="var(--color-ink-mute)" />
        </g>
        <ExplainAnchor
          selector="lower-tail"
          index={3}
          pin={{ x: tailX - 16, y: tailY + 18 }}
          rect={{
            x: tailX - 10,
            y: tailY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Upper plateau probe — P(X ≤ 2) */}
        <g data-data-layer="true">
          <circle cx={topX} cy={topY} r={2.6} fill="var(--color-ink-mute)" />
        </g>
        <ExplainAnchor
          selector="upper-plateau"
          index={4}
          pin={{ x: topX + 14, y: topY - 14 }}
          rect={{
            x: topX - 10,
            y: topY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={7}
            tickFormat={(v) => `${v}σ`}
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
            VALUE
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${(v as number).toFixed(2)}`}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            P(X ≤ x)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
