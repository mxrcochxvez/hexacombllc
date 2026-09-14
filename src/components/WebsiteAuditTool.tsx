"use client";

import { useRef, useState } from "react";
import { track } from "@/lib/analytics";

type AuditStatus = "good" | "warning" | "bad";

interface AuditCheck {
  label: string;
  status: AuditStatus;
  message: string;
}

interface AuditSection {
  score: number;
  summary: string;
  checks: AuditCheck[];
}

interface Priority {
  title: string;
  why: string;
  ifYouWait: string;
  owner: "you" | "hexacomb";
}

interface AuditResult {
  url: string;
  finalUrl: string;
  scannedAt: string;
  overall: number;
  headline: string;
  preview: {
    title: string;
    description: string;
    displayUrl: string;
    siteName: string;
    href: string;
  };
  priorities: Priority[];
  shareText: string;
  recommendations?: string[];
  sections: {
    seo: AuditSection;
    speed: AuditSection;
    issues: AuditSection;
  };
}

const sectionCopy = {
  seo: "Can customers find you?",
  speed: "Does it feel late?",
  issues: "Would they trust it?",
} as const;

function statusWord(status: AuditStatus) {
  if (status === "good") return "Clear";
  if (status === "warning") return "Watch";
  return "Fix";
}

function scoreTone(score: number): AuditStatus {
  if (score >= 80) return "good";
  if (score >= 55) return "warning";
  return "bad";
}

function statusClass(status: AuditStatus) {
  return `hobro-audit-status hobro-audit-status-${status}`;
}

export default function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);
    setCopied(false);
    track("website_audit_submit", { hasUrl: !!url.trim() });

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = (await response.json()) as AuditResult & { error?: string };

      if (!response.ok) {
        throw new Error(data.error || "We could not audit that site.");
      }

      setResult(data as AuditResult);
      setStatus("success");
      track("website_audit_success", { overall: (data as AuditResult).overall });
      setTimeout(() => resultsRef.current?.focus(), 100);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We could not audit that site.");
      track("website_audit_error", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  async function copyBrief() {
    if (!result?.shareText) return;
    try {
      await navigator.clipboard.writeText(result.shareText);
      setCopied(true);
      track("website_audit_copy_brief");
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="hobro-audit">
      <form className="hobro-audit-form" onSubmit={handleSubmit} aria-label="Website audit form">
        <label htmlFor="audit-url">Your website</label>
        <div className="hobro-audit-row">
          <input
            id="audit-url"
            name="url"
            type="text"
            inputMode="url"
            autoComplete="url"
            placeholder="https://yourbusiness.com"
            value={url}
            onChange={(event) => setUrl(event.currentTarget.value)}
            disabled={status === "loading"}
            required
            aria-required="true"
            aria-describedby="audit-url-hint"
          />
          <button
            type="submit"
            className="hobro-deck-btn hobro-deck-btn-solid"
            disabled={status === "loading"}
            aria-busy={status === "loading" || undefined}
          >
            {status === "loading" ? "Reading the page…" : "Check my website"}
          </button>
        </div>
        <p id="audit-url-hint">One public page. Written for the person who owns the business.</p>
        {status === "error" ? (
          <p className="hobro-audit-error" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}
      </form>

      {status === "loading" ? (
        <div className="hobro-audit-loading" role="status" aria-live="polite" aria-busy="true">
          <p>Checking the page a customer sees first…</p>
        </div>
      ) : null}

      {result ? (
        <section
          ref={resultsRef}
          className="hobro-audit-report"
          aria-labelledby="audit-results-heading"
          tabIndex={-1}
        >
          <header className="hobro-audit-verdict" data-status={scoreTone(result.overall)}>
            <p className="hobro-kicker">First look</p>
            <p className="hobro-audit-mark" aria-hidden="true">
              {result.overall}
            </p>
            <h2 id="audit-results-heading">{result.headline}</h2>
            <p>
              First page at {result.preview.displayUrl}. Not a crawl of the whole site.
              <span className="sr-only"> First look: {result.overall} of 100.</span>
            </p>
          </header>

          <div className="hobro-audit-brief">
            <figure className="hobro-audit-listing">
              <p className="hobro-kicker">What Google shows</p>
              <figcaption className="sr-only">This is the listing a stranger sees.</figcaption>
              <div
                className="growth-google-window"
                role="img"
                aria-label={`Google result preview. Title: ${result.preview.title}. ${result.preview.description}`}
              >
                <div className="growth-google-chrome" aria-hidden="true">
                  <svg className="growth-google-mark" viewBox="0 0 24 24" width="28" height="28">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.72z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <div className="growth-google-search">
                    <span>{result.preview.siteName}</span>
                    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#5f6368" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M20 20l-3.2-3.2" />
                    </svg>
                  </div>
                </div>
                <div className="growth-google-result">
                  <div className="growth-google-cite">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      className="growth-google-favicon"
                      src={`https://www.google.com/s2/favicons?sz=64&domain=${encodeURIComponent(result.preview.displayUrl)}`}
                      alt=""
                      width={26}
                      height={26}
                    />
                    <div>
                      <p className="growth-google-site">{result.preview.siteName}</p>
                      <p className="growth-google-url">{result.preview.href}</p>
                    </div>
                  </div>
                  <p className="growth-google-title">{result.preview.title}</p>
                  <p className="growth-google-snippet">{result.preview.description}</p>
                </div>
              </div>
              <p>If you would not click that, a stranger looking for your kind of business will not click it either.</p>
            </figure>

            {result.priorities.length ? (
              <div className="hobro-audit-work">
                <p className="hobro-kicker">What to fix first</p>
                <ol>
                  {result.priorities.map((item) => (
                    <li key={item.title} data-status="bad">
                      <span className={statusClass("bad")}>Fix</span>
                      <h3>{item.title}</h3>
                      <p>{item.why}</p>
                      <p>
                        <strong>{item.owner === "you" ? "You can start this." : "We would handle this."}</strong>{" "}
                        {item.ifYouWait}
                      </p>
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}
          </div>

          <div className="hobro-audit-checks">
            <div className="hobro-audit-key" aria-hidden="true">
              <span className={statusClass("good")}>Clear</span>
              <span className={statusClass("warning")}>Watch</span>
              <span className={statusClass("bad")}>Fix</span>
            </div>

            <div className="hobro-audit-ledger">
              {Object.entries(result.sections).map(([key, section]) => (
                <article key={key} data-status={scoreTone(section.score)}>
                  <div className="hobro-audit-ledger-head">
                    <h3>{sectionCopy[key as keyof typeof sectionCopy]}</h3>
                    <p className="hobro-audit-mark">{section.score}</p>
                  </div>
                  <p>{section.summary}</p>
                  <ul>
                    {section.checks.map((check) => (
                      <li key={check.label} data-status={check.status}>
                        <span className={statusClass(check.status)} aria-hidden="true">
                          {statusWord(check.status)}
                        </span>
                        <strong>
                          {check.label}
                          <span className="sr-only"> {statusWord(check.status)}.</span>
                        </strong>
                        <p>{check.message}</p>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>

          {result.recommendations && result.recommendations.length > 0 ? (
            <div className="hobro-audit-extra">
              <p className="hobro-kicker">If we sat down today</p>
              <ul>
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="hobro-audit-actions">
            <a
              href="#contact"
              className="hobro-deck-btn hobro-deck-btn-solid"
              data-track="audit_talk_through_report"
              onClick={() => {
                try {
                  const context = result.shareText
                    ? `I ran the free audit on ${result.finalUrl}. ${result.headline} Here's what it gave me to share:\n\n${result.shareText}\n\nWhat would you do first?`
                    : `I ran the free audit on ${result.finalUrl}. ${result.headline} What would you do first?`;
                  sessionStorage.setItem("hexacomb-contact-context", context);
                } catch {
                  /* storage unavailable; contact form still works */
                }
              }}
            >
              Talk through this report
            </a>
            <button type="button" className="hobro-text-link" onClick={() => void copyBrief()}>
              {copied ? "Copied. Send it to whoever owns the site." : "Copy a note for your web person"}
            </button>
          </div>
        </section>
      ) : null}
    </div>
  );
}
