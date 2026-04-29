export function BumpThumbnail() {
  // Small bump silhouette: 5 lines over 5 weeks with visible crossings.
  // Rank 1 at top, rank 5 at bottom; one highlighted winner.
  const cols = [18, 40, 62, 84, 106];
  const rowY = (r: number) => 14 + (r - 1) * 12; // rows at y = 14, 26, 38, 50, 62

  // Each array is a song's ranks across 5 columns. Each column is a permutation of 1..5.
  const series: Array<{ ranks: number[]; winner?: boolean }> = [
    { ranks: [2, 1, 1, 1, 1], winner: true }, // winner — climbs to #1 and holds
    { ranks: [1, 2, 3, 4, 5] }, // start leader falls
    { ranks: [3, 3, 2, 2, 2] }, // steady #2
    { ranks: [4, 4, 4, 3, 3] },
    { ranks: [5, 5, 5, 5, 4] },
  ];

  // Simple cubic-ish path via quadratic curves between each column — more
  // faithful to the curveMonotoneX feel than straight line segments.
  function pathFor(ranks: number[]): string {
    let d = `M${cols[0]},${rowY(ranks[0])}`;
    for (let i = 1; i < ranks.length; i++) {
      const x0 = cols[i - 1];
      const x1 = cols[i];
      const y0 = rowY(ranks[i - 1]);
      const y1 = rowY(ranks[i]);
      const mx = (x0 + x1) / 2;
      d += ` C${mx},${y0} ${mx},${y1} ${x1},${y1}`;
    }
    return d;
  }

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Rank rows */}
      {[1, 2, 3, 4, 5].map((r) => (
        <line
          key={r}
          x1="10"
          x2="114"
          y1={rowY(r)}
          y2={rowY(r)}
          stroke="var(--color-hairline)"
          strokeDasharray={r === 1 ? undefined : "2 3"}
        />
      ))}
      {/* Non-winner lines */}
      {series.map((s, i) => {
        if (s.winner) return null;
        return (
          <g key={i}>
            <path
              d={pathFor(s.ranks)}
              fill="none"
              stroke="var(--color-ink)"
              strokeOpacity="0.45"
              strokeWidth="1.3"
            />
            {s.ranks.map((r, j) => (
              <circle key={j} cx={cols[j]} cy={rowY(r)} r="1.3" fill="var(--color-ink)" fillOpacity="0.6" />
            ))}
          </g>
        );
      })}
      {/* Winner line — teal, heavier, drawn on top */}
      {series.map((s, i) => {
        if (!s.winner) return null;
        return (
          <g key={i}>
            <path
              d={pathFor(s.ranks)}
              fill="none"
              stroke="#4a6a68"
              strokeWidth="1.8"
            />
            {s.ranks.map((r, j) => (
              <circle key={j} cx={cols[j]} cy={rowY(r)} r="1.8" fill="#4a6a68" />
            ))}
          </g>
        );
      })}
    </svg>
  );
}
