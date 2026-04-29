"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 10 calibration bins: bin_mean_prediction vs bin_observed_rate.
// Shows a slightly over-confident model — dots sag below the diagonal at
// high predicted probabilities. Values are deterministic constants.
const BINS: ReadonlyArray<{ pred: number; obs: number; count: number }> = [
  { pred: 0.05, obs: 0.06, count: 210 },
  { pred: 0.15, obs: 0.14, count: 185 },
  { pred: 0.25, obs: 0.24, count: 162 },
  { pred: 0.35, obs: 0.34, count: 140 },
  { pred: 0.45, obs: 0.43, count: 118 },
  { pred: 0.55, obs: 0.52, count: 95 },
  { pred: 0.65, obs: 0.60, count: 74 },
  { pred: 0.75, obs: 0.67, count: 58 },
  { pred: 0.85, obs: 0.74, count: 38 },
  { pred: 0.95, obs: 0.82, count: 20 },
];

const MAX_COUNT = 210;

interface Props {
  width: number;
  height: number;
}

export function CalibrationPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  // Rug histogram bar height — scale count to max 14px visually
  const rugMaxH = 14;

  // Anchor positions computed from stable data
  const midBin = BINS[4]; // bin at 0.45 predicted — near middle
  const highBin = BINS[8]; // bin at 0.85 — shows over-confidence clearly

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x0 = Math.max(0, r.x);
    const y0 = Math.max(0, r.y);
    const x1 = Math.min(iw, r.x + r.width);
    const y1 = Math.min(ih, r.y + r.height);
    return { x: x0, y: y0, width: Math.max(0, x1 - x0), height: Math.max(0, y1 - y0) };
  };

  const rugY = ih + 4;

  return (
    <svg width={width} height={height} role="img" aria-label="Calibration plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* 45° diagonal — perfect calibration */}
        <ExplainAnchor
          selector="diagonal"
          index={1}
          pin={{ x: xScale(0.25), y: yScale(0.25) - 14 }}
          rect={clamp({
            x: xScale(0.1),
            y: yScale(0.9),
            width: xScale(0.8) - xScale(0.1),
            height: yScale(0.1) - yScale(0.9),
          })}
        >
          <g data-data-layer="true">
            <line
              x1={xScale(0)}
              y1={yScale(0)}
              x2={xScale(1)}
              y2={yScale(1)}
              stroke="var(--color-ink-mute)"
              strokeWidth={1.2}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Calibration curve — line connecting the binned dots */}
        <ExplainAnchor
          selector="calibration-curve"
          index={2}
          pin={{ x: xScale(0.55), y: yScale(0.48) + 16 }}
          rect={clamp({
            x: xScale(0.3),
            y: yScale(0.65),
            width: xScale(0.8) - xScale(0.3),
            height: yScale(0.25) - yScale(0.65),
          })}
        >
          <g data-data-layer="true">
            <LinePath
              data={BINS as { pred: number; obs: number; count: number }[]}
              x={(d) => xScale(d.pred)}
              y={(d) => yScale(d.obs)}
              stroke="var(--color-ink)"
              strokeWidth={1.6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </ExplainAnchor>

        {/* Binned dots */}
        <g data-data-layer="true">
          {BINS.map((b, i) => (
            <circle
              key={i}
              cx={xScale(b.pred)}
              cy={yScale(b.obs)}
              r={b === midBin || b === highBin ? 4 : 3}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Representative binned dot anchor — midBin */}
        <ExplainAnchor
          selector="binned-dot"
          index={3}
          pin={{ x: xScale(midBin.pred) + 14, y: yScale(midBin.obs) - 10 }}
          rect={clamp({
            x: xScale(midBin.pred) - 8,
            y: yScale(midBin.obs) - 8,
            width: 16,
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Over-confidence region — highBin shows the sag */}
        <g data-data-layer="true">
          {/* Vertical line showing the gap between prediction and observation */}
          <line
            x1={xScale(highBin.pred)}
            y1={yScale(highBin.pred)}
            x2={xScale(highBin.pred)}
            y2={yScale(highBin.obs)}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="1 2"
          />
        </g>
        <ExplainAnchor
          selector="over-confidence"
          index={4}
          pin={{ x: xScale(highBin.pred) + 14, y: (yScale(highBin.pred) + yScale(highBin.obs)) / 2 }}
          rect={clamp({
            x: xScale(highBin.pred) - 6,
            y: Math.min(yScale(highBin.pred), yScale(highBin.obs)) - 4,
            width: 12,
            height: Math.abs(yScale(highBin.pred) - yScale(highBin.obs)) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Bin-count rug along x-axis */}
        <ExplainAnchor
          selector="bin-count-rug"
          index={5}
          pin={{ x: xScale(0.85), y: rugY + rugMaxH + 4 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g data-data-layer="true">
            {BINS.map((b, i) => {
              const barH = (b.count / MAX_COUNT) * rugMaxH;
              return (
                <rect
                  key={i}
                  x={xScale(b.pred) - 3}
                  y={rugY + (rugMaxH - barH)}
                  width={6}
                  height={barH}
                  fill="var(--color-ink)"
                  opacity={0.35}
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
            PREDICTED PROBABILITY
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
          <text
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            OBSERVED FREQUENCY
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
