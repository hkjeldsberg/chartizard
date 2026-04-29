"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Event {
  year: number;
  label: string;
  /** Vertical placement: +1 above the spine, -1 below. */
  side: 1 | -1;
  /** Stagger row within a side (1..n): 1 is closest to the spine. */
  row: number;
}

// History of web browsers, 1990-2024. ~12 events, curated for visual
// separability. Stagger is hand-placed so closely-spaced years (1993/94/95/96,
// 2003/04, 2013/15/16) don't collide.
const EVENTS: ReadonlyArray<Event> = [
  { year: 1990, label: "WorldWideWeb", side: 1, row: 1 },
  { year: 1993, label: "NCSA Mosaic", side: -1, row: 1 },
  { year: 1994, label: "Netscape Navigator", side: 1, row: 2 },
  { year: 1995, label: "Internet Explorer 1.0", side: -1, row: 2 },
  { year: 1996, label: "Opera", side: 1, row: 1 },
  { year: 2003, label: "Safari", side: -1, row: 1 },
  { year: 2004, label: "Firefox", side: 1, row: 2 },
  { year: 2008, label: "Chrome", side: -1, row: 2 },
  { year: 2013, label: "Chrome mobile dominance", side: 1, row: 1 },
  { year: 2015, label: "Edge", side: -1, row: 1 },
  { year: 2016, label: "Brave", side: 1, row: 2 },
  { year: 2023, label: "Arc", side: -1, row: 2 },
];

interface EraBand {
  id: string;
  label: string;
  start: number;
  end: number;
}

const ERAS: ReadonlyArray<EraBand> = [
  { id: "browser-wars", label: "Browser Wars 1995-2001", start: 1995, end: 2001 },
  { id: "mozilla-era", label: "Mozilla era 2002-2008", start: 2002, end: 2008 },
  { id: "chrome-era", label: "Chrome era 2008-2024", start: 2008, end: 2024 },
];

interface Props {
  width: number;
  height: number;
}

export function TimelineChart({ width, height }: Props) {
  const margin = { top: 24, right: 32, bottom: 44, left: 32 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [1989, 2025], range: [0, iw] });

  // Spine sits at the vertical centre. Labels stagger above (side = +1)
  // and below (side = -1), two rows per side.
  const spineY = ih / 2;
  const markerR = 3.5;
  // Vertical offsets for the stagger rows, measured from the spine.
  const rowOffsets = [0, 18, 36]; // row 0 unused; row 1 -> 18px, row 2 -> 36px.
  const labelDy = 4; // small extra padding between tick and label text.

  const xFor = (year: number) => xScale(year);

  // Anchor targets.
  const sampleEvent = EVENTS[7]; // Chrome (2008) — well-separated single marker.
  const clusterStartYear = 1993;
  const clusterEndYear = 1996;
  const clusterXStart = xFor(clusterStartYear);
  const clusterXEnd = xFor(clusterEndYear);
  const browserWars = ERAS[0];
  const staggerExample = EVENTS[2]; // Netscape 1994 — row 2, above spine.
  const staggerX = xFor(staggerExample.year);
  const staggerY = spineY - rowOffsets[staggerExample.row];

  return (
    <svg width={width} height={height} role="img" aria-label="Timeline chart">
      <Group left={margin.left} top={margin.top}>
        {/* Era bands — soft background tinting behind the spine */}
        <g data-data-layer="true">
          {ERAS.map((era) => {
            const x1 = xFor(era.start);
            const x2 = xFor(era.end);
            return (
              <g key={era.id}>
                <rect
                  x={x1}
                  y={0}
                  width={Math.max(0, x2 - x1)}
                  height={ih}
                  fill="var(--color-ink)"
                  opacity={0.04}
                />
                <text
                  x={(x1 + x2) / 2}
                  y={12}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                  opacity={0.8}
                >
                  {era.label.toUpperCase()}
                </text>
              </g>
            );
          })}
        </g>

        {/* Era-band anchor — the first band (Browser Wars) is the exemplar. */}
        <ExplainAnchor
          selector="era-band"
          index={3}
          pin={{ x: xFor((browserWars.start + browserWars.end) / 2), y: 4 }}
          rect={{
            x: Math.max(0, xFor(browserWars.start)),
            y: 0,
            width: Math.max(0, xFor(browserWars.end) - xFor(browserWars.start)),
            height: Math.min(ih, 24),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Spine — the horizontal time axis */}
        <ExplainAnchor
          selector="spine"
          index={6}
          pin={{ x: iw / 2, y: spineY - 14 }}
          rect={{ x: 0, y: spineY - 4, width: iw, height: 8 }}
        >
          <line
            x1={0}
            x2={iw}
            y1={spineY}
            y2={spineY}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* Event ticks, markers, and staggered labels */}
        <g data-data-layer="true">
          {EVENTS.map((e) => {
            const x = xFor(e.year);
            const rowOff = rowOffsets[e.row];
            const y = spineY - e.side * rowOff;
            const tickY = spineY - e.side * 6;
            const labelY =
              e.side === 1 ? y - labelDy : y + labelDy;
            const labelDominant = e.side === 1 ? "alphabetic" : "hanging";
            return (
              <g key={`${e.year}-${e.label}`}>
                {/* Connector from spine to label row */}
                <line
                  x1={x}
                  x2={x}
                  y1={tickY}
                  y2={y}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.75}
                  strokeDasharray="1 2"
                />
                {/* Marker circle on the spine */}
                <circle
                  cx={x}
                  cy={spineY}
                  r={markerR}
                  fill="var(--color-ink)"
                />
                {/* Label */}
                <text
                  x={x}
                  y={labelY}
                  textAnchor="middle"
                  dominantBaseline={labelDominant}
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fill="var(--color-ink)"
                >
                  {e.label}
                </text>
                {/* Year underneath label, smaller */}
                <text
                  x={x}
                  y={e.side === 1 ? labelY - 11 : labelY + 11}
                  textAnchor="middle"
                  dominantBaseline={labelDominant}
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {e.year}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchor 1: a single event marker (Chrome, 2008) */}
        <ExplainAnchor
          selector="event-marker"
          index={1}
          pin={{ x: xFor(sampleEvent.year), y: spineY + 14 }}
          rect={{
            x: Math.max(0, xFor(sampleEvent.year) - 8),
            y: spineY - 8,
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: a cluster (1993-1996, four browsers in four years) */}
        <ExplainAnchor
          selector="event-cluster"
          index={2}
          pin={{ x: (clusterXStart + clusterXEnd) / 2, y: spineY - 50 }}
          rect={{
            x: Math.max(0, clusterXStart - 10),
            y: Math.max(0, spineY - rowOffsets[2] - 14),
            width: Math.min(iw, clusterXEnd - clusterXStart + 20),
            height: Math.min(ih, rowOffsets[2] * 2 + 28),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: the year axis */}
        <ExplainAnchor
          selector="year-axis"
          index={4}
          pin={{ x: iw / 2, y: ih + 30 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => String(v)}
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
        </ExplainAnchor>

        {/* Anchor 5: a staggered label position (Netscape 1994, row 2 above) */}
        <ExplainAnchor
          selector="staggered-label"
          index={5}
          pin={{ x: staggerX + 18, y: staggerY - 16 }}
          rect={{
            x: Math.max(0, staggerX - 44),
            y: Math.max(0, staggerY - 16),
            width: 88,
            height: 22,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
