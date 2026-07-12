"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CLIENT_PHASES,
  CLIENT_PHASE_LABELS,
  type ClientPhase,
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
  conversationNotes?: string;
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

type FormState = {
  name: string;
  phase: ClientPhase;
  designReviewUrl: string;
  productionUrl: string;
  goalsSummary: string;
  conversationNotes: string;
};

export function DashboardClientDetail({
  client,
  lead,
}: {
  client: ClientDetail;
  lead: LeadSummary;
}) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: client.name,
    phase: client.phase,
    designReviewUrl: client.designReviewUrl || "",
    productionUrl: client.productionUrl || "",
    goalsSummary: client.goalsSummary || "",
    conversationNotes: client.conversationNotes || "",
  });
  const [msg, setMsg] = useState("");
  const [pending, setPending] = useState(false);
  const [revertPending, setRevertPending] = useState(false);

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
          conversationNotes: form.conversationNotes,
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

        <div className="form-group mt-4">
          <label htmlFor="conversationNotes">Conversation notes</label>
          <textarea
            id="conversationNotes"
            rows={8}
            value={form.conversationNotes}
            disabled={pending}
            onChange={(e) =>
              setForm((f) => ({ ...f, conversationNotes: e.target.value }))
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
    </div>
  );
}
