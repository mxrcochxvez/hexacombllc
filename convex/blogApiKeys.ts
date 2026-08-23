import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { blogApiKeyDocValidator } from "./schema";

function assertIngestSecret(ingestSecret: string) {
  const expected = process.env.LEAD_INGEST_SECRET;
  if (!expected || ingestSecret !== expected) throw new Error("Unauthorized");
}

export const list = query({
  args: { ingestSecret: v.string() },
  returns: v.array(blogApiKeyDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await ctx.db
      .query("blogApiKeys")
      .withIndex("by_createdAt")
      .order("desc")
      .take(100);
  },
});

export const create = mutation({
  args: {
    ingestSecret: v.string(),
    name: v.string(),
    keyHash: v.string(),
    keyPrefix: v.string(),
    canPublish: v.boolean(),
  },
  returns: v.id("blogApiKeys"),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const existing = await ctx.db
      .query("blogApiKeys")
      .withIndex("by_keyHash", (q) => q.eq("keyHash", args.keyHash))
      .unique();
    if (existing) throw new Error("API key already exists");

    return await ctx.db.insert("blogApiKeys", {
      name: args.name.trim(),
      keyHash: args.keyHash,
      keyPrefix: args.keyPrefix,
      canPublish: args.canPublish,
      createdAt: Date.now(),
    });
  },
});

export const revoke = mutation({
  args: { ingestSecret: v.string(), keyId: v.id("blogApiKeys") },
  returns: v.null(),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const key = await ctx.db.get(args.keyId);
    if (!key) throw new Error("API key not found");
    if (!key.revokedAt) await ctx.db.patch(args.keyId, { revokedAt: Date.now() });
    return null;
  },
});

export const authenticate = mutation({
  args: { keyHash: v.string() },
  returns: v.union(
    v.object({ name: v.string(), canPublish: v.boolean() }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const key = await ctx.db
      .query("blogApiKeys")
      .withIndex("by_keyHash", (q) => q.eq("keyHash", args.keyHash))
      .unique();
    if (!key || key.revokedAt) return null;
    await ctx.db.patch(key._id, { lastUsedAt: Date.now() });
    return { name: key.name, canPublish: key.canPublish };
  },
});
