export function InfluenceDiagramThumbnail() {
  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      <defs>
        <marker
          id="id-thumb-arrow"
          markerWidth="5"
          markerHeight="5"
          refX="4"
          refY="2.5"
          orient="auto"
        >
          <polygon points="0,0 5,2.5 0,5" fill="var(--color-ink)" opacity="0.7" />
        </marker>
      </defs>

      {/* Arrows (behind nodes) */}
      {/* Market size → Profit */}
      <path d="M 32,20 Q 68,20 86,38" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.6" markerEnd="url(#id-thumb-arrow)" />
      {/* Product quality → Profit */}
      <path d="M 32,60 Q 68,60 86,52" fill="none" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.6" markerEnd="url(#id-thumb-arrow)" />
      {/* Launch → Profit */}
      <line x1="44" y1="40" x2="78" y2="44" stroke="var(--color-ink)" strokeWidth="1"
        opacity="0.6" markerEnd="url(#id-thumb-arrow)" />
      {/* Market size → Launch (info) */}
      <path d="M 26,27 Q 26,34 26,34" fill="none" stroke="var(--color-ink)" strokeWidth="0.8"
        opacity="0.5" markerEnd="url(#id-thumb-arrow)" />
      {/* Quality → Launch (info) */}
      <path d="M 26,53 Q 26,48 26,47" fill="none" stroke="var(--color-ink)" strokeWidth="0.8"
        opacity="0.5" markerEnd="url(#id-thumb-arrow)" />

      {/* Decision node — rectangle */}
      <rect x="12" y="34" width="28" height="12" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="26" y="42" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="5" fill="var(--color-ink)">DECISION</text>

      {/* Chance node (Market size) — ellipse */}
      <ellipse cx="26" cy="20" rx="14" ry="6" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="26" y="22" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4.5" fill="var(--color-ink)">CHANCE</text>

      {/* Chance node (Quality) — ellipse */}
      <ellipse cx="26" cy="60" rx="14" ry="6" fill="var(--color-surface)"
        stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="26" y="62" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4.5" fill="var(--color-ink)">CHANCE</text>

      {/* Value node — hexagon */}
      <path d="M 79,40 L 82,35 L 90,35 L 93,40 L 90,45 L 82,45 Z"
        fill="var(--color-surface)" stroke="var(--color-ink)" strokeWidth="1.2" />
      <text x="86" y="42" textAnchor="middle" fontFamily="var(--font-mono)"
        fontSize="4.5" fill="var(--color-ink)">VALUE</text>
    </svg>
  );
}
