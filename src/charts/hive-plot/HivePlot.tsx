"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Three-axis hive plot of a small biological interactome. Each axis is a node
// category; node position along its axis encodes normalised connectivity
// (centrality). Edges arc between axes as cubic Bezier curves with the
// control points pulled toward the centre — this is the Krzywinski 2012
// deterministic layout that replaces the force-directed "hairball".

type AxisId = "protein" | "gene" | "metabolite";

interface Node {
  id: string;
  axis: AxisId;
  // 0..1 position along the axis (0 = near centre, 1 = outer tip)
  r: number;
  label: string;
}

interface Edge {
  source: string;
  target: string;
  // "activation" | "inhibition" | "binding" — encoded as stroke style
  kind: "activation" | "inhibition" | "binding";
}

// Axes at 0° (right), 120° (lower-left), 240° (upper-left). We rotate the
// canonical "top" axis to straight up by subtracting 90°. The final angles:
//   protein axis → -90° (straight up)
//   gene axis    → -90° + 120° = 30° (lower-right)
//   metabolite   → -90° + 240° = 150° (lower-left)
const AXIS_ANGLE_DEG: Record<AxisId, number> = {
  protein: -90,
  gene: 30,
  metabolite: 150,
};

const NODES: ReadonlyArray<Node> = [
  // Proteins — axis at top
  { id: "p1", axis: "protein", r: 0.95, label: "TP53" },
  { id: "p2", axis: "protein", r: 0.78, label: "MYC" },
  { id: "p3", axis: "protein", r: 0.6, label: "AKT1" },
  { id: "p4", axis: "protein", r: 0.42, label: "MDM2" },
  { id: "p5", axis: "protein", r: 0.24, label: "BAX" },
  // Genes — axis lower-right
  { id: "g1", axis: "gene", r: 0.9, label: "CDKN1A" },
  { id: "g2", axis: "gene", r: 0.72, label: "BCL2" },
  { id: "g3", axis: "gene", r: 0.54, label: "PTEN" },
  { id: "g4", axis: "gene", r: 0.36, label: "MYCN" },
  { id: "g5", axis: "gene", r: 0.2, label: "BBC3" },
  // Metabolites — axis lower-left
  { id: "m1", axis: "metabolite", r: 0.88, label: "ATP" },
  { id: "m2", axis: "metabolite", r: 0.7, label: "NAD+" },
  { id: "m3", axis: "metabolite", r: 0.5, label: "Glu" },
  { id: "m4", axis: "metabolite", r: 0.3, label: "Lac" },
];

const EDGES: ReadonlyArray<Edge> = [
  // protein ↔ gene (activation dominant — a protein turns on a gene)
  { source: "p1", target: "g1", kind: "activation" },
  { source: "p1", target: "g5", kind: "activation" },
  { source: "p2", target: "g4", kind: "activation" },
  { source: "p3", target: "g2", kind: "activation" },
  { source: "p4", target: "g3", kind: "inhibition" },
  { source: "p5", target: "g2", kind: "inhibition" },
  { source: "p1", target: "g3", kind: "activation" },
  // gene ↔ metabolite (binding — enzyme-substrate)
  { source: "g2", target: "m1", kind: "binding" },
  { source: "g3", target: "m3", kind: "binding" },
  { source: "g1", target: "m2", kind: "binding" },
  { source: "g4", target: "m4", kind: "binding" },
  // metabolite ↔ protein (inhibition — metabolite feedback)
  { source: "m1", target: "p3", kind: "inhibition" },
  { source: "m2", target: "p1", kind: "activation" },
  { source: "m3", target: "p2", kind: "binding" },
  { source: "m4", target: "p5", kind: "inhibition" },
];

function toRad(deg: number): number {
  return (deg * Math.PI) / 180;
}

interface Props {
  width: number;
  height: number;
}

export function HivePlot({ width, height }: Props) {
  const margin = { top: 22, right: 22, bottom: 30, left: 22 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const size = Math.min(iw, ih);
  const cx = iw / 2;
  const cy = ih / 2;
  // Leave room for axis labels at the tips.
  const axisLen = Math.max(0, size / 2 - 30);
  // Inner radius — nodes start a bit off-centre so the edges have a clean arc
  // through the middle rather than collapsing to a point.
  const innerR = Math.max(0, axisLen * 0.15);
  const outerR = axisLen;

  const nodeById = useMemo(() => {
    const m = new Map<string, Node>();
    for (const n of NODES) m.set(n.id, n);
    return m;
  }, []);

  // Convert a node to (x, y) in plot-centre coordinates (relative to cx, cy).
  const nodePos = (n: Node): { x: number; y: number } => {
    const r = innerR + n.r * (outerR - innerR);
    const rad = toRad(AXIS_ANGLE_DEG[n.axis]);
    return { x: Math.cos(rad) * r, y: Math.sin(rad) * r };
  };

  // Build a cubic Bezier path between two nodes, with control points pulled
  // toward the centre. This is the hive-plot signature: every edge arcs
  // gently through the middle rather than running straight across.
  const edgePath = (a: Node, b: Node): string => {
    const pa = nodePos(a);
    const pb = nodePos(b);
    // Control points sit on the same radial as each node but pulled inward
    // toward the centre — classic Krzywinski hive curve shape.
    const pullA = 0.35;
    const pullB = 0.35;
    const c1 = { x: pa.x * pullA, y: pa.y * pullA };
    const c2 = { x: pb.x * pullB, y: pb.y * pullB };
    return `M ${pa.x} ${pa.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${pb.x} ${pb.y}`;
  };

  const edgeStyle = (
    kind: Edge["kind"],
  ): { stroke: string; strokeOpacity: number; dash?: string } => {
    if (kind === "activation") {
      return { stroke: "var(--color-ink)", strokeOpacity: 0.45 };
    }
    if (kind === "inhibition") {
      return { stroke: "var(--color-ink)", strokeOpacity: 0.45, dash: "3 3" };
    }
    return { stroke: "var(--color-ink-mute)", strokeOpacity: 0.7 };
  };

  // --- Anchor targets -----------------------------------------------------
  // Axis anchor: use the protein axis (straight up).
  const proteinTipAngle = toRad(AXIS_ANGLE_DEG.protein);
  const proteinAxisMid = {
    x: cx + Math.cos(proteinTipAngle) * (innerR + outerR) / 2,
    y: cy + Math.sin(proteinTipAngle) * (innerR + outerR) / 2,
  };
  const proteinAxisTip = {
    x: cx + Math.cos(proteinTipAngle) * outerR,
    y: cy + Math.sin(proteinTipAngle) * outerR,
  };

  // Representative node: TP53 (highest-connectivity protein), near the tip.
  const tp53 = nodeById.get("p1")!;
  const tp53Local = nodePos(tp53);
  const tp53Abs = { x: cx + tp53Local.x, y: cy + tp53Local.y };

  // Representative edge: TP53 ↔ CDKN1A (strong activation).
  const edgeA = nodeById.get("p1")!;
  const edgeB = nodeById.get("g1")!;
  const edgeALocal = nodePos(edgeA);
  const edgeBLocal = nodePos(edgeB);
  // Midpoint of the Bezier (approx — just average start/end; good enough for
  // an anchor rect that simply needs to cover where the eye goes).
  const edgeMidAbs = {
    x: cx + (edgeALocal.x + edgeBLocal.x) / 2,
    y: cy + (edgeALocal.y + edgeBLocal.y) / 2,
  };

  // Radial position anchor: the TP53 position encodes high centrality — pin
  // a rect along the protein axis to explain "position = attribute".
  const proteinAxisNearCentre = {
    x: cx + Math.cos(proteinTipAngle) * innerR,
    y: cy + Math.sin(proteinTipAngle) * innerR,
  };

  // Centre anchor — the common origin of the three axes.
  const centreAbs = { x: cx, y: cy };

  // Axis-label anchor: the "PROTEIN" label at the tip of the top axis.
  const proteinLabelAbs = {
    x: proteinAxisTip.x,
    y: proteinAxisTip.y - 14,
  };

  // Clamp a rect into plot space.
  const clampRect = (r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const x = Math.max(0, r.x);
    const y = Math.max(0, r.y);
    const width = Math.max(0, Math.min(iw - x, r.x + r.width - x));
    const height = Math.max(0, Math.min(ih - y, r.y + r.height - y));
    return { x, y, width, height };
  };

  // Axis anchor rect — a thin strip along the protein axis.
  const axisRect = clampRect({
    x: proteinAxisTip.x - 10,
    y: Math.min(proteinAxisTip.y, centreAbs.y),
    width: 20,
    height: Math.abs(centreAbs.y - proteinAxisTip.y),
  });

  // Node anchor rect — small square over TP53.
  const nodeRect = clampRect({
    x: tp53Abs.x - 9,
    y: tp53Abs.y - 9,
    width: 18,
    height: 18,
  });

  // Edge anchor rect — centred on edge midpoint.
  const edgeRect = clampRect({
    x: edgeMidAbs.x - 22,
    y: edgeMidAbs.y - 22,
    width: 44,
    height: 44,
  });

  // Axis-position anchor rect — covers the lower half of the protein axis
  // (where a low-centrality protein WOULD sit) to explain the encoding rule.
  const posRect = clampRect({
    x: proteinAxisNearCentre.x - 10,
    y: proteinAxisNearCentre.y - 6,
    width: 20,
    height: Math.abs(proteinAxisMid.y - proteinAxisNearCentre.y) + 12,
  });

  // Centre anchor rect — small zone around the origin.
  const centreRect = clampRect({
    x: centreAbs.x - innerR - 6,
    y: centreAbs.y - innerR - 6,
    width: innerR * 2 + 12,
    height: innerR * 2 + 12,
  });

  // Axis-label anchor rect — around the PROTEIN label.
  const labelRect = clampRect({
    x: proteinAxisTip.x - 30,
    y: Math.max(0, proteinAxisTip.y - 22),
    width: 60,
    height: 18,
  });

  // Sort nodes: render nodes after edges so they sit on top.
  const axisTipLabels: Record<AxisId, string> = {
    protein: "PROTEIN",
    gene: "GENE",
    metabolite: "METABOLITE",
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Hive plot">
      <Group left={margin.left} top={margin.top}>
        <Group left={cx} top={cy}>
          <g data-data-layer="true">
            {/* Axes — three radial spines from origin to tip. */}
            {(Object.keys(AXIS_ANGLE_DEG) as AxisId[]).map((axis) => {
              const a = toRad(AXIS_ANGLE_DEG[axis]);
              const x1 = Math.cos(a) * innerR;
              const y1 = Math.sin(a) * innerR;
              const x2 = Math.cos(a) * outerR;
              const y2 = Math.sin(a) * outerR;
              return (
                <line
                  key={`axis-${axis}`}
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
              );
            })}

            {/* Axis tip labels. */}
            {(Object.keys(AXIS_ANGLE_DEG) as AxisId[]).map((axis) => {
              const a = toRad(AXIS_ANGLE_DEG[axis]);
              const x = Math.cos(a) * (outerR + 14);
              const y = Math.sin(a) * (outerR + 14);
              return (
                <text
                  key={`lbl-${axis}`}
                  x={x}
                  y={y}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={600}
                  fill="var(--color-ink)"
                >
                  {axisTipLabels[axis]}
                </text>
              );
            })}

            {/* Edges — drawn before nodes. */}
            <g fill="none">
              {EDGES.map((e, i) => {
                const a = nodeById.get(e.source);
                const b = nodeById.get(e.target);
                if (!a || !b) return null;
                const s = edgeStyle(e.kind);
                return (
                  <path
                    key={`e-${i}`}
                    d={edgePath(a, b)}
                    stroke={s.stroke}
                    strokeOpacity={s.strokeOpacity}
                    strokeWidth={1.3}
                    strokeDasharray={s.dash}
                    strokeLinecap="round"
                  />
                );
              })}
            </g>

            {/* Nodes — filled circles on each axis. */}
            <g>
              {NODES.map((n) => {
                const p = nodePos(n);
                const isHighlight = n.id === "p1";
                return (
                  <circle
                    key={n.id}
                    cx={p.x}
                    cy={p.y}
                    r={isHighlight ? 3.8 : 2.6}
                    fill="var(--color-ink)"
                  />
                );
              })}
            </g>
          </g>
        </Group>

        {/* Anchors — all coordinates expressed in outer-Group (plot) space. */}

        {/* 1. Radial axis — the protein spine. */}
        <ExplainAnchor
          selector="axis"
          index={1}
          pin={{
            x: Math.max(16, Math.min(iw - 16, proteinAxisTip.x + 22)),
            y: Math.max(16, Math.min(ih - 16, proteinAxisMid.y)),
          }}
          rect={axisRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Centre — the common origin. */}
        <ExplainAnchor
          selector="centre"
          index={2}
          pin={{ x: centreAbs.x, y: centreAbs.y - innerR - 16 }}
          rect={centreRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Node position on an axis — encodes attribute (centrality). */}
        <ExplainAnchor
          selector="axis-position"
          index={3}
          pin={{
            x: Math.max(16, Math.min(iw - 16, posRect.x - 16)),
            y: posRect.y + posRect.height / 2,
          }}
          rect={posRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Node — representative high-centrality protein (TP53). */}
        <ExplainAnchor
          selector="node"
          index={4}
          pin={{
            x: Math.max(16, Math.min(iw - 16, tp53Abs.x + 20)),
            y: Math.max(16, Math.min(ih - 16, tp53Abs.y - 10)),
          }}
          rect={nodeRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Edge — cubic Bezier curve between axes. */}
        <ExplainAnchor
          selector="edge"
          index={5}
          pin={{
            x: Math.max(16, Math.min(iw - 16, edgeMidAbs.x + 26)),
            y: Math.max(16, Math.min(ih - 16, edgeMidAbs.y + 10)),
          }}
          rect={edgeRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Axis label — names the category at the tip. */}
        <ExplainAnchor
          selector="axis-label"
          index={6}
          pin={{
            x: proteinLabelAbs.x,
            y: Math.max(10, proteinLabelAbs.y - 10),
          }}
          rect={labelRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
