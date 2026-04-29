"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { Line } from "@visx/shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Approximate human autosome + X chromosome lengths (Mb), rounded. Only the
// relative sizes matter for the band layout — the values are illustrative,
// not precise genome coordinates.
const CHROM_LENGTHS_MB: ReadonlyArray<number> = [
  249, 242, 198, 190, 182, 171, 159, 145, 138, 134,
  135, 133, 114, 107, 102, 90, 83, 80, 59, 64,
  47, 51, 156,
];

const CHROM_LABELS: ReadonlyArray<string> = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22", "X",
];

// Chromosomes (1-indexed) that carry a GWAS "peak" cluster in this synthetic
// dataset. Chosen to spread peaks across the genome so the eye has something
// to do at both ends.
const PEAK_CHROMS = new Set<number>([3, 7, 9, 11, 17, 19]);

const SIG_THRESHOLD = -Math.log10(5e-8); // ≈ 7.301
const SUGGESTIVE_THRESHOLD = 5; // -log10(1e-5)

interface Snp {
  chrom: number; // 1..23 where 23 = X
  pos: number; // cumulative genome position in Mb
  nlp: number; // -log10(p)
  isPeak: boolean;
}

function generateSnps(): { snps: Snp[]; bands: Array<{ chrom: number; start: number; end: number; label: string }> } {
  // Build cumulative band offsets.
  const bands: Array<{ chrom: number; start: number; end: number; label: string }> = [];
  let cursor = 0;
  CHROM_LENGTHS_MB.forEach((len, i) => {
    bands.push({
      chrom: i + 1,
      start: cursor,
      end: cursor + len,
      label: CHROM_LABELS[i],
    });
    cursor += len;
  });

  // Seeded LCG — deterministic across renders.
  let seed = 17;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const snps: Snp[] = [];

  // Baseline noise: ~2500 SNPs sprinkled uniformly across the genome with
  // low -log10(p). Use rejection sampling against relative chromosome length
  // to keep density roughly uniform.
  const genomeLen = cursor;
  const TARGET_BULK = 2500;
  for (let i = 0; i < TARGET_BULK; i++) {
    const pos = rand() * genomeLen;
    // Find chromosome.
    let chrom = 1;
    for (let b = 0; b < bands.length; b++) {
      if (pos >= bands[b].start && pos < bands[b].end) {
        chrom = bands[b].chrom;
        break;
      }
    }
    const nlp = rand() * 3; // 0..3
    snps.push({ chrom, pos, nlp, isPeak: false });
  }

  // Peak clusters — 8..15 SNPs per peak chromosome, nlp in [7, 11].
  for (const chrom of PEAK_CHROMS) {
    const band = bands[chrom - 1];
    const clusterCentre = band.start + band.end - band.start === 0
      ? band.start
      : band.start + (0.25 + rand() * 0.5) * (band.end - band.start);
    const size = 8 + Math.floor(rand() * 8); // 8..15
    for (let i = 0; i < size; i++) {
      // Concentrate positions within ~6 Mb of the cluster centre.
      const pos = Math.max(
        band.start,
        Math.min(band.end, clusterCentre + (rand() - 0.5) * 12),
      );
      const nlp = 7 + rand() * 4; // 7..11
      snps.push({ chrom, pos, nlp, isPeak: true });
    }
  }

  return { snps, bands };
}

interface Props {
  width: number;
  height: number;
}

export function ManhattanPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const { snps, bands } = useMemo(() => generateSnps(), []);
  const genomeLen = bands[bands.length - 1].end;

  const xScale = scaleLinear({ domain: [0, genomeLen], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 12], range: [ih, 0] });

  const sigY = yScale(SIG_THRESHOLD);
  const sugY = yScale(SUGGESTIVE_THRESHOLD);

  // Pick a representative peak SNP for the anchor: the highest-nlp SNP on chrom 9.
  const peakSnp = useMemo(() => {
    const candidates = snps.filter((s) => s.isPeak && s.chrom === 9);
    return candidates.reduce(
      (best, s) => (s.nlp > best.nlp ? s : best),
      candidates[0] ?? snps[0],
    );
  }, [snps]);

  // Pick a representative non-peak SNP for the generic-point anchor.
  const samplePoint = useMemo(() => {
    const target = snps.find((s) => !s.isPeak && s.chrom === 5 && s.nlp > 1.2);
    return target ?? snps[0];
  }, [snps]);

  const peakX = xScale(peakSnp.pos);
  const peakY = yScale(peakSnp.nlp);
  const sampleX = xScale(samplePoint.pos);
  const sampleY = yScale(samplePoint.nlp);

  // Representative band for the chromosome-band anchor — use chrom 4 (an
  // even-indexed shaded band in the interior of the genome).
  const bandRep = bands[3]; // chromosome 4
  const bandRepX0 = xScale(bandRep.start);
  const bandRepX1 = xScale(bandRep.end);

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(iw - 1, x)),
    y: Math.max(0, Math.min(ih - 1, y)),
    width: Math.max(1, Math.min(iw - Math.max(0, x), w)),
    height: Math.max(1, Math.min(ih - Math.max(0, y), h)),
  });

  return (
    <svg width={width} height={height} role="img" aria-label="Manhattan plot">
      <Group left={margin.left} top={margin.top}>
        {/* Alternating chromosome bands (shaded rectangles) */}
        <g data-data-layer="true">
          {bands.map((b, i) => {
            const x0 = xScale(b.start);
            const x1 = xScale(b.end);
            if (i % 2 === 1) return null;
            return (
              <rect
                key={`band-${b.chrom}`}
                x={x0}
                y={0}
                width={Math.max(0, x1 - x0)}
                height={ih}
                fill="var(--color-ink)"
                opacity={0.04}
              />
            );
          })}
        </g>

        {/* SNP points — non-peak */}
        <g data-data-layer="true">
          {snps
            .filter((s) => !s.isPeak)
            .map((s, i) => (
              <circle
                key={`ns-${i}`}
                cx={xScale(s.pos)}
                cy={yScale(s.nlp)}
                r={1.3}
                fill={s.chrom % 2 === 0 ? "var(--color-ink-mute)" : "var(--color-ink-soft)"}
                opacity={0.55}
              />
            ))}
        </g>

        {/* SNP points — peak hits (darker, larger) */}
        <g data-data-layer="true">
          {snps
            .filter((s) => s.isPeak)
            .map((s, i) => (
              <circle
                key={`pk-${i}`}
                cx={xScale(s.pos)}
                cy={yScale(s.nlp)}
                r={2.2}
                fill="var(--color-ink)"
              />
            ))}
        </g>

        {/* Suggestive threshold (lighter, optional) */}
        <g data-data-layer="true">
          <Line
            from={{ x: 0, y: sugY }}
            to={{ x: iw, y: sugY }}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeDasharray="2 4"
          />
          <text
            x={2}
            y={sugY - 3}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            suggestive
          </text>
        </g>

        {/* Genome-wide significance threshold — anchored */}
        <ExplainAnchor
          selector="significance-threshold"
          index={1}
          pin={{ x: iw - 20, y: sigY - 10 }}
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
              p = 5×10⁻⁸
            </text>
          </g>
        </ExplainAnchor>

        {/* Representative chromosome band */}
        <ExplainAnchor
          selector="chromosome-band"
          index={2}
          pin={{ x: (bandRepX0 + bandRepX1) / 2, y: 12 }}
          rect={clampRect(bandRepX0, 0, bandRepX1 - bandRepX0, ih)}
        >
          <g />
        </ExplainAnchor>

        {/* Peak / GWAS hit */}
        <ExplainAnchor
          selector="gwas-peak"
          index={3}
          pin={{ x: peakX + 22, y: peakY - 10 }}
          rect={clampRect(peakX - 14, peakY - 14, 28, 28)}
        >
          <g />
        </ExplainAnchor>

        {/* Individual SNP point */}
        <ExplainAnchor
          selector="snp-point"
          index={4}
          pin={{ x: sampleX + 14, y: sampleY + 14 }}
          rect={clampRect(sampleX - 6, sampleY - 6, 12, 12)}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis — chromosome labels at band midpoints */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <line
            x1={0}
            x2={iw}
            y1={ih}
            y2={ih}
            stroke="var(--color-ink-mute)"
          />
          {bands.map((b, i) => {
            const cx = xScale((b.start + b.end) / 2);
            // Drop every other label when space is tight.
            const showLabel = iw > 480 || i % 2 === 0;
            if (!showLabel) return null;
            return (
              <text
                key={`xl-${b.chrom}`}
                x={cx}
                y={ih + 14}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {b.label}
              </text>
            );
          })}
          <text
            x={iw / 2}
            y={ih + 34}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            CHROMOSOME
          </text>
        </ExplainAnchor>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={6}
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
