import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export const dynamic = "force-dynamic";

type AuditStatus = "good" | "warning" | "bad";

interface AuditCheck {
  label: string;
  status: AuditStatus;
  message: string;
}

interface AuditSection {
  score: number;
  summary: string;
  checks: AuditCheck[];
}

interface AiBinding {
  run(
    model: string,
    input: {
      messages: Array<{ role: "system" | "user"; content: string }>;
      max_tokens?: number;
      temperature?: number;
    }
  ): Promise<unknown>;
}

declare global {
  interface CloudflareEnv {
    AI?: AiBinding;
  }
}

const MAX_HTML_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 8_000;
const RECOMMENDATION_MODEL = "@cf/meta/llama-3.1-8b-instruct";

function isBlockedHostname(hostname: string) {
  const host = hostname.toLowerCase();
  if (
    host === "localhost" ||
    host.endsWith(".localhost") ||
    host === "0.0.0.0" ||
    host === "::1"
  ) {
    return true;
  }

  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (!ipv4Match) return false;

  const parts = ipv4Match.slice(1).map(Number);
  if (parts.some((part) => part < 0 || part > 255)) return true;

  const [a, b] = parts;
  return (
    a === 10 ||
    a === 127 ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168) ||
    (a === 169 && b === 254)
  );
}

function normalizeAuditUrl(rawUrl: unknown) {
  if (!rawUrl || typeof rawUrl !== "string") {
    throw new Error("Enter a public website URL.");
  }

  const withProtocol = /^https?:\/\//i.test(rawUrl.trim())
    ? rawUrl.trim()
    : `https://${rawUrl.trim()}`;
  const url = new URL(withProtocol);

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error("The URL must start with http:// or https://.");
  }

  if (isBlockedHostname(url.hostname)) {
    throw new Error("Enter a public business website, not a local or private address.");
  }

  url.hash = "";
  return url;
}

function getTagContent(html: string, pattern: RegExp) {
  return html.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() ?? "";
}

function countMatches(html: string, pattern: RegExp) {
  return html.match(pattern)?.length ?? 0;
}

function stripTags(value: string) {
  return value.replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();
}

function scoreFromChecks(checks: AuditCheck[]) {
  const points = checks.reduce((total, check) => {
    if (check.status === "good") return total + 1;
    if (check.status === "warning") return total + 0.5;
    return total;
  }, 0);

  return Math.round((points / checks.length) * 100);
}

async function readLimitedText(response: Response) {
  if (!response.body) return response.text();

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let received = 0;
  let text = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_HTML_BYTES) {
      await reader.cancel();
      break;
    }
    text += decoder.decode(value, { stream: true });
  }

  text += decoder.decode();
  return text;
}

function summarize(score: number, good: string, warning: string, bad: string) {
  if (score >= 80) return good;
  if (score >= 55) return warning;
  return bad;
}

type Priority = {
  title: string;
  why: string;
  ifYouWait: string;
  owner: "you" | "hexacomb";
};

function hasTelLink(html: string) {
  return /href=["']tel:/i.test(html);
}

function hasMailLink(html: string) {
  return /href=["']mailto:/i.test(html);
}

function hasForm(html: string) {
  return /<form\b/i.test(html);
}

function hasContactPath(html: string) {
  return /href=["'][^"']*(contact|book|schedule|quote|appointment)[^"']*["']/i.test(html);
}

function buildPriorities(args: {
  overall: number;
  title: string;
  description: string;
  checks: AuditCheck[];
}): Priority[] {
  const byLabel = new Map(args.checks.map((check) => [check.label, check]));
  const catalog: Array<{ label: string; title: string; why: string; ifYouWait: string; owner: Priority["owner"] }> = [
    {
      label: "Search visibility",
      title: "Google may be told not to show this page",
      why: "If the page is blocked from search, new customers will not find you even when they type your name.",
      ifYouWait: "You keep paying for a site that search engines are asked to ignore.",
      owner: "hexacomb",
    },
    {
      label: "Secure connection",
      title: "The browser may warn people before they read a word",
      why: "A security warning feels like a scam. Most people leave.",
      ifYouWait: "You lose the visit before your offer has a chance.",
      owner: "hexacomb",
    },
    {
      label: "Google result title",
      title: "Your Google listing does not name the business clearly",
      why: "That line is the first sales pitch. If it is missing or sloppy, the competitor underneath you gets the tap.",
      ifYouWait: "You show up looking unfinished next to businesses who wrote a real title.",
      owner: "hexacomb",
    },
    {
      label: "Search description",
      title: "Google has no short pitch to show under your name",
      why: "If you do not write the sentence under the blue link, Google invents one. It is rarely the sentence that gets a call.",
      ifYouWait: "People skip you because they cannot tell what you do.",
      owner: "hexacomb",
    },
    {
      label: "Click-to-call",
      title: "A phone visitor cannot tap to call",
      why: "On a phone, the easiest next step is a tap. If the number is not a link, many people will not bother.",
      ifYouWait: "You make the hottest leads work for it.",
      owner: "you",
    },
    {
      label: "First response",
      title: "The page feels late before it even appears",
      why: "People decide in a couple of seconds whether this looks like a real business. Delay reads as neglect.",
      ifYouWait: "Phone visitors bounce and call the next listing.",
      owner: "hexacomb",
    },
    {
      label: "Main page headline",
      title: "The first headline does not say what you do",
      why: "A stranger should know the offer in one line. If they have to hunt, they leave.",
      ifYouWait: "The site stays a brochure instead of a door.",
      owner: "you",
    },
    {
      label: "A way to reach you",
      title: "There is no obvious way to get in touch",
      why: "If there is no form, email, or contact page on the first page, the visit dead-ends.",
      ifYouWait: "People screenshot the page and forget to follow up.",
      owner: "you",
    },
  ];

  const picked: Priority[] = [];
  for (const item of catalog) {
    const check = byLabel.get(item.label);
    if (!check || check.status === "good") continue;
    picked.push({
      title: item.title,
      why: item.why,
      ifYouWait: item.ifYouWait,
      owner: item.owner,
    });
    if (picked.length === 3) break;
  }

  if (picked.length === 0) {
    picked.push({
      title: "The basics are in place. The next gain is conversion.",
      why: "Search, speed, and trust look decent from this first pass. The work now is making the page ask for the call more clearly.",
      ifYouWait: "A fine website stays average while a sharper one takes the inquiry.",
      owner: "hexacomb",
    });
  }

  return picked;
}

function buildShareText(args: {
  hostname: string;
  overall: number;
  headline: string;
  previewTitle: string;
  priorities: Priority[];
}) {
  const week = args.priorities
    .map((item, index) => `${index + 1}. ${item.title} (${item.owner === "you" ? "you can start" : "we would handle"})`)
    .join("\n");
  return `Hexacomb first-pass for ${args.hostname}\nScore: ${args.overall} / 100\n${args.headline}\nGoogle title shown: ${args.previewTitle}\n\nFix first:\n${week}\n\nThis is a first look at one public page, not a full crawl.`;
}

function analyzeSite(url: URL, html: string, loadMs: number, status: number) {
  const title = getTagContent(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = getTagContent(
    html,
    /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i
  );
  const h1Count = countMatches(html, /<h1\b[^>]*>/gi);
  const firstH1 = stripTags(getTagContent(html, /<h1[^>]*>([\s\S]*?)<\/h1>/i));
  const canonical = /<link[^>]+rel=["']canonical["'][^>]*>/i.test(html);
  const viewport = /<meta[^>]+name=["']viewport["'][^>]*>/i.test(html);
  const structuredData = /<script[^>]+type=["']application\/ld\+json["'][^>]*>/i.test(html);
  const ogTitle = /<meta[^>]+property=["']og:title["'][^>]*>/i.test(html);
  const imgTags = html.match(/<img\b[^>]*>/gi) ?? [];
  const missingAlt = imgTags.filter((img) => !/\balt=["'][^"']*["']/i.test(img)).length;
  const hasRobotsBlock = /<meta[^>]+name=["']robots["'][^>]+content=["'][^"']*(noindex|nofollow)/i.test(html);
  const htmlBytes = new TextEncoder().encode(html).length;
  const mixedContent = url.protocol === "https:" && /\b(?:src|href)=["']http:\/\//i.test(html);

  const seoChecks: AuditCheck[] = [
    title
      ? {
          label: "Google result title",
          status: title.length > 65 ? "warning" : "good",
          message:
            title.length > 65
              ? "The page has a title, but it may be too long for search results."
              : "The page has a clear title for search results.",
        }
      : {
          label: "Google result title",
          status: "bad",
          message: "The page is missing the title Google usually shows first.",
        },
    description
      ? {
          label: "Search description",
          status: description.length < 70 || description.length > 170 ? "warning" : "good",
          message:
            description.length < 70 || description.length > 170
              ? "The search description exists, but it may not sell the business clearly."
              : "The page has a search description that can help customers choose you.",
        }
      : {
          label: "Search description",
          status: "bad",
          message: "The page is missing the short sales pitch people see on Google.",
        },
    h1Count === 1 && firstH1
      ? {
          label: "Main page headline",
          status: "good",
          message: `The page has one main headline: "${firstH1.slice(0, 80)}${firstH1.length > 80 ? "..." : ""}"`,
        }
      : {
          label: "Main page headline",
          status: h1Count === 0 ? "bad" : "warning",
          message:
            h1Count === 0
              ? "The page is missing a main headline, which makes the message harder for Google and customers to understand."
              : "The page has multiple main headlines. That can dilute the page's message.",
        },
    canonical
      ? {
          label: "Preferred page address",
          status: "good",
          message: "The page tells search engines which URL is the official version.",
        }
      : {
          label: "Preferred page address",
          status: "warning",
          message: "The page does not declare its preferred URL, which can split search value across duplicates.",
        },
    structuredData
      ? {
          label: "Business context for Google",
          status: "good",
          message: "Structured data is present, which can help search engines understand the business.",
        }
      : {
          label: "Business context for Google",
          status: "warning",
          message: "No structured data was detected. Local businesses often miss this easy credibility signal.",
        },
  ];

  const speedChecks: AuditCheck[] = [
    {
      label: "First response",
      status: loadMs < 900 ? "good" : loadMs < 1800 ? "warning" : "bad",
      message:
        loadMs < 900
          ? `The server responded quickly in ${loadMs}ms.`
          : loadMs < 1800
            ? `The server took ${loadMs}ms to respond. Customers may feel a slight delay.`
            : `The server took ${loadMs}ms to respond. That can feel slow before the page even appears.`,
    },
    {
      label: "Page size",
      status: htmlBytes < 250_000 ? "good" : htmlBytes < 700_000 ? "warning" : "bad",
      message:
        htmlBytes < 250_000
          ? "The initial page download is lean."
          : htmlBytes < 700_000
            ? "The initial page download is a bit heavy before images and scripts are counted."
            : "The initial page download is heavy, which can hurt people on phones.",
    },
    viewport
      ? {
          label: "Mobile layout signal",
          status: "good",
          message: "The page includes the basic mobile layout setting browsers expect.",
        }
      : {
          label: "Mobile layout signal",
          status: "bad",
          message: "The page is missing the mobile viewport setting, a common cause of broken phone layouts.",
        },
  ];

  const issueChecks: AuditCheck[] = [
    status >= 200 && status < 400
      ? {
          label: "Page availability",
          status: "good",
          message: `The page returned a healthy ${status} status.`,
        }
      : {
          label: "Page availability",
          status: "bad",
          message: `The page returned status ${status}. Some customers or search engines may not reach it correctly.`,
        },
    url.protocol === "https:"
      ? {
          label: "Secure connection",
          status: "good",
          message: "The page uses HTTPS, so visitors see a secure connection.",
        }
      : {
          label: "Secure connection",
          status: "bad",
          message: "The page does not use HTTPS. That damages trust immediately.",
        },
    mixedContent
      ? {
          label: "Mixed security",
          status: "warning",
          message: "The page appears to load some insecure assets, which can cause browser warnings or broken content.",
        }
      : {
          label: "Mixed security",
          status: "good",
          message: "No obvious insecure asset links were found on the page.",
        },
    imgTags.length === 0 || missingAlt === 0
      ? {
          label: "Image descriptions",
          status: "good",
          message:
            imgTags.length === 0
              ? "No image tags were detected on the initial page."
              : "Images include alt text, which helps accessibility and search context.",
        }
      : {
          label: "Image descriptions",
          status: missingAlt > 3 ? "bad" : "warning",
          message: `${missingAlt} image${missingAlt === 1 ? "" : "s"} appear to be missing alt text, which can exclude customers using assistive tools.`,
        },
    hasRobotsBlock
      ? {
          label: "Search visibility",
          status: "bad",
          message: "This page appears to tell search engines not to index or follow it.",
        }
      : {
          label: "Search visibility",
          status: "good",
          message: "No obvious noindex/nofollow block was detected.",
        },
    ogTitle
      ? {
          label: "Share preview",
          status: "good",
          message: "The page has social sharing metadata for a better preview.",
        }
      : {
          label: "Share preview",
          status: "warning",
          message: "The page may look weak when shared by text, email, or social apps.",
        },
    hasTelLink(html)
      ? {
          label: "Click-to-call",
          status: "good",
          message: "A visitor on a phone can tap a number to call.",
        }
      : {
          label: "Click-to-call",
          status: "warning",
          message: "No tap-to-call number showed up on this page. Phone visitors have to copy a number by hand.",
        },
    hasForm(html) || hasMailLink(html) || hasContactPath(html)
      ? {
          label: "A way to reach you",
          status: "good",
          message: hasForm(html)
            ? "There is a form on this page, so a visitor can ask for help without hunting."
            : "There is an email or contact path on this page.",
        }
      : {
          label: "A way to reach you",
          status: "bad",
          message: "This page does not show a form, email link, or contact page. A stranger has no next step.",
        },
  ];

  const seoScore = scoreFromChecks(seoChecks);
  const speedScore = scoreFromChecks(speedChecks);
  const issueScore = scoreFromChecks(issueChecks);
  const overall = Math.round((seoScore + speedScore + issueScore) / 3);
  const allChecks = [...seoChecks, ...speedChecks, ...issueChecks];
  const firstParagraph = stripTags(getTagContent(html, /<p[^>]*>([\s\S]*?)<\/p>/i));
  const siteName =
    getTagContent(html, /<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']*)["'][^>]*>/i) ||
    url.hostname.replace(/^www\./, "");
  const snippetSource = description || firstParagraph;
  const previewTitle = title || siteName;
  const previewDescription = snippetSource
    ? snippetSource.length > 157
      ? `${snippetSource.slice(0, 157).trimEnd()}...`
      : snippetSource
    : "No description on the page. Google will pull a random sentence instead.";
  const headline =
    overall >= 80
      ? "The basics work. The next job is getting more of these visits to turn into calls."
      : overall >= 55
        ? "Customers can reach the site, but it is making them work too hard."
        : "This site is asking customers to trust a page that still looks unfinished.";
  const priorities = buildPriorities({
    overall,
    title,
    description,
    checks: allChecks,
  });

  return {
    url: url.toString(),
    finalUrl: url.toString(),
    scannedAt: new Date().toISOString(),
    overall,
    headline,
    preview: {
      title: previewTitle,
      description: previewDescription,
      displayUrl: url.hostname.replace(/^www\./, ""),
      siteName,
      href: `${url.protocol}//${url.hostname}${url.pathname === "/" ? "" : url.pathname}`,
    },
    priorities,
    shareText: buildShareText({
      hostname: url.hostname.replace(/^www\./, ""),
      overall,
      headline,
      previewTitle,
      priorities,
    }),
    sections: {
      seo: {
        score: seoScore,
        summary: summarize(
          seoScore,
          "Search engines can understand the basics.",
          "Google can read parts of the site, but the sales message is weaker than it should be.",
          "The site is missing search basics that help customers find and trust the business."
        ),
        checks: seoChecks,
      } satisfies AuditSection,
      speed: {
        score: speedScore,
        summary: summarize(
          speedScore,
          "The first page response looks fast enough for most visitors.",
          "Speed is acceptable, but there are signs the experience could feel slow on mobile.",
          "The first impression may feel slow, especially for customers on phones."
        ),
        checks: speedChecks,
      } satisfies AuditSection,
      issues: {
        score: issueScore,
        summary: summarize(
          issueScore,
          "No major surface-level issues stood out in this first scan.",
          "The site has a few credibility and accessibility issues worth fixing.",
          "The site has visible trust, access, or search-blocking problems."
        ),
        checks: issueChecks,
      } satisfies AuditSection,
    },
  };
}

function extractAiText(response: unknown) {
  if (!response || typeof response !== "object") return "";

  const record = response as Record<string, unknown>;
  const value = record.response ?? record.result ?? record.text;

  return typeof value === "string" ? value.trim() : "";
}

function parseRecommendations(text: string) {
  return text
    .split(/\n+/)
    .map((line) =>
      line
        .replace(/^\s*(?:[-*•]|\d+[.)])\s*/, "")
        .replace(/\*\*/g, "")
        .trim()
    )
    .filter((line) => !/^based on\b/i.test(line))
    .filter(Boolean)
    .slice(0, 4);
}

async function getAiRecommendations(audit: ReturnType<typeof analyzeSite>) {
  try {
    const { env } = getCloudflareContext();
    if (!env.AI) return undefined;

    const findings = Object.entries(audit.sections)
      .map(([sectionName, section]) => {
        const weakChecks = section.checks
          .filter((check) => check.status !== "good")
          .map((check) => `${check.label}: ${check.message}`)
          .join("; ");
        return `${sectionName.toUpperCase()} score ${section.score}: ${section.summary}${weakChecks ? ` Weak spots: ${weakChecks}` : ""}`;
      })
      .join("\n");

    const response = await env.AI.run(RECOMMENDATION_MODEL, {
      temperature: 0.2,
      max_tokens: 260,
      messages: [
        {
          role: "system",
          content:
            "You write concise website improvement recommendations for small business CEOs. Avoid jargon. Focus on business impact and practical next steps. Return only 3 or 4 bullet lines.",
        },
        {
          role: "user",
          content: `Website: ${audit.finalUrl}\nOverall score: ${audit.overall}\nFindings:\n${findings}`,
        },
      ],
    });

    const recommendations = parseRecommendations(extractAiText(response));
    return recommendations.length > 0 ? recommendations : undefined;
  } catch (err) {
    console.warn("AI audit recommendations unavailable:", err);
    return undefined;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as { url?: unknown };
    const url = normalizeAuditUrl(body.url);
    const start = Date.now();

    const response = await fetch(url, {
      redirect: "follow",
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: {
        "User-Agent": "HexacombWebsiteAudit/1.0 (+https://hexacombllc.com)",
        Accept: "text/html,application/xhtml+xml",
      },
    });

    const loadMs = Date.now() - start;
    const contentType = response.headers.get("content-type") ?? "";

    if (!contentType.includes("text/html") && !contentType.includes("application/xhtml")) {
      return NextResponse.json(
        { error: "That URL did not return a web page we can audit." },
        { status: 400 }
      );
    }

    const finalUrl = new URL(response.url || url.toString());
    const html = await readLimitedText(response);
    const audit = analyzeSite(finalUrl, html, loadMs, response.status);
    const recommendations = await getAiRecommendations(audit);

    return NextResponse.json({ ...audit, recommendations });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.name === "TimeoutError"
          ? "The site took too long to respond. That is already a customer experience problem."
          : err.message
        : "We could not audit that site. Please check the URL and try again.";

    return NextResponse.json({ error: message }, { status: 400 });
  }
}
