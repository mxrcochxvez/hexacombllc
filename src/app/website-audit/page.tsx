import type { Metadata } from "next";
import Link from "next/link";
import { BarChart3, Eye, Search, Timer } from "lucide-react";
import WebsiteAuditTool from "@/components/WebsiteAuditTool";
import RevealSection from "@/components/RevealSection";

const iconProps = { size: 28, strokeWidth: 1.75 };

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
        <section className="audit-hero hex-bg" aria-labelledby="audit-hero-heading">
          <div className="container audit-hero-grid">
            <div>
              <span className="hero-badge">Free First-Pass Website Audit</span>
              <h1 id="audit-hero-heading">
                Find Out If Your Website Is <span>Helping or Hurting Sales</span>
              </h1>
              <p className="hero-sub">
                Enter a website and get a plain-English scan of the basics CEOs care
                about: whether customers can find you, whether the site feels slow,
                and whether anything obvious is damaging trust.
              </p>
              <a href="#audit-tool" className="btn btn-primary" data-track="cta_audit_hero">
                Audit My Site
              </a>
            </div>
            <div className="audit-hero-panel" aria-hidden>
              <div className="audit-mini-score">72</div>
              <div>
                <strong>Potential revenue leak</strong>
                <span>Slow mobile response</span>
              </div>
              <div>
                <strong>Search gap</strong>
                <span>Missing local business context</span>
              </div>
              <div>
                <strong>Trust issue</strong>
                <span>Weak share preview</span>
              </div>
            </div>
          </div>
          <div className="hero-ornament hero-ornament-1" aria-hidden />
          <div className="hero-ornament hero-ornament-2" aria-hidden />
        </section>

        <RevealSection className="audit-intro" ariaLabelledBy="audit-intro-heading">
          <div className="container">
            <p className="brand-kicker">What It Checks</p>
            <h2 id="audit-intro-heading">A Website Audit for Business Decisions</h2>
            <p className="section-intro">
              The report avoids developer language and focuses on the questions that
              matter in a sales conversation.
            </p>
            <div className="cards audit-intro-cards">
              {[
                {
                  icon: <Search {...iconProps} />,
                  title: "SEO Clarity",
                  body: "Can Google understand what the business does, where it serves, and why a customer should click?",
                },
                {
                  icon: <Timer {...iconProps} />,
                  title: "Load-Time Risk",
                  body: "Does the first page response feel quick, or is the site asking customers to wait before they can take action?",
                },
                {
                  icon: <Eye {...iconProps} />,
                  title: "Trust Issues",
                  body: "Does the site show obvious problems with security, accessibility, mobile setup, or social previews?",
                },
              ].map((card, i) => (
                <article
                  className="card reveal-item"
                  key={card.title}
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <div className="card-icon" aria-hidden>
                    {card.icon}
                  </div>
                  <h3>{card.title}</h3>
                  <p>{card.body}</p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        <RevealSection className="audit-runner" id="audit-tool" ariaLabelledBy="audit-runner-heading">
          <div className="container">
            <div className="audit-runner-heading">
              <div>
                <p className="brand-kicker">Run the Scan</p>
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
