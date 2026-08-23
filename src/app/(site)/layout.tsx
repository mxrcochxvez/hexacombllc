import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import SiteMotion from "@/components/SiteMotion";
import SiteSignalDecorations from "@/components/SiteSignalDecorations";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-[90]">
        <Navbar />
      </header>
      <SiteMotion />
      <SiteSignalDecorations />
      <div>{children}</div>
      <CookieBanner />
      <Footer />
    </>
  );
}
