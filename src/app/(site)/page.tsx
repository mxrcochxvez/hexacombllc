import type { Metadata } from "next";
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://hexacombllc.com/#organization",
        name: "Hexacomb LLC",
        url: "https://hexacombllc.com",
        logo: "https://hexacombllc.com/hexacomb_logo_wordmark.png",
        description:
          "Ongoing website growth partner for small businesses. Website management, local SEO, analytics, and conversion copy in plain language.",
        foundingDate: "2025",
        areaServed: {
          "@type": "City",
          name: "Fresno",
          sameAs: "https://en.wikipedia.org/wiki/Fresno,_California",
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "sales",
          areaServed: ["US-CA"],
          availableLanguage: ["English"],
        },
      },
      {
        "@type": "LocalBusiness",
        "@id": "https://hexacombllc.com/#localbusiness",
        name: "Hexacomb LLC",
        url: "https://hexacombllc.com",
        image: "https://hexacombllc.com/hexacomb_logo_wordmark.png",
        description:
          "Local website growth partner serving Fresno, Clovis, and Central Valley businesses.",
        areaServed: {
          "@type": "GeoCircle",
          geoMidpoint: {
            "@type": "GeoCoordinates",
            latitude: 36.7378,
            longitude: -119.7871,
          },
          geoRadius: "100000",
        },
        address: {
          "@type": "PostalAddress",
          addressLocality: "Fresno",
          addressRegion: "CA",
          addressCountry: "US",
        },
        priceRange: "$$",
      },
      {
        "@type": "WebSite",
        "@id": "https://hexacombllc.com/#website",
        url: "https://hexacombllc.com",
        name: "Hexacomb: ongoing website growth for local businesses",
        description:
          "Hexacomb manages websites, SEO, analytics, and conversion copy for local businesses.",
        publisher: {
          "@id": "https://hexacombllc.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://hexacombllc.com/#webpage",
        url: "https://hexacombllc.com",
        name: "Hexacomb: ongoing website growth for local businesses",
        description:
          "A website partner for local businesses that want continuous improvement without the jargon.",
        isPartOf: {
          "@id": "https://hexacombllc.com/#website",
        },
        about: {
          "@id": "https://hexacombllc.com/#organization",
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <HeroSection />
        <ServicesGrid />
        <WhyHexacomb />
        <ProcessSteps />
        <CtaSection />
      </main>
    </>
  );
}
