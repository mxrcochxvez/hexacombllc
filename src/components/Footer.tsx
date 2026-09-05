import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Plans" },
  { href: "/website-audit", label: "Website check" },
  { href: "/blog", label: "Blog" },
  { href: "/human-rights", label: "Human rights" },
  { href: "/#contact", label: "Contact" },
];

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="growth-footer">
      <div className="growth-shell growth-footer-grid">
        <div>
          <Link href="/" className="growth-wordmark" aria-label="Hexacomb — Home">
            HEXACOMB
          </Link>
          <p className="growth-footer-line">
            Your website growth partner in Fresno and Clovis.
          </p>
          <p className="growth-footer-copy">&copy; {year} Hexacomb LLC</p>
        </div>
        <div className="growth-footer-links">
          <nav
            className="growth-footer-nav"
            aria-label="Footer"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="growth-nav-link"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="growth-accessibility">
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
            <span>
              WCAG 2.1 AA
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
