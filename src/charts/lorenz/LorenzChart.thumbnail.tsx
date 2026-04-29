export function LorenzThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="14" y1="12" x2="14" y2="68" stroke="var(--color-hairline)" />

      {/* Gini area: between diagonal (14,68)->(112,12) and the sagging curve */}
      <path
        d="M14 68 L26 66 L40 63 L54 58 L68 50 L82 39 L96 25 L112 12 L14 68 Z"
        fill="var(--color-ink)"
        opacity="0.16"
      />

      {/* Equality diagonal (dashed) */}
      <line
        x1="14"
        y1="68"
        x2="112"
        y2="12"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeDasharray="3 3"
      />

      {/* Lorenz curve itself (sagging below the diagonal) */}
      <path
        d="M14 68 Q 40 66 68 50 T 112 12"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
