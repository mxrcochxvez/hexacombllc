import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "Website Management Plans",
  description: "Straightforward monthly website plans for maintenance, analytics, SEO, content updates, and ongoing growth.",
  alternates: { canonical: "https://hexacombllc.com/pricing" },
};

const tiers = [
  { name: "Starter", price: "$50", note: "Keep the essentials handled.", features: ["Up to 5 pages", "SEO basics + accessibility", "Hosting, SSL + maintenance", "Contact form + email support"] },
  { name: "Growing", price: "$70", note: "Add visibility into the site.", features: ["Everything in Starter", "Up to about 10 pages", "Analytics + simple dashboard", "Minor monthly content updates", "Quarterly check-in"], popular: true },
  { name: "Established", price: "$120", note: "Put the website in attack mode.", features: ["Everything in Growing", "Ongoing SEO improvements", "Conversion tracking", "More content updates", "Integrations + monthly strategy call"], growth: true },
  { name: "Enterprise", price: "Custom", note: "For complex operations.", features: ["Everything in Established", "Multi-location or multi-site", "Custom integrations + reporting", "Dedicated support + SLA"] },
];

export default function PricingPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell">
        <h1>Choose how hard the website works.</h1>
        <p className="growth-page-lead">Every plan keeps the site online and maintained. Growth plans add the analytics, updates, and SEO pressure that move it forward.</p>
      </section>
      <section className="growth-page-dark growth-pricing-section" aria-labelledby="plans-heading">
        <div className="growth-shell"><h2 id="plans-heading" className="sr-only">Website plans</h2><div className="growth-pricing-grid">
          {tiers.map((tier) => (
            <article key={tier.name} className={`growth-price-card ${tier.growth ? "growth-price-card-featured" : ""}`}>
              <div className="growth-price-head">{tier.popular && <span>Popular</span>}{tier.growth && <span>Best for growth</span>}<h3>{tier.name}</h3><p>{tier.note}</p><strong>{tier.price}{tier.price !== "Custom" && <small>/mo</small>}</strong></div>
              <ul>{tier.features.map((feature) => <li key={feature}><Check size={15} aria-hidden />{feature}</li>)}</ul>
              <Link href="/#contact" className="growth-button">Choose {tier.name} <ArrowUpRight size={16} aria-hidden /></Link>
            </article>
          ))}
        </div></div>
      </section>
      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>Clear scope. Easy upgrades. No annual lock-in.</h2></div>
        <div className="growth-terms-mini"><p><strong>Every plan includes</strong> hosting, SSL, maintenance, backups, and support.</p><p><strong>Need more later?</strong> Move up when analytics, SEO, or more updates make sense.</p><p><strong>Outside the plan?</strong> You see the quote before the work starts.</p></div>
      </section>
    </main>
  );
}
