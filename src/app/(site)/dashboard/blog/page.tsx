import type { Metadata } from "next";
import { DashboardBlog } from "@/components/DashboardBlog";
import { DashboardLoginForm } from "@/components/DashboardLoginForm";
import { isAdminAuthenticated } from "@/lib/adminAuth";
import { listAdminBlogPosts, listBlogApiKeys } from "@/lib/convex";

export const metadata: Metadata = { title: "Blog dashboard", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function DashboardBlogPage() {
  if (!(await isAdminAuthenticated())) return <DashboardLoginForm />;
  let posts: Awaited<ReturnType<typeof listAdminBlogPosts>> = [];
  let apiKeys: Awaited<ReturnType<typeof listBlogApiKeys>> = [];
  let loadError = "";
  try { [posts, apiKeys] = await Promise.all([listAdminBlogPosts(), listBlogApiKeys()]); }
  catch (error) { console.error("Dashboard blog load failed:", error); loadError = "Could not load the blog. Check Convex configuration."; }
  const postRows = posts.map((post) => ({
    _id: post._id,
    title: post.title,
    slug: post.slug,
    status: post.status,
    updatedAt: post.updatedAt,
    publishedAt: post.publishedAt,
  }));
  const keyRows = apiKeys.map((key) => ({
    _id: key._id,
    name: key.name,
    keyPrefix: key.keyPrefix,
    canPublish: key.canPublish,
    createdAt: key.createdAt,
    lastUsedAt: key.lastUsedAt,
    revokedAt: key.revokedAt,
  }));
  return <div className="dash-page">{loadError ? <p className="field-error mb-4">{loadError}</p> : null}<DashboardBlog posts={postRows} apiKeys={keyRows} /></div>;
}
