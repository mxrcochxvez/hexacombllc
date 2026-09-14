import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";

const pageUrl = "https://hexacombllc.com/human-rights";
const pageTitle = "Websites for Human Rights Organizations and Nonprofits";
const pageDescription =
  "Marco at Hexacomb builds websites for human rights organizations and nonprofits — so the people behind the work have a face, a story, and a clear way for others to help.";

export const metadata: Metadata = {
  title: pageTitle,
  description: pageDescription,
  keywords: [
    "websites for human rights organizations",
    "nonprofit website",
    "human rights nonprofit website",
    "nonprofit web design",
    "advocacy website",
    "Clovis",
    "Fresno",
  ],
  alternates: { canonical: pageUrl },
  openGraph: {
    title: pageTitle,
    description: pageDescription,
    url: pageUrl,
    type: "website",
    images: [
      {
        url: "/hexacomb_logo_wordmark.png",
        width: 1200,
        height: 630,
        alt: "Hexacomb: websites for human rights organizations and nonprofits",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: pageTitle,
    description: pageDescription,
    images: ["/hexacomb_logo_wordmark.png"],
  },
};

const faces = [
  [
    "FACE",
    "People, not a brochure",
    "Names, photographs, and stories so a visitor meets the humans in the work — the people you serve and the people doing the serving.",
  ],
  [
    "FOUND",
    "So the right people can find you",
    "Search, language, and pages that match how someone actually looks for help, a way to stand with you, or a place to give.",
  ],
  [
    "CLEAR",
    "A next step that is obvious",
    "Donate, volunteer, report, or contact — without a scavenger hunt. Accessible on a phone, in plain language.",
  ],
];

const together = [
  [
    "I listen first",
    "Your mission, your people, and what the current website is failing to say. No pitch deck. A conversation.",
  ],
  [
    "Then the site gets a face",
    "Structure, copy, and photography that treat visitors like humans. The cause should feel present on the first screen.",
  ],
  [
    "Then it stays cared for",
    "Updates, accessibility, and the quiet technical work so the site does not go stale while you are doing the real work.",
  ],
];

const faqs = [
  {
    q: "Who is this page for?",
    a: "Human rights organizations, advocacy groups, and nonprofits that need a website worthy of the people they serve. If your current site looks like a leftover template, this is for you.",
  },
  {
    q: "Do I have to be in Fresno or Clovis?",
    a: "No. I am based in Clovis, California. I work with local groups and with organizations anywhere that need a serious website.",
  },
  {
    q: "Is this a free program?",
    a: "No. It is website work: honest scope, clear communication, no lock-in. If you run a small organization, we will talk about what you can actually sustain — I will not sell you a site you cannot keep.",
  },
  {
    q: "What does \"a face\" mean?",
    a: "A visitor should meet the humans in the work instead of a wall of mission statements. The site should make the stakes feel real, and make it easy to help.",
  },
];

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${pageUrl}#webpage`,
      url: pageUrl,
      name: pageTitle,
      description: pageDescription,
      isPartOf: { "@id": "https://hexacombllc.com/#website" },
      about: [
        "Human rights organizations",
        "Nonprofit websites",
        "Advocacy websites",
      ],
      inLanguage: "en-US",
    },
    {
      "@type": "Service",
      "@id": `${pageUrl}#service`,
      name: "Websites for human rights organizations and nonprofits",
      serviceType: "Nonprofit and human rights website design and care",
      provider: { "@id": "https://hexacombllc.com/#organization" },
      areaServed: ["United States", "Fresno, CA", "Clovis, CA"],
      description: pageDescription,
      url: pageUrl,
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: faqs.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://hexacombllc.com",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Human rights",
          item: pageUrl,
        },
      ],
    },
  ],
};

export default function HumanRightsPage() {
  return (
    <main id="main-content" className="hobro-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
        }}
      />

      <AgencyPageHero
        kicker="Nonprofit & causes"
        title="Your cause deserves a face."
        lead="I build websites for human rights organizations and nonprofits. Not as a side product. Because this work matters to me, and a website should let people see the humans behind the mission."
        actions={
          <>
            <Link
              href="#contact"
              className="hobro-deck-btn hobro-deck-btn-solid"
              data-track="human_rights_talk"
            >
              Talk about your website
            </Link>
            <Link href="/about" className="hobro-text-link">
              Meet Marco
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
          <h2>A template is not a voice.</h2>
          <p>
            Organizations fighting for dignity, safety, and justice often get
            stuck with a leftover brochure site. Visitors cannot tell who you
            are, what is at stake, or how to help. The work is urgent. The
            website should feel that way: clear, human, and easy to trust.
          </p>
        </div>
      </section>

      <section className="hobro-white hobro-band">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">What the site must do</p>
            <h2>What a human rights website should do.</h2>
          </div>
          <div className="hobro-offer-table">
            {faces.map(([code, title, body]) => (
              <article key={code}>
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
            <p className="hobro-kicker">Working together</p>
            <h2>How we work together.</h2>
          </div>
          <div className="hobro-offer-table">
            {together.map(([title, body]) => (
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
            <p className="hobro-kicker">FAQ</p>
            <h2>Straight answers for organizations.</h2>
          </div>
          <div className="hobro-faq">
            {faqs.map((item) => (
              <div className="hobro-faq-static" key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
          <div className="hobro-close-note">
            <div>
              <strong>If you run a human rights organization or nonprofit, I want to hear from you.</strong>
              <p>Tell me what you are fighting for. We will talk about the website from there.</p>
            </div>
            <Link href="#contact" className="hobro-deck-btn" data-track="human_rights_close">
              Start the conversation
            </Link>
          </div>
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
