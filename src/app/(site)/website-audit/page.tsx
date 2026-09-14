import type { Metadata } from "next";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";

export const metadata: Metadata = {
  title: "Free Website Audit",
  description: "See what may be hurting your website's search visibility, speed, and customer trust in plain English.",
  alternates: { canonical: "https://hexacombllc.com/website-audit" },
};

export default function WebsiteAuditPage() {
  return (
    <main id="main-content" className="hobro-page">
      <AgencyPageHero
        kicker="Free audit"
        title="See what your website is leaving on the table."
        lead="A first look at search, speed, and trust, written for the person who owns the business, not the person who built the site."
        aside={
          <ul className="hobro-signals">
            <li>Would a stranger find it?</li>
            <li>Would they trust it enough to call?</li>
            <li>Can they tap a next step on a phone?</li>
          </ul>
        }
      />
      <section id="audit-runner" className="hobro-white hobro-band" aria-labelledby="audit-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">First page</p>
            <h2 id="audit-heading">Start with the page customers see first.</h2>
          </div>
          <WebsiteAuditTool />
        </div>
      </section>
      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-terms">
            <p>
              <strong>No website yet?</strong> Audit a competitor you admire,
              then mention your Instagram in the contact note. We will start
              from what is working for them and build yours to beat it.
            </p>
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
