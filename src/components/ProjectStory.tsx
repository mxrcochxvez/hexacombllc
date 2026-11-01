import Image from "next/image";
import Link from "next/link";
import AgencyContact from "@/components/AgencyContact";
import { projectStories, type ProjectStorySlug } from "@/lib/project-stories";
export default function ProjectStory({ slug }: { slug: ProjectStorySlug }) {
  const project = projectStories[slug];
  const url = `https://hexacombllc.com/work/${slug}`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        name: `${project.name} website project`,
        description: project.description,
        url,
        about: {
          "@type": "Organization",
          name: project.name,
          url: project.url,
        },
        isPartOf: { "@id": "https://hexacombllc.com/#website" },
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
            name: "Work",
            item: "https://hexacombllc.com/work",
          },
          { "@type": "ListItem", position: 3, name: project.name, item: url },
        ],
      },
    ],
  };
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
          <Link href="/work">Work</Link>
          <span aria-hidden="true">/</span>
          <span>{project.name}</span>
        </nav>
        <p className="premium-eyebrow">{project.name} / WEBSITE PROJECT</p>
        <h1>{project.title}</h1>
        <p className="service-intro">{project.intro}</p>
        <div className="premium-actions">
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="premium-button"
          >
            Visit the client website{" "}
            <span className="portfolio-sr-only">(opens in a new tab)</span>
          </a>
          <Link href="/website-design" className="premium-text-link">
            Explore website design
          </Link>
        </div>
        <dl className="project-facts">
          <div>
            <dt>BUSINESS</dt>
            <dd>{project.name}</dd>
          </div>
          <div>
            <dt>SECTOR</dt>
            <dd>{project.sector}</dd>
          </div>
          <div>
            <dt>LOCATION / COVERAGE</dt>
            <dd>{project.city}</dd>
          </div>
        </dl>
      </header>
      <div className="premium-shell">
        <figure className="project-screen">
          <Image
            src={project.image}
            alt={`${project.name} website homepage preview`}
            width={1200}
            height={770}
            sizes="(max-width: 800px) 100vw, 82rem"
          />
          <figcaption>
            Homepage preview. Visit the client website to explore its current
            content.
          </figcaption>
        </figure>
      </div>
      <section
        className="premium-shell service-section service-split"
        aria-labelledby="focus-heading"
      >
        <div>
          <p className="premium-eyebrow">THE FOCUS</p>
          <h2 id="focus-heading">
            Make the next step <em>easier to understand.</em>
          </h2>
        </div>
        <p className="service-intro">{project.focus}</p>
      </section>
      <section className="service-band" aria-labelledby="decisions-heading">
        <div className="premium-shell">
          <p className="premium-eyebrow">INSIDE THE WEBSITE</p>
          <h2 id="decisions-heading">
            What the site puts <em>in front of visitors.</em>
          </h2>
          <div className="service-grid">
            {project.decisions.map((d) => (
              <article key={d.heading}>
                <h3>{d.heading}</h3>
                <p>{d.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section
        className="premium-shell service-section"
        aria-labelledby="takeaway-heading"
      >
        <p className="premium-eyebrow">THE TAKEAWAY</p>
        <h2 id="takeaway-heading">
          Useful details. <em>A clear contact path.</em>
        </h2>
        <p className="service-intro">{project.takeaway}</p>
        <p className="service-support">
          This project story describes the website’s content and structure. It
          does not report measured traffic, rankings or lead results.
        </p>
        <div className="project-related">
          <Link href="/website-design" className="premium-text-link">
            Website design in Fresno &amp; Clovis
          </Link>
          <Link
            href={`/work/${project.relatedSlug}`}
            className="premium-text-link"
          >
            See the {project.relatedName} project
          </Link>
          <Link href="/work" className="premium-text-link">
            All website projects
          </Link>
        </div>
      </section>
      <AgencyContact />
    </main>
  );
}
