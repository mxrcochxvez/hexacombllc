"use client";

import { useState, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { track } from "@/lib/analytics";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADC6NwtGoO-9AuVg";

const labelClass = "mb-1.5 block font-display text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-md border border-border bg-canvas px-3.5 py-2.5 text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20 transition-colors";
const errorClass = "mt-1 block font-display text-xs text-danger";
const fieldWrap = "mb-4";

interface FieldErrors {
  name?: string;
  email?: string;
  phone?: string;
  website?: string;
}

function validateName(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Full name is required.";
  if (v.length < 2) return "Name must be at least 2 characters.";
}

function validateEmail(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Email address is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Enter a valid email address.";
}

function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  if (!/^[\d\s\-\+\(\)\.]+$/.test(v) || v.replace(/\D/g, "").length < 10) {
    return "Enter a valid phone number.";
  }
}

function validateWebsite(value: string): string | undefined {
  const v = value.trim();
  if (!v) return undefined;
  try {
    const url = new URL(v);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return "URL must start with http:// or https://";
    }
  } catch {
    return "Enter a valid URL (e.g. https://example.com).";
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: string) => {
    let error: string | undefined;
    if (name === "name") error = validateName(value);
    else if (name === "email") error = validateEmail(value);
    else if (name === "phone") error = validatePhone(value);
    else if (name === "website") error = validateWebsite(value);

    setFieldErrors((prev) => ({ ...prev, [name]: error }));
    return error;
  }, []);

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      setTouched((prev) => ({ ...prev, [name]: true }));
      validateField(name, value);
    },
    [validateField]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.currentTarget;
      if (touched[name]) {
        validateField(name, value);
      }
    },
    [touched, validateField]
  );

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "");
    const email = String(formData.get("email") ?? "");
    const phone = String(formData.get("phone") ?? "");
    const website = String(formData.get("website") ?? "");
    const message = String(formData.get("message") ?? "");

    const errors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      phone: validatePhone(phone),
      website: validateWebsite(website),
    };

    setTouched({ name: true, email: true, phone: true, website: true });
    setFieldErrors(errors);

    if (errors.name || errors.email || errors.phone || errors.website) {
      return;
    }

    if (!turnstileToken) {
      setErrorMsg("Please complete the security check.");
      return;
    }

    setStatus("sending");
    setErrorMsg("");
    track("contact_form_submit", { name, email, hasWebsite: !!website });

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          business: formData.get("business"),
          website,
          message,
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      track("contact_form_success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send message."
      );
      track("contact_form_error", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  if (status === "success") {
    return (
      <div
        className="rounded-md border border-success/30 bg-success-soft px-5 py-7"
        role="alert"
      >
        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-success/10">
          <svg
            className="text-success"
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            aria-hidden
          >
            <path
              d="M2.5 8.5l4 4 8-8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h3 className="font-display text-lg font-semibold text-success">
          Message received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          We&rsquo;ll follow up by the end of the next business day. No sales pitch, just
          honest next steps.
        </p>
      </div>
    );
  }

  const isSubmitDisabled = status === "sending" || !turnstileToken;

  return (
    <form onSubmit={handleSubmit} aria-label="Contact form" noValidate>
      {/* Name + Email */}
      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className={fieldWrap}>
          <label htmlFor="name" className={labelClass}>
            Full name <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.name && (
            <span id="name-error" className={errorClass} role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>
        <div className={fieldWrap}>
          <label htmlFor="email" className={labelClass}>
            Email <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@yourbusiness.com"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <span id="email-error" className={errorClass} role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      {/* Business + Phone */}
      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className={fieldWrap}>
          <label htmlFor="business" className={labelClass}>
            Business name
          </label>
          <input
            type="text"
            id="business"
            name="business"
            autoComplete="organization"
            placeholder="Your business"
            disabled={status === "sending"}
            className={inputClass}
          />
        </div>
        <div className={fieldWrap}>
          <label htmlFor="phone" className={labelClass}>
            Phone
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            autoComplete="tel"
            placeholder="(559) 555-0100"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.phone && (
            <span id="phone-error" className={errorClass} role="alert">
              {fieldErrors.phone}
            </span>
          )}
        </div>
      </div>

      {/* Website */}
      <div className={fieldWrap}>
        <label htmlFor="website" className={labelClass}>
          Current website{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <input
          type="url"
          id="website"
          name="website"
          autoComplete="url"
          placeholder="https://"
          disabled={status === "sending"}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.website}
          aria-describedby={fieldErrors.website ? "website-error" : undefined}
          className={inputClass}
        />
        {fieldErrors.website && (
          <span id="website-error" className={errorClass} role="alert">
            {fieldErrors.website}
          </span>
        )}
      </div>

      {/* Message */}
      <div className={fieldWrap}>
        <label htmlFor="message" className={labelClass}>
          What can we help with?{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={3}
          placeholder="Describe what you're trying to get done…"
          disabled={status === "sending"}
          maxLength={1000}
          className="w-full resize-none rounded-md border border-border bg-canvas px-3.5 py-2.5 text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        />
      </div>

      <div className="mb-5">
        <Turnstile
          siteKey={SITE_KEY}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      {errorMsg && (
        <p
          className="mb-4 rounded-md border border-danger/20 bg-danger-soft px-3.5 py-2.5 font-display text-sm text-danger"
          role="alert"
        >
          {errorMsg}
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        className="group inline-flex w-full min-h-12 items-center justify-center gap-2 rounded-md bg-accent px-4 py-3 font-display text-base font-semibold text-canvas transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        {status === "sending" ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
            Sending&hellip;
          </>
        ) : (
          <>
            Send message
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden
            >
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </>
        )}
      </button>
    </form>
  );
}
