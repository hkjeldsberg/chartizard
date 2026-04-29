export function CorrelationMatrixThumbnail() {
  // 6×6 lower-triangle silhouette with diverging ink so the "diagonal +
  // half-filled" identity reads instantly. Positive cells warm, negative
  // cells cool, diagonal as hairline neutral.
  const n = 6;
  // Signed values in [-1, 1]; diagonal is implicitly 1 (handled separately).
  const matrix: number[][] = [
    [0, 0, 0, 0, 0, 0],
    [-0.3, 0, 0, 0, 0, 0],
    [0.4, -0.2, 0, 0, 0, 0],
    [0.6, -0.4, 0.7, 0, 0, 0],
    [-0.5, 0.3, -0.7, -0.6, 0, 0],
    [0.5, -0.7, 0.6, 0.5, -0.4, 0],
  ];

  const x0 = 18;
  const y0 = 12;
  const cell = 11;

  const fill = (r: number): string => {
    if (r === 0) return "transparent";
    const a = 0.1 + Math.min(1, Math.abs(r)) * 0.7;
    return r > 0
      ? `rgba(176, 58, 46, ${a.toFixed(3)})`
      : `rgba(41, 98, 156, ${a.toFixed(3)})`;
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {matrix.map((row, r) =>
        row.map((v, c) => {
          if (c > r) return null;
          const isDiag = r === c;
          return (
            <rect
              key={`${r}-${c}`}
              x={x0 + c * cell}
              y={y0 + r * cell}
              width={cell - 0.6}
              height={cell - 0.6}
              fill={isDiag ? "var(--color-hairline)" : fill(v)}
            />
          );
        }),
      )}
      {/* Tiny diverging legend under the grid */}
      {Array.from({ length: 11 }).map((_, i) => {
        const r = -1 + (i / 10) * 2;
        return (
          <rect
            key={i}
            x={x0 + i * 6}
            y={y0 + n * cell + 4}
            width={6}
            height={4}
            fill={r === 0 ? "var(--color-hairline)" : fill(r)}
          />
        );
      })}
    </svg>
  );
}
