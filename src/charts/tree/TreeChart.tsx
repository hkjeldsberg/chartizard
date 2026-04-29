"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, tree as d3Tree } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Node {
  name: string;
  children?: Node[];
}

// Genealogy of programming languages. Depth encodes decade of emergence;
// siblings are divergent paradigms. This is about SHAPE, not counts — use a
// treemap or icicle if you want area encoding.
const DATA: Node = {
  name: "Programming Languages",
  children: [
    {
      name: "Imperative",
      children: [{ name: "Fortran" }, { name: "C" }, { name: "Pascal" }],
    },
    {
      name: "Functional",
      children: [{ name: "Lisp" }, { name: "ML" }, { name: "Haskell" }],
    },
    {
      name: "Object-Oriented",
      children: [{ name: "Smalltalk" }, { name: "Java" }, { name: "Ruby" }],
    },
    {
      name: "Logic",
      children: [{ name: "Prolog" }, { name: "Datalog" }],
    },
    {
      name: "Scripting",
      children: [{ name: "Perl" }, { name: "Python" }, { name: "JavaScript" }],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

export function TreeChart({ width, height }: Props) {
  const margin = { top: 32, right: 24, bottom: 40, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const root = useMemo(() => {
    const h = hierarchy<Node>(DATA);
    return d3Tree<Node>().size([iw, ih])(h);
  }, [iw, ih]);

  const nodes = root.descendants();
  const links = root.links();

  // Anchor selections — pick representative nodes so copy stays specific.
  const rootNode = nodes.find((n) => n.depth === 0);
  const paradigmNode = nodes.find((n) => n.data.name === "Functional");
  const leafNode = nodes.find((n) => n.data.name === "Haskell");
  // A representative parent->child link (root → Functional) to anchor.
  const sampleLink = links.find(
    (l) => l.source.data.name === "Programming Languages" && l.target.data.name === "Functional",
  );

  // Clamp helper to keep rects inside the plot area.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const width = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const height = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width, height };
  };

  // Right-angle "elbow" connector from parent to child: a vertical stub from
  // the parent down, a horizontal run to the child's x, a vertical drop into
  // the child. Classic top-down tree look.
  const linkPath = (
    sx: number,
    sy: number,
    tx: number,
    ty: number,
  ): string => {
    const midY = (sy + ty) / 2;
    return `M ${sx} ${sy} V ${midY} H ${tx} V ${ty}`;
  };

  // Fallback geometry if any representative node is missing (shouldn't happen
  // with the static tree, but keeps the anchors unconditional).
  const rX = rootNode?.x ?? iw / 2;
  const rY = rootNode?.y ?? 0;
  const pX = paradigmNode?.x ?? iw / 2;
  const pY = paradigmNode?.y ?? ih / 2;
  const lX = leafNode?.x ?? iw / 2;
  const lY = leafNode?.y ?? ih;

  // Link anchor geometry — midpoint of the elbow between root and paradigm.
  const linkSx = sampleLink?.source.x ?? rX;
  const linkSy = sampleLink?.source.y ?? rY;
  const linkTx = sampleLink?.target.x ?? pX;
  const linkTy = sampleLink?.target.y ?? pY;
  const linkMidY = (linkSy + linkTy) / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Tree chart">
      <Group left={margin.left} top={margin.top}>
        {/* Links */}
        <g data-data-layer="true">
          {links.map((l, i) => (
            <path
              key={`link-${i}`}
              d={linkPath(l.source.x, l.source.y, l.target.x, l.target.y)}
              fill="none"
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const isRoot = n.depth === 0;
            const isLeaf = !n.children || n.children.length === 0;
            return (
              <g key={`n-${n.data.name}`} transform={`translate(${n.x}, ${n.y})`}>
                <circle
                  r={isRoot ? 4 : isLeaf ? 2.5 : 3.2}
                  fill={isRoot || !isLeaf ? "var(--color-ink)" : "var(--color-surface)"}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={0}
                  y={isLeaf ? 14 : -8}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={isRoot ? 10 : 9}
                  fontWeight={isRoot ? 500 : 400}
                  fill={isLeaf ? "var(--color-ink-soft)" : "var(--color-ink)"}
                >
                  {n.data.name}
                </text>
              </g>
            );
          })}
        </g>

        {/* Depth-axis concept marker — a faint dashed rule at each depth level */}
        <g data-data-layer="true">
          {[0, 1, 2].map((d) => {
            const y = root.descendants().find((n) => n.depth === d)?.y ?? 0;
            return (
              <line
                key={`depth-${d}`}
                x1={0}
                x2={iw}
                y1={y}
                y2={y}
                stroke="var(--color-hairline)"
                strokeDasharray="1 4"
                opacity={0.6}
              />
            );
          })}
        </g>

        {/* Anchors */}
        <ExplainAnchor
          selector="root-node"
          index={1}
          pin={{ x: rX, y: rY - 22 }}
          rect={clampRect({ x: rX - 70, y: rY - 14, width: 140, height: 24 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="intermediate-node"
          index={2}
          pin={{ x: pX, y: pY - 22 }}
          rect={clampRect({ x: pX - 32, y: pY - 14, width: 64, height: 24 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="leaf-node"
          index={3}
          pin={{ x: lX + 18, y: lY + 18 }}
          rect={clampRect({ x: lX - 24, y: lY - 6, width: 48, height: 26 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="link"
          index={4}
          pin={{ x: linkTx + 16, y: linkMidY }}
          rect={clampRect({
            x: Math.min(linkSx, linkTx) - 4,
            y: linkSy,
            width: Math.abs(linkTx - linkSx) + 8,
            height: Math.max(4, linkTy - linkSy),
          })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="depth-axis"
          index={5}
          pin={{ x: 10, y: pY }}
          rect={clampRect({ x: 0, y: pY - 8, width: iw, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="sibling-ordering"
          index={6}
          pin={{ x: iw / 2, y: pY + 14 }}
          rect={clampRect({ x: 0, y: pY - 4, width: iw, height: 8 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
