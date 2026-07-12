"use client";

import { useState } from "react";
import { AgreementTerms } from "@/components/AgreementTerms";
import { CONTRACT_STATUS_LABELS, type ContractStatus } from "@/lib/statuses";

export type PublicContract = {
  status: ContractStatus;
  clientName: string;
  maintenanceFeeMonthly: number;
  agreementDate?: string;
  hexacombSignerName: string;
  hexacombSignerTitle: string;
  hexacombSignedAt?: string;
  clientSignerName?: string;
  clientSignerTitle?: string;
  clientSignedAt?: string;
  acceptedTerms?: boolean;
};

function todayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Prefer YYYY-MM-DD for <input type="date">; fall back to today. */
function toDateInputValue(value?: string): string {
  if (!value) return todayIsoDate();
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return todayIsoDate();
  const year = parsed.getFullYear();
  const month = String(parsed.getMonth() + 1).padStart(2, "0");
  const day = String(parsed.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function ContractAcceptForm({
  token,
  contract,
}: {
  token: string;
  contract: PublicContract;
}) {
  const alreadySigned = contract.status === "signed";
  const [clientSignerName, setClientSignerName] = useState(
    contract.clientSignerName || "",
  );
  const [clientSignerTitle, setClientSignerTitle] = useState(
    contract.clientSignerTitle || "",
  );
  const [clientSignedAt, setClientSignedAt] = useState(
    toDateInputValue(contract.clientSignedAt),
  );
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [done, setDone] = useState(alreadySigned);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setPending(true);
    try {
      const res = await fetch(`/api/contract/${token}/accept`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          clientSignerName,
          clientSignerTitle,
          clientSignedAt,
          acceptedTerms,
        }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error || "Could not accept the agreement.");
        return;
      }
      setDone(true);
    } catch {
      setError("Could not accept the agreement. Please try again.");
    } finally {
      setPending(false);
    }
  }

  if (done) {
    return (
      <div className="contract-shell">
        <div className="form-success dash-card">
          <h1>Agreement accepted</h1>
          <p>
            Thank you. Your acceptance of the Hexacomb website agreement has been
            recorded
            {contract.clientSignerName || clientSignerName
              ? ` for ${contract.clientSignerName || clientSignerName}`
              : ""}
            .
          </p>
          <p className="dash-muted mt-2">
            Status: {CONTRACT_STATUS_LABELS.signed}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="contract-shell">
      <AgreementTerms
        clientName={contract.clientName}
        maintenanceFeeMonthly={contract.maintenanceFeeMonthly}
        agreementDate={contract.agreementDate}
      />

      <section className="dash-card mt-8">
        <h2 className="dash-section-title">Hexacomb LLC signature</h2>
        <dl className="dash-dl">
          <div>
            <dt>By</dt>
            <dd>{contract.hexacombSignerName}</dd>
          </div>
          <div>
            <dt>Title</dt>
            <dd>{contract.hexacombSignerTitle}</dd>
          </div>
          <div>
            <dt>Date</dt>
            <dd>{contract.hexacombSignedAt || "—"}</dd>
          </div>
        </dl>
      </section>

      <form onSubmit={onSubmit} className="dash-card mt-8">
        <h2 className="dash-section-title">Client acceptance</h2>
        <p className="dash-muted mb-4">
          Type your name and title to accept these terms. No PDF upload is
          required.
        </p>

        <div className="form-group">
          <label htmlFor="clientSignerName">By (full name)</label>
          <input
            id="clientSignerName"
            value={clientSignerName}
            onChange={(e) => setClientSignerName(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientSignerTitle">Title / name</label>
          <input
            id="clientSignerTitle"
            value={clientSignerTitle}
            onChange={(e) => setClientSignerTitle(e.target.value)}
            required
            disabled={pending}
          />
        </div>
        <div className="form-group">
          <label htmlFor="clientSignedAt">Date</label>
          <input
            id="clientSignedAt"
            type="date"
            value={clientSignedAt}
            onChange={(e) => setClientSignedAt(e.target.value)}
            required
            disabled={pending}
          />
        </div>

        <label className="dash-check">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            disabled={pending}
          />
          <span>I have read and agree to the terms of this agreement.</span>
        </label>

        {error ? (
          <p className="field-error mt-3" role="alert">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="btn btn-primary mt-6"
          disabled={pending || !acceptedTerms}
        >
          {pending ? "Submitting…" : "Accept agreement"}
        </button>
      </form>
    </div>
  );
}
