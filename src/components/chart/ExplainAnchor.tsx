"use client";

import { cn } from "@/lib/utils";
import { useExplain } from "./ExplainContext";

interface ExplainAnchorProps {
  selector: string;
  /**
   * Rectangle (in SVG coordinates) that receives pointer events when Explain
   * mode is active. If omitted, the anchor is "bare" — callers should wrap
   * existing chart marks with the anchor wrapper instead.
   */
  rect?: { x: number; y: number; width: number; height: number };
  children?: React.ReactNode;
  /** The number to display on the coach-mark pin (1..N). */
  index: number;
  /** Anchor position for the numbered pin, in SVG coordinates. */
  pin: { x: number; y: number };
}

export function ExplainAnchor({
  selector,
  rect,
  children,
  index,
  pin,
}: ExplainAnchorProps) {
  const { active, focus, setFocus } = useExplain();
  const isFocused = focus === selector;

  return (
    <g
      data-explain={selector}
      className={cn(
        "transition-opacity",
        active && !isFocused && focus !== null && "opacity-60",
      )}
    >
      {children}
      {active && (
        <>
          {rect && (
            <rect
              x={rect.x}
              y={rect.y}
              width={rect.width}
              height={rect.height}
              fill="transparent"
              pointerEvents="all"
              onMouseEnter={() => setFocus(selector)}
              onMouseLeave={() => setFocus(null)}
              onFocus={() => setFocus(selector)}
              onBlur={() => setFocus(null)}
              tabIndex={0}
              role="button"
              aria-describedby={`explain-${selector}`}
              style={{ cursor: "help" }}
            />
          )}
          <g
            transform={`translate(${pin.x}, ${pin.y})`}
            onMouseEnter={() => setFocus(selector)}
            onMouseLeave={() => setFocus(null)}
            style={{ cursor: "help" }}
          >
            <circle
              r={9}
              fill={isFocused ? "var(--color-ink)" : "var(--color-surface)"}
              stroke="var(--color-ink)"
              strokeWidth={1.5}
            />
            <text
              textAnchor="middle"
              dominantBaseline="central"
              fontSize={10}
              fontFamily="var(--font-mono)"
              fontWeight="500"
              fill={isFocused ? "var(--color-page)" : "var(--color-ink)"}
            >
              {index}
            </text>
          </g>
        </>
      )}
    </g>
  );
}
