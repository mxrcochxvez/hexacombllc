const points = [
  {
    title: "We explain things clearly",
    body: "You always know what we are doing, why it matters, and what it costs before we start.",
  },
  {
    title: "We do the work for you",
    body: "You do not need to manage servers or fix plugins. That is our job.",
  },
  {
    title: "We stay after launch",
    body: "We keep things running and help when something breaks.",
  },
];

export default function WhyHexacomb() {
  return (
    <section className="bg-canvas py-20 sm:py-28" aria-labelledby="why-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-20">
          <h2
            id="why-heading"
            className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight lg:sticky lg:top-28 lg:self-start"
          >
            Built for owners who want it handled
          </h2>

          <dl className="space-y-10">
            {points.map((point) => (
              <div key={point.title}>
                <dt className="font-display text-lg font-semibold text-ink">{point.title}</dt>
                <dd className="mt-2 text-base leading-relaxed text-ink-muted">{point.body}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
