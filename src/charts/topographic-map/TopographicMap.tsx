"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Elevation model ────────────────────────────────────────────────────────
// Three Gaussian peaks on an 80×60 integer grid (x: 0..79, y: 0..59).
// Elevation z(x,y) = sum of three Gaussian contributions.

interface Peak {
  cx: number;
  cy: number;
  amp: number;
  sigma: number;
  label: string;
  spotHeight: string;
}

const PEAKS: ReadonlyArray<Peak> = [
  { cx: 30, cy: 40, amp: 1200, sigma: 20, label: "Mt. Alba", spotHeight: "1247 m" },
  { cx: 70, cy: 60, amp: 900,  sigma: 15, label: "Pt. Vern",  spotHeight: "887 m"  },
  { cx: 50, cy: 20, amp: 600,  sigma: 12, label: "Col. Ossa", spotHeight: "598 m"  },
];

const GRID_W = 80;
const GRID_H = 60;

function elevation(x: number, y: number): number {
  let z = 0;
  for (const p of PEAKS) {
    const dx = x - p.cx;
    const dy = y - p.cy;
    z += p.amp * Math.exp(-0.5 * (dx * dx + dy * dy) / (p.sigma * p.sigma));
  }
  return z;
}

// ─── Marching-squares (same pattern as ContourChart.tsx) ────────────────────
type Segment = [[number, number], [number, number]];

function interp(a: number, b: number, level: number): number {
  const d = b - a;
  if (Math.abs(d) < 1e-12) return 0.5;
  return (level - a) / d;
}

function marchingSquares(
  grid: number[][],
  xs: number[],
  ys: number[],
  level: number,
): Segment[] {
  const segments: Segment[] = [];
  const rows = grid.length;
  const cols = grid[0].length;

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = grid[j][i];
      const tr = grid[j][i + 1];
      const br = grid[j + 1][i + 1];
      const bl = grid[j + 1][i];

      let code = 0;
      if (tl >= level) code |= 8;
      if (tr >= level) code |= 4;
      if (br >= level) code |= 2;
      if (bl >= level) code |= 1;
      if (code === 0 || code === 15) continue;

      const x0 = xs[i];
      const x1 = xs[i + 1];
      const y0 = ys[j];
      const y1 = ys[j + 1];

      const top:    [number, number] = [x0 + (x1 - x0) * interp(tl, tr, level), y0];
      const right:  [number, number] = [x1, y0 + (y1 - y0) * interp(tr, br, level)];
      const bottom: [number, number] = [x0 + (x1 - x0) * interp(bl, br, level), y1];
      const left:   [number, number] = [x0, y0 + (y1 - y0) * interp(tl, bl, level)];

      const centre = (tl + tr + br + bl) / 4;

      switch (code) {
        case 1: case 14: segments.push([left, bottom]); break;
        case 2: case 13: segments.push([bottom, right]); break;
        case 3: case 12: segments.push([left, right]); break;
        case 4: case 11: segments.push([top, right]); break;
        case 6: case 9:  segments.push([top, bottom]); break;
        case 7: case 8:  segments.push([top, left]); break;
        case 5:
          if (centre >= level) {
            segments.push([top, right]); segments.push([bottom, left]);
          } else {
            segments.push([top, left]); segments.push([bottom, right]);
          }
          break;
        case 10:
          if (centre >= level) {
            segments.push([top, left]); segments.push([bottom, right]);
          } else {
            segments.push([top, right]); segments.push([bottom, left]);
          }
          break;
        default: break;
      }
    }
  }
  return segments;
}

function stitch(segments: Segment[]): Array<Array<[number, number]>> {
  const EPS = 1e-6;
  const key = (p: [number, number]) =>
    `${Math.round(p[0] / EPS)}|${Math.round(p[1] / EPS)}`;

  const adj = new Map<string, Array<{ other: [number, number]; idx: number }>>();
  segments.forEach((seg, idx) => {
    const [a, b] = seg;
    const ka = key(a);
    const kb = key(b);
    if (!adj.has(ka)) adj.set(ka, []);
    if (!adj.has(kb)) adj.set(kb, []);
    adj.get(ka)!.push({ other: b, idx });
    adj.get(kb)!.push({ other: a, idx });
  });

  const used = new Array(segments.length).fill(false);
  const lines: Array<Array<[number, number]>> = [];

  for (let i = 0; i < segments.length; i++) {
    if (used[i]) continue;
    used[i] = true;
    const [a, b] = segments[i];
    const line: Array<[number, number]> = [a, b];

    let tail = b;
    for (;;) {
      const neighbours = adj.get(key(tail)) ?? [];
      const next = neighbours.find((n) => !used[n.idx]);
      if (!next) break;
      used[next.idx] = true;
      line.push(next.other);
      tail = next.other;
    }

    let head = a;
    for (;;) {
      const neighbours = adj.get(key(head)) ?? [];
      const next = neighbours.find((n) => !used[n.idx]);
      if (!next) break;
      used[next.idx] = true;
      line.unshift(next.other);
      head = next.other;
    }

    lines.push(line);
  }
  return lines;
}

// ─── Hachure generation ─────────────────────────────────────────────────────
// For a contour polyline, compute short ticks perpendicular on the downslope
// side. Downslope direction = away from the elevation peak. We sample every
// N-th point along each polyline and emit a short perpendicular tick pointing
// in the direction of decreasing elevation.

function hachureTick(
  ax: number, ay: number,  // point along contour
  bx: number, by: number,  // next point along contour
  gradX: number, gradY: number, // gradient of elevation at (ax, ay) in data space
  tickLen: number,
): [number, number, number, number] | null {
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len < 1e-8) return null;

  // Perpendicular: rotate 90° both ways, pick the one that opposes the gradient
  // (i.e. dot product with negative gradient is positive → downslope).
  const px1 = -dy / len;
  const py1 =  dx / len;
  const px2 =  dy / len;
  const py2 = -dx / len;

  // Gradient points upslope; downslope = -gradient.
  const dot1 = px1 * (-gradX) + py1 * (-gradY);
  const px = dot1 >= 0 ? px1 : px2;
  const py = dot1 >= 0 ? py1 : py2;

  return [ax, ay, ax + px * tickLen, ay + py * tickLen];
}

// Gradient of elevation at grid coords (gx, gy) using central differences.
function elevGradient(gx: number, gy: number): [number, number] {
  const h = 0.5;
  const dzdx = (elevation(gx + h, gy) - elevation(gx - h, gy)) / (2 * h);
  const dzdy = (elevation(gx, gy + h) - elevation(gx, gy - h)) / (2 * h);
  return [dzdx, dzdy];
}

// ─── Component ──────────────────────────────────────────────────────────────

const CONTOUR_LEVELS = [100, 200, 400, 600, 800, 1000, 1200];
// Index spacing every 2 levels = major index lines (400, 800, 1200)
const MAJOR_LEVELS = new Set([400, 800, 1200]);

// Hachure tick every N-th contour sample; tick length in grid units.
const HACHURE_STRIDE = 5;
const HACHURE_LEN_DATA = 1.2; // in grid units

interface Props {
  width: number;
  height: number;
}

export function TopographicMap({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 36, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Scale: grid cell [0..GRID_W-1] × [0..GRID_H-1] → pixels
  const toX = (gx: number) => (gx / (GRID_W - 1)) * iw;
  const toY = (gy: number) => (gy / (GRID_H - 1)) * ih;

  const { contoursData, peaksPx, riverPath, trailPath } = useMemo(() => {
    // Build elevation grid
    const xs: number[] = [];
    const ys: number[] = [];
    for (let i = 0; i < GRID_W; i++) xs.push(i);
    for (let j = 0; j < GRID_H; j++) ys.push(j);
    const grid: number[][] = ys.map((y) => xs.map((x) => elevation(x, y)));

    // Extract contours per level
    const contoursData = CONTOUR_LEVELS.map((level) => {
      const segs = marchingSquares(grid, xs, ys, level);
      const lines = stitch(segs);

      // Build hachure ticks for this level
      const ticks: Array<[number, number, number, number]> = [];
      for (const polyline of lines) {
        for (let k = 0; k + 1 < polyline.length; k += HACHURE_STRIDE) {
          const [ax, ay] = polyline[k];
          const [bx, by] = polyline[k + 1];
          const mx = (ax + bx) / 2;
          const my = (ay + by) / 2;
          const [gx, gy] = elevGradient(mx, my);
          const tick = hachureTick(ax, ay, bx, by, gx, gy, HACHURE_LEN_DATA);
          if (tick) ticks.push(tick);
        }
      }

      return { level, lines, ticks };
    });

    // Peak pixel positions (in grid coords for now)
    const peaksPx = PEAKS.map((p) => ({
      ...p,
      gx: p.cx,
      gy: p.cy,
    }));

    // River: follows the valley between peaks A and B.
    // Approximate with a gentle bezier-like path in data coords.
    // River starts near peak A base (35, 52) and meanders to map edge (0, 55).
    const riverPath =
      `M ${xs[35]},${ys[52]} ` +
      `Q ${xs[22]},${ys[56]} ${xs[10]},${ys[54]} ` +
      `Q ${xs[4]},${ys[55]} ${xs[0]},${ys[57]}`;

    // Trail: a dashed line cutting across mid-elevation
    const trailPath =
      `M ${xs[10]},${ys[15]} ` +
      `L ${xs[28]},${ys[25]} ` +
      `L ${xs[48]},${ys[20]} ` +
      `L ${xs[62]},${ys[30]} ` +
      `L ${xs[75]},${ys[40]}`;

    return { contoursData, peaksPx, riverPath, trailPath };
  }, []);

  const toPathD = (pts: Array<[number, number]>) =>
    pts
      .map(
        ([gx, gy], i) =>
          `${i === 0 ? "M" : "L"}${toX(gx).toFixed(2)} ${toY(gy).toFixed(2)}`,
      )
      .join(" ");

  const toTickPath = (tick: [number, number, number, number]) =>
    `M${toX(tick[0]).toFixed(2)} ${toY(tick[1]).toFixed(2)} L${toX(tick[2]).toFixed(2)} ${toY(tick[3]).toFixed(2)}`;

  const toRiverD = (d: string) => {
    // The river path uses xs[n] / ys[n] which are just integer indices.
    // Re-parse and convert through toX/toY.
    // Instead, rebuild directly from the known control points:
    return (
      `M ${toX(35).toFixed(1)},${toY(52).toFixed(1)} ` +
      `Q ${toX(22).toFixed(1)},${toY(56).toFixed(1)} ${toX(10).toFixed(1)},${toY(54).toFixed(1)} ` +
      `Q ${toX(4).toFixed(1)},${toY(55).toFixed(1)} ${toX(0).toFixed(1)},${toY(57).toFixed(1)}`
    );
  };

  const toTrailD = () =>
    `M ${toX(10).toFixed(1)},${toY(15).toFixed(1)} ` +
    `L ${toX(28).toFixed(1)},${toY(25).toFixed(1)} ` +
    `L ${toX(48).toFixed(1)},${toY(20).toFixed(1)} ` +
    `L ${toX(62).toFixed(1)},${toY(30).toFixed(1)} ` +
    `L ${toX(75).toFixed(1)},${toY(40).toFixed(1)}`;

  // Anchor coordinates (pixel space inside the Group transform)
  // Peak A (largest peak, cx=30, cy=40)
  const peakA = peaksPx[0];
  const peakAPx = { x: toX(peakA.gx), y: toY(peakA.gy) };
  // Peak B (cx=70, cy=60)
  const peakB = peaksPx[1];
  const peakBPx = { x: toX(peakB.gx), y: toY(peakB.gy) };
  // Peak C (cx=50, cy=20)
  const peakC = peaksPx[2];
  const peakCPx = { x: toX(peakC.gx), y: toY(peakC.gy) };

  // Innermost contour level for peak A = 1200m. If amp=1200 the 1200 contour
  // is a tiny ring right at the summit. Use 1000m for a visible closed ring.
  const innerContourData = contoursData.find((c) => c.level === 1000);
  const outerContourData = contoursData.find((c) => c.level === 100);

  // Hachure tick sample: pick hachures from the 400m contour for the anchor
  const hachureContourData = contoursData.find((c) => c.level === 400);
  // Pick first tick from hachureContourData
  const sampleHachure =
    hachureContourData && hachureContourData.ticks.length > 0
      ? hachureContourData.ticks[Math.floor(hachureContourData.ticks.length / 2)]
      : null;
  const hachurePinX = sampleHachure ? toX((sampleHachure[0] + sampleHachure[2]) / 2) : iw * 0.4;
  const hachurePinY = sampleHachure ? toY((sampleHachure[1] + sampleHachure[3]) / 2) + 14 : ih * 0.6;

  // River pin
  const riverPinX = toX(22);
  const riverPinY = toY(56) - 12;

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  // Closed-contour-around-peak anchor (innermost ring at 1000m around peak A)
  const closedContourPinX = clamp(peakAPx.x + 22, 10, iw - 10);
  const closedContourPinY = clamp(peakAPx.y - 20, 10, ih - 10);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Topographic relief map with contour lines, hachure marks, and spot heights"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Background fill */}
        <rect x={0} y={0} width={iw} height={ih} fill="var(--color-surface)" opacity={0.4} />

        {/* Outer contour (100m) — the broadest visible ring */}
        <ExplainAnchor
          selector="contour-line"
          index={1}
          pin={{ x: clamp(toX(5), 10, iw - 10), y: clamp(toY(10), 10, ih - 10) }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {outerContourData?.lines.map((line, li) => (
              <path
                key={`outer-${li}`}
                d={toPathD(line)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={0.75}
                strokeOpacity={0.45}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Intermediate contour levels (200, 400, 600, 800) */}
        <g data-data-layer="true">
          {contoursData
            .filter((c) => c.level !== 100 && c.level !== 1000 && c.level !== 1200)
            .map((lv) => {
              const isMajor = MAJOR_LEVELS.has(lv.level);
              return (
                <g key={`lvl-${lv.level}`}>
                  {lv.lines.map((line, li) => (
                    <path
                      key={`cl-${lv.level}-${li}`}
                      d={toPathD(line)}
                      fill="none"
                      stroke="var(--color-ink)"
                      strokeWidth={isMajor ? 1.4 : 0.85}
                      strokeOpacity={isMajor ? 0.75 : 0.55}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  ))}
                </g>
              );
            })}
        </g>

        {/* Hachure marks on 400m contour */}
        <ExplainAnchor
          selector="hachure-marks"
          index={3}
          pin={{ x: clamp(hachurePinX, 10, iw - 10), y: clamp(hachurePinY, 10, ih - 10) }}
          rect={{
            x: clamp(hachurePinX - 24, 0, iw),
            y: clamp(hachurePinY - 24, 0, ih),
            width: 48,
            height: 48,
          }}
        >
          <g data-data-layer="true">
            {contoursData
              .filter((c) => c.level === 400 || c.level === 800)
              .flatMap((c) =>
                c.ticks.map((tick, ti) => (
                  <path
                    key={`hach-${c.level}-${ti}`}
                    d={toTickPath(tick)}
                    stroke="var(--color-ink)"
                    strokeWidth={0.6}
                    strokeOpacity={0.5}
                    strokeLinecap="round"
                  />
                )),
              )}
          </g>
        </ExplainAnchor>

        {/* Inner (highest visible) contour rings — 1000m + 1200m */}
        <ExplainAnchor
          selector="closed-contour-peak"
          index={4}
          pin={{ x: closedContourPinX, y: closedContourPinY }}
          rect={{
            x: clamp(peakAPx.x - 30, 0, iw),
            y: clamp(peakAPx.y - 30, 0, ih),
            width: 60,
            height: 60,
          }}
        >
          <g data-data-layer="true">
            {contoursData
              .filter((c) => c.level === 1000 || c.level === 1200)
              .map((lv) =>
                lv.lines.map((line, li) => (
                  <path
                    key={`inner-${lv.level}-${li}`}
                    d={toPathD(line)}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={lv.level === 1200 ? 1.8 : 1.4}
                    strokeOpacity={lv.level === 1200 ? 0.9 : 0.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                )),
              )}
          </g>
        </ExplainAnchor>

        {/* River */}
        <ExplainAnchor
          selector="river-line"
          index={6}
          pin={{ x: clamp(riverPinX, 10, iw - 10), y: clamp(riverPinY, 10, ih - 10) }}
          rect={{
            x: clamp(toX(0), 0, iw),
            y: clamp(toY(58), 0, ih),
            width: clamp(toX(40), 0, iw),
            height: clamp(toY(50) - toY(58), 0, ih),
          }}
        >
          <path
            d={toRiverD("")}
            fill="none"
            stroke="rgba(40,100,200,0.65)"
            strokeWidth={1.4}
            strokeDasharray="4 2"
            strokeLinecap="round"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Trail */}
        <path
          d={toTrailD()}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={1}
          strokeDasharray="3 3"
          strokeLinecap="round"
          data-data-layer="true"
        />

        {/* Spot heights — anchor 2 */}
        <ExplainAnchor
          selector="spot-height"
          index={2}
          pin={{
            x: clamp(peakAPx.x + 16, 10, iw - 10),
            y: clamp(peakAPx.y - 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(peakAPx.x - 18, 0, iw),
            y: clamp(peakAPx.y - 8, 0, ih),
            width: Math.min(60, iw - clamp(peakAPx.x - 18, 0, iw)),
            height: 16,
          }}
        >
          <g data-data-layer="true">
            {/* Peak markers (crosses) + labels */}
            {peaksPx.map((p, i) => {
              const px = i === 0 ? peakAPx : i === 1 ? peakBPx : peakCPx;
              return (
                <g key={`peak-${i}`}>
                  {/* Cross marker */}
                  <line
                    x1={px.x - 3}
                    x2={px.x + 3}
                    y1={px.y}
                    y2={px.y}
                    stroke="var(--color-ink)"
                    strokeWidth={1.2}
                  />
                  <line
                    x1={px.x}
                    x2={px.x}
                    y1={px.y - 3}
                    y2={px.y + 3}
                    stroke="var(--color-ink)"
                    strokeWidth={1.2}
                  />
                  {/* Spot height label */}
                  <text
                    x={px.x + 5}
                    y={px.y - 3}
                    fontFamily="var(--font-mono)"
                    fontSize={9}
                    fill="var(--color-ink)"
                  >
                    {p.spotHeight}
                  </text>
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Contour interval concept — anchor 5 */}
        {/* Pin sits between two contours on the flank of peak A */}
        <ExplainAnchor
          selector="contour-interval"
          index={5}
          pin={{
            x: clamp(toX(14), 10, iw - 10),
            y: clamp(toY(32), 10, ih - 10),
          }}
          rect={{
            x: clamp(toX(8), 0, iw),
            y: clamp(toY(38), 0, ih),
            width: clamp(toX(20) - toX(8), 0, iw - clamp(toX(8), 0, iw)),
            height: clamp(toY(26) - toY(38), 0, ih - clamp(toY(38), 0, ih)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Iso-value concept anchor — the space between contours on peak B's flank,
            representing the "3-D surface encoded as 2-D level curves" idea. */}
        <ExplainAnchor
          selector="3d-surface-concept"
          index={7}
          pin={{
            x: clamp(peakBPx.x - 20, 10, iw - 10),
            y: clamp(peakBPx.y - 20, 10, ih - 10),
          }}
          rect={{
            x: clamp(peakBPx.x - 28, 0, iw),
            y: clamp(peakBPx.y - 28, 0, ih),
            width: 56,
            height: 56,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Frame */}
        <rect
          x={0}
          y={0}
          width={iw}
          height={ih}
          fill="none"
          stroke="var(--color-hairline)"
          strokeWidth={0.75}
        />

        {/* Scale bar at bottom */}
        <g data-data-layer="true" transform={`translate(${iw - 72}, ${ih + 22})`}>
          <line x1={0} y1={0} x2={60} y2={0} stroke="var(--color-ink-mute)" strokeWidth={1} />
          <line x1={0} y1={-3} x2={0} y2={3} stroke="var(--color-ink-mute)" strokeWidth={1} />
          <line x1={60} y1={-3} x2={60} y2={3} stroke="var(--color-ink-mute)" strokeWidth={1} />
          <text
            x={30}
            y={10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            contour interval 200 m
          </text>
        </g>
      </Group>
    </svg>
  );
}
