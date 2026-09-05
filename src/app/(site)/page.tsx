import type { Metadata } from "next";
import CauseNote from "@/components/CauseNote";
import CtaSection from "@/components/CtaSection";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import ServicesGrid from "@/components/ServicesGrid";
import WhyHexacomb from "@/components/WhyHexacomb";

const baseUrl = "https://hexacombllc.com";

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hexacomb: your ongoing website growth partner",
    description:
      "Website management, local SEO, analytics, and conversion copy for Fresno and Clovis small businesses.",
    url: baseUrl,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb: ongoing website growth for local businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: your ongoing website growth partner",
    description:
      "Website management, local SEO, analytics, and conversion copy for Fresno and Clovis small businesses.",
    images: ["/hexacomb_logo_wordmark.png"],
  },
};

export default function Home() {
  return (
    <main id="main-content">
      <HeroSection />
      <ServicesGrid />
      <WhyHexacomb />
      <ProcessSteps />
      <CauseNote />
      <CtaSection />
    </main>
  );
}
