"use client";

import { useState, useCallback } from "react";
import { Turnstile } from "@marsidev/react-turnstile";

const SITE_KEY =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "0x4AAAAAADC6NwtGoO-9AuVg";

const labelClass = "mb-1.5 block font-display text-sm font-semibold text-ink";
const inputClass =
  "w-full rounded-md border border-border bg-canvas px-3.5 py-2.5 text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 aria-[invalid=true]:border-danger aria-[invalid=true]:focus:ring-danger/20 transition-colors";
const selectClass =
  "w-full rounded-md border border-border bg-canvas px-3.5 py-2.5 text-ink focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 transition-colors";
const errorClass = "mt-1 block font-display text-xs text-danger";
const fieldWrap = "mb-4";
const sectionTitle =
  "mb-4 mt-8 font-display text-lg font-semibold text-ink border-b border-border pb-2";

const INDUSTRIES = [
  "Restaurant",
  "Retail",
  "Professional Services",
  "Construction/Trades",
  "Healthcare",
  "Real Estate",
  "Other",
];

const GOALS = [
  "Get more customers",
  "Establish online presence",
  "Replace outdated site",
  "Sell products/services online",
  "Provide information/resources",
  "Other",
];

const PAGE_COUNTS = [
  "1-3 (simple)",
  "4-7 (standard)",
  "8-15 (comprehensive)",
  "15+ (large)",
];

const VISITOR_RANGES = [
  "Not sure",
  "Under 500",
  "500-2,000",
  "2,000-10,000",
  "10,000+",
];

const FEATURES = [
  "Online booking/scheduling",
  "Contact forms",
  "E-commerce/online store",
  "Blog/content section",
  "Customer portal/login area",
  "Integration with existing tools",
  "SEO optimization",
  "Social media integration",
];

const TIMELINES = ["ASAP", "1-2 weeks", "1 month", "2-3 months", "No rush"];


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
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
    return "Enter a valid email address.";
}

function validatePhone(value: string): string | undefined {
  const v = value.trim();
  if (!v) return "Phone number is required.";
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

export function IntakeForm() {
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [hasExistingWebsite, setHasExistingWebsite] = useState<string>("");

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

    const features = FEATURES.filter(
      (f) => formData.get(`feature_${f}`) === "on"
    );

    try {
      const res = await fetch("/api/intake", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          phone,
          business: formData.get("business") ?? "",
          industry: formData.get("industry") ?? "",
          hasExistingWebsite: formData.get("hasExistingWebsite") ?? "",
          website,
          goal: formData.get("goal") ?? "",
          pageCount: formData.get("pageCount") ?? "",
          visitors: formData.get("visitors") ?? "",
          features,
          timeline: formData.get("timeline") ?? "",
          notes: formData.get("notes") ?? "",
          turnstileToken,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(
          data.error || "Something went wrong. Please try again."
        );
      }

      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Failed to send. Please try again."
      );
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
          Project inquiry received
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-ink">
          Thank you for sharing your project details. We&rsquo;ll review
          everything and reach out within one business day with tailored
          recommendations and next steps.
        </p>
      </div>
    );
  }

  const isSubmitDisabled = status === "sending" || !turnstileToken;

  return (
    <form onSubmit={handleSubmit} aria-label="Project intake form" noValidate>
      {/* ── Contact Information ───────────────────────────────── */}
      <h2 className={sectionTitle}>Contact Information</h2>

      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className={fieldWrap}>
          <label htmlFor="intake-name" className={labelClass}>
            Full name <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            type="text"
            id="intake-name"
            name="name"
            required
            autoComplete="name"
            placeholder="Your name"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "intake-name-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.name && (
            <span id="intake-name-error" className={errorClass} role="alert">
              {fieldErrors.name}
            </span>
          )}
        </div>

        <div className={fieldWrap}>
          <label htmlFor="intake-email" className={labelClass}>
            Email <span className="text-accent" aria-hidden>*</span>
          </label>
          <input
            type="email"
            id="intake-email"
            name="email"
            required
            autoComplete="email"
            placeholder="you@yourbusiness.com"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "intake-email-error" : undefined}
            className={inputClass}
          />
          {fieldErrors.email && (
            <span id="intake-email-error" className={errorClass} role="alert">
              {fieldErrors.email}
            </span>
          )}
        </div>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="intake-phone" className={labelClass}>
          Phone <span className="text-accent" aria-hidden>*</span>
        </label>
        <input
          type="tel"
          id="intake-phone"
          name="phone"
          required
          autoComplete="tel"
          placeholder="(559) 555-0100"
          disabled={status === "sending"}
          onBlur={handleBlur}
          onChange={handleChange}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "intake-phone-error" : undefined}
          className={inputClass}
        />
        {fieldErrors.phone && (
          <span id="intake-phone-error" className={errorClass} role="alert">
            {fieldErrors.phone}
          </span>
        )}
      </div>

      {/* ── Project Details ───────────────────────────────────── */}
      <h2 className={sectionTitle}>Project Details</h2>

      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className={fieldWrap}>
          <label htmlFor="intake-business" className={labelClass}>
            Business name
          </label>
          <input
            type="text"
            id="intake-business"
            name="business"
            autoComplete="organization"
            placeholder="Your business"
            disabled={status === "sending"}
            className={inputClass}
          />
        </div>

        <div className={fieldWrap}>
          <label htmlFor="intake-industry" className={labelClass}>
            Industry / type of business
          </label>
          <select
            id="intake-industry"
            name="industry"
            disabled={status === "sending"}
            className={selectClass}
          >
            <option value="">Select an industry</option>
            {INDUSTRIES.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={fieldWrap}>
        <fieldset>
          <legend className={labelClass}>
            Do you have an existing website?
          </legend>
          <div className="mt-1.5 flex gap-6">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="hasExistingWebsite"
                value="Yes"
                disabled={status === "sending"}
                onChange={() => setHasExistingWebsite("Yes")}
                className="accent-accent"
              />
              Yes
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink">
              <input
                type="radio"
                name="hasExistingWebsite"
                value="No"
                disabled={status === "sending"}
                onChange={() => setHasExistingWebsite("No")}
                className="accent-accent"
              />
              No
            </label>
          </div>
        </fieldset>
      </div>

      {hasExistingWebsite === "Yes" && (
        <div className={fieldWrap}>
          <label htmlFor="intake-website" className={labelClass}>
            Current website URL
          </label>
          <input
            type="url"
            id="intake-website"
            name="website"
            autoComplete="url"
            placeholder="https://"
            disabled={status === "sending"}
            onBlur={handleBlur}
            onChange={handleChange}
            aria-invalid={!!fieldErrors.website}
            aria-describedby={
              fieldErrors.website ? "intake-website-error" : undefined
            }
            className={inputClass}
          />
          {fieldErrors.website && (
            <span id="intake-website-error" className={errorClass} role="alert">
              {fieldErrors.website}
            </span>
          )}
        </div>
      )}

      <div className="sm:grid sm:grid-cols-2 sm:gap-4">
        <div className={fieldWrap}>
          <label htmlFor="intake-goal" className={labelClass}>
            Primary goal for your website
          </label>
          <select
            id="intake-goal"
            name="goal"
            disabled={status === "sending"}
            className={selectClass}
          >
            <option value="">Select a goal</option>
            {GOALS.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div className={fieldWrap}>
          <label htmlFor="intake-pageCount" className={labelClass}>
            How many pages do you anticipate?
          </label>
          <select
            id="intake-pageCount"
            name="pageCount"
            disabled={status === "sending"}
            className={selectClass}
          >
            <option value="">Select a range</option>
            {PAGE_COUNTS.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="intake-visitors" className={labelClass}>
          Anticipated monthly visitors/users
        </label>
        <select
          id="intake-visitors"
          name="visitors"
          disabled={status === "sending"}
          className={selectClass}
        >
          <option value="">Select a range</option>
          {VISITOR_RANGES.map((v) => (
            <option key={v} value={v}>
              {v}
            </option>
          ))}
        </select>
      </div>

      <div className={fieldWrap}>
        <fieldset>
          <legend className={labelClass}>
            Do you need any of the following?
          </legend>
          <div className="mt-2 grid gap-2 sm:grid-cols-2">
            {FEATURES.map((feature) => (
              <label
                key={feature}
                className="flex cursor-pointer items-center gap-2.5 text-sm text-ink"
              >
                <input
                  type="checkbox"
                  name={`feature_${feature}`}
                  disabled={status === "sending"}
                  className="accent-accent rounded"
                />
                {feature}
              </label>
            ))}
          </div>
        </fieldset>
      </div>

      {/* ── Timeline ─────────────────────────────────────────── */}
      <h2 className={sectionTitle}>Timeline</h2>

      <div className={fieldWrap}>
        <label htmlFor="intake-timeline" className={labelClass}>
          What&rsquo;s your timeline?
        </label>
        <select
          id="intake-timeline"
          name="timeline"
          disabled={status === "sending"}
          className={selectClass}
        >
          <option value="">Select a timeline</option>
          {TIMELINES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      <div className={fieldWrap}>
        <label htmlFor="intake-notes" className={labelClass}>
          Anything else we should know?{" "}
          <span className="font-normal text-ink-muted">(optional)</span>
        </label>
        <textarea
          id="intake-notes"
          name="notes"
          rows={4}
          placeholder="Share any additional details, inspiration sites, specific requirements…"
          disabled={status === "sending"}
          maxLength={2000}
          className="w-full resize-none rounded-md border border-border bg-canvas px-3.5 py-2.5 text-ink placeholder:text-ink-muted/50 focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/20 disabled:cursor-not-allowed disabled:opacity-60 transition-colors"
        />
      </div>

      {/* Turnstile */}
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
            Submitting&hellip;
          </>
        ) : (
          <>
            Submit project inquiry
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
