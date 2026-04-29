export function SmallMultiplesThumbnail() {
  // 3x3 grid of miniature line panels. The 6th panel (middle-right) carries
  // a taller spike to read as the diverging series at thumbnail scale.
  const cols = 3;
  const rows = 3;
  const padX = 10;
  const padY = 8;
  const gap = 4;
  const cellW = (120 - padX * 2 - gap * (cols - 1)) / cols;
  const cellH = (80 - padY * 2 - gap * (rows - 1)) / rows;

  // Baseline line profile for each cell — all share the same x-domain 0..1.
  // The 6th cell (index 5) gets an exaggerated late spike.
  const baseProfile = [0.72, 0.62, 0.56, 0.50, 0.48, 0.44, 0.40, 0.36];
  const divergingProfile = [0.70, 0.60, 0.52, 0.48, 0.44, 0.40, 0.14, 0.24];

  const cells = Array.from({ length: rows * cols }, (_, i) => {
    const r = Math.floor(i / cols);
    const c = i % cols;
    const x0 = padX + c * (cellW + gap);
    const y0 = padY + r * (cellH + gap);
    const profile = i === 5 ? divergingProfile : baseProfile;
    const pts = profile.map((v, k) => {
      const x = x0 + (k / (profile.length - 1)) * cellW;
      const y = y0 + v * cellH;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });
    return { x0, y0, pts, diverging: i === 5 };
  });

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {cells.map((c, i) => (
        <g key={i}>
          <rect
            x={c.x0}
            y={c.y0}
            width={cellW}
            height={cellH}
            fill="none"
            stroke="var(--color-hairline)"
            strokeWidth="0.6"
          />
          <polyline
            points={c.pts.join(" ")}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={c.diverging ? 1.3 : 0.9}
            strokeOpacity={c.diverging ? 1 : 0.7}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      ))}
    </svg>
  );
}
