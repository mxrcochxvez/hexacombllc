"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const [pastHero, setPastHero] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".scroll-expand, .hobro-page-hero");
    if (!hero) {
      setPastHero(false);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        const above = entry.boundingClientRect.bottom <= 72;
        setPastHero(!entry.isIntersecting && above);
      },
      { rootMargin: "-4.5rem 0px 0px 0px", threshold: 0 }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [pathname]);

  return (
    <div className={`hobro-header${pastHero ? " hobro-header--scrolled" : ""}`}>
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
