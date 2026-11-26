import "../marketing-interactions.css";
import "../site-chrome.css";
import "../premium.css";
import Navbar from "@/components/Navbar";
import CookieBanner from "@/components/CookieBanner";
import { isHalloween, isThanksgiving } from "@/lib/seasonal-theme";
import SeasonalAtmosphere from "@/components/SeasonalAtmosphere";
import ThanksgivingExperience, {
  ThanksgivingRibbon,
} from "@/components/ThanksgivingExperience";
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
        {isThanksgiving && <ThanksgivingRibbon />}
      </header>
      <div>{children}</div>
      {isHalloween && <SeasonalAtmosphere />}
      {isThanksgiving && <ThanksgivingExperience />}
      <CookieBanner />
      <Footer />
    </div>
  );
}
