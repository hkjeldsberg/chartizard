"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Word = { text: string; count: number };

// Hand-counted top-15 frequencies from Abraham Lincoln's Gettysburg
// Address (272 words). Stopwords kept in deliberately so the stopword
// story is visible — `the`, `that`, and `we` dominate, which is why
// honest word-clouds strip stopwords before rendering.
const WORDS: ReadonlyArray<Word> = [
  { text: "the", count: 12 },
  { text: "that", count: 10 },
  { text: "we", count: 8 },
  { text: "here", count: 8 },
  { text: "to", count: 8 },
  { text: "a", count: 7 },
  { text: "and", count: 6 },
  { text: "nation", count: 5 },
  { text: "dedicated", count: 5 },
  { text: "of", count: 5 },
  { text: "people", count: 3 },
  { text: "dead", count: 3 },
  { text: "war", count: 2 },
  { text: "liberty", count: 1 },
  { text: "freedom", count: 1 },
];

interface Props {
  width: number;
  height: number;
}

interface Placed {
  text: string;
  count: number;
  fontSize: number;
  x: number;
  y: number;
  opacity: number;
}

export function WordCloudChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 20, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const placed = useMemo<Placed[]>(() => {
    // Seeded LCG so layout is deterministic across renders and server/client.
    let seed = 17;
    const rand = () => {
      seed = (seed * 9301 + 49297) % 233280;
      return seed / 233280;
    };

    // Sort words by count descending — biggest word lands at the centre.
    const sorted = [...WORDS].sort((a, b) => b.count - a.count);

    // Area-encode font size: fontSize ∝ sqrt(count). Readers perceive text
    // mass proportionally to glyph area, not height, so sqrt scaling keeps
    // a 4×-count word from rendering as a 4×-height monster that eats the
    // canvas.
    const minSize = Math.max(10, Math.min(iw, ih) / 22);
    const maxSize = Math.max(22, Math.min(iw, ih) / 5);
    const maxCount = sorted[0]?.count ?? 1;
    const sizeFor = (count: number) =>
      minSize + (maxSize - minSize) * Math.sqrt(count / maxCount);

    // Spiral placement: centre first, then each next word at a rotating
    // angle (i * 2.4 rad ≈ the golden-angle-ish pacing that avoids obvious
    // rings) and radius growing with index. Deterministic jitter on both
    // axes adds the irregular "scatter" feel without breaking repeatability.
    const cx = iw / 2;
    const cy = ih / 2;
    const baseRadius = Math.min(iw, ih) / 14;

    return sorted.map((w, i) => {
      const fontSize = sizeFor(w.count);
      let x: number;
      let y: number;
      if (i === 0) {
        x = cx;
        y = cy;
      } else {
        const angle = i * 2.4;
        const r = baseRadius + i * (baseRadius * 0.55);
        const jitterR = (rand() - 0.5) * baseRadius * 0.8;
        x = cx + Math.cos(angle) * (r + jitterR);
        y = cy + Math.sin(angle) * (r + jitterR) * 0.72; // squash vertically
      }

      // Clamp into plot area so off-canvas words never occur — allow a
      // small inset so glyphs aren't clipped at their baseline/cap line.
      const halfWord = fontSize * 0.3 * w.text.length;
      x = Math.max(halfWord + 2, Math.min(iw - halfWord - 2, x));
      y = Math.max(fontSize * 0.75, Math.min(ih - fontSize * 0.25, y));

      // Opacity rhythm: bigger words stay crisp, smaller words fade so
      // the eye focuses on the dominant stopwords first.
      const t = w.count / maxCount;
      const opacity = 0.55 + t * 0.4;

      return {
        text: w.text,
        count: w.count,
        fontSize,
        x,
        y,
        opacity,
      };
    });
  }, [iw, ih]);

  // `placed[]` is seeded from the static WORDS array — guaranteed non-empty,
  // so `largest` / `stopword` / `smallest` are always defined. Anchors
  // render unconditionally per contract §4.
  const largest = placed[0];
  const smallest = placed.reduce<Placed>(
    (acc, p) => (p.count < acc.count ? p : acc),
    largest,
  );
  const stopword =
    placed.find((p) => p.text === "the") ??
    placed.find((p) => p.text === "that") ??
    largest;

  // Colour/layout/largest anchors all route to stable coordinates derived
  // from the deterministic layout. If any of them would otherwise clamp to
  // the same spot, we clamp rects into the plot area per §8.
  const clamp = (rect: { x: number; y: number; width: number; height: number }) => ({
    x: Math.max(0, Math.min(iw, rect.x)),
    y: Math.max(0, Math.min(ih, rect.y)),
    width: Math.max(0, Math.min(iw - Math.max(0, rect.x), rect.width)),
    height: Math.max(0, Math.min(ih - Math.max(0, rect.y), rect.height)),
  });

  return (
    <svg width={width} height={height} role="img" aria-label="Word cloud">
      <Group left={margin.left} top={margin.top}>
        {/* The words themselves. All data-layer so Explain mode dims them. */}
        <g data-data-layer="true">
          {placed.map((p) => (
            <text
              key={p.text}
              x={p.x}
              y={p.y}
              fontFamily="var(--font-serif)"
              fontSize={p.fontSize}
              fontWeight={p.count >= 5 ? 600 : 400}
              textAnchor="middle"
              dominantBaseline="middle"
              fill="var(--color-ink)"
              fillOpacity={p.opacity}
            >
              {p.text}
            </text>
          ))}
        </g>

        {/* Largest word — the headline stopword. Anchors the pin adjacent
            to the dominant glyph; the rect hugs the text box so hovering
            near the word triggers the explanation. */}
        <ExplainAnchor
          selector="largest-word"
          index={1}
          pin={{
            x: Math.min(iw - 14, largest.x + largest.fontSize * 0.35 * largest.text.length + 12),
            y: Math.max(14, largest.y - largest.fontSize * 0.75),
          }}
          rect={clamp({
            x: largest.x - largest.fontSize * 0.35 * largest.text.length - 4,
            y: largest.y - largest.fontSize * 0.65,
            width: largest.fontSize * 0.7 * largest.text.length + 8,
            height: largest.fontSize * 1.1,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Size encoding — the concept. The rect covers the upper-left
            quadrant where large/medium words dominate, so the anchor is
            always hittable regardless of exact layout. */}
        <ExplainAnchor
          selector="size-encoding"
          index={2}
          pin={{ x: 14, y: 14 }}
          rect={clamp({ x: 0, y: 0, width: iw / 2, height: ih / 2 })}
        >
          <g />
        </ExplainAnchor>

        {/* Stopword bias — the editorial anchor. Pinned next to `the`
            (the chart's dominant stopword). */}
        <ExplainAnchor
          selector="stopword-bias"
          index={3}
          pin={{
            x: Math.max(14, stopword.x - stopword.fontSize * 0.35 * stopword.text.length - 12),
            y: Math.min(ih - 14, stopword.y + stopword.fontSize * 0.9),
          }}
          rect={clamp({
            x: stopword.x - stopword.fontSize * 0.4 * stopword.text.length - 4,
            y: stopword.y - stopword.fontSize * 0.6,
            width: stopword.fontSize * 0.8 * stopword.text.length + 8,
            height: stopword.fontSize * 1.1,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Colour — the chosen dimension. We render everything in ink with
            opacity variation, and the anchor rect covers the centre band
            where the opacity rhythm is most visible. */}
        <ExplainAnchor
          selector="colour"
          index={4}
          pin={{ x: iw - 14, y: 14 }}
          rect={clamp({ x: iw / 2, y: 0, width: iw / 2, height: ih / 2 })}
        >
          <g />
        </ExplainAnchor>

        {/* Layout — the random-ish packing itself. Whole-canvas rect so the
            anchor is unconditionally reachable even in extreme aspect
            ratios. */}
        <ExplainAnchor
          selector="layout"
          index={5}
          pin={{ x: 14, y: ih - 14 }}
          rect={clamp({ x: 0, y: ih / 2, width: iw / 2, height: ih / 2 })}
        >
          <g />
        </ExplainAnchor>

        {/* Smallest word — the long tail. */}
        <ExplainAnchor
          selector="smallest-word"
          index={6}
          pin={{
            x: Math.min(iw - 14, smallest.x + smallest.fontSize * 0.35 * smallest.text.length + 10),
            y: Math.min(ih - 14, smallest.y + smallest.fontSize * 0.9),
          }}
          rect={clamp({
            x: smallest.x - smallest.fontSize * 0.4 * smallest.text.length - 4,
            y: smallest.y - smallest.fontSize * 0.6,
            width: smallest.fontSize * 0.8 * smallest.text.length + 8,
            height: smallest.fontSize * 1.2,
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
