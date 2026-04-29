export function ArcDiagramThumbnail() {
  // Eight nodes along a baseline with semicircular arcs of varying width.
  // A tiny silhouette of the canonical shape.
  const baselineY = 58;
  const nodes = [12, 26, 40, 54, 68, 82, 96, 110];

  // [startIdx, endIdx, strokeWidth, opacity]
  const arcs: Array<[number, number, number, number]> = [
    [0, 1, 0.9, 0.35],
    [0, 3, 1.6, 0.6],
    [1, 2, 0.9, 0.4],
    [2, 4, 2.4, 0.75],
    [3, 6, 1.2, 0.45],
    [4, 5, 0.9, 0.4],
    [4, 7, 1.8, 0.55],
    [5, 6, 2.2, 0.7],
    [6, 7, 1.0, 0.45],
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Baseline. */}
      <line
        x1="8"
        y1={baselineY}
        x2="112"
        y2={baselineY}
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      {/* Arcs. */}
      <g fill="none" strokeLinecap="round" stroke="var(--color-ink)">
        {arcs.map(([i, j, w, o], k) => {
          const x1 = nodes[i];
          const x2 = nodes[j];
          const r = Math.abs(x2 - x1) / 2;
          return (
            <path
              key={k}
              d={`M ${x1} ${baselineY} A ${r} ${r} 0 0 0 ${x2} ${baselineY}`}
              strokeWidth={w}
              strokeOpacity={o}
            />
          );
        })}
      </g>
      {/* Nodes. */}
      {nodes.map((x, i) => (
        <circle key={i} cx={x} cy={baselineY} r="2.2" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
