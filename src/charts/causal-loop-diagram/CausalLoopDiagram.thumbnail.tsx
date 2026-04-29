export function CausalLoopDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <marker
          id="cld-thumb-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0,0 5,2.5 0,5" fill="var(--color-ink)" opacity="0.7" />
        </marker>
      </defs>

      {/* R1 loop: Population ↔ Births (left side) */}
      {/* Population → Births */}
      <path d="M 18,28 Q 8,45 18,56" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />
      {/* Births → Population */}
      <path d="M 30,56 Q 40,45 30,28" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />

      {/* B1 loop: Population → Resource use → Resources → Food → Births */}
      {/* Population → Resource use (top arc) */}
      <path d="M 34,23 Q 62,12 82,24" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />
      {/* Resource use → Resources */}
      <path d="M 92,28 Q 98,40 92,52" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />
      {/* Resources → Food */}
      <path d="M 84,58 Q 68,66 52,62" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />
      {/* Food → Births */}
      <path d="M 44,64 Q 38,64 36,60" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.7" markerEnd="url(#cld-thumb-arrow)" />

      {/* Nodes */}
      <ellipse cx="24" cy="22" rx="13" ry="5" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1" />
      <text x="24" y="24" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4" fill="var(--color-ink)">Population</text>

      <ellipse cx="24" cy="60" rx="10" ry="5" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1" />
      <text x="24" y="62" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4" fill="var(--color-ink)">Births</text>

      <ellipse cx="86" cy="24" rx="13" ry="5" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1" />
      <text x="86" y="26" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4" fill="var(--color-ink)">Res. use</text>

      <ellipse cx="95" cy="56" rx="12" ry="5" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1" />
      <text x="95" y="58" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4" fill="var(--color-ink)">Resources</text>

      <ellipse cx="47" cy="68" rx="12" ry="5" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1" />
      <text x="47" y="70" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4" fill="var(--color-ink)">Food</text>

      {/* Loop labels */}
      <circle cx="11" cy="42" r="6" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="0.8" />
      <text x="11" y="45" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="5" fontWeight="700" fill="var(--color-ink)">R1</text>

      <circle cx="62" cy="44" r="6" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="0.8" />
      <text x="62" y="47" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="5" fontWeight="700" fill="var(--color-ink)">B1</text>
    </svg>
  );
}
