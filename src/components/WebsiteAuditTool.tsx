"use client";

import { useState, useRef } from "react";
import { AlertTriangle, CheckCircle2, Search, ShieldAlert, Timer, XCircle } from "lucide-react";
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

interface AuditResult {
  url: string;
  finalUrl: string;
  scannedAt: string;
  overall: number;
  headline: string;
  recommendations?: string[];
  sections: {
    seo: AuditSection;
    speed: AuditSection;
    issues: AuditSection;
  };
}

const sectionMeta = {
  seo: {
    title: "Can customers find you?",
    label: "SEO",
    icon: Search,
  },
  speed: {
    title: "Does the site feel fast?",
    label: "Load time",
    icon: Timer,
  },
  issues: {
    title: "What might break trust?",
    label: "Issues",
    icon: ShieldAlert,
  },
} as const;

function statusIcon(status: AuditStatus) {
  if (status === "good") return <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />;
  if (status === "warning") return <AlertTriangle size={18} strokeWidth={2} aria-hidden="true" />;
  return <XCircle size={18} strokeWidth={2} aria-hidden="true" />;
}

function statusLabel(status: AuditStatus): string {
  if (status === "good") return "Good";
  if (status === "warning") return "Warning";
  return "Issue";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 55) return "Needs attention";
  return "Costing you leads";
}

export default function WebsiteAuditTool() {
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AuditResult | null>(null);
  const resultsRef = useRef<HTMLElement>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setError("");
    setResult(null);
    track("website_audit_submit", { hasUrl: !!url.trim() });

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "We could not audit that site.");
      }

      setResult(data as AuditResult);
      setStatus("success");
      track("website_audit_success", { overall: (data as AuditResult).overall });

      // Move focus to results
      setTimeout(() => resultsRef.current?.focus(), 100);
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "We could not audit that site.");
      track("website_audit_error", {
        message: err instanceof Error ? err.message : "Unknown error",
      });
    }
  }

  return (
    <div className="audit-tool">
      <form className="audit-form" onSubmit={handleSubmit} aria-label="Website audit form">
        <label htmlFor="audit-url">Website to audit</label>
        <div className="audit-input-row">
          <input
            id="audit-url"
            name="url"
            type="url"
            inputMode="url"
            autoComplete="url"
            placeholder="https://yourbusiness.com"
            value={url}
            onChange={(event) => setUrl(event.currentTarget.value)}
            disabled={status === "loading"}
            required
            aria-required="true"
            aria-describedby="audit-url-note"
          />
          <button
            className="btn btn-primary"
            type="submit"
            disabled={status === "loading"}
            aria-disabled={status === "loading"}
          >
            {status === "loading" ? "Auditing..." : "Run Audit"}
          </button>
        </div>
        <p className="audit-form-note" id="audit-url-note">
          This scans one public page and translates the findings into business terms.
        </p>
        {status === "error" && (
          <p className="audit-error" role="alert" aria-live="assertive">
            {error}
          </p>
        )}
      </form>

      {status === "loading" && (
        <div className="audit-loading" role="status" aria-live="polite" aria-busy="true">
          <div className="loading-shimmer" aria-hidden="true" />
          <p>Checking the page customers see first...</p>
        </div>
      )}

      {result && (
        <section
          ref={resultsRef}
          className="audit-results"
          aria-labelledby="audit-results-heading"
          tabIndex={-1}
        >
          <div className="audit-score-panel">
            <div
              className="audit-score-ring"
              style={{ "--score": `${result.overall}%` } as React.CSSProperties}
              role="img"
              aria-label={`Overall audit score: ${result.overall} out of 100`}
            >
              <span aria-hidden="true">{result.overall}</span>
            </div>
            <div>
              <span className="section-label">Audit Snapshot</span>
              <h2 id="audit-results-heading">{result.headline}</h2>
              <p>
                Scanned <strong>{result.finalUrl}</strong>. Use this as a first-pass warning light,
                then have a human review the full customer journey.
              </p>
            </div>
          </div>

          <div className="audit-section-grid">
            {Object.entries(result.sections).map(([key, section]) => {
              const meta = sectionMeta[key as keyof typeof sectionMeta];
              const Icon = meta.icon;
              return (
                <article className="audit-section-card" key={key} aria-label={`${meta.label}: ${scoreLabel(section.score)}`}>
                  <div className="audit-section-header">
                    <div className="audit-section-icon" aria-hidden="true">
                      <Icon size={24} strokeWidth={1.8} />
                    </div>
                    <div>
                      <span>{meta.label}</span>
                      <h3>{meta.title}</h3>
                    </div>
                    <strong className={`audit-pill audit-pill-${scoreLabel(section.score).toLowerCase().replace(/\s+/g, "-")}`}>
                      {scoreLabel(section.score)}
                    </strong>
                  </div>
                  <p className="audit-section-summary">{section.summary}</p>
                  <ul className="audit-check-list" aria-label={`${meta.label} checks`}>
                    {section.checks.map((check) => (
                      <li className={`audit-check audit-check-${check.status}`} key={check.label}>
                        <span aria-hidden="true">{statusIcon(check.status)}</span>
                        <div>
                          <strong>
                            <span className="sr-only">{statusLabel(check.status)}: </span>
                            {check.label}
                          </strong>
                          <p>{check.message}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                </article>
              );
            })}
          </div>

          {result.recommendations && result.recommendations.length > 0 && (
            <aside className="audit-recommendations" aria-labelledby="audit-recommendations-heading">
              <span className="section-label">Recommended Fixes</span>
              <h3 id="audit-recommendations-heading">What I Would Fix First</h3>
              <ol>
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ol>
            </aside>
          )}
        </section>
      )}
    </div>
  );
}
