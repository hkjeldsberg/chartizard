export function BurnDownThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* Ideal (dashed) — diagonal from top-left to bottom-right */}
      <line
        x1="12"
        y1="18"
        x2="112"
        y2="68"
        stroke="var(--color-ink-mute)"
        strokeWidth="1.2"
        strokeDasharray="3 2"
      />
      {/* Actual — slow start, accelerate, plateau near bottom */}
      <polyline
        points="12,18 24,18 36,24 48,32 60,44 72,52 84,58 96,62 108,64"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="18" r="2" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" />
      <circle cx="108" cy="64" r="1.8" fill="var(--color-ink)" />
    </svg>
  );
}
