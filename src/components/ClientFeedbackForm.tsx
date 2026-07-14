"use client";

import { useState } from "react";

export function ClientFeedbackForm({
  token,
  clientName,
}: {
  token: string;
  clientName: string;
}) {
  const [submitterName, setSubmitterName] = useState("");
  const [rating, setRating] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch(`/api/feedback/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          submitterName: submitterName.trim() || undefined,
          rating: rating ? Number(rating) : undefined,
          message: message.trim(),
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not submit feedback.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not submit feedback. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="contract-shell">
        <div className="form-success dash-card">
          <h1>Thank you</h1>
          <p>
            Your feedback for <strong>{clientName}</strong> was received. We
            appreciate you taking the time to share it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-shell">
      <header className="mb-6">
        <p className="dash-muted mb-2">Hexacomb LLC</p>
        <h1 className="dash-title">Share your feedback</h1>
        <p className="dash-muted mt-2">
          Tell us how things are going for <strong>{clientName}</strong>. Your
          notes help us improve the site and our support.
        </p>
      </header>

      <form onSubmit={(e) => void onSubmit(e)} className="dash-card">
        <div className="form-group">
          <label htmlFor="feedback-name">Your name (optional)</label>
          <input
            id="feedback-name"
            value={submitterName}
            disabled={pending}
            onChange={(e) => setSubmitterName(e.target.value)}
            autoComplete="name"
          />
        </div>

        <div className="form-group mt-4">
          <label htmlFor="feedback-rating">Overall rating (optional)</label>
          <select
            id="feedback-rating"
            value={rating}
            disabled={pending}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">No rating</option>
            <option value="5">5 — Excellent</option>
            <option value="4">4 — Good</option>
            <option value="3">3 — Okay</option>
            <option value="2">2 — Needs work</option>
            <option value="1">1 — Poor</option>
          </select>
        </div>

        <div className="form-group mt-4">
          <label htmlFor="feedback-message">Your feedback</label>
          <textarea
            id="feedback-message"
            rows={6}
            required
            value={message}
            disabled={pending}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="What is working well? What could be better?"
          />
        </div>

        {error ? (
          <p className="mt-3 text-sm" role="alert">
            {error}
          </p>
        ) : null}

        <div className="dash-actions mt-6">
          <button type="submit" className="btn btn-primary" disabled={pending}>
            {pending ? "Sending…" : "Send feedback"}
          </button>
        </div>
      </form>
    </div>
  );
}
