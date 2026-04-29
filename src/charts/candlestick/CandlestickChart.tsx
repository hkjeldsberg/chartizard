"use client";

import { useMemo } from "react";
import { Bar, Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Candle {
  day: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

// Deterministic 30-day OHLC series drifting $170 -> ~$195 with visible up and
// down days. Seeded LCG — no Math.random at render.
function generateCandles(): Candle[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const out: Candle[] = [];
  let prevClose = 170;
  for (let i = 0; i < 30; i++) {
    const open = prevClose + (rand() - 0.5) * 0.6;
    const drift = 0.9; // ~$0.9/day upward drift on average
    const dayMovePct = (rand() - 0.42) * 0.02; // slightly bull-biased +/- ~2%
    const close = open * (1 + dayMovePct) + drift;
    const bodyHi = Math.max(open, close);
    const bodyLo = Math.min(open, close);
    const bodySpan = Math.max(0.4, bodyHi - bodyLo);
    const wickUp = bodySpan * (0.6 + rand() * 1.4);
    const wickDn = bodySpan * (0.6 + rand() * 1.4);
    const high = bodyHi + wickUp * 0.5;
    const low = bodyLo - wickDn * 0.5;
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
  // Force a clear volatility-signal day near day 18 — long wick, tiny body.
  const vi = 17;
  const base = out[vi];
  const mid = (base.open + base.close) / 2;
  out[vi] = {
    ...base,
    open: round2(mid - 0.2),
    close: round2(mid + 0.15),
    high: round2(mid + 4.2),
    low: round2(mid - 3.6),
  };
  return out;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

interface Props {
  width: number;
  height: number;
}

export function CandlestickChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateCandles(), []);

  const xScale = scaleBand({
    domain: data.map((d) => d.label),
    range: [0, iw],
    padding: 0.25,
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
  const bodyW = Math.max(2, bw * 0.65);
  const ticksY = yScale.ticks(5);

  // Representative days.
  const bullSample = data[5]; // an early up day
  const bearSample = data[3]; // an early down day
  const volatilityDay = data[17]; // the engineered long-wick candle

  const centreX = (d: Candle) => (xScale(d.label) ?? 0) + bw / 2;
  const bodyX = (d: Candle) => centreX(d) - bodyW / 2;
  const bodyTop = (d: Candle) => yScale(Math.max(d.open, d.close));
  const bodyBottom = (d: Candle) => yScale(Math.min(d.open, d.close));

  return (
    <svg width={width} height={height} role="img" aria-label="Candlestick chart">
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

        {/* Wicks */}
        <g data-data-layer="true">
          {data.map((d) => (
            <Line
              key={`w-${d.day}`}
              from={{ x: centreX(d), y: yScale(d.high) }}
              to={{ x: centreX(d), y: yScale(d.low) }}
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Bodies */}
        <g data-data-layer="true">
          {data.map((d) => {
            const bullish = d.close >= d.open;
            const top = bodyTop(d);
            const bottom = bodyBottom(d);
            const h = Math.max(1, bottom - top);
            return (
              <Bar
                key={`b-${d.day}`}
                x={bodyX(d)}
                y={top}
                width={bodyW}
                height={h}
                fill={bullish ? "#4a6a68" : "var(--color-ink)"}
              />
            );
          })}
        </g>

        {/* Anchor 1: body (bull day) */}
        <ExplainAnchor
          selector="body"
          index={1}
          pin={{ x: centreX(bullSample) + 16, y: bodyTop(bullSample) - 10 }}
          rect={{
            x: bodyX(bullSample) - 2,
            y: bodyTop(bullSample) - 2,
            width: bodyW + 4,
            height: Math.max(6, bodyBottom(bullSample) - bodyTop(bullSample) + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: wick */}
        <ExplainAnchor
          selector="wick"
          index={2}
          pin={{ x: centreX(bearSample) + 16, y: yScale(bearSample.high) - 4 }}
          rect={{
            x: centreX(bearSample) - 4,
            y: yScale(bearSample.high) - 4,
            width: 8,
            height: yScale(bearSample.low) - yScale(bearSample.high) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: colour (bull/bear) — pinned near the bear candle body */}
        <ExplainAnchor
          selector="colour"
          index={3}
          pin={{ x: centreX(bearSample) - 20, y: (bodyTop(bearSample) + bodyBottom(bearSample)) / 2 }}
          rect={{
            x: bodyX(bearSample) - 2,
            y: bodyTop(bearSample) - 2,
            width: bodyW + 4,
            height: Math.max(6, bodyBottom(bearSample) - bodyTop(bearSample) + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: volatility-signal day (long wick, small body) */}
        <ExplainAnchor
          selector="volatility-signal"
          index={4}
          pin={{ x: centreX(volatilityDay) + 18, y: yScale(volatilityDay.high) + 8 }}
          rect={{
            x: centreX(volatilityDay) - bodyW / 2 - 4,
            y: yScale(volatilityDay.high) - 4,
            width: bodyW + 8,
            height: yScale(volatilityDay.low) - yScale(volatilityDay.high) + 8,
          }}
        >
          <g>
            <circle
              cx={centreX(volatilityDay)}
              cy={(yScale(volatilityDay.high) + yScale(volatilityDay.low)) / 2}
              r={Math.max(8, (yScale(volatilityDay.low) - yScale(volatilityDay.high)) / 2 + 4)}
              fill="none"
              stroke="var(--color-ink)"
              strokeDasharray="2 3"
              strokeWidth={1}
            />
          </g>
        </ExplainAnchor>

        {/* Anchor 5: x-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v, i) => (i % 5 === 0 ? String(v) : "")}
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

        {/* Anchor 6: y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
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

        {/* Legend (bull vs bear) */}
        <g transform={`translate(0, -14)`} data-data-layer="true">
          <rect x={0} y={0} width={10} height={10} fill="#4a6a68" />
          <text
            x={14}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            BULL (CLOSE &gt; OPEN)
          </text>
          <rect x={140} y={0} width={10} height={10} fill="var(--color-ink)" />
          <text
            x={154}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            BEAR (CLOSE &lt; OPEN)
          </text>
        </g>
      </Group>
    </svg>
  );
}
