import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import { BLOG_URL } from "@/lib/blogNavigation";
import { getLatestExternalBlogPosts } from "@/lib/externalBlog";
import "./BlogPreview.css";

function BlogHeading() {
  return (
    <div className="premium-blog-heading">
      <div>
        <p className="premium-eyebrow">THE BLOG</p>
        <h2 id="blog-preview-title">Good ideas. <em>Better websites.</em></h2>
        <p className="premium-blog-intro">
          Plain-English thoughts on websites, visibility, and growing a business online.
        </p>
      </div>
      <Link className="premium-text-link" href={BLOG_URL}>
        Explore the blog <ArrowIcon />
      </Link>
    </div>
  );
}

export function BlogPreviewFallback() {
  return (
    <section className="premium-blog premium-section" aria-labelledby="blog-preview-title">
      <div className="premium-shell">
        <BlogHeading />
        <p className="premium-blog-empty">
          Our latest articles live on the blog. Stop by for practical ideas you can put to work.
        </p>
      </div>
    </section>
  );
}

export default async function BlogPreview() {
  const posts = await getLatestExternalBlogPosts();
  if (!posts.length) return <BlogPreviewFallback />;

  return (
    <section className="premium-blog premium-section" aria-labelledby="blog-preview-title">
      <div className="premium-shell">
        <BlogHeading />
        <div className="premium-blog-grid">
          {posts.map((post) => {
            const date = post.publishedAt ? new Date(post.publishedAt) : null;
            const hasDate = date && !Number.isNaN(date.getTime());
            return (
              <article className="premium-blog-article" key={post.url}>
                <Link href={post.url} className="premium-blog-image-link" tabIndex={-1} aria-hidden="true">
                  {post.imageUrl ? (
                    <Image
                      src={post.imageUrl}
                      alt=""
                      width={720}
                      height={480}
                      sizes="(max-width: 720px) 100vw, (max-width: 1050px) 50vw, 33vw"
                      unoptimized
                    />
                  ) : (
                    <span className="premium-blog-image-placeholder" aria-hidden="true">H /</span>
                  )}
                </Link>
                <div className="premium-blog-article-body">
                  <p className="premium-blog-meta">
                    {hasDate ? <time dateTime={date.toISOString()}>{date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</time> : "HEXACOMB JOURNAL"}
                  </p>
                  <h3><Link href={post.url}>{post.title}</Link></h3>
                  {post.description ? <p className="premium-blog-excerpt">{post.description}</p> : null}
                  <Link className="premium-text-link" href={post.url}>
                    Read article <ArrowIcon />
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
