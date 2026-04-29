"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Pugh matrix — concept-scoring for 5 alternative EV battery chemistries
// against a baseline (lithium-ion NMC). Cell values are +1 / 0 / -1 vs
// baseline; the baseline column is definitionally all zeros. Weighted total
// at the bottom is the tiebreaker but the signed-cell grid is the insight.

interface Criterion {
  key: string;
  label: string;
  weight: number;
}

const CRITERIA: ReadonlyArray<Criterion> = [
  { key: "energy", label: "Energy density", weight: 3 },
  { key: "cycle", label: "Cycle life", weight: 2 },
  { key: "safety", label: "Safety", weight: 3 },
  { key: "cost", label: "Cost", weight: 2 },
  { key: "supply", label: "Supply chain", weight: 1 },
  { key: "manuf", label: "Manufacturability", weight: 2 },
];

// Alternatives in display order; baseline is always column 0.
const ALTERNATIVES: ReadonlyArray<{ key: string; label: string }> = [
  { key: "baseline", label: "Li-ion NMC" },
  { key: "lfp", label: "LFP" },
  { key: "solid", label: "Solid-state" },
  { key: "sodium", label: "Sodium-ion" },
  { key: "lisulf", label: "Li-sulfur" },
  { key: "zincair", label: "Zinc-air" },
];

// Scores per alternative vs baseline, in CRITERIA row order.
// Baseline is all zeros by definition.
const SCORES: Record<string, ReadonlyArray<number>> = {
  baseline: [0, 0, 0, 0, 0, 0],
  lfp: [-1, +1, +1, +1, +1, +1],
  solid: [+1, +1, +1, -1, 0, -1],
  sodium: [-1, 0, +1, +1, +1, +1],
  lisulf: [+1, -1, -1, -1, 0, -1],
  zincair: [+1, -1, -1, +1, +1, -1],
};

function weightedTotal(altKey: string): number {
  const scores = SCORES[altKey] ?? [];
  return CRITERIA.reduce((sum, c, i) => sum + c.weight * (scores[i] ?? 0), 0);
}

function fmtCell(v: number): string {
  if (v > 0) return "+1";
  if (v < 0) return "-1";
  return "0";
}

interface Props {
  width: number;
  height: number;
}

export function PughMatrix({ width, height }: Props) {
  const margin = { top: 24, right: 16, bottom: 20, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Column layout: [criterion label | weight | 6 alternatives]
  // Criterion column gets 2.4 units, weight 0.8, each alt 1 unit. 6 alts = 6.
  // Total weight units = 9.2.
  const critUnits = 2.4;
  const weightUnits = 0.8;
  const altUnits = 1;
  const totalUnits = critUnits + weightUnits + ALTERNATIVES.length * altUnits;
  const unitW = iw / totalUnits;
  const critColW = critUnits * unitW;
  const weightColW = weightUnits * unitW;
  const altColW = altUnits * unitW;

  // Row layout: [header | 6 criteria | weighted total]
  const rowCount = 1 + CRITERIA.length + 1; // 8
  const rowH = ih / rowCount;
  const headerH = rowH;
  const totalRowH = rowH;

  const rowYs = Array.from({ length: rowCount }, (_, i) => i * rowH);
  const colXs: number[] = [];
  let x = 0;
  colXs.push(x); // 0: criterion column
  x += critColW;
  colXs.push(x); // 1: weight column
  x += weightColW;
  for (let i = 0; i < ALTERNATIVES.length; i += 1) {
    colXs.push(x);
    x += altColW;
  }
  // Final right edge:
  const rightEdge = x;

  // Handy lookups for specific anchors.
  const lfpIdx = ALTERNATIVES.findIndex((a) => a.key === "lfp");
  const safetyIdx = CRITERIA.findIndex((c) => c.key === "safety");
  const lisulfIdx = ALTERNATIVES.findIndex((a) => a.key === "lisulf");
  const energyIdx = CRITERIA.findIndex((c) => c.key === "energy");

  // Plus-cell: LFP × Safety (+1)
  const plusColX = colXs[2 + lfpIdx];
  const plusRowY = rowYs[1 + safetyIdx];

  // Minus-cell: Li-sulfur × Energy density (+1 actually; we need a -1)
  // Pick Li-sulfur × Cycle life which is -1.
  const cycleIdx = CRITERIA.findIndex((c) => c.key === "cycle");
  const minusColX = colXs[2 + lisulfIdx];
  const minusRowY = rowYs[1 + cycleIdx];

  // Baseline column (column index 2 in colXs == first alt == baseline)
  const baselineColX = colXs[2];

  // Weight column
  const weightColX = colXs[1];

  // Weighted-total row (last row)
  const totalRowY = rowYs[rowCount - 1];

  // Criterion row: Energy density (first data row)
  const critRowY = rowYs[1 + energyIdx];

  const PLUS_FILL = "rgba(74,106,104,0.18)";
  const MINUS_FILL = "rgba(165,90,74,0.15)";

  function cellFill(v: number): string | undefined {
    if (v > 0) return PLUS_FILL;
    if (v < 0) return MINUS_FILL;
    return undefined;
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Pugh Matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Grid background cells (data layer) */}
        <g data-data-layer="true">
          {/* Data cells: for each criterion row × each alternative column */}
          {CRITERIA.map((c, ri) =>
            ALTERNATIVES.map((a, ci) => {
              const v = SCORES[a.key]?.[ri] ?? 0;
              const cx = colXs[2 + ci];
              const cy = rowYs[1 + ri];
              const fill = cellFill(v);
              return (
                <rect
                  key={`cell-${c.key}-${a.key}`}
                  x={cx}
                  y={cy}
                  width={altColW}
                  height={rowH}
                  fill={fill ?? "var(--color-surface)"}
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
              );
            }),
          )}

          {/* Criterion labels + weight cells background */}
          {CRITERIA.map((c, ri) => {
            const cy = rowYs[1 + ri];
            return (
              <g key={`lbl-${c.key}`}>
                <rect
                  x={colXs[0]}
                  y={cy}
                  width={critColW}
                  height={rowH}
                  fill="var(--color-surface)"
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
                <rect
                  x={colXs[1]}
                  y={cy}
                  width={weightColW}
                  height={rowH}
                  fill="var(--color-surface)"
                  stroke="var(--color-hairline)"
                  strokeWidth={1}
                />
                <text
                  x={colXs[0] + 8}
                  y={cy + rowH / 2 + 3}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                >
                  {c.label}
                </text>
                <text
                  x={colXs[1] + weightColW / 2}
                  y={cy + rowH / 2 + 3}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {String(c.weight)}
                </text>
              </g>
            );
          })}

          {/* Header row background */}
          <rect
            x={colXs[0]}
            y={rowYs[0]}
            width={rightEdge - colXs[0]}
            height={headerH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {/* Header labels: criterion, weight, alternatives */}
          <text
            x={colXs[0] + 8}
            y={rowYs[0] + headerH / 2 + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            CRITERION
          </text>
          <text
            x={colXs[1] + weightColW / 2}
            y={rowYs[0] + headerH / 2 + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            W
          </text>
          {ALTERNATIVES.map((a, ci) => (
            <text
              key={`hdr-${a.key}`}
              x={colXs[2 + ci] + altColW / 2}
              y={rowYs[0] + headerH / 2 + 3}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill={ci === 0 ? "var(--color-ink)" : "var(--color-ink)"}
              fontWeight={ci === 0 ? 600 : 400}
            >
              {a.label}
            </text>
          ))}

          {/* Cell value text */}
          {CRITERIA.map((c, ri) =>
            ALTERNATIVES.map((a, ci) => {
              const v = SCORES[a.key]?.[ri] ?? 0;
              const cx = colXs[2 + ci] + altColW / 2;
              const cy = rowYs[1 + ri] + rowH / 2 + 3;
              return (
                <text
                  key={`val-${c.key}-${a.key}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                >
                  {fmtCell(v)}
                </text>
              );
            }),
          )}

          {/* Weighted-total row */}
          <rect
            x={colXs[0]}
            y={totalRowY}
            width={rightEdge - colXs[0]}
            height={totalRowH}
            fill="var(--color-surface)"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <text
            x={colXs[0] + 8}
            y={totalRowY + totalRowH / 2 + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Weighted total
          </text>
          <text
            x={colXs[1] + weightColW / 2}
            y={totalRowY + totalRowH / 2 + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            —
          </text>
          {ALTERNATIVES.map((a, ci) => {
            const total = weightedTotal(a.key);
            return (
              <text
                key={`total-${a.key}`}
                x={colXs[2 + ci] + altColW / 2}
                y={totalRowY + totalRowH / 2 + 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                {total > 0 ? `+${total}` : String(total)}
              </text>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. baseline-column (leftmost alternative column, all zeros) */}
        <ExplainAnchor
          selector="baseline-column"
          index={1}
          pin={{ x: baselineColX + altColW / 2, y: -10 }}
          rect={{
            x: Math.max(0, baselineColX),
            y: 0,
            width: Math.min(iw - baselineColX, altColW),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. weight-column (left-side weights for each criterion) */}
        <ExplainAnchor
          selector="weight-column"
          index={2}
          pin={{ x: weightColX + weightColW / 2, y: -10 }}
          rect={{
            x: Math.max(0, weightColX),
            y: 0,
            width: Math.min(iw - weightColX, weightColW),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. plus-cell (LFP × Safety = +1) */}
        <ExplainAnchor
          selector="plus-cell"
          index={3}
          pin={{ x: plusColX + altColW / 2, y: plusRowY - 10 }}
          rect={{
            x: Math.max(0, plusColX),
            y: Math.max(0, plusRowY),
            width: Math.min(iw - plusColX, altColW),
            height: Math.min(ih - plusRowY, rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. minus-cell (Li-sulfur × Cycle life = -1) */}
        <ExplainAnchor
          selector="minus-cell"
          index={4}
          pin={{ x: minusColX + altColW / 2, y: minusRowY + rowH + 14 }}
          rect={{
            x: Math.max(0, minusColX),
            y: Math.max(0, minusRowY),
            width: Math.min(iw - minusColX, altColW),
            height: Math.min(ih - minusRowY, rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. criterion-row (Energy density row across all alternatives) */}
        <ExplainAnchor
          selector="criterion-row"
          index={5}
          pin={{ x: rightEdge + 6, y: critRowY + rowH / 2 }}
          rect={{
            x: Math.max(0, colXs[2]),
            y: Math.max(0, critRowY),
            width: Math.min(iw - colXs[2], rightEdge - colXs[2]),
            height: Math.min(ih - critRowY, rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. weighted-total (bottom row, bold) */}
        <ExplainAnchor
          selector="weighted-total"
          index={6}
          pin={{ x: rightEdge + 6, y: totalRowY + totalRowH / 2 }}
          rect={{
            x: 0,
            y: Math.max(0, totalRowY),
            width: Math.min(iw, rightEdge),
            height: Math.min(ih - totalRowY, totalRowH),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
