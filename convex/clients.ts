import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Doc, Id } from "./_generated/dataModel";
import type { MutationCtx, QueryCtx } from "./_generated/server";
import {
  ensureClientFeedbackToken,
  ensureClientForLead,
  ensureMissingClientsForContracted,
  promoteLeadToClient,
  removeClientForLead,
} from "./lib/ensureClient";
import { generateAccessToken } from "./lib/tokens";
import {
  clientDocValidator,
  clientFeedbackDocValidator,
  clientNoteDocValidator,
  clientPhase,
  leadStatus,
} from "./schema";
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
      feedbackToken: generateAccessToken(),
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
  notes: v.array(clientNoteDocValidator),
  feedback: v.array(clientFeedbackDocValidator),
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

/**
 * Ensure feedback token exists and migrate legacy conversationNotes into
 * threaded notes. Call before loading client detail in the dashboard.
 */
export const prepareDetail = mutation({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
  },
  returns: clientDetailValidator,
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const existing = await ctx.db.get(args.clientId);
    if (!existing) {
      throw new Error("Client not found");
    }

    await ensureClientFeedbackToken(ctx, existing);
    await migrateLegacyConversationNotes(ctx, args.clientId);

    const detail = await getClientDetail(ctx, args.clientId);
    if (!detail) {
      throw new Error("Client not found");
    }
    return detail;
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

async function listNotesForClient(ctx: QueryCtx, clientId: Id<"clients">) {
  return await ctx.db
    .query("clientNotes")
    .withIndex("by_client_and_createdAt", (q) => q.eq("clientId", clientId))
    .order("asc")
    .collect();
}

async function listFeedbackForClient(ctx: QueryCtx, clientId: Id<"clients">) {
  return await ctx.db
    .query("clientFeedback")
    .withIndex("by_client_and_createdAt", (q) => q.eq("clientId", clientId))
    .order("desc")
    .take(100);
}

async function getClientDetail(ctx: QueryCtx, clientId: Id<"clients">) {
  const client = await ctx.db.get(clientId);
  if (!client) return null;
  const lead = await ctx.db.get(client.leadId);
  if (!lead) return null;
  const [notes, feedback] = await Promise.all([
    listNotesForClient(ctx, clientId),
    listFeedbackForClient(ctx, clientId),
  ]);
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
    notes,
    feedback,
  };
}

async function migrateLegacyConversationNotes(
  ctx: MutationCtx,
  clientId: Id<"clients">,
) {
  const client = await ctx.db.get(clientId);
  if (!client?.conversationNotes?.trim()) return;

  const existingNotes = await ctx.db
    .query("clientNotes")
    .withIndex("by_client", (q) => q.eq("clientId", clientId))
    .first();
  if (existingNotes) {
    // Legacy blob already migrated into threaded notes; leave field as-is.
    return;
  }

  const now = Date.now();
  await ctx.db.insert("clientNotes", {
    clientId,
    body: client.conversationNotes.trim(),
    createdAt: client.updatedAt || now,
    updatedAt: now,
  });
  // Clear legacy blob after successful migration (empty string keeps schema happy).
  await ctx.db.patch(clientId, {
    conversationNotes: "",
    updatedAt: now,
  });
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

    await ctx.db.patch(args.clientId, patch);
    const updatedRow = await ctx.db.get(args.clientId);
    if (!updatedRow) {
      throw new Error("Failed to update client");
    }
    return await ensureClientFeedbackToken(ctx, updatedRow);
  },
});

export const addNote = mutation({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
    body: v.string(),
    parentId: v.optional(v.id("clientNotes")),
  },
  returns: clientNoteDocValidator,
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const body = args.body.trim();
    if (!body) {
      throw new Error("Note body is required");
    }
    if (body.length > 8000) {
      throw new Error("Note is too long");
    }

    if (args.parentId !== undefined) {
      const parent = await ctx.db.get(args.parentId);
      if (!parent || parent.clientId !== args.clientId) {
        throw new Error("Parent note not found");
      }
      if (parent.parentId !== undefined) {
        throw new Error("Replies can only be added to top-level notes");
      }
    }

    const now = Date.now();
    const noteId = await ctx.db.insert("clientNotes", {
      clientId: args.clientId,
      parentId: args.parentId,
      body,
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(args.clientId, { updatedAt: now });

    const note = await ctx.db.get(noteId);
    if (!note) {
      throw new Error("Failed to create note");
    }
    return note;
  },
});

export const getByFeedbackToken = query({
  args: {
    feedbackToken: v.string(),
  },
  returns: v.union(
    v.object({
      clientName: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const token = args.feedbackToken.trim();
    if (!token) return null;

    const client = await ctx.db
      .query("clients")
      .withIndex("by_feedbackToken", (q) => q.eq("feedbackToken", token))
      .first();
    if (!client) return null;

    return { clientName: client.name };
  },
});

export const submitFeedback = mutation({
  args: {
    feedbackToken: v.string(),
    message: v.string(),
    rating: v.optional(v.number()),
    submitterName: v.optional(v.string()),
  },
  returns: v.object({ success: v.literal(true) }),
  handler: async (ctx, args) => {
    const token = args.feedbackToken.trim();
    if (!token) {
      throw new Error("Invalid feedback link");
    }

    const client = await ctx.db
      .query("clients")
      .withIndex("by_feedbackToken", (q) => q.eq("feedbackToken", token))
      .first();
    if (!client) {
      throw new Error("Invalid feedback link");
    }

    const message = args.message.trim();
    if (!message) {
      throw new Error("Feedback message is required");
    }
    if (message.length > 5000) {
      throw new Error("Feedback is too long");
    }

    let rating: number | undefined;
    if (args.rating !== undefined) {
      if (
        !Number.isInteger(args.rating) ||
        args.rating < 1 ||
        args.rating > 5
      ) {
        throw new Error("Rating must be a whole number from 1 to 5");
      }
      rating = args.rating;
    }

    const submitterName = optionalTrimmed(args.submitterName);
    const now = Date.now();
    await ctx.db.insert("clientFeedback", {
      clientId: client._id,
      message,
      rating,
      submitterName,
      createdAt: now,
    });
    await ctx.db.patch(client._id, { updatedAt: now });

    return { success: true as const };
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
