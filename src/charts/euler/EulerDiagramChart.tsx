"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

/**
 * Euler diagram of Mammals, Pets, Reptiles, with Dogs contained in Mammals.
 *
 * Unlike a Venn diagram, an Euler diagram shows only the intersections that
 * actually exist in the data. Mammals and Reptiles are disjoint (the circles
 * never touch), Pets overlaps both (most pets are mammals, some are reptiles),
 * and Dogs is a proper subset of Mammals (fully inside, no overlap with
 * Pets-only or Reptiles).
 */
export function EulerDiagramChart({ width, height }: Props) {
  const margin = { top: 24, right: 20, bottom: 24, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout: Mammals sits on the left, Reptiles on the right, Pets cuts across
  // the middle with overlap into both. Tuned so Mammals ∩ Reptiles stays
  // visibly empty (the visual enforcement of the disjoint relationship).
  const cx = iw / 2;
  const cy = ih / 2;

  // Radii scaled to the plot area so the diagram grows with the tile.
  const scale = Math.min(iw, ih) / 180;
  const rM = 56 * scale; // Mammals (biggest)
  const rR = 36 * scale; // Reptiles
  const rP = 46 * scale; // Pets
  const rD = 18 * scale; // Dogs (sub-set of Mammals)

  // Mammals left of centre, Reptiles right of centre with a visible gap
  // between them on the x-axis (enforces Mammals ∩ Reptiles = ∅).
  const mX = cx - rM * 0.55;
  const mY = cy;
  const rX = cx + rR * 1.25;
  const rY = cy;

  // Pets straddles both — overlaps Mammals heavily, Reptiles slightly.
  const pX = cx + rP * 0.05;
  const pY = cy + rP * 0.35;

  // Dogs sits entirely inside Mammals, offset up-left where Pets does not reach.
  const dX = mX - rM * 0.35;
  const dY = mY - rM * 0.45;

  // Clamp helper for anchor rects.
  const clamp = (
    rx: number,
    ry: number,
    rw: number,
    rh: number,
  ): { x: number; y: number; width: number; height: number } => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return {
      x: x0,
      y: y0,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
    };
  };

  // "Missing intersection" callout — the Venn region an Euler refuses to draw.
  // Positioned in the gap between Mammals and Reptiles along the x-axis.
  const gapX = (mX + rM + (rX - rR)) / 2;
  const gapY = cy - rM * 0.85;

  return (
    <svg width={width} height={height} role="img" aria-label="Euler diagram">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Mammals */}
          <circle
            cx={mX}
            cy={mY}
            r={rM}
            fill="var(--color-ink)"
            fillOpacity={0.14}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          {/* Reptiles — disjoint from Mammals */}
          <circle
            cx={rX}
            cy={rY}
            r={rR}
            fill="var(--color-ink)"
            fillOpacity={0.14}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          {/* Pets — overlaps Mammals heavily, Reptiles slightly */}
          <circle
            cx={pX}
            cy={pY}
            r={rP}
            fill="var(--color-ink)"
            fillOpacity={0.14}
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          {/* Dogs — proper subset of Mammals */}
          <circle
            cx={dX}
            cy={dY}
            r={rD}
            fill="var(--color-ink)"
            fillOpacity={0.22}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />

          {/* Set labels */}
          <text
            x={mX - rM * 0.75}
            y={mY - rM * 0.55}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            MAMMALS
          </text>
          <text
            x={rX + rR * 0.1}
            y={rY - rR * 0.75}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            REPTILES
          </text>
          <text
            x={pX - rP * 0.3}
            y={pY + rP * 0.95}
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            PETS
          </text>
          <text
            x={dX}
            y={dY + 3}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
            textAnchor="middle"
            dominantBaseline="central"
          >
            DOGS
          </text>

          {/* Missing-intersection callout — lives in the empty gap */}
          <text
            x={gapX}
            y={gapY}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            ∅
          </text>
        </g>

        {/* 1. Disjoint region — the empty gap between Mammals and Reptiles */}
        <ExplainAnchor
          selector="disjoint"
          index={1}
          pin={{ x: gapX, y: gapY - 14 }}
          rect={clamp(mX + rM - 4, cy - rM * 0.6, rX - rR - (mX + rM) + 8, rM * 1.2)}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Overlap — the Pets ∩ Mammals region */}
        <ExplainAnchor
          selector="overlap"
          index={2}
          pin={{ x: pX - rP * 0.75, y: pY - rP * 0.15 }}
          rect={clamp(
            Math.max(mX - rM * 0.2, pX - rP * 0.95),
            Math.max(mY - rM * 0.2, pY - rP * 0.55),
            Math.min(mX + rM, pX + rP * 0.2) - Math.max(mX - rM * 0.2, pX - rP * 0.95),
            rP * 0.9,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Containment — Dogs fully inside Mammals */}
        <ExplainAnchor
          selector="containment"
          index={3}
          pin={{ x: dX - rD - 10, y: dY - rD - 4 }}
          rect={clamp(dX - rD - 2, dY - rD - 2, rD * 2 + 4, rD * 2 + 4)}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Set labels — concept: every shape carries a named set */}
        <ExplainAnchor
          selector="set-labels"
          index={4}
          pin={{ x: rX + rR * 0.6, y: rY + rR * 0.9 }}
          rect={clamp(rX - rR * 0.4, rY - rR - 2, rR * 1.6, 14)}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Missing intersection — the thing an Euler refuses to draw */}
        <ExplainAnchor
          selector="missing-intersection"
          index={5}
          pin={{ x: cx, y: gapY + 18 }}
          rect={clamp(gapX - 24, gapY - 8, 48, 20)}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Euler vs Venn — anchor on the outermost Pets-only sliver below */}
        <ExplainAnchor
          selector="euler-vs-venn"
          index={6}
          pin={{ x: pX + rP * 0.15, y: pY + rP * 0.6 }}
          rect={clamp(pX - rP * 0.25, pY + rP * 0.2, rP * 0.6, rP * 0.7)}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
