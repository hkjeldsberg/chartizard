export function MovingAverageThumbnail() {
  // Noisy raw line + two smoother MAs at a glance.
  const raw =
    "M10,56 L16,48 L22,54 L28,44 L34,50 L40,38 L46,46 L52,34 L58,42 L64,28 L70,36 L76,24 L82,30 L88,20 L94,26 L100,18 L106,22 L112,16";
  const ma20 =
    "M22,52 L32,48 L42,44 L52,40 L62,36 L72,32 L82,28 L92,24 L102,20 L110,18";
  const ma50 = "M36,50 L48,46 L60,42 L72,38 L84,34 L96,30 L108,26";

  return (
    <svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" className="h-full w-full">
      <line x1="10" y1="68" x2="114" y2="68" stroke="var(--color-hairline)" />
      <line x1="10" y1="10" x2="10" y2="68" stroke="var(--color-hairline)" />
      {/* Raw price — thin, low-opacity ink. */}
      <path d={raw} fill="none" stroke="var(--color-ink)" strokeWidth="1" strokeOpacity="0.45" />
      {/* MA-50 — warm red, smooth long window. */}
      <path d={ma50} fill="none" stroke="#a55a4a" strokeWidth="1.4" />
      {/* MA-20 — teal, faster window. */}
      <path d={ma20} fill="none" stroke="#4a6a68" strokeWidth="1.4" />
      {/* Golden-cross ring at the point the two MAs meet. */}
      <circle cx="82" cy="28" r="3.2" fill="none" stroke="var(--color-ink)" strokeWidth="0.8" strokeDasharray="1.2 1.2" />
    </svg>
  );
}
