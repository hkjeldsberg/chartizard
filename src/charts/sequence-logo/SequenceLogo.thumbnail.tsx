// Thumbnail: sequence logo silhouette — letter stacks of varying heights
// representing a DNA motif. Taller columns in the middle = conserved positions.
export function SequenceLogoThumbnail() {
  // 10 positions; heights approximate the TATA-box information content profile
  // (bits, max 2). Scaled to 0..52 px for the thumbnail canvas.
  const positions = [
    { x: 8,  h: 8,  letters: [{ y: 0, h: 8,  c: "#888" }] },                                     // pos 1: weak
    { x: 18, h: 9,  letters: [{ y: 0, h: 9,  c: "#888" }] },                                     // pos 2: weak
    { x: 28, h: 46, letters: [{ y: 0, h: 46, c: "#b02020" }] },                                  // pos 3: T strong
    { x: 38, h: 46, letters: [{ y: 0, h: 46, c: "#2a7a2a" }] },                                  // pos 4: A strong
    { x: 48, h: 45, letters: [{ y: 0, h: 45, c: "#b02020" }] },                                  // pos 5: T strong
    { x: 58, h: 46, letters: [{ y: 0, h: 46, c: "#2a7a2a" }] },                                  // pos 6: A strong
    { x: 68, h: 45, letters: [{ y: 0, h: 45, c: "#2a7a2a" }] },                                  // pos 7: A strong
    { x: 78, h: 46, letters: [{ y: 0, h: 46, c: "#2a7a2a" }] },                                  // pos 8: A strong
    { x: 88, h: 8,  letters: [{ y: 0, h: 8,  c: "#888" }] },                                     // pos 9: weak
    { x: 98, h: 9,  letters: [{ y: 0, h: 9,  c: "#888" }] },                                     // pos 10: weak
  ];
  const baseY = 68;
  const colW = 8;

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Baseline */}
      <line x1="4" y1={baseY} x2="116" y2={baseY} stroke="var(--color-hairline)" strokeWidth="0.8" />
      {/* Left axis stub */}
      <line x1="4" y1="12" x2="4" y2={baseY} stroke="var(--color-hairline)" strokeWidth="0.8" />

      {/* Letter stack columns */}
      {positions.map((pos, i) => (
        pos.letters.map((seg, j) => (
          <rect
            key={`${i}-${j}`}
            x={pos.x - colW / 2}
            y={baseY - pos.h - seg.y}
            width={colW}
            height={seg.h}
            fill={seg.c}
            opacity={0.85}
            rx={0.5}
          />
        ))
      ))}

      {/* Position tick labels for key positions */}
      <text x="38" y="76" textAnchor="middle" fontSize="4.5" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">4</text>
      <text x="58" y="76" textAnchor="middle" fontSize="4.5" fontFamily="var(--font-mono)" fill="var(--color-ink-soft)">6</text>
    </svg>
  );
}
