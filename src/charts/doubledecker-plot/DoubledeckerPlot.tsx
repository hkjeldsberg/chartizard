"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Titanic survival by Class × Sex. Counts are reported aboard-counts
// (not life-boat survivors) so the chart matches the canonical example
// used in Hofmann 2001 when she introduced the doubledecker plot.
//
// count = passengers in this Class × Sex cell
// survived = survival rate in [0, 1]
type Cell = {
  classId: "1st" | "2nd" | "3rd" | "Crew";
  sex: "F" | "M";
  count: number;
  survived: number;
};

const CELLS: ReadonlyArray<Cell> = [
  { classId: "1st", sex: "F", count: 145, survived: 0.97 },
  { classId: "1st", sex: "M", count: 180, survived: 0.34 },
  { classId: "2nd", sex: "F", count: 106, survived: 0.88 },
  { classId: "2nd", sex: "M", count: 179, survived: 0.14 },
  { classId: "3rd", sex: "F", count: 196, survived: 0.49 },
  { classId: "3rd", sex: "M", count: 510, survived: 0.16 },
  { classId: "Crew", sex: "F", count: 23, survived: 0.87 },
  { classId: "Crew", sex: "M", count: 885, survived: 0.22 },
];

const CLASS_ORDER: ReadonlyArray<Cell["classId"]> = ["1st", "2nd", "3rd", "Crew"];

interface Props {
  width: number;
  height: number;
}

export function DoubledeckerPlot({ width, height }: Props) {
  const margin = { top: 40, right: 20, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const total = CELLS.reduce((s, c) => s + c.count, 0);
  const BAR_GAP = 1.5; // small gutter between adjacent bars
  const CLASS_GAP = 5; // larger gutter between classes (the outer predictor)

  // Layout: 8 bars of width ∝ count. Total horizontal gap space is subtracted
  // first, then the remaining width is divided proportionally.
  const intraClassGaps = CLASS_ORDER.length * (2 - 1); // 1 gap inside each class (F↔M) = 4
  const interClassGaps = CLASS_ORDER.length - 1; // 3 gaps between classes
  const totalGapPx = intraClassGaps * BAR_GAP + interClassGaps * CLASS_GAP;
  const plotW = Math.max(0, iw - totalGapPx);
  const widthScale = scaleLinear({ domain: [0, total], range: [0, plotW] });

  // y scale on 0..100% survival — equal bar height, shaded from the bottom.
  const yScale = scaleLinear({ domain: [0, 1], range: [ih, 0] });

  // Precompute bar geometry.
  const bars: Array<{
    cell: Cell;
    x: number;
    w: number;
    shadedY: number;
    shadedH: number;
    classIdx: number;
    sexIdx: number;
  }> = [];
  {
    let cursorX = 0;
    CLASS_ORDER.forEach((cls, classIdx) => {
      const classCells = CELLS.filter((c) => c.classId === cls).sort(
        (a, b) => (a.sex === "F" ? -1 : 1) - (b.sex === "F" ? -1 : 1),
      );
      classCells.forEach((cell, sexIdx) => {
        const w = widthScale(cell.count);
        const shadedY = yScale(cell.survived);
        const shadedH = ih - shadedY;
        bars.push({
          cell,
          x: cursorX,
          w,
          shadedY,
          shadedH,
          classIdx,
          sexIdx,
        });
        cursorX += w;
        if (sexIdx < classCells.length - 1) cursorX += BAR_GAP;
      });
      if (classIdx < CLASS_ORDER.length - 1) cursorX += CLASS_GAP;
    });
  }

  // Class-group spans (for the top labels).
  const classSpans = CLASS_ORDER.map((cls) => {
    const inClass = bars.filter((b) => b.cell.classId === cls);
    const x0 = inClass[0].x;
    const last = inClass[inClass.length - 1];
    const x1 = last.x + last.w;
    return { cls, x0, x1 };
  });

  const clamp = (v: number, lo: number, hi: number) =>
    Math.max(lo, Math.min(hi, v));

  // Anchor targets
  // 1: 1st-class-female bar — the ~97% shaded extreme (clearest read of the idea).
  const anchorFirstClassFemale = bars.find(
    (b) => b.cell.classId === "1st" && b.cell.sex === "F",
  )!;
  // 2: 3rd-class-male bar — ~16% shaded, the darkest contrast.
  const anchorThirdClassMale = bars.find(
    (b) => b.cell.classId === "3rd" && b.cell.sex === "M",
  )!;
  // 3: Crew-male bar — widest bar (joint count ≈ 885).
  const anchorCrewMale = bars.find(
    (b) => b.cell.classId === "Crew" && b.cell.sex === "M",
  )!;

  return (
    <svg width={width} height={height} role="img" aria-label="Doubledecker plot">
      <Group left={margin.left} top={margin.top}>
        {/* Equal-height frames (the "un-shaded deck") — draw first, faintly */}
        <g data-data-layer="true">
          {bars.map((b, i) => (
            <rect
              key={`frame-${i}`}
              x={b.x}
              y={0}
              width={b.w}
              height={ih}
              fill="var(--color-ink)"
              fillOpacity={0.08}
            />
          ))}
        </g>

        {/* Shaded survival decks — from bottom up */}
        <g data-data-layer="true">
          {bars.map((b, i) => (
            <rect
              key={`survived-${i}`}
              x={b.x}
              y={b.shadedY}
              width={b.w}
              height={b.shadedH}
              fill="var(--color-ink)"
              fillOpacity={0.78}
            />
          ))}
        </g>

        {/* Inner dividing line between the two decks (the "double" in doubledecker) */}
        <g data-data-layer="true">
          {bars.map((b, i) => (
            <line
              key={`split-${i}`}
              x1={b.x}
              x2={b.x + b.w}
              y1={b.shadedY}
              y2={b.shadedY}
              stroke="var(--color-page)"
              strokeWidth={0.9}
            />
          ))}
        </g>

        {/* Sex labels inside each bar (F / M) */}
        <g data-data-layer="true">
          {bars.map((b, i) => (
            <text
              key={`sex-${i}`}
              x={b.x + b.w / 2}
              y={ih / 2}
              textAnchor="middle"
              dominantBaseline="central"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-page)"
              style={{ pointerEvents: "none" }}
            >
              {b.cell.sex}
            </text>
          ))}
        </g>

        {/* Class headers above each class group */}
        <g data-data-layer="true">
          {classSpans.map((s) => (
            <g key={s.cls}>
              <line
                x1={s.x0}
                x2={s.x1}
                y1={-18}
                y2={-18}
                stroke="var(--color-ink-mute)"
              />
              <text
                x={(s.x0 + s.x1) / 2}
                y={-24}
                textAnchor="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink)"
              >
                {s.cls.toUpperCase()}
              </text>
            </g>
          ))}
        </g>

        {/* Y axis — 0..100% survival */}
        <ExplainAnchor
          selector="response-axis"
          index={4}
          pin={{ x: -32, y: yScale(0.5) }}
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
            x={-margin.left + 4}
            y={-28}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-mute)"
          >
            SURVIVED
          </text>
        </ExplainAnchor>

        {/* X-axis caption */}
        <g data-data-layer="true">
          <text
            x={iw / 2}
            y={ih + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            WIDTH = JOINT COUNT (CLASS × SEX)
          </text>
        </g>

        {/* Anchor 1: 1st-class-female bar — the high-survival extreme */}
        <ExplainAnchor
          selector="shaded-fraction"
          index={1}
          pin={{
            x: clamp(anchorFirstClassFemale.x + anchorFirstClassFemale.w / 2, 0, iw),
            y: clamp(anchorFirstClassFemale.shadedY - 14, 0, ih),
          }}
          rect={{
            x: clamp(anchorFirstClassFemale.x, 0, iw),
            y: 0,
            width: clamp(anchorFirstClassFemale.w, 0, iw),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: 3rd-class-male bar — the low-survival extreme */}
        <ExplainAnchor
          selector="equal-height-bar"
          index={2}
          pin={{
            x: clamp(anchorThirdClassMale.x + anchorThirdClassMale.w / 2, 0, iw),
            y: clamp(anchorThirdClassMale.shadedY + 18, 0, ih),
          }}
          rect={{
            x: clamp(anchorThirdClassMale.x, 0, iw),
            y: 0,
            width: clamp(anchorThirdClassMale.w, 0, iw),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: Crew-male bar — shows width-encoding of joint count */}
        <ExplainAnchor
          selector="bar-width"
          index={3}
          pin={{
            x: clamp(anchorCrewMale.x + anchorCrewMale.w / 2, 0, iw),
            y: ih + 14,
          }}
          rect={{
            x: clamp(anchorCrewMale.x, 0, iw),
            y: 0,
            width: clamp(anchorCrewMale.w, 0, iw),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: class headers (the outer predictor) */}
        <ExplainAnchor
          selector="predictor-labels"
          index={5}
          pin={{ x: iw / 2, y: -32 }}
          rect={{ x: 0, y: -margin.top, width: iw, height: margin.top - 4 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
