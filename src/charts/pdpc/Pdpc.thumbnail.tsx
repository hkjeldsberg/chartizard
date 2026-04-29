export function PdpcThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Root / goal node */}
      <rect x="36" y="4" width="48" height="12" rx="3" fill="none" stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="60" y="10.5" textAnchor="middle" dominantBaseline="central" fontSize="5" fontFamily="sans-serif" fill="var(--color-ink)">Goal</text>

      {/* Lines from root to tasks */}
      <line x1="60" y1="16" x2="24" y2="28" stroke="var(--color-ink-mute)" strokeWidth="0.7" />
      <line x1="60" y1="16" x2="60" y2="28" stroke="var(--color-ink-mute)" strokeWidth="0.7" />
      <line x1="60" y1="16" x2="96" y2="28" stroke="var(--color-ink-mute)" strokeWidth="0.7" />

      {/* Task nodes */}
      <rect x="8" y="28" width="32" height="10" rx="2.5" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <rect x="44" y="28" width="32" height="10" rx="2.5" fill="none" stroke="var(--color-ink)" strokeWidth="1" />
      <rect x="80" y="28" width="32" height="10" rx="2.5" fill="none" stroke="var(--color-ink)" strokeWidth="1" />

      {/* Lines from tasks to problems */}
      {/* Task 1 → 2 problems */}
      <line x1="17" y1="38" x2="14" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      <line x1="31" y1="38" x2="34" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      {/* Task 2 → 2 problems */}
      <line x1="53" y1="38" x2="50" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      <line x1="67" y1="38" x2="70" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      {/* Task 3 → 2 problems */}
      <line x1="89" y1="38" x2="86" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      <line x1="103" y1="38" x2="106" y2="49" stroke="var(--color-ink-mute)" strokeWidth="0.6" />

      {/* Problem nodes (dashed rectangles) */}
      {[7, 27, 43, 63, 79, 99].map((x, i) => (
        <rect key={i} x={x} y="49" width="14" height="9" rx="2" fill="none" stroke="var(--color-ink)" strokeWidth="0.7" strokeDasharray="2 1.5" />
      ))}

      {/* Lines from problems to countermeasures */}
      {[14, 34, 50, 70, 86, 106].map((x, i) => (
        <line key={i} x1={x} y1="58" x2={x} y2="66" stroke="var(--color-ink-mute)" strokeWidth="0.6" />
      ))}

      {/* Countermeasure nodes with ○ or × marks */}
      {/* feasible: 0, 2, 4 → ○ ; infeasible: 1, 3, 5 → × */}
      {[
        { x: 7, feasible: true },
        { x: 27, feasible: false },
        { x: 43, feasible: true },
        { x: 63, feasible: false },
        { x: 79, feasible: true },
        { x: 99, feasible: true },
      ].map(({ x, feasible }, i) => (
        <g key={i}>
          <rect x={x} y="66" width="14" height="9" rx="2" fill="none" stroke={feasible ? "var(--color-ink)" : "var(--color-ink-mute)"} strokeWidth="0.7" />
          {feasible ? (
            <circle cx={x + 7} cy="70.5" r="2.2" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" />
          ) : (
            <g>
              <line x1={x + 5} y1="68.8" x2={x + 9} y2="72.2" stroke="var(--color-ink-mute)" strokeWidth="0.8" />
              <line x1={x + 9} y1="68.8" x2={x + 5} y2="72.2" stroke="var(--color-ink-mute)" strokeWidth="0.8" />
            </g>
          )}
        </g>
      ))}
    </svg>
  );
}
