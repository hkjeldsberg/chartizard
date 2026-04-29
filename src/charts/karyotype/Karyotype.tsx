"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Standard 46,XY (male) karyotype. Normal — no trisomy.
// Chromosome sizes derived from approximate haploid lengths (Mb).
// G-banding is simplified (4–6 alternating bands per chromosome) — iconic,
// not reference-accurate. Centromere position is ~1/3 from top (p-arm above,
// q-arm below), a reasonable approximation for most autosomes.
//
// Historical anchors: Tjio & Levan (1956, Hereditas 42) established n=46.
// G-banding: Seabright (1971, Lancet). ISCN nomenclature (latest 2020).
//
// Layout: Row 1 = pairs 1–12 (larger chromosomes), Row 2 = pairs 13–22 + XY.

// Relative heights (arbitrary units — scaled to pixel height in render).
// Source: NCBI genome sizes, rounded, normalised so chr1 = 1.0.
const CHROM_REL_HEIGHTS: ReadonlyArray<number> = [
  1.00, 0.97, 0.81, 0.78, 0.73, 0.69, 0.65, 0.59, 0.56, 0.54, // 1–10
  0.55, 0.54, 0.46, 0.44, 0.42, 0.37, 0.34, 0.32, 0.24, 0.26, // 11–20
  0.19, 0.21, 0.62, 0.29,                                        // 21, 22, X, Y
];

// Label for each of the 24 distinct chromosomes (indices 0–23).
const CHROM_LABELS: ReadonlyArray<string> = [
  "1","2","3","4","5","6","7","8","9","10",
  "11","12","13","14","15","16","17","18","19","20",
  "21","22","X","Y",
];

// Centromere position as a fraction of total height from the top.
// Rough cytological approximation: metacentric (chr1,3,16,19,20) ≈ 0.45;
// submetacentric ≈ 0.35; acrocentric (13–15,21,22) ≈ 0.20.
const CENTRO_FRAC: ReadonlyArray<number> = [
  0.45, 0.38, 0.45, 0.35, 0.35, 0.37, 0.35, 0.35, 0.35, 0.38, // 1–10
  0.40, 0.35, 0.22, 0.22, 0.22, 0.45, 0.32, 0.35, 0.46, 0.46, // 11–20
  0.22, 0.22, 0.42, 0.30,                                        // 21, 22, X, Y
];

// Number of G-bands per chromosome (4 or 5 simplified bands).
const BAND_COUNTS: ReadonlyArray<number> = [
  6, 6, 5, 5, 5, 5, 5, 5, 4, 4,
  5, 5, 4, 4, 4, 4, 5, 4, 4, 4,
  3, 3, 5, 3,
];

// Row assignment: row 0 = chr 1–12 (indices 0–11), row 1 = 13–22 + X,Y (indices 12–23).
const ROW_ASSIGNMENTS: ReadonlyArray<0 | 1> = [
  0,0,0,0,0,0,0,0,0,0,0,0, // chr 1–12
  1,1,1,1,1,1,1,1,1,1,1,1, // chr 13–22, X, Y
];

// Chromosome 17 annotation ("hosts BRCA1, TP53") — index 16.
const ANNOTATED_CHROM_IDX = 16;

interface ChromGeom {
  chromIdx: number;
  pairIdx: number;
  row: 0 | 1;
  label: string;
  heightPx: number;
  centroY: number;
  bands: Array<{ y: number; h: number; dark: boolean }>;
  copy1X: number;
  copy2X: number;
  topY: number;
}

interface Props {
  width: number;
  height: number;
}

export function Karyotype({ width, height }: Props) {
  const margin = { top: 28, right: 24, bottom: 32, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Each chromosome is rendered as a pair (2 copies, side by side).
  // Two rows, 12 pairs per row for row 0, 12 pairs for row 1.
  // Per pair: two narrow bars + small gap.
  // Between pairs: larger gap.

  const layout = useMemo(() => {
    const rowHeight = ih / 2 - 20; // leave 20px for row labels
    const maxChromHeight = rowHeight * 0.80; // max pixel height for chr1

    const row0Count = 12; // chr 1–12
    const row1Count = 12; // chr 13–22 + XY

    const barW = Math.max(4, Math.min(7, iw / (row0Count * 5.5)));
    const pairGap = barW * 0.6;       // gap between the two copies in a pair
    const pairWidth = barW * 2 + pairGap;

    // Build per-chromosome geometry.
    const rows: Array<ChromGeom[]> = [[], []];

    for (let i = 0; i < 24; i++) {
      const row = ROW_ASSIGNMENTS[i];
      const pairIdx = rows[row].length;
      const rowCount = row === 0 ? row0Count : row1Count;
      const rowGroupGap = Math.max(4, (iw - rowCount * pairWidth) / (rowCount + 1));

      const heightPx = CHROM_REL_HEIGHTS[i] * maxChromHeight;
      const centroY = heightPx * CENTRO_FRAC[i];
      const nBands = BAND_COUNTS[i];

      // Generate bands: alternate dark/light, centromere at centroY creates
      // a natural waist so we split bands across it.
      const bands: Array<{ y: number; h: number; dark: boolean }> = [];
      const bandHeight = heightPx / nBands;
      for (let b = 0; b < nBands; b++) {
        bands.push({
          y: b * bandHeight,
          h: bandHeight,
          dark: b % 2 === 0,
        });
      }

      const pairX = rowGroupGap + pairIdx * (pairWidth + rowGroupGap);
      const copy1X = pairX;
      const copy2X = pairX + barW + pairGap;

      // Align at baseline: bottom of all bars at rowHeight.
      const topY = maxChromHeight - heightPx;

      rows[row].push({
        chromIdx: i,
        pairIdx,
        row,
        label: CHROM_LABELS[i],
        heightPx,
        centroY,
        bands,
        copy1X,
        copy2X,
        topY,
      });
    }

    return { rows, barW, maxChromHeight };
  }, [iw, ih]);

  const { rows, barW } = layout;

  // Y origins for each row.
  const rowY0 = 0;                  // row 0 origin inside the group
  const rowY1 = ih / 2 + 10;        // row 1 origin

  // Centromere waist half-height.
  const WAIST = Math.max(1.5, barW * 0.3);

  // Helper: draw one chromosome copy.
  function ChromBar({
    geom,
    copyX,
    rowOriginY,
    highlight,
  }: {
    geom: ChromGeom;
    copyX: number;
    rowOriginY: number;
    highlight: boolean;
  }) {
    const topY = rowOriginY + geom.topY;
    const cx = copyX + barW / 2;
    const centroAbsY = topY + geom.centroY;

    return (
      <g>
        {/* Banding */}
        {geom.bands.map((band, bi) => {
          const by = topY + band.y;
          // Clip band to exclude centromere waist zone.
          const cWaistTop = centroAbsY - WAIST;
          const cWaistBot = centroAbsY + WAIST;
          const bandBot = by + band.h;

          // Split if the band overlaps the waist.
          const segments: Array<{ y: number; h: number }> = [];
          if (bandBot <= cWaistTop || by >= cWaistBot) {
            // No overlap with waist.
            segments.push({ y: by, h: band.h });
          } else {
            // Upper segment (before waist).
            if (by < cWaistTop) segments.push({ y: by, h: cWaistTop - by });
            // Lower segment (after waist).
            if (bandBot > cWaistBot) segments.push({ y: cWaistBot, h: bandBot - cWaistBot });
          }

          return segments.map((seg, si) => (
            <rect
              key={`b${bi}-s${si}`}
              x={copyX}
              y={seg.y}
              width={barW}
              height={Math.max(0, seg.h)}
              fill={
                band.dark
                  ? highlight
                    ? "var(--color-ink)"
                    : "var(--color-ink-soft)"
                  : "var(--color-surface)"
              }
              stroke="none"
            />
          ));
        })}

        {/* Outline — rounded ends (telomeres) */}
        <rect
          x={copyX}
          y={topY}
          width={barW}
          height={geom.heightPx}
          rx={barW / 2}
          ry={barW / 2}
          fill="none"
          stroke={highlight ? "var(--color-ink)" : "var(--color-ink-mute)"}
          strokeWidth={highlight ? 1.4 : 0.8}
        />

        {/* Centromere waist — two inward-pointing arcs (simplified as a pinch) */}
        {/* We overdraw an hourglass-shaped mask: two small triangles pointing inward */}
        <polygon
          points={`
            ${copyX},${centroAbsY - WAIST}
            ${cx - WAIST * 0.6},${centroAbsY}
            ${copyX},${centroAbsY + WAIST}
          `}
          fill="var(--color-page)"
          opacity={0.9}
        />
        <polygon
          points={`
            ${copyX + barW},${centroAbsY - WAIST}
            ${cx + WAIST * 0.6},${centroAbsY}
            ${copyX + barW},${centroAbsY + WAIST}
          `}
          fill="var(--color-page)"
          opacity={0.9}
        />
      </g>
    );
  }

  // Find geometry for specific chromosomes for anchors.
  const chr1Geom = rows[0][0];   // chromosome 1 (largest)
  const chr17Geom = rows[1][4];  // chromosome 17 is index 16, row 1, pairIdx 4
  const chrXGeom = rows[1][10];  // X chromosome: index 22, row 1, pairIdx 10
  const chrYGeom = rows[1][11];  // Y chromosome: index 23, row 1, pairIdx 11

  // Pixel coords for representative anchors.
  const chr1TopY = rowY0 + chr1Geom.topY;
  const chr1CentroY = chr1TopY + chr1Geom.centroY;
  const chr1X = chr1Geom.copy1X;

  const chr17TopY = rowY1 + chr17Geom.topY;
  const chr17X = chr17Geom.copy1X;
  const chr17MidX = chr17X + barW;

  // Sex chromosome region.
  const sexY = rowY1 + Math.min(chrXGeom.topY, chrYGeom.topY);
  const sexX1 = chrXGeom.copy1X;
  const sexX2 = chrYGeom.copy2X + barW;

  // Autosome band anchor — use chr 4 (row 0, pairIdx 3).
  const chr4Geom = rows[0][3];
  const chr4TopY = rowY0 + chr4Geom.topY;
  const chr4X = chr4Geom.copy1X;

  const clampRect = (x: number, y: number, w: number, h: number) => ({
    x: Math.max(0, Math.min(iw - 1, x)),
    y: Math.max(0, Math.min(ih - 1, y)),
    width: Math.max(1, Math.min(iw - Math.max(0, x), w)),
    height: Math.max(1, Math.min(ih - Math.max(0, y), h)),
  });

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="46,XY karyotype with G-banding pattern"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Karyotype nomenclature label */}
        <text
          x={iw}
          y={-12}
          textAnchor="end"
          fontFamily="var(--font-mono)"
          fontSize={11}
          fontWeight={500}
          fill="var(--color-ink-soft)"
        >
          46,XY
        </text>

        {/* ===== DATA LAYER ===== */}
        <g data-data-layer="true">
          {/* Row 0: chr 1–12 */}
          {rows[0].map((geom) => (
            <g key={`pair-${geom.chromIdx}`}>
              <ChromBar
                geom={geom}
                copyX={geom.copy1X}
                rowOriginY={rowY0}
                highlight={geom.chromIdx === ANNOTATED_CHROM_IDX}
              />
              <ChromBar
                geom={geom}
                copyX={geom.copy2X}
                rowOriginY={rowY0}
                highlight={geom.chromIdx === ANNOTATED_CHROM_IDX}
              />
              {/* Pair label */}
              <text
                x={geom.copy1X + barW + (geom.copy2X - geom.copy1X - barW) / 2 - barW * 0.5}
                y={rowY0 + layout.maxChromHeight * 0.80 + 12}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={Math.max(7, Math.min(9, barW * 1.5))}
                fill="var(--color-ink-soft)"
              >
                {geom.label}
              </text>
            </g>
          ))}

          {/* Row 1: chr 13–22 + XY */}
          {rows[1].map((geom) => (
            <g key={`pair-${geom.chromIdx}`}>
              <ChromBar
                geom={geom}
                copyX={geom.copy1X}
                rowOriginY={rowY1}
                highlight={geom.chromIdx === ANNOTATED_CHROM_IDX}
              />
              <ChromBar
                geom={geom}
                copyX={geom.copy2X}
                rowOriginY={rowY1}
                highlight={geom.chromIdx === ANNOTATED_CHROM_IDX}
              />
              {/* Pair label */}
              <text
                x={geom.copy1X + barW + (geom.copy2X - geom.copy1X - barW) / 2 - barW * 0.5}
                y={rowY1 + layout.maxChromHeight * 0.80 + 12}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={Math.max(7, Math.min(9, barW * 1.5))}
                fill={
                  geom.chromIdx >= 22
                    ? "var(--color-ink)"
                    : "var(--color-ink-soft)"
                }
                fontWeight={geom.chromIdx >= 22 ? 600 : 400}
              >
                {geom.label}
              </text>
            </g>
          ))}

          {/* Chr 17 annotation label */}
          <text
            x={chr17X + barW * 2 + 4}
            y={chr17TopY - 4}
            fontFamily="var(--font-mono)"
            fontSize={7}
            fill="var(--color-ink-soft)"
            textAnchor="start"
          >
            BRCA1, TP53
          </text>
          <line
            x1={chr17MidX}
            y1={chr17TopY}
            x2={chr17X + barW * 2 + 4}
            y2={chr17TopY - 2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.7}
          />
        </g>

        {/* ===== ANCHORS ===== */}

        {/* 1. Chromosome pair (chr 1 — largest pair) */}
        <ExplainAnchor
          selector="chromosome-pair"
          index={1}
          pin={{ x: chr1X - 16, y: chr1TopY + chr1Geom.heightPx / 2 }}
          rect={clampRect(
            chr1X,
            chr1TopY,
            barW * 2 + (chr1Geom.copy2X - chr1Geom.copy1X - barW),
            chr1Geom.heightPx,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Centromere waist (on chr 1) */}
        <ExplainAnchor
          selector="centromere"
          index={2}
          pin={{ x: chr1X + barW * 2 + 8, y: chr1CentroY }}
          rect={clampRect(
            chr1X,
            chr1CentroY - 6,
            barW * 2 + (chr1Geom.copy2X - chr1Geom.copy1X - barW),
            12,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 3. G-banding pattern (chr 4 — representative mid-size autosome) */}
        <ExplainAnchor
          selector="g-banding"
          index={3}
          pin={{ x: chr4X + barW * 2 + 10, y: chr4TopY + chr4Geom.heightPx / 2 }}
          rect={clampRect(
            chr4X,
            chr4TopY,
            barW * 2 + (chr4Geom.copy2X - chr4Geom.copy1X - barW),
            chr4Geom.heightPx,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 4. p-arm vs q-arm (on chr 1: above vs below centromere) */}
        <ExplainAnchor
          selector="p-arm-q-arm"
          index={4}
          pin={{ x: chr1X - 16, y: chr1TopY + chr1Geom.centroY / 2 }}
          rect={clampRect(
            chr1X,
            chr1TopY,
            barW,
            chr1Geom.centroY,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Sex chromosomes (XY region) */}
        <ExplainAnchor
          selector="sex-chromosomes"
          index={5}
          pin={{ x: sexX2 + 12, y: sexY + 20 }}
          rect={clampRect(
            sexX1,
            sexY,
            sexX2 - sexX1,
            layout.maxChromHeight * 0.62 + 4,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Chromosome size ordering (the full row 0 span, large→small left→right) */}
        <ExplainAnchor
          selector="size-ordering"
          index={6}
          pin={{ x: iw / 2, y: rowY0 - 14 }}
          rect={clampRect(0, rowY0, iw, layout.maxChromHeight * 0.80 + 4)}
        >
          <g />
        </ExplainAnchor>

        {/* 7. 46,XY nomenclature label */}
        <ExplainAnchor
          selector="karyotype-nomenclature"
          index={7}
          pin={{ x: iw - 60, y: -22 }}
          rect={{
            x: Math.max(0, iw - 56),
            y: -margin.top,
            width: 56,
            height: margin.top - 2,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
