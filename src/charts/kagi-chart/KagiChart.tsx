"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ─── Kagi construction types ────────────────────────────────────────────────

interface KagiSegment {
  // price at start of this segment
  startPrice: number;
  // price at end of this segment
  endPrice: number;
  // event-index at start (on x-axis)
  startIdx: number;
  // event-index at end (on x-axis)
  endIdx: number;
  // yang = thick (price broke previous peak), yin = thin
  lineType: "yang" | "yin";
}

// ─── Seeded LCG price generator ─────────────────────────────────────────────

function generatePrices(): number[] {
  let seed = 42;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const prices: number[] = [];
  let price = 100;
  // 60 price points: upward drift for first 35, then reversal
  for (let i = 0; i < 60; i++) {
    const drift = i < 35 ? 0.3 : -0.45;
    const move = (rand() - 0.48) * 3 + drift;
    price = Math.max(80, price + move);
    prices.push(Math.round(price * 100) / 100);
  }
  return prices;
}

// ─── Kagi algorithm ──────────────────────────────────────────────────────────
// reversalPct: e.g. 0.03 means 3% reversal required to change direction

function buildKagi(prices: number[], reversalPct: number): KagiSegment[] {
  if (prices.length < 2) return [];

  const segments: KagiSegment[] = [];
  let direction: "up" | "down" = prices[1] >= prices[0] ? "up" : "down";
  let segStart = prices[0];
  let segStartIdx = 0;
  let currentExtreme = prices[0];

  // Track prior peak and trough for yang/yin transitions
  let prevPeak = prices[0];
  let prevTrough = prices[0];
  // Current line type starts yin until first yang threshold is crossed
  let currentType: "yang" | "yin" = "yin";

  for (let i = 1; i < prices.length; i++) {
    const p = prices[i];

    if (direction === "up") {
      if (p >= currentExtreme) {
        currentExtreme = p;
      } else {
        // Check reversal threshold
        const reversalAmount = currentExtreme * reversalPct;
        if (currentExtreme - p >= reversalAmount) {
          // Finalize the up segment
          // Determine type: yang if this up segment broke previous peak
          const type: "yang" | "yin" = currentExtreme > prevPeak ? "yang" : currentType;
          segments.push({
            startPrice: segStart,
            endPrice: currentExtreme,
            startIdx: segStartIdx,
            endIdx: i - 1,
            lineType: type,
          });
          // Update prevPeak if yang
          if (type === "yang") prevPeak = currentExtreme;
          currentType = type;

          // Start new down segment
          direction = "down";
          segStart = currentExtreme;
          segStartIdx = i - 1;
          currentExtreme = p;
        }
      }
    } else {
      // direction === "down"
      if (p <= currentExtreme) {
        currentExtreme = p;
      } else {
        const reversalAmount = Math.abs(currentExtreme) * reversalPct;
        if (p - currentExtreme >= reversalAmount) {
          // Finalize the down segment
          // yin if broke trough
          const type: "yang" | "yin" = currentExtreme < prevTrough ? "yin" : currentType;
          segments.push({
            startPrice: segStart,
            endPrice: currentExtreme,
            startIdx: segStartIdx,
            endIdx: i - 1,
            lineType: type,
          });
          if (type === "yin") prevTrough = currentExtreme;
          currentType = type;

          // Start new up segment
          direction = "up";
          segStart = currentExtreme;
          segStartIdx = i - 1;
          currentExtreme = p;
        }
      }
    }
  }

  // Close the final open segment
  if (segments.length === 0 || segStartIdx !== segments[segments.length - 1].endIdx) {
    const type = direction === "up"
      ? (currentExtreme > prevPeak ? "yang" : currentType)
      : (currentExtreme < prevTrough ? "yin" : currentType);
    segments.push({
      startPrice: segStart,
      endPrice: currentExtreme,
      startIdx: segStartIdx,
      endIdx: prices.length - 1,
      lineType: type,
    });
  }

  return segments;
}

interface Props {
  width: number;
  height: number;
}

export function KagiChart({ width, height }: Props) {
  const margin = { top: 20, right: 30, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const REVERSAL_PCT = 0.03;

  const { segments, prices } = useMemo(() => {
    const p = generatePrices();
    const s = buildKagi(p, REVERSAL_PCT);
    return { segments: s, prices: p };
  }, []);

  const totalSegments = segments.length;

  // x-axis: event-indexed (segment index), not time-indexed
  const xScale = scaleLinear({
    domain: [0, Math.max(totalSegments - 1, 1)],
    range: [0, iw],
  });

  const allPrices = prices;
  const yMin = Math.min(...allPrices) - 2;
  const yMax = Math.max(...allPrices) + 2;

  const yScale = scaleLinear({
    domain: [yMin, yMax],
    range: [ih, 0],
    nice: true,
  });

  const ticksY = yScale.ticks(5);

  // Build SVG path for Kagi line: vertical segments + horizontal connectors
  // Each segment is at x = segmentIndex, spanning from startPrice to endPrice
  // Horizontal connector links end of segment[i] to start of segment[i+1] (same price level)
  const pathParts: string[] = [];

  if (segments.length > 0) {
    const s0 = segments[0];
    pathParts.push(`M ${xScale(0)} ${yScale(s0.startPrice)}`);
    pathParts.push(`L ${xScale(0)} ${yScale(s0.endPrice)}`);

    for (let i = 1; i < segments.length; i++) {
      const seg = segments[i];
      const x = xScale(i);
      // Horizontal connector: from previous endPrice level to this x
      pathParts.push(`L ${x} ${yScale(segments[i - 1].endPrice)}`);
      // Vertical segment
      pathParts.push(`L ${x} ${yScale(seg.endPrice)}`);
    }
  }

  // Build separate thick (yang) and thin (yin) path data for strokeWidth variation
  // We render each segment + its preceding connector as a grouped path
  const yangPaths: string[] = [];
  const yinPaths: string[] = [];

  if (segments.length > 0) {
    for (let i = 0; i < segments.length; i++) {
      const seg = segments[i];
      const x = xScale(i);
      let d = "";

      if (i === 0) {
        // First segment has no preceding connector
        d = `M ${x} ${yScale(seg.startPrice)} L ${x} ${yScale(seg.endPrice)}`;
      } else {
        // Include horizontal connector from prev segment end to this x
        const prevEnd = yScale(segments[i - 1].endPrice);
        d = `M ${xScale(i - 1)} ${prevEnd} L ${x} ${prevEnd} L ${x} ${yScale(seg.endPrice)}`;
      }

      if (seg.lineType === "yang") {
        yangPaths.push(d);
      } else {
        yinPaths.push(d);
      }
    }
  }

  // ─── Anchor reference segments ──────────────────────────────────────────
  // Find a yang (thick) segment and a yin (thin) segment for anchors
  const yangIdx = segments.findIndex((s) => s.lineType === "yang");
  const yinIdx = segments.findIndex((s) => s.lineType === "yin");
  // Transition: find first index where yin→yang transition occurs
  const transitionIdx = segments.findIndex(
    (s, i) => i > 0 && s.lineType === "yang" && segments[i - 1].lineType === "yin"
  );

  // Fallbacks to avoid -1 anchors
  const safeYangIdx = yangIdx >= 0 ? yangIdx : 0;
  const safeYinIdx = yinIdx >= 0 ? yinIdx : 0;
  const safeTransIdx = transitionIdx >= 0 ? transitionIdx : safeYangIdx;

  // Find a reversal point (any connector between two segments)
  const connectorIdx = segments.length > 2 ? Math.floor(segments.length * 0.4) : 1;

  const yangSeg = segments[safeYangIdx];
  const yinSeg = segments[safeYinIdx];
  const connSeg = segments[connectorIdx] ?? segments[segments.length - 1];
  const transSeg = segments[safeTransIdx];

  // Y midpoints for anchor pins
  const midY = (seg: KagiSegment) =>
    (yScale(seg.startPrice) + yScale(seg.endPrice)) / 2;

  const reversalAnnotationY = ih - 10;
  const reversalAnnotationX = iw * 0.65;

  return (
    <svg width={width} height={height} role="img" aria-label="Kagi chart">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines */}
        <g data-data-layer="true">
          {ticksY.map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        {/* Yin (thin) segments */}
        <ExplainAnchor
          selector="yin-segment"
          index={2}
          pin={{
            x: xScale(safeYinIdx) + 12,
            y: midY(yinSeg),
          }}
          rect={{
            x: Math.max(0, xScale(safeYinIdx) - 6),
            y: Math.min(yScale(yinSeg.startPrice), yScale(yinSeg.endPrice)) - 4,
            width: Math.max(12, Math.abs(xScale(safeYinIdx + 1) - xScale(safeYinIdx))),
            height:
              Math.abs(yScale(yinSeg.startPrice) - yScale(yinSeg.endPrice)) + 8,
          }}
        >
          <g data-data-layer="true">
            {yinPaths.map((d, i) => (
              <path
                key={`yin-${i}`}
                d={d}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={1.2}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Yang (thick) segments */}
        <ExplainAnchor
          selector="yang-segment"
          index={1}
          pin={{
            x: xScale(safeYangIdx) + 12,
            y: midY(yangSeg),
          }}
          rect={{
            x: Math.max(0, xScale(safeYangIdx) - 6),
            y: Math.min(yScale(yangSeg.startPrice), yScale(yangSeg.endPrice)) - 4,
            width: Math.max(12, Math.abs(xScale(safeYangIdx + 1) - xScale(safeYangIdx))),
            height:
              Math.abs(yScale(yangSeg.startPrice) - yScale(yangSeg.endPrice)) + 8,
          }}
        >
          <g data-data-layer="true">
            {yangPaths.map((d, i) => (
              <path
                key={`yang-${i}`}
                d={d}
                fill="none"
                stroke="var(--color-ink)"
                strokeWidth={2.8}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Reversal connector (horizontal right-angle turn) */}
        <ExplainAnchor
          selector="reversal-connector"
          index={3}
          pin={{
            x: Math.max(8, xScale(connectorIdx) - 14),
            y: yScale(connSeg.startPrice) - 12,
          }}
          rect={{
            x: Math.max(0, xScale(connectorIdx) - 10),
            y: Math.min(yScale(connSeg.startPrice), yScale(segments[connectorIdx - 1]?.endPrice ?? connSeg.startPrice)) - 4,
            width: 20,
            height: Math.max(
              8,
              Math.abs(
                yScale(connSeg.startPrice) -
                  yScale(segments[connectorIdx - 1]?.endPrice ?? connSeg.startPrice)
              ) + 8
            ),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Thin-to-thick transition (yin→yang, new peak broken) */}
        <ExplainAnchor
          selector="yin-yang-transition"
          index={4}
          pin={{
            x: xScale(safeTransIdx) + 14,
            y: yScale(transSeg.startPrice) - 14,
          }}
          rect={{
            x: Math.max(0, xScale(safeTransIdx) - 8),
            y: Math.min(yScale(transSeg.startPrice), yScale(transSeg.endPrice)) - 4,
            width: 20,
            height:
              Math.abs(yScale(transSeg.startPrice) - yScale(transSeg.endPrice)) + 8,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Reversal threshold annotation */}
        <ExplainAnchor
          selector="reversal-threshold"
          index={5}
          pin={{ x: reversalAnnotationX - 4, y: reversalAnnotationY - 12 }}
          rect={{
            x: Math.max(0, reversalAnnotationX - 50),
            y: reversalAnnotationY - 8,
            width: Math.min(110, iw - Math.max(0, reversalAnnotationX - 50)),
            height: 16,
          }}
        >
          <text
            x={reversalAnnotationX}
            y={reversalAnnotationY}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
            textAnchor="middle"
          >
            3% REVERSAL
          </text>
        </ExplainAnchor>

        {/* No-time-axis label + anchor */}
        <ExplainAnchor
          selector="event-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g>
            {/* Draw a minimal x-axis line with label */}
            <line
              x1={0}
              x2={iw}
              y1={ih}
              y2={ih}
              stroke="var(--color-ink-mute)"
              strokeWidth={1}
            />
            <text
              x={iw / 2}
              y={ih + 14}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fill="var(--color-ink-mute)"
            >
              EVENTS (NOT TIME)
            </text>
            {/* Tick marks at each segment */}
            {segments.map((_, i) => (
              <line
                key={i}
                x1={xScale(i)}
                x2={xScale(i)}
                y1={ih}
                y2={ih + 4}
                stroke="var(--color-ink-mute)"
                strokeWidth={0.5}
              />
            ))}
          </g>
        </ExplainAnchor>

        {/* Y-axis */}
        <AxisLeft
          scale={yScale}
          numTicks={5}
          tickFormat={(v) => `$${v}`}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fill: "var(--color-ink-soft)",
            textAnchor: "end",
            dx: "-0.33em",
            dy: "0.33em",
          })}
        />

        {/* Legend */}
        <g transform={`translate(0, -14)`} data-data-layer="true">
          <line x1={0} x2={20} y1={5} y2={5} stroke="var(--color-ink)" strokeWidth={2.8} />
          <text x={26} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            YANG (THICK)
          </text>
          <line x1={110} x2={130} y1={5} y2={5} stroke="var(--color-ink)" strokeWidth={1.2} />
          <text x={136} y={9} fontFamily="var(--font-mono)" fontSize={10} fill="var(--color-ink-soft)">
            YIN (THIN)
          </text>
        </g>
      </Group>
    </svg>
  );
}
