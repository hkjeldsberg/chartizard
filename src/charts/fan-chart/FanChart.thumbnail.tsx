export function FanChartThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="14" x2="12" y2="68" stroke="var(--color-hairline)" />

      {/* 95% band — outermost */}
      <path
        d="M60 40 L76 34 L92 28 L108 22 L108 58 L92 52 L76 48 L60 40 Z"
        fill="var(--color-ink)"
        opacity="0.15"
      />
      {/* 80% band */}
      <path
        d="M60 40 L76 36 L92 32 L108 28 L108 52 L92 48 L76 44 L60 40 Z"
        fill="var(--color-ink)"
        opacity="0.25"
      />
      {/* 50% band — innermost */}
      <path
        d="M60 40 L76 38 L92 36 L108 34 L108 46 L92 44 L76 42 L60 40 Z"
        fill="var(--color-ink)"
        opacity="0.4"
      />

      {/* Historical line */}
      <polyline
        points="12,44 20,50 28,46 36,42 44,44 52,60 60,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Forecast central line (continuation) */}
      <polyline
        points="60,40 76,42 92,40 108,40"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Boundary marker */}
      <line
        x1="60"
        y1="14"
        x2="60"
        y2="68"
        stroke="var(--color-ink)"
        strokeWidth="0.75"
        strokeDasharray="2 2"
      />
    </svg>
  );
}
