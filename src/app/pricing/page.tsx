import type { Metadata } from "next";
import {
  Compass,
  Package,
  Shield,
  Globe,
  Check,
  BarChart3,
  ArrowRight,
  HelpCircle,
} from "lucide-react";

const iconProps = { size: 28, strokeWidth: 1.75 };

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
    icon: <Compass {...iconProps} />,
    price: "$59",
    period: "/mo",
    range: "0 – 500",
    rangeLabel: "monthly visitors",
    description: "Perfect for new businesses just getting online and finding your first customers.",
    features: [
      "Custom hand-coded website",
      "Built-in SEO & accessibility",
      "Secure hosting & SSL certificate",
      "Monthly analytics report",
      "Email support",
    ],
    cta: "Get Started",
    track: "cta_pricing_starter",
    highlighted: false,
  },
  {
    name: "Growing",
    icon: <Package {...iconProps} />,
    price: "$119",
    period: "/mo",
    range: "501 – 2,500",
    rangeLabel: "monthly visitors",
    description: "For businesses already getting traffic and building momentum.",
    features: [
      "Everything in Scout",
      "Priority email support",
      "Quarterly performance review",
      "Minor content updates included",
      "Social media integration",
    ],
    cta: "Get Started",
    track: "cta_pricing_growing",
    highlighted: true,
  },
  {
    name: "Established",
    icon: <Shield {...iconProps} />,
    price: "$219",
    period: "/mo",
    range: "2,501 – 7,500",
    rangeLabel: "monthly visitors",
    description: "For businesses with a steady flow of visitors ready to scale up.",
    features: [
      "Everything in Forager",
      "Advanced SEO optimizations",
      "A/B testing setup",
      "Monthly strategy call",
      "Conversion tracking",
    ],
    cta: "Get Started",
    track: "cta_pricing_established",
    highlighted: false,
  },
  {
    name: "Enterprise",
    icon: <Globe {...iconProps} />,
    price: "Custom",
    period: "",
    range: "7,500+",
    rangeLabel: "monthly visitors",
    description: "Expanding reach across multiple locations or markets at scale.",
    features: [
      "Everything in Keeper",
      "Dedicated support",
      "Custom integrations",
      "Multi-location setup",
      "SLA guarantee",
    ],
    cta: "Contact Us",
    track: "cta_pricing_enterprise",
    highlighted: false,
  },
];

const faqs = [
  {
    q: "How does 'pay-as-you-grow' actually work?",
    a: "We install privacy-friendly analytics on your site to measure monthly unique visitors. At the end of each month, we check your traffic and bill you for the tier you reached. If your traffic drops, your bill drops too — no penalties, no surprises.",
  },
  {
    q: "How much is the 30% retainer?",
    a: "It depends on your project's scope, but most small business sites fall in the $1,700–$2,300 range — meaning your retainer is roughly $500–$700. That's 70% less cash upfront than traditional agencies require. The retainer secures your spot and covers initial design and architecture.",
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
    a: "You don't need to — switching happens automatically based on your traffic. But if you ever want to pause, downgrade, or discuss a custom arrangement, just reach out. We're local and easy to talk to.",
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
        <section className="pricing-hero hex-bg" aria-labelledby="pricing-hero-heading">
          <div className="container">
            <span className="hero-badge">30% Retainer to Start</span>
            <h1 id="pricing-hero-heading">
              Pay As You <span>Grow</span>
            </h1>
            <p className="hero-sub">
              A 30% retainer gets you started. After launch, pay a simple
              monthly fee based on your <strong>actual website traffic</strong>.
              Built specifically for small businesses in the Central Valley
              that need a professional site without draining their capital.
            </p>
            <div className="pricing-hero-stats">
              <div className="pricing-hero-stat">
                <BarChart3 size={20} strokeWidth={2} />
                <span>Traffic-based billing</span>
              </div>
              <div className="pricing-hero-stat">
                <Check size={20} strokeWidth={2} />
                <span>30% retainer to start</span>
              </div>
              <div className="pricing-hero-stat">
                <Check size={20} strokeWidth={2} />
                <span>Downgrades automatic</span>
              </div>
            </div>
          </div>
          <div className="hero-ornament hero-ornament-1" aria-hidden />
          <div className="hero-ornament hero-ornament-2" aria-hidden />
        </section>

        {/* How It Works */}
        <section className="how-it-works" aria-labelledby="how-heading">
          <div className="container">
            <span className="section-label">How It Works</span>
            <h2 id="how-heading">Simple. Fair. Transparent.</h2>
            <p className="section-intro">
              Traditional agencies demand 100% upfront and disappear. We ask
              for a modest 30% retainer to begin your build — then we earn
              the rest month by month as your traffic grows.
            </p>
            <div className="how-steps">
              <div className="how-step">
                <div className="how-step-num">1</div>
                <h3>30% Retainer</h3>
                <p>
                  Based on your project's estimated total cost. For most
                  small business sites, that's roughly $500–$700 to get
                  started — not $5,000.
                </p>
              </div>
              <div className="how-step">
                <div className="how-step-num">2</div>
                <h3>We Build & Launch</h3>
                <p>
                  Custom hand-coded website, tailored to your brand. We
                  install privacy-friendly analytics before go-live.
                </p>
              </div>
              <div className="how-step">
                <div className="how-step-num">3</div>
                <h3>Pay As You Grow</h3>
                <p>
                  After launch, your monthly bill matches your traffic tier.
                  More visitors = more revenue for you. If traffic drops,
                  your bill drops too.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="pricing-tiers" aria-labelledby="tiers-heading">
          <div className="container">
            <span className="section-label">Pricing Plans</span>
            <h2 id="tiers-heading">Choose the Plan That Fits Your Business</h2>
            <p className="section-intro">
              Every tier includes your custom website, hosting, maintenance,
              and support. You simply pay more as your traffic grows — never
              before.
            </p>
            <div className="pricing-grid">
              {tiers.map((tier) => (
                <article
                  key={tier.name}
                  className={`pricing-card ${tier.highlighted ? "pricing-card-highlighted" : ""}`}
                >
                  {tier.highlighted && (
                    <span className="pricing-badge">Most Popular</span>
                  )}
                  <div className="pricing-card-icon" aria-hidden>
                    {tier.icon}
                  </div>
                  <h3>{tier.name}</h3>
                  <div className="pricing-card-price">
                    <span className="price-amount">{tier.price}</span>
                    <span className="price-period">{tier.period}</span>
                  </div>
                  <div className="pricing-card-range">
                    <strong>{tier.range}</strong>{" "}
                    <span>{tier.rangeLabel}</span>
                  </div>
                  <p className="pricing-card-desc">{tier.description}</p>
                  <ul className="pricing-card-features">
                    {tier.features.map((feature) => (
                      <li key={feature}>
                        <Check size={16} strokeWidth={2.5} aria-hidden />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <a
                    href="/#contact"
                    className={`btn ${tier.highlighted ? "btn-primary" : "btn-outline-dark"}`}
                    data-track={tier.track}
                  >
                    {tier.cta} <ArrowRight size={16} strokeWidth={2} />
                  </a>
                </article>
              ))}
            </div>
          </div>
        </section>

        {/* Trust / Comparison */}
        <section className="pricing-trust" aria-labelledby="trust-heading">
          <div className="container">
            <span className="section-label">Why This Model Works</span>
            <h2 id="trust-heading">We Win When You Win</h2>
            <div className="trust-grid">
              <div className="trust-item">
                <strong>Aligned Incentives</strong>
                <p>
                  Traditional agencies get paid whether your site performs or
                  not. Our revenue grows only when your traffic grows — so we
                  are motivated to build you a site that actually attracts
                  customers.
                </p>
              </div>
              <div className="trust-item">
                <strong>Cash-Flow Friendly</strong>
                <p>
                  Small businesses can't drop $5,000 on a website before they
                  know if it will work. Our 30% retainer model lets you invest
                  capital where it matters: inventory, staff, and marketing.
                </p>
              </div>
              <div className="trust-item">
                <strong>No Long-Term Traps</strong>
                <p>
                  No 12-month contracts with penalties. If your traffic drops
                  (seasonal business, slow month), your bill drops too. Stay
                  because it works, not because you're stuck.
                </p>
              </div>
              <div className="trust-item">
                <strong>Predictable Scaling</strong>
                <p>
                  Know exactly what you'll pay at every stage of growth. No
                  surprise invoices for "extra revisions" or "server
                  overages." What you see is what you pay.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="pricing-faq" aria-labelledby="faq-heading">
          <div className="container">
            <span className="section-label">FAQ</span>
            <h2 id="faq-heading">Questions Small Business Owners Ask</h2>
            <div className="faq-list">
              {faqs.map((faq, i) => (
                <details key={i} className="faq-item">
                  <summary>
                    <HelpCircle size={18} strokeWidth={2} aria-hidden />
                    <span>{faq.q}</span>
                  </summary>
                  <p>{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="pricing-cta" aria-labelledby="pricing-cta-heading">
          <div className="container">
            <div className="pricing-box">
              <span className="section-label">Ready to Grow?</span>
              <h2 id="pricing-cta-heading">
                Let's Build Something That Scales With You
              </h2>
              <p>
                Get started on your custom site with just a
                <strong> 30% retainer</strong>. Spots are limited to 3 local
                businesses.
              </p>
              <a
                href="/#contact"
                className="btn btn-primary"
                data-track="cta_pricing_bottom"
              >
                Get Your Free Quote →
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
