"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  CONTRACT_STATUS_LABELS,
  leadStatusSelectOptions,
  LEAD_STATUS_LABELS,
  type ContractStatus,
  type LeadStatus,
} from "@/lib/statuses";

type LeadDetail = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
  status: LeadStatus;
  temperature: "warm" | "cool";
  source: "intake" | "contact";
  industry?: string;
  goal?: string;
  message?: string;
  notes?: string;
  createdAt: number;
};

type ContractDetail = {
  _id: string;
  status: ContractStatus;
  accessToken: string;
  clientName: string;
  maintenanceFeeMonthly: number;
  agreementDate?: string;
  hexacombSignerName: string;
  hexacombSignerTitle: string;
  hexacombSignedAt?: string;
  clientSignerName?: string;
  clientSignerTitle?: string;
  clientSignedAt?: string;
  sentAt?: number;
} | null;

type FormState = {
  clientName: string;
  maintenanceFeeMonthly: string;
  agreementDate: string;
  hexacombSignerName: string;
  hexacombSignerTitle: string;
  hexacombSignedAt: string;
};

export function DashboardLeadDetail({
  lead,
  contract,
}: {
  lead: LeadDetail;
  contract: ContractDetail;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<LeadStatus>(lead.status);
  const [statusMsg, setStatusMsg] = useState("");
  const [statusPending, setStatusPending] = useState(false);

  const [form, setForm] = useState<FormState>({
    clientName: contract?.clientName || lead.business || lead.name,
    maintenanceFeeMonthly:
      contract?.maintenanceFeeMonthly !== undefined
        ? String(contract.maintenanceFeeMonthly)
        : "70",
    agreementDate: contract?.agreementDate || "",
    hexacombSignerName: contract?.hexacombSignerName || "",
    hexacombSignerTitle: contract?.hexacombSignerTitle || "Founder",
    hexacombSignedAt: contract?.hexacombSignedAt || "",
  });
  const [contractMsg, setContractMsg] = useState("");
  const [contractPending, setContractPending] = useState(false);
  const [contractUrl, setContractUrl] = useState(
    contract?.status === "sent" || contract?.status === "signed"
      ? `/contract/${contract.accessToken}`
      : "",
  );

  const statusOptions = leadStatusSelectOptions(status);
  const signed = contract?.status === "signed";
  const proposalAlreadySent =
    contract?.status === "sent" ||
    contract?.status === "signed" ||
    status === "proposal_sent" ||
    status === "negotiating" ||
    status === "contracted";
  const readOnlyContract = proposalAlreadySent;

  async function saveStatus(next: LeadStatus) {
    setStatusMsg("");
    setStatusPending(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead._id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: next }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setStatusMsg(data.error || "Failed to update status.");
        return;
      }
      setStatus(next);
      setStatusMsg("Status updated.");
      router.refresh();
    } catch {
      setStatusMsg("Failed to update status.");
    } finally {
      setStatusPending(false);
    }
  }

  function payloadFromForm() {
    return {
      clientName: form.clientName.trim(),
      maintenanceFeeMonthly: Number(form.maintenanceFeeMonthly),
      agreementDate: form.agreementDate.trim() || undefined,
      hexacombSignerName: form.hexacombSignerName.trim(),
      hexacombSignerTitle: form.hexacombSignerTitle.trim(),
      hexacombSignedAt: form.hexacombSignedAt.trim() || undefined,
    };
  }

  async function saveDraft() {
    setContractMsg("");
    setContractPending(true);
    try {
      const res = await fetch(`/api/dashboard/leads/${lead._id}/contract`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payloadFromForm()),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setContractMsg(data.error || "Failed to save draft.");
        return;
      }
      setContractMsg("Draft saved.");
      router.refresh();
    } catch {
      setContractMsg("Failed to save draft.");
    } finally {
      setContractPending(false);
    }
  }

  async function submitForReview() {
    setContractMsg("");
    setContractPending(true);
    try {
      const res = await fetch(
        `/api/dashboard/leads/${lead._id}/contract/send`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadFromForm()),
        },
      );
      const data = (await res.json()) as {
        error?: string;
        contractUrl?: string;
      };
      if (!res.ok) {
        setContractMsg(data.error || "Failed to send agreement.");
        return;
      }
      if (data.contractUrl) setContractUrl(data.contractUrl);
      setContractMsg("Agreement emailed to the client.");
      router.refresh();
    } catch {
      setContractMsg("Failed to send agreement.");
    } finally {
      setContractPending(false);
    }
  }

  return (
    <div className="dash-shell">
      <p className="mb-4">
        <Link href="/dashboard">← All leads</Link>
      </p>

      <div className="dash-toolbar">
        <div>
          <h1 className="dash-title">{lead.name}</h1>
          <p className="dash-muted">{lead.email}</p>
        </div>
      </div>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Lead details</h2>
        <dl className="dash-dl">
          <div>
            <dt>Phone</dt>
            <dd>{lead.phone || "—"}</dd>
          </div>
          <div>
            <dt>Business</dt>
            <dd>{lead.business || "—"}</dd>
          </div>
          <div>
            <dt>Website</dt>
            <dd>{lead.website || "—"}</dd>
          </div>
          <div>
            <dt>Source</dt>
            <dd>{lead.source}</dd>
          </div>
          <div>
            <dt>Temperature</dt>
            <dd>{lead.temperature}</dd>
          </div>
          <div>
            <dt>Industry</dt>
            <dd>{lead.industry || "—"}</dd>
          </div>
        </dl>
        {lead.message ? (
          <p className="mt-4 whitespace-pre-wrap">
            <strong>Message:</strong> {lead.message}
          </p>
        ) : null}
        {lead.notes ? (
          <p className="mt-2 whitespace-pre-wrap">
            <strong>Notes:</strong> {lead.notes}
          </p>
        ) : null}
      </section>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Status</h2>
        <p className="dash-muted mb-3">
          Current: {LEAD_STATUS_LABELS[status]}
        </p>
        <div className="form-group max-w-xs">
          <label htmlFor="lead-status">Change status</label>
          <select
            id="lead-status"
            value={status}
            disabled={statusPending || statusOptions.length <= 1}
            onChange={(e) => {
              const next = e.target.value as LeadStatus;
              void saveStatus(next);
            }}
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {statusOptions.length <= 1 ? (
          <p className="dash-muted text-sm mt-2">
            This status is terminal — no further pipeline moves.
          </p>
        ) : null}
        {statusMsg ? (
          <p className="mt-2 text-sm" role="status">
            {statusMsg}
          </p>
        ) : null}
      </section>

      <section className="dash-card mb-8">
        <h2 className="dash-section-title">Website agreement</h2>
        {contract ? (
          <p className="dash-muted mb-4">
            Contract status: {CONTRACT_STATUS_LABELS[contract.status]}
          </p>
        ) : (
          <p className="dash-muted mb-4">No draft yet — fill and save below.</p>
        )}

        <div className="dash-grid">
          <div className="form-group">
            <label htmlFor="clientName">Client name</label>
            <input
              id="clientName"
              value={form.clientName}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({ ...f, clientName: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="maintenanceFeeMonthly">
              Maintenance fee ($/mo)
            </label>
            <input
              id="maintenanceFeeMonthly"
              type="number"
              min={0}
              step="1"
              value={form.maintenanceFeeMonthly}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  maintenanceFeeMonthly: e.target.value,
                }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="agreementDate">Agreement date (optional)</label>
            <input
              id="agreementDate"
              value={form.agreementDate}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({ ...f, agreementDate: e.target.value }))
              }
              placeholder="e.g. July 12, 2026"
            />
          </div>
          <div className="form-group">
            <label htmlFor="hexacombSignerName">Hexacomb signer name</label>
            <input
              id="hexacombSignerName"
              value={form.hexacombSignerName}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({ ...f, hexacombSignerName: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="hexacombSignerTitle">Hexacomb signer title</label>
            <input
              id="hexacombSignerTitle"
              value={form.hexacombSignerTitle}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({ ...f, hexacombSignerTitle: e.target.value }))
              }
            />
          </div>
          <div className="form-group">
            <label htmlFor="hexacombSignedAt">Hexacomb signed date</label>
            <input
              id="hexacombSignedAt"
              value={form.hexacombSignedAt}
              disabled={readOnlyContract || contractPending}
              onChange={(e) =>
                setForm((f) => ({ ...f, hexacombSignedAt: e.target.value }))
              }
              placeholder="e.g. July 12, 2026"
            />
          </div>
        </div>

        {signed && contract ? (
          <div className="mt-4">
            <p>
              <strong>Client signed:</strong> {contract.clientSignerName} (
              {contract.clientSignerTitle}) on {contract.clientSignedAt}
            </p>
          </div>
        ) : null}

        {contractUrl ? (
          <p className="mt-4">
            Client link:{" "}
            <a href={contractUrl} target="_blank" rel="noreferrer">
              {contractUrl}
            </a>
          </p>
        ) : null}

        {!readOnlyContract ? (
          <div className="dash-actions mt-6">
            <button
              type="button"
              className="btn btn-secondary"
              disabled={contractPending}
              onClick={() => void saveDraft()}
            >
              Save draft
            </button>
            <button
              type="button"
              className="btn btn-primary"
              disabled={contractPending}
              onClick={() => void submitForReview()}
            >
              Submit for review
            </button>
          </div>
        ) : null}

        {contractMsg ? (
          <p className="mt-3 text-sm" role="status">
            {contractMsg}
          </p>
        ) : null}
      </section>
    </div>
  );
}
