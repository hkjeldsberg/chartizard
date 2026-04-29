export function UmlComponentDiagramThumbnail() {
  // Silhouette: two component rectangles (stereotype label + 2-box icon) with a
  // lollipop provided interface on the right component kissing a socket
  // required interface on the left component. The lollipop-socket pair is the
  // chart family's signature.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Left component rectangle */}
      <rect
        x={8}
        y={18}
        width={40}
        height={44}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
      {/* Left stereotype bar */}
      <line x1={12} y1={27} x2={32} y2={27} stroke="var(--color-hairline)" />
      {/* Left component icon (2-box glyph) top-right */}
      <rect x={38} y={22} width={8} height={5} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={35} y={23} width={3} height={1.6} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={35} y={25.4} width={3} height={1.6} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Right component rectangle */}
      <rect
        x={72}
        y={18}
        width={40}
        height={44}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />
      <line x1={76} y1={27} x2={96} y2={27} stroke="var(--color-hairline)" />
      <rect x={102} y={22} width={8} height={5} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={99} y={23} width={3} height={1.6} fill="none" stroke="var(--color-ink)" strokeWidth={1} />
      <rect x={99} y={25.4} width={3} height={1.6} fill="none" stroke="var(--color-ink)" strokeWidth={1} />

      {/* Socket on left component's right edge */}
      <line x1={48} y1={40} x2={56} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />
      <path
        d="M 56 34.6 A 5.4 5.4 0 0 1 56 45.4"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.3}
      />

      {/* Lollipop on right component's left edge */}
      <line x1={72} y1={40} x2={64} y2={40} stroke="var(--color-ink)" strokeWidth={1.2} />
      <circle cx={60.6} cy={40} r={3.4} fill="var(--color-ink)" />
    </svg>
  );
}
