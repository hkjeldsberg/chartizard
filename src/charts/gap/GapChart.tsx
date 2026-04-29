"use client";

import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { region: string; actual: number; target: number };

// Regional quarterly revenue actual vs target, in millions USD. Eight regions,
// a mix of beats and misses, one on-plan region. Hand-picked so the ranking by
// signed gap is legible and the widest miss is visually unmistakable.
const DATA: ReadonlyArray<Row> = [
  { region: "APAC", actual: 88, target: 72 },
  { region: "Nordics", actual: 64, target: 58 },
  { region: "UK", actual: 52, target: 50 },
  { region: "Benelux", actual: 46, target: 48 },
  { region: "DACH", actual: 60, target: 66 },
  { region: "LATAM", actual: 38, target: 48 },
  { region: "MENA", actual: 42, target: 56 },
  { region: "USA", actual: 74, target: 92 },
];

const BEAT_COLOUR = "var(--color-ink)";
const MISS_COLOUR = "#a55a4a";

interface Props {
  width: number;
  height: number;
}

export function GapChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.region),
    range: [0, iw],
    padding: 0.45,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 100],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const halfBar = Math.min(bw / 2, 10);

  // Representative rows — widest miss and the cleanest beat, for anchor pins.
  const widestMiss = DATA.reduce((acc, d) =>
    d.actual - d.target < acc.actual - acc.target ? d : acc,
  DATA[0]);
  const biggestBeat = DATA.reduce((acc, d) =>
    d.actual - d.target > acc.actual - acc.target ? d : acc,
  DATA[0]);

  const missCx = (xScale(widestMiss.region) ?? 0) + bw / 2;
  const missTargetY = yScale(widestMiss.target);
  const missActualY = yScale(widestMiss.actual);

  const beatCx = (xScale(biggestBeat.region) ?? 0) + bw / 2;
  const beatTargetY = yScale(biggestBeat.target);
  const beatActualY = yScale(biggestBeat.actual);

  return (
    <svg width={width} height={height} role="img" aria-label="Gap chart">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
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

        {/* Gap lines — the chart's primary encoding */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const cx = (xScale(d.region) ?? 0) + bw / 2;
            const tY = yScale(d.target);
            const aY = yScale(d.actual);
            const missed = d.actual < d.target;
            return (
              <line
                key={`gap-${d.region}`}
                x1={cx}
                x2={cx}
                y1={tY}
                y2={aY}
                stroke={missed ? MISS_COLOUR : BEAT_COLOUR}
                strokeWidth={2.2}
              />
            );
          })}
        </g>

        {/* Target markers — horizontal ticks per category */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const cx = (xScale(d.region) ?? 0) + bw / 2;
            const tY = yScale(d.target);
            return (
              <line
                key={`target-${d.region}`}
                x1={cx - halfBar}
                x2={cx + halfBar}
                y1={tY}
                y2={tY}
                stroke="var(--color-ink-mute)"
                strokeWidth={1.4}
              />
            );
          })}
        </g>

        {/* Actual markers — filled dots per category, coloured by sign */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const cx = (xScale(d.region) ?? 0) + bw / 2;
            const aY = yScale(d.actual);
            const missed = d.actual < d.target;
            return (
              <circle
                key={`actual-${d.region}`}
                cx={cx}
                cy={aY}
                r={4}
                fill={missed ? MISS_COLOUR : BEAT_COLOUR}
              />
            );
          })}
        </g>

        {/* Signed gap label above each category */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const cx = (xScale(d.region) ?? 0) + bw / 2;
            const topY = Math.min(yScale(d.actual), yScale(d.target)) - 6;
            const diff = d.actual - d.target;
            const sign = diff > 0 ? "+" : "";
            return (
              <text
                key={`lab-${d.region}`}
                x={cx}
                y={topY}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {`${sign}${diff}`}
              </text>
            );
          })}
        </g>

        {/* Legend inside the plot area, top-right */}
        <g data-data-layer="true" transform={`translate(${iw - 110}, 6)`}>
          <line x1={0} x2={12} y1={4} y2={4} stroke="var(--color-ink-mute)" strokeWidth={1.4} />
          <text
            x={16}
            y={4}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            TARGET
          </text>
          <circle cx={64} cy={4} r={3.4} fill="var(--color-ink)" />
          <text
            x={70}
            y={4}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            ACTUAL
          </text>
        </g>

        {/* Anchor 1: gap-line — the vertical connector, the whole chart */}
        <ExplainAnchor
          selector="gap-line"
          index={1}
          pin={{ x: missCx + 20, y: (missTargetY + missActualY) / 2 }}
          rect={{
            x: Math.max(0, missCx - 6),
            y: Math.min(missTargetY, missActualY),
            width: 12,
            height: Math.abs(missActualY - missTargetY),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: target-marker — the horizontal tick for a category's target */}
        <ExplainAnchor
          selector="target-marker"
          index={2}
          pin={{ x: beatCx + 24, y: beatTargetY - 10 }}
          rect={{
            x: Math.max(0, beatCx - halfBar - 2),
            y: beatTargetY - 4,
            width: halfBar * 2 + 4,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: actual-dot — the observed value */}
        <ExplainAnchor
          selector="actual-dot"
          index={3}
          pin={{ x: beatCx + 18, y: beatActualY - 6 }}
          rect={{
            x: Math.max(0, beatCx - 8),
            y: beatActualY - 8,
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: gap-sign — colour flips on miss */}
        <ExplainAnchor
          selector="gap-sign"
          index={4}
          pin={{ x: missCx - 26, y: (missTargetY + missActualY) / 2 }}
          rect={{
            x: Math.max(0, missCx - halfBar),
            y: Math.min(missTargetY, missActualY) - 10,
            width: halfBar * 2,
            height: Math.abs(missActualY - missTargetY) + 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: category-axis — the x-axis */}
        <ExplainAnchor
          selector="category-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
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
        </ExplainAnchor>

        {/* Anchor 6: value-axis — revenue scale */}
        <ExplainAnchor
          selector="value-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
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
            REVENUE ($M)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
