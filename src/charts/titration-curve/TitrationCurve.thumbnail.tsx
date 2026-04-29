export function TitrationCurveThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Y-axis */}
      <line x1="14" y1="6" x2="14" y2="70" stroke="var(--color-hairline)" />
      {/* X-axis */}
      <line x1="14" y1="70" x2="114" y2="70" stroke="var(--color-hairline)" />
      {/* Equivalence point dashed vertical */}
      <line
        x1="64" y1="10" x2="64" y2="70"
        stroke="var(--color-ink)"
        strokeWidth="0.8"
        strokeDasharray="3 2"
        opacity="0.45"
      />
      {/* Strong-acid curve — S-shape, steep at x=64 */}
      <path
        d="M14,64 C20,63 30,61 38,59 C46,57 52,54 58,50 C60,47 62,42 64,38 C66,34 68,29 72,26 C78,22 88,18 100,16"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      {/* Weak-acid curve — dashed, gradual rise with buffer plateau */}
      <path
        d="M14,60 C22,57 34,52 46,50 C54,48 60,47 64,43 C68,39 72,28 78,24 C86,20 96,17 108,16"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeDasharray="4 2"
        opacity="0.6"
      />
      {/* Equivalence point dot */}
      <circle cx="64" cy="38" r="2.2" fill="var(--color-ink)" />
    </svg>
  );
}
