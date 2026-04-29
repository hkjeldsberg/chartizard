"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Six health indicators per US state, hand-picked to roughly match 2020s CDC /
// Census figures. All values are normalised below before encoding to features.
//   lifeExp      — life expectancy (years)         → face width
//   obesity      — obesity rate (% adults)         → eye size
//   smoking      — smoking rate (% adults)         → eye separation
//   uninsured    — uninsured rate (% adults)       → nose length
//   heart        — heart-disease death rate / 100k → mouth curvature (inverted: worse → frown)
//   diabetes     — diabetes prevalence (% adults)  → mouth width
interface StateRow {
  code: string;
  lifeExp: number;
  obesity: number;
  smoking: number;
  uninsured: number;
  heart: number;
  diabetes: number;
}

const STATES: ReadonlyArray<StateRow> = [
  { code: "CA", lifeExp: 80.9, obesity: 28.1, smoking: 10.0, uninsured: 7.0, heart: 138, diabetes: 10.5 },
  { code: "TX", lifeExp: 78.4, obesity: 35.8, smoking: 13.2, uninsured: 17.3, heart: 169, diabetes: 12.0 },
  { code: "NY", lifeExp: 80.7, obesity: 27.6, smoking: 11.4, uninsured: 5.2, heart: 179, diabetes: 11.0 },
  { code: "FL", lifeExp: 79.1, obesity: 28.4, smoking: 12.7, uninsured: 12.1, heart: 146, diabetes: 11.9 },
  { code: "IL", lifeExp: 78.8, obesity: 33.5, smoking: 14.0, uninsured: 7.0, heart: 170, diabetes: 10.4 },
  { code: "PA", lifeExp: 77.8, obesity: 33.4, smoking: 15.7, uninsured: 5.6, heart: 171, diabetes: 11.2 },
  { code: "OH", lifeExp: 76.6, obesity: 36.0, smoking: 19.2, uninsured: 6.6, heart: 197, diabetes: 12.1 },
  { code: "GA", lifeExp: 77.2, obesity: 33.0, smoking: 14.2, uninsured: 13.6, heart: 175, diabetes: 12.7 },
  { code: "NC", lifeExp: 77.6, obesity: 33.6, smoking: 15.1, uninsured: 10.7, heart: 161, diabetes: 11.2 },
  { code: "MI", lifeExp: 77.6, obesity: 35.2, smoking: 17.3, uninsured: 5.8, heart: 194, diabetes: 11.4 },
  { code: "NJ", lifeExp: 80.7, obesity: 27.3, smoking: 12.0, uninsured: 7.3, heart: 160, diabetes: 10.3 },
  { code: "VA", lifeExp: 79.1, obesity: 32.3, smoking: 13.2, uninsured: 7.5, heart: 153, diabetes: 11.1 },
];

type VarKey = "lifeExp" | "obesity" | "smoking" | "uninsured" | "heart" | "diabetes";
const VAR_KEYS: ReadonlyArray<VarKey> = [
  "lifeExp",
  "obesity",
  "smoking",
  "uninsured",
  "heart",
  "diabetes",
];

// Normalise each variable to [0.3, 1.0]. Higher = "more of the variable".
// For heart-disease we invert so that higher death rate → lower mouth-curvature
// (more of a frown), matching intuition.
function normalise(rows: ReadonlyArray<StateRow>) {
  const mins: Record<VarKey, number> = {} as Record<VarKey, number>;
  const maxs: Record<VarKey, number> = {} as Record<VarKey, number>;
  for (const k of VAR_KEYS) {
    let mn = Infinity;
    let mx = -Infinity;
    for (const r of rows) {
      mn = Math.min(mn, r[k]);
      mx = Math.max(mx, r[k]);
    }
    mins[k] = mn;
    maxs[k] = mx;
  }
  return rows.map((r) => {
    const n = (v: number, k: VarKey) => {
      const range = maxs[k] - mins[k];
      return range > 0 ? 0.3 + 0.7 * ((v - mins[k]) / range) : 0.65;
    };
    return {
      code: r.code,
      faceWidth: n(r.lifeExp, "lifeExp"),
      eyeSize: n(r.obesity, "obesity"),
      eyeSep: n(r.smoking, "smoking"),
      noseLen: n(r.uninsured, "uninsured"),
      // invert so that high heart-disease → low mouth-curvature (frown)
      mouthCurve: 1 - n(r.heart, "heart") + 0.3,
      mouthWidth: n(r.diabetes, "diabetes"),
    };
  });
}

interface FaceParams {
  code: string;
  faceWidth: number;
  eyeSize: number;
  eyeSep: number;
  noseLen: number;
  mouthCurve: number;
  mouthWidth: number;
}

interface Props {
  width: number;
  height: number;
}

export function ChernoffFaces({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const faces = useMemo(() => normalise(STATES), []);

  // 4 columns × 3 rows lattice
  const cols = 4;
  const rows = 3;
  const cellW = iw / cols;
  const cellH = ih / rows;
  const faceR = Math.min(cellW, cellH) * 0.38;

  // Representative face — pick the highest-obesity state (OH) for the
  // anomaly-face anchor so it visibly differs from the rest.
  const anomalyIdx = faces.findIndex((f) => f.code === "OH");
  const anomalyRow = Math.floor(anomalyIdx / cols);
  const anomalyCol = anomalyIdx % cols;
  const anomalyCx = anomalyCol * cellW + cellW / 2;
  const anomalyCy = anomalyRow * cellH + cellH / 2;

  // Clamp anchor rects to plot area
  const clamp = (rx: number, ry: number, rw: number, rh: number) => {
    const x0 = Math.max(0, rx);
    const y0 = Math.max(0, ry);
    const x1 = Math.min(iw, rx + rw);
    const y1 = Math.min(ih, ry + rh);
    return {
      x: x0,
      y: y0,
      width: Math.max(0, x1 - x0),
      height: Math.max(0, y1 - y0),
    };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Chernoff faces">
      <Group left={margin.left} top={margin.top}>
        {/* Faces grid */}
        <g data-data-layer="true">
          {faces.map((f, i) => {
            const row = Math.floor(i / cols);
            const col = i % cols;
            const cx = col * cellW + cellW / 2;
            const cy = row * cellH + cellH / 2;
            return (
              <Face key={f.code} cx={cx} cy={cy} r={faceR} params={f} />
            );
          })}
        </g>

        {/* 1. Face — representative glyph */}
        <ExplainAnchor
          selector="face"
          index={1}
          pin={{ x: cellW / 2 + faceR + 10, y: cellH / 2 - faceR - 4 }}
          rect={clamp(0, 0, cellW, cellH)}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Feature mapping — the eyes on a specific face */}
        <ExplainAnchor
          selector="feature-mapping"
          index={2}
          pin={{ x: cellW + cellW / 2, y: cellH / 2 - faceR - 8 }}
          rect={clamp(cellW, 0, cellW, cellH)}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Anomaly face — visibly different */}
        <ExplainAnchor
          selector="anomaly"
          index={3}
          pin={{ x: anomalyCx + faceR + 12, y: anomalyCy - faceR - 4 }}
          rect={clamp(
            anomalyCx - faceR - 4,
            anomalyCy - faceR - 4,
            faceR * 2 + 8,
            faceR * 2 + 8,
          )}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Label — the 2-letter state code below each face */}
        <ExplainAnchor
          selector="label"
          index={4}
          pin={{ x: cellW / 2, y: cellH - 2 }}
          rect={clamp(0, cellH - 14, cellW, 14)}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Lattice — the 4×3 grid */}
        <ExplainAnchor
          selector="lattice"
          index={5}
          pin={{ x: iw - 14, y: ih - 14 }}
          rect={clamp(iw - cellW, ih - cellH, cellW, cellH)}
        >
          <g />
        </ExplainAnchor>

        {/* Caption below grid */}
        <text
          x={iw / 2}
          y={ih + 28}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          6 HEALTH INDICATORS · 12 US STATES
        </text>
      </Group>
    </svg>
  );
}

interface FaceProps {
  cx: number;
  cy: number;
  r: number;
  params: FaceParams;
}

function Face({ cx, cy, r, params }: FaceProps) {
  const { code, faceWidth, eyeSize, eyeSep, noseLen, mouthCurve, mouthWidth } =
    params;

  // Face ellipse: width varies, height fixed
  const rx = r * (0.65 + 0.35 * faceWidth);
  const ry = r * 0.92;

  // Eyes: size and separation scale with the params
  const eyeR = 1.5 + 3.2 * eyeSize;
  const eyeOffset = r * (0.22 + 0.22 * eyeSep);
  const eyeY = cy - r * 0.18;

  // Nose: vertical line of varying length
  const noseLength = r * (0.18 + 0.32 * noseLen);
  const noseY1 = cy - r * 0.02;
  const noseY2 = noseY1 + noseLength;

  // Mouth: quadratic curve. Curvature ∈ [0, 1.2] → negative (frown) to
  // positive (smile) through a centre offset.
  const mouthY = cy + r * 0.44;
  const mouthW = r * (0.35 + 0.4 * mouthWidth);
  const curveDelta = (mouthCurve - 0.65) * r * 0.7; // positive = smile
  const mouthCx = cx;
  const mouthCy = mouthY + curveDelta;
  const mouthPath = `M ${(cx - mouthW).toFixed(1)} ${mouthY.toFixed(
    1,
  )} Q ${mouthCx.toFixed(1)} ${mouthCy.toFixed(1)}, ${(cx + mouthW).toFixed(
    1,
  )} ${mouthY.toFixed(1)}`;

  return (
    <g>
      {/* Head */}
      <ellipse
        cx={cx}
        cy={cy}
        rx={rx}
        ry={ry}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Eyes */}
      <circle
        cx={cx - eyeOffset}
        cy={eyeY}
        r={eyeR}
        fill="var(--color-ink)"
      />
      <circle
        cx={cx + eyeOffset}
        cy={eyeY}
        r={eyeR}
        fill="var(--color-ink)"
      />
      {/* Nose */}
      <line
        x1={cx}
        x2={cx}
        y1={noseY1}
        y2={noseY2}
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        strokeLinecap="round"
      />
      {/* Mouth */}
      <path
        d={mouthPath}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
        strokeLinecap="round"
      />
      {/* State code */}
      <text
        x={cx}
        y={cy + ry + 12}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={10}
        fontWeight={600}
        fill="var(--color-ink-soft)"
      >
        {code}
      </text>
    </g>
  );
}
