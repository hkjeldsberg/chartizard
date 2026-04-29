"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// GitHub-style contribution calendar: 53 weeks × 7 days.
// Start date: 2024-01-01 (a Monday). Cells are daily commit counts.
// Deterministic seeded LCG with weekday bias + a "vacation week" in mid-
// August (zero for seven days) + a "launch week" spike around day 320.

const START_YEAR = 2024;
const START_MONTH = 0; // January
const START_DAY = 1;
const TOTAL_WEEKS = 53;
const TOTAL_DAYS = TOTAL_WEEKS * 7;

// Day-of-week labels — Monday-first to match the start date.
const DOW = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] as const;
// Month labels in chronological order starting January.
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

interface DayCell {
  dayIndex: number; // 0..TOTAL_DAYS-1
  week: number; // 0..TOTAL_WEEKS-1 (column)
  dow: number; // 0..6 (row; 0 = Mon)
  date: Date;
  commits: number;
}

function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function buildCalendar(): DayCell[] {
  const rand = makeRand(424242);
  const cells: DayCell[] = [];
  const start = new Date(Date.UTC(START_YEAR, START_MONTH, START_DAY));
  for (let i = 0; i < TOTAL_DAYS; i++) {
    const date = new Date(start.getTime() + i * 86400000);
    const week = Math.floor(i / 7);
    const dow = i % 7; // 0 = Mon because start is a Monday.
    // Weekend bias: Saturday (5) and Sunday (6) are calmer.
    const weekdayFactor = dow >= 5 ? 0.25 : 1.0;
    // Base Poisson-like random count; rand() ∈ [0,1).
    let commits = Math.floor(rand() * 9 * weekdayFactor);
    // Vacation gap: week 33 (mid-August) — zero all seven days.
    if (week === 33) commits = 0;
    // Launch-week spike: week 45 (early November) — everyone hammering.
    if (week === 45 && dow < 5) {
      commits = 14 + Math.floor(rand() * 6);
    }
    cells.push({ dayIndex: i, week, dow, date, commits });
  }
  return cells;
}

interface Props {
  width: number;
  height: number;
}

export function CalendarChart({ width, height }: Props) {
  const margin = { top: 28, right: 56, bottom: 32, left: 36 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cells = useMemo(() => buildCalendar(), []);

  // Cell geometry: 53 columns × 7 rows, with a 2px gap.
  const gap = 2;
  const rawCellW = (iw - gap * (TOTAL_WEEKS - 1)) / TOTAL_WEEKS;
  const rawCellH = (ih - gap * 6) / 7;
  const cellSize = Math.max(4, Math.min(rawCellW, rawCellH));
  // Recompute gaps so the grid is centred if cells are square.
  const gridW = TOTAL_WEEKS * cellSize + (TOTAL_WEEKS - 1) * gap;
  const gridH = 7 * cellSize + 6 * gap;
  const xOffset = (iw - gridW) / 2;
  const yOffset = (ih - gridH) / 2;

  const maxCommits = useMemo(() => {
    let m = 0;
    for (const c of cells) if (c.commits > m) m = c.commits;
    return m;
  }, [cells]);

  const cellX = (week: number) => xOffset + week * (cellSize + gap);
  const cellY = (dow: number) => yOffset + dow * (cellSize + gap);

  // Month labels — position each at the first week whose 1st-of-month falls in it.
  // We pick the week where the cell with dow=0..6 contains day-1 of that month.
  const monthPositions = useMemo(() => {
    const firstSeen = new Array<number | null>(12).fill(null);
    for (const c of cells) {
      const m = c.date.getUTCMonth();
      if (firstSeen[m] === null) firstSeen[m] = c.week;
    }
    return firstSeen.map((week, idx) => ({ label: MONTHS[idx], week }));
  }, [cells]);

  // Pick a representative "featured" cell — launch-week Monday (week 45, dow 0)
  const featured = cells.find((c) => c.week === 45 && c.dow === 0) ?? cells[0];
  const featuredX = cellX(featured.week);
  const featuredY = cellY(featured.dow);

  // Vacation-week geometry (week 33)
  const vacationX = cellX(33);
  const vacationY = cellY(0);
  const vacationH = 7 * cellSize + 6 * gap;

  // Launch-week geometry (week 45)
  const launchX = cellX(45);
  const launchY = cellY(0);
  const launchH = 7 * cellSize + 6 * gap;

  // Legend geometry — vertical ramp on the right edge.
  const legendSteps = 5;
  const legendW = 12;
  const legendStepH = Math.max(10, gridH / legendSteps);
  const legendH = legendStepH * legendSteps;
  const legendX = iw + 14;
  const legendY = yOffset;

  // Intensity scale — empty cells get a ghost-light box so the grid reads
  // as a grid, not a scatter.
  const cellOpacity = (n: number) => {
    if (maxCommits <= 0) return 0.05;
    if (n === 0) return 0.05;
    const t = n / maxCommits;
    return 0.15 + t * 0.8;
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Calendar contribution chart">
      <Group left={margin.left} top={margin.top}>
        {/* Cells */}
        <g data-data-layer="true">
          {cells.map((c) => (
            <rect
              key={c.dayIndex}
              x={cellX(c.week)}
              y={cellY(c.dow)}
              width={cellSize}
              height={cellSize}
              rx={1.5}
              fill={`rgba(26,22,20,${cellOpacity(c.commits).toFixed(3)})`}
            />
          ))}
        </g>

        {/* Month labels across the top */}
        <g data-data-layer="true">
          {monthPositions.map(
            (m) =>
              m.week !== null && (
                <text
                  key={m.label}
                  x={cellX(m.week)}
                  y={yOffset - 8}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                  textAnchor="start"
                >
                  {m.label}
                </text>
              ),
          )}
        </g>

        {/* Day-of-week labels on the left — every other (Mon, Wed, Fri) */}
        <g data-data-layer="true">
          {DOW.map(
            (d, i) =>
              (i === 0 || i === 2 || i === 4) && (
                <text
                  key={d}
                  x={xOffset - 6}
                  y={cellY(i) + cellSize / 2}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {d}
                </text>
              ),
          )}
        </g>

        {/* Anchor 1: cell (launch-week Monday — featured cell) */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{ x: featuredX + cellSize + 16, y: featuredY + cellSize / 2 }}
          rect={{
            x: featuredX,
            y: featuredY,
            width: cellSize,
            height: cellSize,
          }}
        >
          <rect
            x={featuredX}
            y={featuredY}
            width={cellSize}
            height={cellSize}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* Anchor 2: weekend rows (Sat + Sun — indices 5 and 6) */}
        <ExplainAnchor
          selector="weekend-rows"
          index={2}
          pin={{ x: xOffset - 24, y: cellY(5) + cellSize }}
          rect={{
            x: xOffset,
            y: cellY(5),
            width: gridW,
            height: 2 * cellSize + gap,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: vacation gap — week 33, all seven rows empty */}
        <ExplainAnchor
          selector="vacation-gap"
          index={3}
          pin={{ x: vacationX + cellSize / 2, y: vacationY - 14 }}
          rect={{
            x: vacationX - 1,
            y: vacationY,
            width: cellSize + 2,
            height: vacationH,
          }}
        >
          <rect
            x={vacationX - 1.5}
            y={vacationY - 1.5}
            width={cellSize + 3}
            height={vacationH + 3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
        </ExplainAnchor>

        {/* Anchor 4: launch-week spike — week 45, weekday cells */}
        <ExplainAnchor
          selector="launch-week"
          index={4}
          pin={{ x: launchX + cellSize / 2, y: launchY + launchH + 14 }}
          rect={{
            x: launchX - 1,
            y: launchY,
            width: cellSize + 2,
            height: launchH,
          }}
        >
          <rect
            x={launchX - 1.5}
            y={launchY - 1.5}
            width={cellSize + 3}
            height={launchH + 3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </ExplainAnchor>

        {/* Anchor 5: month label — January */}
        <ExplainAnchor
          selector="month-label"
          index={5}
          pin={{ x: xOffset + 12, y: yOffset - 20 }}
          rect={{
            x: xOffset,
            y: yOffset - 18,
            width: Math.max(24, cellX(2) - xOffset),
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Colour-scale legend — on the right */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          {Array.from({ length: legendSteps }).map((_, i) => {
            const t = i / (legendSteps - 1);
            const opacity = 0.15 + t * 0.8;
            return (
              <rect
                key={i}
                x={0}
                y={legendH - (i + 1) * legendStepH}
                width={legendW}
                height={legendStepH - 1}
                rx={1.5}
                fill={`rgba(26,22,20,${opacity.toFixed(3)})`}
              />
            );
          })}
          <text
            x={legendW + 6}
            y={6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            MORE
          </text>
          <text
            x={legendW + 6}
            y={legendH - 2}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            LESS
          </text>
        </g>
        <ExplainAnchor
          selector="colour-scale"
          index={6}
          pin={{ x: legendX + legendW + 32, y: legendY + legendH / 2 }}
          rect={{
            x: legendX - 2,
            y: legendY,
            width: legendW + 40,
            height: legendH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
