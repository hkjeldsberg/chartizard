"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX, line as d3Line, area as d3Area } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

/**
 * Lorenz curve of US household income (illustrative — Gini ≈ 0.41, US
 * Census Bureau ballpark for the 2010s–2020s). The x-axis is the
 * cumulative share of the population, ordered from poorest to richest;
 * the y-axis is the cumulative share of income those people capture.
 *
 * Perfect equality would trace the diagonal (0,0)→(1,1). The sag below
 * the diagonal IS the inequality; the area between curve and diagonal,
 * doubled, is the Gini coefficient.
 */
const DATA: ReadonlyArray<{ p: number; L: number }> = [
  { p: 0.0, L: 0.0 },
  { p: 0.1, L: 0.018 },
  { p: 0.2, L: 0.048 },
  { p: 0.3, L: 0.088 },
  { p: 0.4, L: 0.142 },
  { p: 0.5, L: 0.212 },
  { p: 0.6, L: 0.302 },
  { p: 0.7, L: 0.416 },
  { p: 0.8, L: 0.56 },
  { p: 0.9, L: 0.74 },
  { p: 1.0, L: 1.0 },
];

interface Props {
  width: number;
  height: number;
}

export function LorenzChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  // Clamp helper so anchor rects never extend past the plot area.
  const clamp = (
    rx: number,
    ry: number,
    rw: number,
    rh: number,
  ): { x: number; y: number; width: number; height: number } => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return {
      x: x0,
      y: y0,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
    };
  };

  // Curve path (cumulative income share)
  const curvePath =
    d3Line<{ p: number; L: number }>()
      .x((d) => xScale(d.p))
      .y((d) => yScale(d.L))
      .curve(curveMonotoneX)(DATA as { p: number; L: number }[]) ?? "";

  // Gini area: between the diagonal (upper) and the Lorenz curve (lower).
  // d3-area with y0 = diagonal, y1 = curve produces the sag region.
  const giniAreaPath =
    d3Area<{ p: number; L: number }>()
      .x((d) => xScale(d.p))
      .y0((d) => yScale(d.p)) // diagonal: y = x
      .y1((d) => yScale(d.L)) // curve
      .curve(curveMonotoneX)(DATA as { p: number; L: number }[]) ?? "";

  // Pick a representative data point for the "bottom-50%" callout.
  // At p = 0.5, L ≈ 0.212 → the bottom 50% of earners capture ~21% of income.
  const bottomHalf = DATA.find((d) => d.p === 0.5) ?? DATA[5];
  const bhX = xScale(bottomHalf.p);
  const bhY = yScale(bottomHalf.L);

  return (
    <svg width={width} height={height} role="img" aria-label="Lorenz curve">
      <Group left={margin.left} top={margin.top}>
        {/* Plot frame + faint gridlines */}
        <g data-data-layer="true">
          {[0.25, 0.5, 0.75].map((t) => (
            <g key={t}>
              <line
                x1={0}
                x2={iw}
                y1={yScale(t)}
                y2={yScale(t)}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
              <line
                x1={xScale(t)}
                x2={xScale(t)}
                y1={0}
                y2={ih}
                stroke="var(--color-hairline)"
                strokeDasharray="2 3"
              />
            </g>
          ))}
        </g>

        {/* 1. Gini area — the shaded sag between curve and diagonal */}
        <ExplainAnchor
          selector="gini-area"
          index={1}
          pin={{ x: xScale(0.62), y: yScale(0.48) }}
          rect={clamp(
            xScale(0.35),
            yScale(0.55),
            xScale(0.85) - xScale(0.35),
            yScale(0.15) - yScale(0.55),
          )}
        >
          <path
            d={giniAreaPath}
            fill="var(--color-ink)"
            fillOpacity={0.14}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 2. Equality line — the 45° diagonal */}
        <ExplainAnchor
          selector="equality-line"
          index={2}
          pin={{ x: xScale(0.22), y: yScale(0.32) }}
          rect={clamp(xScale(0.08), yScale(0.28), xScale(0.28) - xScale(0.08), 14)}
        >
          <line
            x1={xScale(0)}
            y1={yScale(0)}
            x2={xScale(1)}
            y2={yScale(1)}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 3. Lorenz curve itself */}
        <ExplainAnchor
          selector="lorenz-curve"
          index={3}
          pin={{ x: xScale(0.82), y: yScale(0.54) }}
          rect={clamp(
            xScale(0.68),
            yScale(0.76),
            xScale(0.96) - xScale(0.68),
            yScale(0.32) - yScale(0.76),
          )}
        >
          <path
            d={curvePath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 4. Bottom-50% callout — the single-point reading */}
        <ExplainAnchor
          selector="bottom-half-point"
          index={4}
          pin={{ x: bhX - 16, y: bhY + 18 }}
          rect={clamp(bhX - 10, bhY - 10, 20, 20)}
        >
          <circle
            cx={bhX}
            cy={bhY}
            r={3.5}
            fill="var(--color-ink)"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 5. Top corner (1,1) — where any Lorenz curve must close */}
        <ExplainAnchor
          selector="corner"
          index={5}
          pin={{ x: xScale(1) - 14, y: yScale(1) + 14 }}
          rect={clamp(xScale(0.92), yScale(1), xScale(1) - xScale(0.92), 12)}
        >
          <circle
            cx={xScale(1)}
            cy={yScale(1)}
            r={2.5}
            fill="var(--color-ink)"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 6. Axes — both axes explained together via the x-axis anchor */}
        <ExplainAnchor
          selector="axes"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
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
            CUM. POPULATION
          </text>
        </ExplainAnchor>

        {/* Y-axis rendered (unanchored — covered by the shared "axes" anchor) */}
        <g>
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            CUM. INCOME
          </text>
        </g>
      </Group>
    </svg>
  );
}
