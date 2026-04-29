"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Human autosome lengths (Mb), rounded. Chromosomes 1-22 only — the sex
// chromosomes are conventionally excluded from the original Circos cancer-
// genome figures (Krzywinski et al., 2009) because their representation
// varies by sample sex.
const CHROM_LENGTHS_MB: ReadonlyArray<number> = [
  249, 242, 198, 190, 182, 171, 159, 145, 138, 134,
  135, 133, 114, 107, 102, 90, 83, 80, 59, 64,
  47, 51,
];

const CHROM_LABELS: ReadonlyArray<string> = [
  "1", "2", "3", "4", "5", "6", "7", "8", "9", "10",
  "11", "12", "13", "14", "15", "16", "17", "18", "19", "20",
  "21", "22",
];

// Hand-tabulated mean GC% per chromosome (UCSC hg38, 10kb-windowed average,
// rounded). GC-rich chromosomes (19, 22) sit near 48%; AT-rich (4, 13) near
// 38%. Used as the inner heatmap track.
const GC_PERCENT: ReadonlyArray<number> = [
  41.7, 40.2, 39.7, 38.2, 39.5, 39.6, 40.7, 40.2, 41.3, 41.6,
  41.6, 40.8, 38.6, 40.9, 42.2, 44.8, 45.5, 39.8, 48.4, 44.1,
  40.8, 48.0,
];

// Hand-tabulated CNV-count proxy per chromosome (illustrative density values,
// not real DGV counts). Used as the inner scatter-track.
const CNV_DENSITY: ReadonlyArray<number> = [
  62, 58, 46, 40, 42, 48, 44, 52, 38, 40,
  45, 41, 30, 48, 50, 55, 58, 32, 60, 50,
  34, 56,
];

// Structural variants (recurrent cancer translocations). Each ribbon
// connects a pair of chromosomal positions (fraction along each arc, 0..1).
interface SV {
  fromChrom: number; // 1..22
  fromFrac: number;  // position along arc (0..1)
  toChrom: number;
  toFrac: number;
  label: string;
}

const SVS: ReadonlyArray<SV> = [
  // Philadelphia chromosome: BCR (22q11) — ABL1 (9q34)
  { fromChrom: 9, fromFrac: 0.82, toChrom: 22, toFrac: 0.48, label: "BCR-ABL1" },
  // Follicular lymphoma: IGH (14q32) — BCL2 (18q21)
  { fromChrom: 14, fromFrac: 0.78, toChrom: 18, toFrac: 0.55, label: "IGH-BCL2" },
  // Burkitt lymphoma: MYC (8q24) — IGH (14q32)
  { fromChrom: 8, fromFrac: 0.76, toChrom: 14, toFrac: 0.82, label: "MYC-IGH" },
];

// A small diverging ramp for GC% (inks, no external colour library).
// Lowest GC (~38%) → lightest; highest (~48%) → darkest.
function gcColour(gc: number): string {
  const t = Math.min(1, Math.max(0, (gc - 37) / 12));
  // Interpolate opacity against var(--color-ink); we return a rgba-style
  // transparent black so it tints regardless of page background.
  const alpha = 0.18 + t * 0.65;
  return `rgba(37, 33, 28, ${alpha.toFixed(3)})`;
}

interface Arc {
  chrom: number;
  label: string;
  startAngle: number;
  endAngle: number;
  length: number;
}

interface Props {
  width: number;
  height: number;
}

// Polar → cartesian. Angle 0 = 12 o'clock, sweeping clockwise.
function polar(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  return {
    x: cx + Math.sin(angle) * r,
    y: cy - Math.cos(angle) * r,
  };
}

// Annular wedge path (thick ring segment) from a0 to a1.
function wedgePath(
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  a0: number,
  a1: number,
): string {
  const p0o = polar(cx, cy, rOuter, a0);
  const p1o = polar(cx, cy, rOuter, a1);
  const p1i = polar(cx, cy, rInner, a1);
  const p0i = polar(cx, cy, rInner, a0);
  const sweep = a1 - a0;
  const largeArc = Math.abs(sweep) > Math.PI ? 1 : 0;
  return [
    `M ${p0o.x} ${p0o.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} 1 ${p1o.x} ${p1o.y}`,
    `L ${p1i.x} ${p1i.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} 0 ${p0i.x} ${p0i.y}`,
    "Z",
  ].join(" ");
}

// Cubic-Bezier ribbon from one chromosomal position to another, with control
// points pulled toward the chart centre so the curve passes near (but not
// through) the middle of the disc. Endpoints are narrow (~2° wide on each
// arc) so the ribbon has finite thickness.
function ribbonPath(
  cx: number,
  cy: number,
  r: number,
  aFromMid: number,
  aToMid: number,
  halfWidthA: number,
): string {
  const aFromStart = aFromMid - halfWidthA;
  const aFromEnd = aFromMid + halfWidthA;
  const aToStart = aToMid - halfWidthA;
  const aToEnd = aToMid + halfWidthA;

  const p1 = polar(cx, cy, r, aFromStart);
  const p2 = polar(cx, cy, r, aFromEnd);
  const p3 = polar(cx, cy, r, aToStart);
  const p4 = polar(cx, cy, r, aToEnd);

  // Control points at the centre pull the ribbon through the middle.
  return [
    `M ${p1.x} ${p1.y}`,
    `Q ${cx} ${cy} ${p3.x} ${p3.y}`,
    `A ${r} ${r} 0 0 1 ${p4.x} ${p4.y}`,
    `Q ${cx} ${cy} ${p2.x} ${p2.y}`,
    `A ${r} ${r} 0 0 1 ${p1.x} ${p1.y}`,
    "Z",
  ].join(" ");
}

export function CircosPlot({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const size = Math.min(iw, ih);
  const cx = iw / 2;
  const cy = ih / 2;

  // Ring geometry — outermost chromosome arcs, then GC heatmap, then CNV
  // scatter, then ribbons filling the inner disc.
  const rChromOuter = Math.max(0, size / 2 - 34);
  const rChromInner = Math.max(0, rChromOuter - 14);
  const rGcOuter = Math.max(0, rChromInner - 4);
  const rGcInner = Math.max(0, rGcOuter - 10);
  const rCnvOuter = Math.max(0, rGcInner - 4);
  const rCnvInner = Math.max(0, rCnvOuter - 22);
  const rRibbon = Math.max(0, rCnvInner - 4);

  // Arc layout: 22 segments, proportional to chromosome length, separated by
  // small pads so neighbouring arcs read as distinct.
  const arcs: Arc[] = useMemo(() => {
    const total = CHROM_LENGTHS_MB.reduce((a, b) => a + b, 0);
    const padAngle = 0.012;
    const usable = 2 * Math.PI - padAngle * CHROM_LENGTHS_MB.length;
    const out: Arc[] = [];
    let cursor = 0;
    CHROM_LENGTHS_MB.forEach((len, i) => {
      const span = (len / total) * usable;
      const start = cursor;
      const end = cursor + span;
      out.push({
        chrom: i + 1,
        label: CHROM_LABELS[i],
        startAngle: start,
        endAngle: end,
        length: len,
      });
      cursor = end + padAngle;
    });
    return out;
  }, []);

  // Convert a (chromosome, fraction-along-arc) pair to a screen angle.
  const posAngle = (chrom: number, frac: number): number => {
    const a = arcs[chrom - 1];
    return a.startAngle + (a.endAngle - a.startAngle) * frac;
  };

  // For the CNV scatter track, scatter ~5 synthetic points per chromosome.
  const cnvPoints = useMemo(() => {
    const pts: Array<{ x: number; y: number; chrom: number }> = [];
    let seed = 11;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };
    arcs.forEach((arc, i) => {
      const density = CNV_DENSITY[i];
      // Number of points scales with density.
      const nPts = 3 + Math.round(density / 18);
      for (let k = 0; k < nPts; k++) {
        const frac = 0.08 + rand() * 0.84;
        const ang = arc.startAngle + (arc.endAngle - arc.startAngle) * frac;
        // Point radius: within the scatter ring, jittered by a proxy value.
        const r =
          rCnvInner + rand() * (rCnvOuter - rCnvInner);
        const p = polar(cx, cy, r, ang);
        pts.push({ x: p.x, y: p.y, chrom: arc.chrom });
      }
    });
    return pts;
  }, [arcs, rCnvInner, rCnvOuter, cx, cy]);

  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width)),
      height: Math.max(0, Math.min(ih - y, r.height)),
    };
  };

  const clampPin = (p: { x: number; y: number }) => ({
    x: Math.max(12, Math.min(iw - 12, p.x)),
    y: Math.max(12, Math.min(ih - 12, p.y)),
  });

  // -- Anchor geometry ---------------------------------------------------

  // Representative chromosome arc — chr 9 (BCR-ABL1 partner, long).
  const chr9 = arcs[8];
  const chr9Mid = (chr9.startAngle + chr9.endAngle) / 2;
  const chr9MidR = (rChromInner + rChromOuter) / 2;
  const chr9MidPt = polar(cx, cy, chr9MidR, chr9Mid);
  const chr9LabelPt = polar(cx, cy, rChromOuter + 14, chr9Mid);

  // GC track anchor — a representative wedge on chr 19 (GC-rich).
  const chr19 = arcs[18];
  const chr19Mid = (chr19.startAngle + chr19.endAngle) / 2;
  const gcMidR = (rGcInner + rGcOuter) / 2;
  const gcMidPt = polar(cx, cy, gcMidR, chr19Mid);

  // CNV scatter anchor — representative point on chr 17.
  const chr17 = arcs[16];
  const chr17Mid = (chr17.startAngle + chr17.endAngle) / 2;
  const cnvMidR = (rCnvInner + rCnvOuter) / 2;
  const cnvMidPt = polar(cx, cy, cnvMidR, chr17Mid);

  // Ribbon anchor — the BCR-ABL1 translocation (chr 9 ↔ chr 22).
  const bcrAblFrom = polar(cx, cy, rRibbon, posAngle(9, 0.82));
  const bcrAblTo = polar(cx, cy, rRibbon, posAngle(22, 0.48));
  const ribbonMidX = (bcrAblFrom.x + bcrAblTo.x + cx) / 3;
  const ribbonMidY = (bcrAblFrom.y + bcrAblTo.y + cy) / 3;

  // Breakpoint anchor — where the BCR-ABL ribbon meets chr 9's arc.
  const breakpointAngle = posAngle(9, 0.82);
  const breakpointPt = polar(cx, cy, rChromInner, breakpointAngle);

  // Alternating-band anchor — pin near the even-indexed chr 2's arc.
  const chr2 = arcs[1];
  const chr2Mid = (chr2.startAngle + chr2.endAngle) / 2;
  const chr2MidR = (rChromInner + rChromOuter) / 2;
  const chr2MidPt = polar(cx, cy, chr2MidR, chr2Mid);

  return (
    <svg width={width} height={height} role="img" aria-label="Circos plot">
      <Group left={margin.left} top={margin.top}>
        {/* Chromosome arcs — alternating light/dark */}
        <g data-data-layer="true">
          {arcs.map((a, i) => (
            <path
              key={`chrom-${a.chrom}`}
              d={wedgePath(cx, cy, rChromOuter, rChromInner, a.startAngle, a.endAngle)}
              fill="var(--color-ink)"
              opacity={i % 2 === 0 ? 0.78 : 0.38}
            />
          ))}
        </g>

        {/* Chromosome arc labels */}
        <g data-data-layer="true">
          {arcs.map((a) => {
            const mid = (a.startAngle + a.endAngle) / 2;
            const p = polar(cx, cy, rChromOuter + 10, mid);
            return (
              <text
                key={`lbl-${a.chrom}`}
                x={p.x}
                y={p.y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {a.label}
              </text>
            );
          })}
        </g>

        {/* GC% heatmap track (ring 1) */}
        <g data-data-layer="true">
          {arcs.map((a, i) => (
            <path
              key={`gc-${a.chrom}`}
              d={wedgePath(cx, cy, rGcOuter, rGcInner, a.startAngle, a.endAngle)}
              fill={gcColour(GC_PERCENT[i])}
              stroke="var(--color-surface)"
              strokeWidth={0.4}
            />
          ))}
        </g>

        {/* CNV scatter track (ring 2) — inner/outer boundary hairlines +
            synthetic points */}
        <g data-data-layer="true">
          <circle
            cx={cx}
            cy={cy}
            r={rCnvOuter}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
          <circle
            cx={cx}
            cy={cy}
            r={rCnvInner}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth={0.5}
          />
          {cnvPoints.map((p, i) => (
            <circle
              key={`cnv-${i}`}
              cx={p.x}
              cy={p.y}
              r={1.2}
              fill="var(--color-ink)"
              opacity={0.7}
            />
          ))}
        </g>

        {/* Structural-variant ribbons */}
        <g data-data-layer="true">
          {SVS.map((sv, i) => {
            const aFromMid = posAngle(sv.fromChrom, sv.fromFrac);
            const aToMid = posAngle(sv.toChrom, sv.toFrac);
            return (
              <path
                key={`sv-${i}`}
                d={ribbonPath(cx, cy, rRibbon, aFromMid, aToMid, 0.018)}
                fill="var(--color-ink)"
                fillOpacity={0.42}
                stroke="var(--color-ink)"
                strokeOpacity={0.6}
                strokeWidth={0.6}
              />
            );
          })}
        </g>

        {/* SV labels — placed between the two endpoints, near the centre */}
        <g data-data-layer="true">
          {SVS.map((sv, i) => {
            const aFromMid = posAngle(sv.fromChrom, sv.fromFrac);
            const aToMid = posAngle(sv.toChrom, sv.toFrac);
            const pFrom = polar(cx, cy, rRibbon * 0.35, aFromMid);
            const pTo = polar(cx, cy, rRibbon * 0.35, aToMid);
            const mx = (pFrom.x + pTo.x) / 2;
            const my = (pFrom.y + pTo.y) / 2;
            // Stagger vertical offsets to avoid label overlap in the middle.
            const dy = (i - 1) * 12;
            return (
              <text
                key={`svl-${i}`}
                x={mx}
                y={my + dy}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink)"
              >
                {sv.label}
              </text>
            );
          })}
        </g>

        {/* ---- Anchors ---- */}

        {/* 1. Chromosome arc — chr 9 */}
        <ExplainAnchor
          selector="chromosome-arc"
          index={1}
          pin={clampPin({ x: chr9LabelPt.x + 12, y: chr9LabelPt.y - 8 })}
          rect={clampRect({
            x: chr9MidPt.x - 22,
            y: chr9MidPt.y - 22,
            width: 44,
            height: 44,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Chromosome label */}
        <ExplainAnchor
          selector="chromosome-label"
          index={2}
          pin={clampPin({ x: chr9LabelPt.x, y: chr9LabelPt.y - 18 })}
          rect={clampRect({
            x: chr9LabelPt.x - 14,
            y: chr9LabelPt.y - 10,
            width: 28,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Alternating band convention — chr 2 (even index, lighter) */}
        <ExplainAnchor
          selector="alternating-band"
          index={3}
          pin={clampPin({ x: chr2MidPt.x + 16, y: chr2MidPt.y - 16 })}
          rect={clampRect({
            x: chr2MidPt.x - 20,
            y: chr2MidPt.y - 20,
            width: 40,
            height: 40,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. GC% heatmap track */}
        <ExplainAnchor
          selector="gc-track"
          index={4}
          pin={clampPin({ x: gcMidPt.x + 14, y: gcMidPt.y + 14 })}
          rect={clampRect({
            x: gcMidPt.x - 18,
            y: gcMidPt.y - 18,
            width: 36,
            height: 36,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Scatter track (CNV density) */}
        <ExplainAnchor
          selector="scatter-track"
          index={5}
          pin={clampPin({ x: cnvMidPt.x + 14, y: cnvMidPt.y + 14 })}
          rect={clampRect({
            x: cnvMidPt.x - 18,
            y: cnvMidPt.y - 18,
            width: 36,
            height: 36,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Structural-variant ribbon — BCR-ABL1 */}
        <ExplainAnchor
          selector="sv-ribbon"
          index={6}
          pin={clampPin({ x: ribbonMidX + 14, y: ribbonMidY - 14 })}
          rect={clampRect({
            x: ribbonMidX - 28,
            y: ribbonMidY - 28,
            width: 56,
            height: 56,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Breakpoint (ribbon endpoint on chr 9) */}
        <ExplainAnchor
          selector="breakpoint"
          index={7}
          pin={clampPin({ x: breakpointPt.x - 16, y: breakpointPt.y + 14 })}
          rect={clampRect({
            x: breakpointPt.x - 10,
            y: breakpointPt.y - 10,
            width: 20,
            height: 20,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
