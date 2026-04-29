"use client";

import { ParentSize } from "@visx/responsive";
import { getLiveChartComponent } from "@/lib/chart-registry";

export function LiveChartView({ id }: { id: string }) {
  const C = getLiveChartComponent(id);
  if (!C) {
    return <div className="p-8 text-center text-[--color-ink-mute]">Chart not wired.</div>;
  }
  return (
    <div className="relative aspect-[16/9] w-full" data-data-layer="true">
      <ParentSize>
        {({ width, height }) =>
          width > 0 && height > 0 ? <C width={width} height={height} /> : null
        }
      </ParentSize>
    </div>
  );
}
