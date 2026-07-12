import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import {
  ensureClientForLead,
  ensureMissingClientsForContracted,
} from "./lib/ensureClient";
import { clientDocValidator, clientPhase, leadStatus } from "./schema";

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
