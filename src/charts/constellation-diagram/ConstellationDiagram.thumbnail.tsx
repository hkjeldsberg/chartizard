export function ConstellationDiagramThumbnail() {
  // 16-QAM 4x4 grid of constellation points at scaled positions.
  // Grid spans roughly 16–104 in x and 8–72 in y within 120x80 viewBox.
  const cols = [-3, -1, 1, 3];
  const rows = [-3, -1, 1, 3];
  // Map ±3 → pixel range [18, 102] and [72, 8]
  const px = (i: number) => 60 + i * 14;
  const py = (q: number) => 40 - q * 14;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="40" x2="108" y2="40" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="60" y1="8" x2="60" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Decision boundaries (dashed) */}
      <line x1="60" y1="8" x2="60" y2="72" stroke="var(--color-ink)" strokeWidth="0.6" strokeDasharray="3 2" strokeOpacity="0.4" />
      <line x1="12" y1="40" x2="108" y2="40" stroke="var(--color-ink)" strokeWidth="0.6" strokeDasharray="3 2" strokeOpacity="0.4" />

      {/* Noise halos around each ideal point (faint circles) */}
      {cols.map((i) =>
        rows.map((q) => (
          <circle
            key={`halo-${i}-${q}`}
            cx={px(i)}
            cy={py(q)}
            r={5}
            fill="var(--color-ink)"
            fillOpacity="0.07"
          />
        )),
      )}

      {/* Ideal constellation points — cross markers */}
      {cols.map((i) =>
        rows.map((q) => {
          const cx = px(i);
          const cy = py(q);
          return (
            <g key={`pt-${i}-${q}`}>
              <line x1={cx - 3} x2={cx + 3} y1={cy} y2={cy} stroke="var(--color-ink)" strokeWidth="1.4" />
              <line x1={cx} x2={cx} y1={cy - 3} y2={cy + 3} stroke="var(--color-ink)" strokeWidth="1.4" />
            </g>
          );
        }),
      )}

      {/* Axis labels */}
      <text x="106" y="44" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)" textAnchor="end">I</text>
      <text x="63" y="11" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)">Q</text>
    </svg>
  );
}
