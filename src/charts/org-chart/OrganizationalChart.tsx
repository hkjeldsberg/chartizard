"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, tree as d3Tree } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A standard reporting tree: CEO → 4 VPs → 10 directors. One director reports
// dotted-line to a second VP, rendered as a dashed edge. Vertical top-down
// layout; all boxes; no edge labels — deliberately distinct from the decision
// tree's horizontal mixed-shape style.

interface OrgNode {
  id: string;
  name: string;
  role: string;
  children?: OrgNode[];
}

const DATA: OrgNode = {
  id: "ceo",
  name: "M. Okafor",
  role: "CEO",
  children: [
    {
      id: "vp-eng",
      name: "P. Reyes",
      role: "VP Engineering",
      children: [
        { id: "d-eng-1", name: "J. Kim", role: "Dir. Platform" },
        { id: "d-eng-2", name: "T. Nakamura", role: "Dir. Product Eng" },
        { id: "d-eng-3", name: "F. Ahmed", role: "Dir. Infrastructure" },
        { id: "d-eng-4", name: "S. Berg", role: "Dir. QA" },
      ],
    },
    {
      id: "vp-prod",
      name: "L. Dubois",
      role: "VP Product",
      children: [
        { id: "d-prod-1", name: "R. Chen", role: "Dir. Growth" },
        { id: "d-prod-2", name: "H. Patel", role: "Dir. Platform PM" },
      ],
    },
    {
      id: "vp-sales",
      name: "E. Marino",
      role: "VP Sales",
      children: [
        { id: "d-sales-1", name: "O. Novak", role: "Dir. Enterprise" },
        { id: "d-sales-2", name: "C. Silva", role: "Dir. Mid-Market" },
        { id: "d-sales-3", name: "A. Hassan", role: "Dir. Partnerships" },
      ],
    },
    {
      id: "vp-fin",
      name: "K. Lindgren",
      role: "VP Finance",
      children: [
        { id: "d-fin-1", name: "G. Park", role: "Dir. FP&A" },
        // Revenue Operations: dotted-line reports up to VP Sales.
        { id: "d-fin-2", name: "B. Osei", role: "Dir. Revenue Ops" },
      ],
    },
  ],
};

// The "dotted line" — Revenue Ops reports solid to VP Finance (tree parent)
// and dotted to VP Sales.
const DOTTED_LINES: ReadonlyArray<{ from: string; to: string }> = [
  { from: "vp-sales", to: "d-fin-2" },
];

interface Props {
  width: number;
  height: number;
}

export function OrganizationalChart({ width, height }: Props) {
  const margin = { top: 28, right: 16, bottom: 24, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Box dimensions (pixels).
  const BOX_W = 88;
  const BOX_H = 30;

  // d3-hierarchy top-down tree layout.
  const root = useMemo(() => {
    const h = hierarchy<OrgNode>(DATA);
    // nodeSize gives consistent spacing; separation tunes same-parent vs cousin.
    return d3Tree<OrgNode>()
      .size([Math.max(1, iw), Math.max(1, ih - BOX_H)])
      .separation((a, b) => (a.parent === b.parent ? 1 : 1.2))(h);
  }, [iw, ih]);

  const nodes = root.descendants();
  const links = root.links();

  // Build a lookup so we can map ids → (x, y) for the dotted-line overlay.
  const posById = useMemo(() => {
    const m = new Map<string, { x: number; y: number }>();
    nodes.forEach((n) => m.set(n.data.id, { x: n.x, y: n.y }));
    return m;
  }, [nodes]);

  // Right-angle "elbow" connector from box-bottom of parent to box-top of child.
  const linkPath = (sx: number, sy: number, tx: number, ty: number): string => {
    const sBottom = sy + BOX_H / 2;
    const tTop = ty - BOX_H / 2;
    const midY = (sBottom + tTop) / 2;
    return `M ${sx} ${sBottom} V ${midY} H ${tx} V ${tTop}`;
  };

  // Dotted-line overlay: the "from" node (VP Sales) connects to the side of
  // the "to" node (Revenue Ops). Use a gentle horizontal-then-vertical routing
  // so it's visibly an exception rather than a tree edge.
  const dottedPath = (from: { x: number; y: number }, to: { x: number; y: number }): string => {
    // Exit from the right side of the `from` box, run horizontally past the
    // target, then drop into the top of the target box.
    const sx = from.x + BOX_W / 2;
    const sy = from.y;
    const tx = to.x;
    const tTop = to.y - BOX_H / 2;
    // Use an elbow with an intermediate y slightly above the target.
    const midY = sy + (tTop - sy) * 0.35;
    return `M ${sx} ${sy} H ${sx + 12} V ${midY} H ${tx} V ${tTop}`;
  };

  // Clamp helper.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Representative nodes for anchors.
  const ceoNode = nodes.find((n) => n.data.id === "ceo");
  const vpEngNode = nodes.find((n) => n.data.id === "vp-eng");
  const dirNode = nodes.find((n) => n.data.id === "d-eng-1");
  const revOpsNode = nodes.find((n) => n.data.id === "d-fin-2");
  const vpSalesNode = nodes.find((n) => n.data.id === "vp-sales");
  const vpFinNode = nodes.find((n) => n.data.id === "vp-fin");

  // Fallbacks (unconditional anchors — values shouldn't matter because the
  // static tree always contains these ids, but guard anyway).
  const ceoX = ceoNode?.x ?? iw / 2;
  const ceoY = ceoNode?.y ?? 0;
  const vpEngX = vpEngNode?.x ?? iw / 4;
  const vpEngY = vpEngNode?.y ?? ih / 2;
  const dirX = dirNode?.x ?? iw / 4;
  const dirY = dirNode?.y ?? ih;
  const revOpsX = revOpsNode?.x ?? iw - 40;
  const revOpsY = revOpsNode?.y ?? ih;
  const vpSalesX = vpSalesNode?.x ?? iw * 0.6;
  const vpSalesY = vpSalesNode?.y ?? ih / 2;
  const vpFinX = vpFinNode?.x ?? iw * 0.8;
  const vpFinY = vpFinNode?.y ?? ih / 2;

  // For span-of-control observation anchor: cover the VP row horizontally.
  const vpRowY = vpEngY;

  return (
    <svg width={width} height={height} role="img" aria-label="Organizational chart">
      <Group left={margin.left} top={margin.top}>
        {/* Solid reporting links */}
        <g data-data-layer="true">
          {links.map((l, i) => (
            <path
              key={`l-${i}`}
              d={linkPath(l.source.x, l.source.y, l.target.x, l.target.y)}
              fill="none"
              stroke="var(--color-ink-mute)"
              strokeWidth={1.1}
            />
          ))}
        </g>

        {/* Dotted-line relationships */}
        <g data-data-layer="true">
          {DOTTED_LINES.map((d, i) => {
            const from = posById.get(d.from);
            const to = posById.get(d.to);
            if (!from || !to) return null;
            return (
              <path
                key={`dl-${i}`}
                d={dottedPath(from, to)}
                fill="none"
                stroke="var(--color-ink-mute)"
                strokeWidth={1}
                strokeDasharray="3 3"
                opacity={0.85}
              />
            );
          })}
        </g>

        {/* Node boxes — all rectangles, all the same shape. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const isRoot = n.depth === 0;
            return (
              <g key={`n-${n.data.id}`} transform={`translate(${n.x}, ${n.y})`}>
                <rect
                  x={-BOX_W / 2}
                  y={-BOX_H / 2}
                  width={BOX_W}
                  height={BOX_H}
                  rx={3}
                  ry={3}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={isRoot ? 1.6 : 1.2}
                />
                <text
                  x={0}
                  y={-2}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {n.data.name}
                </text>
                <text
                  x={0}
                  y={10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {n.data.role}
                </text>
              </g>
            );
          })}
        </g>

        {/* Dotted-line caption — small mono label next to the dashed edge. */}
        <g data-data-layer="true">
          <text
            x={vpSalesX + BOX_W / 2 + 14}
            y={(vpSalesY + revOpsY) / 2 - 4}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
            textAnchor="start"
          >
            dotted line
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. root-node (CEO) */}
        <ExplainAnchor
          selector="root-node"
          index={1}
          pin={{ x: ceoX + BOX_W / 2 + 14, y: ceoY }}
          rect={clampRect({
            x: ceoX - BOX_W / 2,
            y: ceoY - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. mid-level (VP Engineering) */}
        <ExplainAnchor
          selector="mid-level"
          index={2}
          pin={{ x: vpEngX - BOX_W / 2 - 14, y: vpEngY }}
          rect={clampRect({
            x: vpEngX - BOX_W / 2,
            y: vpEngY - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. leaf-node (a director) */}
        <ExplainAnchor
          selector="leaf-node"
          index={3}
          pin={{ x: dirX, y: dirY + BOX_H / 2 + 14 }}
          rect={clampRect({
            x: dirX - BOX_W / 2,
            y: dirY - BOX_H / 2,
            width: BOX_W,
            height: BOX_H,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. dotted-line (the dashed exception edge) */}
        <ExplainAnchor
          selector="dotted-line"
          index={4}
          pin={{ x: vpSalesX + BOX_W / 2 + 28, y: (vpSalesY + revOpsY) / 2 }}
          rect={clampRect({
            x: Math.min(vpSalesX, revOpsX) + BOX_W / 2,
            y: vpSalesY,
            width: Math.max(16, Math.abs(revOpsX - vpSalesX)),
            height: Math.max(16, revOpsY - vpSalesY),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. tree-direction (top-down authority axis) — anchor the vertical
            corridor between CEO and a VP. */}
        <ExplainAnchor
          selector="tree-direction"
          index={5}
          pin={{ x: ceoX - BOX_W / 2 - 14, y: (ceoY + vpRowY) / 2 }}
          rect={clampRect({
            x: ceoX - 6,
            y: ceoY + BOX_H / 2,
            width: 12,
            height: Math.max(12, vpRowY - BOX_H / 2 - (ceoY + BOX_H / 2)),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. span-of-control (the VP row — Eng VP has more reports than
            Finance VP). */}
        <ExplainAnchor
          selector="span-of-control"
          index={6}
          pin={{ x: (vpEngX + vpFinX) / 2, y: vpRowY - BOX_H / 2 - 14 }}
          rect={clampRect({
            x: Math.max(0, vpEngX - BOX_W / 2 - 4),
            y: vpRowY - BOX_H / 2 - 2,
            width: Math.min(iw, vpFinX - vpEngX + BOX_W + 8),
            height: BOX_H + 4,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
