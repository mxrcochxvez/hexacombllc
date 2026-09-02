"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export type BlogPostEditorValue = {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  contentMarkdown: string;
  status: "draft" | "published";
  author: string;
  tags: string[];
  metaTitle?: string;
  metaDescription?: string;
  coverImageUrl?: string;
  coverImageAlt?: string;
};

const emptyPost: BlogPostEditorValue = {
  title: "",
  slug: "",
  excerpt: "",
  contentMarkdown: "",
  status: "draft",
  author: "Hexacomb",
  tags: [],
};

export function BlogPostEditor({ initialPost }: { initialPost?: BlogPostEditorValue }) {
  const router = useRouter();
  const [post, setPost] = useState(initialPost ?? emptyPost);
  const [tagsText, setTagsText] = useState((initialPost?.tags ?? []).join(", "));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  function setField<K extends keyof BlogPostEditorValue>(field: K, value: BlogPostEditorValue[K]) {
    setPost((current) => ({ ...current, [field]: value }));
  }

  async function save(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const endpoint = post._id ? `/api/dashboard/blog/${post._id}` : "/api/dashboard/blog";
      const response = await fetch(endpoint, {
        method: post._id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...post,
          tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean),
        }),
      });
      const data = (await response.json()) as { error?: string; postId?: string };
      if (!response.ok) throw new Error(data.error || "Could not save the post.");
      router.push(data.postId ? `/dashboard/blog/${data.postId}` : "/dashboard/blog");
      router.refresh();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : "Could not save the post.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className="dash-card blog-editor" onSubmit={(event) => void save(event)}>
      <div className="dash-grid">
        <div className="form-group">
          <label htmlFor="blogTitle">Title</label>
          <input id="blogTitle" required value={post.title} onChange={(event) => setField("title", event.target.value)} disabled={pending} />
        </div>
        <div className="form-group">
          <label htmlFor="blogSlug">URL slug</label>
          <input id="blogSlug" value={post.slug} placeholder="Generated from the title" onChange={(event) => setField("slug", event.target.value)} disabled={pending} />
        </div>
        <div className="form-group">
          <label htmlFor="blogAuthor">Author</label>
          <input id="blogAuthor" value={post.author} onChange={(event) => setField("author", event.target.value)} disabled={pending} />
        </div>
        <div className="form-group">
          <label htmlFor="blogStatus">Status</label>
          <select id="blogStatus" value={post.status} onChange={(event) => setField("status", event.target.value as "draft" | "published")} disabled={pending}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="blogExcerpt">Excerpt</label>
        <textarea id="blogExcerpt" rows={3} required value={post.excerpt} onChange={(event) => setField("excerpt", event.target.value)} disabled={pending} />
        <small>One or two sentences shown on the blog page.</small>
      </div>
      <div className="dash-grid">
        <div className="form-group">
          <label htmlFor="blogCover">Cover image URL</label>
          <input id="blogCover" value={post.coverImageUrl ?? ""} placeholder="/images/blog/your-post.jpg" onChange={(event) => setField("coverImageUrl", event.target.value)} disabled={pending} />
          <small>Shown to the right of the excerpt on the blog index.</small>
        </div>
        <div className="form-group">
          <label htmlFor="blogCoverAlt">Cover image alt text</label>
          <input id="blogCoverAlt" value={post.coverImageAlt ?? ""} onChange={(event) => setField("coverImageAlt", event.target.value)} disabled={pending} />
        </div>
      </div>
      <div className="form-group">
        <label htmlFor="blogContent">Post content (Markdown)</label>
        <textarea id="blogContent" className="blog-editor__content" rows={22} required value={post.contentMarkdown} onChange={(event) => setField("contentMarkdown", event.target.value)} disabled={pending} spellCheck />
        <small>Supports headings, paragraphs, links, lists, quotes, bold, italic, and code.</small>
      </div>
      <div className="form-group">
        <label htmlFor="blogTags">Tags</label>
        <input id="blogTags" value={tagsText} placeholder="SEO, websites, small business" onChange={(event) => setTagsText(event.target.value)} disabled={pending} />
      </div>
      <div className="dash-grid">
        <div className="form-group">
          <label htmlFor="blogMetaTitle">SEO title (optional)</label>
          <input id="blogMetaTitle" value={post.metaTitle ?? ""} onChange={(event) => setField("metaTitle", event.target.value)} disabled={pending} />
        </div>
        <div className="form-group">
          <label htmlFor="blogMetaDescription">SEO description (optional)</label>
          <textarea id="blogMetaDescription" rows={2} value={post.metaDescription ?? ""} onChange={(event) => setField("metaDescription", event.target.value)} disabled={pending} />
        </div>
      </div>
      {error ? <p className="field-error" role="alert">{error}</p> : null}
      <div className="dash-actions mt-6">
        <button className="btn btn-primary" type="submit" disabled={pending}>{pending ? "Saving…" : post._id ? "Save changes" : "Create post"}</button>
        <button className="btn btn-secondary" type="button" onClick={() => router.push("/dashboard/blog")} disabled={pending}>Cancel</button>
      </div>
    </form>
  );
}
