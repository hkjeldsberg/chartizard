"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { Delaunay } from "d3-delaunay";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ~15 seed points positioned to evoke coffee-shop locations in an unnamed
// city: a dense commercial core, a clear secondary cluster along a boulevard,
// and a sparser periphery that will produce the large "far from any seed"
// cells Voronoi diagrams are famous for. Coordinates are normalised [0,1]
// so the chart scales with the plot area.
interface SeedSpec {
  id: string;
  nx: number;
  ny: number;
}

const SEEDS: ReadonlyArray<SeedSpec> = [
  // Downtown core — tight cluster of five shops.
  { id: "s01", nx: 0.38, ny: 0.42 },
  { id: "s02", nx: 0.44, ny: 0.38 },
  { id: "s03", nx: 0.48, ny: 0.48 },
  { id: "s04", nx: 0.42, ny: 0.52 },
  { id: "s05", nx: 0.52, ny: 0.40 },
  // Boulevard running NE — a secondary strip of shops.
  { id: "s06", nx: 0.62, ny: 0.32 },
  { id: "s07", nx: 0.72, ny: 0.24 },
  { id: "s08", nx: 0.82, ny: 0.18 },
  // University neighbourhood — SW.
  { id: "s09", nx: 0.22, ny: 0.66 },
  { id: "s10", nx: 0.30, ny: 0.74 },
  { id: "s11", nx: 0.16, ny: 0.78 },
  // Isolated outliers — the suburbs / park edges.
  { id: "s12", nx: 0.82, ny: 0.62 },
  { id: "s13", nx: 0.68, ny: 0.82 },
  { id: "s14", nx: 0.12, ny: 0.22 },
  { id: "s15", nx: 0.88, ny: 0.82 },
];

interface Props {
  width: number;
  height: number;
}

export function VoronoiChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 28, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { points, cells, cellAreas } = useMemo(() => {
    const pts: Array<{ id: string; x: number; y: number }> = SEEDS.map((s) => ({
      id: s.id,
      x: s.nx * iw,
      y: s.ny * ih,
    }));

    if (iw <= 0 || ih <= 0) {
      return { points: pts, cells: [] as string[], cellAreas: [] as number[] };
    }

    const delaunay = Delaunay.from(pts.map((p) => [p.x, p.y] as [number, number]));
    const voronoi = delaunay.voronoi([0, 0, iw, ih]);

    const paths: string[] = [];
    const areas: number[] = [];
    for (let i = 0; i < pts.length; i += 1) {
      paths.push(voronoi.renderCell(i));
      const poly = voronoi.cellPolygon(i);
      // Shoelace formula — absolute signed area of the cell polygon.
      let a = 0;
      if (poly) {
        for (let k = 0; k < poly.length - 1; k += 1) {
          const [x1, y1] = poly[k];
          const [x2, y2] = poly[k + 1];
          a += x1 * y2 - x2 * y1;
        }
        a = Math.abs(a) / 2;
      }
      areas.push(a);
    }

    return { points: pts, cells: paths, cellAreas: areas };
  }, [iw, ih]);

  // Pick a focal cell (a downtown one — small, surrounded) and a large
  // peripheral cell (the "farthest from any seed" region).
  const focalIndex = 2; // s03 — in the core cluster
  const largestIndex = useMemo(() => {
    let best = 0;
    for (let i = 1; i < cellAreas.length; i += 1) {
      if (cellAreas[i] > cellAreas[best]) best = i;
    }
    return best;
  }, [cellAreas]);

  const focalPoint = points[focalIndex];
  const focalNeighbourPoint = points[4]; // s05 — its neighbour to the NE
  const edgeMidX =
    focalPoint && focalNeighbourPoint
      ? (focalPoint.x + focalNeighbourPoint.x) / 2
      : 0;
  const edgeMidY =
    focalPoint && focalNeighbourPoint
      ? (focalPoint.y + focalNeighbourPoint.y) / 2
      : 0;

  // Approximate a vertex: use the midpoint of three nearby core seeds as a
  // stand-in for the circumcenter. We read the first matching polygon vertex
  // at runtime from the polygon, when iw/ih > 0.
  const vertexPoint = useMemo(() => {
    if (iw <= 0 || ih <= 0) return { x: 0, y: 0 };
    const delaunay = Delaunay.from(
      points.map((p) => [p.x, p.y] as [number, number]),
    );
    const voronoi = delaunay.voronoi([0, 0, iw, ih]);
    const poly = voronoi.cellPolygon(focalIndex);
    if (!poly || poly.length < 2) return { x: focalPoint?.x ?? 0, y: focalPoint?.y ?? 0 };
    // Pick the polygon vertex closest to the midpoint of focalPoint and its
    // NE neighbour — a visibly meaningful circumcenter for the viewer.
    let best = poly[0];
    let bestD = Infinity;
    for (const v of poly) {
      const dx = v[0] - edgeMidX;
      const dy = v[1] - edgeMidY;
      const d = dx * dx + dy * dy;
      if (d < bestD) {
        bestD = d;
        best = v;
      }
    }
    return { x: best[0], y: best[1] };
  }, [iw, ih, points, focalPoint, edgeMidX, edgeMidY]);

  // Clamp helper — anchor rects must stay inside the plot.
  const clampRect = (
    x: number,
    y: number,
    w: number,
    h: number,
  ): { x: number; y: number; width: number; height: number } => {
    const cx = Math.max(0, Math.min(x, iw));
    const cy = Math.max(0, Math.min(y, ih));
    const cw = Math.max(0, Math.min(w, iw - cx));
    const ch = Math.max(0, Math.min(h, ih - cy));
    return { x: cx, y: cy, width: cw, height: ch };
  };

  // Rects for each anchor, clamped to the plot area.
  const cellRect = clampRect(focalPoint.x - 26, focalPoint.y - 26, 52, 52);
  const seedRect = clampRect(focalPoint.x - 8, focalPoint.y - 8, 16, 16);
  const edgeRect = clampRect(edgeMidX - 16, edgeMidY - 16, 32, 32);
  const vertexRect = clampRect(vertexPoint.x - 10, vertexPoint.y - 10, 20, 20);
  const largestCenter = points[largestIndex];
  const emptyRect = clampRect(
    largestCenter.x - 30,
    largestCenter.y - 30,
    60,
    60,
  );
  const boundsRect = clampRect(0, 0, iw, ih);

  return (
    <svg width={width} height={height} role="img" aria-label="Voronoi diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — drawn first so seeds paint over them. */}
        <g data-data-layer="true">
          {cells.map((d, i) => (
            <path
              key={`cell-${i}`}
              d={d}
              fill={
                i === focalIndex
                  ? "var(--color-ink)"
                  : i === largestIndex
                    ? "var(--color-hairline)"
                    : "var(--color-surface)"
              }
              fillOpacity={
                i === focalIndex ? 0.08 : i === largestIndex ? 0.6 : 1
              }
              stroke="var(--color-ink)"
              strokeOpacity={0.45}
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Bounding rectangle — the viewport the diagram is clipped to. */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
        </g>

        {/* Seeds. */}
        <g data-data-layer="true">
          {points.map((p, i) => (
            <circle
              key={p.id}
              cx={p.x}
              cy={p.y}
              r={i === focalIndex ? 3.2 : 2.2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Caption */}
        <g data-data-layer="true">
          <text
            x={0}
            y={ih + 18}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            COFFEE-SHOP CATCHMENTS · EACH CELL = POINTS CLOSEST TO THAT SEED
          </text>
        </g>

        {/* Anchors */}

        {/* 1. Cell */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{
            x: Math.max(12, focalPoint.x - 28),
            y: Math.max(12, focalPoint.y - 28),
          }}
          rect={cellRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Seed */}
        <ExplainAnchor
          selector="seed"
          index={2}
          pin={{
            x: Math.min(iw - 12, focalPoint.x + 18),
            y: focalPoint.y + 14,
          }}
          rect={seedRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Edge (perpendicular bisector between two seeds) */}
        <ExplainAnchor
          selector="edge"
          index={3}
          pin={{
            x: Math.min(iw - 12, edgeMidX + 22),
            y: Math.max(12, edgeMidY - 22),
          }}
          rect={edgeRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Vertex (circumcenter of three seeds) */}
        <ExplainAnchor
          selector="vertex"
          index={4}
          pin={{
            x: Math.min(iw - 12, vertexPoint.x + 18),
            y: Math.min(ih - 12, vertexPoint.y + 18),
          }}
          rect={vertexRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Empty space — the largest cell, farthest from any seed */}
        <ExplainAnchor
          selector="empty-space"
          index={5}
          pin={{
            x: Math.min(iw - 12, largestCenter.x),
            y: Math.max(12, largestCenter.y - 32),
          }}
          rect={emptyRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Bounding viewport */}
        <ExplainAnchor
          selector="bounds"
          index={6}
          pin={{ x: iw - 12, y: 12 }}
          rect={boundsRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
