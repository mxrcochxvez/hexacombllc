"use client";

import React, { useEffect, useId, useRef, useCallback } from "react";
import Link from "next/link";

const links = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/pricing", label: "Pricing" },
  { href: "/website-audit", label: "Check your site" },
];

const mobileLinks = [{ href: "/", label: "Home" }, ...links];

const linkBase =
  "font-display text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:text-ink";
const primaryLinkBase =
  "inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 font-display text-sm font-semibold text-canvas transition-colors hover:bg-accent-hover";

export default function Navbar() {
  const toggleId = useId();
  const menuId = `${toggleId}-panel`;
  const toggleRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    if (toggleRef.current) {
      toggleRef.current.checked = false;
      toggleRef.current.setAttribute("aria-expanded", "false");
    }
  }, []);

  const open = useCallback(() => {
    if (toggleRef.current) {
      toggleRef.current.setAttribute("aria-expanded", "true");
    }
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && toggleRef.current?.checked) {
        close();
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [close]);

  // Focus trap for mobile menu
  useEffect(() => {
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !toggleRef.current?.checked) return;

      const menu = menuRef.current;
      if (!menu) return;

      const focusable = menu.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    window.addEventListener("keydown", onTab);
    return () => window.removeEventListener("keydown", onTab);
  }, []);

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.checked) {
      open();
    } else {
      close();
    }
  };

  return (
    <div className="border-b border-border bg-canvas">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="font-display text-lg font-semibold tracking-tight text-ink"
          aria-label="Hexacomb LLC — Home"
        >
          Hexacomb LLC
        </Link>

        <nav className="hidden items-center gap-9 md:flex" aria-label="Main">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={linkBase}
              data-track={`nav_${link.label.toLowerCase().replace(/\s+/g, "_")}`}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/#contact"
            className={primaryLinkBase}
            data-track="nav_cta_contact"
          >
            Contact
          </Link>
        </nav>
      </div>

      <input
        ref={toggleRef}
        id={toggleId}
        type="checkbox"
        className="nav-menu-check md:hidden"
        aria-label="Toggle navigation menu"
        aria-controls={menuId}
        aria-expanded="false"
        onChange={handleToggleChange}
      />

      <div
        ref={menuRef}
        id={menuId}
        className="nav-mobile-overlay md:hidden"
        role="dialog"
        aria-label="Mobile navigation menu"
      >
        <label
          className="nav-mobile-scrim"
          aria-hidden="true"
          htmlFor={toggleId}
        />
        <div className="nav-mobile-panel">
          <nav className="nav-mobile-menu" aria-label="Mobile">
            <ul className="nav-mobile-list" role="list">
              {mobileLinks.map((link, i) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={close}
                    className="nav-mobile-link"
                    style={{ "--nm": `${90 + i * 55}ms` } as React.CSSProperties}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/#contact"
                  onClick={close}
                  className="nav-mobile-link nav-mobile-link-primary"
                  style={{ "--nm": `${90 + mobileLinks.length * 55}ms` } as React.CSSProperties}
                  data-track="nav_mobile_contact"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  );
}
