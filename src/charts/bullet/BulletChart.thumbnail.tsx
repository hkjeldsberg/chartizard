export function BulletThumbnail() {
  // A horizontal strip with 3 nested qualitative bands (darkest at the low
  // end), a narrower centred measure bar inside, and a single vertical target
  // tick past the measure.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Qualitative bands — poor (darkest) / fair / good */}
      <rect x="8" y="30" width="42" height="20" fill="var(--color-ink)" fillOpacity="0.32" />
      <rect x="50" y="30" width="20" height="20" fill="var(--color-ink)" fillOpacity="0.2" />
      <rect x="70" y="30" width="34" height="20" fill="var(--color-ink)" fillOpacity="0.1" />

      {/* Measure (actual, inner dark bar) */}
      <rect x="8" y="36" width="72" height="8" fill="var(--color-ink)" />

      {/* Target tick */}
      <line x1="70" y1="25" x2="70" y2="55" stroke="var(--color-ink)" strokeWidth="2.5" />

      {/* Axis rail beneath */}
      <line x1="8" y1="58" x2="104" y2="58" stroke="var(--color-hairline)" />
      <line x1="8" y1="58" x2="8" y2="61" stroke="var(--color-hairline)" />
      <line x1="40" y1="58" x2="40" y2="61" stroke="var(--color-hairline)" />
      <line x1="72" y1="58" x2="72" y2="61" stroke="var(--color-hairline)" />
      <line x1="104" y1="58" x2="104" y2="61" stroke="var(--color-hairline)" />
    </svg>
  );
}
