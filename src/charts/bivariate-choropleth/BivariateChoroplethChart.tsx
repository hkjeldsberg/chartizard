"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic US on a 7-column × 5-row grid; reuses the same abstract
// layout as the single-variable choropleth so viewers can compare the
// two encodings directly. Each cell now carries TWO variables — median
// household income ($k, rounded) and share of population with a
// bachelor's degree or higher (%). Values are hand-chosen from the
// 2022 ACS neighbourhood cluster roughly mapped to each state.
type Cell = {
  code: string;
  income: number; // $k median household
  edu: number; // % bachelor's+
};

const ROWS: ReadonlyArray<ReadonlyArray<Cell>> = [
  [
    { code: "ME", income: 68, edu: 34 },
    { code: "NH", income: 90, edu: 40 },
    { code: "VT", income: 74, edu: 42 },
    { code: "MA", income: 96, edu: 48 },
    { code: "RI", income: 81, edu: 36 },
    { code: "CT", income: 90, edu: 42 },
    { code: "NY", income: 82, edu: 40 },
  ],
  [
    { code: "PA", income: 72, edu: 34 },
    { code: "OH", income: 66, edu: 30 },
    { code: "IN", income: 66, edu: 28 },
    { code: "IL", income: 76, edu: 37 },
    { code: "MI", income: 65, edu: 31 },
    { code: "WI", income: 70, edu: 32 },
    { code: "MN", income: 85, edu: 40 },
  ],
  [
    { code: "NJ", income: 97, edu: 42 },
    { code: "DE", income: 74, edu: 33 },
    { code: "MD", income: 95, edu: 42 },
    { code: "DC", income: 101, edu: 61 },
    { code: "VA", income: 87, edu: 41 },
    { code: "KY", income: 58, edu: 26 },
    { code: "MO", income: 66, edu: 30 },
  ],
  [
    { code: "NC", income: 66, edu: 34 },
    { code: "SC", income: 63, edu: 30 },
    { code: "GA", income: 72, edu: 34 },
    { code: "AL", income: 57, edu: 27 },
    { code: "MS", income: 52, edu: 23 },
    { code: "LA", income: 57, edu: 26 },
    { code: "TX", income: 73, edu: 33 },
  ],
  [
    { code: "CA", income: 91, edu: 37 },
    { code: "OR", income: 76, edu: 36 },
    { code: "WA", income: 90, edu: 39 },
    { code: "NV", income: 71, edu: 26 },
    { code: "AZ", income: 72, edu: 32 },
    { code: "CO", income: 87, edu: 44 },
    { code: "FL", income: 65, edu: 32 },
  ],
];

const COL_IDS = ["c0", "c1", "c2", "c3", "c4", "c5", "c6"] as const;
const ROW_IDS = ["r0", "r1", "r2", "r3", "r4"] as const;

// Cynthia Brewer bivariate palette — "Blue-Purple" style, adapted.
// Rows = education tier (0 low → 2 high), columns = income tier.
// Indexing: PALETTE[eduBin][incomeBin]. Arranged so:
//   - top-left (low income, low edu)  → light neutral beige
//   - bottom-right (high income, high edu) → saturated blue-purple
//   - top-right (high income, low edu) → blue-dominant
//   - bottom-left (low income, high edu) → red-dominant
const PALETTE: ReadonlyArray<ReadonlyArray<string>> = [
  // Low education (bottom row of legend visually; here first for array
  // convenience, but the legend transform flips this so edu↑ reads up).
  ["#e8e8e8", "#b5c0da", "#6c83b5"], // low edu
  ["#d8b9c9", "#a6a6c1", "#627f9b"], // mid edu
  ["#c97593", "#9668a0", "#3f2449"], // high edu
];

// Tier thresholds (derived once; domain picked to split the data
// roughly into 3 equal groups).
const INCOME_BREAKS = [70, 85]; // <70 = low, 70..85 = mid, >=85 = high
const EDU_BREAKS = [32, 40]; // <32 = low, 32..40 = mid, >=40 = high

function incomeBin(v: number): 0 | 1 | 2 {
  if (v < INCOME_BREAKS[0]) return 0;
  if (v < INCOME_BREAKS[1]) return 1;
  return 2;
}
function eduBin(v: number): 0 | 1 | 2 {
  if (v < EDU_BREAKS[0]) return 0;
  if (v < EDU_BREAKS[1]) return 1;
  return 2;
}

function fillFor(cell: Cell): string {
  return PALETTE[eduBin(cell.edu)][incomeBin(cell.income)];
}

interface Props {
  width: number;
  height: number;
}

export function BivariateChoroplethChart({ width, height }: Props) {
  const margin = { top: 20, right: 108, bottom: 28, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: COL_IDS as unknown as string[],
    range: [0, iw],
    padding: 0.06,
  });
  const yScale = scaleBand<string>({
    domain: ROW_IDS as unknown as string[],
    range: [0, ih],
    padding: 0.08,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  // Focal cells for anchors.
  // "High-high" = DC (income 101, edu 61) — darkest fill.
  const dcR = 2;
  const dcC = 3;
  const dcX = xScale(COL_IDS[dcC]) ?? 0;
  const dcY = yScale(ROW_IDS[dcR]) ?? 0;

  // "Low-low" = Mississippi (income 52, edu 23) — lightest fill.
  const msR = 3;
  const msC = 4;
  const msX = xScale(COL_IDS[msC]) ?? 0;
  const msY = yScale(ROW_IDS[msR]) ?? 0;

  // Mismatched cell — Nevada (income high-mid 71, edu low 26): a
  // high-income-low-education exemplar. Reads as blue-dominant on the
  // bivariate palette, which is the whole point of the encoding.
  const nvR = 4;
  const nvC = 3;
  const nvX = xScale(COL_IDS[nvC]) ?? 0;
  const nvY = yScale(ROW_IDS[nvR]) ?? 0;

  // Legend geometry — 3×3 grid in the right margin.
  const legendSwatch = 14;
  const legendGap = 1;
  const legendSize = legendSwatch * 3 + legendGap * 2;
  const legendX = iw + 28;
  const legendY = Math.max(0, (ih - legendSize) / 2);

  return (
    <svg width={width} height={height} role="img" aria-label="Bivariate choropleth">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — every "state" fills by bivariate palette lookup. */}
        <g data-data-layer="true">
          {ROWS.map((row, rIdx) => {
            const y = yScale(ROW_IDS[rIdx]) ?? 0;
            return row.map((cell, cIdx) => {
              const x = xScale(COL_IDS[cIdx]) ?? 0;
              const fill = fillFor(cell);
              // Pick readable label colour: dark ink on light cells,
              // page on dark. Darker palette entries get page text.
              const darkFills = new Set(["#3f2449", "#627f9b", "#9668a0", "#6c83b5", "#c97593"]);
              const labelFill = darkFills.has(fill) ? "var(--color-page)" : "var(--color-ink)";
              return (
                <g key={`${rIdx}-${cIdx}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    fill={fill}
                  />
                  {cellW >= 22 && cellH >= 16 && (
                    <text
                      x={x + cellW / 2}
                      y={y + cellH / 2}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fontFamily="var(--font-mono)"
                      fontSize={9}
                      fill={labelFill}
                    >
                      {cell.code}
                    </text>
                  )}
                </g>
              );
            });
          })}
        </g>

        {/* Legend — 3×3 grid with income (→) and education (↑) axis
            labels. Rendered so row 0 of PALETTE (low edu) sits at the
            bottom, matching the "up = more education" visual idiom. */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          {PALETTE.map((row, eduIdx) =>
            row.map((fill, incIdx) => {
              // Flip eduIdx so high edu sits at the top of the legend.
              const yIdx = 2 - eduIdx;
              return (
                <rect
                  key={`lg-${eduIdx}-${incIdx}`}
                  x={incIdx * (legendSwatch + legendGap)}
                  y={yIdx * (legendSwatch + legendGap)}
                  width={legendSwatch}
                  height={legendSwatch}
                  fill={fill}
                />
              );
            }),
          )}
          {/* Income axis — arrow along the bottom */}
          <line
            x1={0}
            y1={legendSize + 8}
            x2={legendSize}
            y2={legendSize + 8}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
            markerEnd=""
          />
          <text
            x={legendSize / 2}
            y={legendSize + 20}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            INCOME →
          </text>
          {/* Education axis — arrow on the left */}
          <line
            x1={-8}
            y1={0}
            x2={-8}
            y2={legendSize}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
          />
          <text
            x={-14}
            y={legendSize / 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
            transform={`rotate(-90, ${-14}, ${legendSize / 2})`}
          >
            EDU ↑
          </text>
        </g>

        {/* Anchor 1 — the "high-high" cell (DC, darkest fill). */}
        <ExplainAnchor
          selector="high-high-region"
          index={1}
          pin={{ x: dcX + cellW / 2, y: dcY - 12 }}
          rect={{ x: dcX, y: dcY, width: cellW, height: cellH }}
        >
          <rect
            x={dcX}
            y={dcY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 2 — the "low-low" cell (Mississippi, lightest fill). */}
        <ExplainAnchor
          selector="low-low-region"
          index={2}
          pin={{ x: msX + cellW / 2, y: msY + cellH + 14 }}
          rect={{ x: msX, y: msY, width: cellW, height: cellH }}
        >
          <rect
            x={msX}
            y={msY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 3 — mismatched cell (Nevada, high-income-low-education
            — the whole point of bivariate encoding). */}
        <ExplainAnchor
          selector="mismatched-region"
          index={3}
          pin={{ x: nvX + cellW / 2, y: nvY + cellH + 14 }}
          rect={{ x: nvX, y: nvY, width: cellW, height: cellH }}
        >
          <rect
            x={nvX}
            y={nvY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </ExplainAnchor>

        {/* Anchor 4 — the 3×3 legend. Pin sits inside plot area so it's
            always visible; rect covers the legend grid in margin space. */}
        <ExplainAnchor
          selector="bivariate-legend"
          index={4}
          pin={{ x: iw - 6, y: legendY + legendSize / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY - 2,
            width: legendSize + 4,
            height: legendSize + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — income axis label on the legend. */}
        <ExplainAnchor
          selector="income-axis"
          index={5}
          pin={{
            x: iw - 4,
            y: legendY + legendSize + 20,
          }}
          rect={{
            x: legendX,
            y: legendY + legendSize + 4,
            width: legendSize,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — education axis label on the legend. */}
        <ExplainAnchor
          selector="education-axis"
          index={6}
          pin={{
            x: legendX - 14,
            y: legendY - 4,
          }}
          rect={{
            x: legendX - 24,
            y: legendY,
            width: 18,
            height: legendSize,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
