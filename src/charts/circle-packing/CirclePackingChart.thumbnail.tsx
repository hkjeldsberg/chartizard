// Silhouette of nested circles. Hand-placed at 120x80 — no layout library,
// no real data — just enough structure to read "circles inside circles".
export function CirclePackingThumbnail() {
  // Parent circles
  const parents = [
    { cx: 36, cy: 42, r: 26, o: 0.14 },
    { cx: 82, cy: 34, r: 20, o: 0.14 },
    { cx: 98, cy: 60, r: 14, o: 0.14 },
  ];
  // Leaves packed inside their parents
  const leaves = [
    // Inside parent 0 (big left)
    { cx: 28, cy: 36, r: 10, o: 0.32 },
    { cx: 44, cy: 34, r: 8, o: 0.28 },
    { cx: 30, cy: 54, r: 7, o: 0.25 },
    { cx: 46, cy: 52, r: 5, o: 0.22 },
    { cx: 52, cy: 42, r: 4, o: 0.2 },
    // Inside parent 1 (mid right)
    { cx: 76, cy: 30, r: 8, o: 0.3 },
    { cx: 88, cy: 30, r: 6, o: 0.26 },
    { cx: 82, cy: 44, r: 5, o: 0.22 },
    // Inside parent 2 (small bottom right)
    { cx: 94, cy: 58, r: 5, o: 0.28 },
    { cx: 102, cy: 62, r: 3, o: 0.22 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {parents.map((c, i) => (
        <circle
          key={`p-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="var(--color-ink)"
          opacity={c.o}
          stroke="var(--color-ink)"
          strokeOpacity={0.3}
          strokeWidth={0.5}
        />
      ))}
      {leaves.map((c, i) => (
        <circle
          key={`l-${i}`}
          cx={c.cx}
          cy={c.cy}
          r={c.r}
          fill="var(--color-ink)"
          opacity={c.o}
        />
      ))}
    </svg>
  );
}
