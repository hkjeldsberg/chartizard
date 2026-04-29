"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { feature: string; importance: number };

// Relative permutation-importance scores for a credit-default XGBoost model.
// Values are shares that sum to ~1. Credit-score and utilization dominate.
const DATA: ReadonlyArray<Row> = [
  { feature: "credit-score", importance: 0.28 },
  { feature: "utilization", importance: 0.22 },
  { feature: "debt-to-income", importance: 0.13 },
  { feature: "months-since-delinquency", importance: 0.10 },
  { feature: "inquiries", importance: 0.08 },
  { feature: "income", importance: 0.06 },
  { feature: "employment-months", importance: 0.05 },
  { feature: "loan-amount", importance: 0.04 },
  { feature: "age", importance: 0.025 },
  { feature: "homeownership", importance: 0.015 },
];

interface Props {
  width: number;
  height: number;
}

export function FeatureImportanceChart({ width, height }: Props) {
  const margin = { top: 24, right: 40, bottom: 44, left: 110 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const maxImp = Math.max(...DATA.map((d) => d.importance));
  const xMax = Math.ceil(maxImp * 10) / 10; // round up to nearest 0.1

  const xScale = scaleLinear<number>({
    domain: [0, xMax],
    range: [0, iw],
    nice: true,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.feature),
    range: [0, ih],
    padding: 0.28,
  });

  const ticksX = xScale.ticks(5);
  const bh = yScale.bandwidth();

  // Representative bar = the leader (credit-score).
  const topRow = DATA[0];
  const topY = yScale(topRow.feature) ?? 0;
  const topW = xScale(topRow.importance);

  // Secondary bar near the tail — for the "ranking uncertainty" anchor.
  const tailRow = DATA[DATA.length - 2];
  const tailY = yScale(tailRow.feature) ?? 0;
  const tailW = xScale(tailRow.importance);

  return (
    <svg width={width} height={height} role="img" aria-label="Feature importance plot">
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
            const y = yScale(d.feature) ?? 0;
            const w = xScale(d.importance);
            return (
              <Bar
                key={d.feature}
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
            const y = yScale(d.feature) ?? 0;
            const w = xScale(d.importance);
            return (
              <text
                key={d.feature}
                x={w + 4}
                y={y + bh / 2}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {d.importance.toFixed(2)}
              </text>
            );
          })}
        </g>

        {/* Anchor 1: top bar (credit-score leads) */}
        <ExplainAnchor
          selector="top-bar"
          index={1}
          pin={{ x: topW + 26, y: topY + bh / 2 }}
          rect={{ x: 0, y: topY, width: topW, height: bh }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: baseline — the y=0 that every bar grows from */}
        <ExplainAnchor
          selector="baseline"
          index={2}
          pin={{ x: -14, y: ih / 2 }}
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

        {/* Anchor 3: ranking — the sort order itself is the story */}
        <ExplainAnchor
          selector="ranking"
          index={3}
          pin={{ x: tailW + 44, y: tailY + bh / 2 }}
          rect={{ x: 0, y: tailY - bh * 0.6, width: iw, height: bh * 2.2 }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: feature-label axis */}
        <ExplainAnchor
          selector="feature-axis"
          index={4}
          pin={{ x: -70, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* Anchor 5: importance axis (x) */}
        <ExplainAnchor
          selector="importance-axis"
          index={5}
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
            IMPORTANCE (PERMUTATION, NORMALISED)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
