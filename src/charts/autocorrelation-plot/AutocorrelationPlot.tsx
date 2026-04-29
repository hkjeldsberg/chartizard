"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Generate AR(1) series with coefficient phi=0.7 using a seeded LCG.
// Returns autocorrelations at lags 0..maxLag (r_k = phi^k for pure AR(1)).
function computeACF(maxLag: number): { lag: number; r: number }[] {
  const phi = 0.7;
  const result: { lag: number; r: number }[] = [];
  for (let k = 0; k <= maxLag; k++) {
    result.push({ lag: k, r: Math.pow(phi, k) });
  }
  return result;
}

interface Props {
  width: number;
  height: number;
}

const MAX_LAG = 24;
const N = 100; // notional sample size for confidence band
const CONF_BAND = 1.96 / Math.sqrt(N); // ±0.196

export function AutocorrelationPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => computeACF(MAX_LAG), []);

  // x: band scale over lags 0..MAX_LAG
  const lags = data.map((d) => String(d.lag));
  const xScale = scaleBand<string>({
    domain: lags,
    range: [0, iw],
    padding: 0.3,
  });

  // y: correlation −1..+1 with some headroom
  const yScale = scaleLinear<number>({
    domain: [-0.3, 1.1],
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  const zeroY = yScale(0);
  const confPosY = yScale(CONF_BAND);
  const confNegY = yScale(-CONF_BAND);

  // Representative stem at lag 5 (decay mid-range, r ≈ 0.168)
  const lag5 = data[5];
  const lag5X = (xScale(String(lag5.lag)) ?? 0) + bw / 2;
  const lag5Y = yScale(lag5.r);

  // Lag 0 stem (always = 1)
  const lag0 = data[0];
  const lag0X = (xScale(String(lag0.lag)) ?? 0) + bw / 2;
  const lag0Y = yScale(lag0.r);

  // X-axis tick anchor (mid-point lag)
  const midLagX = (xScale(String(Math.floor(MAX_LAG / 2))) ?? 0) + bw / 2;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Autocorrelation Plot (ACF) — AR(1) process with coefficient 0.7"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines and data marks */}
        <g data-data-layer="true">
          {/* Zero baseline */}
          <line
            x1={0}
            x2={iw}
            y1={zeroY}
            y2={zeroY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />

          {/* Stems: vertical lines from zero to r_k */}
          {data.map((d) => {
            const x = (xScale(String(d.lag)) ?? 0) + bw / 2;
            const y = yScale(d.r);
            return (
              <line
                key={d.lag}
                x1={x}
                x2={x}
                y1={zeroY}
                y2={y}
                stroke="var(--color-ink)"
                strokeWidth={d.lag === 0 ? 2 : 1.2}
              />
            );
          })}

          {/* Heads: circles at r_k values */}
          {data.map((d) => {
            const x = (xScale(String(d.lag)) ?? 0) + bw / 2;
            const y = yScale(d.r);
            return (
              <circle
                key={d.lag}
                cx={x}
                cy={y}
                r={d.lag === 0 ? 3.5 : 2.5}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Anchor 1: x-axis (lag) */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: midLagX, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={["0", "4", "8", "12", "16", "20", "24"]}
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
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LAG k
          </text>
        </ExplainAnchor>

        {/* Anchor 2: y-axis (correlation) */}
        <ExplainAnchor
          selector="y-axis"
          index={2}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            tickValues={[-0.2, 0, 0.2, 0.4, 0.6, 0.8, 1.0]}
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

        {/* Anchor 3: representative stem (lag 1, r ≈ 0.7) */}
        {(() => {
          const lag1 = data[1];
          const lag1X = (xScale(String(lag1.lag)) ?? 0) + bw / 2;
          const lag1Y = yScale(lag1.r);
          return (
            <ExplainAnchor
              selector="stem"
              index={3}
              pin={{ x: lag1X + 12, y: (zeroY + lag1Y) / 2 }}
              rect={{
                x: Math.max(0, lag1X - 6),
                y: Math.max(0, lag1Y - 4),
                width: Math.min(12, iw - Math.max(0, lag1X - 6)),
                height: Math.max(0, zeroY - lag1Y + 4),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 4: confidence band */}
        <ExplainAnchor
          selector="confidence-band"
          index={4}
          pin={{ x: iw - 8, y: confPosY - 8 }}
          rect={{
            x: 0,
            y: Math.min(confPosY, confNegY) - 2,
            width: iw,
            height: Math.abs(confNegY - confPosY) + 4,
          }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: confPosY }}
              to={{ x: iw, y: confPosY }}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <Line
              from={{ x: 0, y: confNegY }}
              to={{ x: iw, y: confNegY }}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Anchor 5: lag-0 unit stem */}
        <ExplainAnchor
          selector="lag-zero"
          index={5}
          pin={{ x: lag0X + 12, y: lag0Y - 8 }}
          rect={{
            x: Math.max(0, lag0X - 6),
            y: Math.max(0, lag0Y - 4),
            width: Math.min(12, iw),
            height: Math.max(0, zeroY - lag0Y + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: decay pattern (lag 5, r ≈ 0.168) */}
        <ExplainAnchor
          selector="decay-pattern"
          index={6}
          pin={{ x: lag5X + 12, y: (zeroY + lag5Y) / 2 }}
          rect={{
            x: Math.max(0, lag5X - bw * 2),
            y: Math.max(0, lag5Y - 4),
            width: Math.min(bw * 5, iw - Math.max(0, lag5X - bw * 2)),
            height: Math.max(0, zeroY - lag5Y + 4),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
