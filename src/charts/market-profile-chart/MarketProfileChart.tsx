"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Types ───────────────────────────────────────────────────────────────────

// 31 price levels from 100.0 to 103.0 in 0.1 increments
const PRICE_MIN = 100.0;
const PRICE_MAX = 103.0;
const PRICE_STEP = 0.1;

// 13 TPO periods: A–M (one per 30-min slot in a 6.5-hour trading day)
const PERIODS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M"] as const;
type Period = (typeof PERIODS)[number];

interface PriceRow {
  price: number;   // e.g. 101.5
  letters: Period[]; // ordered set of period letters that traded at this price
}

// ─── Build market profile data ──────────────────────────────────────────────
// Manually constructed to produce a clear bell shape centred at 101.5 (POC),
// with single prints at the extremes and a ~70% Value Area around the POC.
//
// Row widths (number of TPO letters) by price level:
//   100.0–100.2: 1 letter (single prints at lower extreme)
//   100.3–100.4: 2 letters
//   100.5–100.7: 3 letters
//   100.8–100.9: 4 letters
//   101.0–101.1: 5 letters
//   101.2–101.3: 6 letters
//   101.4–101.6: 8 letters  (POC = 101.5)
//   101.7–101.8: 6 letters
//   101.9–102.0: 5 letters
//   102.1–102.2: 4 letters
//   102.3–102.5: 3 letters
//   102.6–102.7: 2 letters
//   102.8–103.0: 1 letter (single print at upper extreme)
//
// Letters are assigned in period-order (A first) so they accumulate naturally.

function buildProfile(): PriceRow[] {
  // Number of letters for each 0.1 increment from 100.0 to 103.0
  const widths = [
    1, 1, 1,   // 100.0, 100.1, 100.2
    2, 2,       // 100.3, 100.4
    3, 3, 3,   // 100.5, 100.6, 100.7
    4, 4,       // 100.8, 100.9
    5, 5,       // 101.0, 101.1
    6, 6,       // 101.2, 101.3
    7, 8, 7,   // 101.4, 101.5 (POC), 101.6
    6, 6,       // 101.7, 101.8
    5, 5,       // 101.9, 102.0
    4, 4,       // 102.1, 102.2
    3, 3, 3,   // 102.3, 102.4, 102.5
    2, 2,       // 102.6, 102.7
    1, 1, 1,   // 102.8, 102.9, 103.0
  ];

  const rows: PriceRow[] = [];
  const count = Math.round((PRICE_MAX - PRICE_MIN) / PRICE_STEP) + 1; // 31

  for (let i = 0; i < count; i++) {
    const price = +(PRICE_MIN + i * PRICE_STEP).toFixed(1);
    const n = widths[i] ?? 1;
    // Always start from period A (index 0) so the bell shape is consistent
    const letters = PERIODS.slice(0, n) as Period[];
    rows.push({ price, letters });
  }
  return rows;
}

// ─── Value Area calculation ──────────────────────────────────────────────────
// Value Area = rows containing ~70% of all TPOs, centred on the POC row.
// Expand from POC outward, adding the larger-count neighbour first.

function computeValueArea(rows: PriceRow[]): { low: number; high: number } {
  const totalTPOs = rows.reduce((s, r) => s + r.letters.length, 0);
  const target = Math.floor(totalTPOs * 0.70);

  const pocIdx = rows.reduce((best, r, i, arr) =>
    r.letters.length > arr[best].letters.length ? i : best, 0);

  let count = rows[pocIdx].letters.length;
  let lo = pocIdx;
  let hi = pocIdx;

  while (count < target) {
    const nextLo = lo - 1;
    const nextHi = hi + 1;
    const canLo = nextLo >= 0;
    const canHi = nextHi < rows.length;

    if (!canLo && !canHi) break;

    const cntLo = canLo ? rows[nextLo].letters.length : 0;
    const cntHi = canHi ? rows[nextHi].letters.length : 0;

    if (!canHi || (canLo && cntLo >= cntHi)) {
      lo = nextLo;
      count += cntLo;
    } else {
      hi = nextHi;
      count += cntHi;
    }
  }

  return { low: rows[lo].price, high: rows[hi].price };
}

// ─── Component ───────────────────────────────────────────────────────────────

interface Props {
  width: number;
  height: number;
}

export function MarketProfileChart({ width, height }: Props) {
  const margin = { top: 20, right: 52, bottom: 32, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const rows = useMemo(() => buildProfile(), []);
  const { low: vaLow, high: vaHigh } = useMemo(() => computeValueArea(rows), [rows]);

  const pocRow = rows.reduce((best, r) =>
    r.letters.length > best.letters.length ? r : best, rows[0]);

  // Price scale (y-axis)
  const prices = rows.map((r) => r.price);
  const yScale = scaleLinear({
    domain: [PRICE_MIN - PRICE_STEP, PRICE_MAX + PRICE_STEP],
    range: [ih, 0],
    nice: false,
  });

  // Row height in pixels
  const rowH = Math.max(1, ih / (rows.length + 2));

  // Maximum letters in any row (for x-scaling)
  const maxLetters = Math.max(...rows.map((r) => r.letters.length));

  // Letter cell width
  const letterW = Math.max(6, Math.min(12, iw / (maxLetters + 1)));
  const fontSize = Math.max(6, Math.min(10, letterW * 0.85));

  // Single print row indices
  const singlePrintRows = rows.filter((r) => r.letters.length === 1);
  const singlePrintExample = singlePrintRows[0]; // first single print (lower extreme)

  // Value area bracket x-position (right side)
  const bracketX = Math.min(iw, maxLetters * letterW + 8);

  // y-pixel centre for a price row
  const rowY = (price: number) => yScale(price);

  return (
    <svg width={width} height={height} role="img" aria-label="Market Profile chart">
      <Group left={margin.left} top={margin.top}>

        {/* ── Data layer: TPO letter grid + POC highlight ─────────── */}
        <g data-data-layer="true">

          {/* POC background highlight */}
          <rect
            x={0}
            y={rowY(pocRow.price) - rowH / 2}
            width={iw}
            height={rowH}
            fill="var(--color-ink)"
            opacity={0.12}
          />

          {/* Value Area highlight band */}
          <rect
            x={0}
            y={rowY(vaHigh) - rowH / 2}
            width={iw}
            height={rowY(vaLow) - rowY(vaHigh) + rowH}
            fill="var(--color-ink)"
            opacity={0.06}
          />

          {/* TPO letters */}
          {rows.map((row) => {
            const cy = rowY(row.price);
            return row.letters.map((letter, k) => (
              <text
                key={`${row.price}-${letter}`}
                x={k * letterW + letterW / 2}
                y={cy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={fontSize}
                fill="var(--color-ink)"
                opacity={0.85}
              >
                {letter}
              </text>
            ));
          })}

          {/* POC line (extends full width) */}
          <line
            x1={0}
            x2={iw}
            y1={rowY(pocRow.price)}
            y2={rowY(pocRow.price)}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </g>

        {/* ── Anchor 1: A price row with multiple letters ──────────── */}
        {(() => {
          // Pick a representative middle row (e.g. POC row)
          const anchorRow = pocRow;
          const cy = rowY(anchorRow.price);
          return (
            <ExplainAnchor
              selector="tpo-letters"
              index={1}
              pin={{ x: anchorRow.letters.length * letterW + 12, y: cy - rowH * 1.5 }}
              rect={{
                x: 0,
                y: cy - rowH / 2,
                width: Math.min(iw, anchorRow.letters.length * letterW + 4),
                height: rowH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* ── Anchor 2: POC (Point of Control) ─────────────────────── */}
        <ExplainAnchor
          selector="poc"
          index={2}
          pin={{ x: pocRow.letters.length * letterW + 14, y: rowY(pocRow.price) }}
          rect={{
            x: 0,
            y: rowY(pocRow.price) - rowH / 2,
            width: iw,
            height: rowH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* ── Anchor 3: Value Area ──────────────────────────────────── */}
        {(() => {
          const vaTop = rowY(vaHigh) - rowH / 2;
          const vaBottom = rowY(vaLow) + rowH / 2;
          const vaH = vaBottom - vaTop;
          const bx = Math.min(iw - 8, bracketX + 4);
          return (
            <ExplainAnchor
              selector="value-area"
              index={3}
              pin={{ x: bx + 12, y: vaTop + vaH / 2 }}
              rect={{
                x: Math.max(0, bx - 4),
                y: vaTop,
                width: Math.min(iw - bx + 4, 20),
                height: vaH,
              }}
            >
              {/* Value Area bracket */}
              <g data-data-layer="true">
                <line
                  x1={bx}
                  x2={bx + 6}
                  y1={vaTop}
                  y2={vaTop}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <line
                  x1={bx}
                  x2={bx}
                  y1={vaTop}
                  y2={vaBottom}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <line
                  x1={bx}
                  x2={bx + 6}
                  y1={vaBottom}
                  y2={vaBottom}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <text
                  x={bx + 8}
                  y={vaTop + vaH / 2}
                  fontFamily="var(--font-mono)"
                  fontSize={7}
                  fill="var(--color-ink-mute)"
                  dominantBaseline="central"
                >
                  VA
                </text>
              </g>
            </ExplainAnchor>
          );
        })()}

        {/* ── Anchor 4: Single print ────────────────────────────────── */}
        {(() => {
          const cy = rowY(singlePrintExample.price);
          return (
            <ExplainAnchor
              selector="single-print"
              index={4}
              pin={{ x: letterW + 14, y: cy }}
              rect={{
                x: 0,
                y: cy - rowH / 2,
                width: letterW + 4,
                height: rowH,
              }}
            >
              {/* Dashed underline under single-print letter */}
              <line
                x1={1}
                x2={letterW}
                y1={cy + rowH / 2 - 1}
                y2={cy + rowH / 2 - 1}
                stroke="var(--color-ink)"
                strokeWidth={0.8}
                strokeDasharray="1 1"
                data-data-layer="true"
              />
            </ExplainAnchor>
          );
        })()}

        {/* ── Anchor 5: y-axis (price) ──────────────────────────────── */}
        <ExplainAnchor
          selector="price-axis"
          index={5}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={7}
            tickFormat={(v) => `$${(v as number).toFixed(1)}`}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* ── Anchor 6: Bell-shape profile ─────────────────────────── */}
        {(() => {
          // Anchor on the overall distribution silhouette, in the mid-upper area
          const midPrice = (PRICE_MIN + PRICE_MAX) / 2;
          const midY = rowY(midPrice);
          return (
            <ExplainAnchor
              selector="bell-shape"
              index={6}
              pin={{ x: 4, y: midY - 20 }}
              rect={{
                x: 0,
                y: rowY(vaHigh + PRICE_STEP * 4) - rowH / 2,
                width: Math.min(iw, (maxLetters - 2) * letterW),
                height: rowY(vaLow - PRICE_STEP * 4) - rowY(vaHigh + PRICE_STEP * 4) + rowH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

      </Group>
    </svg>
  );
}
