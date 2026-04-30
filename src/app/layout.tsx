import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans, JetBrains_Mono, Nunito_Sans } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import CloudflareAnalytics from "@/components/CloudflareAnalytics";
import TrackClicks from "@/components/TrackClicks";
import CookieBanner from "@/components/CookieBanner";
import CustomCursor from "@/components/CustomCursor";
import DeviceTilt from "@/components/DeviceTilt";
import Footer from "@/components/Footer";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500"],
});

const jetBrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

const nunitoSans = Nunito_Sans({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#1a0e05",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://hexacombllc.com"),
  title: {
    default: "Hexacomb — Websites for Fresno & Clovis Small Businesses",
    template: "%s | Hexacomb",
  },
  description:
    "Custom websites for Fresno and Clovis small businesses — built fast by a local developer you can actually call. No templates, no jargon.",
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
    statusBarStyle: "black-translucent",
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
    title:
      "Hexacomb — Websites for Fresno & Clovis Small Businesses",
    description:
      "Custom websites for Fresno and Clovis small businesses — built fast by a local developer you can actually call. No templates, no jargon.",
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb — Websites for Fresno & Clovis Small Businesses",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Hexacomb — Websites for Fresno & Clovis Small Businesses",
    description:
      "Custom websites for Fresno and Clovis small businesses — built fast by a local developer you can actually call. No templates, no jargon.",
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
      className={`${dmSans.variable} ${nunitoSans.variable} ${bricolage.variable} ${jetBrainsMono.variable}`}
    >
      <body>
        <svg className="grain-svg" aria-hidden focusable="false">
          <filter id="grain">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.85"
              numOctaves="3"
              stitchTiles="stitch"
            />
          </filter>
        </svg>
        <CloudflareAnalytics token={process.env.CF_ANALYTICS_TOKEN} />
        <TrackClicks />
        <CustomCursor />
        <Navbar />

        <DeviceTilt>
          {children}
        </DeviceTilt>

        <CookieBanner />
        <Footer />
      </body>
    </html>
  );
}
