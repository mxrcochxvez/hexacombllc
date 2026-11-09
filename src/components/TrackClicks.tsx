"use client";

import { useEffect } from "react";
import { track, trackGA4 } from "@/lib/analytics";

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
      if (!(e.target instanceof Element)) return;

      // A phone-link click is intent, not evidence of a completed call or lead.
      // Send only the link placement, never the phone number or visible text.
      const phoneLink = e.target.closest<HTMLAnchorElement>(
        'a[href^="tel:"][data-phone-location]',
      );
      if (phoneLink) {
        trackGA4("phone_click", {
          link_location: phoneLink.getAttribute("data-phone-location"),
        });
      }

      const el = e.target.closest<HTMLElement>("[data-track]");
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
