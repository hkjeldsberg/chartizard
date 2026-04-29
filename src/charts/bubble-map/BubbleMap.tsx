"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Hyerle's Bubble Map (Thinking Maps, 1995). Exactly one noun at the centre
// surrounded by adjectives — one level deep, no grandchildren. The chart is
// flat by design; that flatness is what distinguishes it from a mind map.
const CENTRAL_NOUN = "Ocean";
const ATTRIBUTES: ReadonlyArray<string> = [
  "vast",
  "salty",
  "deep",
  "mysterious",
  "blue",
  "cold",
  "teeming",
];

interface Props {
  width: number;
  height: number;
}

export function BubbleMap({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;

  // Central bubble ~60px radius; satellites ~30-35px. The satellite ring
  // sits far enough out that the connecting lines read as lines, not as
  // overlaps between discs.
  const rCentral = Math.min(60, Math.min(iw, ih) * 0.18);
  const rSatellite = Math.min(34, Math.min(iw, ih) * 0.11);
  const ringRadius = Math.min(
    Math.min(iw, ih) * 0.42,
    rCentral + rSatellite + Math.min(iw, ih) * 0.14,
  );

  // Precompute satellite positions. Start at -PI/2 (top) and fan clockwise.
  const satellites = useMemo(() => {
    const n = ATTRIBUTES.length;
    return ATTRIBUTES.map((name, i) => {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / n;
      return {
        name,
        angle,
        x: cx + Math.cos(angle) * ringRadius,
        y: cy + Math.sin(angle) * ringRadius,
      };
    });
  }, [cx, cy, ringRadius]);

  // Trim each connecting line so it meets the circle edges instead of the
  // centres — makes the edges read cleanly at small sizes.
  function trimmedLine(
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

  // Named satellites for anchor copy stability.
  const vastSat = satellites.find((s) => s.name === "vast") ?? satellites[0];
  const saltySat = satellites.find((s) => s.name === "salty") ?? satellites[1];

  return (
    <svg width={width} height={height} role="img" aria-label="Bubble map">
      <Group left={margin.left} top={margin.top}>
        {/* Connecting lines — one straight line per satellite. */}
        <g data-data-layer="true">
          {satellites.map((s) => {
            const seg = trimmedLine(cx, cy, rCentral, s.x, s.y, rSatellite);
            return (
              <line
                key={`edge-${s.name}`}
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

        {/* Satellite bubbles + labels. */}
        <g data-data-layer="true">
          {satellites.map((s) => (
            <g key={`sat-${s.name}`}>
              <circle
                cx={s.x}
                cy={s.y}
                r={rSatellite}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
              <text
                x={s.x}
                y={s.y + 3}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {s.name}
              </text>
            </g>
          ))}
        </g>

        {/* Central bubble — drawn last so lines don't show through. */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={rCentral}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          <text
            x={cx}
            y={cy + 4}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={13}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {CENTRAL_NOUN.toUpperCase()}
          </text>
        </g>

        {/* Anchor 1: the central noun */}
        <ExplainAnchor
          selector="central-noun"
          index={1}
          pin={{ x: cx, y: cy - rCentral - 14 }}
          rect={clampRect({
            x: cx - rCentral,
            y: cy - rCentral,
            width: rCentral * 2,
            height: rCentral * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: a representative adjective bubble — "vast" */}
        <ExplainAnchor
          selector="adjective-bubble"
          index={2}
          pin={{ x: vastSat.x, y: vastSat.y - rSatellite - 12 }}
          rect={clampRect({
            x: vastSat.x - rSatellite,
            y: vastSat.y - rSatellite,
            width: rSatellite * 2,
            height: rSatellite * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: a connecting line — anchor the "salty" edge */}
        <ExplainAnchor
          selector="connector"
          index={3}
          pin={{
            x: (cx + saltySat.x) / 2 + 10,
            y: (cy + saltySat.y) / 2 - 10,
          }}
          rect={clampRect({
            x: Math.min(cx, saltySat.x) - 6,
            y: Math.min(cy, saltySat.y) - 6,
            width: Math.abs(saltySat.x - cx) + 12,
            height: Math.abs(saltySat.y - cy) + 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: the single-level rule — pin in a satellite-free spot */}
        <ExplainAnchor
          selector="single-level"
          index={4}
          pin={{ x: cx, y: cy }}
          rect={clampRect({
            x: cx - ringRadius - rSatellite,
            y: cy - ringRadius - rSatellite,
            width: (ringRadius + rSatellite) * 2,
            height: (ringRadius + rSatellite) * 2,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: radial arrangement — the outer ring as a whole */}
        <ExplainAnchor
          selector="radial-ring"
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
