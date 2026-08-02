import type { Metadata, Viewport } from "next";
import { Libre_Franklin, Literata } from "next/font/google";
import "./brand.css";
import "./globals.css";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import TrackClicks from "@/components/TrackClicks";

const libreFranklin = Libre_Franklin({
  variable: "--font-libre-franklin",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const literata = Literata({
  variable: "--font-literata",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = "https://hexacombllc.com";
const siteDescription =
  "Websites, software, and IT for Fresno and Clovis small businesses. Built fast by a local developer you can actually call. No templates, no jargon.";

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
      areaServed: [
        { "@type": "City", name: "Fresno" },
        { "@type": "City", name: "Clovis" },
        { "@type": "AdministrativeArea", name: "California Central Valley" },
      ],
      knowsAbout: [
        "Web development",
        "Web design",
        "Custom software development",
        "Search engine optimization",
        "Web accessibility",
        "Small business technology",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${siteUrl}/#website`,
      url: siteUrl,
      name: "Hexacomb",
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
        "Website design and development",
        "Custom software development",
        "IT consulting",
        "Website accessibility",
        "Search engine optimization",
      ],
    },
  ],
};

export const viewport: Viewport = {
  themeColor: "oklch(98.5% 0.008 75)",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Hexacomb: websites and tech for Fresno & Clovis small businesses",
    template: "%s | Hexacomb",
  },
  description: siteDescription,
  alternates: {
    canonical: "/",
  },
  keywords: [
    "web development",
    "Fresno",
    "Clovis",
    "Central Valley",
    "custom websites",
    "web design",
    "SEO",
    "accessibility",
    "WCAG",
    "modern websites",
    "small business",
    "local business",
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
    title: "Hexacomb: websites and tech for Fresno & Clovis small businesses",
    description: siteDescription,
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb: technology for Fresno and Clovis small businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hexacomb: websites and tech for Fresno & Clovis small businesses",
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
      className={`${libreFranklin.variable} ${literata.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CloudflareAnalytics token={process.env.CF_ANALYTICS_TOKEN} />
        <TrackClicks />
        {children}
      </body>
    </html>
  );
}
