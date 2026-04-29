"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

type LaneKey = "Customer" | "Sales" | "Engineering" | "Finance";

interface Lane {
  key: LaneKey;
  label: string;
}

// Lanes ordered top-to-bottom. Order is editorial — conventionally the
// external actor goes on top and finance on the bottom.
const LANES: ReadonlyArray<Lane> = [
  { key: "Customer", label: "Customer" },
  { key: "Sales", label: "Sales" },
  { key: "Engineering", label: "Engineering" },
  { key: "Finance", label: "Finance" },
];

interface Step {
  id: string;
  lane: LaneKey;
  // Position along the time axis, 0..STEPS-1.
  col: number;
  label: string;
}

// Order-fulfillment process, 10 steps across 8 time columns. Lanes are
// assigned by the responsible role. Two boxes share col 4 (parallel
// work) so the chart demonstrates non-strict-left-to-right sequencing.
const STEPS: ReadonlyArray<Step> = [
  { id: "submit", lane: "Customer", col: 0, label: "Submit order" },
  { id: "validate", lane: "Sales", col: 1, label: "Validate order" },
  { id: "quote", lane: "Sales", col: 2, label: "Issue quote" },
  { id: "approve", lane: "Customer", col: 3, label: "Approve quote" },
  { id: "spec", lane: "Engineering", col: 4, label: "Write spec" },
  { id: "build", lane: "Engineering", col: 5, label: "Build & test" },
  { id: "handoff", lane: "Sales", col: 6, label: "Confirm delivery" },
  { id: "invoice", lane: "Finance", col: 6, label: "Issue invoice" },
  { id: "pay", lane: "Customer", col: 7, label: "Pay" },
  { id: "close", lane: "Finance", col: 8, label: "Reconcile" },
];

interface Arrow {
  from: string;
  to: string;
  // "escalation" is a same-lane-jump-back dashed edge that illustrates
  // the common "spec review escalation" convention. Rendered dashed.
  kind?: "normal" | "escalation";
}

const ARROWS: ReadonlyArray<Arrow> = [
  { from: "submit", to: "validate" },
  { from: "validate", to: "quote" },
  { from: "quote", to: "approve" },
  { from: "approve", to: "spec" },
  { from: "spec", to: "build" },
  { from: "build", to: "handoff" },
  { from: "build", to: "invoice" }, // parallel handoff — same-source, two-target
  { from: "handoff", to: "pay" },
  { from: "invoice", to: "pay" },
  { from: "pay", to: "close" },
  // Escalation: engineering escalates to sales during build (spec drift).
  { from: "build", to: "quote", kind: "escalation" },
];

// Number of time columns used by STEPS. Kept as a constant so the x
// scale is deterministic even if a step is added later.
const COLS = 9;

export function SwimlaneChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 24, left: 96 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Lane geometry — equal bands top-to-bottom.
  const laneH = ih / LANES.length;
  const laneYByKey: Record<LaneKey, number> = {
    Customer: LANES.findIndex((l) => l.key === "Customer") * laneH,
    Sales: LANES.findIndex((l) => l.key === "Sales") * laneH,
    Engineering: LANES.findIndex((l) => l.key === "Engineering") * laneH,
    Finance: LANES.findIndex((l) => l.key === "Finance") * laneH,
  };
  // Column x — leave half-column padding on left and right so end
  // boxes don't butt against the plot border.
  const colStep = COLS > 1 ? iw / COLS : iw;
  const colX = (c: number) => colStep * (c + 0.5);

  const boxW = Math.max(24, Math.min(colStep * 0.9, 110));
  const boxH = Math.max(18, Math.min(laneH * 0.55, 40));

  function boxRect(step: Step) {
    const cx = colX(step.col);
    const cy = laneYByKey[step.lane] + laneH / 2;
    return {
      cx,
      cy,
      x: cx - boxW / 2,
      y: cy - boxH / 2,
      w: boxW,
      h: boxH,
    };
  }

  const stepById = new Map(STEPS.map((s) => [s.id, s]));

  // Arrow routing. A same-lane arrow is a straight horizontal segment
  // between the two boxes' right/left edges. A cross-lane arrow bends:
  // it leaves the source box horizontally to the midpoint, drops (or
  // rises) vertically across the lane divider, then continues
  // horizontally to the target box. The escalation arrow always bends
  // back across lanes in the opposite direction and is dashed.
  function arrowPath(a: Arrow): {
    d: string;
    midX: number;
    midY: number;
    headX: number;
    headY: number;
    headAngle: number;
    sameLane: boolean;
  } {
    const from = stepById.get(a.from)!;
    const to = stepById.get(a.to)!;
    const fr = boxRect(from);
    const tr = boxRect(to);
    const goingRight = tr.cx > fr.cx;
    const sameLane = from.lane === to.lane;

    // Start on the side of the source box facing the target; end on the
    // side of the target box facing the source.
    const sx = goingRight ? fr.x + fr.w : fr.x;
    const sy = fr.cy;
    const tx = goingRight ? tr.x : tr.x + tr.w;
    const ty = tr.cy;

    if (sameLane) {
      return {
        d: `M ${sx} ${sy} L ${tx} ${ty}`,
        midX: (sx + tx) / 2,
        midY: sy,
        headX: tx,
        headY: ty,
        headAngle: goingRight ? 0 : 180,
        sameLane: true,
      };
    }

    // Cross-lane: right-angle elbow with vertical middle segment.
    const midX = (sx + tx) / 2;
    const d = `M ${sx} ${sy} L ${midX} ${sy} L ${midX} ${ty} L ${tx} ${ty}`;
    return {
      d,
      midX,
      midY: (sy + ty) / 2,
      headX: tx,
      headY: ty,
      headAngle: goingRight ? 0 : 180,
      sameLane: false,
    };
  }

  // Pick representative arrows for anchors.
  const sameLaneArrow = ARROWS.find(
    (a) => stepById.get(a.from)!.lane === stepById.get(a.to)!.lane,
  )!;
  const crossLaneArrow = ARROWS.find(
    (a) =>
      stepById.get(a.from)!.lane !== stepById.get(a.to)!.lane &&
      a.kind !== "escalation",
  )!;
  const sameLaneGeom = arrowPath(sameLaneArrow);
  const crossLaneGeom = arrowPath(crossLaneArrow);

  const salesLaneY = laneYByKey["Sales"];
  const financeLaneY = laneYByKey["Finance"];
  const salesStep = STEPS.find((s) => s.id === "quote")!;
  const salesBox = boxRect(salesStep);

  // Divider between Sales (lane 1) and Engineering (lane 2) — classic
  // divider for the cross-lane handoff anchor.
  const dividerY = laneYByKey["Engineering"];

  return (
    <svg width={width} height={height} role="img" aria-label="Swimlane diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Lane backgrounds — alternating tint so the bands read as
            horizontal channels even before anything else is drawn. */}
        <g data-data-layer="true">
          {LANES.map((lane, i) => (
            <rect
              key={`bg-${lane.key}`}
              x={0}
              y={i * laneH}
              width={iw}
              height={laneH}
              fill="var(--color-hairline)"
              opacity={i % 2 === 0 ? 0.35 : 0}
            />
          ))}
        </g>

        {/* Lane dividers */}
        <g data-data-layer="true">
          {LANES.map((_, i) =>
            i === 0 ? null : (
              <line
                key={`div-${i}`}
                x1={0}
                y1={i * laneH}
                x2={iw}
                y2={i * laneH}
                stroke="var(--color-hairline)"
                strokeWidth={1}
              />
            ),
          )}
          {/* Top + bottom border */}
          <line
            x1={0}
            y1={0}
            x2={iw}
            y2={0}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
          <line
            x1={0}
            y1={ih}
            x2={iw}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* Lane labels (in the left margin) */}
        <g data-data-layer="true">
          {LANES.map((lane, i) => (
            <text
              key={`lbl-${lane.key}`}
              x={-10}
              y={i * laneH + laneH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={500}
              fill="var(--color-ink)"
            >
              {lane.label.toUpperCase()}
            </text>
          ))}
        </g>

        {/* Arrows first so boxes paint on top */}
        <g data-data-layer="true">
          {ARROWS.map((a, i) => {
            const geom = arrowPath(a);
            const isEsc = a.kind === "escalation";
            const rad = (geom.headAngle * Math.PI) / 180;
            // Pull tip back slightly so arrowhead does not cross into the
            // target box border.
            const backX = geom.headX - Math.cos(rad) * 2;
            const backY = geom.headY - Math.sin(rad) * 2;
            const head = 5;
            const p1x = backX;
            const p1y = backY;
            const p2x =
              backX -
              Math.cos(rad) * head +
              Math.cos(rad - Math.PI / 2) * (head * 0.55);
            const p2y =
              backY -
              Math.sin(rad) * head +
              Math.sin(rad - Math.PI / 2) * (head * 0.55);
            const p3x =
              backX -
              Math.cos(rad) * head -
              Math.cos(rad - Math.PI / 2) * (head * 0.55);
            const p3y =
              backY -
              Math.sin(rad) * head -
              Math.sin(rad - Math.PI / 2) * (head * 0.55);
            return (
              <g key={`arr-${i}`}>
                <path
                  d={geom.d}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={isEsc ? 1 : 1.2}
                  strokeDasharray={isEsc ? "3 3" : undefined}
                  opacity={isEsc ? 0.7 : 0.9}
                />
                <polygon
                  points={`${p1x},${p1y} ${p2x},${p2y} ${p3x},${p3y}`}
                  fill="var(--color-ink-mute)"
                  opacity={isEsc ? 0.7 : 0.9}
                />
              </g>
            );
          })}
        </g>

        {/* Boxes */}
        <g data-data-layer="true">
          {STEPS.map((s) => {
            const r = boxRect(s);
            return (
              <g key={`box-${s.id}`}>
                <rect
                  x={r.x}
                  y={r.y}
                  width={r.w}
                  height={r.h}
                  rx={3}
                  ry={3}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={r.cx}
                  y={r.cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9.5}
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors — 6 total, all render unconditionally. */}

        {/* 1. Lane — the entire Sales lane band */}
        <ExplainAnchor
          selector="lane"
          index={1}
          pin={{ x: iw - 8, y: salesLaneY + laneH / 2 }}
          rect={{
            x: 0,
            y: salesLaneY,
            width: iw,
            height: laneH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Box — the "Issue quote" step (a Sales-lane rectangle) */}
        <ExplainAnchor
          selector="box"
          index={2}
          pin={{ x: salesBox.cx, y: salesBox.y - 10 }}
          rect={{
            x: Math.max(0, salesBox.x - 2),
            y: Math.max(0, salesBox.y - 2),
            width: Math.min(iw - Math.max(0, salesBox.x - 2), salesBox.w + 4),
            height: Math.min(ih - Math.max(0, salesBox.y - 2), salesBox.h + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Cross-lane handoff — the signature encoding of the chart.
            The hit rect covers the vertical middle segment of the
            elbow arrow between the source lane and target lane. */}
        {(() => {
          const src = stepById.get(crossLaneArrow.from)!;
          const tgt = stepById.get(crossLaneArrow.to)!;
          const srcY = laneYByKey[src.lane] + laneH / 2;
          const tgtY = laneYByKey[tgt.lane] + laneH / 2;
          const topY = Math.min(srcY, tgtY);
          const bottomY = Math.max(srcY, tgtY);
          const rectX = Math.max(0, Math.min(crossLaneGeom.midX - 8, iw - 16));
          const rectY = Math.max(0, topY - 4);
          const rectH = Math.min(ih - rectY, bottomY - topY + 8);
          return (
            <ExplainAnchor
              selector="cross-lane-handoff"
              index={3}
              pin={{ x: crossLaneGeom.midX + 18, y: (topY + bottomY) / 2 }}
              rect={{
                x: rectX,
                y: rectY,
                width: Math.min(iw - rectX, 16),
                height: Math.max(10, rectH),
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 4. Same-lane arrow — the easy case, baseline for comparison */}
        <ExplainAnchor
          selector="same-lane-arrow"
          index={4}
          pin={{ x: sameLaneGeom.midX, y: sameLaneGeom.midY - 12 }}
          rect={{
            x: Math.max(0, Math.min(sameLaneGeom.midX - 20, iw - 40)),
            y: Math.max(0, sameLaneGeom.midY - 6),
            width: Math.min(iw, 40),
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Lane divider — the horizontal rule between Sales and
            Engineering. This is the line a cross-lane arrow must bend
            around; it is the chart's structural unit. */}
        <ExplainAnchor
          selector="lane-divider"
          index={5}
          pin={{ x: iw - 40, y: dividerY - 10 }}
          rect={{
            x: 0,
            y: Math.max(0, dividerY - 4),
            width: iw,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Role label — the "Finance" lane label (margin-space coords). */}
        <ExplainAnchor
          selector="role-label"
          index={6}
          pin={{ x: -margin.left + 8, y: financeLaneY + laneH / 2 }}
          rect={{
            x: -margin.left,
            y: financeLaneY,
            width: margin.left - 4,
            height: laneH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
