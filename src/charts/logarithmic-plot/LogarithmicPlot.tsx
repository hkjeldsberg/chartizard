"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLog } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Zipf's-law approximation for the 100 most common English words.
// Hand-picked anchor ranks from the Google Books N-gram corpus (2012 release,
// approximate counts in instances-of-word across the corpus) plus a 1/rank
// interpolation for the rest, with deterministic multiplicative noise so the
// points scatter around the power-law line rather than sitting exactly on it.
const ANCHOR_POINTS: ReadonlyArray<{ rank: number; freq: number }> = [
  { rank: 1, freq: 60_000_000 },
  { rank: 2, freq: 33_000_000 },
  { rank: 3, freq: 26_000_000 },
  { rank: 5, freq: 15_000_000 },
  { rank: 10, freq: 5_000_000 },
  { rank: 20, freq: 2_000_000 },
  { rank: 50, freq: 500_000 },
  { rank: 100, freq: 200_000 },
];

// Fill in the ranks not in the anchor list with a 1/rank law scaled so that
// rank 1 ≈ 60M, jittered deterministically so the cloud looks real.
function buildZipf(): Array<{ rank: number; freq: number }> {
  const anchorByRank = new Map(ANCHOR_POINTS.map((p) => [p.rank, p]));
  const RANKS = [
    1, 2, 3, 4, 5, 6, 7, 8, 10, 12, 15, 18, 20, 25, 30, 35, 40, 50, 60, 70,
    80, 90, 100,
  ];
  // Seeded LCG for jitter.
  let seed = 1337;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const baseline = 60_000_000; // roughly matches rank-1 anchor
  const out: Array<{ rank: number; freq: number }> = [];
  for (const r of RANKS) {
    const anchor = anchorByRank.get(r);
    if (anchor) {
      out.push(anchor);
      continue;
    }
    // 1/rank scaled to baseline, with ±15% multiplicative jitter.
    const pure = baseline / r;
    const jitter = 0.85 + rand() * 0.3;
    out.push({ rank: r, freq: pure * jitter });
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function LogarithmicPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => buildZipf(), []);

  // x: log rank, 1 → 100 (two decades)
  // y: log frequency, 1e5 → 1e8 (three decades)
  const xScale = useMemo(
    () =>
      scaleLog<number>({
        domain: [1, 100],
        range: [0, iw],
        base: 10,
      }),
    [iw],
  );
  const yScale = useMemo(
    () =>
      scaleLog<number>({
        domain: [1e5, 1e8],
        range: [ih, 0],
        base: 10,
      }),
    [ih],
  );

  // Decade gridlines.
  const xDecades = [1, 10, 100];
  const yDecades = [1e5, 1e6, 1e7, 1e8];
  // Minor ticks at 2..9 inside each decade on x (10..100 region).
  const xMinors: number[] = [];
  for (const base of [1, 10]) {
    for (let k = 2; k <= 9; k++) xMinors.push(base * k);
  }
  // On y, minor ticks at 2..9 within each decade (optional).
  const yMinors: number[] = [];
  for (const base of [1e5, 1e6, 1e7]) {
    for (let k = 2; k <= 9; k++) yMinors.push(base * k);
  }

  // Reference line of slope −1 through (1, 6e7). freq = 6e7 / rank.
  const refA = { rank: 1, freq: 6e7 };
  const refB = { rank: 100, freq: 6e5 };
  const refAPx = { x: xScale(refA.rank), y: yScale(refA.freq) };
  const refBPx = { x: xScale(refB.rank), y: yScale(refB.freq) };

  // Highlight rank-1 and rank-50 points for anchors.
  const highlightA = data.find((d) => d.rank === 1)!;
  const highlightB = data.find((d) => d.rank === 50)!;
  const hAX = xScale(highlightA.rank);
  const hAY = yScale(highlightA.freq);
  const hBX = xScale(highlightB.rank);
  const hBY = yScale(highlightB.freq);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Format helpers for axis labels.
  const fmtRank = (v: number) => (v < 10 ? `${v}` : v === 10 ? "10" : "100");
  const fmtFreq = (v: number) => {
    if (v >= 1e8) return "10⁸";
    if (v >= 1e7) return "10⁷";
    if (v >= 1e6) return "10⁶";
    if (v >= 1e5) return "10⁵";
    return String(v);
  };

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Logarithmic plot of word rank against frequency (Zipf's law)"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Plot frame + minor + major grid */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
          {/* Minor x gridlines — log spacing within each decade */}
          {xMinors.map((v) => {
            const x = xScale(v);
            if (x < 0 || x > iw) return null;
            return (
              <line
                key={`xm-${v}`}
                x1={x}
                x2={x}
                y1={0}
                y2={ih}
                stroke="var(--color-hairline)"
                strokeWidth={0.4}
                strokeOpacity={0.6}
              />
            );
          })}
          {/* Minor y gridlines */}
          {yMinors.map((v) => {
            const y = yScale(v);
            if (y < 0 || y > ih) return null;
            return (
              <line
                key={`ym-${v}`}
                x1={0}
                x2={iw}
                y1={y}
                y2={y}
                stroke="var(--color-hairline)"
                strokeWidth={0.4}
                strokeOpacity={0.6}
              />
            );
          })}
          {/* Major decade lines — darker so decades read as the step unit. */}
          {xDecades.map((v) => (
            <line
              key={`xd-${v}`}
              x1={xScale(v)}
              x2={xScale(v)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.9}
            />
          ))}
          {yDecades.map((v) => (
            <line
              key={`yd-${v}`}
              x1={0}
              x2={iw}
              y1={yScale(v)}
              y2={yScale(v)}
              stroke="var(--color-hairline)"
              strokeWidth={0.9}
            />
          ))}
        </g>

        {/* Reference line — slope -1 on log-log */}
        <ExplainAnchor
          selector="reference-line"
          index={1}
          pin={{
            x: clamp((refAPx.x + refBPx.x) / 2 + 12, 10, iw - 10),
            y: clamp((refAPx.y + refBPx.y) / 2 - 14, 10, ih - 10),
          }}
          rect={{
            x: 0,
            y: 0,
            width: iw,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={refAPx.x}
              y1={refAPx.y}
              x2={refBPx.x}
              y2={refBPx.y}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              strokeDasharray="5 3"
              strokeOpacity={0.85}
            />
          </g>
        </ExplainAnchor>

        {/* Scatter points */}
        <g data-data-layer="true">
          {data.map((d) => (
            <circle
              key={d.rank}
              cx={xScale(d.rank)}
              cy={yScale(d.freq)}
              r={
                d.rank === highlightA.rank || d.rank === highlightB.rank
                  ? 3.4
                  : 2.4
              }
              fill="var(--color-page)"
              stroke="var(--color-ink)"
              strokeWidth={1.1}
            />
          ))}
        </g>

        {/* Anchor — the point cloud as a whole */}
        <ExplainAnchor
          selector="data-points"
          index={2}
          pin={{
            x: clamp(xScale(15), 10, iw - 10),
            y: clamp(yScale(3e6) - 14, 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor — the rank-1 "the" point */}
        <ExplainAnchor
          selector="top-word"
          index={3}
          pin={{
            x: clamp(hAX + 18, 10, iw - 10),
            y: clamp(hAY + 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(hAX - 8, 0, iw),
            y: clamp(hAY - 8, 0, ih),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis with decade labels */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={iw}
              y1={ih}
              y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            {xDecades.map((v) => {
              const x = xScale(v);
              return (
                <g key={`xt-${v}`}>
                  <line
                    x1={x}
                    x2={x}
                    y1={ih}
                    y2={ih + 4}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={1}
                  />
                  <text
                    x={x}
                    y={ih + 15}
                    textAnchor="middle"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink-soft)"
                  >
                    {fmtRank(v)}
                  </text>
                </g>
              );
            })}
            <text
              x={iw / 2}
              y={ih + 32}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              RANK (log)
            </text>
          </g>
        </ExplainAnchor>

        {/* Y-axis with decade labels */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              x2={0}
              y1={0}
              y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            {yDecades.map((v) => {
              const y = yScale(v);
              return (
                <g key={`yt-${v}`}>
                  <line
                    x1={-4}
                    x2={0}
                    y1={y}
                    y2={y}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={1}
                  />
                  <text
                    x={-8}
                    y={y}
                    textAnchor="end"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink-soft)"
                  >
                    {fmtFreq(v)}
                  </text>
                </g>
              );
            })}
            <text
              x={-44}
              y={-8}
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              FREQUENCY
            </text>
          </g>
        </ExplainAnchor>

        {/* Decade anchor — the grid itself encodes the log structure */}
        <ExplainAnchor
          selector="decade-grid"
          index={6}
          pin={{
            x: clamp(xScale(10) + 14, 10, iw - 10),
            y: clamp(yScale(1e7) - 10, 10, ih - 10),
          }}
          rect={{
            x: clamp(xScale(10) - 2, 0, iw),
            y: 0,
            width: 4,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Caption / inset note in the lower-left corner of the plot. */}
        <ExplainAnchor
          selector="caption"
          index={7}
          pin={{
            x: clamp(hBX + 18, 10, iw - 10),
            y: clamp(hBY - 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(hBX - 10, 0, iw),
            y: clamp(hBY - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <text
            x={clamp(hBX + 8, 0, iw - 90)}
            y={clamp(hBY - 6, 10, ih)}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            slope ≈ −1  →  f ∝ 1/rank
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
