export function TableThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Header row */}
      <rect x="8" y="8" width="104" height="11" fill="var(--color-ink)" opacity="0.85" rx="1" />
      {/* Column headers (white text bars implied by header fill) */}
      <line x1="8" y1="19" x2="112" y2="19" stroke="var(--color-ink)" strokeWidth="0.8" />
      {/* Data rows — alternating */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <g key={i}>
          {i % 2 === 1 && (
            <rect x="8" y={19 + i * 8} width="104" height="8" fill="var(--color-hairline)" opacity="0.5" />
          )}
          <line x1="8" y1={27 + i * 8} x2="112" y2={27 + i * 8} stroke="var(--color-hairline)" strokeWidth="0.5" />
          {/* Row content bars — text simulation */}
          <rect x="11" y={21 + i * 8} width="26" height="3" fill="var(--color-ink)" opacity="0.25" rx="1" />
          <rect x="42" y={21 + i * 8} width="14" height="3" fill="var(--color-ink)" opacity="0.2" rx="1" />
          <rect x="68" y={21 + i * 8} width="10" height="3" fill="var(--color-ink)" opacity="0.2" rx="1" />
          <rect x="88" y={21 + i * 8} width="10" height="3" fill="var(--color-ink)" opacity="0.2" rx="1" />
          <rect x="100" y={21 + i * 8} width="9" height="3" fill="var(--color-ink)" opacity="0.2" rx="1" />
        </g>
      ))}
      {/* Column separators */}
      {[38, 60, 78, 90, 101].map((x) => (
        <line key={x} x1={x} y1="8" x2={x} y2="67" stroke="var(--color-hairline)" strokeWidth="0.6" />
      ))}
      {/* Total row */}
      <rect x="8" y="67" width="104" height="8" fill="var(--color-ink)" opacity="0.1" />
      <line x1="8" y1="67" x2="112" y2="67" stroke="var(--color-ink)" strokeWidth="1" />
      <rect x="11" y="69" width="14" height="3" fill="var(--color-ink)" opacity="0.4" rx="1" />
      {/* Outer border */}
      <rect x="8" y="8" width="104" height="67" fill="none" stroke="var(--color-ink)" strokeWidth="1" rx="1" />
    </svg>
  );
}
