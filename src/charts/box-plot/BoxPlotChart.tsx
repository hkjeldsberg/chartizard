"use client";

import { useMemo } from "react";
import { Bar, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Real Olympic 100m-final winning times per decade, augmented with plausible
// silver/bronze/4th-place finalist times using a seeded LCG. Same dataset as
// the violin chart — the two charts render the same numbers differently on
// purpose.
const REAL_WINNERS: Record<string, number[]> = {
  "1920s": [10.8, 10.6, 10.8],
  "1930s": [10.3, 10.3],
  "1940s": [10.3, 10.4],
  "1950s": [10.4, 10.5],
  "1960s": [10.0, 9.95],
  "1970s": [10.14, 10.06],
  "1980s": [9.99, 9.92],
  "1990s": [9.96, 9.84, 9.87],
  "2000s": [9.87, 9.85, 9.69],
  "2010s": [9.63, 9.81],
  "2020s": [9.80, 9.79],
};

const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

// Rough decade-level field spread: earlier decades had wider fields.
const SPREAD: Record<string, { lo: number; hi: number; n: number }> = {
  "1920s": { lo: 10.6, hi: 11.1, n: 6 },
  "1930s": { lo: 10.3, hi: 10.8, n: 6 },
  "1940s": { lo: 10.3, hi: 10.8, n: 5 },
  "1950s": { lo: 10.4, hi: 10.7, n: 6 },
  "1960s": { lo: 10.0, hi: 10.3, n: 6 },
  "1970s": { lo: 10.06, hi: 10.35, n: 6 },
  "1980s": { lo: 9.95, hi: 10.25, n: 6 },
  "1990s": { lo: 9.87, hi: 10.15, n: 5 },
  "2000s": { lo: 9.85, hi: 10.10, n: 5 },
  "2010s": { lo: 9.75, hi: 10.05, n: 6 },
  "2020s": { lo: 9.80, hi: 10.05, n: 6 },
};

function buildDataset(): Record<string, number[]> {
  // Seeded LCG — deterministic across renders.
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const out: Record<string, number[]> = {};
  for (const decade of DECADES) {
    const winners = REAL_WINNERS[decade] ?? [];
    const spread = SPREAD[decade];
    const pool: number[] = [...winners];
    if (spread) {
      for (let i = 0; i < spread.n; i++) {
        const t = spread.lo + rand() * (spread.hi - spread.lo);
        // Two decimal places — matches how track times are reported.
        pool.push(Math.round(t * 100) / 100);
      }
    }
    out[decade] = pool.sort((a, b) => a - b);
  }
  return out;
}

interface Summary {
  decade: string;
  q1: number;
  median: number;
  q3: number;
  whiskerLo: number;
  whiskerHi: number;
  outliers: number[];
}

function quantile(sorted: number[], p: number): number {
  if (sorted.length === 0) return NaN;
  const pos = (sorted.length - 1) * p;
  const lo = Math.floor(pos);
  const hi = Math.ceil(pos);
  if (lo === hi) return sorted[lo] as number;
  const frac = pos - lo;
  return (sorted[lo] as number) * (1 - frac) + (sorted[hi] as number) * frac;
}

function summarize(decade: string, values: number[]): Summary {
  const s = [...values].sort((a, b) => a - b);
  const q1 = quantile(s, 0.25);
  const median = quantile(s, 0.5);
  const q3 = quantile(s, 0.75);
  const iqr = q3 - q1;
  const fenceLo = q1 - 1.5 * iqr;
  const fenceHi = q3 + 1.5 * iqr;
  const inFence = s.filter((v) => v >= fenceLo && v <= fenceHi);
  const whiskerLo = inFence.length > 0 ? (inFence[0] as number) : q1;
  const whiskerHi = inFence.length > 0 ? (inFence[inFence.length - 1] as number) : q3;
  const outliers = s.filter((v) => v < fenceLo || v > fenceHi);
  return { decade, q1, median, q3, whiskerLo, whiskerHi, outliers };
}

interface Props {
  width: number;
  height: number;
}

export function BoxPlotChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const summaries = useMemo<Summary[]>(() => {
    const data = buildDataset();
    return DECADES.map((d) => summarize(d, data[d] ?? []));
  }, []);

  const xScale = scaleBand<string>({
    domain: DECADES,
    range: [0, iw],
    padding: 0.32,
  });

  const yScale = scaleLinear<number>({
    domain: [9.4, 11.2],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const ticksY = yScale.ticks(5);

  // Representative decade for anchors — the 2000s box (Bolt era, carries
  // both a low median and a visible outlier).
  const highlight = summaries.find((s) => s.decade === "2000s") ?? summaries[0]!;
  const highlightX = (xScale(highlight.decade) ?? 0) + bw / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Box plot">
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

        {/* Boxes + whiskers */}
        <g data-data-layer="true">
          {summaries.map((s) => {
            const cx = (xScale(s.decade) ?? 0) + bw / 2;
            const x = xScale(s.decade) ?? 0;
            const yQ3 = yScale(s.q3);
            const yQ1 = yScale(s.q1);
            const yMed = yScale(s.median);
            const yHi = yScale(s.whiskerHi);
            const yLo = yScale(s.whiskerLo);
            return (
              <g key={s.decade}>
                {/* whisker upper (lower time = faster = higher on chart) */}
                <Line
                  from={{ x: cx, y: yHi }}
                  to={{ x: cx, y: yQ3 }}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                {/* whisker lower */}
                <Line
                  from={{ x: cx, y: yQ1 }}
                  to={{ x: cx, y: yLo }}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                {/* whisker caps */}
                <Line
                  from={{ x: cx - bw * 0.22, y: yHi }}
                  to={{ x: cx + bw * 0.22, y: yHi }}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <Line
                  from={{ x: cx - bw * 0.22, y: yLo }}
                  to={{ x: cx + bw * 0.22, y: yLo }}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                {/* IQR box */}
                <Bar
                  x={x}
                  y={yQ3}
                  width={bw}
                  height={yQ1 - yQ3}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                />
                {/* median line */}
                <Line
                  from={{ x: x, y: yMed }}
                  to={{ x: x + bw, y: yMed }}
                  stroke="var(--color-ink)"
                  strokeWidth={2}
                />
                {/* outliers */}
                {s.outliers.map((v, i) => (
                  <circle
                    key={i}
                    cx={cx}
                    cy={yScale(v)}
                    r={2}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1}
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* Median anchor — the horizontal line inside the 2000s box */}
        <ExplainAnchor
          selector="median-line"
          index={1}
          pin={{ x: highlightX + bw * 0.7, y: yScale(highlight.median) - 10 }}
          rect={{
            x: highlightX - bw / 2,
            y: yScale(highlight.median) - 4,
            width: bw,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* IQR-box anchor */}
        <ExplainAnchor
          selector="iqr-box"
          index={2}
          pin={{ x: highlightX - bw * 0.7, y: yScale((highlight.q1 + highlight.q3) / 2) }}
          rect={{
            x: highlightX - bw / 2,
            y: yScale(highlight.q3),
            width: bw,
            height: yScale(highlight.q1) - yScale(highlight.q3),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Whisker anchor — upper whisker of the 1920s box (widest spread) */}
        {(() => {
          const s = summaries[0]!;
          const cx = (xScale(s.decade) ?? 0) + bw / 2;
          const yHi = yScale(s.whiskerHi);
          const yQ3 = yScale(s.q3);
          return (
            <ExplainAnchor
              selector="whisker"
              index={3}
              pin={{ x: cx + bw * 0.7, y: (yHi + yQ3) / 2 }}
              rect={{
                x: cx - bw * 0.3,
                y: yHi - 4,
                width: bw * 0.6,
                height: yQ3 - yHi + 8,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => String(v).replace("s", "")}
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
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => Number(v).toFixed(1)}
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
            SECONDS
          </text>
        </ExplainAnchor>

        {/* Gridline anchor — representative mid-line at 10.0s */}
        <ExplainAnchor
          selector="gridline"
          index={6}
          pin={{ x: iw + 12, y: yScale(10.0) }}
          rect={{ x: 0, y: yScale(10.0) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
