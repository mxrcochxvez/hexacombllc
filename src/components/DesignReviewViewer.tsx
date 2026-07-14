"use client";

import { useRef, useState } from "react";
import type { DesignDemoStatus } from "@/lib/statuses";

type PinComment = {
  _id: string;
  body: string;
  xPercent: number;
  yPercent: number;
  submitterName?: string;
  createdAt: number;
};

type DraftPin = {
  xPercent: number;
  yPercent: number;
};

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
  initialComments: PinComment[];
}) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [comments, setComments] = useState(initialComments);
  const [draft, setDraft] = useState<DraftPin | null>(null);
  const [body, setBody] = useState("");
  const [submitterName, setSubmitterName] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const closed = status === "closed";

  function onOverlayClick(e: React.MouseEvent<HTMLButtonElement>) {
    if (closed || pending) return;
    const rect = e.currentTarget.getBoundingClientRect();
    if (rect.width <= 0 || rect.height <= 0) return;
    const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
    const yPercent = ((e.clientY - rect.top) / rect.height) * 100;
    setDraft({
      xPercent: Math.min(100, Math.max(0, xPercent)),
      yPercent: Math.min(100, Math.max(0, yPercent)),
    });
    setError("");
    setNotice("");
  }

  async function submitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    const message = body.trim();
    if (!message) {
      setError("Write a comment first.");
      return;
    }

    setPending(true);
    setError("");
    try {
      const res = await fetch(`/api/review/${token}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          body: message,
          xPercent: draft.xPercent,
          yPercent: draft.yPercent,
          submitterName: submitterName.trim() || undefined,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        comment?: PinComment;
      };
      if (!res.ok || !data.comment) {
        throw new Error(data.error || "Could not save comment.");
      }
      setComments((prev) => [...prev, data.comment!]);
      setBody("");
      setDraft(null);
      setNotice("Comment saved. Thank you!");
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
      <header className="review-header">
        <div>
          <p className="review-eyebrow">Hexacomb LLC · Design review</p>
          <h1 className="review-title">{title}</h1>
          <p className="review-sub">
            Preview for <strong>{clientName}</strong>.{" "}
            {closed
              ? "This review is closed."
              : "Click anywhere on the preview to leave a comment."}
          </p>
        </div>
        <p className="review-hint">
          Point the demo URL at the exact page under review — navigation
          inside the preview may not be tracked.
        </p>
      </header>

      <div className="review-stage" ref={frameRef}>
        <iframe
          className="review-iframe"
          src={demoUrl}
          title={`Design preview: ${title}`}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
        {!closed ? (
          <button
            type="button"
            className="review-overlay"
            aria-label="Click to add feedback at this spot"
            onClick={onOverlayClick}
          />
        ) : null}

        {comments.map((comment) => (
          <span
            key={comment._id}
            className="review-pin is-saved"
            style={{
              left: `${comment.xPercent}%`,
              top: `${comment.yPercent}%`,
            }}
            title={comment.body}
          />
        ))}

        {draft ? (
          <span
            className="review-pin is-draft"
            style={{ left: `${draft.xPercent}%`, top: `${draft.yPercent}%` }}
          />
        ) : null}
      </div>

      {draft && !closed ? (
        <form className="review-composer" onSubmit={(e) => void submitComment(e)}>
          <h2>Add a comment</h2>
          <p className="dash-muted">
            Pin at {Math.round(draft.xPercent)}%, {Math.round(draft.yPercent)}%
          </p>
          <div className="form-group mt-3">
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
            <label htmlFor="review-body">Comment</label>
            <textarea
              id="review-body"
              rows={4}
              required
              value={body}
              disabled={pending}
              onChange={(e) => setBody(e.target.value)}
              placeholder="What should we change here?"
            />
          </div>
          {error ? (
            <p className="mt-3 text-sm" role="alert">
              {error}
            </p>
          ) : null}
          <div className="dash-actions mt-4">
            <button type="submit" className="btn btn-primary" disabled={pending}>
              {pending ? "Saving…" : "Save comment"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              disabled={pending}
              onClick={() => {
                setDraft(null);
                setBody("");
                setError("");
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {notice ? (
        <p className="review-notice" role="status">
          {notice}
        </p>
      ) : null}
    </div>
  );
}
