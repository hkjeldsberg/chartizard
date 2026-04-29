export function BifurcationDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {/* Axes */}
      <line x1="12" y1="68" x2="112" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />
      <line x1="12" y1="10" x2="12" y2="68" stroke="var(--color-hairline)" strokeWidth="1" />

      {/* Period-1 region: single horizontal band (r < 3, ~x=12..52) */}
      <line x1="12" y1="35" x2="52" y2="35" stroke="var(--color-ink)" strokeWidth="1.2" strokeOpacity="0.8" />

      {/* First bifurcation at r=3 (~x=52): splits into 2 lines */}
      <line x1="52" y1="52" x2="72" y2="55" stroke="var(--color-ink)" strokeWidth="1.1" strokeOpacity="0.75" />
      <line x1="52" y1="18" x2="72" y2="16" stroke="var(--color-ink)" strokeWidth="1.1" strokeOpacity="0.75" />

      {/* Second bifurcation (~x=72): 4 lines */}
      <line x1="72" y1="55" x2="82" y2="58" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.65" />
      <line x1="72" y1="55" x2="82" y2="50" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.65" />
      <line x1="72" y1="16" x2="82" y2="14" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.65" />
      <line x1="72" y1="16" x2="82" y2="20" stroke="var(--color-ink)" strokeWidth="0.9" strokeOpacity="0.65" />

      {/* Chaotic cloud (r > ~3.57, x=86..112) — scattered dots */}
      {[
        [88,12],[89,62],[90,32],[91,50],[92,22],[93,58],[94,40],[95,15],
        [96,68],[97,28],[98,55],[99,18],[100,44],[101,65],[102,30],[103,10],
        [104,52],[105,38],[106,66],[107,24],[108,46],[109,14],[110,60],[111,35],
      ].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="1" fill="var(--color-ink)" fillOpacity="0.5" />
      ))}

      {/* Chaos onset dashed line (~x=86) */}
      <line
        x1="86" y1="10" x2="86" y2="68"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.4"
      />

      {/* First bifurcation dashed line (~x=52) */}
      <line
        x1="52" y1="10" x2="52" y2="68"
        stroke="var(--color-ink)"
        strokeWidth="0.6"
        strokeDasharray="2 2"
        strokeOpacity="0.35"
      />
    </svg>
  );
}
