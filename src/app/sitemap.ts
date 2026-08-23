import type { MetadataRoute } from "next";
import { listPublishedBlogPosts } from "@/lib/convex";

const baseUrl = "https://hexacombllc.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-08-04",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-08-02",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: "2026-08-04",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: "2026-08-02",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/website-audit`,
      lastModified: "2026-08-02",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: "2026-08-23",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
  try {
    const posts = await listPublishedBlogPosts(100);
    return [...staticPages, ...posts.map((post) => ({ url: `${baseUrl}/blog/${post.slug}`, lastModified: new Date(post.updatedAt), changeFrequency: "monthly" as const, priority: 0.7 }))];
  } catch {
    return staticPages;
  }
}
