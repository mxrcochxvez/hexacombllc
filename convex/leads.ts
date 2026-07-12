import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { leadDocValidator, leadSource, leadStatus } from "./schema";
import {
  canTransitionLeadStatus,
  LEAD_STATUS_LABELS,
  type LeadStatus,
} from "./statuses";

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

export const create = mutation({
  args: {
    ingestSecret: v.string(),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    business: v.optional(v.string()),
    website: v.optional(v.string()),
    source: leadSource,
    industry: v.optional(v.string()),
    hasExistingWebsite: v.optional(v.string()),
    goal: v.optional(v.string()),
    pageCount: v.optional(v.string()),
    visitors: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    timeline: v.optional(v.string()),
    notes: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  returns: v.id("leads"),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const now = Date.now();
    const temperature = args.source === "intake" ? "warm" : "cool";

    return await ctx.db.insert("leads", {
      name: args.name.trim(),
      email: args.email.trim().toLowerCase(),
      phone: optionalTrimmed(args.phone),
      business: optionalTrimmed(args.business),
      website: optionalTrimmed(args.website),
      source: args.source,
      temperature,
      status: "fresh",
      industry: optionalTrimmed(args.industry),
      hasExistingWebsite: optionalTrimmed(args.hasExistingWebsite),
      goal: optionalTrimmed(args.goal),
      pageCount: optionalTrimmed(args.pageCount),
      visitors: optionalTrimmed(args.visitors),
      features: args.features?.length ? args.features : undefined,
      timeline: optionalTrimmed(args.timeline),
      notes: optionalTrimmed(args.notes),
      message: optionalTrimmed(args.message),
      createdAt: now,
      updatedAt: now,
      statusChangedAt: now,
    });
  },
});

export const updateStatus = mutation({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
    status: leadStatus,
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    const from = lead.status as LeadStatus;
    const to = args.status as LeadStatus;
    if (!canTransitionLeadStatus(from, to)) {
      throw new Error(
        `Invalid status transition: ${LEAD_STATUS_LABELS[from]} → ${LEAD_STATUS_LABELS[to]}`,
      );
    }

    if (from === to) {
      return null;
    }

    const now = Date.now();
    await ctx.db.patch(args.leadId, {
      status: args.status,
      updatedAt: now,
      statusChangedAt: now,
    });
    return null;
  },
});

export const get = query({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
  },
  returns: v.union(leadDocValidator, v.null()),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await ctx.db.get(args.leadId);
  },
});

export const list = query({
  args: {
    ingestSecret: v.string(),
    status: v.optional(leadStatus),
    limit: v.optional(v.number()),
  },
  returns: v.array(leadDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const limit = Math.min(Math.max(args.limit ?? 50, 1), 200);

    if (args.status) {
      return await ctx.db
        .query("leads")
        .withIndex("by_status", (q) => q.eq("status", args.status!))
        .order("desc")
        .take(limit);
    }

    return await ctx.db
      .query("leads")
      .withIndex("by_createdAt")
      .order("desc")
      .take(limit);
  },
});

export const getByEmail = query({
  args: {
    ingestSecret: v.string(),
    email: v.string(),
  },
  returns: v.array(leadDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    return await ctx.db
      .query("leads")
      .withIndex("by_email", (q) =>
        q.eq("email", args.email.trim().toLowerCase()),
      )
      .order("desc")
      .take(50);
  },
});
