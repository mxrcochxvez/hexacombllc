import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import type { Id, ContractStatus, LeadStatus } from "@/lib/convex";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getClientByLead, getContractByLead, getLead } from "@/lib/convex";
import { DashboardLeadDetail } from "@/components/DashboardLeadDetail";

export const metadata: Metadata = {
  title: "Lead",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function DashboardLeadPage({ params }: PageProps) {
  if (!(await isAdminAuthenticated())) {
    redirect("/dashboard");
  }

  const { id } = await params;
  const leadId = id as Id<"leads">;

  let lead;
  let contract;
  let client = null;
  try {
    lead = await getLead(leadId);
    contract = lead ? await getContractByLead(leadId) : null;
    client = lead ? await getClientByLead(leadId) : null;
  } catch (err) {
    console.error("Dashboard lead detail failed:", err);
    notFound();
  }

  if (!lead) {
    notFound();
  }

  return (
    <div className="dash-page">
      <DashboardLeadDetail
        lead={{
          _id: lead._id,
          name: lead.name,
          email: lead.email,
          phone: lead.phone,
          business: lead.business,
          website: lead.website,
          status: lead.status as LeadStatus,
          temperature: lead.temperature,
          source: lead.source,
          industry: lead.industry,
          goal: lead.goal,
          message: lead.message,
          notes: lead.notes,
          createdAt: lead.createdAt,
        }}
        contract={
          contract
            ? {
                _id: contract._id,
                status: contract.status as ContractStatus,
                accessToken: contract.accessToken,
                clientName: contract.clientName,
                maintenanceFeeMonthly: contract.maintenanceFeeMonthly,
                agreementDate: contract.agreementDate,
                hexacombSignerName: contract.hexacombSignerName,
                hexacombSignerTitle: contract.hexacombSignerTitle,
                hexacombSignedAt: contract.hexacombSignedAt,
                clientSignerName: contract.clientSignerName,
                clientSignerTitle: contract.clientSignerTitle,
                clientSignedAt: contract.clientSignedAt,
                sentAt: contract.sentAt,
              }
            : null
        }
        clientId={client?._id ?? null}
      />
    </div>
  );
}
