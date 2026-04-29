"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Chirikov standard map (Chirikov 1979), K = 1.2
// x_{n+1} = (x_n + K·sin(2π·y_n)) mod 1
// y_{n+1} = (y_n + x_{n+1}) mod 1
// Domain: [0,1]² (2-torus)
const K = 1.2;
const TWO_PI = 2 * Math.PI;

function standardMapStep(x: number, y: number): [number, number] {
  const xNext = ((x + K * Math.sin(TWO_PI * y)) % 1 + 1) % 1;
  const yNext = ((y + xNext) % 1 + 1) % 1;
  return [xNext, yNext];
}

function iterate(
  x0: number,
  y0: number,
  steps: number,
): Array<[number, number]> {
  const pts: Array<[number, number]> = [[x0, y0]];
  let x = x0;
  let y = y0;
  for (let i = 0; i < steps; i++) {
    [x, y] = standardMapStep(x, y);
    pts.push([x, y]);
  }
  return pts;
}

// 8 initial conditions chosen to show both KAM tori and chaotic zones
// Labelled by orbit type (informative only — not rendered)
const ORBITS: Array<{ x0: number; y0: number; label: string }> = [
  { x0: 0.1, y0: 0.1, label: "KAM torus A" },
  { x0: 0.5, y0: 0.13, label: "KAM torus B" },
  { x0: 0.8, y0: 0.3, label: "KAM torus C" },
  { x0: 0.2, y0: 0.6, label: "KAM torus D" },
  { x0: 0.3, y0: 0.35, label: "chaotic zone A" },
  { x0: 0.6, y0: 0.5, label: "chaotic zone B" },
  { x0: 0.45, y0: 0.45, label: "chaotic zone C" },
  { x0: 0.15, y0: 0.82, label: "chaotic zone D" },
];

// Distinct fill opacities — all use ink colour, differentiated by opacity
const ORBIT_OPACITIES = [0.85, 0.70, 0.60, 0.50, 0.35, 0.30, 0.25, 0.20];
// First 4 are KAM (smooth curves), last 4 are chaotic (filled regions)
const ORBIT_RADIUS = [1.0, 1.0, 1.0, 1.0, 0.8, 0.8, 0.8, 0.8];

// Number of iterations per orbit
const STEPS = 500;

interface Props {
  width: number;
  height: number;
}

export function PoincareMap({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 1], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const allOrbits = useMemo(() => {
    return ORBITS.map(({ x0, y0 }) => iterate(x0, y0, STEPS));
  }, []);

  // KAM torus anchor: pick the first orbit (smooth curve at x0=0.1, y0=0.1)
  // Approximate centroid of that orbit for pin placement
  const kamOrbit = allOrbits[0];
  const kamCentroid = kamOrbit.reduce(
    (acc, [x, y]) => ({ x: acc.x + x / kamOrbit.length, y: acc.y + y / kamOrbit.length }),
    { x: 0, y: 0 },
  );
  const kamPinPx = {
    x: Math.max(10, Math.min(iw - 10, xScale(kamCentroid.x))),
    y: Math.max(10, Math.min(ih - 10, yScale(kamCentroid.y))),
  };

  // Chaotic zone anchor: use orbit index 4 (first chaotic)
  const chaoticOrbit = allOrbits[4];
  const chaoticCentroid = chaoticOrbit.reduce(
    (acc, [x, y]) => ({ x: acc.x + x / chaoticOrbit.length, y: acc.y + y / chaoticOrbit.length }),
    { x: 0, y: 0 },
  );
  const chaoticPinPx = {
    x: Math.max(10, Math.min(iw - 10, xScale(chaoticCentroid.x))),
    y: Math.max(10, Math.min(ih - 10, yScale(chaoticCentroid.y))),
  };

  // Initial condition of the first orbit, for the IC anchor
  const ic0Px = {
    x: xScale(ORBITS[0].x0),
    y: yScale(ORBITS[0].y0),
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Poincaré map of the Chirikov standard map">
      <Group left={margin.left} top={margin.top}>

        {/* Plot frame */}
        <g data-data-layer="true">
          <rect
            x={0} y={0} width={iw} height={ih}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.75}
          />
        </g>

        {/* KAM torus orbits (orbits 0–3) */}
        <ExplainAnchor
          selector="kam-torus"
          index={1}
          pin={{ x: Math.max(10, kamPinPx.x - 18), y: Math.max(10, kamPinPx.y - 14) }}
          rect={{ x: 0, y: 0, width: iw / 2, height: ih }}
        >
          <g data-data-layer="true">
            {allOrbits.slice(0, 4).map((orbit, oi) =>
              orbit.map(([x, y], pi) => (
                <circle
                  key={`kam-${oi}-${pi}`}
                  cx={xScale(x)}
                  cy={yScale(y)}
                  r={ORBIT_RADIUS[oi]}
                  fill="var(--color-ink)"
                  fillOpacity={ORBIT_OPACITIES[oi]}
                />
              )),
            )}
          </g>
        </ExplainAnchor>

        {/* Chaotic zone orbits (orbits 4–7) */}
        <ExplainAnchor
          selector="chaotic-zone"
          index={2}
          pin={{ x: Math.max(10, chaoticPinPx.x + 12), y: Math.max(10, chaoticPinPx.y - 12) }}
          rect={{ x: iw / 4, y: ih / 4, width: iw / 2, height: ih / 2 }}
        >
          <g data-data-layer="true">
            {allOrbits.slice(4).map((orbit, oi) =>
              orbit.map(([x, y], pi) => (
                <circle
                  key={`ch-${oi}-${pi}`}
                  cx={xScale(x)}
                  cy={yScale(y)}
                  r={ORBIT_RADIUS[oi + 4]}
                  fill="var(--color-ink)"
                  fillOpacity={ORBIT_OPACITIES[oi + 4]}
                />
              )),
            )}
          </g>
        </ExplainAnchor>

        {/* Initial conditions */}
        <ExplainAnchor
          selector="initial-condition"
          index={3}
          pin={{ x: Math.max(10, ic0Px.x + 10), y: Math.max(10, ic0Px.y - 14) }}
          rect={{ x: Math.max(0, ic0Px.x - 6), y: Math.max(0, ic0Px.y - 6), width: 12, height: 12 }}
        >
          <g data-data-layer="true">
            {ORBITS.map(({ x0, y0 }, i) => (
              <circle
                key={`ic-${i}`}
                cx={xScale(x0)}
                cy={yScale(y0)}
                r={3.2}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v).toFixed(1)}`}
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
            x (mod 1)
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Number(v).toFixed(1)}`}
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
            y (mod 1)
          </text>
        </ExplainAnchor>

      </Group>
    </svg>
  );
}
