"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { line as d3Line, curveBasis } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

const MONTHS = [
  { name: "Jan", mean: 24, sd: 10 },
  { name: "Feb", mean: 28, sd: 10 },
  { name: "Mar", mean: 39, sd: 10 },
  { name: "Apr", mean: 51, sd: 9 },
  { name: "May", mean: 62, sd: 8 },
  { name: "Jun", mean: 72, sd: 7 },
  { name: "Jul", mean: 76, sd: 6 },
  { name: "Aug", mean: 74, sd: 6 },
  { name: "Sep", mean: 66, sd: 8 },
  { name: "Oct", mean: 54, sd: 9 },
  { name: "Nov", mean: 40, sd: 9 },
  { name: "Dec", mean: 30, sd: 10 },
] as const;

// Seeded LCG + Box-Muller. Deterministic so server and client agree.
function makeRand(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function gauss(rand: () => number) {
  const u = 1 - rand();
  const v = rand();
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
}

function sampleMonth(n: number, mean: number, sd: number, seed: number): number[] {
  const rand = makeRand(seed);
  const out: number[] = [];
  for (let i = 0; i < n; i++) out.push(mean + sd * gauss(rand));
  return out;
}

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

export function RidgelineChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { curves, globalMax } = useMemo(() => {
    const domain: [number, number] = [-10, 110];
    const gridN = 180;
    const bandwidth = 2.5;
    const step = (domain[1] - domain[0]) / (gridN - 1);
    const grid: number[] = [];
    for (let i = 0; i < gridN; i++) grid.push(domain[0] + i * step);

    let gmax = 0;
    const perMonth = MONTHS.map((m, i) => {
      const samples = sampleMonth(200, m.mean, m.sd, 7 + i * 31);
      const densities = kde(samples, grid, bandwidth);
      let peak = 0;
      let peakIdx = 0;
      for (let k = 0; k < densities.length; k++) {
        if (densities[k] > peak) {
          peak = densities[k];
          peakIdx = k;
        }
      }
      if (peak > gmax) gmax = peak;
      return {
        name: m.name,
        points: grid.map((x, k) => ({ x, d: densities[k] })),
        peak,
        peakX: grid[peakIdx],
      };
    });
    return { curves: perMonth, globalMax: gmax };
  }, []);

  const xScale = scaleLinear({ domain: [-10, 110], range: [0, iw] });

  // Row layout: 12 rows packed into ih. Leave headroom at the top so the
  // first (Jan) ridge's peak doesn't escape the plot area — we reserve
  // roughly one curveHeight at the top for that.
  //
  //   totalRows * rowSpacing + curveHeadroom == ih
  //   curveHeadroom == curveHeight - rowSpacing   (extra height the tallest
  //                                               curve pokes above baseline)
  //   => rowSpacing * (totalRows + overlap) == ih   where overlap == 0.55
  const OVERLAP = 0.55;
  const rowSpacing = ih / (MONTHS.length + OVERLAP);
  // each KDE extends upward by (1 + OVERLAP) * rowSpacing so adjacent rows
  // overlap by ~40% and the top-most curve's peak still lands inside the plot.
  const curveHeight = rowSpacing * (1 + OVERLAP);

  const curveYForRow = (rowIdx: number, d: number) => {
    // baseline for month i sits at (i + 1 + OVERLAP) * rowSpacing so the
    // tallest possible peak (at i=0) lands at y = OVERLAP * rowSpacing >= 0.
    const baseline = (rowIdx + 1 + OVERLAP) * rowSpacing;
    return baseline - (d / globalMax) * curveHeight;
  };

  const baselineForRow = (rowIdx: number) =>
    (rowIdx + 1 + OVERLAP) * rowSpacing;

  const pathFor = (rowIdx: number, points: { x: number; d: number }[]) => {
    const baseline = baselineForRow(rowIdx);
    const gen = d3Line<{ x: number; d: number }>()
      .x((p) => xScale(p.x))
      .y((p) => curveYForRow(rowIdx, p.d))
      .curve(curveBasis);
    const top = gen(points) ?? "";
    // close to baseline for fill
    const firstX = xScale(points[0].x);
    const lastX = xScale(points[points.length - 1].x);
    return `${top} L ${lastX} ${baseline} L ${firstX} ${baseline} Z`;
  };

  // anchor helper values
  const julyIdx = 6;
  const julyCurve = curves[julyIdx];
  const julyPeakX = xScale(julyCurve.peakX);
  const julyPeakY = curveYForRow(julyIdx, julyCurve.peak);

  const janIdx = 0;
  const janCurve = curves[janIdx];
  const janPeakX = xScale(janCurve.peakX);
  const janTopY = curveYForRow(janIdx, janCurve.peak);

  // overlap zone: between July (row 6) and August (row 7) — both warm,
  // tight, strongly overlapping.
  const augIdx = 7;
  const overlapTop = Math.min(
    curveYForRow(julyIdx, julyCurve.peak),
    curveYForRow(augIdx, curves[augIdx].peak),
  );
  const overlapBaseline = baselineForRow(augIdx);

  // clamp helper
  const clamp = (x: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, x));

  return (
    <svg width={width} height={height} role="img" aria-label="Ridgeline plot">
      <Group left={margin.left} top={margin.top}>
        {/* Ridges — drawn from top (Jan) to bottom (Dec); later rows draw
            ON TOP of earlier ones so overlap reads as layered. */}
        <g data-data-layer="true">
          {curves.map((c, i) => {
            // gentle warm gradient: winter = cool ink, summer = warm tint
            // Use opacity variation on ink + a tint shift via mixing.
            const warmth = 1 - Math.abs(i - 6) / 6; // 0 at Jan/Dec, 1 at Jul
            const opacity = 0.35 + 0.15 * warmth;
            return (
              <g key={c.name}>
                <path
                  d={pathFor(i, c.points)}
                  fill="var(--color-ink)"
                  fillOpacity={opacity}
                  stroke="var(--color-ink)"
                  strokeWidth={1.1}
                  strokeOpacity={0.85}
                />
              </g>
            );
          })}
        </g>

        {/* Month labels on the y-axis (one per row) */}
        <g data-data-layer="true">
          {curves.map((c, i) => (
            <text
              key={c.name}
              x={-8}
              y={baselineForRow(i)}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
              dy="0.33em"
            >
              {c.name.toUpperCase()}
            </text>
          ))}
        </g>

        {/* Anchor 1: one ridge (pick May — middle row, clearly visible) */}
        {(() => {
          const mayIdx = 4;
          const may = curves[mayIdx];
          const baseline = baselineForRow(mayIdx);
          const peakY = curveYForRow(mayIdx, may.peak);
          const rectY = clamp(peakY - 4, 0, ih);
          const rectH = clamp(baseline - rectY, 0, ih - rectY);
          return (
            <ExplainAnchor
              selector="ridge"
              index={1}
              pin={{
                x: clamp(xScale(may.peakX) + 18, 0, iw),
                y: clamp((peakY + baseline) / 2, 0, ih),
              }}
              rect={{
                x: 0,
                y: rectY,
                width: iw,
                height: rectH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 2: peak of July (the tight summer mode near 76°F) */}
        <g data-data-layer="true">
          <circle
            cx={julyPeakX}
            cy={julyPeakY}
            r={2.5}
            fill="var(--color-ink)"
          />
        </g>
        <ExplainAnchor
          selector="peak"
          index={2}
          pin={{
            x: clamp(julyPeakX + 16, 0, iw),
            y: clamp(julyPeakY - 12, 0, ih),
          }}
          rect={{
            x: clamp(julyPeakX - 10, 0, iw),
            y: clamp(julyPeakY - 8, 0, ih),
            width: 20,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: overlap — vertical sliver between July and August */}
        <ExplainAnchor
          selector="overlap"
          index={3}
          pin={{
            x: clamp(xScale(75) + 18, 0, iw),
            y: clamp((overlapTop + overlapBaseline) / 2, 0, ih),
          }}
          rect={{
            x: clamp(xScale(60), 0, iw),
            y: clamp(overlapTop, 0, ih),
            width: clamp(xScale(90) - xScale(60), 0, iw),
            height: clamp(overlapBaseline - overlapTop, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: season-drift — arc following peak locations across rows */}
        {(() => {
          // Use Jan (cold, left) and Jul (warm, right) as endpoints of
          // the drift; rect spans the peak band vertically + horizontally.
          const leftX = clamp(janPeakX, 0, iw);
          const rightX = clamp(julyPeakX, 0, iw);
          const topY = clamp(julyPeakY - 6, 0, ih);
          const bottomY = clamp(janTopY + 6, 0, ih);
          return (
            <>
              <g data-data-layer="true">
                {/* Subtle connecting line between Jan peak and Jul peak */}
                <line
                  x1={janPeakX}
                  y1={janTopY}
                  x2={julyPeakX}
                  y2={julyPeakY}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.8}
                  strokeDasharray="2 3"
                  opacity={0.6}
                />
              </g>
              <ExplainAnchor
                selector="season-drift"
                index={4}
                pin={{
                  x: clamp((leftX + rightX) / 2, 0, iw),
                  y: clamp((topY + bottomY) / 2 - 14, 0, ih),
                }}
                rect={{
                  x: Math.min(leftX, rightX),
                  y: Math.min(topY, bottomY),
                  width: Math.abs(rightX - leftX),
                  height: Math.abs(bottomY - topY),
                }}
              >
                <g />
              </ExplainAnchor>
            </>
          );
        })()}

        {/* Anchor 5: x-axis (temperature °F) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `${v}°`}
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
            TEMPERATURE °F
          </text>
        </ExplainAnchor>

        {/* Anchor 6: y-axis (months) */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
