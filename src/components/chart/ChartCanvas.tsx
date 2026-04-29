"use client";

import { cn } from "@/lib/utils";
import { useExplain } from "./ExplainContext";

interface ChartCanvasProps {
  children: React.ReactNode;
  className?: string;
}

export function ChartCanvas({ children, className }: ChartCanvasProps) {
  const { active } = useExplain();
  return (
    <div
      data-explain-active={active}
      className={cn(
        "relative rounded-lg border border-[--color-hairline] bg-[--color-surface] p-4 sm:p-6",
        className,
      )}
    >
      <div
        className={cn(
          "transition-opacity duration-200",
          active && "[&_[data-data-layer=true]]:opacity-40",
        )}
      >
        {children}
      </div>
    </div>
  );
}
