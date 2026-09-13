import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";

export const metadata: Metadata = {
  title: "Free Website Audit",
  description: "See what may be hurting your website's search visibility, speed, and customer trust in plain English.",
  alternates: { canonical: "https://hexacombllc.com/website-audit" },
};

export default function WebsiteAuditPage() {
  return (
    <main id="main-content" className="growth-page">
      <section className="growth-page-hero growth-shell growth-audit-hero">
        <div>
          <h1>See what your website is leaving on the table.</h1>
          <p className="growth-page-lead">
            A first look at search, speed, and trust, written for the person who owns the business, not the person who
            built the site.
          </p>
        </div>
        <ul className="growth-audit-signals">
          <li>Would a stranger find it?</li>
          <li>Would they trust it enough to call?</li>
          <li>Can they tap a next step on a phone?</li>
        </ul>
      </section>
      <section id="audit-runner" className="growth-page-dark growth-audit-runner" aria-labelledby="audit-heading">
        <div className="growth-shell">
          <div className="growth-page-heading">
            <h2 id="audit-heading">Start with the page customers see first.</h2>
          </div>
          <WebsiteAuditTool />
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
