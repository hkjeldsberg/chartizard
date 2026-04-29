"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Lifetime risk of developing breast cancer in women: approximately 1 in 8 —
// about 12–13% (U.S. National Cancer Institute SEER Program, 2020 estimate).
// 100-icon grid: 13 shaded, 87 unshaded. Each icon is one woman out of 100.
const SHADED = 13;
const TOTAL = 100;
const COLS = 10;
const ROWS = 10;

interface Props {
  width: number;
  height: number;
}

// Stick-figure woman icon drawn inside a 20×20 box. Head circle, torso line,
// arms, legs, and a short triangular skirt that encodes the subject without
// ornament. Shaded state: head filled, strokes at full weight. Unshaded
// state: hairline head outline, hairline strokes — the missing 87 still read
// as humans, not empty squares.
function FigureIcon({
  x,
  y,
  size,
  shaded,
}: {
  x: number;
  y: number;
  size: number;
  shaded: boolean;
}) {
  const s = size / 20;
  const ink = "var(--color-ink)";
  const stroke = shaded ? ink : "var(--color-hairline)";
  const strokeW = shaded ? 1.3 : 0.9;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* Head */}
      <circle
        cx={10}
        cy={3.5}
        r={2}
        fill={shaded ? ink : "none"}
        stroke={shaded ? "none" : stroke}
        strokeWidth={shaded ? 0 : strokeW}
      />
      {/* Torso */}
      <line
        x1={10}
        y1={5.5}
        x2={10}
        y2={12}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      {/* Arms */}
      <line
        x1={10}
        y1={7.5}
        x2={5.5}
        y2={10.5}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      <line
        x1={10}
        y1={7.5}
        x2={14.5}
        y2={10.5}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      {/* Skirt (triangular — encodes female subject without ornament) */}
      <path
        d="M10 11.5 L6.5 15.5 L13.5 15.5 Z"
        fill={shaded ? ink : "none"}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinejoin="round"
      />
      {/* Legs */}
      <line
        x1={8}
        y1={15.5}
        x2={7}
        y2={19}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
      <line
        x1={12}
        y1={15.5}
        x2={13}
        y2={19}
        stroke={stroke}
        strokeWidth={strokeW}
        strokeLinecap="round"
      />
    </g>
  );
}

export function PictorialPercentageChart({ width, height }: Props) {
  const margin = { top: 36, right: 20, bottom: 48, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Keep grid square so each column reads as exactly 10%.
  const gridSize = Math.max(0, Math.min(iw, ih));
  const gridLeft = (iw - gridSize) / 2;
  const cellSize = gridSize / COLS;
  // Render each figure at ~85% of the cell so gutters separate icons visibly.
  const iconSize = cellSize * 0.85;
  const iconInset = (cellSize - iconSize) / 2;

  // Build cells row-major; row 0 is the BOTTOM row so "shaded" fills from the
  // floor upward — the 13 shaded figures form a compact group in the two
  // bottom rows, which reads as the at-risk population without rearranging
  // the grid each render.
  const cells = Array.from({ length: TOTAL }, (_, idx) => {
    const row = Math.floor(idx / COLS);
    const col = idx % COLS;
    const shaded = idx < SHADED;
    return { idx, row, col, shaded };
  });

  function cellX(c: { col: number }) {
    return c.col * cellSize + iconInset;
  }
  function cellY(c: { row: number }) {
    // Flip row so row 0 is at the BOTTOM.
    const topIndex = ROWS - 1 - c.row;
    return topIndex * cellSize + iconInset;
  }

  // Pick representative anchor cells.
  const shadedAnchor = cells.find((c) => c.shaded && c.row === 0 && c.col === 5)!;
  const unshadedAnchor = cells.find((c) => !c.shaded && c.row === 5 && c.col === 5)!;

  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(gridSize, r.x));
    const y = Math.max(0, Math.min(gridSize, r.y));
    const right = Math.max(0, Math.min(gridSize, r.x + r.width));
    const bottom = Math.max(0, Math.min(gridSize, r.y + r.height));
    return { x, y, width: right - x, height: bottom - y };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Pictorial percentage chart">
      <Group left={margin.left + gridLeft} top={margin.top}>
        {/* Headline — the subject of the chart, stated as a ratio. */}
        <g data-data-layer="true">
          <text
            x={gridSize / 2}
            y={-18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={13}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            1 IN 8 WOMEN · LIFETIME RISK
          </text>
        </g>

        {/* The 100-figure grid. */}
        <g data-data-layer="true">
          {cells.map((c) => (
            <FigureIcon
              key={c.idx}
              x={cellX(c)}
              y={cellY(c)}
              size={iconSize}
              shaded={c.shaded}
            />
          ))}
        </g>

        {/* Caption — each figure stands for one woman out of a hundred. */}
        <g data-data-layer="true">
          <text
            x={gridSize / 2}
            y={gridSize + 22}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            SHADED = LIFETIME DIAGNOSIS · UNSHADED = NO DIAGNOSIS
          </text>
        </g>

        {/* 1. Shaded figure — one of the 13 at-risk women. */}
        <ExplainAnchor
          selector="shaded-figure"
          index={1}
          pin={{
            x: cellX(shadedAnchor) + iconSize + 12,
            y: cellY(shadedAnchor) + iconSize / 2,
          }}
          rect={clampRect({
            x: cellX(shadedAnchor) - 2,
            y: cellY(shadedAnchor) - 2,
            width: iconSize + 4,
            height: iconSize + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Unshaded figure — one of the 87 without a diagnosis. */}
        <ExplainAnchor
          selector="unshaded-figure"
          index={2}
          pin={{
            x: cellX(unshadedAnchor) + iconSize + 12,
            y: cellY(unshadedAnchor) + iconSize / 2,
          }}
          rect={clampRect({
            x: cellX(unshadedAnchor) - 2,
            y: cellY(unshadedAnchor) - 2,
            width: iconSize + 4,
            height: iconSize + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Icon subject — the figure shape carries the domain. */}
        <ExplainAnchor
          selector="icon-subject"
          index={3}
          pin={{ x: -14, y: gridSize - cellSize / 2 }}
          rect={clampRect({
            x: 0,
            y: gridSize - cellSize * 2,
            width: gridSize,
            height: cellSize * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Grid of 100 — the whole denominator. */}
        <ExplainAnchor
          selector="grid-of-100"
          index={4}
          pin={{ x: gridSize + 14, y: gridSize / 2 }}
          rect={clampRect({ x: 0, y: 0, width: gridSize, height: gridSize })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Shaded cluster — the 13 shaded figures read as a share, not a count. */}
        <ExplainAnchor
          selector="shaded-cluster"
          index={5}
          pin={{ x: gridSize + 14, y: gridSize - cellSize }}
          rect={clampRect({
            x: 0,
            y: gridSize - cellSize * 2,
            width: cellSize * (SHADED % COLS === 0 ? COLS : COLS),
            height: cellSize * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Legend caption — the Rosetta Stone pairing shaded with meaning. */}
        <ExplainAnchor
          selector="legend-caption"
          index={6}
          pin={{ x: gridSize / 2, y: gridSize + 36 }}
          rect={{ x: 0, y: gridSize + 10, width: gridSize, height: 24 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
