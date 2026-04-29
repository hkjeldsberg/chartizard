"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveLinear } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Damped harmonic oscillator: ẍ + 2ζω₀ẋ + ω₀²x = 0
// ζ = 0.1 (underdamped), ω₀ = 1
// State: (x, v) where v = ẋ
// Dynamics: dx/dt = v,  dv/dt = −2ζω₀v − ω₀²x
const ZETA = 0.1;
const OMEGA0 = 1.0;

function dxdt(v: number): number {
  return v;
}
function dvdt(x: number, v: number): number {
  return -2 * ZETA * OMEGA0 * v - OMEGA0 * OMEGA0 * x;
}

// RK4 single step
function rk4Step(
  x: number,
  v: number,
  dt: number,
): [number, number] {
  const k1x = dxdt(v);
  const k1v = dvdt(x, v);

  const k2x = dxdt(v + 0.5 * dt * k1v);
  const k2v = dvdt(x + 0.5 * dt * k1x, v + 0.5 * dt * k1v);

  const k3x = dxdt(v + 0.5 * dt * k2v);
  const k3v = dvdt(x + 0.5 * dt * k2x, v + 0.5 * dt * k2v);

  const k4x = dxdt(v + dt * k3v);
  const k4v = dvdt(x + dt * k3x, v + dt * k3v);

  return [
    x + (dt / 6) * (k1x + 2 * k2x + 2 * k3x + k4x),
    v + (dt / 6) * (k1v + 2 * k2v + 2 * k3v + k4v),
  ];
}

// Integrate one trajectory: returns array of [x, v] pairs
function integrate(
  x0: number,
  v0: number,
  dt: number,
  steps: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [[x0, v0]];
  let x = x0;
  let v = v0;
  for (let i = 0; i < steps; i++) {
    [x, v] = rk4Step(x, v, dt);
    pts.push([x, v]);
  }
  return pts;
}

// Initial conditions for 6 trajectories
const INITIAL_CONDITIONS: Array<[number, number]> = [
  [1.0, 0.0],
  [2.0, 0.0],
  [-1.0, 1.0],
  [0.0, 2.0],
  [-2.0, -1.0],
  [0.5, -0.5],
];

// Stroke colours — monotone ink family with opacity variation
const TRAJ_COLORS = [
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
  "var(--color-ink)",
];
const TRAJ_OPACITIES = [0.85, 0.65, 0.75, 0.70, 0.60, 0.55];

// Vector field grid: 9×9
const GRID_N = 9;
const ARROW_SCALE = 0.25; // visual arrow length in data units (normalised)
const DOMAIN: [number, number] = [-2.5, 2.5];

interface Props {
  width: number;
  height: number;
}

export function PhasePortrait({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: DOMAIN, range: [0, iw] });
  const yScale = scaleLinear({ domain: DOMAIN, range: [ih, 0] });

  // Pre-compute everything deterministically in useMemo
  const { trajectories, arrows } = useMemo(() => {
    const DT = 0.05;
    const STEPS = 420;

    const trajectories = INITIAL_CONDITIONS.map(([x0, v0]) =>
      integrate(x0, v0, DT, STEPS),
    );

    // Vector field arrows on a uniform grid
    const step = (DOMAIN[1] - DOMAIN[0]) / (GRID_N - 1);
    const arrows: Array<{
      x: number;
      v: number;
      dx: number;
      dv: number;
    }> = [];
    for (let i = 0; i < GRID_N; i++) {
      for (let j = 0; j < GRID_N; j++) {
        const x = DOMAIN[0] + i * step;
        const v = DOMAIN[0] + j * step;
        const fx = dxdt(v);
        const fv = dvdt(x, v);
        const mag = Math.sqrt(fx * fx + fv * fv) || 1;
        arrows.push({
          x,
          v,
          dx: (fx / mag) * ARROW_SCALE,
          dv: (fv / mag) * ARROW_SCALE,
        });
      }
    }

    return { trajectories, arrows };
  }, []);

  // Pixel helpers
  const px = (x: number) => xScale(x);
  const py = (v: number) => yScale(v);

  // Origin pixel position for the fixed-point marker
  const originX = px(0);
  const originY = py(0);

  // Representative arrow: grid index near (1.5, 0) for the vector-field anchor
  const repArrow = arrows.find((a) => Math.abs(a.x - 1.5) < 0.01 && Math.abs(a.v) < 0.01) ?? arrows[Math.floor(arrows.length / 2)];
  const repArrowPx = { x: px(repArrow.x), y: py(repArrow.v) };

  // First trajectory for the trajectory anchor (x₀=1, v₀=0)
  const traj0 = trajectories[0];
  // Use a mid-arc point for pin placement (~step 60, well into the spiral)
  const midPt = traj0[60];
  const midPx = { x: px(midPt[0]), y: py(midPt[1]) };

  // Initial condition mark for first trajectory
  const ic0Px = { x: px(INITIAL_CONDITIONS[0][0]), y: py(INITIAL_CONDITIONS[0][1]) };

  return (
    <svg width={width} height={height} role="img" aria-label="Phase portrait of the damped harmonic oscillator">
      <Group left={margin.left} top={margin.top}>

        {/* Plot frame */}
        <g data-data-layer="true">
          <rect
            x={0} y={0} width={iw} height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
          {/* Light grid */}
          {xScale.ticks(5).map((t) => (
            <line
              key={`gx-${t}`}
              x1={px(t)} x2={px(t)} y1={0} y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0} x2={iw} y1={py(t)} y2={py(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.4}
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Vector field arrows */}
        <ExplainAnchor
          selector="vector-field"
          index={1}
          pin={{ x: repArrowPx.x + 12, y: repArrowPx.y - 14 }}
          rect={{ x: repArrowPx.x - 16, y: repArrowPx.y - 16, width: 32, height: 32 }}
        >
          <g data-data-layer="true">
            {arrows.map((a, i) => {
              const ax = px(a.x);
              const ay = py(a.v);
              const ex = px(a.x + a.dx);
              const ey = py(a.v + a.dv);
              // Arrowhead direction
              const vx = ex - ax;
              const vy = ey - ay;
              const len = Math.sqrt(vx * vx + vy * vy) || 1;
              const ux = vx / len;
              const uy = vy / len;
              const headLen = 3;
              const headAngle = 0.4;
              const hx1 = ex - headLen * (ux * Math.cos(headAngle) - uy * Math.sin(headAngle));
              const hy1 = ey - headLen * (uy * Math.cos(headAngle) + ux * Math.sin(headAngle));
              const hx2 = ex - headLen * (ux * Math.cos(headAngle) + uy * Math.sin(headAngle));
              const hy2 = ey - headLen * (uy * Math.cos(headAngle) - ux * Math.sin(headAngle));
              return (
                <g key={`arrow-${i}`}>
                  <line
                    x1={ax} y1={ay} x2={ex} y2={ey}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.7}
                    strokeOpacity={0.55}
                  />
                  <polyline
                    points={`${hx1},${hy1} ${ex},${ey} ${hx2},${hy2}`}
                    fill="none"
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.7}
                    strokeOpacity={0.55}
                    strokeLinejoin="round"
                  />
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Trajectory curves */}
        <ExplainAnchor
          selector="trajectory"
          index={2}
          pin={{ x: midPx.x + 14, y: midPx.y - 12 }}
          rect={{ x: midPx.x - 10, y: midPx.y - 10, width: 20, height: 20 }}
        >
          <g data-data-layer="true">
            {trajectories.map((traj, ti) => (
              <LinePath
                key={`traj-${ti}`}
                data={traj}
                x={(d) => px(d[0])}
                y={(d) => py(d[1])}
                stroke={TRAJ_COLORS[ti]}
                strokeOpacity={TRAJ_OPACITIES[ti]}
                strokeWidth={1.4}
                fill="none"
                curve={curveLinear}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Initial condition dots */}
        <ExplainAnchor
          selector="initial-condition"
          index={3}
          pin={{ x: ic0Px.x + 10, y: ic0Px.y - 14 }}
          rect={{ x: ic0Px.x - 6, y: ic0Px.y - 6, width: 12, height: 12 }}
        >
          <g data-data-layer="true">
            {INITIAL_CONDITIONS.map(([x0, v0], i) => (
              <circle
                key={`ic-${i}`}
                cx={px(x0)}
                cy={py(v0)}
                r={3}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Stable spiral fixed point at origin */}
        <ExplainAnchor
          selector="fixed-point"
          index={4}
          pin={{ x: originX + 14, y: originY - 14 }}
          rect={{ x: originX - 8, y: originY - 8, width: 16, height: 16 }}
        >
          <g data-data-layer="true">
            <circle
              cx={originX} cy={originY} r={5}
              fill="var(--color-ink)"
            />
            <text
              x={originX + 8}
              y={originY + 14}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink)"
            >
              ATTRACTOR
            </text>
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
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
            POSITION x
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
            VELOCITY v
          </text>
        </ExplainAnchor>

        {/* Spiralling-in pattern anchor — spans the broad outer arc region */}
        <ExplainAnchor
          selector="spiral-pattern"
          index={7}
          pin={{ x: Math.max(10, Math.min(iw - 10, px(-2.1))), y: Math.max(10, Math.min(ih - 10, py(-1.2))) }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g />
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
