"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, cluster as d3Cluster } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// File-system directory hierarchy. Subject chosen because every developer
// immediately recognises the structure and can predict the leaf labels —
// the chart's job is to show radial layout, not to teach the domain.
interface DirNode {
  name: string;
  children?: DirNode[];
}

const DATA: DirNode = {
  name: "project/",
  children: [
    {
      name: "src/",
      children: [
        {
          name: "components/",
          children: [
            { name: "Header.tsx" },
            { name: "Footer.tsx" },
            { name: "Nav.tsx" },
          ],
        },
        {
          name: "charts/",
          children: [
            { name: "bar/" },
            { name: "line/" },
            { name: "pie/" },
            { name: "…" },
          ],
        },
        { name: "pages/" },
        { name: "lib/" },
        { name: "content/" },
        { name: "app/" },
      ],
    },
    {
      name: "tests/",
      children: [{ name: "unit/" }, { name: "e2e/" }],
    },
    {
      name: "docs/",
      children: [{ name: "CONTRIBUTING.md" }, { name: "ARCHITECTURE.md" }],
    },
    { name: "scripts/" },
    { name: "package.json" },
    { name: "README.md" },
    { name: "tsconfig.json" },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Polar → cartesian. Rotate by -π/2 so angle 0 points up (12-o'clock root).
function polarToCart(angle: number, radius: number): { x: number; y: number } {
  return {
    x: Math.cos(angle - Math.PI / 2) * radius,
    y: Math.sin(angle - Math.PI / 2) * radius,
  };
}

// d3-cluster puts angle on .x and radius on .y after size([2π, r]).
// We cast through unknown to access these numeric layout properties.
type LayoutNode = { x: number; y: number };
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function layoutProps(n: any): LayoutNode {
  return n as LayoutNode;
}

export function RadialTree({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Leave room for the longest leaf label (~14 chars × ~5 px ≈ 70 px).
  const outerRadius = Math.max(0, Math.min(cx, cy) - 72);

  const root = useMemo(() => {
    const h = hierarchy<DirNode>(DATA);
    d3Cluster<DirNode>().size([2 * Math.PI, outerRadius])(h);
    return h;
  }, [outerRadius]);

  const allNodes = useMemo(() => root.descendants(), [root]);
  const links = useMemo(() => root.links(), [root]);
  const leaves = useMemo(() => allNodes.filter((n) => !n.children), [allNodes]);

  // Straight radial edge path between two layout nodes (x=angle, y=radius).
  const edgePath = (src: LayoutNode, tgt: LayoutNode): string => {
    const sP = polarToCart(src.x, src.y);
    const tP = polarToCart(tgt.x, tgt.y);
    return `M ${sP.x} ${sP.y} L ${tP.x} ${tP.y}`;
  };

  // Pick anchor target nodes from the static tree.
  const srcNode = allNodes.find((n) => n.data.name === "src/");
  const componentsNode = allNodes.find((n) => n.data.name === "components/");
  const headerLeaf = allNodes.find((n) => n.data.name === "Header.tsx");
  // A representative edge: root → src/
  const rootToSrcLink = links.find(
    (l) => l.source.data.name === "project/" && l.target.data.name === "src/",
  );

  // Clamp a rect into plot-local bounds.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width)),
      height: Math.max(0, Math.min(ih - y, r.height)),
    };
  };

  // Convert a centre-relative point to outer-Group space and clamp pin.
  const pinAt = (p: { x: number; y: number }, dx = 0, dy = 0) => ({
    x: Math.max(10, Math.min(iw - 10, cx + p.x + dx)),
    y: Math.max(10, Math.min(ih - 10, cy + p.y + dy)),
  });

  const rectAround = (p: { x: number; y: number }, size: number) =>
    clampRect({
      x: cx + p.x - size / 2,
      y: cy + p.y - size / 2,
      width: size,
      height: size,
    });

  // Fallback coordinates for nodes that must always exist.
  // The root node always sits at (0, 0) in cartesian centre coordinates
  // since d3-cluster gives it angle 0 and radius 0.

  const srcLP = srcNode ? layoutProps(srcNode) : { x: 0, y: outerRadius * 0.5 };
  const srcP = polarToCart(srcLP.x, srcLP.y);

  const compLP = componentsNode ? layoutProps(componentsNode) : srcLP;
  const compP = polarToCart(compLP.x, compLP.y);

  const headerLP = headerLeaf ? layoutProps(headerLeaf) : compLP;
  const headerP = polarToCart(headerLP.x, outerRadius);

  const linkSrc = rootToSrcLink ? layoutProps(rootToSrcLink.source) : { x: 0, y: 0 };
  const linkTgt = rootToSrcLink ? layoutProps(rootToSrcLink.target) : srcLP;
  const linkSrcP = polarToCart(linkSrc.x, linkSrc.y);
  const linkTgtP = polarToCart(linkTgt.x, linkTgt.y);
  const edgeMidP = {
    x: (linkSrcP.x + linkTgtP.x) / 2,
    y: (linkSrcP.y + linkTgtP.y) / 2,
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Radial tree of a project directory">
      <Group left={margin.left} top={margin.top}>
        <Group left={cx} top={cy}>
          {/* Edges — straight radial lines connecting each node to its parent. */}
          <g data-data-layer="true" fill="none">
            {links.map((l, i) => (
              <path
                key={`edge-${i}`}
                d={edgePath(layoutProps(l.source), layoutProps(l.target))}
                stroke="var(--color-ink)"
                strokeWidth={0.9}
                strokeOpacity={0.5}
              />
            ))}
          </g>

          {/* Internal nodes (non-leaf) */}
          <g data-data-layer="true">
            {allNodes
              .filter((n) => !!n.children)
              .map((n) => {
                const lp = layoutProps(n);
                const isRoot = n.depth === 0;
                const p = isRoot ? { x: 0, y: 0 } : polarToCart(lp.x, lp.y);
                return (
                  <g key={`node-${n.data.name}`}>
                    <circle
                      cx={p.x}
                      cy={p.y}
                      r={isRoot ? 4.5 : 3}
                      fill="var(--color-ink)"
                    />
                    {/* Label internal nodes except root (root has its own label) */}
                    {!isRoot && (
                      <text
                        x={p.x}
                        y={p.y - 6}
                        textAnchor="middle"
                        fontFamily="var(--font-mono)"
                        fontSize={7.5}
                        fill="var(--color-ink-soft)"
                      >
                        {n.data.name}
                      </text>
                    )}
                  </g>
                );
              })}
          </g>

          {/* Root label */}
          <g data-data-layer="true">
            <text
              x={0}
              y={-10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fontWeight={600}
              fill="var(--color-ink)"
            >
              {DATA.name}
            </text>
          </g>

          {/* Leaf nodes — small dots + radially-placed labels */}
          <g data-data-layer="true">
            {leaves.map((n) => {
              const lp = layoutProps(n);
              const p = polarToCart(lp.x, lp.y);
              const labelP = polarToCart(lp.x, lp.y + 10);
              // Rotate label to read outward; flip text on the left half so it
              // doesn't read upside-down.
              const degRaw = (lp.x * 180) / Math.PI - 90;
              const flip = lp.x > Math.PI;
              const rotation = flip ? degRaw + 180 : degRaw;
              const anchor = flip ? "end" : "start";
              return (
                <g key={`leaf-${n.data.name}-${lp.x.toFixed(2)}`}>
                  <circle
                    cx={p.x}
                    cy={p.y}
                    r={2.2}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1}
                    strokeOpacity={0.7}
                  />
                  <text
                    x={labelP.x}
                    y={labelP.y}
                    transform={`rotate(${rotation} ${labelP.x} ${labelP.y})`}
                    textAnchor={anchor}
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={8}
                    fill="var(--color-ink-soft)"
                  >
                    {n.data.name}
                  </text>
                </g>
              );
            })}
          </g>
        </Group>

        {/* ---- Anchors in outer-Group (margin-offset) coordinate space ---- */}

        {/* 1. Root node at centre */}
        <ExplainAnchor
          selector="root-node"
          index={1}
          pin={{ x: cx - 18, y: cy - 18 }}
          rect={clampRect({ x: cx - 16, y: cy - 16, width: 32, height: 32 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. A level-1 node (src/) */}
        <ExplainAnchor
          selector="level-1-node"
          index={2}
          pin={pinAt(srcP, 12, -12)}
          rect={rectAround(srcP, 24)}
        >
          <g />
        </ExplainAnchor>

        {/* 3. A leaf label at the circumference (Header.tsx) */}
        <ExplainAnchor
          selector="leaf-label"
          index={3}
          pin={pinAt(headerP, 10, -10)}
          rect={clampRect({
            x: cx + headerP.x - 20,
            y: cy + headerP.y - 20,
            width: 40,
            height: 40,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. An edge (radial connector) */}
        <ExplainAnchor
          selector="radial-edge"
          index={4}
          pin={pinAt(edgeMidP, 14, 0)}
          rect={clampRect({
            x: cx + Math.min(linkSrcP.x, linkTgtP.x) - 4,
            y: cy + Math.min(linkSrcP.y, linkTgtP.y) - 4,
            width: Math.abs(linkTgtP.x - linkSrcP.x) + 8,
            height: Math.abs(linkTgtP.y - linkSrcP.y) + 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. The 2π angular distribution (whole ring) */}
        <ExplainAnchor
          selector="angular-distribution"
          index={5}
          pin={{ x: iw - 12, y: cy }}
          rect={clampRect({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. A deep subtree (src/ → components/) */}
        <ExplainAnchor
          selector="subtree"
          index={6}
          pin={pinAt(compP, -14, -14)}
          rect={clampRect({
            x: cx + Math.min(srcP.x, compP.x) - 8,
            y: cy + Math.min(srcP.y, compP.y) - 8,
            width: Math.abs(compP.x - srcP.x) + 16,
            height: Math.abs(compP.y - srcP.y) + 16,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
