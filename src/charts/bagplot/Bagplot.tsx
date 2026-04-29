"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Seeded LCG — deterministic bivariate-normal-ish cloud (60 points).
// Rousseeuw, Ruts & Tukey (1999): the bagplot's 50% bag approximates the
// bivariate "central half" the same way the IQR spans the central half
// of a univariate distribution.
// ---------------------------------------------------------------------------

function lcg(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Box-Muller transform for approximate normality.
function normalPair(rand: () => number): [number, number] {
  const u = Math.max(1e-10, rand());
  const v = rand();
  const mag = Math.sqrt(-2 * Math.log(u));
  return [mag * Math.cos(2 * Math.PI * v), mag * Math.sin(2 * Math.PI * v)];
}

interface Point {
  x: number;
  y: number;
}

function generateCloud(): Point[] {
  const rand = lcg(314);
  const pts: Point[] = [];
  for (let i = 0; i < 60; i++) {
    const [z1, z2] = normalPair(rand);
    // Moderately correlated bivariate-normal: corr ≈ 0.6
    const x = z1;
    const y = 0.6 * z1 + 0.8 * z2;
    pts.push({ x, y });
  }
  return pts;
}

// ---------------------------------------------------------------------------
// Convex hull — Graham scan
// ---------------------------------------------------------------------------

function cross(O: Point, A: Point, B: Point): number {
  return (A.x - O.x) * (B.y - O.y) - (A.y - O.y) * (B.x - O.x);
}

function convexHull(points: Point[]): Point[] {
  if (points.length < 3) return [...points];
  const sorted = [...points].sort((a, b) => a.x - b.x || a.y - b.y);
  const lower: Point[] = [];
  for (const p of sorted) {
    while (lower.length >= 2 && cross(lower[lower.length - 2]!, lower[lower.length - 1]!, p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: Point[] = [];
  for (let i = sorted.length - 1; i >= 0; i--) {
    const p = sorted[i]!;
    while (upper.length >= 2 && cross(upper[upper.length - 2]!, upper[upper.length - 1]!, p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  // Remove duplicated endpoints
  upper.pop();
  lower.pop();
  return [...lower, ...upper];
}

// ---------------------------------------------------------------------------
// Compute bagplot structures
// ---------------------------------------------------------------------------

function dist2(a: Point, b: Point): number {
  return (a.x - b.x) ** 2 + (a.y - b.y) ** 2;
}

/** Scale a hull polygon outward from centroid by `factor`. */
function scaleHull(hull: Point[], cx: number, cy: number, factor: number): Point[] {
  return hull.map((p) => ({
    x: cx + (p.x - cx) * factor,
    y: cy + (p.y - cy) * factor,
  }));
}

/** Test whether a point is strictly inside a convex polygon (CCW winding). */
function insideConvexHull(polygon: Point[], pt: Point): boolean {
  const n = polygon.length;
  if (n < 3) return false;
  for (let i = 0; i < n; i++) {
    const a = polygon[i]!;
    const b = polygon[(i + 1) % n]!;
    if (cross(a, b, pt) < 0) return false;
  }
  return true;
}

function polygonPath(pts: Point[], xS: (v: number) => number, yS: (v: number) => number): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${xS(p.x)},${yS(p.y)}`).join(" ") + " Z";
}

interface BagplotData {
  points: Point[];
  centroid: Point;
  bagHull: Point[];
  fenceHull: Point[];
  outliers: Point[];
  interiorPoint: Point;
}

function computeBagplot(pts: Point[]): BagplotData {
  const cx = pts.reduce((s, p) => s + p.x, 0) / pts.length;
  const cy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
  const centroid: Point = { x: cx, y: cy };

  // Inner 50% bag: 30 points closest to centroid → convex hull
  const byDist = [...pts].sort((a, b) => dist2(a, centroid) - dist2(b, centroid));
  const innerPts = byDist.slice(0, 30);
  const bagHull = convexHull(innerPts);

  // Outer fence: scale bag hull vertices by factor 3
  const fenceHull = convexHull(scaleHull(bagHull, cx, cy, 3));

  // Outliers: points outside the fence
  const outliers = pts.filter((p) => !insideConvexHull(fenceHull, p));

  // A representative bag-interior point: the innermost non-centroid point
  const interiorPoint = byDist[5] ?? byDist[1] ?? pts[0]!;

  return { points: pts, centroid, bagHull, fenceHull, outliers, interiorPoint };
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

interface Props {
  width: number;
  height: number;
}

export function Bagplot({ width, height }: Props) {
  const margin = { top: 20, right: 60, bottom: 44, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const bag = useMemo<BagplotData>(() => {
    const pts = generateCloud();
    return computeBagplot(pts);
  }, []);

  const allX = bag.points.map((p) => p.x);
  const allY = bag.points.map((p) => p.y);
  const xPad = 0.5;
  const yPad = 0.5;
  const xMin = Math.min(...allX) - xPad;
  const xMax = Math.max(...allX) + xPad;
  const yMin = Math.min(...allY) - yPad;
  const yMax = Math.max(...allY) + yPad;

  const xScale = scaleLinear({ domain: [xMin, xMax], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [yMin, yMax], range: [ih, 0], nice: true });

  const xs = (v: number) => xScale(v);
  const ys = (v: number) => yScale(v);

  // Pick anchor positions
  const cxS = xs(bag.centroid.x);
  const cyS = ys(bag.centroid.y);

  // Use first outlier for outlier anchor (guaranteed: inflated-by-3 fence leaves outliers)
  const outlierPt = bag.outliers[0] ?? { x: xMax - 0.2, y: yMax - 0.2 };
  const outlierSx = xs(outlierPt.x);
  const outlierSy = ys(outlierPt.y);

  const interiorSx = xs(bag.interiorPoint.x);
  const interiorSy = ys(bag.interiorPoint.y);

  // Representative bag-hull midpoint for the bag anchor pin
  const bagMid = bag.bagHull[0] ?? bag.centroid;
  const bagMidSx = xs(bagMid.x);
  const bagMidSy = ys(bagMid.y);

  // Fence anchor: a fence hull vertex furthest from centroid
  const farthestFenceVtx = bag.fenceHull.reduce(
    (best, p) => (dist2(p, bag.centroid) > dist2(best, bag.centroid) ? p : best),
    bag.fenceHull[0] ?? bag.centroid,
  );
  const fenceSx = xs(farthestFenceVtx.x);
  const fenceSy = ys(farthestFenceVtx.y);

  const ticksX = xScale.ticks(4);
  const ticksY = yScale.ticks(4);

  return (
    <svg width={width} height={height} role="img" aria-label="Bagplot — 2D generalisation of the box-plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
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
        </g>

        {/* Fence polygon (outer) */}
        <g data-data-layer="true">
          <path
            d={polygonPath(bag.fenceHull, xs, ys)}
            fill="var(--color-ink)"
            fillOpacity={0.06}
            stroke="var(--color-ink)"
            strokeOpacity={0.35}
            strokeWidth={1}
            strokeDasharray="3 2"
          />
        </g>

        {/* Bag polygon (inner 50%) */}
        <g data-data-layer="true">
          <path
            d={polygonPath(bag.bagHull, xs, ys)}
            fill="var(--color-ink)"
            fillOpacity={0.18}
            stroke="var(--color-ink)"
            strokeOpacity={0.7}
            strokeWidth={1.2}
          />
        </g>

        {/* All scatter points */}
        <g data-data-layer="true">
          {bag.points.map((p, i) => {
            const isOutlier = bag.outliers.includes(p);
            return (
              <circle
                key={i}
                cx={xs(p.x)}
                cy={ys(p.y)}
                r={isOutlier ? 3.2 : 2.2}
                fill={isOutlier ? "none" : "var(--color-ink)"}
                fillOpacity={isOutlier ? 0 : 0.55}
                stroke="var(--color-ink)"
                strokeWidth={isOutlier ? 1.4 : 0}
              />
            );
          })}
        </g>

        {/* Depth median cross */}
        <g data-data-layer="true">
          <line x1={cxS - 6} y1={cyS} x2={cxS + 6} y2={cyS} stroke="var(--color-ink)" strokeWidth={1.8} />
          <line x1={cxS} y1={cyS - 6} x2={cxS} y2={cyS + 6} stroke="var(--color-ink)" strokeWidth={1.8} />
        </g>

        {/* Legend */}
        <g data-data-layer="true">
          <rect x={iw + 4} y={0} width={50} height={56} fill="var(--color-surface)" rx={2} />
          <rect x={iw + 8} y={8} width={10} height={10} fill="var(--color-ink)" fillOpacity={0.18} stroke="var(--color-ink)" strokeOpacity={0.7} strokeWidth={1} />
          <text x={iw + 20} y={17} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">50% bag</text>
          <rect x={iw + 8} y={24} width={10} height={10} fill="var(--color-ink)" fillOpacity={0.06} stroke="var(--color-ink)" strokeOpacity={0.35} strokeWidth={1} strokeDasharray="3 2" />
          <text x={iw + 20} y={33} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">fence</text>
          <circle cx={iw + 13} cy={48} r={3} fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
          <text x={iw + 20} y={51} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">outlier</text>
        </g>

        {/* ── ExplainAnchors ── */}

        {/* 1. Depth median cross */}
        <ExplainAnchor
          selector="depth-median"
          index={1}
          pin={{ x: cxS + 14, y: cyS - 14 }}
          rect={{ x: cxS - 8, y: cyS - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Inner bag polygon */}
        <ExplainAnchor
          selector="bag-polygon"
          index={2}
          pin={{ x: bagMidSx - 20, y: bagMidSy - 16 }}
          rect={{ x: 0, y: 0, width: iw / 2, height: ih / 2 }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Outer fence */}
        <ExplainAnchor
          selector="fence-polygon"
          index={3}
          pin={{ x: Math.min(fenceSx + 14, iw - 10), y: Math.max(fenceSy - 14, 10) }}
          rect={{ x: Math.max(0, fenceSx - 10), y: Math.max(0, fenceSy - 10), width: 20, height: 20 }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Outlier point */}
        <ExplainAnchor
          selector="outlier-point"
          index={4}
          pin={{ x: Math.min(outlierSx + 14, iw - 10), y: Math.max(outlierSy - 14, 10) }}
          rect={{ x: outlierSx - 8, y: outlierSy - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Interior (bag) point */}
        <ExplainAnchor
          selector="interior-point"
          index={5}
          pin={{ x: interiorSx + 14, y: interiorSy + 14 }}
          rect={{ x: interiorSx - 8, y: interiorSy - 8, width: 16, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Concentric-depth concept — framing note via x-axis */}
        <ExplainAnchor
          selector="depth-concept"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={4}
            tickFormat={(v) => String(Number(v).toFixed(1))}
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

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            tickFormat={(v) => String(Number(v).toFixed(1))}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
