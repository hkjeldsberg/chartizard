"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// RACI Matrix — software-release accountability grid.
// Tasks in rows, roles in columns, each cell carries R / A / C / I or empty.
// Rule: exactly ONE A per row (one owner per task). Violations are the failure
// mode the chart exists to surface.

const ROLES = ["PM", "Engineer", "Designer", "QA", "Support"] as const;
type RoleKey = (typeof ROLES)[number];

const TASKS = [
  "Draft spec",
  "Approve spec",
  "Implement feature",
  "Review code",
  "Release to prod",
  "Monitor post-release",
] as const;
type TaskKey = (typeof TASKS)[number];

type RaciCode = "R" | "A" | "C" | "I" | "-";

// Exactly one A per row — the canonical RACI invariant.
const MATRIX: Record<TaskKey, Record<RoleKey, RaciCode>> = {
  "Draft spec": {
    PM: "R",
    Engineer: "C",
    Designer: "A",
    QA: "I",
    Support: "I",
  },
  "Approve spec": {
    PM: "A",
    Engineer: "C",
    Designer: "C",
    QA: "C",
    Support: "I",
  },
  "Implement feature": {
    PM: "I",
    Engineer: "A",
    Designer: "C",
    QA: "C",
    Support: "-",
  },
  "Review code": {
    PM: "-",
    Engineer: "R",
    Designer: "-",
    QA: "A",
    Support: "-",
  },
  "Release to prod": {
    PM: "C",
    Engineer: "R",
    Designer: "-",
    QA: "C",
    Support: "A",
  },
  "Monitor post-release": {
    PM: "I",
    Engineer: "C",
    Designer: "-",
    QA: "C",
    Support: "A",
  },
};

// Visual encoding for each RACI code.
// A = filled square (solid, owner)
// R = filled circle (doer)
// C = diamond outline (consulted before)
// I = small dot (informed after)
// - = empty cell (not involved)

interface Props {
  width: number;
  height: number;
}

// Return cell background fill by code.
function cellBg(code: RaciCode): string {
  if (code === "A") return "rgba(60,100,90,0.18)";
  if (code === "R") return "rgba(60,80,130,0.12)";
  return "var(--color-surface)";
}

export function RaciMatrix({ width, height }: Props) {
  const margin = { top: 20, right: 16, bottom: 16, left: 128 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const nCols = ROLES.length;
  const nRows = TASKS.length;

  // +1 for the header row
  const rowH = ih / (nRows + 1);
  const colW = iw / nCols;

  const headerH = rowH;

  // X positions for role columns (centres).
  const colCentreX = (ci: number) => ci * colW + colW / 2;
  // Y positions for task rows (centres), offset by header row.
  const rowCentreY = (ri: number) => headerH + ri * rowH + rowH / 2;

  // Cell top-left coords.
  const cellX = (ci: number) => ci * colW;
  const cellY = (ri: number) => headerH + ri * rowH;

  // Representative anchors —
  // (a) A-cell: Approve spec × PM  (row 1, col 0)
  const aCellRowIdx = TASKS.indexOf("Approve spec");
  const aCellColIdx = ROLES.indexOf("PM");

  // (b) R-cell: Draft spec × PM  (row 0, col 0)
  const rCellRowIdx = TASKS.indexOf("Draft spec");
  const rCellColIdx = ROLES.indexOf("PM");

  // (c) C-cell: Implement feature × Designer  (row 2, col 2)
  const cCellRowIdx = TASKS.indexOf("Implement feature");
  const cCellColIdx = ROLES.indexOf("Designer");

  // (d) I-cell: Draft spec × QA  (row 0, col 3) — iCellColIdx used for c-vs-i rect width.
  const iCellColIdx = ROLES.indexOf("QA");

  // (e) Empty cell: Review code × PM  (row 3, col 0)
  const emCellRowIdx = TASKS.indexOf("Review code");
  const emCellColIdx = ROLES.indexOf("PM");

  // Glyph renderer — draws the symbol for a code inside a cell of size w×h
  // centred at (cx, cy).
  function Glyph({
    code,
    cx,
    cy,
    cellW: cw,
    cellH: ch,
  }: {
    code: RaciCode;
    cx: number;
    cy: number;
    cellW: number;
    cellH: number;
  }) {
    const r = Math.min(cw, ch) * 0.22;
    const fontSize = Math.max(8, Math.min(11, ch * 0.35));

    if (code === "A") {
      // Filled square + "A" label
      const side = r * 1.6;
      return (
        <g>
          <rect
            x={cx - side / 2}
            y={cy - side / 2}
            width={side}
            height={side}
            fill="rgba(60,100,90,0.75)"
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fontWeight={700}
            fill="var(--color-page)"
          >
            A
          </text>
        </g>
      );
    }
    if (code === "R") {
      // Filled circle + "R" label
      return (
        <g>
          <circle cx={cx} cy={cy} r={r} fill="rgba(60,80,130,0.65)" />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fontWeight={600}
            fill="var(--color-page)"
          >
            R
          </text>
        </g>
      );
    }
    if (code === "C") {
      // Diamond outline + "C" label
      const d = r * 1.4;
      const points = `${cx},${cy - d} ${cx + d},${cy} ${cx},${cy + d} ${cx - d},${cy}`;
      return (
        <g>
          <polygon
            points={points}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={cx}
            y={cy}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink)"
          >
            C
          </text>
        </g>
      );
    }
    if (code === "I") {
      // Small dot + tiny "I"
      return (
        <g>
          <circle
            cx={cx}
            cy={cy}
            r={r * 0.45}
            fill="var(--color-ink-mute)"
          />
          <text
            x={cx}
            y={cy + r * 1.1}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={Math.max(7, fontSize - 2)}
            fill="var(--color-ink-mute)"
          >
            I
          </text>
        </g>
      );
    }
    // "-" — empty cell, no mark
    return <g />;
  }

  return (
    <svg width={width} height={height} role="img" aria-label="RACI Matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Header row */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={headerH}
            fill="var(--color-ink)"
            opacity={0.08}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {ROLES.map((role, ci) => (
            <text
              key={`hdr-${role}`}
              x={colCentreX(ci)}
              y={headerH / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={Math.max(9, Math.min(11, colW * 0.22))}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              {role}
            </text>
          ))}
        </g>

        {/* Task label column (in the left margin) */}
        <g data-data-layer="true">
          {TASKS.map((task, ri) => (
            <g key={`task-lbl-${ri}`}>
              <rect
                x={-margin.left}
                y={cellY(ri)}
                width={margin.left - 2}
                height={rowH}
                fill={ri % 2 === 0 ? "rgba(0,0,0,0.03)" : "var(--color-surface)"}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
              <text
                x={-6}
                y={rowCentreY(ri)}
                textAnchor="end"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={Math.max(8, Math.min(10, rowH * 0.38))}
                fill="var(--color-ink)"
              >
                {task}
              </text>
            </g>
          ))}
        </g>

        {/* Grid cells */}
        <g data-data-layer="true">
          {TASKS.map((task, ri) =>
            ROLES.map((role, ci) => {
              const code = MATRIX[task][role];
              const cx = colCentreX(ci);
              const cy = rowCentreY(ri);
              return (
                <g key={`cell-${ri}-${ci}`}>
                  <rect
                    x={cellX(ci)}
                    y={cellY(ri)}
                    width={colW}
                    height={rowH}
                    fill={cellBg(code)}
                    stroke="var(--color-hairline)"
                    strokeWidth={0.8}
                  />
                  <Glyph
                    code={code}
                    cx={cx}
                    cy={cy}
                    cellW={colW}
                    cellH={rowH}
                  />
                </g>
              );
            }),
          )}
        </g>

        {/* Anchors — 6 total, unconditional. */}

        {/* 1. row (task row — "Release to prod" spans all roles) */}
        <ExplainAnchor
          selector="row"
          index={1}
          pin={{ x: -margin.left + 8, y: cellY(TASKS.indexOf("Release to prod")) - 10 }}
          rect={{
            x: -margin.left,
            y: Math.max(0, cellY(TASKS.indexOf("Release to prod"))),
            width: margin.left + iw,
            height: Math.min(ih - cellY(TASKS.indexOf("Release to prod")), rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. column (role column — Engineer, spans all tasks) */}
        <ExplainAnchor
          selector="column"
          index={2}
          pin={{ x: colCentreX(ROLES.indexOf("Engineer")), y: -10 }}
          rect={{
            x: Math.max(0, cellX(ROLES.indexOf("Engineer"))),
            y: 0,
            width: Math.min(iw - cellX(ROLES.indexOf("Engineer")), colW),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. a-cell — the accountable mark (Approve spec × PM = A) */}
        <ExplainAnchor
          selector="a-cell"
          index={3}
          pin={{
            x: colCentreX(aCellColIdx),
            y: cellY(aCellRowIdx) - 10,
          }}
          rect={{
            x: Math.max(0, cellX(aCellColIdx)),
            y: Math.max(0, cellY(aCellRowIdx)),
            width: Math.min(iw - cellX(aCellColIdx), colW),
            height: Math.min(ih - cellY(aCellRowIdx), rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. r-cell — the responsible (doer) mark (Draft spec × PM = R) */}
        <ExplainAnchor
          selector="r-cell"
          index={4}
          pin={{
            x: colCentreX(rCellColIdx) + colW + 8,
            y: cellY(rCellRowIdx) + rowH / 2,
          }}
          rect={{
            x: Math.max(0, cellX(rCellColIdx)),
            y: Math.max(0, cellY(rCellRowIdx)),
            width: Math.min(iw - cellX(rCellColIdx), colW),
            height: Math.min(ih - cellY(rCellRowIdx), rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. c-vs-i — C and I side by side, explaining the consulted/informed distinction.
             We anchor the C cell (Implement feature × Designer) and label nearby. */}
        <ExplainAnchor
          selector="c-vs-i"
          index={5}
          pin={{
            x: colCentreX(cCellColIdx),
            y: cellY(cCellRowIdx) + rowH + 10,
          }}
          rect={{
            x: Math.max(0, cellX(cCellColIdx)),
            y: Math.max(0, cellY(cCellRowIdx)),
            width: Math.min(
              iw - cellX(cCellColIdx),
              colW * (iCellColIdx - cCellColIdx + 1),
            ),
            height: Math.min(ih - cellY(cCellRowIdx), rowH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. empty-cell — not-involved (Review code × PM = -) */}
        <ExplainAnchor
          selector="empty-cell"
          index={6}
          pin={{
            x: colCentreX(emCellColIdx) + colW + 8,
            y: cellY(emCellRowIdx) + rowH / 2,
          }}
          rect={{
            x: Math.max(0, cellX(emCellColIdx)),
            y: Math.max(0, cellY(emCellRowIdx)),
            width: Math.min(iw - cellX(emCellColIdx), colW),
            height: Math.min(ih - cellY(emCellRowIdx), rowH),
          }}
        >
          <g />
        </ExplainAnchor>


      </Group>
    </svg>
  );
}
