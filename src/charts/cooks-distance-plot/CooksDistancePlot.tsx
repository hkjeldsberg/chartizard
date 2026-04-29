"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Generate n=40 Cook's distance values using a seeded LCG.
// Most values are small (< 0.02); observations 17 and 34 (1-indexed) are
// hand-picked to be clearly above the 4/n threshold.
function generateCooksDistances(n: number): { index: number; D: number }[] {
  let seed = 42317;
  const lcg = () => {
    seed = (seed * 1664525 + 1013904223) >>> 0;
    return seed / 0xffffffff;
  };

  const out: { index: number; D: number }[] = [];
  const influential = new Set([17, 34]); // 1-indexed influential observations

  for (let i = 1; i <= n; i++) {
    let D: number;
    if (influential.has(i)) {
      // Force clearly above the 4/n threshold (threshold ≈ 0.1 for n=40)
      D = i === 17 ? 0.23 + lcg() * 0.05 : 0.16 + lcg() * 0.04;
    } else {
      // Normal small Cook's distance
      D = lcg() * 0.06;
    }
    out.push({ index: i, D });
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

const N = 40;
const THRESHOLD = 4 / N; // conventional 4/n cutoff ≈ 0.1

export function CooksDistancePlot({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateCooksDistances(N), []);

  // x: band scale over observation indices 1..N
  const labels = data.map((d) => String(d.index));
  const xScale = scaleBand<string>({
    domain: labels,
    range: [0, iw],
    padding: 0.25,
  });

  // y: Cook's distance domain — max value + some headroom
  const maxD = Math.max(...data.map((d) => d.D));
  const yScale = scaleLinear<number>({
    domain: [0, maxD * 1.2],
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  const threshY = yScale(THRESHOLD);
  const zeroY = yScale(0);

  // Influential observation data (obs 17 and 34)
  const influential = data.filter((d) => d.index === 17 || d.index === 34);
  const inf17 = influential.find((d) => d.index === 17)!;
  const inf34 = influential.find((d) => d.index === 34)!;

  const x17 = (xScale(String(inf17.index)) ?? 0) + bw / 2;
  const y17 = yScale(inf17.D);
  const x34 = (xScale(String(inf34.index)) ?? 0) + bw / 2;
  const y34 = yScale(inf34.D);

  // A representative non-influential stem (obs 8, guaranteed < threshold)
  const repObs = data.find((d) => d.index === 8)!;
  const xRep = (xScale(String(repObs.index)) ?? 0) + bw / 2;
  const yRep = yScale(repObs.D);

  // Mid-index for x-axis anchor
  const midLabel = String(Math.round(N / 2));
  const midX = (xScale(midLabel) ?? iw / 2) + bw / 2;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Cook's Distance Plot — influential observations at indices 17 and 34 exceed the 4/n threshold"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines and stems */}
        <g data-data-layer="true">
          {/* Horizontal gridlines */}
          {yScale.ticks(4).map((t) => (
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

          {/* Stems: vertical lines from zero to D_i */}
          {data.map((d) => {
            const x = (xScale(String(d.index)) ?? 0) + bw / 2;
            const y = yScale(d.D);
            const isInfluential = d.index === 17 || d.index === 34;
            return (
              <line
                key={d.index}
                x1={x}
                x2={x}
                y1={zeroY}
                y2={y}
                stroke="var(--color-ink)"
                strokeWidth={isInfluential ? 2 : 1}
                strokeOpacity={isInfluential ? 1 : 0.7}
              />
            );
          })}

          {/* Heads: circles at D_i */}
          {data.map((d) => {
            const x = (xScale(String(d.index)) ?? 0) + bw / 2;
            const y = yScale(d.D);
            const isInfluential = d.index === 17 || d.index === 34;
            return (
              <circle
                key={d.index}
                cx={x}
                cy={y}
                r={isInfluential ? 3.5 : 2}
                fill="var(--color-ink)"
                fillOpacity={isInfluential ? 1 : 0.7}
              />
            );
          })}

          {/* Labels above influential stems */}
          <text
            x={x17}
            y={y17 - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            obs 17
          </text>
          <text
            x={x34}
            y={y34 - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            obs 34
          </text>
        </g>

        {/* Anchor 1: y-axis (Cook's distance) */}
        <ExplainAnchor
          selector="y-axis"
          index={1}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            tickFormat={(v) => String(Number(v).toFixed(2))}
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
            x={-margin.left + 4}
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            COOK&apos;S D
          </text>
        </ExplainAnchor>

        {/* Anchor 2: x-axis (observation index) */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: midX, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={["1", "10", "20", "30", "40"]}
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
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            OBSERVATION INDEX
          </text>
        </ExplainAnchor>

        {/* Anchor 3: threshold line (4/n) */}
        <ExplainAnchor
          selector="threshold-line"
          index={3}
          pin={{ x: iw - 8, y: threshY - 10 }}
          rect={{ x: 0, y: Math.max(0, threshY - 4), width: iw, height: 8 }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: threshY }}
              to={{ x: iw, y: threshY }}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={threshY - 4}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              4/n
            </text>
          </g>
        </ExplainAnchor>

        {/* Anchor 4: representative influential observation (obs 17) */}
        <ExplainAnchor
          selector="influential-observation"
          index={4}
          pin={{ x: x17 - 14, y: y17 - 18 }}
          rect={{
            x: Math.max(0, x17 - bw),
            y: Math.max(0, y17 - 8),
            width: Math.min(bw * 2, iw - Math.max(0, x17 - bw)),
            height: Math.max(0, zeroY - y17 + 8),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: representative non-influential stem (obs 8) */}
        <ExplainAnchor
          selector="short-stem"
          index={5}
          pin={{ x: xRep + 14, y: (zeroY + yRep) / 2 }}
          rect={{
            x: Math.max(0, xRep - bw * 3),
            y: Math.max(0, yRep - 4),
            width: Math.min(bw * 6, iw - Math.max(0, xRep - bw * 3)),
            height: Math.max(0, zeroY - yRep + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: obs 34 (second influential point) */}
        <ExplainAnchor
          selector="second-influential"
          index={6}
          pin={{ x: x34 + 14, y: y34 - 18 }}
          rect={{
            x: Math.max(0, x34 - bw),
            y: Math.max(0, y34 - 8),
            width: Math.min(bw * 2, iw - Math.max(0, x34 - bw)),
            height: Math.max(0, zeroY - y34 + 8),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
