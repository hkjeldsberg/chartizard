export function EulerDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Mammals — big circle on the left */}
      <circle
        cx="42"
        cy="40"
        r="26"
        fill="var(--color-ink)"
        fillOpacity="0.16"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      {/* Reptiles — disjoint from Mammals, on the right */}
      <circle
        cx="96"
        cy="40"
        r="16"
        fill="var(--color-ink)"
        fillOpacity="0.16"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      {/* Pets — cuts across both */}
      <circle
        cx="64"
        cy="54"
        r="22"
        fill="var(--color-ink)"
        fillOpacity="0.16"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      {/* Dogs — proper subset of Mammals */}
      <circle
        cx="30"
        cy="28"
        r="8"
        fill="var(--color-ink)"
        fillOpacity="0.28"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
    </svg>
  );
}
