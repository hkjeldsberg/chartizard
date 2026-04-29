export function PictogramThumbnail() {
  // Three short rows of simplified cup glyphs — a miniature pictogram with a
  // half-icon in the top row to telegraph Isotype's fractional convention.
  const rows = [
    { count: 5, frac: 0.5 },
    { count: 3, frac: 0 },
    { count: 2, frac: 0 },
  ];
  const glyph = 12;
  const gap = 3;
  const left = 14;
  const top = 16;

  function cup(x: number, y: number, fraction = 1, key: string) {
    const clipId = `t-pic-${key}`;
    return (
      <g key={key} transform={`translate(${x},${y}) scale(${glyph / 20})`}>
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={20 * fraction} height={20} />
          </clipPath>
        </defs>
        <g clipPath={`url(#${clipId})`}>
          <path
            d="M3.5 7 L16.5 7 L15 17 Q15 18 14 18 L6 18 Q5 18 5 17 Z"
            fill="var(--color-ink)"
          />
          <path
            d="M16.5 9 Q19 9.5 19 12 Q19 14.5 16.5 15"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="1.3"
            strokeLinecap="round"
          />
        </g>
        {fraction < 1 && (
          <path
            d="M3.5 7 L16.5 7 L15 17 Q15 18 14 18 L6 18 Q5 18 5 17 Z"
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth="0.6"
            opacity="0.5"
          />
        )}
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((r, i) => {
        const y = top + i * (glyph + 6);
        const icons = [];
        for (let j = 0; j < r.count; j++) {
          icons.push(cup(left + j * (glyph + gap), y, 1, `r${i}-${j}`));
        }
        if (r.frac > 0) {
          icons.push(
            cup(left + r.count * (glyph + gap), y, r.frac, `r${i}-f`),
          );
        }
        return <g key={i}>{icons}</g>;
      })}
      <line
        x1="10"
        y1="64"
        x2="110"
        y2="64"
        stroke="var(--color-hairline)"
      />
      <text
        x="60"
        y="74"
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize="7"
        fill="var(--color-ink-mute)"
      >
        1 = 10
      </text>
    </svg>
  );
}
