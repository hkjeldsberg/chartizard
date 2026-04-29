"use client";

import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Double-reciprocal (Lineweaver-Burk) data.
// Derived from Michaelis-Menten: v = Vmax·[S] / (Km + [S])
// with Vmax = 5.0 µmol/min and Km = 0.1 mM.
// x = 1/[S] (mM⁻¹), y = 1/v (min/µmol)
const DATA: ReadonlyArray<{ invS: number; invV: number }> = [
  { invS: 50, invV: 1.2 },
  { invS: 20, invV: 0.6 },
  { invS: 10, invV: 0.4 },
  { invS: 5, invV: 0.3 },
  { invS: 2, invV: 0.24 },
  { invS: 1, invV: 0.22 },
  { invS: 0.5, invV: 0.21 },
];

// The visible x-domain is capped at 20 mM⁻¹ so the interesting region
// fills the plot. The fit line extends left to x = -10 (the x-intercept
// = -1/Km) so we render from xMin = -12.
const X_MIN = -12;
const X_MAX = 20;

// Fit line: 1/v = (Km/Vmax)·(1/[S]) + 1/Vmax
// Slope = Km/Vmax = 0.1/5.0 = 0.02
// y-intercept = 1/Vmax = 1/5.0 = 0.20
// x-intercept = -1/Km = -1/0.1 = -10
const SLOPE = 0.02;
const Y_INTERCEPT = 0.2;
const X_INTERCEPT = -10; // -1/Km

function fitY(x: number) {
  return SLOPE * x + Y_INTERCEPT;
}

interface Props {
  width: number;
  height: number;
}

export function LineweaverBurkPlot({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [X_MIN, X_MAX], range: [0, iw] });
  // y runs from just below 0 to slightly above 1.2 to show the y-intercept
  // comfortably and not clip the highest data point.
  const yScale = scaleLinear({ domain: [-0.05, 1.3], range: [ih, 0] });

  const yAxisX = xScale(0);          // SVG x-position of the y-axis (x = 0)
  const xAxisY = yScale(0);          // SVG y-position of the x-axis (y = 0)
  const xInterceptSvgX = xScale(X_INTERCEPT);
  const yInterceptSvgY = yScale(Y_INTERCEPT);

  // Fit line endpoints covering the full visible domain.
  const fitFrom = { x: xScale(X_MIN), y: yScale(fitY(X_MIN)) };
  const fitTo   = { x: xScale(X_MAX), y: yScale(fitY(X_MAX)) };

  // Slope annotation: midpoint along the fit line, between x = 2 and x = 12
  const slopeMidX = xScale(7);
  const slopeMidY = yScale(fitY(7));

  const ticksY = yScale.ticks(6);

  return (
    <svg width={width} height={height} role="img" aria-label="Lineweaver-Burk plot">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* ── 1. Y-axis ── */}
        <ExplainAnchor
          selector="y-axis"
          index={1}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={6}
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
            x={-margin.left + 2}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            1/v (min/µmol)
          </text>
        </ExplainAnchor>

        {/* ── 2. X-axis ── */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 32 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={8}
            tickFormat={(v) => String(v)}
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            1/[S] (mM⁻¹)
          </text>
        </ExplainAnchor>

        {/* ── 3. Fit line ── */}
        <ExplainAnchor
          selector="fit-line"
          index={3}
          pin={{ x: fitTo.x - 16, y: fitTo.y - 14 }}
          rect={{
            x: Math.max(0, xScale(2)),
            y: Math.max(0, yScale(fitY(X_MAX))),
            width: Math.max(0, xScale(X_MAX) - xScale(2)),
            height: Math.max(0, yScale(fitY(2)) - yScale(fitY(X_MAX))),
          }}
        >
          <g data-data-layer="true">
            <Line
              from={fitFrom}
              to={fitTo}
              stroke="var(--color-ink)"
              strokeWidth={1.6}
              strokeLinecap="round"
            />
          </g>
        </ExplainAnchor>

        {/* ── 4. Slope annotation ── */}
        <ExplainAnchor
          selector="slope-annotation"
          index={4}
          pin={{ x: slopeMidX + 14, y: slopeMidY - 14 }}
          rect={{
            x: Math.max(0, xScale(2)),
            y: Math.max(0, yScale(0.5)),
            width: Math.min(iw, xScale(14) - xScale(2)),
            height: Math.max(0, yScale(0.1) - yScale(0.5)),
          }}
        >
          <g data-data-layer="true">
            <text
              x={slopeMidX + 6}
              y={slopeMidY - 4}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              slope = Km/Vmax = 0.02
            </text>
          </g>
        </ExplainAnchor>

        {/* ── 5. x-intercept = −1/Km ── */}
        <ExplainAnchor
          selector="x-intercept"
          index={5}
          pin={{ x: xInterceptSvgX - 8, y: xAxisY - 18 }}
          rect={{
            x: Math.max(0, xInterceptSvgX - 12),
            y: Math.max(0, xAxisY - 12),
            width: 24,
            height: Math.min(ih, 24),
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={xInterceptSvgX}
              cy={xAxisY}
              r={3}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <text
              x={xInterceptSvgX}
              y={xAxisY + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
            >
              −1/Km
            </text>
          </g>
        </ExplainAnchor>

        {/* ── 6. y-intercept = 1/Vmax ── */}
        <ExplainAnchor
          selector="y-intercept"
          index={6}
          pin={{ x: yAxisX + 14, y: yInterceptSvgY - 12 }}
          rect={{
            x: Math.max(0, yAxisX - 10),
            y: Math.max(0, yInterceptSvgY - 10),
            width: Math.min(iw, 30),
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={yAxisX}
              cy={yInterceptSvgY}
              r={3}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <text
              x={yAxisX + 8}
              y={yInterceptSvgY + 4}
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
            >
              1/Vmax
            </text>
          </g>
        </ExplainAnchor>

        {/* Data points — drawn last so they sit above the fit line.
            Points with 1/[S] > X_MAX are off-canvas and filtered out. */}
        <g data-data-layer="true">
          {DATA.filter((d) => d.invS <= X_MAX).map((d, i) => (
            <circle
              key={i}
              cx={xScale(d.invS)}
              cy={yScale(d.invV)}
              r={3.5}
              fill="var(--color-ink)"
            />
          ))}
        </g>
      </Group>
    </svg>
  );
}
