export function AffinityDiagramThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* Meta-group dashed outline (top two clusters) */}
      <rect x="4" y="4" width="55" height="34" rx="3" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="3 2" opacity="0.6" />

      {/* Cluster header 1 */}
      <rect x="6" y="6" width="24" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.85" />
      {/* Stickies cluster 1 */}
      <rect x="6" y="15" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="18" y="15" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="6" y="24" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="18" y="24" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />

      {/* Cluster header 2 */}
      <rect x="35" y="6" width="22" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.85" />
      {/* Stickies cluster 2 */}
      <rect x="35" y="15" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="47" y="15" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="35" y="24" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="47" y="24" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />

      {/* Meta-group label */}
      <text x="31" y="40" textAnchor="middle" fontSize="4" fontFamily="var(--font-mono)" fill="var(--color-ink)" opacity="0.55">Getting into the product</text>

      {/* Cluster header 3 — standalone left */}
      <rect x="4" y="46" width="24" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.7" />
      <rect x="4" y="55" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="16" y="55" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="4" y="64" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />

      {/* Cluster header 4 — standalone right-mid */}
      <rect x="35" y="46" width="22" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.7" />
      <rect x="35" y="55" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="47" y="55" width="10" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />

      {/* Cluster header 5 — performance (bottom centre) */}
      <rect x="64" y="4" width="50" height="7" rx="1.5" fill="var(--color-ink)" opacity="0.6" />
      <rect x="64" y="13" width="22" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="90" y="13" width="22" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="64" y="22" width="22" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
      <rect x="90" y="22" width="22" height="7" rx="1" fill="var(--color-surface)" stroke="var(--color-hairline)" strokeWidth="0.6" />
    </svg>
  );
}
