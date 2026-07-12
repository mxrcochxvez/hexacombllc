import Link from "next/link";

export default function PromoBanner() {
  return (
    <Link
      href="/intake"
      className="promo-banner group block bg-deep text-on-deep transition-colors hover:bg-ink focus-visible:outline-offset-[-2px]"
      data-track="promo_free_website"
      aria-label="Free website promotion: free design with unlimited iterations until project delivery. Start your project intake."
    >
      <div className="mx-auto flex max-w-6xl items-center justify-center gap-x-2 gap-y-1 px-5 py-2.5 text-center sm:px-6">
        <p className="font-display text-sm font-medium leading-snug sm:text-[0.9375rem]">
          <span className="font-semibold text-on-deep">Free website promotion</span>
          <span className="text-on-deep-muted">
            {" "}
            — free design with unlimited iterations until project delivery
          </span>
        </p>
        <span
          aria-hidden="true"
          className="hidden shrink-0 font-display text-sm font-semibold text-on-deep transition-transform group-hover:translate-x-0.5 sm:inline"
        >
          →
        </span>
      </div>
    </Link>
  );
}
