import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import {
  CLIENT_PHASES,
  CONTRACT_STATUSES,
  LEAD_STATUSES,
} from "./statuses";

export const leadStatus = v.union(
  v.literal(LEAD_STATUSES[0]),
  v.literal(LEAD_STATUSES[1]),
  v.literal(LEAD_STATUSES[2]),
  v.literal(LEAD_STATUSES[3]),
  v.literal(LEAD_STATUSES[4]),
  v.literal(LEAD_STATUSES[5]),
  v.literal(LEAD_STATUSES[6]),
  v.literal(LEAD_STATUSES[7]),
);

export const leadSource = v.union(v.literal("intake"), v.literal("contact"));

export const leadTemperature = v.union(v.literal("warm"), v.literal("cool"));

export const contractStatus = v.union(
  v.literal(CONTRACT_STATUSES[0]),
  v.literal(CONTRACT_STATUSES[1]),
  v.literal(CONTRACT_STATUSES[2]),
);

export const clientPhase = v.union(
  v.literal(CLIENT_PHASES[0]),
  v.literal(CLIENT_PHASES[1]),
  v.literal(CLIENT_PHASES[2]),
  v.literal(CLIENT_PHASES[3]),
  v.literal(CLIENT_PHASES[4]),
);

export const leadDocValidator = v.object({
  _id: v.id("leads"),
  _creationTime: v.number(),
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
});

export const contractDocValidator = v.object({
  _id: v.id("contracts"),
  _creationTime: v.number(),
  leadId: v.id("leads"),
  accessToken: v.string(),
  status: contractStatus,
  clientName: v.string(),
  maintenanceFeeMonthly: v.number(),
  agreementDate: v.optional(v.string()),
  hexacombSignerName: v.string(),
  hexacombSignerTitle: v.string(),
  hexacombSignedAt: v.optional(v.string()),
  clientSignerName: v.optional(v.string()),
  clientSignerTitle: v.optional(v.string()),
  clientSignedAt: v.optional(v.string()),
  acceptedTerms: v.optional(v.boolean()),
  sentAt: v.optional(v.number()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const clientDocValidator = v.object({
  _id: v.id("clients"),
  _creationTime: v.number(),
  leadId: v.id("leads"),
  name: v.string(),
  email: v.string(),
  phase: clientPhase,
  designReviewUrl: v.optional(v.string()),
  productionUrl: v.optional(v.string()),
  goalsSummary: v.optional(v.string()),
  /** @deprecated Prefer clientNotes table; kept for legacy rows. */
  conversationNotes: v.optional(v.string()),
  /** Unguessable public feedback link token; backfilled for legacy rows. */
  feedbackToken: v.optional(v.string()),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const clientNoteDocValidator = v.object({
  _id: v.id("clientNotes"),
  _creationTime: v.number(),
  clientId: v.id("clients"),
  parentId: v.optional(v.id("clientNotes")),
  body: v.string(),
  createdAt: v.number(),
  updatedAt: v.number(),
});

export const clientFeedbackDocValidator = v.object({
  _id: v.id("clientFeedback"),
  _creationTime: v.number(),
  clientId: v.id("clients"),
  message: v.string(),
  rating: v.optional(v.number()),
  submitterName: v.optional(v.string()),
  createdAt: v.number(),
});

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

  contracts: defineTable({
    leadId: v.id("leads"),
    accessToken: v.string(),
    status: contractStatus,
    clientName: v.string(),
    maintenanceFeeMonthly: v.number(),
    agreementDate: v.optional(v.string()),
    hexacombSignerName: v.string(),
    hexacombSignerTitle: v.string(),
    hexacombSignedAt: v.optional(v.string()),
    clientSignerName: v.optional(v.string()),
    clientSignerTitle: v.optional(v.string()),
    clientSignedAt: v.optional(v.string()),
    acceptedTerms: v.optional(v.boolean()),
    sentAt: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_accessToken", ["accessToken"])
    .index("by_status", ["status"]),

  clients: defineTable({
    leadId: v.id("leads"),
    name: v.string(),
    email: v.string(),
    phase: clientPhase,
    designReviewUrl: v.optional(v.string()),
    productionUrl: v.optional(v.string()),
    goalsSummary: v.optional(v.string()),
    /** @deprecated Prefer clientNotes table; kept for legacy rows. */
    conversationNotes: v.optional(v.string()),
    /** Unguessable public feedback link token; backfilled for legacy rows. */
    feedbackToken: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_lead", ["leadId"])
    .index("by_createdAt", ["createdAt"])
    .index("by_phase", ["phase"])
    .index("by_feedbackToken", ["feedbackToken"]),

  clientNotes: defineTable({
    clientId: v.id("clients"),
    parentId: v.optional(v.id("clientNotes")),
    body: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_client", ["clientId"])
    .index("by_client_and_createdAt", ["clientId", "createdAt"])
    .index("by_parent", ["parentId"]),

  clientFeedback: defineTable({
    clientId: v.id("clients"),
    message: v.string(),
    rating: v.optional(v.number()),
    submitterName: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_client_and_createdAt", ["clientId", "createdAt"]),
});
