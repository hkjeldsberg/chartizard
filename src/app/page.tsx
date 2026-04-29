import { ALL_CHARTS } from "@/content/charts";
import { Hero } from "@/components/Hero";
import { Grid } from "@/components/bento/Grid";
import { Tile } from "@/components/bento/Tile";
import { Thumbnail } from "@/components/bento/Thumbnail";
import { FilterSidebar } from "@/components/filter/FilterSidebar";
import { FilterChips } from "@/components/filter/FilterChips";
import {
  DesktopFilterAside,
  MobileFilterToggle,
} from "@/components/filter/MobileFilterToggle";
import { applyFilters, parseFilters } from "@/components/filter/filter-state";
import { getFamily } from "@/lib/families";

interface PageProps {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}

export default async function HomePage({ searchParams }: PageProps) {
  const params = await searchParams;
  const filters = parseFilters(params);
  const visible = applyFilters(ALL_CHARTS, filters);
  const activeCount =
    filters.sectors.length +
    filters.families.length +
    filters.shapes.length +
    (filters.liveOnly ? 1 : 0);

  return (
    <main className="mx-auto max-w-[1400px] px-4 pb-24 sm:px-6 lg:px-10">
      <Hero />

      <div className="@container">
        <div className="grid @[900px]:grid-cols-[220px_1fr] @[900px]:gap-10">
          <MobileFilterToggle activeCount={activeCount}>
            <FilterSidebar charts={ALL_CHARTS} />
          </MobileFilterToggle>
          <DesktopFilterAside>
            <FilterSidebar charts={ALL_CHARTS} />
          </DesktopFilterAside>

          <section>
            <div className="mb-4">
              <FilterChips resultCount={visible.length} />
            </div>

            {visible.length === 0 ? (
              <EmptyState />
            ) : (
              <Grid>
                {visible.map((chart, idx) => (
                  <Tile
                    key={chart.id}
                    href={`/charts/${chart.id}`}
                    size={chart.tileSize}
                    sectors={chart.sectors}
                    title={chart.name}
                    familyLabel={getFamily(chart.family).label}
                    eyebrow={(idx + 1).toString().padStart(3, "0")}
                    status={chart.status}
                  >
                    <Thumbnail chart={chart} />
                  </Tile>
                ))}
              </Grid>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="rounded-lg border border-dashed border-[--color-hairline] px-6 py-16 text-center">
      <p className="font-display text-2xl text-[--color-ink]">No charts match those filters.</p>
      <p className="mt-2 text-[--color-ink-soft]">Try loosening one of the facets on the left — or clear all.</p>
    </div>
  );
}
