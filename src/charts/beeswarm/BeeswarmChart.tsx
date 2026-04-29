"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Olympic marathon men's medallists by decade — the story is a slow grind
// downward (faster) with a long tail of less-competitive finishers in each
// era. Times are in MINUTES. We take the real medal-era means and synthesise
// 30 finishers per decade around them with a seeded LCG so every render is
// identical. The conceptual shape (continuous values, per-decade cluster) is
// the same as a jitter plot — but each point stays fully readable.
const DECADES = ["1980s", "1990s", "2000s", "2010s"] as const;
type Decade = (typeof DECADES)[number];

// Rough medallist-mean + spread per decade (minutes, male elite marathon).
// Tuned so the visual trend reads at tile scale, not for climate truth.
const SPEC: Record<Decade, { mean: number; sd: number }> = {
  "1980s": { mean: 132.0, sd: 2.6 },
  "1990s": { mean: 130.5, sd: 2.2 },
  "2000s": { mean: 128.8, sd: 2.0 },
  "2010s": { mean: 127.0, sd: 1.8 },
};

const POINTS_PER_GROUP = 30;

// Seeded LCG — identical across server + client.
function makeRand(seed: number): () => number {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

// Box-Muller from two uniforms gives a normal sample without Math.random().
function gaussian(rand: () => number): number {
  const u = Math.max(1e-9, rand());
  const v = Math.max(1e-9, rand());
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

interface Props {
  width: number;
  height: number;
}

export function BeeswarmChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const yDomain: [number, number] = [122, 140];

  const xScale = useMemo(
    () =>
      scaleBand<Decade>({
        domain: [...DECADES],
        range: [0, iw],
        padding: 0.2,
      }),
    [iw],
  );

  const yScale = useMemo(
    () => scaleLinear<number>({ domain: yDomain, range: [ih, 0], nice: false }),
    [ih],
  );

  const bw = xScale.bandwidth();
  const halfWidth = Math.max(8, bw * 0.46);
  const r = 2.6; // point radius
  const pad = 0.6; // extra gap so circles don't kiss

  // Deterministic force-pack: per decade, sort by value then walk each point
  // to the lowest |offset| that doesn't collide with any already-placed
  // neighbour within 2(r+pad) of its y-coordinate.
  const swarms = useMemo(() => {
    const out: {
      decade: Decade;
      cx: number;
      points: { x: number; y: number; raw: number }[];
    }[] = [];

    for (let gi = 0; gi < DECADES.length; gi++) {
      const decade = DECADES[gi] as Decade;
      const { mean, sd } = SPEC[decade];
      const cx = (xScale(decade) ?? 0) + bw / 2;

      const rand = makeRand(1337 + gi * 97);
      const raws: number[] = [];
      for (let i = 0; i < POINTS_PER_GROUP; i++) {
        raws.push(mean + gaussian(rand) * sd);
      }
      raws.sort((a, b) => a - b);

      // Candidate offsets from the centre axis: 0, +step, -step, +2step, -2step …
      // Step smaller than the diameter lets the swarm fill gaps tightly.
      const step = (r + pad) * 0.9;
      const maxK = Math.ceil(halfWidth / step);
      const candidates: number[] = [0];
      for (let k = 1; k <= maxK; k++) {
        candidates.push(k * step, -k * step);
      }

      const placed: { x: number; y: number }[] = [];
      const minDist2 = (2 * r + pad) * (2 * r + pad);

      const points: { x: number; y: number; raw: number }[] = [];
      for (const raw of raws) {
        const py = yScale(raw);
        let chosen = 0;
        for (const off of candidates) {
          const px = cx + off;
          // Can't push outside the allotted half-width of the lane.
          if (px < cx - halfWidth || px > cx + halfWidth) continue;
          let collides = false;
          for (const p of placed) {
            // Only neighbours close in y can matter.
            const dy = p.y - py;
            if (dy * dy > minDist2) continue;
            const dx = p.x - px;
            if (dx * dx + dy * dy < minDist2) {
              collides = true;
              break;
            }
          }
          if (!collides) {
            chosen = off;
            break;
          }
        }
        const px = cx + chosen;
        placed.push({ x: px, y: py });
        points.push({ x: px, y: py, raw });
      }

      out.push({ decade, cx, points });
    }
    return out;
  }, [xScale, yScale, bw, halfWidth]);

  const ticksY = yScale.ticks(5);

  // Pick representative anchor marks. We always render these (unconditional):
  // - a single highlighted point (first swarm's fastest time)
  // - the 2010s centre-axis gridline
  const highlightSwarm = swarms[0];
  const highlightPoint = highlightSwarm?.points[0];
  const widestSwarm = swarms[swarms.length - 1];

  return (
    <svg width={width} height={height} role="img" aria-label="Beeswarm chart">
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

        {/* Category centre axes — faint vertical guide per decade so the
            viewer can see the "spine" the swarm pivots around. */}
        <g data-data-layer="true">
          {swarms.map((s) => (
            <line
              key={s.decade}
              x1={s.cx}
              x2={s.cx}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="1 3"
            />
          ))}
        </g>

        {/* Points */}
        <g data-data-layer="true">
          {swarms.map((s) =>
            s.points.map((p, i) => (
              <circle
                key={`${s.decade}-${i}`}
                cx={p.x}
                cy={p.y}
                r={r}
                fill="var(--color-ink)"
                fillOpacity={0.85}
              />
            )),
          )}
        </g>

        {/* Anchor 1 — a single point (the fastest 1980s finisher). Every
            mark keeps its identity; this pin says "each dot is one runner." */}
        {highlightPoint && (
          <ExplainAnchor
            selector="point"
            index={1}
            pin={{ x: highlightPoint.x + 14, y: highlightPoint.y - 14 }}
            rect={{
              x: Math.max(0, highlightPoint.x - 8),
              y: Math.max(0, highlightPoint.y - 8),
              width: 16,
              height: 16,
            }}
          >
            <circle
              cx={highlightPoint.x}
              cy={highlightPoint.y}
              r={r + 0.8}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={1.2}
              data-data-layer="true"
            />
          </ExplainAnchor>
        )}

        {/* Anchor 2 — the swarm body (packing). Cover the widest lane so
            the viewer sees horizontal spread = local density. */}
        {widestSwarm && (
          <ExplainAnchor
            selector="swarm-packing"
            index={2}
            pin={{ x: widestSwarm.cx + halfWidth + 10, y: yScale(SPEC[widestSwarm.decade].mean) }}
            rect={{
              x: Math.max(0, widestSwarm.cx - halfWidth),
              y: 0,
              width: Math.min(iw, halfWidth * 2),
              height: ih,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3 — the category centre axis for one lane. */}
        {widestSwarm && (
          <ExplainAnchor
            selector="category-axis"
            index={3}
            pin={{ x: widestSwarm.cx, y: 12 }}
            rect={{
              x: Math.max(0, widestSwarm.cx - 2),
              y: 0,
              width: 4,
              height: ih,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 4 — X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => String(v).replace("s", "")}
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
        </ExplainAnchor>

        {/* Anchor 5 — Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -34, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => Number(v).toFixed(0)}
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
            MINUTES
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
