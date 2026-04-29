export function VowelThumbnail() {
  // Simplified IPA vowel trapezoid at 120×80 viewBox
  // Front (left) to back (right), close (top) to open (bottom)
  // x = F2 reversed: front=left, back=right
  // y = F1 reversed: close=top, open=bottom
  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      {/* IPA trapezoid outline */}
      <polygon
        points="18,12 28,65 90,62 96,16"
        fill="none"
        stroke="var(--color-ink)"
        strokeWidth="1"
        strokeOpacity="0.35"
        strokeDasharray="3 2"
      />
      {/* Axis labels */}
      <text x="9" y="11" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)" textAnchor="middle">F</text>
      <text x="14" y="74" fontFamily="monospace" fontSize="6" fill="var(--color-ink-mute)" textAnchor="middle">B</text>

      {/* Vowel dots — unrounded (open circle) at front positions */}
      {/* /i/ — close front unrounded */}
      <circle cx="18" cy="12" r="3.5" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1.1" />
      <text x="24" y="13" fontFamily="serif" fontSize="8" fill="var(--color-ink)" dominantBaseline="middle">i</text>

      {/* /e/ — close-mid front unrounded */}
      <circle cx="21" cy="31" r="3" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="26" y="32" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle">e</text>

      {/* /ɛ/ — open-mid front unrounded */}
      <circle cx="23" cy="48" r="3" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="28" y="49" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle">ɛ</text>

      {/* /a/ — open front */}
      <circle cx="28" cy="65" r="3" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="33" y="66" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle">a</text>

      {/* /ə/ — schwa, central mid */}
      <circle cx="57" cy="42" r="3" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" opacity="0.7" />
      <text x="62" y="43" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle" opacity="0.7">ə</text>

      {/* /u/ — close back rounded (filled) */}
      <circle cx="96" cy="16" r="3.5" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="1.1" />
      <text x="88" y="15" fontFamily="serif" fontSize="8" fill="var(--color-ink)" dominantBaseline="middle" textAnchor="end">u</text>

      {/* /o/ — close-mid back rounded (filled) */}
      <circle cx="94" cy="36" r="3" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="88" y="36" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle" textAnchor="end">o</text>

      {/* /ɑ/ — open back unrounded */}
      <circle cx="90" cy="62" r="3" fill="var(--color-page)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="84" y="62" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle" textAnchor="end">ɑ</text>

      {/* Pair line example: /i/–/y/ */}
      <line x1="18" y1="12" x2="26" y2="14" stroke="var(--color-ink)" strokeWidth="0.6" strokeDasharray="1.5 1.5" opacity="0.5" />
      {/* /y/ — close front rounded */}
      <circle cx="30" cy="14" r="3" fill="var(--color-ink)" stroke="var(--color-ink)" strokeWidth="1" />
      <text x="35" y="15" fontFamily="serif" fontSize="7" fill="var(--color-ink)" dominantBaseline="middle">y</text>
    </svg>
  );
}
