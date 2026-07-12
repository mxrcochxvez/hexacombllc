import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ContractStatus } from "@/lib/statuses";
import { getContractByToken } from "@/lib/convex";
import { ContractAcceptForm } from "@/components/ContractAcceptForm";

export const metadata: Metadata = {
  title: "Website agreement",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ token: string }> };

export default async function ContractPage({ params }: PageProps) {
  const { token } = await params;

  let contract;
  try {
    contract = await getContractByToken(token);
  } catch (err) {
    console.error("Contract page load failed:", err);
    notFound();
  }

  if (!contract) {
    notFound();
  }

  return (
    <ContractAcceptForm
      token={token}
      contract={{
        status: contract.status as ContractStatus,
        clientName: contract.clientName,
        maintenanceFeeMonthly: contract.maintenanceFeeMonthly,
        agreementDate: contract.agreementDate,
        hexacombSignerName: contract.hexacombSignerName,
        hexacombSignerTitle: contract.hexacombSignerTitle,
        hexacombSignedAt: contract.hexacombSignedAt,
        clientSignerName: contract.clientSignerName,
        clientSignerTitle: contract.clientSignerTitle,
        clientSignedAt: contract.clientSignedAt,
        acceptedTerms: contract.acceptedTerms,
      }}
    />
  );
}
