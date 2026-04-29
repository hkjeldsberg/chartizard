export function BagplotThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Outer fence polygon */}
      <polygon
        points="18,62 14,35 28,14 58,10 86,18 96,44 88,66 54,72 22,68"
        fill="var(--color-ink)"
        fillOpacity="0.06"
        stroke="var(--color-ink)"
        strokeOpacity="0.35"
        strokeWidth="1"
        strokeDasharray="3 2"
      />
      {/* Inner bag polygon */}
      <polygon
        points="38,52 34,38 44,28 60,26 74,34 76,48 66,58 46,60"
        fill="var(--color-ink)"
        fillOpacity="0.2"
        stroke="var(--color-ink)"
        strokeOpacity="0.75"
        strokeWidth="1.2"
      />
      {/* Scatter points inside bag */}
      <circle cx="50" cy="42" r="1.8" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="60" cy="36" r="1.8" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="64" cy="50" r="1.8" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="44" cy="46" r="1.8" fill="var(--color-ink)" fillOpacity="0.6" />
      <circle cx="56" cy="54" r="1.8" fill="var(--color-ink)" fillOpacity="0.6" />
      {/* Points between bag and fence */}
      <circle cx="30" cy="28" r="1.8" fill="var(--color-ink)" fillOpacity="0.4" />
      <circle cx="80" cy="28" r="1.8" fill="var(--color-ink)" fillOpacity="0.4" />
      <circle cx="82" cy="56" r="1.8" fill="var(--color-ink)" fillOpacity="0.4" />
      <circle cx="28" cy="56" r="1.8" fill="var(--color-ink)" fillOpacity="0.4" />
      {/* Outlier points — open circles */}
      <circle cx="10" cy="22" r="2.2" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      <circle cx="104" cy="16" r="2.2" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      <circle cx="106" cy="68" r="2.2" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Depth median cross */}
      <line x1="53" y1="40" x2="63" y2="40" stroke="var(--color-ink)" strokeWidth="1.8" />
      <line x1="58" y1="35" x2="58" y2="45" stroke="var(--color-ink)" strokeWidth="1.8" />
    </svg>
  );
}
