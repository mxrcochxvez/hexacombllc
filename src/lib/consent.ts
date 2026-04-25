"use client";

export type Consent = "accepted" | "declined" | null;

const KEY = "cookie-consent";

export function getConsent(): Consent {
  if (typeof window === "undefined") return null;
  const val = localStorage.getItem(KEY);
  if (val === "accepted" || val === "declined") return val;
  return null;
}

export function setConsent(consent: "accepted" | "declined") {
  if (typeof window === "undefined") return;
  localStorage.setItem(KEY, consent);
  window.dispatchEvent(new Event("cookie-consent-change"));
}
