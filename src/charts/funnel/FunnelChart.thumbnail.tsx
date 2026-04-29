export function FunnelThumbnail() {
  // Five stages drawn as nested trapezoids centred on x=60.
  // Widths chosen to match the proportional narrowing of the live chart
  // (10000 / 6400 / 2100 / 1050 / 520 of a 10000-wide top).
  const stages = [
    { top: 90, bot: 58, y0: 14, y1: 26 }, // Visits → Product view
    { top: 58, bot: 24, y0: 26, y1: 38 }, // Product view → Cart (biggest drop)
    { top: 24, bot: 16, y0: 38, y1: 50 }, // Cart → Checkout
    { top: 16, bot: 10, y0: 50, y1: 62 }, // Checkout → Purchase
    { top: 10, bot: 10, y0: 62, y1: 72 }, // Purchase (tail)
  ];
  const cx = 60;

  return (
    <svg
      viewBox="0 0 120 80"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className="h-full w-full"
    >
      {stages.map((s, i) => {
        const xTopL = cx - s.top / 2;
        const xTopR = cx + s.top / 2;
        const xBotL = cx - s.bot / 2;
        const xBotR = cx + s.bot / 2;
        return (
          <polygon
            key={i}
            points={`${xTopL},${s.y0} ${xTopR},${s.y0} ${xBotR},${s.y1} ${xBotL},${s.y1}`}
            fill="var(--color-ink)"
            opacity={0.85 - i * 0.12}
          />
        );
      })}
    </svg>
  );
}
