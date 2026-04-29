"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { language: string; speakers: number };

// Approx L1 speaker counts, millions. Sorted descending.
const DATA: ReadonlyArray<Row> = [
  { language: "Mandarin", speakers: 940 },
  { language: "Spanish", speakers: 485 },
  { language: "English", speakers: 380 },
  { language: "Hindi", speakers: 345 },
  { language: "Portuguese", speakers: 230 },
  { language: "Bengali", speakers: 230 },
  { language: "Russian", speakers: 150 },
  { language: "Japanese", speakers: 125 },
  { language: "Yue", speakers: 85 },
  { language: "Vietnamese", speakers: 82 },
  { language: "Turkish", speakers: 80 },
  { language: "Wu", speakers: 80 },
];

interface Props {
  width: number;
  height: number;
}

export function HorizontalBarChart({ width, height }: Props) {
  const margin = { top: 24, right: 40, bottom: 44, left: 86 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Value scale runs along x; category scale runs along y.
  const xScale = scaleLinear<number>({
    domain: [0, 1000],
    range: [0, iw],
    nice: true,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.language),
    range: [0, ih],
    padding: 0.25,
  });

  const ticksX = xScale.ticks(5);
  const bh = yScale.bandwidth();

  // Representative bar — the leader (Mandarin).
  const highlight = DATA[0];
  const highlightY = yScale(highlight.language) ?? 0;
  const highlightW = xScale(highlight.speakers);

  return (
    <svg width={width} height={height} role="img" aria-label="Horizontal bar graph">
      <Group left={margin.left} top={margin.top}>
        {/* Vertical gridlines */}
        <g data-data-layer="true">
          {ticksX.map((t) => (
            <line
              key={t}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Gridline anchor (mid-scale) */}
        <ExplainAnchor
          selector="gridline"
          index={5}
          pin={{ x: xScale(500), y: -10 }}
          rect={{ x: xScale(500) - 4, y: 0, width: 8, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Bars */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.language) ?? 0;
            const w = xScale(d.speakers);
            return (
              <Bar
                key={d.language}
                x={0}
                y={y}
                width={w}
                height={bh}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Value labels at the end of each bar */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.language) ?? 0;
            const w = xScale(d.speakers);
            return (
              <text
                key={d.language}
                x={w + 4}
                y={y + bh / 2}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {d.speakers}
              </text>
            );
          })}
        </g>

        {/* Representative bar anchor */}
        <ExplainAnchor
          selector="bar"
          index={1}
          pin={{ x: highlightW / 2, y: highlightY - 10 }}
          rect={{ x: 0, y: highlightY, width: highlightW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Value label anchor — the number sitting at the end of the top bar */}
        <ExplainAnchor
          selector="value-label"
          index={4}
          pin={{ x: highlightW + 26, y: highlightY + bh / 2 }}
          rect={{ x: highlightW, y: highlightY, width: 32, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Baseline — left edge that every bar grows from */}
        <ExplainAnchor
          selector="baseline"
          index={6}
          pin={{ x: -14, y: ih + 14 }}
          rect={{ x: -3, y: 0, width: 6, height: ih }}
        >
          <line
            x1={0}
            x2={0}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Y-axis — category labels */}
        <ExplainAnchor
          selector="category-label"
          index={2}
          pin={{ x: -54, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
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

        {/* X-axis — value */}
        <ExplainAnchor
          selector="value-axis"
          index={3}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
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
            L1 SPEAKERS (MILLIONS)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
