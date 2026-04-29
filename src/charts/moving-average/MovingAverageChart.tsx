"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Row {
  day: number;
  price: number;
  ma20: number | null;
  ma50: number | null;
}

// Deterministic ~250-day SPY-style series: LCG + Box-Muller random walk with a
// 2020-style drawdown and recovery. Seed chosen so the 20-day MA crosses above
// the 50-day MA ("golden cross") in the second half of the series.
function generateSeries(): Row[] {
  let seed = 10;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const N = 250;
  const prices: number[] = [];
  let p = 300;

  for (let i = 0; i < N; i++) {
    // Regime-switching drift: mild uptrend, then a sharp drawdown window,
    // then a recovery that eventually carries the short MA above the long MA.
    let drift: number;
    let vol: number;
    if (i < 50) {
      drift = 0.25;
      vol = 2.4;
    } else if (i < 85) {
      // Drawdown: ~35 trading days of negative drift, elevated volatility.
      drift = -1.4;
      vol = 5.2;
    } else if (i < 140) {
      // Recovery: steady climb back.
      drift = 0.9;
      vol = 3.0;
    } else {
      // Late-stage bull run — this is where the 20-day crosses above the 50-day.
      drift = 0.75;
      vol = 2.2;
    }
    p = Math.max(60, p + drift + gauss() * vol);
    prices.push(p);
  }

  const sma = (end: number, window: number): number | null => {
    if (end + 1 < window) return null;
    let sum = 0;
    for (let i = end - window + 1; i <= end; i++) sum += prices[i];
    return sum / window;
  };

  return prices.map((price, i) => ({
    day: i + 1,
    price,
    ma20: sma(i, 20),
    ma50: sma(i, 50),
  }));
}

// Find the first index (in the second half) where MA20 crosses above MA50.
function findGoldenCross(data: Row[]): number | null {
  const half = Math.floor(data.length / 2);
  for (let i = Math.max(half, 51); i < data.length; i++) {
    const prev = data[i - 1];
    const cur = data[i];
    if (
      prev.ma20 != null &&
      prev.ma50 != null &&
      cur.ma20 != null &&
      cur.ma50 != null &&
      prev.ma20 <= prev.ma50 &&
      cur.ma20 > cur.ma50
    ) {
      return i;
    }
  }
  return null;
}

interface Props {
  width: number;
  height: number;
}

const COLOR_PRICE = "var(--color-ink)";
const COLOR_MA20 = "#4a6a68";
const COLOR_MA50 = "#a55a4a";

export function MovingAverageChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateSeries(), []);
  const crossIdx = useMemo(() => findGoldenCross(data), [data]);

  const allPrices = data.map((d) => d.price);
  const yMin = Math.floor(Math.min(...allPrices) / 10) * 10 - 10;
  const yMax = Math.ceil(Math.max(...allPrices) / 10) * 10 + 10;

  const xScale = scaleLinear({ domain: [1, data.length], range: [0, iw] });
  const yScale = scaleLinear({ domain: [yMin, yMax], range: [ih, 0], nice: true });
  const ticksY = yScale.ticks(5);

  // Filter out the null lag period for the MA paths.
  const ma20Data = data.filter((d) => d.ma20 != null) as Array<Row & { ma20: number }>;
  const ma50Data = data.filter((d) => d.ma50 != null) as Array<Row & { ma50: number }>;

  // Lag-artefact band: the first 49 days where MA50 is undefined.
  const lagEndDay = 50;
  const lagBandX = xScale(lagEndDay);

  // Anchor targets.
  const midDay = Math.floor(data.length / 2);
  const priceSampleDay = 30;
  const ma20SampleIdx = Math.floor(data.length * 0.75);
  const ma50SampleIdx = Math.floor(data.length * 0.6);
  const priceSample = data[priceSampleDay - 1];
  const ma20Sample = data[ma20SampleIdx];
  const ma50Sample = data[ma50SampleIdx];
  const crossSample = crossIdx != null ? data[crossIdx] : data[data.length - 20];

  // Clamp helper — keeps anchor rects inside the plot area.
  function clamp(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const rw = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const rh = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: rw, height: rh };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Moving average chart">
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

        {/* Lag-artefact band — before day 50 the MA50 has no value. */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={lagBandX}
            height={ih}
            fill="var(--color-ink)"
            opacity={0.04}
          />
          <line
            x1={lagBandX}
            x2={lagBandX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeDasharray="1 3"
            strokeWidth={1}
          />
        </g>

        {/* Raw price line */}
        <g data-data-layer="true">
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.price)}
            stroke={COLOR_PRICE}
            strokeWidth={1}
            strokeOpacity={0.55}
          />
        </g>

        {/* MA-50 (slower / smoother) — drawn first so MA-20 sits on top at cross. */}
        <g data-data-layer="true">
          <LinePath
            data={ma50Data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.ma50)}
            stroke={COLOR_MA50}
            strokeWidth={2}
          />
        </g>

        {/* MA-20 (faster) */}
        <g data-data-layer="true">
          <LinePath
            data={ma20Data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.ma20)}
            stroke={COLOR_MA20}
            strokeWidth={2}
          />
        </g>

        {/* Golden-cross marker ring */}
        {crossIdx != null && crossSample.ma20 != null && crossSample.ma50 != null && (
          <g data-data-layer="true">
            <circle
              cx={xScale(crossSample.day)}
              cy={yScale((crossSample.ma20 + crossSample.ma50) / 2)}
              r={8}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              strokeDasharray="2 2"
            />
          </g>
        )}

        {/* Legend */}
        <g transform={`translate(0, -18)`} data-data-layer="true">
          <line x1={0} x2={14} y1={4} y2={4} stroke={COLOR_PRICE} strokeOpacity={0.55} strokeWidth={1} />
          <text x={18} y={7} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            PRICE
          </text>
          <line x1={64} x2={78} y1={4} y2={4} stroke={COLOR_MA20} strokeWidth={2} />
          <text x={82} y={7} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            MA-20
          </text>
          <line x1={128} x2={142} y1={4} y2={4} stroke={COLOR_MA50} strokeWidth={2} />
          <text x={146} y={7} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            MA-50
          </text>
        </g>

        {/* 1. Raw price line — the noisy series the MAs are meant to mute. */}
        <ExplainAnchor
          selector="price-line"
          index={1}
          pin={{ x: xScale(priceSample.day) + 12, y: yScale(priceSample.price) - 14 }}
          rect={clamp({
            x: xScale(priceSample.day) - 20,
            y: yScale(priceSample.price) - 10,
            width: 40,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. MA-20 — short-window filter, reacts fast. */}
        <ExplainAnchor
          selector="ma-20"
          index={2}
          pin={{ x: xScale(ma20Sample.day), y: yScale(ma20Sample.ma20!) - 14 }}
          rect={clamp({
            x: xScale(ma20Sample.day) - 18,
            y: yScale(ma20Sample.ma20!) - 6,
            width: 36,
            height: 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. MA-50 — long-window filter, lags more but smoother. */}
        <ExplainAnchor
          selector="ma-50"
          index={3}
          pin={{ x: xScale(ma50Sample.day), y: yScale(ma50Sample.ma50!) + 18 }}
          rect={clamp({
            x: xScale(ma50Sample.day) - 18,
            y: yScale(ma50Sample.ma50!) - 6,
            width: 36,
            height: 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Golden cross — the moment MA-20 crosses above MA-50. */}
        <ExplainAnchor
          selector="golden-cross"
          index={4}
          pin={{
            x: xScale(crossSample.day) + 18,
            y: yScale((crossSample.ma20 ?? crossSample.price) + 0) - 22,
          }}
          rect={clamp({
            x: xScale(crossSample.day) - 14,
            y: yScale((crossSample.ma20 ?? crossSample.ma50 ?? crossSample.price) + 0) - 14,
            width: 28,
            height: 28,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Lag artefact — the first 49 days where MA-50 doesn't exist yet. */}
        <ExplainAnchor
          selector="lag-artefact"
          index={5}
          pin={{ x: lagBandX / 2, y: 14 }}
          rect={clamp({
            x: 0,
            y: 0,
            width: lagBandX,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: xScale(midDay), y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `D${v}`}
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

        {/* 7. Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
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
      </Group>
    </svg>
  );
}
