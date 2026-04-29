"use client";

import { Group } from "@visx/group";
import { scaleLinear } from "@visx/scale";
import { ExplainAnchor } from "@/components/chart/ExplainAnchor";

// Two fictional RPG-style ability profiles on six axes.
type Stats = {
  Speed: number;
  Attack: number;
  Defence: number;
  HP: number;
  Special: number;
  Evasion: number;
};

const AXES = ["Speed", "Attack", "Defence", "HP", "Special", "Evasion"] as const;
type Axis = (typeof AXES)[number];

const CHARS: ReadonlyArray<{ name: string; stats: Stats; opacity: number }> = [
  {
    name: "Thundershock",
    stats: { Speed: 95, Attack: 85, Defence: 40, HP: 60, Special: 90, Evasion: 70 },
    opacity: 0.22,
  },
  {
    name: "Ironhide",
    stats: { Speed: 30, Attack: 70, Defence: 95, HP: 95, Special: 40, Evasion: 25 },
    opacity: 0.16,
  },
];

interface Props {
  width: number;
  height: number;
}

export function RadarChart({ width, height }: Props) {
  // Square-ish layout with room for axis labels + a small legend underneath.
  const margin = { top: 20, right: 20, bottom: 44, left: 20 };
  const iw = Math.max(0, width - margin.left - margin.right);
  const ih = Math.max(0, height - margin.top - margin.bottom);

  const cx = iw / 2;
  const cy = ih / 2;
  // Reserve radial padding for axis labels.
  const maxRadius = Math.max(0, Math.min(iw, ih) / 2 - 22);

  const rScale = scaleLinear({ domain: [0, 100], range: [0, maxRadius] });

  // Angles — six axes, 60° apart, first axis at 12 o'clock (offset -90°).
  const angle = (i: number) => (-Math.PI / 2) + (i * 2 * Math.PI) / AXES.length;

  const pointAt = (i: number, value: number) => {
    const r = rScale(value);
    return { x: cx + r * Math.cos(angle(i)), y: cy + r * Math.sin(angle(i)) };
  };

  const axisEndpoint = (i: number) => pointAt(i, 100);

  const ringLevels = [25, 50, 75, 100];

  const polygonPoints = (stats: Stats) =>
    AXES.map((a, i) => {
      const p = pointAt(i, stats[a]);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");

  const ringPoints = (level: number) =>
    AXES.map((_, i) => {
      const p = pointAt(i, level);
      return `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    }).join(" ");

  // Label offsets per axis — nudge outward so text clears the outer ring.
  const labelFor = (i: number) => {
    const base = pointAt(i, 100);
    const dx = Math.cos(angle(i));
    const dy = Math.sin(angle(i));
    return { x: base.x + dx * 14, y: base.y + dy * 14 };
  };

  // Speed axis (index 0, 12 o'clock) is the anchor exemplar for "axis".
  const speedLabel = labelFor(0);

  // Anchor a specific vertex: Thundershock's Speed vertex (extreme, pointy).
  const thunderSpeed = pointAt(0, CHARS[0].stats.Speed);

  // Legend sits just below the ring.
  const legendY = ih + 12;
  const legendItems = CHARS.map((c, i) => ({
    name: c.name,
    x: cx - 80 + i * 90,
    y: legendY,
    opacity: c.opacity,
  }));

  return (
    <svg width={width} height={height} role="img" aria-label="Radar chart">
      <Group left={margin.left} top={margin.top}>
        {/* Concentric rings — tick-ring grid */}
        <g data-data-layer="true">
          {ringLevels.map((lvl) => (
            <polygon
              key={lvl}
              points={ringPoints(lvl)}
              fill="none"
              stroke="var(--color-hairline)"
              strokeWidth={lvl === 100 ? 1 : 0.75}
            />
          ))}
          {/* Radial spokes */}
          {AXES.map((_, i) => {
            const end = axisEndpoint(i);
            return (
              <line
                key={i}
                x1={cx}
                y1={cy}
                x2={end.x}
                y2={end.y}
                stroke="var(--color-hairline)"
                strokeWidth={0.75}
              />
            );
          })}
        </g>

        {/* Polygons — one per character */}
        <g data-data-layer="true">
          {CHARS.map((c, idx) => (
            <polygon
              key={c.name}
              points={polygonPoints(c.stats)}
              fill={`rgba(26,22,20,${c.opacity.toFixed(3)})`}
              stroke="var(--color-ink)"
              strokeWidth={idx === 0 ? 1.8 : 1.2}
              strokeDasharray={idx === 0 ? undefined : "3 3"}
              strokeLinejoin="round"
            />
          ))}
          {/* Vertex dots */}
          {CHARS.flatMap((c, idx) =>
            AXES.map((a, i) => {
              const p = pointAt(i, c.stats[a]);
              return (
                <circle
                  key={`${c.name}-${a}`}
                  cx={p.x}
                  cy={p.y}
                  r={idx === 0 ? 2.4 : 2}
                  fill="var(--color-ink)"
                />
              );
            }),
          )}
        </g>

        {/* Axis labels */}
        <g data-data-layer="true">
          {AXES.map((a, i) => {
            const l = labelFor(i);
            // Anchor text based on horizontal position relative to centre.
            const anchor =
              Math.abs(l.x - cx) < 2
                ? "middle"
                : l.x > cx
                ? "start"
                : "end";
            return (
              <text
                key={a}
                x={l.x}
                y={l.y}
                textAnchor={anchor}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {a.toUpperCase()}
              </text>
            );
          })}
        </g>

        {/* Axis anchor — the Speed axis, 12 o'clock */}
        <ExplainAnchor
          selector="axis"
          index={1}
          pin={{ x: speedLabel.x + 18, y: speedLabel.y - 12 }}
          rect={{
            x: cx - 10,
            y: cy - maxRadius - 6,
            width: 20,
            height: maxRadius + 6,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Polygon anchor — Thundershock's shape */}
        <ExplainAnchor
          selector="polygon"
          index={2}
          pin={{ x: thunderSpeed.x + 14, y: thunderSpeed.y - 6 }}
          rect={{
            x: cx - maxRadius,
            y: cy - maxRadius,
            width: maxRadius * 2,
            height: maxRadius * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Vertex anchor — Thundershock's Speed point */}
        <ExplainAnchor
          selector="vertex"
          index={3}
          pin={{ x: thunderSpeed.x - 18, y: thunderSpeed.y + 4 }}
          rect={{
            x: thunderSpeed.x - 8,
            y: thunderSpeed.y - 8,
            width: 16,
            height: 16,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Tick-ring anchor — the 50 ring */}
        <ExplainAnchor
          selector="tick-ring"
          index={4}
          pin={{ x: cx + rScale(50) * Math.cos(angle(1)) + 10, y: cy + rScale(50) * Math.sin(angle(1)) - 10 }}
          rect={{
            x: cx - rScale(50),
            y: cy - rScale(50),
            width: rScale(50) * 2,
            height: rScale(50) * 2,
          }}
        >
          <g />
        </ExplainAnchor>

        {/* Legend */}
        <g data-data-layer="true">
          {legendItems.map((item, i) => (
            <g key={item.name} transform={`translate(${item.x}, ${item.y})`}>
              <rect
                x={0}
                y={-6}
                width={12}
                height={12}
                fill={`rgba(26,22,20,${item.opacity.toFixed(3)})`}
                stroke="var(--color-ink)"
                strokeWidth={i === 0 ? 1.4 : 1}
                strokeDasharray={i === 0 ? undefined : "2 2"}
              />
              <text
                x={18}
                y={0}
                dominantBaseline="middle"
                fontFamily="var(--font-mono)"
                fontSize={10}
                fill="var(--color-ink-soft)"
              >
                {item.name.toUpperCase()}
              </text>
            </g>
          ))}
        </g>
        <ExplainAnchor
          selector="legend-item"
          index={5}
          pin={{ x: legendItems[0].x - 16, y: legendItems[0].y }}
          rect={{
            x: legendItems[0].x - 6,
            y: legendItems[0].y - 10,
            width: 90,
            height: 20,
          }}
        >
          <g />
        </ExplainAnchor>
      </Group>
    </svg>
  );
}
