export function KaplanMeierThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />

      {/* Control arm — steeper drops, stepped. */}
      <polyline
        points="12,18 24,18 24,26 40,26 40,34 56,34 56,42 72,42 72,50 88,50 88,56 104,56 104,60 112,60"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Control censor tick */}
      <line x1="48" y1="30" x2="48" y2="38" stroke="var(--color-ink)" strokeWidth="1.2" />

      {/* Treatment arm — gentler drops, stepped. */}
      <polyline
        points="12,18 30,18 30,22 52,22 52,26 74,26 74,30 96,30 96,34 112,34"
        fill="none"
        stroke="var(--color-ink)"
        strokeOpacity="0.55"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
      />
      {/* Treatment censor tick */}
      <line x1="62" y1="22" x2="62" y2="30" stroke="var(--color-ink)" strokeOpacity="0.55" strokeWidth="1.2" />
    </svg>
  );
}
