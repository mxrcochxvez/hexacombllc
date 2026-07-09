import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/website-audit", label: "Website check" },
  { href: "/#contact", label: "Contact" },
];

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="border-t border-border bg-canvas">
      <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 sm:px-6 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink" aria-label="Hexacomb — Home">
            Hexacomb
          </Link>
          <p className="mt-2 text-sm text-ink-muted">
            Technology for small businesses in Fresno and Clovis.
          </p>
          <p className="mt-1 text-sm text-ink-muted">&copy; {year} Hexacomb LLC</p>
        </div>
        <div className="flex flex-col items-start gap-6 lg:items-end">
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2 lg:justify-end"
            aria-label="Footer"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-display text-sm text-ink-muted transition-colors hover:text-ink"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2 rounded-md border border-border px-3 py-1.5" aria-label="WCAG 2.1 Level AA conformance">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-accent"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <span className="font-display text-xs font-medium text-ink-muted">
              WCAG 2.1 AA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
