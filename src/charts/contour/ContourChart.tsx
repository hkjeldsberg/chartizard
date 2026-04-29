"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Two-peak 2D Gaussian mixture. Evaluate on a uniform grid, then extract
// iso-density line segments via a marching-squares pass per level.
const DOMAIN_X: [number, number] = [-2.5, 2.5];
const DOMAIN_Y: [number, number] = [-2, 2];
const GRID_N = 48; // 48×48 grid — smooth enough without over-drawing.

// Two peaks with different widths, different weights.
const PEAKS = [
  { mx: -0.8, my: 0.5, sx: 0.55, sy: 0.7, w: 1.0 },
  { mx: 1.0, my: -0.3, sx: 0.45, sy: 0.5, w: 0.8 },
] as const;

function f(x: number, y: number): number {
  let sum = 0;
  for (const p of PEAKS) {
    const dx = (x - p.mx) / p.sx;
    const dy = (y - p.my) / p.sy;
    sum += (p.w / (2 * Math.PI * p.sx * p.sy)) * Math.exp(-0.5 * (dx * dx + dy * dy));
  }
  return sum;
}

type Segment = [[number, number], [number, number]];

// Linear interpolation along one cell edge — return the t where f == level.
function interp(a: number, b: number, level: number): number {
  const d = b - a;
  if (Math.abs(d) < 1e-12) return 0.5;
  return (level - a) / d;
}

// Marching-squares on a regular grid. Returns line segments in data coords.
// Saddle cells (case 5 / 10) are resolved with the "connect by minor" rule
// using the mean of the four corners.
function marchingSquares(
  grid: number[][],
  xs: number[],
  ys: number[],
  level: number,
): Segment[] {
  const segments: Segment[] = [];
  const rows = grid.length; // = ys.length
  const cols = grid[0].length; // = xs.length

  for (let j = 0; j < rows - 1; j++) {
    for (let i = 0; i < cols - 1; i++) {
      const tl = grid[j][i]; // top-left
      const tr = grid[j][i + 1]; // top-right
      const br = grid[j + 1][i + 1]; // bottom-right
      const bl = grid[j + 1][i]; // bottom-left

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

      // Edge crossings — parametrised along each side.
      const top: [number, number] = [x0 + (x1 - x0) * interp(tl, tr, level), y0];
      const right: [number, number] = [x1, y0 + (y1 - y0) * interp(tr, br, level)];
      const bottom: [number, number] = [x0 + (x1 - x0) * interp(bl, br, level), y1];
      const left: [number, number] = [x0, y0 + (y1 - y0) * interp(tl, bl, level)];

      // Saddle resolution: compare the cell-centre value to the level.
      const centre = (tl + tr + br + bl) / 4;

      switch (code) {
        case 1:
        case 14:
          segments.push([left, bottom]);
          break;
        case 2:
        case 13:
          segments.push([bottom, right]);
          break;
        case 3:
        case 12:
          segments.push([left, right]);
          break;
        case 4:
        case 11:
          segments.push([top, right]);
          break;
        case 6:
        case 9:
          segments.push([top, bottom]);
          break;
        case 7:
        case 8:
          segments.push([top, left]);
          break;
        case 5:
          // Ambiguous: either connect {top,left}+{bottom,right} or the other pairing.
          if (centre >= level) {
            segments.push([top, right]);
            segments.push([bottom, left]);
          } else {
            segments.push([top, left]);
            segments.push([bottom, right]);
          }
          break;
        case 10:
          if (centre >= level) {
            segments.push([top, left]);
            segments.push([bottom, right]);
          } else {
            segments.push([top, right]);
            segments.push([bottom, left]);
          }
          break;
        default:
          break;
      }
    }
  }
  return segments;
}

// Stitch segments into polylines for clean stroke rendering. Quantises endpoints
// to a small epsilon so floating-point drift across adjacent cells still joins.
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

    // Extend forward from b.
    let tail = b;
    for (;;) {
      const neighbours = adj.get(key(tail)) ?? [];
      const next = neighbours.find((n) => !used[n.idx]);
      if (!next) break;
      used[next.idx] = true;
      line.push(next.other);
      tail = next.other;
    }

    // Extend backward from a.
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

interface Props {
  width: number;
  height: number;
}

export function ContourChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { levelsData, peakA, peakB } = useMemo(() => {
    const xs: number[] = [];
    const ys: number[] = [];
    const stepX = (DOMAIN_X[1] - DOMAIN_X[0]) / (GRID_N - 1);
    const stepY = (DOMAIN_Y[1] - DOMAIN_Y[0]) / (GRID_N - 1);
    for (let i = 0; i < GRID_N; i++) xs.push(DOMAIN_X[0] + i * stepX);
    for (let j = 0; j < GRID_N; j++) ys.push(DOMAIN_Y[0] + j * stepY);
    const grid: number[][] = ys.map((y) => xs.map((x) => f(x, y)));

    const levels = [0.05, 0.12, 0.22, 0.34];
    const levelOut = levels.map((lvl) => {
      const segs = marchingSquares(grid, xs, ys, lvl);
      return { level: lvl, lines: stitch(segs) };
    });

    return {
      levelsData: levelOut,
      peakA: { x: PEAKS[0].mx, y: PEAKS[0].my },
      peakB: { x: PEAKS[1].mx, y: PEAKS[1].my },
    };
  }, []);

  const xScale = scaleLinear({ domain: DOMAIN_X, range: [0, iw] });
  const yScale = scaleLinear({ domain: DOMAIN_Y, range: [ih, 0] });

  const toPathD = (pts: Array<[number, number]>) =>
    pts
      .map(([x, y], i) => `${i === 0 ? "M" : "L"}${xScale(x).toFixed(2)} ${yScale(y).toFixed(2)}`)
      .join(" ");

  // Stroke weight climbs with level so the inner rings read as "peak".
  const levelCount = levelsData.length;
  const strokeFor = (i: number) => 0.9 + (i / Math.max(1, levelCount - 1)) * 1.3;
  const opacityFor = (i: number) => 0.4 + (i / Math.max(1, levelCount - 1)) * 0.55;

  const peakAPx = { x: xScale(peakA.x), y: yScale(peakA.y) };
  const peakBPx = { x: xScale(peakB.x), y: yScale(peakB.y) };

  // Innermost ring is the last entry (highest level). Use it for the "ring"
  // anchor rect — clamped to plot bounds below via Math.max/min.
  const innerLevel = levelsData[levelsData.length - 1];
  const outerLevel = levelsData[0];

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

  const innerRect = {
    x: clamp(peakAPx.x - 28, 0, iw),
    y: clamp(peakAPx.y - 24, 0, ih),
    width: clamp(56, 0, iw),
    height: clamp(48, 0, ih),
  };

  const outerRect = {
    x: 0,
    y: 0,
    width: iw,
    height: ih,
  };

  // Saddle / valley between the peaks — anchor the "widely spaced contours"
  // concept on the gap.
  const saddleX = (peakA.x + peakB.x) / 2;
  const saddleY = (peakA.y + peakB.y) / 2;
  const saddlePx = { x: xScale(saddleX), y: yScale(saddleY) };

  return (
    <svg width={width} height={height} role="img" aria-label="Contour plot">
      <Group left={margin.left} top={margin.top}>
        {/* Plot frame + faint grid */}
        <g data-data-layer="true">
          <rect
            x={0}
            y={0}
            width={iw}
            height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
          {xScale.ticks(5).map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Outer (lowest) contour — the outer silhouette of the distribution. */}
        <ExplainAnchor
          selector="outer-contour"
          index={1}
          pin={{ x: clamp(xScale(-1.9), 10, iw - 10), y: clamp(yScale(1.6), 10, ih - 10) }}
          rect={outerRect}
        >
          <g data-data-layer="true">
            {outerLevel.lines.map((line, li) => (
              <path
                key={`outer-${li}`}
                d={toPathD(line)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={strokeFor(0)}
                strokeOpacity={opacityFor(0)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Intermediate levels — rendered plainly, no anchor each. */}
        <g data-data-layer="true">
          {levelsData.slice(1, -1).map((lv, idx) => {
            const i = idx + 1; // absolute index for stroke/opacity
            return (
              <g key={`lvl-${lv.level}`}>
                {lv.lines.map((line, li) => (
                  <path
                    key={`mid-${i}-${li}`}
                    d={toPathD(line)}
                    fill="none"
                    stroke="var(--color-ink)"
                    strokeWidth={strokeFor(i)}
                    strokeOpacity={opacityFor(i)}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                ))}
              </g>
            );
          })}
        </g>

        {/* Inner (highest) contour — tight ring around the dominant peak. */}
        <ExplainAnchor
          selector="inner-ring"
          index={2}
          pin={{ x: clamp(peakAPx.x + 26, 10, iw - 10), y: clamp(peakAPx.y - 22, 10, ih - 10) }}
          rect={innerRect}
        >
          <g data-data-layer="true">
            {innerLevel.lines.map((line, li) => (
              <path
                key={`inner-${li}`}
                d={toPathD(line)}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={strokeFor(levelCount - 1)}
                strokeOpacity={opacityFor(levelCount - 1)}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Peak markers — small crosses at the analytic peaks. */}
        <g data-data-layer="true">
          {[peakAPx, peakBPx].map((p, i) => (
            <g key={`peak-${i}`}>
              <line
                x1={p.x - 4}
                x2={p.x + 4}
                y1={p.y}
                y2={p.y}
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
              <line
                x1={p.x}
                x2={p.x}
                y1={p.y - 4}
                y2={p.y + 4}
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            </g>
          ))}
        </g>

        {/* Peak anchor — pin the taller peak. */}
        <ExplainAnchor
          selector="peak"
          index={3}
          pin={{ x: clamp(peakAPx.x - 18, 10, iw - 10), y: clamp(peakAPx.y + 18, 10, ih - 10) }}
          rect={{
            x: clamp(peakAPx.x - 10, 0, iw),
            y: clamp(peakAPx.y - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Saddle — the sparse corridor between peaks reads as "low gradient". */}
        <ExplainAnchor
          selector="saddle"
          index={4}
          pin={{ x: clamp(saddlePx.x, 10, iw - 10), y: clamp(saddlePx.y - 16, 10, ih - 10) }}
          rect={{
            x: clamp(saddlePx.x - 18, 0, iw),
            y: clamp(saddlePx.y - 14, 0, ih),
            width: 36,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            X
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 10,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Y
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
