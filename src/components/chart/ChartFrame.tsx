import Link from "next/link";
import type { ChartEntry } from "@/content/chart-schema";
import { ExplainProvider } from "./ExplainContext";
import { ExplainToggle } from "./ExplainToggle";
import { ExplainPanel } from "./ExplainPanel";
import { ChartCanvas } from "./ChartCanvas";
import { SECTORS, primarySurface } from "@/lib/sectors";
import { getFamily } from "@/lib/families";
import { isLiveChart } from "@/content/chart-schema";
import { PlaceholderTile } from "@/charts/_placeholder/PlaceholderTile";
import { cn } from "@/lib/utils";

const SECTOR_LABELS = new Map(SECTORS.map((s) => [s.id, s.label]));

interface ChartFrameProps {
  chart: ChartEntry;
  chartView?: React.ReactNode;
}

export function ChartFrame({ chart, chartView }: ChartFrameProps) {
  const elements = isLiveChart(chart) ? chart.elements : [];
  const surface = primarySurface(chart.sectors);

  return (
    <ExplainProvider elements={elements}>
      <article className="mx-auto max-w-[1200px] px-4 pb-24 pt-8 sm:px-6 lg:px-10">
        <nav className="mb-8 font-mono text-[11px] uppercase tracking-[0.2em] text-[--color-ink-mute]">
          <Link href="/" className="underline-offset-4 hover:underline">
            ← All charts
          </Link>
        </nav>

        <header className="grid gap-6 border-b border-[--color-hairline] pb-8 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              {chart.sectors.map((s) => (
                <span
                  key={s}
                  className="rounded-full px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink]"
                  style={{ backgroundColor: surface }}
                >
                  {SECTOR_LABELS.get(s) ?? s}
                </span>
              ))}
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-ink-mute]">
                · {getFamily(chart.family).label}
              </span>
            </div>
            <h1 className="mt-4 font-display text-4xl font-medium leading-[0.98] tracking-tight sm:text-5xl md:text-6xl">
              {chart.name}
            </h1>
            {chart.synopsis && (
              <p className="mt-5 max-w-[56ch] text-[length:--text-lead] text-[--color-ink-soft]">
                {chart.synopsis}
              </p>
            )}
          </div>
          {isLiveChart(chart) && (
            <div className="md:text-right">
              <ExplainToggle />
            </div>
          )}
        </header>

        <div className={cn(
          "mt-8 grid gap-8",
          "lg:grid-cols-[minmax(0,1fr)_360px]",
        )}>
          <div>
            {isLiveChart(chart) ? (
              <>
                <ChartCanvas>
                  {chartView ?? <ChartPlaceholderInCanvas family={chart.family} />}
                </ChartCanvas>
                <ExplainPanel />
              </>
            ) : (
              <ComingSoonCanvas family={chart.family} />
            )}
          </div>

          <aside className="flex flex-col gap-8">
            {isLiveChart(chart) ? (
              <>
                <Section label="When to use it">{chart.whenToUse}</Section>
                <Section label="How to read it">{chart.howToRead}</Section>
                <Section label={`Real-world · ${chart.example.title}`}>
                  {chart.example.description}
                </Section>
              </>
            ) : (
              <Section label="Coming soon">
                This chart is catalogued but not yet interactive. Detail copy and live
                rendering arrive in an upcoming release. In the meantime the metadata is
                already in place — including its sector, family, and data-shape tags.
              </Section>
            )}
          </aside>
        </div>
      </article>
    </ExplainProvider>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-ink-mute]">
        {label}
      </p>
      <p className="mt-2 text-[15px] leading-relaxed text-[--color-ink-soft]">
        {children}
      </p>
    </div>
  );
}

function ChartPlaceholderInCanvas({ family }: { family: ChartEntry["family"] }) {
  return (
    <div className="flex aspect-[16/9] items-center justify-center">
      <div className="h-full w-full max-w-[640px]">
        <PlaceholderTile family={family} />
      </div>
    </div>
  );
}

function ComingSoonCanvas({ family }: { family: ChartEntry["family"] }) {
  return (
    <div className="flex aspect-[16/9] items-center justify-center rounded-lg border border-dashed border-[--color-hairline] bg-[--color-surface] p-8">
      <div className="flex flex-col items-center gap-6 text-center">
        <div className="h-32 w-48 opacity-60">
          <PlaceholderTile family={family} />
        </div>
        <p className="font-mono text-[11px] uppercase tracking-[0.22em] text-[--color-ink-mute]">
          Interactive version coming soon
        </p>
      </div>
    </div>
  );
}
