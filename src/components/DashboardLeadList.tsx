"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/lib/statuses";

export type DashboardLeadRow = {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  temperature: "warm" | "cool";
  source: "intake" | "contact";
  business?: string;
  createdAt: number;
};

function formatDate(ms: number): string {
  return new Date(ms).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function DashboardLeadList({ leads }: { leads: DashboardLeadRow[] }) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/dashboard/logout", { method: "POST" });
    router.refresh();
  }

  return (
    <div className="dash-shell">
      <div className="dash-toolbar">
        <div>
          <h1 className="dash-title">Leads</h1>
          <p className="dash-muted">Manage pipeline status and agreements.</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={logout}>
          Log out
        </button>
      </div>

      {leads.length === 0 ? (
        <p className="dash-muted">No leads yet.</p>
      ) : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Temp</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <Link href={`/dashboard/leads/${lead._id}`}>
                      {lead.name}
                      {lead.business ? (
                        <span className="dash-muted block text-sm">
                          {lead.business}
                        </span>
                      ) : null}
                    </Link>
                  </td>
                  <td>{lead.email}</td>
                  <td>{LEAD_STATUS_LABELS[lead.status]}</td>
                  <td>{lead.temperature}</td>
                  <td>{lead.source}</td>
                  <td>{formatDate(lead.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
