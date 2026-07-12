import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import {
  ensureClientsForContracted,
  listClients,
} from "@/lib/convex";
import { DashboardLoginForm } from "@/components/DashboardLoginForm";
import { DashboardClientList } from "@/components/DashboardClientList";
import type { ClientPhase } from "@/lib/statuses";

export const metadata: Metadata = {
  title: "Clients",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardClientsPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="dash-page">
        <DashboardLoginForm />
      </div>
    );
  }

  let clients: Awaited<ReturnType<typeof listClients>> = [];
  let loadError = "";
  try {
    await ensureClientsForContracted();
    clients = await listClients({ limit: 100 });
  } catch (err) {
    console.error("Dashboard clients load failed:", err);
    loadError = "Could not load clients. Check Convex env configuration.";
  }

  return (
    <div className="dash-page">
      {loadError ? <p className="field-error mb-4">{loadError}</p> : null}
      <DashboardClientList
        clients={clients.map((client) => ({
          _id: client._id,
          name: client.name,
          email: client.email,
          phase: client.phase as ClientPhase,
          designReviewUrl: client.designReviewUrl,
          productionUrl: client.productionUrl,
          createdAt: client.createdAt,
        }))}
      />
    </div>
  );
}
