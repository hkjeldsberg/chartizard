"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Equal-angle (Wulff) stereonet — lower-hemisphere projection.
//
// Walter Schmidt (1925) established the equal-area (Lambert) net for routine
// structural geology. George Wulff (1902) published the older equal-angle
// variant here implemented; it preserves angles at the cost of distorting
// areas, making it the preferred projection in crystallography.
//
// Projection mechanics (Wulff):
//   A point on the lower hemisphere at geographic colatitude φ (measured from
//   vertical/nadir) projects to radius  r = R · tan(φ/2)  where R is the
//   primitive-circle radius. The primitive circle itself (φ = 90°, horizontal
//   plane) sits at r = R.
// ---------------------------------------------------------------------------

// ── Wulff projection ────────────────────────────────────────────────────────

/** Colatitude φ (0 = straight down, 90° = horizontal) → Wulff radius. */
function wulffR(colat_deg: number, R: number): number {
  return R * Math.tan((colat_deg * Math.PI) / 360);
}

/**
 * Convert trend/plunge (structural geologist's convention) to a 2-D Wulff
 * point. Trend is azimuth from North, plunge is angle below horizontal.
 * Lower-hemisphere: x = East, y = South (SVG y increases downward = South).
 */
function lineationToXY(
  trend_deg: number,
  plunge_deg: number,
  R: number,
): [number, number] {
  const colat = 90 - plunge_deg; // colatitude = 90° − plunge
  const r = wulffR(colat, R);
  const az = (trend_deg * Math.PI) / 180;
  return [r * Math.sin(az), r * Math.cos(az)]; // x=E, y=N but SVG y-down → negate y
}

// ── Net grid ─────────────────────────────────────────────────────────────────
// Great circles (longitude lines): dip from 10° to 80° in steps of 10°,
// with two vertical planes (90° dip). Dip direction fixed East (90°).
// Small circles (latitude lines): plunge 10° to 80° from vertical.

/** Sample ~N points along a great circle with given dip-direction and dip angle.
 *  Returns [x, y] array in Wulff-projected space (centre = origin). */
function greatCirclePoints(
  dipDir_deg: number,
  dip_deg: number,
  R: number,
  nPts = 61,
): [number, number][] {
  // Walk the great circle in 3-D and project each point.
  // The great circle is defined by its pole (unit normal to the plane).
  // We parameterise by angle α along the circle.
  const dipRad = (dip_deg * Math.PI) / 180;
  const azRad = (dipDir_deg * Math.PI) / 180;

  // Pole of the plane (unit vector pointing upward from the plane),
  // in (East, North, Up) coords.
  // For a plane striking perpendicular to dipDir with dip angle:
  //   pole = (−sin(dip)·sin(dipDir), −sin(dip)·cos(dipDir), cos(dip))
  // but we only need the great circle arc, not the pole directly.

  // Two unit vectors spanning the great circle plane (in E,N,Up):
  //   u = strike direction (horizontal, perpendicular to dipDir)
  //   v = down-dip direction
  const strikeAz = azRad - Math.PI / 2; // strike = dipDir − 90°
  const u: [number, number, number] = [Math.sin(strikeAz), Math.cos(strikeAz), 0];
  const v: [number, number, number] = [
    Math.sin(dipRad) * Math.sin(azRad),
    Math.sin(dipRad) * Math.cos(azRad),
    -Math.cos(dipRad), // down-dip = into lower hemisphere
  ];

  const pts: [number, number][] = [];
  for (let i = 0; i <= nPts; i++) {
    const alpha = (i / nPts) * Math.PI * 2;
    // point on great circle (unit sphere)
    const x3 = u[0] * Math.cos(alpha) + v[0] * Math.sin(alpha);
    const y3 = u[1] * Math.cos(alpha) + v[1] * Math.sin(alpha);
    const z3 = u[2] * Math.cos(alpha) + v[2] * Math.sin(alpha);
    // Only keep lower hemisphere (z ≤ 0, i.e., Up ≤ 0)
    if (z3 > 0.001) continue;
    // Wulff projection: colat from vertical (nadir = 0, z=-1)
    // colat = angle from nadir = acos(-z3) but we need angle from vertical (up):
    // plunge from horizontal = asin(|z3|) → colat = 90° − plunge
    const plunge = Math.asin(Math.abs(z3));
    const colat_deg = 90 - (plunge * 180) / Math.PI;
    const r = wulffR(colat_deg, R);
    // Project to (East, South) → SVG (x right, y down)
    const azimuth = Math.atan2(x3, y3); // atan2(E, N) = azimuth from N
    pts.push([r * Math.sin(azimuth), -r * Math.cos(azimuth)]);
  }
  return pts;
}

/** Small circle at constant plunge angle from vertical. Returns closed loop. */
function smallCirclePoints(
  colat_deg: number,
  R: number,
  nPts = 61,
): [number, number][] {
  const r = wulffR(colat_deg, R);
  const pts: [number, number][] = [];
  for (let i = 0; i <= nPts; i++) {
    const az = (i / nPts) * Math.PI * 2;
    pts.push([r * Math.sin(az), r * Math.cos(az)]);
  }
  return pts;
}

function polyline(pts: [number, number][], cx: number, cy: number): string {
  if (pts.length === 0) return "";
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${(cx + p[0]).toFixed(2)} ${(cy + p[1]).toFixed(2)}`).join(" ");
}

// ── Structural data ───────────────────────────────────────────────────────────
// Three planes (strike/dip), three lineations (trend/plunge),
// and a fold-axis cluster.

type Plane = { dipDir: number; dip: number; label: string };
const PLANES: Plane[] = [
  { dipDir: 135, dip: 60, label: "N45°E/60°SE" },   // dip direction = strike+90
  { dipDir: 90, dip: 45, label: "N00°/45°W" },
  { dipDir: 180, dip: 30, label: "N90°E/30°S" },
];

type Lin = { trend: number; plunge: number; label: string };
const LINEATIONS: Lin[] = [
  { trend: 220, plunge: 35, label: "L1" },
  { trend: 310, plunge: 55, label: "L2" },
  { trend: 70, plunge: 20, label: "L3" },
];

// Fold-axis cluster: 6 points near trend=045°, plunge=25° with small scatter.
// Deterministic scatter using a simple offset table.
const FOLD_CLUSTER: [number, number][] = [
  [45, 25],
  [47, 23],
  [43, 27],
  [42, 24],
  [48, 26],
  [46, 22],
];

interface Props {
  width: number;
  height: number;
}

export function Stereonet({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 24, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const side = Math.max(0, Math.min(iw, ih));
  const cx = iw / 2;
  const cy = ih / 2;
  const R = side / 2 - 2; // primitive-circle radius

  // ── Grid ────────────────────────────────────────────────────────────────
  // Great circles at 10° dip steps (same dip-direction = 090° East),
  // plus the vertical E-W and N-S great circles.
  const greatCircles: { pts: [number, number][]; dip: number }[] = [];
  for (let dip = 10; dip <= 80; dip += 10) {
    greatCircles.push({ pts: greatCirclePoints(90, dip, R), dip });
  }
  // Add 90° dip (vertical plane) as a diameter line
  greatCircles.push({
    pts: [[-R, 0] as [number, number], [R, 0] as [number, number]],
    dip: 90,
  });
  // North-South vertical plane (perpendicular to first set)
  greatCircles.push({
    pts: [[0, -R] as [number, number], [0, R] as [number, number]],
    dip: 90,
  });

  // Small circles at 10° colatitude steps
  const smallCircles: [number, number][][] = [];
  for (let colat = 10; colat <= 80; colat += 10) {
    smallCircles.push(smallCirclePoints(colat, R));
  }

  // ── Data great-circle arcs ───────────────────────────────────────────────
  const dataPlanes = PLANES.map((p) => ({
    ...p,
    pts: greatCirclePoints(p.dipDir, p.dip, R),
  }));

  // ── Lineation points ─────────────────────────────────────────────────────
  const dataLins = LINEATIONS.map((l) => {
    const [x, y] = lineationToXY(l.trend, l.plunge, R);
    return { ...l, x, y };
  });

  // ── Fold-axis cluster ────────────────────────────────────────────────────
  const foldCluster = FOLD_CLUSTER.map(([tr, pl]) => {
    const [x, y] = lineationToXY(tr, pl, R);
    return { x, y };
  });
  // Centroid of the cluster for the anchor pin
  const fcX = foldCluster.reduce((s, p) => s + p.x, 0) / foldCluster.length;
  const fcY = foldCluster.reduce((s, p) => s + p.y, 0) / foldCluster.length;

  // ── Representative great-circle arc (PLANES[0]) coords ──────────────────
  const rep0Pts = dataPlanes[0].pts;
  // Pick the midpoint of the arc for pin placement
  const rep0Mid = rep0Pts[Math.floor(rep0Pts.length / 2)] ?? [0, 0];
  const rep0PinX = cx + rep0Mid[0];
  const rep0PinY = cy + rep0Mid[1];

  // ── Small-circle anchor: outermost small circle (colatitude 80°) ────────
  const smCircleR = wulffR(80, R);

  // ── Compass labels ───────────────────────────────────────────────────────
  const compassLabels = [
    { label: "N", x: cx, y: cy - R - 10 },
    { label: "S", x: cx, y: cy + R + 13 },
    { label: "E", x: cx + R + 10, y: cy + 4 },
    { label: "W", x: cx - R - 10, y: cy + 4 },
  ];

  return (
    <svg width={width} height={height} role="img" aria-label="Stereonet / Wulff Net">
      <Group left={margin.left} top={margin.top}>
        {/* ── 1. Primitive circle (outer boundary) ── */}
        <ExplainAnchor
          selector="primitive-circle"
          index={1}
          pin={{ x: cx + R + 4, y: cy - 18 }}
          rect={{ x: Math.max(0, cx - R - 2), y: Math.max(0, cy - R - 2), width: Math.min(iw, (R + 2) * 2), height: Math.min(ih, (R + 2) * 2) }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={R}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Compass labels */}
        <g data-data-layer="true">
          {compassLabels.map(({ label, x, y }) => (
            <text
              key={label}
              x={x}
              y={y}
              textAnchor="middle"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {label}
            </text>
          ))}
        </g>

        {/* ── Grid: small circles (concentric latitude rings) ── */}
        <ExplainAnchor
          selector="small-circle"
          index={4}
          pin={{ x: cx + smCircleR + 6, y: cy - 8 }}
          rect={{ x: Math.max(0, cx - smCircleR - 2), y: Math.max(0, cy - smCircleR - 2), width: Math.min(iw, (smCircleR + 2) * 2), height: Math.min(ih, (smCircleR + 2) * 2) }}
        >
          <g data-data-layer="true">
            {smallCircles.map((pts, i) => (
              <path
                key={`sc-${i}`}
                d={polyline(pts, cx, cy)}
                fill="none"
                stroke="var(--color-hairline)"
                strokeWidth={0.6}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* ── Grid: great circles (meridian lines) ── */}
        <g data-data-layer="true">
          {greatCircles.map(({ pts, dip }, i) => (
            <path
              key={`gc-${i}`}
              d={polyline(pts as [number, number][], cx, cy)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={0.6}
            />
          ))}
        </g>

        {/* Centre of net (vertical direction) */}
        <ExplainAnchor
          selector="net-centre"
          index={5}
          pin={{ x: cx + 10, y: cy - 10 }}
          rect={{ x: Math.max(0, cx - 6), y: Math.max(0, cy - 6), width: 12, height: 12 }}
        >
          <circle
            cx={cx}
            cy={cy}
            r={2}
            fill="var(--color-ink-mute)"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* ── Data: planes as great-circle arcs ── */}
        <ExplainAnchor
          selector="great-circle-arc"
          index={2}
          pin={{ x: rep0PinX + 10, y: Math.max(0, rep0PinY - 12) }}
          rect={{ x: Math.max(0, cx - R), y: Math.max(0, cy - R), width: Math.min(iw, R * 2), height: Math.min(ih, R * 2) }}
        >
          <g data-data-layer="true">
            {dataPlanes.map((p, i) => (
              <path
                key={`dp-${i}`}
                d={polyline(p.pts, cx, cy)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.4}
                strokeOpacity={1 - i * 0.15}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* ── Data: lineation points ── */}
        <ExplainAnchor
          selector="lineation-point"
          index={3}
          pin={{ x: cx + dataLins[0].x + 10, y: Math.max(0, cy + dataLins[0].y - 8) }}
          rect={{ x: Math.max(0, cx + dataLins[0].x - 6), y: Math.max(0, cy + dataLins[0].y - 6), width: 12, height: 12 }}
        >
          <g data-data-layer="true">
            {dataLins.map((l, i) => (
              <g key={`lin-${i}`}>
                <circle
                  cx={cx + l.x}
                  cy={cy + l.y}
                  r={3.5}
                  fill="var(--color-ink)"
                />
                <text
                  x={cx + l.x + 5}
                  y={cy + l.y - 4}
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  {l.label}
                </text>
              </g>
            ))}
          </g>
        </ExplainAnchor>

        {/* ── Fold-axis cluster ── */}
        <ExplainAnchor
          selector="fold-cluster"
          index={6}
          pin={{ x: Math.min(iw - 4, cx + fcX + 14), y: Math.max(4, cy + fcY - 10) }}
          rect={{
            x: Math.max(0, cx + fcX - 14),
            y: Math.max(0, cy + fcY - 14),
            width: 28,
            height: 28,
          }}
        >
          <g data-data-layer="true">
            {foldCluster.map((p, i) => (
              <circle
                key={`fc-${i}`}
                cx={cx + p.x}
                cy={cy + p.y}
                r={2.5}
                fill="var(--color-ink)"
                fillOpacity={0.7}
              />
            ))}
            <text
              x={cx + fcX + 8}
              y={cy + fcY + 10}
              fontFamily="var(--font-mono)"
              fontSize={7.5}
              fill="var(--color-ink-soft)"
            >
              fold-axis cluster
            </text>
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
