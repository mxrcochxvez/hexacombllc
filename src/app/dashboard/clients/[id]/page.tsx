import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { Id } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getClient } from "@/lib/convex";
import { DashboardClientDetail } from "@/components/DashboardClientDetail";
import type { ClientPhase } from "@/lib/statuses";

export const metadata: Metadata = {
  title: "Client",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function DashboardClientPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const clientId = id as Id<"clients">;

  let detail;
  try {
    detail = await getClient(clientId);
  } catch (err) {
    console.error("Dashboard client detail failed:", err);
    notFound();
  }

  if (!detail) {
    notFound();
  }

  return (
    <div className="dash-page">
      <DashboardClientDetail
        client={{
          _id: detail.client._id,
          leadId: detail.client.leadId,
          name: detail.client.name,
          email: detail.client.email,
          phase: detail.client.phase as ClientPhase,
          designReviewUrl: detail.client.designReviewUrl,
          productionUrl: detail.client.productionUrl,
          goalsSummary: detail.client.goalsSummary,
          conversationNotes: detail.client.conversationNotes,
          createdAt: detail.client.createdAt,
        }}
        lead={{
          _id: detail.lead._id,
          name: detail.lead.name,
          email: detail.lead.email,
          phone: detail.lead.phone,
          business: detail.lead.business,
          website: detail.lead.website,
        }}
      />
    </div>
  );
}
