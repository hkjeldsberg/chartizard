"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Human Chromosome 17 — ideogram data ─────────────────────────────────────
// Cytogenetic band coordinates are approximate, based on ISCN 2020 (An
// International System for Human Cytogenomic Nomenclature, 2020, Karger).
// Chromosome 17 total length ≈ 83 Mb. Centromere at ~25 Mb from p-terminus.
// BRCA1 at 17q21.31 (≈41–42 Mb); TP53 at 17p13.1 (≈7.6–7.7 Mb).
//
// Giemsa (G) banding: "dark" = G-dark band (AT-rich, late replicating);
// "light" = G-light band (GC-rich, early replicating);
// "centromere" = pericentromeric heterochromatin.

type BandType = "dark" | "light" | "centromere" | "telomere-zone";

interface Band {
  name: string;
  startMb: number;
  endMb: number;
  type: BandType;
  arm: "p" | "q" | "cen";
}

// Total chromosome length used for scaling: 83 Mb
const CHR17_LENGTH_MB = 83;
// Centromere spans ~24–26 Mb
const CEN_START_MB = 24;
const CEN_END_MB = 26;

const BANDS: ReadonlyArray<Band> = [
  // ── p-arm (short arm, top) ──
  { name: "p13.3", startMb: 0,    endMb: 3.5,  type: "dark",  arm: "p" },
  { name: "p13.2", startMb: 3.5,  endMb: 6.0,  type: "light", arm: "p" },
  { name: "p13.1", startMb: 6.0,  endMb: 8.5,  type: "dark",  arm: "p" }, // TP53 ~7.6 Mb
  { name: "p12",   startMb: 8.5,  endMb: 14.0, type: "light", arm: "p" },
  { name: "p11.2", startMb: 14.0, endMb: 20.0, type: "dark",  arm: "p" },
  { name: "p11.1", startMb: 20.0, endMb: 24.0, type: "light", arm: "p" },
  // ── centromere ──
  { name: "cen",   startMb: CEN_START_MB, endMb: CEN_END_MB, type: "centromere", arm: "cen" },
  // ── q-arm (long arm, bottom) ──
  { name: "q11.1", startMb: 26.0, endMb: 29.0, type: "light", arm: "q" },
  { name: "q11.2", startMb: 29.0, endMb: 32.0, type: "dark",  arm: "q" },
  { name: "q12",   startMb: 32.0, endMb: 35.0, type: "light", arm: "q" },
  { name: "q21.1", startMb: 35.0, endMb: 37.5, type: "dark",  arm: "q" },
  { name: "q21.2", startMb: 37.5, endMb: 39.5, type: "light", arm: "q" },
  { name: "q21.31",startMb: 39.5, endMb: 42.0, type: "dark",  arm: "q" }, // BRCA1 ~41 Mb
  { name: "q21.32",startMb: 42.0, endMb: 43.5, type: "light", arm: "q" },
  { name: "q21.33",startMb: 43.5, endMb: 45.0, type: "dark",  arm: "q" },
  { name: "q22",   startMb: 45.0, endMb: 48.0, type: "light", arm: "q" },
  { name: "q23.1", startMb: 48.0, endMb: 51.0, type: "dark",  arm: "q" },
  { name: "q23.2", startMb: 51.0, endMb: 53.0, type: "light", arm: "q" },
  { name: "q23.3", startMb: 53.0, endMb: 56.0, type: "dark",  arm: "q" },
  { name: "q24",   startMb: 56.0, endMb: 60.0, type: "light", arm: "q" },
  { name: "q25",   startMb: 60.0, endMb: 83.0, type: "dark",  arm: "q" },
];

// Gene annotations
const GENE_ANNOTATIONS = [
  { name: "TP53", mb: 7.65,  arm: "p" as const, description: "17p13.1" },
  { name: "BRCA1", mb: 41.2, arm: "q" as const, description: "17q21.31" },
];

// Band fill colours — ink-palette compliant
function bandFill(type: BandType): string {
  switch (type) {
    case "dark":        return "var(--color-ink)";
    case "centromere":  return "var(--color-ink)";
    case "light":       return "var(--color-surface)";
    case "telomere-zone": return "var(--color-ink)";
  }
}

function bandOpacity(type: BandType): number {
  switch (type) {
    case "dark":        return 0.65;
    case "centromere":  return 0.9;
    case "light":       return 0.08;
    case "telomere-zone": return 0.5;
  }
}

interface Props {
  width: number;
  height: number;
}

export function Ideogram({ width, height }: Props) {
  // Generous left margin for band labels; right margin for gene annotations
  const margin = { top: 24, right: 90, bottom: 24, left: 64 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Chromosome bar geometry
  const barWidth = Math.max(16, Math.min(32, iw * 0.4));
  const barX = Math.max(0, iw / 2 - barWidth / 2);

  // Scale Mb → SVG y (0 = top = p-terminus = telomere)
  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, CHR17_LENGTH_MB],
        range: [0, ih],
        clamp: true,
      }),
    [ih],
  );

  const cenY0 = yScale(CEN_START_MB);
  const cenY1 = yScale(CEN_END_MB);
  const cenMidY = (cenY0 + cenY1) / 2;

  // Telomere cap radius
  const capR = barWidth / 2;

  // Centromere waist — narrower width at the midpoint
  const waistWidth = barWidth * 0.55;
  const waistX = barX + (barWidth - waistWidth) / 2;

  // Build chromosome bar outline as a path that includes the telomere caps
  // and the centromere constriction.
  // The bar top telomere is at y=0; bottom telomere at y=ih.
  const pArmPath = buildArmPath(barX, 0, barWidth, cenY0, cenY0, waistWidth, waistX, "p");
  const qArmPath = buildArmPath(barX, cenY1, barWidth, ih, 0, waistWidth, waistX, "q");

  // Gene annotation layout
  const annotations = GENE_ANNOTATIONS.map((gene) => ({
    ...gene,
    y: yScale(gene.mb),
    arrowTipX: barX + barWidth,
    labelX: barX + barWidth + 8,
  }));

  // Anchor rects
  const pArmBand = BANDS.find((b) => b.arm === "p" && b.type === "dark");
  const pArmY0 = pArmBand ? yScale(pArmBand.startMb) : 0;
  const pArmY1 = yScale(CEN_START_MB);

  const qArmBand = BANDS.find((b) => b.arm === "q" && b.type === "dark" && b.name !== "cen");
  const qArmY0 = yScale(CEN_END_MB);
  const qArmY1 = ih;

  // BRCA1 annotation
  const brca1Anno = annotations.find((a) => a.name === "BRCA1")!;
  const tp53Anno = annotations.find((a) => a.name === "TP53")!;

  // q21.31 band — the named G-band for the cytogenetic-address anchor
  const q2131Band = BANDS.find((b) => b.name === "q21.31")!;
  const q2131Y0 = yScale(q2131Band.startMb);
  const q2131Y1 = yScale(q2131Band.endMb);

  return (
    <svg width={width} height={height} role="img" aria-label="Ideogram — human chromosome 17">
      <Group left={margin.left} top={margin.top}>
        {/* Band fills — the G-banding pattern */}
        <g data-data-layer="true">
          {BANDS.filter((b) => b.type !== "centromere").map((band) => {
            const y0 = yScale(band.startMb);
            const y1 = yScale(band.endMb);
            const h = Math.max(0, y1 - y0);
            return (
              <rect
                key={band.name}
                x={barX}
                y={y0}
                width={barWidth}
                height={h}
                fill={bandFill(band.type)}
                fillOpacity={bandOpacity(band.type)}
              />
            );
          })}
        </g>

        {/* Chromosome outline — p-arm and q-arm with centromere waist */}
        <g data-data-layer="true">
          {/* p-arm outline */}
          <path
            d={pArmPath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeOpacity={0.7}
          />
          {/* q-arm outline */}
          <path
            d={qArmPath}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeOpacity={0.7}
          />
          {/* Centromere band fill */}
          {(() => {
            const cenBand = BANDS.find((b) => b.type === "centromere")!;
            const y0 = yScale(cenBand.startMb);
            const y1 = yScale(cenBand.endMb);
            const h = Math.max(0, y1 - y0);
            // Draw as a constriction rect
            return (
              <rect
                x={waistX}
                y={y0}
                width={waistWidth}
                height={h}
                fill={bandFill("centromere")}
                fillOpacity={bandOpacity("centromere")}
              />
            );
          })()}
        </g>

        {/* Band labels — left side, alternating dark/light bands */}
        <g data-data-layer="true">
          {BANDS.filter((b) => b.type !== "centromere").map((band) => {
            const midY = yScale((band.startMb + band.endMb) / 2);
            const bandHeight = yScale(band.endMb) - yScale(band.startMb);
            if (bandHeight < 6) return null;
            return (
              <text
                key={`lbl-${band.name}`}
                x={barX - 4}
                y={midY}
                textAnchor="end"
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={Math.min(9, bandHeight * 0.65)}
                fill="var(--color-ink-soft)"
              >
                {band.name}
              </text>
            );
          })}
          {/* centromere label */}
          <text
            x={barX - 4}
            y={cenMidY}
            textAnchor="end"
            dominantBaseline="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            cen
          </text>
        </g>

        {/* Gene annotation arrows */}
        <g data-data-layer="true">
          {annotations.map((gene) => (
            <g key={`gene-${gene.name}`}>
              {/* Horizontal tick from bar to label */}
              <line
                x1={barX + barWidth}
                y1={gene.y}
                x2={barX + barWidth + 6}
                y2={gene.y}
                stroke="var(--color-ink)"
                strokeWidth={1}
                strokeOpacity={0.8}
              />
              <text
                x={barX + barWidth + 8}
                y={gene.y}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fontWeight="600"
                fill="var(--color-ink)"
              >
                {gene.name}
              </text>
              <text
                x={barX + barWidth + 8}
                y={gene.y + 10}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={7.5}
                fill="var(--color-ink-mute)"
              >
                {gene.description}
              </text>
            </g>
          ))}
        </g>

        {/* Chromosome 17 label */}
        <g data-data-layer="true">
          <text
            x={barX + barWidth / 2}
            y={-10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight="600"
            fill="var(--color-ink)"
          >
            chr17
          </text>
        </g>

        {/* ── ExplainAnchors ── */}

        {/* p-arm */}
        <ExplainAnchor
          selector="p-arm"
          index={1}
          pin={{ x: Math.max(10, barX - 14), y: pArmY0 + (pArmY1 - pArmY0) / 2 }}
          rect={{
            x: Math.max(0, barX),
            y: Math.max(0, pArmY0),
            width: Math.min(barWidth, iw - Math.max(0, barX)),
            height: Math.min(pArmY1 - pArmY0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* q-arm */}
        <ExplainAnchor
          selector="q-arm"
          index={2}
          pin={{ x: Math.max(10, barX - 14), y: qArmY0 + (qArmY1 - qArmY0) / 2 }}
          rect={{
            x: Math.max(0, barX),
            y: Math.max(0, qArmY0),
            width: Math.min(barWidth, iw - Math.max(0, barX)),
            height: Math.min(qArmY1 - qArmY0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Centromere waist */}
        <ExplainAnchor
          selector="centromere"
          index={3}
          pin={{ x: Math.max(10, waistX - 14), y: cenMidY }}
          rect={{
            x: Math.max(0, waistX),
            y: Math.max(0, cenY0),
            width: Math.min(waistWidth, iw - Math.max(0, waistX)),
            height: Math.min(cenY1 - cenY0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* G-band cytogenetic address — q21.31 */}
        <ExplainAnchor
          selector="g-band"
          index={4}
          pin={{
            x: Math.min(iw - 10, barX + barWidth + 50),
            y: q2131Y0 + (q2131Y1 - q2131Y0) / 2,
          }}
          rect={{
            x: Math.max(0, barX),
            y: Math.max(0, q2131Y0),
            width: Math.min(barWidth, iw - Math.max(0, barX)),
            height: Math.min(q2131Y1 - q2131Y0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* BRCA1 gene annotation arrow */}
        <ExplainAnchor
          selector="gene-annotation"
          index={5}
          pin={{
            x: Math.min(iw - 10, brca1Anno.labelX + 32),
            y: brca1Anno.y - 12,
          }}
          rect={{
            x: Math.max(0, barX + barWidth),
            y: Math.max(0, brca1Anno.y - 10),
            width: Math.min(60, iw - Math.max(0, barX + barWidth)),
            height: Math.min(24, ih - Math.max(0, brca1Anno.y - 10)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Telomere cap — top (p-terminus) */}
        <ExplainAnchor
          selector="telomere"
          index={6}
          pin={{ x: Math.min(iw - 10, barX + barWidth + 12), y: capR / 2 }}
          rect={{
            x: Math.max(0, barX),
            y: 0,
            width: Math.min(barWidth, iw - Math.max(0, barX)),
            height: Math.min(capR, ih),
          }}
        >
          {/* Top telomere rounded cap */}
          <g data-data-layer="true">
            <path
              d={`M ${barX} 0 A ${capR} ${capR} 0 0 1 ${barX + barWidth} 0`}
              fill="var(--color-ink)"
              fillOpacity={0.7}
            />
            {/* Bottom telomere */}
            <path
              d={`M ${barX} ${ih} A ${capR} ${capR} 0 0 0 ${barX + barWidth} ${ih}`}
              fill="var(--color-ink)"
              fillOpacity={0.7}
            />
          </g>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}

// ─── Helper: build arm outline path ──────────────────────────────────────────
// Draws the chromosome arm outline from topY to bottomY, tapering to the
// centromere waist at the bottom (for p-arm) or top (for q-arm).
function buildArmPath(
  barX: number,
  topY: number,
  barWidth: number,
  bottomY: number,
  _constrictionOffset: number,
  waistWidth: number,
  waistX: number,
  arm: "p" | "q",
): string {
  const capR = barWidth / 2;
  const rightX = barX + barWidth;
  const waistRightX = waistX + waistWidth;

  if (arm === "p") {
    // p-arm: rounded top, tapers to waist at bottom
    // Left side: straight down from top-left to waist-left
    // Right side: straight down from top-right to waist-right
    return [
      `M ${barX} ${topY}`,
      `A ${capR} ${capR} 0 0 1 ${rightX} ${topY}`, // top arc (telomere)
      `L ${rightX} ${bottomY - 2}`,
      `Q ${rightX} ${bottomY} ${waistRightX} ${bottomY}`,
      `L ${waistX} ${bottomY}`,
      `Q ${barX} ${bottomY} ${barX} ${bottomY - 2}`,
      `Z`,
    ].join(" ");
  } else {
    // q-arm: tapers from waist at top to rounded bottom
    return [
      `M ${waistX} ${topY}`,
      `L ${waistRightX} ${topY}`,
      `Q ${rightX} ${topY} ${rightX} ${topY + 2}`,
      `L ${rightX} ${bottomY}`,
      `A ${capR} ${capR} 0 0 1 ${barX} ${bottomY}`,
      `L ${barX} ${topY + 2}`,
      `Q ${barX} ${topY} ${waistX} ${topY}`,
      `Z`,
    ].join(" ");
  }
}
