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
        <svg viewBox="0 0 140 100" className="bee-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="beeBodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#f59e0b" />
            </linearGradient>
            <linearGradient id="beeWingGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,251,235,0.55)" />
              <stop offset="100%" stopColor="rgba(255,251,235,0.08)" />
            </linearGradient>
            <filter id="beeGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <path
            className="bee-trail"
            d="M 8 84 Q 28 98 56 86"
            fill="none"
            stroke="rgba(245,158,11,0.45)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />

          <g filter="url(#beeGlow)">
            <path d="M 122 52 L 136 47 L 136 57 Z" fill="#1a0e05" />
            <ellipse cx="88" cy="54" rx="32" ry="21" fill="url(#beeBodyGrad)" />
            <path d="M 74 35 Q 80 54 74 73 L 85 73 Q 91 54 85 35 Z" fill="#1a0e05" opacity="0.88" />
            <path d="M 95 34 Q 101 54 95 74 L 106 74 Q 112 54 106 34 Z" fill="#1a0e05" opacity="0.88" />
            <circle cx="54" cy="52" r="14" fill="url(#beeBodyGrad)" />
            <circle cx="47" cy="47" r="4" fill="#fffbeb" />
            <circle cx="47" cy="47" r="1.8" fill="#1a0e05" />
            <circle cx="58" cy="47" r="4" fill="#fffbeb" />
            <circle cx="58" cy="47" r="1.8" fill="#1a0e05" />
            <path d="M 45 41 Q 38 22 31 27" fill="none" stroke="#1a0e05" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 56 39 Q 53 21 46 24" fill="none" stroke="#1a0e05" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 72 74 L 69 83" stroke="#1a0e05" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 88 75 L 88 84" stroke="#1a0e05" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
            <path d="M 104 74 L 107 83" stroke="#1a0e05" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
          </g>

          <g className="bee-wing bee-wing-left">
            <ellipse cx="72" cy="34" rx="20" ry="13" fill="url(#beeWingGrad)" stroke="rgba(255,251,235,0.45)" strokeWidth="1" transform="rotate(-28 72 34)" />
          </g>
          <g className="bee-wing bee-wing-right">
            <ellipse cx="102" cy="34" rx="20" ry="13" fill="url(#beeWingGrad)" stroke="rgba(255,251,235,0.45)" strokeWidth="1" transform="rotate(28 102 34)" />
          </g>
        </svg>
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
      </div>
      <div className="scroll-indicator" aria-hidden>
        <span>
          <i />
        </span>
        <em>scroll</em>
      </div>
    </section>
  );
}
