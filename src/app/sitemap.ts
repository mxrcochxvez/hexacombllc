import { MetadataRoute } from "next";

const baseUrl = "https://hexacombllc.com";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: baseUrl,
      lastModified: "2025-04-01",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: "2025-04-01",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: "2025-04-25",
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
