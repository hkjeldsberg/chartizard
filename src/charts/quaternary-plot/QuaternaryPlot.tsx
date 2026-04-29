"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Quaternary (Tetrahedral) Plot — isometric projection
//
// 4-component system: Fe (A), C (B), Cr (C), Ni (D)
// Shown as a regular tetrahedron in axonometric projection.
// One back face (B-C-D) is hidden per the spec.
//
// Isometric project matrix:
//   world x → screen (1, 0)       (right)
//   world y → screen (cos30°, sin30°) ≈ (0.866, 0.5)  (up-right)
//   world z → screen (0, -1)      (up)
//
// Tetrahedron vertices in barycentric unit coordinates:
//   A (Fe)  = (0, 0, 0)  → top vertex
//   B (C)   = (1, 0, 0)  → front-left vertex
//   C (Cr)  = (0, 1, 0)  → front-right vertex
//   D (Ni)  = (0.5, 0.5, -0.866) → bottom vertex  [adjusted for regular tet]
//
// Regular tetrahedron with edge length 1 positioned to fit in viewport.
// Vertices (world 3D):
//   A = (0.5, 0.866, 0.816)   top
//   B = (0,   0,     0)       front-left
//   C = (1,   0,     0)       front-right
//   D = (0.5, 0.667, 0)       back (hidden face ABD is back)
//
// We'll use simpler approach: place 4 vertices, project to 2D.
// ---------------------------------------------------------------------------

interface Props {
  width: number;
  height: number;
}

// Project 3D → 2D using axonometric (isometric-like) projection
// x-axis: right, y-axis: upper-right (30°), z-axis: up
const cos30 = Math.cos(Math.PI / 6); // 0.866
const sin30 = Math.sin(Math.PI / 6); // 0.5

function project(
  x: number,
  y: number,
  z: number,
): [number, number] {
  return [x * 1 + y * cos30, -(z * 1) - y * sin30];
}

// Regular tetrahedron vertices (edge length 1):
//   v0 = (0,   0,          0)          front-left base
//   v1 = (1,   0,          0)          front-right base
//   v2 = (0.5, sqrt(3)/2,  0)          back base
//   v3 = (0.5, sqrt(3)/6,  sqrt(6)/3)  apex (top)
const s3h = Math.sqrt(3) / 2;  // 0.866
const s3_6 = Math.sqrt(3) / 6; // 0.289
const s6_3 = Math.sqrt(6) / 3; // 0.816

const VERTICES = {
  Fe: [0,   0,    0    ],  // front-left base
  Cr: [1,   0,    0    ],  // front-right base
  Ni: [0.5, s3h,  0    ],  // back base
  C:  [0.5, s3_6, s6_3],  // apex (top)
} as const;

// Project all vertices
function projectVertex(v: readonly [number, number, number]): [number, number] {
  return project(v[0], v[1], v[2]);
}

// ---------------------------------------------------------------------------
// 316 stainless steel: Fe 74%, C 0.5%, Cr 18%, Ni 7.5%
// Barycentric: wFe*Fe_pos + wC*C_pos + wCr*Cr_pos + wNi*Ni_pos
// ---------------------------------------------------------------------------
const W = { Fe: 0.74, C: 0.005, Cr: 0.18, Ni: 0.075 };

function barycentricPoint(): [number, number] {
  const vFe = projectVertex(VERTICES.Fe);
  const vCr = projectVertex(VERTICES.Cr);
  const vNi = projectVertex(VERTICES.Ni);
  const vC = projectVertex(VERTICES.C);
  // Normalize weights
  const total = W.Fe + W.C + W.Cr + W.Ni;
  return [
    (W.Fe * vFe[0] + W.C * vC[0] + W.Cr * vCr[0] + W.Ni * vNi[0]) / total,
    (W.Fe * vFe[1] + W.C * vC[1] + W.Cr * vCr[1] + W.Ni * vNi[1]) / total,
  ];
}

export function QuaternaryPlotChart({ width, height }: Props) {
  const margin = { top: 32, right: 32, bottom: 48, left: 32 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Project all 4 vertices
  const pFe = projectVertex(VERTICES.Fe);
  const pCr = projectVertex(VERTICES.Cr);
  const pNi = projectVertex(VERTICES.Ni);
  const pC = projectVertex(VERTICES.C);

  // Find bounding box of projected points to fit in [0, iw] × [0, ih]
  const allX = [pFe[0], pCr[0], pNi[0], pC[0]];
  const allY = [pFe[1], pCr[1], pNi[1], pC[1]];
  const minX = Math.min(...allX);
  const maxX = Math.max(...allX);
  const minY = Math.min(...allY);
  const maxY = Math.max(...allY);
  const projW = maxX - minX;
  const projH = maxY - minY;

  const pad = 10;
  const scale = Math.min(
    (iw - pad * 2) / Math.max(projW, 0.001),
    (ih - pad * 2) / Math.max(projH, 0.001),
  );

  // Center the tetrahedron
  const cx = iw / 2;
  const cy = ih / 2;
  const midProjX = (minX + maxX) / 2;
  const midProjY = (minY + maxY) / 2;

  function toScreen([px, py]: [number, number]): [number, number] {
    return [cx + (px - midProjX) * scale, cy + (py - midProjY) * scale];
  }

  const sFe = toScreen(pFe);
  const sCr = toScreen(pCr);
  const sNi = toScreen(pNi);
  const sC = toScreen(pC);
  const sSS = toScreen(barycentricPoint());

  // Visible edges: all except the back face (Fe-Ni-C = the three edges connecting back vertices)
  // Looking at the tetrahedron from the front, the hidden face is the one "behind" —
  // face Ni-C-Cr (back face), but let's determine visibility properly.
  //
  // Faces: Fe-C-Cr (front-bottom), Fe-Cr-Ni (right), Fe-Ni-C (back/left), Cr-Ni-C (back-right)
  // Visible from viewer (in isometric projection looking from front-right-up):
  //   - face Fe-C-Cr: front bottom → visible
  //   - face Fe-Cr-Ni: right → partially visible
  //   - face Fe-Ni-C: back-left → hidden
  //   - face Cr-Ni-C: top-back-right → visible
  //
  // Hidden edge: Fe-Ni (the back edge, both connecting the back vertex Ni)
  // Actually the back face is Fe-Ni-C_apex — the edge Fe-Ni is hidden.

  // Visible edges (drawn solid):
  const solidEdges: [[number, number], [number, number]][] = [
    [sFe, sCr],  // Fe–Cr (front bottom)
    [sCr, sNi],  // Cr–Ni (right)
    [sC, sFe],   // apex–Fe (front-left)
    [sC, sCr],   // apex–Cr (front-right)
    [sC, sNi],   // apex–Ni (top-right-back)
  ];

  // Hidden edge (dashed):
  const dashedEdges: [[number, number], [number, number]][] = [
    [sFe, sNi],  // Fe–Ni (back edge)
  ];

  // Vertex label offsets
  const labelOffset: Record<string, [number, number]> = {
    Fe: [-18, 6],
    Cr: [8, 6],
    Ni: [4, 6],
    C: [4, -10],
  };

  // Composition label for the stainless point
  const ssLabelY = sSS[1] > ih / 2 ? sSS[1] - 12 : sSS[1] + 16;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Quaternary tetrahedral plot — 316 stainless steel composition"
    >
      <Group left={margin.left} top={margin.top}>
        {/* --- Tetrahedron edges --- */}
        <ExplainAnchor
          selector="tetrahedron-edges"
          index={1}
          pin={{ x: iw / 2, y: ih * 0.15 }}
          rect={{ x: 0, y: 0, width: iw, height: ih * 0.5 }}
        >
          <g data-data-layer="true">
            {/* Solid visible edges */}
            {solidEdges.map(([a, b], i) => (
              <line
                key={`solid-${i}`}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke="var(--color-ink)"
                strokeWidth={1.4}
                strokeLinecap="round"
              />
            ))}
            {/* Dashed hidden edge */}
            {dashedEdges.map(([a, b], i) => (
              <line
                key={`dashed-${i}`}
                x1={a[0]}
                y1={a[1]}
                x2={b[0]}
                y2={b[1]}
                stroke="var(--color-ink)"
                strokeWidth={1.4}
                strokeDasharray="4 3"
                strokeLinecap="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* --- Vertices --- */}
        <ExplainAnchor
          selector="vertices"
          index={2}
          pin={{ x: sCr[0] + 24, y: sCr[1] + 4 }}
          rect={{
            x: Math.min(sFe[0], sCr[0], sNi[0], sC[0]) - 20,
            y: Math.min(sFe[1], sCr[1], sNi[1], sC[1]) - 16,
            width:
              Math.max(sFe[0], sCr[0], sNi[0], sC[0]) -
              Math.min(sFe[0], sCr[0], sNi[0], sC[0]) +
              40,
            height: 28,
          }}
        >
          <g data-data-layer="true">
            {(
              [
                [sFe, "Fe", "Fe"],
                [sCr, "Cr", "Cr"],
                [sNi, "Ni", "Ni"],
                [sC, "C_apex", "C"],
              ] as const
            ).map(([pos, key, label]) => (
              <g key={key}>
                <circle
                  cx={pos[0]}
                  cy={pos[1]}
                  r={3}
                  fill="var(--color-ink)"
                />
                <text
                  x={pos[0] + labelOffset[label][0]}
                  y={pos[1] + labelOffset[label][1]}
                  fontSize={10}
                  fontFamily="var(--font-mono)"
                  fill="var(--color-ink)"
                  fontWeight="600"
                >
                  {label}
                </text>
              </g>
            ))}
          </g>
        </ExplainAnchor>

        {/* --- 316 Stainless composition point --- */}
        <ExplainAnchor
          selector="composition-point"
          index={3}
          pin={{ x: sSS[0] + 14, y: sSS[1] - 14 }}
          rect={{
            x: sSS[0] - 10,
            y: sSS[1] - 10,
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <circle
              cx={sSS[0]}
              cy={sSS[1]}
              r={5}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.8}
            />
            <circle cx={sSS[0]} cy={sSS[1]} r={2} fill="var(--color-ink)" />
          </g>
        </ExplainAnchor>

        {/* --- Composition label --- */}
        <ExplainAnchor
          selector="composition-label"
          index={4}
          pin={{ x: sSS[0] - 28, y: ssLabelY + 10 }}
          rect={{
            x: Math.max(0, sSS[0] - 60),
            y: Math.max(0, ssLabelY - 8),
            width: Math.min(iw, 120),
            height: 28,
          }}
        >
          <text
            x={sSS[0]}
            y={ssLabelY}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            316 SS
          </text>
          <text
            x={sSS[0]}
            y={ssLabelY + 11}
            textAnchor="middle"
            fontSize={7}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            Fe 74% / Cr 18% / Ni 7.5%
          </text>
        </ExplainAnchor>

        {/* --- Hidden face annotation --- */}
        <ExplainAnchor
          selector="hidden-face"
          index={5}
          pin={{ x: iw / 2, y: ih - 16 }}
          rect={{ x: 0, y: ih - 28, width: iw, height: margin.bottom }}
        >
          <text
            x={iw / 2}
            y={ih + 18}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            Dashed edge = back face hidden in projection
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
