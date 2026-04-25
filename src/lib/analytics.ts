"use client";

import { getConsent } from "@/lib/consent";

/**
 * Lightweight client-side analytics helper.
 * Sends events to /api/track using navigator.sendBeacon when available,
 * falling back to fetch with keepalive.
 *
 * Events are only sent if the user has accepted cookies.
 */
export function track(
  event: string,
  properties?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;
  if (getConsent() !== "accepted") return;

  try {
    const payload = {
      event,
      properties: properties ?? {},
      url: window.location.href,
      referrer: document.referrer || undefined,
      timestamp: Date.now(),
    };

    const body = JSON.stringify(payload);

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/track", body);
    } else {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
      }).catch(() => {
        // silently fail — analytics should never break the UX
      });
    }
  } catch {
    // silently fail
  }
}
