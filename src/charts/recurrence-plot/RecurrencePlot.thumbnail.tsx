export function RecurrencePlotThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Plot frame */}
      <rect x="10" y="8" width="100" height="68" fill="none" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Background tint */}
      <rect x="10" y="8" width="100" height="68" fill="var(--color-ink)" fillOpacity="0.04" />

      {/* Periodic region (top-left ~half) — parallel diagonal lines */}
      {/* Sub-diagonals in upper-left quadrant (i < 40, j < 40, offset lines) */}
      {[-8, -4, 0, 4, 8, 12, 16].map((offset, idx) => {
        const x1 = 10 + Math.max(0, offset);
        const y1 = 8 + Math.max(0, -offset);
        const x2 = 10 + Math.min(40, 40 + offset);
        const y2 = 8 + Math.min(40, 40 - offset);
        return (
          <line
            key={idx}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="var(--color-ink)"
            strokeWidth="1.2"
            strokeOpacity="0.7"
            clipPath="url(#periodic-clip)"
          />
        );
      })}
      <clipPath id="periodic-clip">
        <rect x="10" y="8" width="50" height="38" />
      </clipPath>

      {/* Chaotic region (bottom-right ~half) — scattered dots */}
      {[
        [70,52],[75,60],[78,50],[82,65],[86,55],[90,48],[94,62],[98,55],
        [72,58],[80,46],[84,70],[88,52],[92,68],[96,44],[74,66],[76,44],
        [100,58],[68,56],[104,50],[106,64],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1.2" fill="var(--color-ink)" fillOpacity="0.65" />
      ))}

      {/* Main diagonal — always solid */}
      <line
        x1="10" y1="8" x2="110" y2="76"
        stroke="var(--color-ink)"
        strokeWidth="1.5"
        strokeOpacity="0.9"
      />

      {/* Regime boundary lines */}
      <line
        x1="60" y1="8" x2="60" y2="76"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.5"
      />
      <line
        x1="10" y1="46" x2="110" y2="46"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.5"
      />
    </svg>
  );
}
