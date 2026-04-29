"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Seeded LCG — identical across server + client.
function makeRand(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (Math.imul(s, 1664525) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

// Box-Muller Gaussian from two uniform samples.
function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

// 16-QAM ideal constellation points: 4×4 square grid at (±1, ±3), (±3, ±1), etc.
// Positions: all combinations of I ∈ {-3,-1,1,3} and Q ∈ {-3,-1,1,3}.
const IDEAL_POINTS: { i: number; q: number }[] = [];
for (const i of [-3, -1, 1, 3]) {
  for (const q of [-3, -1, 1, 3]) {
    IDEAL_POINTS.push({ i, q });
  }
}

const SAMPLES_PER_POINT = 10;
const NOISE_SD = 0.28; // Gaussian channel noise std-dev, mimics ~20 dB SNR for 16-QAM

interface Props {
  width: number;
  height: number;
}

export function ConstellationDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // I-Q plane: symmetric domain [-4.5, 4.5]
  const domain: [number, number] = [-4.5, 4.5];
  const xScale = scaleLinear({ domain, range: [0, iw] });
  const yScale = scaleLinear({ domain, range: [ih, 0] });

  // Generate received-sample clouds deterministically.
  const receivedSamples = useMemo(() => {
    const rand = makeRand(0xc0ffee42);
    return IDEAL_POINTS.map((pt) => {
      const samples: { i: number; q: number }[] = [];
      for (let s = 0; s < SAMPLES_PER_POINT; s++) {
        samples.push({
          i: pt.i + gaussian(rand) * NOISE_SD,
          q: pt.q + gaussian(rand) * NOISE_SD,
        });
      }
      return { ideal: pt, samples };
    });
  }, []);

  // Decision boundary: midway between adjacent I-values (at i = -2, 0, +2)
  // We draw the vertical decision boundary at i = 0 (between left and right 2×4 blocks).
  const boundaryX = xScale(0);

  // Also draw a horizontal boundary at q = 0.
  const boundaryY = yScale(0);

  // Pick one cloud and one ideal point for anchors — use the (1, 1) point.
  const anchorIdeal = IDEAL_POINTS.find((p) => p.i === 1 && p.q === 1)!;
  const anchorIx = xScale(anchorIdeal.i);
  const anchorQy = yScale(anchorIdeal.q);

  // Min distance: between adjacent points (distance = 2 in normalised units).
  // Draw a bracket from (1,1) to (3,1).
  const minDistP1 = { i: 1, q: 1 };
  const minDistP2 = { i: 3, q: 1 };
  const mdX1 = xScale(minDistP1.i);
  const mdX2 = xScale(minDistP2.i);
  const mdY = yScale(minDistP1.q);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Constellation Diagram — 16-QAM (4 bits per symbol)"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`yg-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((t) => (
            <line
              key={`xg-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Received sample clouds (scatter dots) */}
        <ExplainAnchor
          selector="received-cloud"
          index={4}
          pin={{ x: xScale(anchorIdeal.i) + 14, y: yScale(anchorIdeal.q) - 14 }}
          rect={{
            x: Math.max(0, anchorIx - 20),
            y: Math.max(0, anchorQy - 20),
            width: Math.min(iw, 40),
            height: Math.min(ih, 40),
          }}
        >
          <g data-data-layer="true">
            {receivedSamples.map(({ ideal, samples }) =>
              samples.map((s, si) => (
                <circle
                  key={`${ideal.i}-${ideal.q}-${si}`}
                  cx={xScale(s.i)}
                  cy={yScale(s.q)}
                  r={2.2}
                  fill="var(--color-ink)"
                  fillOpacity={0.5}
                />
              )),
            )}
          </g>
        </ExplainAnchor>

        {/* Ideal constellation points — cross markers */}
        <ExplainAnchor
          selector="ideal-point"
          index={3}
          pin={{ x: anchorIx - 16, y: anchorQy - 16 }}
          rect={{
            x: Math.max(0, anchorIx - 8),
            y: Math.max(0, anchorQy - 8),
            width: 16,
            height: 16,
          }}
        >
          <g data-data-layer="true">
            {IDEAL_POINTS.map((pt) => {
              const cx = xScale(pt.i);
              const cy = yScale(pt.q);
              const r = 4;
              return (
                <g key={`ideal-${pt.i}-${pt.q}`}>
                  <line
                    x1={cx - r}
                    x2={cx + r}
                    y1={cy}
                    y2={cy}
                    stroke="var(--color-ink)"
                    strokeWidth={1.5}
                  />
                  <line
                    x1={cx}
                    x2={cx}
                    y1={cy - r}
                    y2={cy + r}
                    stroke="var(--color-ink)"
                    strokeWidth={1.5}
                  />
                </g>
              );
            })}
          </g>
        </ExplainAnchor>

        {/* Decision boundary (vertical at I = 0) */}
        <ExplainAnchor
          selector="decision-boundary"
          index={5}
          pin={{ x: boundaryX + 8, y: 8 }}
          rect={{ x: Math.max(0, boundaryX - 5), y: 0, width: 10, height: ih }}
        >
          <g data-data-layer="true">
            <line
              x1={boundaryX}
              x2={boundaryX}
              y1={0}
              y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <line
              x1={0}
              x2={iw}
              y1={boundaryY}
              y2={boundaryY}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Min-distance annotation between (1,1) and (3,1) */}
        <ExplainAnchor
          selector="min-distance"
          index={6}
          pin={{ x: (mdX1 + mdX2) / 2, y: mdY - 14 }}
          rect={{
            x: Math.max(0, mdX1),
            y: Math.max(0, mdY - 8),
            width: Math.min(iw, mdX2 - mdX1),
            height: 16,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={mdX1}
              x2={mdX2}
              y1={mdY - 6}
              y2={mdY - 6}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              markerStart="none"
            />
            <line
              x1={mdX1}
              x2={mdX1}
              y1={mdY - 9}
              y2={mdY - 3}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <line
              x1={mdX2}
              x2={mdX2}
              y1={mdY - 9}
              y2={mdY - 3}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={(mdX1 + mdX2) / 2}
              y={mdY - 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              dmin
            </text>
          </g>
        </ExplainAnchor>

        {/* Modulation label — anchored to explain bits-per-symbol */}
        <ExplainAnchor
          selector="bits-per-symbol"
          index={7}
          pin={{ x: iw / 2 + 70, y: -8 }}
          rect={{ x: Math.max(0, iw / 2 - 60), y: -margin.top, width: 120, height: margin.top }}
        >
          <text
            x={iw / 2}
            y={-8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
            data-data-layer="true"
          >
            16-QAM (4 bits/symbol)
          </text>
        </ExplainAnchor>

        {/* I-axis (X-axis) */}
        <ExplainAnchor
          selector="i-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => String(v)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
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
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            I (IN-PHASE)
          </text>
        </ExplainAnchor>

        {/* Q-axis (Y-axis) */}
        <ExplainAnchor
          selector="q-axis"
          index={2}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            x={-44}
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            Q (QUADRATURE)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
