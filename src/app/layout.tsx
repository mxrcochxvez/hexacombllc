import type { Metadata, Viewport } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Archivo_Black, Public_Sans } from "next/font/google";
import "./brand.css";
import "./globals.css";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import TrackClicks from "@/components/TrackClicks";

const archivoBlack = Archivo_Black({
  variable: "--font-archivo-black",
  subsets: ["latin"],
  weight: "400",
});

const publicSans = Public_Sans({
  variable: "--font-public-sans",
  subsets: ["latin"],
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
      areaServed: {
        "@type": "City",
        name: "Fresno",
        sameAs: "https://en.wikipedia.org/wiki/Fresno,_California",
      },
      knowsAbout: [
        "Website management",
        "Website optimization",
        "Search engine optimization",
        "Web analytics",
        "Conversion copywriting",
        "Local search marketing",
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
  themeColor: "#f6f7f3",
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
      className={`${archivoBlack.variable} ${publicSans.variable}`}
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
      <GoogleAnalytics gaId="G-3JYGDR8ZVE" />
    </html>
  );
}
