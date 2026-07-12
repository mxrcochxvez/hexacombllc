import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listLeads } from "@/lib/convex";
import { DashboardLoginForm } from "@/components/DashboardLoginForm";
import { DashboardLeadList } from "@/components/DashboardLeadList";
import type { LeadStatus } from "@/lib/statuses";

export const metadata: Metadata = {
  title: "Dashboard",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const authed = await isAdminAuthenticated();

  if (!authed) {
    return (
      <div className="dash-page">
        <DashboardLoginForm />
      </div>
    );
  }

  let leads: Awaited<ReturnType<typeof listLeads>> = [];
  let loadError = "";
  try {
    leads = await listLeads({ limit: 100 });
  } catch (err) {
    console.error("Dashboard leads load failed:", err);
    loadError = "Could not load leads. Check Convex env configuration.";
  }

  return (
    <div className="dash-page">
      {loadError ? <p className="field-error mb-4">{loadError}</p> : null}
      <DashboardLeadList
        leads={leads.map((lead) => ({
          _id: lead._id,
          name: lead.name,
          email: lead.email,
          status: lead.status as LeadStatus,
          temperature: lead.temperature,
          source: lead.source,
          business: lead.business,
          createdAt: lead.createdAt,
        }))}
      />
    </div>
  );
}
