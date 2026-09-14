import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "About Marco | Your Website Partner",
  description: "Meet Marco, the Fresno-area partner who manages, measures, and grows small-business websites.",
  alternates: { canonical: "https://hexacombllc.com/about" },
};

const proof = [
  ["Based in Clovis", "My reputation lives in the same community as your business."],
  ["No account-manager relay", "You speak with the person reading the data and making the changes."],
  ["Built for real operations", "Years of engineering, accessibility, and performance work behind every decision."],
];

export default function AboutPage() {
  return (
    <main id="main-content" className="hobro-page">
      <AgencyPageHero
        kicker="About"
        title="Your website should be owned by someone who knows your business."
        lead="I'm Marco. I run Hexacomb so business owners can stop carrying the website in the back of their minds."
        actions={
          <Link href="#contact" className="hobro-deck-btn hobro-deck-btn-solid">
            Talk to Marco
          </Link>
        }
        aside={
          <div className="hobro-photo">
            <Image
              src="/images/marco-portrait.jpg"
              alt="Marco Chavez, founder of Hexacomb"
              fill
              priority
              sizes="(max-width: 900px) 100vw, 42vw"
            />
            <span>Clovis, CA</span>
          </div>
        }
      />

      <section className="hobro-statement">
        <div className="hobro-shell">
          <h2>A website is too important to be everybody&rsquo;s side job.</h2>
          <p>
            Owners should not spend Tuesday night updating services, deciphering
            traffic reports, or wondering why competitors outrank them. That
            ongoing responsibility is the business.
          </p>
        </div>
      </section>

      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Why this works</p>
            <h2>Close to the work. Clear about the why.</h2>
          </div>
          <div className="hobro-offer-table">
            {proof.map(([title, body]) => (
              <article key={title}>
                <h3>{title}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="hobro-white hobro-band" aria-labelledby="hiring-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Working together</p>
            <h2 id="hiring-heading">What hiring me looks like.</h2>
          </div>
          <div className="hobro-faq">
            <details name="about-hire-faq" open>
              <summary>How long until launch?</summary>
              <p>
                Most small-business sites launch in a few weeks. You get one
                clear first priority first, then steady improvements, never a
                six-month project.
              </p>
            </details>
            <details name="about-hire-faq">
              <summary>What do you need from me?</summary>
              <p>
                One conversation about your customers and goals, plus the photos
                and details only you know. I handle the build, the wording, and
                the technical side.
              </p>
            </details>
            <details name="about-hire-faq">
              <summary>Do I own my domain and website?</summary>
              <p>
                Yes. Your domain stays yours and your content stays yours. Care
                plans have no annual lock-in.
              </p>
            </details>
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
