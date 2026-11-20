import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import PremiumHeroVideo from "@/components/PremiumHeroVideo";
import { heroMedia } from "@/lib/hero-media";
import { clientCaseStudies } from "@/lib/cases";
import ClientTestimonials from "@/components/ClientTestimonials";
import AgencyContact from "@/components/AgencyContact";
import { Suspense } from "react";
import BlogPreview, { BlogPreviewFallback } from "@/components/BlogPreview";

const featuredProjects = clientCaseStudies.filter((project) =>
  ["aacpainters", "ruiz", "m5painting"].includes(project.id),
);

const services = [
  {
    name: "A website that earns the first call.",
    detail:
      "Custom design, clear writing, real photos of your work, and an easy way to ask for a quote. Not a generic template that makes a great local business look ordinary.",
    href: "/website-design",
    link: "Explore website design",
  },
  {
    name: "A stronger presence when customers search.",
    detail:
      "Clear service pages, accurate local information, and practical Google search improvements. We build a solid foundation and keep working on visibility where it makes sense.",
    href: "/local-seo",
    link: "Explore local SEO",
  },
  {
    name: "Someone in your corner after launch.",
    detail:
      "Hosting, maintenance, updates, and support so the site keeps up with your business. You get back to the work you do best; I take care of the website.",
    href: "/pricing",
    link: "Explore ongoing care",
  },
];

const answers = [
  [
    "Is Hexacomb right for a small local business?",
    "That’s who I built Hexacomb for. I work with owners who are serious about their work, whether they’re starting out, replacing an outdated site, or ready to look more established online.",
  ],
  [
    "Do I need to know anything about websites or SEO?",
    "Not at all. Tell me about your customers, what you do, and what isn’t working. I’ll explain the options in plain English and recommend a sensible first step.",
  ],
  [
    "Is the website included in the monthly plan?",
    "A new website is a one-time project with a clear quote before we start. Hosting and ongoing care are separate monthly plans; the level of ongoing Google search work depends on the plan. You can see the options before committing.",
  ],
  [
    "Do you only work in Clovis?",
    "I’m based in Clovis and work with businesses across Fresno and the Central Valley. I work directly with every owner, so you know who’s designing the site and who’s looking after it.",
  ],
];

export default function AgencyHome() {
  return (
    <main id="main-content" className="premium-home hobro-page">
      <section className="premium-hero" aria-labelledby="home-title">
        <div className="premium-hero-copy premium-shell">
          <p className="premium-eyebrow">HEXACOMB · BUILT IN CLOVIS FOR LOCAL BUSINESS</p>
          <h1 id="home-title">
            Outshine the big guys.
            <br />
            <em>Stay proudly local.</em>
          </h1>
          <p className="premium-lead">
            You know your customers better than any national chain. I build
            premium websites that show why your business deserves the call,
            without the big-agency overhead.
          </p>
          <p className="premium-hero-note">
            Custom design, local Google visibility, hosting, and ongoing care.
            One partner who sticks around as you grow.
          </p>
          <div className="premium-actions">
            <Link className="premium-button" href="#contact" data-track="homepage_hero_quote">
              Talk about your website <ArrowIcon />
            </Link>
            <Link className="premium-text-link" href="#work" data-track="homepage_hero_work">
              See websites I’ve built <ArrowIcon />
            </Link>
          </div>
          <p className="premium-hero-credit">
            No technical brief needed. Talk directly with Marco Chavez.
          </p>
        </div>
        <PremiumHeroVideo src={heroMedia.src} poster={heroMedia.poster} />
      </section>

      <section
        id="work"
        className="premium-featured-work premium-section"
        aria-labelledby="featured-work-title"
      >
        <div className="premium-shell">
          <div className="premium-featured-heading">
            <div>
              <p className="premium-eyebrow">REAL BUSINESSES. REAL WEBSITES.</p>
              <h2 id="featured-work-title">
                Local businesses.
                <br />
                <em>Nothing ordinary about them.</em>
              </h2>
            </div>
            <p>
              Your work should do the talking. These are websites made for
              Central Valley businesses, built to show what makes each one worth
              choosing and give visitors a clear next step.
            </p>
          </div>
          <div className="premium-featured-grid">
            {featuredProjects.map((project) => (
              <article className="premium-featured-project" key={project.id}>
                <Link
                  className="premium-featured-image"
                  href={project.id === "m5painting" ? "/work/m5-painting" : "/work#project-" + project.id}
                  aria-label={"See the " + project.title + " project"}
                  data-track={"homepage_project_" + project.id}
                >
                  <Image
                    src={project.imageSrc}
                    alt={project.title + " website homepage"}
                    width={1200}
                    height={770}
                    sizes="(max-width: 800px) 100vw, (max-width: 1100px) 50vw, 33vw"
                  />
                </Link>
                <p className="premium-featured-location">{project.city}</p>
                <h3>{project.title}</h3>
                <p className="premium-featured-summary">{project.solutionDescription}</p>
                <Link
                  className="premium-text-link"
                  href={project.id === "m5painting" ? "/work/m5-painting" : "/work#project-" + project.id}
                >
                  See the project <ArrowIcon />
                </Link>
              </article>
            ))}
          </div>
          <div className="premium-featured-more">
            <p>Different industries. Different customers. Never the same cookie-cutter website.</p>
            <Link className="premium-text-link" href="/work" data-track="homepage_all_work">
              Explore more local work <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section
        id="services"
        className="premium-services premium-section"
        aria-labelledby="services-title"
      >
        <div className="premium-shell">
          <div className="premium-section-heading">
            <p className="premium-eyebrow">MORE THAN A PRETTY WEBSITE</p>
            <h2 id="services-title">
              Look the part.
              <br />
              <em>Get found. Get the call.</em>
            </h2>
            <p className="premium-section-intro">
              A good-looking website matters. But the real job is helping
              customers trust you, understand your services, and get in touch.
              That’s what we design around.
            </p>
          </div>
          <div className="premium-service-list">
            {services.map((service) => (
              <article className="premium-service" key={service.name}>
                <h3>{service.name}</h3>
                <div>
                  <p>{service.detail}</p>
                  <Link href={service.href} className="premium-text-link">
                    {service.link} <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="premium-owner-promise premium-section" aria-labelledby="owner-promise-title">
        <div className="premium-shell premium-owner-promise-grid">
          <div>
            <p className="premium-eyebrow">SMALL BUSINESS IS THE POINT</p>
            <h2 id="owner-promise-title">
              Big-agency quality.
              <br />
              <em>None of the runaround.</em>
            </h2>
          </div>
          <div className="premium-owner-promise-copy">
            <p>
              You shouldn’t have to choose between a website you’re proud of
              and a price that makes sense for your business.
            </p>
            <p>
              I keep Hexacomb lean on purpose. There aren’t layers of
              account managers or an expensive agency office to pay for. You
              work with the person who builds your site, answers your questions,
              and helps improve it after launch.
            </p>
            <p>
              I’m not here to sell you every service under the sun. I want to
              be the website partner you can count on as your business grows.
            </p>
            <Link href="/about" className="premium-text-link">
              Meet your website partner <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <section className="premium-process premium-section" aria-labelledby="process-title">
        <div className="premium-shell">
          <div className="premium-section-heading">
            <p className="premium-eyebrow">EASY TO GET STARTED</p>
            <h2 id="process-title">
              No big pitch.
              <br />
              <em>Just a clear next step.</em>
            </h2>
            <p className="premium-section-intro">
              You don’t need a plan or a list of technical requirements. That’s my job.
            </p>
          </div>
          <div className="premium-process-grid">
            <article>
              <h3>Tell me what you do.</h3>
              <p>We’ll talk about your business, who you serve, and what you want your website to do better.</p>
            </article>
            <article>
              <h3>Get a plan that fits.</h3>
              <p>I’ll recommend what makes sense and give you a clear project quote. A new build and monthly care are priced separately.</p>
            </article>
            <article>
              <h3>Launch. Then keep growing.</h3>
              <p>We create a custom site around your business. Ongoing hosting, updates, and search support are available as you need them.</p>
            </article>
          </div>
          <Link href="#contact" className="premium-button" data-track="homepage_process_quote">
            Tell me about your business <ArrowIcon />
          </Link>
          <p className="premium-process-assurance">A conversation first. No pressure to buy.</p>
        </div>
      </section>

      <section
        id="about"
        className="premium-about premium-section"
        aria-labelledby="about-title"
      >
        <div className="premium-shell premium-about-grid">
          <div className="premium-portrait">
            <Image
              src="/images/marco-portrait.jpg"
              alt="Marco Chavez, founder of Hexacomb, based in Clovis, California"
              width={720}
              height={900}
              sizes="(max-width: 800px) 100vw, 40vw"
            />
            <span>MARCO CHAVEZ / FOUNDER</span>
          </div>
          <div>
            <p className="premium-eyebrow">THE PERSON BEHIND THE WORK</p>
            <h2 id="about-title">
              Your business matters.
              <br />
              <em>So does who builds for it.</em>
            </h2>
            <p className="premium-lead">
              I’m Marco. I run Hexacomb from Clovis, and I built it for the
              owners doing great work without a corporate marketing budget.
            </p>
            <p>
              When your customer checks you out online, I want them to see a
              business worth trusting—not a website that looks like an
              afterthought.
            </p>
            <p>
              You’ll talk to me from the first conversation through the
              ongoing updates. Your growth matters more than selling you things
              you don’t need.
            </p>
            <Link className="premium-text-link" href="/about">
              Get to know Marco <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>

      <ClientTestimonials />
      <section className="premium-answers-section premium-section" aria-labelledby="answers-title">
        <div className="premium-shell">
          <div className="premium-answers">
            <h2 id="answers-title">A few useful answers.</h2>
            <div>
              {answers.map(([question, answer]) => (
                <details key={question}>
                  <summary>{question}</summary>
                  <p>
                    {answer}{" "}
                    {question === "Is the website included in the monthly plan?" && (
                      <Link href="/pricing">See plans and pricing.</Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
      <Suspense fallback={<BlogPreviewFallback />}>
        <BlogPreview />
      </Suspense>
      <AgencyContact />
    </main>
  );
}
