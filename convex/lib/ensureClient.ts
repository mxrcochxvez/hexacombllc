import type { Doc, Id } from "../_generated/dataModel";
import type { MutationCtx } from "../_generated/server";

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
