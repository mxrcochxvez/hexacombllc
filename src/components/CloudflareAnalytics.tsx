"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { getConsent, type Consent } from "@/lib/consent";

/**
 * Injects the Cloudflare Web Analytics beacon script only after the user
 * has accepted cookies.
 *
 * To enable: add your beacon token from
 *   Dashboard → Analytics → Web Analytics → Add site
 * as the `CF_ANALYTICS_TOKEN` environment variable in wrangler.jsonc
 * (or .dev.vars for local dev).
 */
export default function CloudflareAnalytics({
  token,
}: {
  token?: string;
}) {
  const [consent, setConsent] = useState<Consent>(null);

  useEffect(() => {
    const check = () => setConsent(getConsent());
    check();

    window.addEventListener("cookie-consent-change", check);
    return () => window.removeEventListener("cookie-consent-change", check);
  }, []);

  if (!token || consent !== "accepted") return null;

  return (
    <Script
      defer
      src="https://static.cloudflareinsights.com/beacon.min.js"
      data-cf-beacon={`{"token": "${token}"}`}
      strategy="afterInteractive"
    />
  );
}
