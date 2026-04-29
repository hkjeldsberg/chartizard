export function PeriodogramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Dashed noise-floor reference near y = 60 */}
      <line x1="12" y1="60" x2="112" y2="60" stroke="var(--color-hairline)" strokeDasharray="2 2" strokeWidth="0.8" />

      {/* A forest of short noise-floor stems */}
      {(() => {
        const stems = [];
        const xs = [18, 22, 26, 30, 36, 40, 44, 52, 56, 64, 70, 76, 82, 88, 94, 100, 106];
        // Pseudo-random but deterministic variation around y=60
        const offsets = [2, -1, 3, -2, 1, 4, -3, 2, -1, 3, 0, -2, 2, -1, 3, 1, -2];
        for (let i = 0; i < xs.length; i++) {
          const y = 60 + offsets[i];
          stems.push(
            <g key={i}>
              <line x1={xs[i]} y1="68" x2={xs[i]} y2={y} stroke="var(--color-ink)" strokeWidth="0.8" />
              <circle cx={xs[i]} cy={y} r="1" fill="var(--color-ink)" />
            </g>,
          );
        }
        return stems;
      })()}

      {/* Fundamental peak (tall stem + bubble) */}
      <line x1="32" y1="68" x2="32" y2="18" stroke="var(--color-ink)" strokeWidth="1.4" />
      <circle cx="32" cy="18" r="2.6" fill="var(--color-ink)" />

      {/* Harmonic peak (shorter stem + bubble) */}
      <line x1="50" y1="68" x2="50" y2="34" stroke="var(--color-ink)" strokeWidth="1.4" />
      <circle cx="50" cy="34" r="2.2" fill="var(--color-ink)" />
    </svg>
  );
}
