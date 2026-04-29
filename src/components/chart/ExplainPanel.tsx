"use client";

import { useExplain } from "./ExplainContext";
import { cn } from "@/lib/utils";

export function ExplainPanel() {
  const { active, focus, elements } = useExplain();
  if (!active) return null;

  const focused = elements.find((e) => e.selector === focus);

  return (
    <aside
      className={cn(
        "mt-5 rounded-lg border border-[--color-hairline] bg-[--color-surface] p-5",
        "transition-colors",
      )}
      aria-live="polite"
    >
      {focused ? (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-ink-mute]">
            Element
          </p>
          <h3 className="mt-1 font-display text-xl tracking-tight text-[--color-ink]">
            {focused.label}
          </h3>
          <p className="mt-3 text-[15px] leading-relaxed text-[--color-ink-soft]">
            {focused.explanation}
          </p>
        </>
      ) : (
        <>
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-ink-mute]">
            Explain mode
          </p>
          <p className="mt-2 text-[15px] leading-relaxed text-[--color-ink-soft]">
            Hover or focus any numbered pin on the chart to read what that element is and
            how to interpret it.
          </p>
          <ol className="mt-4 space-y-1.5 text-sm text-[--color-ink-soft]">
            {elements.map((el, i) => (
              <li key={el.selector} className="flex gap-2">
                <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[--color-ink] font-mono text-[10px] text-[--color-ink]">
                  {i + 1}
                </span>
                <span>{el.label}</span>
              </li>
            ))}
          </ol>
        </>
      )}
    </aside>
  );
}
