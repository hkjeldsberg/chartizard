export function KpiTileThumbnail() {
  // A KPI tile at thumbnail scale is mostly typography. Show a big number,
  // a unit label, a delta pill with an up-arrow, and a tiny inset sparkline.
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Big number */}
      <text
        x="60"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-display), serif"
        fontSize="26"
        fontWeight="600"
        fill="var(--color-ink)"
      >
        2.4M
      </text>
      {/* Unit label */}
      <text
        x="60"
        y="50"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="5"
        letterSpacing="1"
        fill="var(--color-ink-mute)"
      >
        ACTIVE USERS
      </text>
      {/* Delta pill */}
      <rect
        x="40"
        y="56"
        width="40"
        height="11"
        rx="5.5"
        fill="var(--color-ink)"
        fillOpacity="0.08"
        stroke="var(--color-ink)"
        strokeOpacity="0.25"
        strokeWidth="0.6"
      />
      {/* Up-arrow triangle */}
      <polygon points="46,64.5 51,64.5 48.5,59.5" fill="var(--color-ink)" />
      <text
        x="55"
        y="65"
        fontFamily="var(--font-mono)"
        fontSize="6"
        fontWeight="600"
        fill="var(--color-ink)"
      >
        +12.3%
      </text>
      {/* Inset sparkline, bottom-right */}
      <polyline
        points="88,74 92,73 96,72 100,70 104,69 108,67 112,66"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="112" cy="66" r="1" fill="var(--color-ink)" />
    </svg>
  );
}
