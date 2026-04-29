"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── OHLC type ────────────────────────────────────────────────────────────────

interface Candle {
  i: number;       // session index 0..85
  open: number;
  high: number;
  low: number;
  close: number;
}

// ─── Seeded LCG ──────────────────────────────────────────────────────────────

function makeLCG(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// ─── Generate 86 OHLC sessions (60 visible + 26 for Senkou projection) ───────
// Regime shift at session 30: switch from bull drift to bear drift so the
// kumo changes colour mid-chart.

function generateCandles(): Candle[] {
  const rand = makeLCG(17);
  const candles: Candle[] = [];
  let prev = 100;

  for (let i = 0; i < 86; i++) {
    const drift = i < 42 ? 0.25 : -0.30;
    const move = (rand() - 0.45) * 2.5 + drift;
    const open = prev + (rand() - 0.5) * 0.4;
    const close = open + move;
    const bodyHi = Math.max(open, close);
    const bodyLo = Math.min(open, close);
    const span = Math.max(0.3, bodyHi - bodyLo);
    const high = bodyHi + span * (0.4 + rand() * 0.8);
    const low = bodyLo - span * (0.4 + rand() * 0.8);
    candles.push({
      i,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
    });
    prev = close;
  }
  return candles;
}

// ─── Ichimoku indicator computations ─────────────────────────────────────────

function midpoint(candles: Candle[], from: number, to: number): number {
  const slice = candles.slice(from, to + 1);
  const hi = Math.max(...slice.map((c) => c.high));
  const lo = Math.min(...slice.map((c) => c.low));
  return (hi + lo) / 2;
}

interface IchimokuPoint {
  x: number;   // display x-index (0 = first visible session)
  tenkan?: number;
  kijun?: number;
  senkouA?: number;
  senkouB?: number;
  chikou?: number;
}

function computeIchimoku(candles: Candle[]): IchimokuPoint[] {
  // We have 86 candles. Visible sessions are 0..59 (indices into the array).
  // Senkou spans are projected +26 forward — so for session i we plot at x = i+26.
  // Chikou is the close lagged −26 back — for session i the close is plotted at x = i−26.

  const pts: IchimokuPoint[] = [];

  // Build a map keyed by display-x
  const map = new Map<number, IchimokuPoint>();
  const get = (x: number): IchimokuPoint => {
    if (!map.has(x)) map.set(x, { x });
    return map.get(x)!;
  };

  for (let i = 0; i < 86; i++) {
    // Tenkan-sen (9-period, needs i >= 8)
    if (i >= 8) {
      get(i).tenkan = midpoint(candles, i - 8, i);
    }

    // Kijun-sen (26-period, needs i >= 25)
    if (i >= 25) {
      get(i).kijun = midpoint(candles, i - 25, i);
    }

    // Senkou Span A = (Tenkan + Kijun)/2 projected +26 — plot at x = i+26
    if (i >= 25) {
      const tenkan = midpoint(candles, i - 8, i);
      const kijun = midpoint(candles, i - 25, i);
      const spA = (tenkan + kijun) / 2;
      // Only fill if display x ≤ 59 (visible range)
      if (i + 26 <= 59) {
        get(i + 26).senkouA = spA;
      }
    }

    // Senkou Span B = 52-period midpoint projected +26 — needs i >= 51
    if (i >= 51) {
      const spB = midpoint(candles, i - 51, i);
      if (i + 26 <= 59) {
        get(i + 26).senkouB = spB;
      }
    }

    // Chikou Span = close plotted at x = i−26 (only display positions 0..59)
    if (i >= 26 && i - 26 <= 59) {
      get(i - 26).chikou = candles[i].close;
    }
  }

  // Sort by x, return only display range 0..59
  for (const [x] of map) {
    if (x >= 0 && x <= 59) pts.push(map.get(x)!);
  }
  pts.sort((a, b) => a.x - b.x);
  return pts;
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  width: number;
  height: number;
}

export function IchimokuKinkoHyo({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 48, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { candles, pts } = useMemo(() => {
    const c = generateCandles();
    const p = computeIchimoku(c);
    return { candles: c.slice(0, 60), pts: p };
  }, []);

  // ── Scales ────────────────────────────────────────────────────────────────
  const labels = candles.map((c) => String(c.i));

  const xScale = scaleBand({
    domain: labels,
    range: [0, iw],
    padding: 0.2,
  });

  const allPrices = [
    ...candles.flatMap((c) => [c.high, c.low]),
    ...pts.flatMap((p) => [p.tenkan, p.kijun, p.senkouA, p.senkouB, p.chikou].filter(Boolean) as number[]),
  ];
  const yMin = Math.min(...allPrices) - 2;
  const yMax = Math.max(...allPrices) + 2;

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const bodyW = Math.max(1, bw * 0.6);
  const ticksY = yScale.ticks(5);

  // ── Helpers ────────────────────────────────────────────────────────────────
  const cx = (label: string) => (xScale(label) ?? 0) + bw / 2;
  const cxIdx = (i: number) => cx(String(i));

  // Filter out undefined for line series
  const tenkanPts = pts.filter((p) => p.tenkan !== undefined);
  const kijunPts = pts.filter((p) => p.kijun !== undefined);
  const chikouPts = pts.filter((p) => p.chikou !== undefined);

  // Cloud: pairs of (senkouA, senkouB) where both defined
  const cloudPts = pts.filter((p) => p.senkouA !== undefined && p.senkouB !== undefined);

  // Build SVG polygon path for kumo fill
  // Forward fill: left→right along senkouA, then right→left along senkouB
  const buildKumoBand = (pts: IchimokuPoint[], isBullish: boolean): string => {
    const filtered = pts.filter((p) => {
      const a = p.senkouA!;
      const b = p.senkouB!;
      return isBullish ? a >= b : a < b;
    });
    if (filtered.length < 2) return "";

    const top = filtered.map((p) => `${cxIdx(p.x)},${yScale(Math.max(p.senkouA!, p.senkouB!))}`);
    const bot = [...filtered].reverse().map((p) => `${cxIdx(p.x)},${yScale(Math.min(p.senkouA!, p.senkouB!))}`);
    return `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
  };

  // Contiguous kumo segments: split where bullish/bearish flips
  const kumoSegments: { isBullish: boolean; pts: IchimokuPoint[] }[] = [];
  let currentBull: boolean | null = null;
  let currentSeg: IchimokuPoint[] = [];

  for (const p of cloudPts) {
    const bull = (p.senkouA ?? 0) >= (p.senkouB ?? 0);
    if (currentBull === null) {
      currentBull = bull;
      currentSeg = [p];
    } else if (bull === currentBull) {
      currentSeg.push(p);
    } else {
      kumoSegments.push({ isBullish: currentBull, pts: currentSeg });
      currentBull = bull;
      currentSeg = [p];
    }
  }
  if (currentSeg.length > 0 && currentBull !== null) {
    kumoSegments.push({ isBullish: currentBull, pts: currentSeg });
  }

  // Build cloud polygon for each segment
  const buildSegPath = (seg: { isBullish: boolean; pts: IchimokuPoint[] }): string => {
    const { pts: sp } = seg;
    if (sp.length < 2) return "";
    const top = sp.map((p) => `${cxIdx(p.x)},${yScale(Math.max(p.senkouA!, p.senkouB!))}`);
    const bot = [...sp].reverse().map((p) => `${cxIdx(p.x)},${yScale(Math.min(p.senkouA!, p.senkouB!))}`);
    return `M ${top.join(" L ")} L ${bot.join(" L ")} Z`;
  };

  // ── Anchor reference positions ────────────────────────────────────────────

  // Pick session 15 for tenkan anchor (has enough history, early in chart)
  const tenkanAnchorX = cxIdx(15);
  const tenkanAnchorY = tenkanPts[15] ? yScale(tenkanPts[15].tenkan!) : ih / 3;

  // Kijun anchor near session 30
  const kijunAnchorIdx = kijunPts.findIndex((p) => p.x >= 30);
  const kijunPt = kijunPts[kijunAnchorIdx >= 0 ? kijunAnchorIdx : 0];
  const kijunAnchorX = kijunPt ? cxIdx(kijunPt.x) : iw * 0.5;
  const kijunAnchorY = kijunPt?.kijun ? yScale(kijunPt.kijun) : ih / 2;

  // Cloud anchor: midpoint of kumo region
  const kumoMidIdx = Math.floor(cloudPts.length / 2);
  const kumoMidPt = cloudPts[kumoMidIdx];
  const kumoAnchorX = kumoMidPt ? cxIdx(kumoMidPt.x) : iw * 0.6;
  const kumoAnchorY = kumoMidPt
    ? (yScale(kumoMidPt.senkouA!) + yScale(kumoMidPt.senkouB!)) / 2
    : ih / 2;

  // Chikou anchor near session 20
  const chikouAnchorPt = chikouPts.find((p) => p.x >= 20);
  const chikouAnchorX = chikouAnchorPt ? cxIdx(chikouAnchorPt.x) : iw * 0.35;
  const chikouAnchorY = chikouAnchorPt?.chikou ? yScale(chikouAnchorPt.chikou) : ih * 0.7;

  // Candlestick anchor: session 5
  const candleRef = candles[5];
  const candleAnchorX = cxIdx(5);
  const candleAnchorTop = yScale(candleRef.high);
  const candleAnchorBot = yScale(candleRef.low);

  // Regime shift: where cloud changes colour (first segment boundary)
  const shiftX =
    kumoSegments.length >= 2
      ? cxIdx(kumoSegments[0].pts[kumoSegments[0].pts.length - 1].x)
      : iw * 0.55;
  const shiftY = ih * 0.15;

  return (
    <svg width={width} height={height} role="img" aria-label="Ichimoku Kinko Hyo chart">
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

        {/* ── Kumo cloud (filled polygons, under other series) ────────────── */}
        <ExplainAnchor
          selector="kumo"
          index={3}
          pin={{ x: kumoAnchorX + 14, y: kumoAnchorY - 14 }}
          rect={{
            x: Math.max(0, kumoAnchorX - iw * 0.1),
            y: Math.max(0, kumoAnchorY - ih * 0.15),
            width: Math.min(iw * 0.2, iw - Math.max(0, kumoAnchorX - iw * 0.1)),
            height: Math.min(ih * 0.3, ih - Math.max(0, kumoAnchorY - ih * 0.15)),
          }}
        >
          <g data-data-layer="true">
            {kumoSegments.map((seg, si) => (
              <path
                key={`kumo-${si}`}
                d={buildSegPath(seg)}
                fill={
                  seg.isBullish
                    ? "rgba(74, 153, 130, 0.20)"
                    : "rgba(180, 80, 80, 0.20)"
                }
                stroke="none"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* ── Senkou Span A/B boundary ─────────────────────────────────────── */}
        <ExplainAnchor
          selector="senkou-spans"
          index={4}
          pin={{ x: cxIdx(53), y: yScale((cloudPts[cloudPts.length - 1]?.senkouA ?? yMin + 4)) - 16 }}
          rect={{
            x: Math.max(0, cxIdx(50) - 4),
            y: 0,
            width: Math.min(iw - Math.max(0, cxIdx(50) - 4), iw * 0.15),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {/* Senkou Span A */}
            <LinePath
              data={cloudPts.filter((p) => p.senkouA !== undefined)}
              x={(p) => cxIdx(p.x)}
              y={(p) => yScale(p.senkouA!)}
              stroke="rgba(74, 153, 130, 0.8)"
              strokeWidth={1.2}
              strokeDasharray="3 2"
              fill="none"
              curve={curveMonotoneX}
            />
            {/* Senkou Span B */}
            <LinePath
              data={cloudPts.filter((p) => p.senkouB !== undefined)}
              x={(p) => cxIdx(p.x)}
              y={(p) => yScale(p.senkouB!)}
              stroke="rgba(180, 80, 80, 0.8)"
              strokeWidth={1.2}
              strokeDasharray="3 2"
              fill="none"
              curve={curveMonotoneX}
            />
          </g>
        </ExplainAnchor>

        {/* ── Chikou Span (lagged close) ────────────────────────────────────── */}
        <ExplainAnchor
          selector="chikou-span"
          index={5}
          pin={{ x: chikouAnchorX + 14, y: chikouAnchorY - 14 }}
          rect={{
            x: Math.max(0, chikouAnchorX - 20),
            y: Math.max(0, chikouAnchorY - 20),
            width: Math.min(40, iw - Math.max(0, chikouAnchorX - 20)),
            height: Math.min(40, ih - Math.max(0, chikouAnchorY - 20)),
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={chikouPts}
              x={(p) => cxIdx(p.x)}
              y={(p) => yScale(p.chikou!)}
              stroke="rgba(120, 80, 180, 0.75)"
              strokeWidth={1.4}
              strokeDasharray="4 3"
              fill="none"
              curve={curveMonotoneX}
            />
          </g>
        </ExplainAnchor>

        {/* ── Candlesticks ───────────────────────────────────────────────────── */}
        <ExplainAnchor
          selector="candlesticks"
          index={6}
          pin={{ x: candleAnchorX + bw + 10, y: candleAnchorTop - 8 }}
          rect={{
            x: Math.max(0, candleAnchorX - 4),
            y: Math.max(0, candleAnchorTop - 4),
            width: Math.min(bodyW + 8, iw - Math.max(0, candleAnchorX - 4)),
            height: Math.min(candleAnchorBot - candleAnchorTop + 8, ih - Math.max(0, candleAnchorTop - 4)),
          }}
        >
          <g data-data-layer="true">
            {candles.map((c) => {
              const label = String(c.i);
              const x = cx(label);
              const bx = x - bodyW / 2;
              const bull = c.close >= c.open;
              const bTop = yScale(Math.max(c.open, c.close));
              const bBot = yScale(Math.min(c.open, c.close));
              const bH = Math.max(1, bBot - bTop);
              return (
                <g key={`cs-${c.i}`}>
                  <line
                    x1={x} y1={yScale(c.high)}
                    x2={x} y2={yScale(c.low)}
                    stroke="var(--color-ink)"
                    strokeWidth={0.8}
                    opacity={0.6}
                  />
                  <rect
                    x={bx} y={bTop}
                    width={bodyW} height={bH}
                    fill={bull ? "rgba(74,153,130,0.5)" : "var(--color-ink)"}
                    stroke="var(--color-ink)"
                    strokeWidth={0.5}
                    opacity={0.7}
                  />
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* ── Tenkan-sen ─────────────────────────────────────────────────────── */}
        <ExplainAnchor
          selector="tenkan-sen"
          index={1}
          pin={{ x: tenkanAnchorX + 14, y: tenkanAnchorY - 14 }}
          rect={{
            x: Math.max(0, tenkanAnchorX - 20),
            y: Math.max(0, tenkanAnchorY - 12),
            width: Math.min(40, iw - Math.max(0, tenkanAnchorX - 20)),
            height: Math.min(24, ih - Math.max(0, tenkanAnchorY - 12)),
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={tenkanPts}
              x={(p) => cxIdx(p.x)}
              y={(p) => yScale(p.tenkan!)}
              stroke="rgba(60, 110, 200, 0.9)"
              strokeWidth={1.6}
              fill="none"
              curve={curveMonotoneX}
            />
          </g>
        </ExplainAnchor>

        {/* ── Kijun-sen ─────────────────────────────────────────────────────── */}
        <ExplainAnchor
          selector="kijun-sen"
          index={2}
          pin={{ x: kijunAnchorX + 14, y: kijunAnchorY - 14 }}
          rect={{
            x: Math.max(0, kijunAnchorX - 20),
            y: Math.max(0, kijunAnchorY - 12),
            width: Math.min(40, iw - Math.max(0, kijunAnchorX - 20)),
            height: Math.min(24, ih - Math.max(0, kijunAnchorY - 12)),
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={kijunPts}
              x={(p) => cxIdx(p.x)}
              y={(p) => yScale(p.kijun!)}
              stroke="rgba(200, 60, 60, 0.9)"
              strokeWidth={1.8}
              fill="none"
              curve={curveMonotoneX}
            />
          </g>
        </ExplainAnchor>

        {/* ── Regime shift annotation ─────────────────────────────────────── */}
        <ExplainAnchor
          selector="regime-shift"
          index={7}
          pin={{ x: shiftX + 12, y: shiftY - 8 }}
          rect={{
            x: Math.max(0, shiftX - 16),
            y: 0,
            width: Math.min(32, iw - Math.max(0, shiftX - 16)),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={shiftX} y1={0}
              x2={shiftX} y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* ── Axes ──────────────────────────────────────────────────────────── */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={8}
          tickFormat={(v, i) => {
            const n = Number(v);
            return n % 10 === 0 ? String(n) : "";
          }}
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
          y={ih + 38}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          SESSION
        </text>

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
        <g transform="translate(0, -16)" data-data-layer="true">
          <line x1={0} x2={16} y1={5} y2={5} stroke="rgba(60,110,200,0.9)" strokeWidth={1.6} />
          <text x={20} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">TENKAN</text>
          <line x1={74} x2={90} y1={5} y2={5} stroke="rgba(200,60,60,0.9)" strokeWidth={1.8} />
          <text x={94} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">KIJUN</text>
          <line x1={138} x2={154} y1={5} y2={5} stroke="rgba(120,80,180,0.75)" strokeWidth={1.4} strokeDasharray="4 3" />
          <text x={158} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">CHIKOU</text>
          <rect x={210} y={0} width={12} height={10} fill="rgba(74,153,130,0.25)" stroke="rgba(74,153,130,0.8)" strokeWidth={0.8} />
          <text x={226} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">BULL KUMO</text>
          <rect x={300} y={0} width={12} height={10} fill="rgba(180,80,80,0.25)" stroke="rgba(180,80,80,0.8)" strokeWidth={0.8} />
          <text x={316} y={9} fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink-soft)">BEAR KUMO</text>
        </g>

      </Group>
    </svg>
  );
}
