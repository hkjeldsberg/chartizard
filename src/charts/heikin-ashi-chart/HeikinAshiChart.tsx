"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface RawCandle {
  day: number;
  label: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface HACandle extends RawCandle {
  haOpen: number;
  haClose: number;
  haHigh: number;
  haLow: number;
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

/**
 * Generate ~18 raw OHLC sessions via seeded LCG:
 * - Sessions 1–8: clear up-trend
 * - Sessions 9–18: reversal and down-trend
 *
 * Then apply the Heikin-Ashi smoothing formula:
 *   HA_Close = (O + H + L + C) / 4
 *   HA_Open  = (prev_HA_Open + prev_HA_Close) / 2  (seeded at (O+C)/2 for bar 1)
 *   HA_High  = max(H, HA_Open, HA_Close)
 *   HA_Low   = min(L, HA_Open, HA_Close)
 */
function generateHACandles(): HACandle[] {
  let seed = 17;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const N = 18;
  const raw: RawCandle[] = [];
  let prevClose = 120;

  for (let i = 0; i < N; i++) {
    // Phase: up-trend first 9 sessions, then down-trend
    const upPhase = i < 9;
    const drift = upPhase ? 1.4 : -1.3;
    const open = prevClose + (rand() - 0.5) * 0.5;
    const close = round2(open + drift + (rand() - 0.45) * 1.8);
    const bodyHi = Math.max(open, close);
    const bodyLo = Math.min(open, close);
    const bodySpan = Math.max(0.3, bodyHi - bodyLo);
    // Wicks: during clean trend, upper wick is small on up bars; lower wick small on down bars
    const wickUp = upPhase
      ? bodySpan * (0.05 + rand() * 0.2)   // small upper wick in uptrend
      : bodySpan * (0.3 + rand() * 0.8);   // larger upper wick in downtrend
    const wickDn = upPhase
      ? bodySpan * (0.3 + rand() * 0.8)
      : bodySpan * (0.05 + rand() * 0.2);  // small lower wick in downtrend
    const high = round2(bodyHi + wickUp);
    const low = round2(bodyLo - wickDn);
    raw.push({ day: i + 1, label: `D${i + 1}`, open: round2(open), high, low, close });
    prevClose = close;
  }

  // Apply Heikin-Ashi formula
  const ha: HACandle[] = [];
  let prevHAOpen = 0;
  let prevHAClose = 0;

  for (let i = 0; i < raw.length; i++) {
    const r = raw[i];
    const haClose = round2((r.open + r.high + r.low + r.close) / 4);
    const haOpen =
      i === 0
        ? round2((r.open + r.close) / 2)
        : round2((prevHAOpen + prevHAClose) / 2);
    const haHigh = round2(Math.max(r.high, haOpen, haClose));
    const haLow = round2(Math.min(r.low, haOpen, haClose));

    ha.push({
      ...r,
      haOpen,
      haClose,
      haHigh,
      haLow,
    });

    prevHAOpen = haOpen;
    prevHAClose = haClose;
  }

  return ha;
}

interface Props {
  width: number;
  height: number;
}

export function HeikinAshiChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateHACandles(), []);

  const xScale = scaleBand({
    domain: data.map((d) => d.label),
    range: [0, iw],
    padding: 0.2,
  });

  const allLows = data.map((d) => d.haLow);
  const allHighs = data.map((d) => d.haHigh);
  const yMin = Math.floor(Math.min(...allLows) - 1);
  const yMax = Math.ceil(Math.max(...allHighs) + 1);

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const bodyW = Math.max(2, bw * 0.7);
  const ticksY = yScale.ticks(5);

  const centreX = (d: HACandle) => (xScale(d.label) ?? 0) + bw / 2;
  const bodyLeft = (d: HACandle) => centreX(d) - bodyW / 2;

  // Identify representative bars for anchors
  // Up-bar in clean uptrend (sessions 3-6): long body, no lower wick
  const upSample = data[4]; // Day 5 — well into uptrend
  // Down-bar in clean downtrend (sessions 11-15): long body, no upper wick
  const downSample = data[13]; // Day 14 — well into downtrend
  // A bar with visible wick (near the reversal zone, session 9-10)
  const wickSample = data[9]; // Day 10 — transition zone

  // Find clean trend region (up): sessions 2-7 (index 1-6)
  const trendRegionStart = centreX(data[1]);
  const trendRegionEnd = centreX(data[6]);

  return (
    <svg width={width} height={height} role="img" aria-label="Heikin-Ashi Chart">
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

        {/* Heikin-Ashi candles */}
        <g data-data-layer="true">
          {data.map((d) => {
            const bullish = d.haClose >= d.haOpen;
            const bodyTop = yScale(Math.max(d.haOpen, d.haClose));
            const bodyBottom = yScale(Math.min(d.haOpen, d.haClose));
            const bodyH = Math.max(1, bodyBottom - bodyTop);
            const cx = centreX(d);

            return (
              <g key={`ha-${d.day}`}>
                {/* Upper wick */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={yScale(d.haHigh)}
                  y2={bodyTop}
                  stroke={bullish ? "var(--color-ink)" : "var(--color-ink-soft)"}
                  strokeWidth={1}
                />
                {/* Lower wick */}
                <line
                  x1={cx}
                  x2={cx}
                  y1={bodyBottom}
                  y2={yScale(d.haLow)}
                  stroke={bullish ? "var(--color-ink)" : "var(--color-ink-soft)"}
                  strokeWidth={1}
                />
                {/* Body — hollow for up, filled for down */}
                {bullish ? (
                  <rect
                    x={bodyLeft(d)}
                    y={bodyTop}
                    width={bodyW}
                    height={bodyH}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={1.4}
                  />
                ) : (
                  <rect
                    x={bodyLeft(d)}
                    y={bodyTop}
                    width={bodyW}
                    height={bodyH}
                    fill="var(--color-ink-soft)"
                    stroke="var(--color-ink-soft)"
                    strokeWidth={1}
                  />
                )}
              </g>
            );
          })}
        </g>

        {/* Legend */}
        <g transform="translate(0, -18)" data-data-layer="true">
          <rect x={0} y={0} width={10} height={10} fill="none" stroke="var(--color-ink)" strokeWidth={1.4} />
          <text
            x={14}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            HA UP (HOLLOW)
          </text>
          <rect x={130} y={0} width={10} height={10} fill="var(--color-ink-soft)" />
          <text
            x={144}
            y={9}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            HA DOWN (FILLED)
          </text>
        </g>

        {/* Anchor 1: HA up-bar (long body, no lower wick) */}
        {(() => {
          const d = upSample;
          const bodyTop = yScale(Math.max(d.haOpen, d.haClose));
          return (
            <ExplainAnchor
              selector="ha-up-bar"
              index={1}
              pin={{ x: centreX(d) + bodyW + 8, y: bodyTop - 4 }}
              rect={{
                x: Math.max(0, bodyLeft(d) - 2),
                y: Math.max(0, yScale(d.haHigh) - 2),
                width: bodyW + 4,
                height: Math.min(yScale(d.haLow) - yScale(d.haHigh) + 4, ih),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 2: HA down-bar */}
        {(() => {
          const d = downSample;
          const bodyTop = yScale(Math.max(d.haOpen, d.haClose));
          const bodyBottom = yScale(Math.min(d.haOpen, d.haClose));
          return (
            <ExplainAnchor
              selector="ha-down-bar"
              index={2}
              pin={{ x: centreX(d) + bodyW + 8, y: (bodyTop + bodyBottom) / 2 }}
              rect={{
                x: Math.max(0, bodyLeft(d) - 2),
                y: Math.max(0, yScale(d.haHigh) - 2),
                width: bodyW + 4,
                height: Math.min(yScale(d.haLow) - yScale(d.haHigh) + 4, ih),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 3: wick segment (transition zone bar) */}
        {(() => {
          const d = wickSample;
          return (
            <ExplainAnchor
              selector="wick-segment"
              index={3}
              pin={{ x: centreX(d) - bodyW - 10, y: yScale(d.haHigh) + 4 }}
              rect={{
                x: Math.max(0, centreX(d) - 4),
                y: Math.max(0, yScale(d.haHigh) - 2),
                width: 8,
                height: Math.min(yScale(d.haLow) - yScale(d.haHigh) + 4, ih),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 4: clean trend region */}
        <ExplainAnchor
          selector="trend-region"
          index={4}
          pin={{ x: (trendRegionStart + trendRegionEnd) / 2, y: -6 }}
          rect={{
            x: Math.max(0, trendRegionStart - bw / 2),
            y: 0,
            width: Math.min(trendRegionEnd - trendRegionStart + bw, iw),
            height: ih,
          }}
        >
          {/* Subtle shading for trend region */}
          <rect
            x={Math.max(0, trendRegionStart - bw / 2)}
            y={0}
            width={Math.min(trendRegionEnd - trendRegionStart + bw, iw)}
            height={ih}
            fill="var(--color-ink)"
            opacity={0.03}
          />
        </ExplainAnchor>

        {/* Anchor 5: smoothing formula (body length as diagnostic) */}
        {(() => {
          const d = upSample;
          const bodyTop = yScale(Math.max(d.haOpen, d.haClose));
          const bodyBottom = yScale(Math.min(d.haOpen, d.haClose));
          const midY = (bodyTop + bodyBottom) / 2;
          return (
            <ExplainAnchor
              selector="smoothing-formula"
              index={5}
              pin={{ x: iw - 4, y: midY }}
              rect={{
                x: Math.max(0, iw - margin.right - 4),
                y: 0,
                width: margin.right + 4,
                height: ih,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 6: x-axis */}
        <ExplainAnchor
          selector="time-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom - 4 }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v, i) => (i % 3 === 0 ? String(v) : "")}
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
          <text
            x={iw / 2}
            y={ih + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            SESSION
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
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
