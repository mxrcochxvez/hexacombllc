import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AgencyContact from "@/components/AgencyContact";
import { pageSocialMetadata } from "@/lib/seo";

const title = "Website Design for Fresno & Clovis Businesses";
const description =
  "Work directly with Marco Chavez in Clovis on website design, copy, development and ongoing care. Explore local projects and discuss the right scope for your business.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/website-design" },
  ...pageSocialMetadata("/website-design", `${title} | Hexacomb`, description),
};
const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://hexacombllc.com/#website-design",
      name: "Website design and development",
      serviceType: "Small-business website design",
      description,
      url: "https://hexacombllc.com/website-design",
      provider: { "@id": "https://hexacombllc.com/#organization" },
      areaServed: [
        { "@type": "City", name: "Fresno" },
        { "@type": "City", name: "Clovis" },
        "California Central Valley",
      ],
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: "https://hexacombllc.com/",
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Website design",
          item: "https://hexacombllc.com/website-design",
        },
      ],
    },
  ],
};
const scope = [
  [
    "A clear story, not just a new look.",
    "Your services, service area and next step need to make sense to a first-time visitor. I help organize the pages and write copy around what your customers actually need to know.",
  ],
  [
    "A design that works on a phone.",
    "Layouts, project images, navigation and contact paths are built for small screens as well as desktop. The point is to help someone understand the business and take the next step without hunting for it.",
  ],
  [
    "Search foundations in the build.",
    "Descriptive page titles, useful headings, crawlable links and clear business information are part of the work. Structured data should describe what is actually on the page, not make claims the business cannot support.",
  ],
  [
    "A plan for what happens after launch.",
    "Hosting, maintenance, updates and reporting are available through ongoing care. We agree on the build and the continuing work separately, so you know what is included.",
  ],
];
export default function WebsiteDesignPage() {
  return (
    <main id="main-content" className="hobro-page premium-editorial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema).replace(/</g, "\\u003c"),
        }}
      />
      <header className="premium-shell service-hero">
        <nav aria-label="Breadcrumb" className="service-breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Website design</span>
        </nav>
        <p className="premium-eyebrow">LOCAL BUSINESS. CLEAR ONLINE.</p>
        <h1>
          Website design for <em>Fresno &amp; Clovis businesses.</em>
        </h1>
        <p className="service-intro">
          Hexacomb is a marketing agency focused on websites, run by Marco
          Chavez in Clovis. I design, write and build small-business websites,
          then help keep them useful after launch.
        </p>
        <p className="service-support">
          For a contractor, that next step might be an estimate. For a service
          business, it might be a phone call. The website should make that path
          clear.
        </p>
        <div className="premium-actions">
          <Link href="#contact" className="premium-button">
            Talk about your website
          </Link>
          <Link href="#local-work" className="premium-text-link">
            See local examples
          </Link>
        </div>
      </header>
      <section className="service-band" aria-labelledby="scope-heading">
        <div className="premium-shell">
          <p className="premium-eyebrow">WHAT WE CAN BUILD TOGETHER</p>
          <h2 id="scope-heading">
            A website with <em>a job to do.</em>
          </h2>
          <div className="service-grid">
            {scope.map(([heading, body]) => (
              <article key={heading}>
                <h3>{heading}</h3>
                <p>{body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        id="local-work"
        className="premium-shell service-section"
        aria-labelledby="work-heading"
      >
        <p className="premium-eyebrow">LOCAL WORK, IN CONTEXT</p>
        <h2 id="work-heading">
          Different businesses. <em>Different next steps.</em>
        </h2>
        <p className="service-support">
          These examples show the structure and decisions behind the
          websites—not a promise that every business will get the same results.
        </p>
        <div className="service-projects">
          <Link href="/work/m5-painting">
            <Image
              src="/images/cases/m5painting-home.jpg"
              alt="M5 Painting website homepage"
              width={1200}
              height={770}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <h3>M5 Painting</h3>
            <p>
              A Sanger painting business with service information, project work
              and an estimate path.
            </p>
            <span>Read the project story →</span>
          </Link>
          <Link href="/work/the-bug-dude">
            <Image
              src="/images/cases/thebugdude-home.jpg"
              alt="The Bug Dude Fresno website homepage"
              width={1200}
              height={770}
              sizes="(max-width: 800px) 100vw, 50vw"
            />
            <h3>The Bug Dude Fresno</h3>
            <p>
              A local pest-control website with clear services, coverage
              information and direct contact options.
            </p>
            <span>Read the project story →</span>
          </Link>
        </div>
        <p className="service-support">
          <Link href="/work">Explore all five website projects</Link>.
        </p>
      </section>
      <section className="service-band" aria-labelledby="process-heading">
        <div className="premium-shell service-split">
          <div>
            <p className="premium-eyebrow">WORK DIRECTLY WITH MARCO</p>
            <h2 id="process-heading">
              A conversation first. <em>A clear scope next.</em>
            </h2>
          </div>
          <div className="service-copy">
            <h3>Understand the business.</h3>
            <p>
              We start with what you do, who you serve, what is not working now
              and what you want a visitor to do next. If you already have a
              site, we can review it before deciding whether to improve it or
              rebuild it.
            </p>
            <h3>Agree on pages, content and functionality.</h3>
            <p>
              The quote depends on the page count, copy and image needs, forms,
              integrations and any special functionality. A new build is quoted
              separately from monthly care.{" "}
              <Link href="/pricing">See current care plans</Link> for the
              ongoing options.
            </p>
            <h3>Review the design, then launch.</h3>
            <p>
              You review the direction and share feedback. Once the design and
              content are ready, the site is prepared for launch. Your domain
              stays yours and your content stays yours.{" "}
              <Link href="/how-it-works">See how the full process works</Link>.
            </p>
          </div>
        </div>
      </section>
      <section
        className="premium-shell service-section service-questions"
        aria-labelledby="questions-heading"
      >
        <p className="premium-eyebrow">BEFORE WE START</p>
        <h2 id="questions-heading">A few practical answers.</h2>
        <article>
          <h3>Do you work with businesses outside Fresno and Clovis?</h3>
          <p>
            Yes. Hexacomb is based in Clovis and works with businesses across
            the Central Valley. The portfolio includes businesses in Fresno,
            Sanger and Kingsburg. Tell me where your customers are so the site
            can reflect your actual service area.
          </p>
        </article>
        <article>
          <h3>Can you help with an existing website?</h3>
          <p>
            Yes. A redesign is not always the first step. Clearer service copy,
            a better contact path or a technical fix may be more useful.{" "}
            <Link href="/website-audit">Start with the free website audit</Link>{" "}
            if you want a first look.
          </p>
        </article>
        <article>
          <h3>What should I have ready?</h3>
          <p>
            Your service list, business contact information, service area and
            any existing website or domain details are a good start. Real
            project photos and approved customer feedback can help. We can
            discuss gaps in the copy or images before the scope is finalized.
          </p>
        </article>
        <article>
          <h3>Does a new website guarantee Google rankings or AI mentions?</h3>
          <p>
            No. Useful content and a well-built site give search engines clearer
            information, but rankings, indexing and inclusion in AI answers are
            not guaranteed. Ongoing search work is a separate conversation about
            priorities, not a promise of a particular position.
          </p>
        </article>
        <p className="service-support">
          Want to know who you will be working with?{" "}
          <Link href="/about">Meet Marco</Link>.
        </p>
      </section>
      <AgencyContact />
    </main>
  );
}
