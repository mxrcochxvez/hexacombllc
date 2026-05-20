const steps = [
  {
    title: "Tell us what you need",
    body: "A short call or message. We listen and find the simplest path forward.",
  },
  {
    title: "We send a clear plan",
    body: "Scope, timeline, and price in writing. No surprises.",
  },
  {
    title: "We build and maintain",
    body: "We deliver the work and stay available when you need us.",
  },
];

export default function ProcessSteps() {
  return (
    <section className="border-t border-border bg-surface py-20 sm:py-28" aria-labelledby="process-heading">
      <div className="mx-auto max-w-6xl px-5 sm:px-6">
        <h2
          id="process-heading"
          className="max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight"
        >
          How it works
        </h2>

        <ol className="mt-14 grid gap-12 md:grid-cols-3 md:gap-10">
          {steps.map((step, index) => (
            <li key={step.title}>
              <p className="font-display text-sm font-semibold text-accent">
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
