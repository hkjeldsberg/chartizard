"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Influence Diagram — Howard & Matheson (1984) product-launch canonical example.
// Three node types encode role in the decision:
//   Rectangle  = decision  (variable you control)
//   Ellipse    = chance    (probabilistic uncertainty)
//   Hexagon    = value     (utility / payoff)
// Solid arrows with filled arrowheads indicate relevance (upstream → dependent).
// Information arrows (chance → decision) are the same solid style; the
// direction encodes "known before the decision is made."

interface Props {
  width: number;
  height: number;
}

// Layout space: 0..100 × 0..100
interface Node {
  id: string;
  kind: "decision" | "chance" | "value";
  label: string;
  cx: number; // layout-space centre x
  cy: number; // layout-space centre y
  w: number; // layout-space half-width (bounding box)
  h: number; // layout-space half-height (bounding box)
}

interface Arrow {
  from: string;
  to: string;
  // "relevance" = standard filled solid; "information" = same solid but from
  // chance→decision to indicate the decision-maker knows this before deciding.
  kind: "relevance" | "information";
}

const NODES: ReadonlyArray<Node> = [
  // Decision node (rectangle) — centre-left
  { id: "launch", kind: "decision", label: "Launch product?", cx: 25, cy: 50, w: 14, h: 7 },
  // Chance nodes (ellipses) — top and bottom of left column
  { id: "market-size", kind: "chance", label: "Market size", cx: 25, cy: 18, w: 13, h: 7 },
  { id: "quality", kind: "chance", label: "Product quality", cx: 25, cy: 82, w: 14, h: 7 },
  // Value node (hexagon) — right side
  { id: "profit", kind: "value", label: "Profit", cx: 75, cy: 50, w: 12, h: 7 },
];

const ARROWS: ReadonlyArray<Arrow> = [
  // Relevance: each factor → value node
  { from: "market-size", to: "profit", kind: "relevance" },
  { from: "quality", to: "profit", kind: "relevance" },
  { from: "launch", to: "profit", kind: "relevance" },
  // Information: chance nodes are known before the launch decision
  { from: "market-size", to: "launch", kind: "information" },
  { from: "quality", to: "launch", kind: "information" },
];

const MARKER_ID = "id-filled-arrow";

export function InfluenceDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const nodeById = new Map(NODES.map((n) => [n.id, n]));

  // Hexagon path centred at (cx, cy) with half-width hw and half-height hh.
  // Flat-top hexagon: six vertices.
  function hexPath(cx: number, cy: number, hw: number, hh: number): string {
    const hx = hw * 0.6; // horizontal inset for top/bottom vertices
    const pts = [
      [cx - hw, cy],
      [cx - hx, cy - hh],
      [cx + hx, cy - hh],
      [cx + hw, cy],
      [cx + hx, cy + hh],
      [cx - hx, cy + hh],
    ];
    return pts.map(([x, y], i) => `${i === 0 ? "M" : "L"} ${x} ${y}`).join(" ") + " Z";
  }

  // Compute perimeter anchor point on a node toward a target point.
  function anchorPoint(node: Node, towards: { x: number; y: number }) {
    const cx = px(node.cx);
    const cy = py(node.cy);
    const hw = px(node.w); // half-width in pixels
    const hh = py(node.h); // half-height in pixels
    const dx = towards.x - cx;
    const dy = towards.y - cy;

    if (node.kind === "chance") {
      // Ellipse: parametric intersection
      const len = Math.hypot(dx / hw, dy / hh) || 1;
      return { x: cx + dx / len, y: cy + dy / len };
    }

    if (node.kind === "decision") {
      // Rectangle: clip to box border
      if (Math.abs(dy) * hw >= Math.abs(dx) * hh) {
        const sign = dy >= 0 ? 1 : -1;
        return { x: cx + (dx / Math.abs(dy || 1)) * hh, y: cy + sign * hh };
      } else {
        const sign = dx >= 0 ? 1 : -1;
        return { x: cx + sign * hw, y: cy + (dy / Math.abs(dx || 1)) * hw };
      }
    }

    // Hexagon: approximate as ellipse for simplicity (visually close enough)
    const len = Math.hypot(dx / hw, dy / hh) || 1;
    return { x: cx + dx / len, y: cy + dy / len };
  }

  // Compute a slightly curved Bezier path between two nodes.
  function arrowPath(a: Arrow): {
    d: string;
    headX: number;
    headY: number;
    headAngle: number;
  } {
    const from = nodeById.get(a.from)!;
    const to = nodeById.get(a.to)!;
    const toCentre = { x: px(to.cx), y: py(to.cy) };
    const fromCentre = { x: px(from.cx), y: py(from.cy) };
    const start = anchorPoint(from, toCentre);
    const end = anchorPoint(to, fromCentre);

    // Slight curve via quadratic bezier — control point offset perpendicular to the line.
    const midX = (start.x + end.x) / 2;
    const midY = (start.y + end.y) / 2;
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    // Perpendicular offset (small, for gentle curves)
    const perpLen = Math.hypot(dx, dy) || 1;
    const perpX = (-dy / perpLen) * 10;
    const perpY = (dx / perpLen) * 10;
    const cpX = midX + perpX;
    const cpY = midY + perpY;

    const d = `M ${start.x} ${start.y} Q ${cpX} ${cpY} ${end.x} ${end.y}`;

    // Angle at the head: derivative of the quadratic at t=1.
    const headDx = end.x - cpX;
    const headDy = end.y - cpY;
    const headAngle = (Math.atan2(headDy, headDx) * 180) / Math.PI;

    return { d, headX: end.x, headY: end.y, headAngle };
  }

  function renderNode(n: Node) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    const hw = px(n.w);
    const hh = py(n.h);
    const fontSize = Math.max(8, Math.min(11, iw * 0.022));

    const sharedText = (
      <text
        x={cx}
        y={cy + 3.5}
        textAnchor="middle"
        dominantBaseline="middle"
        fontFamily="var(--font-mono)"
        fontSize={fontSize}
        fill="var(--color-ink)"
      >
        {n.label}
      </text>
    );

    if (n.kind === "decision") {
      return (
        <g key={`node-${n.id}`}>
          <rect
            x={cx - hw}
            y={cy - hh}
            width={hw * 2}
            height={hh * 2}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
          {sharedText}
        </g>
      );
    }

    if (n.kind === "chance") {
      return (
        <g key={`node-${n.id}`}>
          <ellipse
            cx={cx}
            cy={cy}
            rx={hw}
            ry={hh}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          {sharedText}
        </g>
      );
    }

    // value — hexagon
    return (
      <g key={`node-${n.id}`}>
        <path
          d={hexPath(cx, cy, hw, hh)}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.4}
        />
        {sharedText}
      </g>
    );
  }

  // Pre-compute geometry for anchor rects.
  const launchNode = nodeById.get("launch")!;
  const marketNode = nodeById.get("market-size")!;
  const qualityNode = nodeById.get("quality")!;
  const profitNode = nodeById.get("profit")!;

  // Representative relevance arrow: launch → profit
  const relevanceArrow = ARROWS.find((a) => a.from === "launch" && a.to === "profit")!;
  const relevanceGeom = arrowPath(relevanceArrow);

  // Representative information arrow: market-size → launch
  const infoArrow = ARROWS.find((a) => a.from === "market-size" && a.to === "launch")!;
  const infoGeom = arrowPath(infoArrow);

  // Shape-vocabulary legend — small key at bottom-right.
  const legendX = iw - 90;
  const legendY = ih - 58;
  const legendW = 88;
  const legendH = 56;

  return (
    <svg width={width} height={height} role="img" aria-label="Influence Diagram">
      <defs>
        <marker
          id={MARKER_ID}
          markerWidth={8}
          markerHeight={8}
          refX={7}
          refY={4}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 8,4 0,8" fill="var(--color-ink)" />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Arrows (behind nodes) */}
        <g data-data-layer="true">
          {ARROWS.map((a, i) => {
            const geom = arrowPath(a);
            return (
              <path
                key={`arrow-${i}`}
                d={geom.d}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.3}
                opacity={0.85}
                markerEnd={`url(#${MARKER_ID})`}
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* Shape-vocabulary legend */}
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
          {/* Decision rectangle */}
          <rect x={4} y={5} width={16} height={8} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
          <text x={24} y={13} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            DECISION
          </text>
          {/* Chance ellipse */}
          <ellipse cx={12} cy={28} rx={8} ry={5} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
          <text x={24} y={31} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            CHANCE
          </text>
          {/* Value hexagon */}
          <path
            d="M 4,45 L 6.4,41 L 11.6,41 L 14,45 L 11.6,49 L 6.4,49 Z"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text x={24} y={48} fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            VALUE
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. Decision node (Launch product? rectangle) */}
        <ExplainAnchor
          selector="decision-node"
          index={1}
          pin={{ x: px(launchNode.cx) - px(launchNode.w) - 14, y: py(launchNode.cy) }}
          rect={{
            x: Math.max(0, px(launchNode.cx) - px(launchNode.w)),
            y: Math.max(0, py(launchNode.cy) - py(launchNode.h)),
            width: Math.min(iw, px(launchNode.w) * 2),
            height: Math.min(ih, py(launchNode.h) * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Chance node (Market size ellipse) */}
        <ExplainAnchor
          selector="chance-node"
          index={2}
          pin={{ x: px(marketNode.cx) + px(marketNode.w) + 12, y: py(marketNode.cy) }}
          rect={{
            x: Math.max(0, px(marketNode.cx) - px(marketNode.w)),
            y: Math.max(0, py(marketNode.cy) - py(marketNode.h)),
            width: Math.min(iw, px(marketNode.w) * 2),
            height: Math.min(ih, py(marketNode.h) * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Value node (Profit hexagon) */}
        <ExplainAnchor
          selector="value-node"
          index={3}
          pin={{ x: px(profitNode.cx) + px(profitNode.w) + 12, y: py(profitNode.cy) - 12 }}
          rect={{
            x: Math.max(0, px(profitNode.cx) - px(profitNode.w)),
            y: Math.max(0, py(profitNode.cy) - py(profitNode.h)),
            width: Math.min(iw, px(profitNode.w) * 2),
            height: Math.min(ih, py(profitNode.h) * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Relevance arrow (Launch → Profit) */}
        <ExplainAnchor
          selector="relevance-arrow"
          index={4}
          pin={{
            x: (px(launchNode.cx) + px(profitNode.cx)) / 2,
            y: (py(launchNode.cy) + py(profitNode.cy)) / 2 - 14,
          }}
          rect={{
            x: Math.max(0, px(launchNode.cx) + px(launchNode.w)),
            y: Math.max(0, py(launchNode.cy) - 10),
            width: Math.min(
              iw - (px(launchNode.cx) + px(launchNode.w)),
              px(profitNode.cx) - px(profitNode.w) - (px(launchNode.cx) + px(launchNode.w)),
            ),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Information arrow (Market size → Launch) */}
        <ExplainAnchor
          selector="information-arrow"
          index={5}
          pin={{ x: px(marketNode.cx) - 16, y: (py(marketNode.cy) + py(launchNode.cy)) / 2 }}
          rect={{
            x: Math.max(0, px(marketNode.cx) - px(marketNode.w) - 4),
            y: Math.max(0, py(marketNode.cy) + py(marketNode.h)),
            width: Math.min(iw, px(marketNode.w) * 2 + 8),
            height: Math.min(
              ih - (py(marketNode.cy) + py(marketNode.h)),
              py(launchNode.cy) - py(launchNode.h) - (py(marketNode.cy) + py(marketNode.h)),
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Node-shape vocabulary (legend) */}
        <ExplainAnchor
          selector="node-shape-vocabulary"
          index={6}
          pin={{ x: Math.min(iw - 6, legendX + legendW + 10), y: legendY + legendH / 2 }}
          rect={{
            x: Math.max(0, legendX),
            y: Math.max(0, legendY),
            width: Math.min(iw - Math.max(0, legendX), legendW),
            height: Math.min(ih - Math.max(0, legendY), legendH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Upstream-to-downstream flow (Product quality → Profit) */}
        <ExplainAnchor
          selector="upstream-downstream-flow"
          index={7}
          pin={{
            x: (px(qualityNode.cx) + px(profitNode.cx)) / 2,
            y: (py(qualityNode.cy) + py(profitNode.cy)) / 2 + 14,
          }}
          rect={{
            x: Math.max(0, px(qualityNode.cx) + px(qualityNode.w)),
            y: Math.max(0, py(launchNode.cy) - 8),
            width: Math.min(
              iw - (px(qualityNode.cx) + px(qualityNode.w)),
              px(profitNode.cx) - px(profitNode.w) - (px(qualityNode.cx) + px(qualityNode.w)),
            ),
            height: Math.min(ih - (py(launchNode.cy) - 8), py(qualityNode.cy) - (py(launchNode.cy) - 8)),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
