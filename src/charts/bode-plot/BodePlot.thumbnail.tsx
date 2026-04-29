export function BodeThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="6" x2="14" y2="36" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="36" x2="114" y2="36" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Magnitude curve — resonant bump then roll-off */}
      <polyline
        points="14,30 30,28 42,20 50,12 58,18 70,26 85,34 100,36 114,37"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* 0 dB reference */}
      <line x1="14" y1="28" x2="114" y2="28" stroke="var(--color-hairline)" strokeDasharray="2 3" strokeWidth="0.8" />

      {/* Phase panel */}
      <line x1="14" y1="42" x2="14" y2="74" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="74" x2="114" y2="74" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Phase curve — S-shape from 0° to -180° */}
      <polyline
        points="14,44 30,45 42,48 54,56 64,64 76,69 90,72 114,73"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* -180° reference */}
      <line x1="14" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" strokeDasharray="2 3" strokeWidth="0.8" />

      {/* Panel separator */}
      <line x1="14" y1="39" x2="114" y2="39" stroke="var(--color-hairline)" strokeWidth="0.5" />
    </svg>
  );
}
