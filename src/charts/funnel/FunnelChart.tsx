"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Stage = { name: string; count: number };

const STAGES: ReadonlyArray<Stage> = [
  { name: "Visits", count: 10000 },
  { name: "Product view", count: 6400 },
  { name: "Add to cart", count: 2100 },
  { name: "Checkout start", count: 1050 },
  { name: "Purchase", count: 520 },
];

function fmt(n: number): string {
  return n.toLocaleString("en-US");
}

interface Props {
  width: number;
  height: number;
}

export function FunnelChart({ width, height }: Props) {
  const margin = { top: 24, right: 140, bottom: 24, left: 140 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const topCount = STAGES[0].count;
  const stageH = STAGES.length > 0 ? ih / STAGES.length : 0;
  const cx = iw / 2;

  // Per-stage width in pixels (proportional to count, centred)
  const widths = STAGES.map((s) => (s.count / topCount) * iw);

  // Build trapezoid points: stage N top-width = widths[N],
  // bottom-width = widths[N+1] (for last stage we taper slightly to the
  // same width so it reads as a rectangle at the bottom of the funnel).
  const trapezoids = STAGES.map((s, i) => {
    const yTop = i * stageH;
    const yBot = (i + 1) * stageH;
    const wTop = widths[i];
    const wBot = i < STAGES.length - 1 ? widths[i + 1] : widths[i];
    const xTopL = cx - wTop / 2;
    const xTopR = cx + wTop / 2;
    const xBotL = cx - wBot / 2;
    const xBotR = cx + wBot / 2;
    return {
      stage: s,
      index: i,
      yTop,
      yBot,
      wTop,
      wBot,
      points: `${xTopL},${yTop} ${xTopR},${yTop} ${xBotR},${yBot} ${xBotL},${yBot}`,
      labelY: yTop + stageH / 2,
      // Drop-off from previous stage (null for the top)
      dropoffPct:
        i === 0
          ? null
          : Math.round(
              ((STAGES[i - 1].count - s.count) / STAGES[i - 1].count) * 100,
            ),
    };
  });

  // The biggest-drop stage (Product view -> Cart) is the chart's headline.
  // Compute which boundary index has the largest proportional drop.
  let biggestDropIdx = 1;
  let biggestDropPct = 0;
  for (let i = 1; i < STAGES.length; i++) {
    const pct =
      (STAGES[i - 1].count - STAGES[i].count) / STAGES[i - 1].count;
    if (pct > biggestDropPct) {
      biggestDropPct = pct;
      biggestDropIdx = i;
    }
  }

  // Anchors target specific trapezoids
  const stageForStageAnchor = trapezoids[0]; // "Visits" — the top-width
  const stageForDropAnchor = trapezoids[biggestDropIdx]; // the Product-view→Cart trapezoid
  const stageForRateAnchor = trapezoids[trapezoids.length - 1]; // Purchase conversion
  const stageForLabelAnchor = trapezoids[2]; // "Add to cart"
  const stageForBottomAnchor = trapezoids[trapezoids.length - 1];

  return (
    <svg width={width} height={height} role="img" aria-label="Funnel chart">
      <Group left={margin.left} top={margin.top}>
        {/* Trapezoids */}
        <g data-data-layer="true">
          {trapezoids.map((t, i) => (
            <polygon
              key={t.stage.name}
              points={t.points}
              fill="var(--color-ink)"
              fillOpacity={0.82 - i * 0.1}
              stroke="var(--color-page)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Stage labels (name + count) on the left, drop-off pct on the right */}
        <g data-data-layer="true">
          {trapezoids.map((t) => (
            <g key={t.stage.name}>
              <text
                x={-12}
                y={t.labelY - 4}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {t.stage.name.toUpperCase()}
              </text>
              <text
                x={-12}
                y={t.labelY + 10}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {fmt(t.stage.count)}
              </text>
              {t.dropoffPct !== null && (
                <text
                  x={iw + 12}
                  y={t.yTop + 2}
                  textAnchor="start"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink-mute)"
                >
                  -{t.dropoffPct}%
                </text>
              )}
            </g>
          ))}
        </g>

        {/* Anchor 1: stage — the top "Visits" trapezoid */}
        <ExplainAnchor
          selector="stage"
          index={1}
          pin={{
            x: cx + stageForStageAnchor.wTop / 2 + 18,
            y: stageForStageAnchor.labelY,
          }}
          rect={{
            x: cx - stageForStageAnchor.wTop / 2,
            y: stageForStageAnchor.yTop,
            width: stageForStageAnchor.wTop,
            height: stageH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: stage-label — "Add to cart" name/count pair */}
        <ExplainAnchor
          selector="stage-label"
          index={2}
          pin={{ x: -96, y: stageForLabelAnchor.labelY }}
          rect={{
            x: -margin.left + 4,
            y: stageForLabelAnchor.labelY - 14,
            width: margin.left - 16,
            height: 28,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: drop-off — the Product-view → Cart trapezoid */}
        <ExplainAnchor
          selector="drop-off"
          index={3}
          pin={{
            x: cx + stageForDropAnchor.wTop / 2 + 18,
            y: stageForDropAnchor.yTop + 6,
          }}
          rect={{
            x: cx - stageForDropAnchor.wTop / 2,
            y: stageForDropAnchor.yTop,
            width: stageForDropAnchor.wTop,
            height: stageH,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: conversion-rate — the right-side drop-off text column */}
        <ExplainAnchor
          selector="conversion-rate"
          index={4}
          pin={{ x: iw + 40, y: stageForRateAnchor.yTop + 2 }}
          rect={{
            x: iw + 4,
            y: 0,
            width: margin.right - 8,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: top-width — the full entry width at the top */}
        <ExplainAnchor
          selector="top-width"
          index={5}
          pin={{ x: cx, y: -12 }}
          rect={{ x: 0, y: -8, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: bottom-width — the final Purchase trapezoid */}
        <ExplainAnchor
          selector="bottom-width"
          index={6}
          pin={{
            x: cx - stageForBottomAnchor.wTop / 2 - 18,
            y: stageForBottomAnchor.labelY,
          }}
          rect={{
            x: cx - stageForBottomAnchor.wTop / 2,
            y: stageForBottomAnchor.yTop,
            width: stageForBottomAnchor.wTop,
            height: stageH,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
