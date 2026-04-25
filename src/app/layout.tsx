import type { Metadata } from "next";
import Link from "next/link";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hexacombllc.com"),
  title: {
    default: "Hexacomb — Modern Websites for the Central Valley | Built Fast",
    template: "%s | Hexacomb",
  },
  description:
    "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast. No templates — pure hand-coded quality.",
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
  alternates: {
    canonical: "https://hexacombllc.com",
  },
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
      "Hexacomb — Modern Websites for the Central Valley | Built Fast",
    description:
      "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast.",
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb — Modern Websites for the Central Valley",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Hexacomb — Modern Websites for the Central Valley | Built Fast",
    description:
      "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast.",
    images: ["/hexacomb_logo_wordmark.png"],
  },
  formatDetection: {
    telephone: false,
    date: false,
    address: false,
    email: false,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/hexacomb_logo_transparent.png",
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
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        {/* Shared Header */}
        <header className="site-header" role="banner">
          <div className="container">
            <Link href="/" className="logo" aria-label="Hexacomb Home">
              <span className="logo-hex" aria-hidden />
              Hexacomb
            </Link>
            <nav className="header-nav" aria-label="Main navigation">
              <Link href="/about">About</Link>
              <Link href="/#contact" className="header-cta">
                Apply for Early-Adopter Rate
              </Link>
            </nav>
          </div>
        </header>

        {children}

        {/* Shared Footer */}
        <footer className="site-footer" role="contentinfo">
          <div className="container">
            <p>
              <span className="logo-hex" aria-hidden />{" "}
              <strong>Hexacomb</strong> — Modern Websites for the Central
              Valley
            </p>
            <p style={{ marginTop: 8 }}>
              &copy; {new Date().getFullYear()} Hexacomb LLC. All rights
              reserved.
            </p>
            <p style={{ marginTop: 6, fontSize: "0.75rem", opacity: 0.5 }}>
              Photo by{" "}
              <a
                href="https://unsplash.com/@ghpvisuals?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                rel="noopener noreferrer"
                target="_blank"
                style={{ color: "inherit" }}
              >
                Grant Porter
              </a>{" "}
              on{" "}
              <a
                href="https://unsplash.com/photos/birds-eye-view-of-skyscrapers-Mx71xeQOev8?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
                rel="noopener noreferrer"
                target="_blank"
                style={{ color: "inherit" }}
              >
                Unsplash
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
