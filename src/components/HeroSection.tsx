import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WebsiteWorkStack from "@/components/WebsiteWorkStack";

export default function HeroSection() {
  return (
    <section className="growth-hero" aria-labelledby="hero-heading">
      <div className="growth-shell growth-hero-grid">
        <div className="growth-hero-copy">
          <h1 id="hero-heading">You run the business.<span> We take care of your website.</span></h1>
          <p>We keep your website up to date, easy to find online, and clear for the people ready to become customers.</p>
          <div className="growth-hero-actions">
            <Link href="#contact" className="growth-button growth-button-signal" data-track="hero_growth_conversation">
              Let&apos;s talk about my website <ArrowUpRight size={19} aria-hidden />
            </Link>
            <Link href="/website-audit" className="growth-text-link" data-track="hero_website_audit">See how my current site is doing</Link>
          </div>
          <p className="growth-hero-location">Founder-led in Fresno. You work directly with the person doing the work.</p>
        </div>
        <WebsiteWorkStack />
      </div>
    </section>
  );
}
