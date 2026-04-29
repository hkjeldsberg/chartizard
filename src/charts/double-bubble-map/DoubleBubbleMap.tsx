"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Hyerle's Double Bubble Map (Thinking Maps, 1995) — the compare-and-contrast
// map. Two central nouns side-by-side, shared attributes in a middle column
// linked to BOTH, unique attributes on the outer sides linked to ONE each.
// Distinct from a Venn: Venn encodes membership via regions; double bubble
// encodes it via named nodes and explicit edges.
const LEFT_NOUN = "Cat";
const RIGHT_NOUN = "Dog";

const SHARED: ReadonlyArray<string> = ["furry", "mammal", "pet", "four-legged"];
const LEFT_UNIQUE: ReadonlyArray<string> = ["independent", "purrs", "uses litter box"];
const RIGHT_UNIQUE: ReadonlyArray<string> = ["loyal", "barks", "walks on leash"];

interface Props {
  width: number;
  height: number;
}

interface Bubble {
  name: string;
  x: number;
  y: number;
}

export function DoubleBubbleMap({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cy = ih / 2;
  // Central bubbles at 1/4 and 3/4 horizontally. Shared column runs through
  // the midline between them.
  const leftCx = iw * 0.24;
  const rightCx = iw * 0.76;
  const midX = iw * 0.5;

  const rCentral = Math.min(46, Math.min(iw, ih) * 0.14);
  const rSat = Math.min(30, Math.min(iw, ih) * 0.095);

  // Shared bubbles stack vertically in the middle column.
  const sharedOffsetMax = Math.min(ih * 0.38, rSat * SHARED.length * 1.3);
  const sharedBubbles: Bubble[] = useMemo(() => {
    const n = SHARED.length;
    return SHARED.map((name, i) => {
      const t = n === 1 ? 0 : i / (n - 1) - 0.5; // -0.5..0.5
      return {
        name,
        x: midX,
        y: cy + t * sharedOffsetMax * 2,
      };
    });
  }, [cy, midX, sharedOffsetMax]);

  // Unique bubbles fan on the outer side of each central.
  const uniqueFanRadius = Math.min(
    Math.min(iw, ih) * 0.3,
    rCentral + rSat + Math.min(iw, ih) * 0.1,
  );
  const uniqueFor = (
    items: ReadonlyArray<string>,
    anchorX: number,
    side: "left" | "right",
  ): Bubble[] => {
    const n = items.length;
    // Angles fan outward: left side uses angles around PI, right around 0.
    const baseAngle = side === "left" ? Math.PI : 0;
    const spread = 1.4; // ~80° fan
    return items.map((name, i) => {
      const t = n === 1 ? 0 : i / (n - 1) - 0.5;
      const a = baseAngle + t * spread;
      return {
        name,
        x: anchorX + Math.cos(a) * uniqueFanRadius,
        y: cy + Math.sin(a) * uniqueFanRadius,
      };
    });
  };

  const leftUniqueBubbles = useMemo(
    () => uniqueFor(LEFT_UNIQUE, leftCx, "left"),
    [leftCx, uniqueFanRadius, cy],
  );
  const rightUniqueBubbles = useMemo(
    () => uniqueFor(RIGHT_UNIQUE, rightCx, "right"),
    [rightCx, uniqueFanRadius, cy],
  );

  // Trim line endpoints to circle edges.
  function trim(
    x1: number,
    y1: number,
    r1: number,
    x2: number,
    y2: number,
    r2: number,
  ) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * r1,
      y1: y1 + uy * r1,
      x2: x2 - ux * r2,
      y2: y2 - uy * r2,
    };
  }

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Anchor representatives.
  const furry = sharedBubbles.find((b) => b.name === "furry") ?? sharedBubbles[0];
  const independent =
    leftUniqueBubbles.find((b) => b.name === "independent") ?? leftUniqueBubbles[0];

  return (
    <svg width={width} height={height} role="img" aria-label="Double bubble map">
      <Group left={margin.left} top={margin.top}>
        {/* Edges: shared bubbles get TWO lines (to each central); uniques get one. */}
        <g data-data-layer="true">
          {sharedBubbles.map((s) => {
            const toLeft = trim(leftCx, cy, rCentral, s.x, s.y, rSat);
            const toRight = trim(rightCx, cy, rCentral, s.x, s.y, rSat);
            return (
              <g key={`shared-edge-${s.name}`}>
                <line
                  x1={toLeft.x1}
                  y1={toLeft.y1}
                  x2={toLeft.x2}
                  y2={toLeft.y2}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                />
                <line
                  x1={toRight.x1}
                  y1={toRight.y1}
                  x2={toRight.x2}
                  y2={toRight.y2}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={1.1}
                  strokeLinecap="round"
                />
              </g>
            );
          })}
          {leftUniqueBubbles.map((u) => {
            const seg = trim(leftCx, cy, rCentral, u.x, u.y, rSat);
            return (
              <line
                key={`left-edge-${u.name}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="var(--color-ink-mute)"
                strokeWidth={1.1}
                strokeLinecap="round"
              />
            );
          })}
          {rightUniqueBubbles.map((u) => {
            const seg = trim(rightCx, cy, rCentral, u.x, u.y, rSat);
            return (
              <line
                key={`right-edge-${u.name}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="var(--color-ink-mute)"
                strokeWidth={1.1}
                strokeLinecap="round"
              />
            );
          })}
        </g>

        {/* Satellite bubbles — shared + unique */}
        <g data-data-layer="true">
          {[...sharedBubbles, ...leftUniqueBubbles, ...rightUniqueBubbles].map((b) => (
            <g key={`sat-${b.x}-${b.y}-${b.name}`}>
              <circle
                cx={b.x}
                cy={b.y}
                r={rSat}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.1}
              />
              <text
                x={b.x}
                y={b.y + 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {b.name}
              </text>
            </g>
          ))}
        </g>

        {/* Central bubbles — drawn last so edges tuck under them */}
        <g data-data-layer="true">
          {([
            { name: LEFT_NOUN, x: leftCx, y: cy },
            { name: RIGHT_NOUN, x: rightCx, y: cy },
          ] as const).map((c) => (
            <g key={`central-${c.name}`}>
              <circle
                cx={c.x}
                cy={c.y}
                r={rCentral}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.8}
              />
              <text
                x={c.x}
                y={c.y + 4}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={12}
                fontWeight={500}
                fill="var(--color-ink)"
              >
                {c.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* Anchor 1: the left central noun */}
        <ExplainAnchor
          selector="central-noun"
          index={1}
          pin={{ x: leftCx, y: cy - rCentral - 12 }}
          rect={clampRect({
            x: leftCx - rCentral,
            y: cy - rCentral,
            width: rCentral * 2,
            height: rCentral * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: a shared attribute — "furry" */}
        <ExplainAnchor
          selector="shared-attribute"
          index={2}
          pin={{ x: furry.x, y: furry.y - rSat - 12 }}
          rect={clampRect({
            x: furry.x - rSat,
            y: furry.y - rSat,
            width: rSat * 2,
            height: rSat * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: a unique attribute — "independent" on the Cat side */}
        <ExplainAnchor
          selector="unique-attribute"
          index={3}
          pin={{ x: independent.x, y: independent.y - rSat - 12 }}
          rect={clampRect({
            x: independent.x - rSat,
            y: independent.y - rSat,
            width: rSat * 2,
            height: rSat * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: the double-linked edge — rect covers the shared column */}
        <ExplainAnchor
          selector="double-link"
          index={4}
          pin={{ x: midX, y: Math.max(8, cy - sharedOffsetMax - 12) }}
          rect={clampRect({
            x: leftCx + rCentral,
            y: cy - sharedOffsetMax - rSat,
            width: rightCx - leftCx - 2 * rCentral,
            height: sharedOffsetMax * 2 + rSat * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: the overall compare-and-contrast layout — whole plot */}
        <ExplainAnchor
          selector="compare-contrast-layout"
          index={5}
          pin={{ x: iw - 14, y: 14 }}
          rect={clampRect({ x: 0, y: 0, width: iw, height: ih })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
