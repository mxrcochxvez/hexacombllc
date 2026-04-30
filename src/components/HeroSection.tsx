import Link from "next/link";

const headline = "We help local businesses thrive in the digital age.";
const words = headline.split(" ");

export default function HeroSection() {
  return (
    <section className="brand-hero honeycomb-bg" aria-labelledby="brand-hero-heading">
      <div className="brand-hero-comb" aria-hidden>
        {Array.from({ length: 12 }).map((_, index) => (
          <span key={index} />
        ))}
      </div>
      <div className="brand-hero-bee" aria-hidden>
        <span className="bee-wing bee-wing-left" />
        <span className="bee-wing bee-wing-right" />
        <span className="bee-body">
          <span />
          <span />
        </span>
        <span className="bee-trail" />
      </div>
      <div className="container brand-hero-inner">
        <p className="brand-kicker hero-kicker">Boutique technology partner</p>
        <h1 id="brand-hero-heading" className="brand-hero-title" aria-label={headline}>
          {words.map((word, index) => (
            <span
              key={`${word}-${index}`}
              aria-hidden
              style={{ "--word-delay": `${300 + index * 80}ms` } as React.CSSProperties}
            >
              {word}
            </span>
          ))}
        </h1>
        <p className="brand-hero-sub">
          Web. Software. AI. All of it — made simple.
        </p>
        <div className="brand-hero-actions">
          <Link
            href="#contact"
            className="brand-btn brand-btn-primary"
            data-track="brand_hero_consultation"
          >
            Get a Free Consultation
          </Link>
          <Link
            href="/website-audit"
            className="brand-btn brand-btn-ghost"
            data-track="brand_hero_work"
          >
            See Our Work
          </Link>
        </div>
        <div className="scroll-indicator" aria-hidden>
          <span />
          <em>scroll</em>
        </div>
      </div>
    </section>
  );
}
