"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Session {
  day: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number; // shares
}

// ─── Seeded LCG data generator ──────────────────────────────────────────────
// Produces ~15 sessions with plausible OHLC + volume (100k–2M shares).
// Volume intentionally varies widely so bar widths differ visibly.

function generateSessions(): Session[] {
  let seed = 17;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const sessions: Session[] = [];
  let prevClose = 50.0;

  // Pre-set volume multipliers to ensure variety (wide + narrow bars visible)
  const volMults = [0.8, 1.6, 0.3, 2.0, 0.5, 1.2, 0.2, 1.8, 0.9, 1.4, 0.4, 1.7, 0.6, 1.1, 2.0];

  for (let i = 0; i < 15; i++) {
    const drift = (rand() - 0.46) * 1.2; // slight upward bias
    const open = prevClose + (rand() - 0.5) * 0.4;
    const close = open + drift;
    const bodyHi = Math.max(open, close);
    const bodyLo = Math.min(open, close);
    const spread = Math.max(0.3, bodyHi - bodyLo);
    const high = bodyHi + spread * (0.4 + rand() * 0.8);
    const low = bodyLo - spread * (0.4 + rand() * 0.8);
    // Volume: base 600k shares, multiplied by preset factor
    const volume = Math.round(600_000 * volMults[i] * (0.85 + rand() * 0.3));

    sessions.push({
      day: i + 1,
      open: +open.toFixed(2),
      high: +high.toFixed(2),
      low: +low.toFixed(2),
      close: +close.toFixed(2),
      volume,
    });
    prevClose = close;
  }
  return sessions;
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  width: number;
  height: number;
}

export function EquivolumeChart({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 48, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const sessions = useMemo(() => generateSessions(), []);

  // Cumulative volume array — each bar starts at the cumulative vol before it.
  const cumVols = useMemo(() => {
    const acc: number[] = [];
    let total = 0;
    for (const s of sessions) {
      acc.push(total);
      total += s.volume;
    }
    acc.push(total); // final total (right edge of last bar)
    return acc;
  }, [sessions]);

  const totalVolume = cumVols[cumVols.length - 1];

  // x-scale: cumulative volume → pixel
  const xScale = scaleLinear({ domain: [0, totalVolume], range: [0, iw] });

  // y-scale: price
  const allHighs = sessions.map((s) => s.high);
  const allLows = sessions.map((s) => s.low);
  const yMin = Math.min(...allLows) - 1;
  const yMax = Math.max(...allHighs) + 1;
  const yScale = scaleLinear({ domain: [yMin, yMax], range: [ih, 0], nice: true });

  const ticksY = yScale.ticks(5);

  // Helper: x-pixel start/end for bar i
  const barX0 = (i: number) => xScale(cumVols[i]);
  const barX1 = (i: number) => xScale(cumVols[i + 1]);
  const barW = (i: number) => Math.max(1, barX1(i) - barX0(i));

  // Identify example bars for anchors
  // Widest bar (highest volume session)
  const wideIdx = sessions.reduce((best, s, i, arr) =>
    s.volume > arr[best].volume ? i : best, 0);
  // Narrowest bar (lowest volume session)
  const narrowIdx = sessions.reduce((best, s, i, arr) =>
    s.volume < arr[best].volume ? i : best, 0);
  // An up-bar (bullish)
  const upIdx = sessions.findIndex((s) => s.close > s.open);
  // A down-bar (bearish), different from upIdx
  const downIdx = sessions.findIndex((s, i) => s.close < s.open && i !== upIdx);

  // X-axis tick positions: label every 3rd bar with its cumulative volume
  const xTickValues = sessions
    .filter((_, i) => i % 3 === 0)
    .map((_, k) => cumVols[k * 3]);

  const fmtVolM = (v: number) => `${(v / 1_000_000).toFixed(1)}M`;

  return (
    <svg width={width} height={height} role="img" aria-label="Equivolume chart">
      <Group left={margin.left} top={margin.top}>

        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* ── Bars ─────────────────────────────────────────────────── */}
        <g data-data-layer="true">
          {sessions.map((s, i) => {
            const x = barX0(i);
            const w = barW(i);
            const barTop = yScale(s.high);
            const barBot = yScale(s.low);
            const barH = Math.max(1, barBot - barTop);
            const bull = s.close >= s.open;

            if (bull) {
              // Bullish: hollow rectangle with green stroke + small triangle at top-right
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={barTop}
                    width={w}
                    height={barH}
                    fill="none"
                    stroke="#4a8c70"
                    strokeWidth={1.2}
                  />
                  {/* Triangle marker at top-right corner: points up */}
                  <polygon
                    points={`${x + w - 1},${barTop + 1} ${x + w - 5},${barTop + 5} ${x + w - 1},${barTop + 5}`}
                    fill="#4a8c70"
                  />
                </g>
              );
            } else {
              // Bearish: filled dark rectangle + small triangle at bottom-left
              return (
                <g key={i}>
                  <rect
                    x={x}
                    y={barTop}
                    width={w}
                    height={barH}
                    fill="var(--color-ink)"
                    opacity={0.85}
                  />
                  {/* Triangle marker at bottom-left corner: points down */}
                  <polygon
                    points={`${x + 1},${barBot - 1} ${x + 5},${barBot - 5} ${x + 1},${barBot - 5}`}
                    fill="var(--color-hairline)"
                  />
                </g>
              );
            }
          })}
        </g>

        {/* ── Anchor 1: Wide bar (high-volume day) ─────────────────── */}
        <ExplainAnchor
          selector="wide-bar"
          index={1}
          pin={{ x: barX0(wideIdx) + barW(wideIdx) / 2, y: yScale(sessions[wideIdx].high) - 14 }}
          rect={{
            x: barX0(wideIdx),
            y: yScale(sessions[wideIdx].high),
            width: barW(wideIdx),
            height: Math.max(4, yScale(sessions[wideIdx].low) - yScale(sessions[wideIdx].high)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 2: Narrow bar (low-volume day) ────────────────── */}
        <ExplainAnchor
          selector="narrow-bar"
          index={2}
          pin={{ x: barX0(narrowIdx) + barW(narrowIdx) / 2 + 12, y: yScale(sessions[narrowIdx].low) + 14 }}
          rect={{
            x: Math.max(0, barX0(narrowIdx) - 4),
            y: yScale(sessions[narrowIdx].high),
            width: barW(narrowIdx) + 8,
            height: Math.max(4, yScale(sessions[narrowIdx].low) - yScale(sessions[narrowIdx].high)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 3: Up-bar (bullish day) ───────────────────────── */}
        <ExplainAnchor
          selector="up-bar"
          index={3}
          pin={{ x: barX0(upIdx) + barW(upIdx) / 2, y: yScale(sessions[upIdx].high) - 14 }}
          rect={{
            x: barX0(upIdx),
            y: yScale(sessions[upIdx].high),
            width: barW(upIdx),
            height: Math.max(4, yScale(sessions[upIdx].low) - yScale(sessions[upIdx].high)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 4: Down-bar (bearish day) ─────────────────────── */}
        <ExplainAnchor
          selector="down-bar"
          index={4}
          pin={{ x: barX0(downIdx) + barW(downIdx) / 2, y: yScale(sessions[downIdx].low) + 14 }}
          rect={{
            x: barX0(downIdx),
            y: yScale(sessions[downIdx].high),
            width: barW(downIdx),
            height: Math.max(4, yScale(sessions[downIdx].low) - yScale(sessions[downIdx].high)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 5: Cumulative-volume x-axis ───────────────────── */}
        <ExplainAnchor
          selector="cumulative-volume-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 38 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={xTickValues}
            tickFormat={(v) => fmtVolM(v as number)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            CUMULATIVE VOLUME (SHARES)
          </text>
        </ExplainAnchor>

        {/* ── Anchor 6: Price y-axis ───────────────────────────────── */}
        <ExplainAnchor
          selector="price-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `$${v}`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* Legend */}
        <g transform={`translate(0, -16)`} data-data-layer="true">
          <rect x={0} y={0} width={10} height={10} fill="none" stroke="#4a8c70" strokeWidth={1.2} />
          <text x={14} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">
            UP (CLOSE &gt; OPEN)
          </text>
          <rect x={130} y={0} width={10} height={10} fill="var(--color-ink)" opacity={0.85} />
          <text x={144} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">
            DOWN (CLOSE &lt; OPEN)
          </text>
        </g>

      </Group>
    </svg>
  );
}
