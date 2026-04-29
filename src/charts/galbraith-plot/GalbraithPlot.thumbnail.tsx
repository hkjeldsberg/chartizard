export function GalbraithPlotThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Axes */}
      <line x1="16" y1="64" x2="96" y2="64" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="16" y1="10" x2="16" y2="64" stroke="var(--color-hairline)" strokeWidth="0.8" />
      {/* ±2σ reference lines */}
      <line x1="16" y1="22" x2="96" y2="22" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 2" />
      <line x1="16" y1="58" x2="96" y2="58" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 2" />
      {/* Common-age line (y=0) */}
      <line x1="16" y1="40" x2="96" y2="40" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Data-scale arc (right side tick line) */}
      <line x1="98" y1="10" x2="98" y2="70" stroke="var(--color-ink-mute)" strokeWidth="0.8" />
      <line x1="98" y1="22" x2="102" y2="22" stroke="var(--color-ink-mute)" strokeWidth="0.7" />
      <line x1="98" y1="40" x2="102" y2="40" stroke="var(--color-ink-mute)" strokeWidth="0.7" />
      <line x1="98" y1="58" x2="102" y2="58" stroke="var(--color-ink-mute)" strokeWidth="0.7" />
      {/* Radial rays from origin (faint) */}
      <line x1="16" y1="40" x2="60" y2="36" stroke="var(--color-ink)" strokeWidth="0.4" opacity="0.2" />
      <line x1="16" y1="40" x2="76" y2="38" stroke="var(--color-ink)" strokeWidth="0.4" opacity="0.2" />
      <line x1="16" y1="40" x2="45" y2="34" stroke="var(--color-ink)" strokeWidth="0.4" opacity="0.2" />
      <line x1="16" y1="40" x2="52" y2="55" stroke="var(--color-ink)" strokeWidth="0.4" opacity="0.2" />
      {/* Concordant cluster points (near y=40) */}
      <circle cx="45" cy="37" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      <circle cx="60" cy="39" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      <circle cx="72" cy="41" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      <circle cx="55" cy="36" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      <circle cx="80" cy="40" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      <circle cx="38" cy="38" r="2" fill="var(--color-ink)" fillOpacity="0.75" />
      {/* Outlier points (off the central radial) */}
      <circle cx="28" cy="20" r="2.6" fill="var(--color-ink)" />
      <circle cx="22" cy="14" r="2.6" fill="var(--color-ink)" />
    </svg>
  );
}
