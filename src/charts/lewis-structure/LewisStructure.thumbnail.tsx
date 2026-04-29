export function LewisStructureThumbnail() {
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* H₂O left panel */}
      {/* O atom */}
      <text x="30" y="34" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="13" fontWeight="600"
        fill="var(--color-ink)">O</text>
      {/* O-H bonds */}
      <line x1="30" y1="34" x2="18" y2="52" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="30" y1="34" x2="42" y2="52" stroke="var(--color-ink)" strokeWidth="1.5" strokeLinecap="round" />
      {/* H atoms */}
      <text x="18" y="54" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="11"
        fill="var(--color-ink)">H</text>
      <text x="42" y="54" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="11"
        fill="var(--color-ink)">H</text>
      {/* Lone pairs on O (4 dots) */}
      <circle cx="23" cy="27" r="1.4" fill="var(--color-ink)" />
      <circle cx="28" cy="25" r="1.4" fill="var(--color-ink)" />
      <circle cx="32" cy="25" r="1.4" fill="var(--color-ink)" />
      <circle cx="37" cy="27" r="1.4" fill="var(--color-ink)" />
      {/* H₂O label */}
      <text x="30" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9"
        fill="var(--color-ink-mute)">H₂O</text>

      {/* Divider */}
      <line x1="62" y1="12" x2="62" y2="68" stroke="var(--color-hairline)" strokeWidth="1" strokeDasharray="3 3" />

      {/* CO₂ right panel */}
      {/* O=C=O on one line */}
      {/* Left double bond */}
      <line x1="72" y1="32" x2="83" y2="32" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="72" y1="36" x2="83" y2="36" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
      {/* Right double bond */}
      <line x1="89" y1="32" x2="100" y2="32" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="89" y1="36" x2="100" y2="36" stroke="var(--color-ink)" strokeWidth="1.4" strokeLinecap="round" />
      {/* C atom */}
      <text x="86" y="34" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="11" fontWeight="600"
        fill="var(--color-ink)">C</text>
      {/* O atoms */}
      <text x="69" y="34" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="11" fontWeight="600"
        fill="var(--color-ink)">O</text>
      <text x="103" y="34" textAnchor="middle" dominantBaseline="central"
        fontFamily="monospace" fontSize="11" fontWeight="600"
        fill="var(--color-ink)">O</text>
      {/* Lone pairs on left O */}
      <circle cx="66" cy="28" r="1.3" fill="var(--color-ink)" />
      <circle cx="63" cy="28" r="1.3" fill="var(--color-ink)" />
      <circle cx="66" cy="40" r="1.3" fill="var(--color-ink)" />
      <circle cx="63" cy="40" r="1.3" fill="var(--color-ink)" />
      {/* Lone pairs on right O */}
      <circle cx="106" cy="28" r="1.3" fill="var(--color-ink)" />
      <circle cx="109" cy="28" r="1.3" fill="var(--color-ink)" />
      <circle cx="106" cy="40" r="1.3" fill="var(--color-ink)" />
      <circle cx="109" cy="40" r="1.3" fill="var(--color-ink)" />
      {/* CO₂ label */}
      <text x="86" y="70" textAnchor="middle" fontFamily="monospace" fontSize="9"
        fill="var(--color-ink-mute)">CO₂</text>
    </svg>
  );
}
