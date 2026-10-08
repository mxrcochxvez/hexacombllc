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

/**
 * Fire a GA4 event using window.gtag (queued on dataLayer if gtag.js is still
 * loading). Consent Mode v2 decides cookie vs cookieless — do not gate on the
 * banner, or generate_lead never reaches GA for visitors who ignore/decline.
 */
export function trackGA4(
  event: string,
  params?: Record<string, unknown>
): void {
  if (typeof window === "undefined") return;

  try {
    const payload = params ?? {};
    if (typeof window.gtag === "function") {
      window.gtag("event", event, payload);
      return;
    }
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", event, payload]);
  } catch {
    // silently fail — analytics should never break the UX
  }
}
