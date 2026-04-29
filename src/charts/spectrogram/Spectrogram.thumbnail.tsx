// Viridis-like 5-stop ramp — duplicated from the live chart so the thumbnail
// stays dependency-free. The tile is a silhouette, not a rendering of the data.
const STOPS: ReadonlyArray<{ t: number; rgb: [number, number, number] }> = [
  { t: 0.0, rgb: [0x44, 0x01, 0x54] },
  { t: 0.25, rgb: [0x3b, 0x52, 0x8b] },
  { t: 0.5, rgb: [0x21, 0x91, 0x8c] },
  { t: 0.75, rgb: [0x5e, 0xc9, 0x62] },
  { t: 1.0, rgb: [0xfd, 0xe7, 0x25] },
];

function viridis(u: number): string {
  const t = Math.max(0, Math.min(1, u));
  for (let i = 0; i < STOPS.length - 1; i++) {
    const a = STOPS[i];
    const b = STOPS[i + 1];
    if (t >= a.t && t <= b.t) {
      const f = (t - a.t) / (b.t - a.t);
      const r = Math.round(a.rgb[0] + (b.rgb[0] - a.rgb[0]) * f);
      const g = Math.round(a.rgb[1] + (b.rgb[1] - a.rgb[1]) * f);
      const bl = Math.round(a.rgb[2] + (b.rgb[2] - a.rgb[2]) * f);
      return `rgb(${r},${g},${bl})`;
    }
  }
  const last = STOPS[STOPS.length - 1].rgb;
  return `rgb(${last[0]},${last[1]},${last[2]})`;
}

export function SpectrogramThumbnail() {
  // Tiny grid — 24 time × 14 freq. Enough to read as a spectrogram.
  const cols = 24;
  const rows = 14;
  const x0 = 8;
  const y0 = 10;
  const w = 104;
  const h = 56;
  const cellW = w / cols;
  const cellH = h / rows;

  const cells: { c: number; r: number; p: number }[] = [];
  for (let c = 0; c < cols; c++) {
    for (let r = 0; r < rows; r++) {
      const t = c / (cols - 1);
      // Frequency index grows upward visually, so row 0 is highest freq.
      const f = 1 - r / (rows - 1);
      // Chirp: ridge along f = 0.08 + 0.82 * t (maps 200 Hz → 3.8 kHz).
      const chirp = Math.exp(
        -Math.pow((f - (0.08 + 0.82 * t)) / 0.09, 2) * 0.5,
      );
      // Burst at (t ≈ 0.55, f ≈ 0.6).
      const burst =
        0.9 *
        Math.exp(
          -(Math.pow((t - 0.55) / 0.07, 2) +
            Math.pow((f - 0.6) / 0.1, 2)) /
            2,
        );
      const p = Math.max(0.04, chirp + burst);
      cells.push({ c, r, p: Math.min(1, p) });
    }
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {cells.map((c) => (
        <rect
          key={`${c.c}-${c.r}`}
          x={x0 + c.c * cellW}
          y={y0 + c.r * cellH}
          width={cellW + 0.3}
          height={cellH + 0.3}
          fill={viridis(c.p)}
        />
      ))}
      {/* Legend strip — right edge */}
      {Array.from({ length: 14 }).map((_, i) => {
        const u = 1 - i / 13;
        return (
          <rect
            key={i}
            x={114}
            y={10 + i * 4}
            width={3}
            height={4}
            fill={viridis(u)}
          />
        );
      })}
    </svg>
  );
}
