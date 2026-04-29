export function NicholsPlotThumbnail() {
  // A stylised Nichols curve sweeping from upper-right (low ω, phase ≈ -90°,
  // high gain) down through the critical point region (phase -180°, 0 dB)
  // to lower-left (high ω, large phase lag, low gain). Axes are hairlines;
  // critical point sits roughly mid-chart.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Frame / axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="12" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* 0 dB gridline (mid-height) */}
      <line
        x1="12"
        y1="40"
        x2="112"
        y2="40"
        stroke="var(--color-hairline)"
        strokeDasharray="2 3"
      />
      {/* -180° vertical gridline (mid-width) */}
      <line
        x1="62"
        y1="12"
        x2="62"
        y2="68"
        stroke="var(--color-hairline)"
        strokeDasharray="2 3"
      />

      {/* The open-loop curve — from (phase≈-90°, high dB) in upper-right down
          to (phase≈-270°, low dB) in lower-left. */}
      <path
        d="M 104 18
           C 92 22, 82 30, 74 36
           C 68 40, 58 48, 48 54
           C 38 58, 26 62, 18 64"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Critical point (-180°, 0 dB) */}
      <circle
        cx="62"
        cy="40"
        r="2.6"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1.3"
      />
      <line
        x1="58"
        y1="40"
        x2="66"
        y2="40"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <line
        x1="62"
        y1="36"
        x2="62"
        y2="44"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
    </svg>
  );
}
