"use client";

import { Group } from "@visx/group";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

interface Props {
  width: number;
  height: number;
}

// Exploded-view of a simplified bicycle hub. Components stacked on one
// vertical axis from top to bottom:
//   1. End cap (top)
//   2. Bearing race (top)
//   3. Hub shell (main body with spoke-hole flanges)
//   4. Axle
//   5. Bearing race (bottom)
//   6. Locknut (hex)
//   7. End cap (bottom)
// A dashed vertical centre-line runs through the whole assembly — the axis of
// insertion. Each part is labelled with a diagonal leader line ending in a
// numbered callout. A small bill-of-materials rides on the right.

export function ExplodedViewDrawing({ width, height }: Props) {
  const margin = { top: 18, right: 18, bottom: 22, left: 22 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  // Centre-line x-position — assembly lies to the LEFT, BOM to the right.
  const assemblyCX = iw * 0.42;

  // Define parts by vertical fraction [0..1] of plot height.
  interface Part {
    id: string;
    number: number;
    name: string;
    cy: number; // pixel Y centre
    draw: (cx: number, cy: number) => React.ReactNode;
    // leader target: the point on the part the leader line ends at.
    leaderAnchor: { dx: number; dy: number };
  }

  const partWidth = Math.min(iw * 0.38, 110);
  const hubShellWidth = Math.min(iw * 0.48, 140);

  const y = (frac: number) => ih * frac;

  const parts: Part[] = [
    // 1. Top end cap — squat rectangle (cylinder in elevation).
    {
      id: "cap-top",
      number: 1,
      name: "End cap",
      cy: y(0.06),
      draw: (cx, cy) => (
        <g>
          <rect
            x={cx - partWidth * 0.18}
            y={cy - 5}
            width={partWidth * 0.36}
            height={10}
            rx={1.5}
            ry={1.5}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* small hemisphere cap at the top */}
          <path
            d={`M ${cx - partWidth * 0.18} ${cy - 5} Q ${cx} ${cy - 12} ${cx + partWidth * 0.18} ${cy - 5}`}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
        </g>
      ),
      leaderAnchor: { dx: partWidth * 0.18, dy: 0 },
    },
    // 2. Top bearing race — small rectangle with X cross-hatch.
    {
      id: "race-top",
      number: 2,
      name: "Bearing race",
      cy: y(0.18),
      draw: (cx, cy) => (
        <g>
          <rect
            x={cx - partWidth * 0.22}
            y={cy - 5}
            width={partWidth * 0.44}
            height={10}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* cross hatch — bearing symbol */}
          <line x1={cx - partWidth * 0.22} y1={cy - 5} x2={cx + partWidth * 0.22} y2={cy + 5} stroke="var(--color-ink)" strokeWidth={1} />
          <line x1={cx - partWidth * 0.22} y1={cy + 5} x2={cx + partWidth * 0.22} y2={cy - 5} stroke="var(--color-ink)" strokeWidth={1} />
        </g>
      ),
      leaderAnchor: { dx: partWidth * 0.22, dy: 0 },
    },
    // 3. Hub shell — larger cylinder with spoke-hole flanges at each end.
    {
      id: "hub-shell",
      number: 3,
      name: "Hub shell",
      cy: y(0.42),
      draw: (cx, cy) => {
        const hw = hubShellWidth / 2;
        const flangeH = 6;
        const bodyH = 44;
        const top = cy - bodyH / 2;
        const bot = cy + bodyH / 2;
        return (
          <g>
            {/* top flange */}
            <rect
              x={cx - hw}
              y={top - flangeH}
              width={hw * 2}
              height={flangeH}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
            {/* spoke holes on top flange */}
            {[-0.8, -0.45, -0.1, 0.25, 0.6].map((t, i) => (
              <circle
                key={`spt-${i}`}
                cx={cx + t * hw}
                cy={top - flangeH / 2}
                r={1.2}
                fill="var(--color-ink)"
              />
            ))}
            {/* body */}
            <rect
              x={cx - hw * 0.55}
              y={top}
              width={hw * 2 * 0.55}
              height={bodyH}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
            {/* bottom flange */}
            <rect
              x={cx - hw}
              y={bot}
              width={hw * 2}
              height={flangeH}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
            {[-0.8, -0.45, -0.1, 0.25, 0.6].map((t, i) => (
              <circle
                key={`spb-${i}`}
                cx={cx + t * hw}
                cy={bot + flangeH / 2}
                r={1.2}
                fill="var(--color-ink)"
              />
            ))}
            {/* internal bore indication (dashed hidden line) */}
            <line
              x1={cx - hw * 0.18}
              y1={top}
              x2={cx - hw * 0.18}
              y2={bot}
              stroke="var(--color-ink-soft)"
              strokeWidth={0.8}
              strokeDasharray="2 2"
            />
            <line
              x1={cx + hw * 0.18}
              y1={top}
              x2={cx + hw * 0.18}
              y2={bot}
              stroke="var(--color-ink-soft)"
              strokeWidth={0.8}
              strokeDasharray="2 2"
            />
          </g>
        );
      },
      leaderAnchor: { dx: hubShellWidth / 2, dy: -8 },
    },
    // 4. Axle — long thin cylinder running vertically.
    {
      id: "axle",
      number: 4,
      name: "Axle",
      cy: y(0.68),
      draw: (cx, cy) => (
        <g>
          <rect
            x={cx - 4}
            y={cy - 28}
            width={8}
            height={56}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          {/* thread indication (short dashes) */}
          {[-24, -18, -12, 12, 18, 24].map((dy, i) => (
            <line
              key={`thr-${i}`}
              x1={cx - 4}
              y1={cy + dy}
              x2={cx + 4}
              y2={cy + dy}
              stroke="var(--color-ink-soft)"
              strokeWidth={0.8}
            />
          ))}
        </g>
      ),
      leaderAnchor: { dx: 4, dy: 0 },
    },
    // 5. Bottom bearing race — mirror of part 2.
    {
      id: "race-bot",
      number: 5,
      name: "Bearing race",
      cy: y(0.82),
      draw: (cx, cy) => (
        <g>
          <rect
            x={cx - partWidth * 0.22}
            y={cy - 5}
            width={partWidth * 0.44}
            height={10}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <line x1={cx - partWidth * 0.22} y1={cy - 5} x2={cx + partWidth * 0.22} y2={cy + 5} stroke="var(--color-ink)" strokeWidth={1} />
          <line x1={cx - partWidth * 0.22} y1={cy + 5} x2={cx + partWidth * 0.22} y2={cy - 5} stroke="var(--color-ink)" strokeWidth={1} />
        </g>
      ),
      leaderAnchor: { dx: partWidth * 0.22, dy: 0 },
    },
    // 6. Locknut — hexagon.
    {
      id: "locknut",
      number: 6,
      name: "Locknut",
      cy: y(0.9),
      draw: (cx, cy) => {
        const r = 8;
        const points: string[] = [];
        for (let i = 0; i < 6; i++) {
          const a = (Math.PI / 3) * i + Math.PI / 6;
          points.push(`${cx + r * Math.cos(a)},${cy + r * Math.sin(a)}`);
        }
        return (
          <g>
            <polygon
              points={points.join(" ")}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={1.3}
            />
            {/* inner circle — threaded bore */}
            <circle cx={cx} cy={cy} r={2.2} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
          </g>
        );
      },
      leaderAnchor: { dx: 8, dy: 0 },
    },
    // 7. Bottom end cap.
    {
      id: "cap-bot",
      number: 7,
      name: "End cap",
      cy: y(0.98),
      draw: (cx, cy) => (
        <g>
          <rect
            x={cx - partWidth * 0.18}
            y={cy - 5}
            width={partWidth * 0.36}
            height={10}
            rx={1.5}
            ry={1.5}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
          <path
            d={`M ${cx - partWidth * 0.18} ${cy + 5} Q ${cx} ${cy + 12} ${cx + partWidth * 0.18} ${cy + 5}`}
            fill="var(--color-surface)"
            stroke="var(--color-ink)"
            strokeWidth={1.3}
          />
        </g>
      ),
      leaderAnchor: { dx: partWidth * 0.18, dy: 0 },
    },
  ];

  // Centre-line vertical extent (extend beyond first & last component a bit).
  const clTop = parts[0].cy - 16;
  const clBot = parts[parts.length - 1].cy + 16;

  // Leader / callout geometry.
  // Callouts sit in a column at a fixed x, right of the assembly.
  const calloutColX = Math.min(iw - 120, assemblyCX + 88);
  const calloutR = 7;

  // BOM table geometry.
  const bomX = Math.min(iw - 6, calloutColX + 40);
  const bomW = Math.max(48, iw - bomX - 2);
  const bomY = ih * 0.18;
  const bomRowH = 11;
  const bomRows: Array<{ n: number; part: string; qty: number }> = [
    { n: 1, part: "End cap", qty: 2 },
    { n: 2, part: "Bearing race", qty: 2 },
    { n: 3, part: "Hub shell", qty: 1 },
    { n: 4, part: "Axle", qty: 1 },
    { n: 5, part: "Locknut", qty: 2 },
  ];
  const bomH = bomRowH * (bomRows.length + 1) + 6;

  const clamp = (r: { x: number; y: number; width: number; height: number }) => {
    const x = Math.max(0, Math.min(iw, r.x));
    const yc = Math.max(0, Math.min(ih, r.y));
    const w = Math.max(0, Math.min(iw - x, r.width));
    const h = Math.max(0, Math.min(ih - yc, r.height));
    return { x, y: yc, width: w, height: h };
  };

  // Specific anchor targets.
  const hubShellPart = parts[2];
  const locknutPart = parts[5];

  return (
    <svg width={width} height={height} role="img" aria-label="Exploded-view drawing">
      <Group left={margin.left} top={margin.top}>
        <g data-data-layer="true">
          {/* Dashed vertical centre-line — axis of insertion */}
          <line
            x1={assemblyCX}
            y1={clTop}
            x2={assemblyCX}
            y2={clBot}
            stroke="var(--color-ink)"
            strokeWidth={1}
            strokeDasharray="6 3 1 3"
          />

          {/* Components */}
          {parts.map((p) => (
            <g key={p.id}>{p.draw(assemblyCX, p.cy)}</g>
          ))}

          {/* Leader lines + numbered callouts */}
          {parts.map((p) => {
            const anchorX = assemblyCX + p.leaderAnchor.dx;
            const anchorY = p.cy + p.leaderAnchor.dy;
            const calloutCY = p.cy;
            return (
              <g key={`ldr-${p.id}`}>
                <line
                  x1={anchorX}
                  y1={anchorY}
                  x2={calloutColX - calloutR}
                  y2={calloutCY}
                  stroke="var(--color-ink-mute)"
                  strokeWidth={0.9}
                />
                {/* small dot at the part end of the leader */}
                <circle cx={anchorX} cy={anchorY} r={1.4} fill="var(--color-ink)" />
                {/* callout circle */}
                <circle
                  cx={calloutColX}
                  cy={calloutCY}
                  r={calloutR}
                  fill="var(--color-surface)"
                  stroke="var(--color-ink)"
                  strokeWidth={1.2}
                />
                <text
                  x={calloutColX}
                  y={calloutCY + 3}
                  textAnchor="middle"
                  fontFamily="var(--font-mono)"
                  fontSize={9}
                  fontWeight={600}
                  fill="var(--color-ink)"
                >
                  {p.number}
                </text>
              </g>
            );
          })}

          {/* Bill of materials — drawn only if there is room on the right */}
          {bomW >= 48 && (
            <g transform={`translate(${bomX}, ${bomY})`}>
              <rect
                x={0}
                y={0}
                width={bomW}
                height={bomH}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth={1.1}
              />
              {/* header row */}
              <line x1={0} y1={bomRowH + 2} x2={bomW} y2={bomRowH + 2} stroke="var(--color-ink)" strokeWidth={1} />
              <text
                x={5}
                y={bomRowH - 2}
                fontFamily="var(--font-mono)"
                fontSize={8}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                #
              </text>
              <text
                x={18}
                y={bomRowH - 2}
                fontFamily="var(--font-mono)"
                fontSize={8}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                PART
              </text>
              <text
                x={bomW - 5}
                y={bomRowH - 2}
                textAnchor="end"
                fontFamily="var(--font-mono)"
                fontSize={8}
                fontWeight={600}
                fill="var(--color-ink)"
              >
                QTY
              </text>
              {bomRows.map((r, i) => {
                const ry = (i + 2) * bomRowH;
                return (
                  <g key={`bom-${r.n}`}>
                    <text
                      x={5}
                      y={ry - 2}
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink)"
                    >
                      {r.n}
                    </text>
                    <text
                      x={18}
                      y={ry - 2}
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink)"
                    >
                      {r.part}
                    </text>
                    <text
                      x={bomW - 5}
                      y={ry - 2}
                      textAnchor="end"
                      fontFamily="var(--font-mono)"
                      fontSize={8}
                      fill="var(--color-ink)"
                    >
                      {r.qty}
                    </text>
                  </g>
                );
              })}
            </g>
          )}
        </g>

        {/* ===== ExplainAnchors ===== */}

        {/* 1. Hub shell (the central component) */}
        <ExplainAnchor
          selector="component"
          index={1}
          pin={{ x: Math.max(6, assemblyCX - hubShellWidth / 2 - 14), y: hubShellPart.cy }}
          rect={clamp({
            x: assemblyCX - hubShellWidth / 2 - 4,
            y: hubShellPart.cy - 28,
            width: hubShellWidth + 8,
            height: 56,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 2. Centre-line (dashed axis of insertion) */}
        <ExplainAnchor
          selector="centre-line"
          index={2}
          pin={{ x: assemblyCX - 22, y: (clTop + clBot) / 2 }}
          rect={clamp({ x: assemblyCX - 5, y: clTop, width: 10, height: clBot - clTop })}
        >
          <g />
        </ExplainAnchor>

        {/* 3. Leader line with callout (anchor on part-3's leader) */}
        <ExplainAnchor
          selector="leader-callout"
          index={3}
          pin={{ x: calloutColX, y: hubShellPart.cy - calloutR - 14 }}
          rect={clamp({
            x: assemblyCX + hubShellWidth / 2 - 4,
            y: hubShellPart.cy - 14,
            width: calloutColX - (assemblyCX + hubShellWidth / 2) + calloutR + 4,
            height: 28,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 4. BOM (bill of materials) */}
        <ExplainAnchor
          selector="bom-table"
          index={4}
          pin={{ x: bomX + bomW / 2, y: Math.max(10, bomY - 8) }}
          rect={clamp({ x: bomX, y: bomY, width: bomW, height: bomH })}
        >
          <g />
        </ExplainAnchor>

        {/* 5. Stacking order = insertion order */}
        <ExplainAnchor
          selector="stacking-order"
          index={5}
          pin={{ x: calloutColX + calloutR + 10, y: (parts[0].cy + parts[parts.length - 1].cy) / 2 }}
          rect={clamp({
            x: calloutColX - calloutR - 2,
            y: parts[0].cy - calloutR - 2,
            width: calloutR * 2 + 4,
            height: parts[parts.length - 1].cy - parts[0].cy + calloutR * 2 + 4,
          })}
        >
          <g />
        </ExplainAnchor>

        {/* 6. Hexagon locknut */}
        <ExplainAnchor
          selector="hex-locknut"
          index={6}
          pin={{ x: Math.max(6, assemblyCX - 22), y: locknutPart.cy }}
          rect={clamp({ x: assemblyCX - 10, y: locknutPart.cy - 10, width: 20, height: 20 })}
        >
          <g />
        </ExplainAnchor>

        {/* 7. Symmetry axis — pin at the top of the centre-line (shows the axis extends beyond the parts) */}
        <ExplainAnchor
          selector="symmetry-axis"
          index={7}
          pin={{ x: assemblyCX, y: Math.max(4, clTop - 6) }}
          rect={clamp({ x: assemblyCX - 4, y: Math.max(0, clTop - 2), width: 8, height: 10 })}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
