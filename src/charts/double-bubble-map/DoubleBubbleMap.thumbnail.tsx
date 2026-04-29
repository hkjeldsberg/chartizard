// Double bubble silhouette — two central discs side-by-side, shared
// attributes stacked in the middle column, unique attributes fanning out.

export function DoubleBubbleMapThumbnail() {
  const cy = 40;
  const leftCx = 30;
  const rightCx = 90;
  const midX = 60;
  const rCentral = 9;
  const rSat = 4;

  const shared = [
    { x: midX, y: cy - 16 },
    { x: midX, y: cy },
    { x: midX, y: cy + 16 },
  ];

  const leftUnique = [
    { x: 10, y: cy - 18 },
    { x: 6, y: cy + 8 },
  ];
  const rightUnique = [
    { x: 110, y: cy - 18 },
    { x: 114, y: cy + 8 },
  ];

  const trim = (x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.max(0.0001, Math.sqrt(dx * dx + dy * dy));
    const ux = dx / len;
    const uy = dy / len;
    return {
      x1: x1 + ux * r1,
      y1: y1 + uy * r1,
      x2: x2 - ux * r2,
      y2: y2 - uy * r2,
    };
  };

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Edges: shared bubbles linked to BOTH centrals */}
      {shared.flatMap((s, i) => {
        const toLeft = trim(leftCx, cy, rCentral, s.x, s.y, rSat);
        const toRight = trim(rightCx, cy, rCentral, s.x, s.y, rSat);
        return [
          <line
            key={`sl-${i}`}
            x1={toLeft.x1}
            y1={toLeft.y1}
            x2={toLeft.x2}
            y2={toLeft.y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />,
          <line
            key={`sr-${i}`}
            x1={toRight.x1}
            y1={toRight.y1}
            x2={toRight.x2}
            y2={toRight.y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />,
        ];
      })}
      {/* Left unique edges */}
      {leftUnique.map((u, i) => {
        const seg = trim(leftCx, cy, rCentral, u.x, u.y, rSat);
        return (
          <line
            key={`ll-${i}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        );
      })}
      {/* Right unique edges */}
      {rightUnique.map((u, i) => {
        const seg = trim(rightCx, cy, rCentral, u.x, u.y, rSat);
        return (
          <line
            key={`rr-${i}`}
            x1={seg.x1}
            y1={seg.y1}
            x2={seg.x2}
            y2={seg.y2}
            stroke="var(--color-ink-mute)"
            strokeWidth={0.8}
            strokeLinecap="round"
          />
        );
      })}
      {/* Satellites */}
      {[...shared, ...leftUnique, ...rightUnique].map((b, i) => (
        <circle
          key={`s-${i}`}
          cx={b.x}
          cy={b.y}
          r={rSat}
          fill="var(--color-surface)"
          stroke="var(--color-ink)"
          strokeWidth={0.9}
        />
      ))}
      {/* Central bubbles */}
      <circle
        cx={leftCx}
        cy={cy}
        r={rCentral}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
      <circle
        cx={rightCx}
        cy={cy}
        r={rCentral}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
    </svg>
  );
}
