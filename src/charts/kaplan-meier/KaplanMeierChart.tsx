"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type ArmKey = "control" | "treatment";

type Arm = {
  key: ArmKey;
  label: string;
  color: string;
  // Monotonically increasing event times (months). Survival drops by one unit at each.
  events: ReadonlyArray<number>;
  // Times at which a patient is censored (short tick, no drop).
  censors: ReadonlyArray<number>;
  // Initial cohort size — used to compute the step size at each event.
  n0: number;
};

// Control drops ~65% over 24 months across 12 events.
// Treatment drops ~32% over 24 months across 8 events.
const ARMS: ReadonlyArray<Arm> = [
  {
    key: "control",
    label: "CONTROL",
    color: "var(--color-ink)",
    events: [2, 4, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23],
    censors: [6, 12, 18],
    // Step size per event = 0.65 / 12 ≈ 0.0542
    n0: 12 / 0.65,
  },
  {
    key: "treatment",
    label: "TREATMENT",
    color: "#4a6a68",
    events: [3, 6, 9, 12, 15, 18, 21, 24],
    censors: [5, 11, 17, 20, 23],
    // Step size per event = 0.32 / 8 = 0.04
    n0: 8 / 0.32,
  },
];

type Point = { t: number; s: number };

/**
 * Given ordered event times and a starting cohort size, produce an array of
 * (time, survival) points suitable for a step-line. Each event reduces
 * survival by 1/n0 — a simplified, proportional K–M estimator that ignores
 * shrinking risk set (teaching data, not clinical data).
 */
function kmPoints(events: ReadonlyArray<number>, n0: number): ReadonlyArray<Point> {
  const pts: Point[] = [{ t: 0, s: 1 }];
  let s = 1;
  for (const e of events) {
    pts.push({ t: e, s }); // hold until event
    s = Math.max(0, s - 1 / n0);
    pts.push({ t: e, s }); // drop
  }
  pts.push({ t: 24, s });
  return pts;
}

/**
 * Interpolate the survival value for a given time t from step-function points.
 * Used to position censor ticks on the curve.
 */
function surviveAt(pts: ReadonlyArray<Point>, t: number): number {
  let s = pts[0].s;
  for (const p of pts) {
    if (p.t <= t) s = p.s;
    else break;
  }
  return s;
}

interface Props {
  width: number;
  height: number;
}

export function KaplanMeierChart({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [0, 24], range: [0, iw] });
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  const ticksY = yScale.ticks(5);

  const seriesPts = ARMS.map((arm) => ({
    arm,
    pts: kmPoints(arm.events, arm.n0),
  }));

  const control = seriesPts[0];
  const treatment = seriesPts[1];

  // Anchor coordinates derived from the data so every anchor has a real mark
  // beneath it. All are rendered unconditionally.
  const stepDropX = xScale(9); // a drop on the control curve
  const stepDropYTop = yScale(surviveAt(control.pts, 8.99));
  const stepDropYBot = yScale(surviveAt(control.pts, 9));

  const holdStartX = xScale(13);
  const holdEndX = xScale(15);
  const holdY = yScale(surviveAt(control.pts, 13.5));

  const censorT = 11;
  const censorX = xScale(censorT);
  const censorY = yScale(surviveAt(treatment.pts, censorT));

  // Gap visualisation at t=18 — between control and treatment survival.
  const gapT = 18;
  const gapX = xScale(gapT);
  const gapYControl = yScale(surviveAt(control.pts, gapT));
  const gapYTreat = yScale(surviveAt(treatment.pts, gapT));

  return (
    <svg width={width} height={height} role="img" aria-label="Kaplan-Meier curve">
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
              strokeDasharray={t === 0 || t === 1 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Step curves — one per arm. Each rendered as a sequence of H/V lines. */}
        <g data-data-layer="true">
          {seriesPts.map(({ arm, pts }) => (
            <g key={arm.key}>
              {pts.slice(0, -1).map((p, i) => {
                const q = pts[i + 1];
                return (
                  <line
                    key={`${arm.key}-${i}`}
                    x1={xScale(p.t)}
                    y1={yScale(p.s)}
                    x2={xScale(q.t)}
                    y2={yScale(q.s)}
                    stroke={arm.color}
                    strokeWidth={1.8}
                    strokeLinecap="square"
                  />
                );
              })}
              {/* Censor ticks — short verticals crossing the curve. */}
              {arm.censors.map((c) => {
                const cx = xScale(c);
                const cy = yScale(surviveAt(pts, c));
                return (
                  <line
                    key={`${arm.key}-cens-${c}`}
                    x1={cx}
                    x2={cx}
                    y1={cy - 4}
                    y2={cy + 4}
                    stroke={arm.color}
                    strokeWidth={1.4}
                  />
                );
              })}
            </g>
          ))}
        </g>

        {/* Legend — dims with the data layer. */}
        <g data-data-layer="true" transform={`translate(${iw - 92}, 6)`}>
          {ARMS.map((arm, i) => (
            <g key={arm.key} transform={`translate(0, ${i * 14})`}>
              <line
                x1={0}
                x2={16}
                y1={5}
                y2={5}
                stroke={arm.color}
                strokeWidth={1.8}
              />
              <text
                x={20}
                y={5}
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink-soft)"
              >
                {arm.label}
              </text>
            </g>
          ))}
        </g>

        {/* 1. Step drop — a vertical drop on the control curve at t=9. */}
        <ExplainAnchor
          selector="step-drop"
          index={1}
          pin={{ x: stepDropX + 14, y: (stepDropYTop + stepDropYBot) / 2 }}
          rect={{
            x: Math.max(0, stepDropX - 6),
            y: Math.max(0, Math.min(stepDropYTop, stepDropYBot) - 2),
            width: 12,
            height: Math.abs(stepDropYBot - stepDropYTop) + 4,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Horizontal segment — the flat hold between two events. */}
        <ExplainAnchor
          selector="horizontal-segment"
          index={2}
          pin={{ x: (holdStartX + holdEndX) / 2, y: holdY - 14 }}
          rect={{
            x: holdStartX,
            y: Math.max(0, holdY - 5),
            width: Math.max(1, holdEndX - holdStartX),
            height: 10,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Censor tick — a single + mark on the treatment curve. */}
        <ExplainAnchor
          selector="censor-tick"
          index={3}
          pin={{ x: censorX, y: Math.max(0, censorY - 18) }}
          rect={{
            x: Math.max(0, censorX - 5),
            y: Math.max(0, censorY - 6),
            width: 10,
            height: 12,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Curve gap — the widening vertical gap between arms at t=18. */}
        <ExplainAnchor
          selector="curve-gap"
          index={4}
          pin={{ x: gapX + 14, y: (gapYControl + gapYTreat) / 2 }}
          rect={{
            x: Math.max(0, gapX - 4),
            y: Math.min(gapYControl, gapYTreat),
            width: 8,
            height: Math.abs(gapYControl - gapYTreat),
          }}
        >
          <line
            x1={gapX}
            x2={gapX}
            y1={gapYTreat}
            y2={gapYControl}
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
            strokeDasharray="2 2"
            data-data-layer="true"
          />
        </ExplainAnchor>

        {/* 5. Y-axis — survival probability. */}
        <ExplainAnchor
          selector="y-axis"
          index={5}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `${Math.round(Number(v) * 100)}%`}
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
            x={-margin.left + 6}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            SURVIVAL
          </text>
        </ExplainAnchor>

        {/* 6. X-axis — follow-up months. */}
        <ExplainAnchor
          selector="x-axis"
          index={6}
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
          <text
            x={iw / 2}
            y={ih + 36}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            MONTHS SINCE RANDOMISATION
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
