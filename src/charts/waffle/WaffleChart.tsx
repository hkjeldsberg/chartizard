"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Global adult literacy rate — 87% of adults 15+ can read and write a short
// simple statement about their everyday life (UNESCO Institute for Statistics,
// 2022 estimate). 100-cell grid: 87 filled, 13 empty.
const FILLED = 87;
const TOTAL = 100;
const COLS = 10;
const ROWS = 10;

const COLUMNS: ReadonlyArray<number> = Array.from({ length: COLS }, (_, i) => i);
const ROWS_ARR: ReadonlyArray<number> = Array.from({ length: ROWS }, (_, i) => i);

interface Props {
  width: number;
  height: number;
}

export function WaffleChart({ width, height }: Props) {
  const margin = { top: 36, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Keep the grid square so a column reads as exactly 10% and a cell as 1%.
  const gridSize = Math.max(0, Math.min(iw, ih));
  const gridLeft = (iw - gridSize) / 2;
  const gridTop = 0;

  const xScale = scaleBand<number>({
    domain: [...COLUMNS],
    range: [0, gridSize],
  });
  const yScale = scaleBand<number>({
    domain: [...ROWS_ARR],
    range: [0, gridSize],
  });

  const bw = xScale.bandwidth();
  const bh = yScale.bandwidth();
  // Visible gutter between cells: render each cell at 85% of bandwidth.
  const cellW = bw * 0.85;
  const cellH = bh * 0.85;
  const insetX = (bw - cellW) / 2;
  const insetY = (bh - cellH) / 2;

  // Cells rendered row-major, bottom-to-top so "filled" reads like a vessel
  // filling up from the floor. With 87/100 filled, the top row has 3 empties.
  // Index 0..99 → (col, row) where row 0 is the BOTTOM row.
  const cells = Array.from({ length: TOTAL }, (_, idx) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    const filled = idx < FILLED;
    return { idx, row, col, filled };
  });

  // Pick representative anchor cells.
  const filledAnchor = cells.find((c) => c.filled && c.row === 4 && c.col === 4)!;
  const emptyAnchor = cells.find((c) => !c.filled && c.row === 9 && c.col === 5)!;
  const proportionAnchor = cells.find((c) => c.filled && c.row === 8 && c.col === 6)!;

  function cellX(c: { col: number }) {
    return (xScale(c.col) ?? 0) + insetX;
  }
  function cellY(c: { row: number }) {
    // Flip the row so row 0 renders at the BOTTOM of the grid.
    const topIndex = ROWS - 1 - c.row;
    return (yScale(topIndex) ?? 0) + insetY;
  }

  // Clamp rects into the grid's coordinate frame so hover hit-regions never
  // escape the plot area. Bottom caption is the intentional margin exception
  // and is not clamped.
  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(gridSize, r.x));
    const y = Math.max(0, Math.min(gridSize, r.y));
    const width = Math.max(0, Math.min(gridSize - x, r.width - (x - r.x)));
    const height = Math.max(0, Math.min(gridSize - y, r.height - (y - r.y)));
    return { x, y, width, height };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Waffle chart">
      <Group left={margin.left + gridLeft} top={margin.top + gridTop}>
        {/* Headline label — the proportion as a single number. */}
        <g data-data-layer="true">
          <text
            x={gridSize / 2}
            y={-16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={18}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            87%
          </text>
        </g>

        {/* The 100-cell grid — data layer. */}
        <g data-data-layer="true">
          {cells.map((c) =>
            c.filled ? (
              <rect
                key={c.idx}
                x={cellX(c)}
                y={cellY(c)}
                width={cellW}
                height={cellH}
                fill="var(--color-ink)"
              />
            ) : (
              <rect
                key={c.idx}
                x={cellX(c)}
                y={cellY(c)}
                width={cellW}
                height={cellH}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1}
                shapeRendering="crispEdges"
              />
            ),
          )}
        </g>

        {/* Caption under the grid — cell legend. */}
        <g data-data-layer="true">
          <text
            x={gridSize / 2}
            y={gridSize + 22}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            1 SQUARE = 1%
          </text>
        </g>

        {/* 1. Filled cell — a single inked square standing for 1%. */}
        <ExplainAnchor
          selector="filled-cell"
          index={1}
          pin={{ x: cellX(filledAnchor) + cellW + 12, y: cellY(filledAnchor) - 6 }}
          rect={clampRect({
            x: cellX(filledAnchor) - 1,
            y: cellY(filledAnchor) - 1,
            width: cellW + 2,
            height: cellH + 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Empty cell — hairline-outlined square representing the missing 1%. */}
        <ExplainAnchor
          selector="empty-cell"
          index={2}
          pin={{ x: cellX(emptyAnchor) + cellW + 12, y: cellY(emptyAnchor) + cellH / 2 }}
          rect={clampRect({
            x: cellX(emptyAnchor) - 1,
            y: cellY(emptyAnchor) - 1,
            width: cellW + 2,
            height: cellH + 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Total cells — the whole 100-square grid, representing the denominator. */}
        <ExplainAnchor
          selector="total-cells"
          index={3}
          pin={{ x: gridSize + 14, y: gridSize / 2 }}
          rect={clampRect({ x: 0, y: 0, width: gridSize, height: gridSize })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Proportion — the 87 filled squares read as a share of 100. */}
        <ExplainAnchor
          selector="proportion"
          index={4}
          pin={{ x: cellX(proportionAnchor) + cellW + 12, y: cellY(proportionAnchor) + cellH / 2 }}
          rect={clampRect({
            x: cellX(proportionAnchor) - 1,
            y: cellY(proportionAnchor) - 1,
            width: cellW + 2,
            height: cellH + 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Grid layout — why the 10×10 arrangement beats angular pie wedges. */}
        <ExplainAnchor
          selector="grid-layout"
          index={5}
          pin={{ x: -14, y: gridSize / 2 }}
          rect={clampRect({ x: 0, y: 0, width: gridSize, height: gridSize })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Cell-as-unit baseline — "1 square = 1%" caption. */}
        <ExplainAnchor
          selector="comparison-baseline"
          index={6}
          pin={{ x: gridSize / 2, y: gridSize + 34 }}
          rect={{ x: 0, y: gridSize + 10, width: gridSize, height: 24 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
