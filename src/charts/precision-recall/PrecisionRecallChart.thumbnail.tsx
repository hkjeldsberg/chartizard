export function PrecisionRecallThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* axes */}
      <line x1="14" y1="68" x2="110" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="12" x2="14" y2="68" stroke="var(--color-hairline)" />
      {/* no-skill baseline at precision = 0.3 (-> y = 68 - 0.3 * 56 ≈ 51) */}
      <line
        x1="14"
        y1="51"
        x2="110"
        y2="51"
        stroke="var(--color-hairline)"
        strokeDasharray="3 3"
      />
      {/* PR curve — high-precision plateau then falls toward baseline */}
      <path
        d="M14,16 Q40,18 64,24 Q86,36 110,52"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* threshold bead */}
      <circle cx="64" cy="24" r="2.4" fill="var(--color-ink)" />
    </svg>
  );
}
