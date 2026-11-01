import type { Metadata } from "next";
import { pageSocialMetadata } from "@/lib/seo";
import PortfolioShowcase from "@/components/PortfolioShowcase";
import AgencyContact from "@/components/AgencyContact";
export const metadata: Metadata = {
  title: "Website design portfolio",
  description:
    "Explore websites by Hexacomb for AAC Painters, Ruiz Family Enterprises, Unreelviews, The Bug Dude Fresno and M5 Painting.",
  alternates: { canonical: "/work" },
  ...pageSocialMetadata(
    "/work",
    "Website design portfolio | Hexacomb",
    "Real websites for Central Valley businesses. Browse the work and visit each project.",
  ),
};
export default function WorkPage() {
  return (
    <main id="main-content" className="hobro-page premium-work">
      <div className="premium-shell premium-work-intro">
        <p className="premium-eyebrow">SELECTED WORK</p>
        <h1>
          Real businesses.
          <br />
          <em>Thoughtfully built websites.</em>
        </h1>
        <p>
          Explore the projects. Open the websites. See the details for yourself.
        </p>
      </div>
      <PortfolioShowcase />
      <AgencyContact />
    </main>
  );
}
