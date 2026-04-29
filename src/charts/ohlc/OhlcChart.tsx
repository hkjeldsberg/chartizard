"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Bar {
  day: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Deterministic 60-day OHLC series for a SPY-like synthetic ticker. LCG +
// Box-Muller Gaussian so intraday range is realistic, drifting roughly
// $420 -> ~$455. No Math.random at render.
function generateBars(): Bar[] {
  let seed = 13;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const N = 60;
  const out: Bar[] = [];
  let prevClose = 420;
  for (let i = 0; i < N; i++) {
    // Small overnight gap between prevClose and today's open.
    const open = prevClose + gauss() * 0.5;
    // Average drift ~$0.55/day with Gaussian day-move volatility.
    const drift = 0.55;
    const vol = 2.4;
    const close = Math.max(60, open + drift + gauss() * vol);
    const bodyHi = Math.max(open, close);
    const bodyLo = Math.min(open, close);
    const bodySpan = Math.max(0.4, bodyHi - bodyLo);
    // Wick sizes — fold in another Gaussian so intraday range varies.
    const wickUp = Math.abs(gauss()) * 1.6 + bodySpan * 0.4;
    const wickDn = Math.abs(gauss()) * 1.6 + bodySpan * 0.4;
    const high = bodyHi + wickUp;
    const low = bodyLo - wickDn;
    out.push({
      day: i + 1,
      label: `D${i + 1}`,
      open: round2(open),
      high: round2(high),
      low: round2(low),
      close: round2(close),
    });
    prevClose = close;
  }
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface Props {
  width: number;
  height: number;
}

export function OhlcChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateBars(), []);

  const xScale = scaleBand({
    domain: data.map((d) => d.label),
    range: [0, iw],
    padding: 0.35,
  });

  const allLows = data.map((d) => d.low);
  const allHighs = data.map((d) => d.high);
  const yMin = Math.floor(Math.min(...allLows) - 1);
  const yMax = Math.ceil(Math.max(...allHighs) + 1);

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const tickLen = Math.max(2, bw * 0.55);
  const ticksY = yScale.ticks(5);

  // Representative bars. Scan for an up-day and a down-day with clean
  // separation so the anchors sit on readable candles.
  const upSample = pickSample(data, 12, (d) => d.close - d.open);
  const downSample = pickSample(data, 28, (d) => d.open - d.close);
  // Anchor targets: prefer late up-day / early down-day for spatial spread.
  const highSample = upSample;
  const lowSample = downSample;

  const centreX = (d: Bar) => (xScale(d.label) ?? 0) + bw / 2;

  // Up-day ink is darker; down-day lighter. No colour-only encoding —
  // tick direction (open left, close right) still tells the story alone.
  const upStroke = "var(--color-ink)";
  const downStroke = "var(--color-ink-mute)";

  return (
    <svg width={width} height={height} role="img" aria-label="OHLC chart">
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

        {/* OHLC bars */}
        <g data-data-layer="true">
          {data.map((d) => {
            const up = d.close >= d.open;
            const cx = centreX(d);
            const stroke = up ? upStroke : downStroke;
            const sw = up ? 1.4 : 1.1;
            return (
              <g key={`b-${d.day}`}>
                {/* Vertical range bar (low -> high) */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={yScale(d.high)}
                  y2={yScale(d.low)}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
                {/* Open tick (left) */}
                <line
                  x1={cx - tickLen}
                  x2={cx}
                  y1={yScale(d.open)}
                  y2={yScale(d.open)}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
                {/* Close tick (right) */}
                <line
                  x1={cx}
                  x2={cx + tickLen}
                  y1={yScale(d.close)}
                  y2={yScale(d.close)}
                  stroke={stroke}
                  strokeWidth={sw}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
        </g>

        {/* Legend: up day vs down day */}
        <g transform="translate(0, -18)" data-data-layer="true">
          <line x1={0} x2={0} y1={0} y2={12} stroke={upStroke} strokeWidth={1.4} />
          <line x1={-4} x2={0} y1={3} y2={3} stroke={upStroke} strokeWidth={1.4} />
          <line x1={0} x2={4} y1={9} y2={9} stroke={upStroke} strokeWidth={1.4} />
          <text
            x={10}
            y={10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            UP (CLOSE &gt; OPEN)
          </text>
          <line x1={140} x2={140} y1={0} y2={12} stroke={downStroke} strokeWidth={1.1} />
          <line x1={136} x2={140} y1={3} y2={3} stroke={downStroke} strokeWidth={1.1} />
          <line x1={140} x2={144} y1={9} y2={9} stroke={downStroke} strokeWidth={1.1} />
          <text
            x={150}
            y={10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            DOWN (CLOSE &lt; OPEN)
          </text>
        </g>

        {/* Anchor 1: high (top of range bar on the up-day sample) */}
        <ExplainAnchor
          selector="high"
          index={1}
          pin={{ x: centreX(highSample) + 14, y: yScale(highSample.high) - 4 }}
          rect={{
            x: centreX(highSample) - 5,
            y: yScale(highSample.high) - 4,
            width: 10,
            height: Math.max(6, yScale(highSample.open) - yScale(highSample.high) + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: low (bottom of range bar on the down-day sample) */}
        <ExplainAnchor
          selector="low"
          index={2}
          pin={{ x: centreX(lowSample) + 14, y: yScale(lowSample.low) + 4 }}
          rect={{
            x: centreX(lowSample) - 5,
            y: yScale(lowSample.close) - 2,
            width: 10,
            height: Math.max(6, yScale(lowSample.low) - yScale(lowSample.close) + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: open tick (left) on the up-day sample */}
        <ExplainAnchor
          selector="open-tick"
          index={3}
          pin={{ x: centreX(upSample) - tickLen - 12, y: yScale(upSample.open) }}
          rect={{
            x: centreX(upSample) - tickLen - 3,
            y: yScale(upSample.open) - 4,
            width: tickLen + 3,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: close tick (right) on the up-day sample */}
        <ExplainAnchor
          selector="close-tick"
          index={4}
          pin={{ x: centreX(upSample) + tickLen + 12, y: yScale(upSample.close) }}
          rect={{
            x: centreX(upSample),
            y: yScale(upSample.close) - 4,
            width: tickLen + 3,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: up vs down days — pins at the down-day sample */}
        <ExplainAnchor
          selector="up-down-day"
          index={5}
          pin={{ x: centreX(downSample) - 16, y: (yScale(downSample.high) + yScale(downSample.low)) / 2 }}
          rect={{
            x: centreX(downSample) - tickLen - 4,
            y: yScale(downSample.high) - 4,
            width: tickLen * 2 + 8,
            height: yScale(downSample.low) - yScale(downSample.high) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: date axis */}
        <ExplainAnchor
          selector="date-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom - 4 }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v, i) => (i % 10 === 0 ? String(v) : "")}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* Y-axis (no anchor — OHLC contract calls for the 5 numbered
            marks above + the date axis; keep the y-axis as unobtrusive
            scale reference.) */}
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
      </Group>
    </svg>
  );
}

// Pick a sample bar near the requested index that maximises the supplied
// score function inside a small window — guards against the chosen index
// landing on a near-doji where the encoding is hard to read.
function pickSample(data: Bar[], idx: number, score: (d: Bar) => number): Bar {
  const radius = 3;
  let best = data[Math.min(Math.max(idx, 0), data.length - 1)];
  let bestScore = score(best);
  for (let i = Math.max(0, idx - radius); i <= Math.min(data.length - 1, idx + radius); i++) {
    const s = score(data[i]);
    if (s > bestScore) {
      best = data[i];
      bestScore = s;
    }
  }
  return best;
}
