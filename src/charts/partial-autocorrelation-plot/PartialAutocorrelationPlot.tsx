"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// For an AR(1) process with coefficient phi:
//   PACF(1) = phi
//   PACF(k) = 0 for k > 1 (by definition of partial autocorrelation)
// We add small seeded noise at lags > 1 to simulate finite-sample scatter.
function computePACF(maxLag: number): { lag: number; r: number }[] {
  const phi = 0.7;
  // Seeded LCG for deterministic finite-sample noise
  let seed = 137;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280 - 0.5; // centered in (-0.5, 0.5)
  };

  const result: { lag: number; r: number }[] = [];
  for (let k = 0; k <= maxLag; k++) {
    if (k === 0) {
      result.push({ lag: 0, r: 1 });
    } else if (k === 1) {
      result.push({ lag: 1, r: phi });
    } else {
      // Small residual noise, magnitude well within the confidence band (±0.196)
      result.push({ lag: k, r: rand() * 0.15 });
    }
  }
  return result;
}

interface Props {
  width: number;
  height: number;
}

const MAX_LAG = 24;
const N = 100;
const CONF_BAND = 1.96 / Math.sqrt(N); // ±0.196

export function PartialAutocorrelationPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => computePACF(MAX_LAG), []);

  const lags = data.map((d) => String(d.lag));
  const xScale = scaleBand<string>({
    domain: lags,
    range: [0, iw],
    padding: 0.3,
  });

  const yScale = scaleLinear<number>({
    domain: [-0.35, 1.1],
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  const zeroY = yScale(0);
  const confPosY = yScale(CONF_BAND);
  const confNegY = yScale(-CONF_BAND);

  // Lag-0 stem (always = 1)
  const lag0X = (xScale("0") ?? 0) + bw / 2;
  const lag0Y = yScale(1);

  // Lag-1 stem — the single significant spike
  const lag1X = (xScale("1") ?? 0) + bw / 2;
  const lag1Y = yScale(data[1].r);

  // X-axis tick anchor (mid-point lag)
  const midLagX = (xScale(String(Math.floor(MAX_LAG / 2))) ?? 0) + bw / 2;

  // Representative "inside-band" stem for the cut-off region: lag 8
  const cutOffLag = 8;
  const cutOffX = (xScale(String(cutOffLag)) ?? 0) + bw / 2;
  const cutOffY = yScale(data[cutOffLag].r);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Partial Autocorrelation Plot (PACF) — AR(1) process with coefficient 0.7"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Data marks */}
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

          {/* Stems */}
          {data.map((d) => {
            const x = (xScale(String(d.lag)) ?? 0) + bw / 2;
            const y = yScale(d.r);
            const isSignificant = d.lag === 0 || d.lag === 1;
            return (
              <line
                key={d.lag}
                x1={x}
                x2={x}
                y1={zeroY}
                y2={y}
                stroke={isSignificant ? "var(--color-ink)" : "var(--color-ink-mute)"}
                strokeWidth={d.lag === 0 ? 2 : isSignificant ? 1.8 : 1}
              />
            );
          })}

          {/* Heads */}
          {data.map((d) => {
            const x = (xScale(String(d.lag)) ?? 0) + bw / 2;
            const y = yScale(d.r);
            const isSignificant = d.lag === 0 || d.lag === 1;
            return (
              <circle
                key={d.lag}
                cx={x}
                cy={y}
                r={d.lag === 0 ? 3.5 : isSignificant ? 3 : 2}
                fill={isSignificant ? "var(--color-ink)" : "var(--color-ink-soft)"}
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

        {/* Anchor 2: y-axis (partial correlation) */}
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

        {/* Anchor 3: lag-1 significant stem */}
        <ExplainAnchor
          selector="significant-stem"
          index={3}
          pin={{ x: lag1X + 14, y: (zeroY + lag1Y) / 2 }}
          rect={{
            x: Math.max(0, lag1X - 6),
            y: Math.max(0, lag1Y - 4),
            width: Math.min(12, iw - Math.max(0, lag1X - 6)),
            height: Math.max(0, zeroY - lag1Y + 4),
          }}
        >
          <g />
        </ExplainAnchor>

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

        {/* Anchor 5: cut-off region (lags > 1 inside the band) */}
        <ExplainAnchor
          selector="cut-off-region"
          index={5}
          pin={{ x: cutOffX + 10, y: cutOffY - 12 }}
          rect={{
            x: Math.max(0, (xScale("2") ?? 0)),
            y: Math.max(0, confPosY - 4),
            width: Math.max(0, iw - (xScale("2") ?? 0)),
            height: Math.min(Math.abs(confNegY - confPosY) + 8, ih - Math.max(0, confPosY - 4)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: lag-0 unit stem */}
        <ExplainAnchor
          selector="lag-zero"
          index={6}
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
      </Group>
    </svg>
  );
}
