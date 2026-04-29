"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { hierarchy, partition } from "d3-hierarchy";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic CPU call-stack profile for one page render, in milliseconds.
// Four levels deep; parent totals equal the sum of their children so the
// partition layout produces a clean nested tiling.
interface RawNode {
  name: string;
  value?: number;
  children?: RawNode[];
}

const DATA: RawNode = {
  name: "root",
  children: [
    {
      name: "renderPage",
      children: [
        {
          name: "LiveChartView",
          children: [
            { name: "ParentSize.measure", value: 5 },
            { name: "Visx.render", value: 30 },
            { name: "React.reconcile", value: 5 },
          ],
        },
        {
          name: "FilterSidebar",
          children: [
            { name: "computeCounts", value: 10 },
            { name: "useSearchParams", value: 3 },
            { name: "other", value: 2 },
          ],
        },
        { name: "other", value: 5 },
      ],
    },
    {
      name: "hydrateMarkup",
      children: [
        { name: "createRoot", value: 10 },
        { name: "applyPatches", value: 15 },
        { name: "other", value: 5 },
      ],
    },
    { name: "other", value: 10 },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Opacity ramp by depth so the four rows read as four levels without colour.
const DEPTH_OPACITY: Record<number, number> = {
  0: 0.34,
  1: 0.26,
  2: 0.2,
  3: 0.14,
};

function truncate(label: string, px: number): string {
  // Rough guess at how many mono chars fit — 5.6px per glyph at 9px.
  const maxChars = Math.max(0, Math.floor((px - 4) / 5.6));
  if (label.length <= maxChars) return label;
  if (maxChars <= 1) return "";
  return label.slice(0, Math.max(1, maxChars - 1)) + "…";
}

export function IcicleChart({ width, height }: Props) {
  const margin = { top: 10, right: 12, bottom: 10, left: 12 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const root = useMemo(() => {
    const h = hierarchy<RawNode>(DATA)
      .sum((d) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));
    // partition().size([w, h]) lays children along the FIRST axis; because
    // our hierarchy depth grows along the SECOND, we feed width then height
    // and treat (x0..x1) as horizontal extent and (y0..y1) as vertical row.
    return partition<RawNode>().size([Math.max(1, iw), Math.max(1, ih)]).padding(0)(h);
  }, [iw, ih]);

  const nodes = root.descendants();

  // Targets for anchors, picked by name so sort order doesn't break them.
  const rootNode = root;
  const renderPageBranch = root
    .descendants()
    .find((d) => d.data.name === "renderPage");
  const visxLeaf = root
    .descendants()
    .find((d) => d.data.name === "Visx.render");
  // "Hot path" anchor — the widest-and-deepest single node. We pick Visx.render
  // (30ms, depth 3) as the representative; it's both wide at its depth and
  // buried three levels down, which is the pattern the anchor explains.
  const hotPath = visxLeaf;

  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  }

  return (
    <svg width={width} height={height} role="img" aria-label="Icicle chart">
      <Group left={margin.left} top={margin.top}>
        {/* Rectangles — one per node, tinted by depth so the rows read */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const rw = Math.max(0, n.x1 - n.x0);
            const rh = Math.max(0, n.y1 - n.y0);
            if (rw <= 0 || rh <= 0) return null;
            const op = DEPTH_OPACITY[n.depth] ?? 0.1;
            return (
              <rect
                key={`r-${n.depth}-${n.data.name}-${n.x0.toFixed(1)}`}
                x={n.x0}
                y={n.y0}
                width={Math.max(0, rw - 1)}
                height={Math.max(0, rh - 1)}
                fill="var(--color-ink)"
                fillOpacity={op}
                stroke="var(--color-page)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* Labels — drawn separately so they stay fully opaque in Explain mode */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const rw = Math.max(0, n.x1 - n.x0);
            const rh = Math.max(0, n.y1 - n.y0);
            if (rw < 32 || rh < 12) return null;
            const label = n.depth === 0 ? "root · 100ms" : n.data.name;
            return (
              <text
                key={`lbl-${n.depth}-${n.data.name}-${n.x0.toFixed(1)}`}
                x={n.x0 + 4}
                y={n.y0 + rh / 2}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {truncate(label, rw)}
              </text>
            );
          })}
        </g>

        {/* Anchor 1: root — the top full-width bar */}
        <ExplainAnchor
          selector="root"
          index={1}
          pin={{ x: iw - 12, y: (rootNode.y0 + rootNode.y1) / 2 }}
          rect={clampRect({
            x: rootNode.x0,
            y: rootNode.y0,
            width: rootNode.x1 - rootNode.x0,
            height: rootNode.y1 - rootNode.y0,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: branch — renderPage, one mid-level node */}
        {renderPageBranch && (
          <ExplainAnchor
            selector="branch"
            index={2}
            pin={{
              x: (renderPageBranch.x0 + renderPageBranch.x1) / 2,
              y: (renderPageBranch.y0 + renderPageBranch.y1) / 2,
            }}
            rect={clampRect({
              x: renderPageBranch.x0,
              y: renderPageBranch.y0,
              width: renderPageBranch.x1 - renderPageBranch.x0,
              height: renderPageBranch.y1 - renderPageBranch.y0,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: leaf — Visx.render, deepest level */}
        {visxLeaf && (
          <ExplainAnchor
            selector="leaf"
            index={3}
            pin={{
              x: (visxLeaf.x0 + visxLeaf.x1) / 2,
              y: Math.min(ih - 8, visxLeaf.y1 + 6),
            }}
            rect={clampRect({
              x: visxLeaf.x0,
              y: visxLeaf.y0,
              width: visxLeaf.x1 - visxLeaf.x0,
              height: visxLeaf.y1 - visxLeaf.y0,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4: depth-axis — the vertical = depth concept.
            Rect hugs the left gutter of the plot so hover lands on the stack. */}
        <ExplainAnchor
          selector="depth-axis"
          index={4}
          pin={{ x: 8, y: ih / 2 }}
          rect={clampRect({
            x: 0,
            y: 0,
            width: 14,
            height: ih,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: width-encoding — width = value mechanic.
            Anchor on the root row (full width) so the relationship is obvious. */}
        <ExplainAnchor
          selector="width-encoding"
          index={5}
          pin={{ x: iw / 2, y: Math.max(4, rootNode.y0 - 4) }}
          rect={clampRect({
            x: rootNode.x0,
            y: rootNode.y0,
            width: rootNode.x1 - rootNode.x0,
            height: rootNode.y1 - rootNode.y0,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: hot-path — a wide-and-deep node, the shape of time spent */}
        {hotPath && (
          <ExplainAnchor
            selector="hot-path"
            index={6}
            pin={{
              x: Math.min(iw - 8, hotPath.x1 + 8),
              y: (hotPath.y0 + hotPath.y1) / 2,
            }}
            rect={clampRect({
              x: hotPath.x0,
              y: hotPath.y0,
              width: hotPath.x1 - hotPath.x0,
              height: hotPath.y1 - hotPath.y0,
            })}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
