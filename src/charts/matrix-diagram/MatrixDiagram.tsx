"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// QFD House of Quality — simplified L-matrix + roof triangle
//
// Rows = 4 customer needs
// Columns = 4 engineering specs
// Cells = relationship symbol: ● strong / ○ medium / △ weak / "" none
// Roof = upper-triangular spec-vs-spec correlation matrix
// ---------------------------------------------------------------------------

const NEEDS = ["Long battery life", "Light weight", "Clear camera", "Loud speaker"];
const SPECS = ["Battery capacity", "Case thickness", "Megapixels", "Speaker wattage"];

// Cell relationships: [need index][spec index] = "strong" | "medium" | "weak" | ""
const RELATIONSHIPS: Array<Array<"strong" | "medium" | "weak" | "">> = [
  ["strong", "weak",   "",        ""],        // Long battery
  ["weak",   "strong", "weak",    "weak"],    // Light weight
  ["",       "weak",   "strong",  ""],        // Clear camera
  ["",       "medium", "",        "strong"],  // Loud speaker
];

// Roof correlations — upper triangle only: [col i][col j] where j > i
// "positive" / "negative" / ""
const ROOF: Array<Array<"positive" | "negative" | "">> = [
  ["", "negative", "positive", "negative"], // Battery cap vs others
  ["", "",         "positive", "negative"], // Case thickness vs others
  ["", "",         "",         ""],          // Megapixels vs others
  ["", "",         "",         ""],          // Speaker wattage (no more cols)
];

// Symbols
const SYMBOL = {
  strong: "●",
  medium: "○",
  weak: "△",
  "": "",
};

export function MatrixDiagram({ width, height }: { width: number; height: number }) {
  const margin = { top: 20, right: 20, bottom: 40, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const n = NEEDS.length;  // 4
  const m = SPECS.length;  // 4

  // We'll fit everything into a rectangular area.
  // Layout: left strip for need labels, top area for spec headers + roof, cells in centre.
  const NEED_LABEL_W = 100;
  const SPEC_HEADER_H = 80; // space for rotated spec labels + roof
  const ROOF_H = 50;        // height of roof triangle area within SPEC_HEADER_H

  const availW = iw - NEED_LABEL_W;
  const availH = ih - SPEC_HEADER_H;

  const cellW = Math.max(30, availW / m);
  const cellH = Math.max(24, availH / n);

  // Cap so the chart doesn't overflow
  const usedW = Math.min(availW, cellW * m);
  const usedH = Math.min(availH, cellH * n);

  const gridX = NEED_LABEL_W; // x start of column grid
  const gridY = SPEC_HEADER_H; // y start of row grid

  // Roof triangle sits above the column headers
  // The roof is an upper-triangle connecting each pair of spec column centres
  const colCx = (i: number) => gridX + i * cellW + cellW / 2;
  const roofApex = gridY - ROOF_H; // top of the roof

  // Roof cells are small triangles between column i and column j (j > i)
  // We draw a parallelogram/diamond shape for each roof cell
  const roofCellCy = (i: number, j: number) => {
    // midpoint in the triangular roof
    const pct = ((i + j) / 2) / (m - 1);
    return roofApex + ROOF_H * (1 - Math.abs(0.5 - pct) * 2) * 0.5 + ROOF_H * 0.15;
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Matrix Diagram — QFD House of Quality">
      <Group left={margin.left} top={margin.top}>

        <g data-data-layer="true">

          {/* ── Roof (House of Quality triangle) ───────── */}
          {/* Outline triangle */}
          <polygon
            points={[
              `${colCx(0)},${gridY}`,
              `${colCx(m - 1)},${gridY}`,
              `${(colCx(0) + colCx(m - 1)) / 2},${roofApex}`,
            ].join(" ")}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            opacity={0.7}
          />
          {/* Roof internal lines (diagonal grid) */}
          {Array.from({ length: m }).map((_, i) => (
            <line
              key={`roof-left-${i}`}
              x1={colCx(i)}
              y1={gridY}
              x2={(colCx(0) + colCx(m - 1)) / 2 + (colCx(i) - (colCx(0) + colCx(m - 1)) / 2) * (i === 0 ? 1 : 0)}
              y2={i === 0 ? gridY : roofApex + (gridY - roofApex) * (i / (m - 1))}
              stroke="var(--color-hairline)"
              strokeWidth={0.8}
            />
          ))}
          {/* Roof correlation symbols */}
          {ROOF.map((row, i) =>
            row.map((val, j) => {
              if (j <= i || val === "") return null;
              const cx = (colCx(i) + colCx(j)) / 2;
              const cy = roofApex + (gridY - roofApex) * ((i + j) / (2 * (m - 1)));
              const symbol = val === "positive" ? "+" : val === "negative" ? "−" : "";
              return (
                <text
                  key={`roof-${i}-${j}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={11}
                  fontFamily="var(--font-mono)"
                  fill="var(--color-ink)"
                  opacity={0.75}
                >
                  {symbol}
                </text>
              );
            })
          )}

          {/* ── Spec column headers (rotated text) ─────── */}
          {SPECS.map((spec, j) => (
            <g key={`spec-${j}`} transform={`translate(${colCx(j)}, ${gridY - 4})`}>
              <text
                transform="rotate(-55)"
                textAnchor="start"
                fontSize={9}
                fontFamily="var(--font-mono)"
                fill="var(--color-ink)"
              >
                {spec}
              </text>
            </g>
          ))}

          {/* ── Grid background ─────────────────────────── */}
          {Array.from({ length: n }).map((_, i) => (
            <rect
              key={`row-bg-${i}`}
              x={gridX}
              y={gridY + i * cellH}
              width={cellW * m}
              height={cellH}
              fill={i % 2 === 0 ? "var(--color-surface)" : "transparent"}
              stroke="var(--color-hairline)"
              strokeWidth={0}
            />
          ))}

          {/* ── Grid lines ──────────────────────────────── */}
          {/* Vertical column lines */}
          {Array.from({ length: m + 1 }).map((_, j) => (
            <line
              key={`vline-${j}`}
              x1={gridX + j * cellW}
              y1={gridY}
              x2={gridX + j * cellW}
              y2={gridY + n * cellH}
              stroke="var(--color-hairline)"
              strokeWidth={0.8}
            />
          ))}
          {/* Horizontal row lines */}
          {Array.from({ length: n + 1 }).map((_, i) => (
            <line
              key={`hline-${i}`}
              x1={gridX}
              y1={gridY + i * cellH}
              x2={gridX + m * cellW}
              y2={gridY + i * cellH}
              stroke="var(--color-hairline)"
              strokeWidth={0.8}
            />
          ))}

          {/* ── Need row labels ─────────────────────────── */}
          {NEEDS.map((need, i) => (
            <text
              key={`need-${i}`}
              x={gridX - 6}
              y={gridY + i * cellH + cellH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--color-ink)"
            >
              {need}
            </text>
          ))}

          {/* ── Cell relationship symbols ────────────────── */}
          {RELATIONSHIPS.map((row, i) =>
            row.map((rel, j) => {
              if (rel === "") return null;
              return (
                <text
                  key={`cell-${i}-${j}`}
                  x={gridX + j * cellW + cellW / 2}
                  y={gridY + i * cellH + cellH / 2}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontSize={rel === "strong" ? 14 : 12}
                  fontFamily="var(--font-sans, sans-serif)"
                  fill="var(--color-ink)"
                >
                  {SYMBOL[rel]}
                </text>
              );
            })
          )}

          {/* ── Legend ─────────────────────────────────── */}
          {(["strong", "medium", "weak"] as const).map((rel, i) => (
            <g key={`legend-${i}`}>
              <text
                x={gridX + i * (usedW / 3) + (usedW / 3) / 2}
                y={gridY + n * cellH + 20}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={11}
                fontFamily="var(--font-sans, sans-serif)"
                fill="var(--color-ink)"
              >
                {SYMBOL[rel]}
              </text>
              <text
                x={gridX + i * (usedW / 3) + (usedW / 3) / 2 + 14}
                y={gridY + n * cellH + 20}
                textAnchor="start"
                dominantBaseline="central"
                fontSize={8}
                fontFamily="var(--font-mono)"
                fill="var(--color-ink-soft)"
              >
                {rel}
              </text>
            </g>
          ))}

        </g>

        {/* ── ExplainAnchors ─────────────────────────── */}

        {/* 1. L-matrix cells */}
        <ExplainAnchor
          selector="matrix-cell"
          index={1}
          pin={{ x: gridX + 0 * cellW + cellW / 2 + 12, y: gridY + 0 * cellH - 12 }}
          rect={{ x: gridX, y: gridY, width: cellW * m, height: cellH * n }}
        />

        {/* 2. Customer needs (rows) */}
        <ExplainAnchor
          selector="customer-needs"
          index={2}
          pin={{ x: gridX - 12, y: gridY - 12 }}
          rect={{ x: 0, y: gridY, width: NEED_LABEL_W - 4, height: cellH * n }}
        />

        {/* 3. Engineering specs (columns) */}
        <ExplainAnchor
          selector="engineering-specs"
          index={3}
          pin={{ x: colCx(m - 1) + 14, y: gridY + 8 }}
          rect={{ x: gridX, y: gridY - 30, width: cellW * m, height: 30 }}
        />

        {/* 4. Relationship symbols */}
        <ExplainAnchor
          selector="relationship-symbols"
          index={4}
          pin={{ x: gridX + cellW * 0 + cellW / 2 + 12, y: gridY + cellH * 0 + cellH / 2 }}
          rect={{ x: gridX + 1, y: gridY + 1, width: cellW - 2, height: cellH - 2 }}
        />

        {/* 5. Roof triangle */}
        <ExplainAnchor
          selector="roof-triangle"
          index={5}
          pin={{ x: colCx(m - 1) + 14, y: roofApex + (gridY - roofApex) / 2 }}
          rect={{ x: colCx(0), y: roofApex, width: colCx(m - 1) - colCx(0), height: gridY - roofApex }}
        />

        {/* 6. Legend */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: gridX + cellW * m + 14, y: gridY + n * cellH + 20 }}
          rect={{ x: gridX, y: gridY + n * cellH + 8, width: cellW * m, height: 24 }}
        />

      </Group>
    </svg>
  );
}
