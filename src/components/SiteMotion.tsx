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
    const targets = Array.from(document.querySelectorAll<HTMLElement>(motionTargets.join(",")));
    if (reducedMotion.matches) return;

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
      { rootMargin: "0px 0px -12%", threshold: 0.08 },
    );

    targets.forEach((target) => observer.observe(target));
    return () => {
      observer.disconnect();
      document.documentElement.classList.remove("motion-ready");
      targets.forEach((target) => target.classList.remove("motion-watch", "is-in-view"));
    };
  }, [pathname]);

  return null;
}
