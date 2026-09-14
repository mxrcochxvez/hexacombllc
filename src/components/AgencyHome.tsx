import AgencyHero, { AgencyIntro } from "@/components/AgencyHero";
import AgencyServices from "@/components/AgencyServices";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import AgencyVision from "@/components/AgencyVision";
import AgencyContact from "@/components/AgencyContact";
import CauseNote from "@/components/CauseNote";

export default function AgencyHome() {
  return (
    <main id="main-content" className="hobro-page">
      <AgencyHero />
      <AgencyIntro />
      <AgencyServices />
      <PortfolioShowcase />
      <AgencyVision />
      <AgencyContact />
      <div className="hobro-cause">
        <CauseNote />
      </div>
    </main>
  );
}
