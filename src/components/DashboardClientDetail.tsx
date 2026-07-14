"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CLIENT_PHASES,
  CLIENT_PHASE_LABELS,
  DESIGN_DEMO_STATUS_LABELS,
  type ClientPhase,
  type DesignDemoStatus,
} from "@/lib/statuses";
import { DashboardNav } from "@/components/DashboardNav";

type ClientDetail = {
  _id: string;
  leadId: string;
  name: string;
  email: string;
  phase: ClientPhase;
  designReviewUrl?: string;
  productionUrl?: string;
  goalsSummary?: string;
  feedbackToken?: string;
  createdAt: number;
};

type LeadSummary = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
};

type ClientNote = {
  _id: string;
  clientId: string;
  parentId?: string;
  body: string;
  createdAt: number;
};

type ClientFeedbackItem = {
  _id: string;
  message: string;
  rating?: number;
  submitterName?: string;
  createdAt: number;
};

type DesignDemoItem = {
  _id: string;
  title: string;
  demoUrl: string;
  accessToken: string;
  status: DesignDemoStatus;
  sentAt?: number;
  createdAt: number;
};

type DesignDemoCommentItem = {
  _id: string;
  demoId: string;
  body: string;
  xPercent: number;
  yPercent: number;
  screenshotUrl: string | null;
  submitterName?: string;
  createdAt: number;
};

type FormState = {
  name: string;
  phase: ClientPhase;
  designReviewUrl: string;
  productionUrl: string;
  goalsSummary: string;
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

export function DashboardClientDetail({
  client,
  lead,
  notes: initialNotes,
  feedback: initialFeedback,
  demos: initialDemos,
  demoComments: initialDemoComments,
  feedbackPath,
}: {
  client: ClientDetail;
  lead: LeadSummary;
  notes: ClientNote[];
  feedback: ClientFeedbackItem[];
  demos: DesignDemoItem[];
  demoComments: DesignDemoCommentItem[];
  feedbackPath: string;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: client.name,
    phase: client.phase,
    designReviewUrl: client.designReviewUrl || "",
    productionUrl: client.productionUrl || "",
    goalsSummary: client.goalsSummary || "",
  });
  const [notes, setNotes] = useState(initialNotes);
  const [feedback] = useState(initialFeedback);
  const [demos, setDemos] = useState(initialDemos);
  const [demoComments] = useState(initialDemoComments);
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);
  const [revertPending, setRevertPending] = useState(false);
  const [noteBody, setNoteBody] = useState("");
  const [notePending, setNotePending] = useState(false);
  const [noteMsg, setNoteMsg] = useState("");
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyBody, setReplyBody] = useState("");
  const [replyPending, setReplyPending] = useState(false);
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [demoTitle, setDemoTitle] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [demoPending, setDemoPending] = useState(false);
  const [demoMsg, setDemoMsg] = useState("");
  const [demoActionId, setDemoActionId] = useState<string | null>(null);
  const [copiedDemoId, setCopiedDemoId] = useState<string | null>(null);

  const demoTitleById = demos.reduce<Record<string, string>>((acc, demo) => {
    acc[demo._id] = demo.title;
    return acc;
  }, {});

  const rootNotes = notes.filter((n) => !n.parentId);
  const repliesByParent = notes.reduce<Record<string, ClientNote[]>>(
    (acc, note) => {
      if (!note.parentId) return acc;
      const list = acc[note.parentId] ?? [];
      list.push(note);
      acc[note.parentId] = list;
      return acc;
    },
    {},
  );

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setPending(true);
    try {
      const res = await fetch(`/api/dashboard/clients/${client._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          phase: form.phase,
          designReviewUrl: form.designReviewUrl,
          productionUrl: form.productionUrl,
          goalsSummary: form.goalsSummary,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setMsg(data.error || "Failed to save.");
        return;
      }
      setMsg("Saved.");
      router.refresh();
    } catch {
      setMsg("Failed to save.");
    } finally {
      setPending(false);
    }
  }

  async function revertToLead() {
    if (
      !window.confirm(
        "Revert this client back to a lead? The client record will be removed and the lead will move to Negotiating.",
      )
    ) {
      return;
    }
    setMsg("");
    setRevertPending(true);
    try {
      const res = await fetch(
        `/api/dashboard/clients/${client._id}/revert`,
        { method: "POST" },
      );
      const data = (await res.json()) as { error?: string; leadId?: string };
      if (!res.ok) {
        setMsg(data.error || "Failed to revert.");
        return;
      }
      if (data.leadId) {
        router.push(`/dashboard/leads/${data.leadId}`);
        router.refresh();
        return;
      }
      router.push("/dashboard/clients");
      router.refresh();
    } catch {
      setMsg("Failed to revert.");
    } finally {
      setRevertPending(false);
    }
  }

  async function addNote(body: string, parentId?: string) {
    const res = await fetch(`/api/dashboard/clients/${client._id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body, parentId }),
    });
    const data = (await res.json()) as {
      error?: string;
      note?: ClientNote;
    };
    if (!res.ok || !data.note) {
      throw new Error(data.error || "Failed to add note.");
    }
    setNotes((prev) => [...prev, data.note!]);
    return data.note;
  }

  async function deleteNote(noteId: string, isRoot: boolean) {
    const label = isRoot ? "note and its replies" : "reply";
    if (!window.confirm(`Delete this ${label}?`)) return;

    setDeletingNoteId(noteId);
    setNoteMsg("");
    try {
      const res = await fetch(
        `/api/dashboard/clients/${client._id}/notes/${noteId}`,
        { method: "DELETE" },
      );
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        throw new Error(data.error || "Failed to delete note.");
      }
      setNotes((prev) =>
        prev.filter((n) => {
          if (n._id === noteId) return false;
          if (isRoot && n.parentId === noteId) return false;
          return true;
        }),
      );
      if (replyTo === noteId) {
        setReplyTo(null);
        setReplyBody("");
      }
      setNoteMsg(isRoot ? "Note deleted." : "Reply deleted.");
    } catch (err) {
      setNoteMsg(
        err instanceof Error ? err.message : "Failed to delete note.",
      );
    } finally {
      setDeletingNoteId(null);
    }
  }

  async function submitRootNote(e: React.FormEvent) {
    e.preventDefault();
    setNoteMsg("");
    const body = noteBody.trim();
    if (!body) {
      setNoteMsg("Write a note first.");
      return;
    }
    setNotePending(true);
    try {
      await addNote(body);
      setNoteBody("");
      setNoteMsg("Note added.");
    } catch (err) {
      setNoteMsg(err instanceof Error ? err.message : "Failed to add note.");
    } finally {
      setNotePending(false);
    }
  }

  async function submitReply(e: React.FormEvent) {
    e.preventDefault();
    if (!replyTo) return;
    const body = replyBody.trim();
    if (!body) return;
    setReplyPending(true);
    setNoteMsg("");
    try {
      await addNote(body, replyTo);
      setReplyBody("");
      setReplyTo(null);
      setNoteMsg("Reply added.");
    } catch (err) {
      setNoteMsg(err instanceof Error ? err.message : "Failed to add reply.");
    } finally {
      setReplyPending(false);
    }
  }

  async function copyFeedbackLink() {
    try {
      const absolute =
        typeof window !== "undefined"
          ? `${window.location.origin}${feedbackPath}`
          : feedbackPath;
      await navigator.clipboard.writeText(absolute);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  function reviewPathFor(token: string) {
    return `/review/${token}`;
  }

  async function copyDemoLink(demo: DesignDemoItem) {
    try {
      const path = reviewPathFor(demo.accessToken);
      const absolute =
        typeof window !== "undefined"
          ? `${window.location.origin}${path}`
          : path;
      await navigator.clipboard.writeText(absolute);
      setCopiedDemoId(demo._id);
      window.setTimeout(() => setCopiedDemoId(null), 2000);
    } catch {
      setCopiedDemoId(null);
    }
  }

  async function createDemo(e: React.FormEvent) {
    e.preventDefault();
    setDemoMsg("");
    const title = demoTitle.trim();
    const url = demoUrl.trim();
    if (!title || !url) {
      setDemoMsg("Title and demo URL are required.");
      return;
    }
    setDemoPending(true);
    try {
      const res = await fetch(`/api/dashboard/clients/${client._id}/demos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, demoUrl: url }),
      });
      const data = (await res.json()) as {
        error?: string;
        demo?: DesignDemoItem;
      };
      if (!res.ok || !data.demo) {
        throw new Error(data.error || "Failed to create demo.");
      }
      setDemos((prev) => [data.demo!, ...prev]);
      setDemoTitle("");
      setDemoUrl("");
      setDemoMsg("Design demo created.");
    } catch (err) {
      setDemoMsg(
        err instanceof Error ? err.message : "Failed to create demo.",
      );
    } finally {
      setDemoPending(false);
    }
  }

  async function sendDemo(demoId: string) {
    setDemoActionId(demoId);
    setDemoMsg("");
    try {
      const res = await fetch(
        `/api/dashboard/clients/${client._id}/demos/${demoId}/send`,
        { method: "POST" },
      );
      const data = (await res.json()) as {
        error?: string;
        reviewUrl?: string;
      };
      if (!res.ok) {
        throw new Error(data.error || "Failed to email demo.");
      }
      setDemos((prev) =>
        prev.map((d) =>
          d._id === demoId
            ? { ...d, status: "sent" as const, sentAt: d.sentAt ?? Date.now() }
            : d,
        ),
      );
      setDemoMsg(
        data.reviewUrl
          ? `Review email sent. Link: ${data.reviewUrl}`
          : "Review email sent.",
      );
    } catch (err) {
      setDemoMsg(
        err instanceof Error ? err.message : "Failed to email demo.",
      );
    } finally {
      setDemoActionId(null);
    }
  }

  async function closeDemo(demoId: string) {
    if (!window.confirm("Close this design review link?")) return;
    setDemoActionId(demoId);
    setDemoMsg("");
    try {
      const res = await fetch(
        `/api/dashboard/clients/${client._id}/demos/${demoId}`,
        { method: "PATCH" },
      );
      const data = (await res.json()) as {
        error?: string;
        demo?: DesignDemoItem;
      };
      if (!res.ok || !data.demo) {
        throw new Error(data.error || "Failed to close demo.");
      }
      setDemos((prev) =>
        prev.map((d) => (d._id === demoId ? { ...d, ...data.demo! } : d)),
      );
      setDemoMsg("Design review closed.");
    } catch (err) {
      setDemoMsg(
        err instanceof Error ? err.message : "Failed to close demo.",
      );
    } finally {
      setDemoActionId(null);
    }
  }

  return (
    <div className="dash-shell">
      <p className="mb-4">
        <Link href="/dashboard/clients">← All clients</Link>
      </p>

      <DashboardNav
        title={form.name || client.name}
        subtitle={client.email}
        showSectionNav={false}
      />

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Contact</h2>
        <dl className="dash-dl">
          <div>
            <dt>Lead contact</dt>
            <dd>
              <Link href={`/dashboard/leads/${lead._id}`}>{lead.name}</Link>
            </dd>
          </div>
          <div>
            <dt>Phone</dt>
            <dd>{lead.phone || "—"}</dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>{lead.business || "—"}</dd>
          </div>
          <div>
            <dt>Original website</dt>
            <dd>{lead.website || "—"}</dd>
          </div>
        </dl>
      </section>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Client feedback link</h2>
        <p className="dash-muted mb-3">
          Send this private link for overall feedback about their current site
          or working with Hexacomb. For clickable design previews, use Design
          demos below.
        </p>
        {feedbackPath ? (
          <>
            <p className="mb-3">
              <a href={feedbackPath} target="_blank" rel="noreferrer">
                {feedbackPath}
              </a>
            </p>
            <div className="dash-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => void copyFeedbackLink()}
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
          </>
        ) : (
          <p className="dash-muted">Feedback link is still being prepared.</p>
        )}

        {feedback.length > 0 ? (
          <div className="dash-thread mt-6">
            <h3 className="dash-thread__heading">Received feedback</h3>
            <ul className="dash-thread__list">
              {feedback.map((item) => (
                <li key={item._id} className="dash-thread__item">
                  <div className="dash-thread__meta">
                    <span>
                      {item.submitterName?.trim() || "Anonymous"}
                      {item.rating !== undefined
                        ? ` · ${item.rating}/5`
                        : ""}
                    </span>
                    <time dateTime={new Date(item.createdAt).toISOString()}>
                      {formatWhen(item.createdAt)}
                    </time>
                  </div>
                  <p className="dash-thread__body">{item.message}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="dash-muted mt-4">No feedback submitted yet.</p>
        )}
      </section>

      <form onSubmit={(e) => void save(e)} className="dash-card mb-8">
        <h2 className="dash-section-title">Project</h2>

        <div className="dash-grid">
          <div className="form-group">
            <label htmlFor="clientName">Display name</label>
            <input
              id="clientName"
              value={form.name}
              disabled={pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, name: e.target.value }))
              }
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="clientPhase">Phase</label>
            <select
              id="clientPhase"
              value={form.phase}
              disabled={pending}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  phase: e.target.value as ClientPhase,
                }))
              }
            >
              {CLIENT_PHASES.map((phase) => (
                <option key={phase} value={phase}>
                  {CLIENT_PHASE_LABELS[phase]}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="designReviewUrl">Design review URL</label>
            <input
              id="designReviewUrl"
              type="url"
              placeholder="https://…"
              value={form.designReviewUrl}
              disabled={pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, designReviewUrl: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="productionUrl">Production URL</label>
            <input
              id="productionUrl"
              type="url"
              placeholder="https://…"
              value={form.productionUrl}
              disabled={pending}
              onChange={(e) =>
                setForm((f) => ({ ...f, productionUrl: e.target.value }))
              }
            />
          </div>
        </div>

        <div className="form-group mt-4">
          <label htmlFor="goalsSummary">Goals summary</label>
          <textarea
            id="goalsSummary"
            rows={4}
            value={form.goalsSummary}
            disabled={pending}
            onChange={(e) =>
              setForm((f) => ({ ...f, goalsSummary: e.target.value }))
            }
          />
        </div>

        <div className="dash-actions mt-6">
          <button
            type="submit"
            className="btn btn-primary"
            disabled={pending || revertPending}
          >
            {pending ? "Saving…" : "Save"}
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            disabled={pending || revertPending}
            onClick={() => void revertToLead()}
          >
            {revertPending ? "Reverting…" : "Revert to lead"}
          </button>
        </div>

        {msg ? (
          <p className="mt-3 text-sm" role="status">
            {msg}
          </p>
        ) : null}
      </form>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Design demos</h2>
        <p className="dash-muted mb-4">
          Create a review link for each design iteration. The client opens the
          link, clicks on the preview, and leaves pin comments with
          screenshots.
        </p>

        <form onSubmit={(e) => void createDemo(e)} className="mb-6">
          <div className="form-group">
            <label htmlFor="demoTitle">Title</label>
            <input
              id="demoTitle"
              value={demoTitle}
              disabled={demoPending}
              onChange={(e) => setDemoTitle(e.target.value)}
              placeholder="Homepage v2"
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="demoUrlInput">Demo URL</label>
            <input
              id="demoUrlInput"
              type="url"
              value={demoUrl}
              disabled={demoPending}
              onChange={(e) => setDemoUrl(e.target.value)}
              placeholder="https://preview.example.com/"
            />
          </div>
          <div className="dash-actions mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={demoPending}
            >
              {demoPending ? "Creating…" : "Create demo"}
            </button>
          </div>
          {demoMsg ? (
            <p className="mt-3 text-sm" role="status">
              {demoMsg}
            </p>
          ) : null}
        </form>

        {demos.length === 0 ? (
          <p className="dash-muted">No design demos yet.</p>
        ) : (
          <ul className="dash-thread__list">
            {demos.map((demo) => {
              const path = reviewPathFor(demo.accessToken);
              return (
                <li key={demo._id} className="dash-thread__item">
                  <div className="dash-thread__meta">
                    <span>
                      {demo.title} · {DESIGN_DEMO_STATUS_LABELS[demo.status]}
                    </span>
                    <time dateTime={new Date(demo.createdAt).toISOString()}>
                      {formatWhen(demo.createdAt)}
                    </time>
                  </div>
                  <p className="dash-muted mb-2">
                    <a href={demo.demoUrl} target="_blank" rel="noreferrer">
                      {demo.demoUrl}
                    </a>
                  </p>
                  <p className="mb-3">
                    <a href={path} target="_blank" rel="noreferrer">
                      {path}
                    </a>
                  </p>
                  <div className="dash-actions">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => void copyDemoLink(demo)}
                    >
                      {copiedDemoId === demo._id ? "Copied" : "Copy link"}
                    </button>
                    {demo.status !== "closed" ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        disabled={demoActionId === demo._id}
                        onClick={() => void sendDemo(demo._id)}
                      >
                        {demoActionId === demo._id
                          ? "Sending…"
                          : demo.status === "sent"
                            ? "Resend email"
                            : "Email client"}
                      </button>
                    ) : null}
                    {demo.status !== "closed" ? (
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={demoActionId === demo._id}
                        onClick={() => void closeDemo(demo._id)}
                      >
                        Close
                      </button>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {demoComments.length > 0 ? (
          <div className="dash-thread mt-6">
            <h3 className="dash-thread__heading">Design preview comments</h3>
            <ul className="dash-thread__list">
              {demoComments.map((comment) => (
                <li key={comment._id} className="dash-thread__item">
                  <div className="dash-thread__meta">
                    <span>
                      {demoTitleById[comment.demoId] || "Demo"} ·{" "}
                      {comment.submitterName?.trim() || "Anonymous"} · pin{" "}
                      {Math.round(comment.xPercent)}%,{" "}
                      {Math.round(comment.yPercent)}%
                    </span>
                    <time
                      dateTime={new Date(comment.createdAt).toISOString()}
                    >
                      {formatWhen(comment.createdAt)}
                    </time>
                  </div>
                  {comment.screenshotUrl ? (
                    <div className="demo-comment-shot">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={comment.screenshotUrl}
                        alt="Screenshot of commented preview"
                        className="demo-comment-shot__img"
                      />
                      <span
                        className="demo-comment-shot__pin"
                        style={{
                          left: `${comment.xPercent}%`,
                          top: `${comment.yPercent}%`,
                        }}
                        aria-hidden
                      />
                    </div>
                  ) : null}
                  <p className="dash-thread__body">{comment.body}</p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Conversation notes</h2>
        <p className="dash-muted mb-4">
          Each note is saved as its own record. Reply to a note to keep related
          discussion together.
        </p>

        {rootNotes.length === 0 ? (
          <p className="dash-muted mb-4">No notes yet.</p>
        ) : (
          <ul className="dash-thread__list mb-6">
            {rootNotes.map((note) => {
              const replies = repliesByParent[note._id] ?? [];
              return (
                <li key={note._id} className="dash-thread__item">
                  <div className="dash-thread__meta">
                    <span>Note</span>
                    <time dateTime={new Date(note.createdAt).toISOString()}>
                      {formatWhen(note.createdAt)}
                    </time>
                  </div>
                  <p className="dash-thread__body">{note.body}</p>

                  {replies.length > 0 ? (
                    <ul className="dash-thread__replies">
                      {replies.map((reply) => (
                        <li key={reply._id} className="dash-thread__item is-reply">
                          <div className="dash-thread__meta">
                            <span>Reply</span>
                            <time
                              dateTime={new Date(reply.createdAt).toISOString()}
                            >
                              {formatWhen(reply.createdAt)}
                            </time>
                          </div>
                          <p className="dash-thread__body">{reply.body}</p>
                          <div className="dash-actions mt-2">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              disabled={deletingNoteId === reply._id}
                              onClick={() =>
                                void deleteNote(reply._id, false)
                              }
                            >
                              {deletingNoteId === reply._id
                                ? "Deleting…"
                                : "Delete"}
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {replyTo === note._id ? (
                    <form
                      onSubmit={(e) => void submitReply(e)}
                      className="dash-thread__composer mt-3"
                    >
                      <label className="sr-only" htmlFor={`reply-${note._id}`}>
                        Reply
                      </label>
                      <textarea
                        id={`reply-${note._id}`}
                        rows={3}
                        value={replyBody}
                        disabled={replyPending}
                        onChange={(e) => setReplyBody(e.target.value)}
                        placeholder="Write a reply…"
                        required
                      />
                      <div className="dash-actions mt-2">
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={replyPending}
                        >
                          {replyPending ? "Posting…" : "Post reply"}
                        </button>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          disabled={replyPending}
                          onClick={() => {
                            setReplyTo(null);
                            setReplyBody("");
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="dash-actions mt-3">
                      <button
                        type="button"
                        className="btn btn-secondary"
                        onClick={() => {
                          setReplyTo(note._id);
                          setReplyBody("");
                          setNoteMsg("");
                        }}
                      >
                        Reply
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        disabled={deletingNoteId === note._id}
                        onClick={() => void deleteNote(note._id, true)}
                      >
                        {deletingNoteId === note._id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}

        <form onSubmit={(e) => void submitRootNote(e)}>
          <div className="form-group">
            <label htmlFor="new-note">Add a note</label>
            <textarea
              id="new-note"
              rows={4}
              value={noteBody}
              disabled={notePending}
              onChange={(e) => setNoteBody(e.target.value)}
              placeholder="Call summary, next steps, reminders…"
            />
          </div>
          <div className="dash-actions mt-3">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={notePending}
            >
              {notePending ? "Adding…" : "Add note"}
            </button>
          </div>
          {noteMsg ? (
            <p className="mt-3 text-sm" role="status">
              {noteMsg}
            </p>
          ) : null}
        </form>
      </section>
    </div>
  );
}
