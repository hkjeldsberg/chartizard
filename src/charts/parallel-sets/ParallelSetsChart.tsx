"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Canonical Titanic counts (total 2201) across three categorical axes:
// Class → Sex → Survived. Joint counts taken from the standard
// Dawson (1995) cross-classification — the dataset Kosara used when
// introducing parallel sets, and still the teaching default.
//
// Axis totals (from the joint counts below):
//   Class:    1st=325, 2nd=285, 3rd=706, Crew=885        → 2201
//   Sex:      Male=1731, Female=470                      → 2201
//   Survived: Yes=711, No=1490                           → 2201

type ClassKey = "1st" | "2nd" | "3rd" | "Crew";
type SexKey = "Male" | "Female";
type SurvivedKey = "Yes" | "No";

interface ClassSex {
  cls: ClassKey;
  sex: SexKey;
  value: number;
}
interface SexSurvived {
  sex: SexKey;
  survived: SurvivedKey;
  value: number;
}

const CLASS_SEX: ReadonlyArray<ClassSex> = [
  { cls: "1st", sex: "Male", value: 180 },
  { cls: "1st", sex: "Female", value: 145 },
  { cls: "2nd", sex: "Male", value: 179 },
  { cls: "2nd", sex: "Female", value: 106 },
  { cls: "3rd", sex: "Male", value: 510 },
  { cls: "3rd", sex: "Female", value: 196 },
  { cls: "Crew", sex: "Male", value: 862 },
  { cls: "Crew", sex: "Female", value: 23 },
];

const SEX_SURVIVED: ReadonlyArray<SexSurvived> = [
  { sex: "Male", survived: "No", value: 1364 },
  { sex: "Male", survived: "Yes", value: 367 },
  { sex: "Female", survived: "No", value: 126 },
  { sex: "Female", survived: "Yes", value: 344 },
];

// Axis ordering. Class is count-ascending (1st, 2nd, 3rd, Crew) which
// happens to be the conventional label order too. Sex and Survived are
// placed Male-over-Female and No-over-Yes so that a large chunk of the
// Male ribbon from 3rd class visibly crosses the Female→Yes ribbon — the
// crossing IS the chart's point about survival imbalance.
const CLASS_ORDER: ReadonlyArray<ClassKey> = ["1st", "2nd", "3rd", "Crew"];
const SEX_ORDER: ReadonlyArray<SexKey> = ["Male", "Female"];
const SURVIVED_ORDER: ReadonlyArray<SurvivedKey> = ["No", "Yes"];

const TOTAL = 2201;

interface PlacedSegment {
  key: string;
  label: string;
  count: number;
  x0: number;
  x1: number;
  y0: number;
  y1: number;
}

interface PlacedRibbon {
  sourceKey: string;
  targetKey: string;
  value: number;
  sx: number;
  tx: number;
  sy0: number;
  sy1: number;
  ty0: number;
  ty1: number;
}

interface Props {
  width: number;
  height: number;
}

// Bezier ribbon path: source edge at x=sx (full vertical span [sy0,sy1])
// to target edge at x=tx (span [ty0,ty1]). Top curve outbound, bottom
// curve back, closed.
function ribbonPath(r: PlacedRibbon): string {
  const mx = (r.sx + r.tx) / 2;
  return [
    `M${r.sx},${r.sy0}`,
    `C${mx},${r.sy0} ${mx},${r.ty0} ${r.tx},${r.ty0}`,
    `L${r.tx},${r.ty1}`,
    `C${mx},${r.ty1} ${mx},${r.sy1} ${r.sx},${r.sy1}`,
    "Z",
  ].join(" ");
}

// Highlight stroke for one specific class — used to show how a single
// category "colours" every ribbon it touches. We pick 3rd class because
// it's the largest single class bar and because its survival tilt is
// what the Titanic illustration is famous for showing.
const HIGHLIGHT_CLASS: ClassKey = "3rd";

export function ParallelSetsChart({ width, height }: Props) {
  const margin = { top: 28, right: 76, bottom: 32, left: 76 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const layout = useMemo(() => {
    // Axis geometry.
    const axisWidth = 12;
    const xClass = 0;
    const xSex = Math.max(0, (iw - axisWidth) / 2);
    const xSurv = Math.max(0, iw - axisWidth);

    // Within-axis padding that scales with height.
    const padWithin = Math.min(6, ih * 0.02);

    // Place segments along an axis given its ordered keys + counts. The
    // segments stack top-to-bottom and together consume the full plot
    // height, minus the total padding between segments.
    function placeAxis<K extends string>(
      axisKey: "class" | "sex" | "survived",
      order: ReadonlyArray<K>,
      counts: Record<K, number>,
      x: number,
    ): Record<K, PlacedSegment> {
      const n = order.length;
      const padTotal = padWithin * Math.max(0, n - 1);
      const scale = ih === 0 ? 0 : (ih - padTotal) / TOTAL;
      const placed = {} as Record<K, PlacedSegment>;
      let y = 0;
      for (const key of order) {
        const count = counts[key];
        const h = Math.max(1, count * scale);
        placed[key] = {
          key: `${axisKey}:${key}`,
          label: String(key),
          count,
          x0: x,
          x1: x + axisWidth,
          y0: y,
          y1: y + h,
        };
        y += h + padWithin;
      }
      return placed;
    }

    const classCounts: Record<ClassKey, number> = {
      "1st": 325,
      "2nd": 285,
      "3rd": 706,
      Crew: 885,
    };
    const sexCounts: Record<SexKey, number> = { Male: 1731, Female: 470 };
    const survivedCounts: Record<SurvivedKey, number> = { Yes: 711, No: 1490 };

    const classSegs = placeAxis<ClassKey>(
      "class",
      CLASS_ORDER,
      classCounts,
      xClass,
    );
    const sexSegs = placeAxis<SexKey>("sex", SEX_ORDER, sexCounts, xSex);
    const survSegs = placeAxis<SurvivedKey>(
      "survived",
      SURVIVED_ORDER,
      survivedCounts,
      xSurv,
    );

    // Build ribbons between Class → Sex and Sex → Survived. Inside
    // each source segment ribbons stack in the target axis's order;
    // inside each target segment they stack in the source axis's
    // order. This is the same cursor pattern the alluvial uses,
    // producing deterministic layout with controlled crossings.
    //
    // Each axis has a slightly different vertical padding total (more
    // sub-categories → more gaps) so we derive a per-axis unit scale.
    const classPadTotal = padWithin * (CLASS_ORDER.length - 1);
    const unitScale = ih === 0 ? 0 : (ih - classPadTotal) / TOTAL;
    const sexPadTotal = padWithin * (SEX_ORDER.length - 1);
    const sexUnit = ih === 0 ? 0 : (ih - sexPadTotal) / TOTAL;
    const survPadTotal = padWithin * (SURVIVED_ORDER.length - 1);
    const survUnit = ih === 0 ? 0 : (ih - survPadTotal) / TOTAL;

    // Cursor offsets for stacking ribbons inside each segment.
    const cursorClassRight: Record<string, number> = {};
    const cursorSexLeft: Record<string, number> = {};
    const cursorSexRight: Record<string, number> = {};
    const cursorSurvLeft: Record<string, number> = {};

    const classSexRibbons: PlacedRibbon[] = [];
    // Iterate in source order then target order so ribbons stack in a
    // predictable way on both sides.
    for (const cls of CLASS_ORDER) {
      for (const sex of SEX_ORDER) {
        const hit = CLASS_SEX.find((d) => d.cls === cls && d.sex === sex);
        if (!hit || hit.value === 0) continue;
        const srcSeg = classSegs[cls];
        const tgtSeg = sexSegs[sex];
        const hSrc = hit.value * unitScale;
        const hTgt = hit.value * sexUnit;
        const sCur = cursorClassRight[cls] ?? 0;
        const tCur = cursorSexLeft[sex] ?? 0;
        classSexRibbons.push({
          sourceKey: `class:${cls}`,
          targetKey: `sex:${sex}`,
          value: hit.value,
          sx: srcSeg.x1,
          tx: tgtSeg.x0,
          sy0: srcSeg.y0 + sCur,
          sy1: srcSeg.y0 + sCur + hSrc,
          ty0: tgtSeg.y0 + tCur,
          ty1: tgtSeg.y0 + tCur + hTgt,
        });
        cursorClassRight[cls] = sCur + hSrc;
        cursorSexLeft[sex] = tCur + hTgt;
      }
    }

    const sexSurvRibbons: PlacedRibbon[] = [];
    for (const sex of SEX_ORDER) {
      for (const surv of SURVIVED_ORDER) {
        const hit = SEX_SURVIVED.find(
          (d) => d.sex === sex && d.survived === surv,
        );
        if (!hit || hit.value === 0) continue;
        const srcSeg = sexSegs[sex];
        const tgtSeg = survSegs[surv];
        const hSrc = hit.value * sexUnit;
        const hTgt = hit.value * survUnit;
        const sCur = cursorSexRight[sex] ?? 0;
        const tCur = cursorSurvLeft[surv] ?? 0;
        sexSurvRibbons.push({
          sourceKey: `sex:${sex}`,
          targetKey: `survived:${surv}`,
          value: hit.value,
          sx: srcSeg.x1,
          tx: tgtSeg.x0,
          sy0: srcSeg.y0 + sCur,
          sy1: srcSeg.y0 + sCur + hSrc,
          ty0: tgtSeg.y0 + tCur,
          ty1: tgtSeg.y0 + tCur + hTgt,
        });
        cursorSexRight[sex] = sCur + hSrc;
        cursorSurvLeft[surv] = tCur + hTgt;
      }
    }

    return {
      classSegs,
      sexSegs,
      survSegs,
      classSexRibbons,
      sexSurvRibbons,
      axisWidth,
      xClass,
      xSex,
      xSurv,
    };
  }, [iw, ih]);

  const {
    classSegs,
    sexSegs,
    survSegs,
    classSexRibbons,
    sexSurvRibbons,
    axisWidth,
    xClass,
    xSex,
    xSurv,
  } = layout;

  // A ribbon "originates" in the class axis when stage=0, and in the
  // sex axis when stage=1. For the class×sex set it paints ink; for the
  // sex×survived set we tint Yes ribbons in ink and No ribbons in a
  // muted sand so survival has a colour key beyond position.
  function ribbonFill(r: PlacedRibbon): string {
    if (r.targetKey === "survived:Yes") return "var(--color-ink)";
    if (r.targetKey === "survived:No") return "#8a7a52";
    // class×sex set — colour by class so the "3rd class" story survives
    // into the right half of the chart.
    if (r.sourceKey === `class:${HIGHLIGHT_CLASS}`) return "var(--color-ink)";
    return "var(--color-ink)";
  }

  function ribbonOpacity(r: PlacedRibbon): number {
    if (r.sourceKey === `class:${HIGHLIGHT_CLASS}`) return 0.55;
    return 0.3;
  }

  // Pick anchor targets.
  const thirdClassSeg = classSegs["3rd"];
  const thirdMaleRibbon = classSexRibbons.find(
    (r) => r.sourceKey === "class:3rd" && r.targetKey === "sex:Male",
  );
  const crewFemaleRibbon = classSexRibbons.find(
    (r) => r.sourceKey === "class:Crew" && r.targetKey === "sex:Female",
  );
  // The Male → Survived=Yes ribbon is the visible crossing: it leaves
  // the middle axis high (Male is stacked on top) and lands low on the
  // right axis (Yes sits below No), so its path visibly crosses the
  // Female → Survived=No ribbon going the other direction.
  const maleYesRibbon = sexSurvRibbons.find(
    (r) => r.sourceKey === "sex:Male" && r.targetKey === "survived:Yes",
  );
  const survivedYesSeg = survSegs["Yes"];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Parallel sets diagram"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Axis headers */}
        <g data-data-layer="true">
          {[
            { label: "CLASS", x: xClass + axisWidth / 2 },
            { label: "SEX", x: xSex + axisWidth / 2 },
            { label: "SURVIVED", x: xSurv + axisWidth / 2 },
          ].map((h) => (
            <text
              key={h.label}
              x={h.x}
              y={-12}
              textAnchor="middle"
              fontFamily="var(--font-mono)"
              fontSize={10}
              fontWeight={500}
              fill="var(--color-ink-mute)"
            >
              {h.label}
            </text>
          ))}
        </g>

        {/* Ribbons (behind axis bars) */}
        <g data-data-layer="true">
          {[...classSexRibbons, ...sexSurvRibbons].map((r, i) => (
            <path
              key={`rib-${i}`}
              d={ribbonPath(r)}
              fill={ribbonFill(r)}
              fillOpacity={ribbonOpacity(r)}
              stroke="none"
            />
          ))}
        </g>

        {/* Axis bars — one rect per sub-category, stacked */}
        <g data-data-layer="true">
          {[
            ...CLASS_ORDER.map((k) => classSegs[k]),
            ...SEX_ORDER.map((k) => sexSegs[k]),
            ...SURVIVED_ORDER.map((k) => survSegs[k]),
          ].map((s) => (
            <rect
              key={s.key}
              x={s.x0}
              y={s.y0}
              width={s.x1 - s.x0}
              height={Math.max(1, s.y1 - s.y0)}
              fill="var(--color-ink)"
              stroke="var(--color-surface)"
              strokeWidth={0.5}
            />
          ))}
        </g>

        {/* Sub-category labels — class labels to the left of the bar,
            sex labels to the left of the middle bar, survived labels
            to the right of the last bar. */}
        <g data-data-layer="true">
          {CLASS_ORDER.map((k) => {
            const s = classSegs[k];
            const ly = (s.y0 + s.y1) / 2;
            return (
              <g key={`lbl-c-${k}`}>
                <text
                  x={s.x0 - 6}
                  y={ly - 5}
                  textAnchor="end"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {k}
                </text>
                <text
                  x={s.x0 - 6}
                  y={ly + 6}
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
          {SEX_ORDER.map((k) => {
            const s = sexSegs[k];
            const ly = (s.y0 + s.y1) / 2;
            return (
              <g key={`lbl-s-${k}`}>
                <text
                  x={s.x1 + 6}
                  y={ly - 5}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {k}
                </text>
                <text
                  x={s.x1 + 6}
                  y={ly + 6}
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
          {SURVIVED_ORDER.map((k) => {
            const s = survSegs[k];
            const ly = (s.y0 + s.y1) / 2;
            return (
              <g key={`lbl-sv-${k}`}>
                <text
                  x={s.x1 + 6}
                  y={ly - 5}
                  textAnchor="start"
                  dominantBaseline="central"
                  fontFamily="var(--font-mono)"
                  fontSize={10}
                  fontWeight={500}
                  fill="var(--color-ink)"
                >
                  {k}
                </text>
                <text
                  x={s.x1 + 6}
                  y={ly + 6}
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

        {/* Anchors — 7 total, all render unconditionally. Rect clamping
            keeps hit regions inside the plot area. */}

        {/* 1. Axis bar — the 3rd-class segment (largest single class bar) */}
        <ExplainAnchor
          selector="axis-bar"
          index={1}
          pin={{
            x: thirdClassSeg.x0 - 44,
            y: (thirdClassSeg.y0 + thirdClassSeg.y1) / 2 + 16,
          }}
          rect={{
            x: Math.max(0, thirdClassSeg.x0 - 2),
            y: thirdClassSeg.y0,
            width: Math.min(
              iw - Math.max(0, thirdClassSeg.x0 - 2),
              axisWidth + 4,
            ),
            height: Math.max(6, thirdClassSeg.y1 - thirdClassSeg.y0),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Ribbon — the 3rd-class → Male joint (widest class×sex ribbon) */}
        {thirdMaleRibbon && (
          <ExplainAnchor
            selector="ribbon"
            index={2}
            pin={{
              x: (thirdMaleRibbon.sx + thirdMaleRibbon.tx) / 2,
              y:
                (thirdMaleRibbon.sy0 +
                  thirdMaleRibbon.sy1 +
                  thirdMaleRibbon.ty0 +
                  thirdMaleRibbon.ty1) /
                  4 -
                18,
            }}
            rect={{
              x: thirdMaleRibbon.sx,
              y: Math.min(thirdMaleRibbon.sy0, thirdMaleRibbon.ty0),
              width: Math.max(2, thirdMaleRibbon.tx - thirdMaleRibbon.sx),
              height:
                Math.max(thirdMaleRibbon.sy1, thirdMaleRibbon.ty1) -
                Math.min(thirdMaleRibbon.sy0, thirdMaleRibbon.ty0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 3. Ribbon width — contrast the thick Crew→Male ribbon with the
            sliver Crew→Female. Anchor the skinny one; that's where the
            quantity encoding pays off visually. */}
        {crewFemaleRibbon && (
          <ExplainAnchor
            selector="ribbon-width"
            index={3}
            pin={{
              x: (crewFemaleRibbon.sx + crewFemaleRibbon.tx) / 2,
              y: (crewFemaleRibbon.ty0 + crewFemaleRibbon.ty1) / 2 + 18,
            }}
            rect={{
              x: crewFemaleRibbon.sx,
              y: Math.min(crewFemaleRibbon.sy0, crewFemaleRibbon.ty0) - 2,
              width: Math.max(2, crewFemaleRibbon.tx - crewFemaleRibbon.sx),
              height:
                Math.max(4, crewFemaleRibbon.ty1 - crewFemaleRibbon.ty0) + 4,
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 4. Axis label — the "CLASS" header over the left axis */}
        <ExplainAnchor
          selector="axis-label"
          index={4}
          pin={{ x: xClass + axisWidth / 2, y: -26 }}
          rect={{
            x: 0,
            y: 0,
            width: Math.max(8, Math.min(iw, axisWidth + 8)),
            height: Math.max(6, Math.min(ih, 12)),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Axis ordering — the full left axis stack (shows the choice
            of ordering categories within an axis). */}
        <ExplainAnchor
          selector="axis-ordering"
          index={5}
          pin={{ x: xClass - 48, y: ih / 2 }}
          rect={{
            x: 0,
            y: 0,
            width: Math.min(iw, axisWidth + 2),
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Crossing — the Male→Yes ribbon leaves the top of the Sex
            axis and arrives at the lower-right Yes segment, visibly
            crossing the Female→No ribbon going the other way. The
            crossing is the structural signal of non-independence. */}
        {maleYesRibbon && (
          <ExplainAnchor
            selector="crossing"
            index={6}
            pin={{
              x: (maleYesRibbon.sx + maleYesRibbon.tx) / 2,
              y:
                (maleYesRibbon.sy0 +
                  maleYesRibbon.sy1 +
                  maleYesRibbon.ty0 +
                  maleYesRibbon.ty1) /
                  4 -
                20,
            }}
            rect={{
              x: maleYesRibbon.sx,
              y: Math.min(maleYesRibbon.sy0, maleYesRibbon.ty0),
              width: Math.max(2, maleYesRibbon.tx - maleYesRibbon.sx),
              height:
                Math.max(maleYesRibbon.sy1, maleYesRibbon.ty1) -
                Math.min(maleYesRibbon.sy0, maleYesRibbon.ty0),
            }}
          >
            <g />
          </ExplainAnchor>
        )}

        {/* 7. Survived=Yes sub-category — the right axis's "Yes" segment,
            anchored to the right where its label sits. */}
        <ExplainAnchor
          selector="survived-yes"
          index={7}
          pin={{
            x: survivedYesSeg.x1 + 52,
            y: (survivedYesSeg.y0 + survivedYesSeg.y1) / 2,
          }}
          rect={{
            x: Math.max(0, survivedYesSeg.x0 - 2),
            y: survivedYesSeg.y0,
            width: Math.min(
              iw - Math.max(0, survivedYesSeg.x0 - 2),
              axisWidth + 4,
            ),
            height: Math.max(6, survivedYesSeg.y1 - survivedYesSeg.y0),
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
