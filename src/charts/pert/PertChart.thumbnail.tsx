export function PertThumbnail() {
  // 4 small node boxes connected by arrows; one arrow emphasised as the
  // critical path.
  // Nodes positioned left-to-right: start, top branch, bottom branch, end.
  const nodes: Array<{ cx: number; cy: number }> = [
    { cx: 16, cy: 40 },
    { cx: 50, cy: 22 },
    { cx: 50, cy: 58 },
    { cx: 96, cy: 40 },
  ];
  const boxW = 20;
  const boxH = 14;

  // Edges: [fromIdx, toIdx, critical]
  const edges: Array<[number, number, boolean]> = [
    [0, 1, false],
    [0, 2, true],  // critical path lower
    [2, 3, true],  // critical path lower
    [1, 3, false],
  ];

  function boxR(n: { cx: number; cy: number }) {
    return {
      x: n.cx - boxW / 2,
      y: n.cy - boxH / 2,
      w: boxW,
      h: boxH,
    };
  }

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* edges first */}
      {edges.map(([a, b, crit], i) => {
        const from = nodes[a];
        const to = nodes[b];
        const sx = from.cx + boxW / 2;
        const sy = from.cy;
        const tx = to.cx - boxW / 2;
        const ty = to.cy;
        const midX = (sx + tx) / 2;
        const d =
          Math.abs(sy - ty) < 2
            ? `M ${sx} ${sy} L ${tx} ${ty}`
            : `M ${sx} ${sy} L ${midX} ${sy} L ${midX} ${ty} L ${tx} ${ty}`;
        return (
          <g key={`e-${i}`}>
            <path
              d={d}
              fill="none"
              stroke="var(--color-ink)"
              strokeWidth={crit ? 1.8 : 0.9}
              opacity={crit ? 1 : 0.55}
            />
            {/* arrowhead tip */}
            <polygon
              points={`${tx},${ty} ${tx - 3},${ty - 1.8} ${tx - 3},${ty + 1.8}`}
              fill="var(--color-ink)"
              opacity={crit ? 1 : 0.55}
            />
          </g>
        );
      })}
      {/* nodes */}
      {nodes.map((n, i) => {
        const r = boxR(n);
        const midX = n.cx;
        const midY = n.cy;
        // Emphasise critical-path nodes (0, 2, 3).
        const crit = i === 0 || i === 2 || i === 3;
        return (
          <g key={`n-${i}`}>
            <rect
              x={r.x}
              y={r.y}
              width={r.w}
              height={r.h}
              rx={1}
              ry={1}
              fill="var(--color-surface)"
              stroke="var(--color-ink)"
              strokeWidth={crit ? 1.4 : 0.9}
            />
            {/* 4-panel cross divider */}
            <line x1={midX} y1={r.y} x2={midX} y2={r.y + r.h} stroke="var(--color-ink)" strokeWidth={0.5} opacity={0.55} />
            <line x1={r.x} y1={midY} x2={r.x + r.w} y2={midY} stroke="var(--color-ink)" strokeWidth={0.5} opacity={0.55} />
          </g>
        );
      })}
    </svg>
  );
}
