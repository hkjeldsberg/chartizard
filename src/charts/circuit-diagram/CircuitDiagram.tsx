"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Layout is authored in a 0..100 × 0..100 virtual plane and mapped to pixels.
// The circuit is a classic single-stage common-emitter NPN amplifier.
//
// Net map (virtual coords):
//   Vcc rail (horizontal) at y = 10, spanning x = 18 .. 82
//   GND rail (horizontal) at y = 92, spanning x = 12 .. 88
//   Base net node (junction)        at (30, 50)
//   Collector net node (junction)   at (52, 36)  — Q1 collector wire tap
//   Emitter  net node (junction)    at (46, 64)  — Q1 emitter wire tap
//   Vin terminal at ( 4, 50); Cin between (10, 50) and (22, 50); wire to base.
//   Vout terminal at (96, 36); Cout between (72, 36) and (84, 36).
//
// All wires are Manhattan (horizontal + vertical only).

export function CircuitDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 28, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Map virtual coordinates (0..100) to pixels.
  const px = (vx: number) => (vx / 100) * iw;
  const py = (vy: number) => (vy / 100) * ih;

  // --- Nets (key x/y positions, in virtual coords) ---
  const VCC_Y = 10;
  const GND_Y = 92;
  const BASE_X = 30;
  const COLL_X = 52;
  const EMIT_X = 46;
  const BASE_Y = 50;
  const COLL_Y = 36;
  const EMIT_Y = 64;

  // Transistor body centre (virtual). The Q1 circle sits here.
  const Q1_CX = 46;
  const Q1_CY = 50;
  const Q1_R_V = 8; // radius in virtual y units (squashed by non-uniform scale)

  // --- Component "slots" along the vertical wires ---
  // R1: Vcc -> base node, occupies y ∈ [18, 34] at x = BASE_X
  // R2: base node -> GND, occupies y ∈ [66, 84] at x = BASE_X
  // Rc: Vcc -> collector node, y ∈ [16, 30] at x = COLL_X
  // Re: emitter node -> GND, y ∈ [72, 86] at x = EMIT_X
  // Ce: parallel to Re, same y range at x = 58
  // Cin: horizontal, x ∈ [12, 22] at y = BASE_Y
  // Cout: horizontal, x ∈ [72, 84] at y = COLL_Y

  // --- Helpers ---
  // Zigzag resistor, vertical orientation, spanning (cx, y1) .. (cx, y2).
  // Six peaks. Returns an SVG path "d" string. Widths in pixels.
  const resistorVert = (cx: number, y1: number, y2: number, widthPx = 6) => {
    const steps = 7; // 6 peaks + one final
    const dy = (y2 - y1) / steps;
    const w = widthPx;
    let d = `M ${cx} ${y1}`;
    for (let i = 1; i <= steps; i++) {
      const yi = y1 + i * dy;
      // alternate horizontal offsets: +w, -w, +w, -w, ...
      const side = i % 2 === 1 ? 1 : -1;
      // Each peak point sits halfway between segment endpoints; draw a zig.
      const ymid = y1 + (i - 0.5) * dy;
      d += ` L ${cx + side * w} ${ymid} L ${cx} ${yi}`;
    }
    return d;
  };

  // Zigzag resistor, horizontal orientation — unused at present but kept for
  // completeness if layout later needs it.
  // (no horizontal resistors in this schematic)

  // Capacitor symbol (two parallel plates) with wire stubs. Horizontal = plates
  // are vertical short lines. Returns a <g> element.
  const capacitorHoriz = (
    key: string,
    xCentre: number,
    yCentre: number,
    plateGap = 4,
    plateH = 10,
    leadLen = 6,
  ) => (
    <g key={key}>
      {/* left lead */}
      <line
        x1={xCentre - plateGap / 2 - leadLen}
        y1={yCentre}
        x2={xCentre - plateGap / 2}
        y2={yCentre}
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
      {/* left plate */}
      <line
        x1={xCentre - plateGap / 2}
        y1={yCentre - plateH / 2}
        x2={xCentre - plateGap / 2}
        y2={yCentre + plateH / 2}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
      {/* right plate */}
      <line
        x1={xCentre + plateGap / 2}
        y1={yCentre - plateH / 2}
        x2={xCentre + plateGap / 2}
        y2={yCentre + plateH / 2}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
      {/* right lead */}
      <line
        x1={xCentre + plateGap / 2}
        y1={yCentre}
        x2={xCentre + plateGap / 2 + leadLen}
        y2={yCentre}
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
    </g>
  );

  // Capacitor symbol, vertical orientation — plates are horizontal.
  const capacitorVert = (
    key: string,
    xCentre: number,
    yCentre: number,
    plateGap = 4,
    plateW = 10,
    leadLen = 6,
  ) => (
    <g key={key}>
      {/* top lead */}
      <line
        x1={xCentre}
        y1={yCentre - plateGap / 2 - leadLen}
        x2={xCentre}
        y2={yCentre - plateGap / 2}
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
      {/* top plate */}
      <line
        x1={xCentre - plateW / 2}
        y1={yCentre - plateGap / 2}
        x2={xCentre + plateW / 2}
        y2={yCentre - plateGap / 2}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
      {/* bottom plate */}
      <line
        x1={xCentre - plateW / 2}
        y1={yCentre + plateGap / 2}
        x2={xCentre + plateW / 2}
        y2={yCentre + plateGap / 2}
        stroke="var(--color-ink)"
        strokeWidth={1.5}
      />
      {/* bottom lead */}
      <line
        x1={xCentre}
        y1={yCentre + plateGap / 2}
        x2={xCentre}
        y2={yCentre + plateGap / 2 + leadLen}
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
    </g>
  );

  // GND ground symbol — three horizontal lines of decreasing width.
  const groundSymbol = (key: string, cx: number, yTop: number) => (
    <g key={key}>
      <line x1={cx} y1={yTop} x2={cx} y2={yTop + 4} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={cx - 7} y1={yTop + 4} x2={cx + 7} y2={yTop + 4} stroke="var(--color-ink)" strokeWidth={1.5} />
      <line x1={cx - 4.5} y1={yTop + 7} x2={cx + 4.5} y2={yTop + 7} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={cx - 2} y1={yTop + 10} x2={cx + 2} y2={yTop + 10} stroke="var(--color-ink)" strokeWidth={1.3} />
    </g>
  );

  // --- Pixel positions computed once ---
  const vccYpx = py(VCC_Y);
  const gndYpx = py(GND_Y);
  const baseXpx = px(BASE_X);
  const collXpx = px(COLL_X);
  const emitXpx = px(EMIT_X);
  const baseYpx = py(BASE_Y);
  const collYpx = py(COLL_Y);
  const emitYpx = py(EMIT_Y);

  const q1Cx = px(Q1_CX);
  const q1Cy = py(Q1_CY);
  const q1R = Math.min(px(Q1_R_V), py(Q1_R_V)); // keep the body round on screen

  // Resistor pixel spans
  const r1Top = py(18);
  const r1Bot = py(34);
  const r2Top = py(66);
  const r2Bot = py(84);
  const rcTop = py(16);
  const rcBot = py(30);
  const reTop = py(72);
  const reBot = py(86);
  const ceTop = py(72);
  const ceBot = py(86);
  const ceCx = px(62);

  // Capacitor positions
  const cinCx = px(16);
  const coutCx = px(78);

  // Vin/Vout terminal positions (pixel)
  const vinPx = { x: px(4), y: py(BASE_Y) };
  const voutPx = { x: px(96), y: py(COLL_Y) };

  // Clamp helper for anchors.
  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - y, r.height));
    return { x, y, width: w, height: h };
  };

  // Transistor symbol: circle with base/collector/emitter leads.
  // Base lead enters from left: wire at (baseXpx, baseYpx) to (q1Cx - q1R, q1Cy),
  // then a short internal vertical bar where the base touches the transistor.
  // Collector lead exits up from top of symbol to (collXpx, collYpx).
  // Emitter  lead exits down from bottom of symbol to (emitXpx, emitYpx) with
  // the arrow pointing OUT (away from the base) — NPN convention.
  const baseTouchX = q1Cx - q1R * 0.35; // inside the circle, where internal bar sits
  const internalBarTop = q1Cy - q1R * 0.55;
  const internalBarBot = q1Cy + q1R * 0.55;

  // Collector/emitter internal diagonal leads from bar to collector/emitter exit.
  const collExitX = q1Cx + q1R * 0.55;
  const collExitY = q1Cy - q1R * 0.55;
  const emitExitX = q1Cx + q1R * 0.35;
  const emitExitY = q1Cy + q1R * 0.75;

  // Arrowhead for emitter (points away from the base, along the emitter lead direction).
  const emitVecX = emitExitX - baseTouchX;
  const emitVecY = emitExitY - internalBarBot;
  const emitLen = Math.hypot(emitVecX, emitVecY) || 1;
  const emitUx = emitVecX / emitLen;
  const emitUy = emitVecY / emitLen;
  // Tip of arrow slightly outside the diagonal stub end.
  const arrowTipX = emitExitX;
  const arrowTipY = emitExitY;
  const arrowBaseX = arrowTipX - emitUx * 5.5;
  const arrowBaseY = arrowTipY - emitUy * 5.5;
  // Perpendicular offsets for the arrowhead wings.
  const perpX = -emitUy;
  const perpY = emitUx;
  const arrowHeadWidth = 2.8;

  return (
    <svg width={width} height={height} role="img" aria-label="Circuit diagram">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* --- Rails --- */}
          {/* Vcc rail */}
          <line
            x1={px(18)}
            y1={vccYpx}
            x2={px(82)}
            y2={vccYpx}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
          <text
            x={px(82) + 6}
            y={vccYpx + 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Vcc +9V
          </text>

          {/* GND rail */}
          <line
            x1={px(12)}
            y1={gndYpx}
            x2={px(88)}
            y2={gndYpx}
            stroke="var(--color-ink)"
            strokeWidth={1.6}
          />
          {/* GND symbol — centred below the rail midpoint */}
          {groundSymbol("gnd-sym", px(50), gndYpx + 1)}

          {/* --- Wires (Manhattan) --- */}
          {/* Vcc rail down to R1 top (at BASE_X) */}
          <line x1={baseXpx} y1={vccYpx} x2={baseXpx} y2={r1Top} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* R1 bottom down to base-net node */}
          <line x1={baseXpx} y1={r1Bot} x2={baseXpx} y2={baseYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Base-net node down to R2 top */}
          <line x1={baseXpx} y1={baseYpx} x2={baseXpx} y2={r2Top} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* R2 bottom down to GND rail */}
          <line x1={baseXpx} y1={r2Bot} x2={baseXpx} y2={gndYpx} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Vcc rail down to Rc top (at COLL_X) */}
          <line x1={collXpx} y1={vccYpx} x2={collXpx} y2={rcTop} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Rc bottom down to collector net node, then to Q1 collector exit */}
          <line x1={collXpx} y1={rcBot} x2={collXpx} y2={collYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Horizontal tap from collector line to transistor collector exit */}
          <line x1={collXpx} y1={collYpx} x2={collExitX} y2={collYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={collExitX} y1={collYpx} x2={collExitX} y2={collExitY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Continue collector line rightward to Cout input */}
          <line x1={collXpx} y1={collYpx} x2={px(72)} y2={collYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* After Cout, wire to Vout terminal */}
          <line x1={px(84)} y1={collYpx} x2={voutPx.x} y2={voutPx.y} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Q1 emitter exit down to emitter-net node */}
          <line x1={emitExitX} y1={emitExitY} x2={emitExitX} y2={emitYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* horizontal tap at emitter node to the Re top (at EMIT_X = 46) */}
          <line x1={emitExitX} y1={emitYpx} x2={emitXpx} y2={emitYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Re vertical: emitter node down to Re top, then Re bottom to GND */}
          <line x1={emitXpx} y1={emitYpx} x2={emitXpx} y2={reTop} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={emitXpx} y1={reBot} x2={emitXpx} y2={gndYpx} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Ce wiring: tap off emitter-net node, run horizontally to ceCx, down through Ce, then to GND */}
          <line x1={emitExitX} y1={emitYpx} x2={ceCx} y2={emitYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={ceCx} y1={emitYpx} x2={ceCx} y2={ceTop} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={ceCx} y1={ceBot} x2={ceCx} y2={gndYpx} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* Base-net node leftward wire to Cin right lead, then Vin */}
          <line x1={baseXpx} y1={baseYpx} x2={px(22)} y2={baseYpx} stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={px(10)} y1={baseYpx} x2={vinPx.x + 4} y2={vinPx.y} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* wire from transistor base-touch-point to base net node */}
          <line x1={baseTouchX} y1={baseYpx} x2={baseXpx} y2={baseYpx} stroke="var(--color-ink)" strokeWidth={1.3} />

          {/* --- Resistors --- */}
          <path d={resistorVert(baseXpx, r1Top, r1Bot)} stroke="var(--color-ink)" strokeWidth={1.3} fill="none" />
          <path d={resistorVert(baseXpx, r2Top, r2Bot)} stroke="var(--color-ink)" strokeWidth={1.3} fill="none" />
          <path d={resistorVert(collXpx, rcTop, rcBot)} stroke="var(--color-ink)" strokeWidth={1.3} fill="none" />
          <path d={resistorVert(emitXpx, reTop, reBot)} stroke="var(--color-ink)" strokeWidth={1.3} fill="none" />

          {/* --- Capacitors --- */}
          {capacitorHoriz("cin", cinCx, baseYpx)}
          {capacitorHoriz("cout", coutCx, collYpx)}
          {capacitorVert("ce", ceCx, (ceTop + ceBot) / 2)}

          {/* --- Transistor Q1 (NPN) --- */}
          {/* outer circle body */}
          <circle cx={q1Cx} cy={q1Cy} r={q1R} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.4} />
          {/* internal vertical bar (the base) */}
          <line
            x1={baseTouchX}
            y1={internalBarTop}
            x2={baseTouchX}
            y2={internalBarBot}
            stroke="var(--color-ink)"
            strokeWidth={1.7}
          />
          {/* internal lead: base contact to bar */}
          {/* internal collector lead (from upper bar to collector exit) */}
          <line x1={baseTouchX} y1={internalBarTop} x2={collExitX} y2={collExitY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* internal emitter lead (from lower bar to emitter exit) */}
          <line x1={baseTouchX} y1={internalBarBot} x2={emitExitX} y2={emitExitY} stroke="var(--color-ink)" strokeWidth={1.3} />
          {/* Emitter arrowhead — pointing OUT (NPN) */}
          <polygon
            points={
              `${arrowTipX},${arrowTipY} ` +
              `${arrowBaseX + perpX * arrowHeadWidth},${arrowBaseY + perpY * arrowHeadWidth} ` +
              `${arrowBaseX - perpX * arrowHeadWidth},${arrowBaseY - perpY * arrowHeadWidth}`
            }
            fill="var(--color-ink)"
          />

          {/* --- Junction dots (only at 3+ way crossings) --- */}
          {/* Base net node (wire-to-base meets R1 bottom, R2 top, base-to-transistor wire) */}
          <circle cx={baseXpx} cy={baseYpx} r={2.2} fill="var(--color-ink)" />
          {/* Collector net node (Rc bottom meets Q1 collector and Cout lead) */}
          <circle cx={collXpx} cy={collYpx} r={2.2} fill="var(--color-ink)" />
          {/* Emitter net node (Q1 emitter wire, Re top, Ce tap) */}
          <circle cx={emitExitX} cy={emitYpx} r={2.2} fill="var(--color-ink)" />

          {/* --- Reference designator labels --- */}
          {/* R1 */}
          <text
            x={baseXpx + 10}
            y={(r1Top + r1Bot) / 2 - 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            R1
          </text>
          <text
            x={baseXpx + 10}
            y={(r1Top + r1Bot) / 2 + 9}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            47kΩ
          </text>
          {/* R2 */}
          <text
            x={baseXpx + 10}
            y={(r2Top + r2Bot) / 2 - 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            R2
          </text>
          <text
            x={baseXpx + 10}
            y={(r2Top + r2Bot) / 2 + 9}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            10kΩ
          </text>
          {/* Rc */}
          <text
            x={collXpx + 10}
            y={(rcTop + rcBot) / 2 - 3}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Rc
          </text>
          <text
            x={collXpx + 10}
            y={(rcTop + rcBot) / 2 + 9}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            4.7kΩ
          </text>
          {/* Re */}
          <text
            x={emitXpx - 10}
            y={(reTop + reBot) / 2 - 3}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Re
          </text>
          <text
            x={emitXpx - 10}
            y={(reTop + reBot) / 2 + 9}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            1kΩ
          </text>
          {/* Cin */}
          <text
            x={cinCx}
            y={baseYpx - 12}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Cin
          </text>
          <text
            x={cinCx}
            y={baseYpx + 18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            10µF
          </text>
          {/* Cout */}
          <text
            x={coutCx}
            y={collYpx - 12}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Cout
          </text>
          <text
            x={coutCx}
            y={collYpx + 18}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            10µF
          </text>
          {/* Ce */}
          <text
            x={ceCx + 10}
            y={(ceTop + ceBot) / 2 - 2}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Ce
          </text>
          <text
            x={ceCx + 10}
            y={(ceTop + ceBot) / 2 + 10}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            100µF
          </text>
          {/* Q1 */}
          <text
            x={q1Cx + q1R + 6}
            y={q1Cy - 4}
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            Q1
          </text>
          <text
            x={q1Cx + q1R + 6}
            y={q1Cy + 8}
            fontFamily="var(--font-mono)"
            fontSize={9}
            fill="var(--color-ink-soft)"
          >
            2N3904
          </text>

          {/* --- Input / output terminals --- */}
          {/* Vin arrow + label */}
          <line x1={vinPx.x} y1={vinPx.y} x2={vinPx.x + 4} y2={vinPx.y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <circle cx={vinPx.x} cy={vinPx.y} r={1.8} fill="var(--color-ink)" />
          <text
            x={vinPx.x}
            y={vinPx.y - 8}
            textAnchor="start"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Vin
          </text>
          {/* Vout terminal + label */}
          <line x1={voutPx.x - 4} y1={voutPx.y} x2={voutPx.x} y2={voutPx.y} stroke="var(--color-ink)" strokeWidth={1.3} />
          <circle cx={voutPx.x} cy={voutPx.y} r={1.8} fill="var(--color-ink)" />
          <text
            x={voutPx.x}
            y={voutPx.y - 8}
            textAnchor="end"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fill="var(--color-ink)"
          >
            Vout
          </text>
        </g>

        {/* --- Explain anchors --- */}

        {/* 1. Vcc rail */}
        <ExplainAnchor
          selector="vcc-rail"
          index={1}
          pin={{ x: px(20), y: vccYpx - 14 }}
          rect={clamp({ x: px(16), y: vccYpx - 6, width: px(82) - px(16), height: 12 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Resistor (R1 — zigzag symbol) */}
        <ExplainAnchor
          selector="resistor"
          index={2}
          pin={{ x: baseXpx - 14, y: (r1Top + r1Bot) / 2 }}
          rect={clamp({ x: baseXpx - 10, y: r1Top - 4, width: 20, height: r1Bot - r1Top + 8 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Capacitor (Cin — two parallel plates) */}
        <ExplainAnchor
          selector="capacitor"
          index={3}
          pin={{ x: cinCx, y: baseYpx + 34 }}
          rect={clamp({ x: cinCx - 12, y: baseYpx - 10, width: 24, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. NPN transistor Q1 */}
        <ExplainAnchor
          selector="npn-transistor"
          index={4}
          pin={{ x: q1Cx - q1R - 14, y: q1Cy + q1R + 6 }}
          rect={clamp({ x: q1Cx - q1R - 3, y: q1Cy - q1R - 3, width: q1R * 2 + 6, height: q1R * 2 + 6 })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Ground symbol */}
        <ExplainAnchor
          selector="ground-symbol"
          index={5}
          pin={{ x: px(50) + 18, y: gndYpx + 14 }}
          rect={clamp({ x: px(50) - 10, y: gndYpx - 2, width: 20, height: 16 })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Junction dot (base net node) */}
        <ExplainAnchor
          selector="junction-dot"
          index={6}
          pin={{ x: baseXpx - 14, y: baseYpx + 14 }}
          rect={clamp({ x: baseXpx - 6, y: baseYpx - 6, width: 12, height: 12 })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Reference designator + value (R1 label block) */}
        <ExplainAnchor
          selector="reference-designator"
          index={7}
          pin={{ x: baseXpx + 34, y: (r1Top + r1Bot) / 2 }}
          rect={clamp({ x: baseXpx + 8, y: (r1Top + r1Bot) / 2 - 10, width: 28, height: 24 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
