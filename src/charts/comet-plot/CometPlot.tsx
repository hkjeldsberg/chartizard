"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// Comet plot — the last 30 observations of a 2D state trajectory. The head
// (newest sample) is opaque and large; the preceding samples form a tapering
// tail whose stroke-width and opacity decrease linearly with age. The comet
// conveys DIRECTION and RECENCY in a single static frame — where the state is
// going now, not where it has been.
//
// Data: monthly US unemployment-rate (BLS) vs CPI year-over-year inflation
// (FRED), 30 most recent months as a Phillips-curve state space. Synthetic but
// shaped after the 2022–2024 US trajectory: inflation spike to ~9%, then a
// multi-quarter descent while unemployment drifts up a touch.
// -----------------------------------------------------------------------------

interface Obs {
  label: string; // e.g. "Jan-23"
  unemp: number; // %
  infl: number;  // %
}

// 30 months of (unemployment %, inflation %) — most recent at the end.
// Rough shape: May-22 starts at (3.6, 8.6), arcs right-and-down through the
// inflation peak, then descends through 2023 as inflation falls faster than
// unemployment rises, finishing near (3.9, 3.1) at the head.
const DATA: ReadonlyArray<Obs> = [
  { label: "May-22", unemp: 3.6, infl: 8.6 },
  { label: "Jun-22", unemp: 3.6, infl: 9.0 },
  { label: "Jul-22", unemp: 3.5, infl: 8.5 },
  { label: "Aug-22", unemp: 3.7, infl: 8.3 },
  { label: "Sep-22", unemp: 3.5, infl: 8.2 },
  { label: "Oct-22", unemp: 3.7, infl: 7.7 },
  { label: "Nov-22", unemp: 3.6, infl: 7.1 },
  { label: "Dec-22", unemp: 3.5, infl: 6.5 },
  { label: "Jan-23", unemp: 3.4, infl: 6.4 },
  { label: "Feb-23", unemp: 3.6, infl: 6.0 },
  { label: "Mar-23", unemp: 3.5, infl: 5.0 },
  { label: "Apr-23", unemp: 3.4, infl: 4.9 },
  { label: "May-23", unemp: 3.7, infl: 4.0 },
  { label: "Jun-23", unemp: 3.6, infl: 3.0 },
  { label: "Jul-23", unemp: 3.5, infl: 3.2 },
  { label: "Aug-23", unemp: 3.8, infl: 3.7 },
  { label: "Sep-23", unemp: 3.8, infl: 3.7 },
  { label: "Oct-23", unemp: 3.9, infl: 3.2 },
  { label: "Nov-23", unemp: 3.7, infl: 3.1 },
  { label: "Dec-23", unemp: 3.7, infl: 3.4 },
  { label: "Jan-24", unemp: 3.7, infl: 3.1 },
  { label: "Feb-24", unemp: 3.9, infl: 3.2 },
  { label: "Mar-24", unemp: 3.8, infl: 3.5 },
  { label: "Apr-24", unemp: 3.9, infl: 3.4 },
  { label: "May-24", unemp: 4.0, infl: 3.3 },
  { label: "Jun-24", unemp: 4.1, infl: 3.0 },
  { label: "Jul-24", unemp: 4.3, infl: 2.9 },
  { label: "Aug-24", unemp: 4.2, infl: 2.5 },
  { label: "Sep-24", unemp: 4.1, infl: 2.4 },
  { label: "Oct-24", unemp: 4.1, infl: 2.6 },
];

interface Props {
  width: number;
  height: number;
}

export function CometPlot({ width, height }: Props) {
  const margin = { top: 24, right: 80, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [3.2, 4.6], range: [0, iw], nice: true });
  const yScale = scaleLinear({ domain: [2, 10], range: [ih, 0], nice: true });

  const n = DATA.length;
  const head = DATA[n - 1];
  const tail = DATA[0];

  // Precompute segment endpoints and per-segment taper.
  // Segment i connects DATA[i] -> DATA[i+1]. Age of a segment is (n - 1 - i):
  // age 0 = newest segment (just before the head), age n-2 = oldest.
  const segments = useMemo(() => {
    const out: Array<{
      x1: number; y1: number; x2: number; y2: number;
      age: number; width: number; opacity: number;
    }> = [];
    for (let i = 0; i < n - 1; i++) {
      const a = DATA[i];
      const b = DATA[i + 1];
      const age = n - 2 - i;            // 0 = newest
      const t = age / Math.max(1, n - 2); // 0 (newest) .. 1 (oldest)
      // Linear taper: newest is fat + opaque, oldest is thin + transparent.
      const strokeW = 0.5 + (1 - t) * 2.6;   // 3.1 -> 0.5 px
      const opacity = 0.12 + (1 - t) * 0.85; // 0.97 -> 0.12
      out.push({
        x1: xScale(a.unemp),
        y1: yScale(a.infl),
        x2: xScale(b.unemp),
        y2: yScale(b.infl),
        age,
        width: strokeW,
        opacity,
      });
    }
    return out;
  }, [iw, ih]);

  // Fixed-dot head + small fading tail dots for observation markers.
  const headX = xScale(head.unemp);
  const headY = yScale(head.infl);
  const tailX = xScale(tail.unemp);
  const tailY = yScale(tail.infl);

  // A mid-trajectory anchor on the direction-of-motion (inflation-peak elbow).
  const elbowIdx = 7; // around Dec-22, the pivot from rising to falling
  const elbow = DATA[elbowIdx];
  const elbowX = xScale(elbow.unemp);
  const elbowY = yScale(elbow.infl);

  return (
    <svg width={width} height={height} role="img" aria-label="Comet plot">
      <Group left={margin.left} top={margin.top}>
        {/* Gridlines behind everything */}
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={`gy-${t}`}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
          {xScale.ticks(5).map((t) => (
            <line
              key={`gx-${t}`}
              x1={xScale(t)}
              x2={xScale(t)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}

          {/* Tail — fading segments from oldest to newest */}
          {segments.map((s, i) => (
            <line
              key={`seg-${i}`}
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="var(--color-ink)"
              strokeWidth={s.width}
              strokeOpacity={s.opacity}
              strokeLinecap="round"
            />
          ))}

          {/* Small dots along the tail (decreasing size with age) */}
          {DATA.map((d, i) => {
            const age = n - 1 - i; // head = 0, oldest = n-1
            const t = age / Math.max(1, n - 1);
            const r = 0.6 + (1 - t) * 1.6;
            const op = 0.15 + (1 - t) * 0.65;
            if (i === n - 1) return null; // head rendered separately
            return (
              <circle
                key={d.label}
                cx={xScale(d.unemp)}
                cy={yScale(d.infl)}
                r={r}
                fill="var(--color-ink)"
                fillOpacity={op}
              />
            );
          })}

          {/* Head — big opaque circle at the current state */}
          <circle
            cx={headX}
            cy={headY}
            r={5}
            fill="var(--color-ink)"
          />
          <circle
            cx={headX}
            cy={headY}
            r={8}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text
            x={headX + 12}
            y={headY - 4}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={500}
            fill="var(--color-ink)"
          >
            {head.label}
          </text>
          <text
            x={headX + 12}
            y={headY + 8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            NOW
          </text>

          {/* Tail-end label — oldest observation */}
          <text
            x={tailX + 8}
            y={tailY - 6}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            {tail.label}
          </text>
        </g>

        {/* Axes */}
        <AxisBottom
          top={ih}
          scale={xScale}
          numTicks={5}
          tickFormat={(v) => `${v}%`}
          stroke="var(--color-ink-mute)"
          tickStroke="var(--color-ink-mute)"
          tickLabelProps={() => ({
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            fill: "var(--color-ink-soft)",
            textAnchor: "middle",
            dy: "0.33em",
          })}
        />
        <text
          x={iw / 2}
          y={ih + 36}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          UNEMPLOYMENT RATE
        </text>

        <AxisLeft
          scale={yScale}
          numTicks={5}
          tickFormat={(v) => `${v}%`}
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
        <text
          x={-44}
          y={-8}
          fontFamily="var(--font-mono)"
          fontSize={10}
          fill="var(--color-ink-mute)"
        >
          CPI YoY
        </text>

        {/* Anchor 1 — the head (current observation) */}
        <ExplainAnchor
          selector="head"
          index={1}
          pin={{ x: headX - 16, y: headY - 18 }}
          rect={{
            x: headX - 12,
            y: headY - 12,
            width: 24,
            height: 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — the tapering tail (direction + recency encoding) */}
        <ExplainAnchor
          selector="tail"
          index={2}
          pin={{ x: elbowX + 16, y: elbowY - 18 }}
          rect={{
            x: Math.max(0, Math.min(tailX, elbowX) - 12),
            y: Math.max(0, Math.min(tailY, elbowY) - 12),
            width: Math.abs(elbowX - tailX) + 24,
            height: Math.abs(elbowY - tailY) + 24,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the tail end (oldest, where the comet started) */}
        <ExplainAnchor
          selector="tail-origin"
          index={3}
          pin={{ x: tailX - 18, y: tailY + 4 }}
          rect={{
            x: tailX - 10,
            y: tailY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — x-axis (horizontal state variable) */}
        <ExplainAnchor
          selector="x-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — y-axis (vertical state variable) */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6 — trajectory pivot (inflation peak / turning point) */}
        <ExplainAnchor
          selector="pivot"
          index={6}
          pin={{ x: elbowX + 18, y: elbowY + 4 }}
          rect={{
            x: elbowX - 10,
            y: elbowY - 10,
            width: 20,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
