"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, cluster as d3Cluster } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Vertebrate cladogram — same 8-taxon topology as the phylogenetic-tree chart
// but ALL branch lengths are EQUAL. Only branching ORDER is encoded; all leaves
// reach the same rightmost x-coordinate. This is the defining convention of a
// cladogram per Hennig (1966).
//
// Topology: (Lamprey, ((Shark), ((Salamander, Frog), ((Snake, Chicken), (Mouse, Human)))))
//
// Synapomorphies (shared derived characters) are drawn as small filled squares
// (■) on the branch where the character first appeared. They are placed at the
// midpoint of the horizontal segment running from the parent node to the child.

interface RawNode {
  name: string;
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "root",
  children: [
    { name: "Lamprey" },
    {
      name: "gnathostomata",
      children: [
        { name: "Shark" },
        {
          name: "osteichthyes",
          children: [
            {
              name: "amphibia",
              children: [{ name: "Salamander" }, { name: "Frog" }],
            },
            {
              name: "amniota",
              children: [
                {
                  name: "reptilia",
                  children: [{ name: "Snake" }, { name: "Chicken" }],
                },
                {
                  name: "mammalia",
                  children: [{ name: "Mouse" }, { name: "Human" }],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Synapomorphies: each entry identifies the CHILD node whose incoming branch
// carries the mark, and a short label.
const SYNAPOMORPHIES: ReadonlyArray<{ node: string; label: string }> = [
  { node: "gnathostomata", label: "jaws" },
  { node: "osteichthyes", label: "four limbs" },
  { node: "amniota", label: "amniotic egg" },
  { node: "mammalia", label: "mammary glands" },
];

interface Props {
  width: number;
  height: number;
}

export function Cladogram({ width, height }: Props) {
  const margin = { top: 20, right: 80, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // d3.cluster assigns positions such that all leaves share the same x.
  // cluster().size([ih, iw]) maps y→horizontal, x→vertical (we'll read it
  // as: node.x = vertical position, node.y = horizontal depth).
  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA);
    d3Cluster<RawNode>().size([ih, iw])(h);
    return h;
  }, [ih, iw]);

  const allNodes = useMemo(() => root.descendants(), [root]);
  const leaves = useMemo(() => allNodes.filter((n) => !n.children), [allNodes]);
  const internals = useMemo(() => allNodes.filter((n) => !!n.children), [allNodes]);

  // d3.cluster stores layout in node.x (vertical) and node.y (horizontal depth).
  // pixel position helpers:
  const px = (n: typeof root) => (n as unknown as { y: number }).y;
  const py = (n: typeof root) => (n as unknown as { x: number }).x;

  // Name → node lookup.
  const nodeByName = useMemo(() => {
    const m = new Map<string, typeof root>();
    allNodes.forEach((n) => m.set(n.data.name, n));
    return m;
  }, [allNodes]);

  // Orthogonal connector from parent to child.
  const branchPath = (parent: typeof root, child: typeof root) => {
    const x1 = px(parent); const y1 = py(parent);
    const x2 = px(child);  const y2 = py(child);
    // Horizontal run from child to parent's x-depth, then vertical to parent's y.
    return `M ${x2} ${y2} H ${x1} V ${y1}`;
  };

  // Build synapomorphy geometries (midpoint on the child's horizontal segment).
  const synapGeoms = useMemo(() => {
    return SYNAPOMORPHIES.map(({ node: nodeName, label }) => {
      const node = nodeByName.get(nodeName);
      if (!node || !node.parent) return null;
      const parent = node.parent;
      const childX = px(node);
      const parentX = px(parent);
      const midX = (childX + parentX) / 2;
      const midY = py(node);
      return { label, midX, midY };
    }).filter((g): g is NonNullable<typeof g> => g !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodeByName, iw, ih]);

  // Clamp rect to plot area.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width)),
      height: Math.max(0, Math.min(ih - y, r.height)),
    };
  };

  // Representative nodes for anchors.
  const rootNode = nodeByName.get("root");
  const gnathNode = nodeByName.get("gnathostomata");
  const lampreyNode = nodeByName.get("Lamprey");
  const mammaliaNode = nodeByName.get("mammalia");
  const humanNode = nodeByName.get("Human");
  const mouseNode = nodeByName.get("Mouse");

  // Safe coordinates.
  const rX = rootNode ? px(rootNode) : 0;
  const rY = rootNode ? py(rootNode) : ih / 2;
  const gnathX = gnathNode ? px(gnathNode) : iw * 0.2;
  const gnathY = gnathNode ? py(gnathNode) : ih / 2;
  const lampX = lampreyNode ? px(lampreyNode) : iw;
  const lampY = lampreyNode ? py(lampreyNode) : ih * 0.05;
  const mamX = mammaliaNode ? px(mammaliaNode) : iw * 0.8;
  const mamY = mammaliaNode ? py(mammaliaNode) : ih * 0.85;
  const humanX = humanNode ? px(humanNode) : iw;
  const humanY = humanNode ? py(humanNode) : ih * 0.95;
  const mouseX = mouseNode ? px(mouseNode) : iw;
  const mouseY = mouseNode ? py(mouseNode) : ih * 0.75;

  // One representative equal-branch-length demonstration: the Lamprey branch.
  // All leaf x = iw (same depth from root); show the equal branch end-point.
  const equalBranchY = lampY;
  const equalBranchX = lampX;

  // Synapomorphy for anchor #5 — "jaws" on gnathostomata branch.
  const jawsSynap = synapGeoms.find((g) => g.label === "jaws");
  const jawsX = jawsSynap?.midX ?? (rX + gnathX) / 2;
  const jawsY = jawsSynap?.midY ?? gnathY;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Cladogram of 8 vertebrate taxa with synapomorphy marks"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Branch connectors */}
        <g data-data-layer="true">
          {internals.flatMap((n) =>
            (n.children ?? []).map((child, i) => (
              <path
                key={`branch-${n.data.name}-${i}`}
                d={branchPath(n, child)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
                strokeLinecap="square"
              />
            ))
          )}
        </g>

        {/* Synapomorphy marks — filled squares on branch midpoints */}
        <g data-data-layer="true">
          {synapGeoms.map(({ label, midX, midY }) => (
            <g key={`synap-${label}`}>
              <rect
                x={midX - 4}
                y={midY - 4}
                width={8}
                height={8}
                fill="var(--color-ink)"
                rx={1}
              />
              <text
                x={midX}
                y={midY - 7}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink-mute)"
              >
                {label}
              </text>
            </g>
          ))}
        </g>

        {/* Leaf labels */}
        <g data-data-layer="true">
          {leaves.map((l) => (
            <g key={`leaf-${l.data.name}`}>
              <circle
                cx={px(l)}
                cy={py(l)}
                r={2.5}
                fill="var(--color-ink)"
              />
              <text
                x={px(l) + 6}
                y={py(l)}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontStyle="italic"
                fill="var(--color-ink-soft)"
              >
                {l.data.name}
              </text>
            </g>
          ))}
        </g>

        {/* Internal node dots */}
        <g data-data-layer="true">
          {internals.map((n) => (
            <circle
              key={`inode-${n.data.name}`}
              cx={px(n)}
              cy={py(n)}
              r={2}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* ---- Anchors ---- */}

        {/* 1. Root */}
        <ExplainAnchor
          selector="root"
          index={1}
          pin={{ x: rX - 12, y: rY - 14 }}
          rect={clamp({ x: rX - 8, y: rY - 8, width: 16, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Internal node */}
        <ExplainAnchor
          selector="internal-node"
          index={2}
          pin={{ x: gnathX + 12, y: gnathY - 14 }}
          rect={clamp({ x: gnathX - 8, y: gnathY - 8, width: 16, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Leaf */}
        <ExplainAnchor
          selector="leaf"
          index={3}
          pin={{ x: humanX - 12, y: humanY - 16 }}
          rect={clamp({ x: humanX - 4, y: humanY - 8, width: 50, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Synapomorphy mark — "jaws" label on gnathostomata branch */}
        <ExplainAnchor
          selector="synapomorphy"
          index={4}
          pin={{ x: jawsX + 14, y: jawsY + 14 }}
          rect={clamp({ x: jawsX - 6, y: jawsY - 6, width: 12, height: 12 })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Equal branch length convention — Lamprey leaf (all leaves same x) */}
        <ExplainAnchor
          selector="equal-branch-length"
          index={5}
          pin={{ x: equalBranchX - 14, y: equalBranchY + 16 }}
          rect={clamp({
            x: Math.min(rX, equalBranchX),
            y: equalBranchY - 4,
            width: Math.abs(equalBranchX - rX),
            height: 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Most-basal split — the root→Lamprey vs root→gnathostomata fork */}
        <ExplainAnchor
          selector="basal-split"
          index={6}
          pin={{ x: rX + 14, y: (rY + lampY) / 2 }}
          rect={clamp({
            x: rX - 4,
            y: Math.min(rY, lampY) - 4,
            width: 8,
            height: Math.abs(lampY - rY) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Most-derived sister pair — Mouse + Human */}
        <ExplainAnchor
          selector="sister-pair"
          index={7}
          pin={{ x: mamX - 14, y: (mouseY + humanY) / 2 }}
          rect={clamp({
            x: mamX - 4,
            y: Math.min(mouseY, humanY) - 4,
            width: Math.abs(mouseX - mamX) + 4,
            height: Math.abs(humanY - mouseY) + 8,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
