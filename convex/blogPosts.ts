import { v } from "convex/values";
import { mutation, query, type MutationCtx, type QueryCtx } from "./_generated/server";
import type { Id } from "./_generated/dataModel";
import { blogPostDocValidator, blogPostStatus } from "./schema";

type ReadCtx = Pick<QueryCtx, "db"> | Pick<MutationCtx, "db">;

function assertIngestSecret(ingestSecret: string) {
  const expected = process.env.LEAD_INGEST_SECRET;
  if (!expected || ingestSecret !== expected) throw new Error("Unauthorized");
}

async function assertApiKey(ctx: ReadCtx, keyHash: string, needsPublish = false) {
  const key = await ctx.db
    .query("blogApiKeys")
    .withIndex("by_keyHash", (q) => q.eq("keyHash", keyHash))
    .unique();
  if (!key || key.revokedAt) throw new Error("Unauthorized");
  if (needsPublish && !key.canPublish) {
    throw new Error("This API key can create drafts but cannot publish");
  }
}

function cleanSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function cleanTags(tags: string[]): string[] {
  return [...new Set(tags.map((tag) => tag.trim()).filter(Boolean))].slice(0, 12);
}

function cleanOptionalText(value: string | undefined): string | undefined {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function cleanCoverImageUrl(value: string | undefined): string | undefined {
  const url = cleanOptionalText(value);
  if (!url) return undefined;
  if (url.startsWith("/") || url.startsWith("https://")) return url;
  throw new Error("Cover image must be a site path or an https URL");
}

async function assertUniqueSlug(
  ctx: ReadCtx,
  slug: string,
  exceptId?: string,
) {
  const existing = await ctx.db
    .query("blogPosts")
    .withIndex("by_slug", (q) => q.eq("slug", slug))
    .unique();
  if (existing && existing._id !== exceptId) {
    throw new Error(`A post already uses the slug “${slug}”`);
  }
}

export const listPublished = query({
  args: { limit: v.optional(v.number()) },
  returns: v.array(blogPostDocValidator),
  handler: async (ctx, args) => {
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_status_and_publishedAt", (q) => q.eq("status", "published"))
      .order("desc")
      .take(limit);
  },
});

export const getPublishedBySlug = query({
  args: { slug: v.string() },
  returns: v.union(blogPostDocValidator, v.null()),
  handler: async (ctx, args) => {
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", cleanSlug(args.slug)))
      .unique();
    return post?.status === "published" ? post : null;
  },
});

export const adminList = query({
  args: { ingestSecret: v.string(), limit: v.optional(v.number()) },
  returns: v.array(blogPostDocValidator),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    const limit = Math.min(Math.max(args.limit ?? 100, 1), 200);
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_updatedAt")
      .order("desc")
      .take(limit);
  },
});

export const adminGet = query({
  args: { ingestSecret: v.string(), postId: v.id("blogPosts") },
  returns: v.union(blogPostDocValidator, v.null()),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await ctx.db.get(args.postId);
  },
});

export const agentList = query({
  args: { keyHash: v.string(), limit: v.optional(v.number()) },
  returns: v.array(blogPostDocValidator),
  handler: async (ctx, args) => {
    await assertApiKey(ctx, args.keyHash);
    const limit = Math.min(Math.max(args.limit ?? 50, 1), 100);
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_updatedAt")
      .order("desc")
      .take(limit);
  },
});

export const agentGetBySlug = query({
  args: { keyHash: v.string(), slug: v.string() },
  returns: v.union(blogPostDocValidator, v.null()),
  handler: async (ctx, args) => {
    await assertApiKey(ctx, args.keyHash);
    return await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", cleanSlug(args.slug)))
      .unique();
  },
});

const createArgs = {
  title: v.string(),
  slug: v.optional(v.string()),
  excerpt: v.string(),
  contentMarkdown: v.string(),
  status: blogPostStatus,
  author: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  coverImageAlt: v.optional(v.string()),
};

async function createPost(
  ctx: MutationCtx,
  args: {
    title: string;
    slug?: string;
    excerpt: string;
    contentMarkdown: string;
    status: "draft" | "published";
    author?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
  },
) {
  const title = args.title.trim();
  const slug = cleanSlug(args.slug || title);
  if (!title || !slug || !args.excerpt.trim() || !args.contentMarkdown.trim()) {
    throw new Error("Title, slug, excerpt, and content are required");
  }
  await assertUniqueSlug(ctx, slug);
  const now = Date.now();
  return await ctx.db.insert("blogPosts", {
    title,
    slug,
    excerpt: args.excerpt.trim(),
    contentMarkdown: args.contentMarkdown.trim(),
    status: args.status,
    author: args.author?.trim() || "Hexacomb",
    tags: cleanTags(args.tags ?? []),
    metaTitle: cleanOptionalText(args.metaTitle),
    metaDescription: cleanOptionalText(args.metaDescription),
    coverImageUrl: cleanCoverImageUrl(args.coverImageUrl),
    coverImageAlt: cleanOptionalText(args.coverImageAlt),
    publishedAt: args.status === "published" ? now : undefined,
    createdAt: now,
    updatedAt: now,
  });
}

export const adminCreate = mutation({
  args: { ingestSecret: v.string(), ...createArgs },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await createPost(ctx, args);
  },
});

export const agentCreate = mutation({
  args: { keyHash: v.string(), ...createArgs },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    await assertApiKey(ctx, args.keyHash, args.status === "published");
    return await createPost(ctx, args);
  },
});

const updateArgs = {
  title: v.optional(v.string()),
  slug: v.optional(v.string()),
  excerpt: v.optional(v.string()),
  contentMarkdown: v.optional(v.string()),
  status: v.optional(blogPostStatus),
  author: v.optional(v.string()),
  tags: v.optional(v.array(v.string())),
  metaTitle: v.optional(v.string()),
  metaDescription: v.optional(v.string()),
  coverImageUrl: v.optional(v.string()),
  coverImageAlt: v.optional(v.string()),
};

async function updatePost(
  ctx: MutationCtx,
  postId: Id<"blogPosts">,
  args: {
    title?: string;
    slug?: string;
    excerpt?: string;
    contentMarkdown?: string;
    status?: "draft" | "published";
    author?: string;
    tags?: string[];
    metaTitle?: string;
    metaDescription?: string;
    coverImageUrl?: string;
    coverImageAlt?: string;
  },
) {
  const post = await ctx.db.get(postId);
  if (!post) throw new Error("Post not found");
  const nextSlug = args.slug === undefined ? post.slug : cleanSlug(args.slug);
  if (!nextSlug) throw new Error("Slug is required");
  await assertUniqueSlug(ctx, nextSlug, post._id);
  const now = Date.now();
  await ctx.db.patch(post._id, {
    title: args.title === undefined ? post.title : args.title.trim(),
    slug: nextSlug,
    excerpt: args.excerpt === undefined ? post.excerpt : args.excerpt.trim(),
    contentMarkdown:
      args.contentMarkdown === undefined
        ? post.contentMarkdown
        : args.contentMarkdown.trim(),
    status: args.status ?? post.status,
    author: args.author === undefined ? post.author : args.author.trim(),
    tags: args.tags === undefined ? post.tags : cleanTags(args.tags),
    metaTitle: args.metaTitle === undefined ? post.metaTitle : args.metaTitle.trim() || undefined,
    metaDescription:
      args.metaDescription === undefined
        ? post.metaDescription
        : args.metaDescription.trim() || undefined,
    coverImageUrl:
      args.coverImageUrl === undefined
        ? post.coverImageUrl
        : cleanCoverImageUrl(args.coverImageUrl),
    coverImageAlt:
      args.coverImageAlt === undefined
        ? post.coverImageAlt
        : cleanOptionalText(args.coverImageAlt),
    publishedAt:
      args.status === "published" && !post.publishedAt
        ? now
        : args.status === "draft"
          ? undefined
          : post.publishedAt,
    updatedAt: now,
  });
  return post._id;
}

export const adminUpdate = mutation({
  args: { ingestSecret: v.string(), postId: v.id("blogPosts"), ...updateArgs },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    assertIngestSecret(args.ingestSecret);
    return await updatePost(ctx, args.postId, args);
  },
});

export const agentUpdateBySlug = mutation({
  args: { keyHash: v.string(), currentSlug: v.string(), ...updateArgs },
  returns: v.id("blogPosts"),
  handler: async (ctx, args) => {
    await assertApiKey(ctx, args.keyHash, args.status !== undefined);
    const post = await ctx.db
      .query("blogPosts")
      .withIndex("by_slug", (q) => q.eq("slug", cleanSlug(args.currentSlug)))
      .unique();
    if (!post) throw new Error("Post not found");
    return await updatePost(ctx, post._id, args);
  },
});
