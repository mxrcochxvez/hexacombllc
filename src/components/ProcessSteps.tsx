import Link from "next/link";
import { ArrowRight } from "lucide-react";

const steps = [
  {
    title: "Design",
    body: "We create the look and layout, then make unlimited revisions until you are happy with the direction.",
    detail: "Unlimited design iterations",
  },
  {
    title: "Development",
    body: "We build the approved design into a fast, responsive website. Pages and features depend on your plan.",
    detail: "Built around your plan",
  },
  {
    title: "Delivery",
    body: "We test, launch, and hand off the finished website while continuing the hosting, maintenance, and support in your plan.",
    detail: "Launch and clear handoff",
  },
];

export default function ProcessSteps() {
  return (
    <section
      id="process"
      style={{ padding: 0 }}
      className="border-t border-border bg-surface"
      aria-labelledby="process-heading"
    >
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              A simple three-stage process
            </p>
            <h2
              id="process-heading"
              className="mt-3 max-w-xl font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold leading-tight tracking-tight"
            >
              Design. Development. Delivery.
            </h2>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-ink-muted">
              You always know what stage the project is in, what happens next,
              and what needs your approval.
            </p>
          </div>

          <Link
            href="/how-it-works"
            className="inline-flex w-fit items-center gap-2 font-display text-sm font-semibold text-accent transition-colors hover:text-accent-hover"
            data-track="cta_home_process_details"
          >
            See the full process <ArrowRight size={16} aria-hidden />
          </Link>
        </div>

        <ol
          className="mt-10 grid gap-5 sm:mt-14 md:grid-cols-3"
          aria-label="Website process steps"
        >
          {steps.map((step, index) => (
            <li
              key={step.title}
              className="rounded-lg border border-border bg-canvas p-6 sm:p-7"
            >
              <div className="flex items-center justify-between gap-4">
                <p
                  className="font-display text-sm font-semibold text-accent"
                  aria-hidden="true"
                >
                  Step 0{index + 1}
                </p>
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </div>
              <h3 className="mt-6 font-display text-xl font-semibold text-ink">
                <span className="sr-only">Step {index + 1}: </span>
                {step.title}
              </h3>
              <p className="mt-3 text-base leading-relaxed text-ink-muted">
                {step.body}
              </p>
              <p className="mt-6 border-t border-border pt-4 font-display text-sm font-semibold text-ink">
                {step.detail}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
