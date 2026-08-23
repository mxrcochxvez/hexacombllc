import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Care Plans",
  description: "Straightforward monthly website plans for keeping your site updated, helping customers find you, and improving it over time.",
  alternates: { canonical: "https://hexacombllc.com/pricing" },
};

const tiers = [
  { name: "Starter", price: "$50", note: "Keep the website essentials handled.", features: ["Up to 5 pages", "Search basics + accessibility", "Hosting, SSL + maintenance", "Contact form + email support"] },
  { name: "Growing", price: "$70", note: "Understand your website and keep it fresh.", features: ["Everything in Starter", "Up to about 10 pages", "Simple website reporting", "Small monthly content updates", "Quarterly check-in"], popular: true },
  { name: "Established", price: "$120", note: "Make steady improvements that support growth.", features: ["Everything in Growing", "Ongoing search improvements", "Track customer inquiries", "More content updates", "Integrations + monthly planning call"], growth: true },
  { name: "Enterprise", price: "Custom", note: "For larger or more complex businesses.", features: ["Everything in Established", "More than one location or website", "Custom integrations + reporting", "Dedicated support + SLA"] },
];

export default function PricingPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell">
        <h1>Choose the level of website support that fits your business.</h1>
        <p className="growth-page-lead">Every plan keeps your website online, secure, and maintained. Higher plans include more updates, simple reporting, and help getting found online.</p>
      </section>
      <section className="growth-page-dark growth-pricing-section" aria-labelledby="plans-heading">
        <div className="growth-shell"><h2 id="plans-heading" className="sr-only">Website care plans</h2><div className="growth-pricing-grid">
          {tiers.map((tier) => (
            <article key={tier.name} className={`growth-price-card ${tier.growth ? "growth-price-card-featured" : ""}`}>
              <div className="growth-price-head">{tier.popular && <span>Popular</span>}{tier.growth && <span>Best for growing businesses</span>}<h3>{tier.name}</h3><p>{tier.note}</p><strong>{tier.price}{tier.price !== "Custom" && <small>/mo</small>}</strong></div>
              <ul>{tier.features.map((feature) => <li key={feature}><Check size={15} aria-hidden />{feature}</li>)}</ul>
              <Link href="/#contact" className="growth-button">Ask about {tier.name} <ArrowUpRight size={16} aria-hidden /></Link>
            </article>
          ))}
        </div></div>
      </section>
      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>Clear scope. Easy upgrades. No annual lock-in.</h2></div>
        <div className="growth-terms-mini"><p><strong>Every plan includes</strong> hosting, SSL, maintenance, backups, and support.</p><p><strong>Need more help later?</strong> Move up when you are ready for more updates, reporting, or search support.</p><p><strong>Need something outside your plan?</strong> You will see the quote before the work starts.</p></div>
      </section>
    </main>
  );
}
