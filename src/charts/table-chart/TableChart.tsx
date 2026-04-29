"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// John Snow's 1854 Broad Street cholera outbreak data
// Rows = pump houses / streets near the Broad Street pump
// Columns: street, water source, deaths, attacks, households, distance (yards)
const CHOLERA_DATA = [
  { street: "Cambridge St",  source: "Broad St",  deaths: 29, attacks: 37, households: 20, distance: 59 },
  { street: "Broad St",      source: "Broad St",  deaths: 81, attacks: 98, households: 33, distance: 19 },
  { street: "Poland St",     source: "Broad St",  deaths: 20, attacks: 23, households: 15, distance: 70 },
  { street: "Berwick St",    source: "Broad St",  deaths: 26, attacks: 31, households: 17, distance: 85 },
  { street: "Little Pulteney", source: "Broad St", deaths: 22, attacks: 25, households: 12, distance: 95 },
  { street: "Great Pulteney", source: "Broad St", deaths: 17, attacks: 20, households: 14, distance: 110 },
  { street: "Lexington St",  source: "Broad St",  deaths: 13, attacks: 15, households: 11, distance: 140 },
  { street: "Marshall St",   source: "Broad St",  deaths: 9,  attacks: 11, households: 9,  distance: 162 },
  { street: "Carnaby St",    source: "Broad St",  deaths: 6,  attacks: 8,  households: 8,  distance: 188 },
  { street: "King St",       source: "Broad St",  deaths: 4,  attacks: 5,  households: 6,  distance: 230 },
];

const TOTALS = {
  deaths: CHOLERA_DATA.reduce((s, r) => s + r.deaths, 0),
  attacks: CHOLERA_DATA.reduce((s, r) => s + r.attacks, 0),
  households: CHOLERA_DATA.reduce((s, r) => s + r.households, 0),
};

const COLUMNS: Array<{
  key: keyof typeof CHOLERA_DATA[0];
  label: string;
  width: number;
  align: "left" | "right";
}> = [
  { key: "street",      label: "Street",       width: 0.32, align: "left"  },
  { key: "source",      label: "Water Source",  width: 0.18, align: "left"  },
  { key: "deaths",      label: "Deaths",        width: 0.12, align: "right" },
  { key: "attacks",     label: "Attacks",       width: 0.12, align: "right" },
  { key: "households",  label: "Households",    width: 0.13, align: "right" },
  { key: "distance",    label: "Dist. (yds)",   width: 0.13, align: "right" },
];

interface Props {
  width: number;
  height: number;
}

export function TableChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Row height calculation — fit all data rows + header + total into ih
  const rowCount = CHOLERA_DATA.length + 2; // header + data + total
  const rowH = Math.max(16, Math.min(28, ih / rowCount));
  const headerH = rowH;
  const fontSize = Math.max(8, Math.min(12, rowH * 0.52));
  const cellPad = 6;

  // Column x positions
  let cx = 0;
  const colX: number[] = [];
  const colW: number[] = [];
  for (const col of COLUMNS) {
    colX.push(cx);
    colW.push(iw * col.width);
    cx += iw * col.width;
  }

  const tableTop = 0;
  const firstDataY = tableTop + headerH;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Table chart: John Snow's 1854 Broad Street cholera outbreak data"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Header row */}
        <ExplainAnchor
          selector="header-row"
          index={1}
          pin={{ x: iw / 2, y: -8 }}
          rect={{ x: 0, y: tableTop, width: iw, height: headerH }}
        >
          <g data-data-layer="true">
            <rect
              x={0}
              y={tableTop}
              width={iw}
              height={headerH}
              fill="var(--color-ink)"
              opacity={0.9}
            />
            {COLUMNS.map((col, ci) => (
              <text
                key={col.key}
                x={
                  col.align === "right"
                    ? colX[ci] + colW[ci] - cellPad
                    : colX[ci] + cellPad
                }
                y={tableTop + headerH / 2}
                dominantBaseline="central"
                textAnchor={col.align === "right" ? "end" : "start"}
                fontFamily="var(--font-mono)"
                fontSize={fontSize}
                fontWeight="600"
                fill="var(--color-page)"
              >
                {col.label}
              </text>
            ))}
          </g>
        </ExplainAnchor>

        {/* Data rows */}
        <ExplainAnchor
          selector="data-rows"
          index={2}
          pin={{ x: iw + 10, y: firstDataY + rowH * 4 }}
          rect={{ x: 0, y: firstDataY, width: iw, height: rowH * CHOLERA_DATA.length }}
        >
          <g data-data-layer="true">
            {CHOLERA_DATA.map((row, ri) => {
              const ry = firstDataY + ri * rowH;
              const isAlt = ri % 2 === 1;
              return (
                <g key={row.street}>
                  <rect
                    x={0}
                    y={ry}
                    width={iw}
                    height={rowH}
                    fill={isAlt ? "var(--color-hairline)" : "transparent"}
                    opacity={isAlt ? 0.4 : 1}
                  />
                  {/* Row border */}
                  <line
                    x1={0}
                    x2={iw}
                    y1={ry + rowH}
                    y2={ry + rowH}
                    stroke="var(--color-hairline)"
                    strokeWidth={0.5}
                  />
                  {COLUMNS.map((col, ci) => (
                    <text
                      key={col.key}
                      x={
                        col.align === "right"
                          ? colX[ci] + colW[ci] - cellPad
                          : colX[ci] + cellPad
                      }
                      y={ry + rowH / 2}
                      dominantBaseline="central"
                      textAnchor={col.align === "right" ? "end" : "start"}
                      fontFamily="var(--font-mono)"
                      fontSize={fontSize}
                      fill="var(--color-ink)"
                    >
                      {String(row[col.key])}
                    </text>
                  ))}
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Column borders (vertical separators) */}
        <ExplainAnchor
          selector="column-borders"
          index={3}
          pin={{ x: colX[2] - 8, y: firstDataY + rowH * 2 }}
          rect={{
            x: colX[2] - 4,
            y: tableTop,
            width: 8,
            height: headerH + rowH * CHOLERA_DATA.length + rowH,
          }}
        >
          <g data-data-layer="true">
            {COLUMNS.slice(1).map((_, ci) => (
              <line
                key={ci}
                x1={colX[ci + 1]}
                x2={colX[ci + 1]}
                y1={tableTop}
                y2={firstDataY + rowH * CHOLERA_DATA.length + rowH}
                stroke="var(--color-hairline)"
                strokeWidth={0.8}
              />
            ))}
            {/* Outer border */}
            <rect
              x={0}
              y={tableTop}
              width={iw}
              height={headerH + rowH * CHOLERA_DATA.length + rowH}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          </g>
        </ExplainAnchor>

        {/* Distance column — the causal gradient column */}
        <ExplainAnchor
          selector="distance-column"
          index={4}
          pin={{ x: colX[5] + colW[5] / 2, y: firstDataY + rowH * 2 - 12 }}
          rect={{
            x: colX[5],
            y: tableTop,
            width: colW[5],
            height: headerH + rowH * CHOLERA_DATA.length + rowH,
          }}
        >
          <g data-data-layer="true" />
        </ExplainAnchor>

        {/* Total row */}
        <ExplainAnchor
          selector="total-row"
          index={5}
          pin={{ x: colX[2] + colW[2] / 2, y: firstDataY + rowH * CHOLERA_DATA.length + rowH + 10 }}
          rect={{
            x: 0,
            y: firstDataY + rowH * CHOLERA_DATA.length,
            width: iw,
            height: rowH,
          }}
        >
          <g data-data-layer="true">
            <rect
              x={0}
              y={firstDataY + rowH * CHOLERA_DATA.length}
              width={iw}
              height={rowH}
              fill="var(--color-ink)"
              opacity={0.12}
            />
            <line
              x1={0}
              x2={iw}
              y1={firstDataY + rowH * CHOLERA_DATA.length}
              y2={firstDataY + rowH * CHOLERA_DATA.length}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            {/* "TOTAL" label */}
            <text
              x={cellPad}
              y={firstDataY + rowH * CHOLERA_DATA.length + rowH / 2}
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fontWeight="600"
              fill="var(--color-ink)"
            >
              TOTAL
            </text>
            {/* Total deaths */}
            <text
              x={colX[2] + colW[2] - cellPad}
              y={firstDataY + rowH * CHOLERA_DATA.length + rowH / 2}
              dominantBaseline="central"
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {TOTALS.deaths}
            </text>
            {/* Total attacks */}
            <text
              x={colX[3] + colW[3] - cellPad}
              y={firstDataY + rowH * CHOLERA_DATA.length + rowH / 2}
              dominantBaseline="central"
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {TOTALS.attacks}
            </text>
            {/* Total households */}
            <text
              x={colX[4] + colW[4] - cellPad}
              y={firstDataY + rowH * CHOLERA_DATA.length + rowH / 2}
              dominantBaseline="central"
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={fontSize}
              fontWeight="600"
              fill="var(--color-ink)"
            >
              {TOTALS.households}
            </text>
          </g>
        </ExplainAnchor>

        {/* Source caption */}
        <ExplainAnchor
          selector="source-caption"
          index={6}
          pin={{ x: iw / 2, y: firstDataY + rowH * CHOLERA_DATA.length + rowH + 20 }}
          rect={{
            x: 0,
            y: firstDataY + rowH * CHOLERA_DATA.length + rowH + 4,
            width: iw,
            height: 18,
          }}
        >
          <text
            x={iw / 2}
            y={firstDataY + rowH * CHOLERA_DATA.length + rowH + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={Math.max(7, fontSize - 2)}
            fill="var(--color-ink-mute)"
          >
            Source: John Snow, On the Mode of Communication of Cholera (1855)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
