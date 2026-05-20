"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const check = () => setVisible(getConsent() === null);
    check();

    window.addEventListener("cookie-consent-change", check);
    return () => window.removeEventListener("cookie-consent-change", check);
  }, []);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-[60] border-t border-border bg-canvas p-4 shadow-[0_-8px_30px_oklch(22%_0.025_265/0.08)] sm:p-5"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p className="text-sm leading-relaxed text-ink-muted">
          We use cookies to analyze site traffic. By clicking Accept, you consent to our use of
          cookies.
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => setConsent("accepted")}
            className="rounded-md bg-accent px-4 py-2 font-display text-sm font-semibold text-canvas hover:bg-accent-hover"
          >
            Accept
          </button>
          <button
            type="button"
            onClick={() => setConsent("declined")}
            className="rounded-md border border-border px-4 py-2 font-display text-sm font-medium text-ink hover:bg-surface"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
