import Link from "next/link";

/** Decorative SVG artwork is local, static and has no third-party requests. */
export default function HalloweenHero() {
  return (
    <section className="halloween-hero" aria-labelledby="halloween-title">
      <div className="halloween-hero-art" aria-hidden="true" />
      <div className="hobro-shell halloween-hero-inner">
        <p className="halloween-edition">The studio after dark <span aria-hidden="true">✦</span> Halloween edition</p>
        <h1 id="halloween-title">A killer<br /><em>first impression.</em></h1>
        <p className="halloween-hero-lead">Don’t let a ghost-town website haunt your business. Turn curious visitors into your next customers.</p>
        <div className="halloween-hero-actions">
          <Link href="#contact" className="hobro-deck-btn hobro-deck-btn-solid">Bring my website to life <span aria-hidden="true">↗</span></Link>
          <Link href="#projects" className="hobro-text-link">See the work</Link>
        </div>
        <p className="halloween-hero-footnote">Web design, local SEO &amp; ongoing care.<br />One real human in Clovis, California.</p>
      </div>
      <div className="halloween-hero-bottom" aria-hidden="true"><span>Good design. Wicked character.</span><span>Keep wandering ↓</span></div>
    </section>
  );
}
