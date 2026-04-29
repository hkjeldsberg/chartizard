export function IsochroneMapThumbnail() {
  // Nested time contours around an origin — small rounded centre, large
  // irregular outer ring with a NE highway finger and a W pinch.
  // All numbers chosen to sit cleanly inside the 120x80 viewBox.
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* City frame */}
      <rect
        x={6}
        y={6}
        width={108}
        height={68}
        fill="none"
        stroke="var(--color-hairline)"
      />

      {/* 60 min — outer, irregular, NE finger, W pinch */}
      <path
        d="M 80,12 L 98,16 L 108,26 L 108,44 L 100,58 L 86,66 L 66,64 L 52,68 L 36,66 L 22,58 L 14,44 L 18,34 L 14,22 L 26,14 L 46,10 L 64,10 Z"
        fill="rgba(26,22,20,0.05)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />

      {/* 45 min */}
      <path
        d="M 72,22 L 88,24 L 96,34 L 94,46 L 84,56 L 70,58 L 54,58 L 42,54 L 30,46 L 28,36 L 32,28 L 46,22 L 60,22 Z"
        fill="rgba(26,22,20,0.08)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />

      {/* 30 min */}
      <path
        d="M 66,30 L 78,32 L 82,40 L 78,48 L 68,52 L 56,52 L 46,48 L 42,40 L 46,32 L 56,30 Z"
        fill="rgba(26,22,20,0.12)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
        strokeLinejoin="round"
      />

      {/* 10 min — small and round */}
      <circle
        cx={60}
        cy={40}
        r={6}
        fill="rgba(26,22,20,0.18)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />

      {/* Origin star */}
      <path
        d="M 60,36 L 61.2,39 L 64,39 L 61.8,41 L 63,44 L 60,42.2 L 57,44 L 58.2,41 L 56,39 L 58.8,39 Z"
        fill="var(--color-ink)"
      />
    </svg>
  );
}
