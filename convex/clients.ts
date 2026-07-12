import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import {
  ensureClientForLead,
  ensureMissingClientsForContracted,
  promoteLeadToClient,
  removeClientForLead,
} from "./lib/ensureClient";
import { clientDocValidator, clientPhase, leadStatus } from "./schema";
import { canTransitionLeadStatus } from "./statuses";

function assertIngestSecret(ingestSecret: string) {
  const expected = process.env.LEAD_INGEST_SECRET;
  if (!expected || ingestSecret !== expected) {
    throw new Error("Unauthorized");
  }
}

function optionalTrimmed(value: string | undefined): string | undefined {
  if (value === undefined) return undefined;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : undefined;
}

export { ensureClientForLead };

export const ensureForContracted = mutation({
  args: {
    ingestSecret: v.string(),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    await ensureMissingClientsForContracted(ctx);
    return null;
  },
});

/** Create a brand-new client (and backing lead) from the dashboard. */
export const create = mutation({
  args: {
    ingestSecret: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    business: v.optional(v.string()),
    goalsSummary: v.optional(v.string()),
    phase: v.optional(clientPhase),
  },
  returns: v.object({
    clientId: v.id("clients"),
    leadId: v.id("leads"),
  }),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const name = args.name.trim();
    const email = args.email.trim().toLowerCase();
    if (!name || !email) {
      throw new Error("Name and email are required");
    }
    if (!email.includes("@")) {
      throw new Error("Invalid email address");
    }

    const now = Date.now();
    const business = optionalTrimmed(args.business);
    const goalsSummary = optionalTrimmed(args.goalsSummary);
    const phone = optionalTrimmed(args.phone);
    const phase = args.phase ?? "design";

    const leadId = await ctx.db.insert("leads", {
      name,
      email,
      phone,
      business,
      source: "contact",
      temperature: "cool",
      status: "contracted",
      goal: goalsSummary,
      notes: "Manually created as a client from the dashboard.",
      createdAt: now,
      updatedAt: now,
      statusChangedAt: now,
    });

    const displayName = business || name;
    const clientId = await ctx.db.insert("clients", {
      leadId,
      name: displayName,
      email,
      phase,
      goalsSummary,
      createdAt: now,
      updatedAt: now,
    });

    return { clientId, leadId };
  },
});

/** Promote an existing lead to client without requiring a signed contract. */
export const promoteFromLead = mutation({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
  },
  returns: v.object({
    clientId: v.id("clients"),
    leadId: v.id("leads"),
  }),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const clientId = await promoteLeadToClient(ctx, args.leadId);
    return { clientId, leadId: args.leadId };
  },
});

export const list = query({
  args: {
    ingestSecret: v.string(),
    limit: v.optional(v.number()),
  },
  returns: v.array(clientDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const limit = Math.min(Math.max(args.limit ?? 100, 1), 200);
    return await ctx.db
      .query("clients")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

const clientDetailValidator = v.object({
  client: clientDocValidator,
  lead: v.object({
    _id: v.id("leads"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    business: v.optional(v.string()),
    website: v.optional(v.string()),
    status: leadStatus,
  }),
});

export const get = query({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
  },
  returns: v.union(clientDetailValidator, v.null()),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await getClientDetail(ctx, args.clientId);
  },
});

export const getByLead = query({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
  },
  returns: v.union(clientDocValidator, v.null()),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await ctx.db
      .query("clients")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .first();
  },
});

async function getClientDetail(ctx: QueryCtx, clientId: Id<"clients">) {
  const client = await ctx.db.get(clientId);
  if (!client) return null;
  const lead = await ctx.db.get(client.leadId);
  if (!lead) return null;
  return {
    client,
    lead: {
      _id: lead._id,
      name: lead.name,
      email: lead.email,
      phone: lead.phone,
      business: lead.business,
      website: lead.website,
      status: lead.status,
    },
  };
}

export const update = mutation({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
    name: v.optional(v.string()),
    phase: v.optional(clientPhase),
    designReviewUrl: v.optional(v.string()),
    productionUrl: v.optional(v.string()),
    goalsSummary: v.optional(v.string()),
    conversationNotes: v.optional(v.string()),
  },
  returns: clientDocValidator,
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const existing = await ctx.db.get(args.clientId);
    if (!existing) {
      throw new Error("Client not found");
    }

    const patch: Partial<Doc<"clients">> = {
      updatedAt: Date.now(),
    };

    if (args.name !== undefined) {
      const name = args.name.trim();
      if (!name) throw new Error("Name is required");
      patch.name = name;
    }
    if (args.phase !== undefined) {
      patch.phase = args.phase;
    }
    if (args.designReviewUrl !== undefined) {
      patch.designReviewUrl = optionalTrimmed(args.designReviewUrl);
    }
    if (args.productionUrl !== undefined) {
      patch.productionUrl = optionalTrimmed(args.productionUrl);
    }
    if (args.goalsSummary !== undefined) {
      patch.goalsSummary = optionalTrimmed(args.goalsSummary);
    }
    if (args.conversationNotes !== undefined) {
      patch.conversationNotes = optionalTrimmed(args.conversationNotes);
    }

    await ctx.db.patch(args.clientId, patch);
    const updated = await ctx.db.get(args.clientId);
    if (!updated) {
      throw new Error("Failed to update client");
    }
    return updated;
  },
});

/**
 * Undo an accidental client promotion: delete the client row and move the
 * lead back to negotiating.
 */
export const revertToLead = mutation({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
  },
  returns: v.object({
    leadId: v.id("leads"),
  }),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const lead = await ctx.db.get(client.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    if (lead.status !== "contracted") {
      await removeClientForLead(ctx, lead._id);
      return { leadId: lead._id };
    }

    if (!canTransitionLeadStatus("contracted", "negotiating")) {
      throw new Error("Cannot revert this client to a lead");
    }

    const now = Date.now();
    await ctx.db.patch(lead._id, {
      status: "negotiating",
      updatedAt: now,
      statusChangedAt: now,
    });
    await removeClientForLead(ctx, lead._id);

    return { leadId: lead._id };
  },
});
