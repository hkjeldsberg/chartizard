export function ExplodedViewDrawingThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Centre-line — dashed axis of insertion */}
      <line
        x1={46}
        y1={6}
        x2={46}
        y2={74}
        stroke="var(--color-ink)"
        strokeWidth={0.9}
        strokeDasharray="5 2 1 2"
      />

      {/* Component 1 — top end cap */}
      <rect x={40} y={8} width={12} height={5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Component 2 — top bearing race (X hatch) */}
      <rect x={38} y={18} width={16} height={5} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={38} y1={18} x2={54} y2={23} stroke="var(--color-ink)" strokeWidth={0.8} />
      <line x1={38} y1={23} x2={54} y2={18} stroke="var(--color-ink)" strokeWidth={0.8} />
      {/* Component 3 — hub shell body with flanges */}
      <rect x={32} y={28} width={28} height={3} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={40} y={31} width={12} height={16} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={32} y={47} width={28} height={3} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Component 4 — axle (thin tall rect) */}
      <rect x={44} y={54} width={4} height={8} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      {/* Component 5 — bottom bearing race */}
      <rect x={38} y={64} width={16} height={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={38} y1={64} x2={54} y2={68} stroke="var(--color-ink)" strokeWidth={0.8} />
      <line x1={38} y1={68} x2={54} y2={64} stroke="var(--color-ink)" strokeWidth={0.8} />
      {/* Component 6 — hexagon locknut */}
      <polygon
        points="42,72 50,72 54,75 50,78 42,78 38,75"
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />

      {/* Leader lines + callouts — just a few to suggest the convention */}
      <line x1={52} y1={11} x2={74} y2={14} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      <circle cx={78} cy={14} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />
      <text x={78} y={16.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={5} fill="var(--color-ink)">1</text>

      <line x1={60} y1={39} x2={86} y2={39} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      <circle cx={90} cy={39} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />
      <text x={90} y={41.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={5} fill="var(--color-ink)">3</text>

      <line x1={54} y1={75} x2={78} y2={66} stroke="var(--color-ink-mute)" strokeWidth={0.8} />
      <circle cx={82} cy={66} r={4} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.9} />
      <text x={82} y={68.5} textAnchor="middle" fontFamily="var(--font-mono)" fontSize={5} fill="var(--color-ink)">6</text>

      {/* Small BOM strip on the far right */}
      <rect x={98} y={20} width={18} height={32} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={0.8} />
      <line x1={98} y1={26} x2={116} y2={26} stroke="var(--color-ink)" strokeWidth={0.6} />
      <line x1={98} y1={33} x2={116} y2={33} stroke="var(--color-hairline)" strokeWidth={0.6} />
      <line x1={98} y1={40} x2={116} y2={40} stroke="var(--color-hairline)" strokeWidth={0.6} />
      <line x1={98} y1={47} x2={116} y2={47} stroke="var(--color-hairline)" strokeWidth={0.6} />
    </svg>
  );
}
