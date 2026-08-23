import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
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
        <div><h1>See what your website is leaving on the table.</h1><p className="growth-page-lead">Get a plain-English look at search visibility, speed, and trust. No login. No technical homework.</p></div>
        <ul className="growth-audit-signals"><li>Can customers find it?</li><li>Does it feel credible?</li><li>Is it losing action?</li></ul>
      </section>
      <section id="audit-runner" className="growth-page-dark growth-audit-runner" aria-labelledby="audit-heading">
        <div className="growth-shell"><div className="growth-page-heading"><h2 id="audit-heading">Start with the page customers see first.</h2></div><WebsiteAuditTool /></div>
      </section>
      <section className="growth-shell growth-page-section growth-audit-close">
        <h2>We turn the findings into work.</h2><p>Hexacomb owns the fixes, watches the response, and keeps improving the site.</p><Link href="/#contact" className="growth-button growth-button-signal">Talk through my website <ArrowUpRight size={18} aria-hidden /></Link>
      </section>
    </main>
  );
}
