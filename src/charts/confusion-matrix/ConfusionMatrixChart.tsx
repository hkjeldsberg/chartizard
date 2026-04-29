"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { AxisLeft, AxisTop } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A 3-class image classifier's test-set counts.
// Rows = true class, Columns = predicted class. Diagonal = correct.
// Asymmetry: dog-labelled images misclassified as cat (22) more often than
// cat-labelled images misclassified as dog (14) — the finding the chart tells.
const CLASSES = ["Cat", "Dog", "Bird"] as const;
type ClassName = (typeof CLASSES)[number];

// matrix[trueIdx][predIdx]
const MATRIX: ReadonlyArray<ReadonlyArray<number>> = [
  // True Cat →
  [82, 14, 4],
  // True Dog →
  [22, 74, 4],
  // True Bird →
  [3, 6, 91],
];

const SHORT: Record<ClassName, string> = {
  Cat: "CAT",
  Dog: "DOG",
  Bird: "BIRD",
};

// Maximum cell value — used to normalise opacity.
const MAX = 100;

interface Props {
  width: number;
  height: number;
}

export function ConfusionMatrixChart({ width, height }: Props) {
  const margin = { top: 44, right: 20, bottom: 40, left: 76 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: [...CLASSES],
    range: [0, iw],
    padding: 0.06,
  });

  const yScale = scaleBand<string>({
    domain: [...CLASSES],
    range: [0, ih],
    padding: 0.06,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  // Representative diagonal cell — Bird/Bird (highest correct count, 91).
  const diagClass = CLASSES[2];
  const diagX = xScale(diagClass) ?? 0;
  const diagY = yScale(diagClass) ?? 0;

  // Representative off-diagonal — True=Dog, Predicted=Cat (22): the asymmetric
  // error the chart is there to reveal.
  const offTrue = CLASSES[1];
  const offPred = CLASSES[0];
  const offX = xScale(offPred) ?? 0;
  const offY = yScale(offTrue) ?? 0;
  const offValue = MATRIX[1][0];

  // Row sum (true count for True=Dog) — informs the row anchor.
  const dogRowIdx = 1;
  const dogRowY = yScale(CLASSES[dogRowIdx]) ?? 0;

  // Column sum (predicted count for Predicted=Cat) — column anchor target.
  const catColIdx = 0;
  const catColX = xScale(CLASSES[catColIdx]) ?? 0;

  return (
    <svg width={width} height={height} role="img" aria-label="Confusion matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — count encoded by opacity */}
        <g data-data-layer="true">
          {MATRIX.map((row, rIdx) => {
            const rowClass = CLASSES[rIdx];
            const y = yScale(rowClass) ?? 0;
            return row.map((count, cIdx) => {
              const colClass = CLASSES[cIdx];
              const x = xScale(colClass) ?? 0;
              const opacity = 0.08 + (count / MAX) * 0.82;
              // Text contrast flips against dark cells.
              const textFill =
                opacity > 0.55 ? "var(--color-page)" : "var(--color-ink)";
              return (
                <g key={`${rowClass}-${colClass}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                  />
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={Math.min(14, cellH * 0.32)}
                    fontWeight={500}
                    fill={textFill}
                  >
                    {count}
                  </text>
                </g>
              );
            });
          })}
        </g>

        {/* 1. Diagonal — representative correct cell (Bird / Bird) */}
        <ExplainAnchor
          selector="diagonal"
          index={1}
          pin={{
            x: Math.max(0, diagX - 14),
            y: diagY + cellH / 2,
          }}
          rect={{ x: diagX, y: diagY, width: cellW, height: cellH }}
        >
          <rect
            x={diagX}
            y={diagY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 2. Asymmetric off-diagonal — True=Dog, Predicted=Cat */}
        <ExplainAnchor
          selector="off-diagonal"
          index={2}
          pin={{ x: offX + cellW / 2, y: Math.max(0, offY - 14) }}
          rect={{ x: offX, y: offY, width: cellW, height: cellH }}
        >
          <rect
            x={offX}
            y={offY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
          <text
            x={offX + cellW + 6}
            y={offY + cellH / 2}
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {offValue} dog→cat
          </text>
        </ExplainAnchor>

        {/* 3. Row — true class (True=Dog row): ground-truth count */}
        <ExplainAnchor
          selector="row-true"
          index={3}
          pin={{ x: -44, y: dogRowY + cellH / 2 }}
          rect={{ x: 0, y: dogRowY, width: iw, height: cellH }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Column — predicted class (Pred=Cat column): predicted count */}
        <ExplainAnchor
          selector="column-predicted"
          index={4}
          pin={{ x: catColX + cellW / 2, y: -28 }}
          rect={{ x: catColX, y: 0, width: cellW, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis — true class labels */}
        <g data-data-layer="true">
          <AxisLeft
            scale={yScale}
            tickFormat={(v) => SHORT[v as ClassName] ?? (v as string)}
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
            x={-60}
            y={ih / 2}
            transform={`rotate(-90, -60, ${ih / 2})`}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TRUE
          </text>
        </g>

        {/* X-axis — predicted class labels on TOP to read "true vs predicted" */}
        <g data-data-layer="true">
          <AxisTop
            scale={xScale}
            tickFormat={(v) => SHORT[v as ClassName] ?? (v as string)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "-0.25em",
            })}
          />
          <text
            x={iw / 2}
            y={-28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PREDICTED
          </text>
        </g>

        {/* 5. Colour scale — opacity-encoded count legend */}
        {(() => {
          const legendX = 0;
          const legendY = ih + 14;
          const legendW = Math.min(iw, 120);
          const legendH = 8;
          const steps = 16;
          const segW = legendW / steps;
          return (
            <ExplainAnchor
              selector="colour-scale"
              index={5}
              pin={{ x: legendX + legendW + 14, y: legendY + legendH / 2 }}
              rect={{
                x: legendX,
                y: legendY - 2,
                width: legendW,
                height: legendH + 4,
              }}
            >
              <g data-data-layer="true">
                {Array.from({ length: steps }).map((_, i) => {
                  const t = i / (steps - 1);
                  const opacity = 0.08 + t * 0.82;
                  return (
                    <rect
                      key={i}
                      x={legendX + i * segW}
                      y={legendY}
                      width={segW + 0.5}
                      height={legendH}
                      fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
                    />
                  );
                })}
                <text
                  x={legendX}
                  y={legendY + legendH + 10}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  0
                </text>
                <text
                  x={legendX + legendW}
                  y={legendY + legendH + 10}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {MAX}
                </text>
              </g>
            </ExplainAnchor>
          );
        })()}
      </Group>
    </svg>
  );
}
