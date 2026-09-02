import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { assertBlogApiKey } from "./blogPosts";

const MAX_IMAGE_BYTES = 4_500_000;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
]);

export const agentGenerateUploadUrl = mutation({
  args: { keyHash: v.string() },
  returns: v.string(),
  handler: async (ctx, args) => {
    await assertBlogApiKey(ctx, args.keyHash);
    return await ctx.storage.generateUploadUrl();
  },
});

export const agentSave = mutation({
  args: {
    keyHash: v.string(),
    storageId: v.id("_storage"),
    filename: v.string(),
    contentType: v.string(),
  },
  returns: v.id("blogImages"),
  handler: async (ctx, args) => {
    await assertBlogApiKey(ctx, args.keyHash);
    const metadata = await ctx.db.system.get("_storage", args.storageId);
    if (!metadata) throw new Error("Upload not found");
    const contentType = (metadata.contentType || args.contentType).toLowerCase();
    if (!ALLOWED_TYPES.has(contentType)) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Only JPEG, PNG, WebP, GIF, or AVIF images are allowed");
    }
    if (metadata.size > MAX_IMAGE_BYTES) {
      await ctx.storage.delete(args.storageId);
      throw new Error("Image must be 4.5 MB or smaller");
    }
    const filename = args.filename.trim().slice(0, 120) || "image";
    return await ctx.db.insert("blogImages", {
      storageId: args.storageId,
      filename,
      contentType,
      createdAt: Date.now(),
    });
  },
});

export const getPublic = query({
  args: { imageId: v.id("blogImages") },
  returns: v.union(
    v.object({
      contentType: v.string(),
      url: v.string(),
      filename: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const image = await ctx.db.get(args.imageId);
    if (!image) return null;
    const url = await ctx.storage.getUrl(image.storageId);
    if (!url) return null;
    return { contentType: image.contentType, url, filename: image.filename };
  },
});
