import { ALL_CHARTS, LIVE_CHARTS } from "@/content/charts";
import { SECTORS } from "@/lib/sectors";

export function Hero() {
  const total = ALL_CHARTS.length;
  const live = LIVE_CHARTS.length;
  const fields = SECTORS.length;

  return (
    <section className="mb-10 pt-8 sm:pt-14">
      <p className="font-mono text-xs uppercase tracking-[0.22em] text-[--color-ink-mute]">
        Chartizard — An atlas of charts
      </p>
      <h1 className="mt-4 font-display font-medium leading-[0.92] tracking-[-0.02em] text-[--color-ink] text-[length:--text-display-md] md:text-[length:--text-display-lg]">
        Every chart ever invented.
        <br />
        <span className="text-[--color-ink-soft]">Explained, one element at a time.</span>
      </h1>
      <p className="mt-6 max-w-[56ch] text-[length:--text-lead] text-[--color-ink-soft]">
        An interactive catalogue of {total.toLocaleString()} chart, diagram, and plot
        types — filterable by field, each one dissected so you can tell which
        axis is doing the work and why it matters.
      </p>
      <dl className="mt-8 grid grid-cols-3 gap-6 border-t border-[--color-hairline] pt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-[--color-ink-mute] sm:max-w-md">
        <div>
          <dt>Charts</dt>
          <dd className="mt-1 font-display text-2xl font-normal tracking-tight text-[--color-ink]">
            {total}
          </dd>
        </div>
        <div>
          <dt>Live</dt>
          <dd className="mt-1 font-display text-2xl font-normal tracking-tight text-[--color-ink]">
            {live}
          </dd>
        </div>
        <div>
          <dt>Fields</dt>
          <dd className="mt-1 font-display text-2xl font-normal tracking-tight text-[--color-ink]">
            {fields}
          </dd>
        </div>
      </dl>
    </section>
  );
}
