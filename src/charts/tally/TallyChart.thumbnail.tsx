export function TallyThumbnail() {
  // Four rows of tally marks — each row is one or more five-groups plus a
  // short leftover. The diagonal fifth stroke is the visual hook.
  const rows: Array<{ groups: number; loose: number }> = [
    { groups: 3, loose: 2 }, // 17
    { groups: 2, loose: 1 }, // 11
    { groups: 1, loose: 3 }, // 8
    { groups: 1, loose: 0 }, // 5
  ];
  const left = 14;
  const top = 14;
  const rowGap = 15;
  const tickH = 10;
  const tickSpace = 3;
  const groupW = tickSpace * 3;
  const groupPad = 6;

  function fiveGroup(x: number, y: number, key: string) {
    const top = y - tickH / 2;
    const bot = y + tickH / 2;
    return (
      <g key={key}>
        {[0, 1, 2, 3].map((k) => (
          <line
            key={k}
            x1={x + k * tickSpace}
            x2={x + k * tickSpace}
            y1={top}
            y2={bot}
            stroke="var(--color-ink)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
        <line
          x1={x - 1}
          x2={x + groupW + 1}
          y1={bot}
          y2={top}
          stroke="var(--color-ink)"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
      </g>
    );
  }

  function looseMarks(x: number, y: number, count: number, key: string) {
    const top = y - tickH / 2;
    const bot = y + tickH / 2;
    return (
      <g key={key}>
        {Array.from({ length: count }).map((_, k) => (
          <line
            key={k}
            x1={x + k * tickSpace}
            x2={x + k * tickSpace}
            y1={top}
            y2={bot}
            stroke="var(--color-ink)"
            strokeWidth="1.2"
            strokeLinecap="round"
          />
        ))}
      </g>
    );
  }

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {rows.map((r, i) => {
        const y = top + i * rowGap;
        let x = left;
        const parts: React.ReactNode[] = [];
        for (let g = 0; g < r.groups; g++) {
          parts.push(fiveGroup(x, y, `r${i}-g${g}`));
          x += groupW;
          if (g < r.groups - 1) x += groupPad;
        }
        if (r.loose > 0) {
          if (r.groups > 0) x += groupPad;
          parts.push(looseMarks(x, y, r.loose, `r${i}-loose`));
        }
        return <g key={i}>{parts}</g>;
      })}
    </svg>
  );
}
