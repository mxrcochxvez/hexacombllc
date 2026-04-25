"use client";

import { useEffect } from "react";
import { track } from "@/lib/analytics";

/**
 * Global click tracker using event delegation.
 *
 * Any element with a `data-track="event-name"` attribute will automatically
 * fire a tracking event when clicked. Example:
 *   <a href="/about" data-track="nav_about">About</a>
 */
export default function TrackClicks() {
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest<HTMLElement>("[data-track]");
      if (!el) return;

      const eventName = el.getAttribute("data-track");
      if (!eventName) return;

      const anchor = el.closest("a");
      const href = anchor?.getAttribute("href") || undefined;

      track(eventName, {
        text: el.textContent?.trim().slice(0, 100) || undefined,
        href,
        tag: el.tagName.toLowerCase(),
      });
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  return null;
}
