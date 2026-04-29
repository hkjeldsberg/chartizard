export function WaffleThumbnail() {
  // 10×10 grid of squares. 87 filled, 13 empty. The thumbnail mirrors the live
  // chart's reading: ink squares form a near-solid block with a small sliver
  // of hairline outlines at the top-right to show the 13% deficit.
  const cols = 10;
  const rows = 10;
  const size = 5.2;
  const gap = 0.8;
  const total = cols * rows;
  const filled = 87;
  const gridW = cols * (size + gap) - gap;
  const gridH = rows * (size + gap) - gap;
  const left = (120 - gridW) / 2;
  const top = 14;

  const cells = [];
  for (let i = 0; i < total; i++) {
    const row = Math.floor(i / cols);
    const col = i % cols;
    // Bottom-up fill: row 0 = bottom, so flip y.
    const y = top + (rows - 1 - row) * (size + gap);
    const x = left + col * (size + gap);
    const isFilled = i < filled;
    cells.push(
      isFilled ? (
        <rect key={i} x={x} y={y} width={size} height={size} fill="var(--color-ink)" />
      ) : (
        <rect
          key={i}
          x={x}
          y={y}
          width={size}
          height={size}
          fill="none"
          stroke="var(--color-ink)"
          strokeWidth="0.5"
          opacity="0.55"
        />
      ),
    );
  }

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {cells}
      <text
        x={60}
        y={10}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="8"
        fontWeight="500"
        fill="var(--color-ink)"
      >
        87%
      </text>
    </svg>
  );
}
