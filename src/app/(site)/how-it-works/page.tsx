import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Check, Code2, Palette, Rocket } from "lucide-react";

const pageUrl = "https://hexacombllc.com/how-it-works";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "See Hexacomb's simple website process: unlimited design revisions, plan-based development, and a clear launch and handoff.",
  alternates: {
    canonical: pageUrl,
  },
  openGraph: {
    title: "How It Works | Hexacomb",
    description:
      "A simple three-step website process: design, development, and delivery.",
    url: pageUrl,
  },
};

const steps = [
  {
    number: "01",
    title: "Design",
    tagline: "Shape the website together.",
    description:
      "We start with your business, customers, goals, and style. Then we create the design and keep refining it until it feels right.",
    note: "Unlimited design revisions are included before development begins.",
    items: [
      "A custom direction based on your business",
      "Clear feedback rounds without revision limits",
      "Your approval before the website is built",
    ],
    icon: Palette,
  },
  {
    number: "02",
    title: "Development",
    tagline: "Turn the approved design into a real website.",
    description:
      "Once you approve the design, we build the site for phones, tablets, and desktops. The number of pages, features, and integrations depends on the plan you choose.",
    note: "Every plan includes a custom website, secure hosting, maintenance, and support.",
    items: [
      "Responsive, accessible, and search-friendly development",
      "Pages and features matched to your selected plan",
      "Testing and review before anything goes live",
    ],
    icon: Code2,
  },
  {
    number: "03",
    title: "Delivery",
    tagline: "Launch with a clear handoff.",
    description:
      "After final testing and approval, we connect your domain and launch the finished website. You receive a clear handoff, while hosting, maintenance, updates, and support continue through your plan.",
    note: "No confusing launch checklist or surprise technical work for you to manage.",
    items: [
      "Final approval and launch preparation",
      "Domain, hosting, and security setup",
      "Ongoing care based on your monthly plan",
    ],
    icon: Rocket,
  },
];

export default function HowItWorksPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How Hexacomb designs, develops, and delivers a website",
    description:
      "Hexacomb's three-step website process for small businesses: design, development, and delivery.",
    totalTime: "P1M",
    step: steps.map((step) => ({
      "@type": "HowToStep",
      position: Number(step.number),
      name: step.title,
      text: `${step.description} ${step.note}`,
      url: `${pageUrl}#${step.title.toLowerCase()}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <section className="border-b border-border bg-canvas" aria-labelledby="process-page-heading">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28 lg:py-32">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-accent">
              Our website process
            </p>
            <h1
              id="process-page-heading"
              className="mt-4 max-w-4xl font-display text-[clamp(2.4rem,7vw,5.4rem)] font-semibold leading-[0.98] tracking-[-0.045em] text-ink"
            >
              From first idea to finished website.
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-muted sm:text-xl">
              A straightforward process built around three stages: design,
              development, and delivery. You always know what comes next and
              what is included.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/#contact"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold text-canvas transition-colors hover:bg-accent-hover"
                data-track="cta_process_hero_contact"
              >
                Start a conversation <ArrowRight size={17} aria-hidden />
              </Link>
              <Link
                href="/pricing"
                className="inline-flex min-h-12 items-center justify-center rounded-md border border-border bg-canvas px-6 py-3 font-display text-sm font-semibold text-ink transition-colors hover:bg-surface"
                data-track="cta_process_hero_pricing"
              >
                View website plans
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-surface" aria-labelledby="three-stages-heading">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-28">
            <div className="max-w-2xl">
              <h2
                id="three-stages-heading"
                className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-tight"
              >
                Three stages. No mystery.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-muted sm:text-lg">
                Each stage ends with a clear decision before the next one
                starts, so the project stays focused and predictable.
              </p>
            </div>

            <ol className="mt-12 space-y-6 sm:mt-16" aria-label="Website project stages">
              {steps.map((step) => {
                const Icon = step.icon;
                const id = step.title.toLowerCase();

                return (
                  <li
                    id={id}
                    key={step.title}
                    className="scroll-mt-24 rounded-xl border border-border bg-canvas p-6 shadow-[0_18px_50px_-38px_oklch(22%_0.025_265/0.45)] sm:p-8 lg:grid lg:grid-cols-[minmax(0,0.75fr)_minmax(0,1.25fr)] lg:gap-14 lg:p-10"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-4">
                        <span className="font-display text-sm font-semibold text-accent" aria-hidden="true">
                          Step {step.number}
                        </span>
                        <span className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface text-accent">
                          <Icon size={21} strokeWidth={1.8} aria-hidden />
                        </span>
                      </div>
                      <h3 className="mt-7 font-display text-[clamp(1.7rem,4vw,2.65rem)] font-semibold leading-none tracking-tight text-ink">
                        <span className="sr-only">Step {step.number}: </span>
                        {step.title}
                      </h3>
                      <p className="mt-3 font-display text-base font-medium leading-relaxed text-ink-muted">
                        {step.tagline}
                      </p>
                    </div>

                    <div className="mt-8 border-t border-border pt-8 lg:mt-0 lg:border-l lg:border-t-0 lg:pl-14 lg:pt-0">
                      <p className="text-base leading-relaxed text-ink-muted sm:text-lg">
                        {step.description}
                      </p>
                      <ul className="mt-7 space-y-3" aria-label={`${step.title} includes`}>
                        {step.items.map((item) => (
                          <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink sm:text-base">
                            <Check
                              className="mt-1 flex-none text-accent"
                              size={17}
                              strokeWidth={2.5}
                              aria-hidden
                            />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                      <p className="mt-7 rounded-lg border border-border bg-surface px-4 py-3 text-sm leading-relaxed text-ink-muted">
                        <strong className="font-display font-semibold text-ink">Good to know: </strong>
                        {step.note}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section className="border-t border-border bg-deep" aria-labelledby="process-cta-heading">
          <div className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24">
            <div className="max-w-2xl">
              <h2
                id="process-cta-heading"
                className="font-display text-[clamp(1.9rem,4vw,3rem)] font-semibold leading-tight tracking-tight text-on-deep"
              >
                Ready to talk through your website?
              </h2>
              <p className="mt-4 text-base leading-relaxed text-on-deep-muted sm:text-lg">
                Tell us what you have now and what you want to improve. We will
                recommend a practical next step and the plan that fits it.
              </p>
              <Link
                href="/#contact"
                className="mt-8 inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-6 py-3 font-display text-sm font-semibold text-canvas transition-colors hover:bg-accent-hover"
                data-track="cta_process_bottom"
              >
                Tell us about your project <ArrowRight size={17} aria-hidden />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
