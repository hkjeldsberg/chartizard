"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, pack } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// node_modules disk usage for a representative Next.js project, synthetic MB.
// Three levels: root -> top packages -> sub-packages. Leaf values roll up
// so the layout produces clean, nested circles without rounding drift.
interface RawNode {
  name: string;
  value?: number;
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "node_modules",
  children: [
    {
      name: "@types",
      children: [
        { name: "node", value: 12 },
        { name: "react", value: 8 },
        { name: "d3-*", value: 6 },
        { name: "others", value: 19 },
      ],
    },
    { name: "react-dom", value: 25 },
    {
      name: "next",
      children: [
        { name: "swc", value: 35 },
        { name: "webpack", value: 25 },
        { name: "compiled", value: 20 },
      ],
    },
    {
      name: "@visx",
      children: [
        { name: "shape", value: 8 },
        { name: "scale", value: 7 },
        { name: "axis", value: 5 },
        { name: "responsive", value: 4 },
        { name: "others", value: 6 },
      ],
    },
    {
      name: "d3-*",
      children: [
        { name: "hexbin", value: 2 },
        { name: "hierarchy", value: 3 },
        { name: "sankey", value: 3 },
        { name: "chord", value: 2 },
        { name: "others", value: 5 },
      ],
    },
    {
      name: "tailwindcss",
      children: [
        { name: "compiled", value: 35 },
        { name: "oxide", value: 15 },
        { name: "others", value: 10 },
      ],
    },
    { name: "typescript", value: 55 },
    { name: "eslint", value: 20 },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Hide labels on circles smaller than this radius to keep the chart readable.
const LABEL_MIN_R = 14;

// Depth-opacity ramp: root is invisible (no ring), depth 1 a soft tint,
// depth 2 leaves the strongest — so leaves read as "real" and the parent
// circles feel like containers instead of competing marks.
const DEPTH_OPACITY: Record<number, number> = {
  0: 0,
  1: 0.12,
  2: 0.28,
};

function truncate(label: string, radius: number): string {
  // ~6px per mono glyph at 10px, with a bit of padding off each side.
  const maxChars = Math.max(0, Math.floor((radius * 2 - 4) / 6));
  if (label.length <= maxChars) return label;
  if (maxChars <= 1) return "";
  return label.slice(0, Math.max(1, maxChars - 1)) + "…";
}

export function CirclePackingChart({ width, height }: Props) {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return pack<RawNode>().size([Math.max(1, iw), Math.max(1, ih)]).padding(2)(h);
  }, [iw, ih]);

  // Pull out targets for anchors by name so ordering tweaks don't break them.
  const rootNode = root;
  const nextParent = root.children?.find((c) => c.data.name === "next");
  const swcLeaf = nextParent?.children?.find((c) => c.data.name === "swc");
  // A representative pair for the "nesting" concept: parent tailwindcss + its
  // compiled leaf. We anchor the parent; the concept is the containment itself.
  const tailwindParent = root.children?.find((c) => c.data.name === "tailwindcss");
  // A representative small leaf for the "size" mechanic — small by design.
  const smallLeaf = root
    .descendants()
    .filter((d) => d.depth === 2)
    .sort((a, b) => (a.value ?? 0) - (b.value ?? 0))[0];

  // All descendants, rendered depth-first so parents sit under leaves.
  const nodes = root.descendants();

  // Clamp any rect to the plot area so Explain pins stay on canvas.
  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Circle packing">
      <Group left={margin.left} top={margin.top}>
        {/* Circles — depth-tinted; parent circles behind, leaves on top. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const op = DEPTH_OPACITY[n.depth] ?? 0.34;
            if (op === 0) return null;
            return (
              <circle
                key={`c-${n.data.name}-${n.x.toFixed(1)}-${n.y.toFixed(1)}`}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="var(--color-ink)"
                fillOpacity={op}
                stroke="var(--color-page)"
                strokeWidth={n.depth === 1 ? 1.25 : 0.75}
              />
            );
          })}
        </g>

        {/* Parent labels — placed on top of the ring, only if the circle is large */}
        <g data-data-layer="true">
          {nodes
            .filter((n) => n.depth === 1 && n.r >= LABEL_MIN_R + 6)
            .map((n) => (
              <text
                key={`plbl-${n.data.name}`}
                x={n.x}
                y={n.y - n.r + 10}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight={500}
                fill="var(--color-ink)"
              >
                {truncate(n.data.name.toUpperCase(), n.r + 8)}
              </text>
            ))}
        </g>

        {/* Leaf labels — centred, hidden when the circle is too small */}
        <g data-data-layer="true">
          {nodes
            .filter((n) => n.depth === 2 && n.r >= LABEL_MIN_R)
            .map((n) => (
              <text
                key={`llbl-${n.parent?.data.name}-${n.data.name}`}
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {truncate(n.data.name, n.r)}
              </text>
            ))}
        </g>

        {/* Anchor 1: root-circle — the outermost bound. Invisible ring as target. */}
        <ExplainAnchor
          selector="root-circle"
          index={1}
          pin={{ x: rootNode.x, y: Math.max(12, rootNode.y - rootNode.r + 10) }}
          rect={clampRect({
            x: 0,
            y: 0,
            width: iw,
            height: ih,
          })}
        >
          <circle
            cx={rootNode.x}
            cy={rootNode.y}
            r={Math.max(0, rootNode.r - 0.5)}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
        </ExplainAnchor>

        {/* Anchor 2: parent-circle — the "next" package ring */}
        {nextParent && (
          <ExplainAnchor
            selector="parent-circle"
            index={2}
            pin={{
              x: nextParent.x,
              y: Math.max(10, nextParent.y - nextParent.r - 4),
            }}
            rect={clampRect({
              x: nextParent.x - nextParent.r,
              y: nextParent.y - nextParent.r,
              width: nextParent.r * 2,
              height: nextParent.r * 2,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: leaf-circle — a sub-package leaf (next/swc) */}
        {swcLeaf && (
          <ExplainAnchor
            selector="leaf-circle"
            index={3}
            pin={{ x: swcLeaf.x + swcLeaf.r + 10, y: swcLeaf.y }}
            rect={clampRect({
              x: swcLeaf.x - swcLeaf.r,
              y: swcLeaf.y - swcLeaf.r,
              width: swcLeaf.r * 2,
              height: swcLeaf.r * 2,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4: nesting — the concept that containment means child-of.
            Targets the tailwindcss parent so its leaves are visibly inside. */}
        {tailwindParent && (
          <ExplainAnchor
            selector="nesting"
            index={4}
            pin={{
              x: tailwindParent.x,
              y: Math.min(ih - 10, tailwindParent.y + tailwindParent.r + 4),
            }}
            rect={clampRect({
              x: tailwindParent.x - tailwindParent.r,
              y: tailwindParent.y - tailwindParent.r,
              width: tailwindParent.r * 2,
              height: tailwindParent.r * 2,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 5: packing — siblings packing against each other.
            Target the whole plot area so the sibling-against-sibling arrangement
            is the object of attention, not a single circle. */}
        <ExplainAnchor
          selector="packing"
          index={5}
          pin={{ x: iw - 10, y: ih - 10 }}
          rect={clampRect({
            x: 0,
            y: 0,
            width: iw,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: size — radius encodes value. Target a small leaf by
            contrast with the big ones so the mechanic is visible. */}
        {smallLeaf && (
          <ExplainAnchor
            selector="size"
            index={6}
            pin={{
              x: Math.max(12, smallLeaf.x - smallLeaf.r - 10),
              y: smallLeaf.y,
            }}
            rect={clampRect({
              x: smallLeaf.x - smallLeaf.r,
              y: smallLeaf.y - smallLeaf.r,
              width: smallLeaf.r * 2,
              height: smallLeaf.r * 2,
            })}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
