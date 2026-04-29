"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { LinePath } from "@visx/shape";
import { curveLinear } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ──────────────────────────────────────────────────────────────────────────────
// Simple pendulum phase space
//
// Hamiltonian: H = (θ̇²/2) − cos(θ)  (with l = g = m = 1, normalised)
// Equations of motion:
//   dθ/dt  = θ̇
//   dθ̇/dt = −sin(θ)
//
// Energy levels E = θ̇²/2 − cos(θ)
//   E = −1  →  stable equilibrium (bottom, θ=0, θ̇=0)
//   E = +1  →  separatrix / saddle (top, θ=±π, θ̇=0)
//   E > +1  →  rotational (whirling) orbits
//   −1 < E < +1  →  closed libration (oscillation) ellipses
// ──────────────────────────────────────────────────────────────────────────────

const PI = Math.PI;

// RK4 integrator for the pendulum
function pendulumRK4(
  theta0: number,
  thetaDot0: number,
  dt: number,
  steps: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [[theta0, thetaDot0]];
  let th = theta0;
  let dth = thetaDot0;

  for (let i = 0; i < steps; i++) {
    // k1
    const k1th = dth;
    const k1dth = -Math.sin(th);
    // k2
    const k2th = dth + 0.5 * dt * k1dth;
    const k2dth = -Math.sin(th + 0.5 * dt * k1th);
    // k3
    const k3th = dth + 0.5 * dt * k2dth;
    const k3dth = -Math.sin(th + 0.5 * dt * k2th);
    // k4
    const k4th = dth + dt * k3dth;
    const k4dth = -Math.sin(th + dt * k3th);

    th += (dt / 6) * (k1th + 2 * k2th + 2 * k3th + k4th);
    dth += (dt / 6) * (k1dth + 2 * k2dth + 2 * k3dth + k4dth);

    // Wrap theta to (-π, π] for libration orbits; keep unwrapped for rotation
    pts.push([th, dth]);
  }
  return pts;
}

// ──────────────────────────────────────────────────────────────────────────────
// Separatrix: θ̇ = ±√(2(1 + cos θ)) for θ ∈ (−π, π)
// At E = +1: θ̇² = 2(cos θ + 1) = 4cos²(θ/2)
// So θ̇ = ±2·|cos(θ/2)|
// ──────────────────────────────────────────────────────────────────────────────

function separatrixPoints(
  sign: 1 | -1,
  n: number = 200,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    // theta from -π+ε to π-ε
    const th = -PI + 0.01 + ((PI - 0.02) * 2 * i) / (n - 1);
    const dth = sign * 2 * Math.abs(Math.cos(th / 2));
    pts.push([th, dth]);
  }
  return pts;
}

// ──────────────────────────────────────────────────────────────────────────────
// Rotational-orbit trajectory: θ goes continuously past ±π
// Energy E > 1 ⟹ θ̇₀ = √(2(E + cos θ₀)) at θ₀ = 0
// We integrate without wrapping so the line continues across the domain
// ──────────────────────────────────────────────────────────────────────────────

function rotationalOrbit(
  energyAbove1: number,
  sign: 1 | -1,
  thStart: number,
  thEnd: number,
  n: number = 300,
): Array<[number, number]> {
  // θ̇ = sign * √(2(E + cos θ)) for E = 1 + energyAbove1
  const E = 1 + energyAbove1;
  const pts: Array<[number, number]> = [];
  for (let i = 0; i < n; i++) {
    const th = thStart + ((thEnd - thStart) * i) / (n - 1);
    const inner = 2 * (E + Math.cos(th));
    const dth = inner > 0 ? sign * Math.sqrt(inner) : null;
    if (dth !== null) pts.push([th, dth]);
  }
  return pts;
}

// ──────────────────────────────────────────────────────────────────────────────
// Domain: θ ∈ [−π, π], θ̇ ∈ [−3, 3]
// ──────────────────────────────────────────────────────────────────────────────

const X_DOMAIN: [number, number] = [-PI, PI];
const Y_DOMAIN: [number, number] = [-3.1, 3.1];

// Energy levels for libration orbits (E strictly between -1 and 1)
// We pick them as fractions so they're spread nicely
const LIBRATION_ENERGIES = [-0.8, -0.5, -0.2, 0.2, 0.5, 0.7, 0.9];
// Initial conditions for each libration orbit: θ₀ = 0, θ̇₀ = √(2(E+1))
function librationIC(E: number): [number, number] {
  return [0, Math.sqrt(2 * (E + 1))];
}

interface Props {
  width: number;
  height: number;
}

export function PhaseSpacePlotChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: X_DOMAIN, range: [0, iw] });
  const yScale = scaleLinear({ domain: Y_DOMAIN, range: [ih, 0] });

  const px = (th: number) => xScale(th);
  const py = (dth: number) => yScale(dth);

  // Pre-compute all trajectories in useMemo — no Math.random()
  const {
    librationOrbits,
    sepUpper,
    sepLower,
    rotOrbits,
  } = useMemo(() => {
    // Libration (oscillation) orbits — closed loops via RK4
    const librationOrbits = LIBRATION_ENERGIES.map((E) => {
      const [th0, dth0] = librationIC(E);
      // One full period: T ≈ 2π/ω₀ for small angles; use ≈4π steps to be safe
      const dt = 0.05;
      const steps = Math.round((4 * PI) / dt);
      const pts = pendulumRK4(th0, dth0, dt, steps);
      // Close the loop: append first point
      return [...pts, pts[0]];
    });

    // Separatrix curves
    const sepUpper = separatrixPoints(1);
    const sepLower = separatrixPoints(-1);

    // Rotational orbits (two energy levels above separatrix)
    const rotOrbit1Upper = rotationalOrbit(0.4, 1, -PI, PI, 300);
    const rotOrbit1Lower = rotationalOrbit(0.4, -1, -PI, PI, 300);
    const rotOrbit2Upper = rotationalOrbit(1.5, 1, -PI, PI, 300);
    const rotOrbit2Lower = rotationalOrbit(1.5, -1, -PI, PI, 300);

    return {
      librationOrbits,
      sepUpper,
      sepLower,
      rotOrbits: [rotOrbit1Upper, rotOrbit1Lower, rotOrbit2Upper, rotOrbit2Lower],
    };
  }, []);

  // Pixel coordinates of key anchor points
  // Stable center (θ=0, θ̇=0)
  const centerPx = { x: px(0), y: py(0) };
  // Saddle points (separatrix saddle) at (±π, 0)
  const saddleRightPx = { x: px(PI * 0.97), y: py(0) };
  // A mid-orbit libration point (use the outermost libration orbit, θ≈1.5 rad)
  const outerOrbit = librationOrbits[librationOrbits.length - 1];
  const midOrbitPt = outerOrbit[Math.floor(outerOrbit.length / 4)];
  const midOrbitPx = { x: px(midOrbitPt[0]), y: py(midOrbitPt[1]) };
  // A rotational orbit point
  const rotPt = rotOrbits[0][Math.floor(rotOrbits[0].length / 2)];
  const rotPx = { x: px(rotPt[0]), y: py(rotPt[1]) };
  // Separatrix mid-point
  const sepMidIdx = Math.floor(sepUpper.length / 2);
  const sepMidPx = { x: px(sepUpper[sepMidIdx][0]), y: py(sepUpper[sepMidIdx][1]) - 10 };

  // Gridlines
  const gridX = xScale.ticks(4);
  const gridY = yScale.ticks(5);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Phase-space portrait of the simple pendulum showing libration orbits, separatrix, and rotational orbits"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {gridX.map((t) => (
            <line
              key={`gx-${t}`}
              x1={px(t)}
              x2={px(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
          {gridY.map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={py(t)}
              y2={py(t)}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
              strokeDasharray="2 4"
            />
          ))}
          {/* Zero axes */}
          <line
            x1={px(0)}
            x2={px(0)}
            y1={0}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={0.8}
          />
          <line
            x1={0}
            x2={iw}
            y1={py(0)}
            y2={py(0)}
            stroke="var(--color-hairline)"
            strokeWidth={0.8}
          />
        </g>

        {/* Libration (oscillation) orbits — Anchor 1 */}
        <ExplainAnchor
          selector="libration-orbits"
          index={1}
          pin={{ x: midOrbitPx.x + 12, y: midOrbitPx.y - 12 }}
          rect={{
            x: midOrbitPx.x - 14,
            y: midOrbitPx.y - 14,
            width: 28,
            height: 28,
          }}
        >
          <g data-data-layer="true">
            {librationOrbits.map((orbit, i) => {
              const opacity = 0.45 + (i / librationOrbits.length) * 0.45;
              return (
                <LinePath
                  key={`lib-${i}`}
                  data={orbit}
                  x={(d) => px(d[0])}
                  y={(d) => py(d[1])}
                  stroke="var(--color-ink)"
                  strokeOpacity={opacity}
                  strokeWidth={1.1}
                  fill="none"
                  curve={curveLinear}
                />
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Separatrix — Anchor 2 */}
        <ExplainAnchor
          selector="separatrix"
          index={2}
          pin={{ x: sepMidPx.x, y: sepMidPx.y - 10 }}
          rect={{
            x: 0,
            y: py(2.2),
            width: iw,
            height: py(1.7) - py(2.2),
          }}
        >
          <g data-data-layer="true">
            <LinePath
              data={sepUpper}
              x={(d) => px(d[0])}
              y={(d) => py(d[1])}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="none"
              curve={curveLinear}
            />
            <LinePath
              data={sepLower}
              x={(d) => px(d[0])}
              y={(d) => py(d[1])}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
              strokeDasharray="5 3"
              fill="none"
              curve={curveLinear}
            />
            {/* Label */}
            <text
              x={iw * 0.5}
              y={py(2.05)}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink)"
            >
              SEPARATRIX
            </text>
          </g>
        </ExplainAnchor>

        {/* Rotational orbits — Anchor 3 */}
        <ExplainAnchor
          selector="rotational-orbits"
          index={3}
          pin={{ x: rotPx.x + 12, y: rotPx.y - 10 }}
          rect={{
            x: 0,
            y: py(3.0),
            width: iw,
            height: py(2.2) - py(3.0),
          }}
        >
          <g data-data-layer="true">
            {rotOrbits.map((orbit, i) => (
              <LinePath
                key={`rot-${i}`}
                data={orbit}
                x={(d) => px(d[0])}
                y={(d) => py(d[1])}
                stroke="var(--color-ink)"
                strokeOpacity={i < 2 ? 0.65 : 0.45}
                strokeWidth={1.1}
                fill="none"
                curve={curveLinear}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Stable equilibrium (centre) and saddle points — Anchor 4 */}
        <ExplainAnchor
          selector="fixed-points"
          index={4}
          pin={{ x: centerPx.x + 14, y: centerPx.y - 14 }}
          rect={{
            x: centerPx.x - 8,
            y: centerPx.y - 8,
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            {/* Stable centre at (0, 0) */}
            <circle
              cx={centerPx.x}
              cy={centerPx.y}
              r={4}
              fill="var(--color-ink)"
            />
            <text
              x={centerPx.x + 6}
              y={centerPx.y + 12}
              fontFamily="var(--font-mono)"
              fontSize={7.5}
              fill="var(--color-ink)"
            >
              CENTRE
            </text>
            {/* Saddle at (+π, 0) — at right edge */}
            <circle
              cx={saddleRightPx.x}
              cy={saddleRightPx.y}
              r={3.5}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            {/* Saddle at (−π, 0) — at left edge */}
            <circle
              cx={px(-PI * 0.97)}
              cy={py(0)}
              r={3.5}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={saddleRightPx.x - 4}
              y={saddleRightPx.y + 12}
              fontFamily="var(--font-mono)"
              fontSize={7.5}
              textAnchor="end"
              fill="var(--color-ink)"
            >
              SADDLE
            </text>
          </g>
        </ExplainAnchor>

        {/* X-axis — Anchor 5 */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={4}
            tickFormat={(v) => {
              const val = v as number;
              if (Math.abs(val) < 0.01) return "0";
              if (Math.abs(val - PI) < 0.1) return "π";
              if (Math.abs(val + PI) < 0.1) return "−π";
              if (Math.abs(val - PI / 2) < 0.1) return "π/2";
              if (Math.abs(val + PI / 2) < 0.1) return "−π/2";
              return String(Math.round(val * 10) / 10);
            }}
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
            θ (ANGLE)
          </text>
        </ExplainAnchor>

        {/* Y-axis — Anchor 6 */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -42, y: ih / 2 }}
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
            x={-50}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            θ̇ (ANG. VEL.)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
