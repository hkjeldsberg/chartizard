export function TopographicMapThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Outer contour rings — peak left-centre */}
      <ellipse cx={45} cy={44} rx={36} ry={28} fill="none" stroke="var(--color-ink)" strokeWidth={0.7} strokeOpacity={0.35} />
      <ellipse cx={45} cy={44} rx={27} ry={21} fill="none" stroke="var(--color-ink)" strokeWidth={0.8} strokeOpacity={0.5} />
      <ellipse cx={45} cy={44} rx={19} ry={15} fill="none" stroke="var(--color-ink)" strokeWidth={1.0} strokeOpacity={0.65} />
      <ellipse cx={45} cy={44} rx={12} ry={9} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} strokeOpacity={0.8} />
      <ellipse cx={45} cy={44} rx={6} ry={4} fill="none" stroke="var(--color-ink)" strokeWidth={1.5} strokeOpacity={0.95} />

      {/* Second smaller peak — right side */}
      <ellipse cx={90} cy={55} rx={18} ry={14} fill="none" stroke="var(--color-ink)" strokeWidth={0.7} strokeOpacity={0.35} />
      <ellipse cx={90} cy={55} rx={11} ry={8} fill="none" stroke="var(--color-ink)" strokeWidth={0.9} strokeOpacity={0.55} />
      <ellipse cx={90} cy={55} rx={5} ry={4} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} strokeOpacity={0.8} />

      {/* Hachure ticks on the larger peak's middle contour (upper-right quadrant) */}
      <line x1={63} y1={33} x2={65} y2={28} stroke="var(--color-ink)" strokeWidth={0.6} strokeOpacity={0.55} />
      <line x1={58} y1={29} x2={60} y2={24} stroke="var(--color-ink)" strokeWidth={0.6} strokeOpacity={0.55} />
      <line x1={52} y1={29} x2={52} y2={24} stroke="var(--color-ink)" strokeWidth={0.6} strokeOpacity={0.55} />
      <line x1={45} y1={30} x2={44} y2={25} stroke="var(--color-ink)" strokeWidth={0.6} strokeOpacity={0.55} />

      {/* Spot-height cross at peak A */}
      <line x1={42} y1={44} x2={48} y2={44} stroke="var(--color-ink)" strokeWidth={1} strokeOpacity={0.8} />
      <line x1={45} y1={41} x2={45} y2={47} stroke="var(--color-ink)" strokeWidth={1} strokeOpacity={0.8} />
      <text x={49} y={42} fontFamily="monospace" fontSize={6} fill="var(--color-ink)" opacity={0.75}>1247 m</text>

      {/* River */}
      <path d="M 12,62 Q 25,60 38,62 Q 50,65 60,63" fill="none" stroke="rgba(60,120,220,0.65)" strokeWidth={1} strokeDasharray="3 2" />

      {/* Frame */}
      <rect x={6} y={5} width={108} height={70} fill="none" stroke="var(--color-hairline)" strokeWidth={0.6} />
    </svg>
  );
}
