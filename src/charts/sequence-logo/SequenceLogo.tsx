"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Per-position nucleotide frequency matrix ────────────────────────────────
// TATA-box motif consensus from RNA Polymerase II promoters.
// Schneider & Stephens (1990, NAR 18(20)) defined the information-content
// stack height: bits_i = 2 + Σ_b f_{i,b} log₂ f_{i,b}   (max 2 bits for DNA)
// WebLogo (Crooks, Hon, Chandonia, Brenner, 2004, Genome Research) is the
// canonical software implementation of this encoding.

interface FreqRow {
  pos: number;   // 1-indexed position label
  A: number;
  C: number;
  G: number;
  T: number;
}

// Weak positions: near-uniform → low information content (~0.3 bits)
// Strong TATAAA core: one dominant base (~0.85 freq) → high information (~1.8 bits)
const FREQ_MATRIX: ReadonlyArray<FreqRow> = [
  { pos: 1,  A: 0.40, C: 0.20, G: 0.25, T: 0.15 },
  { pos: 2,  A: 0.20, C: 0.15, G: 0.30, T: 0.35 },
  { pos: 3,  A: 0.05, C: 0.05, G: 0.05, T: 0.85 }, // T dominant
  { pos: 4,  A: 0.85, C: 0.05, G: 0.05, T: 0.05 }, // A dominant
  { pos: 5,  A: 0.05, C: 0.05, G: 0.05, T: 0.85 }, // T dominant
  { pos: 6,  A: 0.85, C: 0.05, G: 0.05, T: 0.05 }, // A dominant
  { pos: 7,  A: 0.85, C: 0.05, G: 0.05, T: 0.05 }, // A dominant
  { pos: 8,  A: 0.85, C: 0.05, G: 0.05, T: 0.05 }, // A dominant
  { pos: 9,  A: 0.25, C: 0.30, G: 0.20, T: 0.25 },
  { pos: 10, A: 0.30, C: 0.25, G: 0.25, T: 0.20 },
];

// Shannon entropy H = -Σ f_i log₂ f_i; information content = 2 - H (bits)
function informationContent(row: FreqRow): number {
  const bases: number[] = [row.A, row.C, row.G, row.T];
  const H = bases.reduce((sum, f) => {
    if (f <= 0) return sum;
    return sum - f * Math.log2(f);
  }, 0);
  return Math.max(0, 2 - H);
}

// Nucleotide colour palette — classic WebLogo convention:
// A = green, C = blue, G = gold/orange, T = red
const BASE_COLORS: Record<string, string> = {
  A: "#2a7a2a",
  C: "#1a5ab0",
  G: "#b07020",
  T: "#b02020",
};

interface LetterStack {
  pos: number;
  bits: number;
  letters: Array<{ base: string; freq: number; color: string }>;
}

function buildStacks(): LetterStack[] {
  return FREQ_MATRIX.map((row) => {
    const bits = informationContent(row);
    // Sort letters by frequency ascending so largest letter renders on top
    const letters: Array<{ base: string; freq: number; color: string }> = [
      { base: "A", freq: row.A, color: BASE_COLORS.A },
      { base: "C", freq: row.C, color: BASE_COLORS.C },
      { base: "G", freq: row.G, color: BASE_COLORS.G },
      { base: "T", freq: row.T, color: BASE_COLORS.T },
    ].sort((a, b) => a.freq - b.freq); // ascending → largest on top
    return { pos: row.pos, bits, letters };
  });
}

const STACKS = buildStacks();

interface Props {
  width: number;
  height: number;
}

export function SequenceLogo({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 48, left: 52 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = useMemo(
    () =>
      scaleBand<number>({
        domain: STACKS.map((s) => s.pos),
        range: [0, iw],
        padding: 0.12,
      }),
    [iw],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, 2],
        range: [ih, 0],
        nice: false,
      }),
    [ih],
  );

  const colWidth = xScale.bandwidth();

  // Anchors: pick representative stacks by index
  // Conserved: position 4 (A-dominant, ~1.8 bits)
  // Variable: position 10 (near-uniform, ~0.3 bits)
  const conservedStack = STACKS[3]; // pos 4
  const variableStack = STACKS[9]; // pos 10
  const exampleLetterStack = STACKS[3]; // pos 4 — the A letter at the top

  // Compute a representative single letter glyph for the "letter" anchor:
  // the top (largest) letter in the conserved position 4 stack
  const topLetterOfConserved = exampleLetterStack.letters[exampleLetterStack.letters.length - 1];

  // For each stack, compute the SVG rects for the letter glyphs
  const stackRects = useMemo(() => {
    return STACKS.map((stack) => {
      const x0 = xScale(stack.pos) ?? 0;
      const totalBits = stack.bits;
      // Bottom of stack in SVG coordinates
      const stackBottomY = ih;
      const stackHeightPx = ih - yScale(totalBits);

      // Each letter occupies a fraction of the stack height proportional to freq
      let cursor = stackBottomY; // building from bottom up
      const rects = stack.letters.map((letter) => {
        const letterHeightPx = stackHeightPx * letter.freq;
        const rectY = cursor - letterHeightPx;
        const rect = {
          x: x0,
          y: rectY,
          width: colWidth,
          height: letterHeightPx,
          base: letter.base,
          color: letter.color,
          freq: letter.freq,
          bits: totalBits,
        };
        cursor -= letterHeightPx;
        return rect;
      });
      return { pos: stack.pos, rects, x0, totalBits };
    });
  }, [iw, ih, xScale, yScale, colWidth]);

  // Determine pixel positions for anchors
  const conservedX0 = xScale(conservedStack.pos) ?? 0;
  const variableX0 = xScale(variableStack.pos) ?? 0;

  // The top letter in conserved stack for the "letter" anchor
  const conservedStackRects = stackRects[3].rects;
  const topLetterRect = conservedStackRects[conservedStackRects.length - 1];

  return (
    <svg width={width} height={height} role="img" aria-label="Sequence logo — TATA-box motif">
      <Group left={margin.left} top={margin.top}>
        {/* Letter stacks — the primary encoding */}
        <g data-data-layer="true">
          {stackRects.map(({ pos, rects }) =>
            rects.map((r) => {
              if (r.height < 0.5) return null;
              const textFontSize = Math.max(6, r.height * 0.85);
              return (
                <g key={`${pos}-${r.base}`}>
                  <text
                    x={r.x + r.width / 2}
                    y={r.y + r.height / 2}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontFamily="var(--font-mono)"
                    fontWeight="700"
                    fontSize={textFontSize}
                    fill={r.color}
                    // Stretch letter to fill the allocated height using SVG text scaling
                    transform={
                      r.height > 6
                        ? `translate(${r.x + r.width / 2}, ${r.y + r.height / 2}) scale(1, ${Math.min(4, r.height / Math.max(1, textFontSize))}) translate(-${r.x + r.width / 2}, -${r.y + r.height / 2})`
                        : undefined
                    }
                  >
                    {r.base}
                  </text>
                </g>
              );
            }),
          )}
        </g>

        {/* Y-axis — bits */}
        <ExplainAnchor
          selector="y-axis"
          index={1}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={4}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickValues={[0, 0.5, 1.0, 1.5, 2.0]}
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "end",
              dx: "-0.25em",
              dy: "0.33em",
            })}
          />
          <text
            x={-margin.left + 4}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            BITS
          </text>
        </ExplainAnchor>

        {/* X-axis — position */}
        <ExplainAnchor
          selector="x-axis"
          index={2}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            tickFormat={(v) => String(v)}
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
            y={ih + 38}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            POSITION
          </text>
        </ExplainAnchor>

        {/* A single letter glyph anchor — the top letter in position 4 */}
        <ExplainAnchor
          selector="letter"
          index={3}
          pin={{
            x: Math.min(iw - 10, conservedX0 + colWidth + 10),
            y: Math.max(10, topLetterRect.y - 8),
          }}
          rect={{
            x: Math.max(0, topLetterRect.x),
            y: Math.max(0, topLetterRect.y),
            width: Math.min(colWidth, iw - Math.max(0, topLetterRect.x)),
            height: Math.min(topLetterRect.height, ih - Math.max(0, topLetterRect.y)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Frequency-within-stack encoding anchor — the whole conserved stack */}
        <ExplainAnchor
          selector="frequency-encoding"
          index={4}
          pin={{
            x: Math.max(10, conservedX0 - 12),
            y: yScale(conservedStack.bits) + (ih - yScale(conservedStack.bits)) / 2,
          }}
          rect={{
            x: Math.max(0, conservedX0),
            y: Math.max(0, yScale(conservedStack.bits)),
            width: Math.min(colWidth, iw - Math.max(0, conservedX0)),
            height: Math.min(ih - yScale(conservedStack.bits), ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Conserved column (tall stack) — position 4 */}
        <ExplainAnchor
          selector="conserved-column"
          index={5}
          pin={{
            x: Math.min(iw - 10, conservedX0 + colWidth + 10),
            y: yScale(conservedStack.bits) + 10,
          }}
          rect={{
            x: Math.max(0, conservedX0),
            y: Math.max(0, yScale(conservedStack.bits) - 4),
            width: Math.min(colWidth, iw - Math.max(0, conservedX0)),
            height: Math.min(ih - yScale(conservedStack.bits) + 4, ih),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Variable column (short stack) — position 10 */}
        <ExplainAnchor
          selector="variable-column"
          index={6}
          pin={{
            x: Math.min(iw - 10, variableX0 + colWidth + 10),
            y: ih - 20,
          }}
          rect={{
            x: Math.max(0, variableX0),
            y: Math.max(0, yScale(variableStack.bits) - 4),
            width: Math.min(colWidth, iw - Math.max(0, variableX0)),
            height: Math.min(ih - yScale(variableStack.bits) + 4, ih),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
