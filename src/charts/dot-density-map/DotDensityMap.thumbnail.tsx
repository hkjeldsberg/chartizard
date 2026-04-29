export function DotDensityMapThumbnail() {
  // Rough US silhouette with scattered dots suggesting population density
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Simplified US outline */}
      <polygon
        points="8,14 30,10 60,10 80,8 96,12 100,18 96,22 98,30 92,36 90,42 80,48 70,52 60,54 48,56 36,58 24,54 16,48 10,40 6,30 8,14"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeOpacity="0.4"
      />
      {/* Internal region line suggestions */}
      <line x1="30" y1="10" x2="30" y2="54" stroke="var(--color-ink)" strokeWidth="0.4" strokeOpacity="0.25" />
      <line x1="50" y1="10" x2="50" y2="56" stroke="var(--color-ink)" strokeWidth="0.4" strokeOpacity="0.25" />
      <line x1="68" y1="10" x2="68" y2="52" stroke="var(--color-ink)" strokeWidth="0.4" strokeOpacity="0.25" />
      {/* West coast — sparse */}
      <circle cx="12" cy="22" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="14" cy="30" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="11" cy="38" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="15" cy="25" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="10" cy="46" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="13" cy="43" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      {/* Mountain — very sparse */}
      <circle cx="22" cy="20" r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="25" cy="32" r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
      <circle cx="28" cy="44" r="1.2" fill="var(--color-ink)" fillOpacity="0.5" />
      {/* Plains */}
      <circle cx="38" cy="18" r="1.2" fill="var(--color-ink)" fillOpacity="0.55" />
      <circle cx="40" cy="28" r="1.2" fill="var(--color-ink)" fillOpacity="0.55" />
      <circle cx="42" cy="38" r="1.2" fill="var(--color-ink)" fillOpacity="0.55" />
      <circle cx="35" cy="24" r="1.2" fill="var(--color-ink)" fillOpacity="0.55" />
      {/* Midwest — medium density */}
      <circle cx="52" cy="15" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="55" cy="22" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="50" cy="30" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="56" cy="28" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="48" cy="22" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="54" cy="35" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      {/* Northeast — dense */}
      <circle cx="80" cy="14" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="84" cy="18" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="88" cy="14" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="82" cy="20" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="86" cy="22" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="90" cy="18" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="78" cy="18" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="92" cy="14" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="94" cy="20" r="1.2" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Southeast */}
      <circle cx="72" cy="44" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="78" cy="40" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="76" cy="48" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="66" cy="46" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="70" cy="36" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      {/* Texas */}
      <circle cx="42" cy="50" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="38" cy="54" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="46" cy="52" r="1.2" fill="var(--color-ink)" fillOpacity="0.6" />
      {/* Legend */}
      <circle cx="8" cy="70" r="1.2" fill="var(--color-ink)" fillOpacity="0.55" />
      <text x="13" y="73" fontFamily="var(--font-mono)" fontSize="6" fill="var(--color-ink)" opacity="0.5">
        1 dot = 100k
      </text>
    </svg>
  );
}
