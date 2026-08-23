import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getPublishedBlogPost } from "@/lib/convex";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) return { title: "Post not found" };
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: { type: "article", title: post.metaTitle || post.title, description: post.metaDescription || post.excerpt, url: `/blog/${post.slug}`, publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined, authors: [post.author], tags: post.tags },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) notFound();
  const published = new Date(post.publishedAt ?? post.createdAt);
  const structuredData = { "@context": "https://schema.org", "@type": "BlogPosting", headline: post.title, description: post.metaDescription || post.excerpt, datePublished: published.toISOString(), dateModified: new Date(post.updatedAt).toISOString(), author: { "@type": "Organization", name: post.author }, publisher: { "@type": "Organization", name: "Hexacomb LLC", url: "https://hexacombllc.com" }, mainEntityOfPage: `https://hexacombllc.com/blog/${post.slug}` };
  return <main id="main-content"><article className="blog-post"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} /><header className="blog-post__header"><Link href="/blog" className="blog-back">← All articles</Link><div className="blog-card__meta"><time dateTime={published.toISOString()}>{published.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time><span>{post.author}</span></div><h1>{post.title}</h1><p>{post.excerpt}</p>{post.tags.length ? <ul className="blog-tags" aria-label="Topics">{post.tags.map((tag) => <li key={tag}>{tag}</li>)}</ul> : null}</header><MarkdownContent markdown={post.contentMarkdown} /><footer className="blog-post__footer"><p>Want your website to work harder without adding more to your plate?</p><Link className="btn btn-primary" href="/#contact">Talk with Hexacomb</Link></footer></article></main>;
}
