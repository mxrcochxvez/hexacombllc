import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { GoogleAnalytics } from "@next/third-parties/google";
import { Geologica, Instrument_Serif } from "next/font/google";
import "./brand.css";
import "./globals.css";
import "./hobro-agency.css";
import "../ui/space.theme.css";
import "../ui/kit.css";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import TrackClicks from "@/components/TrackClicks";
import UtmCapture from "@/components/UtmCapture";
import "./halloween.css";
import { SITE_THEME } from "@/lib/seasonal-theme";


const geologica = Geologica({
  variable: "--font-geologica",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const instrument = Instrument_Serif({
  variable: "--font-instrument",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

const siteUrl = "https://hexacombllc.com";
const sitePhone = "+1-559-492-7402";
const siteDescription =
  "Hexacomb LLC is a marketing agency focused on websites for Fresno and Clovis small businesses. Website design, local SEO, analytics, and ongoing care that help turn visitors into customers.";

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    { "@type": ["Organization", "ProfessionalService"], "@id": `${siteUrl}/#organization`, name: "Hexacomb LLC", url: siteUrl, logo: `${siteUrl}/hexacomb_logo_wordmark.png`, image: `${siteUrl}/hexacomb_logo_wordmark.png`, description: siteDescription, email: "marco@hexacombllc.com", telephone: sitePhone, founder: { "@id": `${siteUrl}/#marco` }, address: { "@type": "PostalAddress", addressLocality: "Clovis", addressRegion: "CA", addressCountry: "US" }, areaServed: ["Fresno, California", "Clovis, California", "California Central Valley"] },
    { "@type": "Person", "@id": `${siteUrl}/#marco`, name: "Marco Chavez", url: `${siteUrl}/about`, jobTitle: "Founder", worksFor: { "@id": `${siteUrl}/#organization` } },
    { "@type": "WebSite", "@id": `${siteUrl}/#website`, url: siteUrl, name: "Hexacomb", description: siteDescription, publisher: { "@id": `${siteUrl}/#organization` }, inLanguage: "en-US" }
  ]
};

export const viewport: Viewport = {
  themeColor: "#f3f1eb",
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
        width: 800,
        height: 800,
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
      data-season={SITE_THEME}
      className={`${geologica.variable} ${instrument.variable}`}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <CloudflareAnalytics token={process.env.CF_ANALYTICS_TOKEN} />
        <TrackClicks />
        <Suspense fallback={null}>
          <UtmCapture />
        </Suspense>
        {children}
        <GoogleAnalytics gaId="G-3JYGDR8ZVE" />
      </body>
    </html>
  );
}
