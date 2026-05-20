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
          <Link href="/" className="font-display text-lg font-semibold tracking-tight text-ink">
            Hexacomb
          </Link>
          <p className="mt-2 text-sm text-ink-muted">
            Technology for small businesses in Fresno and Clovis.
          </p>
          <p className="mt-1 text-sm text-ink-muted">© {year} Hexacomb LLC</p>
        </div>
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
      </div>
    </footer>
  );
}
