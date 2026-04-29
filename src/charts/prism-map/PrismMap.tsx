"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Prism Map — 3D-extruded choropleth. Each state's footprint is raised
// into a prism whose HEIGHT encodes a value (here: 2024 state population
// in millions). Rendered in an axonometric projection with a back-to-
// front painter's algorithm; within each prism, only the side faces
// whose outward normals point toward the viewer are drawn.
//
// Simplified 10-state map — the goal is to tell the prism-map story
// cleanly, not to be geographically accurate. States are hand-drawn
// polygons in "map space" (a unit square roughly oriented with north
// up and west left). We pick a west-east row of states so the tallest
// prism (California) sits in front and does not occlude the others.
//
// Projection: axonometric with horizontal scale kx = 1.0 (x extends right),
// depth scale ky = 0.55 (y extends down-and-right at a shallow angle).
// Z extrudes straight up, so:
//   screen.x = x * kx + y * ky * cos(angleY)
//   screen.y = -x * 0 + y * ky * sin(angleY) - z
// with angleY = 30° gives a clean axonometric feel without true isometry.

type MapPt = readonly [number, number]; // (x, y) in map space (x west→east, y north→south)

interface State {
  code: string;
  name: string;
  footprint: ReadonlyArray<MapPt>; // polygon in map space, CW or CCW consistent
  population: number; // millions, 2024 approximate
}

// Polygons hand-drawn in a simple map grid. x ranges 0..10 (west-east),
// y ranges 0..4 (north-south). Shapes are stylised quadrilaterals —
// the chart is not a cartography exercise, it is a prism demo.
const STATES: ReadonlyArray<State> = [
  // West → East row 0 (northern tier, back)
  {
    code: "WA",
    name: "Washington",
    footprint: [
      [0.0, 0.0], [1.4, 0.0], [1.5, 0.7], [0.2, 0.85],
    ],
    population: 7.8,
  },
  {
    code: "MT",
    name: "Montana",
    footprint: [
      [1.5, 0.0], [3.5, 0.0], [3.5, 0.8], [1.55, 0.75],
    ],
    population: 1.1,
  },
  {
    code: "ND",
    name: "North Dakota",
    footprint: [
      [3.5, 0.0], [5.0, 0.0], [5.0, 0.75], [3.55, 0.8],
    ],
    population: 0.8,
  },
  {
    code: "MN",
    name: "Minnesota",
    footprint: [
      [5.0, 0.0], [6.4, 0.0], [6.5, 0.85], [5.05, 0.85],
    ],
    population: 5.7,
  },
  {
    code: "NY",
    name: "New York",
    footprint: [
      [8.2, 0.1], [9.6, 0.0], [9.9, 0.9], [8.3, 1.0],
    ],
    population: 19.6,
  },
  // Middle row (center band, middle depth)
  {
    code: "CO",
    name: "Colorado",
    footprint: [
      [2.2, 1.4], [3.8, 1.4], [3.8, 2.3], [2.2, 2.3],
    ],
    population: 5.8,
  },
  {
    code: "IL",
    name: "Illinois",
    footprint: [
      [5.6, 1.2], [6.6, 1.2], [6.7, 2.2], [5.7, 2.3],
    ],
    population: 12.4,
  },
  // Southern / front row — tallest prism (CA) up front
  {
    code: "CA",
    name: "California",
    footprint: [
      [0.1, 1.6], [1.5, 1.5], [1.7, 3.0], [0.5, 3.2],
    ],
    population: 39.0,
  },
  {
    code: "TX",
    name: "Texas",
    footprint: [
      [3.5, 2.6], [5.6, 2.6], [5.7, 3.9], [3.4, 3.9],
    ],
    population: 30.5,
  },
  {
    code: "FL",
    name: "Florida",
    footprint: [
      [7.4, 2.9], [9.4, 3.1], [9.2, 3.9], [7.3, 3.8],
    ],
    population: 22.2,
  },
];

interface Props {
  width: number;
  height: number;
}

// ---- Projection ------------------------------------------------------------

// Axonometric. y in map space goes "into" the scene — shifts right-and-down.
// x in map space extends right. z extrudes straight up.
const ANGLE = (Math.PI / 180) * 30;
const DEPTH_COS = Math.cos(ANGLE);
const DEPTH_SIN = Math.sin(ANGLE);

interface Proj2D {
  x: number;
  y: number;
}

function project(x: number, y: number, z: number, kx: number, ky: number): Proj2D {
  return {
    x: x * kx + y * ky * DEPTH_COS,
    y: y * ky * DEPTH_SIN - z,
  };
}

// ---- Helpers ---------------------------------------------------------------

function centroid(poly: ReadonlyArray<MapPt>): MapPt {
  let sx = 0;
  let sy = 0;
  for (const [x, y] of poly) {
    sx += x;
    sy += y;
  }
  return [sx / poly.length, sy / poly.length] as const;
}

// Signed area in map space. Positive = CCW, negative = CW.
function signedArea(poly: ReadonlyArray<MapPt>): number {
  let s = 0;
  for (let i = 0; i < poly.length; i++) {
    const [x1, y1] = poly[i];
    const [x2, y2] = poly[(i + 1) % poly.length];
    s += x1 * y2 - x2 * y1;
  }
  return s / 2;
}

// Pathify a list of projected points as an SVG "M ... L ... Z" string.
function polyPath(pts: ReadonlyArray<Proj2D>): string {
  if (pts.length === 0) return "";
  const [first, ...rest] = pts;
  return `M ${first.x.toFixed(2)} ${first.y.toFixed(2)} ${rest
    .map((p) => `L ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(" ")} Z`;
}

// Depth metric for back-to-front sort. With our axonometric projection
// (screen.y = y * ky * sin(angle) - z), depth along the view direction
// is governed by map-y alone: smaller map-y = farther north = deeper
// into the scene. Ascending map-y renders back-first so closer prisms
// overwrite farther ones.
function depthKey(c: MapPt): number {
  return c[1];
}

// ---- Chart -----------------------------------------------------------------

export function PrismMap({ width, height }: Props) {
  const margin = { top: 22, right: 20, bottom: 40, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Compute map-space extents so we can normalise to pixel space.
  // The map spans roughly x: 0..10, y: 0..4. After projection with
  // ky = 0.55, the on-screen bounding box is tighter than naive
  // (mapX * kx, mapY * ky). We compute projected extents over ALL
  // base corners (z = 0) AND all top corners (z = maxZ) to pick a
  // scale that fits.
  const maxPop = Math.max(...STATES.map((s) => s.population));
  // Height scale: tallest prism ≈ 1.8 in map units (so CA stands clearly
  // above the base plane but the overall chart still fits).
  const heightScale = 1.8 / maxPop;

  // Unprojected extents (for picking fit scales kx, ky).
  // We want the final projected bbox to fit (iw, ih) with a small padding.
  // Choose kx, ky together by computing projected coords at kx=ky=1 then
  // scaling uniformly to fit.
  const baseKX = 1.0;
  const baseKY = 0.55;

  let minPX = Infinity;
  let minPY = Infinity;
  let maxPX = -Infinity;
  let maxPY = -Infinity;

  for (const s of STATES) {
    const z = s.population * heightScale;
    for (const [x, y] of s.footprint) {
      for (const zi of [0, z]) {
        const p = project(x, y, zi, baseKX, baseKY);
        if (p.x < minPX) minPX = p.x;
        if (p.y < minPY) minPY = p.y;
        if (p.x > maxPX) maxPX = p.x;
        if (p.y > maxPY) maxPY = p.y;
      }
    }
  }

  const projW = maxPX - minPX;
  const projH = maxPY - minPY;
  const scale =
    projW > 0 && projH > 0
      ? Math.min(iw / projW, ih / projH)
      : 1;
  const kx = baseKX * scale;
  const ky = baseKY * scale;
  // Translate so the projected bbox starts at (0, 0) inside the margin.
  const offsetX = -minPX * scale;
  const offsetY = -minPY * scale;

  function p3(x: number, y: number, z: number): Proj2D {
    const p = project(x, y, z, kx, ky);
    return { x: p.x + offsetX, y: p.y + offsetY };
  }

  // Normalise all polygons to CCW order in map space. We rely on a
  // consistent winding for side-face visibility tests below.
  const stateData = STATES.map((s) => {
    const fp = signedArea(s.footprint) < 0 ? [...s.footprint].reverse() : [...s.footprint];
    return { ...s, footprint: fp };
  });

  // Back-to-front sort. Use each state's footprint centroid's depth key.
  const sorted = [...stateData].sort(
    (a, b) => depthKey(centroid(a.footprint)) - depthKey(centroid(b.footprint)),
  );
  // Wait — larger depthKey should be farther ... actually in our setup:
  // - y larger = more south = farther FROM north, but in projected screen
  //   y=0 is north and screens grow downward, so "south" ends up LOWER
  //   on screen (larger screen-y).
  // - For a painter's algorithm we want the FARTHEST state drawn first
  //   (behind). The "farthest" in our view is the one with the smallest
  //   projected screen-y (= smallest map-y, i.e. northernmost). So we
  //   sort by -depthKey for farthest-first, but because of how painter's
  //   algorithm works we draw in ascending "distance-from-viewer" order
  //   so that later draws overwrite earlier ones. Smaller map-y = closer
  //   to "back" of scene, drawn first. That's exactly ascending depthKey.
  // → the sort above is correct: ascending depthKey = north first = back first.

  // Prism geometry for one state.
  function prismGeometry(s: State) {
    const z = s.population * heightScale;
    const baseProj = s.footprint.map(([x, y]) => p3(x, y, 0));
    const topProj = s.footprint.map(([x, y]) => p3(x, y, z));

    // Determine which side faces are visible. Going around the footprint
    // CCW in map space, edge i→i+1 has outward normal (in map space)
    // pointing to the right of the edge direction. A side is "front-
    // facing" if its projected outward normal points TOWARD the viewer
    // on screen, which after our projection corresponds to the edge's
    // projected 2D normal having a positive y component (screen-down,
    // i.e. toward the front of the axonometric scene).
    //
    // In practice: with CCW winding and our projection, the viewer sees
    // sides whose projected edge direction goes "right-and-up" or
    // "right-and-down" but NOT the north-facing far sides. We test the
    // cross product of the projected edge against the projected up-axis
    // (0, -1, because screen-y grows downward). A positive cross means
    // the outward normal has a component toward +screen-y, i.e. toward
    // the viewer.
    const sides: Array<{ path: string; visible: boolean }> = [];
    const n = s.footprint.length;
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      const b0 = baseProj[i];
      const b1 = baseProj[j];
      const t1 = topProj[j];
      const t0 = topProj[i];
      // Projected edge (base i → base j).
      const ex = b1.x - b0.x;
      const ey = b1.y - b0.y;
      // Outward-normal component toward viewer: sign of cross((ex, ey), (0, -1))
      // cross2d((ex, ey), (0, -1)) = ex * (-1) - ey * 0 = -ex.
      // Positive cross → normal points +screen-y (down = toward viewer).
      // For CCW footprint in map space, outward normal is to the RIGHT
      // of the edge direction. After projection the "right" may flip;
      // we empirically use: visible = (ex > 0 || (cross product test)).
      // Simplest robust check: compute the 2D cross of the edge with
      // the camera direction (0, -1) — but in 2D that's just -ex.
      // A side face is visible when its midpoint's projected x lies
      // "between" the base and some reference → we use the clearer
      // geometric test: compute the outward-normal direction in MAP
      // space (perpendicular to edge, pointing away from the polygon
      // centroid), then project that normal and test if it points
      // toward +screen-y (toward viewer).
      const [cx, cy] = centroid(s.footprint);
      const [mx, my] = s.footprint[i];
      const [nx, ny] = s.footprint[j];
      // Midpoint of edge in map space
      const midX = (mx + nx) / 2;
      const midY = (my + ny) / 2;
      // Outward direction in map space: midpoint - centroid, perpendicular-ish
      const outMX = midX - cx;
      const outMY = midY - cy;
      // Project both the centroid and midpoint at z=0; the side is visible
      // if the midpoint's projected y is GREATER than the centroid's
      // projected y (i.e. lies further "toward viewer" on screen).
      const pc = p3(cx, cy, 0);
      const pm = p3(midX, midY, 0);
      const viewerDot = (pm.y - pc.y) * 1 + (pm.x - pc.x) * 0.001; // dominantly screen-y
      // Fall back to map-space signal: favour south-facing (+y) and
      // east-facing (+x) edges.
      const mapSignal = outMY * 1 + outMX * 0.4;
      const visible = viewerDot > 0 || mapSignal > 0;

      sides.push({
        path: polyPath([b0, b1, t1, t0]),
        visible,
      });
    }

    return {
      z,
      basePath: polyPath(baseProj),
      topPath: polyPath(topProj),
      baseProj,
      topProj,
      sides,
    };
  }

  // Precompute geometry for all states in sorted draw order.
  const drawn = sorted.map((s) => ({ state: s, geom: prismGeometry(s) }));

  // Anchor targets — we need the state objects regardless of sort order.
  const california = drawn.find((d) => d.state.code === "CA");
  const texas = drawn.find((d) => d.state.code === "TX");
  const montana = drawn.find((d) => d.state.code === "MT");
  const newYork = drawn.find((d) => d.state.code === "NY");

  // Reference z-axis indicator: vertical tick at a back-corner of the
  // plot, labelled "POP". Place it at the upper-left corner of the map.
  const zAxisBaseMap = p3(0, 0, 0);
  const zAxisTopMap = p3(0, 0, maxPop * heightScale);

  // For the "base-map" anchor, get the footprint centroid of one flat
  // state (Montana) so the pin sits on the base plane, not on a tall side.
  const mtCentroidProj = montana
    ? (() => {
        const c = centroid(montana.state.footprint);
        return p3(c[0], c[1], 0);
      })()
    : null;

  return (
    <svg width={width} height={height} role="img" aria-label="Prism map">
      <Group left={margin.left} top={margin.top}>
        {/* Faint base-plane outline in the back — a quadrilateral from
            map corners (0,0), (10,0), (10,4), (0,4) projected at z=0.
            Gives the eye a ground to anchor the prisms on. */}
        <g data-data-layer="true">
          <path
            d={polyPath([
              p3(0, 0, 0),
              p3(10, 0, 0),
              p3(10, 4, 0),
              p3(0, 4, 0),
            ])}
            fill="var(--color-ink)"
            fillOpacity={0.04}
            stroke="var(--color-hairline)"
            strokeWidth={1}
          />
        </g>

        {/* Prisms — back-to-front. For each state: side faces first
            (only the visible ones), then the top face. Because prisms
            are disjoint in map space we don't need inter-state BSP. */}
        <g data-data-layer="true">
          {drawn.map(({ state, geom }) => (
            <g key={state.code}>
              {/* Side faces — visible only */}
              {geom.sides.map((side, i) =>
                side.visible ? (
                  <path
                    key={`${state.code}-s${i}`}
                    d={side.path}
                    fill="var(--color-ink)"
                    fillOpacity={0.22}
                    stroke="var(--color-ink)"
                    strokeOpacity={0.45}
                    strokeWidth={0.6}
                    strokeLinejoin="round"
                  />
                ) : null,
              )}
              {/* Top face — lighter fill so it reads as "lit" versus
                  the side faces. */}
              <path
                d={geom.topPath}
                fill="var(--color-ink)"
                fillOpacity={0.12}
                stroke="var(--color-ink)"
                strokeOpacity={0.7}
                strokeWidth={0.8}
                strokeLinejoin="round"
              />
            </g>
          ))}
        </g>

        {/* State labels on the top face of each prism (centroid). Skip
            tiny prisms to avoid clutter. */}
        <g>
          {drawn.map(({ state, geom }) => {
            const c = centroid(state.footprint);
            const pLabel = p3(c[0], c[1], geom.z);
            if (state.population < 2) return null;
            return (
              <text
                key={`lbl-${state.code}`}
                x={pLabel.x}
                y={pLabel.y - 2}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                {state.code}
              </text>
            );
          })}
        </g>

        {/* Z-axis reference: vertical line at the back-left corner of
            the base plane with a "POP (M)" label. */}
        <g>
          <line
            x1={zAxisBaseMap.x}
            y1={zAxisBaseMap.y}
            x2={zAxisTopMap.x}
            y2={zAxisTopMap.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 2"
          />
          <text
            x={zAxisTopMap.x - 4}
            y={zAxisTopMap.y - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {maxPop.toFixed(0)}M
          </text>
          <text
            x={zAxisBaseMap.x - 4}
            y={zAxisBaseMap.y - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            0
          </text>
        </g>

        {/* Anchor 1 — a single prism (California, the tallest up front) */}
        {california &&
          (() => {
            const c = centroid(california.state.footprint);
            const base = p3(c[0], c[1], 0);
            const top = p3(c[0], c[1], california.geom.z);
            const pinX = top.x + 20;
            const pinY = top.y + 2;
            // Bounding rect around the projected prism.
            const allPts = [...california.geom.baseProj, ...california.geom.topProj];
            const minX = Math.min(...allPts.map((p) => p.x));
            const maxX = Math.max(...allPts.map((p) => p.x));
            const minY = Math.min(...allPts.map((p) => p.y));
            const maxY = Math.max(...allPts.map((p) => p.y));
            return (
              <ExplainAnchor
                selector="prism"
                index={1}
                pin={{ x: pinX, y: pinY }}
                rect={{
                  x: Math.max(0, minX),
                  y: Math.max(0, minY),
                  width: Math.min(iw, maxX - minX),
                  height: Math.min(ih, maxY - minY),
                }}
              >
                <line
                  x1={base.x}
                  y1={base.y}
                  x2={top.x}
                  y2={top.y}
                  stroke="var(--color-ink)"
                  strokeWidth={1}
                  strokeDasharray="1 2"
                />
              </ExplainAnchor>
            );
          })()}

        {/* Anchor 2 — height encoding (z-axis reference line) */}
        <ExplainAnchor
          selector="height-encoding"
          index={2}
          pin={{
            x: zAxisTopMap.x - 20,
            y: (zAxisBaseMap.y + zAxisTopMap.y) / 2,
          }}
          rect={{
            x: Math.max(0, zAxisTopMap.x - 16),
            y: Math.max(0, zAxisTopMap.y - 4),
            width: 24,
            height: Math.max(8, zAxisBaseMap.y - zAxisTopMap.y + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the projection / axonometric view */}
        {texas &&
          (() => {
            // Put the projection anchor on one of Texas's visible side faces
            // so the viewer sees the 3D depth cue.
            const c = centroid(texas.state.footprint);
            const p = p3(c[0], c[1], texas.geom.z / 2);
            const allPts = [...texas.geom.baseProj, ...texas.geom.topProj];
            const minX = Math.min(...allPts.map((pp) => pp.x));
            const maxX = Math.max(...allPts.map((pp) => pp.x));
            const minY = Math.min(...allPts.map((pp) => pp.y));
            const maxY = Math.max(...allPts.map((pp) => pp.y));
            return (
              <ExplainAnchor
                selector="projection"
                index={3}
                pin={{ x: p.x, y: maxY + 14 }}
                rect={{
                  x: Math.max(0, minX),
                  y: Math.max(0, minY),
                  width: Math.min(iw, maxX - minX),
                  height: Math.min(ih, maxY - minY),
                }}
              >
                <g />
              </ExplainAnchor>
            );
          })()}

        {/* Anchor 4 — occlusion risk (the back row of short prisms) */}
        {montana &&
          (() => {
            const c = centroid(montana.state.footprint);
            const top = p3(c[0], c[1], montana.geom.z);
            const allPts = [...montana.geom.baseProj, ...montana.geom.topProj];
            const minX = Math.min(...allPts.map((pp) => pp.x));
            const maxX = Math.max(...allPts.map((pp) => pp.x));
            const minY = Math.min(...allPts.map((pp) => pp.y));
            const maxY = Math.max(...allPts.map((pp) => pp.y));
            return (
              <ExplainAnchor
                selector="occlusion"
                index={4}
                pin={{ x: top.x, y: minY - 10 }}
                rect={{
                  x: Math.max(0, minX),
                  y: Math.max(0, minY),
                  width: Math.min(iw, maxX - minX),
                  height: Math.min(ih, maxY - minY),
                }}
              >
                <g />
              </ExplainAnchor>
            );
          })()}

        {/* Anchor 5 — base map (the shared geographic plane) */}
        {mtCentroidProj && (
          <ExplainAnchor
            selector="base-map"
            index={5}
            pin={{
              x: p3(7, 0.2, 0).x,
              y: p3(7, 0.2, 0).y - 6,
            }}
            rect={{
              x: Math.max(0, p3(0, 0, 0).x),
              y: Math.max(0, p3(10, 0, 0).y),
              width: Math.min(iw, p3(10, 0, 0).x - p3(0, 0, 0).x),
              height: Math.min(
                ih,
                p3(0, 4, 0).y - p3(10, 0, 0).y,
              ),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 6 — tall vs short contrast (NY vs WA in the back row) */}
        {newYork &&
          (() => {
            const c = centroid(newYork.state.footprint);
            const top = p3(c[0], c[1], newYork.geom.z);
            const allPts = [...newYork.geom.baseProj, ...newYork.geom.topProj];
            const minX = Math.min(...allPts.map((pp) => pp.x));
            const maxX = Math.max(...allPts.map((pp) => pp.x));
            const minY = Math.min(...allPts.map((pp) => pp.y));
            const maxY = Math.max(...allPts.map((pp) => pp.y));
            return (
              <ExplainAnchor
                selector="value-contrast"
                index={6}
                pin={{ x: top.x + 22, y: top.y + 2 }}
                rect={{
                  x: Math.max(0, minX),
                  y: Math.max(0, minY),
                  width: Math.min(iw, maxX - minX),
                  height: Math.min(ih, maxY - minY),
                }}
              >
                <g />
              </ExplainAnchor>
            );
          })()}
      </Group>
    </svg>
  );
}
