import { ConvexHttpClient } from "convex/browser";
import { api } from "../../convex/_generated/api";
import type { Doc, Id } from "../../convex/_generated/dataModel";
import type { ClientPhase, LeadStatus } from "../../convex/statuses";

export type { Doc, Id } from "../../convex/_generated/dataModel";
export type {
  LeadStatus,
  ContractStatus,
  ClientPhase,
} from "../../convex/statuses";

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

export type ClientUpdateInput = {
  clientId: Id<"clients">;
  name?: string;
  phase?: ClientPhase;
  designReviewUrl?: string;
  productionUrl?: string;
  goalsSummary?: string;
};

export type ClientNoteInput = {
  clientId: Id<"clients">;
  body: string;
  parentId?: Id<"clientNotes">;
};

export type ClientFeedbackSubmitInput = {
  feedbackToken: string;
  message: string;
  rating?: number;
  submitterName?: string;
};

export type BlogPostInput = {
  title: string;
  slug?: string;
  excerpt: string;
  contentMarkdown: string;
  status: "draft" | "published";
  author?: string;
  tags?: string[];
  metaTitle?: string;
  metaDescription?: string;
};

export type BlogPostUpdateInput = Partial<BlogPostInput>;

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

function requireClient(): ConvexHttpClient {
  const client = getConvexClient();
  if (!client) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return client;
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

export async function ensureClientsForContracted(): Promise<void> {
  const { client, ingestSecret } = requireClientAndSecret();
  await client.mutation(api.clients.ensureForContracted, { ingestSecret });
}

export async function listClients(options?: {
  limit?: number;
}): Promise<Doc<"clients">[]> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.clients.list, {
    ingestSecret,
    limit: options?.limit,
  });
}

export async function getClient(clientId: Id<"clients">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.clients.get, { ingestSecret, clientId });
}

/** Backfill feedback token + migrate legacy notes, then return full detail. */
export async function prepareClientDetail(clientId: Id<"clients">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.prepareDetail, {
    ingestSecret,
    clientId,
  });
}

export async function getClientByLead(
  leadId: Id<"leads">,
): Promise<Doc<"clients"> | null> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.clients.getByLead, {
    ingestSecret,
    leadId,
  });
}

export async function updateClient(
  input: ClientUpdateInput,
): Promise<Doc<"clients">> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.update, {
    ingestSecret,
    ...input,
  });
}

export async function addClientNote(input: ClientNoteInput) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.addNote, {
    ingestSecret,
    ...input,
  });
}

export async function deleteClientNote(input: {
  clientId: Id<"clients">;
  noteId: Id<"clientNotes">;
}) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.deleteNote, {
    ingestSecret,
    ...input,
  });
}

export async function getClientFeedbackByToken(feedbackToken: string) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.query(api.clients.getByFeedbackToken, {
    feedbackToken,
  });
}

export async function submitClientFeedback(input: ClientFeedbackSubmitInput) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.mutation(api.clients.submitFeedback, input);
}

export async function revertClientToLead(
  clientId: Id<"clients">,
): Promise<{ leadId: Id<"leads"> }> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.revertToLead, {
    ingestSecret,
    clientId,
  });
}

export async function createClient(input: {
  name: string;
  email: string;
  phone?: string;
  business?: string;
  goalsSummary?: string;
  phase?: ClientPhase;
}): Promise<{ clientId: Id<"clients">; leadId: Id<"leads"> }> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.create, {
    ingestSecret,
    ...input,
  });
}

export async function promoteLeadToClient(
  leadId: Id<"leads">,
): Promise<{ clientId: Id<"clients">; leadId: Id<"leads"> }> {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.clients.promoteFromLead, {
    ingestSecret,
    leadId,
  });
}

export async function createDesignDemo(input: {
  clientId: Id<"clients">;
  title: string;
  demoUrl: string;
}) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.designDemos.create, {
    ingestSecret,
    ...input,
  });
}

export async function listDesignDemosForClient(clientId: Id<"clients">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.designDemos.listForClient, {
    ingestSecret,
    clientId,
  });
}

export async function listDesignDemoCommentsForClient(
  clientId: Id<"clients">,
) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.designDemos.listCommentsForClient, {
    ingestSecret,
    clientId,
  });
}

export async function sendDesignDemo(demoId: Id<"designDemos">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.designDemos.send, {
    ingestSecret,
    demoId,
  });
}

export async function closeDesignDemo(demoId: Id<"designDemos">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.designDemos.close, {
    ingestSecret,
    demoId,
  });
}

export async function getDesignDemoByToken(accessToken: string) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.query(api.designDemos.getByToken, { accessToken });
}

export async function submitDesignDemoComment(input: {
  accessToken: string;
  body: string;
  submitterName?: string;
}) {
  const client = getConvexClient();
  if (!client) {
    throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  }
  return await client.mutation(api.designDemos.submitComment, input);
}

export async function listPublishedBlogPosts(limit = 50) {
  const client = getConvexClient();
  if (!client) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return await client.query(api.blogPosts.listPublished, { limit });
}

export async function getPublishedBlogPost(slug: string) {
  const client = getConvexClient();
  if (!client) throw new Error("NEXT_PUBLIC_CONVEX_URL is not configured.");
  return await client.query(api.blogPosts.getPublishedBySlug, { slug });
}

export async function listAdminBlogPosts(limit = 100) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.blogPosts.adminList, { ingestSecret, limit });
}

export async function getAdminBlogPost(postId: Id<"blogPosts">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.blogPosts.adminGet, { ingestSecret, postId });
}

export async function createAdminBlogPost(input: BlogPostInput) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.blogPosts.adminCreate, { ingestSecret, ...input });
}

export async function updateAdminBlogPost(
  postId: Id<"blogPosts">,
  input: BlogPostUpdateInput,
) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.blogPosts.adminUpdate, {
    ingestSecret,
    postId,
    ...input,
  });
}

export async function listBlogApiKeys() {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.query(api.blogApiKeys.list, { ingestSecret });
}

export async function createBlogApiKey(input: {
  name: string;
  keyHash: string;
  keyPrefix: string;
  canPublish: boolean;
}) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.blogApiKeys.create, { ingestSecret, ...input });
}

export async function revokeBlogApiKey(keyId: Id<"blogApiKeys">) {
  const { client, ingestSecret } = requireClientAndSecret();
  return await client.mutation(api.blogApiKeys.revoke, { ingestSecret, keyId });
}

export async function authenticateBlogApiKey(keyHash: string) {
  const client = requireClient();
  return await client.mutation(api.blogApiKeys.authenticate, { keyHash });
}

export async function listAgentBlogPosts(keyHash: string, limit = 50) {
  const client = requireClient();
  return await client.query(api.blogPosts.agentList, { keyHash, limit });
}

export async function getAgentBlogPost(keyHash: string, slug: string) {
  const client = requireClient();
  return await client.query(api.blogPosts.agentGetBySlug, { keyHash, slug });
}

export async function createAgentBlogPost(keyHash: string, input: BlogPostInput) {
  const client = requireClient();
  return await client.mutation(api.blogPosts.agentCreate, { keyHash, ...input });
}

export async function updateAgentBlogPost(
  keyHash: string,
  currentSlug: string,
  input: BlogPostUpdateInput,
) {
  const client = requireClient();
  return await client.mutation(api.blogPosts.agentUpdateBySlug, {
    keyHash,
    currentSlug,
    ...input,
  });
}
