export function SociogramThumbnail() {
  // Three star nodes near the centre with arrows pointing in from a ring of
  // smaller peers, plus one hollow "isolate" in the corner.
  const stars = [
    { x: 54, y: 36 },
    { x: 68, y: 48 },
    { x: 42, y: 48 },
  ];
  const peers = [
    { x: 22, y: 22 },
    { x: 38, y: 14 },
    { x: 62, y: 12 },
    { x: 86, y: 22 },
    { x: 96, y: 44 },
    { x: 88, y: 60 },
    { x: 66, y: 68 },
    { x: 42, y: 68 },
    { x: 20, y: 58 },
  ];
  const isolate = { x: 12, y: 72 };

  // Arrow marker.
  const marker = (
    <defs>
      <marker
        id="sociogram-thumb-arrow"
        viewBox="0 0 10 10"
        refX={8}
        refY={5}
        markerWidth={4}
        markerHeight={4}
        orient="auto-start-reverse"
      >
        <path d="M 0 0 L 10 5 L 0 10 z" fill="var(--color-ink)" />
      </marker>
    </defs>
  );

  // Trim line ends so arrowheads land on the node ring.
  function trim(x1: number, y1: number, x2: number, y2: number, r1 = 2, r2 = 4.2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy) || 1;
    const ux = dx / len;
    const uy = dy / len;
    return { x1: x1 + ux * r1, y1: y1 + uy * r1, x2: x2 - ux * r2, y2: y2 - uy * r2 };
  }

  const ties = [
    // Peers → stars
    { from: peers[0], to: stars[2] },
    { from: peers[1], to: stars[0] },
    { from: peers[2], to: stars[0] },
    { from: peers[3], to: stars[1] },
    { from: peers[4], to: stars[1] },
    { from: peers[5], to: stars[1] },
    { from: peers[6], to: stars[1] },
    { from: peers[7], to: stars[2] },
    { from: peers[8], to: stars[2] },
    // Star ↔ star
    { from: stars[0], to: stars[1] },
    { from: stars[1], to: stars[2] },
  ];

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {marker}
      {ties.map((t, i) => {
        const line = trim(t.from.x, t.from.y, t.to.x, t.to.y);
        return (
          <line
            key={`tie-${i}`}
            x1={line.x1}
            y1={line.y1}
            x2={line.x2}
            y2={line.y2}
            stroke="var(--color-ink)"
            strokeOpacity={0.4}
            strokeWidth={0.9}
            markerEnd="url(#sociogram-thumb-arrow)"
          />
        );
      })}
      {peers.map((p, i) => (
        <circle key={`p-${i}`} cx={p.x} cy={p.y} r={2} fill="var(--color-ink)" />
      ))}
      {stars.map((s, i) => (
        <g key={`s-${i}`}>
          <circle cx={s.x} cy={s.y} r={4.2} fill="var(--color-ink)" />
          <circle
            cx={s.x}
            cy={s.y}
            r={6}
            fill="none"
            stroke="var(--color-ink)"
            strokeWidth={0.6}
          />
        </g>
      ))}
      {/* Isolate — hollow, dashed ring, no arrows */}
      <circle
        cx={isolate.x}
        cy={isolate.y}
        r={2.2}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={0.8}
        strokeDasharray="1.2 1.2"
      />
    </svg>
  );
}
