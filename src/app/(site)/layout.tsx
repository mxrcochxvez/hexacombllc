import PromoBanner from "@/components/PromoBanner";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";

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
        <PromoBanner />
        <Navbar />
      </header>
      <main id="main-content">{children}</main>
      <CookieBanner />
      <Footer />
    </>
  );
}
