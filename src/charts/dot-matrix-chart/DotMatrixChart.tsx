"use client";

import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";
import { useMemo } from "react";

// 2023 US military deaths by branch (approximate, public DOD data)
const RAW_DATA = [
  { branch: "Army", deaths: 116 },
  { branch: "Navy", deaths: 60 },
  { branch: "Air Force", deaths: 55 },
  { branch: "Marines", deaths: 55 },
  { branch: "Coast Guard", deaths: 18 },
] as const;

// Grid width in dots per row
const GRID_COLS = 15;

export function DotMatrixChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 24, right: 24, bottom: 36, left: 110 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { data, dotR, colSpacing, rowSpacing } = useMemo(() => {
    // Each row = one branch. GRID_COLS dots wide. Multiple rows per branch if deaths > GRID_COLS.
    const rowsPerBranch = RAW_DATA.map((d) => Math.ceil(d.deaths / GRID_COLS));
    const totalRows = rowsPerBranch.reduce((a, b) => a + b, 0);

    // Fit dots into available space
    const colSpacing = iw > 0 ? iw / GRID_COLS : 10;
    const rowSpacing = ih > 0 ? ih / (totalRows + 1) : 10;
    const dotR = Math.min(colSpacing, rowSpacing) * 0.32;

    // Build dot data
    const data = RAW_DATA.map((d, bi) => {
      const rowsBefore = RAW_DATA.slice(0, bi).reduce(
        (sum, r) => sum + Math.ceil(r.deaths / GRID_COLS),
        0
      );
      const rowCount = Math.ceil(d.deaths / GRID_COLS);
      const dots: { col: number; row: number; filled: boolean }[] = [];
      for (let r = 0; r < rowCount; r++) {
        for (let c = 0; c < GRID_COLS; c++) {
          const idx = r * GRID_COLS + c;
          dots.push({
            col: c,
            row: rowsBefore + r,
            filled: idx < d.deaths,
          });
        }
      }
      return { ...d, rowsBefore, rowCount, dots };
    });

    return { data, dotR, colSpacing, rowSpacing };
  }, [iw, ih]);

  // Y position of first row for each branch
  const branchY = (bi: number) =>
    data[bi].rowsBefore * rowSpacing + rowSpacing * 0.5;

  // X/Y of a dot
  const dotX = (col: number) => col * colSpacing + colSpacing * 0.5;
  const dotY = (row: number) => row * rowSpacing + rowSpacing * 0.5;

  // Totals row for scale annotation
  const maxDeaths = Math.max(...RAW_DATA.map((d) => d.deaths));

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Dot Matrix Chart: 2023 US military deaths by branch"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Data layer: all dots */}
        <g data-data-layer="true">
          {data.map((branch) =>
            branch.dots.map((dot, di) => (
              <circle
                key={`${branch.branch}-${di}`}
                cx={dotX(dot.col)}
                cy={dotY(dot.row)}
                r={dotR}
                fill={dot.filled ? "var(--color-ink)" : "transparent"}
                stroke="var(--color-ink)"
                strokeWidth={dot.filled ? 0 : 0.6}
                opacity={dot.filled ? 0.85 : 0.2}
              />
            ))
          )}
        </g>

        {/* Anchor 1: filled dot (the primary mark) */}
        <ExplainAnchor
          selector="filled-dot"
          index={1}
          pin={{ x: dotX(2), y: dotY(data[0].rowsBefore) - dotR * 2 - 8 }}
          rect={{
            x: dotX(0) - dotR,
            y: dotY(data[0].rowsBefore) - dotR,
            width: dotX(4) - dotX(0) + dotR * 2,
            height: dotR * 2 + 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: empty dot (the grid filler) */}
        <ExplainAnchor
          selector="empty-dot"
          index={2}
          pin={{
            x: dotX(GRID_COLS - 1) + 14,
            y: dotY(data[0].rowsBefore) - dotR * 2 - 8,
          }}
          rect={{
            x: dotX(GRID_COLS - 3) - dotR,
            y: dotY(data[0].rowsBefore) - dotR,
            width: dotX(GRID_COLS - 1) - dotX(GRID_COLS - 3) + dotR * 2,
            height: dotR * 2 + 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Branch labels (left margin) */}
        {data.map((branch, bi) => {
          const midRow = branch.rowsBefore + (branch.rowCount - 1) * 0.5;
          return (
            <text
              key={branch.branch}
              x={-8}
              y={dotY(midRow)}
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              {branch.branch}
            </text>
          );
        })}

        {/* Anchor 3: row label */}
        <ExplainAnchor
          selector="row-label"
          index={3}
          pin={{ x: -margin.left + 8, y: dotY(data[1].rowsBefore) }}
          rect={{
            x: -margin.left,
            y: dotY(data[0].rowsBefore) - rowSpacing * 0.5,
            width: margin.left - 4,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: dot row (one full row of a branch) */}
        <ExplainAnchor
          selector="dot-row"
          index={4}
          pin={{ x: iw * 0.5, y: dotY(data[2].rowsBefore) - rowSpacing * 0.5 - 10 }}
          rect={{
            x: 0,
            y: dotY(data[2].rowsBefore) - rowSpacing * 0.5,
            width: iw,
            height: rowSpacing * data[2].rowCount,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Death count annotation per branch */}
        <g data-data-layer="true">
          {data.map((branch) => {
            const midRow = branch.rowsBefore + (branch.rowCount - 1) * 0.5;
            return (
              <text
                key={`cnt-${branch.branch}`}
                x={iw + 6}
                y={dotY(midRow)}
                textAnchor="start"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-mute)"
              >
                {branch.deaths}
              </text>
            );
          })}
        </g>

        {/* Anchor 5: count label */}
        <ExplainAnchor
          selector="count-label"
          index={5}
          pin={{ x: Math.min(iw + 22, iw - 2), y: dotY(data[4].rowsBefore) + 10 }}
          rect={{
            x: iw,
            y: 0,
            width: Math.min(28, margin.right),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis: scale caption */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw * 0.5, y: ih + 22 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <text
            x={iw * 0.5}
            y={ih + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            1 dot = 1 death · 2023 US MILITARY
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
