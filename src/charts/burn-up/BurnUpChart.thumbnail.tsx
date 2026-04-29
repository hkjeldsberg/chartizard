export function BurnUpThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* Scope ceiling — flat then two ratchet-up steps */}
      <polyline
        points="12,28 52,28 52,20 84,20 84,14 112,14"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth="1.4"
        strokeLinejoin="miter"
      />
      {/* Completed — climbing from 0 toward the ceiling */}
      <polyline
        points="12,66 24,62 36,54 48,44 60,34 72,26 84,22 96,20 108,19"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="66" r="1.8" fill="var(--color-ink)" />
      <circle cx="108" cy="19" r="1.8" fill="var(--color-ink)" />
      {/* Mark the scope-creep step */}
      <circle cx="52" cy="20" r="1.6" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="0.8" />
    </svg>
  );
}
