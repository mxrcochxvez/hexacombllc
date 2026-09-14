import type { Metadata } from "next";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "Website Care Plans",
  description: "Straightforward monthly website plans for keeping your site updated, helping customers find you, and improving it over time.",
  alternates: { canonical: "https://hexacombllc.com/pricing" },
};

const tiers = [
  {
    name: "Starter",
    price: "$50",
    note: "Keep the website essentials handled.",
    features: ["Up to 5 pages", "Search basics + accessibility", "Hosting, SSL + maintenance", "Contact form + email support"],
  },
  {
    name: "Growing",
    price: "$70",
    note: "Understand your website and keep it fresh.",
    features: ["Up to about 10 pages", "Search basics + accessibility", "Hosting, SSL + maintenance", "Contact form + email support", "Simple website reporting", "Small monthly content updates", "Quarterly check-in"],
    kicker: "Popular",
  },
  {
    name: "Established",
    price: "$120",
    note: "Make steady improvements that support growth.",
    features: ["Up to about 10 pages, then room to grow", "Ongoing search improvements", "Track customer inquiries", "More content updates", "Hosting, SSL + maintenance", "Simple website reporting", "Integrations + monthly planning call"],
    kicker: "Best for growing businesses",
  },
  {
    name: "Enterprise",
    price: "Custom",
    note: "For larger or more complex businesses.",
    features: ["More than one location or website", "Custom integrations + reporting", "Dedicated support + SLA", "Ongoing search improvements", "Track customer inquiries"],
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
      <AgencyPageHero
        kicker="Pricing"
        title="Choose the level of website support that fits your business."
        lead={
          <>
            <p>
              Every plan keeps your website online, secure, and maintained.
              Higher plans include more updates, simple reporting, and help
              getting found online.
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
              <article key={tier.name} className="hobro-price-card">
                <span>{tier.kicker ?? ""}</span>
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
                  className="hobro-deck-btn"
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
      <CtaSection initialMessage={planMessage} />
    </main>
  );
}
