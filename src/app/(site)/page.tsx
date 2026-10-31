import type { Metadata } from "next";
import AgencyHome from "@/components/AgencyHome";

const baseUrl = "https://hexacombllc.com";

export const metadata: Metadata = {
  title: "Hexacomb: Website-Focused Marketing Agency | Fresno & Clovis, CA",
  description:
    "Hexacomb is a marketing agency focused on websites, local SEO, and turning more visitors into customers. Based in Fresno & Clovis, California.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hexacomb: Website-Focused Marketing Agency",
    description:
      "Website-focused marketing agency building high-converting websites and stronger local visibility in California's Central Valley.",
    url: baseUrl,
    images: [
      {
        url: "/images/fresno_satellite_dark.jpg",
        width: 1200,
        height: 630,
        alt: "Hexacomb: website-focused marketing agency",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: Website-Focused Marketing Agency",
    description:
      "Website-focused marketing agency building high-converting websites and stronger local visibility in California's Central Valley.",
    images: ["/images/fresno_satellite_dark.jpg"],
  },
};

export default function Home() {
  return <AgencyHome />;
}
