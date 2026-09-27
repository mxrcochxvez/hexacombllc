"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation";
import { ReactLenis, useLenis } from "lenis/react";
import "lenis/dist/lenis.css";

export { useLenis };

interface SmoothScrollProps {
  children: React.ReactNode;
}

/**
 * Handles smooth scrolling to anchors and resets scroll position on route transitions.
 */
function LenisRouteHandler() {
  const pathname = usePathname();
  const lenis = useLenis();

  // Reset scroll to top on pathname change (unless there is a hash target)
  useEffect(() => {
    if (!lenis) return;
    if (!window.location.hash) {
      lenis.scrollTo(0, { immediate: true });
    }
  }, [pathname, lenis]);

  // Handle in-page anchor links (e.g. href="#contact" or href="/#projects")
  useEffect(() => {
    if (!lenis) return;

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;

      const href = target.getAttribute("href");
      if (!href) return;

      const isSamePageHash =
        href.startsWith("#") ||
        (href.startsWith("/#") && window.location.pathname === "/");

      if (isSamePageHash) {
        const hash = href.startsWith("/#") ? href.slice(1) : href;

        if (hash === "#" || hash === "#main-content") {
          e.preventDefault();
          lenis.scrollTo(0, { duration: 1.2 });
          return;
        }

        const element = document.querySelector(hash);
        if (element) {
          e.preventDefault();
          lenis.scrollTo(element as HTMLElement, {
            offset: -84, // Account for sticky navbar header
            duration: 1.2,
          });
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);
    return () => {
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [lenis]);

  return null;
}

/**
 * Global Lenis smooth scrolling provider powered by lenis.dev.
 */
export default function SmoothScroll({ children }: SmoothScrollProps) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.08,
        duration: 1.2,
        smoothWheel: true,
        wheelMultiplier: 1.0,
        touchMultiplier: 1.5,
        infinite: false,
        stopInertiaOnNavigate: true,
        respectReducedMotion: true,
      }}
    >
      <LenisRouteHandler />
      {children}
    </ReactLenis>
  );
}
