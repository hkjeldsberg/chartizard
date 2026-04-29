export function StripChartThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Paper-tape frame */}
      <rect
        x="8"
        y="14"
        width="104"
        height="52"
        fill="none"
        stroke="var(--color-hairline)"
        strokeWidth="1"
      />
      {/* Fine clinical grid — bold every 5 */}
      {[20, 32, 44, 56].map((y) => (
        <line
          key={`h-${y}`}
          x1="8"
          x2="112"
          y1={y}
          y2={y}
          stroke="var(--color-hairline)"
          strokeWidth="0.4"
          opacity="0.55"
        />
      ))}
      {[20, 32, 44, 56, 68, 80, 92, 104].map((x) => (
        <line
          key={`v-${x}`}
          x1={x}
          x2={x}
          y1="14"
          y2="66"
          stroke="var(--color-hairline)"
          strokeWidth="0.4"
          opacity="0.55"
        />
      ))}
      {/* Isoelectric baseline */}
      <line
        x1="8"
        x2="112"
        y1="48"
        y2="48"
        stroke="var(--color-ink-mute)"
        strokeDasharray="2 2"
        strokeWidth="0.6"
      />
      {/* Three rolling ECG cycles: P, QRS spike, T */}
      <path
        d="M 8 48
           L 16 48 Q 22 44 28 48
           L 32 48 L 34 50 L 36 20 L 38 54 L 40 48
           Q 46 42 52 48
           L 56 48 Q 58 48 60 48
           L 62 50 L 64 22 L 66 54 L 68 48
           Q 74 42 80 48
           L 82 48 L 84 50 L 86 24 L 88 54 L 90 48
           Q 96 43 102 48
           L 112 48"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Leading-edge marker (right) */}
      <line
        x1="112"
        x2="112"
        y1="14"
        y2="66"
        stroke="var(--color-ink)"
        strokeWidth="1"
      />
      {/* Direction arrow */}
      <polygon
        points="111,40 106,44 111,48"
        fill="var(--color-ink)"
      />
      {/* Tiny time caption */}
      <text
        x="10"
        y="76"
        fontFamily="var(--font-mono)"
        fontSize="5"
        fill="var(--color-ink-mute)"
      >
        25 mm/s
      </text>
    </svg>
  );
}
