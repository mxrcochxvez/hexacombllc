"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const motionTargets = [
  ".growth-hero",
  ".growth-problem",
  ".growth-system",
  ".growth-proof",
  ".growth-cause-note",
  ".growth-close",
  ".growth-page-hero",
  ".growth-page-dark",
  ".growth-page-section",
  ".growth-about-photo",
  ".growth-intake-form",
];

export default function SiteMotion() {
  const pathname = usePathname();

  useEffect(() => {
    const syncPageVisibility = () => {
      document.documentElement.classList.toggle("page-hidden", document.hidden);
    };

    syncPageVisibility();
    document.addEventListener("visibilitychange", syncPageVisibility);
    return () => {
      document.removeEventListener("visibilitychange", syncPageVisibility);
      document.documentElement.classList.remove("page-hidden");
    };
  }, []);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const targets = Array.from(
      document.querySelectorAll<HTMLElement>(motionTargets.join(",")),
    );
    if (reducedMotion.matches) {
      document.documentElement.classList.remove("motion-ready");
      targets.forEach((target) => {
        target.classList.remove("motion-watch");
        target.classList.add("is-in-view");
      });
      return;
    }

    document.documentElement.classList.add("motion-ready");
    targets.forEach((target) => target.classList.add("motion-watch"));

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in-view");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
    };
  }, [pathname]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;

    const root = document.documentElement;
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      root.style.setProperty("--page-scroll", p.toFixed(4));
      root.style.setProperty("--page-scroll-px", `${window.scrollY.toFixed(0)}`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      root.style.removeProperty("--page-scroll");
      root.style.removeProperty("--page-scroll-px");
    };
  }, [pathname]);

  return null;
}
