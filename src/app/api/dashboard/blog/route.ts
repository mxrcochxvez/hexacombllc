import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { createAdminBlogPost, listAdminBlogPosts } from "@/lib/convex";

export const dynamic = "force-dynamic";

function readPost(body: Record<string, unknown>) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const excerpt = typeof body.excerpt === "string" ? body.excerpt.trim() : "";
  const contentMarkdown = typeof body.contentMarkdown === "string" ? body.contentMarkdown.trim() : "";
  const status = body.status === "published" ? "published" : "draft";
  if (!title || !excerpt || !contentMarkdown) throw new Error("Title, excerpt, and content are required.");
  return {
    title,
    excerpt,
    contentMarkdown,
    status,
    slug: typeof body.slug === "string" ? body.slug : undefined,
    author: typeof body.author === "string" ? body.author : undefined,
    tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : undefined,
    metaTitle: typeof body.metaTitle === "string" ? body.metaTitle : undefined,
    metaDescription: typeof body.metaDescription === "string" ? body.metaDescription : undefined,
    coverImageUrl: typeof body.coverImageUrl === "string" ? body.coverImageUrl : undefined,
    coverImageAlt: typeof body.coverImageAlt === "string" ? body.coverImageAlt : undefined,
  } as const;
}

export async function GET() {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    return NextResponse.json({ posts: await listAdminBlogPosts() });
  } catch (error) {
    console.error("Dashboard blog list error:", error);
    return NextResponse.json({ error: "Failed to load blog posts." }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const input = readPost((await request.json()) as Record<string, unknown>);
    const postId = await createAdminBlogPost(input);
    return NextResponse.json({ success: true, postId });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
