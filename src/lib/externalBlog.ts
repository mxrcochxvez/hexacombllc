import { BLOG_URL } from "@/lib/blogNavigation";

const blogOrigin = new URL(BLOG_URL).origin;
const cacheSeconds = 60 * 60;

export type ExternalBlogPost = {
  title: string;
  description: string;
  url: string;
  imageUrl?: string;
  publishedAt?: string;
};

type SitemapEntry = { url: string; lastModified?: string };

function decodeEntities(value: string): string {
  return value.replace(/&(#x[0-9a-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (entity, code: string) => {
    const named: Record<string, string> = {
      amp: "&", quot: '"', apos: "'", lt: "<", gt: ">", nbsp: " ",
    };
    if (code[0] === "#") {
      const numeric = code[1]?.toLowerCase() === "x"
        ? parseInt(code.slice(2), 16)
        : parseInt(code.slice(1), 10);
      return Number.isFinite(numeric) && numeric > 0 && numeric <= 0x10ffff
        ? String.fromCodePoint(numeric)
        : entity;
    }
    return named[code.toLowerCase()] ?? entity;
  });
}

function cleanText(value: string): string {
  return decodeEntities(value.replace(/<[^>]*>/g, " ")).replace(/\s+/g, " ").trim();
}

function getMeta(html: string, key: string): string | undefined {
  for (const tag of html.match(/<meta\b[^>]*>/gi) ?? []) {
    const attributes = new Map<string, string>();
    for (const match of tag.matchAll(/([a-z_:][\w:.-]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
      attributes.set(match[1].toLowerCase(), match[2] ?? match[3] ?? match[4]);
    }
    if (
      attributes.get("property")?.toLowerCase() === key ||
      attributes.get("name")?.toLowerCase() === key
    ) {
      const value = attributes.get("content");
      if (value) return cleanText(value);
    }
  }
  return undefined;
}

function blogArticleUrl(value: string): string | undefined {
  try {
    const url = new URL(decodeEntities(value.trim()));
    if (url.origin !== blogOrigin || url.protocol !== "https:") return undefined;
    if (url.pathname === "/" || /^\/(?:page|category|tag|author|search|about|privacy|terms|sitemap|feed)(?:\/|$|\.)/i.test(url.pathname)) {
      return undefined;
    }
    if (url.pathname.endsWith(".xml") || url.pathname.endsWith(".txt")) return undefined;
    return url.origin + url.pathname.replace(/\/+$/, "") + url.search;
  } catch {
    return undefined;
  }
}

function readSitemapEntries(xml: string): SitemapEntry[] {
  const entries: SitemapEntry[] = [];
  for (const match of xml.matchAll(/<url\b[^>]*>([\s\S]*?)<\/url>/gi)) {
    const block = match[1];
    const loc = block.match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)?.[1];
    if (!loc) continue;
    const url = blogArticleUrl(loc);
    if (!url) continue;
    const lastModified = block.match(/<lastmod\b[^>]*>([\s\S]*?)<\/lastmod>/i)?.[1];
    entries.push({ url, lastModified: lastModified?.trim() });
  }
  // Sitemap lastmod is normally present; preserve original sitemap order if absent.
  return entries.sort((a, b) =>
    (Date.parse(b.lastModified ?? "") || 0) - (Date.parse(a.lastModified ?? "") || 0)
  );
}

async function fetchBlogPage(path: string): Promise<string> {
  // Only fetch this fixed, trusted origin; article URLs are validated above.
  const response = await fetch(new URL(path, blogOrigin), {
    next: { revalidate: cacheSeconds },
    signal: AbortSignal.timeout(5000),
    headers: { Accept: "text/html,application/xml;q=0.9,text/xml;q=0.8" },
  });
  if (!response.ok) throw new Error("Blog responded with HTTP " + response.status);
  return response.text();
}

async function getSitemapEntries(): Promise<SitemapEntry[]> {
  const sitemap = await fetchBlogPage("/sitemap.xml");
  const entries = readSitemapEntries(sitemap);
  if (entries.length) return entries;

  // Some hosts use a sitemap index with one or more child XML sitemaps.
  const childSitemaps = Array.from(
    sitemap.matchAll(/<sitemap\b[^>]*>([\s\S]*?)<\/sitemap>/gi),
    (match) => match[1].match(/<loc\b[^>]*>([\s\S]*?)<\/loc>/i)?.[1]
  ).filter((value): value is string => Boolean(value));

  const childResults = await Promise.allSettled(
    childSitemaps.slice(0, 3).map(async (value) => {
      const child = new URL(decodeEntities(value.trim()));
      if (child.origin !== blogOrigin || !child.pathname.endsWith(".xml")) return [];
      return readSitemapEntries(await fetchBlogPage(child.pathname + child.search));
    })
  );
  return childResults.flatMap((result) => result.status === "fulfilled" ? result.value : [])
    .sort((a, b) => (Date.parse(b.lastModified ?? "") || 0) - (Date.parse(a.lastModified ?? "") || 0));
}

function readArticle(html: string, entry: SitemapEntry): ExternalBlogPost | null {
  const h1 = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/i)?.[1];
  const pageTitle = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1];
  const title = getMeta(html, "og:title") ?? (h1 ? cleanText(h1) : undefined) ??
    (pageTitle ? cleanText(pageTitle) : undefined);
  if (!title) return null;

  const description = getMeta(html, "og:description") ?? getMeta(html, "description") ?? "";
  const imageValue = getMeta(html, "og:image");
  let imageUrl: string | undefined;
  if (imageValue) {
    try {
      const url = new URL(imageValue, blogOrigin);
      if (url.protocol === "https:") imageUrl = url.href;
    } catch {
      // Keep the text preview even if an article has an invalid image URL.
    }
  }

  const publishedAt = getMeta(html, "article:published_time") ??
    getMeta(html, "article:modified_time") ?? entry.lastModified;

  return { title, description, url: entry.url, imageUrl, publishedAt };
}

/** Public previews only; never reads or changes the legacy /blog CMS. */
export async function getLatestExternalBlogPosts(): Promise<ExternalBlogPost[]> {
  try {
    const entries = await getSitemapEntries();
    const unique = [...new Map(entries.map((entry) => [entry.url, entry])).values()];
    const results = await Promise.allSettled(
      unique.slice(0, 6).map(async (entry) => readArticle(await fetchBlogPage(entry.url), entry))
    );
    return results.flatMap((result) =>
      result.status === "fulfilled" && result.value ? [result.value] : []
    ).slice(0, 3);
  } catch (error) {
    console.warn("External blog previews are unavailable; keeping the blog link visible.", error);
    return [];
  }
}
