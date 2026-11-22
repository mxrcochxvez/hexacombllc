import { pageSocialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyPageHero";
import CtaSection from "@/components/CtaSection";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";

const title = "Free Website & SEO Audit Tool for Small Businesses";
const description =
  "Run a free plain-English website audit to see what may be hurting your Google visibility, page speed, mobile usability, and customer trust.";

export const metadata: Metadata = {
  ...pageSocialMetadata("/website-audit", `${title} | Hexacomb`, description),
  title,
  description,
  alternates: { canonical: "https://hexacombllc.com/website-audit" },
};

const auditSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Hexacomb Free Website & SEO Audit Tool",
      url: "https://hexacombllc.com/website-audit",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Any",
      description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
      provider: { "@id": "https://hexacombllc.com/#organization" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hexacombllc.com/" },
        { "@type": "ListItem", position: 2, name: "Free Website Audit", item: "https://hexacombllc.com/website-audit" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What does this free website audit check?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It loads your public homepage and checks how it appears in Google search results, page titles and headings, mobile readiness, response speed, HTTPS security, and whether a first-time visitor can easily find how to call or contact you.",
          },
        },
        {
          "@type": "Question",
          name: "Do I have to enter my email to see my website audit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Your report loads immediately on the page with no email gate. If you want help prioritizing or fixing what it finds, you can send the summary to Marco below.",
          },
        },
        {
          "@type": "Question",
          name: "Can I audit a competitor’s website if I don’t have one yet?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Enter any public website URL to see what is working well for a local competitor and where there is room to stand out.",
          },
        },
      ],
    },
  ],
};

export default function WebsiteAuditPage() {
  return (
    <main id="main-content" className="hobro-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(auditSchema) }}
      />
      <AgencyPageHero
        kicker="Free website audit"
        title="Free Website Audit: See What’s Holding Your Site Back."
        lead="A plain-English check of your search visibility, speed, and customer trust—written for the person who owns the business, not the person who built the site."
        aside={
          <ul className="hobro-signals">
            <li>Would a stranger find it on Google?</li>
            <li>Would they trust it enough to call?</li>
            <li>Can they tap a next step on a phone?</li>
          </ul>
        }
      />
      <section id="audit-runner" className="hobro-white hobro-band" aria-labelledby="audit-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Instant first-pass check</p>
            <h2 id="audit-heading">Start with the page customers see first.</h2>
          </div>
          <WebsiteAuditTool />
        </div>
      </section>
      <section className="hobro-white hobro-band" aria-labelledby="audit-what-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">What the audit checks</p>
            <h2 id="audit-what-heading">Four areas that decide whether visitors call.</h2>
          </div>
          <div className="hobro-offer-table">
            <article>
              <h3>Search &amp; Google snippet</h3>
              <p>
                Checks your page title, meta description, main heading, and canonical tag—and shows a live preview of how your business looks when someone searches Google.
              </p>
            </article>
            <article>
              <h3>Speed &amp; mobile usability</h3>
              <p>
                Measures server response time and mobile viewport setup so customers on phones in Fresno, Clovis, or on the road do not bounce before the page loads.
              </p>
            </article>
            <article>
              <h3>Trust &amp; security basics</h3>
              <p>
                Verifies HTTPS security, image accessibility text, and clear business signals that help a first-time visitor feel comfortable reaching out.
              </p>
            </article>
            <article>
              <h3>Clear next steps</h3>
              <p>
                Looks for obvious call, estimate, or contact paths—then ranks what to fix first in plain English, whether you handle it yourself or ask us to help.
              </p>
            </article>
          </div>
        </div>
      </section>
      <section className="hobro-white hobro-band" aria-labelledby="audit-faq-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Common questions</p>
            <h2 id="audit-faq-heading">How this free SEO checker works.</h2>
          </div>
          <div className="hobro-faq">
            <details name="audit-faq" open>
              <summary>What does this free website audit check?</summary>
              <p>
                It loads your public homepage and checks how it appears in Google search results, page titles and headings, mobile readiness, response speed, HTTPS security, and whether a first-time visitor can easily find how to call or contact you.
              </p>
            </details>
            <details name="audit-faq">
              <summary>Do I have to enter my email to see my website audit?</summary>
              <p>
                No. Your report loads immediately on the page with no email gate. If you want help prioritizing or fixing what it finds, you can send the summary to Marco below.
              </p>
            </details>
            <details name="audit-faq">
              <summary>Can I audit a competitor’s website if I don’t have one yet?</summary>
              <p>
                Yes. Audit a competitor you admire, then{" "}
                <Link href="#contact">mention your business or Instagram below</Link>. We will start from what is working for them and build yours to beat it.
              </p>
            </details>
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
