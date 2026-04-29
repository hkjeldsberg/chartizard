"use client";

import { BarGroup } from "@visx/shape";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = {
  month: string;
  core: number;
  cloud: number;
  services: number;
};

// Monthly revenue by product line, $M.
const DATA: ReadonlyArray<Row> = [
  { month: "Jan", core: 8.2, cloud: 5.4, services: 2.1 },
  { month: "Feb", core: 7.9, cloud: 6.2, services: 2.2 },
  { month: "Mar", core: 7.5, cloud: 7.1, services: 2.4 },
  { month: "Apr", core: 7.2, cloud: 8.0, services: 2.6 },
];

const KEYS = ["core", "cloud", "services"] as const;
type Key = (typeof KEYS)[number];

const KEY_LABELS: Record<Key, string> = {
  core: "Core",
  cloud: "Cloud",
  services: "Services",
};

const KEY_COLOURS: Record<Key, string> = {
  core: "var(--color-ink)",
  cloud: "#4a6a68",
  services: "#8a7a52",
};

interface Props {
  width: number;
  height: number;
}

export function GroupedColumnChart({ width, height }: Props) {
  const margin = { top: 36, right: 20, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const x0Scale = scaleBand<string>({
    domain: DATA.map((d) => d.month),
    range: [0, iw],
    padding: 0.22,
  });

  const x1Scale = scaleBand<Key>({
    domain: KEYS as unknown as Key[],
    range: [0, x0Scale.bandwidth()],
    padding: 0.12,
  });

  const yScale = scaleLinear<number>({
    domain: [0, 10],
    range: [ih, 0],
    nice: true,
  });

  const colour = scaleOrdinal<Key, string>({
    domain: KEYS as unknown as Key[],
    range: KEYS.map((k) => KEY_COLOURS[k]),
  });

  const ticksY = yScale.ticks(5);
  const groupW = x0Scale.bandwidth();
  const subW = x1Scale.bandwidth();

  // Anchor targets — last month (Apr) shows the Cloud-overtakes-Core moment.
  const lastMonth = DATA[DATA.length - 1];
  const lastX0 = x0Scale(lastMonth.month) ?? 0;
  const coreSubX = x1Scale("core") ?? 0;
  const coreColumnX = lastX0 + coreSubX;
  const coreColumnY = yScale(lastMonth.core);

  return (
    <svg width={width} height={height} role="img" aria-label="Grouped column chart">
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
              strokeDasharray={t === 0 ? undefined : "2 3"}
            />
          ))}
        </g>

        {/* Gridline anchor (representative mid-line) */}
        <ExplainAnchor
          selector="gridline"
          index={6}
          pin={{ x: iw + 12, y: yScale(5) }}
          rect={{ x: 0, y: yScale(5) - 4, width: iw, height: 8 }}
        >
          <g />
        </ExplainAnchor>

        {/* Grouped columns */}
        <g data-data-layer="true">
          <BarGroup<Row, Key>
            data={DATA as Row[]}
            keys={KEYS as unknown as Key[]}
            height={ih}
            x0={(d) => d.month}
            x0Scale={x0Scale}
            x1Scale={x1Scale}
            yScale={yScale}
            color={colour}
          >
            {(barGroups) =>
              barGroups.map((barGroup) => (
                <Group key={`bg-${barGroup.index}`} left={barGroup.x0}>
                  {barGroup.bars.map((bar) => (
                    <rect
                      key={`bar-${barGroup.index}-${bar.key}`}
                      x={bar.x}
                      y={bar.y}
                      width={Math.max(0, bar.width)}
                      height={Math.max(0, bar.height)}
                      fill={bar.color}
                    />
                  ))}
                </Group>
              ))
            }
          </BarGroup>
        </g>

        {/* Anchor: a whole month's cluster (Apr) */}
        <ExplainAnchor
          selector="group"
          index={1}
          pin={{ x: lastX0 + groupW / 2, y: -14 }}
          rect={{ x: lastX0, y: 0, width: groupW, height: ih }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor: a single column (Apr / Core) */}
        <ExplainAnchor
          selector="column"
          index={2}
          pin={{ x: coreColumnX + subW / 2, y: coreColumnY - 14 }}
          rect={{
            x: coreColumnX,
            y: coreColumnY,
            width: subW,
            height: ih - coreColumnY,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* X-axis (months) */}
        <ExplainAnchor
          selector="category-axis"
          index={3}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={x0Scale}
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

        {/* Y-axis (revenue) */}
        <ExplainAnchor
          selector="value-axis"
          index={4}
          pin={{ x: -32, y: ih / 2 }}
          rect={{ x: -margin.left, y: 0, width: margin.left, height: ih }}
        >
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => `$${v}M`}
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
        </ExplainAnchor>

        {/* Legend (top) */}
        <g transform={`translate(0, -24)`} data-data-layer="true">
          {KEYS.map((k, i) => (
            <g key={k} transform={`translate(${i * 78}, 0)`}>
              <rect width={10} height={10} fill={KEY_COLOURS[k]} />
              <text
                x={14}
                y={9}
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {KEY_LABELS[k].toUpperCase()}
              </text>
            </g>
          ))}
        </g>
        <ExplainAnchor
          selector="series-legend"
          index={5}
          pin={{ x: KEYS.length * 78 + 8, y: -18 }}
          rect={{ x: 0, y: -28, width: KEYS.length * 78, height: 14 }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
