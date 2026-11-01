import type { Metadata } from "next";

const siteUrl = "https://hexacombllc.com";

/** Route-specific share cards. Dimensions match the checked-in brand artwork. */
export function pageSocialMetadata(path: string, title: string, description: string): Pick<Metadata, "openGraph" | "twitter"> {
  return {
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: "Hexacomb",
      url: `${siteUrl}${path}`,
      title,
      description,
      images: [{ url: "/hexacomb_logo_wordmark.png", width: 800, height: 800, alt: "Hexacomb LLC" }],
    },
    twitter: { card: "summary", title, description, images: ["/hexacomb_logo_wordmark.png"] },
  };
}

export const privatePageRobots: Metadata["robots"] = {
  index: false,
  follow: false,
  googleBot: { index: false, follow: false },
};
