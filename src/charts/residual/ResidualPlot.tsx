"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  fitted: number;
  residual: number;
}

interface Props {
  width: number;
  height: number;
}

// Generate ~40 residuals that form a well-behaved cloud: mean zero, constant
// spread across fitted values, no trend, no funnel. Deterministic via a seeded
// LCG so SSR and client renders agree.
function generateResiduals(n: number): Point[] {
  let seed = 1337;
  const rand = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };
  // Box-Muller from two uniforms for an approximately Gaussian residual.
  const gauss = () => {
    const u = Math.max(1e-9, rand());
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
  const out: Point[] = [];
  for (let i = 0; i < n; i++) {
    const fitted = 2 + rand() * 18; // spread fitted values between 2 and 20
    const residual = gauss() * 1.4;
    out.push({ fitted, residual });
  }
  return out;
}

export function ResidualPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const points = useMemo(() => generateResiduals(40), []);

  const xScale = scaleLinear({ domain: [0, 22], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [-4, 4], range: [ih, 0], nice: true });

  const zeroY = yScale(0);

  // Representative point for the data-point anchor — pick one that's clearly in
  // the cloud and clearly off zero so the pin sits on a visible dot.
  const repIdx = useMemo(() => {
    // Prefer a point roughly in the middle of the fitted range with a nontrivial
    // residual. Points is deterministic so this index is stable.
    let best = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      const midDist = Math.abs(p.fitted - 11);
      const score = Math.abs(p.residual) - midDist * 0.3;
      if (score > bestScore) {
        bestScore = score;
        best = i;
      }
    }
    return best;
  }, [points]);

  const rep = points[repIdx];
  const repX = xScale(rep.fitted);
  const repY = yScale(rep.residual);

  return (
    <svg width={width} height={height} role="img" aria-label="Residual plot">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Residual cloud */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={i}
              cx={xScale(p.fitted)}
              cy={yScale(p.residual)}
              r={i === repIdx ? 3.4 : 2.6}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Zero reference line — the centre of gravity a good residual plot hugs */}
        <ExplainAnchor
          selector="zero-line"
          index={1}
          pin={{ x: iw - 10, y: zeroY - 12 }}
          rect={{ x: 0, y: zeroY - 5, width: iw, height: 10 }}
        >
          <Line
            from={{ x: 0, y: zeroY }}
            to={{ x: iw, y: zeroY }}
            stroke="var(--color-ink)"
            strokeWidth={1.2}
            strokeDasharray="3 3"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Representative data point — one residual */}
        <ExplainAnchor
          selector="residual-point"
          index={2}
          pin={{ x: repX + 14, y: repY - 14 }}
          rect={{ x: repX - 8, y: repY - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* Cloud shape — the "no pattern" zone */}
        <ExplainAnchor
          selector="cloud-shape"
          index={3}
          pin={{ x: iw / 2, y: yScale(2.8) }}
          rect={{
            x: xScale(2),
            y: yScale(3.2),
            width: xScale(20) - xScale(2),
            height: yScale(-3.2) - yScale(3.2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Vertical spread — constant variance */}
        <ExplainAnchor
          selector="vertical-spread"
          index={4}
          pin={{ x: xScale(19), y: yScale(-2.6) }}
          rect={{
            x: xScale(18),
            y: 0,
            width: Math.max(0, xScale(21) - xScale(18)),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
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
            FITTED VALUE (ŷ)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => {
              const n = Number(v);
              return n > 0 ? `+${n}` : `${n}`;
            }}
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
            RESIDUAL (y − ŷ)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
