import type { MetadataRoute } from "next";
import { listPublishedBlogPosts } from "@/lib/convex";

const baseUrl = "https://hexacombllc.com";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: "2026-11-01",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2026-11-01",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/how-it-works`,
      lastModified: "2026-11-01",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: "2026-11-01",
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/website-audit`,
      lastModified: "2026-11-01",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/human-rights`,
      lastModified: "2026-11-01",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: "2026-11-01",
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];
  staticPages.push({
    url: `${baseUrl}/work`,
    lastModified: "2026-11-01",
    changeFrequency: "monthly",
    priority: 0.9,
  });
  for (const path of [
    "/website-design",
    "/work/m5-painting",
    "/work/the-bug-dude",
  ]) {
    staticPages.push({
      url: `${baseUrl}${path}`,
      lastModified: "2026-11-01",
      changeFrequency: "monthly",
      priority: path === "/website-design" ? 0.9 : 0.7,
    });
  }
  let posts;
  try {
    posts = await listPublishedBlogPosts(100);
  } catch (error) {
    console.error("Sitemap published-post fetch failed:", error);
    // Keep public core pages discoverable during a temporary blog-service outage.
    return staticPages;
  }
  return [
    ...staticPages,
    ...posts.map((post) => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: new Date(post.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
