import type { Metadata } from "next";
import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import RevealSection from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "30% retainer to get started. Pay as you grow. Your website cost scales with your actual traffic — perfect for small businesses in Fresno and the Central Valley.",
  alternates: {
    canonical: "https://hexacombllc.com/pricing",
  },
};

const tiers = [
  {
    name: "Starter",
    price: "$59",
    period: "/mo",
    range: "0 – 500",
    rangeLabel: "monthly visitors",
    description:
      "For new businesses just getting online and finding your first customers.",
    features: [
      "Custom hand-coded website",
      "Built-in SEO & accessibility",
      "Secure hosting & SSL certificate",
      "Monthly analytics report",
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
    range: "501 – 2,500",
    rangeLabel: "monthly visitors",
    description: "For businesses already getting traffic and building momentum.",
    features: [
      "Everything in Starter",
      "Priority email support",
      "Quarterly performance review",
      "Minor content updates included",
      "Social media integration",
    ],
    cta: "Get started",
    track: "cta_pricing_growing",
    highlighted: true,
  },
  {
    name: "Established",
    price: "$219",
    period: "/mo",
    range: "2,501 – 7,500",
    rangeLabel: "monthly visitors",
    description: "For businesses with steady traffic ready to scale up.",
    features: [
      "Everything in Growing",
      "Advanced SEO optimizations",
      "A/B testing setup",
      "Monthly strategy call",
      "Conversion tracking",
    ],
    cta: "Get started",
    track: "cta_pricing_established",
    highlighted: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    range: "7,500+",
    rangeLabel: "monthly visitors",
    description:
      "For businesses expanding across multiple locations or markets.",
    features: [
      "Everything in Established",
      "Dedicated support",
      "Custom integrations",
      "Multi-location setup",
      "SLA guarantee",
    ],
    cta: "Contact us",
    track: "cta_pricing_enterprise",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does 'pay-as-you-grow' actually work?",
    a: "We install privacy-friendly analytics on your site to measure monthly unique visitors. At the end of each month, we check your traffic and bill you for the tier you reached. If your traffic drops, your bill drops too: no penalties, no surprises.",
  },
  {
    q: "How much is the 30% retainer?",
    a: "It depends on your project's scope, but most small business sites fall in the $1,700–$2,300 range, meaning your retainer is roughly $500–$700. That's 70% less cash upfront than traditional agencies require. The retainer secures your spot and covers initial design and architecture.",
  },
  {
    q: "What if I go over my visitor limit?",
    a: "You automatically move to the next tier for that month. There are no overage fees or surprise charges. If you consistently outgrow a tier, we'll reach out to discuss the best plan for your growth.",
  },
  {
    q: "What happens if my traffic drops?",
    a: "Your bill automatically adjusts downward the following month. We believe you should pay for results, not promises. Seasonal businesses especially love this flexibility.",
  },
  {
    q: "What's included in the monthly price?",
    a: "Everything: custom design, hosting, maintenance, security updates, SSL, backups, and support. No hidden fees. No separate hosting bill. No 'webmaster' retainers.",
  },
  {
    q: "Can I switch plans?",
    a: "You don't need to. Switching happens automatically based on your traffic. But if you ever want to pause, downgrade, or discuss a custom arrangement, just reach out. We're local and easy to talk to.",
  },
];

export default function PricingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Pricing | Hexacomb",
    url: "https://hexacombllc.com/pricing",
    description:
      "30% retainer to get started. Pay as you grow. Analytics-based pricing for small businesses in Fresno and the Central Valley.",
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
              Pay as you{" "}
              <span className="pricing-hero-accent">grow.</span>
            </h1>
            <p className="pricing-hero-lead">
              A 30% retainer gets your site built. After launch, you pay a flat
              monthly rate based on your{" "}
              <strong>actual visitor count</strong>: lower in slow months,
              higher as business picks up. No annual contracts. No surprise
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
                  title: "30% retainer",
                  body: "Based on your project's estimated total cost. For most small business sites, that's roughly $500–$700 to get started, not $5,000.",
                },
                {
                  num: "02",
                  title: "We build and launch",
                  body: "Custom hand-coded website tailored to your brand. We install privacy-friendly analytics before go-live.",
                },
                {
                  num: "03",
                  title: "Pay as you grow",
                  body: "Your monthly bill matches your traffic tier. More visitors means more revenue for you. If traffic drops, your bill drops too.",
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
              support. You move between plans automatically as your traffic
              changes.
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
                      <strong>{tier.range}</strong>
                      <span>{tier.rangeLabel}</span>
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
            <h2 id="trust-heading">We win when you win</h2>
            <div className="trust-list">
              {[
                {
                  title: "Aligned incentives",
                  body: "Traditional agencies get paid whether your site performs or not. Our revenue grows only when your traffic grows, so we're motivated to build a site that actually attracts customers.",
                },
                {
                  title: "Cash-flow friendly",
                  body: "Small businesses can't drop $5,000 on a website before they know if it will work. Our 30% retainer lets you invest capital where it matters: inventory, staff, and marketing.",
                },
                {
                  title: "No long-term traps",
                  body: "No 12-month contracts with penalties. If your traffic drops (seasonal business, slow month), your bill drops too. Stay because it works, not because you're stuck.",
                },
                {
                  title: "Predictable scaling",
                  body: "Know exactly what you'll pay at every stage of growth. No surprise invoices for extra revisions or server overages. What you see is what you pay.",
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
                Just a <strong>30% retainer</strong> to kick things off. Spots
                are limited to 3 local businesses at a time.
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
