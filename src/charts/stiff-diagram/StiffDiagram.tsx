"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Three water samples — ion concentrations in milliequivalents per litre (meq/L).
// Rows (top to bottom): Na⁺+K⁺ | Ca²⁺ | Mg²⁺  (cations, left side)
//                       Cl⁻    | HCO₃⁻| SO₄²⁻  (anions, right side)
// ---------------------------------------------------------------------------
interface StiffSample {
  id: string;
  label: string;
  tds: number;   // total dissolved solids, ppm
  // Cations (meq/L) — plotted leftward
  nak:  number;  // Na⁺+K⁺
  ca:   number;  // Ca²⁺
  mg:   number;  // Mg²⁺
  // Anions (meq/L) — plotted rightward
  cl:   number;  // Cl⁻
  hco3: number;  // HCO₃⁻
  so4:  number;  // SO₄²⁻
}

const SAMPLES: ReadonlyArray<StiffSample> = [
  {
    id: "s1",
    label: "Karst spring",
    tds: 280,
    nak: 0.4, ca: 3.8, mg: 1.2,
    cl:  0.3, hco3: 4.2, so4: 0.9,
  },
  {
    id: "s2",
    label: "Alluvial well",
    tds: 780,
    nak: 2.8, ca: 3.2, mg: 2.4,
    cl:  2.6, hco3: 3.0, so4: 2.8,
  },
  {
    id: "s3",
    label: "Brackish borehole",
    tds: 3200,
    nak: 14.0, ca: 3.5, mg: 3.2,
    cl:  16.0, hco3: 2.8, so4: 1.9,
  },
];

// ---------------------------------------------------------------------------
// Layout constants
// ---------------------------------------------------------------------------
const ROW_LABELS_CATION = ["Na⁺+K⁺", "Ca²⁺", "Mg²⁺"];
const ROW_LABELS_ANION  = ["Cl⁻", "HCO₃⁻", "SO₄²⁻"];

interface Props {
  width: number;
  height: number;
}

export function StiffDiagram({ width, height }: Props) {
  const margin = { top: 28, right: 16, bottom: 28, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const nSamples = SAMPLES.length;

  // Determine the global max ion value to set a shared scale
  let maxIon = 0;
  for (const s of SAMPLES) {
    maxIon = Math.max(maxIon, s.nak, s.ca, s.mg, s.cl, s.hco3, s.so4);
  }
  maxIon = maxIon * 1.1; // slight padding

  // Each kite occupies iw/3 horizontal space.
  const kiteColW = iw / nSamples;

  // Each kite: central axis is at kiteColW/2 within its column.
  // The kite half-width scales from 0 to (kiteColW/2 - labelPad).
  const labelPad = 4;
  const halfMaxW = Math.max(0, kiteColW / 2 - labelPad - 2);

  // Rows: 3 rows, equally spaced within ih minus header/footer.
  const headerH = 18; // for sample label + TDS
  const footerH = 12; // for scale tick
  const kiteH = Math.max(0, ih - headerH - footerH);
  const rowH = kiteH / 3;

  // Ion-value to horizontal half-pixel
  const ionToX = (v: number) => (v / maxIon) * halfMaxW;

  // Y positions of the three rows (top to bottom)
  const rowY = [0, 1, 2].map((i) => headerH + i * rowH + rowH / 2);

  // Build kite polygon points for a sample.
  // Polygon: 6 vertices going clockwise from top-left:
  // (cation top-left), (anion top-right), (cation mid-left), (anion mid-right),
  // (cation bot-left), (anion bot-right) — connected in left-right-left-right order.
  // We trace: top-left → top-right → mid-right → mid-left → bot-left → bot-right
  // ... actually we want a closed polygon that forms the kite shape.
  // Standard Stiff: trace left vertices top-to-bottom then right vertices bottom-to-top.
  function kitePoints(s: StiffSample, cx: number): string {
    const cations = [s.nak, s.ca, s.mg];
    const anions  = [s.cl,  s.hco3, s.so4];
    const lefts  = cations.map((v, i) => ({ x: cx - ionToX(v), y: rowY[i] }));
    const rights = anions.map((v, i)  => ({ x: cx + ionToX(v), y: rowY[i] }));
    // Polygon: left[0] → left[1] → left[2] → right[2] → right[1] → right[0] → close
    return [
      ...lefts,
      ...[...rights].reverse(),
    ].map((p) => `${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" ");
  }

  // Scale bar: show values at 0 and maxIon on one kite's width
  const scaleY = headerH + kiteH + 4;

  return (
    <svg width={width} height={height} role="img" aria-label="Stiff diagram — kite-shaped water chemistry patterns for three samples">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {SAMPLES.map((s, idx) => {
            const cx = idx * kiteColW + kiteColW / 2;

            // Cation and anion vertices for individual ion marks
            const cationVerts = [s.nak, s.ca, s.mg].map((v, i) => ({
              x: cx - ionToX(v),
              y: rowY[i],
            }));
            const anionVerts = [s.cl, s.hco3, s.so4].map((v, i) => ({
              x: cx + ionToX(v),
              y: rowY[i],
            }));

            return (
              <g key={s.id}>
                {/* Kite polygon */}
                <polygon
                  points={kitePoints(s, cx)}
                  fill="var(--color-ink)"
                  fillOpacity={0.07}
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                  strokeLinejoin="round"
                />

                {/* Central vertical axis */}
                <line
                  x1={cx} y1={headerH}
                  x2={cx} y2={headerH + kiteH}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.75}
                  strokeDasharray="2 2"
                />

                {/* Row tick marks on the axis */}
                {rowY.map((ry, ri) => (
                  <line
                    key={ri}
                    x1={cx - 3} y1={ry}
                    x2={cx + 3} y2={ry}
                    stroke="var(--color-ink-mute)"
                    strokeWidth={0.75}
                  />
                ))}

                {/* Vertex dots */}
                {cationVerts.map((p, i) => (
                  <circle key={`cat-${i}`} cx={p.x} cy={p.y} r={2} fill="var(--color-ink)" />
                ))}
                {anionVerts.map((p, i) => (
                  <circle key={`an-${i}`} cx={p.x} cy={p.y} r={2} fill="var(--color-ink)" />
                ))}

                {/* Sample label + TDS */}
                <text
                  x={cx} y={10}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fontWeight={600}
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
                <text
                  x={cx} y={19}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={8}
                  fill="var(--color-ink-soft)"
                >
                  TDS {s.tds} ppm
                </text>
              </g>
            );
          })}

          {/* Ion row labels — drawn once in the margin of the first kite */}
          {ROW_LABELS_CATION.map((lbl, i) => (
            <text
              key={`cl-${i}`}
              x={-2}
              y={rowY[i]}
              textAnchor="end"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {lbl}
            </text>
          ))}
          {ROW_LABELS_ANION.map((lbl, i) => (
            <text
              key={`al-${i}`}
              x={iw + 2}
              y={rowY[i]}
              textAnchor="start"
              dominantBaseline="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {lbl}
            </text>
          ))}

          {/* Scale bar below the kites (first kite's width as reference) */}
          {(() => {
            const cx0 = kiteColW / 2;
            const maxX = cx0 + ionToX(maxIon / 1.1); // undo padding for display
            return (
              <>
                <line x1={cx0} y1={scaleY} x2={maxX} y2={scaleY}
                  stroke="var(--color-ink-mute)" strokeWidth={0.75} />
                <text x={cx0} y={scaleY + 7} textAnchor="middle"
                  fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink-mute)">
                  0
                </text>
                <text x={maxX} y={scaleY + 7} textAnchor="middle"
                  fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink-mute)">
                  {(maxIon / 1.1).toFixed(0)} meq/L
                </text>
              </>
            );
          })()}
        </g>

        {/* ------------------------------------------------------------------
            ExplainAnchors
        ------------------------------------------------------------------- */}

        {/* Anchor 1: central vertical axis — on the middle kite */}
        {(() => {
          const cx1 = kiteColW + kiteColW / 2;
          return (
            <ExplainAnchor
              selector="central-axis"
              index={1}
              pin={{ x: cx1 + 10, y: headerH + kiteH / 2 }}
              rect={{
                x: Math.max(0, cx1 - 6),
                y: headerH,
                width: 12,
                height: kiteH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 2: cation vertex — Na⁺+K⁺ of the brackish kite (rightmost, most prominent) */}
        {(() => {
          const s = SAMPLES[2];
          const cx2 = 2 * kiteColW + kiteColW / 2;
          const nakX = cx2 - ionToX(s.nak);
          return (
            <ExplainAnchor
              selector="cation-vertex"
              index={2}
              pin={{ x: nakX - 14, y: rowY[0] - 10 }}
              rect={{
                x: Math.max(0, nakX - 6),
                y: Math.max(0, rowY[0] - 6),
                width: 12,
                height: 12,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 3: anion vertex — Cl⁻ of the brackish kite */}
        {(() => {
          const s = SAMPLES[2];
          const cx3 = 2 * kiteColW + kiteColW / 2;
          const clX = cx3 + ionToX(s.cl);
          return (
            <ExplainAnchor
              selector="anion-vertex"
              index={3}
              pin={{ x: clX + 12, y: rowY[0] - 10 }}
              rect={{
                x: Math.max(0, Math.min(iw - 12, clX - 6)),
                y: Math.max(0, rowY[0] - 6),
                width: 12,
                height: 12,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 4: full kite polygon — the brackish kite */}
        {(() => {
          const s = SAMPLES[2];
          const cx4 = 2 * kiteColW + kiteColW / 2;
          const maxLeft  = cx4 - ionToX(Math.max(s.nak, s.ca, s.mg));
          const maxRight = cx4 + ionToX(Math.max(s.cl, s.hco3, s.so4));
          return (
            <ExplainAnchor
              selector="kite-polygon"
              index={4}
              pin={{ x: Math.max(0, maxLeft - 12), y: rowY[1] }}
              rect={{
                x: Math.max(0, maxLeft - 4),
                y: headerH,
                width: Math.min(iw - Math.max(0, maxLeft - 4), maxRight - maxLeft + 8),
                height: kiteH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 5: kite-shape-as-composition — the fresh karst spring kite */}
        {(() => {
          const s = SAMPLES[0];
          const cx5 = kiteColW / 2;
          const maxLeft5  = cx5 - ionToX(Math.max(s.nak, s.ca, s.mg));
          const maxRight5 = cx5 + ionToX(Math.max(s.cl, s.hco3, s.so4));
          return (
            <ExplainAnchor
              selector="kite-shape-reading"
              index={5}
              pin={{ x: Math.max(0, maxLeft5 - 12), y: rowY[1] }}
              rect={{
                x: Math.max(0, maxLeft5 - 4),
                y: headerH,
                width: maxRight5 - Math.max(0, maxLeft5 - 4) + 8,
                height: kiteH,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}

        {/* Anchor 6: meq/L scale */}
        {(() => {
          const cx0 = kiteColW / 2;
          const maxX = cx0 + ionToX(maxIon / 1.1);
          return (
            <ExplainAnchor
              selector="meq-scale"
              index={6}
              pin={{ x: maxX + 10, y: scaleY }}
              rect={{
                x: Math.max(0, cx0 - 4),
                y: Math.max(0, scaleY - 4),
                width: maxX - cx0 + 8,
                height: 14,
              }}
            >
              <g />
            </ExplainAnchor>
          );
        })()}
      </Group>
    </svg>
  );
}
