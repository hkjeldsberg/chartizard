export function UmlClassThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Left class box — three compartments */}
      <rect
        x={8}
        y={14}
        width={36}
        height={52}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      {/* Header bar */}
      <line x1={8} y1={24} x2={44} y2={24} stroke="var(--color-ink)" strokeWidth={1} />
      {/* Field / method divider */}
      <line x1={8} y1={46} x2={44} y2={46} stroke="var(--color-ink)" strokeWidth={1} />
      {/* Field lines */}
      <line x1={12} y1={30} x2={40} y2={30} stroke="var(--color-hairline)" />
      <line x1={12} y1={36} x2={38} y2={36} stroke="var(--color-hairline)" />
      {/* Method lines */}
      <line x1={12} y1={52} x2={40} y2={52} stroke="var(--color-hairline)" />
      <line x1={12} y1={58} x2={36} y2={58} stroke="var(--color-hairline)" />

      {/* Right class box */}
      <rect
        x={76}
        y={14}
        width={36}
        height={52}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <line x1={76} y1={24} x2={112} y2={24} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={76} y1={46} x2={112} y2={46} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={80} y1={30} x2={108} y2={30} stroke="var(--color-hairline)" />
      <line x1={80} y1={36} x2={106} y2={36} stroke="var(--color-hairline)" />
      <line x1={80} y1={52} x2={108} y2={52} stroke="var(--color-hairline)" />
      <line x1={80} y1={58} x2={104} y2={58} stroke="var(--color-hairline)" />

      {/* Connector with filled diamond (composition) at left end and open arrow at right */}
      <polygon
        points="44,40 50,36 56,40 50,44"
        fill="var(--color-ink)"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      <line x1={56} y1={40} x2={72} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />
      {/* Open arrowhead */}
      <polyline
        points="70,36 76,40 70,44"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
    </svg>
  );
}
