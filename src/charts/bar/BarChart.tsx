"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { city: string; rent: number };

// Median monthly rent, approx 2024, USD — top 10 US metros.
const DATA: ReadonlyArray<Row> = [
  { city: "New York", rent: 3500 },
  { city: "San Francisco", rent: 3200 },
  { city: "Boston", rent: 3000 },
  { city: "Los Angeles", rent: 2800 },
  { city: "Miami", rent: 2500 },
  { city: "Seattle", rent: 2300 },
  { city: "Denver", rent: 1950 },
  { city: "Austin", rent: 1900 },
  { city: "Chicago", rent: 1800 },
  { city: "Atlanta", rent: 1700 },
];

// Short axis labels so the categorical axis stays legible at tile scale.
const SHORT_LABEL: Record<string, string> = {
  "New York": "NYC",
  "San Francisco": "SF",
  "Boston": "BOS",
  "Los Angeles": "LA",
  "Miami": "MIA",
  "Seattle": "SEA",
  "Denver": "DEN",
  "Austin": "AUS",
  "Chicago": "CHI",
  "Atlanta": "ATL",
};

interface Props {
  width: number;
  height: number;
}

export function BarChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 48, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.city),
    range: [0, iw],
    padding: 0.28,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 4000],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);
  const bw = xScale.bandwidth();

  // Representative bar: the tallest (New York).
  const highlight = DATA[0];
  const highlightX = xScale(highlight.city) ?? 0;
  const highlightY = yScale(highlight.rent);

  return (
    <svg width={width} height={height} role="img" aria-label="Bar chart">
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
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Gridline anchor (representative mid-line) */}
        <ExplainAnchor
          selector="gridline"
          index={5}
          pin={{ x: iw + 12, y: yScale(2000) }}
          rect={{ x: 0, y: yScale(2000) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Bars */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = xScale(d.city) ?? 0;
            const y = yScale(d.rent);
            return (
              <Bar
                key={d.city}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Representative bar anchor */}
        <ExplainAnchor
          selector="bar"
          index={1}
          pin={{ x: highlightX + bw / 2, y: highlightY - 18 }}
          rect={{ x: highlightX, y: highlightY, width: bw, height: ih - highlightY }}
        >
          <g />
        </ExplainAnchor>

        {/* Baseline (zero line) — emphasised stroke on top of the gridline */}
        <ExplainAnchor
          selector="baseline"
          index={4}
          pin={{ x: iw - 10, y: ih + 14 }}
          rect={{ x: 0, y: ih - 3, width: iw, height: 6 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* X-axis (categorical) */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => SHORT_LABEL[v as string] ?? (v as string)}
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

        {/* Y-axis (value) */}
        <ExplainAnchor
          selector="y-axis"
          index={3}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `$${Number(v) / 1000}k`}
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
        </ExplainAnchor>

        {/* Y-axis label */}
        <ExplainAnchor
          selector="axis-label"
          index={6}
          pin={{ x: -44, y: -6 }}
        >
          <text
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            USD / MONTH
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
