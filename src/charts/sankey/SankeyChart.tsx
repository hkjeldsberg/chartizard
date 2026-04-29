"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { sankey as d3Sankey, sankeyLinkHorizontal } from "d3-sankey";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// US primary energy flow, 2023 (approx., quads).
// Left column — sources. Right column — consuming sectors plus the
// electric-generation-loss sink that makes the chart honest about
// conversion overhead.
type NodeIn = { name: string; kind: "source" | "sector" | "loss" };
type LinkIn = { source: number; target: number; value: number };

const NODES: ReadonlyArray<NodeIn> = [
  { name: "Petroleum", kind: "source" }, // 0
  { name: "Natural Gas", kind: "source" }, // 1
  { name: "Coal", kind: "source" }, // 2
  { name: "Nuclear", kind: "source" }, // 3
  { name: "Renewables", kind: "source" }, // 4
  { name: "Other", kind: "source" }, // 5
  { name: "Residential", kind: "sector" }, // 6
  { name: "Commercial", kind: "sector" }, // 7
  { name: "Industrial", kind: "sector" }, // 8
  { name: "Transportation", kind: "sector" }, // 9
  { name: "Electric loss", kind: "loss" }, // 10
];

// Flows chosen so each source sums to its total share and each sector sums
// to its total share, with Transportation dominated by Petroleum and the
// electric-loss sink capturing two-thirds of the thermal-plant throughput.
const LINKS: ReadonlyArray<LinkIn> = [
  // Petroleum (34) → mostly transportation + industrial
  { source: 0, target: 9, value: 23 },
  { source: 0, target: 8, value: 8 },
  { source: 0, target: 6, value: 1 },
  { source: 0, target: 7, value: 1 },
  { source: 0, target: 10, value: 1 },
  // Natural Gas (33) → industrial + residential + power plants
  { source: 1, target: 8, value: 11 },
  { source: 1, target: 6, value: 5 },
  { source: 1, target: 7, value: 4 },
  { source: 1, target: 9, value: 1 },
  { source: 1, target: 10, value: 12 },
  // Coal (10) → almost all to electric generation
  { source: 2, target: 8, value: 1 },
  { source: 2, target: 10, value: 9 },
  // Nuclear (8) → all to electric generation
  { source: 3, target: 10, value: 8 },
  // Renewables (13) → electric + industrial + residential
  { source: 4, target: 10, value: 7 },
  { source: 4, target: 8, value: 3 },
  { source: 4, target: 6, value: 2 },
  { source: 4, target: 7, value: 1 },
  // Other (2) → industrial
  { source: 5, target: 8, value: 2 },
];

interface Props {
  width: number;
  height: number;
}

// d3-sankey-resolved types. The library mutates the inputs to attach
// layout positions (x0/x1/y0/y1 on nodes, width + resolved source/target
// references on links) so we declare the resolved shape here and cast
// through the generic `SankeyExtraProperties` parameters.
interface SankeyNode extends NodeIn {
  index: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
  value: number;
}
interface SankeyLink {
  source: SankeyNode;
  target: SankeyNode;
  value: number;
  width: number;
  y0: number;
  y1: number;
}

export function SankeyChart({ width, height }: Props) {
  const margin = { top: 20, right: 96, bottom: 20, left: 96 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const graph = useMemo(() => {
    const gen = d3Sankey<SankeyNode, SankeyLink>()
      .nodeWidth(12)
      .nodePadding(8)
      .extent([
        [0, 0],
        [iw, ih],
      ])
      .nodeId((d) => d.index);

    // Clone inputs since d3-sankey mutates its arguments. Links start
    // with numeric source/target (node indices) and become node refs
    // after the layout pass — the double-cast keeps TS happy across
    // that mutation without weakening the downstream consumer types.
    const nodesCopy = NODES.map((n, i) => ({ ...n, index: i })) as SankeyNode[];
    const linksCopy = LINKS.map((l) => ({ ...l })) as unknown as SankeyLink[];

    return gen({ nodes: nodesCopy, links: linksCopy });
  }, [iw, ih]);

  const linkPath = sankeyLinkHorizontal<SankeyNode, SankeyLink>();

  function nodeFill(kind: NodeIn["kind"]): string {
    if (kind === "source") return "var(--color-ink)";
    if (kind === "loss") return "#8a7a52";
    return "#4a6a68";
  }

  // Pick representative nodes + flow for anchors.
  const petroleum = graph.nodes.find((n) => n.name === "Petroleum");
  const transportation = graph.nodes.find((n) => n.name === "Transportation");
  const electricLoss = graph.nodes.find((n) => n.name === "Electric loss");
  const petroleumToTransport = graph.links.find(
    (l) => l.source.name === "Petroleum" && l.target.name === "Transportation",
  );

  return (
    <svg width={width} height={height} role="img" aria-label="Sankey diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Ribbons */}
        <g data-data-layer="true" fill="none">
          {graph.links.map((link, i) => {
            const d = linkPath(link) ?? undefined;
            return (
              <path
                key={`lnk-${i}`}
                d={d}
                stroke={link.target.name === "Electric loss" ? "#8a7a52" : "var(--color-ink)"}
                strokeOpacity={0.4}
                strokeWidth={Math.max(1, link.width)}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {graph.nodes.map((n) => (
            <rect
              key={`n-${n.index}`}
              x={n.x0}
              y={n.y0}
              width={n.x1 - n.x0}
              height={Math.max(1, n.y1 - n.y0)}
              fill={nodeFill(n.kind)}
              stroke="var(--color-surface)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Node labels */}
        <g data-data-layer="true">
          {graph.nodes.map((n) => {
            const isSource = n.kind === "source";
            const lx = isSource ? n.x0 - 6 : n.x1 + 6;
            const ly = (n.y0 + n.y1) / 2;
            return (
              <g key={`lbl-${n.index}`}>
                <text
                  x={lx}
                  y={ly - 5}
                  textAnchor={isSource ? "end" : "start"}
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {n.name}
                </text>
                <text
                  x={lx}
                  y={ly + 6}
                  textAnchor={isSource ? "end" : "start"}
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {Math.round(n.value)}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors */}
        {petroleum && (
          <ExplainAnchor
            selector="source-node"
            index={1}
            pin={{ x: petroleum.x0 - 40, y: (petroleum.y0 + petroleum.y1) / 2 - 18 }}
            rect={{
              x: petroleum.x0 - 2,
              y: petroleum.y0,
              width: petroleum.x1 - petroleum.x0 + 4,
              height: Math.max(6, petroleum.y1 - petroleum.y0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {petroleumToTransport && (
          <ExplainAnchor
            selector="flow"
            index={2}
            pin={{
              x: iw / 2,
              y: (petroleumToTransport.y0 + petroleumToTransport.y1) / 2 - 16,
            }}
            rect={{
              x: petroleumToTransport.source.x1,
              y:
                Math.min(petroleumToTransport.y0, petroleumToTransport.y1) -
                petroleumToTransport.width / 2,
              width:
                petroleumToTransport.target.x0 - petroleumToTransport.source.x1,
              height: Math.max(8, petroleumToTransport.width),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        <ExplainAnchor
          selector="ribbon-width"
          index={3}
          pin={{ x: iw / 2 + 20, y: ih - 8 }}
          rect={{ x: iw / 4, y: ih / 2 - 8, width: iw / 2, height: 16 }}
        >
          <g />
        </ExplainAnchor>

        {transportation && (
          <ExplainAnchor
            selector="sink-node"
            index={4}
            pin={{ x: transportation.x1 + 56, y: (transportation.y0 + transportation.y1) / 2 - 18 }}
            rect={{
              x: transportation.x0 - 2,
              y: transportation.y0,
              width: transportation.x1 - transportation.x0 + 4,
              height: Math.max(6, transportation.y1 - transportation.y0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {transportation && (
          <ExplainAnchor
            selector="node-value"
            index={5}
            pin={{ x: transportation.x1 + 10, y: (transportation.y0 + transportation.y1) / 2 + 20 }}
            rect={{
              x: transportation.x1 + 2,
              y: (transportation.y0 + transportation.y1) / 2 + 2,
              width: 60,
              height: 14,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {electricLoss && (
          <ExplainAnchor
            selector="conversion-loss"
            index={6}
            pin={{ x: electricLoss.x1 + 56, y: (electricLoss.y0 + electricLoss.y1) / 2 }}
            rect={{
              x: electricLoss.x0 - 2,
              y: electricLoss.y0,
              width: electricLoss.x1 - electricLoss.x0 + 4,
              height: Math.max(6, electricLoss.y1 - electricLoss.y0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
