import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";
import { generateAccessToken } from "./tokens";
import { removeDesignDemosForClient } from "./removeDesignDemos";

function optionalTrimmed(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

function seedNameFromLead(lead: Doc<"leads">): string {
  const business = lead.business?.trim();
  if (business) return business;
  return lead.name.trim();
}

/** Backfill feedbackToken on legacy client rows that predate the field. */
export async function ensureClientFeedbackToken(
  ctx: MutationCtx,
  client: Doc<"clients">,
): Promise<Doc<"clients">> {
  if (client.feedbackToken) {
    return client;
  }
  const feedbackToken = generateAccessToken();
  await ctx.db.patch(client._id, {
    feedbackToken,
    updatedAt: Date.now(),
  });
  const updated = await ctx.db.get(client._id);
  if (!updated) {
    throw new Error("Failed to backfill feedback token");
  }
  return updated;
}

/** Create a client row for a lead if one does not already exist. */
export async function ensureClientForLead(
  ctx: MutationCtx,
  leadId: Id<"leads">,
): Promise<Id<"clients">> {
  const existing = await ctx.db
    .query("clients")
    .withIndex("by_lead", (q) => q.eq("leadId", leadId))
    .first();
  if (existing) {
    await ensureClientFeedbackToken(ctx, existing);
    return existing._id;
  }

  const lead = await ctx.db.get(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const now = Date.now();
  return await ctx.db.insert("clients", {
    leadId,
    name: seedNameFromLead(lead),
    email: lead.email,
    phase: "design",
    goalsSummary: optionalTrimmed(lead.goal),
    feedbackToken: generateAccessToken(),
    createdAt: now,
    updatedAt: now,
  });
}

export async function ensureMissingClientsForContracted(
  ctx: MutationCtx,
): Promise<void> {
  const contracted = await ctx.db
    .query("leads")
    .withIndex("by_status", (q) => q.eq("status", "contracted"))
    .collect();

  for (const lead of contracted) {
    await ensureClientForLead(ctx, lead._id);
  }
}

/** Delete notes + feedback, then the client row for a lead if present. */
export async function removeClientForLead(
  ctx: MutationCtx,
  leadId: Id<"leads">,
): Promise<void> {
  const existing = await ctx.db
    .query("clients")
    .withIndex("by_lead", (q) => q.eq("leadId", leadId))
    .first();
  if (!existing) return;

  const notes = await ctx.db
    .query("clientNotes")
    .withIndex("by_client", (q) => q.eq("clientId", existing._id))
    .collect();
  for (const note of notes) {
    await ctx.db.delete(note._id);
  }

  const feedback = await ctx.db
    .query("clientFeedback")
    .withIndex("by_client_and_createdAt", (q) =>
      q.eq("clientId", existing._id),
    )
    .collect();
  for (const item of feedback) {
    await ctx.db.delete(item._id);
  }

  await removeDesignDemosForClient(ctx, existing._id);

  await ctx.db.delete(existing._id);
}

/**
 * Mark a lead as contracted and ensure a client row exists.
 * Admin override — skips normal pipeline transition checks.
 */
export async function promoteLeadToClient(
  ctx: MutationCtx,
  leadId: Id<"leads">,
): Promise<Id<"clients">> {
  const lead = await ctx.db.get(leadId);
  if (!lead) {
    throw new Error("Lead not found");
  }

  const now = Date.now();
  if (lead.status !== "contracted") {
    await ctx.db.patch(leadId, {
      status: "contracted",
      updatedAt: now,
      statusChangedAt: now,
    });
  }

  return await ensureClientForLead(ctx, leadId);
}
