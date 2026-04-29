"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// S&P 500 by sector → top companies, sized by approximate 2024 market cap
// in billions USD. Values are rounded / synthetic; the relative ordering is
// the point of the chart, not penny-accurate figures.
type Company = { name: string; short: string; cap: number };
type Sector = { name: string; companies: Company[] };

const SECTORS: ReadonlyArray<Sector> = [
  {
    name: "Technology",
    companies: [
      { name: "Apple", short: "Apple", cap: 3400 },
      { name: "Microsoft", short: "Microsoft", cap: 3100 },
      { name: "Nvidia", short: "Nvidia", cap: 2800 },
      { name: "Alphabet", short: "Alphabet", cap: 2000 },
      { name: "Meta", short: "Meta", cap: 1200 },
    ],
  },
  {
    name: "Financials",
    companies: [
      { name: "Berkshire Hathaway", short: "Berkshire", cap: 900 },
      { name: "JPMorgan Chase", short: "JPMorgan", cap: 580 },
      { name: "Visa", short: "Visa", cap: 560 },
      { name: "Mastercard", short: "Mastercard", cap: 440 },
      { name: "Bank of America", short: "BofA", cap: 330 },
    ],
  },
  {
    name: "Healthcare",
    companies: [
      { name: "Eli Lilly", short: "Eli Lilly", cap: 700 },
      { name: "UnitedHealth", short: "UNH", cap: 510 },
      { name: "Johnson & Johnson", short: "J&J", cap: 380 },
      { name: "AbbVie", short: "AbbVie", cap: 320 },
      { name: "Merck", short: "Merck", cap: 280 },
    ],
  },
  {
    name: "Consumer Discretionary",
    companies: [
      { name: "Amazon", short: "Amazon", cap: 1900 },
      { name: "Tesla", short: "Tesla", cap: 700 },
      { name: "Home Depot", short: "Home Depot", cap: 360 },
      { name: "McDonald's", short: "McDonald's", cap: 200 },
      { name: "Nike", short: "Nike", cap: 120 },
    ],
  },
  {
    name: "Communication",
    companies: [
      { name: "Netflix", short: "Netflix", cap: 280 },
      { name: "Disney", short: "Disney", cap: 190 },
      { name: "Comcast", short: "Comcast", cap: 170 },
      { name: "Verizon", short: "Verizon", cap: 170 },
      { name: "AT&T", short: "AT&T", cap: 130 },
    ],
  },
  {
    name: "Consumer Staples",
    companies: [
      { name: "Walmart", short: "Walmart", cap: 580 },
      { name: "Procter & Gamble", short: "P&G", cap: 400 },
      { name: "Costco", short: "Costco", cap: 370 },
      { name: "Coca-Cola", short: "Coca-Cola", cap: 290 },
      { name: "PepsiCo", short: "PepsiCo", cap: 240 },
    ],
  },
  {
    name: "Energy",
    companies: [
      { name: "ExxonMobil", short: "Exxon", cap: 500 },
      { name: "Chevron", short: "Chevron", cap: 290 },
      { name: "Shell", short: "Shell", cap: 225 },
      { name: "ConocoPhillips", short: "Conoco", cap: 135 },
      { name: "BP", short: "BP", cap: 100 },
    ],
  },
  {
    name: "Industrials",
    companies: [
      { name: "General Electric", short: "GE", cap: 180 },
      { name: "Caterpillar", short: "Caterpillar", cap: 170 },
      { name: "RTX", short: "RTX", cap: 160 },
      { name: "Honeywell", short: "Honeywell", cap: 140 },
      { name: "Union Pacific", short: "Union Pac.", cap: 140 },
    ],
  },
];

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

interface Item<T> {
  value: number;
  datum: T;
}

interface ScaledItem<T> {
  datum: T;
  area: number;
}

interface LeafRect<T> extends Rect {
  datum: T;
}

// Squarified treemap (Bruls, Huijsen, van Wijk 2000).
// Given a container rectangle and a list of positive values, lay them out
// so each rectangle's area is proportional to its value and the aspect
// ratios are as close to 1 as possible.
function squarify<T>(items: ReadonlyArray<Item<T>>, rect: Rect): LeafRect<T>[] {
  if (items.length === 0 || rect.w <= 0 || rect.h <= 0) return [];
  const total = items.reduce((s, d) => s + d.value, 0);
  if (total <= 0) return [];

  // Scale values to pixel-area once
  const scale = (rect.w * rect.h) / total;
  const scaled: ScaledItem<T>[] = items.map((d) => ({
    datum: d.datum,
    area: d.value * scale,
  }));
  // Descending by area (classic squarify input order)
  scaled.sort((a, b) => b.area - a.area);

  const placed: LeafRect<T>[] = [];
  let remaining: Rect = { ...rect };
  let row: ScaledItem<T>[] = [];

  const worstRatio = (rowIn: ScaledItem<T>[], shortSide: number): number => {
    if (rowIn.length === 0) return Infinity;
    const s = rowIn.reduce((sum, r) => sum + r.area, 0);
    let min = Infinity;
    let max = 0;
    for (const r of rowIn) {
      if (r.area < min) min = r.area;
      if (r.area > max) max = r.area;
    }
    const side2 = shortSide * shortSide;
    const s2 = s * s;
    return Math.max((side2 * max) / s2, s2 / (side2 * min));
  };

  const layoutRow = (
    rowIn: ScaledItem<T>[],
    r: Rect,
  ): { next: Rect; laid: LeafRect<T>[] } => {
    const shortHorizontal = r.w <= r.h;
    const sum = rowIn.reduce((acc, v) => acc + v.area, 0);
    const laid: LeafRect<T>[] = [];
    if (shortHorizontal) {
      const rowHeight = sum / r.w;
      let cursorX = r.x;
      for (const item of rowIn) {
        const tileW = rowHeight > 0 ? item.area / rowHeight : 0;
        laid.push({
          datum: item.datum,
          x: cursorX,
          y: r.y,
          w: tileW,
          h: rowHeight,
        });
        cursorX += tileW;
      }
      return {
        laid,
        next: { x: r.x, y: r.y + rowHeight, w: r.w, h: r.h - rowHeight },
      };
    } else {
      const colWidth = sum / r.h;
      let cursorY = r.y;
      for (const item of rowIn) {
        const tileH = colWidth > 0 ? item.area / colWidth : 0;
        laid.push({
          datum: item.datum,
          x: r.x,
          y: cursorY,
          w: colWidth,
          h: tileH,
        });
        cursorY += tileH;
      }
      return {
        laid,
        next: { x: r.x + colWidth, y: r.y, w: r.w - colWidth, h: r.h },
      };
    }
  };

  for (const item of scaled) {
    const shortSide = Math.min(remaining.w, remaining.h);
    if (shortSide <= 0) break;
    const candidate = [...row, item];
    if (
      row.length === 0 ||
      worstRatio(candidate, shortSide) <= worstRatio(row, shortSide)
    ) {
      row = candidate;
    } else {
      const { next, laid } = layoutRow(row, remaining);
      placed.push(...laid);
      remaining = next;
      row = [item];
    }
  }
  if (row.length > 0) {
    const { laid } = layoutRow(row, remaining);
    placed.push(...laid);
  }

  return placed;
}

function truncate(label: string, px: number): string {
  // Rough guess at how many mono chars fit — 6px per glyph at 10px font.
  const maxChars = Math.max(0, Math.floor(px / 6));
  if (label.length <= maxChars) return label;
  if (maxChars <= 1) return "";
  return label.slice(0, Math.max(1, maxChars - 1)) + "…";
}

interface Props {
  width: number;
  height: number;
}

export function TreemapChart({ width, height }: Props) {
  const margin = { top: 20, right: 12, bottom: 20, left: 12 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // 8 ink-opacity bands for the 8 sectors. Alternating tints give each
  // sector block visual identity without introducing new colours.
  const sectorOpacity = (i: number): number => 0.18 + (i % 4) * 0.12 + (i >= 4 ? 0.03 : 0);

  // Compute sector totals
  const sectorItems = SECTORS.map((s) => ({
    value: s.companies.reduce((sum, c) => sum + c.cap, 0),
    datum: s,
  }));

  // Level 1: lay out 8 sector rectangles in the chart area
  const sectorRects = squarify(sectorItems, { x: 0, y: 0, w: iw, h: ih });

  // Level 2: for each sector, lay out its companies inside. Leave a 1px
  // outer padding + 14px header strip for the sector title when there's room.
  const HEADER = 14;
  const leaves = sectorRects.flatMap((sr, si) => {
    const headerHeight = sr.h > 34 ? HEADER : 0;
    const inner: Rect = {
      x: sr.x + 1,
      y: sr.y + 1 + headerHeight,
      w: Math.max(0, sr.w - 2),
      h: Math.max(0, sr.h - 2 - headerHeight),
    };
    const companyItems = sr.datum.companies.map((c) => ({ value: c.cap, datum: c }));
    const leafRects = squarify(companyItems, inner);
    return leafRects.map((lr) => ({
      ...lr,
      sectorIndex: si,
      sectorName: sr.datum.name,
    }));
  });

  // Find the single biggest leaf (Apple) and the biggest sector (Technology)
  // for anchor targeting. squarify reorders its input by descending area,
  // so we look up sectors by name in the output rather than by index.
  const appleLeaf = leaves.reduce((best, l) =>
    l.datum.cap > best.datum.cap ? l : best,
  );
  const techSectorRect = sectorRects.find((sr) => sr.datum.name === "Technology");

  return (
    <svg width={width} height={height} role="img" aria-label="Treemap">
      <Group left={margin.left} top={margin.top}>
        {/* Data-layer: sector backgrounds (colour band) + leaves */}
        <g data-data-layer="true">
          {sectorRects.map((sr, i) => (
            <rect
              key={sr.datum.name}
              x={sr.x}
              y={sr.y}
              width={sr.w}
              height={sr.h}
              fill="var(--color-ink)"
              fillOpacity={sectorOpacity(i)}
            />
          ))}
          {/* Leaves drawn on top of sector tint */}
          {leaves.map((leaf, i) => (
            <rect
              key={`${leaf.sectorName}-${leaf.datum.name}-${i}`}
              x={leaf.x}
              y={leaf.y}
              width={Math.max(0, leaf.w - 1)}
              height={Math.max(0, leaf.h - 1)}
              fill="var(--color-ink)"
              fillOpacity={0.08 + (i % 3) * 0.04}
              stroke="var(--color-page)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Sector headers (non-data-layer so they stay readable in Explain mode) */}
        <g>
          {sectorRects.map((sr) =>
            sr.h > 34 && sr.w > 60 ? (
              <text
                key={`hdr-${sr.datum.name}`}
                x={sr.x + 6}
                y={sr.y + 11}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {truncate(sr.datum.name.toUpperCase(), sr.w - 10)}
              </text>
            ) : null,
          )}
        </g>

        {/* Leaf labels (company names) */}
        <g>
          {leaves.map((leaf, i) =>
            leaf.w > 40 && leaf.h > 18 ? (
              <text
                key={`lbl-${leaf.datum.name}-${i}`}
                x={leaf.x + 4}
                y={leaf.y + 12}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {truncate(leaf.datum.short, leaf.w - 8)}
              </text>
            ) : null,
          )}
        </g>

        {/* Anchor 1: leaf — the Apple rectangle */}
        <ExplainAnchor
          selector="leaf"
          index={1}
          pin={{
            x: appleLeaf.x + appleLeaf.w / 2,
            y: appleLeaf.y + appleLeaf.h / 2,
          }}
          rect={{
            x: appleLeaf.x,
            y: appleLeaf.y,
            width: appleLeaf.w,
            height: appleLeaf.h,
          }}
        >
          <rect
            x={appleLeaf.x}
            y={appleLeaf.y}
            width={Math.max(0, appleLeaf.w - 1)}
            height={Math.max(0, appleLeaf.h - 1)}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />
        </ExplainAnchor>

        {/* Anchor 2: branch — the whole Technology sector block */}
        {techSectorRect && (
          <ExplainAnchor
            selector="branch"
            index={2}
            pin={{
              x: techSectorRect.x + techSectorRect.w - 12,
              y: techSectorRect.y + 8,
            }}
            rect={{
              x: techSectorRect.x,
              y: techSectorRect.y,
              width: techSectorRect.w,
              height: techSectorRect.h,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* Anchor 3: colour — a sector colour band (pick a mid-sized sector) */}
        {sectorRects.length > 2 &&
          (() => {
            const target = sectorRects[2]; // Healthcare-ish band
            return (
              <ExplainAnchor
                selector="colour"
                index={3}
                pin={{ x: target.x + 10, y: target.y + target.h - 8 }}
                rect={{
                  x: target.x,
                  y: target.y,
                  width: target.w,
                  height: target.h,
                }}
              >
                <g />
              </ExplainAnchor>
            );
          })()}

        {/* Anchor 4: size — the area-encoding mechanic, anchored on a smaller leaf */}
        {leaves.length > 0 &&
          (() => {
            // Pick a small leaf so "area encodes market cap" is visible by contrast
            const sorted = [...leaves].sort((a, b) => a.datum.cap - b.datum.cap);
            const small = sorted[Math.floor(sorted.length / 3)];
            return (
              <ExplainAnchor
                selector="size"
                index={4}
                pin={{
                  x: small.x + small.w / 2,
                  y: small.y + small.h + 10,
                }}
                rect={{
                  x: small.x,
                  y: small.y,
                  width: small.w,
                  height: small.h,
                }}
              >
                <g />
              </ExplainAnchor>
            );
          })()}

        {/* Anchor 5: label — a visible company name inside a large leaf */}
        <ExplainAnchor
          selector="label"
          index={5}
          pin={{ x: appleLeaf.x + 24, y: appleLeaf.y - 8 }}
          rect={{
            x: appleLeaf.x,
            y: appleLeaf.y,
            width: Math.min(appleLeaf.w, 90),
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: the-big-one — Tech's visual dominance */}
        {techSectorRect && (
          <ExplainAnchor
            selector="dominant-branch"
            index={6}
            pin={{
              x: techSectorRect.x + techSectorRect.w / 2,
              y: techSectorRect.y + techSectorRect.h / 2,
            }}
            rect={{
              x: techSectorRect.x,
              y: techSectorRect.y,
              width: techSectorRect.w,
              height: techSectorRect.h,
            }}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
