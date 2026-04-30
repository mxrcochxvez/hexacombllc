import type { Metadata } from "next";
import CtaSection from "@/components/CtaSection";
import HeroSection from "@/components/HeroSection";
import ProcessSteps from "@/components/ProcessSteps";
import ServicesGrid from "@/components/ServicesGrid";
import TrustBar from "@/components/TrustBar";
import WhyHexacomb from "@/components/WhyHexacomb";

const baseUrl = "https://hexacombllc.com";

export const metadata: Metadata = {
  alternates: {
    canonical: baseUrl,
  },
  openGraph: {
    title: "Hexacomb — Software, Web, AI & IT for Local Businesses",
    description:
      "Hexacomb helps local business owners modernize websites, software, AI workflows, and IT without the jargon.",
    url: baseUrl,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb — Software, Web, AI & IT for Local Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb — Software, Web, AI & IT for Local Businesses",
    description:
      "Hexacomb helps local business owners modernize websites, software, AI workflows, and IT without the jargon.",
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
          "Boutique software and technology firm helping local businesses with web design, custom software, AI automation, and IT modernization.",
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
          "Local software and technology partner serving Fresno, Clovis, and Central Valley businesses.",
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
        name: "Hexacomb — Local Business Technology Made Simple",
        description:
          "Hexacomb helps local businesses modernize web, software, AI, and IT with clear guidance and practical delivery.",
        publisher: {
          "@id": "https://hexacombllc.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://hexacombllc.com/#webpage",
        url: "https://hexacombllc.com",
        name: "Hexacomb — Local Business Technology Made Simple",
        description:
          "Boutique software and technology support for local businesses that want expert help without jargon.",
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
      <main id="main-content" className="brand-home">
        <HeroSection />
        <TrustBar />
        <ServicesGrid />
        <WhyHexacomb />
        <ProcessSteps />
        <CtaSection />
      </main>
    </>
  );
}
