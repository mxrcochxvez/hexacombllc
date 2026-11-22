"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ArrowIcon from "@/components/ArrowIcon";
import { BLOG_URL } from "@/lib/blogNavigation";
const links = [
  { href: "/website-design", label: "Website design" },
  { href: "/local-seo", label: "Local SEO" },
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/website-audit", label: "Free audit" },
  { href: "/about", label: "About" },
  { href: BLOG_URL, label: "Blog" },
];
export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const detailsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOpen(false);
        detailsRef.current?.removeAttribute("open");
      }
    };
    const handleClickOutside = (e: MouseEvent) => {
      if (detailsRef.current && !detailsRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
        detailsRef.current.removeAttribute("open");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    detailsRef.current?.removeAttribute("open");
  };

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
            <Link
              key={l.href}
              href={l.href}
              aria-current={pathname === l.href ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
          <Link href="/#contact" className="premium-nav-cta">
            Get a quote <ArrowIcon />
          </Link>
        </nav>
        <div className="premium-mobile-actions">
          <a
            href="tel:+15594927402"
            className="premium-mobile-call"
            data-phone-location="header"
          >
            Call
          </a>
          <details
            ref={detailsRef}
            className="premium-mobile-nav"
            onToggle={(e) => setMenuOpen(e.currentTarget.open)}
          >
            <summary aria-expanded={menuOpen}>
              {menuOpen ? "Close" : "Menu"}{" "}
              <span aria-hidden="true">{menuOpen ? "×" : "+"}</span>
            </summary>
            <nav aria-label="Mobile">
              {[...links, { href: "/#contact", label: "Get a quote" }].map((l) => (
                <Link
                  href={l.href}
                  key={l.href}
                  aria-current={pathname === l.href ? "page" : undefined}
                  onClick={closeMenu}
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </details>
        </div>
      </div>
    </div>
  );
}
