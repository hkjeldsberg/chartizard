"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Ladder-logic convention: two vertical "power rails" at left (L1) and right
// (N), with horizontal "rungs" crossing between them. Each rung is evaluated
// left-to-right as a boolean expression; contact continuity from L1 to N
// energises the output coil at the right. Layout is in a 0..100 × 0..100
// virtual plane mapped to pixels.

const L1_X = 10;
const N_X = 92;
const RAIL_TOP_Y = 12;
const RAIL_BOT_Y = 92;

// Rung Y-positions (main rung line).
const RUNG_Y = [26, 46, 62, 78] as const;

export function LadderDiagram({ width, height }: Props) {
  const margin = { top: 20, right: 20, bottom: 28, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (vx: number) => (vx / 100) * iw;
  const py = (vy: number) => (vy / 100) * ih;

  const l1Xpx = px(L1_X);
  const nXpx = px(N_X);
  const railTopPx = py(RAIL_TOP_Y);
  const railBotPx = py(RAIL_BOT_Y);

  // Rung Y positions in pixels.
  const rungY = RUNG_Y.map((v) => py(v));

  // --- Symbol helpers ---

  // Normally-open contact: `| |` — two short vertical lines with a gap, plus a
  // pair of short horizontal leads. Centred at (cx, cy).
  const contactNO = (
    key: string,
    cx: number,
    cy: number,
    halfW = 6,
    halfH = 5,
  ) => (
    <g key={key}>
      <line x1={cx - halfW} y1={cy - halfH} x2={cx - halfW} y2={cy + halfH} stroke="var(--color-ink)" strokeWidth={1.4} />
      <line x1={cx + halfW} y1={cy - halfH} x2={cx + halfW} y2={cy + halfH} stroke="var(--color-ink)" strokeWidth={1.4} />
    </g>
  );

  // Normally-closed contact: `|/|` — two short vertical lines with a diagonal
  // slash drawn across.
  const contactNC = (
    key: string,
    cx: number,
    cy: number,
    halfW = 6,
    halfH = 5,
  ) => (
    <g key={key}>
      <line x1={cx - halfW} y1={cy - halfH} x2={cx - halfW} y2={cy + halfH} stroke="var(--color-ink)" strokeWidth={1.4} />
      <line x1={cx + halfW} y1={cy - halfH} x2={cx + halfW} y2={cy + halfH} stroke="var(--color-ink)" strokeWidth={1.4} />
      <line
        x1={cx - halfW - 1}
        y1={cy + halfH - 1}
        x2={cx + halfW + 1}
        y2={cy - halfH + 1}
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
    </g>
  );

  // Output coil: an open ellipse drawn as two arcs with a small gap at top and
  // bottom (the standard `( )` coil glyph).
  const outputCoil = (
    key: string,
    cx: number,
    cy: number,
    rx = 7,
    ry = 6,
  ) => (
    <g key={key}>
      {/* left arc */}
      <path
        d={`M ${cx} ${cy - ry} A ${rx} ${ry} 0 0 0 ${cx} ${cy + ry}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
      {/* right arc */}
      <path
        d={`M ${cx} ${cy - ry} A ${rx} ${ry} 0 0 1 ${cx} ${cy + ry}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
      />
    </g>
  );

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - y, r.height));
    return { x, y, width: w, height: h };
  };

  // --- Rung 1 geometry: start/stop with latch ---
  // Main line: L1 -- [PB_Start] -- [/PB_Stop] --+-- ( Motor ) -- N
  // Parallel: from L1 stub at the contact-string entry down to a lower branch
  // carrying [MotorRun_Aux], then back up into the junction `+`.
  const rung1Y = rungY[0];
  const pbStartX = px(24);
  const pbStopX = px(40);
  const junctionX = px(54); // where parallel branch rejoins
  const motorCoilX = px(78);
  // Parallel branch vertical offset below main rung.
  const branchY = rung1Y + 16;
  const auxBranchX = px(32); // centre of the aux contact on the branch

  // --- Rung 2 ---
  const rung2Y = rungY[1];
  const rung2ContactX = px(28);
  const rung2CoilX = px(78);

  // --- Rung 3 ---
  const rung3Y = rungY[2];
  const rung3ContactX = px(28);
  const rung3CoilX = px(78);

  // --- Rung 4 ---
  const rung4Y = rungY[3];
  const rung4ContactX = px(28);
  const rung4CoilX = px(78);

  return (
    <svg width={width} height={height} role="img" aria-label="Ladder diagram">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* --- Power rails --- */}
          <line x1={l1Xpx} y1={railTopPx} x2={l1Xpx} y2={railBotPx} stroke="var(--color-ink)" strokeWidth={1.8} />
          <line x1={nXpx} y1={railTopPx} x2={nXpx} y2={railBotPx} stroke="var(--color-ink)" strokeWidth={1.8} />

          {/* Rail labels */}
          <text
            x={l1Xpx}
            y={railTopPx - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            L1
          </text>
          <text
            x={nXpx}
            y={railTopPx - 6}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            N
          </text>

          {/* Rung numbers (left of L1) */}
          {rungY.map((y, i) => (
            <text
              key={`rn-${i}`}
              x={l1Xpx - 10}
              y={y + 3}
              textAnchor="end"
              fontFamily="var(--font-mono)"
              fontSize={9}
              fill="var(--color-ink-soft)"
            >
              {i + 1}
            </text>
          ))}

          {/* ============ RUNG 1 ============ */}
          {/* Main rung line with gaps at the contact/coil centres */}
          {/* L1 -> PB_Start left */}
          <line x1={l1Xpx} y1={rung1Y} x2={pbStartX - 6} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* PB_Start right -> PB_Stop left */}
          <line x1={pbStartX + 6} y1={rung1Y} x2={pbStopX - 6} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* PB_Stop right -> junction */}
          <line x1={pbStopX + 6} y1={rung1Y} x2={junctionX} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* junction -> Motor coil left */}
          <line x1={junctionX} y1={rung1Y} x2={motorCoilX - 7} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Motor coil right -> N */}
          <line x1={motorCoilX + 7} y1={rung1Y} x2={nXpx} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Parallel branch (the latch): from L1-side of Start down, across through Aux, and back up into junction */}
          {/* down from the wire just after L1 stub */}
          <line x1={pbStartX - 6} y1={rung1Y} x2={pbStartX - 6} y2={branchY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* horizontal across to before the Aux */}
          <line x1={pbStartX - 6} y1={branchY} x2={auxBranchX - 6} y2={branchY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* after Aux, continue to below the junction */}
          <line x1={auxBranchX + 6} y1={branchY} x2={junctionX} y2={branchY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* vertical back up to junction */}
          <line x1={junctionX} y1={branchY} x2={junctionX} y2={rung1Y} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Junction dots (3-way) */}
          <circle cx={pbStartX - 6} cy={rung1Y} r={2} fill="var(--color-ink)" />
          <circle cx={junctionX} cy={rung1Y} r={2} fill="var(--color-ink)" />

          {/* Symbols */}
          {contactNO("pb-start", pbStartX, rung1Y)}
          {contactNC("pb-stop", pbStopX, rung1Y)}
          {contactNO("motor-aux", auxBranchX, branchY)}
          {outputCoil("motor-coil", motorCoilX, rung1Y)}

          {/* Labels */}
          <text x={pbStartX} y={rung1Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            PB_Start
          </text>
          <text x={pbStopX} y={rung1Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            PB_Stop
          </text>
          <text x={auxBranchX} y={branchY + 18} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            MotorRun_Aux
          </text>
          <text x={motorCoilX} y={rung1Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            Motor
          </text>

          {/* ============ RUNG 2 ============ */}
          <line x1={l1Xpx} y1={rung2Y} x2={rung2ContactX - 6} y2={rung2Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung2ContactX + 6} y1={rung2Y} x2={rung2CoilX - 7} y2={rung2Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung2CoilX + 7} y1={rung2Y} x2={nXpx} y2={rung2Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {contactNO("r2-aux", rung2ContactX, rung2Y)}
          {outputCoil("run-lamp", rung2CoilX, rung2Y)}
          <text x={rung2ContactX} y={rung2Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            MotorRun_Aux
          </text>
          <text x={rung2CoilX} y={rung2Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            RunLamp
          </text>

          {/* ============ RUNG 3 ============ */}
          <line x1={l1Xpx} y1={rung3Y} x2={rung3ContactX - 6} y2={rung3Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung3ContactX + 6} y1={rung3Y} x2={rung3CoilX - 7} y2={rung3Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung3CoilX + 7} y1={rung3Y} x2={nXpx} y2={rung3Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {contactNO("r3-ov", rung3ContactX, rung3Y)}
          {outputCoil("fault-lamp", rung3CoilX, rung3Y)}
          <text x={rung3ContactX} y={rung3Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            Overload_Aux
          </text>
          <text x={rung3CoilX} y={rung3Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            FaultLamp
          </text>

          {/* ============ RUNG 4 ============ */}
          <line x1={l1Xpx} y1={rung4Y} x2={rung4ContactX - 6} y2={rung4Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung4ContactX + 6} y1={rung4Y} x2={rung4CoilX - 7} y2={rung4Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={rung4CoilX + 7} y1={rung4Y} x2={nXpx} y2={rung4Y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {contactNO("r4-reset", rung4ContactX, rung4Y)}
          {outputCoil("reset-cmd", rung4CoilX, rung4Y)}
          <text x={rung4ContactX} y={rung4Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            PB_Reset
          </text>
          <text x={rung4CoilX} y={rung4Y - 10} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={9} fill="var(--color-ink)">
            ResetCmd
          </text>
        </g>

        {/* --- Explain anchors --- */}

        {/* 1. L1 power rail (left) */}
        <ExplainAnchor
          selector="l1-rail"
          index={1}
          pin={{ x: Math.max(14, l1Xpx - 22), y: (railTopPx + railBotPx) / 2 }}
          rect={clamp({ x: l1Xpx - 6, y: railTopPx, width: 12, height: railBotPx - railTopPx })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. N rail (right) */}
        <ExplainAnchor
          selector="n-rail"
          index={2}
          pin={{ x: Math.min(iw - 6, nXpx + 18), y: (railTopPx + railBotPx) / 2 }}
          rect={clamp({ x: nXpx - 6, y: railTopPx, width: 12, height: railBotPx - railTopPx })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Normally-open contact (PB_Start) */}
        <ExplainAnchor
          selector="no-contact"
          index={3}
          pin={{ x: pbStartX, y: rung1Y + 22 }}
          rect={clamp({ x: pbStartX - 10, y: rung1Y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Normally-closed contact (PB_Stop) */}
        <ExplainAnchor
          selector="nc-contact"
          index={4}
          pin={{ x: pbStopX, y: rung1Y + 22 }}
          rect={clamp({ x: pbStopX - 10, y: rung1Y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Output coil (Motor) */}
        <ExplainAnchor
          selector="output-coil"
          index={5}
          pin={{ x: motorCoilX, y: rung1Y + 22 }}
          rect={clamp({ x: motorCoilX - 10, y: rung1Y - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Latch branch (parallel aux-contact loop on rung 1) */}
        <ExplainAnchor
          selector="latch-branch"
          index={6}
          pin={{ x: auxBranchX - 22, y: branchY + 8 }}
          rect={clamp({
            x: pbStartX - 10,
            y: rung1Y + 2,
            width: junctionX - (pbStartX - 10) + 6,
            height: branchY - rung1Y + 10,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Rung-as-boolean-AND concept — anchor a full rung (rung 2 main line) */}
        <ExplainAnchor
          selector="rung-boolean"
          index={7}
          pin={{ x: (l1Xpx + nXpx) / 2, y: rung2Y + 18 }}
          rect={clamp({ x: l1Xpx, y: rung2Y - 8, width: nXpx - l1Xpx, height: 16 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
