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

export type DashboardClientRow = {
  _id: string;
  name: string;
  email: string;
  phase: ClientPhase;
  designReviewUrl?: string;
  productionUrl?: string;
  createdAt: number;
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function shortUrl(url?: string): string {
  if (!url) return "—";
  try {
    const parsed = new URL(url);
    return parsed.host + (parsed.pathname === "/" ? "" : parsed.pathname);
  } catch {
    return url;
  }
}

export function DashboardClientList({
  clients,
}: {
  clients: DashboardClientRow[];
}) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [business, setBusiness] = useState("");
  const [goalsSummary, setGoalsSummary] = useState("");
  const [phase, setPhase] = useState<ClientPhase>("design");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  async function createClient(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch("/api/dashboard/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || undefined,
          business: business.trim() || undefined,
          goalsSummary: goalsSummary.trim() || undefined,
          phase,
        }),
      });
      const data = (await res.json()) as {
        error?: string;
        clientId?: string;
      };
      if (!res.ok) {
        setError(data.error || "Failed to create client.");
        return;
      }
      if (data.clientId) {
        router.push(`/dashboard/clients/${data.clientId}`);
        router.refresh();
        return;
      }
      setShowForm(false);
      router.refresh();
    } catch {
      setError("Failed to create client.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="dash-shell">
      <DashboardNav
        title="Clients"
        subtitle="Project links, goals, feedback, and conversation notes."
      />

      <div className="dash-actions mb-6">
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => {
            setShowForm((open) => !open);
            setError("");
          }}
        >
          {showForm ? "Cancel" : "Add client"}
        </button>
      </div>

      {showForm ? (
        <form onSubmit={(e) => void createClient(e)} className="dash-card mb-8">
          <h2 className="dash-section-title">New client</h2>
          <p className="dash-muted mb-4">
            Creates a client record and a matching lead marked as Client.
          </p>
          <div className="dash-grid">
            <div className="form-group">
              <label htmlFor="newClientName">Name</label>
              <input
                id="newClientName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={pending}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newClientEmail">Email</label>
              <input
                id="newClientEmail"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={pending}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newClientPhone">Phone (optional)</label>
              <input
                id="newClientPhone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newClientBusiness">Business (optional)</label>
              <input
                id="newClientBusiness"
                value={business}
                onChange={(e) => setBusiness(e.target.value)}
                disabled={pending}
              />
            </div>
            <div className="form-group">
              <label htmlFor="newClientPhase">Phase</label>
              <select
                id="newClientPhase"
                value={phase}
                disabled={pending}
                onChange={(e) => setPhase(e.target.value as ClientPhase)}
              >
                {CLIENT_PHASES.map((value) => (
                  <option key={value} value={value}>
                    {CLIENT_PHASE_LABELS[value]}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="form-group mt-4">
            <label htmlFor="newClientGoals">Goals summary (optional)</label>
            <textarea
              id="newClientGoals"
              rows={3}
              value={goalsSummary}
              disabled={pending}
              onChange={(e) => setGoalsSummary(e.target.value)}
            />
          </div>
          {error ? (
            <p className="field-error mt-3" role="alert">
              {error}
            </p>
          ) : null}
          <div className="dash-actions mt-6">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={pending}
            >
              {pending ? "Creating…" : "Create client"}
            </button>
          </div>
        </form>
      ) : null}

      {clients.length === 0 ? (
        <p className="dash-muted">
          No clients yet. Add one manually, or promote a lead after they sign.
        </p>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Phase</th>
                <th>Design review</th>
                <th>Production</th>
                <th>Since</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((client) => (
                <tr key={client._id}>
                  <td>
                    <Link href={`/dashboard/clients/${client._id}`}>
                      {client.name}
                    </Link>
                  </td>
                  <td>{client.email}</td>
                  <td>{CLIENT_PHASE_LABELS[client.phase]}</td>
                  <td>
                    {client.designReviewUrl ? (
                      <a
                        href={client.designReviewUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shortUrl(client.designReviewUrl)}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {client.productionUrl ? (
                      <a
                        href={client.productionUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {shortUrl(client.productionUrl)}
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{formatDate(client.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
