export function DivergingBarThumbnail() {
  // Seven rows, signed magnitudes. Positive extends right from centre, negative left.
  const scores = [34, 22, 14, 4, -10, -20, -30];
  const centreX = 60;
  const unit = 0.9; // px per score point
  const barH = 5;
  const gap = 3;
  const startY = 14;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Baseline at bottom, centre zero axis */}
      <line x1="8" y1="70" x2="112" y2="70" stroke="var(--color-hairline)" />
      <line x1={centreX} y1="10" x2={centreX} y2="70" stroke="var(--color-ink)" strokeWidth="1.1" />
      {scores.map((s, i) => {
        const y = startY + i * (barH + gap);
        const w = Math.abs(s) * unit;
        const x = s >= 0 ? centreX : centreX - w;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={w}
            height={barH}
            fill={s >= 0 ? "var(--color-ink)" : "#a55a4a"}
          />
        );
      })}
    </svg>
  );
}
