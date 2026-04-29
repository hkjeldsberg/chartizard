export function UmlObjectDiagramThumbnail() {
  // Silhouette: two-compartment object boxes with underlined instance:Class
  // labels, connected by solid lines (no arrowheads). A shared-reference
  // structure — two lower boxes both linking to a top-right box — is what
  // the object diagram's silhouette is uniquely about.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Links — drawn first so boxes paint on top */}
      <line x1={30} y1={28} x2={56} y2={28} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={38} y1={34} x2={38} y2={52} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={60} y1={34} x2={60} y2={52} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={42} y1={58} x2={86} y2={34} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={64} y1={58} x2={86} y2={34} stroke="var(--color-ink)" strokeWidth={1} />

      {/* Top-left box */}
      <rect x={8} y={14} width={22} height={28} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={8} y1={22} x2={30} y2={22} stroke="var(--color-ink)" strokeWidth={1} />
      {/* Underline for instance label */}
      <line x1={12} y1={20} x2={26} y2={20} stroke="var(--color-ink)" strokeWidth={0.9} />
      {/* Attribute rows */}
      <line x1={11} y1={28} x2={27} y2={28} stroke="var(--color-hairline)" />
      <line x1={11} y1={34} x2={25} y2={34} stroke="var(--color-hairline)" />

      {/* Top-middle box */}
      <rect x={38} y={14} width={22} height={28} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={38} y1={22} x2={60} y2={22} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={42} y1={20} x2={56} y2={20} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={41} y1={28} x2={57} y2={28} stroke="var(--color-hairline)" />
      <line x1={41} y1={34} x2={55} y2={34} stroke="var(--color-hairline)" />

      {/* Top-right box — shared Product */}
      <rect x={76} y={14} width={22} height={28} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={76} y1={22} x2={98} y2={22} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={80} y1={20} x2={94} y2={20} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={79} y1={28} x2={95} y2={28} stroke="var(--color-hairline)" />
      <line x1={79} y1={34} x2={93} y2={34} stroke="var(--color-hairline)" />

      {/* Bottom-left line-item */}
      <rect x={28} y={52} width={22} height={22} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={28} y1={60} x2={50} y2={60} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={32} y1={58} x2={46} y2={58} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={31} y1={66} x2={47} y2={66} stroke="var(--color-hairline)" />

      {/* Bottom-right line-item */}
      <rect x={56} y={52} width={22} height={22} fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth={1.2} />
      <line x1={56} y1={60} x2={78} y2={60} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={60} y1={58} x2={74} y2={58} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={59} y1={66} x2={75} y2={66} stroke="var(--color-hairline)" />
    </svg>
  );
}
