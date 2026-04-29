"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Sample {
  id: string;
  sand: number;
  silt: number;
  clay: number;
}

// 15 soil samples. Each point has three values summing to 1 — clustered in
// "Loam" territory (balanced) with a few outliers pulled toward the Sand or
// Clay corners. Hand-placed, not random, so the cluster reads clearly.
const SAMPLES: ReadonlyArray<Sample> = [
  { id: "s01", sand: 0.40, silt: 0.40, clay: 0.20 }, // Loam centre
  { id: "s02", sand: 0.38, silt: 0.42, clay: 0.20 },
  { id: "s03", sand: 0.42, silt: 0.38, clay: 0.20 },
  { id: "s04", sand: 0.36, silt: 0.44, clay: 0.20 },
  { id: "s05", sand: 0.44, silt: 0.36, clay: 0.20 },
  { id: "s06", sand: 0.40, silt: 0.35, clay: 0.25 },
  { id: "s07", sand: 0.35, silt: 0.40, clay: 0.25 },
  { id: "s08", sand: 0.45, silt: 0.40, clay: 0.15 },
  { id: "s09", sand: 0.40, silt: 0.45, clay: 0.15 },
  { id: "s10", sand: 0.33, silt: 0.45, clay: 0.22 }, // silty loam
  { id: "s11", sand: 0.48, silt: 0.35, clay: 0.17 }, // sandy loam
  { id: "s12", sand: 0.72, silt: 0.18, clay: 0.10 }, // Sand-corner outlier
  { id: "s13", sand: 0.78, silt: 0.15, clay: 0.07 }, // Sand-corner outlier (further)
  { id: "s14", sand: 0.22, silt: 0.26, clay: 0.52 }, // Clay-corner outlier
  { id: "s15", sand: 0.28, silt: 0.30, clay: 0.42 }, // clay-loam, drifting toward clay
];

interface Props {
  width: number;
  height: number;
}

export function TernaryChart({ width, height }: Props) {
  const margin = { top: 28, right: 28, bottom: 36, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Fit the largest equilateral triangle into the inner rect.
  // The unit triangle has width 1 and height sqrt(3)/2 ~= 0.866.
  const sqrt3Over2 = Math.sqrt(3) / 2;
  const scale = Math.max(0, Math.min(iw, ih / sqrt3Over2));
  const triW = scale;
  const triH = scale * sqrt3Over2;
  // Centre the triangle inside the inner rect.
  const ox = (iw - triW) / 2;
  const oy = (ih - triH) / 2;

  // Barycentric -> pixel. `sand` is the bottom-left vertex, `silt` the
  // bottom-right, `clay` the top. x = silt + clay/2; y = clay * sqrt(3)/2.
  // Then scale to triW / triH and flip y so clay=1 is at the top.
  const tri = (sand: number, silt: number, clay: number): { x: number; y: number } => {
    const x = silt + clay / 2;
    const y = clay * sqrt3Over2;
    return {
      x: ox + x * triW,
      y: oy + triH - y * scale,
    };
  };

  const vSand = tri(1, 0, 0);
  const vSilt = tri(0, 1, 0);
  const vClay = tri(0, 0, 1);

  const trianglePoints = `${vSand.x},${vSand.y} ${vSilt.x},${vSilt.y} ${vClay.x},${vClay.y}`;

  // Gridlines at 25%, 50%, 75% parallel to each edge.
  // For each vertex, draw lines of constant-component at 0.25/0.5/0.75.
  // Constant clay: endpoints are tri(1-c, 0, c) and tri(0, 1-c, c).
  // Constant sand: endpoints are tri(s, 1-s, 0) and tri(s, 0, 1-s).
  // Constant silt: endpoints are tri(1-t, t, 0) and tri(0, t, 1-t).
  const gridLevels = [0.25, 0.5, 0.75];

  const outlier = SAMPLES[12]; // s13 — deepest into the Sand corner.
  const loam = SAMPLES[0]; // s01 — the Loam-centre point.

  // Anchor for a single "percent-isoline": the 50% clay line (horizontal).
  const iso50ClayA = tri(0.5, 0, 0.5);
  const iso50ClayB = tri(0, 0.5, 0.5);

  return (
    <svg width={width} height={height} role="img" aria-label="Ternary plot">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Triangle boundary */}
          <polygon
            points={trianglePoints}
            fill="var(--color-ink)"
            fillOpacity={0.02}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />

          {/* Internal gridlines — three families of parallels at 25/50/75% */}
          {gridLevels.flatMap((v) => {
            const a1 = tri(1 - v, 0, v);
            const a2 = tri(0, 1 - v, v);
            const b1 = tri(v, 1 - v, 0);
            const b2 = tri(v, 0, 1 - v);
            const c1 = tri(1 - v, v, 0);
            const c2 = tri(0, v, 1 - v);
            return [
              <line
                key={`clay-${v}`}
                x1={a1.x}
                y1={a1.y}
                x2={a2.x}
                y2={a2.y}
                stroke="var(--color-hairline)"
                strokeDasharray={v === 0.5 ? undefined : "2 3"}
              />,
              <line
                key={`sand-${v}`}
                x1={b1.x}
                y1={b1.y}
                x2={b2.x}
                y2={b2.y}
                stroke="var(--color-hairline)"
                strokeDasharray={v === 0.5 ? undefined : "2 3"}
              />,
              <line
                key={`silt-${v}`}
                x1={c1.x}
                y1={c1.y}
                x2={c2.x}
                y2={c2.y}
                stroke="var(--color-hairline)"
                strokeDasharray={v === 0.5 ? undefined : "2 3"}
              />,
            ];
          })}

          {/* Data points */}
          {SAMPLES.map((s) => {
            const p = tri(s.sand, s.silt, s.clay);
            return (
              <circle
                key={s.id}
                cx={p.x}
                cy={p.y}
                r={3}
                fill="var(--color-ink)"
              />
            );
          })}

          {/* Vertex labels */}
          <text
            x={vSand.x - 6}
            y={vSand.y + 14}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={500}
          >
            SAND
          </text>
          <text
            x={vSilt.x + 6}
            y={vSilt.y + 14}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={500}
          >
            SILT
          </text>
          <text
            x={vClay.x}
            y={vClay.y - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fill="var(--color-ink)"
            fontWeight={500}
          >
            CLAY
          </text>
        </g>

        {/* Anchor 1: vertex label (Clay) — representative of all three */}
        <ExplainAnchor
          selector="vertex-label"
          index={1}
          pin={{ x: vClay.x + 20, y: vClay.y - 4 }}
          rect={{
            x: Math.max(0, vClay.x - 24),
            y: Math.max(0, vClay.y - 18),
            width: 48,
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: a single point inside (Loam sample) */}
        <ExplainAnchor
          selector="loam-point"
          index={2}
          pin={{ x: tri(loam.sand, loam.silt, loam.clay).x + 14, y: tri(loam.sand, loam.silt, loam.clay).y - 14 }}
          rect={{
            x: Math.max(0, tri(loam.sand, loam.silt, loam.clay).x - 7),
            y: Math.max(0, tri(loam.sand, loam.silt, loam.clay).y - 7),
            width: 14,
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: a gridline (the 50% clay isoline — horizontal across the middle) */}
        <ExplainAnchor
          selector="percent-isoline"
          index={3}
          pin={{ x: (iso50ClayA.x + iso50ClayB.x) / 2, y: (iso50ClayA.y + iso50ClayB.y) / 2 - 12 }}
          rect={{
            x: Math.min(iso50ClayA.x, iso50ClayB.x) - 4,
            y: Math.min(iso50ClayA.y, iso50ClayB.y) - 4,
            width: Math.abs(iso50ClayB.x - iso50ClayA.x) + 8,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: outlier near the Sand corner */}
        <ExplainAnchor
          selector="corner-outlier"
          index={4}
          pin={{
            x: tri(outlier.sand, outlier.silt, outlier.clay).x - 14,
            y: tri(outlier.sand, outlier.silt, outlier.clay).y - 16,
          }}
          rect={{
            x: Math.max(0, tri(outlier.sand, outlier.silt, outlier.clay).x - 7),
            y: Math.max(0, tri(outlier.sand, outlier.silt, outlier.clay).y - 7),
            width: 14,
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: the triangle boundary */}
        <ExplainAnchor
          selector="triangle-boundary"
          index={5}
          pin={{ x: (vSand.x + vSilt.x) / 2, y: vSand.y + 4 }}
          rect={{
            x: Math.max(0, vSand.x - 4),
            y: Math.max(0, vSand.y - 4),
            width: Math.min(iw, vSilt.x - vSand.x + 8),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
