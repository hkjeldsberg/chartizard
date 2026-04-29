export function DrainPlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="14" y1="8" x2="14" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="14" y1="66" x2="112" y2="66" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Family of I_D vs V_DS curves — rising triode region then flat saturation plateau.
          Five curves spaced by V_GS: top is highest. Each curve: steep rise, knee, plateau. */}
      <path
        d="M 14 66 Q 18 24 28 18 L 112 16"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 14 66 Q 20 34 32 28 L 112 26"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 14 66 Q 22 44 36 40 L 112 38"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 14 66 Q 24 56 42 52 L 112 51"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M 14 66 Q 30 64 48 63 L 112 63"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Pinch-off locus — dashed parabola through the knees */}
      <path
        d="M 14 66 Q 22 58 32 28 T 52 18"
        fill="none"
        stroke="var(--color-ink-mute)"
        strokeWidth="0.9"
        strokeDasharray="3 2"
      />

      {/* Knee emphasis on the third curve */}
      <circle cx="36" cy="40" r="2" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Axis captions */}
      <text
        x="60"
        y="76"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="6"
        fill="var(--color-ink-mute)"
      >
        V_DS
      </text>
      <text
        x="6"
        y="12"
        fontFamily="var(--font-mono)"
        fontSize="6"
        fill="var(--color-ink-mute)"
      >
        I_D
      </text>
    </svg>
  );
}
