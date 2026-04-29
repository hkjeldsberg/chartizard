"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// A flame graph is an icicle chart flipped: root at the BOTTOM, stacks growing
// upward. Width encodes sampled time (proportion of total CPU samples).
// Colour is a warm random-ish palette hashed from the function name; it
// visually separates adjacent stacks but carries no semantic meaning.

interface RawNode {
  name: string;
  value?: number;
  children?: RawNode[];
}

// Hand-tabulated call tree, 5 levels deep. Totals sum so every parent equals
// the sum of its children, which keeps the partition geometry clean.
const DATA: RawNode = {
  name: "main()",
  children: [
    {
      name: "handleRequest()",
      children: [
        { name: "parseJSON()", value: 5 },
        { name: "authenticate()", value: 10 },
        {
          name: "queryDB()",
          children: [
            { name: "driver.prepare()", value: 10 },
            {
              name: "driver.execute()",
              children: [
                { name: "socketRead()", value: 35 },
                { name: "decodeRow()", value: 5 },
              ],
            },
          ],
        },
        { name: "render()", value: 5 },
      ],
    },
    {
      name: "backgroundJob()",
      children: [
        { name: "serializeBatch()", value: 20 },
        { name: "uploadToS3()", value: 10 },
      ],
    },
  ],
};

// Warm palette inspired by the original Brendan Gregg flame graphs (2011) —
// reds/oranges/yellows, mixed with a small amount of lime/gold. These are
// hashed per function name so the same name always gets the same colour.
const WARM_PALETTE = [
  "#e04b3a",
  "#e56a2d",
  "#e88a1f",
  "#edaa1a",
  "#ecc63a",
  "#d74e29",
  "#c5421f",
  "#b9501b",
  "#d98a27",
  "#c86436",
  "#e67248",
  "#d1381f",
];

function hashCode(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

function colourFor(name: string): string {
  return WARM_PALETTE[hashCode(name) % WARM_PALETTE.length];
}

// Truncate a label to fit a pixel width at ~5.6px per mono glyph at 9px.
function truncate(label: string, px: number): string {
  const maxChars = Math.max(0, Math.floor((px - 6) / 5.6));
  if (label.length <= maxChars) return label;
  if (maxChars <= 1) return "";
  return label.slice(0, Math.max(1, maxChars - 1)) + "…";
}

// Layout pass. For each node, compute x0..x1 (proportional to sampled time)
// and a depth index (0 = root). We place depth 0 at the BOTTOM of the plot
// and grow upward — this is the single convention that distinguishes a flame
// graph from an icicle chart.
interface LaidNode {
  name: string;
  depth: number;
  x0: number;
  x1: number;
  value: number;
}

function layOut(root: RawNode): { nodes: LaidNode[]; maxDepth: number } {
  // First, sum values from leaves upward so every parent = sum of children.
  function sumOf(n: RawNode): number {
    if (n.value !== undefined) return n.value;
    if (!n.children) return 0;
    return n.children.reduce((acc, c) => acc + sumOf(c), 0);
  }
  const rootTotal = sumOf(root);
  const result: LaidNode[] = [];
  let maxDepth = 0;

  function walk(n: RawNode, depth: number, x0: number) {
    const v = sumOf(n);
    const x1 = x0 + v;
    result.push({ name: n.name, depth, x0, x1, value: v });
    if (depth > maxDepth) maxDepth = depth;
    if (!n.children) return;
    let cursor = x0;
    for (const c of n.children) {
      const cv = sumOf(c);
      walk(c, depth + 1, cursor);
      cursor += cv;
    }
  }
  walk(root, 0, 0);
  return {
    nodes: result.map((n) => ({
      ...n,
      x0: n.x0 / rootTotal,
      x1: n.x1 / rootTotal,
    })),
    maxDepth,
  };
}

export function FlameGraph({ width, height }: Props) {
  const margin = { top: 16, right: 14, bottom: 36, left: 42 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { nodes, maxDepth } = useMemo(() => layOut(DATA), []);

  // Row height is the plot height divided by the number of levels shown.
  const levels = maxDepth + 1;
  const rowH = levels > 0 ? ih / levels : 0;

  // Convert layout coords to pixels. depth=0 sits at the BOTTOM.
  const px0 = (n: LaidNode) => n.x0 * iw;
  const px1 = (n: LaidNode) => n.x1 * iw;
  const pyTop = (n: LaidNode) => ih - (n.depth + 1) * rowH;
  const pyBottom = (n: LaidNode) => ih - n.depth * rowH;

  // Representative nodes for anchors — picked by name so data edits don't
  // break the anchors.
  const rootNode = nodes.find((n) => n.name === "main()");
  const depth1Sample = nodes.find((n) => n.name === "handleRequest()");
  const hotPath = nodes.find((n) => n.name === "socketRead()");
  const narrowLeaf = nodes.find((n) => n.name === "parseJSON()");

  function clampRect(r: { x: number; y: number; width: number; height: number }) {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  }

  // X-axis tick marks (0, 25, 50, 75, 100% of samples).
  const xTicks = [0, 0.25, 0.5, 0.75, 1].map((v) => ({ v, px: v * iw }));

  return (
    <svg width={width} height={height} role="img" aria-label="Flame Graph">
      <Group left={margin.left} top={margin.top}>
        {/* Rectangles — one per node. Drawn so depth=0 sits at the bottom
            and stacks grow UPWARD, which is the flame-graph convention. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const x = px0(n);
            const rw = Math.max(0, px1(n) - x);
            const y = pyTop(n);
            const rh = Math.max(0, rowH);
            if (rw <= 0 || rh <= 0) return null;
            return (
              <rect
                key={`f-${n.name}-${n.depth}-${n.x0.toFixed(3)}`}
                x={x}
                y={y}
                width={Math.max(0, rw - 1)}
                height={Math.max(0, rh - 1)}
                fill={colourFor(n.name)}
                fillOpacity={0.85}
                stroke="var(--color-page)"
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* Labels — drawn in a separate layer so they don't pick up stroke
            from the rectangles. */}
        <g data-data-layer="true">
          {nodes.map((n) => {
            const x = px0(n);
            const rw = Math.max(0, px1(n) - x);
            const y = pyTop(n);
            const rh = Math.max(0, rowH);
            if (rw < 22 || rh < 10) return null;
            return (
              <text
                key={`lbl-${n.name}-${n.depth}-${n.x0.toFixed(3)}`}
                x={x + 4}
                y={y + rh / 2}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {truncate(n.name, rw)}
              </text>
            );
          })}
        </g>

        {/* X-axis — proportion of CPU samples. */}
        <g data-data-layer="true">
          <line
            x1={0}
            y1={ih}
            x2={iw}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {xTicks.map((t) => (
            <g key={`xt-${t.v}`}>
              <line
                x1={t.px}
                y1={ih}
                x2={t.px}
                y2={ih + 4}
                stroke="var(--color-ink-mute)"
                strokeWidth={1}
              />
              <text
                x={t.px}
                y={ih + 14}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {`${Math.round(t.v * 100)}%`}
              </text>
            </g>
          ))}
          <text
            x={iw / 2}
            y={ih + 28}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            % OF CPU SAMPLES
          </text>
        </g>

        {/* Depth axis — rendered as a stacked tick set on the LEFT gutter,
            showing the call-stack depth of each row (0 = root at bottom). */}
        <g data-data-layer="true">
          <line
            x1={0}
            y1={0}
            x2={0}
            y2={ih}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          {Array.from({ length: levels }, (_, i) => i).map((d) => {
            const yCentre = ih - d * rowH - rowH / 2;
            return (
              <g key={`dt-${d}`}>
                <line
                  x1={-4}
                  y1={yCentre}
                  x2={0}
                  y2={yCentre}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1}
                />
                <text
                  x={-8}
                  y={yCentre + 3}
                  textAnchor="end"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {d}
                </text>
              </g>
            );
          })}
          <text
            x={-margin.left + 6}
            y={ih / 2}
            textAnchor="start"
            transform={`rotate(-90 ${-margin.left + 6} ${ih / 2})`}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            DEPTH
          </text>
        </g>

        {/* ----- Anchors ----- */}

        {/* 1. root-frame — the full-width bar at the bottom (main()). */}
        {rootNode && (
          <ExplainAnchor
            selector="root-frame"
            index={1}
            pin={{ x: iw - 12, y: pyBottom(rootNode) - rowH / 2 }}
            rect={clampRect({
              x: px0(rootNode),
              y: pyTop(rootNode),
              width: px1(rootNode) - px0(rootNode),
              height: rowH,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 2. child-frame — depth-1 sample (handleRequest()). */}
        {depth1Sample && (
          <ExplainAnchor
            selector="child-frame"
            index={2}
            pin={{
              x: (px0(depth1Sample) + px1(depth1Sample)) / 2,
              y: pyTop(depth1Sample) + rowH / 2,
            }}
            rect={clampRect({
              x: px0(depth1Sample),
              y: pyTop(depth1Sample),
              width: px1(depth1Sample) - px0(depth1Sample),
              height: rowH,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 3. hot-path — widest leaf (socketRead() at 35%). */}
        {hotPath && (
          <ExplainAnchor
            selector="hot-path"
            index={3}
            pin={{
              x: (px0(hotPath) + px1(hotPath)) / 2,
              y: Math.max(8, pyTop(hotPath) - 10),
            }}
            rect={clampRect({
              x: px0(hotPath),
              y: pyTop(hotPath),
              width: px1(hotPath) - px0(hotPath),
              height: rowH,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 4. x-axis — the proportion-of-samples axis along the bottom. */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 24 }}
          rect={{
            x: 0,
            y: ih,
            width: iw,
            height: Math.min(margin.bottom, 30),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. depth-axis — the call-stack-depth axis on the left. */}
        <ExplainAnchor
          selector="depth-axis"
          index={5}
          pin={{ x: -26, y: ih / 2 }}
          rect={{
            x: -margin.left,
            y: 0,
            width: margin.left,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. narrow-leaf — a fast function (parseJSON(), 5%). */}
        {narrowLeaf && (
          <ExplainAnchor
            selector="narrow-leaf"
            index={6}
            pin={{
              x: (px0(narrowLeaf) + px1(narrowLeaf)) / 2,
              y: Math.max(8, pyTop(narrowLeaf) - 10),
            }}
            rect={clampRect({
              x: px0(narrowLeaf),
              y: pyTop(narrowLeaf),
              width: px1(narrowLeaf) - px0(narrowLeaf),
              height: rowH,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 7. root-at-bottom — the orientation convention. Anchor rect hugs
            the bottom row so hover lands on the actual root frame. */}
        {rootNode && (
          <ExplainAnchor
            selector="root-at-bottom"
            index={7}
            pin={{ x: 18, y: Math.min(ih - 6, pyBottom(rootNode) + 6) }}
            rect={clampRect({
              x: 0,
              y: pyTop(rootNode),
              width: iw,
              height: rowH,
            })}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
