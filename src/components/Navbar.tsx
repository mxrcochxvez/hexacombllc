"use client";

import Link from "next/link";
import StaggeredMenu from "@/components/StaggeredMenu";

const navLinks = [
  { href: "/#projects", label: "Work", ariaLabel: "See the work" },
  { href: "/how-it-works", label: "How it works", ariaLabel: "How Hexacomb works" },
  { href: "/pricing", label: "Pricing", ariaLabel: "See plans and pricing" },
  { href: "/website-audit", label: "Audit", ariaLabel: "Run a website audit" },
  { href: "/about", label: "About", ariaLabel: "About Hexacomb" },
  { href: "/blog", label: "Blog", ariaLabel: "Read the blog" },
  { href: "/#contact", label: "Contact", ariaLabel: "Start a project" },
];

export default function Navbar() {
  return (
    <div className="hobro-header">
      <div className="hobro-shell hobro-header-inner">
        <div className="hobro-header-left">
          <Link href="/" className="hobro-logo-link" aria-label="Hexacomb home">
            <span className="hobro-logo-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <polygon
                  points="12,2 21.5,7.5 21.5,18.5 12,24 2.5,18.5 2.5,7.5"
                  strokeWidth="2"
                />
              </svg>
            </span>
            <span className="hobro-logo-text">HEXACOMB</span>
          </Link>
        </div>

        <nav className="hobro-header-right" aria-label="Main">
          <ul className="hobro-nav-list">
            {navLinks.map((link) => (
              <li key={link.href} className="hobro-nav-item">
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="hobro-header-mobile">
          <StaggeredMenu
            position="right"
            items={navLinks.map((link) => ({
              label: link.label,
              ariaLabel: link.ariaLabel,
              link: link.href,
            }))}
            displaySocials={false}
            displayItemNumbering={false}
            menuButtonColor="inherit"
            openMenuButtonColor="inherit"
            changeMenuColorOnOpen={false}
            colors={["#141210", "#f59e0b"]}
            accentColor="#b45309"
          />
        </div>
      </div>
    </div>
  );
}
