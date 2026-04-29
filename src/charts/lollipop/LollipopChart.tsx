"use client";

import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { city: string; rent: number };

// Median monthly rent, approx 2024, USD — top 12 US metros.
// Sorted descending so the ranked-order anchor reads naturally.
const DATA: ReadonlyArray<Row> = [
  { city: "New York", rent: 3500 },
  { city: "San Francisco", rent: 3200 },
  { city: "Boston", rent: 3000 },
  { city: "Los Angeles", rent: 2800 },
  { city: "San Diego", rent: 2700 },
  { city: "Miami", rent: 2500 },
  { city: "Washington DC", rent: 2400 },
  { city: "Seattle", rent: 2300 },
  { city: "Denver", rent: 1950 },
  { city: "Austin", rent: 1900 },
  { city: "Chicago", rent: 1800 },
  { city: "Atlanta", rent: 1700 },
];

// Short axis labels — the full city names would crowd at tile scale.
const SHORT_LABEL: Record<string, string> = {
  "New York": "NYC",
  "San Francisco": "SF",
  "Boston": "BOS",
  "Los Angeles": "LA",
  "San Diego": "SD",
  "Miami": "MIA",
  "Washington DC": "DC",
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

export function LollipopChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 48, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.city),
    range: [0, iw],
    padding: 0.35,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 4000],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);
  const bw = xScale.bandwidth();

  // Representative lollipop: the tallest (New York).
  const headRow = DATA[0];
  const headX = (xScale(headRow.city) ?? 0) + bw / 2;
  const headY = yScale(headRow.rent);

  // Stem anchor target: the tallest stem (same as head's column).
  const stemRow = DATA[0];
  const stemX = (xScale(stemRow.city) ?? 0) + bw / 2;
  const stemYTop = yScale(stemRow.rent);

  // Category-axis anchor target: mid-chart category
  const midCityX = (xScale(DATA[Math.floor(DATA.length / 2)].city) ?? 0) + bw / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Lollipop plot">
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

        {/* Stems (lines from baseline to value) */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = (xScale(d.city) ?? 0) + bw / 2;
            const y = yScale(d.rent);
            return (
              <line
                key={d.city}
                x1={x}
                x2={x}
                y1={ih}
                y2={y}
                stroke="var(--color-ink-mute)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* Heads (circles at each value) */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = (xScale(d.city) ?? 0) + bw / 2;
            const y = yScale(d.rent);
            return (
              <circle
                key={d.city}
                cx={x}
                cy={y}
                r={5}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Anchor 1: lollipop-head — the circle carries the signal */}
        <ExplainAnchor
          selector="lollipop-head"
          index={1}
          pin={{ x: headX + 14, y: headY - 14 }}
          rect={{
            x: Math.max(0, headX - 9),
            y: Math.max(0, headY - 9),
            width: 18,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: stem — the thin line reference from baseline */}
        <ExplainAnchor
          selector="stem"
          index={2}
          pin={{ x: stemX - 18, y: (ih + stemYTop) / 2 }}
          rect={{
            x: Math.max(0, stemX - 4),
            y: stemYTop + 8,
            width: 8,
            height: Math.max(0, ih - stemYTop - 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: ranked-order — the descending sort. Rect sits in the top
            margin above the plot so it doesn't swallow hits meant for the
            head/stem anchors along the tallest column. Margin-space per §8. */}
        <ExplainAnchor
          selector="ranked-order"
          index={3}
          pin={{ x: iw / 2, y: -12 }}
          rect={{ x: 0, y: -margin.top + 4, width: iw, height: margin.top - 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Baseline (zero) — emphasised stroke on top of the gridline */}
        <ExplainAnchor
          selector="baseline"
          index={4}
          pin={{ x: iw - 10, y: ih + 14 }}
          rect={{ x: 0, y: Math.max(0, ih - 4), width: iw, height: 8 }}
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

        {/* Anchor 5: category-axis — x-axis with city tick labels */}
        <ExplainAnchor
          selector="category-axis"
          index={5}
          pin={{ x: midCityX, y: ih + 34 }}
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

        {/* Anchor 6: value-axis — y-axis with dollar ticks */}
        <ExplainAnchor
          selector="value-axis"
          index={6}
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
      </Group>
    </svg>
  );
}
