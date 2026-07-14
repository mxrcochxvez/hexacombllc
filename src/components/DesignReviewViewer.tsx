"use client";

import { useState } from "react";
import type { DesignDemoStatus } from "@/lib/statuses";

type DemoComment = {
  _id: string;
  body: string;
  submitterName?: string;
  createdAt: number;
};

function formatWhen(ts: number): string {
  try {
    return new Date(ts).toLocaleString(undefined, {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return "";
  }
}

export function DesignReviewViewer({
  token,
  title,
  demoUrl,
  clientName,
  status,
  initialComments,
}: {
  token: string;
  title: string;
  demoUrl: string;
  clientName: string;
  status: DesignDemoStatus;
  initialComments: DemoComment[];
}) {
  const [comments, setComments] = useState(initialComments);
  const [open, setOpen] = useState(false);
  const [body, setBody] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const closed = status === "closed";

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    const message = body.trim();
    if (!message) {
      setError("Write a comment first.");
      return;
    }

    setPending(true);
    setError("");
    setNotice("");
    try {
      const res = await fetch(`/api/review/${token}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: message,
          submitterName: submitterName.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        comment?: DemoComment;
      };
      if (!res.ok || !data.comment) {
        throw new Error(data.error || "Could not save comment.");
      }
      setComments((prev) => [...prev, data.comment!]);
      setBody("");
      setNotice("Thanks — your feedback was sent.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not save comment.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="review-shell">
      <div className="review-stage">
        <iframe
          className="review-iframe"
          src={demoUrl}
          title={`Design preview: ${title}`}
          // Allow normal browsing inside the demo; no overlay on top.
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
        />
      </div>

      {!closed ? (
        <button
          type="button"
          className={`review-fab${open ? " is-open" : ""}`}
          aria-expanded={open}
          aria-controls="review-chat-panel"
          onClick={() => {
            setOpen((v) => !v);
            setError("");
            setNotice("");
          }}
        >
          <span className="sr-only">
            {open ? "Close feedback" : "Open feedback"}
          </span>
          <span aria-hidden className="review-fab__icon">
            {open ? (
              <span className="review-fab__close">×</span>
            ) : (
              <span className="review-fab__bubble" />
            )}
          </span>
        </button>
      ) : null}

      {open && !closed ? (
        <aside
          id="review-chat-panel"
          className="review-chat"
          aria-label="Design feedback"
        >
          <header className="review-chat__header">
            <div>
              <p className="review-chat__eyebrow">Hexacomb</p>
              <h1 className="review-chat__title">{title}</h1>
              <p className="review-chat__sub">
                Preview for <strong>{clientName}</strong>. Browse the site, then
                leave feedback here.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setOpen(false)}
            >
              Close
            </button>
          </header>

          <div className="review-chat__thread">
            {comments.length === 0 ? (
              <p className="dash-muted">No feedback yet. Be the first.</p>
            ) : (
              <ul className="review-chat__list">
                {comments.map((comment) => (
                  <li key={comment._id} className="review-chat__item">
                    <div className="review-chat__meta">
                      <span>{comment.submitterName?.trim() || "Anonymous"}</span>
                      <time
                        dateTime={new Date(comment.createdAt).toISOString()}
                      >
                        {formatWhen(comment.createdAt)}
                      </time>
                    </div>
                    <p className="review-chat__body">{comment.body}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <form
            className="review-chat__composer"
            onSubmit={(e) => void submitComment(e)}
          >
            <div className="form-group">
              <label htmlFor="review-name">Your name (optional)</label>
              <input
                id="review-name"
                value={submitterName}
                disabled={pending}
                onChange={(e) => setSubmitterName(e.target.value)}
                autoComplete="name"
              />
            </div>
            <div className="form-group mt-3">
              <label htmlFor="review-body">Your feedback</label>
              <textarea
                id="review-body"
                rows={4}
                required
                value={body}
                disabled={pending}
                onChange={(e) => setBody(e.target.value)}
                placeholder="What do you like? What should change?"
              />
            </div>
            {error ? (
              <p className="mt-3 text-sm" role="alert">
                {error}
              </p>
            ) : null}
            {notice ? (
              <p className="mt-3 text-sm" role="status">
                {notice}
              </p>
            ) : null}
            <div className="dash-actions mt-4">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={pending}
              >
                {pending ? "Sending…" : "Send feedback"}
              </button>
            </div>
          </form>
        </aside>
      ) : null}

      {closed ? (
        <p className="review-closed-banner" role="status">
          This design review is closed.
        </p>
      ) : null}
    </div>
  );
}
