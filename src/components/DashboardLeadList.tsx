"use client";

import Link from "next/link";
import {
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "@/lib/statuses";
import { DashboardNav } from "@/components/DashboardNav";

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
  return (
    <div className="dash-shell">
      <DashboardNav
        title="Leads"
        subtitle="Manage pipeline status and agreements."
      />

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
