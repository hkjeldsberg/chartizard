"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// -----------------------------------------------------------------------------
// Hammock plot — categorical parallel-coordinates with narrowing bands.
//
// Titanic survival across four axes: Class → Sex → Age → Survived. Counts
// are the Dawson (1995) cross-classification that every teaching treatment
// of the dataset uses (total 2201).
//
// The chart's visual twist compared to parallel-sets: between any pair of
// adjacent axes, the trapezoidal band is at its widest where it meets each
// axis (width proportional to count there) and NARROWS toward the middle
// of the gap. That narrowing is what makes individual-path traffic
// readable, and it is the feature Schonlau (2003) introduced when naming
// the chart "hammock" after the shape of a hammock slung between two
// posts.
//
// The data here is the full four-way cross-classification. Each unique
// record contributes a chain of three bands; the Crew/Male/Adult/Died
// record dominates the visual weight (it is the widest chain) and the
// 1st/Female/Adult/Survived record is the next-most-prominent.
// -----------------------------------------------------------------------------

type Cls = "1st" | "2nd" | "3rd" | "Crew";
type Sex = "Male" | "Female";
type Age = "Adult" | "Child";
type Surv = "Yes" | "No";

interface Record4 {
  cls: Cls;
  sex: Sex;
  age: Age;
  surv: Surv;
  n: number;
}

// Full Titanic joint distribution (Dawson, 1995). Sums to 2201.
const RECORDS: ReadonlyArray<Record4> = [
  { cls: "1st",  sex: "Male",   age: "Adult", surv: "No",  n: 118 },
  { cls: "1st",  sex: "Male",   age: "Adult", surv: "Yes", n: 57  },
  { cls: "1st",  sex: "Male",   age: "Child", surv: "Yes", n: 5   },
  { cls: "1st",  sex: "Female", age: "Adult", surv: "No",  n: 4   },
  { cls: "1st",  sex: "Female", age: "Adult", surv: "Yes", n: 140 },
  { cls: "1st",  sex: "Female", age: "Child", surv: "Yes", n: 1   },
  { cls: "2nd",  sex: "Male",   age: "Adult", surv: "No",  n: 154 },
  { cls: "2nd",  sex: "Male",   age: "Adult", surv: "Yes", n: 14  },
  { cls: "2nd",  sex: "Male",   age: "Child", surv: "Yes", n: 11  },
  { cls: "2nd",  sex: "Female", age: "Adult", surv: "No",  n: 13  },
  { cls: "2nd",  sex: "Female", age: "Adult", surv: "Yes", n: 80  },
  { cls: "2nd",  sex: "Female", age: "Child", surv: "Yes", n: 13  },
  { cls: "3rd",  sex: "Male",   age: "Adult", surv: "No",  n: 387 },
  { cls: "3rd",  sex: "Male",   age: "Adult", surv: "Yes", n: 75  },
  { cls: "3rd",  sex: "Male",   age: "Child", surv: "No",  n: 35  },
  { cls: "3rd",  sex: "Male",   age: "Child", surv: "Yes", n: 13  },
  { cls: "3rd",  sex: "Female", age: "Adult", surv: "No",  n: 89  },
  { cls: "3rd",  sex: "Female", age: "Adult", surv: "Yes", n: 76  },
  { cls: "3rd",  sex: "Female", age: "Child", surv: "No",  n: 17  },
  { cls: "3rd",  sex: "Female", age: "Child", surv: "Yes", n: 14  },
  { cls: "Crew", sex: "Male",   age: "Adult", surv: "No",  n: 670 },
  { cls: "Crew", sex: "Male",   age: "Adult", surv: "Yes", n: 192 },
  { cls: "Crew", sex: "Female", age: "Adult", surv: "No",  n: 3   },
  { cls: "Crew", sex: "Female", age: "Adult", surv: "Yes", n: 20  },
];

const TOTAL: number = 2201;

const CLASS_ORDER: ReadonlyArray<Cls> = ["1st", "2nd", "3rd", "Crew"];
const SEX_ORDER: ReadonlyArray<Sex> = ["Male", "Female"];
const AGE_ORDER: ReadonlyArray<Age> = ["Adult", "Child"];
const SURV_ORDER: ReadonlyArray<Surv> = ["No", "Yes"];

// -----------------------------------------------------------------------------
// Layout
// -----------------------------------------------------------------------------

interface AxisSpec {
  key: "cls" | "sex" | "age" | "surv";
  label: string;
  order: ReadonlyArray<string>;
  counts: Record<string, number>;
}

function countsByKey<K extends keyof Record4>(field: K): Record<string, number> {
  const out: Record<string, number> = {};
  RECORDS.forEach((r) => {
    const k = String(r[field]);
    out[k] = (out[k] ?? 0) + r.n;
  });
  return out;
}

interface PlacedSegment {
  axisKey: string;
  key: string;          // category key within axis
  id: string;           // `${axisKey}:${key}`
  label: string;
  count: number;
  x: number;            // axis x (segment sits on this vertical line)
  y0: number;
  y1: number;
}

interface PlacedBand {
  srcId: string;
  tgtId: string;
  count: number;
  x0: number;           // source axis x
  x1: number;           // target axis x
  // Widest at the two axes, narrowest at the midpoint ("hammock" sag).
  sy0: number;
  sy1: number;
  my0: number;
  my1: number;
  ty0: number;
  ty1: number;
}

interface Props {
  width: number;
  height: number;
}

export function HammockPlot({ width, height }: Props) {
  const margin = { top: 28, right: 60, bottom: 44, left: 60 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const layout = useMemo(() => {
    const axes: AxisSpec[] = [
      { key: "cls",  label: "CLASS",    order: CLASS_ORDER, counts: countsByKey("cls") },
      { key: "sex",  label: "SEX",      order: SEX_ORDER,   counts: countsByKey("sex") },
      { key: "age",  label: "AGE",      order: AGE_ORDER,   counts: countsByKey("age") },
      { key: "surv", label: "SURVIVED", order: SURV_ORDER,  counts: countsByKey("surv") },
    ];

    // Axis x positions — evenly spaced across the plot.
    const axisX: number[] = axes.map((_, i) =>
      axes.length === 1 ? 0 : (i * iw) / (axes.length - 1),
    );

    // Narrow-gap ratio controls the "hammock sag": width at midpoint is
    // this fraction of width at the axis. 0 would pinch to zero (Sankey-
    // looking); values near 1 would be straight trapezoids. 0.4 is the
    // classic hammock silhouette.
    const NARROW_RATIO = 0.4;

    // Within-axis padding. Scales with plot height so tiny cells stay
    // readable on M tiles.
    const padWithin = Math.min(8, Math.max(2, ih * 0.025));

    // Segments on each axis. Each axis sums to TOTAL, so we allocate the
    // same available height budget to each — the bars must be equal-total.
    const segmentsById: Record<string, PlacedSegment> = {};
    const segmentsByAxis: PlacedSegment[][] = axes.map((a, ai) => {
      const n = a.order.length;
      const padTotal = padWithin * Math.max(0, n - 1);
      const usable = Math.max(0, ih - padTotal);
      const scale = TOTAL === 0 ? 0 : usable / TOTAL;
      const placed: PlacedSegment[] = [];
      let y = 0;
      for (const key of a.order) {
        const count = a.counts[key] ?? 0;
        const h = Math.max(1.5, count * scale);
        const seg: PlacedSegment = {
          axisKey: a.key,
          key,
          id: `${a.key}:${key}`,
          label: key,
          count,
          x: axisX[ai],
          y0: y,
          y1: y + h,
        };
        placed.push(seg);
        segmentsById[seg.id] = seg;
        y += h + padWithin;
      }
      return placed;
    });

    // Build bands between every adjacent axis pair. Within a source
    // segment, outgoing bands stack in the order the target axis is
    // listed; within a target segment, incoming bands stack in source-
    // axis order. This is the same cursor pattern parallel-sets uses and
    // it gives a deterministic layout with controlled crossings.

    // Joint counts for each adjacent axis pair, projected from the full
    // 4-way table.
    function projectPair(
      leftKey: keyof Record4,
      rightKey: keyof Record4,
    ): Map<string, Map<string, number>> {
      const out = new Map<string, Map<string, number>>();
      RECORDS.forEach((r) => {
        const lk = String(r[leftKey]);
        const rk = String(r[rightKey]);
        if (!out.has(lk)) out.set(lk, new Map());
        const inner = out.get(lk)!;
        inner.set(rk, (inner.get(rk) ?? 0) + r.n);
      });
      return out;
    }

    const pairs: Array<{
      leftAxisIdx: number;
      rightAxisIdx: number;
      leftField: keyof Record4;
      rightField: keyof Record4;
    }> = [
      { leftAxisIdx: 0, rightAxisIdx: 1, leftField: "cls",  rightField: "sex"  },
      { leftAxisIdx: 1, rightAxisIdx: 2, leftField: "sex",  rightField: "age"  },
      { leftAxisIdx: 2, rightAxisIdx: 3, leftField: "age",  rightField: "surv" },
    ];

    const bands: PlacedBand[] = [];

    // Per-axis cursor state: offset used so far on each segment's right
    // edge (outgoing) and left edge (incoming). A segment is both the
    // right side of one pair and the left side of the next.
    const rightCursor: Record<string, number> = {};
    const leftCursor: Record<string, number> = {};

    for (const p of pairs) {
      const leftAxis = axes[p.leftAxisIdx];
      const rightAxis = axes[p.rightAxisIdx];
      const pairCounts = projectPair(p.leftField, p.rightField);
      const leftSegs = segmentsByAxis[p.leftAxisIdx];
      const rightSegs = segmentsByAxis[p.rightAxisIdx];
      // Use each axis's own per-unit height so within-axis padding works
      // correctly on both sides.
      const leftPadTotal = padWithin * Math.max(0, leftAxis.order.length - 1);
      const leftUnit = TOTAL === 0 ? 0 : (ih - leftPadTotal) / TOTAL;
      const rightPadTotal = padWithin * Math.max(0, rightAxis.order.length - 1);
      const rightUnit = TOTAL === 0 ? 0 : (ih - rightPadTotal) / TOTAL;

      for (const lKey of leftAxis.order) {
        const srcSeg = leftSegs.find((s) => s.key === lKey)!;
        const innerMap = pairCounts.get(lKey);
        if (!innerMap) continue;
        for (const rKey of rightAxis.order) {
          const count = innerMap.get(rKey) ?? 0;
          if (count === 0) continue;
          const tgtSeg = rightSegs.find((s) => s.key === rKey)!;
          const hSrc = count * leftUnit;
          const hTgt = count * rightUnit;
          const sCur = rightCursor[srcSeg.id] ?? 0;
          const tCur = leftCursor[tgtSeg.id] ?? 0;
          const sy0 = srcSeg.y0 + sCur;
          const sy1 = sy0 + hSrc;
          const ty0 = tgtSeg.y0 + tCur;
          const ty1 = ty0 + hTgt;
          // Midpoint widths (narrowed). The band's vertical midline runs
          // from the source edge's centre to the target edge's centre; we
          // pinch around that midline to NARROW_RATIO of the axis-edge
          // widths. Pick the smaller of the two end-widths to ensure the
          // midpoint is a genuine narrowing, not a bulge.
          const srcMid = (sy0 + sy1) / 2;
          const tgtMid = (ty0 + ty1) / 2;
          const midlineY = (srcMid + tgtMid) / 2;
          const endWidth = Math.min(hSrc, hTgt);
          const midHalf = (endWidth * NARROW_RATIO) / 2;
          const my0 = midlineY - midHalf;
          const my1 = midlineY + midHalf;
          bands.push({
            srcId: srcSeg.id,
            tgtId: tgtSeg.id,
            count,
            x0: srcSeg.x,
            x1: tgtSeg.x,
            sy0,
            sy1,
            my0,
            my1,
            ty0,
            ty1,
          });
          rightCursor[srcSeg.id] = sCur + hSrc;
          leftCursor[tgtSeg.id] = tCur + hTgt;
        }
      }
    }

    return { axes, axisX, segmentsByAxis, segmentsById, bands, padWithin };
  }, [iw, ih]);

  const { axes, axisX, segmentsByAxis, segmentsById, bands } = layout;

  // Axis bar visual width — narrow rectangle so axes read as posts.
  const AXIS_W = 3;

  // Band paths: straight-sided trapezoid with a narrowed waist at the
  // midpoint (two quadratic-bezier curves on each side, meeting at the
  // midpoint's y). The control points are placed one-quarter and three-
  // quarter of the way across so the curve eases into the waist.
  function bandPath(b: PlacedBand): string {
    const q1x = b.x0 + (b.x1 - b.x0) * 0.25;
    const q2x = b.x0 + (b.x1 - b.x0) * 0.75;
    const mx = (b.x0 + b.x1) / 2;
    // Top edge: sy0 at x0 → curve down to my0 at mx → curve up to ty0 at x1.
    // Bottom edge: ty1 at x1 → curve up to my1 at mx → curve down to sy1 at x0.
    // Curves are done as two cubics per edge for smoothness.
    return [
      `M ${b.x0},${b.sy0}`,
      `C ${q1x},${b.sy0} ${q1x},${b.my0} ${mx},${b.my0}`,
      `C ${q2x},${b.my0} ${q2x},${b.ty0} ${b.x1},${b.ty0}`,
      `L ${b.x1},${b.ty1}`,
      `C ${q2x},${b.ty1} ${q2x},${b.my1} ${mx},${b.my1}`,
      `C ${q1x},${b.my1} ${q1x},${b.sy1} ${b.x0},${b.sy1}`,
      "Z",
    ].join(" ");
  }

  // Survival-aware band fill: Yes-bound bands render in ink, No-bound
  // bands in a muted sand. On the earlier legs (pre-survival) paint by
  // ink — survival isn't known yet. A narrow record path (1st→Female
  // →Adult→Yes) thus keeps a consistent sand/ink colour only on the last
  // leg, which is the right scope for the survival signal.
  function bandFill(b: PlacedBand): string {
    if (b.tgtId === "surv:Yes") return "var(--color-ink)";
    if (b.tgtId === "surv:No") return "#8a7a52";
    return "var(--color-ink)";
  }
  function bandOpacity(b: PlacedBand): number {
    // Third-class / Crew → Male path is the dominant visual chain — give
    // it slightly more ink so the story survives into the right half.
    if (b.srcId === "cls:3rd" && b.tgtId === "sex:Male") return 0.5;
    if (b.srcId === "cls:Crew" && b.tgtId === "sex:Male") return 0.55;
    return 0.32;
  }

  // Anchor targets.
  const classSeg3rd = segmentsById["cls:3rd"];
  const crewMaleBand = bands.find(
    (b) => b.srcId === "cls:Crew" && b.tgtId === "sex:Male",
  );
  const adultNoBand = bands.find(
    (b) => b.srcId === "age:Adult" && b.tgtId === "surv:No",
  );
  const femaleAdultBand = bands.find(
    (b) => b.srcId === "sex:Female" && b.tgtId === "age:Adult",
  );
  const survivedYesSeg = segmentsById["surv:Yes"];

  const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
  const clampRect = (r: { x: number; y: number; width: number; height: number }) => {
    const x = clamp(r.x, 0, iw);
    const y = clamp(r.y, 0, ih);
    const w = clamp(r.x + r.width, 0, iw) - x;
    const h = clamp(r.y + r.height, 0, ih) - y;
    return { x, y, width: Math.max(0, w), height: Math.max(0, h) };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Hammock plot">
      <Group left={margin.left} top={margin.top}>
        {/* Axis headers */}
        <g data-data-layer="true">
          {axes.map((a, i) => (
            <text
              key={a.key}
              x={axisX[i]}
              y={-12}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={500}
              fill="var(--color-ink-mute)"
            >
              {a.label}
            </text>
          ))}
        </g>

        {/* Bands — behind the axis bars so posts sit on top */}
        <g data-data-layer="true">
          {bands.map((b, i) => (
            <path
              key={`band-${i}`}
              d={bandPath(b)}
              fill={bandFill(b)}
              fillOpacity={bandOpacity(b)}
              stroke="none"
            />
          ))}
        </g>

        {/* Axis posts — a narrow rectangle per segment, centred on axis x */}
        <g data-data-layer="true">
          {segmentsByAxis.flat().map((s) => (
            <rect
              key={s.id}
              x={s.x - AXIS_W / 2}
              y={s.y0}
              width={AXIS_W}
              height={Math.max(1.5, s.y1 - s.y0)}
              fill="var(--color-ink)"
              stroke="var(--color-surface)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Sub-category labels around the two outer axes, stacked inline
            on the two middle axes. */}
        <g data-data-layer="true">
          {segmentsByAxis[0].map((s) => {
            const ly = (s.y0 + s.y1) / 2;
            return (
              <g key={`lbl-left-${s.id}`}>
                <text
                  x={s.x - 8}
                  y={ly - 4}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
                <text
                  x={s.x - 8}
                  y={ly + 7}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {s.count}
                </text>
              </g>
            );
          })}
          {segmentsByAxis[1].map((s) => {
            const ly = (s.y0 + s.y1) / 2;
            return (
              <text
                key={`lbl-sex-${s.id}`}
                x={s.x + 6}
                y={ly}
                textAnchor="start"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {s.label}
              </text>
            );
          })}
          {segmentsByAxis[2].map((s) => {
            const ly = (s.y0 + s.y1) / 2;
            return (
              <text
                key={`lbl-age-${s.id}`}
                x={s.x + 6}
                y={ly}
                textAnchor="start"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="var(--color-ink)"
              >
                {s.label}
              </text>
            );
          })}
          {segmentsByAxis[3].map((s) => {
            const ly = (s.y0 + s.y1) / 2;
            return (
              <g key={`lbl-right-${s.id}`}>
                <text
                  x={s.x + 8}
                  y={ly - 4}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {s.label}
                </text>
                <text
                  x={s.x + 8}
                  y={ly + 7}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-mute)"
                >
                  {s.count}
                </text>
              </g>
            );
          })}
        </g>

        {/* Anchors */}

        {/* 1. Axis post — 3rd-class segment */}
        {classSeg3rd && (
          <ExplainAnchor
            selector="axis-post"
            index={1}
            pin={{
              x: clamp(classSeg3rd.x - 40, 0, iw),
              y: clamp((classSeg3rd.y0 + classSeg3rd.y1) / 2 + 20, 0, ih),
            }}
            rect={clampRect({
              x: classSeg3rd.x - AXIS_W / 2 - 2,
              y: classSeg3rd.y0,
              width: AXIS_W + 4,
              height: Math.max(6, classSeg3rd.y1 - classSeg3rd.y0),
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 2. Hammock band — widest chain (Crew → Male) */}
        {crewMaleBand && (
          <ExplainAnchor
            selector="band"
            index={2}
            pin={{
              x: clamp((crewMaleBand.x0 + crewMaleBand.x1) / 2, 0, iw),
              y: clamp(
                (crewMaleBand.sy0 +
                  crewMaleBand.sy1 +
                  crewMaleBand.ty0 +
                  crewMaleBand.ty1) /
                  4 -
                  24,
                0,
                ih,
              ),
            }}
            rect={clampRect({
              x: crewMaleBand.x0,
              y: Math.min(crewMaleBand.sy0, crewMaleBand.ty0),
              width: crewMaleBand.x1 - crewMaleBand.x0,
              height:
                Math.max(crewMaleBand.sy1, crewMaleBand.ty1) -
                Math.min(crewMaleBand.sy0, crewMaleBand.ty0),
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 3. Narrowing waist — the defining visual feature. Anchor the
            dominant Adult→No band at its midpoint. */}
        {adultNoBand && (
          <ExplainAnchor
            selector="narrowing"
            index={3}
            pin={{
              x: clamp((adultNoBand.x0 + adultNoBand.x1) / 2 + 14, 0, iw),
              y: clamp((adultNoBand.my0 + adultNoBand.my1) / 2 - 16, 0, ih),
            }}
            rect={clampRect({
              x: (adultNoBand.x0 + adultNoBand.x1) / 2 - 8,
              y: adultNoBand.my0 - 2,
              width: 16,
              height: Math.max(4, adultNoBand.my1 - adultNoBand.my0 + 4),
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 4. Axis label — the CLASS header */}
        <ExplainAnchor
          selector="axis-label"
          index={4}
          pin={{ x: clamp(axisX[0], 0, iw), y: clamp(-22, -margin.top, ih) }}
          rect={clampRect({
            x: axisX[0] - 30,
            y: 0,
            width: 60,
            height: 10,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Axis ordering — whole plot-area band on the Sex→Age pair */}
        {femaleAdultBand && (
          <ExplainAnchor
            selector="axis-ordering"
            index={5}
            pin={{
              x: clamp((femaleAdultBand.x0 + femaleAdultBand.x1) / 2, 0, iw),
              y: clamp(
                (femaleAdultBand.sy0 +
                  femaleAdultBand.sy1 +
                  femaleAdultBand.ty0 +
                  femaleAdultBand.ty1) /
                  4 +
                  22,
                0,
                ih,
              ),
            }}
            rect={clampRect({
              x: femaleAdultBand.x0,
              y: Math.min(femaleAdultBand.sy0, femaleAdultBand.ty0),
              width: femaleAdultBand.x1 - femaleAdultBand.x0,
              height:
                Math.max(femaleAdultBand.sy1, femaleAdultBand.ty1) -
                Math.min(femaleAdultBand.sy0, femaleAdultBand.ty0),
            })}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 6. Terminal category — Survived=Yes */}
        {survivedYesSeg && (
          <ExplainAnchor
            selector="terminal"
            index={6}
            pin={{
              x: clamp(survivedYesSeg.x + 48, 0, iw),
              y: clamp((survivedYesSeg.y0 + survivedYesSeg.y1) / 2, 0, ih),
            }}
            rect={clampRect({
              x: survivedYesSeg.x - AXIS_W / 2 - 2,
              y: survivedYesSeg.y0,
              width: AXIS_W + 4,
              height: Math.max(6, survivedYesSeg.y1 - survivedYesSeg.y0),
            })}
          >
            <g />
          </ExplainAnchor>
        )}
      </Group>
    </svg>
  );
}
