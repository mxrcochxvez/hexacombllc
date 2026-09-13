import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Atkinson_Hyperlegible, Geologica } from "next/font/google";
import "./brand.css";
import "./globals.css";
import "../ui/space.theme.css";
import "../ui/kit.css";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import TrackClicks from "@/components/TrackClicks";

const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const atkinson = Atkinson_Hyperlegible({
  variable: "--font-atkinson",
  subsets: ["latin"],
  weight: ["400", "700"],
});

const siteUrl = "https://hexacombllc.com";
const siteDescription =
  "Ongoing website management, local SEO, analytics, and conversion copy for Fresno and Clovis small businesses. One local partner focused on making your website work harder every month.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${siteUrl}/#organization`,
      name: "Hexacomb LLC",
      url: siteUrl,
      logo: `${siteUrl}/hexacomb_logo_wordmark.png`,
      description: siteDescription,
      foundingDate: "2025",
      areaServed: [
        {
          "@type": "City",
          name: "Fresno",
          sameAs: "https://en.wikipedia.org/wiki/Fresno,_California",
        },
        { "@type": "City", name: "Clovis" },
        { "@type": "AdministrativeArea", name: "California Central Valley" },
      ],
      knowsAbout: [
        "Website management",
        "Website optimization",
        "Search engine optimization",
        "Web analytics",
        "Conversion copywriting",
        "Local search marketing",
        "Nonprofit websites",
        "Human rights organization websites",
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        areaServed: ["US-CA"],
        availableLanguage: ["English"],
      },
    },
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#localbusiness`,
      name: "Hexacomb LLC",
      url: siteUrl,
      image: `${siteUrl}/hexacomb_logo_wordmark.png`,
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
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hexacomb: ongoing website growth for local businesses",
      description: siteDescription,
      publisher: { "@id": `${siteUrl}/#organization` },
      inLanguage: "en-US",
    },
    {
      "@type": "ProfessionalService",
      "@id": `${siteUrl}/#service`,
      name: "Hexacomb LLC",
      url: siteUrl,
      image: `${siteUrl}/hexacomb_logo_wordmark.png`,
      description: siteDescription,
      priceRange: "$$",
      areaServed: ["Fresno, CA", "Clovis, CA", "Central Valley, CA"],
      provider: { "@id": `${siteUrl}/#organization` },
      serviceType: [
        "Ongoing website management",
        "Search engine optimization",
        "Website analytics",
        "Conversion copywriting",
        "Website design and development",
      ],
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "#080910",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hexacomb: your ongoing website growth partner",
    template: "%s | Hexacomb",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "website management",
    "Fresno",
    "Clovis",
    "Central Valley",
    "website optimization",
    "conversion copywriting",
    "web analytics",
    "SEO",
    "small business",
    "local business",
    "nonprofit website",
    "human rights organization website",
  ],
  authors: [{ name: "Hexacomb LLC", url: siteUrl }],
  creator: "Hexacomb LLC",
  publisher: "Hexacomb LLC",
  category: "Web Development",
  applicationName: "Hexacomb",
  appleWebApp: {
    capable: true,
    title: "Hexacomb",
    statusBarStyle: "default",
  },
  manifest: "/manifest.json",
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteUrl,
    siteName: "Hexacomb",
    title: "Hexacomb: your ongoing website growth partner",
    description: siteDescription,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb: ongoing website growth for Fresno and Clovis small businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: your ongoing website growth partner",
    description: siteDescription,
    images: ["/hexacomb_logo_wordmark.png"],
  },
  formatDetection: {
    telephone: true,
    date: false,
    address: false,
    email: true,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geologica.variable} ${atkinson.variable}`}
    >
      <body>
        {/*
          THESIS: Continuous website ownership keeps the search→site→call flow open—not a static brochure site.
          OWN-WORLD: Irrigation Canal Blueprint — sun-bleached concrete canvas, canal-teal surfaces, blueprint navy ink, citrus sluice-gate CTAs, condensed Geologica + Atkinson.
          STORY: Visitor feels neglect as a dry field, believes Hexacomb keeps care flowing, starts a conversation.
          FIRST VIEWPORT: Hero-scale HEXACOMB title block left, cycling local outcomes, one citrus CTA, live flow diagram right.
          FORM: Irrigation Canal Blueprint (grounded #3, seed 5fa491f1).
          FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, and DESIGN.md
        */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CloudflareAnalytics token={process.env.CF_ANALYTICS_TOKEN} />
        <TrackClicks />
        {children}
      </body>
      <GoogleAnalytics gaId="G-3JYGDR8ZVE" />
    </html>
  );
}
