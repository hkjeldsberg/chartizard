"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { hierarchy } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Hand-built agglomerative clustering of 12 mammals by trait similarity.
// `height` on internal nodes = dissimilarity at which the children merged.
// Leaves have height 0.
interface RawNode {
  name: string;
  height: number;
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "root",
  height: 2.6,
  children: [
    {
      // Carnivores
      name: "carnivora",
      height: 1.5,
      children: [
        {
          // Canids
          name: "canids",
          height: 0.5,
          children: [
            { name: "Fox", height: 0 },
            {
              name: "canis",
              height: 0.25,
              children: [
                { name: "Coyote", height: 0 },
                {
                  name: "dog-wolf",
                  height: 0.1,
                  children: [
                    { name: "Wolf", height: 0 },
                    { name: "Dog", height: 0 },
                  ],
                },
              ],
            },
          ],
        },
        {
          // Felids
          name: "felids",
          height: 0.7,
          children: [
            { name: "Cat", height: 0 },
            {
              name: "panthera",
              height: 0.35,
              children: [
                { name: "Lion", height: 0 },
                { name: "Tiger", height: 0 },
              ],
            },
          ],
        },
      ],
    },
    {
      // Ungulates + bears merge cluster
      name: "herbivora-plus",
      height: 2.2,
      children: [
        {
          name: "ursids",
          height: 0.6,
          children: [
            { name: "Bear", height: 0 },
            { name: "Panda", height: 0 },
          ],
        },
        {
          // Equids
          name: "equids",
          height: 0.3,
          children: [
            { name: "Horse", height: 0 },
            {
              name: "equus-pair",
              height: 0.2,
              children: [
                { name: "Zebra", height: 0 },
                { name: "Donkey", height: 0 },
              ],
            },
          ],
        },
      ],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Ordered leaves (left to right) — derived via in-order traversal of the
// hand-built tree so the drawing matches the declared structure.
function orderedLeaves(n: RawNode): string[] {
  if (!n.children || n.children.length === 0) return [n.name];
  return n.children.flatMap((c) => orderedLeaves(c));
}

export function DendrogramChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const root = useMemo(() => hierarchy<RawNode>(DATA), []);
  const leafOrder = useMemo(() => orderedLeaves(DATA), []);

  // y-axis: dissimilarity. Root height is the top of the domain.
  const yScale = useMemo(
    () => scaleLinear({ domain: [0, DATA.height], range: [ih, 0] }),
    [ih],
  );

  // x positions — one slot per leaf, evenly spaced.
  const leafCount = leafOrder.length;
  const leafX = useMemo(() => {
    const step = leafCount > 1 ? iw / (leafCount - 1) : 0;
    const map: Record<string, number> = {};
    leafOrder.forEach((name, i) => {
      map[name] = leafCount > 1 ? i * step : iw / 2;
    });
    return map;
  }, [leafOrder, leafCount, iw]);

  // Walk the d3-hierarchy and compute x,y for every node.
  interface Pos {
    x: number;
    y: number;
    name: string;
    height: number;
    isLeaf: boolean;
    children?: Pos[];
  }
  const positions = useMemo(() => {
    function walk(n: typeof root): Pos {
      if (!n.children || n.children.length === 0) {
        return {
          x: leafX[n.data.name] ?? 0,
          y: yScale(0),
          name: n.data.name,
          height: 0,
          isLeaf: true,
        };
      }
      const kids = n.children.map(walk);
      // Internal x = midpoint of child x's (classic dendrogram convention).
      const x = (Math.min(...kids.map((k) => k.x)) + Math.max(...kids.map((k) => k.x))) / 2;
      const y = yScale(n.data.height);
      return { x, y, name: n.data.name, height: n.data.height, isLeaf: false, children: kids };
    }
    return walk(root);
  }, [root, leafX, yScale]);

  // Flatten into all nodes for iteration.
  function collect(p: Pos, out: Pos[] = []): Pos[] {
    out.push(p);
    p.children?.forEach((c) => collect(c, out));
    return out;
  }
  const allNodes = collect(positions);
  const internals = allNodes.filter((n) => !n.isLeaf);
  const leaves = allNodes.filter((n) => n.isLeaf);

  // Orthogonal connector: each child rises vertically from its own x up to
  // the parent's merge y, then the two children are joined horizontally.
  function connectorPath(parent: Pos, child: Pos): string {
    return `M ${child.x} ${child.y} V ${parent.y} H ${parent.x}`;
  }

  // --- Anchor geometry ---
  const cutY = yScale(1.5);
  // Representative merge: dog+wolf (lowest, most similar pair).
  const dogWolfMerge = allNodes.find((n) => n.name === "dog-wolf")!;
  // Representative leaf: Wolf.
  const wolfLeaf = leaves.find((n) => n.name === "Wolf")!;
  // Representative branch-height: felids merge at 0.7.
  const felidsMerge = allNodes.find((n) => n.name === "felids")!;
  // Root merge at the top.
  const rootMerge = positions;

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const width = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const height = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width, height };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Dendrogram">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines at the whole-unit dissimilarity marks */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`g-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Connectors */}
        <g data-data-layer="true">
          {internals.flatMap((n) =>
            (n.children ?? []).map((c, i) => (
              <path
                key={`e-${n.name}-${i}`}
                d={connectorPath(n, c)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            )),
          )}
        </g>

        {/* Cut line at h = 1.5 (family-level cluster rule) */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={cutY}
            y2={cutY}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="4 3"
            opacity={0.85}
          />
          <text
            x={iw - 4}
            y={cutY - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            cut · h=1.5
          </text>
        </g>

        {/* Merge points */}
        <g data-data-layer="true">
          {internals.map((n) => (
            <circle
              key={`m-${n.name}`}
              cx={n.x}
              cy={n.y}
              r={2}
              fill="var(--color-ink)"
            />
          ))}
        </g>

        {/* Leaf labels */}
        <g data-data-layer="true">
          {leaves.map((l) => (
            <g key={`leaf-${l.name}`} transform={`translate(${l.x}, ${l.y})`}>
              <circle r={2.2} fill="var(--color-ink)" />
              <text
                transform="rotate(-45) translate(6 4)"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
                textAnchor="start"
              >
                {l.name}
              </text>
            </g>
          ))}
        </g>

        {/* Y-axis (dissimilarity) */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-margin.left + 4}
            y={-6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            DISSIMILARITY
          </text>
        </ExplainAnchor>

        {/* Anchors */}
        <ExplainAnchor
          selector="leaf"
          index={1}
          pin={{ x: wolfLeaf.x, y: wolfLeaf.y + 24 }}
          rect={clampRect({ x: wolfLeaf.x - 10, y: wolfLeaf.y - 6, width: 20, height: Math.min(36, ih - (wolfLeaf.y - 6)) })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="merge-point"
          index={2}
          pin={{ x: dogWolfMerge.x + 14, y: dogWolfMerge.y - 14 }}
          rect={clampRect({ x: dogWolfMerge.x - 12, y: dogWolfMerge.y - 8, width: 24, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="branch-height"
          index={3}
          pin={{ x: felidsMerge.x + 16, y: felidsMerge.y + 14 }}
          rect={clampRect({ x: felidsMerge.x - 10, y: felidsMerge.y - 4, width: 20, height: 8 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="cut-line"
          index={4}
          pin={{ x: 14, y: cutY - 14 }}
          rect={clampRect({ x: 0, y: cutY - 4, width: iw, height: 8 })}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="root"
          index={6}
          pin={{ x: rootMerge.x + 18, y: rootMerge.y + 14 }}
          rect={clampRect({ x: rootMerge.x - 12, y: rootMerge.y - 4, width: 24, height: 12 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
