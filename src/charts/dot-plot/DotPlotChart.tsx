"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 60 exam scores (integers 50-99) drawn from a Gaussian-ish distribution
// centred at ~76. Seeded LCG with Box-Muller so server and client render the
// same dataset. The RugPlotChart uses the exact same function body with the
// same seed and parameters — the two charts are a genuine A/B pair.
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
    if (raw < 50 || raw > 99) continue; // clamp to the valid score range
    out.push(raw);
  }
  return out;
}

interface Props {
  width: number;
  height: number;
}

export function DotPlotChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const scores = useMemo(generateScores, []);

  // Count occurrences per integer score — each integer value gets a stacked
  // column of dots (one dot per student with that score).
  const { counts, maxCount, modalScore, medianScore } = useMemo(() => {
    const c = new Map<number, number>();
    for (const s of scores) c.set(s, (c.get(s) ?? 0) + 1);
    let max = 0;
    let mode = 76;
    for (const [score, n] of c) {
      if (n > max) {
        max = n;
        mode = score;
      }
    }
    const sorted = [...scores].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    const median =
      sorted.length % 2 === 0
        ? Math.round((sorted[mid - 1] + sorted[mid]) / 2)
        : sorted[mid];
    return { counts: c, maxCount: max, modalScore: mode, medianScore: median };
  }, [scores]);

  const xScale = scaleLinear({ domain: [49.5, 99.5], range: [0, iw] });
  const yScale = scaleLinear({
    domain: [0, Math.max(maxCount, 6)],
    range: [ih, 0],
    nice: false,
  });

  // Pixel-geometry for dots. Radius is driven by the x-scale's integer step
  // so stacks don't visually collide, with a floor for tiny widths.
  const step = Math.abs(xScale(51) - xScale(50));
  const r = Math.max(2.2, Math.min(4, step * 0.35));
  const rowH = r * 2 + 1;

  // Representative dots.
  const modalX = xScale(modalScore);
  const modalCount = counts.get(modalScore) ?? 0;
  const modalTopY = ih - modalCount * rowH - r;

  const medianX = xScale(medianScore);
  const medianCount = counts.get(medianScore) ?? 0;
  const medianTopY = ih - medianCount * rowH - r;

  // A single "one student" dot — bottom of the modal column.
  const singleCx = modalX;
  const singleCy = ih - r;

  // Shape of the distribution: bracket across the central mass (65-85).
  const shapeX0 = xScale(65);
  const shapeX1 = xScale(85);

  return (
    <svg width={width} height={height} role="img" aria-label="Dot plot (statistics)">
      <Group left={margin.left} top={margin.top}>
        {/* Hairline baseline the stacks sit on */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-hairline)"
          />
        </g>

        {/* Dots — one per student, stacked from the baseline up */}
        <g data-data-layer="true">
          {Array.from(counts.entries()).flatMap(([score, n]) => {
            const cx = xScale(score);
            return Array.from({ length: n }, (_, i) => {
              const cy = ih - r - i * rowH;
              return (
                <circle
                  key={`${score}-${i}`}
                  cx={cx}
                  cy={cy}
                  r={r}
                  fill="var(--color-ink)"
                  fillOpacity={0.88}
                />
              );
            });
          })}
        </g>

        {/* Anchor 1 — a single dot (one student) */}
        <ExplainAnchor
          selector="dot"
          index={1}
          pin={{ x: singleCx + r + 12, y: singleCy }}
          rect={{
            x: Math.max(0, singleCx - r - 2),
            y: Math.max(0, singleCy - r - 2),
            width: Math.min(iw, r * 2 + 4),
            height: r * 2 + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — the modal stacked column */}
        <ExplainAnchor
          selector="stack"
          index={2}
          pin={{ x: modalX, y: Math.max(-6, modalTopY - 14) }}
          rect={{
            x: Math.max(0, modalX - r - 2),
            y: Math.max(0, modalTopY - r),
            width: Math.min(iw, r * 2 + 4),
            height: Math.max(0, ih - modalTopY + r),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — distribution shape across the central mass */}
        <g data-data-layer="true">
          <line
            x1={shapeX0}
            x2={shapeX1}
            y1={ih + 14}
            y2={ih + 14}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={shapeX0}
            x2={shapeX0}
            y1={ih + 11}
            y2={ih + 17}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
          <line
            x1={shapeX1}
            x2={shapeX1}
            y1={ih + 11}
            y2={ih + 17}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        </g>
        <ExplainAnchor
          selector="shape"
          index={3}
          pin={{ x: (shapeX0 + shapeX1) / 2, y: Math.max(10, ih * 0.35) }}
          rect={{
            x: Math.max(0, shapeX0),
            y: 0,
            width: Math.min(iw, shapeX1 - shapeX0),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — the median column (specific landmark) */}
        <ExplainAnchor
          selector="median"
          index={4}
          pin={{ x: medianX, y: Math.max(-6, medianTopY - 14) }}
          rect={{
            x: Math.max(0, medianX - r - 2),
            y: Math.max(0, medianTopY - r),
            width: Math.min(iw, r * 2 + 4),
            height: Math.max(0, ih - medianTopY + r),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Y-axis (count, implicit from stack height) */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -28, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={Math.min(maxCount, 5)}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => String(v)}
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
            x={-36}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            STUDENTS
          </text>
        </ExplainAnchor>

        {/* X-axis (score) */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
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
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
