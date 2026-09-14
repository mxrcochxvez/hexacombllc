import type { Metadata } from "next";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "How It Works | Website Care Made Simple",
  description: "Hexacomb keeps your website updated, helps customers find you, and makes practical improvements every month.",
  alternates: { canonical: "https://hexacombllc.com/how-it-works" },
};

const loop = [
  ["Take care of it.", "Updates, upkeep, speed, and the technical details stay handled behind the scenes."],
  ["Understand it.", "We look at how people find you, what helps them stay, and where they decide to reach out."],
  ["Improve it.", "The next update is chosen with purpose, then made on the website, not left on a report."],
];

const onboarding = [
  ["We learn about your business", "Your customers, goals, current website, and what you want it to do better.", "You get one clear first priority and a plain-English plan. (Week 1)"],
  ["We build or fix what matters most", "The live site or fix you can show customers. Wording, pages, and next step included.", "You get something shippable, not a status report. (Weeks 2–3)"],
  ["We keep improving", "Each check-in helps decide the next useful update.", "You get monthly updates and a partner watching the numbers. (Ongoing)"],
];

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="hobro-page">
      <AgencyPageHero
        kicker="How it works"
        title="You have a business to run. We keep the website handled."
        lead="We learn what matters to your business, take responsibility for the website, and keep making practical improvements without making you manage another project."
        actions={
          <>
            <Link href="#contact" className="hobro-deck-btn hobro-deck-btn-solid">
              Talk about your website
            </Link>
            <Link href="/pricing" className="hobro-text-link">
              See plans
            </Link>
          </>
        }
      />

      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">The loop</p>
            <h2>Take care of it. Understand it. Improve it.</h2>
          </div>
          <div className="hobro-offer-table">
            {loop.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Getting started</p>
            <h2>A simple start, then steady support.</h2>
          </div>
          <div className="hobro-offer-table">
            {onboarding.map(([title, body, result]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
                <p>{result}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
