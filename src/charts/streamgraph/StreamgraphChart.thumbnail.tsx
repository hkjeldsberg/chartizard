export function StreamgraphThumbnail() {
  // A zero-centred cluster of smoothly-flowing bands. No axes — thumbnails
  // are silhouettes, and the streamgraph's silhouette is the flow itself.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Bottom-most band */}
      <path
        d="M8 56 C 24 58, 40 60, 60 58 C 80 56, 96 54, 112 52 L 112 62 C 96 64, 80 66, 60 64 C 40 62, 24 60, 8 58 Z"
        fill="var(--color-ink)"
        opacity="0.35"
      />
      {/* Mid-lower band */}
      <path
        d="M8 46 C 24 48, 40 52, 60 50 C 80 48, 96 46, 112 44 L 112 54 C 96 56, 80 58, 60 56 C 40 54, 24 52, 8 50 Z"
        fill="var(--color-ink)"
        opacity="0.55"
      />
      {/* Central band — widens left→right (hip-hop motif) */}
      <path
        d="M8 36 C 24 34, 40 32, 60 30 C 80 28, 96 26, 112 24 L 112 46 C 96 48, 80 48, 60 46 C 40 44, 24 42, 8 40 Z"
        fill="var(--color-ink)"
        opacity="0.75"
      />
      {/* Upper band — narrows (pop motif) */}
      <path
        d="M8 22 C 24 24, 40 26, 60 28 C 80 30, 96 32, 112 34 L 112 28 C 96 26, 80 24, 60 22 C 40 20, 24 18, 8 18 Z"
        fill="var(--color-ink)"
        opacity="0.5"
      />
      {/* Top band */}
      <path
        d="M8 14 C 24 14, 40 14, 60 16 C 80 18, 96 20, 112 22 L 112 28 C 96 26, 80 24, 60 22 C 40 20, 24 20, 8 20 Z"
        fill="var(--color-ink)"
        opacity="0.3"
      />
    </svg>
  );
}
