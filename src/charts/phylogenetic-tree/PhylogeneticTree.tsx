"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, cluster as d3Cluster } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Vertebrate phylogram — 8 taxa, topology per Donoghue & Benton (2007) and
// Hedges & Kumar (2009, TimeTree). Branch lengths encode inferred evolutionary
// distance (substitutions per site from a mitochondrial cytochrome-b alignment);
// values are illustrative but proportionally correct (Lamprey is a deep
// agnathan outgroup; Mouse+Human diverge recently in geological time).
//
// Topology: (Lamprey, ((Shark), ((Salamander, Frog), ((Snake, Chicken), (Mouse, Human)))))
//
// We implement a "phylogram" by computing x-positions from cumulative branch
// lengths rather than using a uniform d3.cluster x-spacing. The y-positions
// come from d3.cluster so vertical spacing of leaves stays even.

interface RawNode {
  name: string;
  // Distance from this node to its parent (0 on root).
  branchLength: number;
  children?: RawNode[];
  // Optional bootstrap support label (rendered near midpoint of parent branch).
  bootstrap?: string;
}

// Branch lengths (substitutions per site × 100, scaled to a ~0–100 axis).
const DATA: RawNode = {
  name: "root",
  branchLength: 0,
  children: [
    // Lamprey: deep agnathan outgroup, long branch
    { name: "Lamprey", branchLength: 62 },
    {
      // Gnathostomata
      name: "gnathostomata",
      branchLength: 8,
      bootstrap: "98%",
      children: [
        // Shark: cartilaginous fish, early-diverging gnathostome
        { name: "Shark", branchLength: 44 },
        {
          // Osteichthyes
          name: "osteichthyes",
          branchLength: 6,
          children: [
            {
              // Tetrapoda (Amphibia)
              name: "amphibia",
              branchLength: 18,
              children: [
                { name: "Salamander", branchLength: 24 },
                { name: "Frog", branchLength: 22 },
              ],
            },
            {
              // Amniota
              name: "amniota",
              branchLength: 10,
              bootstrap: "87%",
              children: [
                {
                  // Reptilia (Lepidosauria + Archosauria)
                  name: "reptilia",
                  branchLength: 14,
                  children: [
                    { name: "Snake", branchLength: 20 },
                    { name: "Chicken", branchLength: 18 },
                  ],
                },
                {
                  // Mammalia
                  name: "mammalia",
                  branchLength: 12,
                  children: [
                    { name: "Mouse", branchLength: 10 },
                    { name: "Human", branchLength: 8 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  ],
};

// Collect all leaf names for cluster layout ordering.
function leafNames(n: RawNode): string[] {
  if (!n.children || n.children.length === 0) return [n.name];
  return n.children.flatMap(leafNames);
}

// Compute cumulative distance from the root for every node.
function assignDistances(
  n: RawNode,
  parentDist: number,
  map: Map<string, number>,
): number {
  const dist = parentDist + n.branchLength;
  map.set(n.name, dist);
  if (n.children) {
    n.children.forEach((c) => assignDistances(c, dist, map));
  }
  return dist;
}

interface Props {
  width: number;
  height: number;
}

export function PhylogeneticTree({ width, height }: Props) {
  const margin = { top: 20, right: 80, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Compute per-node cumulative distances from root.
  const distMap = useMemo(() => {
    const m = new Map<string, number>();
    assignDistances(DATA, 0, m);
    return m;
  }, []);

  // Maximum distance (= the x-extent we scale to iw).
  const maxDist = useMemo(() => Math.max(...Array.from(distMap.values())), [distMap]);

  // d3-cluster for vertical leaf placement.
  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA);
    // cluster().size([height, width]) — we will swap axes manually.
    d3Cluster<RawNode>().size([ih, 1])(h);
    return h;
  }, [ih]);

  // Flat arrays for rendering.
  const allNodes = useMemo(() => root.descendants(), [root]);
  const leaves = useMemo(() => allNodes.filter((n) => !n.children), [allNodes]);
  const internals = useMemo(() => allNodes.filter((n) => !!n.children), [allNodes]);

  // Map node name → cluster y (vertical position).
  const clusterY = useMemo(() => {
    const m = new Map<string, number>();
    allNodes.forEach((n) => {
      // d3.cluster puts the layout in (n.x, n.y) with x as vertical.
      m.set(n.data.name, (n as unknown as { x: number }).x);
    });
    return m;
  }, [allNodes]);

  // Convert cumulative distance to pixel x; cluster y to pixel y.
  const px = (name: string) => {
    const d = distMap.get(name) ?? 0;
    return maxDist > 0 ? (d / maxDist) * iw : 0;
  };
  const py = (name: string) => clusterY.get(name) ?? 0;

  // Orthogonal branch connector: child draws a horizontal line back to its
  // parent's x, then a vertical stub up/down to the parent's y level.
  const branchPath = (parentName: string, childName: string) => {
    const x1 = px(parentName);
    const y1 = py(parentName);
    const x2 = px(childName);
    const y2 = py(childName);
    // Go horizontal from child to parent's x, then vertical to parent's y.
    return `M ${x2} ${y2} H ${x1} V ${y1}`;
  };

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

  // Pick representative nodes for anchors.
  const rootNode = allNodes.find((n) => n.data.name === "root");
  const lampreyNode = leaves.find((n) => n.data.name === "Lamprey");
  const humanNode = leaves.find((n) => n.data.name === "Human");
  const mouseNode = leaves.find((n) => n.data.name === "Mouse");
  const mammaliaNode = allNodes.find((n) => n.data.name === "mammalia");
  const gnathNode = allNodes.find((n) => n.data.name === "gnathostomata");

  // Safe coordinate helpers (never null at render).
  const rX = rootNode ? px("root") : 0;
  const rY = rootNode ? py("root") : ih / 2;
  const lampX = lampreyNode ? px("Lamprey") : iw;
  const lampY = lampreyNode ? py("Lamprey") : 0;
  const humanX = humanNode ? px("Human") : iw;
  const humanY = humanNode ? py("Human") : ih;
  const mouseX = mouseNode ? px("Mouse") : iw;
  const mouseY = mouseNode ? py("Mouse") : ih;
  const mamX = mammaliaNode ? px("mammalia") : iw * 0.7;
  const mamY = mammaliaNode ? py("mammalia") : ih * 0.8;
  const gnathX = gnathNode ? px("gnathostomata") : iw * 0.1;
  const gnathY = gnathNode ? py("gnathostomata") : ih * 0.5;

  // Bootstrap label position: midpoint of the branch from gnathostomata to root.
  const bootstrapGnathX = (rX + gnathX) / 2;
  const bootstrapGnathY = gnathY;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Phylogenetic tree (phylogram) of 8 vertebrate taxa"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Branch connectors */}
        <g data-data-layer="true">
          {internals.flatMap((n) =>
            (n.children ?? []).map((child, i) => (
              <path
                key={`branch-${n.data.name}-${i}`}
                d={branchPath(n.data.name, child.data.name)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
                strokeLinecap="square"
              />
            ))
          )}
        </g>

        {/* Bootstrap support labels on selected branches */}
        <g data-data-layer="true">
          {allNodes
            .filter((n) => !!n.data.bootstrap)
            .map((n) => {
              const parent = n.parent;
              if (!parent) return null;
              const midX = (px(n.data.name) + px(parent.data.name)) / 2;
              const midY = py(n.data.name);
              return (
                <text
                  key={`bs-${n.data.name}`}
                  x={midX}
                  y={midY - 4}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-mute)"
                >
                  {n.data.bootstrap}
                </text>
              );
            })}
        </g>

        {/* Leaf labels */}
        <g data-data-layer="true">
          {leaves.map((l) => (
            <g key={`leaf-${l.data.name}`}>
              <circle
                cx={px(l.data.name)}
                cy={py(l.data.name)}
                r={2.5}
                fill="var(--color-ink)"
              />
              <text
                x={px(l.data.name) + 6}
                y={py(l.data.name)}
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
              cx={px(n.data.name)}
              cy={py(n.data.name)}
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

        {/* 2. Internal node (speciation event) — gnathostomata */}
        <ExplainAnchor
          selector="internal-node"
          index={2}
          pin={{ x: gnathX + 12, y: gnathY - 14 }}
          rect={clamp({ x: gnathX - 8, y: gnathY - 8, width: 16, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Leaf (taxon name) — Lamprey */}
        <ExplainAnchor
          selector="leaf"
          index={3}
          pin={{ x: lampX - 12, y: lampY - 16 }}
          rect={clamp({ x: lampX - 4, y: lampY - 8, width: 60, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Branch with length encoding — Lamprey's long branch */}
        <ExplainAnchor
          selector="branch"
          index={4}
          pin={{ x: (rX + lampX) / 2, y: lampY + 16 }}
          rect={clamp({
            x: Math.min(rX, lampX),
            y: lampY - 4,
            width: Math.abs(lampX - rX),
            height: 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Bootstrap support value — gnathostomata branch */}
        <ExplainAnchor
          selector="bootstrap"
          index={5}
          pin={{ x: bootstrapGnathX + 14, y: bootstrapGnathY - 14 }}
          rect={clamp({
            x: bootstrapGnathX - 20,
            y: bootstrapGnathY - 12,
            width: 40,
            height: 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Sister-group (Mouse + Human) */}
        <ExplainAnchor
          selector="sister-group"
          index={6}
          pin={{ x: mamX - 14, y: (mouseY + humanY) / 2 }}
          rect={clamp({
            x: mamX - 6,
            y: Math.min(mouseY, humanY) - 4,
            width: Math.abs(humanX - mamX) + 4,
            height: Math.abs(humanY - mouseY) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Vertebrate outgroup (Lamprey) — the most basal branch */}
        <ExplainAnchor
          selector="outgroup"
          index={7}
          pin={{ x: rX + 14, y: (rY + lampY) / 2 }}
          rect={clamp({
            x: rX,
            y: Math.min(rY, lampY) - 4,
            width: 8,
            height: Math.abs(lampY - rY) + 8,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
