import "../marketing-interactions.css";
import "../site-chrome.css";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="site-chrome">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      <header className="sticky top-0 z-[90]">
        <Navbar />
      </header>
      <div>{children}</div>
      <CookieBanner />
      <Footer />
    </div>
  );
}
