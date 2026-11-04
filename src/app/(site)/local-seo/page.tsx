import type { Metadata } from "next";
import Link from "next/link";
import AgencyContact from "@/components/AgencyContact";
import { pageSocialMetadata } from "@/lib/seo";

const title = "Local SEO for Fresno & Clovis Businesses";
const description =
  "Local SEO from Hexacomb in Clovis: clearer service pages, accurate business information and practical website search improvements for Central Valley businesses.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/local-seo" },
  ...pageSocialMetadata("/local-seo", `${title} | Hexacomb`, description),
};

const schema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://hexacombllc.com/#local-seo",
      name: "Local SEO and search visibility",
      serviceType: "Local search engine optimization",
      description,
      url: "https://hexacombllc.com/local-seo",
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
        { "@type": "ListItem", position: 1, name: "Home", item: "https://hexacombllc.com/" },
        { "@type": "ListItem", position: 2, name: "Local SEO", item: "https://hexacombllc.com/local-seo" },
      ],
    },
  ],
};

const scope = [
  [
    "Pages that answer local customers’ questions.",
    "Your services, service area and contact options should be easy to understand. I help organize useful service pages around what you actually offer and where you work, rather than adding place names to generic copy.",
  ],
  [
    "Clear business information.",
    "Business names, contact details and service areas need to tell the same story. We review the information on your website and identify listing details that need attention, with any account or listing work agreed as part of the scope.",
  ],
  [
    "Search basics that support the content.",
    "Descriptive page titles, useful headings, crawlable links and accurate structured data help search engines understand the site. Technical improvements are prioritized around the issues your website actually has.",
  ],
  [
    "Practical improvements over time.",
    "Reporting, inquiry tracking and ongoing search work depend on the care plan you choose. We use the available information to decide what needs attention and agree on the work before it starts.",
  ],
];

export default function LocalSeoPage() {
  return (
    <main id="main-content" className="hobro-page premium-editorial">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
      />
      <header className="premium-shell service-hero">
        <nav aria-label="Breadcrumb" className="service-breadcrumb">
          <Link href="/">Home</Link>
          <span aria-hidden="true">/</span>
          <span>Local SEO</span>
        </nav>
        <p className="premium-eyebrow">CLEAR SERVICES. LOCAL CONTEXT.</p>
        <h1>Local SEO for <em>Fresno &amp; Clovis businesses.</em></h1>
        <p className="service-intro">
          Help customers understand what you do, where you work and how to reach
          you. Hexacomb is a marketing agency focused on websites, run by Marco
          Chavez in Clovis, with local search support grounded in your actual business.
        </p>
        <p className="service-support">
          A useful service page should answer a customer’s question and make the
          next step clear. That is where we start, whether you need improvements
          to an existing site or search foundations for a new one.
        </p>
        <div className="premium-actions">
          <Link href="#contact" className="premium-button">Talk about local SEO</Link>
          <Link href="/website-audit" className="premium-text-link">Try the free website audit</Link>
        </div>
      </header>
      <section className="service-band" aria-labelledby="seo-scope-heading">
        <div className="premium-shell">
          <p className="premium-eyebrow">WHAT THE WORK CAN INCLUDE</p>
          <h2 id="seo-scope-heading">A clearer website. <em>A stronger local foundation.</em></h2>
          <div className="service-grid">
            {scope.map(([heading, body]) => (
              <article key={heading}><h3>{heading}</h3><p>{body}</p></article>
            ))}
          </div>
        </div>
      </section>
      <section className="premium-shell service-section service-split" aria-labelledby="seo-process-heading">
        <div>
          <p className="premium-eyebrow">START WITH WHAT YOU HAVE</p>
          <h2 id="seo-process-heading">Find the gaps. <em>Agree on the priorities.</em></h2>
        </div>
        <div className="service-copy">
          <h3>Review the website and the business.</h3>
          <p>
            Share your website, services and the places you actually serve. The{" "}
            <Link href="/website-audit">free website audit</Link> offers a first-pass
            check of one public page. It is a starting point, not a complete
            local search strategy or a ranking report.
          </p>
          <h3>Choose the work that fits.</h3>
          <p>
            We discuss whether you need clearer pages, technical fixes or a new
            website. <Link href="/website-design">Website builds</Link> are quoted
            separately. Ongoing search improvements are included in Established
            and Enterprise care plans; the exact work follows the agreed scope.{" "}
            <Link href="/pricing">Compare care plans and inclusions</Link>.
          </p>
          <h3>Keep the next step useful.</h3>
          <p>
            Search visibility is only part of the path. Once someone arrives,
            they should be able to understand your services and call, ask for
            an estimate or send an inquiry without hunting for the right page.
          </p>
        </div>
      </section>
      <section className="premium-shell service-section" aria-labelledby="seo-projects-heading">
        <p className="premium-eyebrow">LOCAL WEBSITES, IN CONTEXT</p>
        <h2 id="seo-projects-heading">Real services. <em>Clear local information.</em></h2>
        <p className="service-support">
          See how two Central Valley websites organize the details a local
          customer needs. These project stories describe the pages and contact
          paths, not measured rankings, traffic or lead results.
        </p>
        <div className="service-grid">
          <article>
            <h3>M5 Painting in Sanger</h3>
            <p>
              Dedicated painting-service pages, service-area information and
              project media help a visitor understand the work before asking
              for an estimate.
            </p>
            <Link href="/work/m5-painting" className="premium-text-link">
              Read the M5 Painting project story
            </Link>
          </article>
          <article>
            <h3>The Bug Dude Fresno</h3>
            <p>
              Pest-specific pages and Fresno and Madera county coverage
              information give customers a useful starting point, with direct
              call, text and booking options.
            </p>
            <Link href="/work/the-bug-dude" className="premium-text-link">
              Read The Bug Dude project story
            </Link>
          </article>
        </div>
        <p className="service-support">
          <Link href="/work">Browse all five website projects</Link> for more
          examples of local businesses and their websites.
        </p>
      </section>
      <section className="service-band" aria-labelledby="seo-questions-heading">
        <div className="premium-shell service-questions">
          <p className="premium-eyebrow">BEFORE WE START</p>
          <h2 id="seo-questions-heading">Straight answers about local search.</h2>
          <article>
            <h3>Do I need a new website for local SEO?</h3>
            <p>
              Not necessarily. Useful service copy, accurate business details
              and technical fixes may be enough to improve the foundation of
              your current site. We review what is there before recommending a rebuild.
            </p>
          </article>
          <article>
            <h3>Do you guarantee rankings, map placement or AI mentions?</h3>
            <p>
              No. Rankings, indexing, map placement and inclusion in AI answers
              are controlled by those platforms and are not guaranteed. Clear,
              accurate content helps them understand your business, but it is
              not a promise of a particular position or number of inquiries.
            </p>
          </article>
          <article>
            <h3>Is ongoing local SEO included in every care plan?</h3>
            <p>
              No. Starter and Growing include search basics. Established and
              Enterprise include ongoing search improvements. Reporting,
              content updates and check-ins also vary by plan.{" "}
              <Link href="/pricing">See the current plan details</Link> before
              choosing the level of support.
            </p>
          </article>
          <article>
            <h3>Can you help businesses elsewhere in the Central Valley?</h3>
            <p>
              Yes. Hexacomb is based in Clovis and works with businesses across
              the Central Valley. Tell me where your customers are so the
              website reflects your real service area.
            </p>
          </article>
        </div>
      </section>
      <AgencyContact initialMessage="I'm interested in local SEO. Here is my website, what I do, and where I serve customers: " />
    </main>
  );
}
