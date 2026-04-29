export function BalancedScorecardThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Top quadrant — Financial */}
      <rect x="18" y="4" width="84" height="18" rx="2" fill="var(--color-ink)" fillOpacity="0.08" stroke="var(--color-hairline)" strokeWidth="0.7" />
      <rect x="22" y="9" width="30" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />
      <rect x="22" y="14" width="40" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />

      {/* Left quadrant — Learning & Growth */}
      <rect x="4" y="26" width="28" height="28" rx="2" fill="var(--color-ink)" fillOpacity="0.08" stroke="var(--color-hairline)" strokeWidth="0.7" />
      <rect x="7" y="31" width="18" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />
      <rect x="7" y="35.5" width="22" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />
      <rect x="7" y="40" width="15" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />

      {/* Right quadrant — Customer */}
      <rect x="88" y="26" width="28" height="28" rx="2" fill="var(--color-ink)" fillOpacity="0.08" stroke="var(--color-hairline)" strokeWidth="0.7" />
      <rect x="91" y="31" width="18" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />
      <rect x="91" y="35.5" width="22" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />
      <rect x="91" y="40" width="15" height="2.5" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />

      {/* Bottom quadrant — Process */}
      <rect x="18" y="58" width="84" height="18" rx="2" fill="var(--color-ink)" fillOpacity="0.08" stroke="var(--color-hairline)" strokeWidth="0.7" />
      <rect x="22" y="63" width="30" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />
      <rect x="22" y="68" width="40" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.18" />

      {/* Centre box — Strategy */}
      <rect x="42" y="28" width="36" height="24" rx="3" fill="var(--color-ink)" fillOpacity="0.10" stroke="var(--color-ink)" strokeWidth="0.9" />
      <rect x="47" y="34" width="26" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.4" />
      <rect x="50" y="39" width="20" height="3" rx="1" fill="var(--color-ink)" fillOpacity="0.25" />

      {/* Causal chain arrows — dashed lines */}
      {/* Learning → Process (bottom-left to centre-left) */}
      <line x1="32" y1="40" x2="42" y2="40" stroke="var(--color-ink)" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 1.5" />
      {/* Process → Customer (centre-bottom to right) */}
      <line x1="60" y1="52" x2="60" y2="58" stroke="var(--color-ink)" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 1.5" />
      {/* Customer → Financial (right to top) */}
      <line x1="78" y1="40" x2="88" y2="40" stroke="var(--color-ink)" strokeOpacity="0.35" strokeWidth="0.8" strokeDasharray="2 1.5" />
    </svg>
  );
}
