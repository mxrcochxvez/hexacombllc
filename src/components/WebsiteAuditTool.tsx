"use client";

import { useRef, useState } from "react";
import { ArrowUpRight, CheckCircle2, AlertTriangle, Search, ShieldAlert, Timer, XCircle } from "lucide-react";
import { track } from "@/lib/analytics";
import { Button, Cluster, Field } from "@/ui";

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

const sectionMeta = {
  seo: {
    title: "Can customers find you?",
    label: "Find you",
    icon: Search,
  },
  speed: {
    title: "Does it feel late?",
    label: "Feel",
    icon: Timer,
  },
  issues: {
    title: "Would they trust it?",
    label: "Trust",
    icon: ShieldAlert,
  },
} as const;

function statusIcon(status: AuditStatus) {
  if (status === "good") return <CheckCircle2 size={18} strokeWidth={2} aria-hidden="true" />;
  if (status === "warning") return <AlertTriangle size={18} strokeWidth={2} aria-hidden="true" />;
  return <XCircle size={18} strokeWidth={2} aria-hidden="true" />;
}

function statusLabel(status: AuditStatus) {
  if (status === "good") return "Good";
  if (status === "warning") return "Watch";
  return "Fix";
}

function scoreLabel(score: number) {
  if (score >= 80) return "Holding";
  if (score >= 55) return "Leaky";
  return "Leaking leads";
}

function scoreTone(score: number) {
  if (score >= 80) return "hold";
  if (score >= 55) return "leak";
  return "loss";
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
    <div className="growth-audit-tool">
      <form className="growth-audit-form" onSubmit={handleSubmit} aria-label="Website audit form">
        <Field label="Your website" hint="One public page. We translate what a stranger would notice.">
          <input
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
          />
        </Field>
        <Button type="submit" intent="signal" pending={status === "loading"}>
          {status === "loading" ? "Reading the page…" : "Check my website"}
        </Button>
        {status === "error" ? (
          <p className="growth-audit-error" role="alert" aria-live="assertive">
            {error}
          </p>
        ) : null}
      </form>

      {status === "loading" ? (
        <div className="growth-audit-loading" role="status" aria-live="polite" aria-busy="true">
          <p>Checking the page a customer sees first…</p>
        </div>
      ) : null}

      {result ? (
        <section
          ref={resultsRef}
          className="growth-audit-report"
          aria-labelledby="audit-results-heading"
          tabIndex={-1}
        >
          <header className="growth-audit-verdict">
            <p className="growth-audit-score" aria-label={`Overall score ${result.overall} out of 100`}>
              <strong>{result.overall}</strong>
              <span>/100</span>
            </p>
            <div>
              <p className="growth-audit-kicker">First-pass briefing</p>
              <h2 id="audit-results-heading">{result.headline}</h2>
              <p>
                Scanned {result.preview.displayUrl}. This is the homepage a stranger lands on, not a full crawl of
                every page.
              </p>
            </div>
          </header>

          <div className="growth-audit-split">
            <article className="growth-google" aria-labelledby="serp-heading">
              <h3 id="serp-heading">What a customer sees in Google</h3>
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
              <p className="growth-audit-note">
                If you would not click that, a stranger looking for your kind of business will not click it either.
              </p>
            </article>

            <ol className="growth-audit-week" aria-labelledby="week-heading">
              <li className="growth-audit-week-head">
                <h3 id="week-heading">Fix these first</h3>
                <p>Three moves ranked by lost calls, not by technical trivia.</p>
              </li>
              {result.priorities.map((item, index) => (
                <li key={item.title}>
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h4>{item.title}</h4>
                    <p>{item.why}</p>
                    <p>
                      <strong>{item.owner === "you" ? "You can start this." : "We would handle this."}</strong>{" "}
                      {item.ifYouWait}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="growth-audit-sections">
            {Object.entries(result.sections).map(([key, section]) => {
              const meta = sectionMeta[key as keyof typeof sectionMeta];
              const Icon = meta.icon;
              return (
                <article key={key} className="growth-audit-card" data-tone={scoreTone(section.score)}>
                  <div className="growth-audit-card-head">
                    <Icon size={22} strokeWidth={1.8} aria-hidden />
                    <div>
                      <span>{meta.label}</span>
                      <h3>{meta.title}</h3>
                    </div>
                    <strong>{scoreLabel(section.score)}</strong>
                  </div>
                  <p>{section.summary}</p>
                  <ul>
                    {section.checks.map((check) => (
                      <li key={check.label} data-status={check.status}>
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

          {result.recommendations && result.recommendations.length > 0 ? (
            <aside className="growth-audit-extra" aria-labelledby="audit-recommendations-heading">
              <h3 id="audit-recommendations-heading">If we sat down today</h3>
              <ol>
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ol>
            </aside>
          ) : null}

          <Cluster>
            <Button href="/#contact" intent="signal" data-track="audit_talk_through_report">
              Talk through this report <ArrowUpRight size={17} aria-hidden />
            </Button>
            <Button type="button" intent="ghost" onClick={() => void copyBrief()}>
              {copied ? "Copied. Send it to whoever owns the site." : "Copy a note for your web person"}
            </Button>
          </Cluster>
        </section>
      ) : null}
    </div>
  );
}
