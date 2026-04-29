"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Static layout — 24 sticky-note ideas organised into 5 clusters,
// 2 of which are meta-grouped under "Getting into the product".
// All coordinates are in inner-plot space (origin = top-left of plot area).
// ---------------------------------------------------------------------------

interface Sticky {
  text: string;
  x: number;
  y: number;
}

interface Cluster {
  label: string;
  headerX: number;
  headerY: number;
  stickies: Sticky[];
}

const CLUSTERS: Cluster[] = [
  {
    label: "Authentication pain",
    headerX: 16,
    headerY: 12,
    stickies: [
      { text: "Login is slow", x: 16, y: 38 },
      { text: "Forgot password again", x: 68, y: 38 },
      { text: "Two-factor broke", x: 16, y: 66 },
      { text: "SSO redirect fails", x: 68, y: 66 },
      { text: "Session expires too fast", x: 42, y: 94 },
    ],
  },
  {
    label: "Onboarding friction",
    headerX: 156,
    headerY: 12,
    stickies: [
      { text: "Setup wizard confusing", x: 156, y: 38 },
      { text: "Too many steps", x: 208, y: 38 },
      { text: "No progress indicator", x: 156, y: 66 },
      { text: "Invite link broken", x: 208, y: 66 },
    ],
  },
  {
    label: "Data-entry burden",
    headerX: 16,
    headerY: 136,
    stickies: [
      { text: "Forms too long", x: 16, y: 162 },
      { text: "No auto-save", x: 68, y: 162 },
      { text: "Duplicate fields", x: 16, y: 190 },
      { text: "CSV import breaks", x: 68, y: 190 },
      { text: "Required field unclear", x: 42, y: 218 },
    ],
  },
  {
    label: "Navigation confusion",
    headerX: 156,
    headerY: 136,
    stickies: [
      { text: "Menu items hidden", x: 156, y: 162 },
      { text: "Back button wrong", x: 208, y: 162 },
      { text: "Deep link breaks", x: 156, y: 190 },
      { text: "Search missing", x: 208, y: 190 },
    ],
  },
  {
    label: "Performance",
    headerX: 86,
    headerY: 258,
    stickies: [
      { text: "Dashboard loads 10s", x: 66, y: 284 },
      { text: "Charts freeze", x: 118, y: 284 },
      { text: "Export hangs", x: 66, y: 312 },
      { text: "Mobile very slow", x: 118, y: 312 },
    ],
  },
];

// The first two clusters are meta-grouped under "Getting into the product"
const META_GROUP = {
  label: "Getting into the product",
  x: 6,
  y: 4,
  width: 278,
  height: 120,
};

const STICKY_W = 50;
const STICKY_H = 22;
const HEADER_W = 104;
const HEADER_H = 20;

export function AffinityDiagram({ width, height }: { width: number; height: number }) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Scale to fit: content is ~290 wide × 348 tall
  const contentW = 290;
  const contentH = 348;
  const scale = Math.min(iw / contentW, ih / contentH, 1);
  const offsetX = (iw - contentW * scale) / 2;
  const offsetY = (ih - contentH * scale) / 2;

  // Anchors use scaled coords (applied inside the transform)
  const s = scale;

  return (
    <svg width={width} height={height} role="img" aria-label="Affinity Diagram">
      <Group left={margin.left} top={margin.top}>
        <Group left={offsetX} top={offsetY}>
          {/* Scale everything uniformly */}
          <g transform={`scale(${s})`}>

            {/* ── Data layer ─────────────────────────────── */}
            <g data-data-layer="true">

              {/* Meta-group enclosure */}
              <rect
                x={META_GROUP.x}
                y={META_GROUP.y}
                width={META_GROUP.width}
                height={META_GROUP.height}
                rx={6}
                ry={6}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
                strokeDasharray="5 3"
              />

              {/* All clusters: headers + stickies */}
              {CLUSTERS.map((cluster) => (
                <g key={cluster.label}>
                  {/* Cluster header */}
                  <rect
                    x={cluster.headerX}
                    y={cluster.headerY}
                    width={HEADER_W}
                    height={HEADER_H}
                    rx={3}
                    ry={3}
                    fill="var(--color-ink)"
                    opacity={0.85}
                  />
                  <text
                    x={cluster.headerX + HEADER_W / 2}
                    y={cluster.headerY + HEADER_H / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={6.5}
                    fontFamily="var(--font-mono)"
                    fill="var(--color-page)"
                    fontWeight="600"
                  >
                    {cluster.label}
                  </text>

                  {/* Sticky notes */}
                  {cluster.stickies.map((s) => (
                    <g key={s.text}>
                      <rect
                        x={s.x}
                        y={s.y}
                        width={STICKY_W}
                        height={STICKY_H}
                        rx={2}
                        ry={2}
                        fill="var(--color-surface)"
                        stroke="var(--color-hairline)"
                        strokeWidth={0.8}
                      />
                      <text
                        x={s.x + STICKY_W / 2}
                        y={s.y + STICKY_H / 2}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={5}
                        fontFamily="var(--font-mono)"
                        fill="var(--color-ink)"
                      >
                        {s.text}
                      </text>
                    </g>
                  ))}
                </g>
              ))}
            </g>

          </g>
          {/* ── Explain Anchors — in scaled space ───────── */}

          {/* 1. Sticky notes */}
          <ExplainAnchor
            selector="sticky-note"
            index={1}
            pin={{ x: 18 * s, y: 74 * s }}
            rect={{ x: 0, y: 32 * s, width: 120 * s, height: 90 * s }}
          />

          {/* 2. Cluster header */}
          <ExplainAnchor
            selector="cluster-header"
            index={2}
            pin={{ x: 60 * s, y: 5 * s }}
            rect={{ x: 10 * s, y: 8 * s, width: 110 * s, height: 22 * s }}
          />

          {/* 3. Meta-group */}
          <ExplainAnchor
            selector="meta-group"
            index={3}
            pin={{ x: 144 * s, y: 2 * s }}
            rect={{ x: 4 * s, y: 0, width: 278 * s, height: 18 * s }}
          />

          {/* 4. Second cluster block */}
          <ExplainAnchor
            selector="second-cluster"
            index={4}
            pin={{ x: 264 * s, y: 30 * s }}
            rect={{ x: 150 * s, y: 8 * s, width: 116 * s, height: 80 * s }}
          />

          {/* 5. Lower cluster (data-entry, navigation) */}
          <ExplainAnchor
            selector="lower-clusters"
            index={5}
            pin={{ x: 264 * s, y: 150 * s }}
            rect={{ x: 0, y: 130 * s, width: 280 * s, height: 100 * s }}
          />

          {/* 6. Performance cluster */}
          <ExplainAnchor
            selector="performance-cluster"
            index={6}
            pin={{ x: 215 * s, y: 258 * s }}
            rect={{ x: 50 * s, y: 252 * s, width: 160 * s, height: 80 * s }}
          />

        </Group>
      </Group>
    </svg>
  );
}
