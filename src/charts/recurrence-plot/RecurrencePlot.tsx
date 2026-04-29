"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Recurrence Plot: R(i,j) = 1 if |x_i - x_j| < ε, else 0.
// N=150 points: first 75 = sinusoidal (periodic), next 75 = chaotic (LCG walk).
// ε chosen so ~10-15% of cells are recurrent.

const N = 150;
const HALF = 75;

// Seeded LCG for deterministic pseudo-random numbers (no Math.random() at render)
function lcg(seed: number): () => number {
  let s = seed;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0xffffffff;
  };
}

function buildTimeSeries(): ReadonlyArray<number> {
  const rng = lcg(42);
  const series: number[] = [];

  // Periodic half: sinusoidal signal (amplitude 1, period ~12 samples)
  for (let i = 0; i < HALF; i++) {
    series.push(Math.sin((2 * Math.PI * i) / 12));
  }

  // Chaotic half: LCG-driven random walk that looks chaotic
  let x = 0.0;
  for (let i = 0; i < HALF; i++) {
    x += (rng() - 0.5) * 1.8;
    // Keep it loosely bounded but not periodic
    if (x > 3) x = 3 - rng() * 0.5;
    if (x < -3) x = -3 + rng() * 0.5;
    series.push(x);
  }

  return series;
}

// Build N×N recurrence matrix
function buildMatrix(
  series: ReadonlyArray<number>,
  epsilon: number,
): ReadonlyArray<ReadonlyArray<boolean>> {
  const rows: boolean[][] = [];
  for (let i = 0; i < N; i++) {
    const row: boolean[] = [];
    for (let j = 0; j < N; j++) {
      row.push(Math.abs(series[i] - series[j]) < epsilon);
    }
    rows.push(row);
  }
  return rows;
}

// Choose ε to yield ~10-15% recurrence rate
function findEpsilon(series: ReadonlyArray<number>): number {
  // Estimate using a sorted sample of pairwise distances
  const sample: number[] = [];
  const step = Math.max(1, Math.floor(N / 20));
  for (let i = 0; i < N; i += step) {
    for (let j = i + 1; j < N; j += step) {
      sample.push(Math.abs(series[i] - series[j]));
    }
  }
  sample.sort((a, b) => a - b);
  // Target ~12% recurrence → pick the 12th percentile distance
  return sample[Math.floor(sample.length * 0.12)] ?? 0.3;
}

interface Props {
  width: number;
  height: number;
}

export function RecurrencePlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Side of each cell (square matrix, so same in both directions)
  const cellSize = iw > 0 && ih > 0 ? Math.min(iw, ih) / N : 2;
  // Actual plot square size
  const plotW = cellSize * N;
  const plotH = cellSize * N;

  const xScale = scaleLinear({ domain: [0, N], range: [0, plotW] });
  const yScale = scaleLinear({ domain: [0, N], range: [0, plotH] });

  const { matrix, epsilon } = useMemo(() => {
    const series = buildTimeSeries();
    const eps = findEpsilon(series);
    const mat = buildMatrix(series, eps);
    return { matrix: mat, epsilon: eps };
  }, []);

  // Pixel helpers
  const cx = (j: number) => j * cellSize;
  const cy = (i: number) => i * cellSize;

  // Annotation positions — clamped to plot
  const halfPx = HALF * cellSize;
  const epsilonLabelX = Math.min(plotW - 4, plotW * 0.72);
  const epsilonLabelY = Math.max(12, plotH * 0.88);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Recurrence plot of a mixed periodic–chaotic time series"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Background for the plot area */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={plotW}
            height={plotH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
        </g>

        {/* Recurrent cells — render all recurrent (i,j) pairs */}
        <ExplainAnchor
          selector="recurrent-cell"
          index={1}
          pin={{ x: Math.max(10, Math.min(plotW - 10, halfPx * 0.3 + 10)), y: Math.max(10, halfPx * 0.3 - 14) }}
          rect={{ x: 0, y: 0, width: plotW, height: plotH }}
        >
          <g data-data-layer="true">
            {matrix.map((row, i) =>
              row.map((isRecurrent, j) => {
                if (!isRecurrent) return null;
                return (
                  <rect
                    key={`${i}-${j}`}
                    x={cx(j)}
                    y={cy(i)}
                    width={Math.max(1, cellSize)}
                    height={Math.max(1, cellSize)}
                    fill="var(--color-ink)"
                    fillOpacity={0.82}
                  />
                );
              }),
            )}
          </g>
        </ExplainAnchor>

        {/* Main diagonal — i = j, always recurrent */}
        <ExplainAnchor
          selector="main-diagonal"
          index={2}
          pin={{ x: Math.max(10, plotW * 0.35 + 10), y: Math.max(10, plotH * 0.35 - 14) }}
          rect={{ x: 0, y: 0, width: plotW, height: plotH }}
        >
          <g data-data-layer="true">
            <line
              x1={0}
              y1={0}
              x2={plotW}
              y2={plotH}
              stroke="var(--color-ink)"
              strokeWidth={Math.max(1, cellSize)}
              strokeOpacity={0.9}
            />
          </g>
        </ExplainAnchor>

        {/* Periodic region — top-left quadrant (i < HALF, j < HALF) — framed */}
        <ExplainAnchor
          selector="periodic-texture"
          index={3}
          pin={{ x: Math.max(10, halfPx * 0.5 + 10), y: Math.max(10, halfPx * 0.5 - 18) }}
          rect={{ x: 0, y: 0, width: halfPx, height: halfPx }}
        >
          <g data-data-layer="true">
            <rect
              x={0}
              y={0}
              width={halfPx}
              height={halfPx}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={0.75}
              strokeDasharray="3 2"
              strokeOpacity={0.45}
            />
          </g>
        </ExplainAnchor>

        {/* Chaotic region — bottom-right quadrant (i >= HALF, j >= HALF) — framed */}
        <ExplainAnchor
          selector="chaotic-texture"
          index={4}
          pin={{ x: Math.max(10, Math.min(plotW - 10, halfPx + plotW * 0.25 + 10)), y: Math.max(10, halfPx + plotH * 0.25 - 18) }}
          rect={{ x: halfPx, y: halfPx, width: plotW - halfPx, height: plotH - halfPx }}
        >
          <g data-data-layer="true">
            <rect
              x={halfPx}
              y={halfPx}
              width={plotW - halfPx}
              height={plotH - halfPx}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={0.75}
              strokeDasharray="3 2"
              strokeOpacity={0.45}
            />
          </g>
        </ExplainAnchor>

        {/* Regime-change cross-blocks — off-diagonal emptiness annotation */}
        <ExplainAnchor
          selector="regime-change"
          index={5}
          pin={{ x: Math.max(10, Math.min(plotW - 10, halfPx + 10)), y: Math.max(10, halfPx * 0.5 - 14) }}
          rect={{
            x: halfPx,
            y: 0,
            width: Math.max(1, plotW - halfPx),
            height: halfPx,
          }}
        >
          <g data-data-layer="true">
            {/* Regime boundary lines */}
            <line
              x1={halfPx}
              y1={0}
              x2={halfPx}
              y2={plotH}
              stroke="var(--color-ink)"
              strokeWidth={0.6}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
            />
            <line
              x1={0}
              y1={halfPx}
              x2={plotW}
              y2={halfPx}
              stroke="var(--color-ink)"
              strokeWidth={0.6}
              strokeDasharray="4 3"
              strokeOpacity={0.5}
            />
            <text
              x={halfPx + 4}
              y={halfPx / 2}
              fontFamily="var(--font-mono)"
              fontSize={7}
              fill="var(--color-ink-mute)"
            >
              regime
            </text>
            <text
              x={halfPx + 4}
              y={halfPx / 2 + 9}
              fontFamily="var(--font-mono)"
              fontSize={7}
              fill="var(--color-ink-mute)"
            >
              boundary
            </text>
          </g>
        </ExplainAnchor>

        {/* Epsilon annotation */}
        <ExplainAnchor
          selector="epsilon"
          index={6}
          pin={{ x: Math.max(10, Math.min(plotW - 10, epsilonLabelX + 40)), y: Math.max(10, Math.min(plotH - 10, epsilonLabelY - 10)) }}
          rect={{
            x: Math.max(0, epsilonLabelX - 4),
            y: Math.max(0, epsilonLabelY - 10),
            width: Math.min(plotW - Math.max(0, epsilonLabelX - 4), 80),
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <text
              x={epsilonLabelX}
              y={epsilonLabelY}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {`ε ≈ ${epsilon.toFixed(2)}`}
            </text>
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: plotW / 2, y: plotH + 34 }}
          rect={{ x: 0, y: plotH, width: plotW, height: margin.bottom }}
        >
          <AxisBottom
            top={plotH}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${Math.round(Number(v))}`}
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
            x={plotW / 2}
            y={plotH + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            TIME INDEX j
          </text>
        </ExplainAnchor>

        {/* Y-axis — rendered without anchor pin (anchor budget exhausted at 7) */}
        <AxisLeft
          scale={yScale}
          numTicks={6}
          tickFormat={(v) => `${Math.round(Number(v))}`}
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
          x={-44}
          y={-8}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          TIME INDEX i
        </text>
      </Group>
    </svg>
  );
}
