import { pageSocialMetadata } from "@/lib/seo";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyPageHero";
import CtaSection from "@/components/CtaSection";

const title = "About Marco Chavez — Clovis Web Designer";
const description =
  "Meet Marco Chavez, the Clovis and Fresno small-business web designer behind Hexacomb LLC. Direct communication, custom websites, local SEO, and ongoing care.";

export const metadata: Metadata = {
  ...pageSocialMetadata("/about", `${title} | Hexacomb`, description),
  title,
  description,
  alternates: { canonical: "https://hexacombllc.com/about" },
};

const aboutSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hexacombllc.com/" },
        { "@type": "ListItem", position: 2, name: "About", item: "https://hexacombllc.com/about" },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How long until launch?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most small-business sites launch in a few weeks. You get one clear first priority first, then steady improvements, never a six-month project.",
          },
        },
        {
          "@type": "Question",
          name: "What do you need from me?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "One conversation about your customers and goals, plus the photos and details only you know. I handle the build, the wording, and the technical side.",
          },
        },
        {
          "@type": "Question",
          name: "Do I own my domain and website?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Your domain stays yours and your content stays yours. Care plans have no annual lock-in.",
          },
        },
      ],
    },
  ],
};

const proof = [
  ["Based in Clovis", "My reputation lives in the same community as your business."],
  ["No account-manager relay", "You speak with the person reading the data and making the changes."],
  ["Built for real operations", "Years of engineering, accessibility, and performance work behind every decision."],
];

export default function AboutPage() {
  return (
    <main id="main-content" className="hobro-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }}
      />
      <AgencyPageHero
        kicker="About"
        title="Premium websites for the businesses doing the real work."
        lead="I’m Marco. I run a lean, website-focused agency in Clovis because local business owners deserve the same quality and attention as the big brands—without the agency layers."
        actions={
          <>
            <Link href="#contact" className="hobro-deck-btn hobro-deck-btn-solid">
              Talk to Marco
            </Link>
            <Link href="/work" className="hobro-text-link">
              See selected work
            </Link>
            <Link href="/website-audit" className="hobro-text-link">
              Run a free audit
            </Link>
          </>
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
            I believe in the independent businesses that keep our communities
            moving. You should be proud to send someone to your website, and
            you shouldn’t need a corporate marketing budget or a full-time
            marketing department to make that happen.
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
