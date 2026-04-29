"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// NFL Combine 40-yard-dash times (seconds) by position, recent-era means.
// Four positions × ~30 prospects; wide receivers are fastest and tightest,
// offensive linemen are slowest and widest. Tuned for a legible sina at
// tile scale, not as a scouting source of truth.
const POSITIONS = ["WR", "RB", "LB", "OL"] as const;
type Position = (typeof POSITIONS)[number];

const SPEC: Record<Position, { mean: number; sd: number }> = {
  WR: { mean: 4.48, sd: 0.08 },
  RB: { mean: 4.58, sd: 0.09 },
  LB: { mean: 4.72, sd: 0.11 },
  OL: { mean: 5.22, sd: 0.16 },
};

const POINTS_PER_GROUP = 30;

function makeRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// Gaussian KDE at each point in `grid`. Bandwidth in the y-domain's units.
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

// Density at a single y — same kernel as above, no grid.
function densityAt(sample: number[], y: number, bandwidth: number): number {
  const n = sample.length;
  if (n === 0) return 0;
  const norm = 1 / (n * bandwidth * Math.sqrt(2 * Math.PI));
  let sum = 0;
  for (const x of sample) {
    const z = (y - x) / bandwidth;
    sum += Math.exp(-0.5 * z * z);
  }
  return sum * norm;
}

interface Props {
  width: number;
  height: number;
}

export function SinaChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const yDomain: [number, number] = [4.2, 5.8];
  const bandwidth = 0.07;

  const xScale = useMemo(
    () =>
      scaleBand<Position>({
        domain: [...POSITIONS],
        range: [0, iw],
        padding: 0.2,
      }),
    [iw],
  );

  const yScale = useMemo(
    () => scaleLinear<number>({ domain: yDomain, range: [ih, 0], nice: false }),
    [ih],
  );

  const bw = xScale.bandwidth();
  const halfWidth = Math.max(8, bw * 0.46);

  // For each group: draw samples, compute a density grid for the silhouette
  // hint, then for each sample place it at x = cx + u * density(y)/maxDensity
  // * halfWidth, where u is a seeded signed uniform in [-1, 1].
  const { groups, maxDensity } = useMemo(() => {
    const gridSize = 64;
    const step = (yDomain[1] - yDomain[0]) / (gridSize - 1);
    const grid = Array.from({ length: gridSize }, (_, i) => yDomain[0] + i * step);

    let globalMax = 0;
    const out = POSITIONS.map((pos, gi) => {
      const { mean, sd } = SPEC[pos];
      const rand = makeRand(4201 + gi * 131);
      const samples: number[] = [];
      for (let i = 0; i < POINTS_PER_GROUP; i++) {
        let v = mean + gaussian(rand) * sd;
        // Clamp inside domain so no dot draws off-plot.
        if (v < yDomain[0] + 0.02) v = yDomain[0] + 0.02;
        if (v > yDomain[1] - 0.02) v = yDomain[1] - 0.02;
        samples.push(v);
      }
      const density = kde(samples, grid, bandwidth);
      const localMax = density.reduce((m, v) => Math.max(m, v), 0);
      if (localMax > globalMax) globalMax = localMax;
      return { position: pos, samples, density, grid };
    });
    return { groups: out, maxDensity: globalMax };
  }, []);

  const placed = useMemo(() => {
    return groups.map((g, gi) => {
      const cx = (xScale(g.position) ?? 0) + bw / 2;
      const rand = makeRand(9871 + gi * 211);
      const points = g.samples.map((v) => {
        const d = densityAt(g.samples, v, bandwidth);
        const widthHere = maxDensity > 0 ? (d / maxDensity) * halfWidth : 0;
        // Signed uniform in [-1, 1] — matches the SinaPlot paper (Sidiropoulos
        // et al 2016) which describes the jitter as uniform scaled by the KDE.
        const u = rand() * 2 - 1;
        return {
          x: cx + u * widthHere,
          y: yScale(v),
          raw: v,
          widthHere,
        };
      });
      return { position: g.position, cx, points, density: g.density, grid: g.grid };
    });
  }, [groups, maxDensity, xScale, yScale, bw, halfWidth]);

  const ticksY = yScale.ticks(5);

  // Anchor-target selection:
  // - highlight a point near the mode of the OL group (widest cloud)
  // - density-width anchor on OL
  // - centre axis on WR (narrowest) — shows the centreline concept
  const olGroup = placed.find((p) => p.position === "OL");
  const wrGroup = placed.find((p) => p.position === "WR");

  const olMode = useMemo(() => {
    if (!olGroup) return null;
    let iMax = 0;
    for (let i = 1; i < olGroup.density.length; i++) {
      if ((olGroup.density[i] as number) > (olGroup.density[iMax] as number)) iMax = i;
    }
    const yModeValue = olGroup.grid[iMax] as number;
    const widthAtMode =
      maxDensity > 0 ? ((olGroup.density[iMax] as number) / maxDensity) * halfWidth : 0;
    return { yPx: yScale(yModeValue), widthAtMode };
  }, [olGroup, yScale, halfWidth, maxDensity]);

  // Representative highlighted sina point — pick the OL sample nearest the mode.
  const highlightPoint = useMemo(() => {
    if (!olGroup || !olMode) return null;
    let best = olGroup.points[0];
    let bestDy = Infinity;
    for (const p of olGroup.points) {
      const dy = Math.abs(p.y - olMode.yPx);
      if (dy < bestDy) {
        bestDy = dy;
        best = p;
      }
    }
    return best;
  }, [olGroup, olMode]);

  return (
    <svg width={width} height={height} role="img" aria-label="Sina plot">
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

        {/* Faint category spine so the reader sees what the jitter pivots on */}
        <g data-data-layer="true">
          {placed.map((g) => (
            <line
              key={g.position}
              x1={g.cx}
              x2={g.cx}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="1 3"
            />
          ))}
        </g>

        {/* Points */}
        <g data-data-layer="true">
          {placed.map((g) =>
            g.points.map((p, i) => (
              <circle
                key={`${g.position}-${i}`}
                cx={p.x}
                cy={p.y}
                r={2.4}
                fill="var(--color-ink)"
                fillOpacity={0.78}
              />
            )),
          )}
        </g>

        {/* Anchor 1 — one sina point (the sina plot's unit of data) */}
        {highlightPoint && (
          <ExplainAnchor
            selector="sina-point"
            index={1}
            pin={{ x: highlightPoint.x + 14, y: highlightPoint.y - 14 }}
            rect={{
              x: Math.max(0, highlightPoint.x - 8),
              y: Math.max(0, highlightPoint.y - 8),
              width: 16,
              height: 16,
            }}
          >
            <circle
              cx={highlightPoint.x}
              cy={highlightPoint.y}
              r={3.2}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              data-data-layer="true"
            />
          </ExplainAnchor>
        )}

        {/* Anchor 2 — density-driven jitter width, pinned on OL's mode where
            the cloud is at its widest */}
        {olGroup && olMode && (
          <ExplainAnchor
            selector="density-jitter"
            index={2}
            pin={{ x: olGroup.cx + olMode.widthAtMode + 10, y: olMode.yPx }}
            rect={{
              x: Math.max(0, olGroup.cx - olMode.widthAtMode),
              y: Math.max(0, olMode.yPx - 8),
              width: Math.min(iw, Math.max(1, olMode.widthAtMode * 2)),
              height: 16,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3 — the category spine (WR is narrowest, shows the axis
            most clearly) */}
        {wrGroup && (
          <ExplainAnchor
            selector="category-spine"
            index={3}
            pin={{ x: wrGroup.cx, y: 12 }}
            rect={{
              x: Math.max(0, wrGroup.cx - 2),
              y: 0,
              width: 4,
              height: ih,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4 — X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
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

        {/* Anchor 5 — Y-axis */}
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
