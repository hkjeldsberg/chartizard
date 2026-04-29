export function PournelleChartThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Quadrant backgrounds */}
      <rect x="10" y="8" width="50" height="34" fill="var(--color-ink)" fillOpacity="0.04" />
      <rect x="60" y="8" width="50" height="34" fill="var(--color-ink)" fillOpacity="0.07" />
      <rect x="10" y="42" width="50" height="30" fill="var(--color-ink)" fillOpacity="0.02" />
      <rect x="60" y="42" width="50" height="30" fill="var(--color-ink)" fillOpacity="0.05" />

      {/* Outer border */}
      <rect x="10" y="8" width="100" height="64" fill="none" stroke="var(--color-ink)" strokeOpacity="0.25" strokeWidth="0.8" />

      {/* Crosshair */}
      <line x1="60" y1="8" x2="60" y2="72" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="2 2" />
      <line x1="10" y1="40" x2="110" y2="40" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="0.8" strokeDasharray="2 2" />

      {/* X-axis label hints */}
      <text x="13" y="76" fontFamily="monospace" fontSize="5" fill="var(--color-ink)" fillOpacity="0.5">ANARCHY</text>
      <text x="107" y="76" textAnchor="end" fontFamily="monospace" fontSize="5" fill="var(--color-ink)" fillOpacity="0.5">TOTAL</text>

      {/* Y-axis label hints */}
      <text x="8" y="11" textAnchor="end" fontFamily="monospace" fontSize="5" fill="var(--color-ink)" fillOpacity="0.5">R</text>
      <text x="8" y="70" textAnchor="end" fontFamily="monospace" fontSize="5" fill="var(--color-ink)" fillOpacity="0.5">I</text>

      {/* Ideology dots */}
      {/* Ayn Rand Libertarianism: upper-left */}
      <circle cx="18" cy="15" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* American Conservatism: upper-centre-left */}
      <circle cx="52" cy="20" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* American Liberalism: upper-centre */}
      <circle cx="65" cy="22" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Communism: upper-right */}
      <circle cx="100" cy="24" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Far-left Anarchism: upper-left-low */}
      <circle cx="15" cy="28" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Fascism: lower-right */}
      <circle cx="82" cy="57" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Nazism: lower-right extreme */}
      <circle cx="98" cy="65" r="2.5" fill="var(--color-ink)" fillOpacity="0.7" />
    </svg>
  );
}
