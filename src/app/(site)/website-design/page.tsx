import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import AgencyContact from "@/components/AgencyContact";
import { pageSocialMetadata } from "@/lib/seo";
import { testimonials } from "@/lib/testimonials";

const title = "Website Design for Fresno & Clovis Businesses";
const description =
  "Custom website design for Fresno and Clovis businesses. See Hexacomb’s work for contractors and an insurance broker, and how we build local SEO into a new site.";
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
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Do you work with businesses outside Fresno and Clovis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes. Hexacomb is based in Clovis and works with businesses across the Central Valley. The portfolio includes businesses in Fresno, Sanger and Kingsburg.",
          },
        },
        {
          "@type": "Question",
          name: "Should I improve my existing website or rebuild it?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A rebuild is not always the first step. If the structure still works, clearer service copy, a better contact path or a technical fix may be enough. We review what you have before recommending the scope.",
          },
        },
        {
          "@type": "Question",
          name: "How much does a small-business website cost?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "New websites are quoted for the work involved: the number of pages, copy and image needs, forms, integrations and special functionality. We agree on the scope and quote before work starts. The one-time build is separate from ongoing hosting and care.",
          },
        },
        {
          "@type": "Question",
          name: "What should I have ready?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Your service list, business contact information, service area and any existing website or domain details are a good start. Real project photos and approved customer feedback can help.",
          },
        },
        {
          "@type": "Question",
          name: "Does a new website guarantee Google rankings or AI mentions?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "No. Useful content and a well-built site give search engines clearer information, but rankings, indexing and inclusion in AI answers are not guaranteed.",
          },
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
    "Local SEO in a new website.",
    "If you’re a painter, someone looking for exterior painting should land on a page that shows the work, names the towns you serve and explains how to get an estimate. I write and organize service pages around those decisions.",
  ],
  [
    "A plan for what happens after launch.",
    "Hosting, maintenance, updates and reporting are available through ongoing care. We agree on the build and the continuing work separately, so you know what is included.",
  ],
];
export default function WebsiteDesignPage() {
  const m5Testimonial = testimonials.find(
    (item) => item.name === "M5 Painting" && item.approvedForPublication,
  );

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
          I’m Marco Chavez. I run Hexacomb, a web design and local SEO agency
          in Clovis. I build websites that show customers what you do, where
          you work and how to hire you. You work directly with me on the
          design, the words and the build.
        </p>
        <p className="service-support">
          We start with a straightforward conversation, agree on the build
          and its price, and design around what your customers need to see.
          Hosting and ongoing care are separate, so you can choose the support
          that fits as your business grows.
        </p>
        <div className="premium-actions">
          <Link href="#contact" className="premium-button">
            Request a website quote
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
        <h2 id="work-heading">
          What kinds of websites <em>do I build?</em>
        </h2>
        <div className="service-grid">
          <article>
            <h3>Contractor websites</h3>
            <p>
              A homeowner pricing a stucco repaint and a property manager
              planning an office repaint need to see different work. For{" "}
              <Link href="/work/m5-painting">M5 Painting</Link>, I gave exterior
              and commercial painting their own sections and showed what to
              expect from the walkthrough and written quote. My{" "}
              <Link href="/work">contractor portfolio</Link> also includes
              AAC Painters and Kingsburg concrete and masonry contractor Ruiz
              Family Enterprises.
            </p>
          </article>
          <article>
            <h3>Restaurant websites</h3>
            <p>
              A guest checking the lunch menu on a phone should be able to
              read the prices without pinching and zooming a PDF. I’d build
              the menu as a web page, put kitchen hours beside it, and send
              pickup orders or table bookings to the system your staff
              already uses.
            </p>
          </article>
          <article>
            <h3>Insurance broker websites</h3>
            <p>
              On the site I built for{" "}
              <a
                href="https://ivan-m-lopez-insurance.pages.dev/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Van Berg Insurance Services
              </a>
              , visitors exploring Medicare or group coverage can go straight to
              the information they need, with key credentials and contact
              options clear upfront.
            </p>
          </article>
          <article>
            <h3>Websites for arts and community programs</h3>
            <p>
              I built{" "}
              <a
                href="https://pixelandpaint.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Pixel &amp; Paint
              </a>{" "}
              around two audiences. Fresno families can see what kids make at
              the free art and technology pop-ups and follow announcements
              for the next one. People who want to contribute materials or
              time have a separate invitation to contact the organizers.
            </p>
          </article>
        </div>
        <h2>Selected website projects</h2>
        <div className="service-projects">
          <article>
            <Link href="/work/m5-painting">
              <Image
                src="/images/cases/m5painting-redesign-2026.jpg"
                alt="M5 Painting website homepage"
                width={1200}
                height={770}
                sizes="(max-width: 800px) 100vw, 50vw"
              />
              <h3>M5 Painting</h3>
              <p>
                Jobsite footage lets homeowners see the crew’s prep work.
                The estimate section explains what happens next, from an
                on-site walkthrough to a written quote.
              </p>
              <span>Read the project story →</span>
            </Link>
            {m5Testimonial && (
              <figure className="service-project-quote">
                <blockquote>“{m5Testimonial.quote}”</blockquote>
                <figcaption>{m5Testimonial.name}</figcaption>
              </figure>
            )}
          </article>
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
              Someone dealing with bed bugs can start on a page about that
              pest, check coverage in Fresno and Madera counties, and call
              or text the team.
            </p>
            <span>Read the project story →</span>
          </Link>
        </div>
        <p className="service-support">
          <Link href="/work">Explore the website portfolio</Link>.
        </p>
        <p className="service-support">
          I also handle SEO for{" "}
          <a href="https://www.vallejomotor.com/">Vallejo Electric Motor</a>.
          A buyer sourcing a replacement motor and a plant manager looking
          for a repair shop have different questions. See the{" "}
          <Link href="/local-seo#seo-projects-heading">industrial and local service SEO examples</Link>.
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
          <h3>Should I improve my existing website or rebuild it?</h3>
          <p>
            A rebuild is not always the first step. If the structure still works,
            clearer service copy, a better contact path or a technical fix may
            be enough. If the site no longer fits your services or is difficult
            to use and maintain, a rebuild may make more sense. We review what
            you have before recommending the scope.{" "}
            <Link href="/website-audit">Start with the free website audit</Link>{" "}
            if you want a first look.
          </p>
        </article>
        <article>
          <h3>How much does a small-business website cost?</h3>
          <p>
            New websites are quoted for the work involved: the number of pages,
            copy and image needs, forms, integrations and special functionality.
            We agree on the scope and quote before work starts. The one-time
            build is separate from ongoing hosting and care. Read our{" "}
            <a href="https://blog.hexacombllc.com/guides/small-business-website-cost-fresno-clovis/">
              Fresno and Clovis website pricing guide
            </a>{" "}
            for a breakdown of build costs.{" "}
            <Link href="/pricing">See current care plans</Link> or{" "}
            <Link href="#contact">request a website quote</Link>.
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
            priorities, not a promise of a particular position.{" "}
            <Link href="/local-seo">Explore local SEO for Fresno and Clovis</Link>{" "}
            for service-page, business-information and search improvements.
          </p>
        </article>
        <p className="service-support">
          Want to know who you will be working with?{" "}
          <Link href="/about">Meet Marco</Link>.
        </p>
      </section>
      <section className="service-band" aria-labelledby="consulting-heading">
        <div className="premium-shell service-split">
          <h2 id="consulting-heading">AI and software engineering consulting</h2>
          <div className="service-copy">
            <p>
              I consult on software architecture, application development and
              AI automation. The <a href="https://babbagellc.com/team">Babbage LLC team page</a>{" "}
              lists me, Marco Chavez, as its Software Architect &amp; Engineer.
              If your team is considering automation, bring me a task someone
              does by hand. We can walk through the inputs, the decisions and
              what a person needs to review.
            </p>
            <p>
              I’m always looking for more types of business partnerships.{" "}
              <Link href="#contact">Tell me what you have in mind.</Link>
            </p>
          </div>
        </div>
      </section>
      <AgencyContact />
    </main>
  );
}
