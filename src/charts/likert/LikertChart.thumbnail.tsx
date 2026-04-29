export function LikertThumbnail() {
  // Five segments per row, hand-picked so the thumbnail reads as "rows that
  // tilt" — top rows extend further right (positive tilt), bottom rows extend
  // further left (negative tilt). Segment widths are in px; each row is then
  // shifted horizontally so its neutral-segment midpoint sits on the centre.
  const rows: Array<[number, number, number, number, number]> = [
    // [SD, D, N, A, SA]
    [2,  6,  10, 38, 32],
    [4,  10, 12, 36, 26],
    [8,  14, 16, 28, 20],
    [16, 22, 18, 20, 12],
    [26, 24, 14, 14, 8 ],
  ];
  const colours = ["#a55a4a", "#c78b7d", "var(--color-hairline)", "#8a8a8a", "var(--color-ink)"];

  const centreX = 60;
  const barH = 8;
  const gap = 4;
  const startY = 12;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Centre line — the neutral midpoint */}
      <line x1={centreX} y1="8" x2={centreX} y2="72" stroke="var(--color-ink)" strokeWidth="1" />
      {rows.map((segs, i) => {
        const leftOfCentre = segs[0] + segs[1] + segs[2] / 2; // SD + D + N/2
        const startX = centreX - leftOfCentre * 0.55; // scale factor to fit 120w
        const y = startY + i * (barH + gap);
        let cursor = startX;
        return (
          <g key={i}>
            {segs.map((s, j) => {
              const w = s * 0.55;
              const rect = (
                <rect key={j} x={cursor} y={y} width={w} height={barH} fill={colours[j]} />
              );
              cursor += w;
              return rect;
            })}
          </g>
        );
      })}
    </svg>
  );
}
