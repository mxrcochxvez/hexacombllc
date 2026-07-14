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

export const viewport: Viewport = {
  themeColor: "oklch(98.5% 0.008 75)",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hexacombllc.com"),
  title: {
    default: "Hexacomb: websites and tech for Fresno & Clovis small businesses",
    template: "%s | Hexacomb",
  },
  description:
    "Websites, software, and IT for Fresno and Clovis small businesses. Built fast by a local developer you can actually call. No templates, no jargon.",
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
  authors: [{ name: "Hexacomb LLC" }],
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
    url: "https://hexacombllc.com",
    siteName: "Hexacomb",
    title: "Hexacomb: websites and tech for Fresno & Clovis small businesses",
    description:
      "Websites, software, and IT for Fresno and Clovis small businesses. Built fast by a local developer you can actually call. No templates, no jargon.",
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
    description:
      "Websites, software, and IT for Fresno and Clovis small businesses. Built fast by a local developer you can actually call. No templates, no jargon.",
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
        <CloudflareAnalytics token={process.env.CF_ANALYTICS_TOKEN} />
        <TrackClicks />
        {children}
      </body>
    </html>
  );
}
