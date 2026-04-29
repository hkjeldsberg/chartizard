"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { area as d3Area } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Four workflow states, stacked bottom -> top so the chart reads the way
// a Kanban board does: completed work accumulates at the bottom, new work
// piles on at the top. Order matters editorially — changing it changes
// which band is "the bottleneck visual" vs "the backlog visual".
const KEYS = ["done", "inReview", "inProgress", "toDo"] as const;
type Key = (typeof KEYS)[number];

const KEY_LABELS: Record<Key, string> = {
  done: "Done",
  inReview: "In Review",
  inProgress: "In Progress",
  toDo: "To-Do",
};

// Ink-ramp palette — darkest at the bottom (Done, the "banked" work),
// lightest at the top (To-Do, the backlog). No colour-only encoding:
// every band is labelled in the legend.
const KEY_FILL: Record<Key, string> = {
  done: "var(--color-ink)",
  inReview: "var(--color-ink)",
  inProgress: "var(--color-ink)",
  toDo: "var(--color-ink)",
};
const KEY_OPACITY: Record<Key, number> = {
  done: 0.78,
  inReview: 0.55,
  inProgress: 0.34,
  toDo: 0.18,
};

interface Row {
  day: number;
  done: number;
  inReview: number;
  inProgress: number;
  toDo: number;
}

// Build a deterministic 60-day project trace using a seeded LCG.
// Shape goals:
//   - Total scope grows from ~15 items up to ~60-ish as the backlog expands.
//   - Done grows continuously from zero.
//   - In Review stays a thin band.
//   - In Progress balloons around day ~30 (WIP spike / bottleneck) and recovers.
//   - To-Do is the backlog on top — rises early, flattens late.
function generateTrace(): Row[] {
  let seed = 17;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  const DAYS = 60;
  const rows: Row[] = [];
  let done = 0;
  let inReview = 1;
  let inProgress = 3;
  let toDo = 10;
  let scope = 15;

  for (let d = 0; d < DAYS; d++) {
    // Backlog growth: scope discovery is front-loaded, nearly flat by day 45.
    const scopeGrowth =
      d < 45 ? (0.9 + rand() * 0.7) * (1 - d / 60) : rand() * 0.3;
    scope += scopeGrowth;

    // Items pulled from To-Do -> In Progress. Slightly lumpy.
    const started = Math.max(0, 0.7 + rand() * 1.1 + (d === 15 ? 1.5 : 0));
    // In Progress -> In Review. Throttled around the WIP spike to show the
    // bottleneck visibly.
    const inBottleneck = d >= 26 && d <= 36;
    const reviewed = inBottleneck
      ? 0.35 + rand() * 0.3 // slow during bottleneck
      : 0.75 + rand() * 0.8;
    // In Review -> Done.
    const shipped = 0.7 + rand() * 0.7;

    toDo = Math.max(0, toDo + scopeGrowth - started);
    inProgress = Math.max(0, inProgress + started - reviewed);
    inReview = Math.max(0, inReview + reviewed - shipped);
    done = done + shipped;

    rows.push({
      day: d,
      done,
      inReview,
      inProgress,
      toDo,
    });
  }
  return rows;
}

interface Props {
  width: number;
  height: number;
}

export function CumulativeFlowChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 48 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateTrace(), []);

  const xMax = data.length - 1;
  const xScale = scaleLinear({ domain: [0, xMax], range: [0, iw] });

  // y domain is the max total across all rows (the top of the stack).
  const yMaxRaw = data.reduce(
    (m, r) => Math.max(m, r.done + r.inReview + r.inProgress + r.toDo),
    0,
  );
  const yScale = scaleLinear({
    domain: [0, yMaxRaw * 1.05],
    range: [ih, 0],
    nice: true,
  });

  // Build stacked paths manually in bottom -> top order.
  const paths = useMemo(() => {
    const areaGen = d3Area<{ day: number; y0: number; y1: number }>()
      .x((d) => xScale(d.day))
      .y0((d) => yScale(d.y0))
      .y1((d) => yScale(d.y1));

    const out: Record<Key, string> = {
      done: "",
      inReview: "",
      inProgress: "",
      toDo: "",
    };

    // Walk bottom to top so each band's y0 is the running total below it.
    const runningTotals = data.map((r) => {
      const done = r.done;
      const inReview = done + r.inReview;
      const inProgress = inReview + r.inProgress;
      const toDo = inProgress + r.toDo;
      return { day: r.day, done, inReview, inProgress, toDo };
    });

    out.done = areaGen(
      runningTotals.map((r) => ({ day: r.day, y0: 0, y1: r.done })),
    ) ?? "";
    out.inReview = areaGen(
      runningTotals.map((r) => ({ day: r.day, y0: r.done, y1: r.inReview })),
    ) ?? "";
    out.inProgress = areaGen(
      runningTotals.map((r) => ({
        day: r.day,
        y0: r.inReview,
        y1: r.inProgress,
      })),
    ) ?? "";
    out.toDo = areaGen(
      runningTotals.map((r) => ({
        day: r.day,
        y0: r.inProgress,
        y1: r.toDo,
      })),
    ) ?? "";

    return { paths: out, runningTotals };
  }, [data, xScale, yScale]);

  // Find the WIP balloon peak — the day where In Progress is thickest.
  const wipPeakIdx = useMemo(() => {
    let best = 0;
    let bestVal = -Infinity;
    for (let i = 0; i < data.length; i++) {
      if (data[i].inProgress > bestVal) {
        bestVal = data[i].inProgress;
        best = i;
      }
    }
    return best;
  }, [data]);

  const peakRow = data[wipPeakIdx];
  const peakX = xScale(peakRow.day);
  const peakTotals = paths.runningTotals[wipPeakIdx];
  const peakBandTopY = yScale(peakTotals.inProgress);
  const peakBandBotY = yScale(peakTotals.inReview);

  // Lead-time measurement: pick a representative y (one that cuts both the
  // In Progress and the Done bands). Measure the horizontal distance from
  // the first day the *cumulative arrivals at In Progress* reached value V,
  // to the day the *cumulative Done* reached the same V — that's the
  // lead time for items that arrived at that stage.
  const leadTimeY = useMemo(() => {
    // Use the value at day 20's "top of Done" band — a representative item.
    const v = paths.runningTotals[20]?.done ?? 5;
    return Math.max(1, v);
  }, [paths.runningTotals]);

  // Find day where top-of-InProgress crosses leadTimeY (arrivals into the
  // workflow for that item).
  let arrivalDay = 0;
  for (let i = 0; i < paths.runningTotals.length; i++) {
    if (paths.runningTotals[i].inProgress >= leadTimeY) {
      arrivalDay = i;
      break;
    }
  }
  // Find day where top-of-Done crosses leadTimeY (it departed as Done).
  let departureDay = data.length - 1;
  for (let i = 0; i < paths.runningTotals.length; i++) {
    if (paths.runningTotals[i].done >= leadTimeY) {
      departureDay = i;
      break;
    }
  }
  const leadTimeYPx = yScale(leadTimeY);
  const leadArrivalX = xScale(arrivalDay);
  const leadDepartureX = xScale(departureDay);

  // Legend layout — inside the plot area, top.
  const legendY = -12;
  const legendGap = Math.max(62, Math.min(96, iw / KEYS.length));

  // Clamp helper.
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  // Pick a day mid-chart to anchor the "In Progress band" generally.
  const midIdx = 18; // before the WIP spike so the band reads as normal-sized
  const midRow = paths.runningTotals[midIdx];
  const midX = xScale(data[midIdx].day);
  const midBandTopY = yScale(midRow.inProgress);
  const midBandBotY = yScale(midRow.inReview);

  return (
    <svg width={width} height={height} role="img" aria-label="Cumulative flow diagram">
      <Group left={margin.left} top={margin.top}>
        {/* Bands — rendered bottom to top so the stack order is Done, In Review,
            In Progress, To-Do (top). */}
        <g data-data-layer="true">
          {KEYS.map((k) => (
            <path
              key={k}
              d={paths.paths[k]}
              fill={KEY_FILL[k]}
              fillOpacity={KEY_OPACITY[k]}
              stroke="var(--color-ink)"
              strokeOpacity={0.18}
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Legend */}
        <g data-data-layer="true">
          {KEYS.map((k, i) => (
            <g key={k} transform={`translate(${i * legendGap}, ${legendY})`}>
              <rect
                width={10}
                height={10}
                fill={KEY_FILL[k]}
                fillOpacity={KEY_OPACITY[k]}
                stroke="var(--color-ink)"
                strokeOpacity={0.2}
              />
              <text
                x={14}
                y={9}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {KEY_LABELS[k].toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* Lead-time measurement — a horizontal rule + end caps between
            arrival and departure at one representative y value. */}
        <g data-data-layer="true">
          <line
            x1={leadArrivalX}
            x2={leadDepartureX}
            y1={leadTimeYPx}
            y2={leadTimeYPx}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
          <line
            x1={leadArrivalX}
            x2={leadArrivalX}
            y1={leadTimeYPx - 5}
            y2={leadTimeYPx + 5}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
          <line
            x1={leadDepartureX}
            x2={leadDepartureX}
            y1={leadTimeYPx - 5}
            y2={leadTimeYPx + 5}
            stroke="var(--color-ink)"
            strokeWidth={1.25}
          />
          <text
            x={(leadArrivalX + leadDepartureX) / 2}
            y={leadTimeYPx - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink)"
          >
            LEAD TIME
          </text>
        </g>

        {/* Y-axis */}
        <ExplainAnchor
          selector="y-axis"
          index={4}
          pin={{ x: -30, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
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
            x={-36}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            ITEMS
          </text>
        </ExplainAnchor>

        {/* X-axis */}
        <ExplainAnchor
          selector="x-axis"
          index={5}
          pin={{ x: iw / 2, y: ih + 28 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `D${String(v)}`}
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
            PROJECT DAY
          </text>
        </ExplainAnchor>

        {/* Anchor 1: In Progress band — at a "normal" mid-chart day, before
            the spike, so the reader's mental baseline is set first. */}
        <ExplainAnchor
          selector="in-progress-band"
          index={1}
          pin={{ x: midX, y: (midBandTopY + midBandBotY) / 2 }}
          rect={clampRect({
            x: Math.max(0, midX - 10),
            y: midBandTopY,
            width: 20,
            height: Math.max(6, midBandBotY - midBandTopY),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: the WIP balloon / bottleneck around day ~30. */}
        <ExplainAnchor
          selector="wip-balloon"
          index={2}
          pin={{ x: peakX, y: (peakBandTopY + peakBandBotY) / 2 }}
          rect={clampRect({
            x: Math.max(0, peakX - 22),
            y: Math.min(peakBandTopY, peakBandBotY) - 2,
            width: 44,
            height: Math.max(8, Math.abs(peakBandBotY - peakBandTopY) + 4),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: the lead-time horizontal measurement. */}
        <ExplainAnchor
          selector="lead-time"
          index={3}
          pin={{ x: (leadArrivalX + leadDepartureX) / 2, y: leadTimeYPx + 14 }}
          rect={clampRect({
            x: Math.max(0, Math.min(leadArrivalX, leadDepartureX) - 4),
            y: Math.max(0, leadTimeYPx - 8),
            width: Math.max(8, Math.abs(leadDepartureX - leadArrivalX) + 8),
            height: 16,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 6: band order — the stack order (Done bottom -> To-Do top).
            Target the leftmost column where the order reads cleanly. */}
        <ExplainAnchor
          selector="band-order"
          index={6}
          pin={{ x: 14, y: ih - 10 }}
          rect={clampRect({ x: 0, y: 0, width: 24, height: ih })}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 7: legend. */}
        <ExplainAnchor
          selector="legend"
          index={7}
          pin={{ x: Math.min(iw - 8, legendGap * 2 + 8), y: legendY - 4 }}
          rect={{
            x: 0,
            y: Math.max(-margin.top, legendY - 2),
            width: Math.min(iw, legendGap * KEYS.length),
            height: 14,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
