"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

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

  return (
    <header className="site-header" role="banner">
      <div className="container">
        <Link href="/" className="logo" aria-label="Hexacomb Home" onClick={closeMenu}>
          <span className="logo-hex" aria-hidden />
          Hexacomb
        </Link>

        {/* Desktop Nav */}
        <nav className="header-nav" aria-label="Main navigation">
          <Link href="/about">About</Link>
          <Link href="/#contact" className="header-cta">
            Apply for Early-Adopter Rate
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          ref={toggleRef}
          className="mobile-menu-toggle"
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
        >
          {isOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        id="mobile-menu"
        ref={menuRef}
        className={`mobile-menu ${isOpen ? "open" : ""}`}
        aria-hidden={!isOpen}
      >
        <nav className="mobile-menu-nav" aria-label="Mobile navigation">
          <Link href="/about" onClick={closeMenu}>
            About
          </Link>
          <Link href="/#contact" className="header-cta" onClick={closeMenu}>
            Apply for Early-Adopter Rate
          </Link>
        </nav>
      </div>
    </header>
  );
}
