"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Bhabha scattering (t-channel): e⁻ + e⁺ → γ* → e⁻ + e⁺
// Time flows left to right; space is vertical.
// Layout: two input fermion lines on the left meet vertex V1,
// photon propagator connects V1 to V2,
// two output fermion lines exit V2 to the right.

interface Props {
  width: number;
  height: number;
}

// Build a sinusoidal wavy path between two points.
// The wave runs along the line's length, with amplitude perpendicular to it.
function wavyPath(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  wavelength: number,
  amplitude: number
): string {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  // Unit tangent
  const tx = dx / length;
  const ty = dy / length;
  // Unit normal (perpendicular, rotated 90° CCW)
  const nx = -ty;
  const ny = tx;

  const segments = Math.max(2, Math.round(length / wavelength));

  // Build path with quadratic bezier segments approximating a sine wave
  let d = `M ${x1} ${y1}`;
  for (let i = 0; i < segments; i++) {
    const t1 = (i + 0.5) / segments;
    const t2 = (i + 1) / segments;

    const bx = x1 + t1 * dx + nx * amplitude * (i % 2 === 0 ? 1 : -1);
    const by = y1 + t1 * dy + ny * amplitude * (i % 2 === 0 ? 1 : -1);
    const ex = x1 + t2 * dx;
    const ey = y1 + t2 * dy;

    d += ` Q ${bx} ${by} ${ex} ${ey}`;
  }
  return d;
}

// Arrow polygon tip at (tipX, tipY) with shaft direction (dx, dy)
function arrowTip(
  tipX: number,
  tipY: number,
  dx: number,
  dy: number,
  size = 7
): string {
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const baseX = tipX - ux * size;
  const baseY = tipY - uy * size;
  const nx = -uy;
  const ny = ux;
  const half = size * 0.45;
  return `${tipX},${tipY} ${baseX + nx * half},${baseY + ny * half} ${baseX - nx * half},${baseY - ny * half}`;
}

export function FeynmanDiagram({ width, height }: Props) {
  const margin = { top: 36, right: 40, bottom: 48, left: 40 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Vertices placed at 35% and 65% of the plot width, vertically centred
  const v1x = iw * 0.35;
  const v2x = iw * 0.65;
  const vy = ih * 0.5;

  // Fermion line vertical spacing
  const spacing = ih * 0.28;

  // Incoming e⁻: top-left to V1 (arrow rightward)
  const inEleX1 = 0;
  const inEleY1 = vy - spacing;
  const inEleX2 = v1x;
  const inEleY2 = vy - spacing;

  // Incoming e⁺: bottom-left to V1 (arrow leftward by convention — antiparticle)
  const inPosX1 = v1x;
  const inPosY1 = vy + spacing;
  const inPosX2 = 0;
  const inPosY2 = vy + spacing;

  // Outgoing e⁻: V2 to top-right (arrow rightward)
  const outEleX1 = v2x;
  const outEleY1 = vy - spacing;
  const outEleX2 = iw;
  const outEleY2 = vy - spacing;

  // Outgoing e⁺: V2 to bottom-right (arrow leftward by convention)
  const outPosX1 = iw;
  const outPosY1 = vy + spacing;
  const outPosX2 = v2x;
  const outPosY2 = vy + spacing;

  // Photon wavy line from V1 to V2 — horizontal
  const photonWavelength = 20;
  const photonAmplitude = 6;
  const photonPath = wavyPath(v1x, vy, v2x, vy, photonWavelength, photonAmplitude);

  // Arrowhead positions for fermion lines
  // In-electron: midpoint arrow
  const inEleMidX = (inEleX1 + inEleX2) / 2;
  const inEleMidY = inEleY1;
  // In-positron: midpoint arrow (leftward — arrow direction is opposite to travel)
  const inPosMidX = (inPosX1 + inPosX2) / 2;
  const inPosMidY = inPosY1;
  // Out-electron: midpoint arrow
  const outEleMidX = (outEleX1 + outEleX2) / 2;
  const outEleMidY = outEleY1;
  // Out-positron: midpoint arrow (leftward)
  const outPosMidX = (outPosX1 + outPosX2) / 2;
  const outPosMidY = outPosY1;

  // Shorten arrow a bit so the polygon tip is inside the line, not off it
  const arrowOffset = 1;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Feynman diagram: Bhabha scattering e⁻ + e⁺ → γ* → e⁻ + e⁺ via photon propagator"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Time axis label at bottom */}
        <g data-data-layer="true">
          <line
            x1={0}
            y1={ih + 28}
            x2={iw}
            y2={ih + 28}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            markerEnd="url(#time-arrow)"
          />
          <text
            x={iw / 2}
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            TIME →
          </text>
        </g>

        {/* Main data layer: fermion lines and photon */}
        <g data-data-layer="true">
          {/* Incoming electron line */}
          <line
            x1={inEleX1}
            y1={inEleY1}
            x2={inEleX2}
            y2={inEleY2}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          {/* Arrow mid-shaft: direction is rightward (+x) */}
          <polygon
            points={arrowTip(inEleMidX + arrowOffset, inEleMidY, 1, 0)}
            fill="var(--color-ink)"
          />

          {/* Incoming positron line */}
          <line
            x1={inPosX2}
            y1={inPosY2}
            x2={inPosX1}
            y2={inPosY1}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          {/* Arrow mid-shaft: positron arrow direction is leftward (−x) */}
          <polygon
            points={arrowTip(inPosMidX - arrowOffset, inPosMidY, -1, 0)}
            fill="var(--color-ink)"
          />

          {/* Outgoing electron line */}
          <line
            x1={outEleX1}
            y1={outEleY1}
            x2={outEleX2}
            y2={outEleY2}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          {/* Arrow mid-shaft: rightward */}
          <polygon
            points={arrowTip(outEleMidX + arrowOffset, outEleMidY, 1, 0)}
            fill="var(--color-ink)"
          />

          {/* Outgoing positron line */}
          <line
            x1={outPosX2}
            y1={outPosY2}
            x2={outPosX1}
            y2={outPosY1}
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          {/* Arrow mid-shaft: positron arrow direction leftward */}
          <polygon
            points={arrowTip(outPosMidX - arrowOffset, outPosMidY, -1, 0)}
            fill="var(--color-ink)"
          />

          {/* Photon propagator: wavy line */}
          <path
            d={photonPath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />

          {/* Photon label */}
          <text
            x={(v1x + v2x) / 2}
            y={vy - photonAmplitude - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9.5}
            fill="var(--color-ink-soft)"
          >
            γ*
          </text>

          {/* Vertex dots */}
          <circle cx={v1x} cy={vy} r={3.5} fill="var(--color-ink)" />
          <circle cx={v2x} cy={vy} r={3.5} fill="var(--color-ink)" />

          {/* Vertex coupling labels */}
          <text
            x={v1x}
            y={vy + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            ∝ e
          </text>
          <text
            x={v2x}
            y={vy + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            ∝ e
          </text>

          {/* Particle labels at left edge */}
          <text
            x={4}
            y={inEleY1 - 6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            e⁻
          </text>
          <text
            x={4}
            y={inPosY1 + 14}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            e⁺
          </text>

          {/* Particle labels at right edge */}
          <text
            x={iw - 18}
            y={outEleY2 - 6}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            e⁻
          </text>
          <text
            x={iw - 18}
            y={outPosY1 + 14}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            e⁺
          </text>
        </g>

        {/* ---- Anchors ---- */}

        {/* 1. Incoming electron (fermion line with rightward arrow) */}
        <ExplainAnchor
          selector="incoming-fermion"
          index={1}
          pin={{ x: inEleMidX, y: inEleY1 - 16 }}
          rect={{
            x: Math.max(0, inEleX1),
            y: Math.max(0, inEleY1 - 8),
            width: Math.min(iw, inEleX2 - inEleX1),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Incoming positron (antifermion: reversed arrow) */}
        <ExplainAnchor
          selector="incoming-antifermion"
          index={2}
          pin={{ x: inPosMidX, y: inPosY1 + 16 }}
          rect={{
            x: Math.max(0, inPosX2),
            y: Math.max(0, inPosY2 - 8),
            width: Math.min(iw, inPosX1 - inPosX2),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Vertex (coupling factor) */}
        <ExplainAnchor
          selector="vertex"
          index={3}
          pin={{ x: v1x - 16, y: vy - 14 }}
          rect={{
            x: Math.max(0, v1x - 10),
            y: Math.max(0, vy - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Photon propagator */}
        <ExplainAnchor
          selector="photon-propagator"
          index={4}
          pin={{ x: (v1x + v2x) / 2, y: vy - photonAmplitude - 18 }}
          rect={{
            x: Math.max(0, v1x),
            y: Math.max(0, vy - photonAmplitude - 4),
            width: Math.min(iw - v1x, v2x - v1x),
            height: photonAmplitude * 2 + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Outgoing fermions */}
        <ExplainAnchor
          selector="outgoing-fermions"
          index={5}
          pin={{ x: outEleMidX, y: outEleY2 - 16 }}
          rect={{
            x: Math.max(0, outEleX1),
            y: Math.max(0, outEleY1 - 8),
            width: Math.min(iw - outEleX1, outEleX2 - outEleX1),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Time-direction convention */}
        <ExplainAnchor
          selector="time-direction"
          index={6}
          pin={{ x: iw * 0.7, y: ih + 22 }}
          rect={{
            x: 0,
            y: Math.max(0, ih + 18),
            width: Math.min(iw, iw),
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
