import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

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

function getConvexClient(): ConvexHttpClient | null {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) {
    console.error("NEXT_PUBLIC_CONVEX_URL is not configured; skipping lead write.");
    return null;
  }
  return new ConvexHttpClient(url);
}

function getIngestSecret(): string | null {
  const secret = process.env.LEAD_INGEST_SECRET;
  if (!secret) {
    console.error("LEAD_INGEST_SECRET is not configured; skipping lead write.");
    return null;
  }
  return secret;
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
