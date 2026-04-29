"use client";

import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { BarStack } from "@visx/shape";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// rs1426654 (SLC24A5) allele frequencies from 1000 Genomes Project phase 3
// Alleles: G (ancestral) and A (derived, associated with lighter skin)
// Super-populations: AFR, EUR, EAS, AMR, SAS
// Source: Ensembl / 1000 Genomes phase 3
const POPULATIONS = [
  { pop: "AFR", label: "Yoruba (AFR)", A: 0.01, G: 0.99 },
  { pop: "EUR", label: "European (EUR)", A: 0.99, G: 0.01 },
  { pop: "EAS", label: "East Asian (EAS)", A: 0.02, G: 0.98 },
  { pop: "AMR", label: "Amer. (AMR)", A: 0.38, G: 0.62 },
  { pop: "SAS", label: "South Asian (SAS)", A: 0.78, G: 0.22 },
] as const;

type PopDatum = { pop: string; label: string; A: number; G: number };

const ALLELES = ["G", "A"] as const;
type Allele = (typeof ALLELES)[number];

// Colour scheme: derived A allele = ink (dark), ancestral G = hairline (light)
const ALLELE_FILL: Record<Allele, string> = {
  G: "var(--color-hairline)",
  A: "var(--color-ink)",
};

export function AlleleChart({ width, height }: { width: number; height: number }) {
  const margin = { top: 24, right: 80, bottom: 52, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = POPULATIONS as unknown as PopDatum[];

  const xScale = scaleBand({
    domain: data.map((d) => d.pop),
    range: [0, iw],
    padding: 0.25,
  });

  const yScale = scaleLinear({
    domain: [0, 1],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);

  // Legend position: right of chart
  const legendX = iw + 12;
  const legendY = 8;

  // Key positions for anchors
  const eurBarX = (xScale("EUR") ?? 0) + xScale.bandwidth() / 2;
  const afrBarX = (xScale("AFR") ?? 0) + xScale.bandwidth() / 2;

  return (
    <svg width={width} height={height} role="img" aria-label="Allele frequency chart for rs1426654 (SLC24A5) across 1000 Genomes super-populations">
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
              strokeDasharray={t === 0 || t === 1 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Stacked bars */}
        <ExplainAnchor
          selector="stacked-bars"
          index={1}
          pin={{ x: iw / 2, y: ih / 2 - 14 }}
          rect={{ x: 0, y: 0, width: iw, height: ih }}
        >
          <g data-data-layer="true">
            <BarStack
              data={data}
              keys={[...ALLELES]}
              x={(d) => d.pop}
              xScale={xScale}
              yScale={yScale}
              color={(key) => ALLELE_FILL[key as Allele]}
            >
              {(barStacks) =>
                barStacks.map((barStack) =>
                  barStack.bars.map((bar) => (
                    <rect
                      key={`${barStack.index}-${bar.index}`}
                      x={bar.x}
                      y={bar.y}
                      width={bar.width}
                      height={bar.height}
                      fill={bar.color}
                      stroke="var(--color-page)"
                      strokeWidth={0.5}
                    />
                  ))
                )
              }
            </BarStack>
          </g>
        </ExplainAnchor>

        {/* Derived-A allele pin (EUR bar — near-fixation) */}
        <ExplainAnchor
          selector="derived-allele"
          index={2}
          pin={{ x: eurBarX + (xScale.bandwidth() / 2) + 8, y: yScale(0.99) - 8 }}
          rect={{
            x: xScale("EUR") ?? 0,
            y: 0,
            width: xScale.bandwidth(),
            height: ih * 0.15,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Ancestral-G allele pin (AFR bar — near-fixation) */}
        <ExplainAnchor
          selector="ancestral-allele"
          index={3}
          pin={{ x: afrBarX - (xScale.bandwidth() / 2) - 8, y: yScale(0.5) }}
          rect={{
            x: xScale("AFR") ?? 0,
            y: ih * 0.85,
            width: xScale.bandwidth(),
            height: ih * 0.15,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (populations) */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => v}
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
            y={ih + 42}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            1000 GENOMES SUPER-POPULATION
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            FREQ
          </text>
        </ExplainAnchor>

        {/* Legend */}
        <ExplainAnchor
          selector="legend"
          index={6}
          pin={{ x: legendX + 36, y: legendY }}
          rect={{ x: legendX, y: legendY - 4, width: 68, height: 34 }}
        >
          <g data-data-layer="true">
            {/* A allele */}
            <rect
              x={legendX}
              y={legendY}
              width={10}
              height={10}
              fill="var(--color-ink)"
            />
            <text
              x={legendX + 14}
              y={legendY + 9}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              A (derived)
            </text>
            {/* G allele */}
            <rect
              x={legendX}
              y={legendY + 16}
              width={10}
              height={10}
              fill="var(--color-hairline)"
              stroke="var(--color-ink-mute)"
              strokeWidth={0.5}
            />
            <text
              x={legendX + 14}
              y={legendY + 25}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              G (ancestral)
            </text>
          </g>
        </ExplainAnchor>

        {/* SNP label */}
        <text
          x={0}
          y={-8}
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          rs1426654 · SLC24A5
        </text>
      </Group>
    </svg>
  );
}
