"use client";

import { useMemo } from "react";
import { Group } from "@visx/group";
import { LinePath, Line } from "@visx/shape";
import { scaleLinear } from "@visx/scale";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Point {
  day: number; // 1..60
  value: number; // minutes
}

const MEAN = 42;
const SIGMA = 8;
const UCL = MEAN + 3 * SIGMA; // 66
const LCL = MEAN - 3 * SIGMA; // 18

// Deterministic Emergency-Room wait-time series. Clusters near 42 minutes with
// a mild shift around days 34-40 (rule-of-7), an explicit spike above UCL on
// day 27, and a specific dip below LCL on day 48.
function generateData(): Point[] {
  let seed = 21;
  const rand = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
  // Box-Muller for a normal-ish variate.
  const gauss = () => {
    const u = 1 - rand();
    const v = rand();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };

  const out: Point[] = [];
  for (let day = 1; day <= 60; day++) {
    const shift = day >= 34 && day <= 40 ? 5 : 0;
    const noise = gauss() * 3.5;
    out.push({ day, value: MEAN + shift + noise });
  }

  out[26] = { day: 27, value: 71 };
  out[47] = { day: 48, value: 14 };

  return out;
}

interface Props {
  width: number;
  height: number;
}

export function ControlChart({ width, height }: Props) {
  const margin = { top: 20, right: 28, bottom: 44, left: 56 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const data = useMemo(() => generateData(), []);

  const xScale = scaleLinear({ domain: [1, 60], range: [0, iw] });
  const yScale = scaleLinear({
    domain: [5, 80],
    range: [ih, 0],
    nice: true,
  });

  const meanY = yScale(MEAN);
  const uclY = yScale(UCL);
  const lclY = yScale(LCL);

  const ooc = data.filter((d) => d.value > UCL || d.value < LCL);

  const day27 = data[26];
  const day27X = xScale(day27.day);
  const day27Y = yScale(day27.value);

  const repPoint = data[9];
  const repX = xScale(repPoint.day);
  const repY = yScale(repPoint.value);

  return (
    <svg width={width} height={height} role="img" aria-label="Control chart">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {yScale.ticks(5).map((t) => (
            <line
              key={t}
              x1={0}
              x2={iw}
              y1={yScale(t)}
              y2={yScale(t)}
              stroke="var(--color-hairline)"
              strokeDasharray="2 3"
            />
          ))}
        </g>

        <g data-data-layer="true">
          <LinePath
            data={data}
            x={(d) => xScale(d.day)}
            y={(d) => yScale(d.value)}
            stroke="var(--color-ink-mute)"
            strokeWidth={1.1}
          />
        </g>

        <g data-data-layer="true">
          {data.map((d) => {
            const isOoc = d.value > UCL || d.value < LCL;
            if (isOoc) return null;
            return (
              <circle
                key={d.day}
                cx={xScale(d.day)}
                cy={yScale(d.value)}
                r={3}
                fill="var(--color-ink)"
              />
            );
          })}
        </g>

        <g data-data-layer="true">
          {ooc.map((d) => (
            <g key={`ooc-${d.day}`}>
              <circle
                cx={xScale(d.day)}
                cy={yScale(d.value)}
                r={5}
                fill="var(--color-page)"
                stroke="#a55a4a"
                strokeWidth={1.6}
              />
              <text
                x={xScale(d.day) + 8}
                y={yScale(d.value) - 6}
                fontFamily="var(--font-mono)"
                fontSize={9}
                fill="#a55a4a"
              >
                D{d.day}
              </text>
            </g>
          ))}
        </g>

        <ExplainAnchor
          selector="ucl-line"
          index={2}
          pin={{ x: iw - 14, y: uclY - 10 }}
          rect={{
            x: 0,
            y: Math.max(0, uclY - 5),
            width: iw,
            height: 10,
          }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: uclY }}
              to={{ x: iw, y: uclY }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={uclY - 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              UCL {UCL}
            </text>
          </g>
        </ExplainAnchor>

        <ExplainAnchor
          selector="mean-line"
          index={1}
          pin={{ x: iw - 14, y: meanY + 10 }}
          rect={{
            x: 0,
            y: Math.max(0, meanY - 5),
            width: iw,
            height: 10,
          }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: meanY }}
              to={{ x: iw, y: meanY }}
              stroke="var(--color-ink)"
              strokeWidth={1.2}
            />
            <text
              x={iw - 2}
              y={meanY - 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              MEAN {MEAN}
            </text>
          </g>
        </ExplainAnchor>

        <ExplainAnchor
          selector="lcl-line"
          index={3}
          pin={{ x: iw - 14, y: lclY + 12 }}
          rect={{
            x: 0,
            y: Math.max(0, Math.min(ih - 10, lclY - 5)),
            width: iw,
            height: 10,
          }}
        >
          <g data-data-layer="true">
            <Line
              from={{ x: 0, y: lclY }}
              to={{ x: iw, y: lclY }}
              stroke="var(--color-ink)"
              strokeWidth={1}
              strokeDasharray="4 3"
            />
            <text
              x={iw - 2}
              y={lclY - 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              LCL {LCL}
            </text>
          </g>
        </ExplainAnchor>

        <ExplainAnchor
          selector="data-point"
          index={4}
          pin={{ x: repX, y: repY - 16 }}
          rect={{
            x: Math.max(0, repX - 8),
            y: Math.max(0, repY - 8),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="out-of-control-point"
          index={5}
          pin={{ x: day27X + 18, y: day27Y - 18 }}
          rect={{
            x: Math.max(0, Math.min(iw - 16, day27X - 8)),
            y: Math.max(0, Math.min(ih - 16, day27Y - 8)),
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        <ExplainAnchor
          selector="y-axis"
          index={6}
          pin={{ x: -32, y: ih / 2 }}
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
            x={-44}
            y={-8}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink-mute)"
          >
            WAIT (MIN)
          </text>
        </ExplainAnchor>

        <g data-data-layer="true">
          <AxisBottom
            top={ih}
            scale={xScale}
            numTicks={6}
            tickFormat={(v) => `D${v}`}
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
            DAY (60-DAY WINDOW)
          </text>
        </g>
      </Group>
    </svg>
  );
}
