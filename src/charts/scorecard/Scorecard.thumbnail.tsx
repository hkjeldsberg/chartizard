export function ScorecardThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Header row */}
      <rect x="8" y="8" width="104" height="10" rx="1" fill="var(--color-ink)" fillOpacity="0.12" />
      <line x1="8" y1="18" x2="112" y2="18" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Data rows — 6 rows */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const y = 18 + i * 10;
        // status colours: green, green, amber, amber, red, green
        const colors = ["#22c55e", "#22c55e", "#f59e0b", "#f59e0b", "#ef4444", "#22c55e"];
        return (
          <g key={i}>
            {i % 2 === 0 && <rect x="8" y={y} width="104" height="10" fill="var(--color-ink)" fillOpacity="0.03" />}
            {/* metric bar */}
            <rect x="10" y={y + 3} width="44" height="4" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />
            {/* actual */}
            <rect x="60" y={y + 3} width="16" height="4" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />
            {/* target */}
            <rect x="80" y={y + 3} width="12" height="4" rx="1" fill="var(--color-hairline)" />
            {/* status dot */}
            <circle cx="102" cy={y + 5} r="3" fill={colors[i]} />
          </g>
        );
      })}
    </svg>
  );
}
