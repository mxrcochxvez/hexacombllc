import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Check } from "lucide-react";

export const metadata: Metadata = {
  title: "How It Works | Website Care Made Simple",
  description: "Hexacomb keeps your website updated, helps customers find you, and makes practical improvements every month.",
  alternates: { canonical: "https://hexacombllc.com/how-it-works" },
};

const loop = [
  ["Take care of it", "We handle updates, upkeep, speed, and the technical details behind the scenes."],
  ["See what is working", "We review how people find your site, what they do there, and how they get in touch."],
  ["Make it better", "We improve pages, messaging, and search visibility based on what will help most."],
];

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell">
        <h1>You have a business to run. We keep the website handled.</h1>
        <p className="growth-page-lead">We learn what matters to your business, take responsibility for the website, and keep making practical improvements without making you manage another project.</p>
        <div className="growth-page-actions"><Link href="/#contact" className="growth-button growth-button-signal">Talk about your website <ArrowUpRight size={18} aria-hidden /></Link><Link href="/pricing" className="growth-text-link">See plans</Link></div>
      </section>

      <section className="growth-page-dark">
        <div className="growth-shell growth-loop">
          <div className="growth-page-heading"><h2>Take care of it. Understand it. Improve it.</h2></div>
          <ol>{loop.map(([title, body]) => <li key={title}><h3>{title}</h3><p>{body}</p></li>)}</ol>
        </div>
      </section>

      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>A simple start, then steady support.</h2></div>
        <div className="growth-onboarding">
          <div><h3>We learn about your business</h3><p>Your customers, goals, current website, and what you want it to do better.</p></div>
          <div><h3>We start with what matters most</h3><p>You get one clear first priority, not a long technical to-do list.</p></div>
          <div><h3>We keep improving</h3><p>Each check-in helps decide the next useful update.</p></div>
        </div>
        <div className="growth-inline-close"><div><Check size={20} aria-hidden /><strong>Clear updates. No chasing people down.</strong><p>You will always know what changed and why it matters.</p></div><Link href="/#contact" className="growth-button">Get website support <ArrowUpRight size={17} aria-hidden /></Link></div>
      </section>
    </main>
  );
}
