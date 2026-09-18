import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import CtaSection from "@/components/CtaSection";
import { MarkdownContent } from "@/components/MarkdownContent";
import { getBlogCover, isUnoptimizedCover, stripLeadingCoverImage } from "@/lib/blogCover";
import { getPublishedBlogPost } from "@/lib/convex";
import "../blog-article.css";

export const dynamic = "force-dynamic";
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPublishedBlogPost(slug).catch(() => null);
  if (!post) return { title: "Post not found" };
  const cover = getBlogCover(post);
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt;
  const images = cover ? [{ url: cover.url }] : undefined;
  return {
    title,
    description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/blog/${post.slug}`,
      publishedTime: post.publishedAt ? new Date(post.publishedAt).toISOString() : undefined,
      authors: [post.author],
      tags: post.tags,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
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
    <main id="main-content" className="hobro-page">
      <article className="blog-article">
        <div className="blog-article__shell">
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }} />
          <p className="blog-article__kicker">
            <Link href="/blog">← All articles</Link>
          </p>
          <header className="blog-article__header">
            <div className="blog-article__meta">
              <time dateTime={published.toISOString()}>
                {published.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
              </time>
              <span>{post.author}</span>
            </div>
            <h1>{post.title}</h1>
            {post.excerpt ? <p className="blog-article__dek">{post.excerpt}</p> : null}
            {post.tags.length ? (
              <ul className="blog-tags" aria-label="Topics">
                {post.tags.map((tag) => <li key={tag}>{tag}</li>)}
              </ul>
            ) : null}
          </header>
          {cover ? (
            <figure className="blog-article__cover">
              {!isUnoptimizedCover(cover.url) ? (
                <Image
                  src={cover.url}
                  alt={cover.alt}
                  fill
                  priority
                  sizes="(max-width: 720px) 100vw, 42rem"
                  style={{ objectFit: "cover" }}
                />
              ) : (
                <img src={cover.url} alt={cover.alt} />
              )}
            </figure>
          ) : null}
          <MarkdownContent markdown={stripLeadingCoverImage(post.contentMarkdown)} />
        </div>
      </article>
      <CtaSection />
    </main>
  );
}
