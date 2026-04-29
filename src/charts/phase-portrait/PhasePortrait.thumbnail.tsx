export function PhasePortraitThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="10" y1="40" x2="110" y2="40" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="60" y1="8" x2="60" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Vector field — small arrows on a sparse grid */}
      {/* Row 1 */}
      <line x1="22" y1="18" x2="26" y2="16" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="42" y1="18" x2="47" y2="17" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="78" y1="18" x2="80" y2="22" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="98" y1="18" x2="96" y2="22" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      {/* Row 2 */}
      <line x1="22" y1="56" x2="25" y2="52" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="42" y1="60" x2="46" y2="56" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="78" y1="60" x2="74" y2="58" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />
      <line x1="98" y1="56" x2="94" y2="58" stroke="var(--color-ink-mute)" strokeWidth="0.6" strokeOpacity="0.55" />

      {/* Spiral trajectory — outermost */}
      <path
        d="M 100,40 C 102,30 90,15 74,18 C 55,22 42,38 46,54 C 50,68 66,72 78,66 C 90,60 93,48 88,42 C 82,34 72,30 66,34 C 60,38 60,45 63,48 C 66,50 69,49 69,46 C 69,43 67,41 65,42 C 63,43 62,45 62,45"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
        strokeOpacity="0.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Second smaller spiral */}
      <path
        d="M 60,18 C 44,20 34,36 38,52 C 42,66 58,70 68,62 C 76,55 76,44 70,40 C 64,35 60,38 60,42 C 60,46 63,48 63,48"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.1"
        strokeOpacity="0.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Stable fixed point at origin */}
      <circle cx="60" cy="40" r="3.5" fill="var(--color-ink)" />
    </svg>
  );
}
