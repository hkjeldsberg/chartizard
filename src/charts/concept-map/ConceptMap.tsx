"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Concept Map — Joseph Novak (Cornell, 1972).
// Subject: the water cycle.
// Hierarchical top-to-bottom layout. Every edge carries a relationship phrase;
// two cross-links (Sun → evaporation-pathway, Gravity → Rain) run across the
// hierarchy and are what distinguishes a concept map from a plain tree.

interface Props {
  width: number;
  height: number;
}

type NodeShape = "ellipse" | "rounded";

interface Node {
  id: string;
  label: string;
  // 0..100 × 0..100 layout space.
  cx: number;
  cy: number;
  w: number;
  h: number;
  shape: NodeShape;
}

interface Edge {
  id: string;
  from: string;
  to: string;
  // Edge label (the relationship / proposition).
  label: string;
  // Bend controls the curvature. Positive curves one way, negative the other.
  bend?: number;
  // Cross-link edges are drawn dashed and slightly heavier for emphasis.
  crossLink?: boolean;
}

// ---- Node layout ----------------------------------------------------
// Four conceptual rows:
//   Row 0 (top):    Water (root)
//   Row 1:          Liquid, Solid, Gas
//   Row 2:          Rivers, Oceans, Glaciers, Clouds
//   Row 3 (leaves): Rain
// Plus off-hierarchy concepts: Sun (left), Gravity (right), wired in as
// cross-links rather than parent-child relationships.

const NODES: ReadonlyArray<Node> = [
  // Root
  { id: "water", label: "Water", cx: 50, cy: 8, w: 18, h: 10, shape: "ellipse" },

  // Phase row
  { id: "liquid", label: "Liquid", cx: 22, cy: 34, w: 17, h: 10, shape: "ellipse" },
  { id: "solid",  label: "Solid (Ice)", cx: 50, cy: 34, w: 20, h: 10, shape: "ellipse" },
  { id: "gas",    label: "Gas (Vapor)", cx: 78, cy: 34, w: 20, h: 10, shape: "ellipse" },

  // Forms row
  { id: "rivers",   label: "Rivers",   cx: 10, cy: 62, w: 16, h: 9, shape: "rounded" },
  { id: "oceans",   label: "Oceans",   cx: 28, cy: 62, w: 16, h: 9, shape: "rounded" },
  { id: "glaciers", label: "Glaciers", cx: 50, cy: 62, w: 17, h: 9, shape: "rounded" },
  { id: "clouds",   label: "Clouds",   cx: 78, cy: 62, w: 16, h: 9, shape: "rounded" },

  // Leaf row
  { id: "rain",     label: "Rain",     cx: 78, cy: 88, w: 14, h: 9, shape: "rounded" },

  // Cross-link source concepts
  { id: "sun",      label: "Sun",      cx: 4,  cy: 88, w: 12, h: 9, shape: "ellipse" },
  { id: "gravity",  label: "Gravity",  cx: 96, cy: 88, w: 16, h: 9, shape: "ellipse" },
];

const EDGES: ReadonlyArray<Edge> = [
  // Root → phases
  { id: "w-liquid", from: "water", to: "liquid", label: "exists as", bend: -6 },
  { id: "w-solid",  from: "water", to: "solid",  label: "exists as" },
  { id: "w-gas",    from: "water", to: "gas",    label: "exists as", bend: 6 },

  // Phase transitions (sideways, within row 1)
  { id: "liquid-gas",  from: "liquid", to: "gas",    label: "evaporates into", bend: -18, crossLink: true },
  { id: "gas-liquid",  from: "gas",    to: "liquid", label: "condenses into",  bend: -18, crossLink: true },
  { id: "solid-liquid", from: "solid", to: "liquid", label: "melts into",      bend: 6 },

  // Phase → forms
  { id: "liquid-rivers",  from: "liquid", to: "rivers", label: "includes", bend: -4 },
  { id: "liquid-oceans",  from: "liquid", to: "oceans", label: "includes", bend: 4 },
  { id: "solid-glaciers", from: "solid",  to: "glaciers", label: "includes" },
  { id: "gas-clouds",     from: "gas",    to: "clouds", label: "forms" },

  // Form → leaf
  { id: "clouds-rain", from: "clouds", to: "rain", label: "produce" },

  // Cross-links (non-hierarchical)
  { id: "sun-gas",      from: "sun",     to: "gas",  label: "drives",     bend: -26, crossLink: true },
  { id: "gravity-rain", from: "gravity", to: "rain", label: "pulls down", bend: 6,   crossLink: true },
];

const MARKER = "cmap-arrow";

export function ConceptMap({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 20, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // --- Anchor computation on ellipse/rounded perimeter ---------------
  function perimeter(node: Node, towards: { x: number; y: number }) {
    const cx = px(node.cx);
    const cy = py(node.cy);
    const hw = px(node.w) / 2;
    const hh = py(node.h) / 2;
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    if (node.shape === "ellipse") {
      const len = Math.hypot(dx / hw, dy / hh) || 1;
      return { x: cx + dx / len, y: cy + dy / len };
    }
    // Rounded rectangle — approximate by clipping a ray on the bounding box.
    const absDx = Math.abs(dx) || 1;
    const absDy = Math.abs(dy) || 1;
    const tx = hw / absDx;
    const ty = hh / absDy;
    const t = Math.min(tx, ty);
    return { x: cx + dx * t, y: cy + dy * t };
  }

  interface EdgeGeom {
    d: string;
    midX: number;
    midY: number;
    headX: number;
    headY: number;
  }

  function buildEdge(e: Edge): EdgeGeom {
    const from = nodeById.get(e.from)!;
    const to = nodeById.get(e.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const start = perimeter(from, toC);
    const end = perimeter(to, fromC);

    const mx = (start.x + end.x) / 2;
    const my = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const len = Math.hypot(dx, dy) || 1;
    const nx = -dy / len;
    const ny = dx / len;
    const bendPx = (e.bend ?? 0) * Math.min(px(1), py(1)) * 1.0;
    const cpX = mx + nx * bendPx;
    const cpY = my + ny * bendPx;

    const d = `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;
    // Label anchor = the curve's point at t = 0.5 (approximation: the midpoint
    // between the midpoint of endpoints and the control point).
    const labelX = (mx + cpX) / 2;
    const labelY = (my + cpY) / 2;
    return { d, midX: labelX, midY: labelY, headX: end.x, headY: end.y };
  }

  const edgeGeoms = new Map(EDGES.map((e) => [e.id, buildEdge(e)]));

  // --- Rendering -----------------------------------------------------

  function renderNode(n: Node) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const w = px(n.w);
    const h = py(n.h);
    const fontSize = Math.max(8, Math.min(10.5, iw * 0.022));
    if (n.shape === "ellipse") {
      return (
        <g key={`n-${n.id}`}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={w / 2}
            ry={h / 2}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fill="var(--color-ink)"
          >
            {n.label}
          </text>
        </g>
      );
    }
    return (
      <g key={`n-${n.id}`}>
        <rect
          x={cx - w / 2}
          y={cy - h / 2}
          width={w}
          height={h}
          rx={Math.min(w, h) / 3}
          ry={Math.min(w, h) / 3}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.2}
        />
        <text
          x={cx}
          y={cy + 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill="var(--color-ink)"
        >
          {n.label}
        </text>
      </g>
    );
  }

  function renderEdgeLabel(geom: EdgeGeom, label: string) {
    // Text + a small background rect so the phrase is readable over the edge.
    const fontSize = Math.max(7, Math.min(9, iw * 0.018));
    const approxW = label.length * fontSize * 0.55 + 6;
    const rectH = fontSize + 4;
    return (
      <g>
        <rect
          x={geom.midX - approxW / 2}
          y={geom.midY - rectH / 2}
          width={approxW}
          height={rectH}
          fill="var(--color-surface)"
          stroke="none"
          rx={2}
          ry={2}
          opacity={0.92}
        />
        <text
          x={geom.midX}
          y={geom.midY + fontSize / 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill="var(--color-ink-soft)"
        >
          {label}
        </text>
      </g>
    );
  }

  // --- Representative geometry for anchors ---------------------------

  const waterNode = nodeById.get("water")!;
  const liquidNode = nodeById.get("liquid")!;
  const rainNode = nodeById.get("rain")!;
  const sunNode = nodeById.get("sun")!;
  const wLiquidGeom = edgeGeoms.get("w-liquid")!;
  const sunGasGeom = edgeGeoms.get("sun-gas")!;

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Concept Map">
      <defs>
        <marker
          id={MARKER}
          markerWidth={6}
          markerHeight={6}
          refX={5.5}
          refY={3}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 6,3 0,6" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Edges (curves) — drawn before nodes so nodes cover endpoints cleanly. */}
        <g data-data-layer="true">
          {EDGES.map((e) => {
            const geom = edgeGeoms.get(e.id)!;
            return (
              <path
                key={`edge-${e.id}`}
                d={geom.d}
                fill="none"
                stroke={e.crossLink ? "var(--color-ink)" : "var(--color-ink-mute)"}
                strokeWidth={e.crossLink ? 1.0 : 0.9}
                strokeDasharray={e.crossLink ? "3 3" : undefined}
                opacity={e.crossLink ? 0.85 : 0.9}
                markerEnd={`url(#${MARKER})`}
              />
            );
          })}
        </g>

        {/* Edge labels */}
        <g data-data-layer="true">
          {EDGES.map((e) => {
            const geom = edgeGeoms.get(e.id)!;
            return (
              <g key={`elbl-${e.id}`}>{renderEdgeLabel(geom, e.label)}</g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. Root concept node (Water, top) */}
        <ExplainAnchor
          selector="root-concept"
          index={1}
          pin={{ x: px(waterNode.cx), y: py(waterNode.cy) - py(waterNode.h) / 2 - 10 }}
          rect={clamp({
            x: px(waterNode.cx) - px(waterNode.w) / 2 - 2,
            y: py(waterNode.cy) - py(waterNode.h) / 2 - 2,
            width: px(waterNode.w) + 4,
            height: py(waterNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. A concept node (mid-hierarchy — Liquid) */}
        <ExplainAnchor
          selector="concept-node"
          index={2}
          pin={{ x: px(liquidNode.cx) - px(liquidNode.w) / 2 - 12, y: py(liquidNode.cy) }}
          rect={clamp({
            x: px(liquidNode.cx) - px(liquidNode.w) / 2 - 2,
            y: py(liquidNode.cy) - py(liquidNode.h) / 2 - 2,
            width: px(liquidNode.w) + 4,
            height: py(liquidNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Labelled relationship arrow (Water → Liquid with "exists as") */}
        <ExplainAnchor
          selector="labelled-edge"
          index={3}
          pin={{ x: wLiquidGeom.midX - 18, y: wLiquidGeom.midY - 12 }}
          rect={clamp({
            x: wLiquidGeom.midX - 30,
            y: wLiquidGeom.midY - 10,
            width: 60,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Cross-link (Sun → Gas, non-hierarchical, dashed) */}
        <ExplainAnchor
          selector="cross-link"
          index={4}
          pin={{ x: sunGasGeom.midX, y: sunGasGeom.midY + 14 }}
          rect={clamp({
            x: sunGasGeom.midX - 34,
            y: sunGasGeom.midY - 14,
            width: 68,
            height: 28,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Third-level leaf (Rain — a terminal node two hops from root) */}
        <ExplainAnchor
          selector="leaf-concept"
          index={5}
          pin={{ x: px(rainNode.cx) - px(rainNode.w) / 2 - 12, y: py(rainNode.cy) }}
          rect={clamp({
            x: px(rainNode.cx) - px(rainNode.w) / 2 - 2,
            y: py(rainNode.cy) - py(rainNode.h) / 2 - 2,
            width: px(rainNode.w) + 4,
            height: py(rainNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Proposition (edge as testable claim) — anchor the Sun node
             together with its outgoing "drives" arrow, which reads as the
             proposition "Sun drives evaporation". */}
        <ExplainAnchor
          selector="proposition"
          index={6}
          pin={{ x: px(sunNode.cx), y: py(sunNode.cy) - py(sunNode.h) / 2 - 10 }}
          rect={clamp({
            x: px(sunNode.cx) - px(sunNode.w) / 2 - 2,
            y: py(sunNode.cy) - py(sunNode.h) / 2 - 2,
            width: px(sunNode.w) + 4,
            height: py(sunNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Hierarchical top-to-bottom layout — anchor the whole plot area. */}
        <ExplainAnchor
          selector="hierarchy"
          index={7}
          pin={{ x: iw - 14, y: 14 }}
          rect={clamp({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
