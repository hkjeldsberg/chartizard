export function DataFlowDiagramThumbnail() {
  // Miniature DFD silhouette: external-entity rectangle → process circle →
  // open-rect data store → process circle → external-entity rectangle. Shows
  // the three Yourdon/DeMarco shapes at a glance.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* External entity (rectangle) — left */}
      <rect
        x={6}
        y={32}
        width={18}
        height={16}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />

      {/* Arrow → process 1 */}
      <line x1={24} y1={40} x2={34} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="36,40 33,38 33,42" fill="var(--color-ink)" />

      {/* Process 1 (circle) */}
      <circle cx={44} cy={40} r={8} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <text
        x={44}
        y={43}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink-soft)"
      >
        1
      </text>

      {/* Arrow → store */}
      <line x1={52} y1={40} x2={62} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="64,40 61,38 61,42" fill="var(--color-ink)" />

      {/* Data store (open-rect: top + bottom lines only) */}
      <line x1={64} y1={34} x2={84} y2={34} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={64} y1={46} x2={84} y2={46} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={70} y1={34} x2={70} y2={46} stroke="var(--color-ink)" strokeWidth={0.8} />
      <text
        x={66}
        y={43}
        fontFamily="var(--font-mono)"
        fontSize={6}
        fill="var(--color-ink-soft)"
      >
        D1
      </text>

      {/* Arrow → process 2 */}
      <line x1={84} y1={40} x2={90} y2={40} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="92,40 89,38 89,42" fill="var(--color-ink)" />

      {/* Process 2 (circle) */}
      <circle cx={100} cy={40} r={8} fill="none" stroke="var(--color-ink)" strokeWidth={1.2} />
      <text
        x={100}
        y={43}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink-soft)"
      >
        2
      </text>

      {/* External entity (rectangle) — right, overlapping edge to fit */}
      <line x1={108} y1={40} x2={112} y2={40} stroke="var(--color-ink-mute)" strokeWidth={1} />

      {/* Bottom caption — tiny data-flow label to signal DFD conventions */}
      <text
        x={44}
        y={60}
        fontFamily="var(--font-mono)"
        fontSize={6}
        fill="var(--color-ink-mute)"
        textAnchor="middle"
      >
        data
      </text>
    </svg>
  );
}
