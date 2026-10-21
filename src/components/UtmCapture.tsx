"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getConsent } from "@/lib/consent";
import { captureUtm, clearUtm } from "@/lib/utmClient";

/** Capture tagged landings, client navigation, and consent changes. */
export default function UtmCapture() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const sync = () => {
      if (getConsent() === "declined") clearUtm();
      else captureUtm(window.location.search);
    };
    sync();
    window.addEventListener("cookie-consent-change", sync);
    return () => window.removeEventListener("cookie-consent-change", sync);
  }, [pathname, searchParams]);

  return null;
}
