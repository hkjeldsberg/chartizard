import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-2xl flex-col items-start gap-6 px-6 py-24">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-[--color-ink-mute]">
        404 · Chart not found
      </p>
      <h1 className="font-display text-4xl font-medium tracking-tight">
        That chart isn&rsquo;t in the atlas.
      </h1>
      <p className="text-[--color-ink-soft]">
        We may not have catalogued it yet — or the URL may have drifted. Browse
        the full atlas from the homepage.
      </p>
      <Link
        href="/"
        className="rounded-full border border-[--color-ink] bg-[--color-ink] px-4 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-[--color-page]"
      >
        ← Back to atlas
      </Link>
    </main>
  );
}
