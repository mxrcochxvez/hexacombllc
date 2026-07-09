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
    <section style={{ padding: 0 }} className="border-t border-border bg-surface" aria-labelledby="process-heading">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <h2
          id="process-heading"
          className="max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight"
        >
          How it works
        </h2>

        <ol className="mt-10 grid gap-8 sm:mt-14 md:grid-cols-3 md:gap-10" aria-label="Process steps">
          {steps.map((step, index) => (
            <li key={step.title}>
              <p className="font-display text-sm font-semibold text-accent" aria-hidden="true">
                Step {index + 1}
              </p>
              <h3 className="mt-3 font-display text-lg font-semibold text-ink">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-2 text-base leading-relaxed text-ink-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
