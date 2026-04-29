"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Three-Line Break types ───────────────────────────────────────────────────

interface TLBBar {
  index: number;        // event index on x-axis
  open: number;         // bottom of the bar (lower price)
  close: number;        // top of the bar (higher price if up, lower if down)
  direction: "up" | "down";
}

// ─── Seeded LCG ──────────────────────────────────────────────────────────────

function makeLCG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ─── Generate a price series with a clear up-trend then reversal ─────────────

function generatePrices(): number[] {
  const rand = makeLCG(31);
  const prices: number[] = [100];
  for (let i = 1; i < 120; i++) {
    const drift = i < 70 ? 0.4 : -0.55;
    const move = (rand() - 0.44) * 3 + drift;
    prices.push(Math.max(85, prices[prices.length - 1] + move));
  }
  return prices.map((p) => Math.round(p * 100) / 100);
}

// ─── Three-Line Break construction ───────────────────────────────────────────
// Rules:
//   • Continue up if new close > top of most-recent bar.
//   • Continue down if new close < bottom of most-recent bar.
//   • Reverse (down): close must break below the LOW of the last 3 UP bars.
//   • Reverse (up): close must break above the HIGH of the last 3 DOWN bars.

function buildThreeLineBreak(prices: number[]): TLBBar[] {
  if (prices.length < 2) return [];

  const bars: TLBBar[] = [];

  // Seed with first two prices as a direction hint
  const firstUp = prices[1] >= prices[0];
  bars.push({
    index: 0,
    open: Math.min(prices[0], prices[1]),
    close: Math.max(prices[0], prices[1]),
    direction: firstUp ? "up" : "down",
  });

  for (let i = 2; i < prices.length; i++) {
    const p = prices[i];
    const last = bars[bars.length - 1];
    const barHigh = Math.max(last.open, last.close);
    const barLow = Math.min(last.open, last.close);

    if (last.direction === "up") {
      if (p > barHigh) {
        // Continue up
        bars.push({ index: bars.length, open: barHigh, close: p, direction: "up" });
      } else {
        // Check reversal: need to break below MIN low of last 3 up-bars
        const recentUps = bars.filter((b) => b.direction === "up").slice(-3);
        const minLow = Math.min(...recentUps.map((b) => Math.min(b.open, b.close)));
        if (p < minLow) {
          bars.push({ index: bars.length, open: barLow, close: p, direction: "down" });
        }
        // else: no new bar (price doesn't qualify)
      }
    } else {
      // direction === "down"
      if (p < barLow) {
        // Continue down
        bars.push({ index: bars.length, open: barLow, close: p, direction: "down" });
      } else {
        // Check reversal: need to break above MAX high of last 3 down-bars
        const recentDowns = bars.filter((b) => b.direction === "down").slice(-3);
        const maxHigh = Math.max(...recentDowns.map((b) => Math.max(b.open, b.close)));
        if (p > maxHigh) {
          bars.push({ index: bars.length, open: barHigh, close: p, direction: "up" });
        }
      }
    }
  }

  return bars;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  width: number;
  height: number;
}

export function ThreeLineBreakChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const bars = useMemo(() => {
    const prices = generatePrices();
    const all = buildThreeLineBreak(prices);
    // Take up to 18 bars so the chart reads cleanly at any size
    return all.slice(0, 18);
  }, []);

  const numBars = Math.max(bars.length, 1);
  const barW = iw / numBars;
  const innerBarW = Math.max(2, barW * 0.82);
  const gap = (barW - innerBarW) / 2;

  // y-scale
  const allPrices = bars.flatMap((b) => [b.open, b.close]);
  const yMin = Math.min(...allPrices) - 1.5;
  const yMax = Math.max(...allPrices) + 1.5;

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [ih, 0],
    nice: true,
  });
  const ticksY = yScale.ticks(5);

  // ── Reference bar indices ─────────────────────────────────────────────────

  // First up-bar
  const firstUpIdx = bars.findIndex((b) => b.direction === "up");
  const safeUpIdx = firstUpIdx >= 0 ? firstUpIdx : 0;

  // First down-bar
  const firstDownIdx = bars.findIndex((b) => b.direction === "down");
  const safeDownIdx = firstDownIdx >= 0 ? firstDownIdx : Math.min(bars.length - 1, safeUpIdx + 1);

  // Reversal event: first bar that changed direction
  let reversalIdx = -1;
  for (let i = 1; i < bars.length; i++) {
    if (bars[i].direction !== bars[i - 1].direction) {
      reversalIdx = i;
      break;
    }
  }
  const safeReversalIdx = reversalIdx >= 0 ? reversalIdx : safeDownIdx;

  // 3-bar lookback: show one of the 3 bars whose low was broken at reversal
  // That's the 3 up-bars immediately before the reversal
  const lookbackIdx = safeReversalIdx >= 3 ? safeReversalIdx - 2 : 0;

  // A trend run: find 4+ consecutive up-bars
  let trendRunStart = safeUpIdx;
  for (let i = 0; i <= bars.length - 4; i++) {
    if (
      bars[i]?.direction === "up" &&
      bars[i + 1]?.direction === "up" &&
      bars[i + 2]?.direction === "up" &&
      bars[i + 3]?.direction === "up"
    ) {
      trendRunStart = i;
      break;
    }
  }

  // ── Helpers ─────────────────────────────────────────────────────────────
  const barX = (idx: number) => idx * barW + gap;
  const barTop = (b: TLBBar) => yScale(Math.max(b.open, b.close));
  const barBot = (b: TLBBar) => yScale(Math.min(b.open, b.close));
  const barH = (b: TLBBar) => Math.max(1, barBot(b) - barTop(b));

  const upBar = bars[safeUpIdx];
  const downBar = bars[safeDownIdx];
  const reversalBar = bars[safeReversalIdx];
  const lookbackBar = bars[lookbackIdx];
  const trendBar = bars[trendRunStart];

  return (
    <svg width={width} height={height} role="img" aria-label="Three-Line Break chart">
      <Group left={margin.left} top={margin.top}>

        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0} x2={iw}
              y1={yScale(t)} y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* ── Up-bars (hollow) ─────────────────────────────────────────────── */}
        <ExplainAnchor
          selector="up-bar"
          index={1}
          pin={{ x: barX(safeUpIdx) + innerBarW + 10, y: barTop(upBar) - 8 }}
          rect={{
            x: Math.max(0, barX(safeUpIdx) - 2),
            y: Math.max(0, barTop(upBar) - 2),
            width: Math.min(innerBarW + 4, iw - Math.max(0, barX(safeUpIdx) - 2)),
            height: Math.min(barH(upBar) + 4, ih - Math.max(0, barTop(upBar) - 2)),
          }}
        >
          <g data-data-layer="true">
            {bars
              .filter((b) => b.direction === "up")
              .map((b) => (
                <rect
                  key={`up-${b.index}`}
                  x={barX(b.index)}
                  y={barTop(b)}
                  width={innerBarW}
                  height={barH(b)}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
              ))}
          </g>
        </ExplainAnchor>

        {/* ── Down-bars (filled) ───────────────────────────────────────────── */}
        <ExplainAnchor
          selector="down-bar"
          index={2}
          pin={{ x: barX(safeDownIdx) + innerBarW + 10, y: barTop(downBar) + barH(downBar) / 2 }}
          rect={{
            x: Math.max(0, barX(safeDownIdx) - 2),
            y: Math.max(0, barTop(downBar) - 2),
            width: Math.min(innerBarW + 4, iw - Math.max(0, barX(safeDownIdx) - 2)),
            height: Math.min(barH(downBar) + 4, ih - Math.max(0, barTop(downBar) - 2)),
          }}
        >
          <g data-data-layer="true">
            {bars
              .filter((b) => b.direction === "down")
              .map((b) => (
                <rect
                  key={`dn-${b.index}`}
                  x={barX(b.index)}
                  y={barTop(b)}
                  width={innerBarW}
                  height={barH(b)}
                  fill="var(--color-ink)"
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
              ))}
          </g>
        </ExplainAnchor>

        {/* ── Reversal event ────────────────────────────────────────────────── */}
        <ExplainAnchor
          selector="reversal-event"
          index={3}
          pin={{ x: barX(safeReversalIdx) + innerBarW + 10, y: barTop(reversalBar) - 12 }}
          rect={{
            x: Math.max(0, barX(safeReversalIdx) - 4),
            y: Math.max(0, barTop(reversalBar) - 4),
            width: Math.min(innerBarW + 8, iw - Math.max(0, barX(safeReversalIdx) - 4)),
            height: Math.min(barH(reversalBar) + 8, ih - Math.max(0, barTop(reversalBar) - 4)),
          }}
        >
          <g data-data-layer="true">
            {/* Highlight ring around reversal bar */}
            <rect
              x={barX(safeReversalIdx) - 2}
              y={barTop(reversalBar) - 2}
              width={innerBarW + 4}
              height={barH(reversalBar) + 4}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={0.8}
              strokeDasharray="3 2"
            />
          </g>
        </ExplainAnchor>

        {/* ── 3-bar lookback anchor ─────────────────────────────────────────── */}
        <ExplainAnchor
          selector="three-bar-lookback"
          index={4}
          pin={{ x: barX(lookbackIdx) - 12, y: barTop(lookbackBar) - 12 }}
          rect={{
            x: Math.max(0, barX(lookbackIdx) - 4),
            y: Math.max(0, barTop(lookbackBar) - 4),
            width: Math.min(
              safeReversalIdx > lookbackIdx
                ? barX(safeReversalIdx) - barX(lookbackIdx) + innerBarW + 8
                : innerBarW + 8,
              iw - Math.max(0, barX(lookbackIdx) - 4),
            ),
            height: Math.min(barH(lookbackBar) + 8, ih - Math.max(0, barTop(lookbackBar) - 4)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Event-indexed x-axis (no time labels) ─────────────────────────── */}
        <ExplainAnchor
          selector="event-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g>
            <line
              x1={0} x2={iw}
              y1={ih} y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={iw / 2}
              y={ih + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              BARS (NOT TIME)
            </text>
            {bars.map((b) => (
              <line
                key={`tick-${b.index}`}
                x1={barX(b.index) + innerBarW / 2}
                x2={barX(b.index) + innerBarW / 2}
                y1={ih}
                y2={ih + 4}
                stroke="var(--color-ink-mute)"
                strokeWidth={0.6}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* ── Trend run annotation ──────────────────────────────────────────── */}
        <ExplainAnchor
          selector="trend-sequence"
          index={6}
          pin={{
            x: barX(trendRunStart) + innerBarW * 2 + 10,
            y: barTop(trendBar) - 14,
          }}
          rect={{
            x: Math.max(0, barX(trendRunStart) - 2),
            y: Math.max(0, barTop(trendBar) - 4),
            width: Math.min(barW * 4 + 4, iw - Math.max(0, barX(trendRunStart) - 2)),
            height: Math.min(ih * 0.5, ih - Math.max(0, barTop(trendBar) - 4)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Y-axis ────────────────────────────────────────────────────────── */}
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

        {/* ── Legend ────────────────────────────────────────────────────────── */}
        <g transform="translate(0, -14)" data-data-layer="true">
          <rect x={0} y={0} width={12} height={10} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
          <text x={18} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">UP</text>
          <rect x={48} y={0} width={12} height={10} fill="var(--color-ink)" />
          <text x={66} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">DOWN</text>
        </g>

      </Group>
    </svg>
  );
}
