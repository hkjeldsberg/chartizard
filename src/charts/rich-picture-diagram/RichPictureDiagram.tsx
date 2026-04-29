"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Rich Picture Diagram — Peter Checkland, Soft Systems Methodology (1981).
// Subject: a school-reform scenario. Deliberately informal, pencil-sketch feel.
// Stick figures, speech bubbles, thought bubbles, clouds for fuzzy concepts,
// crossed swords for conflicts, labelled arrows for information flows.
// Everything rendered via SVG primitives with a consistent 1.2–1.4px stroke
// and no fills beyond the standard ink palette.

interface Props {
  width: number;
  height: number;
}

export function RichPictureDiagram({ width, height }: Props) {
  const margin = { top: 16, right: 16, bottom: 16, left: 16 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Layout space: 0..100 × 0..100
  const px = (lx: number) => (lx / 100) * iw;
  const py = (ly: number) => (ly / 100) * ih;

  const ink = "var(--color-ink)";
  const inkSoft = "var(--color-ink-soft)";
  const inkMute = "var(--color-ink-mute)";
  const surface = "var(--color-surface)";

  // ---------- Primitives ----------

  // Stick figure centred on (cx, cy). `scale` controls overall size.
  function stickFigure(
    cx: number,
    cy: number,
    scale: number,
    key: string,
    label?: string,
  ) {
    const headR = 3 * scale;
    const neck = cy - 2 * scale + headR;
    const torsoLen = 10 * scale;
    const torsoBottom = neck + torsoLen;
    const armY = neck + 2.5 * scale;
    const armSpan = 5 * scale;
    const legSpan = 4 * scale;
    const legLen = 7 * scale;
    return (
      <g key={key}>
        <circle
          cx={cx}
          cy={cy - 2 * scale}
          r={headR}
          fill={surface}
          stroke={ink}
          strokeWidth={1.2}
        />
        {/* Torso */}
        <line x1={cx} y1={neck} x2={cx} y2={torsoBottom} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        {/* Arms */}
        <line x1={cx} y1={armY} x2={cx - armSpan} y2={armY + 4 * scale} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={cx} y1={armY} x2={cx + armSpan} y2={armY + 4 * scale} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        {/* Legs */}
        <line x1={cx} y1={torsoBottom} x2={cx - legSpan} y2={torsoBottom + legLen} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        <line x1={cx} y1={torsoBottom} x2={cx + legSpan} y2={torsoBottom + legLen} stroke={ink} strokeWidth={1.2} strokeLinecap="round" />
        {label ? (
          <text
            x={cx}
            y={torsoBottom + legLen + 8}
            textAnchor="middle"
            fontFamily="var(--font-mono)"
            fontSize={Math.max(7, 8 * scale)}
            fill={inkSoft}
          >
            {label}
          </text>
        ) : null}
      </g>
    );
  }

  // Thought bubble: a scalloped ellipse containing text, plus two tiny
  // connector bubbles linking it to the thinker at (fromX, fromY).
  function thoughtBubble(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    text: string,
    fromX: number,
    fromY: number,
    key: string,
  ) {
    // Scallop approximation: draw the main ellipse, then small arcs on top.
    const bumps = 10;
    const arcs: string[] = [];
    for (let i = 0; i < bumps; i++) {
      const a = (i / bumps) * Math.PI * 2;
      const bx = cx + rx * Math.cos(a);
      const by = cy + ry * Math.sin(a);
      arcs.push(`M ${bx - 1.3} ${by} a 1.3 1.3 0 1 0 2.6 0`);
    }
    // Tiny connector bubbles between bubble and thinker.
    const midX1 = (cx + fromX) / 2 + (fromX - cx) * 0.2;
    const midY1 = (cy + fromY) / 2 - 3;
    const midX2 = (cx + fromX) / 2 + (fromX - cx) * 0.45;
    const midY2 = (cy + fromY) / 2 + 3;
    const fontSize = Math.max(7, Math.min(9, iw * 0.017));
    return (
      <g key={key}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={surface} stroke={ink} strokeWidth={1.1} />
        {arcs.map((d, i) => (
          <path key={`scallop-${key}-${i}`} d={d} fill={surface} stroke={ink} strokeWidth={0.9} />
        ))}
        <circle cx={midX1} cy={midY1} r={1.8} fill={surface} stroke={ink} strokeWidth={0.9} />
        <circle cx={midX2} cy={midY2} r={1.2} fill={surface} stroke={ink} strokeWidth={0.8} />
        <text
          x={cx}
          y={cy + fontSize / 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill={inkSoft}
        >
          {text}
        </text>
      </g>
    );
  }

  // Speech bubble: an ellipse with a triangular tail pointing to (tailX, tailY).
  function speechBubble(
    cx: number,
    cy: number,
    rx: number,
    ry: number,
    text: string,
    tailX: number,
    tailY: number,
    key: string,
  ) {
    // Tail: small triangle from the bubble edge toward (tailX, tailY).
    const dx = tailX - cx;
    const dy = tailY - cy;
    const len = Math.hypot(dx, dy) || 1;
    const anchorX = cx + (dx / len) * rx * 0.9;
    const anchorY = cy + (dy / len) * ry * 0.9;
    // Perpendicular for the base of the tail.
    const perpX = -dy / len;
    const perpY = dx / len;
    const baseHalf = 3;
    const b1x = anchorX + perpX * baseHalf;
    const b1y = anchorY + perpY * baseHalf;
    const b2x = anchorX - perpX * baseHalf;
    const b2y = anchorY - perpY * baseHalf;
    const fontSize = Math.max(7, Math.min(9, iw * 0.017));
    return (
      <g key={key}>
        <ellipse cx={cx} cy={cy} rx={rx} ry={ry} fill={surface} stroke={ink} strokeWidth={1.1} />
        <polygon
          points={`${b1x},${b1y} ${b2x},${b2y} ${tailX},${tailY}`}
          fill={surface}
          stroke={ink}
          strokeWidth={1.1}
        />
        {/* Erase the bubble edge beneath the tail with a short cover line. */}
        <line x1={b1x} y1={b1y} x2={b2x} y2={b2y} stroke={surface} strokeWidth={1.4} />
        <text
          x={cx}
          y={cy + fontSize / 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill={inkSoft}
        >
          {text}
        </text>
      </g>
    );
  }

  // Cloud: a scalloped outline suggesting a hand-drawn cloud shape.
  function cloud(cx: number, cy: number, rx: number, ry: number, label: string, key: string) {
    // Construct path as a series of arcs around the ellipse perimeter.
    const bumps = 9;
    const pts: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < bumps; i++) {
      const a = (i / bumps) * Math.PI * 2 - Math.PI / 2;
      pts.push({ x: cx + rx * Math.cos(a), y: cy + ry * Math.sin(a) });
    }
    let d = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 1; i <= bumps; i++) {
      const next = pts[i % bumps];
      const prev = pts[i - 1];
      const midX = (prev.x + next.x) / 2;
      const midY = (prev.y + next.y) / 2;
      const dirX = next.x - prev.x;
      const dirY = next.y - prev.y;
      const segLen = Math.hypot(dirX, dirY) || 1;
      const outX = midX + (-dirY / segLen) * 3.2;
      const outY = midY + (dirX / segLen) * 3.2;
      d += ` Q ${outX} ${outY} ${next.x} ${next.y}`;
    }
    d += " Z";
    const fontSize = Math.max(7, Math.min(9, iw * 0.017));
    return (
      <g key={key}>
        <path d={d} fill={surface} stroke={ink} strokeWidth={1.1} />
        <text
          x={cx}
          y={cy + fontSize / 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill={inkSoft}
        >
          {label}
        </text>
      </g>
    );
  }

  // Crossed swords: two rotated rectangles + small triangular hilts, centred.
  function crossedSwords(cx: number, cy: number, size: number, key: string) {
    const len = size;
    const w = size * 0.18;
    const hiltW = size * 0.55;
    const hiltH = size * 0.14;
    const shapes: React.ReactNode[] = [];
    for (const angleDeg of [45, -45]) {
      // Blade rect centred on (cx, cy) and rotated.
      const rectId = `${key}-${angleDeg}`;
      shapes.push(
        <g key={rectId} transform={`rotate(${angleDeg} ${cx} ${cy})`}>
          <rect
            x={cx - w / 2}
            y={cy - len / 2}
            width={w}
            height={len}
            fill={surface}
            stroke={ink}
            strokeWidth={1}
          />
          {/* Hilt guard near the blade handle (top end). */}
          <rect
            x={cx - hiltW / 2}
            y={cy + len / 2 - hiltH - len * 0.04}
            width={hiltW}
            height={hiltH}
            fill={ink}
          />
          {/* Pointed tip triangle. */}
          <polygon
            points={`${cx - w / 2},${cy - len / 2} ${cx + w / 2},${cy - len / 2} ${cx},${cy - len / 2 - 4}`}
            fill={ink}
          />
        </g>,
      );
    }
    return <g key={key}>{shapes}</g>;
  }

  // Labelled arrow between two points.
  function labelledArrow(
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    label: string,
    key: string,
    curve = 0,
  ) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.hypot(dx, dy) || 1;
    const perpX = -dy / len;
    const perpY = dx / len;
    const cpX = mx + perpX * curve;
    const cpY = my + perpY * curve;
    const d = `M ${x1} ${y1} Q ${cpX} ${cpY} ${x2} ${y2}`;
    const fontSize = Math.max(6.5, Math.min(8.5, iw * 0.016));
    const approxW = label.length * fontSize * 0.55 + 6;
    const labelX = (mx + cpX) / 2;
    const labelY = (my + cpY) / 2;
    return (
      <g key={key}>
        <path
          d={d}
          fill="none"
          stroke={ink}
          strokeWidth={1.1}
          markerEnd="url(#rpd-arrow)"
        />
        <rect
          x={labelX - approxW / 2}
          y={labelY - (fontSize + 2) / 2}
          width={approxW}
          height={fontSize + 2}
          fill={surface}
          opacity={0.92}
          rx={2}
        />
        <text
          x={labelX}
          y={labelY + fontSize / 3}
          textAnchor="middle"
          fontFamily="var(--font-mono)"
          fontSize={fontSize}
          fill={inkSoft}
        >
          {label}
        </text>
      </g>
    );
  }

  // ---------- Positions (in layout space) ----------

  // Teachers clustered left-centre.
  const teachers = [
    { x: 14, y: 48 },
    { x: 22, y: 58 },
    { x: 12, y: 64 },
  ];
  // Principal centre.
  const principal = { x: 50, y: 55 };
  // Parents bottom-left & bottom-right.
  const parentLeft  = { x: 32, y: 88 };
  const parentRight = { x: 64, y: 88 };
  // Ministry cloud top-right.
  const ministry = { x: 82, y: 14 };
  // Conflict zone between teachers and principal.
  const conflict = { x: 34, y: 44 };

  // Principal clipboard position (a small rectangle beside the figure).
  const clipboard = {
    x: principal.x + 8,
    y: principal.y,
  };

  // Convert to pixel space helpers.
  const P = (p: { x: number; y: number }) => ({ x: px(p.x), y: py(p.y) });

  // ---------- Anchor geometries ----------

  const principalPx = P(principal);
  const teacherPx   = P(teachers[0]);
  const parentRPx   = P(parentRight);
  const ministryPx  = P(ministry);
  const conflictPx  = P(conflict);

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const y = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width - (x - r.x)));
    const h = Math.max(0, Math.min(ih - y, r.height - (y - r.y)));
    return { x, y, width: w, height: h };
  };

  return (
    <svg width={width} height={height} role="img" aria-label="Rich Picture Diagram">
      <defs>
        <marker
          id="rpd-arrow"
          markerWidth={7}
          markerHeight={7}
          refX={6}
          refY={3.5}
          orient="auto"
          markerUnits="strokeWidth"
        >
          <polygon points="0,0 7,3.5 0,7" fill={ink} />
        </marker>
      </defs>

      <Group left={margin.left} top={margin.top}>
        {/* Ministry cloud (top-right) */}
        <g data-data-layer="true">
          {cloud(ministryPx.x, ministryPx.y, px(14), py(8), "Ministry funding", "cloud-ministry")}
        </g>

        {/* Org-box / organisation rectangle framing the school, as context. */}
        <g data-data-layer="true">
          <rect
            x={px(6)}
            y={py(38)}
            width={px(62)}
            height={py(34)}
            fill="none"
            stroke={inkMute}
            strokeWidth={1}
            strokeDasharray="4 3"
            rx={4}
          />
          <text
            x={px(10)}
            y={py(38) - 4}
            fontFamily="var(--font-mono)"
            fontSize={Math.max(7, Math.min(9, iw * 0.017))}
            fill={inkMute}
          >
            SCHOOL
          </text>
        </g>

        {/* Arrows — flows of information / materials / policy */}
        <g data-data-layer="true">
          {/* Ministry → Principal: policies */}
          {labelledArrow(
            ministryPx.x - px(6),
            ministryPx.y + py(6),
            principalPx.x + px(1),
            principalPx.y - py(5),
            "policies",
            "arrow-policies",
            -10,
          )}
          {/* Principal → Ministry: reports */}
          {labelledArrow(
            principalPx.x + px(2),
            principalPx.y - py(6),
            ministryPx.x - px(8),
            ministryPx.y + py(4),
            "reports",
            "arrow-reports",
            10,
          )}
          {/* Parent-right → Principal: complaints */}
          {labelledArrow(
            parentRPx.x - px(3),
            parentRPx.y - py(4),
            principalPx.x + px(2),
            principalPx.y + py(6),
            "complaints",
            "arrow-complaints",
            -14,
          )}
          {/* Parent-left → Principal: complaints */}
          {labelledArrow(
            P(parentLeft).x + px(3),
            P(parentLeft).y - py(4),
            principalPx.x - px(3),
            principalPx.y + py(6),
            "complaints",
            "arrow-complaints-left",
            10,
          )}
        </g>

        {/* Stick figures — stakeholders */}
        <g data-data-layer="true">
          {teachers.map((t, i) =>
            stickFigure(P(t).x, P(t).y, 1.05, `teacher-${i}`, i === 1 ? "Teachers" : undefined),
          )}
          {stickFigure(principalPx.x, principalPx.y, 1.2, "principal", "Principal")}
          {stickFigure(P(parentLeft).x, P(parentLeft).y, 1.0, "parent-left", "Parent")}
          {stickFigure(P(parentRight).x, P(parentRight).y, 1.0, "parent-right", "Parent")}
        </g>

        {/* Clipboard beside the principal — a quick org-box prop */}
        <g data-data-layer="true">
          <rect
            x={clipboard.x / 100 * iw - 3}
            y={py(clipboard.y) - 6}
            width={9}
            height={12}
            fill={surface}
            stroke={ink}
            strokeWidth={0.9}
            rx={1}
          />
          <line
            x1={clipboard.x / 100 * iw - 2}
            y1={py(clipboard.y) - 3}
            x2={clipboard.x / 100 * iw + 3}
            y2={py(clipboard.y) - 3}
            stroke={inkMute}
            strokeWidth={0.6}
          />
          <line
            x1={clipboard.x / 100 * iw - 2}
            y1={py(clipboard.y)}
            x2={clipboard.x / 100 * iw + 3}
            y2={py(clipboard.y)}
            stroke={inkMute}
            strokeWidth={0.6}
          />
        </g>

        {/* Thought bubble — teachers thinking about admin paperwork */}
        <g data-data-layer="true">
          {thoughtBubble(
            px(22),
            py(32),
            px(12),
            py(6),
            "too much paperwork",
            P(teachers[1]).x,
            P(teachers[1]).y - py(6),
            "thought-teachers",
          )}
        </g>

        {/* Speech bubbles — the parents disagree about homework */}
        <g data-data-layer="true">
          {speechBubble(
            P(parentLeft).x - px(2),
            P(parentLeft).y - py(14),
            px(11),
            py(5),
            "more homework!",
            P(parentLeft).x,
            P(parentLeft).y - py(8),
            "speech-parent-left",
          )}
          {speechBubble(
            P(parentRight).x + px(2),
            P(parentRight).y - py(14),
            px(11),
            py(5),
            "less homework!",
            P(parentRight).x,
            P(parentRight).y - py(8),
            "speech-parent-right",
          )}
        </g>

        {/* Crossed swords — conflict between teachers and principal */}
        <g data-data-layer="true">
          {crossedSwords(conflictPx.x, conflictPx.y, Math.min(px(8), py(12)), "swords-conflict")}
        </g>

        {/* ---------- Anchors ---------- */}

        {/* 1. Stick figure (a stakeholder) */}
        <ExplainAnchor
          selector="stick-figure"
          index={1}
          pin={{ x: principalPx.x - px(9), y: principalPx.y - py(2) }}
          rect={clamp({
            x: principalPx.x - px(6),
            y: principalPx.y - py(8),
            width: px(12),
            height: py(20),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Thought bubble — a stakeholder's private concern */}
        <ExplainAnchor
          selector="thought-bubble"
          index={2}
          pin={{ x: px(22), y: py(32) - py(8) }}
          rect={clamp({
            x: px(22) - px(12),
            y: py(32) - py(7),
            width: px(24),
            height: py(14),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Speech bubble — a stakeholder's overt position */}
        <ExplainAnchor
          selector="speech-bubble"
          index={3}
          pin={{ x: P(parentRight).x + px(2), y: P(parentRight).y - py(20) }}
          rect={clamp({
            x: P(parentRight).x - px(9),
            y: P(parentRight).y - py(19),
            width: px(22),
            height: py(10),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. Crossed swords — a conflict between parties */}
        <ExplainAnchor
          selector="crossed-swords"
          index={4}
          pin={{ x: conflictPx.x - px(7), y: conflictPx.y }}
          rect={clamp({
            x: conflictPx.x - px(6),
            y: conflictPx.y - py(6),
            width: px(12),
            height: py(12),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Cloud — a fuzzy, ambiguous element (Ministry funding) */}
        <ExplainAnchor
          selector="cloud"
          index={5}
          pin={{ x: ministryPx.x, y: ministryPx.y - py(10) }}
          rect={clamp({
            x: ministryPx.x - px(15),
            y: ministryPx.y - py(9),
            width: px(30),
            height: py(18),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Labelled flow arrow — information/policy/complaint */}
        <ExplainAnchor
          selector="flow-arrow"
          index={6}
          pin={{ x: (ministryPx.x + principalPx.x) / 2, y: (ministryPx.y + principalPx.y) / 2 }}
          rect={clamp({
            x: Math.min(ministryPx.x, principalPx.x),
            y: Math.min(ministryPx.y, principalPx.y),
            width: Math.abs(ministryPx.x - principalPx.x),
            height: Math.abs(ministryPx.y - principalPx.y),
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Org-box — the school boundary (a bounded institution) */}
        <ExplainAnchor
          selector="org-box"
          index={7}
          pin={{ x: px(10), y: py(38) - 10 }}
          rect={clamp({
            x: px(6),
            y: py(38),
            width: px(62),
            height: py(34),
          })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
