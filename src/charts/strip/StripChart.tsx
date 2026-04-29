"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Same underlying dataset as the jitter plot — same seed, same parameters —
// but marks collide on the category-axis centre line with no horizontal
// spread. The overdraw is the honest signal that the dataset is dense.
const GROUPS = ["Multiple choice", "Likert", "Ranking", "Free text"] as const;
type Group = (typeof GROUPS)[number];

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
}

// Seeded LCG — matches JitterChart so both charts render the same dataset.
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
      const u = rand();
      const shaped = Math.pow(u, skew);
      const seconds = lo + shaped * (hi - lo);
      // Consume two rand() calls to match the jitter chart's seed stream —
      // keeps the seconds values identical between the two charts.
      rand();
      rand();
      out.push({ group, seconds });
    }
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function StripChart({ width, height }: Props) {
  const margin = { top: 20, right: 16, bottom: 44, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const samples = useMemo(buildDataset, []);

  const xScale = scaleBand<Group>({
    domain: GROUPS as unknown as Group[],
    range: [0, iw],
    padding: 0.4,
  });

  const yScale = scaleLinear<number>({
    domain: Y_DOMAIN,
    range: [ih, 0],
    nice: false,
  });

  const bw = xScale.bandwidth();
  // Strip-plot marks are short horizontal ticks centred on the category band.
  const tickHalf = Math.min(14, bw * 0.45);
  const ticksY = yScale.ticks(5);

  // Anchor coordinates.
  const mcCx = (xScale("Multiple choice") ?? 0) + bw / 2;
  const freeCx = (xScale("Free text") ?? 0) + bw / 2;

  // Representative cluster: densest band of Multiple-choice responses.
  const mcDenseY = yScale(10);
  const mcDenseBottom = yScale(16);

  // Representative outlier-ish slow Free-text response.
  const slowestFreeText = samples
    .filter((s) => s.group === "Free text")
    .reduce((m, s) => (s.seconds > m ? s.seconds : m), 0);
  const slowY = yScale(slowestFreeText);

  return (
    <svg width={width} height={height} role="img" aria-label="Strip plot">
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

        {/* Strip marks — short horizontal ticks collided on the category
            centre line. Overdraw is the honest signal of density. */}
        <g data-data-layer="true">
          {samples.map((s, i) => {
            const cx = (xScale(s.group) ?? 0) + bw / 2;
            const cy = yScale(s.seconds);
            return (
              <line
                key={i}
                x1={cx - tickHalf}
                x2={cx + tickHalf}
                y1={cy}
                y2={cy}
                stroke="var(--color-ink)"
                strokeOpacity={0.45}
                strokeWidth={1.2}
              />
            );
          })}
        </g>

        {/* Anchor 1 — the strip mark itself (one tick = one observation) */}
        <ExplainAnchor
          selector="strip-mark"
          index={1}
          pin={{ x: mcCx + tickHalf + 12, y: mcDenseY }}
          rect={{
            x: Math.max(0, mcCx - tickHalf - 2),
            y: Math.max(0, mcDenseY - 4),
            width: Math.min(iw, tickHalf * 2 + 4),
            height: 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — overdraw / overplot region (strip-plot's defining
            compromise) */}
        <ExplainAnchor
          selector="overdraw"
          index={2}
          pin={{ x: mcCx - tickHalf - 14, y: (mcDenseY + mcDenseBottom) / 2 }}
          rect={{
            x: Math.max(0, mcCx - tickHalf - 2),
            y: Math.max(0, mcDenseY),
            width: Math.min(iw, tickHalf * 2 + 4),
            height: Math.max(0, mcDenseBottom - mcDenseY),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — tail / isolated observation */}
        <ExplainAnchor
          selector="tail"
          index={3}
          pin={{ x: freeCx + tickHalf + 10, y: slowY - 10 }}
          rect={{
            x: Math.max(0, freeCx - tickHalf - 2),
            y: Math.max(0, slowY - 6),
            width: Math.min(iw, tickHalf * 2 + 4),
            height: 12,
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

        {/* Anchor 6 — category strip (the single 1-D line every tick sits
            on) */}
        <ExplainAnchor
          selector="category-strip"
          index={6}
          pin={{ x: (xScale("Likert") ?? 0) + bw / 2, y: -6 }}
          rect={{
            x: Math.max(0, (xScale("Likert") ?? 0) + bw / 2 - 2),
            y: 0,
            width: 4,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
