"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Birds observed at a backyard feeder across one week (hand-picked counts).
// The chart's whole point is grouping in fives — a four-bar cluster crossed
// by a diagonal fifth stroke.
type Row = { species: string; count: number };

const DATA: ReadonlyArray<Row> = [
  { species: "Sparrow", count: 23 },
  { species: "Finch", count: 17 },
  { species: "Chickadee", count: 14 },
  { species: "Bluejay", count: 11 },
  { species: "Cardinal", count: 9 },
  { species: "Nuthatch", count: 6 },
];

interface Props {
  width: number;
  height: number;
}

export function TallyChart({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 96 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const rowsArea = Math.max(0, ih - 18); // reserve a small strip for caption
  const rowH = DATA.length > 0 ? rowsArea / DATA.length : 0;

  // Five-group layout metrics.
  const tickH = Math.min(22, rowH * 0.6); // height of a vertical stroke
  const tickSpace = 4; // space between the four vertical strokes in one group
  const groupW = tickSpace * 3; // span of the four strokes (3 gaps)
  const groupPad = 10; // space between five-groups (and leftovers)

  // Max groups needed to fit the largest row. 23 → 4 full groups + 3 loose.
  const maxCount = Math.max(...DATA.map((d) => d.count));
  const maxGroups = Math.floor(maxCount / 5);
  const maxLoose = maxCount % 5;
  const maxSlots =
    maxGroups * (groupW + groupPad) +
    (maxLoose > 0 ? (maxLoose - 1) * tickSpace + groupW === 0 ? 0 : 0 : 0);

  function rowY(i: number) {
    return i * rowH;
  }
  function rowCenterY(i: number) {
    return rowY(i) + rowH / 2;
  }
  function tickTop(i: number) {
    return rowCenterY(i) - tickH / 2;
  }
  function tickBottom(i: number) {
    return rowCenterY(i) + tickH / 2;
  }

  // Compute the x-span of a row's full tally block (for hover rects).
  function rowSpan(count: number) {
    const groups = Math.floor(count / 5);
    const loose = count % 5;
    let x = 0;
    if (groups > 0) {
      x += groups * groupW + (groups - 1) * groupPad;
    }
    if (loose > 0) {
      if (groups > 0) x += groupPad;
      x += (loose - 1) * tickSpace;
    }
    return x;
  }

  // Modal species: the largest count (Sparrow, row 0).
  const modalIdx = 0;
  const modal = DATA[modalIdx];
  const modalSpan = rowSpan(modal.count);

  // Leftover-marks x-range on the modal row.
  const modalGroups = Math.floor(modal.count / 5);
  const modalLoose = modal.count % 5;
  const modalGroupsWidth =
    modalGroups > 0 ? modalGroups * groupW + (modalGroups - 1) * groupPad : 0;
  const modalLooseStartX =
    modalGroups > 0 ? modalGroupsWidth + groupPad : 0;
  const modalLooseSpan = modalLoose > 0 ? (modalLoose - 1) * tickSpace : 0;

  // Anchor: one tally mark — use first stroke of first group of modal row.
  const firstTickX = 0;

  // Anchor: one five-group — first group of modal row.
  const firstGroupCenterX = groupW / 2;

  function clampRect(r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const right = Math.max(0, Math.min(iw, r.x + r.width));
    const bottom = Math.max(0, Math.min(ih, r.y + r.height));
    return { x, y, width: right - x, height: bottom - y };
  }

  // Render a single five-group: four vertical strokes + diagonal crossing.
  function FiveGroup({ x, rowIdx }: { x: number; rowIdx: number }) {
    const top = tickTop(rowIdx);
    const bot = tickBottom(rowIdx);
    return (
      <g>
        {[0, 1, 2, 3].map((k) => (
          <line
            key={k}
            x1={x + k * tickSpace}
            x2={x + k * tickSpace}
            y1={top}
            y2={bot}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ))}
        {/* Diagonal fifth stroke, ~45° crossing the four verticals. */}
        <line
          x1={x - 1.5}
          x2={x + groupW + 1.5}
          y1={bot}
          y2={top}
          stroke="var(--color-ink)"
          strokeWidth={1.4}
          strokeLinecap="round"
        />
      </g>
    );
  }

  // Render loose (ungrouped) trailing marks — 1 to 4 vertical strokes.
  function LooseMarks({
    x,
    count,
    rowIdx,
  }: {
    x: number;
    count: number;
    rowIdx: number;
  }) {
    const top = tickTop(rowIdx);
    const bot = tickBottom(rowIdx);
    return (
      <g>
        {Array.from({ length: count }).map((_, k) => (
          <line
            key={k}
            x1={x + k * tickSpace}
            x2={x + k * tickSpace}
            y1={top}
            y2={bot}
            stroke="var(--color-ink)"
            strokeWidth={1.4}
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  }

  // Silence unused-var warning from the unused compute above.
  void maxSlots;

  return (
    <svg width={width} height={height} role="img" aria-label="Tally chart">
      <Group left={margin.left} top={margin.top}>
        {/* Category labels + tally rows */}
        <g data-data-layer="true">
          {DATA.map((d, i) => {
            const groups = Math.floor(d.count / 5);
            const loose = d.count % 5;
            const yMid = rowCenterY(i);
            let x = 0;
            const parts: React.ReactNode[] = [];
            for (let g = 0; g < groups; g++) {
              parts.push(
                <FiveGroup key={`g-${g}`} x={x} rowIdx={i} />,
              );
              x += groupW;
              if (g < groups - 1) x += groupPad;
            }
            if (loose > 0) {
              if (groups > 0) x += groupPad;
              parts.push(
                <LooseMarks
                  key="loose"
                  x={x}
                  count={loose}
                  rowIdx={i}
                />,
              );
              x += (loose - 1) * tickSpace;
            }
            return (
              <g key={d.species}>
                <text
                  x={-12}
                  y={yMid}
                  textAnchor="end"
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {d.species.toUpperCase()}
                </text>
                {parts}
                {/* Total count at the right end of the row */}
                <text
                  x={x + 10}
                  y={yMid}
                  dominantBaseline="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-mute)"
                >
                  {d.count}
                </text>
              </g>
            );
          })}
        </g>

        {/* Footer caption — the counting convention, in words. */}
        <g data-data-layer="true">
          <text
            x={0}
            y={rowsArea + 18}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            COUNT IN FIVES · ONE WEEK AT THE FEEDER
          </text>
        </g>

        {/* 1. Single tally mark — one observation. */}
        <ExplainAnchor
          selector="tally-mark"
          index={1}
          pin={{
            x: firstTickX,
            y: tickTop(modalIdx) - 10,
          }}
          rect={clampRect({
            x: firstTickX - 3,
            y: tickTop(modalIdx) - 2,
            width: 6,
            height: tickH + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Five-group — four verticals + one diagonal. */}
        <ExplainAnchor
          selector="five-group"
          index={2}
          pin={{
            x: firstGroupCenterX,
            y: tickBottom(modalIdx) + 14,
          }}
          rect={clampRect({
            x: -2,
            y: tickTop(modalIdx) - 2,
            width: groupW + 4,
            height: tickH + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Modal row — highest count, full tally run. */}
        <ExplainAnchor
          selector="modal-row"
          index={3}
          pin={{ x: modalSpan + 26, y: rowCenterY(modalIdx) }}
          rect={clampRect({
            x: 0,
            y: rowY(modalIdx) + 2,
            width: iw,
            height: rowH - 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Leftover marks — ungrouped trailing strokes (1–4) after the
            last full group. Always rendered where the row count mod 5 > 0;
            all six data rows satisfy this (23, 17, 14, 11, 9, 6). */}
        <ExplainAnchor
          selector="leftover-marks"
          index={4}
          pin={{
            x: modalLooseStartX + modalLooseSpan / 2,
            y: tickBottom(modalIdx) + 14,
          }}
          rect={clampRect({
            x: modalLooseStartX - 3,
            y: tickTop(modalIdx) - 2,
            width: modalLooseSpan + 6,
            height: tickH + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Category labels — species names in the left margin. */}
        <ExplainAnchor
          selector="category-labels"
          index={5}
          pin={{ x: -60, y: rowCenterY(Math.floor(DATA.length / 2)) }}
          rect={{
            x: -margin.left + 4,
            y: 0,
            width: margin.left - 16,
            height: rowsArea,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Row total — the number on the right end of each row. */}
        <ExplainAnchor
          selector="row-total"
          index={6}
          pin={{ x: modalSpan + 26, y: rowCenterY(modalIdx) - 14 }}
          rect={clampRect({
            x: modalSpan + 4,
            y: rowY(modalIdx) + 2,
            width: Math.max(0, iw - modalSpan - 4),
            height: rowH - 4,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
