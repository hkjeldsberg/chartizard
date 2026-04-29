"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Water sample data — 8 samples with cation and anion fractions (sum = 1).
// Fractions represent milliequivalent percentages of the dominant ions.
// Ca²⁺ + Mg²⁺ + (Na⁺+K⁺) = 1.0 (cations)
// HCO₃⁻ + SO₄²⁻ + Cl⁻ = 1.0 (anions)
// ---------------------------------------------------------------------------
interface WaterSample {
  id: string;
  label: string;
  // Cation fractions
  ca: number;  // Ca²⁺
  mg: number;  // Mg²⁺
  nak: number; // Na⁺+K⁺
  // Anion fractions
  hco3: number; // HCO₃⁻
  so4: number;  // SO₄²⁻
  cl: number;   // Cl⁻
}

const SAMPLES: ReadonlyArray<WaterSample> = [
  // Carbonate-rock groundwater — Ca²⁺ + HCO₃⁻ dominant
  { id: "s1", label: "Karst spring A",   ca: 0.72, mg: 0.18, nak: 0.10, hco3: 0.78, so4: 0.14, cl: 0.08 },
  { id: "s2", label: "Limestone well",   ca: 0.65, mg: 0.22, nak: 0.13, hco3: 0.70, so4: 0.18, cl: 0.12 },
  // Saline / marine influence — Na⁺+K⁺ + Cl⁻ dominant
  { id: "s3", label: "Coastal borehole", ca: 0.10, mg: 0.15, nak: 0.75, hco3: 0.05, so4: 0.10, cl: 0.85 },
  { id: "s4", label: "Marine seep",      ca: 0.08, mg: 0.18, nak: 0.74, hco3: 0.04, so4: 0.08, cl: 0.88 },
  // Mixed water
  { id: "s5", label: "Alluvial well",    ca: 0.45, mg: 0.30, nak: 0.25, hco3: 0.48, so4: 0.28, cl: 0.24 },
  { id: "s6", label: "River bank inf.",  ca: 0.38, mg: 0.32, nak: 0.30, hco3: 0.42, so4: 0.30, cl: 0.28 },
  { id: "s7", label: "Shallow aquifer",  ca: 0.40, mg: 0.20, nak: 0.40, hco3: 0.35, so4: 0.22, cl: 0.43 },
  { id: "s8", label: "Brackish mix",     ca: 0.25, mg: 0.20, nak: 0.55, hco3: 0.20, so4: 0.18, cl: 0.62 },
];

// Marker shapes per sample — distinct shapes so samples are trackable across panels
// without relying on colour alone.
type MarkerShape = "circle" | "square" | "triangle" | "diamond" | "cross" | "plus" | "hexagon" | "star";

const SHAPES: ReadonlyArray<MarkerShape> = [
  "circle", "square", "triangle", "diamond", "cross", "plus", "hexagon", "star",
];

// Muted fill colours drawn from the ink palette with opacity variation
const FILLS: ReadonlyArray<string> = [
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
];

const OPACITIES = [1, 0.85, 0.7, 0.55, 0.45, 0.38, 0.30, 0.22];

// ---------------------------------------------------------------------------
// Geometry helpers
// ---------------------------------------------------------------------------

// Barycentric → Cartesian for an equilateral triangle pointing UP (apex top).
// Corners: A = bottom-left, B = bottom-right, C = top.
// Standard ternary: x = b + c/2, y = c * sqrt(3)/2
// We flip y so C (top) maps to low pixel y.
function ternaryToXY(
  a: number, b: number, c: number,
  ox: number, oy: number, triW: number, triH: number,
): { x: number; y: number } {
  const xRel = b + c / 2;
  const yRel = c * Math.sqrt(3) / 2;
  return {
    x: ox + xRel * triW,
    y: oy + triH - yRel * triH / (Math.sqrt(3) / 2),
  };
}

// Project sample onto the diamond (rhombus). The diamond's x-axis encodes the
// anion triangle position (Cl side: Cl / (Cl + SO₄) = cl / (cl + so4)), and
// the y-axis encodes the cation triangle position (Na⁺+K⁺ fraction).
// Convention following Piper (1944): diamond x = Cl⁻ proportion on anion
// bottom-right axis; y = Na⁺+K⁺ proportion on cation bottom-right axis.
function sampleToDiamond(
  s: WaterSample,
  diamondCx: number, diamondCy: number,
  halfDiag: number,
): { x: number; y: number } {
  // Anion: x-projection = Cl⁻ fraction (bottom-right axis of anion triangle)
  const xFrac = s.cl;
  // Cation: y-projection = Na⁺+K⁺ fraction (bottom-right axis of cation triangle)
  const yFrac = s.nak;
  // In a Piper diamond: bottom = (xFrac=0,yFrac=0), right = xFrac=1,
  // left = yFrac=1, top = both=1. We map:
  // diamond px = diamondCx + (xFrac - yFrac) * halfDiag
  // diamond py = diamondCy - (xFrac + yFrac - 1) * halfDiag
  return {
    x: diamondCx + (xFrac - yFrac) * halfDiag,
    y: diamondCy - (xFrac + yFrac - 1) * halfDiag,
  };
}

// ---------------------------------------------------------------------------
// Render a marker shape at (cx, cy)
// ---------------------------------------------------------------------------
function Marker({
  cx, cy, shape, size, fill, opacity, strokeWidth,
}: {
  cx: number; cy: number; shape: MarkerShape;
  size: number; fill: string; opacity: number; strokeWidth?: number;
}) {
  const sw = strokeWidth ?? 1;
  const h = size / 2;
  switch (shape) {
    case "circle":
      return <circle cx={cx} cy={cy} r={h} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    case "square":
      return <rect x={cx - h} y={cy - h} width={size} height={size} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    case "triangle": {
      const pts = `${cx},${cy - h} ${cx - h},${cy + h * 0.7} ${cx + h},${cy + h * 0.7}`;
      return <polygon points={pts} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    }
    case "diamond": {
      const pts = `${cx},${cy - h} ${cx + h},${cy} ${cx},${cy + h} ${cx - h},${cy}`;
      return <polygon points={pts} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    }
    case "cross":
      return (
        <g stroke={fill} strokeOpacity={opacity} strokeWidth={sw + 0.5} strokeLinecap="round">
          <line x1={cx - h} y1={cy} x2={cx + h} y2={cy} />
          <line x1={cx} y1={cy - h} x2={cx} y2={cy + h} />
        </g>
      );
    case "plus":
      return (
        <g stroke={fill} strokeOpacity={opacity} strokeWidth={sw + 0.5} strokeLinecap="round">
          <line x1={cx - h * 0.8} y1={cy - h * 0.8} x2={cx + h * 0.8} y2={cy + h * 0.8} />
          <line x1={cx + h * 0.8} y1={cy - h * 0.8} x2={cx - h * 0.8} y2={cy + h * 0.8} />
        </g>
      );
    case "hexagon": {
      const pts = Array.from({ length: 6 }, (_, i) => {
        const angle = (i * Math.PI) / 3 - Math.PI / 6;
        return `${cx + h * Math.cos(angle)},${cy + h * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={pts} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    }
    case "star": {
      const outerR = h;
      const innerR = h * 0.45;
      const pts = Array.from({ length: 10 }, (_, i) => {
        const r = i % 2 === 0 ? outerR : innerR;
        const angle = (i * Math.PI) / 5 - Math.PI / 2;
        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`;
      }).join(" ");
      return <polygon points={pts} fill={fill} fillOpacity={opacity} stroke={fill} strokeWidth={sw} />;
    }
  }
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------
interface Props {
  width: number;
  height: number;
}

export function PiperDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 20, bottom: 32, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout: two ternary triangles side by side at bottom, diamond centred above.
  // Each triangle gets ~45% of iw; 10% gap between them.
  const gap = iw * 0.05;
  const triAreaW = (iw - gap) / 2;

  // Equilateral triangle: height = width * sqrt(3)/2
  const sqrt3Over2 = Math.sqrt(3) / 2;

  // Max triangle size that fits in available space.
  // Upper half for diamond, lower half for triangles.
  // The diamond needs vertical space equal to its diagonal = triW
  // Triangles need triH = triW * sqrt3Over2
  // We want triH + triW (diamond height ~ triW) + some gap to fit in ih.
  // Approximate: triW * (sqrt3Over2 + 1 + 0.1) <= ih
  // => triW <= ih / (sqrt3Over2 + 1.1)
  const maxTriWFromHeight = ih / (sqrt3Over2 + 1.15);
  const triW = Math.max(0, Math.min(triAreaW, maxTriWFromHeight));
  const triH = triW * sqrt3Over2;

  // Triangles sit at the bottom. Place them centred in their halves.
  const triBottomY = ih;
  const triTopY = triBottomY - triH;

  // Left triangle (cations): centred in left half of iw
  const leftTriCx = iw * 0.25;
  const leftOx = leftTriCx - triW / 2;
  const leftOy = triTopY;

  // Right triangle (anions): centred in right half of iw
  const rightTriCx = iw * 0.75;
  const rightOx = rightTriCx - triW / 2;
  const rightOy = triTopY;

  // Cation triangle vertices (apex = top = Mg²⁺, BL = Ca²⁺, BR = Na⁺+K⁺)
  const catBL = { x: leftOx, y: triBottomY };          // Ca²⁺
  const catBR = { x: leftOx + triW, y: triBottomY };   // Na⁺+K⁺
  const catTop = { x: leftOx + triW / 2, y: triTopY }; // Mg²⁺

  // Anion triangle vertices (apex = top = SO₄²⁻, BL = HCO₃⁻, BR = Cl⁻)
  const anBL = { x: rightOx, y: triBottomY };           // HCO₃⁻
  const anBR = { x: rightOx + triW, y: triBottomY };    // Cl⁻
  const anTop = { x: rightOx + triW / 2, y: triTopY };  // SO₄²⁻

  // Diamond (rhombus): centred above the two triangles.
  // The diamond's half-diagonal = triW / 2.
  const halfDiag = triW / 2;
  const diamondCx = iw / 2;
  // Top of diamond sits ~0.1*triW above triTopY
  const diamondTopY = triTopY - triW * 0.08;
  const diamondCy = diamondTopY + halfDiag; // Centre of diamond (vertical mid)

  const diamondTop    = { x: diamondCx, y: diamondCy - halfDiag };
  const diamondRight  = { x: diamondCx + halfDiag, y: diamondCy };
  const diamondBottom = { x: diamondCx, y: diamondCy + halfDiag };
  const diamondLeft   = { x: diamondCx - halfDiag, y: diamondCy };

  const diamondPoints = [
    `${diamondTop.x},${diamondTop.y}`,
    `${diamondRight.x},${diamondRight.y}`,
    `${diamondBottom.x},${diamondBottom.y}`,
    `${diamondLeft.x},${diamondLeft.y}`,
  ].join(" ");

  // Barycentric converter for cation triangle:
  // Ca²⁺ = A (BL), Na⁺+K⁺ = B (BR), Mg²⁺ = C (top)
  const catTri = (ca: number, nak: number, mg: number) =>
    ternaryToXY(ca, nak, mg, leftOx, leftOy, triW, triH);

  // Barycentric converter for anion triangle:
  // HCO₃⁻ = A (BL), Cl⁻ = B (BR), SO₄²⁻ = C (top)
  const anTri = (hco3: number, cl: number, so4: number) =>
    ternaryToXY(hco3, cl, so4, rightOx, rightOy, triW, triH);

  // Gridlines at 25%, 50%, 75%
  const gridLevels = [0.25, 0.5, 0.75];

  // Sample positions in the three panels
  const sampleCatPts = SAMPLES.map((s) => catTri(s.ca, s.nak, s.mg));
  const sampleAnPts  = SAMPLES.map((s) => anTri(s.hco3, s.cl, s.so4));
  const sampleDiamPts = SAMPLES.map((s) =>
    sampleToDiamond(s, diamondCx, diamondCy, halfDiag)
  );

  const markerSize = Math.max(5, Math.min(8, triW * 0.045));

  // Representative anchors
  // Anchor 1: cation triangle
  const catMidBottom = { x: (catBL.x + catBR.x) / 2, y: catBL.y };
  // Anchor 2: anion triangle
  const anMidBottom = { x: (anBL.x + anBR.x) / 2, y: anBL.y };
  // Anchor 3: diamond
  // Anchor 4: Ca²⁺ corner (bottom-left of cation triangle)
  // Anchor 5: Na⁺+K⁺ + Cl⁻ corner combination (s3 = coastal borehole, saline)
  const salineCat = sampleCatPts[2]; // s3 near Na⁺+K⁺
  // Anchor 6: a sample point projection (s1 karst spring)
  const s1cat = sampleCatPts[0];
  // Anchor 7: triangle-to-diamond projection geometry
  const s1diam = sampleDiamPts[0];

  return (
    <svg width={width} height={height} role="img" aria-label="Piper diagram — trilinear groundwater geochemistry plot">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* ----------------------------------------------------------------
              Cation triangle (lower-left)
          ----------------------------------------------------------------- */}
          <polygon
            points={`${catBL.x},${catBL.y} ${catBR.x},${catBR.y} ${catTop.x},${catTop.y}`}
            fill="var(--color-ink)"
            fillOpacity={0.02}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {/* Gridlines for cation triangle */}
          {gridLevels.flatMap((v) => {
            // Constant Ca (A): from tri(ca=v, nak=1-v-0, mg=0) but we need 3 fracs sum=1
            // Parallel to the BR-top edge at v fraction of A (Ca)
            const a1 = catTri(v, 1 - v, 0);
            const a2 = catTri(v, 0, 1 - v);
            const b1 = catTri(0, v, 1 - v);
            const b2 = catTri(1 - v, v, 0);
            const c1 = catTri(1 - v, 0, v);
            const c2 = catTri(0, 1 - v, v);
            return [
              <line key={`cat-a-${v}`} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
              <line key={`cat-b-${v}`} x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
              <line key={`cat-c-${v}`} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
            ];
          })}

          {/* ----------------------------------------------------------------
              Anion triangle (lower-right)
          ----------------------------------------------------------------- */}
          <polygon
            points={`${anBL.x},${anBL.y} ${anBR.x},${anBR.y} ${anTop.x},${anTop.y}`}
            fill="var(--color-ink)"
            fillOpacity={0.02}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {gridLevels.flatMap((v) => {
            const a1 = anTri(v, 1 - v, 0);
            const a2 = anTri(v, 0, 1 - v);
            const b1 = anTri(0, v, 1 - v);
            const b2 = anTri(1 - v, v, 0);
            const c1 = anTri(1 - v, 0, v);
            const c2 = anTri(0, 1 - v, v);
            return [
              <line key={`an-a-${v}`} x1={a1.x} y1={a1.y} x2={a2.x} y2={a2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
              <line key={`an-b-${v}`} x1={b1.x} y1={b1.y} x2={b2.x} y2={b2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
              <line key={`an-c-${v}`} x1={c1.x} y1={c1.y} x2={c2.x} y2={c2.y}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
            ];
          })}

          {/* ----------------------------------------------------------------
              Diamond (rhombus)
          ----------------------------------------------------------------- */}
          <polygon
            points={diamondPoints}
            fill="var(--color-ink)"
            fillOpacity={0.02}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {/* Diamond gridlines at 25/50/75% in both directions */}
          {gridLevels.flatMap((v) => {
            // Horizontal lines through the diamond at v from bottom corner
            const hLeftX  = diamondLeft.x  + v * (diamondTop.x   - diamondLeft.x);
            const hLeftY  = diamondLeft.y  + v * (diamondTop.y    - diamondLeft.y);
            const hRightX = diamondBottom.x + v * (diamondRight.x - diamondBottom.x);
            const hRightY = diamondBottom.y + v * (diamondRight.y - diamondBottom.y);
            // Vertical lines
            const vLeftX  = diamondBottom.x + v * (diamondLeft.x  - diamondBottom.x);
            const vLeftY  = diamondBottom.y + v * (diamondLeft.y  - diamondBottom.y);
            const vRightX = diamondBottom.x + v * (diamondRight.x - diamondBottom.x);
            const vRightY = diamondBottom.y + v * (diamondRight.y - diamondBottom.y);
            return [
              <line key={`dh-${v}`} x1={hLeftX} y1={hLeftY} x2={hRightX} y2={hRightY}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
              <line key={`dv-${v}`} x1={vLeftX} y1={vLeftY} x2={vRightX} y2={vRightY}
                stroke="var(--color-hairline)" strokeDasharray={v === 0.5 ? undefined : "2 3"} />,
            ];
          })}

          {/* ----------------------------------------------------------------
              Vertex / corner labels
          ----------------------------------------------------------------- */}
          {/* Cation triangle */}
          <text x={catBL.x - 4} y={catBL.y + 11} textAnchor="end"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            Ca²⁺
          </text>
          <text x={catBR.x + 4} y={catBR.y + 11} textAnchor="start"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            Na⁺+K⁺
          </text>
          <text x={catTop.x} y={catTop.y - 5} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            Mg²⁺
          </text>

          {/* Anion triangle */}
          <text x={anBL.x - 4} y={anBL.y + 11} textAnchor="end"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            HCO₃⁻
          </text>
          <text x={anBR.x + 4} y={anBR.y + 11} textAnchor="start"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            Cl⁻
          </text>
          <text x={anTop.x} y={anTop.y - 5} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)" fontWeight={500}>
            SO₄²⁻
          </text>

          {/* Diamond corner labels */}
          <text x={diamondTop.x} y={diamondTop.y - 5} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            Na+Cl
          </text>
          <text x={diamondBottom.x} y={diamondBottom.y + 11} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
            Ca+HCO₃
          </text>

          {/* Cation label */}
          <text x={leftTriCx} y={triBottomY + 22} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-mute)">
            CATIONS (meq%)
          </text>
          {/* Anion label */}
          <text x={rightTriCx} y={triBottomY + 22} textAnchor="middle"
            fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-mute)">
            ANIONS (meq%)
          </text>

          {/* ----------------------------------------------------------------
              Sample markers — all three panels
          ----------------------------------------------------------------- */}
          {SAMPLES.map((s, i) => {
            const catPt   = sampleCatPts[i];
            const anPt    = sampleAnPts[i];
            const diamPt  = sampleDiamPts[i];
            const shape   = SHAPES[i];
            const fill    = FILLS[i];
            const opacity = OPACITIES[i];
            return (
              <g key={s.id}>
                <Marker cx={catPt.x}  cy={catPt.y}  shape={shape} size={markerSize} fill={fill} opacity={opacity} strokeWidth={0.8} />
                <Marker cx={anPt.x}   cy={anPt.y}   shape={shape} size={markerSize} fill={fill} opacity={opacity} strokeWidth={0.8} />
                <Marker cx={diamPt.x} cy={diamPt.y} shape={shape} size={markerSize} fill={fill} opacity={opacity} strokeWidth={0.8} />
              </g>
            );
          })}
        </g>

        {/* ------------------------------------------------------------------
            ExplainAnchors
        ------------------------------------------------------------------- */}

        {/* Anchor 1: Cation triangle */}
        <ExplainAnchor
          selector="cation-triangle"
          index={1}
          pin={{ x: catMidBottom.x, y: catMidBottom.y + 10 }}
          rect={{
            x: Math.max(0, catBL.x - 4),
            y: Math.max(0, catTop.y - 4),
            width: triW + 8,
            height: triH + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: Anion triangle */}
        <ExplainAnchor
          selector="anion-triangle"
          index={2}
          pin={{ x: anMidBottom.x, y: anMidBottom.y + 10 }}
          rect={{
            x: Math.max(0, Math.min(iw - triW - 8, anBL.x - 4)),
            y: Math.max(0, anTop.y - 4),
            width: triW + 8,
            height: triH + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: Diamond */}
        <ExplainAnchor
          selector="diamond-projection"
          index={3}
          pin={{ x: diamondRight.x + 10, y: diamondCy }}
          rect={{
            x: Math.max(0, diamondLeft.x - 4),
            y: Math.max(0, diamondTop.y - 4),
            width: Math.min(iw - (diamondLeft.x - 4), halfDiag * 2 + 8),
            height: halfDiag * 2 + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: Ca²⁺ corner (carbonate endmember) */}
        <ExplainAnchor
          selector="ca-corner"
          index={4}
          pin={{ x: catBL.x - 16, y: catBL.y - 14 }}
          rect={{
            x: Math.max(0, catBL.x - 10),
            y: Math.max(0, catBL.y - 10),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: Na⁺+Cl⁻ saline corner — cation side near Na⁺+K⁺ vertex */}
        <ExplainAnchor
          selector="na-cl-corner"
          index={5}
          pin={{ x: salineCat.x + 14, y: salineCat.y - 14 }}
          rect={{
            x: Math.max(0, salineCat.x - 8),
            y: Math.max(0, salineCat.y - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: Sample point + triangle-to-diamond projection */}
        <ExplainAnchor
          selector="sample-projection"
          index={6}
          pin={{ x: s1cat.x + 14, y: s1cat.y - 14 }}
          rect={{
            x: Math.max(0, Math.min(s1cat.x, s1diam.x) - 8),
            y: Math.max(0, Math.min(s1cat.y, s1diam.y) - 8),
            width: Math.abs(s1diam.x - s1cat.x) + 16,
            height: Math.abs(s1cat.y - s1diam.y) + 16,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
