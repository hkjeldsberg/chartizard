// Hierarchical circle packing silhouette — outer ring (root), four group
// circles packed inside, each containing smaller leaf circles. 120×80 viewBox,
// no layout library, hand-placed to read instantly as "circles inside circles".
export function PackedCircleChartThumbnail() {
  // Four group circles placed to fill the canvas.
  const groups = [
    { cx: 38, cy: 38, r: 30 },  // Indo-European (large)
    { cx: 88, cy: 30, r: 22 },  // Sino-Tibetan
    { cx: 88, cy: 60, r: 14 },  // Afro-Asiatic
    { cx: 10, cy: 68, r: 8 },   // Austronesian (small)
  ];

  // Leaf circles inside each group.
  const leaves = [
    // Indo-European
    { cx: 28, cy: 32, r: 11 },
    { cx: 44, cy: 30, r: 9 },
    { cx: 34, cy: 50, r: 7 },
    { cx: 50, cy: 46, r: 6 },
    { cx: 52, cy: 32, r: 5 },
    { cx: 24, cy: 48, r: 4 },
    { cx: 46, cy: 60, r: 3 },
    // Sino-Tibetan
    { cx: 82, cy: 26, r: 10 },
    { cx: 96, cy: 26, r: 6 },
    { cx: 88, cy: 42, r: 5 },
    // Afro-Asiatic
    { cx: 83, cy: 57, r: 6 },
    { cx: 95, cy: 62, r: 4 },
    // Austronesian
    { cx: 10, cy: 68, r: 4 },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer root ring */}
      <circle
        cx={60}
        cy={42}
        r={38}
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity={0.2}
        strokeWidth={1}
        strokeDasharray="2 3"
      />

      {/* Group circles */}
      {groups.map((g, i) => (
        <circle
          key={`g-${i}`}
          cx={g.cx}
          cy={g.cy}
          r={g.r}
          fill="var(--color-ink)"
          fillOpacity={0.1}
          stroke="var(--color-ink)"
          strokeOpacity={0.4}
          strokeWidth={1}
        />
      ))}

      {/* Leaf circles */}
      {leaves.map((l, i) => (
        <circle
          key={`l-${i}`}
          cx={l.cx}
          cy={l.cy}
          r={l.r}
          fill="var(--color-ink)"
          opacity={0.3}
        />
      ))}
    </svg>
  );
}
