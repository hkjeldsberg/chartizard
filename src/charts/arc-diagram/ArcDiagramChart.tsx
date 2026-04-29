"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Les Misérables co-appearance graph, simplified.
//
// Twenty-three characters are ordered along the baseline so community
// structure reads left-to-right: the Digne / religious prologue, the
// Valjean / Fantine early arc, the Thénardier family, Valjean↔Cosette↔Marius
// at the centre, and the Friends-of-the-ABC barricade cluster at the right.
// The ordering is hand-laid — the whole point of an arc diagram is that the
// node sequence is itself an editorial decision.

type NodeId =
  | "myriel"
  | "napoleon"
  | "mlle-baptistine"
  | "mme-magloire"
  | "valjean"
  | "fantine"
  | "tholomyes"
  | "thenardier"
  | "mme-thenardier"
  | "eponine"
  | "gavroche"
  | "cosette"
  | "javert"
  | "fauchelevent"
  | "marius"
  | "enjolras"
  | "combeferre"
  | "courfeyrac"
  | "feuilly"
  | "bossuet"
  | "joly"
  | "grantaire"
  | "mabeuf";

interface NodeSpec {
  id: NodeId;
  name: string;
}

// Node sequence along the baseline. Order matters — the arc pattern is
// only legible because adjacent characters share scenes.
const NODES: ReadonlyArray<NodeSpec> = [
  { id: "myriel", name: "Myriel" },
  { id: "napoleon", name: "Napoleon" },
  { id: "mlle-baptistine", name: "Mlle. Baptistine" },
  { id: "mme-magloire", name: "Mme. Magloire" },
  { id: "valjean", name: "Valjean" },
  { id: "fantine", name: "Fantine" },
  { id: "tholomyes", name: "Tholomyès" },
  { id: "thenardier", name: "Thénardier" },
  { id: "mme-thenardier", name: "Mme. Thénardier" },
  { id: "eponine", name: "Éponine" },
  { id: "gavroche", name: "Gavroche" },
  { id: "cosette", name: "Cosette" },
  { id: "javert", name: "Javert" },
  { id: "fauchelevent", name: "Fauchelevent" },
  { id: "marius", name: "Marius" },
  { id: "enjolras", name: "Enjolras" },
  { id: "combeferre", name: "Combeferre" },
  { id: "courfeyrac", name: "Courfeyrac" },
  { id: "feuilly", name: "Feuilly" },
  { id: "bossuet", name: "Bossuet" },
  { id: "joly", name: "Joly" },
  { id: "grantaire", name: "Grantaire" },
  { id: "mabeuf", name: "Mabeuf" },
];

interface EdgeSpec {
  a: NodeId;
  b: NodeId;
  weight: number;
}

// ~40 co-appearance arcs. Weights are approximate chapter co-occurrence
// counts from Knuth's tabulation, normalised to keep strokes readable.
const EDGES: ReadonlyArray<EdgeSpec> = [
  // Digne cluster — the bishop's household.
  { a: "myriel", b: "napoleon", weight: 1 },
  { a: "myriel", b: "mlle-baptistine", weight: 8 },
  { a: "myriel", b: "mme-magloire", weight: 10 },
  { a: "mlle-baptistine", b: "mme-magloire", weight: 6 },
  { a: "valjean", b: "myriel", weight: 5 },
  { a: "valjean", b: "mlle-baptistine", weight: 2 },
  { a: "valjean", b: "mme-magloire", weight: 3 },

  // Fantine arc.
  { a: "valjean", b: "fantine", weight: 9 },
  { a: "fantine", b: "tholomyes", weight: 4 },
  { a: "fantine", b: "cosette", weight: 4 },
  { a: "fantine", b: "javert", weight: 5 },

  // Thénardier family cluster.
  { a: "thenardier", b: "mme-thenardier", weight: 12 },
  { a: "thenardier", b: "eponine", weight: 8 },
  { a: "mme-thenardier", b: "eponine", weight: 6 },
  { a: "thenardier", b: "gavroche", weight: 4 },
  { a: "mme-thenardier", b: "gavroche", weight: 3 },
  { a: "thenardier", b: "cosette", weight: 5 },
  { a: "mme-thenardier", b: "cosette", weight: 4 },
  { a: "thenardier", b: "javert", weight: 6 },
  { a: "thenardier", b: "valjean", weight: 7 },
  { a: "eponine", b: "marius", weight: 7 },
  { a: "eponine", b: "gavroche", weight: 3 },

  // Valjean core.
  { a: "valjean", b: "cosette", weight: 14 },
  { a: "valjean", b: "javert", weight: 13 },
  { a: "valjean", b: "marius", weight: 6 },
  { a: "valjean", b: "fauchelevent", weight: 5 },
  { a: "cosette", b: "marius", weight: 10 },
  { a: "cosette", b: "javert", weight: 4 },
  { a: "cosette", b: "fauchelevent", weight: 4 },
  { a: "javert", b: "marius", weight: 3 },

  // Friends of the ABC — barricade cluster.
  { a: "marius", b: "enjolras", weight: 9 },
  { a: "marius", b: "courfeyrac", weight: 7 },
  { a: "marius", b: "combeferre", weight: 4 },
  { a: "marius", b: "mabeuf", weight: 3 },
  { a: "enjolras", b: "combeferre", weight: 8 },
  { a: "enjolras", b: "courfeyrac", weight: 8 },
  { a: "enjolras", b: "feuilly", weight: 5 },
  { a: "enjolras", b: "bossuet", weight: 5 },
  { a: "enjolras", b: "joly", weight: 4 },
  { a: "enjolras", b: "grantaire", weight: 6 },
  { a: "enjolras", b: "gavroche", weight: 4 },
  { a: "bossuet", b: "joly", weight: 6 },
  { a: "courfeyrac", b: "bossuet", weight: 4 },
  { a: "gavroche", b: "mabeuf", weight: 3 },
];

interface Props {
  width: number;
  height: number;
}

export function ArcDiagramChart({ width, height }: Props) {
  // Wide baseline, labels rotated below. Larger bottom margin for labels.
  const margin = { top: 24, right: 24, bottom: 84, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { nodePositions, nodeIndex } = useMemo(() => {
    const xScale = scaleLinear({
      domain: [0, NODES.length - 1],
      range: [0, iw],
    });
    const positions = NODES.map((n, i) => ({
      ...n,
      x: xScale(i),
      index: i,
    }));
    const byId = new Map(positions.map((n) => [n.id, n]));
    return { nodePositions: positions, nodeIndex: byId };
  }, [iw]);

  // Degree — for node sizing, same convention as NetworkChart.
  const degree = useMemo(() => {
    const d: Record<string, number> = {};
    for (const e of EDGES) {
      d[e.a] = (d[e.a] ?? 0) + 1;
      d[e.b] = (d[e.b] ?? 0) + 1;
    }
    return d;
  }, []);

  const nodeRadius = (id: string): number => 3 + Math.sqrt(degree[id] ?? 0) * 1.3;

  // Baseline sits in the bottom half; arcs rise above it.
  const baselineY = ih;
  const maxWeight = Math.max(...EDGES.map((e) => e.weight));

  // Arc stroke width encodes frequency.
  const strokeWidth = (weight: number): number =>
    0.5 + (weight / maxWeight) * 2.5;
  const strokeOpacity = (weight: number): number =>
    0.25 + (weight / maxWeight) * 0.5;

  // Ordered so heavier arcs paint on top.
  const sortedEdges = useMemo(
    () =>
      [...EDGES].sort((a, b) => a.weight - b.weight),
    [],
  );

  // Anchor targets.
  const valjean = nodeIndex.get("valjean")!;
  const cosette = nodeIndex.get("cosette")!;
  const thenardier = nodeIndex.get("thenardier")!;
  const eponine = nodeIndex.get("eponine")!;

  const valjeanCosetteArc = EDGES.find(
    (e) => e.a === "valjean" && e.b === "cosette",
  )!;

  // Arc geometry — semicircle of radius |x2 - x1|/2 centred at the midpoint.
  const arcPath = (x1: number, x2: number): string => {
    const r = Math.abs(x2 - x1) / 2;
    const sweep = x2 > x1 ? 0 : 1;
    return `M ${x1} ${baselineY} A ${r} ${r} 0 0 ${sweep} ${x2} ${baselineY}`;
  };

  // Rects for anchors — clamped to plot area.
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

  // Node anchor — Valjean, tight box around the dot.
  const valjeanR = nodeRadius("valjean");
  const nodeRect = clampRect(
    valjean.x - valjeanR - 6,
    baselineY - valjeanR - 6,
    valjeanR * 2 + 12,
    valjeanR * 2 + 12,
  );

  // Arc anchor — Valjean→Cosette.
  const vcMid = (valjean.x + cosette.x) / 2;
  const vcR = Math.abs(cosette.x - valjean.x) / 2;
  const arcRectX = Math.min(valjean.x, cosette.x);
  const arcRectY = Math.max(0, baselineY - vcR - 8);
  const arcRect = clampRect(
    arcRectX,
    arcRectY,
    Math.abs(cosette.x - valjean.x),
    baselineY - arcRectY,
  );

  // Baseline anchor — thin strip along the baseline.
  const baselineRect = clampRect(0, baselineY - 4, iw, 8);

  // Thénardier family cluster bundle anchor — bounding region of the triangle
  // of arcs between Thénardier, Mme. Thénardier, Éponine.
  const clusterXs = [thenardier.x, nodeIndex.get("mme-thenardier")!.x, eponine.x];
  const clusterLeft = Math.min(...clusterXs);
  const clusterRight = Math.max(...clusterXs);
  const clusterR = (clusterRight - clusterLeft) / 2;
  const clusterRect = clampRect(
    clusterLeft - 4,
    Math.max(0, baselineY - clusterR - 10),
    clusterRight - clusterLeft + 8,
    clusterR + 14,
  );

  // Node-ordering anchor — a thin ribbon just above the baseline spanning the
  // whole row, calling attention to the sequence itself.
  const orderRect = clampRect(0, baselineY - 14, iw, 12);

  // Legend anchor — upper-right of the plot.
  const legendW = 72;
  const legendH = 22;
  const legendX = Math.max(0, iw - legendW - 6);
  const legendY = 4;
  const legendRect = clampRect(legendX, legendY, legendW, legendH);

  return (
    <svg width={width} height={height} role="img" aria-label="Arc diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Arcs — drawn lightest-first so the thickest sit on top. */}
        <g data-data-layer="true" fill="none">
          {sortedEdges.map((e) => {
            const a = nodeIndex.get(e.a);
            const b = nodeIndex.get(e.b);
            if (!a || !b) return null;
            return (
              <path
                key={`${e.a}-${e.b}`}
                d={arcPath(a.x, b.x)}
                stroke="var(--color-ink)"
                strokeOpacity={strokeOpacity(e.weight)}
                strokeWidth={strokeWidth(e.weight)}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Baseline + nodes + labels. */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={baselineY}
            y2={baselineY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {nodePositions.map((n) => (
            <g key={n.id}>
              <circle
                cx={n.x}
                cy={baselineY}
                r={nodeRadius(n.id)}
                fill="var(--color-ink)"
                stroke="var(--color-surface)"
                strokeWidth={1.2}
              />
              <text
                transform={`translate(${n.x}, ${baselineY + 10}) rotate(45)`}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
                dominantBaseline="hanging"
              >
                {n.name}
              </text>
            </g>
          ))}
        </g>

        {/* Legend — arc-width encoding. */}
        <g data-data-layer="true">
          <path
            d={`M ${legendX + 4} ${legendY + 14} A 10 10 0 0 1 ${legendX + 24} ${legendY + 14}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.3}
            strokeWidth={0.8}
          />
          <path
            d={`M ${legendX + 28} ${legendY + 14} A 10 10 0 0 1 ${legendX + 48} ${legendY + 14}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth={1.6}
          />
          <path
            d={`M ${legendX + 52} ${legendY + 14} A 10 10 0 0 1 ${legendX + 68} ${legendY + 14}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity={0.75}
            strokeWidth={2.8}
          />
          <text
            x={legendX}
            y={legendY + 22}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            RARE ── OFTEN
          </text>
        </g>

        {/* Anchors */}

        {/* 1. Node — Valjean */}
        <ExplainAnchor
          selector="node"
          index={1}
          pin={{
            x: Math.min(iw - 12, valjean.x + 16),
            y: Math.max(12, baselineY - 20),
          }}
          rect={nodeRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Arc — Valjean↔Cosette (the signature co-appearance) */}
        <ExplainAnchor
          selector="arc"
          index={2}
          pin={{
            x: Math.min(iw - 12, vcMid),
            y: Math.max(12, baselineY - vcR - 10),
          }}
          rect={arcRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Baseline */}
        <ExplainAnchor
          selector="baseline"
          index={3}
          pin={{ x: Math.max(24, iw - 24), y: baselineY + 0 }}
          rect={baselineRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Arc-bundle cluster — the Thénardier family triangle */}
        <ExplainAnchor
          selector="cluster"
          index={4}
          pin={{
            x: Math.min(iw - 12, (clusterLeft + clusterRight) / 2),
            y: Math.max(12, baselineY - clusterR - 16),
          }}
          rect={clusterRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Node ordering — the editorial decision */}
        <ExplainAnchor
          selector="node-order"
          index={5}
          pin={{ x: Math.max(12, iw / 2), y: Math.max(12, baselineY - 16) }}
          rect={orderRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Arc-width legend */}
        <ExplainAnchor
          selector="arc-width"
          index={6}
          pin={{
            x: Math.max(12, legendX - 6),
            y: legendY + legendH / 2,
          }}
          rect={legendRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
