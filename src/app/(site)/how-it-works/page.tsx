import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import CtaSection from "@/components/CtaSection";
import WebsiteCareLoop from "@/components/WebsiteCareLoop";

export const metadata: Metadata = {
  title: "How It Works | Website Care Made Simple",
  description: "Hexacomb keeps your website updated, helps customers find you, and makes practical improvements every month.",
  alternates: { canonical: "https://hexacombllc.com/how-it-works" },
};

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell">
        <h1>You have a business to run. We keep the website handled.</h1>
        <p className="growth-page-lead">We learn what matters to your business, take responsibility for the website, and keep making practical improvements without making you manage another project.</p>
        <div className="growth-page-actions"><Link href="#contact" className="growth-button growth-button-signal">Talk about your website <ArrowUpRight size={18} aria-hidden /></Link><Link href="/pricing" className="growth-text-link">See plans</Link></div>
      </section>

      <WebsiteCareLoop />

      <section className="growth-shell growth-page-section">
        <div className="growth-page-heading"><h2>A simple start, then steady support.</h2></div>
        <div className="growth-onboarding">
          <div><h3>We learn about your business</h3><p>Your customers, goals, current website, and what you want it to do better.</p></div>
          <div><h3>We start with what matters most</h3><p>You get one clear first priority, not a long technical to-do list.</p></div>
          <div><h3>We keep improving</h3><p>Each check-in helps decide the next useful update.</p></div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
