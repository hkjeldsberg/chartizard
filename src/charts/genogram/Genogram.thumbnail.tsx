// Genogram thumbnail — 3 generations with a marriage line, a descent drop,
// a sibship line, and mixed fill states. Compresses the McGoldrick/Gerson
// notation into a 120×80 silhouette.

export function GenogramThumbnail() {
  // Generation rows.
  const y1 = 16;
  const y2 = 42;
  const y3 = 68;

  // Gen I: one couple (square + circle) — paternal grandfather affected + deceased
  const i1x = 32;
  const i2x = 60;

  // Gen II: one couple on the left (II-1 affected), one on the right
  const ii1x = 24;
  const ii2x = 46;
  const ii3x = 78;
  const ii4x = 100;

  // Gen III: three siblings from II-a, two from II-b
  const iii1x = 18;
  const iii2x = 34;
  const iii3x = 50;
  const iii4x = 80;
  const iii5x = 98;

  const glyphR = 4; // half-side / radius

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Gen I mate line (I-1 × I-2) */}
      <line x1={i1x + glyphR} y1={y1} x2={i2x - glyphR} y2={y1} stroke="var(--color-ink)" strokeWidth={1} />
      {/* Descent drop to midpoint */}
      <line x1={(i1x + i2x) / 2} y1={y1} x2={(i1x + i2x) / 2} y2={y2 - glyphR - 2} stroke="var(--color-ink)" strokeWidth={1} />
      {/* Jog to II-1 */}
      <line x1={(i1x + i2x) / 2} y1={y2 - glyphR - 2} x2={ii1x} y2={y2 - glyphR - 2} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={ii1x} y1={y2 - glyphR - 2} x2={ii1x} y2={y2 - glyphR} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Gen II couple A — strong bond (double line) */}
      <line x1={ii1x + glyphR} y1={y2 - 1.5} x2={ii2x - glyphR} y2={y2 - 1.5} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={ii1x + glyphR} y1={y2 + 1.5} x2={ii2x - glyphR} y2={y2 + 1.5} stroke="var(--color-ink)" strokeWidth={0.9} />

      {/* Gen II couple B — estranged (dashed) */}
      <line x1={ii3x + glyphR} y1={y2} x2={ii4x - glyphR} y2={y2} stroke="var(--color-ink)" strokeWidth={1} strokeDasharray="2 2" />

      {/* Descent drops to Gen III sibship lines */}
      <line x1={(ii1x + ii2x) / 2} y1={y2} x2={(ii1x + ii2x) / 2} y2={y3 - glyphR - 4} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={(ii3x + ii4x) / 2} y1={y2} x2={(ii3x + ii4x) / 2} y2={y3 - glyphR - 4} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Sibship A */}
      <line x1={iii1x} y1={y3 - glyphR - 4} x2={iii3x} y2={y3 - glyphR - 4} stroke="var(--color-ink)" strokeWidth={1} />
      {[iii1x, iii2x, iii3x].map((x, i) => (
        <line key={`a-${i}`} x1={x} y1={y3 - glyphR - 4} x2={x} y2={y3 - glyphR} stroke="var(--color-ink)" strokeWidth={1} />
      ))}
      {/* Sibship B */}
      <line x1={iii4x} y1={y3 - glyphR - 4} x2={iii5x} y2={y3 - glyphR - 4} stroke="var(--color-ink)" strokeWidth={1} />
      {[iii4x, iii5x].map((x, i) => (
        <line key={`b-${i}`} x1={x} y1={y3 - glyphR - 4} x2={x} y2={y3 - glyphR} stroke="var(--color-ink)" strokeWidth={1} />
      ))}

      {/* Conflict zigzag across cousin branches */}
      <polyline
        points={`${iii3x + glyphR},${y3} ${iii3x + glyphR + 5},${y3 - 2} ${iii3x + glyphR + 10},${y3 + 2} ${iii3x + glyphR + 15},${y3 - 2} ${iii3x + glyphR + 20},${y3 + 2} ${iii4x - glyphR},${y3}`}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={0.9}
      />

      {/* Gen I: I-1 affected + deceased (filled square with X) */}
      <rect x={i1x - glyphR} y={y1 - glyphR} width={glyphR * 2} height={glyphR * 2} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={i1x - glyphR - 2} y1={y1 - glyphR - 2} x2={i1x + glyphR + 2} y2={y1 + glyphR + 2} stroke="var(--color-ink)" strokeWidth={1.2} />
      {/* I-2 open circle */}
      <circle cx={i2x} cy={y1} r={glyphR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Gen II: II-1 filled square (affected), II-2 open circle */}
      <rect x={ii1x - glyphR} y={y2 - glyphR} width={glyphR * 2} height={glyphR * 2} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1} />
      <circle cx={ii2x} cy={y2} r={glyphR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* II-3 open square, II-4 open circle */}
      <rect x={ii3x - glyphR} y={y2 - glyphR} width={glyphR * 2} height={glyphR * 2} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <circle cx={ii4x} cy={y2} r={glyphR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Gen III glyphs */}
      {/* III-1 filled square */}
      <rect x={iii1x - glyphR} y={y3 - glyphR} width={glyphR * 2} height={glyphR * 2} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* III-2 open circle */}
      <circle cx={iii2x} cy={y3} r={glyphR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* III-3 diamond */}
      <polygon
        points={`${iii3x},${y3 - glyphR} ${iii3x + glyphR},${y3} ${iii3x},${y3 + glyphR} ${iii3x - glyphR},${y3}`}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* III-4 filled square */}
      <rect x={iii4x - glyphR} y={y3 - glyphR} width={glyphR * 2} height={glyphR * 2} fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* III-5 open circle */}
      <circle cx={iii5x} cy={y3} r={glyphR} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
    </svg>
  );
}
