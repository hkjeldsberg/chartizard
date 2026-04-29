export function NyquistPlotThumbnail() {
  // A stylised Nyquist contour: a closed loop in the complex plane that
  // passes near the critical point (−1, 0). The loop enters from the
  // bottom-left (low ω tail asymptote), curves up and to the right
  // through the lower half-plane, swings past the critical point, closes
  // back through the upper half-plane and spirals into the origin.
  const cx = 64;
  const cy = 40;

  // Convert (real, imag) in plane units (Re: [-3, 1], Im: [-2, 2]) to
  // px. Critical point (−1, 0) → Re=-1 → approx cx-16.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line
        x1="12"
        y1={cy}
        x2="108"
        y2={cy}
        stroke="var(--color-hairline)"
      />
      <line
        x1={cx}
        y1="12"
        x2={cx}
        y2="68"
        stroke="var(--color-hairline)"
      />

      {/* Unit circle — |G| = 1 */}
      <circle
        cx={cx}
        cy={cy}
        r="14"
        fill="none"
        stroke="var(--color-hairline)"
        strokeDasharray="2 3"
      />

      {/* Lower-half branch (ω > 0): tail coming in from bottom-left at the
          ω → 0⁻ asymptote, sweeping right toward the origin */}
      <path
        d="M 30 74
           C 32 60, 40 52, 48 48
           C 54 46, 60 45, 64 44
           C 70 42, 74 42, 78 41"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Upper-half mirror branch (ω < 0) — dashed */}
      <path
        d="M 30 6
           C 32 20, 40 28, 48 32
           C 54 34, 60 35, 64 36
           C 70 38, 74 38, 78 39"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.4"
        strokeDasharray="3 2"
        strokeLinecap="round"
      />

      {/* Critical point (−1, 0) */}
      <circle
        cx={cx - 16}
        cy={cy}
        r="2.6"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth="1.3"
      />
      <line
        x1={cx - 20}
        y1={cy}
        x2={cx - 12}
        y2={cy}
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      <line
        x1={cx - 16}
        y1={cy - 4}
        x2={cx - 16}
        y2={cy + 4}
        stroke="var(--color-ink)"
        strokeWidth="1"
      />

      {/* Origin dot (ω → ±∞) */}
      <circle cx={cx} cy={cy} r="1.4" fill="var(--color-ink)" />
    </svg>
  );
}
