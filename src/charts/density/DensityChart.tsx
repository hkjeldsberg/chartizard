"use client";

import { useMemo } from "react";
import { AreaClosed, LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Seeded LCG + Box-Muller: ~2000 log-normal US household-income samples, clipped
// to [$0, $300k]. Deterministic so server and client render the same curve.
function generateIncomes(n: number): number[] {
  let seed = 11;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: number[] = [];
  const mu = Math.log(70000);
  const sigma = 0.65;
  let i = 0;
  while (out.length < n && i < n * 3) {
    i++;
    const income = Math.exp(mu + sigma * gauss());
    if (income < 0) continue;
    if (income > 300000) continue;
    out.push(income);
  }
  return out;
}

// Gaussian kernel density estimate on a uniform grid.
function kde(samples: number[], grid: number[], bandwidth: number): number[] {
  const n = samples.length;
  const h = bandwidth;
  const norm = 1 / (n * h * Math.sqrt(2 * Math.PI));
  return grid.map((x) => {
    let acc = 0;
    for (let i = 0; i < n; i++) {
      const u = (x - samples[i]) / h;
      acc += Math.exp(-0.5 * u * u);
    }
    return acc * norm;
  });
}

interface Props {
  width: number;
  height: number;
}

export function DensityChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { gridData, maxDensity, modeX } = useMemo(() => {
    const samples = generateIncomes(2000);
    const domain: [number, number] = [0, 300000];
    const gridN = 256;
    const bandwidth = 8000;
    const step = (domain[1] - domain[0]) / (gridN - 1);
    const grid: number[] = [];
    for (let i = 0; i < gridN; i++) grid.push(domain[0] + i * step);
    const densities = kde(samples, grid, bandwidth);

    // Normalise so peak density is 1.0 — keeps the y-range consistent
    // regardless of bandwidth and sample count.
    let maxD = 0;
    let modeIdx = 0;
    for (let i = 0; i < densities.length; i++) {
      if (densities[i] > maxD) {
        maxD = densities[i];
        modeIdx = i;
      }
    }
    const normalised = densities.map((d) => d / maxD);
    const data = grid.map((x, i) => ({ x, d: normalised[i] }));
    return { gridData: data, maxDensity: 1, modeX: grid[modeIdx] };
  }, []);

  const xScale = scaleLinear({ domain: [0, 300000], range: [0, iw] });
  const yScale = scaleLinear({
    domain: [0, maxDensity * 1.08],
    range: [ih, 0],
  });

  const modePx = xScale(modeX);
  const modeY = yScale(maxDensity);

  // Tail region: past ~$180k, where the curve thins but never quite dies.
  const tailStartX = xScale(180000);
  const tailEndX = xScale(280000);
  const tailProbeY = yScale(0.18);

  // Bandwidth bracket: a horizontal span ~8k wide placed low on the curve,
  // near the shoulder, to read as "this is the smoothing radius".
  const bwCenterData = 130000;
  const bwX0 = xScale(bwCenterData - 4000);
  const bwX1 = xScale(bwCenterData + 4000);
  const bwY = yScale(0.55);

  const currencyK = (v: number) => (v === 0 ? "$0" : `$${Math.round(v / 1000)}k`);

  return (
    <svg width={width} height={height} role="img" aria-label="Density plot">
      <Group left={margin.left} top={margin.top}>
        {/* Filled area under the density curve */}
        <ExplainAnchor
          selector="curve"
          index={1}
          pin={{ x: xScale(95000), y: yScale(0.55) - 18 }}
          rect={{
            x: xScale(30000),
            y: yScale(0.95),
            width: xScale(170000) - xScale(30000),
            height: ih - yScale(0.95),
          }}
        >
          <g data-data-layer="true">
            <AreaClosed
              data={gridData}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.d)}
              yScale={yScale}
              fill="var(--color-ink)"
              fillOpacity={0.2}
              curve={curveMonotoneX}
            />
            <LinePath
              data={gridData}
              x={(d) => xScale(d.x)}
              y={(d) => yScale(d.d)}
              stroke="var(--color-ink)"
              strokeWidth={2}
              strokeLinecap="round"
              curve={curveMonotoneX}
            />
          </g>
        </ExplainAnchor>

        {/* Peak reference line + dot at the mode */}
        <g data-data-layer="true">
          <line
            x1={modePx}
            x2={modePx}
            y1={modeY}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <circle cx={modePx} cy={modeY} r={3} fill="var(--color-ink)" />
        </g>
        <ExplainAnchor
          selector="peak"
          index={2}
          pin={{ x: modePx + 14, y: modeY - 14 }}
          rect={{
            x: modePx - 10,
            y: modeY - 10,
            width: 20,
            height: ih - modeY + 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Long right tail */}
        <ExplainAnchor
          selector="tail"
          index={3}
          pin={{ x: (tailStartX + tailEndX) / 2, y: tailProbeY - 14 }}
          rect={{
            x: tailStartX,
            y: yScale(0.35),
            width: tailEndX - tailStartX,
            height: ih - yScale(0.35),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Bandwidth bracket */}
        <g data-data-layer="true">
          <line
            x1={bwX0}
            x2={bwX1}
            y1={bwY}
            y2={bwY}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={bwX0}
            x2={bwX0}
            y1={bwY - 3}
            y2={bwY + 3}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={bwX1}
            x2={bwX1}
            y1={bwY - 3}
            y2={bwY + 3}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <text
            x={(bwX0 + bwX1) / 2}
            y={bwY - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            h = $8k
          </text>
        </g>
        <ExplainAnchor
          selector="bandwidth"
          index={4}
          pin={{ x: (bwX0 + bwX1) / 2, y: bwY - 22 }}
          rect={{
            x: bwX0 - 4,
            y: bwY - 16,
            width: bwX1 - bwX0 + 8,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 36 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => currencyK(v as number)}
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

        {/* Y-axis (density, unitless) */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            tickFormat={() => ""}
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
            DENSITY
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
