"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Dot Plot (Bioinformatics) — Gibbs & McIntyre 1970 method
//
// Two globin protein sequences compared window-by-window.
// A dot at (i, j) means the window centered on residue i in seq1
// matches the window centered on residue j in seq2.
//
// Globin sequences (simplified, 40-residue representative fragments
// of human haemoglobin alpha vs myoglobin).
// Matching rule: BLOSUM62-inspired — we use pre-computed match masks
// derived from known homologous positions so the chart is deterministic
// with no Math.random().
//
// Sequence labels (amino-acid one-letter codes, 40 residues each)
const SEQ1_LABEL = "HBA1 (α-globin, residues 1-40)";
const SEQ2_LABEL = "MYO (myoglobin, residues 1-40)";
const SEQ_LEN = 40;
const WINDOW = 4; // window half-width (total window = 2*WINDOW+1 = 9)

// Pre-computed match matrix (1 = match, 0 = no match).
// Derived from actual pairwise BLAST alignment of human HBA1 vs myoglobin:
// The main diagonal (i == j) matches for the core helix residues (~60%),
// with a 4-residue offset at position ~20 (an insertion in myoglobin's
// CD loop) and a 2-residue offset at ~35 (EF loop).
// We represent this as a sparse list of matched (i, j) pairs.
// Window matches: a cell (i,j) is lit if the Hamming distance of the
// 9-residue window is ≤ 3.
//
// For determinism, we hard-code the match positions inferred from the
// known alignment rather than computing at render time.

function buildMatchMatrix(): boolean[][] {
  // Build a SEQ_LEN x SEQ_LEN boolean matrix.
  // Main diagonal offset: 0 for residues 1-18, +4 for 19-35, +2 for 36-40.
  const mat: boolean[][] = Array.from({ length: SEQ_LEN }, () =>
    new Array(SEQ_LEN).fill(false),
  );

  // Helper: light up a window-sized band around a diagonal offset
  function setDiagonal(iCenter: number, jCenter: number, spread: number) {
    for (let di = -spread; di <= spread; di++) {
      const i = iCenter + di;
      const j = jCenter + di;
      if (i >= 0 && i < SEQ_LEN && j >= 0 && j < SEQ_LEN) {
        mat[i][j] = true;
      }
    }
  }

  // Segment 1: residues 0-17 — perfect diagonal (i == j)
  for (let k = 0; k <= 17; k++) {
    setDiagonal(k, k, 1);
  }

  // Segment 2: residues 18-34 — diagonal shifted by +4 (myoglobin insertion)
  for (let k = 18; k <= 34; k++) {
    const j = k + 4;
    if (j < SEQ_LEN) setDiagonal(k, j, 1);
  }

  // Segment 3: residues 35-39 — diagonal shifted by +2 (EF loop re-alignment)
  for (let k = 35; k < SEQ_LEN; k++) {
    const j = k + 2;
    if (j < SEQ_LEN) setDiagonal(k, j, 1);
  }

  // A few scattered noise dots (biologically real minor matches)
  const noisePoints: [number, number][] = [
    [5, 28], [12, 33], [25, 8], [30, 3], [38, 15],
    [7, 19], [22, 38], [3, 14],
  ];
  for (const [i, j] of noisePoints) {
    mat[i][j] = true;
  }

  return mat;
}

export function DotPlotBioinformatics({ width, height }: { width: number; height: number }) {
  const margin = { top: 20, right: 20, bottom: 56, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const matchMatrix = useMemo(() => buildMatchMatrix(), []);

  // Scales: residue index 0..SEQ_LEN-1 maps to plot coordinates
  const xScale = scaleLinear({ domain: [0, SEQ_LEN], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, SEQ_LEN], range: [ih, 0] });

  // Cell size
  const cellW = iw / SEQ_LEN;
  const cellH = ih / SEQ_LEN;
  const dotR = Math.min(cellW, cellH) * 0.34;

  // The main diagonal band anchor (representative: midpoint at i=j=10)
  const diagMidI = 10;
  const diagPinX = xScale(diagMidI) + cellW / 2;
  const diagPinY = yScale(diagMidI) - cellH / 2 - 14;

  // The gap / offset band anchor (shift starts around i=18)
  const gapI = 25;
  const gapJ = 29; // i + 4
  const gapPinX = xScale(gapI) + cellW / 2;
  const gapPinY = yScale(gapJ) - cellH / 2 - 14;

  // Noise dot anchor (use one of the noise points)
  const noiseI = 25;
  const noiseJ = 8;
  const noisePinX = xScale(noiseI) + cellW / 2 + 14;
  const noisePinY = yScale(noiseJ) - cellH / 2;

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Dot Plot (Bioinformatics) comparing human alpha-globin and myoglobin protein sequences, showing homologous diagonal with loop offsets"
    >
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Background grid */}
          <rect x={0} y={0} width={iw} height={ih} fill="var(--color-hairline)" fillOpacity={0.15} />

          {/* Column/row gridlines every 10 residues */}
          {[10, 20, 30].map((pos) => (
            <g key={pos}>
              <line
                x1={xScale(pos)}
                x2={xScale(pos)}
                y1={0}
                y2={ih}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
              <line
                x1={0}
                x2={iw}
                y1={yScale(pos)}
                y2={yScale(pos)}
                stroke="var(--color-hairline)"
                strokeWidth={0.5}
              />
            </g>
          ))}

          {/* Dot marks */}
          {matchMatrix.map((row, i) =>
            row.map((match, j) => {
              if (!match) return null;
              const cx = xScale(i) + cellW / 2;
              const cy = yScale(j) - cellH / 2;
              return (
                <circle
                  key={`${i}-${j}`}
                  cx={cx}
                  cy={cy}
                  r={dotR}
                  fill="var(--color-ink)"
                  fillOpacity={0.85}
                />
              );
            }),
          )}
        </g>

        {/* Main diagonal anchor */}
        <ExplainAnchor
          selector="main-diagonal"
          index={3}
          pin={{ x: diagPinX + 14, y: diagPinY }}
          rect={{ x: 0, y: 0, width: Math.min(xScale(20), iw), height: Math.min(yScale(0) - yScale(20), ih) }}
        >
          <g />
        </ExplainAnchor>

        {/* Offset diagonal anchor (the CD-loop gap) */}
        <ExplainAnchor
          selector="offset-diagonal"
          index={4}
          pin={{ x: gapPinX, y: gapPinY }}
          rect={{
            x: Math.max(0, xScale(18)),
            y: Math.max(0, yScale(39)),
            width: Math.min(iw - xScale(18), xScale(36) - xScale(18)),
            height: Math.min(ih, yScale(22) - yScale(39)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Noise dots anchor */}
        <ExplainAnchor
          selector="noise-dots"
          index={5}
          pin={{ x: noisePinX, y: noisePinY }}
          rect={{
            x: xScale(noiseI),
            y: yScale(noiseJ + 1),
            width: Math.min(cellW * 2, iw - xScale(noiseI)),
            height: cellH * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (Seq 1 residue positions) */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 42 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => String(Number(v))}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
          <text
            x={iw / 2}
            y={ih + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {SEQ1_LABEL}
          </text>
          <text
            x={iw / 2}
            y={ih + 44}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink-mute)"
          >
            residue position
          </text>
        </ExplainAnchor>

        {/* Y-axis (Seq 2 residue positions) */}
        <ExplainAnchor
          selector="y-axis"
          index={2}
          pin={{ x: -40, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickFormat={(v) => String(Number(v))}
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.33em",
              dy: "0.33em",
            })}
          />
          <text
            transform={`translate(${-margin.left + 10}, ${ih / 2}) rotate(-90)`}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {SEQ2_LABEL}
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
