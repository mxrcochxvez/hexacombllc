import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Ongoing Website Growth",
  description: "Hexacomb manages, measures, and improves your website every month so it never becomes another neglected business asset.",
  alternates: { canonical: "https://hexacombllc.com/how-it-works" },
};

const loop = [
  ["Manage", "We handle updates, upkeep, performance, and the technical details."],
  ["Measure", "We watch search visibility, visitor behavior, and the path to contact."],
  ["Improve", "We change the pages, copy, and SEO based on what the evidence says."],
];

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell">
        <h1>You do not manage the website. We do.</h1>
        <p className="growth-page-lead">We get close to the business, take responsibility for the site, and keep improving it without waiting for you to create another task.</p>
        <div className="growth-page-actions"><Link href="/#contact" className="growth-button growth-button-signal">Put us to work <ArrowUpRight size={18} aria-hidden /></Link><Link href="/pricing" className="growth-text-link">View plans</Link></div>
      </section>

      <section className="growth-page-dark">
        <div className="growth-shell growth-loop">
          <div className="growth-page-heading"><h2>Manage. Measure. Improve. Repeat.</h2></div>
          <ol>{loop.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol>
        </div>
      </section>

      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>A clean handoff. Then ongoing pressure.</h2></div>
        <div className="growth-onboarding">
          <div><h3>We learn the business</h3><p>Your customers, priorities, current site, and where growth is getting stuck.</p></div>
          <div><h3>We fix what matters first</h3><p>You get a clear priority—not a bloated backlog.</p></div>
          <div><h3>We keep moving</h3><p>Reporting leads directly to the next improvement.</p></div>
        </div>
        <div className="growth-inline-close"><div><Check size={20} aria-hidden /><strong>No mystery. No chasing.</strong><p>You always know what changed and why.</p></div><Link href="/#contact" className="growth-button">Hand over the website <ArrowUpRight size={17} aria-hidden /></Link></div>
      </section>
    </main>
  );
}
