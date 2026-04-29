"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { AxisLeft, AxisBottom } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Lexis diagram: x = calendar year, y = age
// Three coordinate systems share the 2D plane:
//   Period  — vertical slices (year)
//   Age     — horizontal slices (age at event)
//   Cohort  — 45° diagonal lines (birth year = calendar year - age)
//
// Data story: 1918 influenza pandemic excess mortality
// The shading spike cuts diagonally across cohorts born ~1890-1900
// (young adults aged ~18-28 in 1918) — the hallmark "W-shaped" mortality curve.

// Birth-cohort diagonals to draw (birth year)
const COHORT_YEARS = [1870, 1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910, 1915, 1920, 1925];

// Year domain
const YEAR_MIN = 1870;
const YEAR_MAX = 1930;

// Age domain
const AGE_MIN = 0;
const AGE_MAX = 60;

// Shading regions for the 1918 influenza epidemic
// Period band: 1918-1920 (vertical strip)
// Age band: 18-35 (horizontal strip)
// Their intersection is the hardest-hit cohort zone
const FLU_YEAR_START = 1917.5;
const FLU_YEAR_END = 1920.5;
const FLU_AGE_START = 16;
const FLU_AGE_END = 38;

export function LexisDiagram({ width, height }: { width: number; height: number }) {
  const margin = { top: 20, right: 24, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleLinear({ domain: [YEAR_MIN, YEAR_MAX], range: [0, iw] });
  const yScale = scaleLinear({ domain: [AGE_MIN, AGE_MAX], range: [ih, 0] });

  // 1918 flu shading in SVG coords
  const fluX1 = xScale(FLU_YEAR_START);
  const fluX2 = xScale(FLU_YEAR_END);
  const fluY1 = yScale(FLU_AGE_END);   // higher age = lower y
  const fluY2 = yScale(FLU_AGE_START);

  // Period-band x
  const periodX = xScale(1918);

  // Cohort diagonal clip: a cohort born in year B has age = year - B
  // We need the line from (max(YEAR_MIN, B+AGE_MIN), min(YEAR_MAX, B+AGE_MAX))
  function cohortLine(birthYear: number): { x1: number; y1: number; x2: number; y2: number } | null {
    // At age=AGE_MIN, year=birthYear+AGE_MIN; at age=AGE_MAX, year=birthYear+AGE_MAX
    const yearAtAgeMin = birthYear + AGE_MIN;
    const yearAtAgeMax = birthYear + AGE_MAX;
    // Clip to [YEAR_MIN, YEAR_MAX]
    const startYear = Math.max(yearAtAgeMin, YEAR_MIN);
    const endYear = Math.min(yearAtAgeMax, YEAR_MAX);
    if (startYear >= endYear) return null;
    const startAge = startYear - birthYear;
    const endAge = endYear - birthYear;
    return {
      x1: xScale(startYear),
      y1: yScale(startAge),
      x2: xScale(endYear),
      y2: yScale(endAge),
    };
  }

  // Representative cohort diagonal anchor: the 1895 birth cohort
  const anchorCohort = cohortLine(1895);
  const cohortPinX = anchorCohort ? (anchorCohort.x1 + anchorCohort.x2) / 2 : 0;
  const cohortPinY = anchorCohort ? (anchorCohort.y1 + anchorCohort.y2) / 2 - 14 : 0;

  return (
    <svg width={width} height={height} role="img" aria-label="Lexis Diagram showing age-period-cohort coordinate system with 1918 influenza pandemic mortality shading">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Background: light grid lines at every 5 years / 10 ages */}
          {[1875, 1880, 1885, 1890, 1895, 1900, 1905, 1910, 1915, 1920, 1925].map((yr) => (
            <line
              key={`vgrid-${yr}`}
              x1={xScale(yr)}
              x2={xScale(yr)}
              y1={0}
              y2={ih}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
            />
          ))}
          {[10, 20, 30, 40, 50].map((age) => (
            <line
              key={`hgrid-${age}`}
              x1={0}
              x2={iw}
              y1={yScale(age)}
              y2={yScale(age)}
              stroke="var(--color-hairline)"
              strokeWidth={0.5}
            />
          ))}

          {/* 1918 flu: period-band shading (vertical, light) */}
          <rect
            x={fluX1}
            y={0}
            width={fluX2 - fluX1}
            height={ih}
            fill="var(--color-ink)"
            fillOpacity={0.06}
          />
          {/* Age-band shading (horizontal, light) */}
          <rect
            x={0}
            y={fluY1}
            width={iw}
            height={fluY2 - fluY1}
            fill="var(--color-ink)"
            fillOpacity={0.06}
          />
          {/* Intersection: the hard-hit cohort zone */}
          <rect
            x={fluX1}
            y={fluY1}
            width={fluX2 - fluX1}
            height={fluY2 - fluY1}
            fill="var(--color-ink)"
            fillOpacity={0.22}
          />

          {/* Cohort diagonal lines (45°) */}
          {COHORT_YEARS.map((yr) => {
            const seg = cohortLine(yr);
            if (!seg) return null;
            const isAffected = yr >= 1885 && yr <= 1902; // young-adult cohorts hit hardest
            return (
              <line
                key={`cohort-${yr}`}
                x1={seg.x1}
                y1={seg.y1}
                x2={seg.x2}
                y2={seg.y2}
                stroke="var(--color-ink)"
                strokeWidth={isAffected ? 1.2 : 0.7}
                strokeOpacity={isAffected ? 0.55 : 0.28}
                strokeDasharray="3 3"
              />
            );
          })}

          {/* Cohort labels at top-right of each diagonal */}
          {COHORT_YEARS.map((yr) => {
            const seg = cohortLine(yr);
            if (!seg) return null;
            // Only label every other cohort to avoid crowding
            if (yr % 10 !== 0) return null;
            return (
              <text
                key={`cohort-label-${yr}`}
                x={seg.x2 + 2}
                y={seg.y2 + 3}
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink-soft)"
                textAnchor="start"
              >
                {yr}
              </text>
            );
          })}

          {/* Period annotation: 1918 label */}
          <text
            x={xScale(1919)}
            y={yScale(AGE_MAX) + 12}
            fontFamily="var(--font-mono)"
            fontSize={8}
            fill="var(--color-ink)"
            textAnchor="middle"
          >
            1918
          </text>
          <text
            x={xScale(1919)}
            y={yScale(AGE_MAX) + 21}
            fontFamily="var(--font-mono)"
            fontSize={7}
            fill="var(--color-ink-soft)"
            textAnchor="middle"
          >
            pandemic
          </text>
        </g>

        {/* Flu period-band anchor */}
        <ExplainAnchor
          selector="period-band"
          index={3}
          pin={{ x: (fluX1 + fluX2) / 2, y: -8 }}
          rect={{ x: fluX1, y: 0, width: fluX2 - fluX1, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Age-band anchor */}
        <ExplainAnchor
          selector="age-band"
          index={4}
          pin={{ x: iw + 10, y: (fluY1 + fluY2) / 2 }}
          rect={{ x: 0, y: fluY1, width: iw, height: fluY2 - fluY1 }}
        >
          <g />
        </ExplainAnchor>

        {/* Cohort diagonal anchor */}
        <ExplainAnchor
          selector="cohort-diagonal"
          index={5}
          pin={{ x: cohortPinX, y: cohortPinY }}
          rect={
            anchorCohort
              ? {
                  x: anchorCohort.x1,
                  y: Math.min(anchorCohort.y1, anchorCohort.y2) - 4,
                  width: anchorCohort.x2 - anchorCohort.x1,
                  height: Math.abs(anchorCohort.y2 - anchorCohort.y1) + 8,
                }
              : { x: 0, y: 0, width: 0, height: 0 }
          }
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (period / calendar year) */}
        <ExplainAnchor
          selector="x-axis"
          index={1}
          pin={{ x: iw / 2, y: ih + 34 }}
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
            y={ih + 40}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            CALENDAR YEAR (PERIOD)
          </text>
        </ExplainAnchor>

        {/* Y-axis (age) */}
        <ExplainAnchor
          selector="y-axis"
          index={2}
          pin={{ x: -36, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={6}
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
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            AGE
          </text>
        </ExplainAnchor>

        {/* Cohort intersection anchor (the diagonal hotzone) */}
        <ExplainAnchor
          selector="cohort-intersection"
          index={6}
          pin={{ x: (fluX1 + fluX2) / 2, y: (fluY1 + fluY2) / 2 - 10 }}
          rect={{ x: Math.max(0, fluX1), y: Math.max(0, fluY1), width: fluX2 - fluX1, height: fluY2 - fluY1 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
