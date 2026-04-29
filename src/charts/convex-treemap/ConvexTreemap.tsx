"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, treemap as d3Treemap } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Convex Treemap — the same hierarchy + leaf-sizing logic as a squarified
// treemap, but each top-level cluster's footprint is bounded by its
// leaves' CONVEX HULL instead of a rectangle. Inter-hull whitespace is the
// chart's whole point: it tells the viewer that these clusters are
// spatially related but not grid-aligned.
//
// Implementation:
//   1. Build a d3-hierarchy from the synthetic data.
//   2. Run d3-treemap to get leaf rectangles (positions + sizes).
//   3. For each top-level cluster, collect its leaf corner points and
//      compute a convex hull (hand-rolled Graham scan — d3-polygon is
//      not installed and we're not adding a dep).
//   4. Draw: translucent hull fill per cluster + a circle per leaf at
//      the leaf rectangle's centre, sized by sqrt(value) for area
//      proportionality.
//
// Data: a simplified snapshot of a React-frontend monorepo's bundle
// composition. Four top-level clusters, ~18 leaves total, values in KB
// of gzipped output. The numbers are representative — large ecosystem
// packages dominate, small utilities cluster together.

interface RawNode {
  name: string;
  short: string;
  value?: number;
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "bundle",
  short: "bundle",
  children: [
    {
      name: "React ecosystem",
      short: "React",
      children: [
        { name: "react-dom", short: "react-dom", value: 132 },
        { name: "react", short: "react", value: 42 },
        { name: "@tanstack/react-query", short: "react-query", value: 34 },
        { name: "react-router", short: "react-router", value: 28 },
        { name: "react-hook-form", short: "hook-form", value: 18 },
      ],
    },
    {
      name: "Testing tools",
      short: "Testing",
      children: [
        { name: "vitest", short: "vitest", value: 58 },
        { name: "@testing-library/react", short: "rtl", value: 24 },
        { name: "jsdom", short: "jsdom", value: 90 },
        { name: "playwright", short: "playwright", value: 46 },
      ],
    },
    {
      name: "Build tools",
      short: "Build",
      children: [
        { name: "vite", short: "vite", value: 72 },
        { name: "esbuild", short: "esbuild", value: 54 },
        { name: "postcss", short: "postcss", value: 22 },
        { name: "typescript", short: "typescript", value: 110 },
      ],
    },
    {
      name: "Linting",
      short: "Lint",
      children: [
        { name: "eslint", short: "eslint", value: 48 },
        { name: "prettier", short: "prettier", value: 30 },
        { name: "@typescript-eslint", short: "ts-eslint", value: 38 },
        { name: "stylelint", short: "stylelint", value: 26 },
      ],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

type Pt = { x: number; y: number };

// Graham-scan convex hull (hand-rolled; d3-polygon is not installed).
// Returns points in counter-clockwise order, starting at the lowest-y
// (then lowest-x) pivot. Coincident points are deduplicated.
function convexHull(points: ReadonlyArray<Pt>): Pt[] {
  if (points.length < 3) return points.slice();

  // Pivot: the point with lowest y, ties broken by lowest x.
  let pivotIdx = 0;
  for (let i = 1; i < points.length; i++) {
    const p = points[i];
    const q = points[pivotIdx];
    if (p.y < q.y || (p.y === q.y && p.x < q.x)) pivotIdx = i;
  }
  const pivot = points[pivotIdx];

  // Sort the rest by polar angle from the pivot; ties broken by distance.
  const rest = points
    .filter((_, i) => i !== pivotIdx)
    .map((p) => ({
      p,
      angle: Math.atan2(p.y - pivot.y, p.x - pivot.x),
      dist: (p.x - pivot.x) ** 2 + (p.y - pivot.y) ** 2,
    }))
    .sort((a, b) => (a.angle - b.angle) || (a.dist - b.dist))
    .map((e) => e.p);

  const cross = (o: Pt, a: Pt, b: Pt) =>
    (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);

  const stack: Pt[] = [pivot];
  for (const p of rest) {
    while (
      stack.length >= 2 &&
      cross(stack[stack.length - 2], stack[stack.length - 1], p) <= 0
    ) {
      stack.pop();
    }
    stack.push(p);
  }
  return stack;
}

function centroidOf(pts: ReadonlyArray<Pt>): Pt {
  if (pts.length === 0) return { x: 0, y: 0 };
  let sx = 0;
  let sy = 0;
  for (const p of pts) {
    sx += p.x;
    sy += p.y;
  }
  return { x: sx / pts.length, y: sy / pts.length };
}

// Expand hull outward from its centroid by `pad` pixels so the hull
// doesn't clip the leaf circles on its boundary.
function expandHull(hull: ReadonlyArray<Pt>, pad: number): Pt[] {
  if (hull.length === 0) return [];
  const c = centroidOf(hull);
  return hull.map((p) => {
    const dx = p.x - c.x;
    const dy = p.y - c.y;
    const len = Math.hypot(dx, dy);
    if (len === 0) return { x: p.x, y: p.y };
    const s = (len + pad) / len;
    return { x: c.x + dx * s, y: c.y + dy * s };
  });
}

export function ConvexTreemap({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 24, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const layout = useMemo(() => {
    const root = hierarchy<RawNode>(DATA)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    // Treemap padded so clusters are visually separated even before we
    // swap their rectangles for hulls. paddingInner = 18 leaves room
    // for the hull-to-hull whitespace the chart is named for.
    const tm = d3Treemap<RawNode>()
      .size([Math.max(1, iw), Math.max(1, ih)])
      .paddingOuter(4)
      .paddingInner(18)
      .paddingTop(4)
      .round(true);
    return tm(root);
  }, [iw, ih]);

  // One cluster per top-level child of root.
  const clusters = layout.children ?? [];

  // For each cluster: leaves, hull points, centroid.
  const clusterViews = clusters.map((cluster, ci) => {
    const leaves = cluster.leaves();
    // Leaf corner points — hull wraps all four corners so it stays
    // outside every leaf circle.
    const corners: Pt[] = [];
    for (const lf of leaves) {
      corners.push({ x: lf.x0, y: lf.y0 });
      corners.push({ x: lf.x1, y: lf.y0 });
      corners.push({ x: lf.x0, y: lf.y1 });
      corners.push({ x: lf.x1, y: lf.y1 });
    }
    const hullRaw = convexHull(corners);
    const hull = expandHull(hullRaw, 6);
    const centroid = centroidOf(hull.length > 0 ? hull : corners);
    return { cluster, ci, leaves, hull, centroid };
  });

  // Leaf-circle radius scale: use sqrt so area ∝ value. Cap at the
  // smaller of the leaf rectangle's half-sides so we never overflow.
  function leafRadius(node: { x0: number; x1: number; y0: number; y1: number; value?: number }): number {
    const maxR = Math.max(2, Math.min((node.x1 - node.x0) / 2, (node.y1 - node.y0) / 2) - 3);
    const byValue = Math.sqrt(node.value ?? 0) * 1.3;
    return Math.max(3, Math.min(maxR, byValue));
  }

  // Pick anchor targets.
  // - React ecosystem: the dominant cluster (largest total), by name.
  // - react-dom: the largest leaf inside it.
  const reactCluster = clusterViews.find(
    (c) => c.cluster.data.name === "React ecosystem",
  );
  const reactDomLeaf = reactCluster?.leaves.find(
    (l) => l.data.name === "react-dom",
  );
  // Pick a representative small leaf (mid-size) for "leaf" anchor so the
  // dominant react-dom stays free for the "dominant-cluster" explanation.
  const smallLeaf = clusterViews
    .flatMap((c) => c.leaves)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[
      Math.floor(clusterViews.flatMap((c) => c.leaves).length / 2)
    ];

  // Inter-hull whitespace anchor — put it at the geometric midpoint
  // between two cluster centroids (first two clusters).
  const gapPin =
    clusterViews.length >= 2
      ? {
          x: (clusterViews[0].centroid.x + clusterViews[1].centroid.x) / 2,
          y: (clusterViews[0].centroid.y + clusterViews[1].centroid.y) / 2,
        }
      : { x: iw / 2, y: ih / 2 };

  // Opacity ramp for hulls so clusters read without colour.
  const hullOpacity = (i: number) => 0.10 + (i % 4) * 0.06;

  return (
    <svg width={width} height={height} role="img" aria-label="Convex treemap">
      <Group left={margin.left} top={margin.top}>
        {/* Hulls — translucent cluster regions */}
        <g data-data-layer="true">
          {clusterViews.map((cv) =>
            cv.hull.length >= 3 ? (
              <polygon
                key={`hull-${cv.cluster.data.name}`}
                points={cv.hull.map((p) => `${p.x},${p.y}`).join(" ")}
                fill="var(--color-ink)"
                fillOpacity={hullOpacity(cv.ci)}
                stroke="var(--color-ink)"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeLinejoin="round"
              />
            ) : null,
          )}
        </g>

        {/* Leaves — one circle per package, centred in its treemap cell,
            area proportional to bundle size. */}
        <g data-data-layer="true">
          {clusterViews.flatMap((cv) =>
            cv.leaves.map((lf) => {
              const cx = (lf.x0 + lf.x1) / 2;
              const cy = (lf.y0 + lf.y1) / 2;
              const r = leafRadius(lf);
              return (
                <circle
                  key={`${cv.cluster.data.name}-${lf.data.name}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="var(--color-ink)"
                  fillOpacity={0.55}
                  stroke="var(--color-page)"
                  strokeWidth={1}
                />
              );
            }),
          )}
        </g>

        {/* Cluster labels (non-data-layer so they stay legible in Explain
            mode). Place each label near the hull's centroid, offset up. */}
        <g>
          {clusterViews.map((cv) => (
            <text
              key={`lbl-${cv.cluster.data.name}`}
              x={cv.centroid.x}
              y={cv.centroid.y - 4}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              {cv.cluster.data.short.toUpperCase()}
            </text>
          ))}
        </g>

        {/* Leaf labels — only for sufficiently large circles */}
        <g>
          {clusterViews.flatMap((cv) =>
            cv.leaves.map((lf) => {
              const cx = (lf.x0 + lf.x1) / 2;
              const cy = (lf.y0 + lf.y1) / 2;
              const r = leafRadius(lf);
              if (r < 12) return null;
              return (
                <text
                  key={`leaf-lbl-${cv.cluster.data.name}-${lf.data.name}`}
                  x={cx}
                  y={cy + r + 10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {lf.data.short}
                </text>
              );
            }),
          )}
        </g>

        {/* Anchor 1 — hull / cluster boundary (the React ecosystem hull) */}
        {reactCluster && reactCluster.hull.length >= 3 && (
          <ExplainAnchor
            selector="hull"
            index={1}
            pin={{
              x: reactCluster.centroid.x,
              y: reactCluster.centroid.y + 14,
            }}
            rect={{
              x: Math.max(0, Math.min(...reactCluster.hull.map((p) => p.x))),
              y: Math.max(0, Math.min(...reactCluster.hull.map((p) => p.y))),
              width: Math.min(
                iw,
                Math.max(...reactCluster.hull.map((p) => p.x)) -
                  Math.min(...reactCluster.hull.map((p) => p.x)),
              ),
              height: Math.min(
                ih,
                Math.max(...reactCluster.hull.map((p) => p.y)) -
                  Math.min(...reactCluster.hull.map((p) => p.y)),
              ),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 2 — a representative leaf (size mid-range) */}
        {smallLeaf && (
          <ExplainAnchor
            selector="leaf"
            index={2}
            pin={{
              x: (smallLeaf.x0 + smallLeaf.x1) / 2 + 12,
              y: (smallLeaf.y0 + smallLeaf.y1) / 2 - 12,
            }}
            rect={{
              x: smallLeaf.x0,
              y: smallLeaf.y0,
              width: smallLeaf.x1 - smallLeaf.x0,
              height: smallLeaf.y1 - smallLeaf.y0,
            }}
          >
            <circle
              cx={(smallLeaf.x0 + smallLeaf.x1) / 2}
              cy={(smallLeaf.y0 + smallLeaf.y1) / 2}
              r={leafRadius(smallLeaf) + 3}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.25}
            />
          </ExplainAnchor>
        )}

        {/* Anchor 3 — size encoding (the dominant react-dom circle) */}
        {reactDomLeaf && (
          <ExplainAnchor
            selector="size"
            index={3}
            pin={{
              x: (reactDomLeaf.x0 + reactDomLeaf.x1) / 2,
              y: (reactDomLeaf.y0 + reactDomLeaf.y1) / 2 + leafRadius(reactDomLeaf) + 16,
            }}
            rect={{
              x: reactDomLeaf.x0,
              y: reactDomLeaf.y0,
              width: reactDomLeaf.x1 - reactDomLeaf.x0,
              height: reactDomLeaf.y1 - reactDomLeaf.y0,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4 — inter-hull whitespace (the chart's distinguishing feature) */}
        <ExplainAnchor
          selector="whitespace"
          index={4}
          pin={gapPin}
          rect={{
            x: Math.max(0, gapPin.x - 20),
            y: Math.max(0, gapPin.y - 20),
            width: Math.min(iw, 40),
            height: Math.min(ih, 40),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — cluster label / grouping */}
        {reactCluster && (
          <ExplainAnchor
            selector="cluster-label"
            index={5}
            pin={{
              x: reactCluster.centroid.x + 48,
              y: reactCluster.centroid.y - 16,
            }}
            rect={{
              x: Math.max(0, reactCluster.centroid.x - 40),
              y: Math.max(0, reactCluster.centroid.y - 14),
              width: 80,
              height: 18,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 6 — dominant cluster (React ecosystem as a whole) */}
        {reactCluster && reactCluster.hull.length >= 3 && (
          <ExplainAnchor
            selector="dominant-cluster"
            index={6}
            pin={{
              x: reactCluster.centroid.x,
              y: Math.max(4, reactCluster.centroid.y - 36),
            }}
            rect={{
              x: Math.max(0, Math.min(...reactCluster.hull.map((p) => p.x))),
              y: Math.max(0, Math.min(...reactCluster.hull.map((p) => p.y))),
              width: Math.min(
                iw,
                Math.max(...reactCluster.hull.map((p) => p.x)) -
                  Math.min(...reactCluster.hull.map((p) => p.x)),
              ),
              height: Math.min(
                ih,
                Math.max(...reactCluster.hull.map((p) => p.y)) -
                  Math.min(...reactCluster.hull.map((p) => p.y)),
              ),
            }}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
