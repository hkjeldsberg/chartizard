"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// ---------------------------------------------------------------------------
// Clinical breast-cancer 10-year recurrence nomogram
// Scales: tumor size (0-10 cm), positive nodes (0-40), ER status (−/+),
//         recurrence risk (0-100%)
// Isopleth: patient with 3 cm tumor, 4 positive nodes, ER+  → ~35% risk
// ---------------------------------------------------------------------------

interface Props {
  width: number;
  height: number;
}

// Nomogram layout: 4 vertical scales side by side
// Each scale is a <line> + ticks + label.  We'll position them left-to-right.

// Scale definitions
const SCALES = [
  { key: "tumor", label: "Tumor Size", unit: "cm", min: 0, max: 10 },
  { key: "nodes", label: "Nodes +", unit: "positive", min: 0, max: 40 },
  { key: "er", label: "ER Status", unit: "", min: 0, max: 1 },
  { key: "risk", label: "Recurrence Risk", unit: "%", min: 0, max: 100 },
] as const;

// The patient isopleth threads through:
//   tumor = 3 cm, nodes = 4, ER = positive (+), risk ≈ 35%
const PATIENT = { tumor: 3, nodes: 4, er: 1, risk: 35 };

export function NomogramChart({ width, height }: Props) {
  const margin = { top: 40, right: 28, bottom: 48, left: 28 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Horizontal positions for each scale (evenly spaced)
  const scaleCount: number = SCALES.length;
  const scaleXs = SCALES.map((_, i) =>
    scaleCount <= 1 ? iw / 2 : (i / (scaleCount - 1)) * iw,
  );

  // Vertical linear scale shared (maps [min,max] → [ih, 0])
  const makeVScale = (min: number, max: number) =>
    scaleLinear({ domain: [min, max], range: [ih, 0] });

  const tumorScale = makeVScale(0, 10);
  const nodesScale = makeVScale(0, 40);
  const erScale = makeVScale(0, 1);
  const riskScale = makeVScale(0, 100);

  const vscales = [tumorScale, nodesScale, erScale, riskScale];

  // Map patient values to y positions on each scale
  const isoY = [
    tumorScale(PATIENT.tumor),
    nodesScale(PATIENT.nodes),
    erScale(PATIENT.er),
    riskScale(PATIENT.risk),
  ];

  // Isopleth: polyline connecting the 4 y positions at their respective x's
  const isoPoints = scaleXs.map((x, i) => `${x},${isoY[i]}`).join(" ");

  // Tick helper
  const renderTicks = (
    vscale: ReturnType<typeof makeVScale>,
    x: number,
    min: number,
    max: number,
    steps: number,
    isRight: boolean,
    erMode?: boolean,
  ) => {
    if (erMode) {
      return (
        <>
          <line
            x1={x}
            y1={vscale(0)}
            x2={x + (isRight ? 5 : -5)}
            y2={vscale(0)}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text
            x={x + (isRight ? 10 : -10)}
            y={vscale(0)}
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-soft)"
            textAnchor={isRight ? "start" : "end"}
            dominantBaseline="central"
          >
            −
          </text>
          <line
            x1={x}
            y1={vscale(1)}
            x2={x + (isRight ? 5 : -5)}
            y2={vscale(1)}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <text
            x={x + (isRight ? 10 : -10)}
            y={vscale(1)}
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-soft)"
            textAnchor={isRight ? "start" : "end"}
            dominantBaseline="central"
          >
            +
          </text>
        </>
      );
    }
    const ticks = Array.from({ length: steps + 1 }, (_, i) =>
      min + (i / steps) * (max - min),
    );
    return ticks.map((t) => {
      const y = vscale(t);
      const isMajor = Math.round(t) === t && (t - min) % ((max - min) / steps) < 0.01;
      const tickLen = isMajor ? 6 : 3;
      return (
        <g key={t}>
          <line
            x1={x}
            y1={y}
            x2={x + (isRight ? tickLen : -tickLen)}
            y2={y}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {isMajor && (
            <text
              x={x + (isRight ? tickLen + 4 : -(tickLen + 4))}
              y={y}
              fontSize={9}
              fontFamily="var(--font-mono)"
              fill="var(--color-ink-soft)"
              textAnchor={isRight ? "start" : "end"}
              dominantBaseline="central"
            >
              {Math.round(t)}
            </text>
          )}
        </g>
      );
    });
  };

  // For reference: scale tick sides (odd scales tick right, even tick left for readability)
  const tickRight = [false, true, false, true];

  return (
    <svg
      width={width}
      height={height}
      role="img"
      aria-label="Nomogram — clinical breast-cancer recurrence risk"
    >
      <Group left={margin.left} top={margin.top}>
        {/* --- Data layer: scales + tick marks --- */}
        <g data-data-layer="true">
          {SCALES.map((s, i) => {
            const x = scaleXs[i];
            const vscale = vscales[i];
            const isRight = tickRight[i];
            const erMode = s.key === "er";
            const steps = erMode ? 1 : s.key === "nodes" ? 8 : s.key === "risk" ? 10 : 10;
            return (
              <g key={s.key}>
                {/* Vertical scale line */}
                <line
                  x1={x}
                  y1={0}
                  x2={x}
                  y2={ih}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
                {/* Ticks */}
                {renderTicks(
                  vscale as ReturnType<typeof makeVScale>,
                  x,
                  s.min,
                  s.max,
                  steps,
                  isRight,
                  erMode,
                )}
                {/* Scale bottom cap */}
                <line
                  x1={x - 4}
                  y1={ih}
                  x2={x + 4}
                  y2={ih}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
                {/* Scale top cap */}
                <line
                  x1={x - 4}
                  y1={0}
                  x2={x + 4}
                  y2={0}
                  stroke="var(--color-ink)"
                  strokeWidth={1.5}
                />
              </g>
            );
          })}
        </g>

        {/* --- Isopleth line (the drawn alignment line) --- */}
        <ExplainAnchor
          selector="isopleth"
          index={1}
          pin={{ x: iw / 2, y: Math.min(...isoY) - 14 }}
          rect={{
            x: Math.min(...scaleXs) - 8,
            y: Math.min(...isoY) - 8,
            width: Math.max(...scaleXs) - Math.min(...scaleXs) + 16,
            height: Math.max(...isoY) - Math.min(...isoY) + 16,
          }}
        >
          <polyline
            points={isoPoints}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.8}
            strokeDasharray="5 3"
            strokeLinecap="round"
            strokeLinejoin="round"
            data-data-layer="true"
          />
          {/* Dots at intersections */}
          {scaleXs.map((x, i) => (
            <circle
              key={i}
              cx={x}
              cy={isoY[i]}
              r={3.5}
              fill="var(--color-ink)"
              data-data-layer="true"
            />
          ))}
        </ExplainAnchor>

        {/* --- Scale 1: Tumor Size --- */}
        <ExplainAnchor
          selector="tumor-scale"
          index={2}
          pin={{ x: scaleXs[0] - 28, y: ih / 3 }}
          rect={{
            x: scaleXs[0] - 36,
            y: 0,
            width: 36,
            height: ih,
          }}
        >
          {/* Scale label above */}
          <text
            x={scaleXs[0]}
            y={-14}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            TUMOR SIZE (cm)
          </text>
        </ExplainAnchor>

        {/* --- Scale 2: Positive Nodes --- */}
        <ExplainAnchor
          selector="nodes-scale"
          index={3}
          pin={{ x: scaleXs[1] + 28, y: ih / 3 }}
          rect={{
            x: scaleXs[1],
            y: 0,
            width: Math.max(0, scaleXs[2] - scaleXs[1] - 4),
            height: ih,
          }}
        >
          <text
            x={scaleXs[1]}
            y={-14}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            NODES +
          </text>
        </ExplainAnchor>

        {/* --- Scale 3: ER Status --- */}
        <ExplainAnchor
          selector="er-scale"
          index={4}
          pin={{ x: scaleXs[2] - 26, y: ih / 2 }}
          rect={{
            x: scaleXs[2] - 32,
            y: 0,
            width: 32,
            height: ih,
          }}
        >
          <text
            x={scaleXs[2]}
            y={-14}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            ER STATUS
          </text>
        </ExplainAnchor>

        {/* --- Scale 4: Recurrence Risk --- */}
        <ExplainAnchor
          selector="risk-scale"
          index={5}
          pin={{ x: scaleXs[3] + 28, y: ih * 0.6 }}
          rect={{
            x: scaleXs[3],
            y: 0,
            width: margin.right,
            height: ih,
          }}
        >
          <text
            x={scaleXs[3]}
            y={-14}
            textAnchor="middle"
            fontSize={9}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            10-YR RISK (%)
          </text>
        </ExplainAnchor>

        {/* --- Patient annotation below axis --- */}
        <ExplainAnchor
          selector="patient-annotation"
          index={6}
          pin={{ x: iw / 2, y: ih + 28 }}
          rect={{ x: 0, y: ih + 8, width: iw, height: margin.bottom - 8 }}
        >
          <text
            x={iw / 2}
            y={ih + 22}
            textAnchor="middle"
            fontSize={8}
            fontFamily="var(--font-mono)"
            fill="var(--color-ink-mute)"
          >
            Patient: 3 cm · 4 nodes · ER+ → 35% recurrence
          </text>
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
