"use client";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
const links = [
  { href: "/#services", label: "Services" },
  { href: "/work", label: "Work" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Insights" },
];
export default function Navbar() {
  return (
    <div className="premium-nav">
      <div className="premium-shell premium-nav-inner">
        <Link href="/" className="premium-logo" aria-label="Hexacomb home">
          <svg viewBox="0 0 28 30" aria-hidden="true" fill="none">
            <path
              d="M14 2 26 9v13l-12 7L2 22V9Z"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M8 11v10m12-10v10M8 16h12"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
          <span>HEXACOMB</span>
        </Link>
        <nav aria-label="Main" className="premium-desktop-nav">
          {links.map((l) => (
            <Link key={l.href} href={l.href}>
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="premium-nav-cta">
            Let’s talk <ArrowIcon />
          </Link>
        </nav>
        <details className="premium-mobile-nav">
          <summary>
            Menu <span aria-hidden="true">+</span>
          </summary>
          <nav aria-label="Mobile">
            {[...links, { href: "/#contact", label: "Let’s talk" }].map((l) => (
              <Link
                href={l.href}
                key={l.href}
                onClick={(e) =>
                  e.currentTarget.closest("details")?.removeAttribute("open")
                }
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </details>
      </div>
    </div>
  );
}
