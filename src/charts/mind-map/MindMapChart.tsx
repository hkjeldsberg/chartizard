"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// A Buzan-style mind map: one central topic, five main branches radiating
// outward, each with 2-3 sub-branches and the odd third-level leaf for depth.
// Hand-rolled geometry (no d3-hierarchy) because mind maps ride on curved
// branch lines — a tree layout's straight edges lose the aesthetic.
interface MindNode {
  name: string;
  children?: MindNode[];
}

const DATA: MindNode = {
  name: "Plan a vacation",
  children: [
    {
      name: "Destination",
      children: [
        { name: "Europe", children: [{ name: "Lisbon" }] },
        { name: "Asia" },
        { name: "Domestic" },
      ],
    },
    {
      name: "Budget",
      children: [
        { name: "Flights" },
        { name: "Lodging" },
        { name: "Daily spend" },
      ],
    },
    {
      name: "Logistics",
      children: [
        { name: "Passports" },
        { name: "Insurance", children: [{ name: "Medical" }] },
      ],
    },
    {
      name: "Activities",
      children: [{ name: "Museums" }, { name: "Hiking" }, { name: "Food" }],
    },
    {
      name: "Packing",
      children: [{ name: "Clothes" }, { name: "Gear" }],
    },
  ],
};

interface Props {
  width: number;
  height: number;
}

// Branch angles in radians, hand-tuned so the five branches fan evenly
// around 360° and the labels don't collide with neighbours. -PI/2 points up.
const MAIN_ANGLES: number[] = [
  -Math.PI / 2 - 0.15, // Destination, upper-left quadrant
  Math.PI / 2 + 0.15, // Budget, lower-left quadrant
  -0.2, // Logistics, right
  Math.PI + 0.2, // Activities, left
  Math.PI / 2 - 0.15, // Packing, lower-right quadrant
];
// Reorder so visual positions match the DATA ordering: Destination,
// Budget, Logistics, Activities, Packing. We use evenly-distributed
// angles so the radial fan reads cleanly.
function mainAngleFor(index: number, n: number): number {
  // Start at the top (-PI/2) and rotate clockwise; five branches land at
  // top, upper-right, lower-right, lower-left, upper-left.
  return -Math.PI / 2 + (index * 2 * Math.PI) / n;
}

// Arc a curve from one point to another. A cubic Bezier with control
// points nudged toward the midpoint gives the organic hand-drawn look
// that makes a mind map feel different from a plain tree.
function curvePath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  bend: number,
): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  // Perpendicular offset vector, normalised.
  const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * bend;
  const cy = my + ny * bend;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

export function MindMapChart({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Radii are sized to the smaller dimension so the map never overflows.
  const r1 = Math.min(iw, ih) * 0.28; // main-branch distance
  const r2 = Math.min(iw, ih) * 0.44; // sub-branch distance
  const r3 = Math.min(iw, ih) * 0.48; // third-level leaf distance

  const mains = DATA.children ?? [];

  // Precompute all geometry so anchors can point at specific nodes by name.
  const laid = useMemo(() => {
    return mains.map((m, i) => {
      const angle = mainAngleFor(i, mains.length);
      const mx = cx + Math.cos(angle) * r1;
      const my = cy + Math.sin(angle) * r1;

      const subs = m.children ?? [];
      // Fan sub-branches within a ±0.6 rad wedge around the main angle.
      const wedge = 0.75;
      const positions = subs.map((s, j) => {
        const t = subs.length === 1 ? 0 : j / (subs.length - 1) - 0.5;
        const subAngle = angle + t * wedge;
        const sx = cx + Math.cos(subAngle) * r2;
        const sy = cy + Math.sin(subAngle) * r2;
        // Optional third-level leaf
        const leaf = s.children?.[0];
        const leafPos = leaf
          ? {
              name: leaf.name,
              angle: subAngle + 0.12,
              x: cx + Math.cos(subAngle + 0.12) * r3,
              y: cy + Math.sin(subAngle + 0.12) * r3,
            }
          : null;
        return { name: s.name, angle: subAngle, x: sx, y: sy, leaf: leafPos };
      });

      return { name: m.name, angle, x: mx, y: my, subs: positions };
    });
  }, [mains, cx, cy, r1, r2, r3]);

  // Anchors pick specific nodes so the copy stays concrete.
  const destination = laid.find((l) => l.name === "Destination");
  const destEurope = destination?.subs.find((s) => s.name === "Europe");
  const lisbonLeaf = destEurope?.leaf ?? null;
  // Fallback representatives if the named nodes aren't present.
  const anyMain = laid[0];
  const anySub = laid[0]?.subs[0];

  const mainAnchor = destination ?? anyMain;
  const subAnchor = destEurope ?? anySub;
  const leafAnchor = lisbonLeaf;

  // Clamp helper keeps all rects inside the plot area.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Pick a reasonable bend direction for each curve. Positive bend arcs
  // one way, negative the other; we alternate by index for variety.
  const bendFor = (i: number, base: number) => (i % 2 === 0 ? base : -base);

  return (
    <svg width={width} height={height} role="img" aria-label="Mind map">
      <Group left={margin.left} top={margin.top}>
        {/* Main-branch curves — thick strokes, one per main branch */}
        <g data-data-layer="true">
          {laid.map((m, i) => (
            <path
              key={`main-${m.name}`}
              d={curvePath(cx, cy, m.x, m.y, bendFor(i, 22))}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={2.25}
              strokeLinecap="round"
            />
          ))}
        </g>

        {/* Sub-branch curves — thinner strokes */}
        <g data-data-layer="true">
          {laid.flatMap((m, i) =>
            m.subs.map((s, j) => (
              <path
                key={`sub-${m.name}-${s.name}`}
                d={curvePath(m.x, m.y, s.x, s.y, bendFor(i + j, 10))}
                fill="none"
                stroke="var(--color-ink-mute)"
                strokeWidth={1.2}
                strokeLinecap="round"
              />
            )),
          )}
        </g>

        {/* Third-level leaf curves — thinnest */}
        <g data-data-layer="true">
          {laid.flatMap((m) =>
            m.subs
              .filter((s) => s.leaf)
              .map((s) => (
                <path
                  key={`leaf-${m.name}-${s.name}`}
                  d={curvePath(s.x, s.y, s.leaf!.x, s.leaf!.y, 6)}
                  fill="none"
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.9}
                  strokeLinecap="round"
                  strokeDasharray="1 2"
                />
              )),
          )}
        </g>

        {/* Sub-branch nodes + labels */}
        <g data-data-layer="true">
          {laid.flatMap((m) =>
            m.subs.map((s) => {
              // Anchor the label on the outward side of the node.
              const anchor = Math.cos(s.angle) >= 0 ? "start" : "end";
              const dx = Math.cos(s.angle) >= 0 ? 6 : -6;
              return (
                <g key={`subn-${m.name}-${s.name}`}>
                  <circle cx={s.x} cy={s.y} r={2.2} fill="var(--color-ink)" />
                  <text
                    x={s.x + dx}
                    y={s.y + 3}
                    textAnchor={anchor}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink-soft)"
                  >
                    {s.name}
                  </text>
                </g>
              );
            }),
          )}
        </g>

        {/* Third-level leaves */}
        <g data-data-layer="true">
          {laid.flatMap((m) =>
            m.subs
              .filter((s) => s.leaf)
              .map((s) => {
                const anchor = Math.cos(s.leaf!.angle) >= 0 ? "start" : "end";
                const dx = Math.cos(s.leaf!.angle) >= 0 ? 6 : -6;
                return (
                  <g key={`leafn-${m.name}-${s.name}`}>
                    <circle
                      cx={s.leaf!.x}
                      cy={s.leaf!.y}
                      r={1.6}
                      fill="var(--color-surface)"
                      stroke="var(--color-ink-mute)"
                      strokeWidth={1}
                    />
                    <text
                      x={s.leaf!.x + dx}
                      y={s.leaf!.y + 3}
                      textAnchor={anchor}
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink-mute)"
                    >
                      {s.leaf!.name}
                    </text>
                  </g>
                );
              }),
          )}
        </g>

        {/* Main-branch nodes + labels */}
        <g data-data-layer="true">
          {laid.map((m) => {
            const anchor = Math.cos(m.angle) >= 0 ? "start" : "end";
            const dx = Math.cos(m.angle) >= 0 ? 8 : -8;
            return (
              <g key={`mainn-${m.name}`}>
                <circle cx={m.x} cy={m.y} r={3.4} fill="var(--color-ink)" />
                <text
                  x={m.x + dx}
                  y={m.y + 3}
                  textAnchor={anchor}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {m.name.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* Central node — drawn last so it sits on top of branch starts */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={20}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
          <text
            x={cx}
            y={cy + 3}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            VACATION
          </text>
        </g>

        {/* Anchor 1: central node — the topic */}
        <ExplainAnchor
          selector="central-node"
          index={1}
          pin={{ x: cx, y: cy - 28 }}
          rect={clampRect({ x: cx - 22, y: cy - 22, width: 44, height: 44 })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: main branch — the "Destination" branch */}
        {mainAnchor && (
          <ExplainAnchor
            selector="main-branch"
            index={2}
            pin={{
              x: (cx + mainAnchor.x) / 2 + bendFor(laid.indexOf(mainAnchor), 22) * 0.1,
              y: (cy + mainAnchor.y) / 2 - 14,
            }}
            rect={clampRect({
              x: Math.min(cx, mainAnchor.x) - 10,
              y: Math.min(cy, mainAnchor.y) - 10,
              width: Math.abs(mainAnchor.x - cx) + 20,
              height: Math.abs(mainAnchor.y - cy) + 20,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: sub-branch — the "Europe" sub-branch off Destination */}
        {subAnchor && mainAnchor && (
          <ExplainAnchor
            selector="sub-branch"
            index={3}
            pin={{ x: subAnchor.x, y: subAnchor.y - 14 }}
            rect={clampRect({
              x: Math.min(mainAnchor.x, subAnchor.x) - 8,
              y: Math.min(mainAnchor.y, subAnchor.y) - 8,
              width: Math.abs(subAnchor.x - mainAnchor.x) + 16,
              height: Math.abs(subAnchor.y - mainAnchor.y) + 16,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4: curved stroke — the visual signature of mind maps */}
        <ExplainAnchor
          selector="curved-branch"
          index={4}
          pin={{ x: cx, y: cy + r1 * 0.55 }}
          rect={clampRect({
            x: cx - r1 * 0.7,
            y: cy,
            width: r1 * 1.4,
            height: r1 * 0.7,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: third-level leaf — Lisbon, the deepest node */}
        {leafAnchor && (
          <ExplainAnchor
            selector="third-level-leaf"
            index={5}
            pin={{ x: leafAnchor.x, y: leafAnchor.y + 14 }}
            rect={clampRect({
              x: leafAnchor.x - 18,
              y: leafAnchor.y - 8,
              width: 36,
              height: 18,
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 6: radial layout — the whole-plot "starting from the centre" concept */}
        <ExplainAnchor
          selector="radial-layout"
          index={6}
          pin={{ x: iw - 14, y: 14 }}
          rect={clampRect({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
