"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Product-launch decision tree. Root is a decision square; first branch splits
// on Launch / Don't launch; Launch fans out into a chance circle over market
// reception; the Strong branch chains another decision (Scale to EU?) which
// itself fans out into another chance circle with terminal values.

type NodeKind = "decision" | "chance" | "terminal";

interface Node {
  id: string;
  kind: NodeKind;
  label: string;
  // Position in a 0..100 layout space (root on LEFT, leaves on RIGHT).
  lx: number;
  ly: number;
  // Terminal dollar value (displayed beside triangle leaves).
  value?: string;
}

interface Edge {
  from: string;
  to: string;
  // Label drawn mid-edge: probability ("0.3") or choice name ("Launch").
  label: string;
  // Optional second-line annotation (e.g. "(→ +$50M)").
  sub?: string;
}

// Canonical product-launch tree, laid out left-to-right.
const NODES: ReadonlyArray<Node> = [
  // Root decision
  { id: "root", kind: "decision", label: "Launch\nproduct X?", lx: 4, ly: 50 },

  // Don't-launch branch — terminal opportunity-cost leaf.
  { id: "dontlaunch-end", kind: "terminal", label: "baseline", lx: 94, ly: 86, value: "$0" },

  // Launch branch leads into a chance circle for market reception.
  { id: "market", kind: "chance", label: "Market\nreception", lx: 30, ly: 32 },

  // Moderate and Weak reception go straight to terminals.
  { id: "moderate-end", kind: "terminal", label: "moderate", lx: 94, ly: 36, value: "+$10M" },
  { id: "weak-end", kind: "terminal", label: "weak", lx: 94, ly: 54, value: "-$15M" },

  // Strong reception → Scale-to-EU decision.
  { id: "scale", kind: "decision", label: "Scale\nto EU?", lx: 54, ly: 14 },

  // No-scale leaf (Strong but stay domestic).
  { id: "noscale-end", kind: "terminal", label: "stay", lx: 94, ly: 20, value: "+$50M" },

  // Scale → chance circle for EU reception.
  { id: "eu", kind: "chance", label: "EU\nreception", lx: 74, ly: 6 },

  // EU terminals.
  { id: "eu-good-end", kind: "terminal", label: "good EU", lx: 94, ly: 2, value: "+$90M" },
  { id: "eu-poor-end", kind: "terminal", label: "poor EU", lx: 94, ly: 12, value: "+$30M" },
];

const EDGES: ReadonlyArray<Edge> = [
  // Root decision branches
  { from: "root", to: "market", label: "Launch" },
  { from: "root", to: "dontlaunch-end", label: "Don't launch" },

  // Market-reception probabilities
  { from: "market", to: "scale", label: "0.3", sub: "strong" },
  { from: "market", to: "moderate-end", label: "0.5", sub: "moderate" },
  { from: "market", to: "weak-end", label: "0.2", sub: "weak" },

  // Scale-to-EU decision branches
  { from: "scale", to: "eu", label: "Scale" },
  { from: "scale", to: "noscale-end", label: "Stay" },

  // EU chance branches
  { from: "eu", to: "eu-good-end", label: "0.6" },
  { from: "eu", to: "eu-poor-end", label: "0.4" },
];

interface Props {
  width: number;
  height: number;
}

export function DecisionTreeDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 72, bottom: 36, left: 72 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Node lookup by id.
  const nodeById = useMemo(() => new Map(NODES.map((n) => [n.id, n])), []);

  // Layout-space → pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  // Shape half-sizes in pixels, for edge-anchoring and rendering.
  const DEC_HALF = 14; // decision square ~28×28 (rounded corners)
  const CHANCE_R = 12; // chance circle radius
  const TERM_HALF = 9; // terminal triangle half-size

  // Return the anchor point on a node's perimeter facing `towards`.
  const edgeAnchor = (
    n: Node,
    towards: { x: number; y: number },
  ): { x: number; y: number } => {
    const cx = px(n.lx);
    const cy = py(n.ly);
    if (n.kind === "decision") {
      // Treat as square: exit on the side nearest the target.
      const dx = towards.x - cx;
      const dy = towards.y - cy;
      if (Math.abs(dx) >= Math.abs(dy)) {
        return { x: cx + Math.sign(dx) * DEC_HALF, y: cy };
      }
      return { x: cx, y: cy + Math.sign(dy) * DEC_HALF };
    }
    if (n.kind === "chance") {
      const dx = towards.x - cx;
      const dy = towards.y - cy;
      const len = Math.max(1, Math.sqrt(dx * dx + dy * dy));
      return { x: cx + (dx / len) * CHANCE_R, y: cy + (dy / len) * CHANCE_R };
    }
    // Terminal triangle — anchor on the LEFT vertex (tree points right).
    return { x: cx - TERM_HALF, y: cy };
  };

  // Right-angle elbow: horizontal stub from source out, then vertical run,
  // then horizontal into the target. Matches classic decision-tree style.
  const edgePath = (a: { x: number; y: number }, b: { x: number; y: number }): string => {
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} H ${midX} V ${b.y} H ${b.x}`;
  };

  // Precomputed edge geometries.
  const edgeGeoms = useMemo(() => {
    return EDGES.map((e) => {
      const from = nodeById.get(e.from);
      const to = nodeById.get(e.to);
      if (!from || !to) return null;
      const toCentre = { x: px(to.lx), y: py(to.ly) };
      const fromCentre = { x: px(from.lx), y: py(from.ly) };
      const a = edgeAnchor(from, toCentre);
      const b = edgeAnchor(to, fromCentre);
      const midX = (a.x + b.x) / 2;
      return {
        edge: e,
        a,
        b,
        d: edgePath(a, b),
        labelX: midX,
        labelY: a.y - 4,
      };
    }).filter((g): g is NonNullable<typeof g> => g !== null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [iw, ih]);

  // Clamp anchor rects to the plot area.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // ----- Representative nodes & edges for anchors -----
  const rootNode = nodeById.get("root")!;
  const marketNode = nodeById.get("market")!;
  const moderateEnd = nodeById.get("moderate-end")!;
  const marketToModerate = edgeGeoms.find(
    (g) => g.edge.from === "market" && g.edge.to === "moderate-end",
  )!;

  const rootX = px(rootNode.lx);
  const rootY = py(rootNode.ly);
  const marketX = px(marketNode.lx);
  const marketY = py(marketNode.ly);
  const modX = px(moderateEnd.lx);
  const modY = py(moderateEnd.ly);

  // EV-annotation position: just above the market chance circle.
  const evX = marketX - 6;
  const evY = marketY - CHANCE_R - 10;

  // Legend position (top-left of plot area).
  const legendX = 0;
  const legendY = -margin.top + 4;
  const legendW = 138;
  const legendH = 20;

  return (
    <svg width={width} height={height} role="img" aria-label="Decision tree diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Edges (drawn first so shapes paint on top) */}
        <g data-data-layer="true">
          {edgeGeoms.map((g, i) => (
            <g key={`edge-${i}`}>
              <path
                d={g.d}
                fill="none"
                stroke="var(--color-ink-mute)"
                strokeWidth={1.1}
              />
              {/* Mid-edge label: probability or choice */}
              <text
                x={g.labelX}
                y={g.labelY}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {g.edge.label}
              </text>
              {g.edge.sub && (
                <text
                  x={g.labelX}
                  y={g.labelY + 10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-mute)"
                  opacity={0.8}
                >
                  {g.edge.sub}
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => {
            const cx = px(n.lx);
            const cy = py(n.ly);
            if (n.kind === "decision") {
              return (
                <g key={`n-${n.id}`}>
                  <rect
                    x={cx - DEC_HALF}
                    y={cy - DEC_HALF}
                    width={DEC_HALF * 2}
                    height={DEC_HALF * 2}
                    rx={3}
                    ry={3}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1.4}
                  />
                  {n.label.split("\n").map((line, i) => (
                    <text
                      key={i}
                      x={cx}
                      y={cy - 3 + i * 10}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink)"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            }
            if (n.kind === "chance") {
              return (
                <g key={`n-${n.id}`}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={CHANCE_R}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1.4}
                  />
                  {n.label.split("\n").map((line, i) => (
                    <text
                      key={i}
                      x={cx}
                      y={cy - 2 + i * 8}
                      textAnchor="middle"
                      fontFamily="var(--font-mono)"
                      fontSize={7}
                      fill="var(--color-ink)"
                    >
                      {line}
                    </text>
                  ))}
                </g>
              );
            }
            // Terminal triangle — pointing right (values beside it).
            const pts = `${cx - TERM_HALF},${cy - TERM_HALF} ${cx + TERM_HALF},${cy} ${cx - TERM_HALF},${cy + TERM_HALF}`;
            return (
              <g key={`n-${n.id}`}>
                <polygon
                  points={pts}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.3}
                />
                {n.value && (
                  <text
                    x={cx + TERM_HALF + 4}
                    y={cy + 3}
                    textAnchor="start"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fontWeight={500}
                    fill="var(--color-ink)"
                  >
                    {n.value}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Expected-value annotation near the market chance node */}
        <g data-data-layer="true">
          <text
            x={evX}
            y={evY}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            EV[Launch] = 17M
          </text>
          <text
            x={evX}
            y={evY + 9}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            0.3·50 + 0.5·10 + 0.2·(-15)
          </text>
        </g>

        {/* Convention legend — square / circle / triangle */}
        <g data-data-layer="true" transform={`translate(${legendX}, ${legendY})`}>
          <rect
            x={0}
            y={0}
            width={legendW}
            height={legendH}
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          {/* square */}
          <rect x={6} y={5} width={10} height={10} rx={1.5} ry={1.5} fill="none" stroke="var(--color-ink)" strokeWidth={1.1} />
          <text x={20} y={13} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            DECISION
          </text>
          {/* circle */}
          <circle cx={61} cy={10} r={5} fill="none" stroke="var(--color-ink)" strokeWidth={1.1} />
          <text x={69} y={13} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            CHANCE
          </text>
          {/* triangle */}
          <polygon
            points={`104,5 112,10 104,15`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <text x={116} y={13} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            LEAF
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. decision-node (the root square) */}
        <ExplainAnchor
          selector="decision-node"
          index={1}
          pin={{ x: rootX, y: rootY + DEC_HALF + 16 }}
          rect={clampRect({
            x: rootX - DEC_HALF - 2,
            y: rootY - DEC_HALF - 2,
            width: DEC_HALF * 2 + 4,
            height: DEC_HALF * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. chance-node (the market-reception circle) */}
        <ExplainAnchor
          selector="chance-node"
          index={2}
          pin={{ x: marketX - CHANCE_R - 14, y: marketY + 4 }}
          rect={clampRect({
            x: marketX - CHANCE_R - 2,
            y: marketY - CHANCE_R - 2,
            width: CHANCE_R * 2 + 4,
            height: CHANCE_R * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. probability-edge (the 0.5 moderate branch out of market) */}
        <ExplainAnchor
          selector="probability-edge"
          index={3}
          pin={{ x: marketToModerate.labelX, y: marketToModerate.labelY - 12 }}
          rect={clampRect({
            x: Math.min(marketToModerate.a.x, marketToModerate.b.x) - 4,
            y: Math.min(marketToModerate.a.y, marketToModerate.b.y) - 6,
            width: Math.abs(marketToModerate.b.x - marketToModerate.a.x) + 8,
            height: Math.max(12, Math.abs(marketToModerate.b.y - marketToModerate.a.y) + 12),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. terminal-leaf (the moderate terminal triangle with +$10M) */}
        <ExplainAnchor
          selector="terminal-leaf"
          index={4}
          pin={{ x: modX, y: modY + TERM_HALF + 16 }}
          rect={clampRect({
            x: modX - TERM_HALF - 2,
            y: modY - TERM_HALF - 2,
            width: TERM_HALF * 2 + 48,
            height: TERM_HALF * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. expected-value (the EV[Launch] annotation above the chance circle) */}
        <ExplainAnchor
          selector="expected-value"
          index={5}
          pin={{ x: evX, y: evY - 14 }}
          rect={clampRect({
            x: evX - 56,
            y: evY - 12,
            width: 112,
            height: 24,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. shape-legend (convention key at top-left) */}
        <ExplainAnchor
          selector="shape-legend"
          index={6}
          pin={{ x: legendX + legendW + 12, y: legendY + legendH / 2 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
