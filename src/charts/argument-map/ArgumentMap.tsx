"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Argument Map — Toulmin (1958), Horn (1998).
// Subject: "Pluto is a planet" — the textbook argument-mapping example.
// Tree/DAG of claims: a root claim at the top, supporting and opposing reasons
// beneath it, and rebuttals beneath the objections. Fill/outline distinguishes
// the three roles: supporting (filled), opposing (outlined-red), rebuttal
// (dashed outline). Edges carry short illocutionary labels — "supports",
// "objects to", "rebuts" — so the diagram reads as a DAG of speech acts.

interface Props {
  width: number;
  height: number;
}

type ClaimRole = "root" | "support" | "oppose" | "rebut";

interface ClaimNode {
  id: string;
  // Layout space: 0..100 × 0..100.
  cx: number;
  cy: number;
  w: number;
  h: number;
  role: ClaimRole;
  lines: ReadonlyArray<string>;
}

interface ArgEdge {
  id: string;
  // Child → parent (reasons point UP to the claim they address).
  from: string;
  to: string;
  relation: "supports" | "objects to" | "rebuts";
}

const NODES: ReadonlyArray<ClaimNode> = [
  // Root claim (top).
  {
    id: "root",
    cx: 50,
    cy: 10,
    w: 40,
    h: 13,
    role: "root",
    lines: ["Pluto is a planet"],
  },

  // Supporting reasons (row 2, left three nodes).
  {
    id: "orbits-sun",
    cx: 14,
    cy: 44,
    w: 24,
    h: 15,
    role: "support",
    lines: ["Orbits the", "Sun directly"],
  },
  {
    id: "round-shape",
    cx: 40,
    cy: 44,
    w: 22,
    h: 15,
    role: "support",
    lines: ["Gravity-rounded", "spherical shape"],
  },
  {
    id: "historical",
    cx: 64,
    cy: 44,
    w: 22,
    h: 15,
    role: "support",
    lines: ["Classified as", "planet 1930–2006"],
  },

  // Opposing reasons (row 2, right two nodes).
  {
    id: "iau-criterion",
    cx: 87,
    cy: 44,
    w: 22,
    h: 17,
    role: "oppose",
    lines: ["IAU 2006: has not", "cleared its", "orbital neighbourhood"],
  },
  // Second opposition sits a row below so the tree fits a rectangle.
  {
    id: "too-small",
    cx: 76,
    cy: 75,
    w: 22,
    h: 15,
    role: "oppose",
    lines: ["Smaller than", "Earth's Moon"],
  },

  // Rebuttals (row 3, below each objection).
  {
    id: "rebut-arbitrary",
    cx: 94,
    cy: 78,
    w: 22,
    h: 17,
    role: "rebut",
    lines: ["\"Clearing\" criterion", "is arbitrary — Earth", "shares its orbit too"],
  },
  {
    id: "rebut-size",
    cx: 52,
    cy: 78,
    w: 22,
    h: 15,
    role: "rebut",
    lines: ["Size is not part", "of the IAU definition"],
  },
];

const EDGES: ReadonlyArray<ArgEdge> = [
  { id: "e-orbits",     from: "orbits-sun",      to: "root",           relation: "supports" },
  { id: "e-round",      from: "round-shape",     to: "root",           relation: "supports" },
  { id: "e-hist",       from: "historical",      to: "root",           relation: "supports" },
  { id: "e-iau",        from: "iau-criterion",   to: "root",           relation: "objects to" },
  { id: "e-small",      from: "too-small",       to: "root",           relation: "objects to" },
  { id: "e-rebut-arb",  from: "rebut-arbitrary", to: "iau-criterion",  relation: "rebuts" },
  { id: "e-rebut-size", from: "rebut-size",      to: "too-small",      relation: "rebuts" },
];

const MARKER_SUPPORT = "argmap-arrow-support";
const MARKER_OPPOSE  = "argmap-arrow-oppose";
const MARKER_REBUT   = "argmap-arrow-rebut";

export function ArgumentMap({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // Colour / stroke style by role.
  function roleStyle(role: ClaimRole) {
    switch (role) {
      case "root":
        return {
          fill: "var(--color-ink)",
          textFill: "var(--color-page)",
          stroke: "var(--color-ink)",
          strokeWidth: 1.4,
          dash: undefined as string | undefined,
        };
      case "support":
        return {
          fill: "var(--color-ink-soft)",
          textFill: "var(--color-page)",
          stroke: "var(--color-ink)",
          strokeWidth: 1.2,
          dash: undefined,
        };
      case "oppose":
        return {
          fill: "var(--color-surface)",
          textFill: "var(--color-ink)",
          stroke: "var(--color-ink)",
          strokeWidth: 1.8,
          dash: undefined,
        };
      case "rebut":
        return {
          fill: "var(--color-surface)",
          textFill: "var(--color-ink-soft)",
          stroke: "var(--color-ink-mute)",
          strokeWidth: 1.0,
          dash: "3 3",
        };
    }
  }

  function edgeStyle(rel: ArgEdge["relation"]) {
    switch (rel) {
      case "supports":
        return { stroke: "var(--color-ink)", dash: undefined as string | undefined, marker: MARKER_SUPPORT };
      case "objects to":
        return { stroke: "var(--color-ink)", dash: "5 3", marker: MARKER_OPPOSE };
      case "rebuts":
        return { stroke: "var(--color-ink-mute)", dash: "2 3", marker: MARKER_REBUT };
    }
  }

  // Edge endpoint on the rectangular node border, aimed at `towards`.
  function borderPoint(node: ClaimNode, towards: { x: number; y: number }) {
    const cx = px(node.cx);
    const cy = py(node.cy);
    const hw = px(node.w) / 2;
    const hh = py(node.h) / 2;
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    const absDx = Math.abs(dx) || 0.0001;
    const absDy = Math.abs(dy) || 0.0001;
    const t = Math.min(hw / absDx, hh / absDy);
    return { x: cx + dx * t, y: cy + dy * t };
  }

  interface EdgeGeom {
    d: string;
    midX: number;
    midY: number;
    headX: number;
    headY: number;
  }

  function buildEdge(e: ArgEdge): EdgeGeom {
    const from = nodeById.get(e.from)!;
    const to   = nodeById.get(e.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC   = { x: px(to.cx),   y: py(to.cy)   };
    const start = borderPoint(from, toC);
    const end   = borderPoint(to,   fromC);
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const d = `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
    return { d, midX, midY, headX: end.x, headY: end.y };
  }

  const edgeGeoms = new Map(EDGES.map((e) => [e.id, buildEdge(e)]));

  function renderNode(n: ClaimNode) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const w = px(n.w);
    const h = py(n.h);
    const s = roleStyle(n.role);
    const fontSize = Math.max(7.5, Math.min(10, iw * 0.019));
    const lineH = fontSize + 1.5;
    const totalH = n.lines.length * lineH;
    return (
      <g key={`node-${n.id}`}>
        <rect
          x={cx - w / 2}
          y={cy - h / 2}
          width={w}
          height={h}
          rx={4}
          ry={4}
          fill={s.fill}
          stroke={s.stroke}
          strokeWidth={s.strokeWidth}
          strokeDasharray={s.dash}
        />
        {n.lines.map((line, i) => (
          <text
            key={i}
            x={cx}
            y={cy - totalH / 2 + (i + 0.75) * lineH}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={fontSize}
            fontWeight={n.role === "root" ? 600 : 400}
            fill={s.textFill}
          >
            {line}
          </text>
        ))}
      </g>
    );
  }

  function renderEdgeLabel(geom: EdgeGeom, rel: ArgEdge["relation"]) {
    const fontSize = Math.max(6.5, Math.min(8.5, iw * 0.016));
    const approxW = rel.length * fontSize * 0.55 + 6;
    const rectH = fontSize + 3;
    return (
      <g>
        <rect
          x={geom.midX - approxW / 2}
          y={geom.midY - rectH / 2}
          width={approxW}
          height={rectH}
          fill="var(--color-surface)"
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
          {rel}
        </text>
      </g>
    );
  }

  // Representative nodes / edges for anchors.
  const rootNode    = nodeById.get("root")!;
  const supportNode = nodeById.get("orbits-sun")!;
  const opposeNode  = nodeById.get("iau-criterion")!;
  const rebutNode   = nodeById.get("rebut-arbitrary")!;
  const supportEdge = edgeGeoms.get("e-orbits")!;
  const opposeEdge  = edgeGeoms.get("e-iau")!;
  const rebutEdge   = edgeGeoms.get("e-rebut-arb")!;

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Argument Map">
      <defs>
        <marker
          id={MARKER_SUPPORT}
          markerWidth={7}
          markerHeight={7}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 7,3.5 0,7" fill="var(--color-ink)" />
        </marker>
        <marker
          id={MARKER_OPPOSE}
          markerWidth={7}
          markerHeight={7}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 7,3.5 0,7" fill="var(--color-ink)" />
        </marker>
        <marker
          id={MARKER_REBUT}
          markerWidth={7}
          markerHeight={7}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 7,3.5 0,7" fill="var(--color-ink-mute)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Edges first, so nodes cover the endpoints. */}
        <g data-data-layer="true">
          {EDGES.map((e) => {
            const geom = edgeGeoms.get(e.id)!;
            const s = edgeStyle(e.relation);
            return (
              <path
                key={`edge-${e.id}`}
                d={geom.d}
                fill="none"
                stroke={s.stroke}
                strokeWidth={1.1}
                strokeDasharray={s.dash}
                markerEnd={`url(#${s.marker})`}
              />
            );
          })}
        </g>

        {/* Edge labels */}
        <g data-data-layer="true">
          {EDGES.map((e) => {
            const geom = edgeGeoms.get(e.id)!;
            return (
              <g key={`elbl-${e.id}`}>{renderEdgeLabel(geom, e.relation)}</g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* ---------- Anchors ---------- */}

        {/* 1. Root claim (the top assertion) */}
        <ExplainAnchor
          selector="root-claim"
          index={1}
          pin={{ x: px(rootNode.cx), y: py(rootNode.cy) - py(rootNode.h) / 2 - 10 }}
          rect={clamp({
            x: px(rootNode.cx) - px(rootNode.w) / 2 - 2,
            y: py(rootNode.cy) - py(rootNode.h) / 2 - 2,
            width: px(rootNode.w) + 4,
            height: py(rootNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Supporting reason (filled node, "supports" arrow to root) */}
        <ExplainAnchor
          selector="supporting-reason"
          index={2}
          pin={{ x: px(supportNode.cx), y: py(supportNode.cy) + py(supportNode.h) / 2 + 14 }}
          rect={clamp({
            x: px(supportNode.cx) - px(supportNode.w) / 2 - 2,
            y: py(supportNode.cy) - py(supportNode.h) / 2 - 2,
            width: px(supportNode.w) + 4,
            height: py(supportNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Opposing reason (outlined node, "objects to" arrow to root) */}
        <ExplainAnchor
          selector="opposing-reason"
          index={3}
          pin={{ x: px(opposeNode.cx) + px(opposeNode.w) / 2 + 12, y: py(opposeNode.cy) }}
          rect={clamp({
            x: px(opposeNode.cx) - px(opposeNode.w) / 2 - 2,
            y: py(opposeNode.cy) - py(opposeNode.h) / 2 - 2,
            width: px(opposeNode.w) + 4,
            height: py(opposeNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Rebuttal (dashed node, "rebuts" arrow to an objection) */}
        <ExplainAnchor
          selector="rebuttal"
          index={4}
          pin={{ x: px(rebutNode.cx), y: py(rebutNode.cy) + py(rebutNode.h) / 2 + 14 }}
          rect={clamp({
            x: px(rebutNode.cx) - px(rebutNode.w) / 2 - 2,
            y: py(rebutNode.cy) - py(rebutNode.h) / 2 - 2,
            width: px(rebutNode.w) + 4,
            height: py(rebutNode.h) + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Labelled edge — the illocutionary relation on each arrow. */}
        <ExplainAnchor
          selector="labelled-edge"
          index={5}
          pin={{ x: supportEdge.midX - 14, y: supportEdge.midY - 14 }}
          rect={clamp({
            x: supportEdge.midX - 26,
            y: supportEdge.midY - 10,
            width: 52,
            height: 22,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Pro / con split — anchor the whole objection-side sub-DAG. */}
        <ExplainAnchor
          selector="pro-con-split"
          index={6}
          pin={{ x: opposeEdge.midX + 16, y: opposeEdge.midY - 8 }}
          rect={clamp({
            x: Math.min(px(opposeNode.cx) - px(opposeNode.w) / 2, rebutEdge.midX) - 6,
            y: py(rootNode.cy) + py(rootNode.h) / 2,
            width: iw - (Math.min(px(opposeNode.cx) - px(opposeNode.w) / 2, rebutEdge.midX) - 6),
            height: ih - (py(rootNode.cy) + py(rootNode.h) / 2),
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
