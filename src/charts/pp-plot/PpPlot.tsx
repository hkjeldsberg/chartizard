"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Seeded LCG → Box-Muller → 40 draws, then a small heavy-tail perturbation so
// extreme observations bend away from the diagonal — matching the PP-plot data
// story. Do not share this generator with other charts.
function generateSamples(n: number): number[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 1103515245 + 12345) % 2147483648;
    return seed / 2147483648;
  };
  const gauss = () => {
    const u = Math.max(1e-10, 1 - rand());
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const out: number[] = [];
  for (let i = 0; i < n; i++) {
    const z = gauss();
    // Heavy-tail perturbation: push extreme values further out, simulating
    // a distribution with slightly heavier tails than normal.
    const sign = z >= 0 ? 1 : -1;
    const abs = Math.abs(z);
    out.push(sign * (abs + 0.15 * Math.pow(abs, 2)));
  }
  return out;
}

// Standard normal CDF via Abramowitz & Stegun approximation (error < 7.5e-8).
function normalCDF(z: number): number {
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const poly =
    t *
    (0.319381530 +
      t *
        (-0.356563782 +
          t * (1.781477937 + t * (-1.821255978 + t * 1.330274429))));
  const cdf = 1 - (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z) * poly;
  return z >= 0 ? cdf : 1 - cdf;
}

interface Props {
  width: number;
  height: number;
}

export function PpPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { points, lowTailIdx, highTailIdx, centreIdx } = useMemo(() => {
    const raw = generateSamples(40);
    const sorted = [...raw].sort((a, b) => a - b);
    const n = sorted.length;
    // Empirical CDF using the (i + 0.5) / n plotting position.
    // Theoretical CDF is the standard normal applied to the standardised value.
    const mean = sorted.reduce((s, v) => s + v, 0) / n;
    const variance =
      sorted.reduce((s, v) => s + (v - mean) * (v - mean), 0) / (n - 1);
    const sd = Math.sqrt(variance);

    const pts = sorted.map((x, i) => {
      const empirical = (i + 0.5) / n;
      const z = (x - mean) / sd;
      const theoretical = normalCDF(z);
      return { empirical, theoretical };
    });

    // Low-tail anchor: first point that clearly bends below the diagonal
    const loIdx = 2;
    // High-tail anchor: last point that clearly bends above the diagonal
    const hiIdx = n - 3;
    // Centre: point closest to empirical = 0.5
    const cIdx = Math.round(0.5 * n) - 1;

    return {
      points: pts,
      lowTailIdx: loIdx,
      highTailIdx: hiIdx,
      centreIdx: cIdx,
    };
  }, []);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x0 = Math.max(0, r.x);
    const y0 = Math.max(0, r.y);
    const x1 = Math.min(iw, r.x + r.width);
    const y1 = Math.min(ih, r.y + r.height);
    return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) };
  };

  const loP = points[lowTailIdx];
  const hiP = points[highTailIdx];
  const cenP = points[centreIdx];

  // Representative middle point for the generic "one pair" anchor
  const repIdx = Math.round(0.3 * points.length);
  const repP = points[repIdx];

  return (
    <svg width={width} height={height} role="img" aria-label="P-P plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* 45° diagonal — perfect fit between empirical and theoretical CDF */}
        <ExplainAnchor
          selector="diagonal"
          index={1}
          pin={{ x: xScale(0.3), y: yScale(0.3) - 14 }}
          rect={clamp({
            x: xScale(0.1),
            y: yScale(0.9),
            width: xScale(0.8) - xScale(0.1),
            height: yScale(0.1) - yScale(0.9),
          })}
        >
          <g data-data-layer="true">
            <line
              x1={xScale(0)}
              y1={yScale(0)}
              x2={xScale(1)}
              y2={yScale(1)}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* All scatter points */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xScale(p.empirical)}
              cy={yScale(p.theoretical)}
              r={
                i === lowTailIdx ||
                i === highTailIdx ||
                i === centreIdx ||
                i === repIdx
                  ? 3.5
                  : 2.2
              }
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Representative point — generic one-pair explanation */}
        <ExplainAnchor
          selector="point"
          index={2}
          pin={{ x: xScale(repP.empirical) + 14, y: yScale(repP.theoretical) - 10 }}
          rect={clamp({
            x: xScale(repP.empirical) - 8,
            y: yScale(repP.theoretical) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Centre point — PP sensitivity in the centre vs QQ */}
        <ExplainAnchor
          selector="centre-sensitivity"
          index={3}
          pin={{ x: xScale(cenP.empirical) + 14, y: yScale(cenP.theoretical) - 14 }}
          rect={clamp({
            x: xScale(cenP.empirical) - 8,
            y: yScale(cenP.theoretical) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Deviation region — lower tail bends below the diagonal */}
        <g data-data-layer="true">
          <line
            x1={xScale(loP.empirical)}
            y1={yScale(loP.theoretical)}
            x2={xScale(loP.empirical)}
            y2={yScale(loP.empirical)}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 2"
          />
        </g>
        <ExplainAnchor
          selector="tail-deviation"
          index={4}
          pin={{ x: xScale(loP.empirical) - 18, y: (yScale(loP.theoretical) + yScale(loP.empirical)) / 2 }}
          rect={clamp({
            x: xScale(loP.empirical) - 8,
            y: Math.min(yScale(loP.theoretical), yScale(loP.empirical)) - 4,
            width: 16,
            height: Math.abs(yScale(loP.theoretical) - yScale(loP.empirical)) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — empirical CDF */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
            EMPIRICAL CDF
          </text>
        </ExplainAnchor>

        {/* Y-axis — theoretical CDF */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
            THEORETICAL CDF
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
