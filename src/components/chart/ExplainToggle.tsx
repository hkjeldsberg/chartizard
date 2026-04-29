"use client";

import { cn } from "@/lib/utils";
import { useExplain } from "./ExplainContext";

export function ExplainToggle() {
  const { active, toggle } = useExplain();
  return (
    <div className="inline-flex items-center gap-3" role="group" aria-label="View mode">
      <div className="inline-flex overflow-hidden rounded-full border border-[--color-ink]">
        <button
          type="button"
          onClick={() => {
            if (active) toggle();
          }}
          aria-pressed={!active}
          className={cn(
            "px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]",
            !active ? "bg-[--color-ink] text-[--color-page]" : "text-[--color-ink]",
          )}
        >
          View
        </button>
        <button
          type="button"
          onClick={() => {
            if (!active) toggle();
          }}
          aria-pressed={active}
          className={cn(
            "px-3 py-1 font-mono text-[11px] uppercase tracking-[0.18em]",
            active ? "bg-[--color-ink] text-[--color-page]" : "text-[--color-ink]",
          )}
        >
          Explain
        </button>
      </div>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[--color-ink-mute]">
        Press <kbd className="rounded border border-[--color-hairline] bg-[--color-surface] px-1 py-px text-[9px]">?</kbd>
      </span>
    </div>
  );
}
