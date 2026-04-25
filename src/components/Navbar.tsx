"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Lock body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus management: focus first link when opened
  useEffect(() => {
    if (isOpen && menuRef.current) {
      const firstLink = menuRef.current.querySelector<HTMLElement>("a, button");
      firstLink?.focus();
    }
  }, [isOpen]);

  const closeMenu = () => setIsOpen(false);
  const toggleMenu = () => setIsOpen((prev) => !prev);

  return (
    <>
      {/* Sticky Header — logo only on mobile, full nav on desktop */}
      <header className="site-header" role="banner">
        <div className="container">
          <Link href="/" className="logo" aria-label="Hexacomb Home" onClick={closeMenu}>
            <span className="logo-hex" aria-hidden />
            Hexacomb
          </Link>

          <nav className="header-nav" aria-label="Main navigation">
            <Link href="/about" data-track="nav_about">
              About
            </Link>
            <Link href="/#contact" className="header-cta" data-track="nav_cta_early_adopter">
              Apply for Early-Adopter Rate
            </Link>
          </nav>
        </div>
      </header>

      {/* Floating Action Button — bottom right (mobile only) */}
      <button
        className={`mobile-fab ${isOpen ? "open" : ""}`}
        aria-label={isOpen ? "Close menu" : "Open menu"}
        aria-expanded={isOpen}
        aria-controls="mobile-menu-liquid"
        onClick={toggleMenu}
        type="button"
        data-track={isOpen ? "mobile_menu_close" : "mobile_menu_open"}
      >
        {isOpen ? <X size={24} strokeWidth={2.5} /> : <Menu size={24} strokeWidth={2.5} />}
      </button>

      {/* Liquid Mobile Menu Overlay */}
      <div
        id="mobile-menu-liquid"
        ref={menuRef}
        className={`mobile-menu-liquid ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
        inert={!isOpen}
        onClick={(e) => {
          if (e.target === e.currentTarget) closeMenu();
        }}
      >
        <div className="mobile-menu-panel">
          <nav className="mobile-menu-nav" aria-label="Mobile navigation">
            <Link
              href="/"
              onClick={closeMenu}
              data-track="nav_mobile_home"
              className="mobile-menu-link"
            >
              Home
            </Link>
            <Link
              href="/about"
              onClick={closeMenu}
              data-track="nav_mobile_about"
              className="mobile-menu-link"
            >
              About
            </Link>
            <Link
              href="/#contact"
              onClick={closeMenu}
              data-track="nav_mobile_cta_early_adopter"
              className="mobile-menu-cta"
            >
              Apply for Early-Adopter Rate
            </Link>
          </nav>
        </div>
      </div>
    </>
  );
}
