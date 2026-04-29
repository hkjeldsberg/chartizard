"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Study = { effect: number; se: number };

// ~20 published trials of a hypothetical intervention. Effect is log odds
// ratio; pooled truth ≈ −0.30 (modest protective effect). Precision is 1/SE.
// Large trials sit at the top (small SE, tight to the truth). Small trials
// sit at the bottom with noisier estimates. We then REMOVE several small
// trials whose effect landed on the null side (right of zero) — the
// file-drawer shadow. The asymmetry on the bottom-left is the story.
function generateStudies(): Study[] {
  let seed = 1997; // year Egger published his asymmetry test
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const pooled = -0.3;
  const raw: Study[] = [];

  // 6 large, high-precision trials (small SE, 0.05–0.12).
  for (let i = 0; i < 6; i++) {
    const se = 0.05 + rand() * 0.07;
    raw.push({ effect: pooled + gauss() * se, se });
  }
  // 8 mid-precision trials (SE 0.14–0.26).
  for (let i = 0; i < 8; i++) {
    const se = 0.14 + rand() * 0.12;
    raw.push({ effect: pooled + gauss() * se, se });
  }
  // 10 small trials (SE 0.30–0.55). A fraction of these will be dropped
  // below as publication-bias shadow.
  const smalls: Study[] = [];
  for (let i = 0; i < 10; i++) {
    const se = 0.3 + rand() * 0.25;
    smalls.push({ effect: pooled + gauss() * se, se });
  }

  // File-drawer the small null/adverse ones: drop small studies whose effect
  // landed on the right half of the funnel (effect > −0.1). This carves out
  // the bottom-right of the plot — wait, we want bottom-LEFT empty per the
  // spec's asymmetry. The chart encodes effect on x; "missing small null
  // results" in medicine means studies that failed to find benefit (effect
  // near or above 0). Those are the right-side small points. Drop THOSE.
  const kept = smalls.filter((s) => s.effect < -0.05 || rand() < 0.15);

  return [...raw, ...kept];
}

const DATA: ReadonlyArray<Study> = generateStudies();
const POOLED_EFFECT = -0.3;

interface Props {
  width: number;
  height: number;
}

export function FunnelPlotMetaChart({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // X: log odds ratio. Symmetric around the pooled effect so the funnel
  // geometry reads cleanly.
  const xScale = scaleLinear({
    domain: [-1.6, 1.0],
    range: [0, iw],
  });

  // Y: precision (1/SE). INVERTED so high precision sits at the TOP.
  // Domain covers all studies plus headroom for the funnel apex.
  const maxPrecision = Math.max(...DATA.map((s) => 1 / s.se)) * 1.05;
  const minPrecision = 1.3; // SE ≈ 0.77 — wider than any trial here
  const yScale = scaleLinear({
    domain: [minPrecision, maxPrecision],
    range: [ih, 0], // small precision at BOTTOM, large at TOP
  });

  const apexX = xScale(POOLED_EFFECT);
  const apexY = yScale(maxPrecision);

  // 95% expected bounds at any precision P: effect = pooled ± 1.96 / P.
  const boundLeft = (p: number) => xScale(POOLED_EFFECT - 1.96 / p);
  const boundRight = (p: number) => xScale(POOLED_EFFECT + 1.96 / p);
  const baseP = minPrecision;
  const leftBasePx = boundLeft(baseP);
  const rightBasePx = boundRight(baseP);

  // Representative study near the middle of the funnel (for the data-point
  // anchor). Pick the one closest to the centre in both dimensions.
  const rep = DATA.reduce((best, s) => {
    const score = Math.abs(s.effect - POOLED_EFFECT) + Math.abs(1 / s.se - 4);
    const bestScore =
      Math.abs(best.effect - POOLED_EFFECT) + Math.abs(1 / best.se - 4);
    return score < bestScore ? s : best;
  });
  const repX = xScale(rep.effect);
  const repY = yScale(1 / rep.se);

  // Gap rectangle — the bottom-left region where missing small null/adverse
  // studies would sit if publication bias weren't at work. Lives inside the
  // funnel, on the right-of-pooled half where small studies are sparse.
  const gapXStart = xScale(POOLED_EFFECT + 0.05);
  const gapXEnd = Math.min(iw, xScale(1.0));
  const gapYTop = yScale(2.8);
  const gapYBottom = Math.min(ih, yScale(minPrecision));

  return (
    <svg width={width} height={height} role="img" aria-label="Funnel plot">
      <Group left={margin.left} top={margin.top}>
        {/* Triangular funnel (95% bounds around pooled effect). */}
        <ExplainAnchor
          selector="funnel-boundary"
          index={3}
          pin={{ x: Math.max(0, leftBasePx - 10), y: Math.min(ih, gapYBottom - 6) }}
          rect={{
            x: Math.max(0, leftBasePx),
            y: 0,
            width: Math.max(1, Math.min(iw, rightBasePx) - Math.max(0, leftBasePx)),
            height: ih,
          }}
        >
          <g data-data-layer="true">
            {/* Left wall */}
            <line
              x1={apexX}
              y1={apexY}
              x2={leftBasePx}
              y2={gapYBottom}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            {/* Right wall */}
            <line
              x1={apexX}
              y1={apexY}
              x2={rightBasePx}
              y2={gapYBottom}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            {/* Central pooled-effect reference */}
            <line
              x1={apexX}
              y1={apexY}
              x2={apexX}
              y2={gapYBottom}
              stroke="var(--color-ink-mute)"
              strokeWidth={0.8}
              strokeDasharray="1 3"
            />
          </g>
        </ExplainAnchor>

        {/* Null line at effect = 0 — not a funnel wall, a semantic landmark. */}
        <g data-data-layer="true">
          <line
            x1={xScale(0)}
            y1={0}
            x2={xScale(0)}
            y2={ih}
            stroke="var(--color-hairline)"
            strokeWidth={0.8}
          />
          <text
            x={xScale(0) + 3}
            y={10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            NULL
          </text>
        </g>

        {/* Study points. */}
        <g data-data-layer="true">
          {DATA.map((s, i) => {
            const cx = xScale(s.effect);
            const cy = yScale(1 / s.se);
            const isRep = s === rep;
            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={isRep ? 3.6 : 2.6}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Asymmetric gap — missing small null-result trials (bottom-right of
            the funnel centre, the "file drawer" zone). */}
        <ExplainAnchor
          selector="asymmetric-gap"
          index={4}
          pin={{
            x: (gapXStart + gapXEnd) / 2,
            y: (gapYTop + gapYBottom) / 2,
          }}
          rect={{
            x: Math.max(0, gapXStart),
            y: Math.max(0, gapYTop),
            width: Math.max(1, gapXEnd - gapXStart),
            height: Math.max(1, gapYBottom - gapYTop),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Funnel apex — the pooled effect at highest precision. */}
        <ExplainAnchor
          selector="funnel-apex"
          index={1}
          pin={{ x: apexX, y: Math.max(0, apexY - 14) }}
          rect={{
            x: Math.max(0, apexX - 10),
            y: Math.max(0, apexY - 6),
            width: 20,
            height: 18,
          }}
        >
          <g data-data-layer="true">
            <line
              x1={apexX - 6}
              x2={apexX + 6}
              y1={apexY}
              y2={apexY}
              stroke="var(--color-ink)"
              strokeWidth={1.4}
            />
          </g>
        </ExplainAnchor>

        {/* Representative study inside the funnel. */}
        <ExplainAnchor
          selector="study-point"
          index={2}
          pin={{ x: Math.max(0, repX - 16), y: Math.max(0, repY - 16) }}
          rect={{
            x: Math.max(0, repX - 8),
            y: Math.max(0, repY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis. */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickValues={[-1.5, -1, -0.5, 0, 0.5, 1]}
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
            y={ih + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            LOG ODDS RATIO
          </text>
        </ExplainAnchor>

        {/* Y-axis (inverted precision). */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
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
            PRECISION (1/SE)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
