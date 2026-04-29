export function DeviationThumbnail() {
  // Nine rows, signed deviations from a central zero. Positive bars extend
  // right and render in ink; negative bars extend left and render in the
  // warm accent so polarity is legible at icon scale.
  const devs = [22, 14, 9, 3, -2, -8, -14, -20, -27];
  const centreX = 60;
  const unit = 1.0; // px per unit
  const barH = 4;
  const gap = 2.5;
  const startY = 10;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Baseline + outer frame hairlines */}
      <line x1="8" y1="72" x2="112" y2="72" stroke="var(--color-hairline)" />
      {/* Zero reference — the axis IS the point */}
      <line x1={centreX} y1="6" x2={centreX} y2="72" stroke="var(--color-ink)" strokeWidth="1.2" />
      {devs.map((d, i) => {
        const y = startY + i * (barH + gap);
        const w = Math.abs(d) * unit;
        const x = d >= 0 ? centreX : centreX - w;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={barH}
            fill={d >= 0 ? "var(--color-ink)" : "#a55a4a"}
          />
        );
      })}
    </svg>
  );
}
