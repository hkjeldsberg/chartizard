export function StructureChartThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root module */}
      <rect
        x={46}
        y={8}
        width={28}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Level-2 modules: left library (double-sided), centre plain, right library */}
      <rect
        x={8}
        y={34}
        width={28}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <line x1={12} y1={34} x2={12} y2={46} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={32} y1={34} x2={32} y2={46} stroke="var(--color-ink)" strokeWidth={1} />

      <rect
        x={46}
        y={34}
        width={28}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      <rect
        x={84}
        y={34}
        width={28}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <line x1={88} y1={34} x2={88} y2={46} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={108} y1={34} x2={108} y2={46} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Level-3 modules under centre */}
      <rect
        x={38}
        y={60}
        width={20}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <rect
        x={62}
        y={60}
        width={20}
        height={12}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Edges root → level 2 (elbow) */}
      <path
        d="M 60 20 V 27 H 22 V 34"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <path
        d="M 60 20 V 34"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <path
        d="M 60 20 V 27 H 98 V 34"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Edges centre → level 3 */}
      <path
        d="M 60 46 V 53 H 48 V 60"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <path
        d="M 60 46 V 53 H 72 V 60"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Couple glyphs: one filled (data), one hollow (control) on centre edge */}
      <circle cx={56} cy={28} r={1.6} fill="var(--color-ink)" />
      <circle cx={64} cy={28} r={1.6} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />
    </svg>
  );
}
