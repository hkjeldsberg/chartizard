export function PoleZeroThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="8" x2="12" y2="72" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <line x1="12" y1="40" x2="112" y2="40" stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* jω stability boundary (imaginary axis) — prominent */}
      <line x1="50" y1="8" x2="50" y2="72" stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="52" y="13" fontFamily="monospace" fontSize="7" fill="var(--color-ink-mute)">jω</text>

      {/* Conjugate pole pair (×) at approx (-1, ±2j) */}
      {/* Upper pole */}
      <line x1="37" y1="20" x2="43" y2="26" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="43" y1="20" x2="37" y2="26" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      {/* Lower pole (conjugate) */}
      <line x1="37" y1="54" x2="43" y2="60" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="43" y1="54" x2="37" y2="60" stroke="var(--color-ink)" strokeWidth="1.8" strokeLinecap="round" />
      {/* Dashed reflection line */}
      <line x1="40" y1="26" x2="40" y2="54" stroke="var(--color-hairline)" strokeDasharray="2 2" strokeWidth="0.8" />

      {/* Zero (○) at approx (-3, 0) */}
      <circle cx="22" cy="40" r="5" fill="none" stroke="var(--color-ink)" strokeWidth="1.8" />

      {/* Axis arrows */}
      <polyline points="110,40 112,38 112,42" fill="none" stroke="var(--color-hairline)" strokeWidth="0.8" />
      <polyline points="10,10 12,8 14,10" fill="none" stroke="var(--color-hairline)" strokeWidth="0.8" />
    </svg>
  );
}
