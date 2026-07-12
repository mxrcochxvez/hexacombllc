import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const leadStatus = v.union(
  v.literal("fresh"),
  v.literal("contacted"),
  v.literal("qualified"),
  v.literal("proposal_sent"),
  v.literal("negotiating"),
  v.literal("contracted"),
  v.literal("lost"),
  v.literal("nurture"),
);

export const leadSource = v.union(v.literal("intake"), v.literal("contact"));

export const leadTemperature = v.union(v.literal("warm"), v.literal("cool"));

export default defineSchema({
  leads: defineTable({
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    business: v.optional(v.string()),
    website: v.optional(v.string()),
    source: leadSource,
    temperature: leadTemperature,
    status: leadStatus,
    industry: v.optional(v.string()),
    hasExistingWebsite: v.optional(v.string()),
    goal: v.optional(v.string()),
    pageCount: v.optional(v.string()),
    visitors: v.optional(v.string()),
    features: v.optional(v.array(v.string())),
    timeline: v.optional(v.string()),
    notes: v.optional(v.string()),
    message: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
    statusChangedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_status", ["status"])
    .index("by_source", ["source"])
    .index("by_createdAt", ["createdAt"]),
});
