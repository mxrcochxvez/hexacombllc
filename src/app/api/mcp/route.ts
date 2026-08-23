import { NextRequest } from "next/server";
import { hashBlogApiKey } from "@/lib/blogApiKey";
import {
  authenticateBlogApiKey,
  createAgentBlogPost,
  getAgentBlogPost,
  listAgentBlogPosts,
  updateAgentBlogPost,
  type BlogPostInput,
  type BlogPostUpdateInput,
} from "@/lib/convex";

export const dynamic = "force-dynamic";

const PROTOCOL_VERSION = "2025-11-25";

type JsonRpcId = string | number | null;
type JsonRpcRequest = {
  jsonrpc?: unknown;
  id?: JsonRpcId;
  method?: unknown;
  params?: unknown;
};

const tools = [
  {
    name: "blog_list_posts",
    title: "List blog posts",
    description: "List recent Hexacomb blog posts, including drafts and published posts. Use this before creating a post to avoid duplicate topics and slugs.",
    inputSchema: {
      type: "object",
      properties: { limit: { type: "integer", minimum: 1, maximum: 100, default: 50 } },
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "blog_get_post",
    title: "Get a blog post",
    description: "Get the complete Markdown and metadata for one blog post by slug.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string", description: "The post slug, for example small-business-seo-basics" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: true, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "blog_create_post",
    title: "Create a blog post",
    description: "Create a complete blog post. Prefer status=draft unless the user explicitly asks you to publish. Write useful, original Markdown for non-technical small-business owners; never invent Hexacomb client results, testimonials, or statistics.",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string" },
        slug: { type: "string", description: "Optional URL slug; generated from title when omitted." },
        excerpt: { type: "string", description: "One or two plain-language sentences for the blog index and search results." },
        contentMarkdown: { type: "string", description: "The full post in Markdown. Start with body copy, not a duplicate H1 title." },
        status: { type: "string", enum: ["draft", "published"], default: "draft" },
        author: { type: "string", default: "Hexacomb" },
        tags: { type: "array", items: { type: "string" }, maxItems: 12 },
        metaTitle: { type: "string", description: "Optional SEO title, ideally 50–60 characters." },
        metaDescription: { type: "string", description: "Optional SEO description, ideally 140–160 characters." },
      },
      required: ["title", "excerpt", "contentMarkdown"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: false, openWorldHint: false },
  },
  {
    name: "blog_update_post",
    title: "Update a blog post",
    description: "Update any fields on an existing post identified by its current slug. Omitted fields stay unchanged. Changing status to published requires a publish-enabled key.",
    inputSchema: {
      type: "object",
      properties: {
        currentSlug: { type: "string" },
        title: { type: "string" },
        slug: { type: "string" },
        excerpt: { type: "string" },
        contentMarkdown: { type: "string" },
        status: { type: "string", enum: ["draft", "published"] },
        author: { type: "string" },
        tags: { type: "array", items: { type: "string" }, maxItems: 12 },
        metaTitle: { type: "string" },
        metaDescription: { type: "string" },
      },
      required: ["currentSlug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "blog_publish_post",
    title: "Publish a blog post",
    description: "Publish an existing draft by slug. Requires a publish-enabled API key. Only call after the user has approved publishing.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: false, idempotentHint: true, openWorldHint: false },
  },
  {
    name: "blog_unpublish_post",
    title: "Unpublish a blog post",
    description: "Move a published post back to draft by slug. This removes it from the public site and requires a publish-enabled API key.",
    inputSchema: {
      type: "object",
      properties: { slug: { type: "string" } },
      required: ["slug"],
      additionalProperties: false,
    },
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  },
] as const;

function rpcResult(id: JsonRpcId, result: unknown) {
  return { jsonrpc: "2.0", id, result };
}

function rpcError(id: JsonRpcId, code: number, message: string) {
  return { jsonrpc: "2.0", id, error: { code, message } };
}

function objectArgs(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

function requiredString(args: Record<string, unknown>, name: string): string {
  const value = args[name];
  if (typeof value !== "string" || !value.trim()) throw new Error(`${name} is required`);
  return value.trim();
}

function optionalString(args: Record<string, unknown>, name: string): string | undefined {
  const value = args[name];
  return typeof value === "string" ? value : undefined;
}

function optionalTags(args: Record<string, unknown>): string[] | undefined {
  if (args.tags === undefined) return undefined;
  if (!Array.isArray(args.tags) || !args.tags.every((tag) => typeof tag === "string")) {
    throw new Error("tags must be an array of strings");
  }
  return args.tags as string[];
}

function statusValue(value: unknown, fallback?: "draft" | "published") {
  if (value === undefined) return fallback;
  if (value !== "draft" && value !== "published") throw new Error("status must be draft or published");
  return value;
}

function slugify(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

function postInput(args: Record<string, unknown>): BlogPostInput {
  return {
    title: requiredString(args, "title"),
    slug: optionalString(args, "slug"),
    excerpt: requiredString(args, "excerpt"),
    contentMarkdown: requiredString(args, "contentMarkdown"),
    status: statusValue(args.status, "draft")!,
    author: optionalString(args, "author"),
    tags: optionalTags(args),
    metaTitle: optionalString(args, "metaTitle"),
    metaDescription: optionalString(args, "metaDescription"),
  };
}

function postUpdate(args: Record<string, unknown>): BlogPostUpdateInput {
  const update: BlogPostUpdateInput = {};
  for (const field of ["title", "slug", "excerpt", "contentMarkdown", "author", "metaTitle", "metaDescription"] as const) {
    const value = optionalString(args, field);
    if (value !== undefined) update[field] = value;
  }
  const status = statusValue(args.status);
  if (status) update.status = status;
  const tags = optionalTags(args);
  if (tags) update.tags = tags;
  return update;
}

function toolResult(data: unknown) {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    structuredContent: data,
  };
}

async function callTool(name: string, args: Record<string, unknown>, keyHash: string) {
  switch (name) {
    case "blog_list_posts": {
      const rawLimit = typeof args.limit === "number" ? args.limit : 50;
      const posts = await listAgentBlogPosts(keyHash, Math.min(Math.max(Math.floor(rawLimit), 1), 100));
      return toolResult(posts);
    }
    case "blog_get_post": {
      const slug = requiredString(args, "slug");
      const post = await getAgentBlogPost(keyHash, slug);
      if (!post) throw new Error(`No blog post found for slug “${slug}”`);
      return toolResult(post);
    }
    case "blog_create_post": {
      const input = postInput(args);
      const postId = await createAgentBlogPost(keyHash, input);
      const slug = slugify(input.slug || input.title);
      return toolResult({ success: true, postId, slug, status: input.status, dashboardUrl: `/dashboard/blog/${postId}`, publicUrl: input.status === "published" ? `/blog/${slug}` : null });
    }
    case "blog_update_post": {
      const currentSlug = requiredString(args, "currentSlug");
      const postId = await updateAgentBlogPost(keyHash, currentSlug, postUpdate(args));
      return toolResult({ success: true, postId });
    }
    case "blog_publish_post": {
      const slug = requiredString(args, "slug");
      const postId = await updateAgentBlogPost(keyHash, slug, { status: "published" });
      return toolResult({ success: true, postId, status: "published", publicUrl: `/blog/${slug}` });
    }
    case "blog_unpublish_post": {
      const slug = requiredString(args, "slug");
      const postId = await updateAgentBlogPost(keyHash, slug, { status: "draft" });
      return toolResult({ success: true, postId, status: "draft" });
    }
    default:
      throw new Error(`Unknown tool: ${name}`);
  }
}

async function handleMessage(message: JsonRpcRequest, keyHash: string) {
  const id = message.id ?? null;
  if (message.jsonrpc !== "2.0" || typeof message.method !== "string") {
    return rpcError(id, -32600, "Invalid Request");
  }

  if (message.method === "initialize") {
    return rpcResult(id, {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: { tools: { listChanged: false } },
      serverInfo: {
        name: "hexacomb-blog",
        title: "Hexacomb Blog",
        version: "1.0.0",
        description: "Create, edit, review, and publish Hexacomb blog posts.",
      },
      instructions: "Use drafts by default. Review existing posts before proposing a topic. Never invent client results, testimonials, or business claims.",
    });
  }
  if (message.method === "notifications/initialized") return null;
  if (message.method === "ping") return rpcResult(id, {});
  if (message.method === "tools/list") return rpcResult(id, { tools });
  if (message.method === "tools/call") {
    const params = objectArgs(message.params);
    if (typeof params.name !== "string") return rpcError(id, -32602, "Tool name is required");
    try {
      return rpcResult(id, await callTool(params.name, objectArgs(params.arguments), keyHash));
    } catch (error) {
      const text = error instanceof Error ? error.message : "Tool call failed";
      return rpcResult(id, { content: [{ type: "text", text }], isError: true });
    }
  }
  return rpcError(id, -32601, `Method not found: ${message.method}`);
}

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store", "MCP-Protocol-Version": PROTOCOL_VERSION },
  });
}

function validOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try {
    return new URL(origin).host === new URL(request.url).host;
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  if (!validOrigin(request)) return jsonResponse(rpcError(null, -32000, "Invalid Origin"), 403);

  const authorization = request.headers.get("authorization");
  const apiKey = authorization?.startsWith("Bearer ") ? authorization.slice(7).trim() : "";
  if (!apiKey.startsWith("hxb_")) {
    return jsonResponse(rpcError(null, -32001, "A Hexacomb blog API key is required"), 401);
  }

  const keyHash = await hashBlogApiKey(apiKey);
  const credential = await authenticateBlogApiKey(keyHash).catch(() => null);
  if (!credential) return jsonResponse(rpcError(null, -32001, "Invalid or revoked API key"), 401);

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(rpcError(null, -32700, "Parse error"), 400);
  }

  if (Array.isArray(body)) {
    if (body.length === 0) return jsonResponse(rpcError(null, -32600, "Invalid Request"), 400);
    const responses = (await Promise.all(body.map((item) => handleMessage(objectArgs(item), keyHash)))).filter(Boolean);
    return responses.length ? jsonResponse(responses) : new Response(null, { status: 202 });
  }

  const response = await handleMessage(objectArgs(body), keyHash);
  return response ? jsonResponse(response) : new Response(null, { status: 202 });
}

export async function GET() {
  return new Response("This MCP server does not open a standalone SSE stream.", {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
