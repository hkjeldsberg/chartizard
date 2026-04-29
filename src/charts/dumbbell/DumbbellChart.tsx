"use client";

import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { sector: string; male: number; female: number };

// Gender pay gap by industry — median salary in $k/year, 2024 approximation.
// Sorted by gap (male - female) descending so the ranking reads top-down.
const DATA: ReadonlyArray<Row> = [
  { sector: "Legal", male: 140, female: 105 },
  { sector: "Finance", male: 125, female: 95 },
  { sector: "Tech", male: 145, female: 125 },
  { sector: "Construction", male: 75, female: 58 },
  { sector: "Media", male: 82, female: 70 },
  { sector: "Manufacturing", male: 72, female: 61 },
  { sector: "Healthcare", male: 95, female: 85 },
  { sector: "Retail", male: 52, female: 42 },
  { sector: "Hospitality", male: 45, female: 39 },
  { sector: "Education", male: 65, female: 62 },
];

interface Props {
  width: number;
  height: number;
}

const FEMALE_COLOR = "#a55a4a";
const MALE_COLOR = "var(--color-ink)";

export function DumbbellChart({ width, height }: Props) {
  const margin = { top: 28, right: 48, bottom: 56, left: 92 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Value axis runs along x (salary in $k); category axis runs along y.
  const xScale = scaleLinear<number>({
    domain: [0, 160],
    range: [0, iw],
    nice: true,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.sector),
    range: [0, ih],
    padding: 0.35,
  });

  const ticksX = xScale.ticks(5);
  const bh = yScale.bandwidth();

  // Representative row for anchor targets: the widest gap (Legal).
  const widest = DATA[0];
  const widestY = (yScale(widest.sector) ?? 0) + bh / 2;
  const widestFx = xScale(widest.female);
  const widestMx = xScale(widest.male);

  // A mid-list row for the connecting-bar anchor so pins don't stack at top.
  const midRow = DATA[Math.floor(DATA.length / 2)];
  const midY = (yScale(midRow.sector) ?? 0) + bh / 2;
  const midFx = xScale(midRow.female);
  const midMx = xScale(midRow.male);

  // Legend — two swatches sitting above the plot in the top margin.
  const legendY = -16;
  const legendFemaleX = 0;
  const legendMaleX = 96;

  return (
    <svg width={width} height={height} role="img" aria-label="Dumbbell chart">
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

        {/* Connecting bars (the gap) */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = (yScale(d.sector) ?? 0) + bh / 2;
            const fx = xScale(d.female);
            const mx = xScale(d.male);
            return (
              <line
                key={`bar-${d.sector}`}
                x1={fx}
                x2={mx}
                y1={y}
                y2={y}
                stroke="var(--color-ink-mute)"
                strokeWidth={2}
              />
            );
          })}
        </g>

        {/* Dots — female (lower, left) */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = (yScale(d.sector) ?? 0) + bh / 2;
            return (
              <circle
                key={`f-${d.sector}`}
                cx={xScale(d.female)}
                cy={y}
                r={5}
                fill={FEMALE_COLOR}
              />
            );
          })}
        </g>

        {/* Dots — male (higher, right) */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = (yScale(d.sector) ?? 0) + bh / 2;
            return (
              <circle
                key={`m-${d.sector}`}
                cx={xScale(d.male)}
                cy={y}
                r={5}
                fill={MALE_COLOR}
              />
            );
          })}
        </g>

        {/* Gap labels at the right end of each row */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = (yScale(d.sector) ?? 0) + bh / 2;
            const mx = xScale(d.male);
            return (
              <text
                key={`gap-${d.sector}`}
                x={mx + 8}
                y={y}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {`+${d.male - d.female}`}
              </text>
            );
          })}
        </g>

        {/* Legend */}
        <g data-data-layer="true">
          <circle cx={legendFemaleX + 6} cy={legendY} r={4} fill={FEMALE_COLOR} />
          <text
            x={legendFemaleX + 14}
            y={legendY}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            FEMALE MEDIAN
          </text>
          <circle cx={legendMaleX + 6} cy={legendY} r={4} fill={MALE_COLOR} />
          <text
            x={legendMaleX + 14}
            y={legendY}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            MALE MEDIAN
          </text>
        </g>

        {/* Anchor 1: left-dot — female median (the lower value, always) */}
        <ExplainAnchor
          selector="left-dot"
          index={1}
          pin={{ x: widestFx - 16, y: widestY - 12 }}
          rect={{
            x: Math.max(0, widestFx - 9),
            y: Math.max(0, widestY - 9),
            width: 18,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: right-dot — male median (the higher value, always) */}
        <ExplainAnchor
          selector="right-dot"
          index={2}
          pin={{ x: Math.min(iw - 8, widestMx + 16), y: widestY - 12 }}
          rect={{
            x: Math.max(0, widestMx - 9),
            y: Math.max(0, widestY - 9),
            width: 18,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: connecting-bar — the gap itself (bar length = pairwise diff) */}
        <ExplainAnchor
          selector="connecting-bar"
          index={3}
          pin={{ x: (midFx + midMx) / 2, y: midY - 14 }}
          rect={{
            x: Math.max(0, midFx),
            y: Math.max(0, midY - 5),
            width: Math.max(0, midMx - midFx),
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: gap — the concept. Pinned to the gap label column. */}
        <ExplainAnchor
          selector="gap"
          index={4}
          pin={{ x: Math.min(iw - 6, widestMx + 30), y: widestY }}
          rect={{
            x: Math.max(0, widestMx + 2),
            y: 0,
            width: Math.max(0, iw - widestMx - 2),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: category-axis — industry labels on the y-axis */}
        <ExplainAnchor
          selector="category-axis"
          index={5}
          pin={{ x: -58, y: ih / 2 }}
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

        {/* Anchor 6: value-axis — salary in $k along x */}
        <ExplainAnchor
          selector="value-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `$${Number(v)}k`}
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
            MEDIAN SALARY ($K / YEAR)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
