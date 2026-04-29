"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { region: string; deviation: number };

// Retail sales: actual minus forecast, in millions USD. Q1 of a fictional year.
// Hand-picked so the two strongest beats and two deepest misses are obvious,
// with some near-zero rows to show "on plan". Sorted by deviation, descending.
const DATA: ReadonlyArray<Row> = [
  { region: "South", deviation: 18.4 },
  { region: "Brazil", deviation: 12.1 },
  { region: "West", deviation: 9.7 },
  { region: "Mexico", deviation: 5.2 },
  { region: "Canada", deviation: 2.3 },
  { region: "Midwest", deviation: 0.6 },
  { region: "Australia", deviation: -1.4 },
  { region: "France", deviation: -4.8 },
  { region: "Japan", deviation: -7.9 },
  { region: "Northeast", deviation: -10.2 },
  { region: "UK", deviation: -13.5 },
  { region: "Germany", deviation: -16.8 },
];

const POS_COLOUR = "var(--color-ink)";
const NEG_COLOUR = "#a55a4a";

interface Props {
  width: number;
  height: number;
}

export function DeviationChart({ width, height }: Props) {
  const margin = { top: 24, right: 36, bottom: 48, left: 92 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Symmetric domain centred on zero — the whole chart is about signed distance
  // from plan, and an asymmetric scale would imply positive and negative aren't
  // on the same footing.
  const xScale = scaleLinear<number>({
    domain: [-20, 20],
    range: [0, iw],
    nice: false,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.region),
    range: [0, ih],
    padding: 0.28,
  });

  const bh = yScale.bandwidth();
  const zeroX = xScale(0);
  const ticksX = xScale.ticks(5);

  // Representative positive row — the top beat.
  const beat = DATA[0];
  const beatY = yScale(beat.region) ?? 0;
  const beatW = Math.max(0, xScale(beat.deviation) - zeroX);

  // Representative negative row — the deepest miss.
  const miss = DATA[DATA.length - 1];
  const missY = yScale(miss.region) ?? 0;
  const missX = xScale(miss.deviation);
  const missW = Math.max(0, zeroX - missX);

  return (
    <svg width={width} height={height} role="img" aria-label="Deviation chart">
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

        {/* Bars */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.region) ?? 0;
            const x = d.deviation >= 0 ? zeroX : xScale(d.deviation);
            const w = Math.abs(xScale(d.deviation) - zeroX);
            return (
              <Bar
                key={d.region}
                x={x}
                y={y}
                width={w}
                height={bh}
                fill={d.deviation >= 0 ? POS_COLOUR : NEG_COLOUR}
              />
            );
          })}
        </g>

        {/* Value labels at bar ends */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.region) ?? 0;
            const end = xScale(d.deviation);
            const isPos = d.deviation >= 0;
            return (
              <text
                key={d.region}
                x={isPos ? end + 4 : end - 4}
                y={y + bh / 2}
                dominantBaseline="central"
                textAnchor={isPos ? "start" : "end"}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {d.deviation > 0 ? `+${d.deviation.toFixed(1)}` : d.deviation.toFixed(1)}
              </text>
            );
          })}
        </g>

        {/* Zero reference line — the chart's whole point */}
        <ExplainAnchor
          selector="zero-reference"
          index={3}
          pin={{ x: zeroX, y: -10 }}
          rect={{ x: Math.max(0, zeroX - 3), y: 0, width: 6, height: ih }}
        >
          <line
            x1={zeroX}
            x2={zeroX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Positive-deviation bar — beat forecast */}
        <ExplainAnchor
          selector="positive-deviation"
          index={1}
          pin={{ x: zeroX + beatW + 30, y: beatY + bh / 2 }}
          rect={{ x: zeroX, y: beatY, width: beatW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Negative-deviation bar — missed forecast */}
        <ExplainAnchor
          selector="negative-deviation"
          index={2}
          pin={{ x: missX - 28, y: missY + bh / 2 }}
          rect={{ x: missX, y: missY, width: missW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Row-ordering — sort by magnitude */}
        <ExplainAnchor
          selector="row-ordering"
          index={4}
          pin={{ x: iw + 14, y: ih / 2 }}
          rect={{ x: Math.max(0, zeroX - 2), y: 0, width: 4, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Category axis — region names on the left */}
        <ExplainAnchor
          selector="category-axis"
          index={5}
          pin={{ x: -margin.left + 8, y: ih / 2 }}
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

        {/* Value axis — signed ticks */}
        <ExplainAnchor
          selector="value-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => {
              const n = Number(v);
              return n > 0 ? `+${n}` : `${n}`;
            }}
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
            ACTUAL − FORECAST ($M)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
