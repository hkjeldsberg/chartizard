export function RootLocusThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Real-axis and jω axis hairlines */}
      <line x1="8" y1="40" x2="112" y2="40" stroke="var(--color-hairline)" strokeWidth="0.8" />
      {/* Imaginary / stability boundary (slightly bolder) */}
      <line x1="78" y1="8" x2="78" y2="72" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Three open-loop poles (×) on the real axis */}
      {/* pole at −3 */}
      <line x1="20" y1="37" x2="26" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="26" y1="37" x2="20" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      {/* pole at −2 */}
      <line x1="42" y1="37" x2="48" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="48" y1="37" x2="42" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      {/* pole at −1 */}
      <line x1="60" y1="37" x2="66" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="66" y1="37" x2="60" y2="43" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Real branch heading left from −3 toward −∞ */}
      <line x1="23" y1="40" x2="8" y2="40" stroke="var(--color-ink)" strokeWidth="1.6" strokeLinecap="round" />

      {/* Breakaway near (−1.42, 0) ≈ x = 55 — curves rising to +60° and dropping to −60° */}
      {/* Upper branch: from breakaway sweeping up through jω axis into right-half-plane */}
      <path
        d="M 55 40 C 60 40, 70 32, 78 22 S 96 10, 104 6"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      {/* Lower branch: mirror */}
      <path
        d="M 55 40 C 60 40, 70 48, 78 58 S 96 70, 104 74"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />

      {/* jω-axis crossing dots */}
      <circle cx="78" cy="22" r="1.8" fill="var(--color-ink)" />
      <circle cx="78" cy="58" r="1.8" fill="var(--color-ink)" />
    </svg>
  );
}
