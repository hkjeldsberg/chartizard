"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// -------------------------------------------------------------------------
// T(Fe, Ni, Cu) — solidus temperature model for the Fe-Ni-Cu ternary.
//
// Pure-element melting points: Fe = 1538 °C, Ni = 1455 °C, Cu = 1085 °C.
// Linear blend plus a depressive "valley" near the Fe-Cu eutectic region
// (Fe ≈ 0, Ni ≈ 0, Cu ≈ 1 is the Cu end; the valley shifts the minimum
// slightly inward to ~Fe=0.1, Ni=0.1, Cu=0.8 for visual interest).
// This is physically motivated but not publication-grade.
// -------------------------------------------------------------------------
function solidusT(fe: number, ni: number, cu: number): number {
  const linear = 1538 * fe + 1455 * ni + 1085 * cu;
  // Depressive interaction: binary Fe-Cu has a wide two-phase gap; model a
  // small valley around Fe ≈ 0.2, Cu ≈ 0.8 to produce visually interesting
  // closed contours.
  const dFeCu = fe * cu; // product peaks along the Fe-Cu edge
  const depression = 120 * dFeCu * (1 - ni);
  return linear - depression;
}

// Ternary barycentric coordinates.
// Convention: Fe = bottom-left, Ni = bottom-right, Cu = top.
// Standard equilateral mapping:
//   x  = Ni + Cu/2
//   y  = Cu * sqrt(3)/2
// Then scaled to [0, triW] × [0, triH] and y-flipped so Cu=1 is at the top.
const SQRT3_2 = Math.sqrt(3) / 2;

// -------------------------------------------------------------------------
// Contour levels and hand-sampled polylines.
//
// Method: for each level T0, walk along Fe fraction from 0 to 1 in small
// steps, find the Cu fraction that satisfies T(fe, ni, cu) = T0 given that
// ni = 1 - fe - cu (ni ≥ 0 constrains the domain). Sweep produces a set of
// (fe, ni, cu) triples lying on the isotherm.
// -------------------------------------------------------------------------

interface ContourPoint {
  fe: number;
  ni: number;
  cu: number;
}

/**
 * Compute one isotherm contour at temperature T0.
 * For each fe in [0,1], find the cu in [0, 1-fe] such that T(fe, ni, cu) = T0,
 * where ni = 1 - fe - cu. Uses bisection on the monotone-ish cu axis.
 */
function computeContour(T0: number, steps = 60): ContourPoint[] {
  const points: ContourPoint[] = [];
  for (let i = 0; i <= steps; i++) {
    const fe = i / steps;
    const cuMax = 1 - fe; // ni = 1 - fe - cu >= 0 => cu <= 1 - fe
    // T at cu=0: ni = 1-fe, Cu=0
    const tAtCu0 = solidusT(fe, 1 - fe, 0);
    // T at cu=cuMax: ni = 0
    const tAtCuMax = solidusT(fe, 0, cuMax);

    // Check if T0 lies in the range
    const tMin = Math.min(tAtCu0, tAtCuMax);
    const tMax = Math.max(tAtCu0, tAtCuMax);
    if (T0 < tMin || T0 > tMax) continue;

    // Bisect to find cu
    let lo = 0;
    let hi = cuMax;
    for (let iter = 0; iter < 50; iter++) {
      const mid = (lo + hi) / 2;
      const tMid = solidusT(fe, 1 - fe - mid, mid);
      if ((tMid - T0) * (solidusT(fe, 1 - fe, 0) - T0) < 0) {
        hi = mid;
      } else {
        lo = mid;
      }
      if (hi - lo < 1e-6) break;
    }
    const cu = (lo + hi) / 2;
    const ni = 1 - fe - cu;
    if (ni >= -1e-6 && cu >= -1e-6) {
      points.push({ fe, ni: Math.max(0, ni), cu: Math.max(0, cu) });
    }
  }
  return points;
}

// Pre-compute contour data (outside component — these are constants).
const CONTOUR_LEVELS = [
  { T: 1100, label: "1100 °C" },
  { T: 1200, label: "1200 °C" },
  { T: 1300, label: "1300 °C" },
  { T: 1400, label: "1400 °C" },
];

const CONTOUR_DATA = CONTOUR_LEVELS.map((c) => ({
  ...c,
  points: computeContour(c.T),
}));

// A mid-composition sample for the "sample point" anchor: Fe=0.33, Ni=0.33, Cu=0.34
const SAMPLE = { fe: 0.33, ni: 0.33, cu: 0.34 };
const SAMPLE_T = Math.round(solidusT(SAMPLE.fe, SAMPLE.ni, SAMPLE.cu));

export function TernaryContourPlot({ width, height }: Props) {
  const margin = { top: 32, right: 32, bottom: 40, left: 32 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Fit the largest equilateral triangle into the inner rect.
  const scale = Math.max(0, Math.min(iw, ih / SQRT3_2));
  const triW = scale;
  const triH = scale * SQRT3_2;
  const ox = (iw - triW) / 2;
  const oy = (ih - triH) / 2;

  // Barycentric -> pixel. Fe=BL, Ni=BR, Cu=top.
  const tri = (fe: number, ni: number, cu: number): { x: number; y: number } => {
    const x = ni + cu / 2;
    const y = cu * SQRT3_2;
    return {
      x: ox + x * triW,
      y: oy + triH - y * scale,
    };
  };

  const vFe = tri(1, 0, 0);
  const vNi = tri(0, 1, 0);
  const vCu = tri(0, 0, 1);

  const trianglePoints = `${vFe.x},${vFe.y} ${vNi.x},${vNi.y} ${vCu.x},${vCu.y}`;

  // Convert contour point array to SVG polyline points string.
  const toPolyline = (pts: ContourPoint[]): string =>
    pts.map((p) => {
      const { x, y } = tri(p.fe, p.ni, p.cu);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    }).join(" ");

  // Sample point pixel coords
  const sp = tri(SAMPLE.fe, SAMPLE.ni, SAMPLE.cu);

  // Label positions: place labels at the mid-point of each contour.
  const labelPoint = (pts: ContourPoint[]) => {
    if (pts.length === 0) return { x: 0, y: 0 };
    const mid = pts[Math.floor(pts.length / 2)];
    return tri(mid.fe, mid.ni, mid.cu);
  };

  // Pick the 1200 and 1300 contours for labels (they have good screen positions).
  const labeledContours = [1200, 1300, 1400];

  // Anchor: representative contour (1200 °C) — pin above its midpoint.
  const contour1200 = CONTOUR_DATA.find((c) => c.T === 1200)!;
  const c1200mid = labelPoint(contour1200.points);

  // Anchor: the triangle-contour projection concept — bottom edge midpoint.
  const triProjectionPin = { x: (vFe.x + vNi.x) / 2, y: vFe.y + 6 };

  return (
    <svg width={width} height={height} role="img" aria-label="Ternary contour plot">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Triangle boundary */}
          <polygon
            points={trianglePoints}
            fill="var(--color-ink)"
            fillOpacity={0.03}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />

          {/* Contour polylines */}
          {CONTOUR_DATA.map((cd) => {
            if (cd.points.length < 2) return null;
            const pts = toPolyline(cd.points);
            return (
              <polyline
                key={cd.T}
                points={pts}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={cd.T === 1200 || cd.T === 1300 || cd.T === 1400 ? 1.4 : 1}
                strokeOpacity={0.65}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* Contour labels */}
          {CONTOUR_DATA.filter((cd) => labeledContours.includes(cd.T)).map((cd) => {
            if (cd.points.length === 0) return null;
            const lp = labelPoint(cd.points);
            return (
              <text
                key={`lbl-${cd.T}`}
                x={lp.x}
                y={lp.y - 6}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
                opacity={0.8}
              >
                {cd.label}
              </text>
            );
          })}

          {/* Vertex labels */}
          <text
            x={vFe.x - 6}
            y={vFe.y + 14}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Fe
          </text>
          <text
            x={vNi.x + 6}
            y={vNi.y + 14}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Ni
          </text>
          <text
            x={vCu.x}
            y={vCu.y - 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={11}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Cu
          </text>

          {/* Sample point */}
          <circle
            cx={sp.x}
            cy={sp.y}
            r={4}
            fill="var(--color-ink)"
            fillOpacity={0.85}
          />
          <text
            x={sp.x + 8}
            y={sp.y - 4}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
            opacity={0.85}
          >
            {SAMPLE_T} °C
          </text>
        </g>

        {/* 1. Fe corner */}
        <ExplainAnchor
          selector="fe-corner"
          index={1}
          pin={{ x: vFe.x - 16, y: vFe.y + 4 }}
          rect={{
            x: Math.max(0, vFe.x - 28),
            y: Math.max(0, vFe.y - 8),
            width: 36,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Ni corner */}
        <ExplainAnchor
          selector="ni-corner"
          index={2}
          pin={{ x: Math.min(iw - 8, vNi.x + 16), y: vNi.y + 4 }}
          rect={{
            x: Math.max(0, Math.min(iw - 36, vNi.x - 8)),
            y: Math.max(0, vNi.y - 8),
            width: 36,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Cu corner (top) */}
        <ExplainAnchor
          selector="cu-corner"
          index={3}
          pin={{ x: vCu.x + 18, y: vCu.y - 4 }}
          rect={{
            x: Math.max(0, Math.min(iw - 40, vCu.x - 20)),
            y: Math.max(0, vCu.y - 16),
            width: 40,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Isotherm contour — pin on the 1200 °C contour */}
        <ExplainAnchor
          selector="isotherm-contour"
          index={4}
          pin={{ x: c1200mid.x, y: c1200mid.y - 18 }}
          rect={{
            x: Math.max(0, Math.min(iw - 60, c1200mid.x - 30)),
            y: Math.max(0, Math.min(ih - 8, c1200mid.y - 4)),
            width: 60,
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Temperature label — pin on the 1300 °C label */}
        {(() => {
          const cd = CONTOUR_DATA.find((c) => c.T === 1300)!;
          const lp = cd.points.length > 0 ? labelPoint(cd.points) : { x: iw / 2, y: ih / 2 };
          return (
            <ExplainAnchor
              selector="temperature-label"
              index={5}
              pin={{ x: lp.x + 18, y: lp.y - 14 }}
              rect={{
                x: Math.max(0, Math.min(iw - 50, lp.x - 25)),
                y: Math.max(0, lp.y - 16),
                width: 50,
                height: 14,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* 6. Mid-composition sample point */}
        <ExplainAnchor
          selector="sample-point"
          index={6}
          pin={{ x: sp.x - 16, y: sp.y + 14 }}
          rect={{
            x: Math.max(0, sp.x - 6),
            y: Math.max(0, sp.y - 6),
            width: 12,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Triangle-contour projection — bottom edge */}
        <ExplainAnchor
          selector="triangle-projection"
          index={7}
          pin={{ x: triProjectionPin.x, y: Math.min(ih - 2, triProjectionPin.y + 12) }}
          rect={{
            x: Math.max(0, vFe.x - 4),
            y: Math.max(0, vFe.y - 4),
            width: Math.min(iw, vNi.x - vFe.x + 8),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
