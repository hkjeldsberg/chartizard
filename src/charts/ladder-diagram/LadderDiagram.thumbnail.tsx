export function LadderDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Left rail (L1) */}
      <line x1={14} y1={10} x2={14} y2={72} stroke="var(--color-ink)" strokeWidth={1.6} />
      {/* Right rail (N) */}
      <line x1={106} y1={10} x2={106} y2={72} stroke="var(--color-ink)" strokeWidth={1.6} />

      {/* Rung 1 — NO contact + NC contact + coil, with parallel aux branch */}
      <line x1={14} y1={22} x2={34} y2={22} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* NO contact */}
      <line x1={34} y1={18} x2={34} y2={26} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={40} y1={18} x2={40} y2={26} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={40} y1={22} x2={54} y2={22} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* NC contact */}
      <line x1={54} y1={18} x2={54} y2={26} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={60} y1={18} x2={60} y2={26} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={53} y1={26} x2={61} y2={18} stroke="var(--color-ink)" strokeWidth={1.2} />
      {/* wire across to coil */}
      <line x1={60} y1={22} x2={82} y2={22} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* Output coil */}
      <path d="M 86 17 A 5 5 0 0 0 86 27" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <path d="M 86 17 A 5 5 0 0 1 86 27" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={91} y1={22} x2={106} y2={22} stroke="var(--color-ink)" strokeWidth={1.1} />
      {/* parallel aux branch (latch) under rung 1 */}
      <line x1={34} y1={22} x2={34} y2={34} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={34} y1={34} x2={42} y2={34} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={42} y1={30} x2={42} y2={38} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={48} y1={30} x2={48} y2={38} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={48} y1={34} x2={66} y2={34} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={66} y1={34} x2={66} y2={22} stroke="var(--color-ink)" strokeWidth={1.1} />
      <circle cx={34} cy={22} r={1.5} fill="var(--color-ink)" />
      <circle cx={66} cy={22} r={1.5} fill="var(--color-ink)" />

      {/* Rung 2 */}
      <line x1={14} y1={48} x2={40} y2={48} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={40} y1={44} x2={40} y2={52} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={46} y1={44} x2={46} y2={52} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={46} y1={48} x2={82} y2={48} stroke="var(--color-ink)" strokeWidth={1.1} />
      <path d="M 86 43 A 5 5 0 0 0 86 53" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <path d="M 86 43 A 5 5 0 0 1 86 53" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={91} y1={48} x2={106} y2={48} stroke="var(--color-ink)" strokeWidth={1.1} />

      {/* Rung 3 */}
      <line x1={14} y1={66} x2={40} y2={66} stroke="var(--color-ink)" strokeWidth={1.1} />
      <line x1={40} y1={62} x2={40} y2={70} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={46} y1={62} x2={46} y2={70} stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={46} y1={66} x2={82} y2={66} stroke="var(--color-ink)" strokeWidth={1.1} />
      <path d="M 86 61 A 5 5 0 0 0 86 71" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <path d="M 86 61 A 5 5 0 0 1 86 71" fill="none" stroke="var(--color-ink)" strokeWidth={1.3} />
      <line x1={91} y1={66} x2={106} y2={66} stroke="var(--color-ink)" strokeWidth={1.1} />
    </svg>
  );
}
