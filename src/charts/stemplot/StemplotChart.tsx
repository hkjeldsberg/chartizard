"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A period-8 chemistry exam, 60 students. Integer scores 50..99 drawn from a
// seeded normal-ish distribution with mean ~76 and sd ~11. Deterministic via a
// seeded LCG so server and client render identically.
function generateScores(n: number): number[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  // Box-Muller for standard normal samples, using the seeded rand.
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: number[] = [];
  const mean = 76;
  const sd = 11;
  while (out.length < n) {
    const raw = Math.round(mean + sd * gauss());
    if (raw < 50 || raw > 99) continue;
    out.push(raw);
  }
  return out;
}

interface Row {
  stem: number;
  leaves: number[];
}

interface Props {
  width: number;
  height: number;
}

export function StemplotChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 36, left: 40 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const scores = useMemo(() => generateScores(60), []);

  // Group by tens digit (stem), collect ones digits (leaves) sorted ascending.
  const rows = useMemo<Row[]>(() => {
    const buckets = new Map<number, number[]>();
    for (let s = 5; s <= 9; s++) buckets.set(s, []);
    for (const v of scores) {
      const stem = Math.floor(v / 10);
      const leaf = v % 10;
      buckets.get(stem)!.push(leaf);
    }
    for (const [, leaves] of buckets) leaves.sort((a, b) => a - b);
    return Array.from(buckets.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([stem, leaves]) => ({ stem, leaves }));
  }, [scores]);

  // Layout: one row per stem. Line height fits all five rows plus title row.
  const rowCount = rows.length;
  const lineHeight = rowCount > 0 ? ih / (rowCount + 1) : 0;
  const titleY = lineHeight * 0.6;
  const firstRowY = lineHeight * 1.6;

  // Column x-positions, all in monospace so leaves align cleanly.
  const stemCol = 14; // where the stem digit sits
  const dividerX = 34; // the | character
  const leavesX = 46; // where leaves start

  // Identify the modal class — the row with the most leaves.
  const modalIdx = rows.reduce(
    (best, r, i, arr) => (r.leaves.length > arr[best].leaves.length ? i : best),
    0,
  );
  const modalY = firstRowY + modalIdx * lineHeight;

  // Character width estimate for monospace at fontSize 12 is ~7.2px. Leaves are
  // separated by a space, so each leaf occupies ~2 chars (~14.4px). Clamp the
  // modal-row hit rect to the plot width so it never extends off-canvas.
  const charW = 7.2;
  const modalLeafCount = rows[modalIdx].leaves.length;
  const modalRowEnd = Math.min(iw, leavesX + modalLeafCount * charW * 2 + 8);
  const modalRowWidth = Math.max(0, modalRowEnd - leavesX);

  // Pin for the sorted-leaves convention: the end of the longest row.
  const sortedLeavesRowIdx = modalIdx; // longest row shows sort most clearly
  const sortedLeavesY = firstRowY + sortedLeavesRowIdx * lineHeight;

  return (
    <svg width={width} height={height} role="img" aria-label="Stem-and-leaf plot">
      <Group left={margin.left} top={margin.top}>
        {/* Title row — labels the two columns */}
        <g data-data-layer="true">
          <text
            x={stemCol}
            y={titleY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            letterSpacing="0.04em"
          >
            STEM
          </text>
          <text
            x={leavesX}
            y={titleY}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            letterSpacing="0.04em"
          >
            LEAVES (SORTED)
          </text>
        </g>

        {/* Data rows */}
        <g data-data-layer="true">
          {rows.map((r, i) => {
            const y = firstRowY + i * lineHeight;
            const leafString = r.leaves.join(" ");
            return (
              <g key={r.stem}>
                <text
                  x={stemCol}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {r.stem}
                </text>
                <text
                  x={dividerX}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                  fill="var(--color-ink-mute)"
                >
                  |
                </text>
                <text
                  x={leavesX}
                  y={y}
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={12}
                  fill="var(--color-ink)"
                >
                  {leafString}
                </text>
              </g>
            );
          })}
        </g>

        {/* Footer — unit convention */}
        <g data-data-layer="true">
          <text
            x={stemCol}
            y={ih + 18}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            letterSpacing="0.04em"
          >
            KEY: 7 | 4 = 74
          </text>
        </g>

        {/* 1. Stem column — the tens digit, read as x-axis */}
        <ExplainAnchor
          selector="stem-column"
          index={1}
          pin={{ x: stemCol, y: -6 }}
          rect={{
            x: Math.max(0, stemCol - 10),
            y: 0,
            width: 20,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Divider — separates stems from leaves */}
        <ExplainAnchor
          selector="divider"
          index={2}
          pin={{ x: dividerX, y: -6 }}
          rect={{
            x: Math.max(0, dividerX - 6),
            y: 0,
            width: 12,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Leaves row — one row is a bar; anchor the modal class */}
        <ExplainAnchor
          selector="leaves-row"
          index={3}
          pin={{
            x: Math.min(iw - 10, leavesX + modalRowWidth / 2),
            y: Math.max(10, modalY - 14),
          }}
          rect={{
            x: leavesX,
            y: Math.max(0, modalY - lineHeight / 2),
            width: modalRowWidth,
            height: lineHeight,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Modal class — the longest row, i.e. the tallest "bar" */}
        <ExplainAnchor
          selector="modal-class"
          index={4}
          pin={{
            x: Math.min(iw - 10, leavesX + modalRowWidth + 4),
            y: modalY,
          }}
          rect={{
            x: 0,
            y: Math.max(0, modalY - lineHeight / 2),
            width: Math.min(iw, leavesX + modalRowWidth),
            height: lineHeight,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Sorted-leaves convention — leaves within each row are sorted asc */}
        <ExplainAnchor
          selector="sorted-leaves"
          index={5}
          pin={{
            x: Math.min(iw - 10, leavesX + modalRowWidth - 4),
            y: sortedLeavesY + lineHeight / 2 + 4,
          }}
          rect={{
            x: leavesX,
            y: Math.max(0, sortedLeavesY - lineHeight / 2),
            width: modalRowWidth,
            height: lineHeight,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Key — the 7|4 = 74 convention anchors the whole encoding */}
        <ExplainAnchor
          selector="key"
          index={6}
          pin={{ x: stemCol + 60, y: ih + 14 }}
          rect={{
            x: 0,
            y: Math.max(0, ih + 6),
            width: Math.min(iw, 140),
            height: Math.max(0, margin.bottom - 8),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
