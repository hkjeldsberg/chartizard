"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A 20-person social network with three underlying communities. Alphabetical
// node ordering produces a scattered left matrix; the "Louvain-reordered"
// right matrix groups community members so three diagonal blocks appear plus
// a handful of off-diagonal bridge edges. The reordering IS the insight.

// Alphabetical roster (the raw data order).
const ALPHA: ReadonlyArray<string> = [
  "Ada", "Ben", "Cal", "Dan", "Eva",
  "Finn", "Gil", "Hal", "Iris", "Jade",
  "Kai", "Lia", "Max", "Noe", "Ollie",
  "Pru", "Quinn", "Rae", "Sam", "Tom",
];

// Hand-designed three-community structure (Louvain would converge here).
// Community A (science lab):  Ada, Cal, Iris, Max, Rae, Sam, Eva
// Community B (book club):    Ben, Finn, Jade, Noe, Pru, Quinn
// Community C (climbing gym): Dan, Gil, Hal, Kai, Lia, Ollie, Tom
//
// The Louvain-reordered sequence below groups community A first, then B,
// then C — each in an intra-community order that tightens the diagonal.
const LOUVAIN_ORDER: ReadonlyArray<string> = [
  // Community A — science lab
  "Ada", "Cal", "Iris", "Max", "Rae", "Sam", "Eva",
  // Community B — book club
  "Ben", "Finn", "Jade", "Noe", "Pru", "Quinn",
  // Community C — climbing gym
  "Dan", "Gil", "Hal", "Kai", "Lia", "Ollie", "Tom",
];

// Undirected edge list. Within-community edges are dense (every pair in
// a community is connected or nearly so); three bridges cross communities.
const EDGES: ReadonlyArray<[string, string]> = [
  // Community A (science lab) — near-clique of 7
  ["Ada", "Cal"], ["Ada", "Iris"], ["Ada", "Max"], ["Ada", "Rae"], ["Ada", "Sam"],
  ["Cal", "Iris"], ["Cal", "Max"], ["Cal", "Rae"], ["Cal", "Sam"],
  ["Iris", "Max"], ["Iris", "Rae"], ["Iris", "Sam"], ["Iris", "Eva"],
  ["Max", "Rae"], ["Max", "Sam"], ["Max", "Eva"],
  ["Rae", "Sam"], ["Rae", "Eva"],
  ["Sam", "Eva"],
  // Community B (book club) — near-clique of 6
  ["Ben", "Finn"], ["Ben", "Jade"], ["Ben", "Noe"], ["Ben", "Pru"], ["Ben", "Quinn"],
  ["Finn", "Jade"], ["Finn", "Noe"], ["Finn", "Pru"],
  ["Jade", "Noe"], ["Jade", "Pru"], ["Jade", "Quinn"],
  ["Noe", "Pru"], ["Noe", "Quinn"],
  ["Pru", "Quinn"],
  // Community C (climbing gym) — near-clique of 7
  ["Dan", "Gil"], ["Dan", "Hal"], ["Dan", "Kai"], ["Dan", "Lia"], ["Dan", "Ollie"],
  ["Gil", "Hal"], ["Gil", "Kai"], ["Gil", "Lia"], ["Gil", "Tom"],
  ["Hal", "Kai"], ["Hal", "Ollie"], ["Hal", "Tom"],
  ["Kai", "Lia"], ["Kai", "Ollie"], ["Kai", "Tom"],
  ["Lia", "Ollie"], ["Lia", "Tom"],
  ["Ollie", "Tom"],
  // Bridges — three cross-community edges.
  ["Eva", "Ben"],     // A ↔ B
  ["Quinn", "Dan"],   // B ↔ C
  ["Sam", "Ollie"],   // A ↔ C
];

const edgeSet = new Set<string>();
for (const [a, b] of EDGES) {
  edgeSet.add(`${a}|${b}`);
  edgeSet.add(`${b}|${a}`);
}
function hasEdge(a: string, b: string): boolean {
  return edgeSet.has(`${a}|${b}`);
}

interface Props {
  width: number;
  height: number;
}

export function ArcMatrix({ width, height }: Props) {
  const margin = { top: 26, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Two square matrices side-by-side, separated by a gap.
  const GAP = 28;
  const availW = Math.max(0, iw - GAP);
  // Each matrix is a square — side = min(availW / 2, ih).
  const side = Math.max(0, Math.min(availW / 2, ih));
  const leftOx = 0;
  const rightOx = side + GAP;
  const matrixTop = 0;

  // Band scales — same band size across both matrices.
  const leftX = scaleBand<string>({
    domain: [...ALPHA],
    range: [0, side],
    padding: 0.05,
  });
  const leftY = scaleBand<string>({
    domain: [...ALPHA],
    range: [0, side],
    padding: 0.05,
  });
  const rightX = scaleBand<string>({
    domain: [...LOUVAIN_ORDER],
    range: [0, side],
    padding: 0.05,
  });
  const rightY = scaleBand<string>({
    domain: [...LOUVAIN_ORDER],
    range: [0, side],
    padding: 0.05,
  });
  const cellW = leftX.bandwidth();
  const cellH = leftY.bandwidth();

  // --- Anchor targets -----------------------------------------------------
  // 1. Scattered cells — left matrix (representative cell, not special).
  const scatterRow = "Ada";
  const scatterCol = "Cal";
  const scatterX = leftOx + (leftX(scatterCol) ?? 0);
  const scatterY = matrixTop + (leftY(scatterRow) ?? 0);

  // 2. Community block — right matrix, community B (book club): Ben..Quinn.
  const blockStart = "Ben";
  const blockEnd = "Quinn";
  const blockX = rightOx + (rightX(blockStart) ?? 0);
  const blockY = matrixTop + (rightY(blockStart) ?? 0);
  const blockEndX = rightOx + (rightX(blockEnd) ?? 0) + cellW;
  const blockEndY = matrixTop + (rightY(blockEnd) ?? 0) + cellH;

  // 3. Bridge cell on the right matrix — Sam ↔ Ollie (community A ↔ C).
  // After reordering these end up in opposite blocks; the cell is far off
  // the diagonal.
  const bridgeRow = "Sam";
  const bridgeCol = "Ollie";
  const bridgeX = rightOx + (rightX(bridgeCol) ?? 0);
  const bridgeY = matrixTop + (rightY(bridgeRow) ?? 0);

  // 4. Diagonal — right matrix diagonal.
  // 5. Permutation — the rectangular label strip above the right matrix.
  // 6. Matrix pair comparison — cover both matrices.

  const clampRect = (r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const x = Math.max(0, r.x);
    const y = Math.max(0, r.y);
    const width = Math.max(0, Math.min(iw - x, r.x + r.width - x));
    const height = Math.max(0, Math.min(ih - y, r.y + r.height - y));
    return { x, y, width, height };
  };

  // Render a matrix at a given origin with a given ordering.
  const renderMatrix = (
    ox: number,
    oy: number,
    xScale: typeof leftX,
    yScale: typeof leftY,
    order: ReadonlyArray<string>,
  ) => {
    return (
      <g>
        {/* Frame */}
        <rect
          x={ox}
          y={oy}
          width={side}
          height={side}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={0.75}
        />
        {/* Cells */}
        {order.map((rowNode) => {
          const y = oy + (yScale(rowNode) ?? 0);
          return order.map((colNode) => {
            const x = ox + (xScale(colNode) ?? 0);
            if (rowNode === colNode) {
              return (
                <line
                  key={`diag-${rowNode}-${colNode}`}
                  x1={x + cellW * 0.25}
                  y1={y + cellH * 0.25}
                  x2={x + cellW * 0.75}
                  y2={y + cellH * 0.75}
                  stroke="var(--color-hairline)"
                  strokeWidth={0.5}
                />
              );
            }
            if (hasEdge(rowNode, colNode)) {
              return (
                <rect
                  key={`c-${rowNode}-${colNode}`}
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
    );
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Arc / reorderable matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Captions above each matrix */}
        <g>
          <text
            x={leftOx + side / 2}
            y={-10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            ALPHABETICAL
          </text>
          <text
            x={rightOx + side / 2}
            y={-10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            LOUVAIN REORDERED
          </text>
        </g>

        {/* Arrow hint between the two matrices */}
        <g>
          <line
            x1={leftOx + side + 4}
            y1={side / 2}
            x2={rightOx - 4}
            y2={side / 2}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <polyline
            points={`${rightOx - 8},${side / 2 - 4} ${rightOx - 4},${side / 2} ${rightOx - 8},${side / 2 + 4}`}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </g>

        {/* Both matrices */}
        <g data-data-layer="true">
          {renderMatrix(leftOx, matrixTop, leftX, leftY, ALPHA)}
          {renderMatrix(rightOx, matrixTop, rightX, rightY, LOUVAIN_ORDER)}
        </g>

        {/* Community-block outline overlays on the right matrix, so the three
            diagonal blocks are visually obvious. */}
        <g>
          {/* Block A: Ada..Eva (7 nodes) */}
          {(() => {
            const a = "Ada";
            const e = "Eva";
            const x = rightOx + (rightX(a) ?? 0);
            const y = matrixTop + (rightY(a) ?? 0);
            const x2 = rightOx + (rightX(e) ?? 0) + cellW;
            const y2 = matrixTop + (rightY(e) ?? 0) + cellH;
            return (
              <rect
                x={x}
                y={y}
                width={x2 - x}
                height={y2 - y}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            );
          })()}
          {/* Block B: Ben..Quinn (6 nodes) */}
          {(() => {
            const a = "Ben";
            const e = "Quinn";
            const x = rightOx + (rightX(a) ?? 0);
            const y = matrixTop + (rightY(a) ?? 0);
            const x2 = rightOx + (rightX(e) ?? 0) + cellW;
            const y2 = matrixTop + (rightY(e) ?? 0) + cellH;
            return (
              <rect
                x={x}
                y={y}
                width={x2 - x}
                height={y2 - y}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            );
          })()}
          {/* Block C: Dan..Tom (7 nodes) */}
          {(() => {
            const a = "Dan";
            const e = "Tom";
            const x = rightOx + (rightX(a) ?? 0);
            const y = matrixTop + (rightY(a) ?? 0);
            const x2 = rightOx + (rightX(e) ?? 0) + cellW;
            const y2 = matrixTop + (rightY(e) ?? 0) + cellH;
            return (
              <rect
                x={x}
                y={y}
                width={x2 - x}
                height={y2 - y}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={0.35}
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            );
          })()}
        </g>

        {/* --- Anchors ---------------------------------------------------- */}

        {/* 1. Scattered cells — left matrix, the "no visible structure" state */}
        <ExplainAnchor
          selector="scattered-cells"
          index={1}
          pin={{
            x: Math.max(16, Math.min(iw - 16, leftOx + side / 2)),
            y: Math.max(16, side + 8),
          }}
          rect={clampRect({
            x: leftOx,
            y: matrixTop,
            width: side,
            height: side,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Permutation — the reordering step itself, anchored on the arrow */}
        <ExplainAnchor
          selector="permutation"
          index={2}
          pin={{
            x: (leftOx + side + rightOx) / 2,
            y: Math.max(10, side / 2 - 18),
          }}
          rect={clampRect({
            x: leftOx + side,
            y: matrixTop,
            width: rightOx - (leftOx + side),
            height: side,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Community block — block B on the right matrix */}
        <ExplainAnchor
          selector="community-block"
          index={3}
          pin={{
            x: Math.max(16, Math.min(iw - 16, blockX + (blockEndX - blockX) / 2)),
            y: Math.max(16, Math.min(ih - 16, blockEndY + 10)),
          }}
          rect={clampRect({
            x: blockX,
            y: blockY,
            width: blockEndX - blockX,
            height: blockEndY - blockY,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Diagonal — right matrix, the no-self-loops convention */}
        <ExplainAnchor
          selector="diagonal"
          index={4}
          pin={{
            x: Math.max(16, Math.min(iw - 16, rightOx + side + 8)),
            y: Math.max(16, Math.min(ih - 16, matrixTop + 10)),
          }}
          rect={clampRect({
            x: rightOx,
            y: matrixTop,
            width: side,
            height: side,
          })}
        >
          <line
            x1={rightOx}
            y1={matrixTop}
            x2={rightOx + side}
            y2={matrixTop + side}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.5}
            strokeDasharray="2 3"
          />
        </ExplainAnchor>

        {/* 5. Bridge cell — a cross-community edge after reordering */}
        <ExplainAnchor
          selector="bridge-cell"
          index={5}
          pin={{
            x: Math.max(16, Math.min(iw - 16, bridgeX - 14)),
            y: Math.max(16, Math.min(ih - 16, bridgeY + cellH / 2)),
          }}
          rect={clampRect({
            x: bridgeX - 1,
            y: bridgeY - 1,
            width: cellW + 2,
            height: cellH + 2,
          })}
        >
          <rect
            x={bridgeX - 1.5}
            y={bridgeY - 1.5}
            width={cellW + 3}
            height={cellH + 3}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 6. Matrix-pair comparison — the before/after that IS the chart */}
        <ExplainAnchor
          selector="matrix-pair"
          index={6}
          pin={{
            x: Math.max(16, Math.min(iw - 16, iw / 2)),
            y: Math.max(10, -18),
          }}
          rect={clampRect({
            x: 0,
            y: matrixTop,
            width: iw,
            height: side,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
