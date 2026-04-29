"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveBasis } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same 2D point-vortex as the vector-field sibling:
//   V(x, y) = (-y, x) / sqrt(x^2 + y^2 + 0.1)
// Streamlines are integral curves of this field. Because the field is a
// pure rotation, streamlines are concentric circles.
const DOMAIN: [number, number] = [-5, 5];

function field(x: number, y: number): [number, number] {
  const denom = Math.sqrt(x * x + y * y + 0.1);
  return [-y / denom, x / denom];
}

// RK4 step integrating dX/dt = V(X).
function rk4Step(
  x: number,
  y: number,
  dt: number,
): [number, number] {
  const [k1x, k1y] = field(x, y);
  const [k2x, k2y] = field(x + 0.5 * dt * k1x, y + 0.5 * dt * k1y);
  const [k3x, k3y] = field(x + 0.5 * dt * k2x, y + 0.5 * dt * k2y);
  const [k4x, k4y] = field(x + dt * k3x, y + dt * k3y);
  return [
    x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    y + (dt / 6) * (k1y + 2 * k2y + 2 * k3y + k4y),
  ];
}

function integrate(
  x0: number,
  y0: number,
  dt: number,
  steps: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [[x0, y0]];
  let x = x0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    [x, y] = rk4Step(x, y, dt);
    // Guard against runaway trajectories drifting far outside the plot.
    if (Math.abs(x) > 20 || Math.abs(y) > 20) break;
    pts.push([x, y]);
  }
  return pts;
}

// 15 seed points at various radii, distributed around the plot so the
// concentric-circle signature reads clearly.
const SEEDS: Array<[number, number]> = [
  // Near-centre
  [0.5, 0],
  [-0.4, 0.3],
  [0.2, -0.6],
  // Mid-radius
  [1.3, 0],
  [-1.5, 0.6],
  [0.8, 1.4],
  [-0.9, -1.5],
  [1.8, -0.9],
  // Further out
  [2.6, 0],
  [-2.4, 1.2],
  [1.5, 2.5],
  [-1.8, -2.3],
  // Outer ring
  [3.6, 0.5],
  [-3.2, -2.0],
  [2.2, -3.4],
];

interface Props {
  width: number;
  height: number;
}

export function StreamlinePlot({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: DOMAIN, range: [0, iw] });
  const yScale = scaleLinear({ domain: DOMAIN, range: [ih, 0] });

  const streamlines = useMemo(() => {
    const DT = 0.05;
    const STEPS = 200;
    return SEEDS.map(([x0, y0]) => {
      const forward = integrate(x0, y0, DT, STEPS);
      const backward = integrate(x0, y0, -DT, STEPS);
      // Backward goes in time-reversed order; reverse it and drop the seed
      // duplicate, then prepend to forward.
      const backRev = backward.slice(1).reverse();
      return [...backRev, ...forward];
    });
  }, []);

  const px = (x: number) => xScale(x);
  const py = (y: number) => yScale(y);

  const originX = px(0);
  const originY = py(0);

  // Seed radii for encoding + anchor selection.
  const seedRadii = SEEDS.map(([x, y]) => Math.sqrt(x * x + y * y));
  const rMin = Math.min(...seedRadii);
  const rMax = Math.max(...seedRadii);

  // Choose one small-radius streamline (for "tight circle near centre"
  // anchor) and one large-radius streamline (for "big circle far from
  // centre" anchor).
  const smallIdx = seedRadii.indexOf(rMin);
  const largeIdx = seedRadii.indexOf(rMax);

  const smallSeed = SEEDS[smallIdx];
  const largeSeed = SEEDS[largeIdx];
  const smallSeedPx = { x: px(smallSeed[0]), y: py(smallSeed[1]) };
  const largeSeedPx = { x: px(largeSeed[0]), y: py(largeSeed[1]) };

  // Representative streamline for the generic "streamline" anchor — pick
  // a mid-radius one for best visual prominence.
  const midIdx = seedRadii
    .map((r, i) => ({ r, i }))
    .sort((a, b) => Math.abs(a.r - 2.5) - Math.abs(b.r - 2.5))[0].i;
  const midSeed = SEEDS[midIdx];
  const midStream = streamlines[midIdx];
  // Take a point partway round the ring for the pin location.
  const midStreamPt = midStream[Math.floor(midStream.length * 0.25)] ?? midStream[0];
  const midStreamPx = { x: px(midStreamPt[0]), y: py(midStreamPt[1]) };

  // Opacity by radius so the family of nested orbits reads cleanly.
  const opacityFor = (r: number) =>
    0.45 + ((r - rMin) / Math.max(1e-9, rMax - rMin)) * 0.45;
  const strokeFor = (r: number) =>
    1.2 + ((r - rMin) / Math.max(1e-9, rMax - rMin)) * 0.5;

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Streamline plot of a point vortex"
    >
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
              x1={px(t)}
              x2={px(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={py(t)}
              y2={py(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Streamlines */}
        <g data-data-layer="true">
          {streamlines.map((line, i) => {
            const r = seedRadii[i];
            return (
              <LinePath
                key={`sl-${i}`}
                data={line}
                x={(d) => px(d[0])}
                y={(d) => py(d[1])}
                stroke="var(--color-ink)"
                strokeOpacity={opacityFor(r)}
                strokeWidth={strokeFor(r)}
                fill="none"
                curve={curveBasis}
              />
            );
          })}
        </g>

        {/* Seed points — small dots at the integration origins */}
        <g data-data-layer="true">
          {SEEDS.map(([x, y], i) => (
            <circle
              key={`seed-${i}`}
              cx={px(x)}
              cy={py(y)}
              r={1.8}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Representative streamline */}
        <ExplainAnchor
          selector="streamline"
          index={1}
          pin={{
            x: clamp(midStreamPx.x + 18, 10, iw - 10),
            y: clamp(midStreamPx.y - 16, 10, ih - 10),
          }}
          rect={{
            x: clamp(midStreamPx.x - 12, 0, iw),
            y: clamp(midStreamPx.y - 12, 0, ih),
            width: 24,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Vortex centre / origin */}
        <ExplainAnchor
          selector="vortex-centre"
          index={2}
          pin={{
            x: clamp(originX + 18, 10, iw - 10),
            y: clamp(originY - 18, 10, ih - 10),
          }}
          rect={{
            x: clamp(originX - 10, 0, iw),
            y: clamp(originY - 10, 0, ih),
            width: 20,
            height: 20,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={originX - 5}
              x2={originX + 5}
              y1={originY}
              y2={originY}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
            <line
              x1={originX}
              x2={originX}
              y1={originY - 5}
              y2={originY + 5}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
          </g>
        </ExplainAnchor>

        {/* Concentric-circle signature */}
        <ExplainAnchor
          selector="concentric-signature"
          index={3}
          pin={{
            x: clamp(px(-3.6), 10, iw - 10),
            y: clamp(py(3.6), 10, ih - 10),
          }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Seed-to-integrated-path concept — pin one seed dot */}
        <ExplainAnchor
          selector="seed-point"
          index={4}
          pin={{
            x: clamp(largeSeedPx.x + 14, 10, iw - 10),
            y: clamp(largeSeedPx.y + 14, 10, ih - 10),
          }}
          rect={{
            x: clamp(largeSeedPx.x - 8, 0, iw),
            y: clamp(largeSeedPx.y - 8, 0, ih),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Tight near-centre streamline */}
        <ExplainAnchor
          selector="tight-streamline"
          index={5}
          pin={{
            x: clamp(smallSeedPx.x - 20, 10, iw - 10),
            y: clamp(smallSeedPx.y + 20, 10, ih - 10),
          }}
          rect={{
            x: clamp(originX - 24, 0, iw),
            y: clamp(originY - 24, 0, ih),
            width: 48,
            height: 48,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
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
      </Group>
    </svg>
  );
}
