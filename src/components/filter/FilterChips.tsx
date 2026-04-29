"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useTransition } from "react";
import { SECTORS } from "@/lib/sectors";
import { FAMILIES } from "@/lib/families";
import { DATA_SHAPES } from "@/lib/data-shapes";
import {
  isEmptyFilter,
  parseFilters,
  serializeFilters,
  EMPTY_FILTER,
  type FilterState,
} from "./filter-state";

const SECTOR_LABELS = new Map(SECTORS.map((s) => [s.id, s.short]));
const FAMILY_LABELS = new Map(FAMILIES.map((f) => [f.id, f.label]));
const SHAPE_LABELS = new Map(DATA_SHAPES.map((d) => [d.id, d.label]));

export function FilterChips({ resultCount }: { resultCount: number }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();

  const filters = useMemo(() => {
    const params: Record<string, string> = {};
    searchParams.forEach((v, k) => {
      params[k] = v;
    });
    return parseFilters(params);
  }, [searchParams]);

  const navigate = (next: FilterState) => {
    const qs = serializeFilters(next).toString();
    startTransition(() => {
      router.replace(qs ? `/?${qs}` : "/", { scroll: false });
    });
  };

  const chips: { key: string; label: string; remove: () => void }[] = [];
  for (const s of filters.sectors) {
    chips.push({
      key: `sec-${s}`,
      label: SECTOR_LABELS.get(s) ?? s,
      remove: () => navigate({ ...filters, sectors: filters.sectors.filter((x) => x !== s) }),
    });
  }
  for (const f of filters.families) {
    chips.push({
      key: `fam-${f}`,
      label: FAMILY_LABELS.get(f) ?? f,
      remove: () => navigate({ ...filters, families: filters.families.filter((x) => x !== f) }),
    });
  }
  for (const d of filters.shapes) {
    chips.push({
      key: `shape-${d}`,
      label: SHAPE_LABELS.get(d) ?? d,
      remove: () => navigate({ ...filters, shapes: filters.shapes.filter((x) => x !== d) }),
    });
  }
  if (filters.liveOnly) {
    chips.push({
      key: "live",
      label: "Live only",
      remove: () => navigate({ ...filters, liveOnly: false }),
    });
  }

  if (isEmptyFilter(filters)) {
    return (
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[--color-ink-mute]">
        Showing all {resultCount} · filter below
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[--color-ink-mute]">
        {resultCount} results
      </span>
      <div className="h-4 w-px bg-[--color-hairline]" />
      {chips.map((c) => (
        <button
          key={c.key}
          type="button"
          onClick={c.remove}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[--color-hairline] bg-[--color-surface] px-2.5 py-0.5 text-[12px] hover:border-[--color-ink]"
          aria-label={`Remove filter ${c.label}`}
        >
          <span>{c.label}</span>
          <span className="text-[--color-ink-mute] group-hover:text-[--color-ink]" aria-hidden="true">×</span>
        </button>
      ))}
      <button
        type="button"
        onClick={() => navigate(EMPTY_FILTER)}
        className="ml-auto font-mono text-[11px] uppercase tracking-[0.18em] text-[--color-ink-soft] underline-offset-4 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
