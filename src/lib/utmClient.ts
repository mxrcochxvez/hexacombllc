"use client";

import { getConsent } from "@/lib/consent";
import { sanitizeUtm, UTM_KEYS, type UtmAttribution } from "@/lib/utm";

const STORAGE_KEY = "hexacomb-utm-attribution";

/** Last explicitly tagged campaign during the current tab session. */
export function captureUtm(search: string): void {
  if (typeof window === "undefined") return;
  try {
    if (getConsent() !== "accepted") return;
    const params = new URLSearchParams(search);
    const raw: Record<string, string | null> = {};
    for (const key of UTM_KEYS) raw[key] = params.get(`utm_${key}`);
    const attribution = sanitizeUtm(raw);
    // Untagged internal navigation should not erase the campaign.
    if (attribution) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(attribution));
  } catch {
    // Storage restrictions must never interrupt form submission.
  }
}

export function clearUtm(): void {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Ignore blocked storage.
  }
}

export function getUtm(): UtmAttribution | undefined {
  if (typeof window === "undefined") return undefined;
  try {
    if (getConsent() !== "accepted") return undefined;
    captureUtm(window.location.search);
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? sanitizeUtm(JSON.parse(stored)) : undefined;
  } catch {
    return undefined;
  }
}
