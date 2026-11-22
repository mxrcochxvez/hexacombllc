import { pageSocialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyPageHero";
import CtaSection from "@/components/CtaSection";

const title = "Website Design & Monthly Care Pricing (Fresno & Clovis)";
const description =
  "Straightforward monthly website care plans ($50–$120/mo) for hosting, updates, and local SEO—plus one-time custom website builds quoted clearly before work starts.";

export const metadata: Metadata = {
  ...pageSocialMetadata("/pricing", `${title} | Hexacomb`, description),
  title,
  description,
  alternates: { canonical: "https://hexacombllc.com/pricing" },
};

const pricingSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hexacombllc.com/" },
        { "@type": "ListItem", position: 2, name: "Pricing", item: "https://hexacombllc.com/pricing" },
      ],
    },
    {
      "@type": "OfferCatalog",
      name: "Hexacomb Website Care Plans",
      url: "https://hexacombllc.com/pricing",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Starter Website Care Plan",
          price: "50",
          priceCurrency: "USD",
          description: "Up to 5 pages, hosting, SSL, maintenance, search basics, accessibility, and email support.",
        },
        {
          "@type": "Offer",
          name: "Growing Website Care Plan",
          price: "70",
          priceCurrency: "USD",
          description: "Up to 10 pages, hosting, SSL, maintenance, simple website reporting, small monthly content updates, and quarterly check-in.",
        },
        {
          "@type": "Offer",
          name: "Established Website Care Plan",
          price: "120",
          priceCurrency: "USD",
          description: "Up to 10+ pages, ongoing local SEO improvements, inquiry tracking, more content updates, integrations, and monthly planning call.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is a new website included in the monthly price?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. A new website is a one-time build, quoted separately based on its pages, content and functionality. The monthly prices are for ongoing hosting, updates and care.",
          },
        },
        {
          "@type": "Question",
          name: "What does a care plan include?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Every plan includes hosting, SSL, maintenance, backups and support. Starter covers the essentials. Growing adds simple reporting, small monthly content updates and a quarterly check-in. Established includes ongoing search improvements, inquiry tracking, more content updates, integrations and a monthly planning call.",
          },
        },
      ],
    },
  ],
};

const tiers = [
  {
    name: "Starter",
    price: "$50",
    note: "Keep the website essentials handled.",
    features: ["Up to 5 pages", "Search basics + accessibility", "Hosting, SSL + maintenance", "Contact form + email support"],
    featured: false,
  },
  {
    name: "Growing",
    price: "$70",
    note: "Understand your website and keep it fresh.",
    features: ["Everything in Starter, plus:", "Up to about 10 pages", "Simple website reporting", "Small monthly content updates", "Quarterly check-in"],
    kicker: "Most popular",
    featured: true,
  },
  {
    name: "Established",
    price: "$120",
    note: "Make steady improvements that support growth.",
    features: ["Everything in Growing, plus:", "Ongoing search improvements", "Track customer inquiries", "More monthly content updates", "Integrations + monthly planning call"],
    kicker: "Best for growing businesses",
    featured: false,
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "For larger or more complex businesses.",
    features: ["More than one location or website", "Custom integrations + reporting", "Dedicated support + SLA", "Ongoing search improvements", "Track customer inquiries"],
    featured: false,
  },
];

export default async function PricingPage({
  searchParams,
}: {
  searchParams?: Promise<{ plan?: string }>;
}) {
  const plan = (await searchParams)?.plan;
  const planMessage = plan
    ? `I'm interested in the ${plan} plan. Here's where my website stands: `
    : undefined;
  return (
    <main id="main-content" className="hobro-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(pricingSchema) }}
      />
      <AgencyPageHero
        kicker="Pricing"
        title="Choose the level of website support that fits your business."
        lead={
          <>
            <p>
              These are monthly hosting and care plans, not the cost of
              building a new website. Every plan keeps your website online,
              secure, and maintained. Higher plans include more updates,
              simple reporting, and ongoing help with search visibility.
            </p>
            <p>
              <strong>Need a new website first?</strong> That is a one-time
              build, quoted in one call. Most small-business sites launch in a
              few weeks. A care plan below then keeps it working.{" "}
              <Link href="#contact" className="hobro-text-link">
                Ask about a new build
              </Link>
            </p>
            <p>
              <strong>Not sure what you need?</strong>{" "}
              <Link href="/website-audit" className="hobro-text-link">
                Run the free audit first
              </Link>
            </p>
          </>
        }
      />

      <section className="hobro-white hobro-band" aria-labelledby="plans-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Care plans</p>
            <h2 id="plans-heading">Straightforward monthly support.</h2>
          </div>
          <div className="hobro-price-grid">
            {tiers.map((tier) => (
              <article
                key={tier.name}
                className={
                  tier.featured
                    ? "hobro-price-card hobro-price-card-featured"
                    : "hobro-price-card"
                }
              >
                {tier.kicker ? <span>{tier.kicker}</span> : null}
                <h3>{tier.name}</h3>
                <p>{tier.note}</p>
                <strong>
                  {tier.price}
                  {tier.price !== "Custom" ? <small>/mo</small> : null}
                </strong>
                <ul>
                  {tier.features.map((feature) => (
                    <li key={feature}>{feature}</li>
                  ))}
                </ul>
                <Link
                  href={`?plan=${encodeURIComponent(tier.name)}#contact`}
                  className={
                    tier.featured
                      ? "hobro-deck-btn hobro-deck-btn-solid"
                      : "hobro-deck-btn"
                  }
                  data-track={`pricing_ask_${tier.name.toLowerCase()}`}
                >
                  Ask about {tier.name}
                </Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Terms</p>
            <h2>Clear scope. Easy upgrades. No annual lock-in.</h2>
          </div>
          <div className="hobro-terms">
            <p>
              <strong>Every plan includes</strong> hosting, SSL, maintenance,
              backups, and support.
            </p>
            <p>
              <strong>You own your domain and content.</strong> Care plans have
              no annual lock-in. Move up, down, or out when it makes sense.
            </p>
            <p>
              <strong>Need more help later?</strong> Move up when you are ready
              for more updates, reporting, or search support.
            </p>
            <p>
              <strong>Need something outside your plan?</strong> You will see
              the quote before the work starts.
            </p>
          </div>
        </div>
      </section>
      <section className="hobro-white hobro-band" aria-labelledby="pricing-questions-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Before you choose</p>
            <h2 id="pricing-questions-heading">Build costs and ongoing care.</h2>
          </div>
          <div className="hobro-terms">
            <div>
              <h3>Is a new website included in the monthly price?</h3>
              <p>
                No. A new website is a one-time build, quoted separately based
                on its pages, content and functionality. The monthly prices
                above are for ongoing care.{" "}
                <Link href="/website-design">Explore website design</Link> or{" "}
                <Link href="#contact">request a website quote</Link>.
              </p>
            </div>
            <div>
              <h3>What does a care plan include?</h3>
              <p>
                Every plan includes hosting, SSL, maintenance, backups and
                support. Starter covers the essentials. Growing adds simple
                reporting, small monthly content updates and a quarterly
                check-in. Established includes ongoing search improvements,
                inquiry tracking, more content updates, integrations and a
                monthly planning call. Enterprise scope is agreed individually.
                The plan details above show the current inclusions.
              </p>
            </div>
          </div>
        </div>
      </section>
      <CtaSection initialMessage={planMessage} />
    </main>
  );
}
