"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Classic monohybrid cross: Aa × Aa.
// Parent 1 gametes run across the top. Parent 2 gametes run down the left.
// The 2×2 interior is the offspring genotype grid.
//
// Offspring layout (row = parent-2 gamete, col = parent-1 gamete):
//
//                  A         a
//           ┌──────────┬──────────┐
//     A     │    AA    │    Aa    │
//           ├──────────┼──────────┤
//     a     │    Aa    │    aa    │
//           └──────────┴──────────┘
//
// Genotypic ratio 1 AA : 2 Aa : 1 aa.
// Phenotypic ratio 3 dominant : 1 recessive (AA and Aa both show the dominant
// phenotype; only aa shows the recessive one).

type Genotype = "AA" | "Aa" | "aa";

interface Cell {
  row: number; // 0 = top, 1 = bottom
  col: number; // 0 = left, 1 = right
  genotype: Genotype;
}

const CELLS: ReadonlyArray<Cell> = [
  { row: 0, col: 0, genotype: "AA" },
  { row: 0, col: 1, genotype: "Aa" },
  { row: 1, col: 0, genotype: "Aa" },
  { row: 1, col: 1, genotype: "aa" },
];

const COL_GAMETES = ["A", "a"] as const;
const ROW_GAMETES = ["A", "a"] as const;

function isDominantPhenotype(g: Genotype): boolean {
  // Dominant phenotype whenever at least one dominant A allele is present.
  return g === "AA" || g === "Aa";
}

export function PunnettSquareChart({ width, height }: Props) {
  // Top/left margins leave room for parent-gamete labels outside the grid.
  // Bottom margin carries the ratio summary line.
  const margin = { top: 40, right: 20, bottom: 56, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // The grid is a square that fits inside the plot area.
  const side = Math.max(0, Math.min(iw, ih));
  const gridX = (iw - side) / 2;
  const gridY = 0;
  const cellSize = side / 2;

  function cellX(col: number) {
    return gridX + col * cellSize;
  }
  function cellY(row: number) {
    return gridY + row * cellSize;
  }

  // Pre-compute anchor references.
  const dominantCell = CELLS[0]; // AA — fully dominant
  const heterozygousCell = CELLS[1]; // Aa — heterozygous, top-right
  const recessiveCell = CELLS[3]; // aa — recessive, bottom-right

  const domX = cellX(dominantCell.col);
  const domY = cellY(dominantCell.row);
  const hetX = cellX(heterozygousCell.col);
  const hetY = cellY(heterozygousCell.row);
  const recX = cellX(recessiveCell.col);
  const recY = cellY(recessiveCell.row);

  const ratioLabelY = side + 28;

  return (
    <svg width={width} height={height} role="img" aria-label="Punnett square">
      <Group left={margin.left} top={margin.top}>
        {/* Grid cells coloured by phenotype */}
        <g data-data-layer="true">
          {CELLS.map((c, i) => {
            const x = cellX(c.col);
            const y = cellY(c.row);
            const dominant = isDominantPhenotype(c.genotype);
            // Dominant phenotype = dark ink tint, recessive = light wash.
            const fill = dominant
              ? "rgba(26,22,20,0.62)"
              : "rgba(26,22,20,0.10)";
            const textFill = dominant
              ? "var(--color-page)"
              : "var(--color-ink)";
            return (
              <g key={i}>
                <rect
                  x={x}
                  y={y}
                  width={cellSize}
                  height={cellSize}
                  fill={fill}
                  stroke="var(--color-ink)"
                  strokeWidth={1.4}
                />
                <text
                  x={x + cellSize / 2}
                  y={y + cellSize / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={Math.min(26, cellSize * 0.34)}
                  fontWeight={500}
                  fill={textFill}
                >
                  {c.genotype}
                </text>
              </g>
            );
          })}
        </g>

        {/* Parent-1 gametes across the top */}
        <g data-data-layer="true">
          {COL_GAMETES.map((g, i) => (
            <text
              key={`col-${i}`}
              x={cellX(i) + cellSize / 2}
              y={-14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={13}
              fontWeight={500}
              fill="var(--color-ink)"
            >
              {g}
            </text>
          ))}
          <text
            x={gridX + side / 2}
            y={-28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PARENT 1 (Aa)
          </text>
        </g>

        {/* Parent-2 gametes down the left */}
        <g data-data-layer="true">
          {ROW_GAMETES.map((g, i) => (
            <text
              key={`row-${i}`}
              x={gridX - 14}
              y={cellY(i) + cellSize / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={13}
              fontWeight={500}
              fill="var(--color-ink)"
            >
              {g}
            </text>
          ))}
          <text
            x={gridX - 34}
            y={gridY + side / 2}
            transform={`rotate(-90, ${gridX - 34}, ${gridY + side / 2})`}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PARENT 2 (Aa)
          </text>
        </g>

        {/* Ratio summary line beneath the grid */}
        <g data-data-layer="true">
          <text
            x={gridX}
            y={ratioLabelY}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            GENOTYPIC 1 : 2 : 1
          </text>
          <text
            x={gridX + side}
            y={ratioLabelY}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            PHENOTYPIC 3 : 1
          </text>
        </g>

        {/* 1. Parent-1 gametes (top header row) */}
        <ExplainAnchor
          selector="parent-gametes"
          index={1}
          pin={{ x: gridX + side / 2, y: -32 }}
          rect={{ x: gridX, y: -28, width: side, height: 24 }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Homozygous dominant cell (AA, top-left) */}
        <ExplainAnchor
          selector="homozygous-dominant"
          index={2}
          pin={{ x: domX + cellSize / 2, y: domY - 6 }}
          rect={{ x: domX, y: domY, width: cellSize, height: cellSize }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Heterozygous cell (Aa, top-right — 2 of the 4 cells) */}
        <ExplainAnchor
          selector="heterozygous"
          index={3}
          pin={{ x: hetX + cellSize + 14, y: hetY + cellSize / 2 }}
          rect={{ x: hetX, y: hetY, width: cellSize, height: cellSize }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Homozygous recessive cell (aa, bottom-right) */}
        <ExplainAnchor
          selector="homozygous-recessive"
          index={4}
          pin={{ x: recX + cellSize + 14, y: recY + cellSize / 2 }}
          rect={{ x: recX, y: recY, width: cellSize, height: cellSize }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Phenotype colour coding — dominant shading shared by AA + both Aa */}
        <ExplainAnchor
          selector="phenotype-shading"
          index={5}
          pin={{ x: gridX - 6, y: gridY + cellSize / 2 }}
          rect={{ x: gridX, y: gridY, width: cellSize, height: side }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Ratio caption — genotypic + phenotypic summary */}
        <ExplainAnchor
          selector="ratio-caption"
          index={6}
          pin={{ x: gridX + side / 2, y: ratioLabelY + 12 }}
          rect={{
            x: gridX,
            y: ratioLabelY - 10,
            width: side,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
