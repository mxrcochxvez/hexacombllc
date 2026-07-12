import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import RevealSection from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "Clear feature-based website plans for small businesses in Fresno and the Central Valley. Choose the care, tools, and support that fit your needs.",
  alternates: {
    canonical: "https://hexacombllc.com/pricing",
  },
};

const tiers = [
  {
    name: "Starter",
    price: "$70",
    period: "/mo",
    label: "Essentials",
    labelDetail: "Get online",
    description: "For new businesses just getting online.",
    features: [
      "Custom hand-coded website (up to 5 pages)",
      "Built-in SEO basics & accessibility",
      "Secure hosting & SSL",
      "Contact form",
      "Email support",
    ],
    cta: "Get started",
    track: "cta_pricing_starter",
    highlighted: false,
  },
  {
    name: "Growing",
    price: "$119",
    period: "/mo",
    label: "Most popular",
    labelDetail: "Monthly care",
    description:
      "For businesses ready to improve the site month to month.",
    features: [
      "Everything in Starter",
      "Up to ~10 pages",
      "Privacy-friendly analytics + simple dashboard",
      "Minor content updates monthly",
      "Social media / basic embeds",
      "Priority email support",
      "Quarterly check-in",
    ],
    cta: "Get started",
    track: "cta_pricing_growing",
    highlighted: true,
  },
  {
    name: "Established",
    price: "$219",
    period: "/mo",
    label: "Growth-focused",
    labelDetail: "Leads & care",
    description: "For businesses focused on leads and growth.",
    features: [
      "Everything in Growing",
      "Larger site / more sections as needed",
      "Ongoing SEO improvements",
      "Conversion tracking",
      "Booking, maps, or CRM-style integrations",
      "More content updates + priority turnaround",
      "Monthly strategy call",
    ],
    cta: "Get started",
    track: "cta_pricing_established",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    label: "Custom scope",
    labelDetail: "Complex needs",
    description: "For multi-location or complex needs.",
    features: [
      "Everything in Established",
      "Multi-location / multi-site setup",
      "Custom integrations",
      "Dedicated support & SLA",
      "Custom reporting cadence",
    ],
    cta: "Contact us",
    track: "cta_pricing_enterprise",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "What's included in every plan?",
    a: "Every plan includes a custom hand-coded website, secure hosting, SSL, maintenance, backups, and support. Higher plans add more pages, content updates, analytics, integrations, and strategy time.",
  },
  {
    q: "Does Starter include analytics or a dashboard?",
    a: "No. Starter is built to get you online with a solid site, hosting, and email support. Privacy-friendly analytics and a simple dashboard start on the Growing plan.",
  },
  {
    q: "What counts as a content update?",
    a: "Things like changing copy, swapping photos, updating hours, or tweaking a section. Growing includes minor monthly updates. Established includes more updates with faster turnaround. Bigger redesigns are scoped separately.",
  },
  {
    q: "Can I upgrade later?",
    a: "Yes. Start where it makes sense and move up when you want analytics, more updates, SEO work, or integrations. We'll help you pick the right plan — no pressure, no long-term traps.",
  },
  {
    q: "Are there hidden fees?",
    a: "No. Your monthly price covers the features listed for that plan. No separate hosting bill. If you need something outside your plan, we'll quote it clearly before any work starts.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pricing | Hexacomb",
    url: "https://hexacombllc.com/pricing",
    description:
      "Feature-based website plans for small businesses in Fresno and the Central Valley. Clear inclusions for hosting, care, and growth tools.",
    mainEntity: {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a,
        },
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* Hero */}
        <section
          className="pricing-hero"
          aria-labelledby="pricing-hero-heading"
        >
          <div className="container">
            <h1 id="pricing-hero-heading">
              Plans that match{" "}
              <span className="pricing-hero-accent">what you need.</span>
            </h1>
            <p className="pricing-hero-lead">
              Choose by what you need: site size, ongoing care, and growth
              tools. Flat monthly pricing. No annual contracts. No surprise
              invoices.
            </p>
            <Link
              href="/#contact"
              className="btn btn-primary"
              data-track="cta_pricing_hero"
            >
              Get your free quote <ArrowRight size={16} strokeWidth={2} />
            </Link>
          </div>
        </section>

        {/* How It Works */}
        <RevealSection className="how-it-works" ariaLabelledBy="how-heading">
          <div className="container">
            <h2 id="how-heading">How it works</h2>
            <ol className="how-list">
              {[
                {
                  num: "01",
                  title: "Pick the plan that fits",
                  body: "Match your needs for pages, updates, analytics, and support. We'll help you choose if you're unsure.",
                },
                {
                  num: "02",
                  title: "We build and launch",
                  body: "Custom hand-coded website tailored to your brand, hosted and secured from day one.",
                },
                {
                  num: "03",
                  title: "Care that matches your plan",
                  body: "Hosting, maintenance, and the updates or growth tools included in your tier — predictable every month.",
                },
              ].map((step, i) => (
                <li
                  className="how-item reveal-item"
                  key={step.title}
                  style={
                    { "--reveal-delay": `${i * 120}ms` } as React.CSSProperties
                  }
                >
                  <span className="how-num" aria-hidden>
                    {step.num}
                  </span>
                  <div>
                    <h3>{step.title}</h3>
                    <p>{step.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </RevealSection>

        {/* Pricing Tiers */}
        <RevealSection className="pricing-tiers" ariaLabelledBy="tiers-heading">
          <div className="container">
            <h2 id="tiers-heading">Plans</h2>
            <p className="section-intro">
              Every plan includes your custom site, hosting, maintenance, and
              support. Higher plans add more pages, content updates, analytics,
              and growth tools.
            </p>
            <div className="pricing-table">
              {tiers.map((tier, i) => (
                <div
                  key={tier.name}
                  className={`pricing-row reveal-item${
                    tier.highlighted ? " pricing-row-featured" : ""
                  }`}
                  style={
                    { "--reveal-delay": `${i * 80}ms` } as React.CSSProperties
                  }
                >
                  <div className="pricing-row-meta">
                    <span className="pricing-row-num" aria-hidden>
                      0{i + 1}
                    </span>
                    <div className="pricing-row-info">
                      <h3>
                        {tier.name}
                        {tier.highlighted && (
                          <span className="pricing-row-badge">Popular</span>
                        )}
                      </h3>
                      <p className="pricing-card-desc">{tier.description}</p>
                      <ul className="pricing-row-features">
                        {tier.features.map((feature) => (
                          <li key={feature}>
                            <Check size={14} strokeWidth={2.5} aria-hidden />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div className="pricing-row-right">
                    <div className="pricing-row-visitors">
                      <strong>{tier.label}</strong>
                      <span>{tier.labelDetail}</span>
                    </div>
                    <div className="pricing-row-price">
                      <span className="price-amount">{tier.price}</span>
                      <span className="price-period">{tier.period}</span>
                    </div>
                    <Link
                      href="/#contact"
                      className={`btn ${
                        tier.highlighted ? "btn-primary" : "btn-outline-dark"
                      }`}
                      data-track={tier.track}
                    >
                      {tier.cta} <ArrowRight size={16} strokeWidth={2} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* Trust */}
        <RevealSection className="pricing-trust" ariaLabelledBy="trust-heading">
          <div className="container">
            <h2 id="trust-heading">Clear plans. Honest care.</h2>
            <div className="trust-list">
              {[
                {
                  title: "Know what you're getting",
                  body: "Each plan lists what's included — pages, updates, analytics, and support. No vague packages, no surprise add-ons after you sign on.",
                },
                {
                  title: "Cash-flow friendly",
                  body: "Flat monthly pricing instead of a large upfront agency bill. Put capital where it matters: inventory, staff, and marketing.",
                },
                {
                  title: "No long-term traps",
                  body: "No 12-month contracts with penalties. Stay because the site and support work for you, not because you're locked in.",
                },
                {
                  title: "Upgrade when you're ready",
                  body: "Start lean on Starter, then add analytics, content updates, or strategy time when you need them. Your plan grows with your business.",
                },
              ].map((item, i) => (
                <div
                  className="trust-row reveal-item"
                  key={item.title}
                  style={
                    {
                      "--reveal-delay": `${i * 100}ms`,
                    } as React.CSSProperties
                  }
                >
                  <span className="trust-row-num" aria-hidden>
                    0{i + 1}
                  </span>
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* FAQ */}
        <RevealSection className="pricing-faq" ariaLabelledBy="faq-heading">
          <div className="container">
            <h2 id="faq-heading">Questions owners ask</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="faq-item reveal-item"
                  style={
                    {
                      "--reveal-delay": `${i * 80}ms`,
                    } as React.CSSProperties
                  }
                >
                  <summary>
                    <span>{faq.q}</span>
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* CTA */}
        <section
          className="pricing-cta"
          aria-labelledby="pricing-cta-heading"
        >
          <div className="container">
            <div className="pricing-cta-inner">
              <h2 id="pricing-cta-heading">Ready to start?</h2>
              <p>
                Spots are limited to 3 local businesses at a time. Get a free
                quote and we&apos;ll take it from there.
              </p>
              <Link
                href="/#contact"
                className="btn btn-primary"
                data-track="cta_pricing_bottom"
              >
                Get your free quote <ArrowRight size={16} strokeWidth={2} />
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
