"use client";

import { useMemo } from "react";
import { Line } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same dataset as the box plot. Duplicated here per the contract — each chart
// module is self-contained.
const REAL_WINNERS: Record<string, number[]> = {
  "1920s": [10.8, 10.6, 10.8],
  "1930s": [10.3, 10.3],
  "1940s": [10.3, 10.4],
  "1950s": [10.4, 10.5],
  "1960s": [10.0, 9.95],
  "1970s": [10.14, 10.06],
  "1980s": [9.99, 9.92],
  "1990s": [9.96, 9.84, 9.87],
  "2000s": [9.87, 9.85, 9.69],
  "2010s": [9.63, 9.81],
  "2020s": [9.80, 9.79],
};

const DECADES = [
  "1920s", "1930s", "1940s", "1950s", "1960s",
  "1970s", "1980s", "1990s", "2000s", "2010s", "2020s",
];

const SPREAD: Record<string, { lo: number; hi: number; n: number }> = {
  "1920s": { lo: 10.6, hi: 11.1, n: 6 },
  "1930s": { lo: 10.3, hi: 10.8, n: 6 },
  "1940s": { lo: 10.3, hi: 10.8, n: 5 },
  "1950s": { lo: 10.4, hi: 10.7, n: 6 },
  "1960s": { lo: 10.0, hi: 10.3, n: 6 },
  "1970s": { lo: 10.06, hi: 10.35, n: 6 },
  "1980s": { lo: 9.95, hi: 10.25, n: 6 },
  "1990s": { lo: 9.87, hi: 10.15, n: 5 },
  "2000s": { lo: 9.85, hi: 10.10, n: 5 },
  "2010s": { lo: 9.75, hi: 10.05, n: 6 },
  "2020s": { lo: 9.80, hi: 10.05, n: 6 },
};

function buildDataset(): Record<string, number[]> {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const out: Record<string, number[]> = {};
  for (const decade of DECADES) {
    const winners = REAL_WINNERS[decade] ?? [];
    const spread = SPREAD[decade];
    const pool: number[] = [...winners];
    if (spread) {
      for (let i = 0; i < spread.n; i++) {
        const t = spread.lo + rand() * (spread.hi - spread.lo);
        pool.push(Math.round(t * 100) / 100);
      }
    }
    out[decade] = pool.sort((a, b) => a - b);
  }
  return out;
}

// Simple Gaussian KDE, bandwidth ~0.08s. Returns density at each y-value in
// `grid` for the given sample.
function kde(sample: number[], grid: number[], bandwidth: number): number[] {
  const n = sample.length;
  if (n === 0) return grid.map(() => 0);
  const norm = 1 / (n * bandwidth * Math.sqrt(2 * Math.PI));
  return grid.map((y) => {
    let sum = 0;
    for (const x of sample) {
      const z = (y - x) / bandwidth;
      sum += Math.exp(-0.5 * z * z);
    }
    return sum * norm;
  });
}

function median(sorted: number[]): number {
  if (sorted.length === 0) return NaN;
  const mid = sorted.length / 2;
  if (sorted.length % 2 === 1) return sorted[Math.floor(mid)] as number;
  return ((sorted[mid - 1] as number) + (sorted[mid] as number)) / 2;
}

interface Props {
  width: number;
  height: number;
}

export function ViolinChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const yDomain: [number, number] = [9.4, 11.2];

  const { violins, maxDensity } = useMemo(() => {
    const data = buildDataset();
    const gridSize = 64;
    const step = (yDomain[1] - yDomain[0]) / (gridSize - 1);
    const grid = Array.from({ length: gridSize }, (_, i) => yDomain[0] + i * step);

    let globalMax = 0;
    const result = DECADES.map((decade) => {
      const sample = data[decade] ?? [];
      const density = kde(sample, grid, 0.08);
      const localMax = density.reduce((m, v) => Math.max(m, v), 0);
      if (localMax > globalMax) globalMax = localMax;
      return {
        decade,
        grid,
        density,
        median: median([...sample].sort((a, b) => a - b)),
        sample,
      };
    });
    return { violins: result, maxDensity: globalMax };
  }, []);

  const xScale = scaleBand<string>({
    domain: DECADES,
    range: [0, iw],
    padding: 0.2,
  });

  const yScale = scaleLinear<number>({
    domain: yDomain,
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  const halfWidth = bw * 0.46;
  const ticksY = yScale.ticks(5);

  // Build a violin path: down the right edge (density-scaled), back up the
  // left edge (mirrored). Close.
  function violinPath(
    cx: number,
    grid: number[],
    density: number[],
  ): string {
    if (grid.length === 0) return "";
    const scale = maxDensity > 0 ? halfWidth / maxDensity : 0;
    const right: string[] = [];
    const left: string[] = [];
    for (let i = 0; i < grid.length; i++) {
      const y = yScale(grid[i] as number);
      const w = (density[i] as number) * scale;
      right.push(`${cx + w},${y}`);
      left.push(`${cx - w},${y}`);
    }
    left.reverse();
    return `M ${right.join(" L ")} L ${left.join(" L ")} Z`;
  }

  // Highlight anchor decades: 2000s (Bolt — bimodal fingerprint) and 2020s
  // (unimodal, tight field).
  const bolt = violins.find((v) => v.decade === "2000s");
  const recent = violins.find((v) => v.decade === "2020s");

  return (
    <svg width={width} height={height} role="img" aria-label="Violin plot">
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

        {/* Violins + medians */}
        <g data-data-layer="true">
          {violins.map((v) => {
            const cx = (xScale(v.decade) ?? 0) + bw / 2;
            const yMed = yScale(v.median);
            return (
              <g key={v.decade}>
                <path
                  d={violinPath(cx, v.grid, v.density)}
                  fill="var(--color-ink)"
                  fillOpacity={0.14}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                />
                <Line
                  from={{ x: cx - halfWidth * 0.7, y: yMed }}
                  to={{ x: cx + halfWidth * 0.7, y: yMed }}
                  stroke="var(--color-ink)"
                  strokeWidth={1.8}
                />
              </g>
            );
          })}
        </g>

        {/* Violin-shape anchor — 2000s (bimodal; Bolt sits low) */}
        {bolt && (() => {
          const cx = (xScale(bolt.decade) ?? 0) + bw / 2;
          return (
            <ExplainAnchor
              selector="violin"
              index={1}
              pin={{ x: cx + halfWidth + 8, y: yScale(9.78) }}
              rect={{
                x: cx - halfWidth,
                y: yScale(yDomain[1]),
                width: halfWidth * 2,
                height: yScale(yDomain[0]) - yScale(yDomain[1]),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Centre / median anchor — on the 2020s violin (unimodal) */}
        {recent && (() => {
          const cx = (xScale(recent.decade) ?? 0) + bw / 2;
          const yMed = yScale(recent.median);
          return (
            <ExplainAnchor
              selector="median-line"
              index={2}
              pin={{ x: cx + halfWidth + 6, y: yMed }}
              rect={{
                x: cx - halfWidth,
                y: yMed - 4,
                width: halfWidth * 2,
                height: 8,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Density-width anchor — wide part of the 2000s violin */}
        {bolt && (() => {
          const cx = (xScale(bolt.decade) ?? 0) + bw / 2;
          // Find the y with the largest density.
          let iMax = 0;
          for (let i = 1; i < bolt.density.length; i++) {
            if ((bolt.density[i] as number) > (bolt.density[iMax] as number)) iMax = i;
          }
          const yWide = yScale(bolt.grid[iMax] as number);
          const wScale = maxDensity > 0 ? halfWidth / maxDensity : 0;
          const wAt = (bolt.density[iMax] as number) * wScale;
          return (
            <ExplainAnchor
              selector="density-width"
              index={3}
              pin={{ x: cx - halfWidth - 10, y: yWide }}
              rect={{
                x: cx - wAt,
                y: yWide - 6,
                width: wAt * 2,
                height: 12,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => String(v).replace("s", "")}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => Number(v).toFixed(1)}
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
            SECONDS
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
