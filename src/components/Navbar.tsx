"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/website-audit", label: "Website audit" },
  { href: "/pricing", label: "Plans" },
  { href: "/blog", label: "Blog" },
];

const mobileLinks = [{ href: "/", label: "Home" }, ...links];

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
    <div className="growth-nav-shell">
      <div className="growth-nav-inner">
        <Link href="/" onClick={close} className="growth-wordmark" aria-label="Hexacomb LLC — Home">
          HEXACOMB
        </Link>

        <nav className="growth-nav-desktop" aria-label="Main">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="growth-nav-link" data-track={`nav_${link.label.toLowerCase().replace(/\s+/g, "_")}`}>
              {link.label}
            </Link>
          ))}
          <Link href="/#contact" className="growth-nav-cta" data-track="nav_cta_contact">Take it off my plate</Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          className="growth-mobile-toggle"
          aria-expanded={isOpen}
          aria-controls={menuId}
          aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
          onClick={() => setIsOpen((value) => !value)}
        >
          <span aria-hidden />
          <span aria-hidden />
        </button>
      </div>

      <div className="growth-mobile-drawer" data-open={isOpen} aria-hidden={!isOpen}>
        <button type="button" className="growth-mobile-scrim" aria-label="Close navigation menu" onClick={close} tabIndex={isOpen ? 0 : -1} />
        <div id={menuId} ref={panelRef} className="growth-mobile-panel" role="dialog" aria-modal="true" aria-label="Navigation menu">
          <nav aria-label="Mobile">
            {mobileLinks.map((link) => (
              <Link key={link.href} href={link.href} onClick={close} className="growth-mobile-link" tabIndex={isOpen ? 0 : -1}>
                {link.label}
              </Link>
            ))}
            <Link href="/#contact" onClick={close} className="growth-mobile-link growth-mobile-link-cta" tabIndex={isOpen ? 0 : -1} data-track="nav_mobile_contact">
              Take it off my plate
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}
