import type { Metadata } from "next";
import Link from "next/link";
import { AgencyPageHero } from "@/components/AgencyHero";
import CtaSection from "@/components/CtaSection";

export const metadata: Metadata = {
  title: "How It Works | Design, Launch, Then Monthly Care",
  description:
    "Unlimited design until it feels right, then search, your photos, and the domain. After launch, a monthly report and a conversation about what to change.",
  alternates: { canonical: "https://hexacombllc.com/how-it-works" },
};

type Chapter = {
  title: string;
  story: string;
  you?: string;
};

const build: Chapter[] = [
  {
    title: "We keep going until the design feels right.",
    story:
      "I send you looks. You say what is off. I change it. We do that as many times as it takes. Unlimited does not mean endless meetings. It means we do not stop at two rounds because a contract said so.",
    you: "Point at what feels wrong. You do not have to design anything.",
  },
  {
    title: "Then I set the site up so people can find you.",
    story:
      "Once the look is locked, I do the search work. Titles, headings, local details, the boring parts that help Google, maps, and AI answers send someone to you instead of a competitor.",
  },
  {
    title: "Then your photos go on.",
    story:
      "The pages are already agreed. Now they get your people, your work, and your place. Not stock that could be anyone's shop.",
    you: "Send the photos only you have. I place them.",
  },
  {
    title: "Then we point the new domain at the site.",
    story:
      "Your address stays yours. I point it at the new site so customers land on the real thing, not a leftover page or a temporary link.",
    you: "If someone else holds the domain login, introduce me once.",
  },
];

const launch = {
  title: "Then it's up.",
  story:
    "The project part is over. Customers can find the site, see the work, and take the next step. Care starts now.",
};

const care: Chapter[] = [
  {
    title: "I pull the report. We talk. I change what needs changing.",
    story:
      "Each month I look at search, AI answers, and generated results. People call that SEO, AEO, and GEO. If a page slipped, a listing looks wrong, or a competitor started showing up, we talk about it. Then I make the change. You do not get a PDF to decode on a Tuesday night.",
    you: "One conversation. I bring the findings.",
  },
];

function ChapterList({ chapters }: { chapters: Chapter[] }) {
  return (
    <div className="hobro-chapters">
      {chapters.map((chapter) => (
        <article key={chapter.title} className="hobro-chapter">
          <h3>{chapter.title}</h3>
          <div className="hobro-chapter-copy">
            <p>{chapter.story}</p>
            {chapter.you ? <p className="hobro-chapter-you">{chapter.you}</p> : null}
          </div>
        </article>
      ))}
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main id="main-content" className="hobro-page">
      <AgencyPageHero
        kicker="How it works"
        title="The design keeps going until you like it. Then the site goes live. Then we talk every month."
        lead={
          <>
            <p>
              You should not have to manage a website project. You react to the
              design. I do the rest, get it live, and then we look at the
              numbers together each month.
            </p>
            <p>
              Already have a site? We start at the step that is still
              unfinished.
            </p>
          </>
        }
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

      <section className="hobro-statement">
        <div className="hobro-shell">
          <h2>There is no round cap.</h2>
          <p>
            We launch when you are ready, not when a contract says two
            revisions.
          </p>
        </div>
      </section>

      <section className="hobro-white hobro-band" aria-labelledby="build-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Getting it live</p>
            <h2 id="build-heading">From first look to a live site.</h2>
            <p>
              Design first. Search next. Your photos after that. Then the
              domain. Then people can use it.
            </p>
          </div>
          <ChapterList chapters={build} />
        </div>
      </section>

      <section className="hobro-statement">
        <div className="hobro-shell">
          <h2>{launch.title}</h2>
          <p>{launch.story}</p>
        </div>
      </section>

      <section className="hobro-white hobro-band" aria-labelledby="care-heading">
        <div className="hobro-shell">
          <div className="hobro-offer-head">
            <p className="hobro-kicker">Keeping it working</p>
            <h2 id="care-heading">Every month, a report and a conversation.</h2>
            <p>Launch is not the last time we talk.</p>
          </div>
          <ChapterList chapters={care} />
        </div>
      </section>
      <CtaSection />
    </main>
  );
}
