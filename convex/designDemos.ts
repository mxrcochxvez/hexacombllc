import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import type { QueryCtx } from "./_generated/server";
import { generateAccessToken } from "./lib/tokens";
import {
  designDemoCommentDocValidator,
  designDemoCommentWithUrlValidator,
  designDemoDocValidator,
  designDemoStatus,
} from "./schema";

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

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

async function listDemosForClient(ctx: QueryCtx, clientId: Id<"clients">) {
  return await ctx.db
    .query("designDemos")
    .withIndex("by_client_and_createdAt", (q) => q.eq("clientId", clientId))
    .order("desc")
    .collect();
}

async function listCommentsForClientWithUrls(
  ctx: QueryCtx,
  clientId: Id<"clients">,
) {
  const comments = await ctx.db
    .query("designDemoComments")
    .withIndex("by_client_and_createdAt", (q) => q.eq("clientId", clientId))
    .order("desc")
    .take(200);

  return await Promise.all(
    comments.map(async (comment) => {
      const screenshotUrl = comment.screenshotStorageId
        ? await ctx.storage.getUrl(comment.screenshotStorageId)
        : null;
      return {
        ...comment,
        screenshotUrl,
      };
    }),
  );
}

async function listCommentsForDemoWithUrls(
  ctx: QueryCtx,
  demoId: Id<"designDemos">,
) {
  const comments = await ctx.db
    .query("designDemoComments")
    .withIndex("by_demo", (q) => q.eq("demoId", demoId))
    .collect();

  comments.sort((a, b) => a.createdAt - b.createdAt);

  return await Promise.all(
    comments.map(async (comment) => {
      const screenshotUrl = comment.screenshotStorageId
        ? await ctx.storage.getUrl(comment.screenshotStorageId)
        : null;
      return {
        ...comment,
        screenshotUrl,
      };
    }),
  );
}

export const create = mutation({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
    title: v.string(),
    demoUrl: v.string(),
  },
  returns: designDemoDocValidator,
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }

    const title = args.title.trim();
    const demoUrl = args.demoUrl.trim();
    if (!title) {
      throw new Error("Title is required");
    }
    if (title.length > 200) {
      throw new Error("Title is too long");
    }
    if (!demoUrl || !isHttpUrl(demoUrl)) {
      throw new Error("A valid http(s) demo URL is required");
    }

    const now = Date.now();
    const demoId = await ctx.db.insert("designDemos", {
      clientId: args.clientId,
      title,
      demoUrl,
      accessToken: generateAccessToken(),
      status: "draft",
      createdAt: now,
      updatedAt: now,
    });
    await ctx.db.patch(args.clientId, { updatedAt: now });

    const demo = await ctx.db.get(demoId);
    if (!demo) {
      throw new Error("Failed to create design demo");
    }
    return demo;
  },
});

export const listForClient = query({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
  },
  returns: v.array(designDemoDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    return await listDemosForClient(ctx, args.clientId);
  },
});

export const listCommentsForClient = query({
  args: {
    ingestSecret: v.string(),
    clientId: v.id("clients"),
  },
  returns: v.array(designDemoCommentWithUrlValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const client = await ctx.db.get(args.clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    return await listCommentsForClientWithUrls(ctx, args.clientId);
  },
});

export const getForAdmin = query({
  args: {
    ingestSecret: v.string(),
    demoId: v.id("designDemos"),
  },
  returns: v.union(
    v.object({
      demo: designDemoDocValidator,
      comments: v.array(designDemoCommentWithUrlValidator),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const demo = await ctx.db.get(args.demoId);
    if (!demo) return null;
    const comments = await listCommentsForDemoWithUrls(ctx, demo._id);
    return { demo, comments };
  },
});

export const send = mutation({
  args: {
    ingestSecret: v.string(),
    demoId: v.id("designDemos"),
  },
  returns: v.object({
    demoId: v.id("designDemos"),
    accessToken: v.string(),
    title: v.string(),
    clientName: v.string(),
    clientEmail: v.string(),
    leadName: v.string(),
  }),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const demo = await ctx.db.get(args.demoId);
    if (!demo) {
      throw new Error("Design demo not found");
    }
    if (demo.status === "closed") {
      throw new Error("Cannot send a closed design demo");
    }

    const client = await ctx.db.get(demo.clientId);
    if (!client) {
      throw new Error("Client not found");
    }
    const lead = await ctx.db.get(client.leadId);
    if (!lead) {
      throw new Error("Lead not found");
    }

    const now = Date.now();
    await ctx.db.patch(demo._id, {
      status: "sent",
      sentAt: demo.sentAt ?? now,
      updatedAt: now,
    });
    await ctx.db.patch(client._id, { updatedAt: now });

    return {
      demoId: demo._id,
      accessToken: demo.accessToken,
      title: demo.title,
      clientName: client.name,
      clientEmail: client.email,
      leadName: lead.name,
    };
  },
});

export const close = mutation({
  args: {
    ingestSecret: v.string(),
    demoId: v.id("designDemos"),
  },
  returns: designDemoDocValidator,
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);

    const demo = await ctx.db.get(args.demoId);
    if (!demo) {
      throw new Error("Design demo not found");
    }

    const now = Date.now();
    await ctx.db.patch(demo._id, {
      status: "closed",
      updatedAt: now,
    });
    await ctx.db.patch(demo.clientId, { updatedAt: now });

    const updated = await ctx.db.get(demo._id);
    if (!updated) {
      throw new Error("Failed to close design demo");
    }
    return updated;
  },
});

export const getByToken = query({
  args: {
    accessToken: v.string(),
  },
  returns: v.union(
    v.object({
      title: v.string(),
      demoUrl: v.string(),
      clientName: v.string(),
      status: designDemoStatus,
      comments: v.array(
        v.object({
          _id: v.id("designDemoComments"),
          body: v.string(),
          submitterName: v.optional(v.string()),
          createdAt: v.number(),
        }),
      ),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const token = args.accessToken.trim();
    if (!token) return null;

    const demo = await ctx.db
      .query("designDemos")
      .withIndex("by_accessToken", (q) => q.eq("accessToken", token))
      .first();
    if (!demo) return null;

    const client = await ctx.db.get(demo.clientId);
    if (!client) return null;

    const comments = await ctx.db
      .query("designDemoComments")
      .withIndex("by_demo", (q) => q.eq("demoId", demo._id))
      .collect();
    comments.sort((a, b) => a.createdAt - b.createdAt);

    return {
      title: demo.title,
      demoUrl: demo.demoUrl,
      clientName: client.name,
      status: demo.status,
      comments: comments.map((c) => ({
        _id: c._id,
        body: c.body,
        submitterName: c.submitterName,
        createdAt: c.createdAt,
      })),
    };
  },
});

export const submitComment = mutation({
  args: {
    accessToken: v.string(),
    body: v.string(),
    submitterName: v.optional(v.string()),
  },
  returns: designDemoCommentDocValidator,
  handler: async (ctx, args) => {
    const token = args.accessToken.trim();
    if (!token) {
      throw new Error("Invalid review link");
    }

    const demo = await ctx.db
      .query("designDemos")
      .withIndex("by_accessToken", (q) => q.eq("accessToken", token))
      .first();
    if (!demo) {
      throw new Error("Invalid review link");
    }
    if (demo.status === "closed") {
      throw new Error("This design review is closed");
    }

    const body = args.body.trim();
    if (!body) {
      throw new Error("Comment is required");
    }
    if (body.length > 5000) {
      throw new Error("Comment is too long");
    }

    const submitterName = optionalTrimmed(args.submitterName);
    if (submitterName && submitterName.length > 120) {
      throw new Error("Name is too long");
    }

    const now = Date.now();
    const commentId = await ctx.db.insert("designDemoComments", {
      demoId: demo._id,
      clientId: demo.clientId,
      body,
      submitterName,
      createdAt: now,
    });

    if (demo.status === "draft") {
      await ctx.db.patch(demo._id, {
        status: "sent",
        sentAt: demo.sentAt ?? now,
        updatedAt: now,
      });
    } else {
      await ctx.db.patch(demo._id, { updatedAt: now });
    }
    await ctx.db.patch(demo.clientId, { updatedAt: now });

    const comment = await ctx.db.get(commentId);
    if (!comment) {
      throw new Error("Failed to save comment");
    }
    return comment;
  },
});
