"use client";

import { Bar } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { age: string; male: number; female: number };

// Japan 2024, age-sex distribution in thousands. Synthetic but plausible:
// Japan is the textbook example of an *inverted* pyramid — more elderly
// than young, the post-WWII baby-boom bulge sitting around age 50-55, and
// a pronounced female-longevity bulge at 85+. Ordered oldest-first so the
// bracket list reads top-to-bottom, young at the base.
const DATA: ReadonlyArray<Row> = [
  { age: "85+", male: 1300, female: 3000 },
  { age: "80–84", male: 2200, female: 3300 },
  { age: "75–79", male: 3200, female: 4000 },
  { age: "70–74", male: 4200, female: 4700 },
  { age: "65–69", male: 4000, female: 4300 },
  { age: "60–64", male: 3800, female: 3900 },
  { age: "55–59", male: 4200, female: 4200 },
  { age: "50–54", male: 4600, female: 4500 },
  { age: "45–49", male: 4400, female: 4300 },
  { age: "40–44", male: 3900, female: 3800 },
  { age: "35–39", male: 3500, female: 3400 },
  { age: "30–34", male: 3200, female: 3100 },
  { age: "25–29", male: 3000, female: 2900 },
  { age: "20–24", male: 2900, female: 2800 },
  { age: "15–19", male: 2800, female: 2700 },
  { age: "10–14", male: 2700, female: 2600 },
  { age: "5–9", male: 2500, female: 2400 },
  { age: "0–4", male: 2300, female: 2200 },
];

interface Props {
  width: number;
  height: number;
}

export function PopulationPyramidChart({ width, height }: Props) {
  const margin = { top: 32, right: 40, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Reserve a small centre gutter for the age labels sitting on the axis.
  const gutter = 44;
  const sideWidth = Math.max(0, (iw - gutter) / 2);
  const centreX = iw / 2;

  // Shared value scale — both halves map 0..maxValue onto sideWidth so the
  // two sides are directly comparable. Domain padded a touch for breathing
  // room on the longest bar.
  const maxValue = DATA.reduce(
    (m, d) => Math.max(m, d.male, d.female),
    0,
  );
  const valueScale = scaleLinear<number>({
    domain: [0, maxValue],
    range: [0, sideWidth],
    nice: true,
  });

  const yScale = scaleBand<string>({
    domain: DATA.map((d) => d.age),
    range: [0, ih],
    padding: 0.22,
  });

  const bh = yScale.bandwidth();
  const ticks = valueScale.ticks(4).filter((t) => t > 0);

  // Representative male bar: 45–49, a row adjacent to the bulge so the
  // male anchor and the bulge anchor land near each other but explain
  // different concepts without overlapping.
  const maleRow = DATA.find((d) => d.age === "45–49") ?? DATA[0];
  const maleY = yScale(maleRow.age) ?? 0;
  const maleW = valueScale(maleRow.male);

  // Representative female bar: same row, opposite side, so the anchors sit
  // symmetrically across the centre axis.
  const femaleRow = maleRow;
  const femaleY = maleY;
  const femaleW = valueScale(femaleRow.female);

  // Bulge — the baby-boom peak. 50–54 is the single widest pair of bars.
  const bulgeRow = DATA.find((d) => d.age === "50–54") ?? DATA[0];
  const bulgeY = yScale(bulgeRow.age) ?? 0;
  const bulgeMaleW = valueScale(bulgeRow.male);
  const bulgeFemaleW = valueScale(bulgeRow.female);

  // Top asymmetry — 85+ row where female count is ~2.3× the male count.
  const topRow = DATA[0];
  const topY = yScale(topRow.age) ?? 0;
  const topMaleW = valueScale(topRow.male);
  const topFemaleW = valueScale(topRow.female);

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Population pyramid"
    >
      <Group left={margin.left} top={margin.top}>
        {/* Side headers */}
        <g data-data-layer="true">
          <text
            x={centreX - gutter / 2 - sideWidth / 2}
            y={-14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            MALE
          </text>
          <text
            x={centreX + gutter / 2 + sideWidth / 2}
            y={-14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            FEMALE
          </text>
        </g>

        {/* Value gridlines on both sides — dashed tickmarks receding from the
            centre so the eye can trace a bar's width back to a number. */}
        <g data-data-layer="true">
          {ticks.map((t) => {
            const dx = valueScale(t);
            return (
              <g key={t}>
                <line
                  x1={centreX - gutter / 2 - dx}
                  x2={centreX - gutter / 2 - dx}
                  y1={0}
                  y2={ih}
                  stroke="var(--color-hairline)"
                  strokeDasharray="2 3"
                />
                <line
                  x1={centreX + gutter / 2 + dx}
                  x2={centreX + gutter / 2 + dx}
                  y1={0}
                  y2={ih}
                  stroke="var(--color-hairline)"
                  strokeDasharray="2 3"
                />
              </g>
            );
          })}
        </g>

        {/* Male bars — grow leftward from (centreX - gutter/2) toward 0. */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.age) ?? 0;
            const w = valueScale(d.male);
            return (
              <Bar
                key={`m-${d.age}`}
                x={centreX - gutter / 2 - w}
                y={y}
                width={w}
                height={bh}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Female bars — grow rightward from (centreX + gutter/2). Teal
            token matches the horizontal-bar reference palette and gives
            the chart a non-colour-only cue alongside the MALE/FEMALE
            headers. */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const y = yScale(d.age) ?? 0;
            const w = valueScale(d.female);
            return (
              <Bar
                key={`f-${d.age}`}
                x={centreX + gutter / 2}
                y={y}
                width={w}
                height={bh}
                fill="#4a6a68"
              />
            );
          })}
        </g>

        {/* Centre axis — the dividing line. Age labels sit inside the
            gutter so the axis does double duty as both the zero-line and
            the categorical scale. */}
        <g data-data-layer="true">
          <line
            x1={centreX}
            x2={centreX}
            y1={0}
            y2={ih}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {DATA.map((d) => {
            const y = (yScale(d.age) ?? 0) + bh / 2;
            return (
              <text
                key={`age-${d.age}`}
                x={centreX}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fill="var(--color-ink-soft)"
              >
                {d.age}
              </text>
            );
          })}
        </g>

        {/* Value-axis tick labels along the bottom, mirrored on each side. */}
        <g data-data-layer="true">
          {ticks.map((t) => {
            const dx = valueScale(t);
            return (
              <g key={`tl-${t}`}>
                <text
                  x={centreX - gutter / 2 - dx}
                  y={ih + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {t}
                </text>
                <text
                  x={centreX + gutter / 2 + dx}
                  y={ih + 14}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fill="var(--color-ink-soft)"
                >
                  {t}
                </text>
              </g>
            );
          })}
          <text
            x={centreX}
            y={ih + 32}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            POPULATION (THOUSANDS)
          </text>
        </g>

        {/* Male bar — representative row (45–49). */}
        <ExplainAnchor
          selector="male-bar"
          index={1}
          pin={{
            x: Math.max(12, centreX - gutter / 2 - maleW - 12),
            y: maleY + bh / 2,
          }}
          rect={{
            x: Math.max(0, centreX - gutter / 2 - maleW),
            y: maleY,
            width: maleW,
            height: bh,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Female bar — mirror row, opposite side. */}
        <ExplainAnchor
          selector="female-bar"
          index={2}
          pin={{
            x: Math.min(iw - 12, centreX + gutter / 2 + femaleW + 12),
            y: femaleY + bh / 2,
          }}
          rect={{
            x: centreX + gutter / 2,
            y: femaleY,
            width: Math.min(iw - (centreX + gutter / 2), femaleW),
            height: bh,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Centre axis — the vertical dividing line at age. Narrow rect
            along the ink line itself so it doesn't fight with the
            age-axis label anchor for hit targets. */}
        <ExplainAnchor
          selector="centre-axis"
          index={3}
          pin={{ x: centreX + 14, y: ih + 16 }}
          rect={{
            x: centreX - 5,
            y: 0,
            width: 10,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Bulge — post-WWII baby boom (50–54). Rect covers both sides of
            this row so hovering either bar triggers the explanation. */}
        <ExplainAnchor
          selector="bulge"
          index={4}
          pin={{
            x: Math.max(12, centreX - gutter / 2 - bulgeMaleW - 12),
            y: bulgeY + bh / 2,
          }}
          rect={{
            x: Math.max(0, centreX - gutter / 2 - bulgeMaleW),
            y: bulgeY,
            width: Math.min(iw, bulgeMaleW + gutter + bulgeFemaleW),
            height: bh,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Top asymmetry — 85+ row, female longevity. Rect covers the full
            85+ row on both sides so the hover target is generous. */}
        <ExplainAnchor
          selector="top-asymmetry"
          index={5}
          pin={{
            x: Math.min(iw - 12, centreX + gutter / 2 + topFemaleW + 12),
            y: topY + bh / 2,
          }}
          rect={{
            x: Math.max(0, centreX - gutter / 2 - topMaleW),
            y: topY,
            width: Math.min(iw, topMaleW + gutter + topFemaleW),
            height: bh,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Age axis — the categorical scale. The age-bracket labels sit
            inside the gutter flanking the centre line; hover anywhere in
            the gutter (but off the centre line itself) triggers this
            anchor. Two narrow rects, one each side, keep the centre-line
            anchor uncontested. */}
        <ExplainAnchor
          selector="age-axis"
          index={6}
          pin={{ x: centreX - gutter / 2 - 12, y: -16 }}
          rect={{
            x: centreX - gutter / 2,
            y: 0,
            width: gutter / 2 - 5,
            height: ih,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
