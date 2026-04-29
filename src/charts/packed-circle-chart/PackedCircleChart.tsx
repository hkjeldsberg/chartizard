"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, pack } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Native speaker counts (millions, approximate 2023 estimates) for the
// world's most-spoken languages, grouped by family. Source: Ethnologue (2023)
// and UNESCO Atlas of the World's Languages in Danger.
interface LangNode {
  name: string;
  value?: number;
  children?: LangNode[];
}

const DATA: LangNode = {
  name: "Languages",
  children: [
    {
      name: "Indo-European",
      children: [
        { name: "English", value: 380 },
        { name: "Spanish", value: 480 },
        { name: "Hindi", value: 340 },
        { name: "Portuguese", value: 230 },
        { name: "Bengali", value: 230 },
        { name: "Russian", value: 150 },
        { name: "German", value: 80 },
      ],
    },
    {
      name: "Sino-Tibetan",
      children: [
        { name: "Mandarin", value: 920 },
        { name: "Cantonese", value: 85 },
        { name: "Wu", value: 80 },
      ],
    },
    {
      name: "Afro-Asiatic",
      children: [
        { name: "Arabic", value: 310 },
        { name: "Hausa", value: 50 },
      ],
    },
    {
      name: "Austronesian",
      children: [
        { name: "Malay", value: 80 },
        { name: "Javanese", value: 80 },
        { name: "Tagalog", value: 30 },
      ],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Hide leaf labels on circles smaller than this radius (in px).
const LEAF_LABEL_MIN_R = 12;
// Hide group labels on circles smaller than this radius.
const GROUP_LABEL_MIN_R = 24;

function truncate(label: string, radius: number): string {
  const maxChars = Math.max(0, Math.floor((radius * 2 - 6) / 5.5));
  if (label.length <= maxChars) return label;
  if (maxChars <= 1) return "";
  return label.slice(0, Math.max(1, maxChars - 1)) + "…";
}

export function PackedCircleChart({ width, height }: Props) {
  const margin = { top: 10, right: 10, bottom: 10, left: 10 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const root = useMemo(() => {
    const h = hierarchy<LangNode>(DATA)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    return pack<LangNode>()
      .size([Math.max(1, iw), Math.max(1, ih)])
      .padding(3)(h);
  }, [iw, ih]);

  const nodes = useMemo(() => root.descendants(), [root]);

  // Pick representative nodes for anchors. We find by name so position
  // changes don't break the anchor assignments.
  const rootNode = root;
  const indoEuropeanNode = root.children?.find(
    (c) => c.data.name === "Indo-European",
  );
  const mandarinLeaf = nodes.find((n) => n.data.name === "Mandarin");
  const tagalogLeaf = nodes.find((n) => n.data.name === "Tagalog");
  const sinoTibetanNode = root.children?.find(
    (c) => c.data.name === "Sino-Tibetan",
  );
  // The language-group boundary concept: any two adjacent group circles.
  // We anchor at the overall root circle to represent the nesting structure.

  // Clamp a rect to the plot area.
  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width - (x - r.x))),
      height: Math.max(0, Math.min(ih - y, r.height - (y - r.y))),
    };
  }

  function rectAroundNode(
    n: { x: number; y: number; r: number },
    pad = 0,
  ) {
    return clampRect({
      x: n.x - n.r - pad,
      y: n.y - n.r - pad,
      width: n.r * 2 + pad * 2,
      height: n.r * 2 + pad * 2,
    });
  }

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Packed circle chart of world languages by native speakers"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Circles — depth 0 (root outline), depth 1 (groups), depth 2 (leaves) */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            if (n.depth === 0) {
              // Root outline: thin dashed ring.
              return (
                <circle
                  key={`c-root`}
                  cx={n.x}
                  cy={n.y}
                  r={Math.max(0, n.r - 0.5)}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                  strokeDasharray="2 3"
                />
              );
            }
            if (n.depth === 1) {
              // Group circles: tinted fill, thick stroke.
              return (
                <circle
                  key={`c-${n.data.name}`}
                  cx={n.x}
                  cy={n.y}
                  r={n.r}
                  fill="var(--color-ink)"
                  fillOpacity={0.1}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                  strokeOpacity={0.5}
                />
              );
            }
            // Depth 2 — leaf circles: filled.
            return (
              <circle
                key={`c-${n.parent?.data.name}-${n.data.name}`}
                cx={n.x}
                cy={n.y}
                r={n.r}
                fill="var(--color-ink)"
                fillOpacity={0.28}
                stroke="var(--color-page)"
                strokeWidth={0.75}
              />
            );
          })}
        </g>

        {/* Group labels (depth 1) — placed at the top of each group circle */}
        <g data-data-layer="true">
          {nodes
            .filter((n) => n.depth === 1 && n.r >= GROUP_LABEL_MIN_R)
            .map((n) => (
              <text
                key={`glbl-${n.data.name}`}
                x={n.x}
                y={n.y - n.r + 11}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={8.5}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                {truncate(n.data.name.toUpperCase(), n.r + 6)}
              </text>
            ))}
        </g>

        {/* Leaf labels (depth 2) — centred inside each leaf circle */}
        <g data-data-layer="true">
          {nodes
            .filter((n) => n.depth === 2 && n.r >= LEAF_LABEL_MIN_R)
            .map((n) => (
              <text
                key={`llbl-${n.parent?.data.name}-${n.data.name}`}
                x={n.x}
                y={n.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink)"
              >
                {truncate(n.data.name, n.r)}
              </text>
            ))}
        </g>

        {/* Anchor 1: root circle — the outermost boundary */}
        <ExplainAnchor
          selector="root-circle"
          index={1}
          pin={{ x: rootNode.x, y: Math.max(10, rootNode.y - rootNode.r + 10) }}
          rect={clampRect({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: group circle (Indo-European) */}
        {indoEuropeanNode && (
          <ExplainAnchor
            selector="group-circle"
            index={2}
            pin={{
              x: indoEuropeanNode.x,
              y: Math.max(10, indoEuropeanNode.y - indoEuropeanNode.r - 4),
            }}
            rect={rectAroundNode(indoEuropeanNode)}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: leaf circle (Mandarin — the largest leaf) */}
        {mandarinLeaf && (
          <ExplainAnchor
            selector="leaf-circle"
            index={3}
            pin={{
              x: mandarinLeaf.x + mandarinLeaf.r + 10,
              y: mandarinLeaf.y,
            }}
            rect={rectAroundNode(mandarinLeaf)}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4: area-proportional sizing (contrast Mandarin vs Tagalog) */}
        {tagalogLeaf && (
          <ExplainAnchor
            selector="area-sizing"
            index={4}
            pin={{
              x: Math.max(12, tagalogLeaf.x - tagalogLeaf.r - 10),
              y: tagalogLeaf.y,
            }}
            rect={rectAroundNode(tagalogLeaf, 2)}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 5: nesting hierarchy (Sino-Tibetan containing Mandarin etc.) */}
        {sinoTibetanNode && (
          <ExplainAnchor
            selector="nesting"
            index={5}
            pin={{
              x: sinoTibetanNode.x,
              y: Math.min(
                ih - 10,
                sinoTibetanNode.y + sinoTibetanNode.r + 4,
              ),
            }}
            rect={rectAroundNode(sinoTibetanNode)}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 6: language-group boundary — the full pack. Two adjacent
            group circles touching at their boundary represents the concept of
            family separation. We target the whole canvas to show that the
            outer ring partitions all groups. */}
        <ExplainAnchor
          selector="group-boundary"
          index={6}
          pin={{ x: iw - 12, y: ih - 12 }}
          rect={clampRect({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
