import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogPostEditor } from "@/components/BlogPostEditor";
import { DashboardLoginForm } from "@/components/DashboardLoginForm";
import { DashboardNav } from "@/components/DashboardNav";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { getAdminBlogPost, type Id } from "@/lib/convex";

export const metadata: Metadata = { title: "Edit blog post", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function EditBlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminAuthenticated())) return <DashboardLoginForm />;
  const { id } = await params;
  let post;
  try { post = await getAdminBlogPost(id as Id<"blogPosts">); } catch { notFound(); }
  if (!post) notFound();
  return <div className="dash-page"><div className="dash-shell"><DashboardNav title="Edit post" subtitle={`Last updated ${new Date(post.updatedAt).toLocaleString()}`} showSectionNav={false} /><BlogPostEditor initialPost={{ _id: post._id, title: post.title, slug: post.slug, excerpt: post.excerpt, contentMarkdown: post.contentMarkdown, status: post.status, author: post.author, tags: post.tags, metaTitle: post.metaTitle, metaDescription: post.metaDescription, coverImageUrl: post.coverImageUrl, coverImageAlt: post.coverImageAlt }} /></div></div>;
}
