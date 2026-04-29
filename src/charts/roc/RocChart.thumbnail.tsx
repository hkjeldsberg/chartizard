export function RocThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* axes */}
      <line x1="14" y1="68" x2="110" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="12" x2="14" y2="68" stroke="var(--color-hairline)" />
      {/* diagonal y=x reference */}
      <line
        x1="14"
        y1="68"
        x2="110"
        y2="12"
        stroke="var(--color-hairline)"
        strokeDasharray="3 3"
      />
      {/* AUC shaded area */}
      <path
        d="M14,68 Q28,32 54,20 Q82,14 110,12 L110,68 Z"
        fill="var(--color-ink)"
        fillOpacity="0.14"
      />
      {/* ROC curve */}
      <path
        d="M14,68 Q28,32 54,20 Q82,14 110,12"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* threshold bead */}
      <circle cx="54" cy="20" r="2.4" fill="var(--color-ink)" />
    </svg>
  );
}
