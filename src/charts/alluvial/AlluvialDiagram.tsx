"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic cohort of 1000 students tracked across three categorical
// stages — high-school track, tertiary path, career field. The flow
// matrix is internally consistent: every node's height equals the sum
// of the ribbons entering and leaving it, so the diagram obeys
// conservation the way a Sankey does. It is alluvial rather than
// Sankey because the three columns are categorical stages in a single
// cohort, not a network of sources and sinks.

type StageIndex = 0 | 1 | 2;

interface NodeIn {
  stage: StageIndex;
  name: string;
  value: number;
}

interface LinkIn {
  source: string; // node name in stage n
  target: string; // node name in stage n+1
  value: number;
}

const STAGES: ReadonlyArray<ReadonlyArray<NodeIn>> = [
  [
    { stage: 0, name: "Academic", value: 500 },
    { stage: 0, name: "Vocational", value: 300 },
    { stage: 0, name: "Arts", value: 200 },
  ],
  [
    { stage: 1, name: "University", value: 550 },
    { stage: 1, name: "Trade school", value: 200 },
    { stage: 1, name: "No further", value: 150 },
    { stage: 1, name: "Gap year", value: 100 },
  ],
  [
    { stage: 2, name: "Tech", value: 250 },
    { stage: 2, name: "Healthcare", value: 200 },
    { stage: 2, name: "Trades", value: 200 },
    { stage: 2, name: "Creative", value: 150 },
    { stage: 2, name: "Business", value: 150 },
    { stage: 2, name: "Other", value: 50 },
  ],
];

const LINKS_01: ReadonlyArray<LinkIn> = [
  { source: "Academic", target: "University", value: 420 },
  { source: "Academic", target: "Trade school", value: 30 },
  { source: "Academic", target: "No further", value: 20 },
  { source: "Academic", target: "Gap year", value: 30 },
  { source: "Vocational", target: "University", value: 50 },
  { source: "Vocational", target: "Trade school", value: 160 },
  { source: "Vocational", target: "No further", value: 70 },
  { source: "Vocational", target: "Gap year", value: 20 },
  { source: "Arts", target: "University", value: 80 },
  { source: "Arts", target: "Trade school", value: 10 },
  { source: "Arts", target: "No further", value: 60 },
  { source: "Arts", target: "Gap year", value: 50 },
];

const LINKS_12: ReadonlyArray<LinkIn> = [
  { source: "University", target: "Tech", value: 180 },
  { source: "University", target: "Healthcare", value: 150 },
  { source: "University", target: "Trades", value: 30 },
  { source: "University", target: "Creative", value: 80 },
  { source: "University", target: "Business", value: 90 },
  { source: "University", target: "Other", value: 20 },
  { source: "Trade school", target: "Tech", value: 30 },
  { source: "Trade school", target: "Healthcare", value: 20 },
  { source: "Trade school", target: "Trades", value: 130 },
  { source: "Trade school", target: "Creative", value: 10 },
  { source: "Trade school", target: "Business", value: 10 },
  { source: "No further", target: "Tech", value: 20 },
  { source: "No further", target: "Healthcare", value: 20 },
  { source: "No further", target: "Trades", value: 30 },
  { source: "No further", target: "Creative", value: 20 },
  { source: "No further", target: "Business", value: 40 },
  { source: "No further", target: "Other", value: 20 },
  { source: "Gap year", target: "Tech", value: 20 },
  { source: "Gap year", target: "Healthcare", value: 10 },
  { source: "Gap year", target: "Trades", value: 10 },
  { source: "Gap year", target: "Creative", value: 40 },
  { source: "Gap year", target: "Business", value: 10 },
  { source: "Gap year", target: "Other", value: 10 },
];

interface PlacedNode extends NodeIn {
  y0: number;
  y1: number;
  x0: number;
  x1: number;
}

interface PlacedLink {
  source: PlacedNode;
  target: PlacedNode;
  value: number;
  sy0: number; // source y0 (top of ribbon at source edge)
  sy1: number; // source y1 (bottom)
  ty0: number; // target y0
  ty1: number; // target y1
}

interface Props {
  width: number;
  height: number;
}

// Source-colour palette for ribbons — each stage-0 node owns a hue that
// is inherited by every ribbon that originated in it, so the eye can
// follow a cohort from left to right even as it subdivides.
const STAGE0_COLOURS: Record<string, string> = {
  Academic: "var(--color-ink)",
  Vocational: "#4a6a68",
  Arts: "#8a6a52",
};

// Resolve a ribbon's "origin" stage-0 group by walking backwards. The
// stage-1→stage-2 ribbons inherit the dominant stage-0 source of their
// stage-1 node — a teaching compromise so the palette stays readable.
function originColour(
  srcName: string,
  stage: 0 | 1,
  links01: ReadonlyArray<LinkIn>,
): string {
  if (stage === 0) return STAGE0_COLOURS[srcName] ?? "var(--color-ink)";
  // stage 1 — find the biggest stage-0 contributor.
  let best = { name: "Academic", value: -1 };
  for (const l of links01) {
    if (l.target === srcName && l.value > best.value) {
      best = { name: l.source, value: l.value };
    }
  }
  return STAGE0_COLOURS[best.name] ?? "var(--color-ink)";
}

export function AlluvialDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 84, bottom: 28, left: 84 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { placedNodes, placedLinks, nodeWidth, stageX } = useMemo(() => {
    // Column geometry.
    const nw = 10;
    const stages = STAGES.length;
    const xs: number[] = [];
    for (let i = 0; i < stages; i += 1) {
      xs.push(iw === 0 ? 0 : (iw - nw) * (i / (stages - 1)));
    }

    // Column total (1000 in each stage by construction) and the gap
    // between nodes within a column. Gap padding scales with the
    // available vertical room so short tiles don't collapse.
    const columnTotal = 1000;
    const nodePadding = Math.min(10, ih * 0.04);

    const placed: Record<string, PlacedNode> = {};
    const byStage: PlacedNode[][] = [];

    for (let s = 0; s < stages; s += 1) {
      const nodes = STAGES[s];
      const padTotal = nodePadding * Math.max(0, nodes.length - 1);
      const scale = ih === 0 ? 0 : (ih - padTotal) / columnTotal;
      let y = 0;
      const row: PlacedNode[] = [];
      for (const n of nodes) {
        const h = Math.max(1, n.value * scale);
        const pn: PlacedNode = {
          ...n,
          x0: xs[s],
          x1: xs[s] + nw,
          y0: y,
          y1: y + h,
        };
        placed[`${s}:${n.name}`] = pn;
        row.push(pn);
        y = pn.y1 + nodePadding;
      }
      byStage.push(row);
    }

    // Place ribbons. For each stage n → n+1 link, track a running
    // offset on both ends so ribbons stack inside their source /
    // target node without overlap. Links are processed in input
    // order, which is a reasonable "teaching" ordering — no crossing
    // minimisation, since the didactic payoff is following the
    // ribbon, not minimising ink.
    const sourceCursor: Record<string, number> = {};
    const targetCursor: Record<string, number> = {};

    function placeLinkGroup(
      fromStage: 0 | 1,
      links: ReadonlyArray<LinkIn>,
    ): PlacedLink[] {
      const out: PlacedLink[] = [];
      const columnTotalLocal = 1000;
      const nodesSrc = STAGES[fromStage];
      const nodesTgt = STAGES[fromStage + 1];
      const padTotalSrc = nodePadding * Math.max(0, nodesSrc.length - 1);
      const padTotalTgt = nodePadding * Math.max(0, nodesTgt.length - 1);
      const scaleSrc = ih === 0 ? 0 : (ih - padTotalSrc) / columnTotalLocal;
      const scaleTgt = ih === 0 ? 0 : (ih - padTotalTgt) / columnTotalLocal;

      for (const l of links) {
        const src = placed[`${fromStage}:${l.source}`];
        const tgt = placed[`${fromStage + 1}:${l.target}`];
        if (!src || !tgt) continue;
        const sKey = `${fromStage}:${l.source}`;
        const tKey = `${fromStage + 1}:${l.target}`;
        const sCur = sourceCursor[sKey] ?? 0;
        const tCur = targetCursor[tKey] ?? 0;
        const hSrc = l.value * scaleSrc;
        const hTgt = l.value * scaleTgt;
        const sy0 = src.y0 + sCur;
        const sy1 = sy0 + hSrc;
        const ty0 = tgt.y0 + tCur;
        const ty1 = ty0 + hTgt;
        sourceCursor[sKey] = sCur + hSrc;
        targetCursor[tKey] = tCur + hTgt;
        out.push({ source: src, target: tgt, value: l.value, sy0, sy1, ty0, ty1 });
      }
      return out;
    }

    const links01 = placeLinkGroup(0, LINKS_01);
    const links12 = placeLinkGroup(1, LINKS_12);

    return {
      placedNodes: byStage,
      placedLinks: [...links01, ...links12],
      nodeWidth: nw,
      stageX: xs,
    };
  }, [iw, ih]);

  // Cubic bezier ribbon: a fill-closed shape running from the source
  // node's right edge to the target node's left edge. Top curve then
  // bottom curve back, closed — same recipe the Sankey thumbnail uses
  // but driven by the real layout coordinates.
  function ribbonPath(link: PlacedLink): string {
    const x0 = link.source.x1;
    const x1 = link.target.x0;
    const mx = (x0 + x1) / 2;
    return [
      `M${x0},${link.sy0}`,
      `C${mx},${link.sy0} ${mx},${link.ty0} ${x1},${link.ty0}`,
      `L${x1},${link.ty1}`,
      `C${mx},${link.ty1} ${mx},${link.sy1} ${x0},${link.sy1}`,
      "Z",
    ].join(" ");
  }

  function ribbonFill(link: PlacedLink): string {
    const fromStage = link.source.stage as 0 | 1;
    return originColour(link.source.name, fromStage, LINKS_01);
  }

  // Anchor targets.
  const stage1Nodes = placedNodes[1] ?? [];
  const university = stage1Nodes.find((n) => n.name === "University");
  const academicToUni = placedLinks.find(
    (l) => l.source.name === "Academic" && l.target.name === "University",
  );
  const stageColumnX = stageX[1] ?? 0;

  return (
    <svg width={width} height={height} role="img" aria-label="Alluvial diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Stage headers */}
        <g data-data-layer="true">
          {["High-school track", "Tertiary path", "Career field"].map((label, i) => (
            <text
              key={label}
              x={stageX[i] + nodeWidth / 2}
              y={-10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={500}
              fill="var(--color-ink-mute)"
            >
              {label.toUpperCase()}
            </text>
          ))}
        </g>

        {/* Ribbons (behind nodes) */}
        <g data-data-layer="true">
          {placedLinks.map((link, i) => (
            <path
              key={`lnk-${i}`}
              d={ribbonPath(link)}
              fill={ribbonFill(link)}
              fillOpacity={0.4}
              stroke="none"
            />
          ))}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {placedNodes.flat().map((n) => (
            <rect
              key={`n-${n.stage}-${n.name}`}
              x={n.x0}
              y={n.y0}
              width={n.x1 - n.x0}
              height={Math.max(1, n.y1 - n.y0)}
              fill="var(--color-ink)"
              stroke="var(--color-surface)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Node labels (outside edges) */}
        <g data-data-layer="true">
          {placedNodes.flat().map((n) => {
            // Left column anchors labels to the LEFT of the node; right
            // column anchors to the RIGHT; middle column labels sit
            // just to the right of the node.
            const isFirst = n.stage === 0;
            const isLast = n.stage === STAGES.length - 1;
            const lx = isFirst ? n.x0 - 6 : isLast ? n.x1 + 6 : n.x1 + 6;
            const anchor = isFirst ? "end" : "start";
            const ly = (n.y0 + n.y1) / 2;
            return (
              <g key={`lbl-${n.stage}-${n.name}`}>
                <text
                  x={lx}
                  y={ly - 5}
                  textAnchor={anchor}
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
                  textAnchor={anchor}
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {n.value}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors — all render unconditionally. Rects clamped to the
            plot area. Pins positioned adjacent to the elements. */}

        {/* 1. Stage column — the whole middle column (Tertiary path) */}
        <ExplainAnchor
          selector="stage"
          index={1}
          pin={{ x: stageColumnX + nodeWidth / 2, y: -22 }}
          rect={{
            x: Math.max(0, stageColumnX - 4),
            y: 0,
            width: Math.min(iw - Math.max(0, stageColumnX - 4), nodeWidth + 8),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Node — "University" */}
        {university && (
          <ExplainAnchor
            selector="node"
            index={2}
            pin={{ x: university.x1 + 60, y: university.y0 + 14 }}
            rect={{
              x: Math.max(0, university.x0 - 2),
              y: university.y0,
              width: Math.min(iw - Math.max(0, university.x0 - 2), nodeWidth + 4),
              height: Math.max(6, university.y1 - university.y0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 3. Ribbon — "Academic → University" */}
        {academicToUni && (
          <ExplainAnchor
            selector="ribbon"
            index={3}
            pin={{
              x: (academicToUni.source.x1 + academicToUni.target.x0) / 2,
              y: (academicToUni.sy0 + academicToUni.ty0) / 2 - 16,
            }}
            rect={{
              x: academicToUni.source.x1,
              y: Math.min(academicToUni.sy0, academicToUni.ty0),
              width: Math.max(2, academicToUni.target.x0 - academicToUni.source.x1),
              height:
                Math.max(academicToUni.sy1, academicToUni.ty1) -
                Math.min(academicToUni.sy0, academicToUni.ty0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 4. Ribbon width — concept anchor over the thickest ribbon (Academic→University again, but measured at midspan) */}
        {academicToUni && (
          <ExplainAnchor
            selector="ribbon-width"
            index={4}
            pin={{
              x: (academicToUni.source.x1 + academicToUni.target.x0) / 2,
              y: (academicToUni.sy1 + academicToUni.ty1) / 2 + 18,
            }}
            rect={{
              x: academicToUni.source.x1,
              y: Math.max(academicToUni.sy1, academicToUni.ty1) - 4,
              width: Math.max(2, academicToUni.target.x0 - academicToUni.source.x1),
              height: 8,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 5. Cohort tracking — sweep rect across the whole diagram width */}
        <ExplainAnchor
          selector="cohort-tracking"
          index={5}
          pin={{ x: iw / 2, y: ih - 10 }}
          rect={{ x: 0, y: ih * 0.55, width: iw, height: Math.max(10, ih * 0.35) }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Column order — the left-to-right progression */}
        <ExplainAnchor
          selector="column-order"
          index={6}
          pin={{ x: iw / 2, y: -22 }}
          rect={{ x: 0, y: 0, width: iw, height: Math.max(8, Math.min(20, ih * 0.08)) }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
