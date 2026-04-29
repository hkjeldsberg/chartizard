"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Logistic map: x_{n+1} = r * x_n * (1 - x_n)
// For each r in [2.4, 4.0], iterate 1000 steps from x=0.5,
// discard the first 500 (transient), plot the remaining 500.
// Total scatter points: ~150,000.

const R_MIN = 2.4;
const R_MAX = 4.0;
const R_STEPS = 300;
const WARMUP = 500;
const KEEP = 500;
const X0 = 0.5;

// The first three bifurcation points of the logistic map
const BIFURCATION_POINTS: ReadonlyArray<{ r: number; label: string }> = [
  { r: 3.0, label: "r = 3.000" },
  { r: 3.4495, label: "r = 3.449" },
  { r: 3.5441, label: "r = 3.544" },
];

interface Props {
  width: number;
  height: number;
}

export function BifurcationDiagram({ width, height }: Props) {
  const margin = { top: 32, right: 20, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [R_MIN, R_MAX], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  // Compute the scatter data deterministically — no Math.random() at render
  const points = useMemo(() => {
    const pts: Array<{ r: number; x: number }> = [];
    for (let ri = 0; ri < R_STEPS; ri++) {
      const r = R_MIN + (ri / (R_STEPS - 1)) * (R_MAX - R_MIN);
      let x = X0;
      // Warmup (transient)
      for (let i = 0; i < WARMUP; i++) {
        x = r * x * (1 - x);
      }
      // Collect long-term behaviour
      for (let i = 0; i < KEEP; i++) {
        x = r * x * (1 - x);
        pts.push({ r, x });
      }
    }
    return pts;
  }, []);

  // Pixel positions for bifurcation vertical lines
  const bifPx = BIFURCATION_POINTS.map(({ r, label }) => ({
    xPx: xScale(r),
    label,
    r,
  }));

  // Pin positions for anchors — computed from scale, clamped to plot
  const period1X = xScale(2.7);
  const period1Y = yScale(0.63);
  const chaosX = xScale(3.63);
  const windowX = xScale(3.83);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Bifurcation diagram of the logistic map"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Scatter dots — 150 k points at 2% opacity */}
        <ExplainAnchor
          selector="scatter-cloud"
          index={1}
          pin={{ x: Math.max(10, Math.min(iw - 10, period1X + 20)), y: Math.max(10, period1Y - 20) }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {points.map((pt, i) => (
              <circle
                key={i}
                cx={xScale(pt.r)}
                cy={yScale(pt.x)}
                r={0.5}
                fill="var(--color-ink)"
                fillOpacity={0.025}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Bifurcation vertical lines with labels */}
        <ExplainAnchor
          selector="bifurcation-lines"
          index={2}
          pin={{ x: Math.max(10, Math.min(iw - 10, bifPx[0].xPx + 6)), y: -18 }}
          rect={{
            x: bifPx[0].xPx - 2,
            y: 0,
            width: bifPx[bifPx.length - 1].xPx - bifPx[0].xPx + 4,
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {bifPx.map(({ xPx, label }, i) => (
              <g key={i}>
                <line
                  x1={xPx}
                  x2={xPx}
                  y1={0}
                  y2={ih}
                  stroke="var(--color-ink)"
                  strokeWidth={0.75}
                  strokeDasharray="3 3"
                  strokeOpacity={0.55}
                />
                <text
                  x={xPx}
                  y={-6}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-mute)"
                >
                  {label}
                </text>
              </g>
            ))}
          </g>
        </ExplainAnchor>

        {/* Period-1 region anchor (r < 3 — single fixed line) */}
        <ExplainAnchor
          selector="period-1"
          index={3}
          pin={{ x: Math.max(10, period1X - 10), y: Math.max(10, period1Y - 20) }}
          rect={{
            x: 0,
            y: yScale(0.9),
            width: Math.max(1, bifPx[0].xPx),
            height: yScale(0.2) - yScale(0.9),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Onset of chaos anchor (r ≈ 3.57) */}
        <ExplainAnchor
          selector="chaos-onset"
          index={4}
          pin={{ x: Math.max(10, Math.min(iw - 10, chaosX + 10)), y: Math.max(10, yScale(0.9) - 14) }}
          rect={{
            x: Math.max(0, xScale(3.55)),
            y: 0,
            width: Math.max(1, xScale(3.65) - xScale(3.55)),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <text
              x={Math.max(0, xScale(3.5699))}
              y={-6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              r ≈ 3.5699
            </text>
            <line
              x1={Math.max(0, xScale(3.5699))}
              x2={Math.max(0, xScale(3.5699))}
              y1={0}
              y2={ih}
              stroke="var(--color-ink)"
              strokeWidth={0.75}
              strokeDasharray="4 2"
              strokeOpacity={0.4}
            />
          </g>
        </ExplainAnchor>

        {/* Period-3 window anchor (r ≈ 3.83) */}
        <ExplainAnchor
          selector="period-3-window"
          index={5}
          pin={{ x: Math.max(10, Math.min(iw - 10, windowX + 8)), y: Math.max(10, yScale(0.15) - 14) }}
          rect={{
            x: Math.max(0, xScale(3.82)),
            y: 0,
            width: Math.max(1, xScale(3.86) - xScale(3.82)),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            <text
              x={Math.max(0, windowX)}
              y={-6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              r ≈ 3.83
            </text>
          </g>
        </ExplainAnchor>

        {/* Feigenbaum constant annotation */}
        <ExplainAnchor
          selector="feigenbaum"
          index={6}
          pin={{ x: Math.max(10, xScale(3.2)), y: Math.max(10, yScale(0.05)) }}
          rect={{ x: 0, y: Math.max(0, ih - 24), width: iw, height: 24 }}
        >
          <g data-data-layer="true">
            <text
              x={xScale(3.2)}
              y={ih - 6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              δ ≈ 4.6692 (Feigenbaum)
            </text>
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={7}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={8}
            tickFormat={(v) => `${Number(v).toFixed(1)}`}
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
            PARAMETER r
          </text>
        </ExplainAnchor>

        {/* Y-axis — rendered without anchor pin (anchor budget exhausted at 7) */}
        <AxisLeft
          scale={yScale}
          numTicks={5}
          tickFormat={(v) => `${Number(v).toFixed(1)}`}
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
          x (long-term)
        </text>
      </Group>
    </svg>
  );
}
