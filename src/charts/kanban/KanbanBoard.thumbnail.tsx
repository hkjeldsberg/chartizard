export function KanbanThumbnail() {
  // Four columns, each a tinted band with 1-2 small card rectangles.
  // Column x-origin and widths. Gaps at 30/60/90.
  const cols: Array<{ x: number; cards: number }> = [
    { x: 6, cards: 2 },
    { x: 34, cards: 2 },
    { x: 62, cards: 1 },
    { x: 90, cards: 1 },
  ];
  const colW = 24;
  const headerH = 10;
  const cardH = 12;
  const cardGap = 4;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* column bands */}
      {cols.map((c, i) => (
        <rect
          key={`band-${i}`}
          x={c.x}
          y={6}
          width={colW}
          height={68}
          rx={2}
          ry={2}
          fill="var(--color-hairline)"
          opacity={0.4}
        />
      ))}
      {/* header rules */}
      {cols.map((c, i) => (
        <line
          key={`hdr-${i}`}
          x1={c.x}
          x2={c.x + colW}
          y1={6 + headerH}
          y2={6 + headerH}
          stroke="var(--color-hairline)"
        />
      ))}
      {/* header labels (tiny ticks to suggest column titles without text) */}
      {cols.map((c, i) => (
        <rect
          key={`lbl-${i}`}
          x={c.x + 3}
          y={10}
          width={10}
          height={2}
          fill="var(--color-ink)"
          opacity={0.7}
        />
      ))}
      {/* WIP chip indicator on column 2 (the in-progress column) */}
      <rect x={34 + colW - 9} y={9} width={7} height={4} rx={2} ry={2} fill="none" stroke="var(--color-ink)" strokeWidth="0.8" />

      {/* cards */}
      {cols.flatMap((c, i) =>
        Array.from({ length: c.cards }, (_, r) => {
          const y = 6 + headerH + 4 + r * (cardH + cardGap);
          return (
            <g key={`card-${i}-${r}`}>
              <rect
                x={c.x + 3}
                y={y}
                width={colW - 6}
                height={cardH}
                rx={1.5}
                ry={1.5}
                fill="var(--color-surface)"
                stroke="var(--color-ink)"
                strokeWidth="0.9"
              />
              {/* avatar dot */}
              <circle
                cx={c.x + colW - 6}
                cy={y + cardH - 3}
                r={1.4}
                fill="var(--color-ink)"
                opacity={0.7}
              />
              {/* priority chip */}
              <rect
                x={c.x + colW - 10}
                y={y + 2}
                width={5}
                height={2.5}
                fill="var(--color-ink)"
                opacity={0.85}
              />
            </g>
          );
        }),
      )}
    </svg>
  );
}
