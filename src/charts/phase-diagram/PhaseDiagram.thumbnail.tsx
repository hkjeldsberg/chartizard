export function PhaseDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Plot border */}
      <rect
        x={12}
        y={8}
        width={96}
        height={60}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Solid region (top-left wedge) */}
      <polygon
        points="12,8 44,8 42,40 36,52 12,52"
        fill="var(--color-ink)"
        fillOpacity={0.14}
        stroke="none"
      />
      {/* Liquid region (top-middle) */}
      <polygon
        points="44,8 92,8 86,48 42,40"
        fill="var(--color-ink)"
        fillOpacity={0.08}
        stroke="none"
      />
      {/* Gas region (bottom) */}
      <polygon
        points="12,52 36,52 42,40 86,48 108,58 108,68 12,68"
        fill="var(--color-ink)"
        fillOpacity={0.03}
        stroke="none"
      />

      {/* Sublimation curve — solid/gas boundary, sharp rise */}
      <path
        d="M 12,62 Q 28,58 34,54 T 42,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Melting curve — near-vertical, leans slightly LEFT (water anomaly) */}
      <path
        d="M 42,40 L 44,8"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinecap="round"
      />
      {/* Vaporisation curve — triple point to critical point */}
      <path
        d="M 42,40 Q 60,45 72,46 T 86,48"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.4}
        strokeLinecap="round"
      />

      {/* Triple point (filled) */}
      <circle cx={42} cy={40} r={2.4} fill="var(--color-ink)" />
      {/* Critical point (hollow) */}
      <circle
        cx={86}
        cy={48}
        r={2.4}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
    </svg>
  );
}
