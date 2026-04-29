"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 18-package monorepo — one hub (`ui-core`) plus runtime, infra, and feature
// layers. The graph is a DAG: every edge A -> B means "A imports B".
// Ordered around the wheel so layers read clockwise from the hub.
const NODES = [
  "ui-core",      // 0  — hub, top
  "design-tokens",// 1
  "icons",        // 2
  "forms",        // 3
  "layout",       // 4
  "charts",       // 5
  "editor",       // 6
  "router",       // 7
  "auth",         // 8
  "api-sdk",      // 9
  "analytics",    // 10
  "logger",       // 11
  "db-client",    // 12
  "queue",        // 13
  "cache",        // 14
  "http-client",  // 15
  "config",       // 16
  "utils",        // 17
] as const;

type Pkg = (typeof NODES)[number];
const idx = (n: Pkg): number => NODES.indexOf(n);

// Edges: A -> B means A depends on B. Kept acyclic.
// The `ui-core` hub depends on design-tokens + icons + utils; many feature
// packages depend ON `ui-core`. Deepest chain: analytics -> auth -> db-client
// -> http-client -> config.
const EDGES: ReadonlyArray<{ from: Pkg; to: Pkg }> = [
  // ui-core's own small dependency set
  { from: "ui-core", to: "design-tokens" },
  { from: "ui-core", to: "icons" },
  { from: "ui-core", to: "utils" },

  // Feature packages depend on ui-core (the hub pattern).
  { from: "forms", to: "ui-core" },
  { from: "layout", to: "ui-core" },
  { from: "charts", to: "ui-core" },
  { from: "editor", to: "ui-core" },
  { from: "router", to: "ui-core" },
  { from: "auth", to: "ui-core" },

  // Feature cross-dependencies
  { from: "forms", to: "utils" },
  { from: "charts", to: "utils" },
  { from: "editor", to: "forms" },
  { from: "router", to: "logger" },

  // Runtime / infra layer
  { from: "analytics", to: "auth" },
  { from: "analytics", to: "logger" },
  { from: "auth", to: "db-client" },
  { from: "auth", to: "http-client" },
  { from: "api-sdk", to: "http-client" },
  { from: "api-sdk", to: "auth" },
  { from: "db-client", to: "http-client" },
  { from: "db-client", to: "cache" },
  { from: "queue", to: "logger" },
  { from: "queue", to: "cache" },
  { from: "http-client", to: "config" },
  { from: "http-client", to: "logger" },
  { from: "cache", to: "config" },
  { from: "logger", to: "config" },

  // Shared utilities foundation
  { from: "utils", to: "config" },
];

interface Props {
  width: number;
  height: number;
}

export function DependencyGraph({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const size = Math.min(iw, ih);
  const radius = Math.max(0, size / 2 - 64); // leave room for labels
  const cx = iw / 2;
  const cy = ih / 2;

  // Angle per node. 0 at top (12 o'clock), clockwise.
  const n = NODES.length;
  const nodeAngle = (i: number) => -Math.PI / 2 + (2 * Math.PI * i) / n;
  const nodePos = (i: number) => ({
    x: Math.cos(nodeAngle(i)) * radius,
    y: Math.sin(nodeAngle(i)) * radius,
  });

  // Count in-degree for each node. The hub is the one with the highest count.
  const inDegree = useMemo(() => {
    const d = new Array(n).fill(0);
    for (const e of EDGES) d[idx(e.to)] += 1;
    return d;
  }, [n]);
  const hubIdx = idx("ui-core");

  // Chord path between two points on the ring — cubic bezier through the
  // centre. The control points sit at a fraction of the radius along the
  // straight line into the centre; that fraction controls the curvature.
  const chordPath = (a: number, b: number) => {
    const p1 = nodePos(a);
    const p2 = nodePos(b);
    // Pull controls toward the centre proportionally to how far apart the
    // endpoints are — adjacent nodes curve mildly, opposite nodes sag deeply.
    const sep = Math.abs(((a - b + n) % n) - n / 2); // 0 = opposite, n/2 = adjacent
    const pull = 0.25 + 0.55 * (sep / (n / 2));
    const c1 = { x: p1.x * pull, y: p1.y * pull };
    const c2 = { x: p2.x * pull, y: p2.y * pull };
    return `M ${p1.x} ${p1.y} C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${p2.x} ${p2.y}`;
  };

  // Representative edge for the "edge" anchor — ui-core -> design-tokens
  // (ui-core's own dependency, short chord).
  const repEdge = { from: idx("ui-core"), to: idx("design-tokens") };

  // Representative deep-chain edge — analytics -> auth.
  const chainEdge = { from: idx("analytics"), to: idx("auth") };

  // Pin helper: clamp an absolute (cx+dx, cy+dy) into the plot area.
  const absClamp = (x: number, y: number, pad = 10) => ({
    x: Math.max(pad, Math.min(iw - pad, x)),
    y: Math.max(pad, Math.min(ih - pad, y)),
  });

  const hubPos = nodePos(hubIdx);
  const hubAbs = { x: cx + hubPos.x, y: cy + hubPos.y };
  // Hub pin sits slightly above the hub node (hub is at 12 o'clock).
  const hubPin = absClamp(hubAbs.x, hubAbs.y - 26);

  // Leaf (low in-degree) representative: pick a first-party feature node
  // that only depends outward — `editor` (index depends on forms).
  const leafIdx = idx("editor");
  const leafPos = nodePos(leafIdx);
  const leafAbs = { x: cx + leafPos.x, y: cy + leafPos.y };
  const leafAngle = nodeAngle(leafIdx);
  const leafPin = absClamp(
    leafAbs.x + Math.cos(leafAngle) * 28,
    leafAbs.y + Math.sin(leafAngle) * 28,
  );

  // Chord midpoint for the representative-edge anchor — midpoint of the
  // cubic bezier at t=0.5.
  const bezierMid = (a: number, b: number) => {
    const p1 = nodePos(a);
    const p2 = nodePos(b);
    const sep = Math.abs(((a - b + n) % n) - n / 2);
    const pull = 0.25 + 0.55 * (sep / (n / 2));
    const c1 = { x: p1.x * pull, y: p1.y * pull };
    const c2 = { x: p2.x * pull, y: p2.y * pull };
    // Cubic bezier at t=0.5:
    // B(0.5) = 0.125*p1 + 0.375*c1 + 0.375*c2 + 0.125*p2
    return {
      x: 0.125 * p1.x + 0.375 * c1.x + 0.375 * c2.x + 0.125 * p2.x,
      y: 0.125 * p1.y + 0.375 * c1.y + 0.375 * c2.y + 0.125 * p2.y,
    };
  };

  const repMid = bezierMid(repEdge.from, repEdge.to);
  const repAbs = { x: cx + repMid.x, y: cy + repMid.y };
  const repPin = absClamp(repAbs.x, repAbs.y - 20);

  const chainMid = bezierMid(chainEdge.from, chainEdge.to);
  const chainAbs = { x: cx + chainMid.x, y: cy + chainMid.y };
  const chainPin = absClamp(chainAbs.x, chainAbs.y);

  // Direction arrowhead anchor — at the endpoint of the rep edge (the `to`
  // side, since that's where the arrowhead sits).
  const dirPos = nodePos(repEdge.to);
  const dirAbs = {
    x: cx + dirPos.x * 0.82,
    y: cy + dirPos.y * 0.82,
  };
  const dirPin = absClamp(dirAbs.x + 18, dirAbs.y + 18);

  // Clamp every rect to plot area [0, iw] x [0, ih].
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

  const hubRect = clampRect({
    x: hubAbs.x - 34,
    y: hubAbs.y - 22,
    width: 68,
    height: 44,
  });

  const leafRect = clampRect({
    x: leafAbs.x - 34,
    y: leafAbs.y - 22,
    width: 68,
    height: 44,
  });

  const repRect = clampRect({
    x: repAbs.x - 24,
    y: repAbs.y - 24,
    width: 48,
    height: 48,
  });

  const chainRect = clampRect({
    x: chainAbs.x - 30,
    y: chainAbs.y - 30,
    width: 60,
    height: 60,
  });

  const dirRect = clampRect({
    x: dirAbs.x - 18,
    y: dirAbs.y - 18,
    width: 36,
    height: 36,
  });

  // Wheel anchor — the whole ring, so hovering anywhere on the ring bounds
  // explains the radial layout.
  const wheelRect = clampRect({
    x: cx - radius - 14,
    y: cy - radius - 14,
    width: radius * 2 + 28,
    height: radius * 2 + 28,
  });

  // Set of edges touching the hub — draw them thicker.
  const hubEdgeKey = (e: { from: Pkg; to: Pkg }) =>
    e.from === "ui-core" || e.to === "ui-core";

  return (
    <svg width={width} height={height} role="img" aria-label="Dependency graph">
      <Group left={margin.left} top={margin.top}>
        <Group left={cx} top={cy}>
          <g data-data-layer="true">
            {/* Arrowhead marker */}
            <defs>
              <marker
                id="dep-arrow"
                viewBox="0 0 8 8"
                refX="6.5"
                refY="4"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--color-ink)" />
              </marker>
              <marker
                id="dep-arrow-mute"
                viewBox="0 0 8 8"
                refX="6.5"
                refY="4"
                markerWidth="5"
                markerHeight="5"
                orient="auto-start-reverse"
              >
                <path d="M 0 0 L 8 4 L 0 8 Z" fill="var(--color-ink-mute)" />
              </marker>
            </defs>

            {/* Chords (edges). Draw non-hub edges first, hub edges on top. */}
            <g fill="none">
              {EDGES.filter((e) => !hubEdgeKey(e)).map((e, i) => (
                <path
                  key={`e-${i}`}
                  d={chordPath(idx(e.from), idx(e.to))}
                  stroke="var(--color-ink-mute)"
                  strokeOpacity={0.45}
                  strokeWidth={1}
                  markerEnd="url(#dep-arrow-mute)"
                />
              ))}
              {EDGES.filter((e) => hubEdgeKey(e)).map((e, i) => (
                <path
                  key={`h-${i}`}
                  d={chordPath(idx(e.from), idx(e.to))}
                  stroke="var(--color-ink)"
                  strokeOpacity={0.7}
                  strokeWidth={1.8}
                  markerEnd="url(#dep-arrow)"
                />
              ))}
            </g>

            {/* Nodes */}
            <g>
              {NODES.map((name, i) => {
                const p = nodePos(i);
                const isHub = i === hubIdx;
                const r = isHub ? 7 : 4 + Math.min(3, inDegree[i] * 0.9);
                return (
                  <circle
                    key={`n-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={r}
                    fill={isHub ? "var(--color-ink)" : "var(--color-surface)"}
                    stroke="var(--color-ink)"
                    strokeWidth={isHub ? 0 : 1.3}
                  />
                );
              })}
            </g>

            {/* Labels outside the wheel */}
            <g>
              {NODES.map((name, i) => {
                const a = nodeAngle(i);
                const lr = radius + 14;
                const x = Math.cos(a) * lr;
                const y = Math.sin(a) * lr;
                // Text anchor by quadrant: right half = start, left half = end.
                const deg = ((a * 180) / Math.PI + 360) % 360;
                const isLeft = deg > 90 && deg < 270;
                return (
                  <text
                    key={`l-${i}`}
                    x={x}
                    y={y}
                    textAnchor={isLeft ? "end" : "start"}
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fontWeight={i === hubIdx ? 600 : 500}
                    fill="var(--color-ink)"
                  >
                    {name}
                  </text>
                );
              })}
            </g>
          </g>
        </Group>

        {/* 1. Hub node — ui-core at 12 o'clock */}
        <ExplainAnchor
          selector="hub-node"
          index={1}
          pin={{ x: hubPin.x, y: hubPin.y }}
          rect={hubRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Leaf / feature node */}
        <ExplainAnchor
          selector="leaf-node"
          index={2}
          pin={{ x: leafPin.x, y: leafPin.y }}
          rect={leafRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Dependency edge */}
        <ExplainAnchor
          selector="edge"
          index={3}
          pin={{ x: repPin.x, y: repPin.y }}
          rect={repRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Arrow direction */}
        <ExplainAnchor
          selector="direction"
          index={4}
          pin={{ x: dirPin.x, y: dirPin.y }}
          rect={dirRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Dependency chain — analytics -> auth -> db-client -> ... */}
        <ExplainAnchor
          selector="chain"
          index={5}
          pin={{ x: chainPin.x, y: chainPin.y }}
          rect={chainRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Radial layout (the wheel) */}
        <ExplainAnchor
          selector="wheel-layout"
          index={6}
          pin={{ x: cx, y: cy }}
          rect={wheelRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
