import Image from "next/image";
import { seasonalCopy } from "@/lib/seasonal-theme";
import { clientCaseStudies } from "@/lib/cases";
import CentralValleyMap from "./CentralValleyMap";

export default function PortfolioShowcase() {
  return (
    <div id="projects">
      <section className="hobro-white hobro-cases portfolio-section" aria-labelledby="portfolio-heading">
        <div className="hobro-shell">
          <div className="portfolio-heading">
            <div>
              <p className="portfolio-eyebrow">SELECTED WEBSITE WORK</p>
              <h2 id="portfolio-heading">{seasonalCopy("Good businesses. Better websites.", "Real work. Wicked good company.")}</h2>
            </div>
            <p>Take a closer look. Browse every project below, then open the website to explore it for yourself.</p>
          </div>
          <div className="portfolio-grid">
            {clientCaseStudies.map((project) => (
              <article className="portfolio-card" key={project.id} aria-labelledby={`project-${project.id}`}>
                <a className="portfolio-image" href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${project.title} ${project.isPreview ? "preview" : "website"} in a new tab`}>
                  <Image src={project.imageSrc} alt={`${project.title} website homepage`} width={1200} height={770} sizes="(max-width: 760px) 100vw, 50vw" />
                  <span className="portfolio-status">{project.isPreview ? "PREVIEW SITE" : "LIVE WEBSITE"}</span>
                </a>
                <div className="portfolio-card-body">
                  <p className="portfolio-location">{project.city}</p>
                  <h3 id={`project-${project.id}`}>{project.title}</h3>
                  <p className="portfolio-summary">{project.summary}</p>
                  <ul className="portfolio-tags" aria-label="Project focus">
                    {project.tags.map((tag) => <li key={tag}>{tag}</li>)}
                  </ul>
                  <a className="portfolio-visit" href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    {project.isPreview ? "View preview" : "Visit website"} <span aria-hidden="true">↗</span>
                    <span className="portfolio-sr-only"> — {project.title} (opens in a new tab)</span>
                  </a>
                  {project.isPreview && <p className="portfolio-preview-note">Preview URL — custom domain coming later.</p>}
                  <details className="portfolio-details">
                    <summary>About this project<span className="portfolio-sr-only"> — {project.title}</span></summary>
                    <p>{project.clientDescription}</p>
                    <p>{project.solutionDescription}</p>
                    <ul>{project.highlights.map((item) => <li key={item}>{item}</li>)}</ul>
                  </details>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CentralValleyMap />
    </div>
  );
}
