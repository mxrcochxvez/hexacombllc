import type { Metadata } from "next";
import {
  Clock,
  Smartphone,
  Search,
  AlertTriangle,
  Palette,
  Globe,
  Accessibility,
  Zap,
  MapPin,
} from "lucide-react";
import { ContactFormClient } from "@/components/ContactFormClient";

const baseUrl = "https://hexacombllc.com";

const iconProps = { size: 28, strokeWidth: 1.75 };

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hexacomb — Websites for Fresno & Clovis Small Businesses",
    description: "Custom websites for Fresno and Clovis small businesses — built fast by a local developer you can actually call. No templates, no jargon.",
    url: baseUrl,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb — Websites for Fresno & Clovis Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb — Websites for Fresno & Clovis Small Businesses",
    description: "Custom websites for Fresno and Clovis small businesses — built fast by a local developer you can actually call. No templates, no jargon.",
    images: ["/hexacomb_logo_wordmark.png"],
  },
};

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hexacombllc.com/#organization",
        name: "Hexacomb LLC",
        url: "https://hexacombllc.com",
        logo: "https://hexacombllc.com/hexacomb_logo_wordmark.png",
        description:
          "Modern websites for local businesses in Fresno, Clovis, and the Central Valley. Custom, high-performance websites delivered lightning fast.",
        foundingDate: "2025",
        areaServed: {
          "@type": "City",
          name: "Fresno",
          sameAs: "https://en.wikipedia.org/wiki/Fresno,_California",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          areaServed: ["US-CA"],
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://hexacombllc.com/#localbusiness",
        name: "Hexacomb LLC",
        url: "https://hexacombllc.com",
        image: "https://hexacombllc.com/hexacomb_logo_wordmark.png",
        description:
          "Custom web design and development for local businesses in Fresno, Clovis, and the Central Valley.",
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: 36.7378,
            longitude: -119.7871,
          },
          geoRadius: "100000",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Fresno",
          addressRegion: "CA",
          addressCountry: "US",
        },
        priceRange: "$$",
      },
      {
        "@type": "WebSite",
        "@id": "https://hexacombllc.com/#website",
        url: "https://hexacombllc.com",
        name: "Hexacomb — Modern Websites for the Central Valley",
        description:
          "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast.",
        publisher: {
          "@id": "https://hexacombllc.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://hexacombllc.com/#webpage",
        url: "https://hexacombllc.com",
        name: "Hexacomb — Modern Websites for the Central Valley | Built Fast",
        description:
          "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast.",
        isPartOf: {
          "@id": "https://hexacombllc.com/#website",
        },
        about: {
          "@id": "https://hexacombllc.com/#organization",
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://hexacombllc.com/hexacomb_logo_wordmark.png",
          width: 1200,
          height: 630,
        },
      },
      {
        "@type": "BreadcrumbList",
        "@id": "https://hexacombllc.com/#breadcrumb",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://hexacombllc.com",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* Hero */}
        <section className="hero hex-bg" aria-labelledby="hero-heading">
          <div className="container">
            <span className="hero-badge">Built in the 559 — Fresno & Clovis</span>
            <h1 id="hero-heading">
              Modernizing the Central Valley <span>at Digital Speed</span>
            </h1>
            <p className="hero-sub">
              Custom, high-performance websites for local businesses in
              Fresno, Clovis, and beyond. Traditional agencies take months —
              we deliver <strong>lightning fast</strong>.
            </p>
            <a
              href="#contact"
              className="btn btn-primary"
              aria-label="Get your free quote"
              data-track="cta_hero_fast_track"
            >
              Get Your Free Quote →
            </a>
            <div className="hero-stats" aria-label="Key metrics">
              <div className="hero-stat">
                <span className="hero-stat-num" aria-hidden>
                  Fast
                </span>
                <span className="hero-stat-label">
                  Modern
                  <br />
                  Build
                </span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num" aria-hidden>
                  100%
                </span>
                <span className="hero-stat-label">
                  Custom
                  <br />
                  Design
                </span>
              </div>
              <div className="hero-stat">
                <span className="hero-stat-num" aria-hidden>
                  3
                </span>
                <span className="hero-stat-label">
                  Partner Spots
                  <br />
                  Available
                </span>
              </div>
            </div>
          </div>
          <div className="hero-ornament hero-ornament-1" aria-hidden />
          <div className="hero-ornament hero-ornament-2" aria-hidden />
        </section>

        {/* The Local Problem */}
        <section className="problem" aria-labelledby="problem-heading">
          <div className="container">
            <span className="section-label">The Local Problem</span>
            <div className="problem-grid">
              <div>
                <h2 id="problem-heading">
                  Fresno Isn&rsquo;t a Tech Hub — That&rsquo;s Your Advantage
                </h2>
                <p className="section-intro">
                  Most local businesses in the Central Valley are still
                  running on outdated websites — if they have one at all.
                  While Silicon Valley drowns in noise, your market is
                  waiting for someone who shows up looking polished,
                  credible, and ready.
                </p>
                <p className="section-intro">
                  A mature digital presence in this region is not table
                  stakes — it&rsquo;s a <strong>real edge over your competition</strong>.
                  When your competitor&rsquo;s site loads slowly on mobile
                  and hasn&rsquo;t been touched since 2018, your modern,
                  fast, accessible website wins the customer before they
                  ever walk through your door.
                </p>
              </div>
              <div className="problem-visual" aria-hidden>
                <div className="problem-card">
                  <div className="problem-card-icon">
                    <Clock {...iconProps} />
                  </div>
                  <div className="problem-card-label problem-card-bad">
                    Outdated
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gray)",
                      marginTop: 4,
                    }}
                  >
                    Slow and unresponsive
                  </p>
                </div>
                <div className="problem-card">
                  <div className="problem-card-icon">
                    <Smartphone {...iconProps} />
                  </div>
                  <div className="problem-card-label problem-card-bad">
                    Not Mobile-Ready
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gray)",
                      marginTop: 4,
                    }}
                  >
                    Losing 60%+ of visitors
                  </p>
                </div>
                <div className="problem-card">
                  <div className="problem-card-icon">
                    <Search {...iconProps} />
                  </div>
                  <div className="problem-card-label problem-card-bad">
                    Invisible
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gray)",
                      marginTop: 4,
                    }}
                  >
                    Can&rsquo;t be found on search
                  </p>
                </div>
                <div className="problem-card">
                  <div className="problem-card-icon">
                    <AlertTriangle {...iconProps} />
                  </div>
                  <div className="problem-card-label problem-card-bad">
                    Inaccessible
                  </div>
                  <p
                    style={{
                      fontSize: "0.85rem",
                      color: "var(--gray)",
                      marginTop: 4,
                    }}
                  >
                    Excludes potential customers
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Fast-Track Workflow */}
        <section className="workflow" aria-labelledby="workflow-heading">
          <div className="container">
            <span className="section-label">The Digital Fast-Track</span>
            <h2 id="workflow-heading">
              Your Website, Built in Days — Not Months
            </h2>
            <p className="section-intro">
              I use a proven system that lets me build faster — without
              cutting corners. No templates. No page builders. Your site
              is designed and coded from scratch to match your brand,
              shipped on a timeline measured in days, not months.
            </p>
            <div className="workflow-steps">
              <div className="workflow-step">
                <h3>Discovery Call</h3>
                <p>
                  We spend 90 minutes understanding your brand, audience,
                  and goals. By the end of the call, we have a clear
                  blueprint.
                </p>
              </div>
              <div className="workflow-step">
                <h3>Design &amp; Architecture</h3>
                <p>
                  Leveraging modern design systems and component libraries,
                  we craft a bespoke layout with rapid turnaround. You
                  review and approve.
                </p>
              </div>
              <div className="workflow-step">
                <h3>Build &amp; Optimize</h3>
                <p>
                  We write every line of CSS and markup by hand. SEO,
                  accessibility, and performance are built in from the
                  first commit — never bolted on.
                </p>
              </div>
              <div className="workflow-step">
                <h3>Launch</h3>
                <p>
                  Your site goes live, fully tested, across all devices
                  and screen sizes — on an accelerated timeline measured
                  in days, not months. You focus on your business; we
                  handle the rest.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Deliverables */}
        <section
          className="deliverables"
          aria-labelledby="deliver-heading"
        >
          <div className="container">
            <span className="section-label">What You Get</span>
            <h2 id="deliver-heading">
              Every Build Includes Three Non-Negotiables
            </h2>
            <p className="section-intro">
              These are not add-ons. They are the foundation of every
              project we ship.
            </p>
            <div className="cards">
              <article className="card">
                <div className="card-icon" aria-hidden>
                  <Palette {...iconProps} />
                </div>
                <h3>Custom CSS Design</h3>
                <p>
                  No templates. No cookie-cutter themes. Your site is
                  designed and coded by hand to match your brand identity
                  — pixel-perfect, on-brand, and built to convert.
                </p>
              </article>
              <article className="card">
                <div className="card-icon" aria-hidden>
                  <Globe {...iconProps} />
                </div>
                <h3>Built-in SEO</h3>
                <p>
                  Google can read your site properly, so you show up in
                  local search results when customers look for businesses
                  like yours. Fast load times and clean structure come
                  standard.
                </p>
              </article>
              <article className="card">
                <div className="card-icon" aria-hidden>
                  <Accessibility {...iconProps} />
                </div>
                <h3>Works for Everyone</h3>
                <p>
                  Every site is accessible to people using screen readers,
                  keyboard navigation, or anyone who needs larger text and
                  strong contrast. No one gets left out.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Partnership / Pricing */}
        <section className="pricing" aria-labelledby="pricing-heading">
          <div className="container">
            <div className="pricing-box">
              <span className="section-label">Partnership</span>
              <h2 id="pricing-heading">
                Custom Websites, Local Prices
              </h2>
              <p>
                You&rsquo;re not just paying for a website. You&rsquo;re
                paying for high-end quality, delivered fast, and the
                confidence of being the most polished business in your
                market —{" "}
                <em>without the typical agency wait</em>.
              </p>
              <p>
                I&rsquo;m looking for <strong>3 local businesses</strong>{" "}
                in the Central Valley to partner with at a special rate.
              </p>
              <div className="scarcity" aria-live="polite">
                <Zap size={16} strokeWidth={2} /> 3 Spots Available —
                Claim Yours
              </div>
              <a
                href="#contact"
                className="btn btn-primary"
                data-track="cta_pricing_free_quote"
              >
                Get Your Free Quote →
              </a>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          className="contact"
          id="contact"
          aria-labelledby="contact-heading"
        >
          <div className="container">
            <div className="contact-grid">
              <div className="contact-info">
                <span className="section-label">Let&rsquo;s Talk</span>
                <h2 id="contact-heading">
                  Ready to Modernize Your Digital Presence?
                </h2>
                <p>
                  Fill out the form and I&rsquo;ll reach out within 24
                  hours to schedule your free discovery call. No
                  obligations — just a conversation about where your
                  business is and where it could be.
                </p>
                <p
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    color: "var(--gray)",
                    fontSize: "0.9rem",
                  }}
                >
                  <MapPin size={18} strokeWidth={2} /> Serving Fresno, Clovis, and
                  the Central Valley
                </p>
              </div>
              <ContactFormClient />
            </div>
          </div>
        </section>
    </main>
    </>
  );
}
