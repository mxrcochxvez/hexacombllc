import Link from "next/link";

const headline = "We help local businesses thrive in the digital age.";
const words = headline.split(" ");

const honeycombCells = Array.from({ length: 30 }).map((_, index) => {
  const columns = 6;
  const col = index % columns;
  const row = Math.floor(index / columns);
  return {
    x: 50 + col * 78 + (row % 2) * 39,
    y: 42 + row * 68,
    filled: index % 5 === 0 || index % 11 === 0,
    soft: col > 4 || row > 3,
  };
});

export default function HeroSection() {
  return (
    <section className="brand-hero honeycomb-bg" aria-labelledby="brand-hero-heading">
      <div className="brand-hero-comb" aria-hidden>
        <svg viewBox="0 0 560 420" role="img">
          <g>
            {honeycombCells.map((cell, index) => (
              <path
                key={index}
                className={[
                  "hero-comb-cell",
                  cell.filled ? "hero-comb-cell-filled" : "",
                  cell.soft ? "hero-comb-cell-soft" : "",
                ].join(" ")}
                d={`M ${cell.x} ${cell.y - 35} L ${cell.x + 40} ${cell.y - 12} L ${cell.x + 40} ${cell.y + 35} L ${cell.x} ${cell.y + 58} L ${cell.x - 40} ${cell.y + 35} L ${cell.x - 40} ${cell.y - 12} Z`}
              />
            ))}
          </g>
        </svg>
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
          <span>
            <i />
          </span>
          <em>scroll</em>
        </div>
      </div>
    </section>
  );
}
