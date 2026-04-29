"use client";

import { Group } from "@visx/group";
import { scaleLinear, scalePoint } from "@visx/scale";
import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 8 songs tracked across 12 weekly rank columns. Each column is a permutation
// of 1..8; curves cross where overtakes happen. Hand-picked so Flowers is the
// final-week winner and there are visible crossings mid-run.
interface Song {
  name: string;
  short: string;
  ranks: number[]; // length 12
}

const DATA: ReadonlyArray<Song> = [
  { name: "Flowers", short: "FLW", ranks: [2, 2, 1, 1, 1, 2, 3, 2, 2, 1, 1, 1] },
  { name: "Cruel Summer", short: "CRL", ranks: [3, 4, 4, 4, 3, 3, 1, 1, 1, 2, 3, 3] },
  { name: "Seven", short: "SVN", ranks: [4, 3, 3, 2, 2, 1, 2, 3, 5, 6, 6, 6] },
  { name: "Anti-Hero", short: "AHR", ranks: [1, 1, 2, 3, 4, 5, 6, 7, 7, 7, 8, 8] },
  { name: "Paint The Town Red", short: "PTR", ranks: [5, 5, 6, 6, 7, 7, 8, 8, 8, 8, 7, 7] },
  { name: "Last Night", short: "LST", ranks: [6, 6, 7, 7, 6, 6, 5, 5, 3, 3, 2, 2] },
  { name: "Vampire", short: "VMP", ranks: [7, 7, 5, 5, 5, 4, 4, 4, 4, 4, 4, 5] },
  { name: "Dance The Night", short: "DNC", ranks: [8, 8, 8, 8, 8, 8, 7, 6, 6, 5, 5, 4] },
];

const NUM_WEEKS = 12;
const NUM_SONGS = 8;

const HIGHLIGHT_IDX = 0; // Flowers — the winner
const HIGHLIGHT = "#4a6a68";
const OTHER = "var(--color-ink)";

interface Props {
  width: number;
  height: number;
}

export function BumpChart({ width, height }: Props) {
  const margin = { top: 32, right: 68, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const weeks = Array.from({ length: NUM_WEEKS }, (_, i) => i + 1);

  const xScale = scalePoint<number>({
    domain: weeks,
    range: [0, iw],
    padding: 0.0,
  });
  // Rank 1 at the top, rank 8 at the bottom.
  const yScale = scaleLinear({ domain: [1, NUM_SONGS], range: [0, ih] });

  // Pre-compute each song's points.
  const pointsFor = (song: Song) =>
    song.ranks.map((r, wi) => ({ x: xScale(wi + 1) ?? 0, y: yScale(r), week: wi + 1, rank: r }));

  // Build data-by-week for rank-row grid lines.
  const rowYs = Array.from({ length: NUM_SONGS }, (_, i) => yScale(i + 1));

  // Anchor targets.
  const winner = DATA[HIGHLIGHT_IDX];
  const winnerPts = pointsFor(winner);
  const winnerEnd = winnerPts[NUM_WEEKS - 1];

  // A crossing — Anti-Hero drops from #1 to #2 as Flowers rises from #2 to #1 between W2 and W3.
  const crossXMid = ((xScale(2) ?? 0) + (xScale(3) ?? 0)) / 2;
  const crossY = (yScale(1) + yScale(2)) / 2;

  function clamp(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const rw = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const rh = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: rw, height: rh };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Bump chart">
      <Group left={margin.left} top={margin.top}>
        {/* Rank rows — horizontal hairlines marking each ordinal position. */}
        <g data-data-layer="true">
          {rowYs.map((y, i) => (
            <line
              key={i}
              x1={0}
              x2={iw}
              y1={y}
              y2={y}
              stroke="var(--color-hairline)"
              strokeDasharray={i === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Rank labels on the left (1 .. 8). */}
        <g data-data-layer="true">
          {rowYs.map((y, i) => (
            <text
              key={i}
              x={-10}
              y={y}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              {i + 1}
            </text>
          ))}
          <text
            x={-margin.left + 6}
            y={-14}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            RANK
          </text>
        </g>

        {/* Week tick labels on the bottom. */}
        <g data-data-layer="true">
          <line x1={0} x2={iw} y1={ih} y2={ih} stroke="var(--color-ink-mute)" />
          {weeks.map((w) => (
            <g key={w} transform={`translate(${xScale(w) ?? 0}, ${ih})`}>
              <line y1={0} y2={3} stroke="var(--color-ink-mute)" />
              <text
                y={14}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                W{w}
              </text>
            </g>
          ))}
          <text
            x={iw / 2}
            y={ih + 34}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            WEEK
          </text>
        </g>

        {/* Starting-rank column — thin rail at W1. */}
        <g data-data-layer="true">
          <line
            x1={xScale(1) ?? 0}
            x2={xScale(1) ?? 0}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* The bump lines — one per song. Winner drawn last + heavier. */}
        <g data-data-layer="true">
          {DATA.map((song, si) => {
            if (si === HIGHLIGHT_IDX) return null;
            const pts = pointsFor(song);
            return (
              <g key={song.name}>
                <LinePath
                  data={pts}
                  x={(d) => d.x}
                  y={(d) => d.y}
                  stroke={OTHER}
                  strokeOpacity={0.45}
                  strokeWidth={1.6}
                  curve={curveMonotoneX}
                />
                {pts.map((p) => (
                  <circle
                    key={p.week}
                    cx={p.x}
                    cy={p.y}
                    r={2}
                    fill={OTHER}
                    fillOpacity={0.6}
                  />
                ))}
              </g>
            );
          })}
          {/* Winner — teal, heavier, on top. */}
          <g>
            <LinePath
              data={winnerPts}
              x={(d) => d.x}
              y={(d) => d.y}
              stroke={HIGHLIGHT}
              strokeWidth={2.4}
              curve={curveMonotoneX}
            />
            {winnerPts.map((p) => (
              <circle key={p.week} cx={p.x} cy={p.y} r={2.8} fill={HIGHLIGHT} />
            ))}
          </g>
        </g>

        {/* Right-hand song labels at final-week ranks. */}
        <g data-data-layer="true">
          {DATA.map((song) => {
            const finalRank = song.ranks[NUM_WEEKS - 1];
            const y = yScale(finalRank);
            const isWinner = song.name === winner.name;
            return (
              <text
                key={song.name}
                x={iw + 8}
                y={y}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill={isWinner ? HIGHLIGHT : "var(--color-ink-soft)"}
                fontWeight={isWinner ? 500 : 400}
              >
                {song.short}
              </text>
            );
          })}
        </g>

        {/* 1. Winner trajectory — Flowers, coloured teal. */}
        <ExplainAnchor
          selector="winner-line"
          index={1}
          pin={{ x: (xScale(10) ?? 0), y: yScale(1) - 14 }}
          rect={clamp({
            x: 0,
            y: yScale(1) - 6,
            width: iw,
            height: yScale(3) - yScale(1) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Crossing — Anti-Hero and Flowers swap #1 / #2 between W2 and W3. */}
        <ExplainAnchor
          selector="crossing"
          index={2}
          pin={{ x: crossXMid, y: crossY - 20 }}
          rect={clamp({
            x: (xScale(2) ?? 0) - 6,
            y: yScale(1) - 6,
            width: ((xScale(3) ?? 0) - (xScale(2) ?? 0)) + 12,
            height: yScale(2.5) - yScale(1) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. The #1 row — the prize everyone is racing for. */}
        <ExplainAnchor
          selector="top-rank-row"
          index={3}
          pin={{ x: iw - 20, y: yScale(1) - 14 }}
          rect={clamp({
            x: 0,
            y: yScale(1) - 8,
            width: iw,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Week axis — ordinal time steps. */}
        <ExplainAnchor
          selector="week-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Rank axis — position, not value. */}
        <ExplainAnchor
          selector="rank-axis"
          index={5}
          pin={{ x: -30, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Starting-rank column — W1 snapshot. */}
        <ExplainAnchor
          selector="start-column"
          index={6}
          pin={{ x: (xScale(1) ?? 0) - 22, y: ih / 2 + 16 }}
          rect={clamp({
            x: (xScale(1) ?? 0) - 10,
            y: 0,
            width: 20,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Winner end-point halo — keeps the eye on the final rank. */}
        <g data-data-layer="true">
          <circle
            cx={winnerEnd.x}
            cy={winnerEnd.y}
            r={5}
            fill="none"
            stroke={HIGHLIGHT}
            strokeWidth={1}
          />
        </g>
      </Group>
    </svg>
  );
}
