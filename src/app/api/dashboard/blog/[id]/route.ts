import { NextRequest, NextResponse } from "next/server";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAdminBlogPost, updateAdminBlogPost, type Id } from "@/lib/convex";

export const dynamic = "force-dynamic";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const post = await getAdminBlogPost(id as Id<"blogPosts">);
    return post ? NextResponse.json({ post }) : NextResponse.json({ error: "Post not found." }, { status: 404 });
  } catch {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await params;
    const body = (await request.json()) as Record<string, unknown>;
    const status = body.status === "published" ? "published" : body.status === "draft" ? "draft" : undefined;
    await updateAdminBlogPost(id as Id<"blogPosts">, {
      title: typeof body.title === "string" ? body.title : undefined,
      slug: typeof body.slug === "string" ? body.slug : undefined,
      excerpt: typeof body.excerpt === "string" ? body.excerpt : undefined,
      contentMarkdown: typeof body.contentMarkdown === "string" ? body.contentMarkdown : undefined,
      status,
      author: typeof body.author === "string" ? body.author : undefined,
      tags: Array.isArray(body.tags) ? body.tags.filter((tag): tag is string => typeof tag === "string") : undefined,
      metaTitle: typeof body.metaTitle === "string" ? body.metaTitle : undefined,
      metaDescription: typeof body.metaDescription === "string" ? body.metaDescription : undefined,
      coverImageUrl: typeof body.coverImageUrl === "string" ? body.coverImageUrl : undefined,
      coverImageAlt: typeof body.coverImageAlt === "string" ? body.coverImageAlt : undefined,
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update post.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
