"use client";

import { useMemo } from "react";
import { LinePath } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 60 exam scores — identical seed, identical LCG, identical Box-Muller,
// identical clamp to DotPlotChart. The two charts are a genuine A/B pair:
// same scores, two visual languages for them.
function generateScores(): number[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: number[] = [];
  const mu = 76;
  const sigma = 10;
  while (out.length < 60) {
    const z = gauss();
    const raw = Math.round(mu + sigma * z);
    if (raw < 50 || raw > 99) continue;
    out.push(raw);
  }
  return out;
}

// Gaussian kernel density estimate on a uniform grid.
function kde(samples: number[], grid: number[], bandwidth: number): number[] {
  const n = samples.length;
  const h = bandwidth;
  const norm = 1 / (n * h * Math.sqrt(2 * Math.PI));
  return grid.map((x) => {
    let acc = 0;
    for (let i = 0; i < n; i++) {
      const u = (x - samples[i]) / h;
      acc += Math.exp(-0.5 * u * u);
    }
    return acc * norm;
  });
}

interface Props {
  width: number;
  height: number;
}

export function RugPlotChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const scores = useMemo(generateScores, []);

  // Density smooth above the rug — thin companion curve to show the idiom.
  const { densityData, modeScore } = useMemo(() => {
    const gridN = 120;
    const domain: [number, number] = [49.5, 99.5];
    const bandwidth = 3.5;
    const step = (domain[1] - domain[0]) / (gridN - 1);
    const grid: number[] = [];
    for (let i = 0; i < gridN; i++) grid.push(domain[0] + i * step);
    const d = kde(scores, grid, bandwidth);
    let peak = 0;
    let peakIdx = 0;
    for (let i = 0; i < d.length; i++) {
      if (d[i] > peak) {
        peak = d[i];
        peakIdx = i;
      }
    }
    const normalised = d.map((v) => v / peak);
    const data = grid.map((x, i) => ({ x, d: normalised[i] }));
    return { densityData: data, modeScore: grid[peakIdx] };
  }, [scores]);

  const xScale = scaleLinear({ domain: [49.5, 99.5], range: [0, iw] });

  // Rug sits along the x-axis. Each tick is 7px tall, centred on the baseline
  // y = ih (the rug is the "fringe" of the plot).
  const tickLen = 7;
  const rugY0 = ih - tickLen / 2;
  const rugY1 = ih + tickLen / 2;

  // Density curve occupies the upper region of the plot, above the rug.
  const curveTop = Math.max(8, Math.min(ih - 18, ih * 0.15));
  const curveBottom = Math.max(curveTop + 20, ih - 14);
  const densityY = (d: number) => curveBottom - d * (curveBottom - curveTop);

  // Anchor geometry.
  // Representative single tick — pick an actual datum near the mode.
  const singleTickScore = scores.find((s) => s === Math.round(modeScore)) ?? scores[0];
  const singleX = xScale(singleTickScore);

  // Dense cluster: ±6 points around the mode.
  const clusterX0 = xScale(Math.round(modeScore) - 6);
  const clusterX1 = xScale(Math.round(modeScore) + 6);

  // Sparse tails: below 60 (low tail).
  const tailX0 = xScale(49.5);
  const tailX1 = xScale(62);

  return (
    <svg width={width} height={height} role="img" aria-label="Rug plot">
      <Group left={margin.left} top={margin.top}>
        {/* Axis baseline */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-hairline)"
          />
        </g>

        {/* Density overlay — thin companion curve above the rug */}
        <g data-data-layer="true">
          <LinePath
            data={densityData}
            x={(d) => xScale(d.x)}
            y={(d) => densityY(d.d)}
            stroke="var(--color-ink)"
            strokeOpacity={0.55}
            strokeWidth={1.2}
            curve={curveMonotoneX}
          />
        </g>

        {/* Rug — 60 vertical ticks, one per datum, along the x-axis */}
        <g data-data-layer="true">
          {scores.map((s, i) => {
            const x = xScale(s);
            return (
              <line
                key={i}
                x1={x}
                x2={x}
                y1={rugY0}
                y2={rugY1}
                stroke="var(--color-ink)"
                strokeOpacity={0.55}
                strokeWidth={1.1}
              />
            );
          })}
        </g>

        {/* Anchor 1 — a single tick (one datum) */}
        <ExplainAnchor
          selector="tick"
          index={1}
          pin={{ x: singleX + 14, y: rugY0 - 4 }}
          rect={{
            x: Math.max(0, singleX - 3),
            y: Math.max(0, rugY0 - 2),
            width: 6,
            height: tickLen + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — dense cluster (the mode reads as ink darkness) */}
        <ExplainAnchor
          selector="cluster"
          index={2}
          pin={{ x: (clusterX0 + clusterX1) / 2, y: rugY1 + 16 }}
          rect={{
            x: Math.max(0, clusterX0),
            y: Math.max(0, rugY0 - 2),
            width: Math.min(iw, clusterX1 - clusterX0),
            height: tickLen + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — sparse tail (the low end where ticks thin out) */}
        <ExplainAnchor
          selector="tail"
          index={3}
          pin={{ x: (tailX0 + tailX1) / 2, y: rugY1 + 16 }}
          rect={{
            x: Math.max(0, tailX0),
            y: Math.max(0, rugY0 - 2),
            width: Math.min(iw, tailX1 - tailX0),
            height: tickLen + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — density overlay */}
        <ExplainAnchor
          selector="density"
          index={4}
          pin={{ x: xScale(76), y: curveTop - 8 }}
          rect={{
            x: 0,
            y: Math.max(0, curveTop - 4),
            width: iw,
            height: Math.max(0, curveBottom - curveTop + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — X-axis (the number line every datum lives on) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih + 20, width: iw, height: margin.bottom - 20 }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => String(v)}
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            SCORE
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
