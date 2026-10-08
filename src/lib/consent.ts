"use client";

export type Consent = "accepted" | "declined" | null;

const KEY = "cookie-consent";

type StorageState = "granted" | "denied";

function consentStorageState(consent: Consent): StorageState {
  return consent === "accepted" ? "granted" : "denied";
}

function gtagConsentParams(consent: Consent): {
  analytics_storage: StorageState;
  ad_storage: StorageState;
  ad_user_data: StorageState;
  ad_personalization: StorageState;
} {
  const value = consentStorageState(consent);
  return {
    analytics_storage: value,
    ad_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  };
}

function ensureGtag(): void {
  if (typeof window === "undefined") return;
  window.dataLayer = window.dataLayer || [];
  if (typeof window.gtag !== "function") {
    window.gtag = function gtag(...args: unknown[]) {
      window.dataLayer?.push(args);
    };
  }
}

/**
 * Update Google Consent Mode v2 after a banner choice (or on load if a
 * previous choice is stored). Must not throw — consent is never on the UX path.
 */
export function applyGtagConsent(consent: Consent): void {
  if (typeof window === "undefined") return;
  try {
    ensureGtag();
    window.gtag?.("consent", "update", gtagConsentParams(consent));
  } catch {
    // Consent updates must never break the UX.
  }
}

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(KEY);
  if (val === "accepted" || val === "declined") return val;
  return null;
}

export function setConsent(consent: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, consent);
  applyGtagConsent(consent);
  window.dispatchEvent(new Event("cookie-consent-change"));
}
