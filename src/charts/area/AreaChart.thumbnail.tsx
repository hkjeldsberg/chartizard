export function AreaThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />
      <path
        d="M12 68 L12 56 L28 46 L44 48 L60 30 L76 38 L92 22 L108 28 L108 68 Z"
        fill="var(--color-ink)"
        opacity="0.25"
      />
      <polyline
        points="12,56 28,46 44,48 60,30 76,38 92,22 108,28"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
