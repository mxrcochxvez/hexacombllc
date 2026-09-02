import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getBlogCover, stripLeadingCoverImage, useUnoptimizedCover } from "@/lib/blogCover";
import { getPublishedBlogPost } from "@/lib/convex";
import { Button } from "@/ui";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) return { title: "Post not found" };
  const cover = getBlogCover(post);
  const images = cover ? [{ url: cover.url }] : undefined;
  return {
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
      tags: post.tags,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) notFound();
  const published = new Date(post.publishedAt ?? post.createdAt);
  const cover = getBlogCover(post);
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription || post.excerpt,
    image: cover?.url || undefined,
    datePublished: published.toISOString(),
    dateModified: new Date(post.updatedAt).toISOString(),
    author: { "@type": "Organization", name: post.author },
    publisher: { "@type": "Organization", name: "Hexacomb LLC", url: "https://hexacombllc.com" },
    mainEntityOfPage: `https://hexacombllc.com/blog/${post.slug}`,
  };
  return (
    <main id="main-content">
      <article className="blog-post">
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
        <header className={cover ? "blog-post__header blog-post__header--with-image" : "blog-post__header"}>
          <div>
            <Link href="/blog" className="blog-back">← All articles</Link>
            <div className="blog-card__meta">
              <time dateTime={published.toISOString()}>{published.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}</time>
              <span>{post.author}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.excerpt}</p>
            {post.tags.length ? (
              <ul className="blog-tags" aria-label="Topics">
                {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            ) : null}
          </div>
          {cover ? (
            <figure className="blog-post__cover">
              {!useUnoptimizedCover(cover.url) ? (
                <Image src={cover.url} alt={cover.alt} fill sizes="(max-width: 700px) 100vw, 320px" style={{ objectFit: "cover" }} />
              ) : (
                <img src={cover.url} alt={cover.alt} />
              )}
            </figure>
          ) : null}
        </header>
        <MarkdownContent markdown={stripLeadingCoverImage(post.contentMarkdown)} />
        <footer className="growth-inline-close">
          <div>
            <Check size={20} aria-hidden />
            <strong>Want the website off your plate?</strong>
            <p>We keep it updated, findable, and clear for the people ready to become customers.</p>
          </div>
          <Button href="/#contact" intent="signal">
            Talk with Hexacomb <ArrowUpRight size={17} aria-hidden />
          </Button>
        </footer>
      </article>
    </main>
  );
}
