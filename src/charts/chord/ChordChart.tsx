"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { chord as d3Chord, ribbon as d3Ribbon } from "d3-chord";
import { arc as d3Arc } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Synthetic but plausible bilateral merchandise trade in billions USD, 2024,
// between six major economies. Symmetric (pair totals, not directional).
const COUNTRIES = ["USA", "China", "EU", "Japan", "Mexico", "Canada"] as const;
type Country = (typeof COUNTRIES)[number];

// Symmetric pair flows. We fill both [i][j] and [j][i] with the same value
// so d3-chord produces equal-width endpoints for each ribbon.
const PAIRS: ReadonlyArray<{ a: Country; b: Country; flow: number }> = [
  { a: "USA", b: "China", flow: 650 },
  { a: "USA", b: "EU", flow: 900 },
  { a: "USA", b: "Japan", flow: 240 },
  { a: "USA", b: "Mexico", flow: 780 },
  { a: "USA", b: "Canada", flow: 720 },
  { a: "China", b: "EU", flow: 850 },
  { a: "China", b: "Japan", flow: 350 },
  { a: "China", b: "Mexico", flow: 110 },
  { a: "China", b: "Canada", flow: 100 },
  { a: "EU", b: "Japan", flow: 180 },
  { a: "EU", b: "Mexico", flow: 90 },
  { a: "EU", b: "Canada", flow: 75 },
  { a: "Japan", b: "Mexico", flow: 40 },
  { a: "Japan", b: "Canada", flow: 30 },
  { a: "Mexico", b: "Canada", flow: 45 },
];

function buildMatrix(): number[][] {
  const n = COUNTRIES.length;
  const m: number[][] = Array.from({ length: n }, () => Array(n).fill(0));
  const idx: Record<Country, number> = {
    USA: 0,
    China: 1,
    EU: 2,
    Japan: 3,
    Mexico: 4,
    Canada: 5,
  };
  for (const p of PAIRS) {
    const i = idx[p.a];
    const j = idx[p.b];
    m[i][j] = p.flow;
    m[j][i] = p.flow;
  }
  return m;
}

// Colour ramp — ink for the biggest arc (USA), then desaturated neutrals so
// the ribbons read as tonal variation rather than categorical colour.
const ARC_COLOURS: Record<Country, string> = {
  USA: "var(--color-ink)",
  China: "#6e6a55",
  EU: "#8a7a52",
  Japan: "#9a9086",
  Mexico: "#b0a898",
  Canada: "#c4bdae",
};

interface Props {
  width: number;
  height: number;
}

export function ChordChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const size = Math.min(iw, ih);
  const outerRadius = Math.max(0, size / 2 - 52); // leave room for labels
  const innerRadius = Math.max(0, outerRadius - 14);
  const cx = iw / 2;
  const cy = ih / 2;

  const layout = useMemo(() => {
    const matrix = buildMatrix();
    const chordGen = d3Chord().padAngle(0.04).sortSubgroups((a, b) => b - a);
    return chordGen(matrix);
  }, []);

  const arcGen = useMemo(
    () => d3Arc<{ startAngle: number; endAngle: number }>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius),
    [innerRadius, outerRadius],
  );

  const ribbonGen = useMemo(() => d3Ribbon().radius(innerRadius), [innerRadius]);

  // Representative chords for anchors.
  const groups = layout.groups;
  const usaGroup = groups[0]; // USA is index 0; its arc is biggest.
  const chinaGroup = groups[1];
  const usaChinaChord = layout.find(
    (c) =>
      (c.source.index === 0 && c.target.index === 1) ||
      (c.source.index === 1 && c.target.index === 0),
  );

  // Midpoint angle of an arc segment. Angles are measured clockwise from
  // 12 o'clock in d3's convention; x = sin(angle) * r, y = -cos(angle) * r.
  const arcMidpoint = (
    g: { startAngle: number; endAngle: number },
    r: number,
  ) => {
    const mid = (g.startAngle + g.endAngle) / 2;
    return { x: Math.sin(mid) * r, y: -Math.cos(mid) * r };
  };

  // For the ribbon anchor we place the rect over the chord midpoint.
  const ribbonCentroid = (
    c:
      | {
          source: { startAngle: number; endAngle: number };
          target: { startAngle: number; endAngle: number };
        }
      | undefined,
    r: number,
  ): { x: number; y: number } => {
    if (!c) return { x: 0, y: 0 };
    const midS = (c.source.startAngle + c.source.endAngle) / 2;
    const midT = (c.target.startAngle + c.target.endAngle) / 2;
    const p1 = { x: Math.sin(midS) * r, y: -Math.cos(midS) * r };
    const p2 = { x: Math.sin(midT) * r, y: -Math.cos(midT) * r };
    return { x: (p1.x + p2.x) / 2, y: (p1.y + p2.y) / 2 };
  };

  // Rect clamping: all anchor rects are expressed in plot-area coordinates
  // (the outer <Group> transform already shifts into the plot). To keep
  // them inside [0, iw] × [0, ih] we clamp after computing centre-relative
  // points back against cx, cy.
  const clampRect = (r: {
    x: number;
    y: number;
    width: number;
    height: number;
  }) => {
    const x = Math.max(0, r.x);
    const y = Math.max(0, r.y);
    const width = Math.max(0, Math.min(iw - x, r.x + r.width - x));
    const height = Math.max(0, Math.min(ih - y, r.y + r.height - y));
    return { x, y, width, height };
  };

  const usaMid = arcMidpoint(usaGroup, (innerRadius + outerRadius) / 2);
  const usaMidAbs = { x: cx + usaMid.x, y: cy + usaMid.y };
  // Outward pin position: push further from centre in the arc's direction
  // so the numbered pin doesn't sit on top of the arc itself.
  const usaOut = arcMidpoint(usaGroup, outerRadius + 28);
  const usaOutAbs = {
    x: Math.max(16, Math.min(iw - 16, cx + usaOut.x)),
    y: Math.max(16, Math.min(ih - 16, cy + usaOut.y)),
  };

  const ribbonMid = ribbonCentroid(usaChinaChord, innerRadius * 0.5);
  const ribbonMidAbs = { x: cx + ribbonMid.x, y: cy + ribbonMid.y };

  // Arc-segment anchor rect — around USA's arc slice (the biggest).
  const arcRect = clampRect({
    x: usaMidAbs.x - 28,
    y: usaMidAbs.y - 28,
    width: 56,
    height: 56,
  });

  // Ribbon anchor rect — around the USA–China chord's midpoint.
  const ribbonRect = clampRect({
    x: ribbonMidAbs.x - 30,
    y: ribbonMidAbs.y - 30,
    width: 60,
    height: 60,
  });

  // Ribbon-width anchor rect — around the widest end of the biggest chord
  // (USA end, since USA has the biggest total trade).
  const ribbonWidthRect = usaChinaChord
    ? (() => {
        const side =
          usaChinaChord.source.index === 0
            ? usaChinaChord.source
            : usaChinaChord.target;
        const mid = arcMidpoint(side, innerRadius);
        return clampRect({
          x: cx + mid.x - 22,
          y: cy + mid.y - 22,
          width: 44,
          height: 44,
        });
      })()
    : clampRect({ x: 0, y: 0, width: 1, height: 1 });

  // Symmetry anchor — covers the opposite side of the USA-China ribbon
  // (China's endpoint), so the eye can compare both ends.
  const symmetryRect = usaChinaChord
    ? (() => {
        const side =
          usaChinaChord.source.index === 1
            ? usaChinaChord.source
            : usaChinaChord.target;
        const mid = arcMidpoint(side, innerRadius);
        return clampRect({
          x: cx + mid.x - 22,
          y: cy + mid.y - 22,
          width: 44,
          height: 44,
        });
      })()
    : clampRect({ x: 0, y: 0, width: 1, height: 1 });

  // Total-trade anchor — rect around the whole ring; rect covers the
  // annular band of the arcs so any hover inside the ring triggers it.
  const totalRect = clampRect({
    x: cx - outerRadius - 6,
    y: cy - outerRadius - 6,
    width: outerRadius * 2 + 12,
    height: outerRadius * 2 + 12,
  });

  // Category label anchor — pin next to the China label outside the ring.
  const chinaMid = arcMidpoint(chinaGroup, outerRadius + 20);
  const chinaLabelAbs = {
    x: Math.max(16, Math.min(iw - 16, cx + chinaMid.x)),
    y: Math.max(16, Math.min(ih - 16, cy + chinaMid.y)),
  };

  const labelRect = clampRect({
    x: chinaLabelAbs.x - 28,
    y: chinaLabelAbs.y - 10,
    width: 56,
    height: 20,
  });

  return (
    <svg width={width} height={height} role="img" aria-label="Chord diagram">
      <Group left={margin.left} top={margin.top}>
        <Group left={cx} top={cy}>
          {/* Arcs + ribbons together — one data-data-layer. */}
          <g data-data-layer="true">
            {/* Ribbons drawn first so arcs sit on top. */}
            <g fill="none">
              {layout.map((c, i) => {
                const path = ribbonGen(
                  c as unknown as Parameters<typeof ribbonGen>[0],
                );
                // Tint the ribbon with the lighter of the two endpoints.
                const sIdx = c.source.index;
                const tIdx = c.target.index;
                const primary = sIdx < tIdx ? sIdx : tIdx;
                const fill = ARC_COLOURS[COUNTRIES[primary]];
                return (
                  <path
                    key={`rib-${i}`}
                    d={(path as unknown as string) ?? undefined}
                    fill={fill}
                    fillOpacity={0.35}
                    stroke={fill}
                    strokeOpacity={0.5}
                    strokeWidth={0.5}
                  />
                );
              })}
            </g>

            {/* Arc segments. */}
            <g>
              {groups.map((g, i) => (
                <path
                  key={`arc-${i}`}
                  d={arcGen(g) ?? undefined}
                  fill={ARC_COLOURS[COUNTRIES[i]]}
                  stroke="var(--color-surface)"
                  strokeWidth={1}
                />
              ))}
            </g>

            {/* Country labels outside the ring. */}
            <g>
              {groups.map((g, i) => {
                const mid = arcMidpoint(g, outerRadius + 14);
                const angle = (g.startAngle + g.endAngle) / 2;
                // Mirror text on the left half of the circle so it reads
                // outward everywhere.
                const isLeft = angle > Math.PI;
                return (
                  <text
                    key={`lbl-${i}`}
                    x={mid.x}
                    y={mid.y}
                    textAnchor={isLeft ? "end" : "start"}
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={10}
                    fontWeight={i === 0 ? 600 : 500}
                    fill="var(--color-ink)"
                  >
                    {COUNTRIES[i]}
                  </text>
                );
              })}
            </g>
          </g>

          {/* Anchors — pin + rect coordinates are expressed relative to the
              cx/cy group transform, but rects passed to ExplainAnchor are
              in plot coords (we precomputed them above with cx/cy added
              back). We therefore render anchors OUTSIDE this inner group
              so they resolve against the outer Group. */}
        </Group>

        {/* 1. Arc segment — USA (the biggest arc). */}
        <ExplainAnchor
          selector="arc-segment"
          index={1}
          pin={{ x: usaOutAbs.x, y: usaOutAbs.y }}
          rect={arcRect}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Ribbon — USA↔China chord. */}
        <ExplainAnchor
          selector="ribbon"
          index={2}
          pin={{ x: ribbonMidAbs.x, y: ribbonMidAbs.y }}
          rect={ribbonRect}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Ribbon width — endpoint thickness at USA end. */}
        <ExplainAnchor
          selector="ribbon-width"
          index={3}
          pin={{
            x: Math.max(
              12,
              Math.min(iw - 12, ribbonWidthRect.x + ribbonWidthRect.width / 2),
            ),
            y: Math.max(
              12,
              Math.min(ih - 12, ribbonWidthRect.y + ribbonWidthRect.height / 2),
            ),
          }}
          rect={ribbonWidthRect}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Symmetry — the opposite (China) end of the same ribbon. */}
        <ExplainAnchor
          selector="symmetry"
          index={4}
          pin={{
            x: Math.max(
              12,
              Math.min(iw - 12, symmetryRect.x + symmetryRect.width / 2),
            ),
            y: Math.max(
              12,
              Math.min(ih - 12, symmetryRect.y + symmetryRect.height / 2),
            ),
          }}
          rect={symmetryRect}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Total trade — the whole ring, arc length = country total. */}
        <ExplainAnchor
          selector="total-trade"
          index={5}
          pin={{ x: cx, y: cy }}
          rect={totalRect}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Category label — country label outside the ring. */}
        <ExplainAnchor
          selector="category-label"
          index={6}
          pin={{
            x: chinaLabelAbs.x,
            y: Math.max(10, chinaLabelAbs.y - 16),
          }}
          rect={labelRect}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
