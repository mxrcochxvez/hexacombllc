"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

const navLinks = [
  { href: "/#projects", label: "Work" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/website-audit", label: "Audit" },
  { href: "/about", label: "About" },
  { href: "/blog", label: "Blog" },
  { href: "/#contact", label: "Contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    panelRef.current?.querySelector<HTMLAnchorElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close();
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab" || !panelRef.current) return;
      const linksInPanel = panelRef.current.querySelectorAll<HTMLElement>("a[href], button");
      const first = linksInPanel[0];
      const last = linksInPanel[linksInPanel.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [close, isOpen]);

  return (
    <div className="hobro-header">
      <div className="hobro-shell hobro-header-inner">
        <div className="hobro-header-left">
          <Link href="/" onClick={close} className="hobro-logo-link" aria-label="Hexacomb home">
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
          <button
            ref={toggleRef}
            type="button"
            className="hobro-menu-toggle"
            aria-expanded={isOpen}
            aria-controls={menuId}
            aria-label={isOpen ? "Close menu" : "Open menu"}
            onClick={() => setIsOpen((value) => !value)}
          >
            <span />
            <span />
          </button>
        </div>
      </div>

      {isOpen ? (
        <div className="hobro-drawer" id={menuId}>
          <div ref={panelRef} className="hobro-drawer-links">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={close}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
