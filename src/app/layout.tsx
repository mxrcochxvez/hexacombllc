import type { Metadata } from "next";
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
  title:
    "Hexacomb — Modern Websites for the Central Valley | Built Fast",
  description:
    "Hexacomb modernizes local businesses in Fresno, Clovis, and the Central Valley with custom, high-performance websites delivered lightning fast. No templates — pure hand-coded quality.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${fraunces.variable}`}>
        {children}
      </body>
    </html>
  );
}
