"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Les Misérables — 12 principal characters + ~18 co-appearance edges.
// Layout is deterministic (hand-placed in a normalised [0,1] square) so
// renders do not drift across reloads. We deliberately avoid d3-force —
// a simulation introduces per-tick numerical drift that would make the
// chart re-render to a slightly different shape each time.

type NodeId =
  | "valjean"
  | "javert"
  | "fantine"
  | "cosette"
  | "marius"
  | "thenardier"
  | "mme-thenardier"
  | "eponine"
  | "gavroche"
  | "enjolras"
  | "myriel"
  | "fauchelevent";

interface NodeSpec {
  id: NodeId;
  name: string;
  // Normalised [0,1] coordinates that get mapped into the plot area.
  nx: number;
  ny: number;
}

// Centre = (0.5, 0.5). Inner ring r = 0.25, outer ring r ≈ 0.42.
// Angles expressed in degrees (0° = east, clockwise increasing y).
function polar(angleDeg: number, r: number): { nx: number; ny: number } {
  const a = (angleDeg * Math.PI) / 180;
  return { nx: 0.5 + r * Math.cos(a), ny: 0.5 + r * Math.sin(a) };
}

const NODES: ReadonlyArray<NodeSpec> = [
  { id: "valjean", name: "Valjean", nx: 0.5, ny: 0.5 },
  // Inner ring — primary relationships with Valjean.
  { id: "javert", name: "Javert", ...polar(0, 0.28) },
  { id: "fantine", name: "Fantine", ...polar(90, 0.28) },
  { id: "cosette", name: "Cosette", ...polar(180, 0.28) },
  { id: "marius", name: "Marius", ...polar(270, 0.28) },
  // Outer ring — grouped near each node's primary neighbour.
  { id: "myriel", name: "Myriel", ...polar(335, 0.42) },
  { id: "thenardier", name: "Thénardier", ...polar(55, 0.42) },
  { id: "mme-thenardier", name: "Mme. Thénardier", ...polar(80, 0.44) },
  { id: "fauchelevent", name: "Fauchelevent", ...polar(200, 0.42) },
  { id: "eponine", name: "Éponine", ...polar(295, 0.42) },
  { id: "enjolras", name: "Enjolras", ...polar(245, 0.42) },
  { id: "gavroche", name: "Gavroche", ...polar(260, 0.44) },
];

interface EdgeSpec {
  a: NodeId;
  b: NodeId;
  weight: number; // co-appearances
}

const EDGES: ReadonlyArray<EdgeSpec> = [
  // Valjean as hub.
  { a: "valjean", b: "javert", weight: 12 },
  { a: "valjean", b: "fantine", weight: 5 },
  { a: "valjean", b: "cosette", weight: 12 },
  { a: "valjean", b: "marius", weight: 4 },
  { a: "valjean", b: "myriel", weight: 3 },
  { a: "valjean", b: "fauchelevent", weight: 4 },
  { a: "valjean", b: "thenardier", weight: 6 },
  // Thénardier family cluster.
  { a: "thenardier", b: "mme-thenardier", weight: 8 },
  { a: "thenardier", b: "eponine", weight: 6 },
  { a: "mme-thenardier", b: "eponine", weight: 4 },
  { a: "thenardier", b: "gavroche", weight: 3 },
  // Barricade / student cluster.
  { a: "enjolras", b: "marius", weight: 10 },
  { a: "enjolras", b: "gavroche", weight: 5 },
  { a: "marius", b: "eponine", weight: 6 },
  { a: "marius", b: "cosette", weight: 9 },
  // Secondary links.
  { a: "cosette", b: "fantine", weight: 3 },
  { a: "cosette", b: "fauchelevent", weight: 2 },
  { a: "javert", b: "fantine", weight: 2 },
];

interface Props {
  width: number;
  height: number;
}

export function NetworkChart({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 28, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { nodes, edges, nodeById } = useMemo(() => {
    // Normalised positions → pixel positions inside the plot area. We keep
    // a small interior padding so outer-ring labels stay inside the box.
    const padX = 14;
    const padY = 14;
    const px = (nx: number) => padX + nx * Math.max(0, iw - 2 * padX);
    const py = (ny: number) => padY + ny * Math.max(0, ih - 2 * padY);

    // Degree = count of edges touching the node.
    const degree: Record<string, number> = {};
    for (const e of EDGES) {
      degree[e.a] = (degree[e.a] ?? 0) + 1;
      degree[e.b] = (degree[e.b] ?? 0) + 1;
    }

    const resolvedNodes = NODES.map((n) => ({
      ...n,
      x: px(n.nx),
      y: py(n.ny),
      degree: degree[n.id] ?? 0,
    }));

    const byId = new Map(resolvedNodes.map((n) => [n.id, n]));

    const resolvedEdges = EDGES.map((e) => {
      const a = byId.get(e.a)!;
      const b = byId.get(e.b)!;
      return { ...e, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });

    return { nodes: resolvedNodes, edges: resolvedEdges, nodeById: byId };
  }, [iw, ih]);

  // Node radius: proportional to sqrt(degree) so area scales with degree.
  const nodeRadius = (degree: number): number => 4 + Math.sqrt(degree) * 3.2;
  const edgeWidth = (weight: number): number => 0.5 + weight * 0.22;

  const valjean = nodeById.get("valjean")!;
  const thenardier = nodeById.get("thenardier")!;
  const mmeT = nodeById.get("mme-thenardier")!;
  const eponine = nodeById.get("eponine")!;
  const valjeanJavert = edges.find(
    (e) => e.a === "valjean" && e.b === "javert",
  )!;

  // Bounding box around the Thénardier cluster — clamped to plot area.
  const clusterXs = [thenardier.x, mmeT.x, eponine.x];
  const clusterYs = [thenardier.y, mmeT.y, eponine.y];
  const clusterPad = 24;
  const clusterX = Math.max(
    0,
    Math.min(...clusterXs) - clusterPad,
  );
  const clusterY = Math.max(
    0,
    Math.min(...clusterYs) - clusterPad,
  );
  const clusterW = Math.min(
    iw - clusterX,
    Math.max(...clusterXs) + clusterPad - clusterX,
  );
  const clusterH = Math.min(
    ih - clusterY,
    Math.max(...clusterYs) + clusterPad - clusterY,
  );

  // Edge hit-rect for the Valjean→Javert line, clamped to plot area.
  const edgePad = 10;
  const edgeX = Math.max(
    0,
    Math.min(valjeanJavert.x1, valjeanJavert.x2) - edgePad,
  );
  const edgeY = Math.max(
    0,
    Math.min(valjeanJavert.y1, valjeanJavert.y2) - edgePad,
  );
  const edgeW = Math.min(
    iw - edgeX,
    Math.abs(valjeanJavert.x2 - valjeanJavert.x1) + edgePad * 2,
  );
  const edgeH = Math.min(
    ih - edgeY,
    Math.abs(valjeanJavert.y2 - valjeanJavert.y1) + edgePad * 2,
  );

  // Rect for the degree anchor — parked around Marius (degree 4) so the
  // hit region is visibly over a mid-sized node rather than the hub.
  const marius = nodeById.get("marius")!;
  const mariusR = nodeRadius(marius.degree);
  const degreeRectX = Math.max(0, marius.x - mariusR - 6);
  const degreeRectY = Math.max(0, marius.y - mariusR - 6);
  const degreeRectW = Math.min(iw - degreeRectX, mariusR * 2 + 12);
  const degreeRectH = Math.min(ih - degreeRectY, mariusR * 2 + 12);

  // Rect for the hub anchor — tight around Valjean.
  const valjeanR = nodeRadius(valjean.degree);
  const hubRectX = Math.max(0, valjean.x - valjeanR - 8);
  const hubRectY = Math.max(0, valjean.y - valjeanR - 8);
  const hubRectW = Math.min(iw - hubRectX, valjeanR * 2 + 16);
  const hubRectH = Math.min(ih - hubRectY, valjeanR * 2 + 16);

  // Layout anchor — bottom caption, clamped inside the plot area.
  const layoutRectH = 18;
  const layoutRectY = Math.max(0, ih - layoutRectH - 2);

  return (
    <svg width={width} height={height} role="img" aria-label="Network diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Edges — drawn before nodes so nodes paint over them. */}
        <g data-data-layer="true">
          {edges.map((e) => (
            <line
              key={`${e.a}-${e.b}`}
              x1={e.x1}
              y1={e.y1}
              x2={e.x2}
              y2={e.y2}
              stroke="var(--color-ink)"
              strokeOpacity={0.32}
              strokeWidth={edgeWidth(e.weight)}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Nodes + labels. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const r = nodeRadius(n.degree);
            // Label offset — inner/centre nodes get labels below, outer-ring
            // labels are biased outward from the centre so they don't
            // collide with the hub.
            const dx = n.nx >= 0.5 ? 6 : -6;
            const dy = n.ny >= 0.5 ? 4 : -4;
            const labelX = n.x + (n.id === "valjean" ? 0 : dx);
            const labelY = n.y + (n.id === "valjean" ? r + 12 : dy);
            const anchor: "start" | "middle" | "end" =
              n.id === "valjean" ? "middle" : n.nx >= 0.5 ? "start" : "end";
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill="var(--color-ink)"
                  stroke="var(--color-surface)"
                  strokeWidth={1.5}
                />
                <text
                  x={labelX}
                  y={labelY}
                  textAnchor={anchor}
                  dominantBaseline={
                    n.id === "valjean"
                      ? "hanging"
                      : n.ny >= 0.5
                        ? "hanging"
                        : "alphabetic"
                  }
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                  fontWeight={n.id === "valjean" ? 600 : 400}
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. Hub — Valjean */}
        <ExplainAnchor
          selector="hub"
          index={1}
          pin={{ x: valjean.x + valjeanR + 16, y: valjean.y - valjeanR - 12 }}
          rect={{ x: hubRectX, y: hubRectY, width: hubRectW, height: hubRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Node (representative, degree encoding) — Marius */}
        <ExplainAnchor
          selector="node"
          index={2}
          pin={{ x: marius.x - mariusR - 18, y: marius.y - mariusR - 14 }}
          rect={{
            x: degreeRectX,
            y: degreeRectY,
            width: degreeRectW,
            height: degreeRectH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Edge — Valjean↔Javert co-appearance line */}
        <ExplainAnchor
          selector="edge"
          index={3}
          pin={{
            x: (valjeanJavert.x1 + valjeanJavert.x2) / 2,
            y: (valjeanJavert.y1 + valjeanJavert.y2) / 2 - 18,
          }}
          rect={{ x: edgeX, y: edgeY, width: edgeW, height: edgeH }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Community cluster — the Thénardier family subgroup */}
        <ExplainAnchor
          selector="community"
          index={4}
          pin={{
            x: Math.min(iw - 12, clusterX + clusterW + 6),
            y: Math.max(12, clusterY + 10),
          }}
          rect={{
            x: clusterX,
            y: clusterY,
            width: clusterW,
            height: clusterH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Layout convention — hand-placed ring arrangement */}
        <ExplainAnchor
          selector="layout"
          index={5}
          pin={{ x: iw - 18, y: Math.max(12, ih - 6) }}
          rect={{ x: 0, y: layoutRectY, width: iw, height: layoutRectH }}
        >
          <text
            x={0}
            y={ih - 4}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            HAND-LAID LAYOUT · CENTRE = HUB, INNER RING = PRIMARY TIES
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
