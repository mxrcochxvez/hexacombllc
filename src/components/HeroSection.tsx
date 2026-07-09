import Image from "next/image";
import Link from "next/link";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=1200&q=80";

const trust = ["Local team", "Plain language", "Reply within one business day"];

export default function HeroSection() {
  return (
    <section style={{ padding: 0 }} className="border-b border-border bg-canvas" aria-labelledby="hero-heading">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 py-16 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-16 lg:py-24">
        <div>
          <p className="font-display text-sm font-medium text-ink-muted">
            Fresno, Clovis, and the Central Valley
          </p>

          <h1
            id="hero-heading"
            className="text-balance mt-4 font-display text-[clamp(2.25rem,5vw,3.5rem)] font-semibold leading-[1.08] tracking-tight"
          >
            We handle your technology. You run your business.
          </h1>

          <p className="mt-5 max-w-[38ch] text-lg leading-relaxed text-ink-muted">
            Websites, software, and day-to-day IT with plain explanations and one
            person to call when something breaks.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="#contact"
              className="inline-flex w-full min-h-11 items-center justify-center rounded-md bg-accent px-6 py-3 font-display text-base font-semibold text-canvas transition-colors hover:bg-accent-hover sm:w-auto"
              data-track="hero_consultation"
            >
              Book a free call
            </Link>
            <Link
              href="/pricing"
              className="inline-flex w-full min-h-11 items-center justify-center rounded-md border border-border bg-canvas px-6 py-3 font-display text-base font-semibold text-ink transition-colors hover:border-ink hover:bg-surface sm:w-auto"
              data-track="hero_pricing"
            >
              See pricing
            </Link>
          </div>

          <ul
            className="mt-10 flex flex-col gap-2 border-t border-border pt-8 text-sm text-ink-muted sm:flex-row sm:flex-wrap sm:gap-x-8"
            aria-label="Why choose us"
          >
            {trust.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        <figure className="relative aspect-[4/3] w-full overflow-hidden rounded-lg border border-border lg:aspect-[5/4]">
          <Image
            src={HERO_IMAGE}
            alt="Small business owner reviewing email on a laptop at a tidy desk"
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 480px"
            priority
          />
        </figure>
      </div>
    </section>
  );
}
