export function ProportionalSymbolMapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Rough world map silhouettes */}
      {/* North America */}
      <polygon
        points="6,12 20,8 26,12 28,20 24,28 18,32 12,28 8,20"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* South America */}
      <polygon
        points="20,34 26,32 28,40 26,52 22,56 16,52 16,42"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Europe */}
      <polygon
        points="50,10 58,8 62,12 60,18 54,18 50,14"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Africa */}
      <polygon
        points="52,20 60,18 64,24 64,36 60,44 52,46 48,36 48,26"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Asia */}
      <polygon
        points="62,8 80,6 96,8 102,14 100,22 88,24 76,22 66,18"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />
      {/* Australia */}
      <polygon
        points="86,46 96,44 102,48 100,56 92,58 84,54 84,50"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeWidth="0.5"
        strokeOpacity="0.3"
      />

      {/* Proportional circles — largest first */}
      {/* Tokyo — largest */}
      <circle cx="95" cy="20" r="8" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Delhi */}
      <circle cx="74" cy="24" r="7" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Shanghai */}
      <circle cx="90" cy="22" r="6.5" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* São Paulo */}
      <circle cx="26" cy="46" r="5.8" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Mexico City */}
      <circle cx="14" cy="26" r="5.6" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Cairo */}
      <circle cx="57" cy="24" r="5.4" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Mumbai */}
      <circle cx="72" cy="30" r="5.2" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* New York */}
      <circle cx="20" cy="18" r="4.8" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Lagos */}
      <circle cx="52" cy="34" r="4.2" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* London — smallest */}
      <circle cx="52" cy="14" r="2.8" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />
      {/* Paris */}
      <circle cx="55" cy="15" r="3.0" fill="var(--color-ink)" fillOpacity="0.22" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.45" />

      {/* Legend — 3 circles with labels */}
      <circle cx="110" cy="22" r="5" fill="var(--color-ink)" fillOpacity="0.18" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="110" cy="36" r="3.2" fill="var(--color-ink)" fillOpacity="0.18" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.4" />
      <circle cx="110" cy="46" r="2" fill="var(--color-ink)" fillOpacity="0.18" stroke="var(--color-ink)" strokeWidth="0.6" strokeOpacity="0.4" />
      <text x="116" y="25" fontFamily="var(--font-mono)" fontSize="5" fill="var(--color-ink)" opacity="0.45">35M</text>
      <text x="116" y="39" fontFamily="var(--font-mono)" fontSize="5" fill="var(--color-ink)" opacity="0.45">15M</text>
      <text x="116" y="49" fontFamily="var(--font-mono)" fontSize="5" fill="var(--color-ink)" opacity="0.45">5M</text>
    </svg>
  );
}
