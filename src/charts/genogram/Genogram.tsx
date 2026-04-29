"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Genogram per McGoldrick & Gerson, 1985, "Genograms in Family Assessment"
// (W.W. Norton). Three generations of a family tracking inherited coronary
// artery disease alongside relationship quality. Unlike a pedigree (which
// encodes Mendelian status only), a genogram also records bonds: double line
// = strong bond, zigzag = conflict, dashed = estranged. Filled glyph = has
// the trait (CAD); "X" through glyph = deceased.

type Sex = "male" | "female" | "unknown";
type Relation = "marriage" | "strong-bond" | "conflict" | "estranged";

interface Figure {
  id: string;
  sex: Sex;
  affected: boolean; // filled if true (has CAD)
  deceased: boolean; // X through glyph if true
  annotation?: string;
}

// Generation 1: two couples (maternal + paternal grandparents).
// Paternal grandfather affected + deceased.
const GEN_I: ReadonlyArray<Figure> = [
  { id: "I-1", sex: "male", affected: true, deceased: true, annotation: "b.1932  MI 1988  †1995" },
  { id: "I-2", sex: "female", affected: false, deceased: false, annotation: "b.1935" },
  { id: "I-3", sex: "male", affected: false, deceased: false, annotation: "b.1930" },
  { id: "I-4", sex: "female", affected: false, deceased: false, annotation: "b.1934" },
];

// Generation 2: one child from each GEN_I couple, each married outside.
// II-1 is the affected son of I-1/I-2 (inherited the trait).
const GEN_II: ReadonlyArray<Figure> = [
  { id: "II-1", sex: "male", affected: true, deceased: false, annotation: "b.1962  CAD dx 2015" },
  { id: "II-2", sex: "female", affected: false, deceased: false, annotation: "b.1964" },
  { id: "II-3", sex: "male", affected: false, deceased: false, annotation: "b.1960" },
  { id: "II-4", sex: "female", affected: false, deceased: false, annotation: "b.1963" },
];

// Generation 3: 5 grandchildren. 3 from II-1 × II-2, 2 from II-3 × II-4.
// Two affected — continuing the inheritance pattern.
const GEN_III: ReadonlyArray<Figure> = [
  { id: "III-1", sex: "male", affected: true, deceased: false, annotation: "b.1990  CAD dx 2022" },
  { id: "III-2", sex: "female", affected: false, deceased: false },
  { id: "III-3", sex: "unknown", affected: false, deceased: false },
  { id: "III-4", sex: "male", affected: true, deceased: false, annotation: "b.1995  CAD dx 2024" },
  { id: "III-5", sex: "female", affected: false, deceased: false },
];

interface Props {
  width: number;
  height: number;
}

const R = 11; // half-side / radius of glyph

function Glyph({
  cx,
  cy,
  sex,
  affected,
  deceased,
}: {
  cx: number;
  cy: number;
  sex: Sex;
  affected: boolean;
  deceased: boolean;
}) {
  const fill = affected ? "var(--color-ink)" : "var(--color-surface)";
  const stroke = "var(--color-ink)";
  const sw = 1.4;

  let glyph: JSX.Element;
  if (sex === "male") {
    glyph = (
      <rect
        x={cx - R}
        y={cy - R}
        width={R * 2}
        height={R * 2}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  } else if (sex === "female") {
    glyph = (
      <circle cx={cx} cy={cy} r={R} fill={fill} stroke={stroke} strokeWidth={sw} />
    );
  } else {
    // diamond
    glyph = (
      <polygon
        points={`${cx},${cy - R} ${cx + R},${cy} ${cx},${cy + R} ${cx - R},${cy}`}
        fill={fill}
        stroke={stroke}
        strokeWidth={sw}
      />
    );
  }

  return (
    <g>
      {glyph}
      {deceased && (
        <g>
          <line
            x1={cx - R - 2}
            y1={cy - R - 2}
            x2={cx + R + 2}
            y2={cy + R + 2}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
        </g>
      )}
    </g>
  );
}

// Renders a relationship connector between two horizontal points at y.
function RelationLine({
  x1,
  x2,
  y,
  kind,
}: {
  x1: number;
  x2: number;
  y: number;
  kind: Relation;
}) {
  if (kind === "marriage") {
    return <line x1={x1} y1={y} x2={x2} y2={y} stroke="var(--color-ink)" strokeWidth={1.4} />;
  }
  if (kind === "strong-bond") {
    return (
      <g>
        <line x1={x1} y1={y - 2.5} x2={x2} y2={y - 2.5} stroke="var(--color-ink)" strokeWidth={1.2} />
        <line x1={x1} y1={y + 2.5} x2={x2} y2={y + 2.5} stroke="var(--color-ink)" strokeWidth={1.2} />
      </g>
    );
  }
  if (kind === "estranged") {
    return (
      <line
        x1={x1}
        y1={y}
        x2={x2}
        y2={y}
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeDasharray="4 3"
      />
    );
  }
  // zigzag (conflict)
  const n = 6;
  const amp = 3;
  const step = (x2 - x1) / n;
  const pts: string[] = [`${x1},${y}`];
  for (let i = 1; i <= n; i++) {
    const x = x1 + i * step;
    const y_ = y + (i % 2 === 1 ? -amp : amp);
    pts.push(`${x},${i === n ? y : y_}`);
  }
  return (
    <polyline
      points={pts.join(" ")}
      fill="none"
      stroke="var(--color-ink)"
      strokeWidth={1.3}
    />
  );
}

export function Genogram({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 40, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Vertical rows.
  const genIY = Math.max(R + 2, ih * 0.14);
  const genIIY = Math.max(R + 2, ih * 0.48);
  const genIIIY = Math.max(R + 2, ih * 0.82);

  // --- Row layout ---------------------------------------------------------
  // Generation I: two couples. Each couple = square + circle with a mate line.
  // Couple A at left third; Couple B at right third.
  const coupleAmidX = iw * 0.25;
  const coupleBmidX = iw * 0.75;
  const parentGap = Math.min(64, iw * 0.1);

  const i1X = coupleAmidX - parentGap; // paternal grandfather (affected, deceased)
  const i2X = coupleAmidX + parentGap; // paternal grandmother
  const i3X = coupleBmidX - parentGap; // maternal grandfather
  const i4X = coupleBmidX + parentGap; // maternal grandmother

  // Mate-line y-level (same for both couples).
  const mateY_I = genIY;

  // Generation II: one child from each GEN_I couple + one married-in spouse.
  // Layout: II-1 (son of couple A, affected) + II-2 (spouse-in) at left of plot
  //          II-3 (son of couple B) + II-4 (spouse-in) at right
  // Place couples such that II-1 sits beneath mid of couple A, II-3 beneath couple B.
  // Couple II-a: II-1 (left) + II-2 (right). Centered around coupleAmidX - 10.
  const coupleII_A_mid = coupleAmidX;
  const coupleII_B_mid = coupleBmidX;
  const ii_gap = Math.min(58, iw * 0.09);

  const ii1X = coupleII_A_mid - ii_gap;
  const ii2X = coupleII_A_mid + ii_gap;
  const ii3X = coupleII_B_mid - ii_gap;
  const ii4X = coupleII_B_mid + ii_gap;

  const mateY_II = genIIY;

  // Descent drop from GEN_I mate-line midpoint to GEN_II child (single-child descent).
  // Couple A's child is II-1; Couple B's child is II-3.
  const descentMid_A_x = coupleAmidX; // midpoint of I-1 and I-2 mate line
  const descentMid_B_x = coupleBmidX;

  // Generation III: 5 grandchildren.
  // III-1, III-2, III-3 from couple II-A (3 children)
  // III-4, III-5 from couple II-B (2 children)
  const siblingSpacingA = Math.min(46, iw * 0.09);
  const siblingSpacingB = Math.min(46, iw * 0.09);

  const iii_A_center = coupleII_A_mid;
  const iii_B_center = coupleII_B_mid;

  const iii1X = iii_A_center - siblingSpacingA;
  const iii2X = iii_A_center;
  const iii3X = iii_A_center + siblingSpacingA;
  const iii4X = iii_B_center - siblingSpacingB / 2;
  const iii5X = iii_B_center + siblingSpacingB / 2;

  // Sibship line y (just above GEN_III glyphs).
  const sibshipY_A = genIIIY - R - 8;
  const sibshipY_B = genIIIY - R - 8;

  // --- Legend geometry (top-right corner) -------------------------------
  const legendX = Math.max(0, iw - 138);
  const legendY = -18;

  // Clamp helper for rects.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    return {
      x,
      y,
      width: Math.max(0, Math.min(iw - x, r.width)),
      height: Math.max(0, Math.min(ih - y, r.height)),
    };
  };

  // Gen-label x (left margin).
  const labelX = -38;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Genogram: three-generation family tracking coronary artery disease and relationship patterns"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ============================ DATA LAYER ============================ */}
        <g data-data-layer="true">
          {/* Generation labels (I / II / III) */}
          {[
            { y: genIY, txt: "I" },
            { y: genIIY, txt: "II" },
            { y: genIIIY, txt: "III" },
          ].map((g) => (
            <text
              key={g.txt}
              x={labelX}
              y={g.y}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={11}
              fontWeight={500}
              fill="var(--color-ink-soft)"
            >
              {g.txt}
            </text>
          ))}

          {/* ---------- Generation I connectors ---------- */}
          {/* Marriage: I-1 × I-2 */}
          <RelationLine x1={i1X + R} x2={i2X - R} y={mateY_I} kind="marriage" />
          {/* Marriage: I-3 × I-4 */}
          <RelationLine x1={i3X + R} x2={i4X - R} y={mateY_I} kind="marriage" />

          {/* Descent drops: from mate-line midpoints down to GEN_II */}
          <line
            x1={descentMid_A_x}
            y1={mateY_I}
            x2={descentMid_A_x}
            y2={mateY_II - R}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <line
            x1={descentMid_B_x}
            y1={mateY_I}
            x2={descentMid_B_x}
            y2={mateY_II - R}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />

          {/* Side-branch: II-1 sits slightly to the left of descentMid_A, so
              the descent drop lands on II-1 directly. Same for II-3. */}
          {/* Horizontal jog from descentMid to II-1 glyph (if offset exists). */}
          <line
            x1={descentMid_A_x}
            y1={mateY_II - R}
            x2={ii1X}
            y2={mateY_II - R}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <line
            x1={ii1X}
            y1={mateY_II - R}
            x2={ii1X}
            y2={mateY_II - R + 2}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <line
            x1={descentMid_B_x}
            y1={mateY_II - R}
            x2={ii3X}
            y2={mateY_II - R}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <line
            x1={ii3X}
            y1={mateY_II - R}
            x2={ii3X}
            y2={mateY_II - R + 2}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />

          {/* ---------- Generation II connectors ---------- */}
          {/* Marriage: II-1 × II-2  (strong bond — double line) */}
          <RelationLine x1={ii1X + R} x2={ii2X - R} y={mateY_II} kind="strong-bond" />
          {/* Marriage: II-3 × II-4  (estranged — dashed) */}
          <RelationLine x1={ii3X + R} x2={ii4X - R} y={mateY_II} kind="estranged" />

          {/* Descent drop couple II-A to sibship A */}
          <line
            x1={coupleII_A_mid}
            y1={mateY_II}
            x2={coupleII_A_mid}
            y2={sibshipY_A}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* Sibship line A (spans III-1 to III-3) */}
          <line
            x1={iii1X}
            y1={sibshipY_A}
            x2={iii3X}
            y2={sibshipY_A}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* Vertical drops from sibship A to each child */}
          {[iii1X, iii2X, iii3X].map((x, i) => (
            <line
              key={`drop-A-${i}`}
              x1={x}
              y1={sibshipY_A}
              x2={x}
              y2={genIIIY - R}
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
          ))}

          {/* Descent drop couple II-B to sibship B */}
          <line
            x1={coupleII_B_mid}
            y1={mateY_II}
            x2={coupleII_B_mid}
            y2={sibshipY_B}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* Sibship line B (spans III-4 to III-5) */}
          <line
            x1={iii4X}
            y1={sibshipY_B}
            x2={iii5X}
            y2={sibshipY_B}
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {[iii4X, iii5X].map((x, i) => (
            <line
              key={`drop-B-${i}`}
              x1={x}
              y1={sibshipY_B}
              x2={x}
              y2={genIIIY - R}
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
          ))}

          {/* ---------- Cross-family conflict relation (cousins) ---------- */}
          {/* Conflict (zigzag) between III-3 and III-4 — crosses between family branches */}
          <RelationLine x1={iii3X + R} x2={iii4X - R} y={genIIIY} kind="conflict" />

          {/* ---------- Glyphs ---------- */}
          {/* Gen I */}
          <Glyph cx={i1X} cy={genIY} sex={GEN_I[0].sex} affected={GEN_I[0].affected} deceased={GEN_I[0].deceased} />
          <Glyph cx={i2X} cy={genIY} sex={GEN_I[1].sex} affected={GEN_I[1].affected} deceased={GEN_I[1].deceased} />
          <Glyph cx={i3X} cy={genIY} sex={GEN_I[2].sex} affected={GEN_I[2].affected} deceased={GEN_I[2].deceased} />
          <Glyph cx={i4X} cy={genIY} sex={GEN_I[3].sex} affected={GEN_I[3].affected} deceased={GEN_I[3].deceased} />

          {/* Gen II */}
          <Glyph cx={ii1X} cy={genIIY} sex={GEN_II[0].sex} affected={GEN_II[0].affected} deceased={GEN_II[0].deceased} />
          <Glyph cx={ii2X} cy={genIIY} sex={GEN_II[1].sex} affected={GEN_II[1].affected} deceased={GEN_II[1].deceased} />
          <Glyph cx={ii3X} cy={genIIY} sex={GEN_II[2].sex} affected={GEN_II[2].affected} deceased={GEN_II[2].deceased} />
          <Glyph cx={ii4X} cy={genIIY} sex={GEN_II[3].sex} affected={GEN_II[3].affected} deceased={GEN_II[3].deceased} />

          {/* Gen III */}
          <Glyph cx={iii1X} cy={genIIIY} sex={GEN_III[0].sex} affected={GEN_III[0].affected} deceased={GEN_III[0].deceased} />
          <Glyph cx={iii2X} cy={genIIIY} sex={GEN_III[1].sex} affected={GEN_III[1].affected} deceased={GEN_III[1].deceased} />
          <Glyph cx={iii3X} cy={genIIIY} sex={GEN_III[2].sex} affected={GEN_III[2].affected} deceased={GEN_III[2].deceased} />
          <Glyph cx={iii4X} cy={genIIIY} sex={GEN_III[3].sex} affected={GEN_III[3].affected} deceased={GEN_III[3].deceased} />
          <Glyph cx={iii5X} cy={genIIIY} sex={GEN_III[4].sex} affected={GEN_III[4].affected} deceased={GEN_III[4].deceased} />

          {/* Annotations for key figures */}
          {GEN_I[0].annotation && (
            <text
              x={i1X}
              y={genIY - R - 6}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {GEN_I[0].annotation}
            </text>
          )}
          {GEN_II[0].annotation && (
            <text
              x={ii1X}
              y={genIIY + R + 12}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {GEN_II[0].annotation}
            </text>
          )}
          {GEN_III[0].annotation && (
            <text
              x={iii1X}
              y={genIIIY + R + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {GEN_III[0].annotation}
            </text>
          )}
          {GEN_III[3].annotation && (
            <text
              x={iii4X}
              y={genIIIY + R + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={8}
              fill="var(--color-ink-mute)"
            >
              {GEN_III[3].annotation}
            </text>
          )}

          {/* ---------- Legend ---------- */}
          <g transform={`translate(${legendX}, ${legendY})`}>
            <rect
              x={0}
              y={0}
              width={138}
              height={16}
              fill="var(--color-surface)"
              stroke="var(--color-hairline)"
              strokeWidth={1}
            />
            {/* Square */}
            <rect x={6} y={4} width={8} height={8} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
            <text x={18} y={8} dominantBaseline="central" fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
              male
            </text>
            {/* Circle */}
            <circle cx={48} cy={8} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
            <text x={54} y={8} dominantBaseline="central" fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
              female
            </text>
            {/* Filled */}
            <rect x={84} y={4} width={8} height={8} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1} />
            <text x={96} y={8} dominantBaseline="central" fontFamily="var(--font-mono)" fontSize={8} fill="var(--color-ink-soft)">
              affected
            </text>
          </g>
        </g>

        {/* ============================ ANCHORS ============================ */}

        {/* 1. Sex glyphs (square/circle/diamond) — pinned at I-1 square */}
        <ExplainAnchor
          selector="sex-glyph"
          index={1}
          pin={{ x: i1X - R - 16, y: genIY }}
          rect={clamp({ x: i1X - R, y: genIY - R, width: R * 2, height: R * 2 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Filled (affected) figure — II-1 */}
        <ExplainAnchor
          selector="affected-glyph"
          index={2}
          pin={{ x: ii1X - R - 16, y: genIIY }}
          rect={clamp({ x: ii1X - R, y: genIIY - R, width: R * 2, height: R * 2 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Deceased mark (X through I-1) */}
        <ExplainAnchor
          selector="deceased-mark"
          index={3}
          pin={{ x: i1X, y: genIY - R - 22 }}
          rect={clamp({ x: i1X - R - 4, y: genIY - R - 4, width: R * 2 + 8, height: R * 2 + 8 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Marriage / descent structure (mate line + drop) — Couple I-A */}
        <ExplainAnchor
          selector="marriage-line"
          index={4}
          pin={{ x: coupleAmidX, y: mateY_I - 18 }}
          rect={clamp({
            x: i1X + R,
            y: mateY_I - 5,
            width: (i2X - R) - (i1X + R),
            height: 10,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Strong bond (double line) — II-1 × II-2 */}
        <ExplainAnchor
          selector="strong-bond"
          index={5}
          pin={{ x: coupleII_A_mid, y: mateY_II - 18 }}
          rect={clamp({
            x: ii1X + R,
            y: mateY_II - 6,
            width: (ii2X - R) - (ii1X + R),
            height: 12,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Estranged (dashed) — II-3 × II-4 */}
        <ExplainAnchor
          selector="estranged-line"
          index={6}
          pin={{ x: coupleII_B_mid, y: mateY_II - 18 }}
          rect={clamp({
            x: ii3X + R,
            y: mateY_II - 5,
            width: (ii4X - R) - (ii3X + R),
            height: 10,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Conflict (zigzag) — III-3 × III-4 */}
        <ExplainAnchor
          selector="conflict-line"
          index={7}
          pin={{ x: (iii3X + iii4X) / 2, y: genIIIY - 18 }}
          rect={clamp({
            x: iii3X + R,
            y: genIIIY - 8,
            width: (iii4X - R) - (iii3X + R),
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
