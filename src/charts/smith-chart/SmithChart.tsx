"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Constant-resistance circles (R values). Each circle passes through (1, 0)
// on the Γ-plane. Centre (R/(1+R), 0), radius 1/(1+R).
const R_VALUES: ReadonlyArray<{ R: number; label: string }> = [
  { R: 0, label: "R=0" },
  { R: 0.5, label: "0.5" },
  { R: 1, label: "1" },
  { R: 2, label: "2" },
  { R: 5, label: "5" },
];

// Constant-reactance arcs (X values). Each is a circle centred at (1, 1/X)
// with radius |1/X|. Must be clipped to the unit disc.
const X_VALUES: ReadonlyArray<{ X: number; label: string }> = [
  { X: 0.5, label: "+0.5" },
  { X: 1, label: "+1" },
  { X: 2, label: "+2" },
  { X: 5, label: "+5" },
  { X: -0.5, label: "-0.5" },
  { X: -1, label: "-1" },
  { X: -2, label: "-2" },
  { X: -5, label: "-5" },
];

// Example impedance Z = 0.5 + 0.5j.
// Γ = (Z − 1) / (Z + 1) = (−0.5 + 0.5j) / (1.5 + 0.5j)
//   · multiply top and bottom by conj(1.5 − 0.5j):
//     num = (−0.5 + 0.5j)(1.5 − 0.5j) = −0.75 + 0.25j + 0.75j + 0.25 = −0.5 + j
//     den = 1.5² + 0.5² = 2.5
//   ⇒ Γ = (−0.2, 0.4)
const EXAMPLE_GAMMA: readonly [number, number] = [-0.2, 0.4];
const EXAMPLE_LABEL = "Z = 0.5 + 0.5j";

export function SmithChart({ width, height }: Props) {
  // Give the chart square-ish space with room for axis markers + a caption.
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  // Reserve some padding for labels around the rim.
  const R = Math.max(0, Math.min(iw, ih) / 2 - 14);

  // Map the (u, v) reflection-coefficient plane (|Γ| ≤ 1) to screen pixels.
  // u → x (rightward), v → y (upward, but SVG y is downward so flip).
  const toPx = (u: number, v: number) => ({
    x: cx + u * R,
    y: cy - v * R,
  });

  // Generate sample points along a constant-R circle, clipped to the unit
  // disc. Since every constant-R circle is fully inside |Γ| ≤ 1 (or tangent),
  // no clipping is actually needed — sample the full circle.
  const constantRPoints = (RR: number): string => {
    const centreU = RR / (1 + RR);
    const radiusU = 1 / (1 + RR);
    const pts: string[] = [];
    const N = 128;
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const u = centreU + radiusU * Math.cos(t);
      const v = radiusU * Math.sin(t);
      const p = toPx(u, v);
      pts.push(`${p.x.toFixed(2)},${p.y.toFixed(2)}`);
    }
    return pts.join(" ");
  };

  // Constant-X arc: circle centre (1, 1/X), radius |1/X|.
  // Clip to |Γ| ≤ 1 by sampling densely and keeping points inside the disc.
  const constantXPath = (X: number): string => {
    const centreU = 1;
    const centreV = 1 / X;
    const radius = Math.abs(1 / X);
    const N = 256;
    const pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i <= N; i++) {
      const t = (i / N) * 2 * Math.PI;
      const u = centreU + radius * Math.cos(t);
      const v = centreV + radius * Math.sin(t);
      if (u * u + v * v <= 1.0001) {
        pts.push(toPx(u, v));
      }
    }
    if (pts.length === 0) return "";
    // Break into continuous runs — but because constant-X arcs intersect the
    // unit disc in one connected arc, we can just connect them.
    return pts.map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  };

  // Geometry for key anchors.
  const unitBoundary = toPx(1, 0); // right edge point (Γ = 1) = open circuit
  const centrePoint = toPx(0, 0); // Γ = 0 = matched load
  const examplePt = toPx(EXAMPLE_GAMMA[0], EXAMPLE_GAMMA[1]);

  // R=1 circle — centre (0.5, 0), radius 0.5; pass marker at top of circle.
  const rOneTop = toPx(0.5, 0.5);
  // X=+1 arc — circle centre (1, 1), radius 1; pick a visible point on arc.
  // Parameterise with u = 1 + cos(t), v = 1 + sin(t). For a nice hover spot,
  // the point where the arc crosses the real axis toward the centre: u = 0,
  // v = 1 (t = π) → (0, 1). Label the arc near there.
  const xPlusOneLabel = toPx(0, 1);

  // Clamp rect helper for interior-plot anchors.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => ({
    x: Math.max(0, Math.min(iw, r.x)),
    y: Math.max(0, Math.min(ih, r.y)),
    width: Math.max(0, Math.min(iw - Math.max(0, Math.min(iw, r.x)), r.width)),
    height: Math.max(0, Math.min(ih - Math.max(0, Math.min(ih, r.y)), r.height)),
  });

  // Ensure a unique clip id per instance wouldn't matter here since we render
  // once; static id is fine.
  const CLIP_ID = "smith-chart-disc-clip";

  return (
    <svg width={width} height={height} role="img" aria-label="Smith chart">
      <defs>
        <clipPath id={CLIP_ID}>
          <circle cx={cx} cy={cy} r={R} />
        </clipPath>
      </defs>
      <Group left={margin.left} top={margin.top}>
        {/* Outer disc fill */}
        <circle cx={cx} cy={cy} r={R} fill="var(--color-surface)" />

        <g data-data-layer="true">
          {/* Constant-resistance circles (clipped to disc) */}
          <g clipPath={`url(#${CLIP_ID})`}>
            {R_VALUES.map((r) => (
              <polyline
                key={`r-${r.R}`}
                points={constantRPoints(r.R)}
                fill="none"
                stroke="var(--color-hairline)"
                strokeWidth={r.R === 1 ? 1.1 : 0.85}
              />
            ))}

            {/* Constant-reactance arcs, clipped to disc */}
            {X_VALUES.map((x) => {
              const pts = constantXPath(x.X);
              if (!pts) return null;
              return (
                <polyline
                  key={`x-${x.X}`}
                  points={pts}
                  fill="none"
                  stroke="var(--color-hairline)"
                  strokeWidth={Math.abs(x.X) === 1 ? 1.1 : 0.85}
                />
              );
            })}

            {/* Horizontal real axis (pure-resistance line, X=0) */}
            <line
              x1={cx - R}
              y1={cy}
              x2={cx + R}
              y2={cy}
              stroke="var(--color-hairline)"
              strokeWidth={1}
            />
          </g>

          {/* Unit-circle boundary */}
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />

          {/* Matched-load dot at centre (Γ = 0) */}
          <circle cx={cx} cy={cy} r={2.2} fill="var(--color-ink)" />

          {/* Open-circuit dot at (1, 0) */}
          <circle
            cx={unitBoundary.x}
            cy={unitBoundary.y}
            r={2.6}
            fill="var(--color-ink)"
          />

          {/* Example impedance marker */}
          <circle
            cx={examplePt.x}
            cy={examplePt.y}
            r={3.4}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.8}
          />
          <text
            x={examplePt.x - 8}
            y={examplePt.y - 10}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {EXAMPLE_LABEL}
          </text>
        </g>

        {/* Axis markers (outside the disc) */}
        <g data-data-layer="true">
          <text
            x={cx - R - 6}
            y={cy + 3}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            Γ=−1
          </text>
          <text
            x={cx + R + 6}
            y={cy + 3}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            Γ=+1
          </text>
          <text
            x={cx}
            y={cy - R - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            +jX
          </text>
          <text
            x={cx}
            y={cy + R + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-soft)"
          >
            −jX
          </text>
        </g>

        {/* 1. Unit-circle boundary — the |Γ| = 1 edge */}
        <ExplainAnchor
          selector="unit-circle"
          index={1}
          pin={{ x: cx - R * 0.71 - 14, y: cy - R * 0.71 - 6 }}
          rect={clamp({
            x: cx - R - 4,
            y: cy - R - 4,
            width: R * 2 + 8,
            height: 8,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Constant-resistance circle (R = 1) */}
        <ExplainAnchor
          selector="resistance-circle"
          index={2}
          pin={{ x: rOneTop.x + 10, y: rOneTop.y - 12 }}
          rect={clamp({
            x: rOneTop.x - 10,
            y: rOneTop.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Constant-reactance arc (X = +1) */}
        <ExplainAnchor
          selector="reactance-arc"
          index={3}
          pin={{ x: xPlusOneLabel.x - 14, y: xPlusOneLabel.y - 14 }}
          rect={clamp({
            x: xPlusOneLabel.x - 10,
            y: xPlusOneLabel.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Centre — matched load (Γ = 0) */}
        <ExplainAnchor
          selector="matched-centre"
          index={4}
          pin={{ x: centrePoint.x + 18, y: centrePoint.y - 14 }}
          rect={clamp({
            x: centrePoint.x - 10,
            y: centrePoint.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Open-circuit point — right edge (Γ = 1) */}
        <ExplainAnchor
          selector="open-circuit"
          index={5}
          pin={{ x: unitBoundary.x - 18, y: unitBoundary.y + 16 }}
          rect={clamp({
            x: unitBoundary.x - 10,
            y: unitBoundary.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. The plotted example impedance */}
        <ExplainAnchor
          selector="example-impedance"
          index={6}
          pin={{ x: examplePt.x + 18, y: examplePt.y + 14 }}
          rect={clamp({
            x: examplePt.x - 10,
            y: examplePt.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Caption below chart */}
        <text
          x={iw / 2}
          y={ih + 32}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          REFLECTION COEFFICIENT Γ (|Γ| ≤ 1)
        </text>
      </Group>
    </svg>
  );
}
