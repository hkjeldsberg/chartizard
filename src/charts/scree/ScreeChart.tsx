"use client";

import { Bar, LinePath, Line, Circle } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleBand, scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { curveMonotoneX } from "d3-shape";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

type Row = { pc: string; eigenvalue: number };

// Eigenvalues for the first 10 PCs of a standardised MNIST-8x8 digits matrix
// (64 features). PC1/PC2 dominate, a clear elbow at PC3, then asymptote well
// below the Kaiser threshold of 1.
const DATA: ReadonlyArray<Row> = [
  { pc: "PC1", eigenvalue: 4.8 },
  { pc: "PC2", eigenvalue: 3.6 },
  { pc: "PC3", eigenvalue: 1.9 },
  { pc: "PC4", eigenvalue: 1.2 },
  { pc: "PC5", eigenvalue: 0.85 },
  { pc: "PC6", eigenvalue: 0.62 },
  { pc: "PC7", eigenvalue: 0.48 },
  { pc: "PC8", eigenvalue: 0.38 },
  { pc: "PC9", eigenvalue: 0.31 },
  { pc: "PC10", eigenvalue: 0.26 },
];

interface Props {
  width: number;
  height: number;
}

export function ScreeChart({ width, height }: Props) {
  const margin = { top: 24, right: 28, bottom: 48, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const xScale = scaleBand<string>({
    domain: DATA.map((d) => d.pc),
    range: [0, iw],
    padding: 0.3,
  });

  const yMax = Math.ceil(DATA[0].eigenvalue);
  const yScale = scaleLinear<number>({
    domain: [0, yMax],
    range: [ih, 0],
    nice: true,
  });

  const bw = xScale.bandwidth();
  const ticksY = yScale.ticks(5);

  const linePoints = DATA.map((d) => ({
    x: (xScale(d.pc) ?? 0) + bw / 2,
    y: yScale(d.eigenvalue),
    pc: d.pc,
    eigenvalue: d.eigenvalue,
  }));

  // Elbow: the kink at PC3 where the steep drop turns into a long tail.
  const elbowIdx = 2;
  const elbowPoint = linePoints[elbowIdx];

  // Kaiser reference at eigenvalue = 1. Clamp to the plot area for anchor rect.
  const kaiserY = yScale(1);

  // A representative bar — the tallest, PC1.
  const repBarIdx = 0;
  const repBar = DATA[repBarIdx];
  const repBarX = xScale(repBar.pc) ?? 0;
  const repBarY = yScale(repBar.eigenvalue);

  return (
    <svg width={width} height={height} role="img" aria-label="Scree plot">
      <Group left={margin.left} top={margin.top}>
        {/* Horizontal gridlines */}
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

        {/* Kaiser reference line at eigenvalue = 1 */}
        <g data-data-layer="true">
          <Line
            from={{ x: 0, y: kaiserY }}
            to={{ x: iw, y: kaiserY }}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
          <text
            x={iw - 4}
            y={kaiserY - 4}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            KAISER λ=1
          </text>
        </g>

        {/* Bars — one per component */}
        <g data-data-layer="true">
          {DATA.map((d) => {
            const x = xScale(d.pc) ?? 0;
            const y = yScale(d.eigenvalue);
            return (
              <Bar
                key={d.pc}
                x={x}
                y={y}
                width={bw}
                height={ih - y}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        {/* Connecting line + markers */}
        <g data-data-layer="true">
          <LinePath
            data={linePoints}
            x={(d) => d.x}
            y={(d) => d.y}
            curve={curveMonotoneX}
            stroke="#4a6a68"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
          {linePoints.map((p) => (
            <Circle key={p.pc} cx={p.x} cy={p.y} r={2.5} fill="#4a6a68" />
          ))}
        </g>

        {/* Anchor 1: the connecting line (the "scree curve" itself) */}
        <ExplainAnchor
          selector="scree-line"
          index={1}
          pin={{ x: linePoints[1].x, y: linePoints[1].y - 16 }}
          rect={{
            x: Math.max(0, linePoints[0].x - bw / 2),
            y: Math.max(0, linePoints[0].y - 6),
            width: Math.min(iw, linePoints[3].x - linePoints[0].x + bw),
            height: Math.min(ih, linePoints[3].y - linePoints[0].y + 12),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 2: representative bar (PC1) */}
        <ExplainAnchor
          selector="bar"
          index={2}
          pin={{ x: repBarX + bw / 2, y: repBarY - 16 }}
          rect={{ x: repBarX, y: repBarY, width: bw, height: ih - repBarY }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 3: the elbow */}
        <ExplainAnchor
          selector="elbow"
          index={3}
          pin={{ x: elbowPoint.x + 22, y: elbowPoint.y - 14 }}
          rect={{
            x: Math.max(0, elbowPoint.x - bw),
            y: Math.max(0, elbowPoint.y - 10),
            width: Math.min(iw, bw * 2),
            height: Math.min(ih, ih - elbowPoint.y + 20),
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 4: Kaiser line */}
        <ExplainAnchor
          selector="kaiser-line"
          index={4}
          pin={{ x: iw / 3, y: kaiserY - 14 }}
          rect={{ x: 0, y: Math.max(0, kaiserY - 5), width: iw, height: 10 }}
        >
          <g />
        </ExplainAnchor>

        {/* Anchor 5: y-axis (eigenvalue) */}
        <ExplainAnchor
          selector="eigenvalue-axis"
          index={5}
          pin={{ x: -34, y: ih / 2 }}
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
            x={-margin.left + 4}
            y={-10}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            EIGENVALUE
          </text>
        </ExplainAnchor>

        {/* Anchor 6: x-axis (component number) */}
        <ExplainAnchor
          selector="component-axis"
          index={6}
          pin={{ x: iw / 2, y: ih + 34 }}
          rect={{ x: 0, y: ih, width: iw, height: margin.bottom }}
        >
          <AxisBottom
            top={ih}
            scale={xScale}
            stroke="var(--color-ink-mute)"
            tickStroke="var(--color-ink-mute)"
            tickLabelProps={() => ({
              fontFamily: "var(--font-mono)",
              fontSize: 9,
              fill: "var(--color-ink-soft)",
              textAnchor: "middle",
              dy: "0.33em",
            })}
          />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
