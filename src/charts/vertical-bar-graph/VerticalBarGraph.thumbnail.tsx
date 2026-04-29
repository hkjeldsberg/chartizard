export function VerticalBarGraphThumbnail() {
  // Playfair-style alternating-shaded vertical bars inside a ruled frame.
  // Bars are NOT sorted by value — they're roughly alphabetical order, per
  // the 1786 original, so the heights rise and fall unpredictably.
  const heights = [14, 28, 8, 3, 38, 5, 4, 32, 52, 6, 34, 8, 18, 10, 44, 12, 40];
  const frameX = 10;
  const frameY = 14;
  const frameW = 100;
  const frameH = 52;
  const baseline = frameY + frameH - 2;
  const gap = 1;
  const barW = (frameW - 8 - gap * (heights.length - 1)) / heights.length;
  const maxH = Math.max(...heights);
  const scale = (frameH - 8) / maxH;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Ruled frame */}
      <rect
        x={frameX}
        y={frameY}
        width={frameW}
        height={frameH}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="0.7"
      />
      {/* Bars — alternating dark/light shading */}
      {heights.map((h, i) => {
        const x = frameX + 4 + i * (barW + gap);
        const bh = h * scale;
        const y = baseline - bh;
        const isDark = i % 2 === 0;
        return (
          <rect
            key={i}
            x={x}
            y={y}
            width={barW}
            height={bh}
            fill={isDark ? "var(--color-ink)" : "var(--color-hairline)"}
            stroke="var(--color-ink)"
            strokeWidth="0.4"
          />
        );
      })}
      {/* Emphasised baseline */}
      <line
        x1={frameX}
        x2={frameX + frameW}
        y1={baseline}
        y2={baseline}
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      {/* Title strip */}
      <text
        x="60"
        y="10"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="6"
        fill="var(--color-ink)"
      >
        SCOTLAND 1781
      </text>
    </svg>
  );
}
