import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { ensureClientForLead } from "./lib/ensureClient";
import { generateAccessToken } from "./lib/tokens";
import { contractDocValidator } from "./schema";
import { statusAfterContractSend, type LeadStatus } from "./statuses";

function assertIngestSecret(ingestSecret: string) {
  const expected = process.env.LEAD_INGEST_SECRET;
  if (!expected || ingestSecret !== expected) {
    throw new Error("Unauthorized");
  }
}

export const upsertDraft = mutation({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
    clientName: v.string(),
    maintenanceFeeMonthly: v.number(),
    agreementDate: v.optional(v.string()),
    hexacombSignerName: v.string(),
    hexacombSignerTitle: v.string(),
    hexacombSignedAt: v.optional(v.string()),
  },
  returns: v.id("contracts"),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    if (
      !Number.isFinite(args.maintenanceFeeMonthly) ||
      args.maintenanceFeeMonthly < 0
    ) {
      throw new Error("Maintenance fee must be a non-negative number");
    }

    const clientName = args.clientName.trim();
    const hexacombSignerName = args.hexacombSignerName.trim();
    const hexacombSignerTitle = args.hexacombSignerTitle.trim();
    if (!clientName || !hexacombSignerName || !hexacombSignerTitle) {
      throw new Error("Client name and Hexacomb signer fields are required");
    }

    const existing = await ctx.db
      .query("contracts")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .first();

    const now = Date.now();
    const agreementDate = args.agreementDate?.trim() || undefined;
    const hexacombSignedAt = args.hexacombSignedAt?.trim() || undefined;

    if (existing) {
      if (existing.status === "sent" || existing.status === "signed") {
        throw new Error(
          "Cannot edit a contract that has already been sent for review",
        );
      }
      await ctx.db.patch(existing._id, {
        clientName,
        maintenanceFeeMonthly: args.maintenanceFeeMonthly,
        agreementDate,
        hexacombSignerName,
        hexacombSignerTitle,
        hexacombSignedAt,
        updatedAt: now,
      });
      return existing._id;
    }

    return await ctx.db.insert("contracts", {
      leadId: args.leadId,
      accessToken: generateAccessToken(),
      status: "draft",
      clientName,
      maintenanceFeeMonthly: args.maintenanceFeeMonthly,
      agreementDate,
      hexacombSignerName,
      hexacombSignerTitle,
      hexacombSignedAt,
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const send = mutation({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
    clientName: v.optional(v.string()),
    maintenanceFeeMonthly: v.optional(v.number()),
    agreementDate: v.optional(v.string()),
    hexacombSignerName: v.optional(v.string()),
    hexacombSignerTitle: v.optional(v.string()),
    hexacombSignedAt: v.optional(v.string()),
  },
  returns: v.object({
    contractId: v.id("contracts"),
    accessToken: v.string(),
    leadEmail: v.string(),
    leadName: v.string(),
    clientName: v.string(),
  }),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const lead = await ctx.db.get(args.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    let contract = await ctx.db
      .query("contracts")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .first();

    const now = Date.now();

    if (contract?.status === "signed") {
      throw new Error("Contract is already signed");
    }

    const clientName = (
      args.clientName?.trim() ||
      contract?.clientName ||
      ""
    ).trim();
    const hexacombSignerName = (
      args.hexacombSignerName?.trim() ||
      contract?.hexacombSignerName ||
      ""
    ).trim();
    const hexacombSignerTitle = (
      args.hexacombSignerTitle?.trim() ||
      contract?.hexacombSignerTitle ||
      ""
    ).trim();
    const maintenanceFeeMonthly =
      args.maintenanceFeeMonthly ?? contract?.maintenanceFeeMonthly;

    if (
      !clientName ||
      !hexacombSignerName ||
      !hexacombSignerTitle ||
      maintenanceFeeMonthly === undefined ||
      !Number.isFinite(maintenanceFeeMonthly) ||
      maintenanceFeeMonthly < 0
    ) {
      throw new Error(
        "Client name, maintenance fee, and Hexacomb signer fields are required before sending",
      );
    }

    const agreementDate =
      args.agreementDate?.trim() || contract?.agreementDate || undefined;
    const hexacombSignedAt =
      args.hexacombSignedAt?.trim() || contract?.hexacombSignedAt || undefined;

    if (!contract) {
      const accessToken = generateAccessToken();
      const contractId = await ctx.db.insert("contracts", {
        leadId: args.leadId,
        accessToken,
        status: "sent",
        clientName,
        maintenanceFeeMonthly,
        agreementDate,
        hexacombSignerName,
        hexacombSignerTitle,
        hexacombSignedAt,
        sentAt: now,
        createdAt: now,
        updatedAt: now,
      });
      contract = await ctx.db.get(contractId);
      if (!contract) {
        throw new Error("Failed to create contract");
      }
    } else {
      const accessToken = contract.accessToken || generateAccessToken();
      await ctx.db.patch(contract._id, {
        accessToken,
        status: "sent",
        clientName,
        maintenanceFeeMonthly,
        agreementDate,
        hexacombSignerName,
        hexacombSignerTitle,
        hexacombSignedAt,
        sentAt: now,
        updatedAt: now,
        clientSignerName: undefined,
        clientSignerTitle: undefined,
        clientSignedAt: undefined,
        acceptedTerms: undefined,
      });
      contract = await ctx.db.get(contract._id);
      if (!contract) {
        throw new Error("Failed to update contract");
      }
    }

    const nextStatus = statusAfterContractSend(lead.status as LeadStatus);
    if (nextStatus) {
      await ctx.db.patch(args.leadId, {
        status: nextStatus,
        updatedAt: now,
        statusChangedAt: now,
      });
    } else {
      await ctx.db.patch(args.leadId, { updatedAt: now });
    }

    return {
      contractId: contract._id,
      accessToken: contract.accessToken,
      leadEmail: lead.email,
      leadName: lead.name,
      clientName: contract.clientName,
    };
  },
});

export const getByLead = query({
  args: {
    ingestSecret: v.string(),
    leadId: v.id("leads"),
  },
  returns: v.union(contractDocValidator, v.null()),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await ctx.db
      .query("contracts")
      .withIndex("by_lead", (q) => q.eq("leadId", args.leadId))
      .first();
  },
});

/** Public: token-gated payload for the client agreement page. */
export const getByToken = query({
  args: {
    accessToken: v.string(),
  },
  returns: v.union(
    v.object({
      status: v.union(
        v.literal("draft"),
        v.literal("sent"),
        v.literal("signed"),
      ),
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
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const token = args.accessToken.trim();
    if (!token) return null;

    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_accessToken", (q) => q.eq("accessToken", token))
      .unique();

    if (!contract) return null;
    if (contract.status === "draft") return null;

    return {
      status: contract.status,
      clientName: contract.clientName,
      maintenanceFeeMonthly: contract.maintenanceFeeMonthly,
      agreementDate: contract.agreementDate,
      hexacombSignerName: contract.hexacombSignerName,
      hexacombSignerTitle: contract.hexacombSignerTitle,
      hexacombSignedAt: contract.hexacombSignedAt,
      clientSignerName: contract.clientSignerName,
      clientSignerTitle: contract.clientSignerTitle,
      clientSignedAt: contract.clientSignedAt,
      acceptedTerms: contract.acceptedTerms,
    };
  },
});

export const accept = mutation({
  args: {
    accessToken: v.string(),
    clientSignerName: v.string(),
    clientSignerTitle: v.string(),
    clientSignedAt: v.string(),
    acceptedTerms: v.boolean(),
  },
  returns: v.object({
    leadId: v.id("leads"),
    leadName: v.string(),
    leadEmail: v.string(),
    clientName: v.string(),
    maintenanceFeeMonthly: v.number(),
  }),
  handler: async (ctx, args) => {
    const token = args.accessToken.trim();
    if (!token) {
      throw new Error("Invalid access token");
    }

    const contract = await ctx.db
      .query("contracts")
      .withIndex("by_accessToken", (q) => q.eq("accessToken", token))
      .unique();

    if (!contract) {
      throw new Error("Contract not found");
    }
    if (contract.status === "signed") {
      throw new Error("Contract already signed");
    }
    if (contract.status !== "sent") {
      throw new Error("Contract is not open for acceptance");
    }
    if (!args.acceptedTerms) {
      throw new Error("You must accept the terms to continue");
    }

    const clientSignerName = args.clientSignerName.trim();
    const clientSignerTitle = args.clientSignerTitle.trim();
    const clientSignedAt = args.clientSignedAt.trim();
    if (!clientSignerName || !clientSignerTitle || !clientSignedAt) {
      throw new Error("Name, title, and date are required");
    }

    const lead = await ctx.db.get(contract.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    const now = Date.now();
    await ctx.db.patch(contract._id, {
      status: "signed",
      clientSignerName,
      clientSignerTitle,
      clientSignedAt,
      acceptedTerms: true,
      updatedAt: now,
    });

    if (lead.status !== "contracted") {
      await ctx.db.patch(lead._id, {
        status: "contracted",
        updatedAt: now,
        statusChangedAt: now,
      });
    } else {
      await ctx.db.patch(lead._id, { updatedAt: now });
    }

    await ensureClientForLead(ctx, lead._id);

    return {
      leadId: lead._id,
      leadName: lead.name,
      leadEmail: lead.email,
      clientName: contract.clientName,
      maintenanceFeeMonthly: contract.maintenanceFeeMonthly,
    };
  },
});
