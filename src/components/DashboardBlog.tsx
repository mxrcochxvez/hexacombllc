"use client";

import Link from "next/link";
import { useState } from "react";
import { BlogApiKeyManager } from "@/components/BlogApiKeyManager";
import { BlogPostEditor } from "@/components/BlogPostEditor";
import { DashboardNav } from "@/components/DashboardNav";

type PostRow = { _id: string; title: string; slug: string; status: "draft" | "published"; updatedAt: number; publishedAt?: number };
type KeyRow = { _id: string; name: string; keyPrefix: string; canPublish: boolean; createdAt: number; lastUsedAt?: number; revokedAt?: number };

export function DashboardBlog({ posts, apiKeys }: { posts: PostRow[]; apiKeys: KeyRow[] }) {
  const [creating, setCreating] = useState(false);
  return (
    <div className="dash-shell">
      <DashboardNav title="Blog" subtitle="Write posts yourself or give an AI agent tightly scoped access." />
      <div className="dash-actions mb-6"><button className="btn btn-primary" type="button" onClick={() => setCreating((value) => !value)}>{creating ? "Close editor" : "New post"}</button><Link className="btn btn-secondary" href="/blog" target="_blank">View public blog</Link></div>
      {creating ? <div className="mb-8"><BlogPostEditor /></div> : null}
      {posts.length ? (
        <div className="dash-table-wrap"><table className="dash-table"><thead><tr><th>Post</th><th>Status</th><th>Updated</th><th>Public link</th></tr></thead><tbody>{posts.map((post) => <tr key={post._id}><td><Link href={`/dashboard/blog/${post._id}`}>{post.title}</Link><div className="dash-muted">/{post.slug}</div></td><td><span className={`blog-status blog-status--${post.status}`}>{post.status}</span></td><td>{new Date(post.updatedAt).toLocaleDateString()}</td><td>{post.status === "published" ? <Link href={`/blog/${post.slug}`} target="_blank">Open</Link> : "—"}</td></tr>)}</tbody></table></div>
      ) : <p className="dash-muted">No posts yet. Create one here, or generate an API key and ask your agent to draft the first one.</p>}
      <BlogApiKeyManager apiKeys={apiKeys} />
    </div>
  );
}
