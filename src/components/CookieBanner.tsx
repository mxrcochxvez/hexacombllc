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

  const handleAccept = () => {
    setConsent("accepted");
  };

  const handleDecline = () => {
    setConsent("declined");
  };

  return (
    <div
      className="cookie-banner"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie consent"
    >
      <div className="cookie-banner-inner container">
        <p className="cookie-banner-text">
          We use cookies to analyze site traffic and improve your experience.
          By clicking <strong>Accept</strong>, you consent to our use of cookies.
        </p>
        <div className="cookie-banner-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            type="button"
            className="btn btn-outline"
            onClick={handleDecline}
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
