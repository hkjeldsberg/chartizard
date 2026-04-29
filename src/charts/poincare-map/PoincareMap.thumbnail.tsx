export function PoincareMapThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Border */}
      <rect x="8" y="8" width="104" height="64" fill="none" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* KAM torus A — smooth closed curve (top-left region) */}
      <ellipse cx="36" cy="30" rx="14" ry="7" fill="none" stroke="var(--color-ink)" strokeWidth="1.1" strokeOpacity="0.85" />
      <ellipse cx="36" cy="30" rx="9" ry="4" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeOpacity="0.7" />

      {/* KAM torus B — smooth closed curve (right side) */}
      <ellipse cx="88" cy="46" rx="10" ry="5" fill="none" stroke="var(--color-ink)" strokeWidth="1.0" strokeOpacity="0.65" />

      {/* Chaotic zone — scattered dots filling a region in the centre */}
      {[
        [52, 36], [57, 42], [62, 35], [48, 44], [55, 50],
        [64, 48], [70, 40], [66, 55], [50, 55], [60, 28],
        [72, 32], [45, 35], [68, 62], [54, 60], [76, 52],
        [42, 62], [78, 44], [56, 24], [80, 28], [44, 50],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.0" fill="var(--color-ink)" fillOpacity="0.35" />
      ))}

      {/* Axis stubs */}
      <line x1="8" y1="72" x2="112" y2="72" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <line x1="8" y1="8" x2="8" y2="72" stroke="var(--color-hairline)" strokeWidth="0.6" />
    </svg>
  );
}
