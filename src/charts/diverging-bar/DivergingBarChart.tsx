"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { question: string; score: number };

// NPS-style question breakdown: promoters% minus detractors%.
// Sorted from most positive at the top to most negative at the bottom.
const DATA: ReadonlyArray<Row> = [
  { question: "Quality of support", score: 42 },
  { question: "Product reliability", score: 28 },
  { question: "Feature depth", score: 18 },
  { question: "Onboarding ease", score: 4 },
  { question: "Pricing value", score: -12 },
  { question: "Mobile experience", score: -24 },
  { question: "Integrations", score: -38 },
];

const POS_COLOUR = "var(--color-ink)";
const NEG_COLOUR = "#a55a4a";

interface Props {
  width: number;
  height: number;
}

export function DivergingBarChart({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 48, left: 128 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Symmetric-ish domain so the centre line sits near the middle of the plot.
  const xScale = scaleLinear<number>({
    domain: [-40, 45],
    range: [0, iw],
    nice: false,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.question),
    range: [0, ih],
    padding: 0.28,
  });

  const bh = yScale.bandwidth();
  const zeroX = xScale(0);
  const ticksX = xScale.ticks(6);

  // Representative positive bar: the strongest positive (first row).
  const posRow = DATA[0];
  const posY = yScale(posRow.question) ?? 0;
  const posBarX = zeroX;
  const posBarW = Math.max(0, xScale(posRow.score) - zeroX);

  // Representative negative bar: the most negative (last row).
  const negRow = DATA[DATA.length - 1];
  const negY = yScale(negRow.question) ?? 0;
  const negBarX = xScale(negRow.score);
  const negBarW = Math.max(0, zeroX - xScale(negRow.score));

  return (
    <svg width={width} height={height} role="img" aria-label="Diverging bar chart">
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
            const y = yScale(d.question) ?? 0;
            const x = d.score >= 0 ? zeroX : xScale(d.score);
            const w = Math.abs(xScale(d.score) - zeroX);
            return (
              <Bar
                key={d.question}
                x={x}
                y={y}
                width={w}
                height={bh}
                fill={d.score >= 0 ? POS_COLOUR : NEG_COLOUR}
              />
            );
          })}
        </g>

        {/* Value labels at bar ends */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.question) ?? 0;
            const end = xScale(d.score);
            const isPos = d.score >= 0;
            return (
              <text
                key={d.question}
                x={isPos ? end + 4 : end - 4}
                y={y + bh / 2}
                dominantBaseline="central"
                textAnchor={isPos ? "start" : "end"}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {d.score > 0 ? `+${d.score}` : `${d.score}`}
              </text>
            );
          })}
        </g>

        {/* Zero axis — the centre line, always visible, solid */}
        <ExplainAnchor
          selector="zero-axis"
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
            strokeWidth={1.2}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Representative positive bar */}
        <ExplainAnchor
          selector="positive-bar"
          index={1}
          pin={{ x: posBarX + posBarW + 28, y: posY + bh / 2 }}
          rect={{ x: posBarX, y: posY, width: posBarW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Representative negative bar */}
        <ExplainAnchor
          selector="negative-bar"
          index={2}
          pin={{ x: negBarX - 26, y: negY + bh / 2 }}
          rect={{ x: negBarX, y: negY, width: negBarW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Ranking anchor: the vertical order itself */}
        <ExplainAnchor
          selector="ranking"
          index={4}
          pin={{ x: iw + 12, y: ih / 2 }}
          rect={{ x: Math.max(0, zeroX - 2), y: 0, width: 4, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Category labels (left of zero line) */}
        <ExplainAnchor
          selector="category-label"
          index={5}
          pin={{ x: -margin.left + 10, y: ih / 2 }}
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

        {/* Axis ticks (bottom) */}
        <ExplainAnchor
          selector="axis-tick"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
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
            NET SCORE (PROMOTERS − DETRACTORS)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
