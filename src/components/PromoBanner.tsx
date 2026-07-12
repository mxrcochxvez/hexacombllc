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
      <div className="relative mx-auto flex max-w-6xl items-center justify-center gap-x-2.5 px-4 py-2 text-center sm:gap-x-3 sm:px-6 sm:py-3">
        <p className="font-display text-sm font-semibold leading-none tracking-tight sm:text-base sm:leading-snug">
          Grab your free website
          <span className="hidden font-medium opacity-90 sm:inline">
            {" "}
            — free design, unlimited iterations until delivery
          </span>
        </p>
        <span
          aria-hidden="true"
          className="inline-flex shrink-0 items-center gap-1 rounded-md bg-white/15 px-2 py-0.5 font-display text-[0.6875rem] font-bold uppercase tracking-wide text-white transition-transform group-hover:translate-x-0.5 sm:px-2.5 sm:text-[0.8125rem]"
        >
          Start now
          <span className="transition-transform group-hover:translate-x-0.5">→</span>
        </span>
      </div>
    </Link>
  );
}
