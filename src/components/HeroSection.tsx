import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WebsiteWorkStack from "@/components/WebsiteWorkStack";

export default function HeroSection() {
  return (
    <section className="growth-hero" aria-labelledby="hero-heading">
      <div className="growth-shell growth-hero-grid">
        <div className="growth-hero-copy">
          <h1 id="hero-heading">You run the business.<span> We run the website.</span></h1>
          <p>Hexacomb manages your site, attacks SEO, reads the reports, and improves the copy—month after month.</p>
          <div className="growth-hero-actions">
            <Link href="#contact" className="growth-button growth-button-signal" data-track="hero_growth_conversation">
              Take it off my plate <ArrowUpRight size={19} aria-hidden />
            </Link>
            <Link href="/website-audit" className="growth-text-link" data-track="hero_website_audit">Check my current site</Link>
          </div>
          <p className="growth-hero-location">Founder-led in Fresno. No account-manager relay.</p>
        </div>
        <WebsiteWorkStack />
      </div>
    </section>
  );
}
