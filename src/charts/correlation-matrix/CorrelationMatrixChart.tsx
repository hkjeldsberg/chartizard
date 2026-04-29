"use client";

import { Group } from "@visx/group";
import { scaleBand } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Pearson correlations for 8 Boston-Housing-like features. Diagonal = 1.
// Values are plausible and symmetric; hand-picked so the narrative anchors
// (rooms × lstat strong negative, crime × lstat strong positive, age × crime
// mild positive) actually appear at the cells the story names.
const FEATURES = [
  "crim",
  "rooms",
  "age",
  "nox",
  "dis",
  "tax",
  "ptratio",
  "lstat",
] as const;
type Feature = (typeof FEATURES)[number];

// Upper triangle fill (row < col); diagonal = 1; lower mirrors automatically.
// [i][j] with i = row, j = col.
const MATRIX: ReadonlyArray<ReadonlyArray<number>> = [
  // crim    rooms   age    nox     dis    tax    ptratio lstat
  [ 1.00,  -0.22,  0.35,  0.42,  -0.38,  0.58,   0.29,   0.46],
  [-0.22,   1.00, -0.24, -0.30,   0.21, -0.29,  -0.36,  -0.69],
  [ 0.35,  -0.24,  1.00,  0.73,  -0.75,  0.51,   0.26,   0.60],
  [ 0.42,  -0.30,  0.73,  1.00,  -0.77,  0.67,   0.19,   0.59],
  [-0.38,   0.21, -0.75, -0.77,   1.00, -0.53,  -0.23,  -0.50],
  [ 0.58,  -0.29,  0.51,  0.67,  -0.53,  1.00,   0.46,   0.54],
  [ 0.29,  -0.36,  0.26,  0.19,  -0.23,  0.46,   1.00,   0.37],
  [ 0.46,  -0.69,  0.60,  0.59,  -0.50,  0.54,   0.37,   1.00],
];

// Diverging colour ramp. r ∈ [-1, 1]. Red for positive, blue for negative,
// neutral near 0. Colour is a supporting cue only; the number is always
// printed so the encoding is never colour-only.
function cellFill(r: number): string {
  const t = Math.max(-1, Math.min(1, r));
  if (t >= 0) {
    // Neutral → red. Warm hue, opacity grows with magnitude.
    const a = 0.08 + t * 0.72;
    return `rgba(176, 58, 46, ${a.toFixed(3)})`;
  }
  const a = 0.08 + -t * 0.72;
  return `rgba(41, 98, 156, ${a.toFixed(3)})`;
}

interface Props {
  width: number;
  height: number;
}

export function CorrelationMatrixChart({ width, height }: Props) {
  const margin = { top: 44, right: 24, bottom: 56, left: 68 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: [...FEATURES],
    range: [0, iw],
    padding: 0.06,
  });
  const yScale = scaleBand<string>({
    domain: [...FEATURES],
    range: [0, ih],
    padding: 0.06,
  });

  const cellW = xScale.bandwidth();
  const cellH = yScale.bandwidth();
  const fontSize = Math.min(12, Math.max(8, Math.min(cellW, cellH) * 0.32));

  // Anchor targets — specific cells the narrative names.
  // Strongest negative off-diagonal: rooms × lstat (-0.69)
  const negR = FEATURES.indexOf("rooms");
  const negC = FEATURES.indexOf("lstat");
  // Strongest positive off-diagonal: nox × dis (-0.77) is negative, so pick
  // the largest *positive* off-diagonal in the lower triangle we render.
  // nox × age = 0.73 is the strongest positive off-diagonal.
  const posR = FEATURES.indexOf("nox");
  const posC = FEATURES.indexOf("age");
  // Diagonal representative: "rooms" row/col.
  const diagIdx = FEATURES.indexOf("rooms");

  // Convert (row,col) to cell rect — we only draw the lower triangle
  // (row >= col) plus the diagonal. Upper triangle is intentionally blank.
  const cellRect = (row: number, col: number) => {
    const x = xScale(FEATURES[col]) ?? 0;
    const y = yScale(FEATURES[row]) ?? 0;
    return { x, y, width: cellW, height: cellH };
  };

  // Because we render only row >= col (lower triangle), mirror if needed.
  const mirror = (r: number, c: number) =>
    r >= c ? { r, c } : { r: c, c: r };
  const neg = mirror(negR, negC);
  const pos = mirror(posR, posC);
  const negRect = cellRect(neg.r, neg.c);
  const posRect = cellRect(pos.r, pos.c);
  const diagRect = cellRect(diagIdx, diagIdx);

  const negValue = MATRIX[negR][negC];
  const posValue = MATRIX[posR][posC];

  // Colour-scale legend geometry — below the matrix.
  const legendW = Math.min(iw, 180);
  const legendH = 10;
  const legendX = 0;
  const legendY = ih + 20;
  const legendSteps = 21; // -1.0, -0.9, ..., 1.0

  // Labels — uppercase for consistency with other charts.
  const featureLabel = (f: Feature) => f.toUpperCase();

  return (
    <svg width={width} height={height} role="img" aria-label="Correlation matrix">
      <Group left={margin.left} top={margin.top}>
        {/* Cells — lower triangle + diagonal only */}
        <g data-data-layer="true">
          {FEATURES.map((rowF, rIdx) =>
            FEATURES.map((colF, cIdx) => {
              if (cIdx > rIdx) return null; // skip upper triangle
              const value = MATRIX[rIdx][cIdx];
              const x = xScale(colF) ?? 0;
              const y = yScale(rowF) ?? 0;
              const isDiag = rIdx === cIdx;
              const textFill =
                Math.abs(value) > 0.6 && !isDiag
                  ? "var(--color-page)"
                  : "var(--color-ink)";
              return (
                <g key={`${rowF}-${colF}`}>
                  <rect
                    x={x}
                    y={y}
                    width={cellW}
                    height={cellH}
                    fill={isDiag ? "var(--color-hairline)" : cellFill(value)}
                  />
                  <text
                    x={x + cellW / 2}
                    y={y + cellH / 2}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontFamily="var(--font-mono)"
                    fontSize={fontSize}
                    fontWeight={500}
                    fill={isDiag ? "var(--color-ink-mute)" : textFill}
                  >
                    {isDiag ? "1.00" : value.toFixed(2)}
                  </text>
                </g>
              );
            }),
          )}
        </g>

        {/* Axis labels — rows on the left, columns on the bottom. Drawn as
            plain text (not <AxisLeft>) so we can rotate column labels. */}
        <g data-data-layer="true">
          {FEATURES.map((f) => (
            <text
              key={`row-${f}`}
              x={-8}
              y={(yScale(f) ?? 0) + cellH / 2}
              textAnchor="end"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-soft)"
            >
              {featureLabel(f)}
            </text>
          ))}
          {FEATURES.map((f) => {
            const cx = (xScale(f) ?? 0) + cellW / 2;
            return (
              <text
                key={`col-${f}`}
                x={cx}
                y={-10}
                textAnchor="start"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
                transform={`rotate(-40, ${cx}, -10)`}
              >
                {featureLabel(f)}
              </text>
            );
          })}
        </g>

        {/* 1. Diagonal — rooms/rooms as representative */}
        <ExplainAnchor
          selector="diagonal"
          index={1}
          pin={{
            x: diagRect.x + cellW + 10,
            y: diagRect.y + cellH / 2,
          }}
          rect={diagRect}
        >
          <rect
            x={diagRect.x}
            y={diagRect.y}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
        </ExplainAnchor>

        {/* 2. Strongest positive off-diagonal — NOX × AGE (0.73) */}
        <ExplainAnchor
          selector="strong-positive"
          index={2}
          pin={{
            x: posRect.x + cellW / 2,
            y: Math.max(0, posRect.y - 14),
          }}
          rect={posRect}
        >
          <rect
            x={posRect.x}
            y={posRect.y}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        </ExplainAnchor>

        {/* 3. Strongest negative off-diagonal — ROOMS × LSTAT (-0.69) */}
        <ExplainAnchor
          selector="strong-negative"
          index={3}
          pin={{
            x: negRect.x + cellW / 2,
            y: Math.max(0, negRect.y - 14),
          }}
          rect={negRect}
        >
          <rect
            x={negRect.x}
            y={negRect.y}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            strokeDasharray="3 3"
          />
        </ExplainAnchor>

        {/* 4. Row axis labels */}
        <ExplainAnchor
          selector="row-labels"
          index={4}
          pin={{ x: -48, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Column axis labels */}
        <ExplainAnchor
          selector="column-labels"
          index={5}
          pin={{ x: iw / 2, y: -28 }}
          rect={{ x: 0, y: -margin.top, width: iw, height: margin.top }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Colour scale legend (diverging, -1 .. +1) */}
        <ExplainAnchor
          selector="colour-scale"
          index={6}
          pin={{ x: legendX + legendW + 14, y: legendY + legendH / 2 }}
          rect={{
            x: legendX,
            y: legendY - 2,
            width: legendW,
            height: legendH + 16,
          }}
        >
          <g data-data-layer="true">
            {Array.from({ length: legendSteps }).map((_, i) => {
              const r = -1 + (i / (legendSteps - 1)) * 2;
              const segW = legendW / legendSteps;
              return (
                <rect
                  key={i}
                  x={legendX + i * segW}
                  y={legendY}
                  width={segW + 0.5}
                  height={legendH}
                  fill={cellFill(r)}
                />
              );
            })}
            <text
              x={legendX}
              y={legendY + legendH + 10}
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              -1
            </text>
            <text
              x={legendX + legendW / 2}
              y={legendY + legendH + 10}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              0
            </text>
            <text
              x={legendX + legendW}
              y={legendY + legendH + 10}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-mute)"
            >
              +1
            </text>
          </g>
        </ExplainAnchor>

        {/* Small annotation text on the off-diagonal extremes (outside the
            cells, in plain ink). Not anchored — the anchors already explain. */}
        <text
          x={negRect.x + cellW + 6}
          y={negRect.y + cellH / 2}
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          {`rooms · lstat ${negValue.toFixed(2)}`}
        </text>
        <text
          x={posRect.x + cellW + 6}
          y={posRect.y + cellH / 2}
          dominantBaseline="central"
          fontFamily="var(--font-mono)"
          fontSize={9}
          fill="var(--color-ink-mute)"
        >
          {`nox · age ${posValue.toFixed(2)}`}
        </text>
      </Group>
    </svg>
  );
}
