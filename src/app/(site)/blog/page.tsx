import type { Metadata } from "next";
import Link from "next/link";
import { listPublishedBlogPosts } from "@/lib/convex";

export const metadata: Metadata = {
  title: "Small business website advice",
  description: "Practical website, SEO, analytics, and conversion advice for Fresno, Clovis, and Central Valley small-business owners.",
  alternates: { canonical: "/blog" },
};
export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: Awaited<ReturnType<typeof listPublishedBlogPosts>> = [];
  try { posts = await listPublishedBlogPosts(100); } catch (error) { console.error("Public blog load failed:", error); }
  return <main id="main-content" className="blog-index"><div className="growth-shell"><header className="blog-index__header"><p className="growth-eyebrow">Practical guidance</p><h1>A better website, explained plainly.</h1><p>Useful ideas for small-business owners who want their website to earn more trust, calls, and customers.</p></header>{posts.length ? <div className="blog-grid">{posts.map((post) => <article className="blog-card" key={post._id}><div className="blog-card__meta"><time dateTime={new Date(post.publishedAt ?? post.createdAt).toISOString()}>{new Date(post.publishedAt ?? post.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>{post.tags[0] ? <span>{post.tags[0]}</span> : null}</div><h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2><p>{post.excerpt}</p><Link className="blog-card__link" href={`/blog/${post.slug}`}>Read article <span aria-hidden>→</span></Link></article>)}</div> : <div className="blog-empty"><h2>Good things are brewing.</h2><p>Our first practical website guide will be here soon.</p></div>}</div></main>;
}
