import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import type { LeadStatus } from "../../convex/statuses";

export type { Doc, Id } from "../../convex/_generated/dataModel";
export type { LeadStatus, ContractStatus } from "../../convex/statuses";

export type LeadCreateInput = {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  website?: string;
  source: "intake" | "contact";
  industry?: string;
  hasExistingWebsite?: string;
  goal?: string;
  pageCount?: string;
  visitors?: string;
  features?: string[];
  timeline?: string;
  notes?: string;
  message?: string;
};

export type ContractDraftInput = {
  leadId: Id<"leads">;
  clientName: string;
  maintenanceFeeMonthly: number;
  agreementDate?: string;
  hexacombSignerName: string;
  hexacombSignerTitle: string;
  hexacombSignedAt?: string;
};

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not configured; skipping Convex call.");
    return null;
  }
  return new ConvexHttpClient(url);
}

function getIngestSecret(): string | null {
  const secret = process.env.LEAD_INGEST_SECRET;
  if (!secret) {
    console.error("LEAD_INGEST_SECRET is not configured; skipping Convex call.");
    return null;
  }
  return secret;
}

function requireClientAndSecret(): {
  client: ConvexHttpClient;
  ingestSecret: string;
} {
  const client = getConvexClient();
  const ingestSecret = getIngestSecret();
  if (!client || !ingestSecret) {
    throw new Error(
      "Convex is not configured (NEXT_PUBLIC_CONVEX_URL / LEAD_INGEST_SECRET).",
    );
  }
  return { client, ingestSecret };
}

/**
 * Persist a form submission as a Convex lead.
 * Failures are logged and swallowed so email delivery can still succeed.
 */
export async function createLead(
  input: LeadCreateInput,
): Promise<Id<"leads"> | null> {
  const client = getConvexClient();
  const ingestSecret = getIngestSecret();
  if (!client || !ingestSecret) {
    return null;
  }

  try {
    return await client.mutation(api.leads.create, {
      ingestSecret,
      ...input,
    });
  } catch (err) {
    console.error("Convex lead create failed:", err);
    return null;
  }
}

export async function listLeads(options?: {
  status?: LeadStatus;
  limit?: number;
}): Promise<Doc<"leads">[]> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.leads.list, {
    ingestSecret,
    status: options?.status,
    limit: options?.limit,
  });
}

export async function getLead(
  leadId: Id<"leads">,
): Promise<Doc<"leads"> | null> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.leads.get, { ingestSecret, leadId });
}

export async function updateLeadStatus(
  leadId: Id<"leads">,
  status: LeadStatus,
): Promise<void> {
  const { client, ingestSecret } = requireClientAndSecret();
  await client.mutation(api.leads.updateStatus, {
    ingestSecret,
    leadId,
    status,
  });
}

export async function getContractByLead(
  leadId: Id<"leads">,
): Promise<Doc<"contracts"> | null> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.contracts.getByLead, {
    ingestSecret,
    leadId,
  });
}

export async function upsertContractDraft(
  input: ContractDraftInput,
): Promise<Id<"contracts">> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.contracts.upsertDraft, {
    ingestSecret,
    ...input,
  });
}

export async function sendContract(input: {
  leadId: Id<"leads">;
  clientName?: string;
  maintenanceFeeMonthly?: number;
  agreementDate?: string;
  hexacombSignerName?: string;
  hexacombSignerTitle?: string;
  hexacombSignedAt?: string;
}) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.contracts.send, {
    ingestSecret,
    ...input,
  });
}

export async function getContractByToken(accessToken: string) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.query(api.contracts.getByToken, { accessToken });
}

export async function acceptContract(input: {
  accessToken: string;
  clientSignerName: string;
  clientSignerTitle: string;
  clientSignedAt: string;
  acceptedTerms: boolean;
}) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.mutation(api.contracts.accept, input);
}
