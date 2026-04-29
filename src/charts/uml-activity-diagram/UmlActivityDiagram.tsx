"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Node kinds for a UML 2.0 activity diagram.
//  - initial      : filled circle (start)
//  - action       : rounded-rectangle activity node
//  - decision     : diamond (conditional branching, [guard] labels on outgoing edges)
//  - merge        : diamond (merges concurrent/alternate flows back into one)
//  - fork / join  : thick black horizontal bar (synchronisation)
//  - final        : bullseye (ringed filled circle)
type NodeKind =
  | "initial"
  | "action"
  | "decision"
  | "merge"
  | "fork"
  | "join"
  | "final";

interface ActNode {
  id: string;
  kind: NodeKind;
  // Layout-space centre (0..100 × 0..100). Pixels are computed at render.
  cx: number;
  cy: number;
  label?: string;
}

interface ActEdge {
  from: string;
  to: string;
  // Guard label in UML square-bracket form, e.g. "[credit_ok]".
  guard?: string;
  // Routing: "straight" = single segment; "elbow-v" = vertical-then-horizontal;
  // "elbow-h" = horizontal-then-vertical. Keeps fork/join branches tidy without
  // a layout algorithm.
  route?: "straight" | "elbow-v" | "elbow-h";
}

// Unique marker id so multiple UmlActivityDiagram instances on the same page
// don't collide.
const MARKER_NS = "uml-activity";

// Order-processing activity with a parallel region (Reserve Inventory || Charge
// Card) between a fork and a join, then a decision on payment success, then a
// merge back to the final node.
const NODES: ReadonlyArray<ActNode> = [
  { id: "initial", kind: "initial", cx: 50, cy: 5 },
  { id: "place", kind: "action", cx: 50, cy: 14, label: "Place Order" },
  { id: "fork", kind: "fork", cx: 50, cy: 24 },
  { id: "reserve", kind: "action", cx: 25, cy: 36, label: "Reserve Inventory" },
  { id: "charge", kind: "action", cx: 75, cy: 36, label: "Charge Card" },
  { id: "join", kind: "join", cx: 50, cy: 48 },
  { id: "decide", kind: "decision", cx: 50, cy: 61, label: "payment ok?" },
  { id: "ship", kind: "action", cx: 22, cy: 75, label: "Ship Order" },
  { id: "cancel", kind: "action", cx: 78, cy: 75, label: "Cancel Order" },
  { id: "merge", kind: "merge", cx: 50, cy: 88 },
  { id: "final", kind: "final", cx: 50, cy: 96 },
];

const EDGES: ReadonlyArray<ActEdge> = [
  { from: "initial", to: "place", route: "straight" },
  { from: "place", to: "fork", route: "straight" },
  // Fork → parallel actions (elbow branches from the bar's ends)
  { from: "fork", to: "reserve", route: "elbow-v" },
  { from: "fork", to: "charge", route: "elbow-v" },
  // Parallel actions → join
  { from: "reserve", to: "join", route: "elbow-v" },
  { from: "charge", to: "join", route: "elbow-v" },
  { from: "join", to: "decide", route: "straight" },
  { from: "decide", to: "ship", guard: "[credit_ok]", route: "elbow-v" },
  { from: "decide", to: "cancel", guard: "[declined]", route: "elbow-v" },
  { from: "ship", to: "merge", route: "elbow-v" },
  { from: "cancel", to: "merge", route: "elbow-v" },
  { from: "merge", to: "final", route: "straight" },
];

// Action-node size in layout-space. Wider than tall so the label fits.
const ACTION_W = 28;
const ACTION_H = 8;
// Decision / merge diamond size in layout-space.
const DIAMOND_W = 16;
const DIAMOND_H = 10;
// Fork / join bar in layout-space (thick and wide).
const BAR_W = 48;
const BAR_H = 1.6;

export function UmlActivityDiagram({ width, height }: Props) {
  // Tight margins — this is a pure diagram, no axes.
  const margin = { top: 16, right: 20, bottom: 16, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout-space → pixels.
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const byId = new Map(NODES.map((n) => [n.id, n]));

  // Swimlane partition: a single pale background rect hinting at Warehouse /
  // Billing across the fork's parallel branches. Spans from just below the
  // fork to just above the join.
  const swimlaneX = px(6);
  const swimlaneY = py(28);
  const swimlaneW = px(88);
  const swimlaneH = py(16);
  const swimlaneDivideX = px(50);

  // Return the perimeter anchor point for a node closest to a target point.
  // Different shapes have different perimeter geometry — we approximate each
  // with the bounding rectangle for routing purposes.
  function anchorOf(n: ActNode, towards: { x: number; y: number }) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    let w = 0;
    let h = 0;
    if (n.kind === "action") {
      w = px(ACTION_W);
      h = py(ACTION_H);
    } else if (n.kind === "decision" || n.kind === "merge") {
      w = px(DIAMOND_W);
      h = py(DIAMOND_H);
    } else if (n.kind === "fork" || n.kind === "join") {
      w = px(BAR_W);
      h = py(BAR_H) + 2;
    } else if (n.kind === "initial") {
      w = 10;
      h = 10;
    } else {
      // final bullseye
      w = 14;
      h = 14;
    }
    const dx = towards.x - cx;
    const dy = towards.y - cy;
    if (Math.abs(dy) * w >= Math.abs(dx) * h) {
      const sign = dy >= 0 ? 1 : -1;
      return { x: cx, y: cy + (sign * h) / 2 };
    }
    const sign = dx >= 0 ? 1 : -1;
    return { x: cx + (sign * w) / 2, y: cy };
  }

  interface EdgeGeom {
    d: string;
    tipX: number;
    tipY: number;
    tipAngle: number;
    labelX: number;
    labelY: number;
  }

  function edgeGeom(e: ActEdge): EdgeGeom {
    const from = byId.get(e.from)!;
    const to = byId.get(e.to)!;
    const fromC = { x: px(from.cx), y: py(from.cy) };
    const toC = { x: px(to.cx), y: py(to.cy) };
    const a = anchorOf(from, toC);
    const b = anchorOf(to, fromC);
    if (e.route === "elbow-v") {
      // Vertical then horizontal.
      const d = `M ${a.x} ${a.y} L ${a.x} ${b.y} L ${b.x} ${b.y}`;
      const tipAngle = b.x >= a.x ? 0 : 180;
      return {
        d,
        tipX: b.x,
        tipY: b.y,
        tipAngle,
        labelX: (a.x + b.x) / 2,
        labelY: b.y - 4,
      };
    }
    if (e.route === "elbow-h") {
      const d = `M ${a.x} ${a.y} L ${b.x} ${a.y} L ${b.x} ${b.y}`;
      const tipAngle = b.y >= a.y ? 90 : -90;
      return {
        d,
        tipX: b.x,
        tipY: b.y,
        tipAngle,
        labelX: b.x + 4,
        labelY: (a.y + b.y) / 2,
      };
    }
    const dx = b.x - a.x;
    const dy = b.y - a.y;
    const tipAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
    return {
      d: `M ${a.x} ${a.y} L ${b.x} ${b.y}`,
      tipX: b.x,
      tipY: b.y,
      tipAngle,
      labelX: (a.x + b.x) / 2 + 4,
      labelY: (a.y + b.y) / 2 - 4,
    };
  }

  // Render helpers per node kind.
  function renderNode(n: ActNode) {
    const cx = px(n.cx);
    const cy = py(n.cy);
    if (n.kind === "initial") {
      return (
        <circle
          key={n.id}
          cx={cx}
          cy={cy}
          r={5}
          fill="var(--color-ink)"
        />
      );
    }
    if (n.kind === "final") {
      return (
        <g key={n.id}>
          <circle
            cx={cx}
            cy={cy}
            r={7}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          <circle cx={cx} cy={cy} r={4} fill="var(--color-ink)" />
        </g>
      );
    }
    if (n.kind === "action") {
      const w = px(ACTION_W);
      const h = py(ACTION_H);
      return (
        <g key={n.id}>
          <rect
            x={cx - w / 2}
            y={cy - h / 2}
            width={w}
            height={h}
            rx={Math.min(h, w) / 2.5}
            ry={Math.min(h, w) / 2.5}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            {n.label}
          </text>
        </g>
      );
    }
    if (n.kind === "decision" || n.kind === "merge") {
      const w = px(DIAMOND_W);
      const h = py(DIAMOND_H);
      const points = `${cx},${cy - h / 2} ${cx + w / 2},${cy} ${cx},${cy + h / 2} ${cx - w / 2},${cy}`;
      return (
        <g key={n.id}>
          <polygon
            points={points}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          {n.label && (
            <text
              x={cx}
              y={cy + 3}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-soft)"
            >
              {n.label}
            </text>
          )}
        </g>
      );
    }
    // fork / join — thick black horizontal bar. Pixel-fixed 5px height so
    // it reads as solid ink regardless of chart scale.
    const w = px(BAR_W);
    const h = 5;
    return (
      <rect
        key={n.id}
        x={cx - w / 2}
        y={cy - h / 2}
        width={w}
        height={h}
        fill="var(--color-ink)"
      />
    );
  }

  // Arrow-tip triangle from (tipX, tipY) back along tipAngle.
  function arrowHead(tipX: number, tipY: number, angleDeg: number, size = 5): string {
    const rad = (angleDeg * Math.PI) / 180;
    const baseX = tipX - Math.cos(rad) * size;
    const baseY = tipY - Math.sin(rad) * size;
    const sx = Math.cos(rad - Math.PI / 2) * size * 0.5;
    const sy = Math.sin(rad - Math.PI / 2) * size * 0.5;
    return `${tipX},${tipY} ${baseX + sx},${baseY + sy} ${baseX - sx},${baseY - sy}`;
  }

  // Representative nodes for anchors.
  const initialNode = byId.get("initial")!;
  const actionNode = byId.get("place")!;
  const forkNode = byId.get("fork")!;
  const joinNode = byId.get("join")!;
  const decideNode = byId.get("decide")!;
  const finalNode = byId.get("final")!;

  // Pre-compute edge geometries used for anchor positioning.
  const guardEdge = EDGES.find((e) => e.from === "decide" && e.to === "ship")!;
  const guardGeom = edgeGeom(guardEdge);

  return (
    <svg width={width} height={height} role="img" aria-label="UML Activity Diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Swimlane partition: two pale columns separated by a hairline.
            Reads as "Warehouse | Billing" across the fork's parallel region. */}
        <g data-data-layer="true">
          <rect
            x={swimlaneX}
            y={swimlaneY}
            width={swimlaneW}
            height={swimlaneH}
            fill="var(--color-ink)"
            opacity={0.04}
          />
          <line
            x1={swimlaneDivideX}
            x2={swimlaneDivideX}
            y1={swimlaneY}
            y2={swimlaneY + swimlaneH}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          <text
            x={swimlaneX + swimlaneW / 4}
            y={swimlaneY - 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            WAREHOUSE
          </text>
          <text
            x={swimlaneX + (3 * swimlaneW) / 4}
            y={swimlaneY - 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            BILLING
          </text>
        </g>

        {/* Edges — drawn before nodes so nodes paint on top. */}
        <g data-data-layer="true">
          {EDGES.map((e, i) => {
            const g = edgeGeom(e);
            // Pull arrowhead tip back slightly so it sits flush against node.
            const rad = (g.tipAngle * Math.PI) / 180;
            const tipX = g.tipX - Math.cos(rad) * 1.2;
            const tipY = g.tipY - Math.sin(rad) * 1.2;
            return (
              <g key={`edge-${i}`}>
                <path
                  d={g.d}
                  fill="none"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                  opacity={0.92}
                />
                <polygon
                  points={arrowHead(tipX, tipY, g.tipAngle)}
                  fill="var(--color-ink)"
                  opacity={0.92}
                />
                {e.guard && (
                  <text
                    x={g.labelX + 4}
                    y={g.labelY}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {e.guard}
                  </text>
                )}
              </g>
            );
          })}
        </g>

        {/* Nodes */}
        <g data-data-layer="true">
          {NODES.map((n) => renderNode(n))}
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. initial-node (filled dot at the top) */}
        <ExplainAnchor
          selector="initial-node"
          index={1}
          pin={{ x: px(initialNode.cx) + 18, y: py(initialNode.cy) }}
          rect={{
            x: Math.max(0, px(initialNode.cx) - 10),
            y: Math.max(0, py(initialNode.cy) - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. action-node (Place Order rounded rectangle) */}
        <ExplainAnchor
          selector="action-node"
          index={2}
          pin={{ x: px(actionNode.cx) - px(ACTION_W) / 2 - 14, y: py(actionNode.cy) }}
          rect={{
            x: Math.max(0, px(actionNode.cx) - px(ACTION_W) / 2),
            y: Math.max(0, py(actionNode.cy) - py(ACTION_H) / 2),
            width: Math.min(iw, px(ACTION_W)),
            height: Math.min(ih, py(ACTION_H)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. fork-bar (thick black bar after Place Order) */}
        <ExplainAnchor
          selector="fork-bar"
          index={3}
          pin={{ x: px(forkNode.cx) + px(BAR_W) / 2 + 14, y: py(forkNode.cy) }}
          rect={{
            x: Math.max(0, px(forkNode.cx) - px(BAR_W) / 2),
            y: Math.max(0, py(forkNode.cy) - 4),
            width: Math.min(iw, px(BAR_W)),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. join-bar (second thick bar that synchronises the branches) */}
        <ExplainAnchor
          selector="join-bar"
          index={4}
          pin={{ x: px(joinNode.cx) + px(BAR_W) / 2 + 14, y: py(joinNode.cy) }}
          rect={{
            x: Math.max(0, px(joinNode.cx) - px(BAR_W) / 2),
            y: Math.max(0, py(joinNode.cy) - 4),
            width: Math.min(iw, px(BAR_W)),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. decision-guard (diamond + [credit_ok] guard label on outgoing edge) */}
        <ExplainAnchor
          selector="decision-guard"
          index={5}
          pin={{ x: px(decideNode.cx) + px(DIAMOND_W) / 2 + 14, y: py(decideNode.cy) - 6 }}
          rect={{
            x: Math.max(0, px(decideNode.cx) - px(DIAMOND_W) / 2 - 4),
            y: Math.max(0, py(decideNode.cy) - py(DIAMOND_H) / 2 - 4),
            width: Math.min(iw, px(DIAMOND_W) + 8),
            height: Math.min(ih, py(DIAMOND_H) + 8 + Math.max(0, guardGeom.tipY - py(decideNode.cy))),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. swimlane-partition (the pale two-column rect above the fork region) */}
        <ExplainAnchor
          selector="swimlane-partition"
          index={6}
          pin={{ x: swimlaneX - 4, y: swimlaneY + swimlaneH / 2 }}
          rect={{
            x: Math.max(0, swimlaneX),
            y: Math.max(0, swimlaneY),
            width: Math.min(iw, swimlaneW),
            height: Math.min(ih, swimlaneH),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. final-node (bullseye at the bottom) */}
        <ExplainAnchor
          selector="final-node"
          index={7}
          pin={{ x: px(finalNode.cx) + 20, y: py(finalNode.cy) }}
          rect={{
            x: Math.max(0, px(finalNode.cx) - 10),
            y: Math.max(0, py(finalNode.cy) - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
