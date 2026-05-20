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
    title: "Hexacomb: technology handled for local businesses",
    description:
      "Websites, software, AI, and IT for local business owners. Plain language, one team to call.",
    url: baseUrl,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb: technology handled for local businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: technology handled for local businesses",
    description:
      "Websites, software, AI, and IT for local business owners. Plain language, one team to call.",
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
          "Local technology partner for small businesses. Websites, custom software, AI automation, and IT support, explained in plain language.",
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
        name: "Hexacomb: local business technology made simple",
        description:
          "Hexacomb helps local businesses with web, software, AI, and IT. Clear guidance and practical delivery.",
        publisher: {
          "@id": "https://hexacombllc.com/#organization",
        },
      },
      {
        "@type": "WebPage",
        "@id": "https://hexacombllc.com/#webpage",
        url: "https://hexacombllc.com",
        name: "Hexacomb: local business technology made simple",
        description:
          "Technology partner for local businesses that want expert help without the jargon.",
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
