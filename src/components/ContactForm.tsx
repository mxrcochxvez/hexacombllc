"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { track, trackGA4 } from "@/lib/analytics";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADC6NwtGoO-9AuVg";

const labelClass = "hobro-label";
const inputClass = "hobro-input";
const errorClass = "hobro-field-error";
const fieldWrap = "hobro-field";

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

export function ContactForm({ initialMessage }: { initialMessage?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const statusRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (messageRef.current && !messageRef.current.value) {
      try {
        const stored = sessionStorage.getItem("hexacomb-contact-context");
        const prefill = initialMessage ?? (stored ? stored : undefined);
        if (prefill) {
          messageRef.current.value = prefill;
          if (stored && !initialMessage) sessionStorage.removeItem("hexacomb-contact-context");
        }
      } catch {
        if (initialMessage && messageRef.current) messageRef.current.value = initialMessage;
      }
    }
  }, [initialMessage]);

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
      // Focus the first field with an error
      const firstErrorField = Object.keys(errors).find(
        (key) => errors[key as keyof FieldErrors]
      );
      if (firstErrorField) {
        const el = form.querySelector<HTMLInputElement>(`[name="${firstErrorField}"]`);
        el?.focus();
      }
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

      const data = (await res.json()) as { error?: string };

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Please try again.");
      }

      setStatus("success");
      track("contact_form_success");
      trackGA4("generate_lead");
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
        ref={statusRef}
        className="hobro-form-success"
        role="status"
        aria-live="polite"
        tabIndex={-1}
      >
        <div className="hobro-form-success-mark" aria-hidden="true">
          <svg
            width="17"
            height="17"
            viewBox="0 0 17 17"
            fill="none"
            aria-hidden="true"
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
        <h3>Message received</h3>
        <p>
          We&rsquo;ll follow up by the end of the next business day. No sales pitch, just
          honest next steps.
        </p>
      </div>
    );
  }

  const isSubmitDisabled = status === "sending" || !turnstileToken;

  return (
    <form className="hobro-form" onSubmit={handleSubmit} aria-label="Contact form" noValidate>
      <div className="hobro-form-row">
        <div className={fieldWrap}>
          <label htmlFor="name" className={labelClass}>
            Full name <span className="hobro-required" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            aria-required="true"
            autoComplete="name"
            placeholder="Your name"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={touched.name && !!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "name-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.name && (
            <span id="name-error" className={errorClass} role="alert" aria-live="assertive">
              {fieldErrors.name}
            </span>
          )}
        </div>
        <div className={fieldWrap}>
          <label htmlFor="email" className={labelClass}>
            Email <span className="hobro-required" aria-hidden="true">*</span>
            <span className="sr-only">(required)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            aria-required="true"
            autoComplete="email"
            placeholder="you@yourbusiness.com"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={touched.email && !!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <span id="email-error" className={errorClass} role="alert" aria-live="assertive">
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      <div className="hobro-form-row">
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
            aria-invalid={touched.phone && !!fieldErrors.phone}
            aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.phone && (
            <span id="phone-error" className={errorClass} role="alert" aria-live="assertive">
              {fieldErrors.phone}
            </span>
          )}
        </div>
      </div>

      {/* Website */}
      <div className={fieldWrap}>
        <label htmlFor="website" className={labelClass}>
          Current website <span className="hobro-optional">(optional)</span>
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
          aria-invalid={touched.website && !!fieldErrors.website}
          aria-describedby={fieldErrors.website ? "website-error" : undefined}
          className={inputClass}
        />
        {fieldErrors.website && (
          <span id="website-error" className={errorClass} role="alert" aria-live="assertive">
            {fieldErrors.website}
          </span>
        )}
      </div>

      {/* Message */}
      <div className={fieldWrap}>
        <label htmlFor="message" className={labelClass}>
          What can we help with? <span className="hobro-optional">(optional)</span>
        </label>
        <textarea
          id="message"
          name="message"
          ref={messageRef}
          rows={3}
          defaultValue={initialMessage}
          placeholder="Describe what you're trying to get done…"
          disabled={status === "sending"}
          maxLength={1000}
          className={inputClass}
        />
      </div>

      <div className="hobro-turnstile">
        <Turnstile
          siteKey={SITE_KEY}
          onSuccess={setTurnstileToken}
          onExpire={() => setTurnstileToken(null)}
          onError={() => setTurnstileToken(null)}
        />
      </div>

      {errorMsg && (
        <p className="hobro-form-alert" role="alert" aria-live="assertive">
          {errorMsg}
        </p>
      )}

      {!turnstileToken && status !== "sending" && (
        <p className="hobro-form-hint" id="send-hint">
          The security check has to finish before this can send.
        </p>
      )}

      <button
        type="submit"
        disabled={isSubmitDisabled}
        aria-disabled={isSubmitDisabled}
        aria-describedby={!turnstileToken ? "send-hint" : undefined}
        className="hobro-send"
      >
        {status === "sending" ? (
          <>
            <svg
              className="hobro-send-spin"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
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
            <span aria-live="polite">Sending&hellip;</span>
          </>
        ) : (
          <>
            Send message
            <svg
              className="hobro-send-arrow"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
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
