export function UmlDeploymentDiagramThumbnail() {
  // Silhouette: three 3D-box nodes connected by two labelled horizontal
  // communication paths. Artifacts shown as tiny folded-page icons inside.
  const DEPTH = 4;
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Communication paths drawn first so node boxes occlude them */}
      <line x1={34} y1={42} x2={48} y2={42} stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={82} y1={42} x2={96} y2={42} stroke="var(--color-ink)" strokeWidth={1.2} />

      {/* Left node — back face */}
      <rect
        x={10 + DEPTH}
        y={22 - DEPTH}
        width={24}
        height={40}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Left node — front face */}
      <rect
        x={10}
        y={22}
        width={24}
        height={40}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Depth lines */}
      <line x1={10} y1={22} x2={10 + DEPTH} y2={22 - DEPTH} stroke="var(--color-ink)" />
      <line x1={34} y1={22} x2={34 + DEPTH} y2={22 - DEPTH} stroke="var(--color-ink)" />
      <line x1={34} y1={62} x2={34 + DEPTH} y2={62 - DEPTH} stroke="var(--color-ink)" />
      {/* Artifact */}
      <rect x={14} y={46} width={16} height={10} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Middle node */}
      <rect
        x={48 + DEPTH}
        y={18 - DEPTH}
        width={28}
        height={48}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <rect
        x={48}
        y={18}
        width={28}
        height={48}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <line x1={48} y1={18} x2={48 + DEPTH} y2={18 - DEPTH} stroke="var(--color-ink)" />
      <line x1={76} y1={18} x2={76 + DEPTH} y2={18 - DEPTH} stroke="var(--color-ink)" />
      <line x1={76} y1={66} x2={76 + DEPTH} y2={66 - DEPTH} stroke="var(--color-ink)" />
      {/* Two stacked artifacts */}
      <rect x={52} y={42} width={20} height={8} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={52} y={54} width={20} height={8} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Right node */}
      <rect
        x={96 + DEPTH}
        y={22 - DEPTH}
        width={20}
        height={40}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <rect
        x={96}
        y={22}
        width={20}
        height={40}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <line x1={96} y1={22} x2={96 + DEPTH} y2={22 - DEPTH} stroke="var(--color-ink)" />
      <line x1={116} y1={22} x2={116 + DEPTH} y2={22 - DEPTH} stroke="var(--color-ink)" />
      <line x1={116} y1={62} x2={116 + DEPTH} y2={62 - DEPTH} stroke="var(--color-ink)" />
      <rect x={100} y={46} width={12} height={10} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
    </svg>
  );
}
