"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// --- Sombrero surface: z = sin(r) / r on a square grid -------------------
// r = sqrt(x^2 + y^2); at the origin the limit is 1 (sinc-like behaviour).
const DOMAIN: [number, number] = [-8, 8];
const GRID_N = 25;
const ANGLE_DEG = 30;
const COS_A = Math.cos((ANGLE_DEG * Math.PI) / 180);
const SIN_A = Math.sin((ANGLE_DEG * Math.PI) / 180);

function sombrero(x: number, y: number): number {
  const r = Math.sqrt(x * x + y * y);
  if (r < 1e-6) return 1;
  return Math.sin(r) / r;
}

interface Props {
  width: number;
  height: number;
}

export function SurfacePlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Grid in world coordinates + their isometric projection.
  // We compute projected (sx, sy) for every (i, j) node, then draw two
  // sets of polylines: constant-y rows (x-curves) and constant-x columns.
  const { rows, cols, axisEnds, peakProjected, troughExample, plotTransform } =
    useMemo(() => {
      const step = (DOMAIN[1] - DOMAIN[0]) / (GRID_N - 1);
      const xs: number[] = [];
      const ys: number[] = [];
      for (let i = 0; i < GRID_N; i++) xs.push(DOMAIN[0] + i * step);
      for (let j = 0; j < GRID_N; j++) ys.push(DOMAIN[0] + j * step);

      // zScale multiplier — the sombrero's range is roughly [-0.22, 1.0].
      // Scale z so the rendered hat has visible depth relative to the footprint.
      const Z_SCALE = 6;

      type Node = { sx: number; sy: number; z: number };
      const nodes: Node[][] = ys.map((y) =>
        xs.map((x) => {
          const z = sombrero(x, y) * Z_SCALE;
          // Isometric: screen_x = (xw - yw) * cos(30), screen_y = (xw + yw) * sin(30) - z
          const sx = (x - y) * COS_A;
          const sy = (x + y) * SIN_A - z;
          return { sx, sy, z };
        }),
      );

      // Find bounds across all projected nodes + axis-tripod endpoints.
      const AXIS_LEN = DOMAIN[1];
      const axisX = {
        sx: (AXIS_LEN - 0) * COS_A,
        sy: (AXIS_LEN + 0) * SIN_A,
      };
      const axisY = {
        sx: (0 - AXIS_LEN) * COS_A,
        sy: (0 + AXIS_LEN) * SIN_A,
      };
      const axisZ = {
        sx: 0,
        sy: -AXIS_LEN * Z_SCALE * 0.25, // shorter z-axis indicator
      };
      const origin = { sx: 0, sy: 0 };

      let minX = Infinity,
        maxX = -Infinity,
        minY = Infinity,
        maxY = -Infinity;
      for (const row of nodes)
        for (const n of row) {
          if (n.sx < minX) minX = n.sx;
          if (n.sx > maxX) maxX = n.sx;
          if (n.sy < minY) minY = n.sy;
          if (n.sy > maxY) maxY = n.sy;
        }
      for (const p of [axisX, axisY, axisZ, origin]) {
        if (p.sx < minX) minX = p.sx;
        if (p.sx > maxX) maxX = p.sx;
        if (p.sy < minY) minY = p.sy;
        if (p.sy > maxY) maxY = p.sy;
      }

      // Fit into plot area with a small pad.
      const pad = 24;
      const worldW = Math.max(1e-6, maxX - minX);
      const worldH = Math.max(1e-6, maxY - minY);
      const scale = Math.min(
        (iw - pad * 2) / worldW,
        (ih - pad * 2) / worldH,
      );
      const centreOffsetX = (iw - worldW * scale) / 2 - minX * scale;
      const centreOffsetY = (ih - worldH * scale) / 2 - minY * scale;

      const toScreen = (p: { sx: number; sy: number }) => ({
        x: p.sx * scale + centreOffsetX,
        y: p.sy * scale + centreOffsetY,
      });

      // Build x-curves (one per y row, back-to-front).
      // In world-coord y increases upward; "back" is the row with largest
      // (x + y) sum contribution — i.e. furthest from viewer. With our
      // projection that is the highest y row. Draw from largest y to smallest.
      const xCurves: Array<{ path: string; zAvg: number }> = [];
      for (let j = ys.length - 1; j >= 0; j--) {
        const pts = nodes[j].map((n) => toScreen(n));
        const d = pts
          .map(
            (p, i) =>
              `${i === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
          )
          .join(" ");
        const zAvg =
          nodes[j].reduce((s, n) => s + n.z, 0) / nodes[j].length;
        xCurves.push({ path: d, zAvg });
      }

      // Build y-curves (one per x column, back-to-front).
      // Back-most column is largest x (since screen_x = (x - y)·cos, and we
      // paint back-to-front). We iterate x from min to max so near columns
      // overpaint far ones. Actually: "back" column is the one with biggest
      // (x + y) average — independent of x alone. With isometric + equal
      // footprint, iterate x from max to min so the front column paints last.
      const yCurves: Array<{ path: string; zAvg: number }> = [];
      for (let i = xs.length - 1; i >= 0; i--) {
        const pts = ys.map((_, j) => toScreen(nodes[j][i]));
        const d = pts
          .map(
            (p, k) =>
              `${k === 0 ? "M" : "L"}${p.x.toFixed(2)} ${p.y.toFixed(2)}`,
          )
          .join(" ");
        let zSum = 0;
        for (let j = 0; j < ys.length; j++) zSum += nodes[j][i].z;
        yCurves.push({ path: d, zAvg: zSum / ys.length });
      }

      // Locate the central peak node (x=0, y=0) and a trough example (r≈4).
      const centreI = Math.round((GRID_N - 1) / 2);
      const centreJ = Math.round((GRID_N - 1) / 2);
      const peakScreen = toScreen(nodes[centreJ][centreI]);

      // Find a node whose r is closest to the first trough (r ≈ 4.493 ≈ 3π/2+π).
      // That is the first negative ring of sin(r)/r.
      let troughScreen = peakScreen;
      let best = Infinity;
      for (let j = 0; j < ys.length; j++) {
        for (let i = 0; i < xs.length; i++) {
          const x = xs[i];
          const y = ys[j];
          const r = Math.sqrt(x * x + y * y);
          // pick a node near (x>0, y=0) for predictability, r ≈ 4.5
          const d = Math.abs(r - 4.5) + Math.abs(y) * 0.4 + (x < 0 ? 1 : 0);
          if (d < best) {
            best = d;
            troughScreen = toScreen(nodes[j][i]);
          }
        }
      }

      return {
        rows: xCurves,
        cols: yCurves,
        axisEnds: {
          origin: toScreen(origin),
          x: toScreen(axisX),
          y: toScreen(axisY),
          z: toScreen(axisZ),
        },
        peakProjected: peakScreen,
        troughExample: troughScreen,
        plotTransform: { scale, centreOffsetX, centreOffsetY, minX, minY },
      };
    }, [iw, ih]);

  // Stroke opacity varies slightly with the row/col mean height for legibility.
  const rowMaxZ = rows.reduce((m, r) => Math.max(m, Math.abs(r.zAvg)), 1e-6);
  const colMaxZ = cols.reduce((m, c) => Math.max(m, Math.abs(c.zAvg)), 1e-6);
  const rowStroke = (zAvg: number) => {
    // high peaks slightly lighter; trough faint; central standard.
    const t = zAvg / rowMaxZ; // in [-1, 1]
    if (t > 0.25) return 0.55; // peaks: lighter
    if (t < -0.1) return 0.3; // trough: faint
    return 0.75;
  };
  const colStroke = (zAvg: number) => {
    const t = zAvg / colMaxZ;
    if (t > 0.25) return 0.55;
    if (t < -0.1) return 0.3;
    return 0.75;
  };

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Axis labels — use end of each tripod leg.
  const labelPad = 6;

  // Silence the unused-var warning — plotTransform stays memoised for
  // potential future marker work.
  void plotTransform;

  return (
    <svg width={width} height={height} role="img" aria-label="Surface plot of the sombrero function">
      <Group left={margin.left} top={margin.top}>
        {/* Axis tripod — three faint lines from origin. Drawn first so the
            mesh paints over any overlap. */}
        <g data-data-layer="true">
          <line
            x1={axisEnds.origin.x}
            y1={axisEnds.origin.y}
            x2={axisEnds.x.x}
            y2={axisEnds.x.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <line
            x1={axisEnds.origin.x}
            y1={axisEnds.origin.y}
            x2={axisEnds.y.x}
            y2={axisEnds.y.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <line
            x1={axisEnds.origin.x}
            y1={axisEnds.origin.y}
            x2={axisEnds.z.x}
            y2={axisEnds.z.y}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="3 3"
          />
          <text
            x={axisEnds.x.x + labelPad}
            y={axisEnds.x.y + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            X
          </text>
          <text
            x={axisEnds.y.x - labelPad}
            y={axisEnds.y.y + 3}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Y
          </text>
          <text
            x={axisEnds.z.x}
            y={axisEnds.z.y - labelPad}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            Z
          </text>
        </g>

        {/* Wireframe mesh — x-curves (rows) first, then y-curves (cols). */}
        <ExplainAnchor
          selector="wireframe"
          index={1}
          pin={{
            x: clamp(peakProjected.x + 32, 10, iw - 10),
            y: clamp(peakProjected.y - 24, 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            {rows.map((r, i) => (
              <path
                key={`r-${i}`}
                d={r.path}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={rowStroke(r.zAvg)}
                strokeWidth={0.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
            {cols.map((c, i) => (
              <path
                key={`c-${i}`}
                d={c.path}
                fill="none"
                stroke="var(--color-ink)"
                strokeOpacity={colStroke(c.zAvg)}
                strokeWidth={0.9}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Peak marker — small cross at the central maximum. */}
        <g data-data-layer="true">
          <circle
            cx={peakProjected.x}
            cy={peakProjected.y}
            r={2.5}
            fill="var(--color-ink)"
          />
        </g>

        <ExplainAnchor
          selector="peak"
          index={2}
          pin={{
            x: clamp(peakProjected.x - 24, 10, iw - 10),
            y: clamp(peakProjected.y - 20, 10, ih - 10),
          }}
          rect={{
            x: clamp(peakProjected.x - 14, 0, iw),
            y: clamp(peakProjected.y - 14, 0, ih),
            width: 28,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Trough anchor — first negative ring of sin(r)/r. */}
        <ExplainAnchor
          selector="trough-ring"
          index={3}
          pin={{
            x: clamp(troughExample.x + 20, 10, iw - 10),
            y: clamp(troughExample.y + 18, 10, ih - 10),
          }}
          rect={{
            x: clamp(troughExample.x - 16, 0, iw),
            y: clamp(troughExample.y - 12, 0, ih),
            width: 32,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis anchor */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{
            x: clamp(axisEnds.x.x - 10, 10, iw - 10),
            y: clamp(axisEnds.x.y + 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(axisEnds.origin.x, 0, iw),
            y: clamp(axisEnds.origin.y - 8, 0, ih),
            width: clamp(axisEnds.x.x - axisEnds.origin.x, 0, iw),
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis anchor */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{
            x: clamp(axisEnds.y.x + 10, 10, iw - 10),
            y: clamp(axisEnds.y.y + 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(axisEnds.y.x, 0, iw),
            y: clamp(axisEnds.y.y - 8, 0, ih),
            width: clamp(axisEnds.origin.x - axisEnds.y.x, 0, iw),
            height: 18,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Z-axis anchor */}
        <ExplainAnchor
          selector="z-axis"
          index={6}
          pin={{
            x: clamp(axisEnds.z.x + 18, 10, iw - 10),
            y: clamp(axisEnds.z.y + 4, 10, ih - 10),
          }}
          rect={{
            x: clamp(axisEnds.z.x - 8, 0, iw),
            y: clamp(axisEnds.z.y, 0, ih),
            width: 16,
            height: clamp(axisEnds.origin.y - axisEnds.z.y, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Projection anchor — the whole scene is an isometric projection.
            Anchor its rule on the title strip at top-left. */}
        <ExplainAnchor
          selector="projection"
          index={7}
          pin={{ x: 20, y: 14 }}
          rect={{ x: 0, y: 0, width: Math.min(iw, 120), height: 28 }}
        >
          <text
            x={0}
            y={10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            ISO 30° · z = sin(r)/r
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
