"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A classroom sociogram in the spirit of Moreno 1934. Fifteen students
// answered the sociometric prompt "who do you want to sit next to?"; the
// answers become directed ties (chooser → chosen). A handful of names
// collect many arrows — the stars; one or two collect none — the isolates.
// Positions are hand-laid and deterministic so the chart never drifts on
// re-render.

type NodeId =
  | "ana"
  | "ben"
  | "caro"
  | "dani"
  | "eli"
  | "fay"
  | "gus"
  | "hana"
  | "ivy"
  | "jon"
  | "kai"
  | "lia"
  | "mae"
  | "nils"
  | "oz";

interface NodeSpec {
  id: NodeId;
  name: string;
  // Normalised [0,1] coordinates inside the plot area.
  nx: number;
  ny: number;
}

// Layout: stars sit toward the centre-right, an isolate parks in the
// bottom-left corner, and the remaining students form a loose ring.
const NODES: ReadonlyArray<NodeSpec> = [
  { id: "ana", name: "Ana", nx: 0.52, ny: 0.38 }, // star
  { id: "ben", name: "Ben", nx: 0.68, ny: 0.58 }, // star
  { id: "caro", name: "Caro", nx: 0.38, ny: 0.58 }, // star
  { id: "dani", name: "Dani", nx: 0.22, ny: 0.32 },
  { id: "eli", name: "Eli", nx: 0.36, ny: 0.18 },
  { id: "fay", name: "Fay", nx: 0.56, ny: 0.14 },
  { id: "gus", name: "Gus", nx: 0.78, ny: 0.3 },
  { id: "hana", name: "Hana", nx: 0.86, ny: 0.52 },
  { id: "ivy", name: "Ivy", nx: 0.82, ny: 0.78 },
  { id: "jon", name: "Jon", nx: 0.58, ny: 0.82 },
  { id: "kai", name: "Kai", nx: 0.38, ny: 0.82 },
  { id: "lia", name: "Lia", nx: 0.2, ny: 0.72 },
  { id: "mae", name: "Mae", nx: 0.14, ny: 0.5 },
  { id: "nils", name: "Nils", nx: 0.06, ny: 0.92 }, // isolate
  { id: "oz", name: "Oz", nx: 0.94, ny: 0.08 }, // near-isolate
];

interface EdgeSpec {
  from: NodeId;
  to: NodeId;
}

// Directed nominations. Ana, Ben, Caro collect the most arrows = stars.
// Nils and Oz receive none = isolates.
const EDGES: ReadonlyArray<EdgeSpec> = [
  // Everyone nominates a star.
  { from: "dani", to: "ana" },
  { from: "eli", to: "ana" },
  { from: "fay", to: "ana" },
  { from: "gus", to: "ben" },
  { from: "hana", to: "ben" },
  { from: "ivy", to: "ben" },
  { from: "lia", to: "caro" },
  { from: "mae", to: "caro" },
  { from: "kai", to: "caro" },
  // Stars nominate each other.
  { from: "ana", to: "ben" },
  { from: "ben", to: "caro" },
  { from: "caro", to: "ana" },
  // Some peripheral nominations.
  { from: "fay", to: "eli" },
  { from: "eli", to: "dani" },
  { from: "dani", to: "mae" },
  { from: "hana", to: "gus" },
  { from: "gus", to: "ana" },
  { from: "jon", to: "ben" },
  { from: "kai", to: "jon" },
  { from: "lia", to: "mae" },
  { from: "ivy", to: "hana" },
  { from: "jon", to: "kai" },
];

interface Props {
  width: number;
  height: number;
}

export function Sociogram({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 32, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { nodes, edges, nodeById } = useMemo(() => {
    const padX = 18;
    const padY = 18;
    const px = (nx: number) => padX + nx * Math.max(0, iw - 2 * padX);
    const py = (ny: number) => padY + ny * Math.max(0, ih - 2 * padY);

    // In-degree = arrows coming IN. That's the sociometric status measure.
    const indeg: Record<string, number> = {};
    for (const e of EDGES) {
      indeg[e.to] = (indeg[e.to] ?? 0) + 1;
    }

    const resolvedNodes = NODES.map((n) => ({
      ...n,
      x: px(n.nx),
      y: py(n.ny),
      indeg: indeg[n.id] ?? 0,
    }));

    const byId = new Map(resolvedNodes.map((n) => [n.id, n]));

    const resolvedEdges = EDGES.map((e) => {
      const a = byId.get(e.from)!;
      const b = byId.get(e.to)!;
      return { ...e, x1: a.x, y1: a.y, x2: b.x, y2: b.y };
    });

    return { nodes: resolvedNodes, edges: resolvedEdges, nodeById: byId };
  }, [iw, ih]);

  // Node radius scales with in-degree — stars visibly larger than isolates.
  const nodeRadius = (indeg: number) => 3.8 + Math.sqrt(indeg) * 3.4;
  const arrowId = "sociogram-arrow";

  // Compute edge geometry that stops short of each endpoint circle so the
  // arrowhead lands on the node's edge rather than behind it.
  function trim(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    r1: number,
    r2: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * r1,
      y1: y1 + uy * r1,
      x2: x2 - ux * r2,
      y2: y2 - uy * r2,
    };
  }

  const ana = nodeById.get("ana")!;
  const nils = nodeById.get("nils")!;
  const dani = nodeById.get("dani")!;
  const daniAnaEdge = edges.find((e) => e.from === "dani" && e.to === "ana")!;

  // Anchor hit regions, clamped to plot area.
  const anaR = nodeRadius(ana.indeg);
  const starRectX = Math.max(0, ana.x - anaR - 10);
  const starRectY = Math.max(0, ana.y - anaR - 10);
  const starRectW = Math.min(iw - starRectX, anaR * 2 + 20);
  const starRectH = Math.min(ih - starRectY, anaR * 2 + 20);

  const nilsR = nodeRadius(nils.indeg);
  const isoRectX = Math.max(0, nils.x - nilsR - 12);
  const isoRectY = Math.max(0, nils.y - nilsR - 12);
  const isoRectW = Math.min(iw - isoRectX, nilsR * 2 + 24);
  const isoRectH = Math.min(ih - isoRectY, nilsR * 2 + 24);

  const daniR = nodeRadius(dani.indeg);
  const nodeRectX = Math.max(0, dani.x - daniR - 8);
  const nodeRectY = Math.max(0, dani.y - daniR - 8);
  const nodeRectW = Math.min(iw - nodeRectX, daniR * 2 + 16);
  const nodeRectH = Math.min(ih - nodeRectY, daniR * 2 + 16);

  const edgePad = 10;
  const edgeMinX = Math.min(daniAnaEdge.x1, daniAnaEdge.x2) - edgePad;
  const edgeMinY = Math.min(daniAnaEdge.y1, daniAnaEdge.y2) - edgePad;
  const edgeRectX = Math.max(0, edgeMinX);
  const edgeRectY = Math.max(0, edgeMinY);
  const edgeRectW = Math.min(
    iw - edgeRectX,
    Math.abs(daniAnaEdge.x2 - daniAnaEdge.x1) + edgePad * 2,
  );
  const edgeRectH = Math.min(
    ih - edgeRectY,
    Math.abs(daniAnaEdge.y2 - daniAnaEdge.y1) + edgePad * 2,
  );

  // Caption band for the layout/prompt anchor, along the bottom of the plot.
  const captionH = 16;
  const captionY = Math.max(0, ih - captionH - 2);

  return (
    <svg width={width} height={height} role="img" aria-label="Sociogram">
      <defs>
        <marker
          id={arrowId}
          viewBox="0 0 10 10"
          refX={8}
          refY={5}
          markerWidth={6}
          markerHeight={6}
          orient="auto-start-reverse"
        >
          <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink)" />
        </marker>
      </defs>
      <Group left={margin.left} top={margin.top}>
        {/* Directed arrows — painted before nodes so nodes sit on top. */}
        <g data-data-layer="true">
          {edges.map((e) => {
            const fromNode = nodeById.get(e.from)!;
            const toNode = nodeById.get(e.to)!;
            const r1 = nodeRadius(fromNode.indeg);
            const r2 = nodeRadius(toNode.indeg) + 2; // extra gap for arrowhead
            const t = trim(e.x1, e.y1, e.x2, e.y2, r1, r2);
            return (
              <line
                key={`${e.from}-${e.to}`}
                x1={t.x1}
                y1={t.y1}
                x2={t.x2}
                y2={t.y2}
                stroke="var(--color-ink)"
                strokeOpacity={0.42}
                strokeWidth={1.1}
                strokeLinecap="round"
                markerEnd={`url(#${arrowId})`}
              />
            );
          })}
        </g>

        {/* Nodes + labels. Stars drawn filled; isolates drawn with a hollow
            ring so the "received zero nominations" reads visually. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const r = nodeRadius(n.indeg);
            const isStar = n.indeg >= 4;
            const isIsolate = n.indeg === 0;
            const labelDX = n.nx >= 0.5 ? r + 4 : -(r + 4);
            const anchor: "start" | "end" = n.nx >= 0.5 ? "start" : "end";
            return (
              <g key={n.id}>
                <circle
                  cx={n.x}
                  cy={n.y}
                  r={r}
                  fill={isIsolate ? "var(--color-surface)" : "var(--color-ink)"}
                  stroke="var(--color-ink)"
                  strokeWidth={isIsolate ? 1.2 : 1}
                  strokeDasharray={isIsolate ? "2 2" : undefined}
                />
                {isStar && (
                  <circle
                    cx={n.x}
                    cy={n.y}
                    r={r + 3}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={0.8}
                  />
                )}
                <text
                  x={n.x + labelDX}
                  y={n.y + 3}
                  textAnchor={anchor}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                  fontWeight={isStar ? 600 : 400}
                >
                  {n.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. Star — high in-degree node */}
        <ExplainAnchor
          selector="star"
          index={1}
          pin={{ x: Math.min(iw - 10, ana.x + anaR + 14), y: Math.max(10, ana.y - anaR - 14) }}
          rect={{ x: starRectX, y: starRectY, width: starRectW, height: starRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Node — a representative classmate */}
        <ExplainAnchor
          selector="node"
          index={2}
          pin={{ x: Math.max(10, dani.x - daniR - 16), y: Math.max(10, dani.y - daniR - 14) }}
          rect={{ x: nodeRectX, y: nodeRectY, width: nodeRectW, height: nodeRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Directed tie — the Dani→Ana nomination arrow */}
        <ExplainAnchor
          selector="tie"
          index={3}
          pin={{
            x: (daniAnaEdge.x1 + daniAnaEdge.x2) / 2 + 14,
            y: (daniAnaEdge.y1 + daniAnaEdge.y2) / 2 - 14,
          }}
          rect={{ x: edgeRectX, y: edgeRectY, width: edgeRectW, height: edgeRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Isolate — a classmate with zero incoming ties */}
        <ExplainAnchor
          selector="isolate"
          index={4}
          pin={{
            x: Math.min(iw - 10, nils.x + nilsR + 14),
            y: Math.min(ih - 10, nils.y + nilsR + 12),
          }}
          rect={{ x: isoRectX, y: isoRectY, width: isoRectW, height: isoRectH }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Sociometric prompt — the question the chart answers */}
        <ExplainAnchor
          selector="prompt"
          index={5}
          pin={{ x: iw - 14, y: Math.max(10, ih - 6) }}
          rect={{ x: 0, y: captionY, width: iw, height: captionH }}
        >
          <text
            x={0}
            y={ih - 4}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            PROMPT: &quot;WHO DO YOU WANT TO SIT NEXT TO?&quot;
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
