export function BlockDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Input label */}
      <text
        x={6}
        y={32}
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="var(--color-ink)"
      >
        ω*
      </text>

      {/* Wire ref → Σ */}
      <line x1={14} y1={30} x2={22} y2={30} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="24,30 21,28.5 21,31.5" fill="var(--color-ink)" />

      {/* Σ summing junction */}
      <circle
        cx={30}
        cy={30}
        r={5}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />
      <line x1={27} y1={30} x2={33} y2={30} stroke="var(--color-ink)" strokeWidth={0.9} />
      <line x1={30} y1={27} x2={30} y2={33} stroke="var(--color-ink)" strokeWidth={0.9} />

      {/* Σ → PID */}
      <line x1={35} y1={30} x2={44} y2={30} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="46,30 43,28.5 43,31.5" fill="var(--color-ink)" />

      {/* PID rectangle (controller) */}
      <rect
        x={46}
        y={22}
        width={22}
        height={16}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <text
        x={57}
        y={33}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="var(--color-ink)"
      >
        PID
      </text>

      {/* PID → motor */}
      <line x1={68} y1={30} x2={78} y2={30} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="80,30 77,28.5 77,31.5" fill="var(--color-ink)" />

      {/* Motor rectangle (plant) */}
      <rect
        x={80}
        y={22}
        width={24}
        height={16}
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1.2}
      />
      <text
        x={92}
        y={33}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="var(--color-ink)"
      >
        Motor
      </text>

      {/* Motor → output */}
      <line x1={104} y1={30} x2={112} y2={30} stroke="var(--color-ink)" strokeWidth={1} />
      <text
        x={114}
        y={32}
        fontFamily="var(--font-mono)"
        fontSize={8}
        fill="var(--color-ink)"
      >
        ω
      </text>

      {/* Feedback path: motor → sensor → Σ (bottom input) */}
      <path
        d="M 92 38 V 58 H 44 V 58"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth={1}
      />
      {/* Sensor block */}
      <rect
        x={44}
        y={52}
        width={22}
        height={12}
        fill="var(--color-surface)"
        stroke="var(--color-ink)"
        strokeWidth={1.1}
      />
      <text
        x={55}
        y={60}
        textAnchor="middle"
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink)"
      >
        Sensor
      </text>
      {/* sensor → Σ bottom: left from sensor then up */}
      <line x1={44} y1={58} x2={30} y2={58} stroke="var(--color-ink)" strokeWidth={1} />
      <line x1={30} y1={58} x2={30} y2={36} stroke="var(--color-ink)" strokeWidth={1} />
      <polygon points="30,35 28.5,38 31.5,38" fill="var(--color-ink)" />

      {/* Minus sign on Σ bottom input */}
      <text
        x={34}
        y={42}
        fontFamily="var(--font-mono)"
        fontSize={7}
        fill="var(--color-ink)"
      >
        −
      </text>
    </svg>
  );
}
