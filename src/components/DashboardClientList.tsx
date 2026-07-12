"use client";

import Link from "next/link";
import {
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
  return (
    <div className="dash-shell">
      <DashboardNav
        title="Clients"
        subtitle="Project links, goals, and conversation notes."
      />

      {clients.length === 0 ? (
        <p className="dash-muted">
          No clients yet. They appear here after a lead signs their agreement.
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
