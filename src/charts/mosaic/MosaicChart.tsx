"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Region = {
  name: string;
  count: number;
  a: number; // % Product A inside this region
  b: number;
  c: number;
  other: number;
};

// 4000 respondents total. Per the brief.
const REGIONS: ReadonlyArray<Region> = [
  { name: "North", count: 1120, a: 40, b: 25, c: 20, other: 15 },
  { name: "South", count: 880, a: 25, b: 35, c: 30, other: 10 },
  { name: "East", count: 1200, a: 30, b: 30, c: 25, other: 15 },
  { name: "West", count: 800, a: 50, b: 20, c: 20, other: 10 },
];

const PRODUCT_KEYS = ["a", "b", "c", "other"] as const;
type ProductKey = (typeof PRODUCT_KEYS)[number];
const PRODUCT_LABELS: Record<ProductKey, string> = {
  a: "Product A",
  b: "Product B",
  c: "Product C",
  other: "Other",
};
// 4 muted ink opacities — ensures mono palette & accessible dim mode.
const PRODUCT_OPACITY: Record<ProductKey, number> = {
  a: 0.85,
  b: 0.6,
  c: 0.4,
  other: 0.22,
};

interface Props {
  width: number;
  height: number;
}

export function MosaicChart({ width, height }: Props) {
  const margin = { top: 36, right: 20, bottom: 48, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const total = REGIONS.reduce((s, r) => s + r.count, 0);

  // x-scale on cumulative proportion, so column WIDTH == region share.
  const xScale = scaleLinear({ domain: [0, total], range: [0, iw] });
  // y-scale on conditional percent 0..100 — bands sum to 100% inside each column.
  const yScale = scaleLinear({ domain: [0, 100], range: [0, ih] });

  // Column gap (in pixels) — small sliver so the mosaic reads as separate cols.
  const COLUMN_GAP = 2;
  // Band gap (vertical) — smaller, since bands within a column should feel stacked.
  const BAND_GAP = 1;

  // Precompute each column's x-start, x-end, and per-band rects.
  const columns = (() => {
    let cumulative = 0;
    return REGIONS.map((r, i) => {
      const x0 = xScale(cumulative);
      cumulative += r.count;
      const x1 = xScale(cumulative);
      const isLast = i === REGIONS.length - 1;
      const renderX0 = x0;
      const renderX1 = isLast ? x1 : x1 - COLUMN_GAP;
      const w = Math.max(0, renderX1 - renderX0);

      // Bands inside the column
      let cumPct = 0;
      const bands = PRODUCT_KEYS.map((k, j) => {
        const pct = r[k];
        const y0 = yScale(cumPct);
        cumPct += pct;
        const y1 = yScale(cumPct);
        const isLastBand = j === PRODUCT_KEYS.length - 1;
        const renderY0 = y0;
        const renderY1 = isLastBand ? y1 : y1 - BAND_GAP;
        return {
          key: k,
          pct,
          y: renderY0,
          height: Math.max(0, renderY1 - renderY0),
        };
      });

      return {
        region: r,
        x: renderX0,
        width: w,
        rawX0: x0,
        rawX1: x1,
        bands,
      };
    });
  })();

  // clamp helper
  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Pick anchor targets
  // Cell anchor: North × Product A (top-left, biggest share of widest column).
  const anchorCell = (() => {
    const col = columns[0];
    const band = col.bands.find((b) => b.key === "a")!;
    return {
      x: col.x,
      y: band.y,
      width: col.width,
      height: band.height,
    };
  })();

  // Column-width anchor: the whole North column header area (width encodes marginal).
  const anchorColumnWidth = (() => {
    const col = columns[0];
    return {
      x: col.x,
      y: 0,
      width: col.width,
      height: Math.min(14, ih),
    };
  })();

  // Band-height anchor: South × Product B, the big middle band in column 2.
  const anchorBandHeight = (() => {
    const col = columns[1];
    const band = col.bands.find((b) => b.key === "b")!;
    return {
      x: col.x,
      y: band.y,
      width: col.width,
      height: band.height,
    };
  })();

  // Column anchor: full East column (one region's stack).
  const anchorColumn = (() => {
    const col = columns[2];
    return {
      x: col.x,
      y: 0,
      width: col.width,
      height: ih,
    };
  })();

  // Band anchor: Product C across all columns — horizontal strip.
  const anchorBand = (() => {
    // Product C bands don't align horizontally (because they depend on
    // A + B stacked above, which vary per region). So anchor the
    // representative C band of the last (widest-reading) region.
    const col = columns[3];
    const band = col.bands.find((b) => b.key === "c")!;
    return {
      x: col.x,
      y: band.y,
      width: col.width,
      height: band.height,
    };
  })();

  const legendY = ih + 20;

  return (
    <svg width={width} height={height} role="img" aria-label="Mosaic plot">
      <Group left={margin.left} top={margin.top}>
        {/* Cells */}
        <g data-data-layer="true">
          {columns.map((col) =>
            col.bands.map((band) => (
              <rect
                key={`${col.region.name}-${band.key}`}
                x={col.x}
                y={band.y}
                width={col.width}
                height={band.height}
                fill="var(--color-ink)"
                fillOpacity={PRODUCT_OPACITY[band.key]}
              />
            )),
          )}
        </g>

        {/* Column headers (region + count) */}
        <g data-data-layer="true">
          {columns.map((col) => {
            const share = ((col.region.count / total) * 100).toFixed(0);
            return (
              <g key={col.region.name}>
                <text
                  x={col.x + col.width / 2}
                  y={-18}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                >
                  {col.region.name.toUpperCase()}
                </text>
                <text
                  x={col.x + col.width / 2}
                  y={-6}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {col.region.count} ({share}%)
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchor 1: one cell (North × Product A) */}
        <ExplainAnchor
          selector="cell"
          index={1}
          pin={{
            x: clamp(anchorCell.x + anchorCell.width / 2, 0, iw),
            y: clamp(anchorCell.y + anchorCell.height / 2, 0, ih),
          }}
          rect={{
            x: clamp(anchorCell.x, 0, iw),
            y: clamp(anchorCell.y, 0, ih),
            width: clamp(anchorCell.width, 0, iw),
            height: clamp(anchorCell.height, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: column width (marginal — region proportion) */}
        <ExplainAnchor
          selector="column-width"
          index={2}
          pin={{
            x: clamp(anchorColumnWidth.x + anchorColumnWidth.width / 2, 0, iw),
            y: -24,
          }}
          rect={{
            x: clamp(anchorColumnWidth.x, 0, iw),
            y: 0,
            width: clamp(anchorColumnWidth.width, 0, iw),
            height: clamp(anchorColumnWidth.height, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: band height (conditional — product % within region) */}
        <ExplainAnchor
          selector="band-height"
          index={3}
          pin={{
            x: clamp(anchorBandHeight.x + anchorBandHeight.width + 8, 0, iw),
            y: clamp(
              anchorBandHeight.y + anchorBandHeight.height / 2,
              0,
              ih,
            ),
          }}
          rect={{
            x: clamp(anchorBandHeight.x, 0, iw),
            y: clamp(anchorBandHeight.y, 0, ih),
            width: clamp(anchorBandHeight.width, 0, iw),
            height: clamp(anchorBandHeight.height, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: full column (one region's stack) */}
        <ExplainAnchor
          selector="column"
          index={4}
          pin={{
            x: clamp(anchorColumn.x + anchorColumn.width / 2, 0, iw),
            y: clamp(ih + 10, 0, ih + margin.bottom),
          }}
          rect={{
            x: clamp(anchorColumn.x, 0, iw),
            y: 0,
            width: clamp(anchorColumn.width, 0, iw),
            height: clamp(anchorColumn.height, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: one band representative (Product C in West) */}
        <ExplainAnchor
          selector="band"
          index={5}
          pin={{
            x: clamp(anchorBand.x + anchorBand.width / 2, 0, iw),
            y: clamp(anchorBand.y + anchorBand.height / 2, 0, ih),
          }}
          rect={{
            x: clamp(anchorBand.x, 0, iw),
            y: clamp(anchorBand.y, 0, ih),
            width: clamp(anchorBand.width, 0, iw),
            height: clamp(anchorBand.height, 0, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend: product categories with their opacity swatches */}
        <g data-data-layer="true" transform={`translate(0, ${legendY})`}>
          {PRODUCT_KEYS.map((k, i) => {
            const col = i * Math.max(70, iw / 5);
            return (
              <g key={k} transform={`translate(${col}, 0)`}>
                <rect
                  width={10}
                  height={10}
                  fill="var(--color-ink)"
                  fillOpacity={PRODUCT_OPACITY[k]}
                />
                <text
                  x={14}
                  y={9}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-soft)"
                >
                  {PRODUCT_LABELS[k].toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchor 6: axes / legend (product categories legend region) */}
        <ExplainAnchor
          selector="axes"
          index={6}
          pin={{
            x: clamp(iw / 2, 0, iw),
            y: clamp(legendY + 16, 0, ih + margin.bottom),
          }}
          rect={{
            x: 0,
            y: clamp(legendY - 4, 0, ih + margin.bottom),
            width: iw,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
