// Top-down node-link tree silhouette — root at top, four branches, leaves below.

export function TreeThumbnail() {
  const rootX = 60;
  const rootY = 14;
  const midY = 38;
  const leafY = 62;

  // 4 paradigm nodes evenly spread.
  const paradigms = [20, 46, 74, 100].map((x) => ({ x, y: midY }));
  // 2-3 leaves per paradigm.
  const leafGroups: Array<Array<{ x: number; y: number }>> = [
    [{ x: 14, y: leafY }, { x: 26, y: leafY }],
    [{ x: 40, y: leafY }, { x: 52, y: leafY }],
    [{ x: 68, y: leafY }, { x: 80, y: leafY }],
    [{ x: 94, y: leafY }, { x: 106, y: leafY }],
  ];

  const elbow = (sx: number, sy: number, tx: number, ty: number) => {
    const my = (sy + ty) / 2;
    return `M${sx} ${sy} V${my} H${tx} V${ty}`;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root → paradigm links */}
      {paradigms.map((p, i) => (
        <path
          key={`rp-${i}`}
          d={elbow(rootX, rootY, p.x, p.y)}
          fill="none"
          stroke="var(--color-ink-mute)"
          strokeWidth={1}
        />
      ))}
      {/* Paradigm → leaf links */}
      {paradigms.flatMap((p, i) =>
        leafGroups[i].map((l, j) => (
          <path
            key={`pl-${i}-${j}`}
            d={elbow(p.x, p.y, l.x, l.y)}
            fill="none"
            stroke="var(--color-ink-mute)"
            strokeWidth={1}
          />
        )),
      )}
      {/* Leaf dots */}
      {leafGroups.flat().map((l, i) => (
        <circle
          key={`l-${i}`}
          cx={l.x}
          cy={l.y}
          r={1.6}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={1}
        />
      ))}
      {/* Paradigm dots */}
      {paradigms.map((p, i) => (
        <circle key={`p-${i}`} cx={p.x} cy={p.y} r={2.2} fill="var(--color-ink)" />
      ))}
      {/* Root */}
      <circle cx={rootX} cy={rootY} r={2.8} fill="var(--color-ink)" />
    </svg>
  );
}
