"use client";

import { useState } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADC6NwtGoO-9AuVg";

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!turnstileToken) {
      setErrorMsg("Please complete the security check.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          email: formData.get("email"),
          business: formData.get("business"),
          website: formData.get("website"),
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send message."
      );
    }
  }

  if (status === "success") {
    return (
      <div className="form-success" role="alert">
        <h3>Application Received</h3>
        <p>
          Thank you! I&rsquo;ll reach out within 24 hours to schedule your free
          discovery call.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form" noValidate>
      <div className="form-group">
        <label htmlFor="name">
          Full Name <span aria-hidden>*</span>
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          disabled={status === "sending"}
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">
          Email Address <span aria-hidden>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          autoComplete="email"
          placeholder="you@yourbusiness.com"
          disabled={status === "sending"}
        />
      </div>
      <div className="form-group">
        <label htmlFor="business">Business Name</label>
        <input
          type="text"
          id="business"
          name="business"
          autoComplete="organization"
          placeholder="Your business name"
          disabled={status === "sending"}
        />
      </div>
      <div className="form-group">
        <label htmlFor="website">Current Website URL</label>
        <input
          type="url"
          id="website"
          name="website"
          autoComplete="url"
          placeholder="https://"
          disabled={status === "sending"}
        />
      </div>

      <div className="form-group">
        <Turnstile
          siteKey={SITE_KEY}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      {errorMsg && (
        <p
          className="form-error"
          role="alert"
          style={{
            color: "#dc2626",
            fontSize: "0.875rem",
            marginTop: 8,
            marginBottom: 0,
          }}
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        className="btn btn-primary"
        disabled={status === "sending"}
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        {status === "sending" ? "Sending..." : "Send Application →"}
      </button>
    </form>
  );
}
