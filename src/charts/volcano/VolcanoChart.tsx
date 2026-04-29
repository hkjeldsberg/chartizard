"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Gene {
  name: string | null;
  log2fc: number;
  nlp: number; // -log10(p)
  highlight?: "up" | "down";
}

// Deterministic RNA-seq-style differential expression field. ~400 genes
// clustered near the origin (small fold change, high p-value), plus a
// minority flung into the two "volcano corners" where |log2FC| > 1 and
// p < 0.01, plus 4 labelled headline hits.
function generateGenes(): Gene[] {
  let seed = 7;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Gene[] = [];

  // Bulk — tight around the origin, long-ish tails, no significance.
  for (let i = 0; i < 340; i++) {
    const fc = gauss() * 0.9;
    const nlp = Math.abs(gauss()) * 1.2 + 0.2;
    out.push({ name: null, log2fc: fc, nlp });
  }

  // Significant hits — the erupting "volcano".
  for (let i = 0; i < 52; i++) {
    const side = rand() < 0.5 ? -1 : 1;
    const fc = side * (1.1 + rand() * 3.2);
    const nlp = 2.2 + rand() * 9.0;
    out.push({ name: null, log2fc: fc, nlp });
  }

  // Headline genes — pinned deterministically in the upper corners.
  out.push({ name: "TP53", log2fc: -2.8, nlp: 11.4, highlight: "down" });
  out.push({ name: "BRCA1", log2fc: -1.9, nlp: 7.8, highlight: "down" });
  out.push({ name: "MYC", log2fc: 3.1, nlp: 12.6, highlight: "up" });
  out.push({ name: "KRAS", log2fc: 2.2, nlp: 8.6, highlight: "up" });

  return out;
}

interface Props {
  width: number;
  height: number;
}

const FC_THRESHOLD = 1; // log2FC
const SIG_THRESHOLD = 2; // -log10(p) ==> p = 0.01

export function VolcanoChart({ width, height }: Props) {
  const margin = { top: 20, right: 24, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const genes = useMemo(() => generateGenes(), []);

  const xScale = scaleLinear({ domain: [-5, 5], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 15], range: [ih, 0] });

  const sigY = yScale(SIG_THRESHOLD);
  const fcLeftX = xScale(-FC_THRESHOLD);
  const fcRightX = xScale(FC_THRESHOLD);

  const myc = genes.find((g) => g.name === "MYC")!;
  const tp53 = genes.find((g) => g.name === "TP53")!;

  const mycX = xScale(myc.log2fc);
  const mycY = yScale(myc.nlp);
  const tp53X = xScale(tp53.log2fc);
  const tp53Y = yScale(tp53.nlp);

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(iw - 1, x)),
    y: Math.max(0, Math.min(ih - 1, y)),
    width: Math.max(1, Math.min(iw - Math.max(0, x), w)),
    height: Math.max(1, Math.min(ih - Math.max(0, y), h)),
  });

  return (
    <svg width={width} height={height} role="img" aria-label="Volcano plot">
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
        </g>

        {/* Non-significant points — faint */}
        <g data-data-layer="true">
          {genes
            .filter(
              (g) =>
                !g.name &&
                !(Math.abs(g.log2fc) > FC_THRESHOLD && g.nlp > SIG_THRESHOLD),
            )
            .map((g, i) => (
              <circle
                key={`ns-${i}`}
                cx={xScale(g.log2fc)}
                cy={yScale(g.nlp)}
                r={1.7}
                fill="var(--color-ink-mute)"
                opacity={0.45}
              />
            ))}
        </g>

        {/* Significant points — darker */}
        <g data-data-layer="true">
          {genes
            .filter(
              (g) =>
                !g.name &&
                Math.abs(g.log2fc) > FC_THRESHOLD &&
                g.nlp > SIG_THRESHOLD,
            )
            .map((g, i) => (
              <circle
                key={`sig-${i}`}
                cx={xScale(g.log2fc)}
                cy={yScale(g.nlp)}
                r={2.2}
                fill="var(--color-ink)"
              />
            ))}
        </g>

        {/* Headline labelled genes */}
        <g data-data-layer="true">
          {genes
            .filter((g) => g.name)
            .map((g) => {
              const cx = xScale(g.log2fc);
              const cy = yScale(g.nlp);
              const labelAnchor = g.highlight === "up" ? "start" : "end";
              const dx = g.highlight === "up" ? 6 : -6;
              return (
                <g key={g.name!}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={3.4}
                    fill="var(--color-surface)"
                    stroke="var(--color-ink)"
                    strokeWidth={1.4}
                  />
                  <text
                    x={cx + dx}
                    y={cy + 3}
                    textAnchor={labelAnchor}
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fill="var(--color-ink)"
                  >
                    {g.name}
                  </text>
                </g>
              );
            })}
        </g>

        {/* Fold-change threshold — dashed vertical lines at ±1 */}
        <ExplainAnchor
          selector="fold-change-threshold"
          index={3}
          pin={{ x: fcRightX + 10, y: yScale(13) }}
          rect={clampRect(fcLeftX - 4, 0, fcRightX - fcLeftX + 8, ih)}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: fcLeftX, y: 0 }}
              to={{ x: fcLeftX, y: ih }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <Line
              from={{ x: fcRightX, y: 0 }}
              to={{ x: fcRightX, y: ih }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
          </g>
        </ExplainAnchor>

        {/* Significance threshold — dashed horizontal at p = 0.01 */}
        <ExplainAnchor
          selector="significance-threshold"
          index={4}
          pin={{ x: xScale(-4), y: sigY - 10 }}
          rect={clampRect(0, sigY - 5, iw, 10)}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: sigY }}
              to={{ x: iw, y: sigY }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={sigY - 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              p = 0.01
            </text>
          </g>
        </ExplainAnchor>

        {/* Up-regulated corner — upper-right */}
        <ExplainAnchor
          selector="up-regulated-corner"
          index={1}
          pin={{ x: xScale(3.5), y: yScale(13) }}
          rect={clampRect(fcRightX, 0, iw - fcRightX, sigY)}
        >
          <g />
        </ExplainAnchor>

        {/* Down-regulated corner — upper-left */}
        <ExplainAnchor
          selector="down-regulated-corner"
          index={2}
          pin={{ x: xScale(-3.5), y: yScale(13) }}
          rect={clampRect(0, 0, fcLeftX, sigY)}
        >
          <g />
        </ExplainAnchor>

        {/* Labelled headline gene — MYC */}
        <ExplainAnchor
          selector="labelled-gene"
          index={5}
          pin={{ x: mycX + 32, y: mycY - 14 }}
          rect={clampRect(mycX - 8, mycY - 8, 16, 16)}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
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
            LOG2 FOLD CHANGE
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={7}
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            -LOG10(P)
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
