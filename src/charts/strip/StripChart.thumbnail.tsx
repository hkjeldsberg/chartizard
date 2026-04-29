export function StripThumbnail() {
  // Four vertical 1-D strips of horizontal ticks. All ticks on the same x for
  // each strip — the thumbnail mirrors the live chart's "collide on the
  // category axis" rule.
  const strips: Array<{ cx: number; ys: number[] }> = [
    { cx: 24, ys: [16, 20, 22, 26, 28, 30, 32, 36, 40, 46] },
    { cx: 48, ys: [14, 18, 22, 24, 26, 30, 34, 38, 42, 48, 54] },
    { cx: 72, ys: [20, 26, 30, 34, 36, 40, 44, 48, 52, 56, 60, 64] },
    { cx: 96, ys: [28, 36, 42, 46, 50, 54, 58, 60, 62, 64] },
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

      {/* Category ticks on the x-axis */}
      {strips.map((s) => (
        <line
          key={`tk-${s.cx}`}
          x1={s.cx}
          x2={s.cx}
          y1={68}
          y2={70}
          stroke="var(--color-hairline)"
        />
      ))}

      {/* Strip ticks — short horizontal segments, all collided on the
          category centre line */}
      {strips.flatMap((s) =>
        s.ys.map((y, i) => (
          <line
            key={`${s.cx}-${i}`}
            x1={s.cx - 6}
            x2={s.cx + 6}
            y1={y}
            y2={y}
            stroke="var(--color-ink)"
            strokeOpacity={0.6}
            strokeWidth={1.2}
          />
        )),
      )}
    </svg>
  );
}
