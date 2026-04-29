"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { ChartElement } from "@/content/chart-schema";

interface ExplainContextValue {
  active: boolean;
  focus: string | null;
  setFocus: (selector: string | null) => void;
  toggle: () => void;
  elements: ReadonlyArray<ChartElement>;
}

const ExplainContext = createContext<ExplainContextValue | null>(null);

export function ExplainProvider({
  elements,
  children,
}: {
  elements: ReadonlyArray<ChartElement>;
  children: React.ReactNode;
}) {
  const [active, setActive] = useState(false);
  const [focus, setFocus] = useState<string | null>(null);

  const toggle = useCallback(() => {
    setActive((prev) => {
      const next = !prev;
      if (!next) setFocus(null);
      return next;
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.target instanceof HTMLElement) {
        const tag = e.target.tagName;
        if (tag === "INPUT" || tag === "TEXTAREA") return;
      }
      if (e.key === "?" || (e.key === "/" && e.shiftKey)) {
        e.preventDefault();
        toggle();
      } else if (e.key === "Escape" && active) {
        setActive(false);
        setFocus(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, toggle]);

  const value = useMemo<ExplainContextValue>(
    () => ({ active, focus, setFocus, toggle, elements }),
    [active, focus, toggle, elements],
  );

  return <ExplainContext.Provider value={value}>{children}</ExplainContext.Provider>;
}

export function useExplain(): ExplainContextValue {
  const v = useContext(ExplainContext);
  if (!v) throw new Error("useExplain must be used inside <ExplainProvider>");
  return v;
}
