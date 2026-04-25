import Link from "next/link";
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

const iconProps = { size: 28, strokeWidth: 1.75 };

export default function Home() {
  return (
    <>
      {/* Header */}
      <header className="site-header" role="banner">
        <div className="container">
          <Link href="/" className="logo" aria-label="Hexacomb Home">
            <span className="logo-hex" aria-hidden />
            Hexacomb
          </Link>
          <a href="#contact" className="header-cta">
            Apply for Early-Adopter Rate
          </a>
        </div>
      </header>

      <main id="main-content">
        {/* Hero */}
        <section className="hero hex-bg" aria-labelledby="hero-heading">
          <div className="container">
            <span className="hero-badge">Built in the 559</span>
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
              aria-label="Get your digital fast-track consultation"
            >
              Get Your Digital Fast-Track →
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
                  stakes — it&rsquo;s a <strong>competitive moat</strong>.
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
              High-Leverage Orchestration — Speed Without Sacrifice
            </h2>
            <p className="section-intro">
              We compress what normally takes months into an accelerated
              launch schedule. How? A proprietary high-leverage workflow —
              a carefully orchestrated system of modern tooling, design
              systems, and pre-built architectural foundations. No
              templates. No page builders. Pure custom code, shipped at
              the speed your business needs to compete.
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
                  Semantic HTML structure, proper heading hierarchy, fast
                  load times, and structured data. We don&rsquo;t bolt SEO
                  on at the end — it&rsquo;s baked into every line of
                  markup.
                </p>
              </article>
              <article className="card">
                <div className="card-icon" aria-hidden>
                  <Accessibility {...iconProps} />
                </div>
                <h3>Strict WCAG Accessibility</h3>
                <p>
                  Every site meets WCAG 2.1 AA standards. High-contrast
                  ratios, keyboard navigation, screen-reader support, and
                  proper ARIA landmarks. Accessible to everyone.
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
                The Digital Fast-Track, At an Early-Adopter Rate
              </h2>
              <p>
                You&rsquo;re not just paying for a website. You&rsquo;re
                paying for high-end quality, extreme speed to market, and
                the competitive advantage of being the most polished
                business in your market —{" "}
                <em>without the typical agency wait</em>.
              </p>
              <p>
                As I baseline this new high-speed pricing model, I&rsquo;m
                looking for <strong>3 local businesses</strong> in the
                Central Valley to partner with at a special early-adopter
                rate.
              </p>
              <div className="scarcity" aria-live="polite">
                <Zap size={16} strokeWidth={2} /> 3 Partner Spots Available —
                Apply Now
              </div>
              <a href="#contact" className="btn btn-primary">
                Apply for the Early-Adopter Rate →
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
              <form
                action="#"
                method="POST"
                aria-label="Contact form"
                noValidate
              >
                <div className="form-group">
                  <label htmlFor="name">
                    Full Name <span aria-hidden>*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    autoComplete="name"
                    placeholder="Your full name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">
                    Email Address <span aria-hidden>*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@yourbusiness.com"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="business">Business Name</label>
                  <input
                    type="text"
                    id="business"
                    name="business"
                    autoComplete="organization"
                    placeholder="Your business name"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="website">Current Website URL</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    autoComplete="url"
                    placeholder="https://"
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                  }}
                >
                  Send Application →
                </button>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="site-footer" role="contentinfo">
        <div className="container">
          <p>
            <span className="logo-hex" aria-hidden />{" "}
            <strong>Hexacomb</strong> — Modern Websites for the Central
            Valley
          </p>
          <p style={{ marginTop: 8 }}>
            &copy; {new Date().getFullYear()} Hexacomb LLC. All rights
            reserved.
          </p>
          <p style={{ marginTop: 6, fontSize: "0.75rem", opacity: 0.5 }}>
            Photo by{" "}
            <a
              href="https://unsplash.com/@ghpvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: "inherit" }}
            >
              Grant Porter
            </a>{" "}
            on{" "}
            <a
              href="https://unsplash.com/photos/birds-eye-view-of-skyscrapers-Mx71xeQOev8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: "inherit" }}
            >
              Unsplash
            </a>
          </p>
        </div>
      </footer>
    </>
  );
}
