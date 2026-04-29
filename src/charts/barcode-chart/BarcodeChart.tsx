"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear, scaleTime } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// 80 earthquake timestamps spread over Jan 2020 → Dec 2024, with a
// deliberate mid-2022 swarm (a 2-week aftershock cluster) and a roughly
// 8-month quiet gap in late 2023. Magnitudes span 2.0 – 5.0.
function generateCatalog() {
  let seed = 2024;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const start = new Date("2020-01-01").getTime();
  const end = new Date("2024-12-31").getTime();
  const span = end - start;

  const events: Array<{ t: number; mag: number }> = [];

  // 56 uniformly-scattered events at magnitudes 2.0 – 4.2
  for (let i = 0; i < 56; i++) {
    const u = rand();
    // stretch so there's a visible gap around 0.68–0.82 (late 2023)
    const jitter = u < 0.68 ? u * 0.68 : 0.82 + (u - 0.82) * (1 / 0.18) * 0.18;
    const t = start + jitter * span;
    const mag = 2.0 + rand() * 2.2;
    events.push({ t, mag });
  }

  // 24 event aftershock swarm in mid-2022 over ~14 days
  const swarmStart = new Date("2022-07-05").getTime();
  const swarmSpan = 14 * 24 * 60 * 60 * 1000;
  for (let i = 0; i < 24; i++) {
    const t = swarmStart + rand() * swarmSpan;
    // swarm has one mainshock (~4.7) and small aftershocks
    const mag = i === 0 ? 4.7 : 2.2 + rand() * 1.6;
    events.push({ t, mag });
  }

  events.sort((a, b) => a.t - b.t);
  return events;
}

interface Props {
  width: number;
  height: number;
}

export function BarcodeChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const events = useMemo(generateCatalog, []);

  const xScale = scaleTime({
    domain: [new Date("2020-01-01"), new Date("2024-12-31")],
    range: [0, iw],
  });

  // Tick length encodes magnitude bucket. Ticks are centred on the baseline.
  const baseline = ih * 0.62;
  const magLen = scaleLinear({
    domain: [2, 5],
    range: [10, 34],
    clamp: true,
  });

  // Anchor geometry
  const swarmStart = new Date("2022-07-05").getTime();
  const swarmEnd = new Date("2022-07-20").getTime();
  const swarmX0 = xScale(new Date(swarmStart));
  const swarmX1 = xScale(new Date(swarmEnd));

  // A quiet gap anchor — late-2023 stretch with few events
  const gapX0 = xScale(new Date("2023-07-01"));
  const gapX1 = xScale(new Date("2024-02-01"));

  // Representative single tick — the largest event (the swarm mainshock)
  const mainshock = events.reduce((a, b) => (b.mag > a.mag ? b : a), events[0]);
  const mainX = xScale(new Date(mainshock.t));
  const mainLen = magLen(mainshock.mag);

  // Representative small-magnitude tick for the length-encoding anchor
  const smallCandidate =
    events.find((e) => e.mag < 2.5 && Math.abs(xScale(new Date(e.t)) - iw * 0.2) < iw * 0.1) ??
    events.find((e) => e.mag < 2.5) ??
    events[0];
  const smallX = xScale(new Date(smallCandidate.t));

  return (
    <svg width={width} height={height} role="img" aria-label="Barcode chart">
      <Group left={margin.left} top={margin.top}>
        {/* Baseline — the 1D number line the ticks hang off */}
        <g data-data-layer="true">
          <line
            x1={0}
            x2={iw}
            y1={baseline}
            y2={baseline}
            stroke="var(--color-hairline)"
          />
        </g>

        {/* Ticks — one per event, length encodes magnitude */}
        <g data-data-layer="true">
          {events.map((e, i) => {
            const x = xScale(new Date(e.t));
            const len = magLen(e.mag);
            return (
              <line
                key={i}
                x1={x}
                x2={x}
                y1={baseline - len / 2}
                y2={baseline + len / 2}
                stroke="var(--color-ink)"
                strokeOpacity={0.78}
                strokeWidth={1}
              />
            );
          })}
        </g>

        {/* Anchor 1 — a single tick (one observation, one event) */}
        <ExplainAnchor
          selector="tick"
          index={1}
          pin={{ x: smallX + 14, y: baseline - 18 }}
          rect={{
            x: Math.max(0, smallX - 4),
            y: Math.max(0, baseline - magLen(5) / 2 - 2),
            width: 8,
            height: magLen(5) + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2 — the mid-2022 swarm cluster */}
        <ExplainAnchor
          selector="cluster"
          index={2}
          pin={{
            x: Math.max(0, Math.min(iw, (swarmX0 + swarmX1) / 2)),
            y: baseline - magLen(5) / 2 - 10,
          }}
          rect={{
            x: Math.max(0, swarmX0 - 4),
            y: Math.max(0, baseline - magLen(5) / 2 - 2),
            width: Math.min(iw, swarmX1 - swarmX0 + 8),
            height: magLen(5) + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3 — the quiet gap (late 2023) */}
        <ExplainAnchor
          selector="gap"
          index={3}
          pin={{
            x: Math.max(0, Math.min(iw, (gapX0 + gapX1) / 2)),
            y: baseline + magLen(5) / 2 + 12,
          }}
          rect={{
            x: Math.max(0, gapX0),
            y: Math.max(0, baseline - magLen(5) / 2 - 2),
            width: Math.min(iw, gapX1 - gapX0),
            height: magLen(5) + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4 — a long tick (magnitude = length) */}
        <ExplainAnchor
          selector="tick-length"
          index={4}
          pin={{
            x: Math.max(0, Math.min(iw, mainX + 14)),
            y: baseline - mainLen / 2 - 6,
          }}
          rect={{
            x: Math.max(0, mainX - 5),
            y: Math.max(0, baseline - mainLen / 2 - 2),
            width: 10,
            height: mainLen + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5 — X-axis (time) */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={5}
            tickFormat={(v) => String((v as Date).getFullYear())}
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
            YEAR
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
