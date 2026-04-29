export function OppositesDiagramThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Left box */}
      <rect x="4" y="10" width="48" height="60" rx="2" fill="var(--color-hairline)" fillOpacity="0.4" stroke="var(--color-ink)" strokeOpacity="0.3" strokeWidth="0.8" />
      {/* Left header */}
      <rect x="4" y="10" width="48" height="14" rx="2" fill="var(--color-ink)" fillOpacity="0.15" />
      <line x1="12" y1="25" x2="46" y2="25" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="0.6" />
      {/* Left bullet rows */}
      {[33, 40, 47, 54, 61].map((y, i) => (
        <g key={i}>
          <circle cx="12" cy={y} r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
          <line x1="17" y1={y} x2={i % 2 === 0 ? 44 : 40} y2={y} stroke="var(--color-ink)" strokeOpacity="0.45" strokeWidth="1" />
        </g>
      ))}

      {/* Right box */}
      <rect x="68" y="10" width="48" height="60" rx="2" fill="var(--color-hairline)" fillOpacity="0.3" stroke="var(--color-ink)" strokeOpacity="0.3" strokeWidth="0.8" />
      {/* Right header */}
      <rect x="68" y="10" width="48" height="14" rx="2" fill="var(--color-ink)" fillOpacity="0.1" />
      <line x1="76" y1="25" x2="110" y2="25" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="0.6" />
      {/* Right bullet rows */}
      {[33, 40, 47, 54, 61].map((y, i) => (
        <g key={i}>
          <circle cx="76" cy={y} r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
          <line x1="81" y1={y} x2={i % 2 === 0 ? 108 : 104} y2={y} stroke="var(--color-ink)" strokeOpacity="0.35" strokeWidth="1" />
        </g>
      ))}

      {/* Horizontal axis */}
      <line x1="4" y1="40" x2="116" y2="40" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="0.7" />

      {/* VS pill */}
      <rect x="52" y="33" width="16" height="14" rx="3" fill="var(--color-hairline)" stroke="var(--color-ink)" strokeOpacity="0.4" strokeWidth="0.8" />
      <text x="60" y="42" textAnchor="middle" fontFamily="monospace" fontSize="6" fontWeight="700" fill="var(--color-ink)" fillOpacity="0.8">VS</text>
    </svg>
  );
}
