"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A 12-node small-group social network, re-ordered by cluster so the block
// structure is visible. Nodes 1-4 are one cluster, 5-8 another, 9-12 a third.
// A handful of bridge edges connect the clusters.
// Symmetric (undirected) — each unordered pair appears twice in the matrix.
const NODES: ReadonlyArray<string> = [
  "1", "2", "3", "4",
  "5", "6", "7", "8",
  "9", "10", "11", "12",
];

// Lower-triangle edge list (i > j). Within-cluster edges fill each block
// densely; three bridge edges cross clusters: 4-5, 8-9, 3-11.
const EDGES: ReadonlyArray<[string, string]> = [
  // Cluster A: 1,2,3,4 (friend group — dense, near-clique)
  ["2", "1"], ["3", "1"], ["3", "2"], ["4", "1"], ["4", "2"], ["4", "3"],
  // Cluster B: 5,6,7,8
  ["6", "5"], ["7", "5"], ["7", "6"], ["8", "5"], ["8", "6"], ["8", "7"],
  // Cluster C: 9,10,11,12
  ["10", "9"], ["11", "9"], ["11", "10"], ["12", "9"], ["12", "10"], ["12", "11"],
  // Bridge edges between clusters
  ["5", "4"],   // bridges A ↔ B
  ["9", "8"],   // bridges B ↔ C
  ["11", "3"],  // bridges A ↔ C
];

// Build a symmetric edge set for quick lookup.
const edgeSet = new Set<string>();
for (const [a, b] of EDGES) {
  edgeSet.add(`${a}|${b}`);
  edgeSet.add(`${b}|${a}`);
}

function hasEdge(row: string, col: string): boolean {
  return edgeSet.has(`${row}|${col}`);
}

interface Props {
  width: number;
  height: number;
}

export function AdjacencyMatrixChart({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 28, left: 36 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Square the plot region so cells render as squares. Use the smaller side.
  const side = Math.max(0, Math.min(iw, ih));

  const xScale = scaleBand<string>({
    domain: [...NODES],
    range: [0, side],
    padding: 0.06,
  });

  const yScale = scaleBand<string>({
    domain: [...NODES],
    range: [0, side],
    padding: 0.06,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();

  // Anchor targets --------------------------------------------------------
  // A single filled cell — pick edge 2-1 (low-index, readable corner).
  const singleRow = "2";
  const singleCol = "1";
  const singleX = xScale(singleCol) ?? 0;
  const singleY = yScale(singleRow) ?? 0;

  // The diagonal — pick a middle cell (node 6) to anchor the no-self-loop rule.
  const diagNode = "6";
  const diagX = xScale(diagNode) ?? 0;
  const diagY = yScale(diagNode) ?? 0;

  // A cluster block — cluster B (nodes 5-8), top-left corner at row 5, col 5.
  const blockStartNode = "5";
  const blockEndNode = "8";
  const blockX = xScale(blockStartNode) ?? 0;
  const blockY = yScale(blockStartNode) ?? 0;
  const blockEndX = (xScale(blockEndNode) ?? 0) + cellW;
  const blockEndY = (yScale(blockEndNode) ?? 0) + cellH;
  const blockW = blockEndX - blockX;
  const blockH = blockEndY - blockY;

  // A bridge edge — 11 ↔ 3. Use the (row=11, col=3) lower-triangle cell.
  const bridgeRow = "11";
  const bridgeCol = "3";
  const bridgeX = xScale(bridgeCol) ?? 0;
  const bridgeY = yScale(bridgeRow) ?? 0;

  return (
    <svg width={width} height={height} role="img" aria-label="Adjacency matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Grid backdrop — subtle hairlines between cells */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={side}
            height={side}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
        </g>

        {/* Filled cells — one per edge, plus faint diagonal */}
        <g data-data-layer="true">
          {NODES.map((rowNode) => {
            const y = yScale(rowNode) ?? 0;
            return NODES.map((colNode) => {
              const x = xScale(colNode) ?? 0;
              if (rowNode === colNode) {
                // Diagonal — render a subtle tick, no fill (no self-loops).
                return (
                  <line
                    key={`diag-${rowNode}`}
                    x1={x + cellW * 0.25}
                    y1={y + cellH * 0.25}
                    x2={x + cellW * 0.75}
                    y2={y + cellH * 0.75}
                    stroke="var(--color-hairline)"
                    strokeWidth={0.75}
                  />
                );
              }
              if (hasEdge(rowNode, colNode)) {
                return (
                  <rect
                    key={`${rowNode}-${colNode}`}
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    fill="var(--color-ink)"
                  />
                );
              }
              return null;
            });
          })}
        </g>

        {/* Row labels (along the left edge) */}
        <g data-data-layer="true">
          {NODES.map((node) => {
            const y = (yScale(node) ?? 0) + cellH / 2;
            return (
              <text
                key={`rlbl-${node}`}
                x={-8}
                y={y}
                textAnchor="end"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {node}
              </text>
            );
          })}
        </g>

        {/* Column labels (along the top edge) */}
        <g data-data-layer="true">
          {NODES.map((node) => {
            const x = (xScale(node) ?? 0) + cellW / 2;
            return (
              <text
                key={`clbl-${node}`}
                x={x}
                y={-10}
                textAnchor="middle"
                dominantBaseline="alphabetic"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {node}
              </text>
            );
          })}
        </g>

        {/* 1. A single filled cell — one edge */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{ x: singleX + cellW + 14, y: singleY + cellH / 2 }}
          rect={{ x: singleX, y: singleY, width: cellW, height: cellH }}
        >
          <rect
            x={singleX}
            y={singleY}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 2. The diagonal — no self-loops */}
        <ExplainAnchor
          selector="diagonal"
          index={2}
          pin={{ x: diagX + cellW + 14, y: diagY - 10 }}
          rect={{ x: 0, y: 0, width: side, height: side }}
        >
          <line
            x1={0}
            y1={0}
            x2={side}
            y2={side}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.75}
            strokeDasharray="2 3"
          />
        </ExplainAnchor>

        {/* 3. A cluster block — dense sub-matrix, cluster B */}
        <ExplainAnchor
          selector="cluster-block"
          index={3}
          pin={{ x: blockX + blockW + 14, y: blockY + blockH / 2 }}
          rect={{ x: blockX, y: blockY, width: blockW, height: blockH }}
        >
          <rect
            x={blockX}
            y={blockY}
            width={blockW}
            height={blockH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        </ExplainAnchor>

        {/* 4. A bridge edge — rare cross-cluster cell */}
        <ExplainAnchor
          selector="bridge-edge"
          index={4}
          pin={{ x: bridgeX - 14, y: bridgeY + cellH / 2 }}
          rect={{ x: bridgeX, y: bridgeY, width: cellW, height: cellH }}
        >
          <rect
            x={bridgeX - 1}
            y={bridgeY - 1}
            width={cellW + 2}
            height={cellH + 2}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 5. Row labels */}
        <ExplainAnchor
          selector="row-labels"
          index={5}
          pin={{ x: -22, y: -14 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: side }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Column labels */}
        <ExplainAnchor
          selector="column-labels"
          index={6}
          pin={{ x: side + 10, y: -14 }}
          rect={{ x: 0, y: -margin.top, width: side, height: margin.top }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
