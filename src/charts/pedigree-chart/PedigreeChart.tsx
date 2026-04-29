"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Standard pedigree notation per Bennett et al., 1995 (NSGC recommendations,
// Am. J. Hum. Genet.). Carrier × carrier (autosomal recessive) cross.
//
// Generation I:  I-1 carrier male  ×  I-2 carrier female
// Generation II: 4 children — II-1 unaffected, II-2 carrier, II-3 carrier, II-4 affected
// Mendelian expectation for Aa × Aa: 1 AA or Aa unaffected : 2 Aa carrier : 1 aa affected.

type Status = "unaffected" | "carrier" | "affected";
type Sex = "male" | "female";

interface Individual {
  id: string;
  sex: Sex;
  status: Status;
  label: string;
}

const GEN_I: ReadonlyArray<Individual> = [
  { id: "I-1", sex: "male", status: "carrier", label: "I-1" },
  { id: "I-2", sex: "female", status: "carrier", label: "I-2" },
];

const GEN_II: ReadonlyArray<Individual> = [
  { id: "II-1", sex: "male", status: "unaffected", label: "II-1" },
  { id: "II-2", sex: "female", status: "carrier", label: "II-2" },
  { id: "II-3", sex: "male", status: "carrier", label: "II-3" },
  { id: "II-4", sex: "female", status: "affected", label: "II-4" },
];

interface Props {
  width: number;
  height: number;
}

// Glyph radius for circles/squares half-side.
const R = 14;

function Square({
  cx,
  cy,
  status,
}: {
  cx: number;
  cy: number;
  status: Status;
}) {
  const x = cx - R;
  const y = cy - R;
  const size = R * 2;

  if (status === "affected") {
    return (
      <rect
        x={x}
        y={y}
        width={size}
        height={size}
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
    );
  }

  if (status === "carrier") {
    // Half-filled: right half filled (vertical split convention)
    return (
      <g>
        <rect
          x={x}
          y={y}
          width={size}
          height={size}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />
        {/* right half filled */}
        <rect
          x={cx}
          y={y}
          width={R}
          height={size}
          fill="var(--color-ink)"
          stroke="none"
        />
        {/* re-draw border on top */}
        <rect
          x={x}
          y={y}
          width={size}
          height={size}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />
      </g>
    );
  }

  // unaffected
  return (
    <rect
      x={x}
      y={y}
      width={size}
      height={size}
      fill="var(--color-surface)"
      stroke="var(--color-ink)"
      strokeWidth={1.5}
    />
  );
}

function Circle({
  cx,
  cy,
  status,
}: {
  cx: number;
  cy: number;
  status: Status;
}) {
  if (status === "affected") {
    return (
      <circle
        cx={cx}
        cy={cy}
        r={R}
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
    );
  }

  if (status === "carrier") {
    // Half-filled circle: right half filled using a semicircle path.
    // Arc from top to bottom on the right side, closed back through centre.
    const halfPath = `M ${cx} ${cy - R} A ${R} ${R} 0 0 1 ${cx} ${cy + R} Z`;
    return (
      <g>
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />
        <path d={halfPath} fill="var(--color-ink)" stroke="none" />
        <circle
          cx={cx}
          cy={cy}
          r={R}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth={1.5}
        />
      </g>
    );
  }

  return (
    <circle
      cx={cx}
      cy={cy}
      r={R}
      fill="var(--color-surface)"
      stroke="var(--color-ink)"
      strokeWidth={1.5}
    />
  );
}

function Glyph({
  cx,
  cy,
  sex,
  status,
}: {
  cx: number;
  cy: number;
  sex: Sex;
  status: Status;
}) {
  return sex === "male" ? (
    <Square cx={cx} cy={cy} status={status} />
  ) : (
    <Circle cx={cx} cy={cy} status={status} />
  );
}

export function PedigreeChart({ width, height }: Props) {
  const margin = { top: 32, right: 32, bottom: 32, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout: 2 rows. Generation I at ~25% height, Generation II at ~75%.
  const genIY = Math.max(R + 4, ih * 0.25);
  const genIIY = Math.max(R + 4, ih * 0.75);

  // Generation I: two parents centered in the plot.
  const parentGap = Math.min(80, iw * 0.18);
  const midX = iw / 2;
  const i1X = midX - parentGap;
  const i2X = midX + parentGap;

  // Mate line runs between the outer edges of the parent glyphs.
  const mateLineY = genIY;
  const mateLineX1 = i1X + R; // right edge of square
  const mateLineX2 = i2X - R; // left edge of circle
  const mateLineMidX = (mateLineX1 + mateLineX2) / 2;

  // Drop line from mate-line midpoint down to sibship line.
  const sibshipY = genIIY - 28;
  const sibshipLineY = sibshipY;

  // Generation II: 4 children equally spaced.
  const nChildren = GEN_II.length;
  const childSpacing = Math.min(70, iw / (nChildren + 1));
  const totalChildWidth = childSpacing * (nChildren - 1);
  const childStartX = midX - totalChildWidth / 2;
  const childXs = GEN_II.map((_, i) => childStartX + i * childSpacing);

  // Sibship line spans from first to last child.
  const sibLineX1 = childXs[0];
  const sibLineX2 = childXs[nChildren - 1];

  // Vertical drops from sibship line to each child.
  const dropY1 = sibshipLineY;
  const dropY2 = genIIY - R;

  // Generation labels (Roman numerals) — left margin.
  const labelX = -40;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Pedigree chart showing autosomal recessive carrier cross"
    >
      <Group left={margin.left} top={margin.top}>
        {/* ===== DATA LAYER ===== */}
        <g data-data-layer="true">
          {/* Generation labels */}
          <text
            x={labelX}
            y={genIY}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={12}
            fontWeight={500}
            fill="var(--color-ink-soft)"
          >
            I
          </text>
          <text
            x={labelX}
            y={genIIY}
            textAnchor="middle"
            dominantBaseline="central"
            fontFamily="var(--font-mono)"
            fontSize={12}
            fontWeight={500}
            fill="var(--color-ink-soft)"
          >
            II
          </text>

          {/* Individual number labels under glyphs */}
          {GEN_I.map((ind, i) => {
            const cx = i === 0 ? i1X : i2X;
            return (
              <text
                key={ind.id}
                x={cx}
                y={genIY + R + 12}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {i + 1}
              </text>
            );
          })}
          {GEN_II.map((ind, i) => (
            <text
              key={ind.id}
              x={childXs[i]}
              y={genIIY + R + 12}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {i + 1}
            </text>
          ))}

          {/* Mate line — horizontal between parents */}
          <line
            x1={mateLineX1}
            y1={mateLineY}
            x2={mateLineX2}
            y2={mateLineY}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />

          {/* Drop line from mate-line midpoint to sibship line */}
          <line
            x1={mateLineMidX}
            y1={mateLineY}
            x2={mateLineMidX}
            y2={sibshipLineY}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />

          {/* Sibship line — horizontal above children */}
          <line
            x1={sibLineX1}
            y1={sibshipLineY}
            x2={sibLineX2}
            y2={sibshipLineY}
            stroke="var(--color-ink)"
            strokeWidth={1.5}
          />

          {/* Vertical drops from sibship line to each child */}
          {childXs.map((cx, i) => (
            <line
              key={`drop-${i}`}
              x1={cx}
              y1={dropY1}
              x2={cx}
              y2={dropY2}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
          ))}

          {/* Parent glyphs */}
          <Glyph cx={i1X} cy={genIY} sex="male" status="carrier" />
          <Glyph cx={i2X} cy={genIY} sex="female" status="carrier" />

          {/* Child glyphs */}
          {GEN_II.map((child, i) => (
            <Glyph
              key={child.id}
              cx={childXs[i]}
              cy={genIIY}
              sex={child.sex}
              status={child.status}
            />
          ))}
        </g>

        {/* ===== ANCHORS ===== */}

        {/* 1. Square glyph (male symbol) — I-1 carrier father */}
        <ExplainAnchor
          selector="square-glyph"
          index={1}
          pin={{ x: i1X - R - 20, y: genIY - R }}
          rect={{
            x: Math.max(0, i1X - R),
            y: Math.max(0, genIY - R),
            width: Math.min(iw - Math.max(0, i1X - R), R * 2),
            height: Math.min(ih - Math.max(0, genIY - R), R * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Circle glyph (female symbol) — I-2 carrier mother */}
        <ExplainAnchor
          selector="circle-glyph"
          index={2}
          pin={{ x: i2X + R + 20, y: genIY - R }}
          rect={{
            x: Math.max(0, i2X - R),
            y: Math.max(0, genIY - R),
            width: Math.min(iw - Math.max(0, i2X - R), R * 2),
            height: Math.min(ih - Math.max(0, genIY - R), R * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Half-filled glyph (carrier) — II-2 carrier child */}
        <ExplainAnchor
          selector="half-filled-glyph"
          index={3}
          pin={{ x: childXs[1] + R + 20, y: genIIY - R - 4 }}
          rect={{
            x: Math.max(0, childXs[1] - R),
            y: Math.max(0, genIIY - R),
            width: Math.min(iw - Math.max(0, childXs[1] - R), R * 2),
            height: Math.min(ih - Math.max(0, genIIY - R), R * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Filled glyph (affected) — II-4 affected child */}
        <ExplainAnchor
          selector="filled-glyph"
          index={4}
          pin={{ x: childXs[3] + R + 20, y: genIIY - R - 4 }}
          rect={{
            x: Math.max(0, childXs[3] - R),
            y: Math.max(0, genIIY - R),
            width: Math.min(iw - Math.max(0, childXs[3] - R), R * 2),
            height: Math.min(ih - Math.max(0, genIIY - R), R * 2),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Mate line — horizontal line connecting parents */}
        <ExplainAnchor
          selector="mate-line"
          index={5}
          pin={{ x: mateLineMidX, y: mateLineY - 18 }}
          rect={{
            x: Math.max(0, mateLineX1),
            y: Math.max(0, mateLineY - 5),
            width: Math.min(iw - Math.max(0, mateLineX1), mateLineX2 - mateLineX1),
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Sibship line — horizontal bar above children */}
        <ExplainAnchor
          selector="sibship-line"
          index={6}
          pin={{ x: midX, y: sibshipLineY - 18 }}
          rect={{
            x: Math.max(0, sibLineX1),
            y: Math.max(0, sibshipLineY - 5),
            width: Math.min(iw - Math.max(0, sibLineX1), sibLineX2 - sibLineX1),
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Generation label */}
        <ExplainAnchor
          selector="generation-label"
          index={7}
          pin={{ x: labelX - 14, y: (genIY + genIIY) / 2 }}
          rect={{
            x: -margin.left,
            y: Math.max(0, genIY - 12),
            width: margin.left - 4,
            height: Math.min(ih - Math.max(0, genIY - 12), genIIY - genIY + 24),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
