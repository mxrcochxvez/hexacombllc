"use client";

import { useState, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";
import { track } from "@/lib/analytics";

const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADC6NwtGoO-9AuVg";

interface FieldErrors {
  name?: string;
  email?: string;
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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) return "Please enter a valid email address.";
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
    return "Please enter a valid URL (e.g. https://example.com).";
  }
}

export function ContactForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validateField = useCallback((name: string, value: string) => {
    let error: string | undefined;
    if (name === "name") error = validateName(value);
    else if (name === "email") error = validateEmail(value);
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
    const website = String(formData.get("website") ?? "");

    const errors: FieldErrors = {
      name: validateName(name),
      email: validateEmail(email),
      website: validateWebsite(website),
    };

    setTouched({ name: true, email: true, website: true });
    setFieldErrors(errors);

    if (errors.name || errors.email || errors.website) {
      setErrorMsg("Please fix the errors above before submitting.");
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
          business: formData.get("business"),
          website,
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
      <div className="form-success" role="alert">
        <h3>Application Received</h3>
        <p>
          Thank you! I&rsquo;ll reach out within 24 hours to schedule your free
          discovery call.
        </p>
      </div>
    );
  }

  const isSubmitDisabled = status === "sending" || !turnstileToken;

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
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.name}
          aria-describedby={fieldErrors.name ? "name-error" : undefined}
        />
        {fieldErrors.name && (
          <span id="name-error" className="field-error" role="alert">
            {fieldErrors.name}
          </span>
        )}
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
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.email}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
        />
        {fieldErrors.email && (
          <span id="email-error" className="field-error" role="alert">
            {fieldErrors.email}
          </span>
        )}
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
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.website}
          aria-describedby={fieldErrors.website ? "website-error" : undefined}
        />
        {fieldErrors.website && (
          <span id="website-error" className="field-error" role="alert">
            {fieldErrors.website}
          </span>
        )}
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
        disabled={isSubmitDisabled}
        style={{ width: "100%", justifyContent: "center", marginTop: 12 }}
      >
        {status === "sending" ? "Sending..." : "Send Application →"}
      </button>
    </form>
  );
}
