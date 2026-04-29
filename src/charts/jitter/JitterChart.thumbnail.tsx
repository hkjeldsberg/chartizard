export function JitterThumbnail() {
  // Four vertical bands of dots, spread horizontally by a fixed jitter per
  // point. Hand-placed (deterministic) so the thumbnail is a silhouette.
  const bands: Array<{ cx: number; dots: Array<[number, number]> }> = [
    {
      cx: 24,
      dots: [
        [-6, 6], [5, 10], [-2, 14], [3, 16], [-5, 20], [6, 22],
        [1, 26], [-4, 30], [4, 34], [-1, 38],
      ],
    },
    {
      cx: 48,
      dots: [
        [5, 4], [-4, 8], [2, 12], [-5, 18], [4, 20], [-2, 26],
        [6, 30], [-1, 34], [3, 40], [-5, 44], [2, 48],
      ],
    },
    {
      cx: 72,
      dots: [
        [-4, 10], [3, 16], [-6, 22], [5, 26], [-1, 30], [4, 36],
        [-3, 42], [6, 46], [-5, 50], [1, 54], [3, 58], [-2, 62],
      ],
    },
    {
      cx: 96,
      dots: [
        [-2, 20], [4, 28], [-6, 34], [3, 40], [1, 46], [-4, 50],
        [5, 54], [-1, 58], [2, 62], [-3, 66],
      ],
    },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="10" x2="12" y2="68" stroke="var(--color-hairline)" />

      {/* Category ticks */}
      {bands.map((b) => (
        <line
          key={`tk-${b.cx}`}
          x1={b.cx}
          x2={b.cx}
          y1={68}
          y2={70}
          stroke="var(--color-hairline)"
        />
      ))}

      {/* Dots per band */}
      {bands.flatMap((b) =>
        b.dots.map(([dx, dy], i) => (
          <circle
            key={`${b.cx}-${i}`}
            cx={b.cx + dx}
            cy={10 + dy}
            r="1.4"
            fill="var(--color-ink)"
            fillOpacity={0.75}
          />
        )),
      )}
    </svg>
  );
}
