import { isHalloween, seasonalCopy } from "@/lib/seasonal-theme";
import MagicBento from "@/components/MagicBento";

const offers = [
  {
    title: seasonalCopy('They can find you', 'Don’t be a ghost in search'),
    description:
      "When someone in town searches for what you do, you show up. I keep checking that, not just on launch week.",
  },
  {
    title: seasonalCopy('They know who to call', 'Give customers a way in'),
    description:
      "Big phone number. Clear next step. Estimate, booking, or a tap-to-call. No scavenger hunt.",
  },
  {
    title: seasonalCopy('It looks like a real company', 'A killer first impression'),
    description:
      "The site should feel as solid as the work you do. Not a leftover page with your logo dropped in.",
  },
  {
    title: seasonalCopy("You don't have to touch it", 'We keep the gremlins out'),
    description:
      "I keep it fast, updated, and working. You stay on the job. The website keeps selling.",
  },
];

export default function AgencyServices() {
  return (
    <section id="services" className="hobro-white hobro-services">
      <div className="hobro-shell">
        <div className="hobro-offer-head">
          <p className="hobro-kicker">What you get</p>
          <h2>{seasonalCopy("A website that brings in work while you’re out doing the work.", "More customers at your door. Fewer skeletons in your website.")}</h2>
          <p>
            You should not have to think about the site. People find you, they
            trust you, they call you. I handle the rest.
          </p>
        </div>
        <MagicBento
          cards={offers}
          glowColor="245, 158, 11"
          enableSpotlight={!isHalloween}
          enableBorderGlow={!isHalloween}
        />
      </div>
    </section>
  );
}
