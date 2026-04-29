export function VennDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <circle
        cx="48"
        cy="34"
        r="22"
        fill="var(--color-ink)"
        fillOpacity="0.22"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      <circle
        cx="72"
        cy="34"
        r="22"
        fill="var(--color-ink)"
        fillOpacity="0.22"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
      <circle
        cx="60"
        cy="52"
        r="22"
        fill="var(--color-ink)"
        fillOpacity="0.22"
        stroke="var(--color-ink)"
        strokeWidth="1.2"
      />
    </svg>
  );
}
