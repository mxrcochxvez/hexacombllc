import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";
import RevealSection from "@/components/RevealSection";

export const metadata: Metadata = {
  title: "Website Audit",
  description:
    "Run a plain-English website audit for SEO, load time, and trust issues. Built for small business owners who need clear website answers without technical jargon.",
  alternates: {
    canonical: "https://hexacombllc.com/website-audit",
  },
};

export default function WebsiteAuditPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Website Audit | Hexacomb",
    url: "https://hexacombllc.com/website-audit",
    description:
      "A plain-English website audit for small business owners covering SEO, load time, and customer trust issues.",
    isPartOf: {
      "@id": "https://hexacombllc.com/#website",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <section className="audit-hero" aria-labelledby="audit-hero-heading">
          <div className="container audit-hero-grid">
            <div>
              <h1 id="audit-hero-heading">
                Find Out If Your Website Is{" "}
                <span>Helping or Hurting Sales</span>
              </h1>
              <p className="audit-hero-sub">
                Enter a website and get a plain-English scan of the basics CEOs care
                about: whether customers can find you, whether the site feels slow,
                and whether anything obvious is damaging trust.
              </p>
              <div className="audit-hero-actions">
                <a href="#audit-tool" className="btn btn-primary" data-track="cta_audit_hero">
                  Audit My Site
                </a>
                <span className="audit-hero-note">Free. No login required.</span>
              </div>
            </div>
            <div className="audit-hero-preview" aria-hidden>
              <p className="audit-preview-caption">From a typical scan</p>
              <ul className="audit-preview-list">
                <li>
                  <span className="audit-pill audit-pill-costing-you-leads">Costing you leads</span>
                  <strong>Missing local business context</strong>
                  <span>Google can&rsquo;t connect this page to Fresno searches.</span>
                </li>
                <li>
                  <span className="audit-pill audit-pill-needs-attention">Needs attention</span>
                  <strong>Slow first response on mobile</strong>
                  <span>Customers on phones wait before they can take action.</span>
                </li>
                <li>
                  <span className="audit-pill audit-pill-strong">Strong</span>
                  <strong>SSL certificate active</strong>
                  <span>The site is secure. No trust warnings on load.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

        <RevealSection className="audit-intro" ariaLabelledBy="audit-intro-heading">
          <div className="container">
            <h2 id="audit-intro-heading">A Website Audit for Business Decisions</h2>
            <p className="section-intro">
              The report avoids developer language and focuses on the questions that
              matter in a sales conversation.
            </p>
            <ol className="audit-what-list">
              {[
                {
                  num: "01",
                  title: "SEO Clarity",
                  body: "Can Google understand what the business does, where it serves, and why a customer should click?",
                },
                {
                  num: "02",
                  title: "Load-Time Risk",
                  body: "Does the first page response feel quick, or is the site asking customers to wait before they can take action?",
                },
                {
                  num: "03",
                  title: "Trust Issues",
                  body: "Does the site show obvious problems with security, accessibility, mobile setup, or social previews?",
                },
              ].map((item, i) => (
                <li
                  className="audit-what-item reveal-item"
                  key={item.title}
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <span className="audit-what-num">{item.num}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </RevealSection>

        <RevealSection className="audit-runner" id="audit-tool" ariaLabelledBy="audit-runner-heading">
          <div className="container">
            <div className="audit-runner-heading">
              <div>
                <h2 id="audit-runner-heading">See the Website Through a Customer&rsquo;s Eyes</h2>
              </div>
              <p>
                This is a first-page scan, not a full crawl. It gives you the
                conversation starter: what is strong, what is risky, and what should
                be fixed first.
              </p>
            </div>
            <WebsiteAuditTool />
          </div>
        </RevealSection>

        <section className="audit-cta" aria-labelledby="audit-cta-heading">
          <div className="container">
            <div className="pricing-box">
              <BarChart3 size={32} strokeWidth={1.8} aria-hidden />
              <p className="brand-kicker">Next Step</p>
              <h2 id="audit-cta-heading">Turn the Findings Into a Better Website</h2>
              <p>
                A scan can identify symptoms. Hexacomb turns those symptoms into a
                fast, credible site that makes the business easier to find and easier
                to trust.
              </p>
              <Link href="/#contact" className="btn btn-primary" data-track="cta_audit_contact">
                Talk Through My Results
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
