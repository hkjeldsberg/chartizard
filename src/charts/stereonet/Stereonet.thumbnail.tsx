export function StereonetThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Primitive circle */}
      <circle cx="60" cy="40" r="34" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      {/* Small circles (latitude rings) */}
      <circle cx="60" cy="40" r="25" fill="none" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <circle cx="60" cy="40" r="16" fill="none" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <circle cx="60" cy="40" r="8" fill="none" stroke="var(--color-hairline)" strokeWidth="0.6" />
      {/* Meridian great-circle arcs (approximated as straight lines for thumbnail) */}
      <line x1="60" y1="6" x2="60" y2="74" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <line x1="26" y1="40" x2="94" y2="40" stroke="var(--color-hairline)" strokeWidth="0.6" />
      {/* Diagonal meridians */}
      <path d="M 36 13 Q 60 40 84 67" fill="none" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <path d="M 84 13 Q 60 40 36 67" fill="none" stroke="var(--color-hairline)" strokeWidth="0.6" />
      {/* Data: a great-circle arc (dipping plane) */}
      <path d="M 28 28 Q 60 55 92 28" fill="none" stroke="var(--color-ink)" strokeWidth="1.4" />
      {/* Data: lineation points */}
      <circle cx="70" cy="32" r="2.5" fill="var(--color-ink)" />
      <circle cx="48" cy="50" r="2.5" fill="var(--color-ink)" />
      {/* Fold-axis cluster */}
      <circle cx="67" cy="47" r="1.8" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="71" cy="45" r="1.8" fill="var(--color-ink)" fillOpacity="0.7" />
      <circle cx="69" cy="49" r="1.8" fill="var(--color-ink)" fillOpacity="0.7" />
      {/* Centre dot */}
      <circle cx="60" cy="40" r="1.5" fill="var(--color-ink-mute)" />
    </svg>
  );
}
