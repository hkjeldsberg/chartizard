"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Layout is authored in a 0..100 × 0..100 virtual plane mapped to pixels.
// The schematic is a simplified heat-exchanger recirculation loop:
//   T-101 (tank) -> P-101 (pump) -> CV-101 (control valve) -> HX-101 (heat exchanger) -> back to T-101
// with four instrument bubbles (FT, PT, TT, FIC) wired to the control room
// via ISA-5.1 dashed signal lines. Process lines are thick solid; signal
// lines are thin dashed. FIC-101 is drawn as a double-concentric circle to
// indicate a DCS function rather than a field-mounted instrument.

export function PipingInstrumentationDiagram({ width, height }: Props) {
  const margin = { top: 24, right: 24, bottom: 28, left: 24 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const px = (vx: number) => (vx / 100) * iw;
  const py = (vy: number) => (vy / 100) * ih;

  // Equipment centres (virtual).
  const T_CX = 14;
  const T_CY = 42;
  const T_W = 14;
  const T_H = 36;

  const P_CX = 30;
  const P_CY = 82;
  const P_R_V = 6;

  const CV_CX = 52;
  const CV_CY = 82;
  const CV_HW = 6; // half-width
  const CV_HH = 5; // half-height

  const HX_CX = 78;
  const HX_CY = 82;
  const HX_R_V = 8;

  // Instrument centres.
  const PT_CX = 24;
  const PT_CY = 56;
  const FT_CX = 42;
  const FT_CY = 68;
  const TT_CX = 78;
  const TT_CY = 62;
  const FIC_CX = 62;
  const FIC_CY = 22;
  const DCS_CX = 86;
  const DCS_CY = 22;

  const INSTR_R_V = 5; // virtual-units radius for instrument bubbles

  // Pixel versions.
  const tCx = px(T_CX);
  const tCy = py(T_CY);
  const tW = px(T_W);
  const tH = py(T_H);
  const tLeft = tCx - tW / 2;
  const tRight = tCx + tW / 2;
  const tTop = tCy - tH / 2;
  const tBot = tCy + tH / 2;

  const pCx = px(P_CX);
  const pCy = py(P_CY);
  const pR = Math.min(px(P_R_V), py(P_R_V));

  const cvCx = px(CV_CX);
  const cvCy = py(CV_CY);
  const cvHw = px(CV_HW);
  const cvHh = py(CV_HH);

  const hxCx = px(HX_CX);
  const hxCy = py(HX_CY);
  const hxR = Math.min(px(HX_R_V), py(HX_R_V));

  const ptCx = px(PT_CX);
  const ptCy = py(PT_CY);
  const ftCx = px(FT_CX);
  const ftCy = py(FT_CY);
  const ttCx = px(TT_CX);
  const ttCy = py(TT_CY);
  const ficCx = px(FIC_CX);
  const ficCy = py(FIC_CY);
  const dcsCx = px(DCS_CX);
  const dcsCy = py(DCS_CY);

  const instrR = Math.min(px(INSTR_R_V), py(INSTR_R_V));

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - y, r.height));
    return { x, y, width: w, height: h };
  };

  const processStroke = "var(--color-ink)";
  const processWidth = 2.6;
  const signalStroke = "var(--color-ink-mute)";
  const signalWidth = 1.1;

  // Process-line routing (Manhattan).
  // 1. Tank outlet (bottom of tank) -> down -> across to pump inlet (left of pump).
  const tOutletX = tCx;
  const tOutletY = tBot;
  const pInletX = pCx - pR;
  const pInletY = pCy;
  // 2. Pump outlet (right) -> across to CV inlet (left).
  const pOutletX = pCx + pR;
  const pOutletY = pCy;
  const cvInletX = cvCx - cvHw;
  const cvInletY = cvCy;
  // 3. CV outlet (right) -> across to HX inlet (left).
  const cvOutletX = cvCx + cvHw;
  const cvOutletY = cvCy;
  const hxInletX = hxCx - hxR;
  const hxInletY = hxCy;
  // 4. HX outlet (right) -> up -> across back to tank inlet (top of tank).
  const hxOutletX = hxCx + hxR;
  const hxOutletY = hxCy;
  const tReturnX = tCx;
  const tReturnY = tTop;
  const returnTopY = py(12);

  // Anchor positions for instrument tap points on process lines.
  // FT-101 sits on the pump discharge (between pOutlet and CV inlet).
  const ftTapX = (pOutletX + cvInletX) / 2;
  const ftTapY = pOutletY;
  // PT-101 sits on tank outlet (below tank, before pump).
  const ptTapX = tOutletX;
  const ptTapY = py(58);
  // TT-101 sits on HX outlet.
  const ttTapX = hxOutletX + 2;
  const ttTapY = hxOutletY;

  return (
    <svg width={width} height={height} role="img" aria-label="Piping and instrumentation diagram">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* ===== Process lines (thick solid) ===== */}
          {/* Tank outlet down */}
          <line x1={tOutletX} y1={tOutletY} x2={tOutletX} y2={pInletY} stroke={processStroke} strokeWidth={processWidth} />
          {/* across to pump inlet */}
          <line x1={tOutletX} y1={pInletY} x2={pInletX} y2={pInletY} stroke={processStroke} strokeWidth={processWidth} />
          {/* pump outlet to CV inlet */}
          <line x1={pOutletX} y1={pOutletY} x2={cvInletX} y2={cvInletY} stroke={processStroke} strokeWidth={processWidth} />
          {/* CV outlet to HX inlet */}
          <line x1={cvOutletX} y1={cvOutletY} x2={hxInletX} y2={hxInletY} stroke={processStroke} strokeWidth={processWidth} />
          {/* HX outlet up, across top, back down to tank inlet (recirculation return) */}
          <line x1={hxOutletX} y1={hxOutletY} x2={hxOutletX} y2={returnTopY} stroke={processStroke} strokeWidth={processWidth} />
          <line x1={hxOutletX} y1={returnTopY} x2={tReturnX} y2={returnTopY} stroke={processStroke} strokeWidth={processWidth} />
          <line x1={tReturnX} y1={returnTopY} x2={tReturnX} y2={tReturnY} stroke={processStroke} strokeWidth={processWidth} />

          {/* Flow-direction arrows (small triangles) at a couple of points */}
          {/* Horizontal arrow on pump discharge, pointing right */}
          <polygon
            points={`${ftTapX + 14},${ftTapY} ${ftTapX + 8},${ftTapY - 3} ${ftTapX + 8},${ftTapY + 3}`}
            fill={processStroke}
          />
          {/* Horizontal arrow on CV -> HX line, pointing right */}
          <polygon
            points={`${(cvOutletX + hxInletX) / 2 + 4},${cvOutletY} ${(cvOutletX + hxInletX) / 2 - 2},${cvOutletY - 3} ${(cvOutletX + hxInletX) / 2 - 2},${cvOutletY + 3}`}
            fill={processStroke}
          />
          {/* Down arrow on tank outlet */}
          <polygon
            points={`${tOutletX},${(tOutletY + pInletY) / 2 + 4} ${tOutletX - 3},${(tOutletY + pInletY) / 2 - 2} ${tOutletX + 3},${(tOutletY + pInletY) / 2 - 2}`}
            fill={processStroke}
          />
          {/* Left arrow on the top return, pointing left toward tank */}
          <polygon
            points={`${(hxOutletX + tReturnX) / 2 - 4},${returnTopY} ${(hxOutletX + tReturnX) / 2 + 2},${returnTopY - 3} ${(hxOutletX + tReturnX) / 2 + 2},${returnTopY + 3}`}
            fill={processStroke}
          />
        </g>

        {/* ===== Equipment symbols ===== */}
        <g data-data-layer="true">
          {/* T-101 — storage tank with curved top */}
          <path
            d={`M ${tLeft} ${tTop + 6} Q ${tCx} ${tTop - 6} ${tRight} ${tTop + 6} L ${tRight} ${tBot} L ${tLeft} ${tBot} Z`}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.4}
          />
          {/* liquid-level line */}
          <line
            x1={tLeft + 3}
            y1={tTop + 14}
            x2={tRight - 3}
            y2={tTop + 14}
            stroke="var(--color-ink-soft)"
            strokeWidth={1}
            strokeDasharray="2 3"
          />
          <text
            x={tCx}
            y={tTop - 10}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            T-101
          </text>

          {/* P-101 — centrifugal pump: circle with a small triangle inside */}
          <circle cx={pCx} cy={pCy} r={pR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.4} />
          {/* triangle pointing right (flow direction) */}
          <polygon
            points={`${pCx - pR * 0.45},${pCy - pR * 0.55} ${pCx + pR * 0.55},${pCy} ${pCx - pR * 0.45},${pCy + pR * 0.55}`}
            fill="var(--color-ink)"
          />
          <text
            x={pCx}
            y={pCy + pR + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            P-101
          </text>

          {/* CV-101 — control valve: two triangles meeting (hourglass) */}
          <polygon
            points={`${cvCx - cvHw},${cvCy - cvHh} ${cvCx + cvHw},${cvCy + cvHh} ${cvCx + cvHw},${cvCy - cvHh} ${cvCx - cvHw},${cvCy + cvHh}`}
            fill="var(--color-ink)"
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          {/* valve actuator stem */}
          <line x1={cvCx} y1={cvCy} x2={cvCx} y2={cvCy - 12} stroke="var(--color-ink)" strokeWidth={1.2} />
          <rect
            x={cvCx - 4}
            y={cvCy - 18}
            width={8}
            height={6}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.2}
          />
          <text
            x={cvCx}
            y={cvCy + cvHh + 16}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            CV-101
          </text>

          {/* HX-101 — heat exchanger: circle with two zigzag lines across */}
          <circle cx={hxCx} cy={hxCy} r={hxR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.4} />
          {/* Two zigzag tube-bundle lines across the circle */}
          <path
            d={`M ${hxCx - hxR + 2} ${hxCy - 3} L ${hxCx - hxR / 2} ${hxCy - 6} L ${hxCx} ${hxCy - 3} L ${hxCx + hxR / 2} ${hxCy - 6} L ${hxCx + hxR - 2} ${hxCy - 3}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <path
            d={`M ${hxCx - hxR + 2} ${hxCy + 3} L ${hxCx - hxR / 2} ${hxCy + 6} L ${hxCx} ${hxCy + 3} L ${hxCx + hxR / 2} ${hxCy + 6} L ${hxCx + hxR - 2} ${hxCy + 3}`}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={1.1}
          />
          <text
            x={hxCx}
            y={hxCy + hxR + 14}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={10}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            HX-101
          </text>
        </g>

        {/* ===== Instrument bubbles (ISA-5.1) ===== */}
        <g data-data-layer="true">
          {/* PT-101 on tank outlet */}
          <line
            x1={ptCx}
            y1={ptCy + instrR}
            x2={ptTapX}
            y2={ptTapY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <circle cx={ptCx} cy={ptCy} r={instrR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={ptCx - instrR} y1={ptCy} x2={ptCx + instrR} y2={ptCy} stroke="var(--color-ink)" strokeWidth={0.9} />
          <text x={ptCx} y={ptCy - 1} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7.5} fill="var(--color-ink)">
            PT
          </text>
          <text x={ptCx} y={ptCy + 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={6.5} fill="var(--color-ink)">
            101
          </text>

          {/* FT-101 on pump discharge */}
          <line
            x1={ftCx}
            y1={ftCy - instrR}
            x2={ftTapX}
            y2={ftTapY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <circle cx={ftCx} cy={ftCy} r={instrR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={ftCx - instrR} y1={ftCy} x2={ftCx + instrR} y2={ftCy} stroke="var(--color-ink)" strokeWidth={0.9} />
          <text x={ftCx} y={ftCy - 1} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7.5} fill="var(--color-ink)">
            FT
          </text>
          <text x={ftCx} y={ftCy + 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={6.5} fill="var(--color-ink)">
            101
          </text>

          {/* TT-101 on HX outlet */}
          <line
            x1={ttCx}
            y1={ttCy + instrR}
            x2={ttTapX}
            y2={ttTapY}
            stroke="var(--color-ink)"
            strokeWidth={1}
          />
          <circle cx={ttCx} cy={ttCy} r={instrR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.3} />
          <line x1={ttCx - instrR} y1={ttCy} x2={ttCx + instrR} y2={ttCy} stroke="var(--color-ink)" strokeWidth={0.9} />
          <text x={ttCx} y={ttCy - 1} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7.5} fill="var(--color-ink)">
            TT
          </text>
          <text x={ttCx} y={ttCy + 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={6.5} fill="var(--color-ink)">
            101
          </text>

          {/* FIC-101 — double-concentric (DCS function) */}
          <circle cx={ficCx} cy={ficCy} r={instrR + 2.5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.3} />
          <circle cx={ficCx} cy={ficCy} r={instrR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
          <line x1={ficCx - instrR} y1={ficCy} x2={ficCx + instrR} y2={ficCy} stroke="var(--color-ink)" strokeWidth={0.9} />
          <text x={ficCx} y={ficCy - 1} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink)">
            FIC
          </text>
          <text x={ficCx} y={ficCy + 7} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={6.5} fill="var(--color-ink)">
            101
          </text>

          {/* DCS marker top-right */}
          <circle cx={dcsCx} cy={dcsCy} r={instrR + 1} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.1} strokeDasharray="2 2" />
          <text x={dcsCx} y={dcsCy + 2.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={7} fill="var(--color-ink)">
            DCS
          </text>
        </g>

        {/* ===== Signal lines (thin dashed ISA-5.1) ===== */}
        <g data-data-layer="true">
          {/* FT-101 -> FIC-101 */}
          <line
            x1={ftCx}
            y1={ftCy - instrR}
            x2={ficCx}
            y2={ficCy + instrR + 2.5}
            stroke={signalStroke}
            strokeWidth={signalWidth}
            strokeDasharray="3 3"
          />
          {/* FIC-101 -> CV-101 (controller output to valve actuator) */}
          <line
            x1={ficCx}
            y1={ficCy + instrR + 2.5}
            x2={cvCx}
            y2={cvCy - 18}
            stroke={signalStroke}
            strokeWidth={signalWidth}
            strokeDasharray="3 3"
          />
          {/* PT-101 -> DCS */}
          <path
            d={`M ${ptCx + instrR} ${ptCy} L ${dcsCx - instrR - 4} ${ptCy} L ${dcsCx - instrR - 4} ${dcsCy + instrR}`}
            stroke={signalStroke}
            strokeWidth={signalWidth}
            strokeDasharray="3 3"
            fill="none"
          />
          {/* TT-101 -> DCS */}
          <path
            d={`M ${ttCx} ${ttCy - instrR} L ${ttCx} ${dcsCy + instrR + 6} L ${dcsCx} ${dcsCy + instrR + 6} L ${dcsCx} ${dcsCy + instrR}`}
            stroke={signalStroke}
            strokeWidth={signalWidth}
            strokeDasharray="3 3"
            fill="none"
          />
        </g>

        {/* ===== ExplainAnchors ===== */}

        {/* 1. Storage tank T-101 */}
        <ExplainAnchor
          selector="storage-tank"
          index={1}
          pin={{ x: Math.max(14, tLeft - 14), y: tCy }}
          rect={clamp({ x: tLeft - 4, y: tTop - 8, width: tW + 8, height: tH + 10 })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Pump P-101 */}
        <ExplainAnchor
          selector="pump-symbol"
          index={2}
          pin={{ x: pCx - pR - 14, y: pCy + pR + 6 }}
          rect={clamp({ x: pCx - pR - 4, y: pCy - pR - 4, width: pR * 2 + 8, height: pR * 2 + 8 })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Control valve CV-101 */}
        <ExplainAnchor
          selector="control-valve"
          index={3}
          pin={{ x: cvCx + cvHw + 16, y: cvCy - 8 }}
          rect={clamp({ x: cvCx - cvHw - 4, y: cvCy - 22, width: cvHw * 2 + 8, height: cvHh * 2 + 26 })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Heat exchanger HX-101 */}
        <ExplainAnchor
          selector="heat-exchanger"
          index={4}
          pin={{ x: hxCx, y: hxCy + hxR + 22 }}
          rect={clamp({ x: hxCx - hxR - 4, y: hxCy - hxR - 4, width: hxR * 2 + 8, height: hxR * 2 + 8 })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Instrument tag bubble (FT-101) */}
        <ExplainAnchor
          selector="instrument-tag"
          index={5}
          pin={{ x: ftCx - instrR - 14, y: ftCy + instrR + 6 }}
          rect={clamp({ x: ftCx - instrR - 3, y: ftCy - instrR - 3, width: instrR * 2 + 6, height: instrR * 2 + 6 })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Signal line (FT -> FIC dashed) */}
        <ExplainAnchor
          selector="signal-line"
          index={6}
          pin={{ x: (ftCx + ficCx) / 2 - 16, y: (ftCy + ficCy) / 2 }}
          rect={clamp({
            x: Math.min(ftCx, ficCx) - 4,
            y: Math.min(ftCy, ficCy) + instrR,
            width: Math.abs(ficCx - ftCx) + 8,
            height: Math.max(6, Math.abs(ficCy - ftCy) - instrR * 2),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Process line (the thick pump-discharge pipe) */}
        <ExplainAnchor
          selector="process-line"
          index={7}
          pin={{ x: (pOutletX + cvInletX) / 2, y: pOutletY + 16 }}
          rect={clamp({ x: pOutletX, y: pOutletY - 6, width: cvInletX - pOutletX, height: 12 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
