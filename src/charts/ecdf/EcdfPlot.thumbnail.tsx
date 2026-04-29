export function EcdfThumbnail() {
  // A tiny staircase rising left-to-right with six steps — the silhouette
  // of an ECDF built from a small sample.
  // Points are laid out in the 120×80 viewBox with a ~10px margin inset.
  const steps = [
    { x: 22, y: 62 },
    { x: 36, y: 54 },
    { x: 52, y: 44 },
    { x: 68, y: 34 },
    { x: 84, y: 24 },
    { x: 100, y: 16 },
  ];

  // Build a stair path: horizontal to each x at the previous height,
  // then vertical jump up to the new height.
  let prevY = 68;
  const segs: string[] = [`M 12 ${prevY}`];
  for (const s of steps) {
    segs.push(`L ${s.x} ${prevY}`);
    segs.push(`L ${s.x} ${s.y}`);
    prevY = s.y;
  }
  segs.push(`L 112 ${prevY}`);

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" />
      <line x1="12" y1="12" x2="12" y2="68" stroke="var(--color-hairline)" />
      {/* Faint reference S-curve */}
      <path
        d="M 12 66 C 36 64, 48 52, 62 40 S 92 18, 112 14"
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth="1"
        strokeDasharray="2 2"
      />
      {/* ECDF staircase */}
      <path
        d={segs.join(" ")}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.8"
        strokeLinejoin="miter"
        strokeLinecap="butt"
      />
      {/* Observation dots at each step top */}
      {steps.map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r="1.6" fill="var(--color-ink)" />
      ))}
    </svg>
  );
}
