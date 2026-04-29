"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Question types roughly ordered by the median time a respondent takes to
// complete one item, per Pew Research's online-panel response-time audits and
// comparable Qualtrics/SurveyMonkey log-time studies. Numbers below are
// synthetic but plausible.
const GROUPS = ["Multiple choice", "Likert", "Ranking", "Free text"] as const;
type Group = (typeof GROUPS)[number];

// Per-group lognormal-ish parameters (seconds).
const PARAMS: Record<Group, { lo: number; hi: number; skew: number }> = {
  "Multiple choice": { lo: 6, hi: 28, skew: 1.6 },
  Likert: { lo: 10, hi: 40, skew: 1.8 },
  Ranking: { lo: 18, hi: 60, skew: 1.9 },
  "Free text": { lo: 30, hi: 115, skew: 2.2 },
};

const N_PER_GROUP = 30;
const Y_DOMAIN: [number, number] = [0, 120];

interface Sample {
  group: Group;
  seconds: number;
  jitter: number; // normalised offset in [-1, 1]
}

// Seeded LCG — identical pattern to ViolinChart / HexbinChart. Deterministic.
function buildDataset(): Sample[] {
  let seed = 17;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const out: Sample[] = [];
  for (const group of GROUPS) {
    const { lo, hi, skew } = PARAMS[group];
    for (let i = 0; i < N_PER_GROUP; i++) {
      // Skewed draw: raise uniform to `skew` so mass sits toward `lo`.
      const u = rand();
      const shaped = Math.pow(u, skew);
      const seconds = lo + shaped * (hi - lo);
      // Two more rand() calls to avoid correlated jitter vs. value.
      const j1 = rand();
      const j2 = rand();
      const jitter = (j1 + j2) - 1; // triangular-ish, [-1, 1]
      out.push({ group, seconds, jitter });
    }
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function JitterChart({ width, height }: Props) {
  const margin = { top: 20, right: 16, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const samples = useMemo(buildDataset, []);

  const xScale = scaleBand<Group>({
    domain: GROUPS as unknown as Group[],
    range: [0, iw],
    padding: 0.25,
  });

  const yScale = scaleLinear<number>({
    domain: Y_DOMAIN,
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  const halfBand = bw * 0.42;
  const ticksY = yScale.ticks(5);

  // For anchors: pick representative points per group.
  const freeText = samples.filter((s) => s.group === "Free text");
  const mc = samples.filter((s) => s.group === "Multiple choice");

  // A representative dense cluster: first-quartile region of "Multiple choice".
  const mcLow = mc.filter((s) => s.seconds < 14);
  const clusterCx = (xScale("Multiple choice") ?? 0) + bw / 2;
  const clusterCy = yScale(10);

  // Representative tail: the slowest few Free-text respondents.
  const slowFreeText = [...freeText].sort((a, b) => b.seconds - a.seconds).slice(0, 3);
  const tailCx = (xScale("Free text") ?? 0) + bw / 2;
  const tailCy = yScale(slowFreeText[0]?.seconds ?? 100);

  return (
    <svg width={width} height={height} role="img" aria-label="Jitter plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Points — one circle per respondent, horizontally jittered within
            the category band. */}
        <g data-data-layer="true">
          {samples.map((s, i) => {
            const cx = (xScale(s.group) ?? 0) + bw / 2 + s.jitter * halfBand;
            const cy = yScale(s.seconds);
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={2.2}
                fill="var(--color-ink)"
                fillOpacity={0.55}
              />
            );
          })}
        </g>

        {/* Anchor 1 — the jitter offset itself (the chart's defining idea) */}
        <ExplainAnchor
          selector="jitter"
          index={1}
          pin={{ x: clusterCx + halfBand + 10, y: clusterCy }}
          rect={{
            x: Math.max(0, clusterCx - halfBand),
            y: Math.max(0, yScale(14) - 2),
            width: Math.min(iw, halfBand * 2),
            height: Math.max(0, yScale(6) - yScale(14) + 4),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — representative data point */}
        <ExplainAnchor
          selector="data-point"
          index={2}
          pin={{ x: tailCx + halfBand + 10, y: tailCy - 10 }}
          rect={{
            x: Math.max(0, tailCx - halfBand),
            y: Math.max(0, tailCy - 8),
            width: Math.min(iw, halfBand * 2),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the overlapping cluster (density visible through the
            jitter spread) */}
        <ExplainAnchor
          selector="density-cluster"
          index={3}
          pin={{ x: clusterCx - halfBand - 10, y: yScale(18) }}
          rect={{
            x: Math.max(0, clusterCx - halfBand),
            y: Math.max(0, yScale(28)),
            width: Math.min(iw, halfBand * 2),
            height: Math.max(0, yScale(8) - yScale(28)),
          }}
        >
          <g />
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
            SECONDS
          </text>
        </ExplainAnchor>

        {/* Anchor 6 — category band boundary (why jitter stays inside one
            column) */}
        <ExplainAnchor
          selector="category-band"
          index={6}
          pin={{ x: (xScale("Likert") ?? 0) + bw / 2, y: -6 }}
          rect={{
            x: xScale("Likert") ?? 0,
            y: 0,
            width: bw,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
