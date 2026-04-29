export function BiplotThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axis lines through origin (≈ 40, 50) */}
      <line x1="12" y1="50" x2="112" y2="50" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 3" />
      <line x1="40" y1="8" x2="40" y2="75" stroke="var(--color-ink)" strokeOpacity="0.2" strokeWidth="1" strokeDasharray="2 3" />

      {/* Observation dots */}
      <circle cx="52" cy="44" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="62" cy="40" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="70" cy="36" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="44" cy="54" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="56" cy="60" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="30" cy="44" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="34" cy="36" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="80" cy="42" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="78" cy="60" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="20" cy="54" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="66" cy="66" r="2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="88" cy="30" r="2" fill="var(--color-ink)" fillOpacity="0.5" />

      {/* Variable arrows from origin (40, 50) */}
      {/* LENGTH → long, rightward */}
      <line x1="40" y1="50" x2="106" y2="37" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.85" />
      <polygon points="106,37 99,34 101,41" fill="var(--color-ink)" fillOpacity="0.85" />
      <text x="108" y="35" fontFamily="monospace" fontSize="6" fill="var(--color-ink)">LEN</text>

      {/* VOLUME → rightward slightly lower than Length */}
      <line x1="40" y1="50" x2="100" y2="43" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.85" />
      <polygon points="100,43 93,38 95,46" fill="var(--color-ink)" fillOpacity="0.85" />

      {/* WEIGHT → mostly upward */}
      <line x1="40" y1="50" x2="47" y2="14" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.85" />
      <polygon points="47,14 43,21 51,22" fill="var(--color-ink)" fillOpacity="0.85" />
      <text x="49" y="12" fontFamily="monospace" fontSize="6" fill="var(--color-ink)">WT</text>

      {/* HEIGHT → diagonal */}
      <line x1="40" y1="50" x2="74" y2="25" stroke="var(--color-ink)" strokeWidth="1.4" strokeOpacity="0.85" />
      <polygon points="74,25 67,25 70,32" fill="var(--color-ink)" fillOpacity="0.85" />

      {/* Origin dot */}
      <circle cx="40" cy="50" r="2.5" fill="var(--color-ink)" />
    </svg>
  );
}
