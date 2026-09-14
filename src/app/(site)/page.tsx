import type { Metadata } from "next";
import AgencyHome from "@/components/AgencyHome";

const baseUrl = "https://hexacombllc.com";

export const metadata: Metadata = {
  title: "Hexacomb: Design-First Digital Studio | Fresno & Clovis, CA",
  description:
    "Hexacomb designs and builds standout digital experiences, high-converting websites, and brand systems for growing businesses. Based in Fresno & Clovis, California.",
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hexacomb: Design-First Digital Studio",
    description:
      "Full-cycle digital studio crafting high-converting websites, brand systems, and performance digital products in California's Central Valley.",
    url: baseUrl,
    images: [
      {
        url: "/images/fresno_satellite_dark.jpg",
        width: 1200,
        height: 630,
        alt: "Hexacomb: design-first full-cycle digital studio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: Design-First Digital Studio",
    description:
      "Full-cycle digital studio crafting high-converting websites, brand systems, and performance digital products in California's Central Valley.",
    images: ["/images/fresno_satellite_dark.jpg"],
  },
};

export default function Home() {
  return <AgencyHome />;
}
