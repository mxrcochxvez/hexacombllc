import Link from "next/link";

export default function PromoBanner() {
  return (
    <Link
      href="/intake"
      className="promo-banner group relative block overflow-hidden bg-accent text-white transition-colors hover:bg-accent-hover focus-visible:outline-offset-[-2px]"
      data-track="promo_free_website"
      aria-label="Grab your free website: free design with unlimited iterations until project delivery. Start your project intake."
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent promo-banner-shimmer"
      />
      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-3 gap-y-1 px-5 py-3 text-center sm:px-6">
        <p className="font-display text-[0.9375rem] font-semibold leading-snug tracking-tight sm:text-base">
          Grab your free website
          <span className="font-medium opacity-90">
            {" "}
            — free design, unlimited iterations until delivery
          </span>
        </p>
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/15 px-2.5 py-0.5 font-display text-xs font-bold uppercase tracking-wide text-white transition-transform group-hover:translate-x-0.5 sm:text-[0.8125rem]"
        >
          Start now
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
