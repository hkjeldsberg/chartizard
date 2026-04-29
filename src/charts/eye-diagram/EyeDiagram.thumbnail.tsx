export function EyeDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="8" x2="12" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Decision threshold */}
      <line
        x1="12"
        y1="40"
        x2="112"
        y2="40"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.5"
      />

      {/* Overlaid NRZ traces — low-to-high transition fan */}
      {/* Upper rail traces */}
      <polyline points="12,62 32,62 40,19 62,19 70,62 90,62 98,19 112,19" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.18" />
      <polyline points="12,63 32,63 41,18 62,18 71,63 90,63 99,18 112,18" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.18" />
      <polyline points="12,64 33,64 42,17 63,17 72,64 91,64 100,17 112,17" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.18" />
      {/* Lower rail traces */}
      <polyline points="12,18 32,18 40,62 62,62 70,18 90,18 98,62 112,62" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.18" />
      <polyline points="12,17 32,17 41,63 62,63 71,17 90,17 99,63 112,63" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.18" />
      {/* Crossing / transition traces */}
      <polyline points="12,62 32,62 48,40 62,19 70,62 90,62" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />
      <polyline points="12,18 32,18 48,40 62,62 70,18 90,18" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />
      <polyline points="12,62 38,50 50,40 62,18" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />
      <polyline points="12,18 38,30 50,40 62,62" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />
      <polyline points="62,62 68,50 80,40 90,18" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />
      <polyline points="62,18 68,30 80,40 90,62" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeOpacity="0.14" />

      {/* Eye mask rectangle */}
      <rect
        x="48"
        y="26"
        width="26"
        height="28"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 2"
        strokeOpacity="0.8"
      />
    </svg>
  );
}
