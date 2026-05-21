"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

const links = [
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/website-audit", label: "Check your site" },
];

const linkBase =
  "font-display text-sm font-medium text-ink-muted transition-colors hover:text-ink focus-visible:text-ink";
const primaryLinkBase =
  "inline-flex items-center justify-center rounded-md bg-accent px-4 py-2.5 font-display text-sm font-semibold text-canvas transition-colors hover:bg-accent-hover";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const menuId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className="sticky top-0 z-[90] border-b border-border bg-canvas">
      <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
        <Link
          href="/"
          onClick={close}
          className="font-display text-lg font-semibold tracking-tight text-ink"
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

        <button
          ref={toggleRef}
          type="button"
          className={`nav-floating-toggle md:hidden${open ? " is-open" : ""}`}
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls={menuId}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? (
            <X aria-hidden="true" size={24} strokeWidth={2.25} />
          ) : (
            <Menu aria-hidden="true" size={24} strokeWidth={2.25} />
          )}
        </button>
      </div>

      {open ? (
        <div
          id={menuId}
          className="nav-mobile-overlay is-open md:hidden"
        >
          <div
            className="nav-mobile-scrim"
            aria-hidden="true"
            onClick={close}
          />
          <div className="nav-mobile-panel" role="presentation">
            <nav
              className="nav-mobile-menu"
              aria-label="Mobile"
            >
              <ul className="nav-mobile-list">
                {links.map((link, i) => (
                  <li key={link.href}>
                    <Link
                      ref={i === 0 ? firstLinkRef : undefined}
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
                    style={{ "--nm": `${90 + links.length * 55}ms` } as React.CSSProperties}
                    data-track="nav_mobile_contact"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      ) : (
        <div id={menuId} hidden />
      )}
    </header>
  );
}
