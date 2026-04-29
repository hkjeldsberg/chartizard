"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export function MobileFilterToggle({
  children,
  activeCount,
}: {
  children: React.ReactNode;
  activeCount: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="@[900px]:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls={panelId}
        className={cn(
          "mb-4 inline-flex items-center gap-2 rounded-full border border-[--color-ink] bg-[--color-surface] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.2em]",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[--color-ink]",
        )}
      >
        {open ? "Close filters" : "Filters"}
        {activeCount > 0 && (
          <span className="rounded-full bg-[--color-ink] px-1.5 py-px text-[10px] text-[--color-page]">
            {activeCount}
          </span>
        )}
      </button>
      <div
        id={panelId}
        className={cn(
          "overflow-hidden transition-[grid-template-rows] duration-300",
          "grid",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <div className="rounded-lg border border-[--color-hairline] bg-[--color-surface] p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}

export function DesktopFilterAside({ children }: { children: React.ReactNode }) {
  return (
    <aside className="hidden @[900px]:block">
      {/* Sticky + capped to viewport + internal scroll: the sidebar owns
          its own scroll axis independent of the chart grid. The top-6
          offset leaves room for the page header; the -3rem subtracts the
          matching top offset and bottom breathing room. pr-2 prevents
          content from running under the scrollbar. The .scrollbar-discrete
          class thins the scrollbar and tints it to the page palette. */}
      <div className="scrollbar-discrete sticky top-6 max-h-[calc(100dvh-3rem)] overflow-y-auto overscroll-contain pr-2">
        {children}
      </div>
    </aside>
  );
}
