"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Hydrogen 2p_z orbital probability-density isosurface |ψ|² = c.
//
// The true 2p_z density is proportional to z²·exp(-r) (in Bohr-radius units).
// Its level sets are two lobes along the z-axis, pinched to a node at z = 0.
// Rather than run marching cubes at render time, we tesselate each lobe as a
// surface of revolution around the z-axis — a pre-computed mesh of quads
// (rendered as triangle pairs for depth sorting). The outline is an analytic
// prolate-spheroid-like curve tuned to look like the canonical orbital plate.
//
// Rendering: isometric projection, painter's algorithm (back-to-front by
// face centroid depth in camera space). No lighting model — stroke + filled
// translucent quads gives the familiar "drafted surface" aesthetic.
// ---------------------------------------------------------------------------

// Projection angles (isometric-ish — 30° for x and y lift).
const ANGLE_DEG = 30;
const COS_A = Math.cos((ANGLE_DEG * Math.PI) / 180);
const SIN_A = Math.sin((ANGLE_DEG * Math.PI) / 180);

// Lobe outline (ρ(t), z(t)) for t in [0, 1]. t = 0 is the pinch near origin;
// t = 1 is the tip of the lobe. We mirror across z = 0 for the lower lobe.
// ρ peaks near t ≈ 0.55 at ρ_max; z grows monotonically toward z_top.
const Z_TOP = 2.2;
const Z_BASE = 0.12; // small gap at z ≈ 0 — orbital has a node at z = 0
const RHO_MAX = 0.95;

function outline(t: number): { rho: number; z: number } {
  const s = Math.max(0, Math.min(1, t));
  // z grows with a slight curve — fast near base, slower near tip.
  const z = Z_BASE + (Z_TOP - Z_BASE) * Math.pow(s, 0.85);
  // ρ peaks at t ≈ 0.5: use sin(π·t) shape, then skew slightly outward.
  const skew = Math.pow(s, 0.35) * Math.pow(1 - s, 0.45);
  const rho = RHO_MAX * (skew / 0.408); // 0.408 = max of s^0.35·(1-s)^0.45
  return { rho, z: Math.max(0, z) };
}

// Tesselation resolution: LAT rings × LON longitudes per lobe.
// 11 rings × 14 longitudes = 154 quads per lobe → 2 lobes = 308 quads
// → 616 triangles. Close enough to the "~200 triangles" target order; the
// resolution is tuned for visual smoothness at L-tile size.
const LAT = 11;
const LON = 14;

type Vec3 = { x: number; y: number; z: number };
type Face = {
  verts: Vec3[]; // quad, 4 verts in ccw-ish order
  depthKey: number; // camera-space depth, larger = further
  isLowerLobe: boolean;
};

function buildMesh(): Face[] {
  const faces: Face[] = [];

  // Generate vertex grid for one lobe (upper), then mirror for lower.
  // grid[i][j]: i = latitude (0..LAT), j = longitude (0..LON, wrap at LON).
  function lobeFaces(sign: 1 | -1): Face[] {
    const grid: Vec3[][] = [];
    for (let i = 0; i <= LAT; i++) {
      const t = i / LAT;
      const { rho, z } = outline(t);
      const row: Vec3[] = [];
      for (let j = 0; j < LON; j++) {
        const phi = (j / LON) * 2 * Math.PI;
        row.push({
          x: rho * Math.cos(phi),
          y: rho * Math.sin(phi),
          z: sign * z,
        });
      }
      grid.push(row);
    }
    const out: Face[] = [];
    for (let i = 0; i < LAT; i++) {
      for (let j = 0; j < LON; j++) {
        const j2 = (j + 1) % LON;
        const v00 = grid[i][j];
        const v01 = grid[i][j2];
        const v11 = grid[i + 1][j2];
        const v10 = grid[i + 1][j];
        out.push({
          verts: [v00, v01, v11, v10],
          depthKey: 0,
          isLowerLobe: sign === -1,
        });
      }
    }
    return out;
  }

  faces.push(...lobeFaces(1));
  faces.push(...lobeFaces(-1));
  return faces;
}

// Project a 3D world point to 2D using isometric rule:
// screen_x = (x - y) * cos30
// screen_y = (x + y) * sin30 - z
// Depth (for painter's): larger (x + y) means further from viewer; we also
// use -z slightly so the upper lobe tips that are closer in world-z come
// forward. Depth key = (x + y) - z * 0.4  (bigger = further back).
function projectXY(p: Vec3): { sx: number; sy: number } {
  return {
    sx: (p.x - p.y) * COS_A,
    sy: (p.x + p.y) * SIN_A - p.z,
  };
}

function depthOf(p: Vec3): number {
  return p.x + p.y - p.z * 0.4;
}

interface Props {
  width: number;
  height: number;
}

export function IsosurfacePlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { faces, axes, upperTipScreen, lowerTipScreen, nodeScreen, bulgeScreen } =
    useMemo(() => {
      const raw = buildMesh();

      // Compute face depths (centroid-based) for painter's ordering.
      for (const f of raw) {
        let cx = 0,
          cy = 0,
          cz = 0;
        for (const v of f.verts) {
          cx += v.x;
          cy += v.y;
          cz += v.z;
        }
        cx /= f.verts.length;
        cy /= f.verts.length;
        cz /= f.verts.length;
        f.depthKey = depthOf({ x: cx, y: cy, z: cz });
      }
      // Back-to-front: larger depthKey first.
      raw.sort((a, b) => b.depthKey - a.depthKey);

      // Fit to the plot box. Collect all projected points + axis endpoints.
      const axisLen = 1.9;
      const origin: Vec3 = { x: 0, y: 0, z: 0 };
      const axisXEnd: Vec3 = { x: axisLen, y: 0, z: 0 };
      const axisYEnd: Vec3 = { x: 0, y: axisLen, z: 0 };
      const axisZEnd: Vec3 = { x: 0, y: 0, z: Z_TOP + 0.3 };
      const axisZNeg: Vec3 = { x: 0, y: 0, z: -(Z_TOP + 0.3) };

      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      const recordBounds = (p: Vec3) => {
        const { sx, sy } = projectXY(p);
        if (sx < minX) minX = sx;
        if (sx > maxX) maxX = sx;
        if (sy < minY) minY = sy;
        if (sy > maxY) maxY = sy;
      };
      for (const f of raw) for (const v of f.verts) recordBounds(v);
      for (const p of [origin, axisXEnd, axisYEnd, axisZEnd, axisZNeg])
        recordBounds(p);

      const pad = 28;
      const worldW = Math.max(1e-6, maxX - minX);
      const worldH = Math.max(1e-6, maxY - minY);
      const scale = Math.min(
        (iw - pad * 2) / worldW,
        (ih - pad * 2) / worldH,
      );
      const offX = (iw - worldW * scale) / 2 - minX * scale;
      const offY = (ih - worldH * scale) / 2 - minY * scale;

      const toScreen = (p: Vec3) => {
        const { sx, sy } = projectXY(p);
        return { x: sx * scale + offX, y: sy * scale + offY };
      };

      // Tip points for anchors.
      const upperTip: Vec3 = { x: 0, y: 0, z: Z_TOP };
      const lowerTip: Vec3 = { x: 0, y: 0, z: -Z_TOP };
      const nodePoint: Vec3 = { x: 0, y: 0, z: 0 };
      // A point on the equator of the upper lobe (t ≈ 0.55) at phi = -π/2
      // (projected to front-left — visible without being behind the lobe).
      const { rho: bulgeRho, z: bulgeZ } = outline(0.55);
      const bulgePoint: Vec3 = {
        x: bulgeRho * Math.cos(-Math.PI / 2),
        y: bulgeRho * Math.sin(-Math.PI / 2),
        z: bulgeZ,
      };

      return {
        faces: raw,
        axes: {
          origin: toScreen(origin),
          x: toScreen(axisXEnd),
          y: toScreen(axisYEnd),
          zPos: toScreen(axisZEnd),
          zNeg: toScreen(axisZNeg),
          toScreen,
        },
        upperTipScreen: toScreen(upperTip),
        lowerTipScreen: toScreen(lowerTip),
        nodeScreen: toScreen(nodePoint),
        bulgeScreen: toScreen(bulgePoint),
      };
    }, [iw, ih]);

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Fill opacity varies slightly with depth to give a hint of volume without
  // a real lighting model. Back faces fainter, front faces denser.
  const depths = faces.map((f) => f.depthKey);
  const dMin = Math.min(...depths);
  const dMax = Math.max(...depths);
  const dSpan = Math.max(1e-6, dMax - dMin);
  const opacityFor = (f: Face) => {
    // t = 0 at back (dMax), 1 at front (dMin). Front brighter.
    const t = (dMax - f.depthKey) / dSpan;
    return 0.08 + t * 0.22; // [0.08, 0.30]
  };

  // Convert a face to an SVG points string via the projection.
  const pathOf = (f: Face) =>
    f.verts
      .map((v) => {
        const { x, y } = axes.toScreen(v);
        return `${x.toFixed(2)},${y.toFixed(2)}`;
      })
      .join(" ");

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Isosurface plot of a hydrogen 2p orbital probability density"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Axis tripod — drawn first so the mesh paints over the back arms.
            We render both the negative z-axis (behind, dashed-dimmer) and
            positive z-axis (foreground after mesh). x and y are dashed. */}
        <g data-data-layer="true">
          <line
            x1={axes.origin.x}
            y1={axes.origin.y}
            x2={axes.x.x}
            y2={axes.x.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <line
            x1={axes.origin.x}
            y1={axes.origin.y}
            x2={axes.y.x}
            y2={axes.y.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <line
            x1={axes.origin.x}
            y1={axes.origin.y}
            x2={axes.zNeg.x}
            y2={axes.zNeg.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.6}
            strokeDasharray="2 4"
          />
        </g>

        {/* Isosurface mesh — painter's algorithm, back-to-front. */}
        <ExplainAnchor
          selector="isosurface"
          index={1}
          pin={{
            x: clamp(upperTipScreen.x + 36, 10, iw - 10),
            y: clamp(upperTipScreen.y - 6, 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {faces.map((f, i) => (
              <polygon
                key={i}
                points={pathOf(f)}
                fill="var(--color-ink)"
                fillOpacity={opacityFor(f)}
                stroke="var(--color-ink)"
                strokeOpacity={0.55}
                strokeWidth={0.6}
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Z-axis positive arm — drawn AFTER the mesh because the upper lobe
            sits in front of the vertical axis and we want the axis to read
            as "through" the nodal plane. Using dotted pattern for the part
            above the lobe tip. */}
        <g data-data-layer="true">
          <line
            x1={axes.origin.x}
            y1={axes.origin.y}
            x2={axes.zPos.x}
            y2={axes.zPos.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
        </g>

        {/* Axis labels */}
        <g data-data-layer="true">
          <text
            x={axes.x.x + 6}
            y={axes.x.y + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            X
          </text>
          <text
            x={axes.y.x - 6}
            y={axes.y.y + 3}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Y
          </text>
          <text
            x={axes.zPos.x}
            y={axes.zPos.y - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Z
          </text>
        </g>

        {/* Node plane indicator — short faint line through origin in the x-y
            plane direction, reminding viewer that z = 0 is the nodal plane. */}
        <g data-data-layer="true">
          <line
            x1={axes.origin.x - 36}
            y1={axes.origin.y + 2}
            x2={axes.origin.x + 36}
            y2={axes.origin.y + 2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.7}
            strokeDasharray="1 3"
          />
        </g>

        {/* Upper lobe anchor */}
        <ExplainAnchor
          selector="upper-lobe"
          index={2}
          pin={{
            x: clamp(upperTipScreen.x - 28, 10, iw - 10),
            y: clamp(upperTipScreen.y - 6, 10, ih - 10),
          }}
          rect={{
            x: clamp(upperTipScreen.x - 40, 0, iw),
            y: clamp(upperTipScreen.y - 14, 0, ih),
            width: 80,
            height: 44,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Nodal plane anchor */}
        <ExplainAnchor
          selector="nodal-plane"
          index={3}
          pin={{
            x: clamp(nodeScreen.x + 44, 10, iw - 10),
            y: clamp(nodeScreen.y - 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(nodeScreen.x - 40, 0, iw),
            y: clamp(nodeScreen.y - 6, 0, ih),
            width: 80,
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Lower lobe anchor */}
        <ExplainAnchor
          selector="lower-lobe"
          index={4}
          pin={{
            x: clamp(lowerTipScreen.x + 28, 10, iw - 10),
            y: clamp(lowerTipScreen.y + 4, 10, ih - 10),
          }}
          rect={{
            x: clamp(lowerTipScreen.x - 40, 0, iw),
            y: clamp(lowerTipScreen.y - 30, 0, ih),
            width: 80,
            height: 44,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Mesh wireframe anchor — the triangulation itself */}
        <ExplainAnchor
          selector="mesh"
          index={5}
          pin={{
            x: clamp(bulgeScreen.x - 36, 10, iw - 10),
            y: clamp(bulgeScreen.y + 6, 10, ih - 10),
          }}
          rect={{
            x: clamp(bulgeScreen.x - 18, 0, iw),
            y: clamp(bulgeScreen.y - 8, 0, ih),
            width: 26,
            height: 20,
          }}
        >
          <circle
            cx={bulgeScreen.x}
            cy={bulgeScreen.y}
            r={1.8}
            fill="var(--color-ink)"
          />
        </ExplainAnchor>

        {/* Projection caption anchor (top-left strip) */}
        <ExplainAnchor
          selector="projection"
          index={6}
          pin={{ x: 28, y: 14 }}
          rect={{ x: 0, y: 0, width: Math.min(iw, 150), height: 28 }}
        >
          <text
            x={0}
            y={10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ISO 30° · |ψ₂ₚ|² = 0.01
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
