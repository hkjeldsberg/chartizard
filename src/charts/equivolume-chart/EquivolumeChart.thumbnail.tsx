export function EquivolumeThumbnail() {
  // Equivolume silhouette: bars of varying widths spanning price ranges.
  // Wide bars = high volume days; narrow bars = low volume days.
  // Up-bars hollow, down-bars filled.
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* y-axis line */}
      <line x1="14" y1="8" x2="14" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />
      {/* x-axis line */}
      <line x1="14" y1="66" x2="114" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Bar 1: narrow, up (hollow) — low volume day */}
      <rect x="16" y="36" width="6" height="22" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Bar 2: wide, down (filled) — high volume day */}
      <rect x="23" y="28" width="22" height="28" fill="var(--color-ink)" opacity="0.85" />

      {/* Bar 3: medium, up (hollow) */}
      <rect x="46" y="22" width="14" height="24" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Bar 4: narrow, down (filled) */}
      <rect x="61" y="30" width="7" height="20" fill="var(--color-ink)" opacity="0.85" />

      {/* Bar 5: wide, up (hollow) — high volume day */}
      <rect x="69" y="14" width="20" height="32" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Bar 6: medium, up (hollow) */}
      <rect x="90" y="18" width="12" height="20" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Bar 7: narrow, down */}
      <rect x="103" y="24" width="8" height="24" fill="var(--color-ink)" opacity="0.85" />
    </svg>
  );
}
