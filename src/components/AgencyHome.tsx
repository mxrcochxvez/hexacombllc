import Image from "next/image";
import Link from "next/link";
import ArrowIcon from "@/components/ArrowIcon";
import PremiumHeroVideo from "@/components/PremiumHeroVideo";
import { heroMedia } from "@/lib/hero-media";
import ClientTestimonials from "@/components/ClientTestimonials";
import AgencyContact from "@/components/AgencyContact";

const services = [
  {
    number: "01",
    name: "Websites with purpose.",
    detail:
      "Design, copy and development built around the next step: a call, an estimate, a booking. Clear on a phone. Easy to understand.",
    href: "/work",
    link: "Explore the work",
  },
  {
    number: "02",
    name: "Make the right impression in search.",
    detail:
      "Local SEO, useful service pages and clear business information. A foundation that helps search engines and AI answers understand what you do and where you work.",
    href: "/website-audit",
    link: "Check your website",
  },
  {
    number: "03",
    name: "Care that carries on.",
    detail:
      "Hosting, maintenance, updates and practical reporting. Your services change. Your website should keep up. Choose the support that fits your business.",
    href: "/pricing",
    link: "View care plans",
  },
];
const answers = [
  [
    "What does Hexacomb do?",
    "Hexacomb is a marketing agency focused on websites. Marco Chavez designs, builds and maintains small-business websites, with local SEO, copy and analytics support.",
  ],
  [
    "Where do you work?",
    "Hexacomb is based in Clovis, California, and serves businesses in Fresno and the Central Valley. Tell Marco where your customers are and what you need the website to do.",
  ],
  [
    "Can you improve an existing website?",
    "Yes. Start with a website audit or a conversation about what is not working. The first priority might be clearer services, a better contact path, faster pages or a full redesign.",
  ],
  [
    "How much does it cost?",
    "New websites are quoted to match the scope. Ongoing care plans currently start at $50 per month. See the pricing page for current inclusions and talk to Marco before work begins.",
  ],
];
export default function AgencyHome() {
  return (
    <main id="main-content" className="premium-home hobro-page">
      <section
        className="premium-hero premium-shell"
        aria-labelledby="home-title"
      >
        <div className="premium-hero-copy">
          <p className="premium-eyebrow">HEXACOMB · CLOVIS, CALIFORNIA</p>
          <h1 id="home-title">
            A better website.
            <br />
            <em>A stronger first impression.</em>
          </h1>
          <p className="premium-lead">
            Website design, local SEO and ongoing care for businesses in Fresno,
            Clovis and the Central Valley.
          </p>
          <p className="premium-hero-note">
            You run the business. I take care of how it shows up online.
          </p>
          <div className="premium-actions">
            <Link className="premium-button" href="#contact">
              Let’s talk about your website <ArrowIcon />
            </Link>
            <Link className="premium-text-link" href="/work">
              View selected work
            </Link>
          </div>
          <p className="premium-hero-credit">
            Independent by design. Personally handled by Marco Chavez.
          </p>
        </div>
        <PremiumHeroVideo src={heroMedia.src} poster={heroMedia.poster} />
      </section>
      <section
        id="services"
        className="premium-services premium-section"
        aria-labelledby="services-title"
      >
        <div className="premium-shell">
          <div className="premium-section-heading">
            <p className="premium-eyebrow">01 / SERVICES</p>
            <h2 id="services-title">
              Everything your website needs.
              <br />
              <em>Nothing it doesn’t.</em>
            </h2>
          </div>
          <div className="premium-service-list">
            {services.map((s) => (
              <article className="premium-service" key={s.number}>
                <span className="premium-number">{s.number}</span>
                <h3>{s.name}</h3>
                <div>
                  <p>{s.detail}</p>
                  <Link href={s.href} className="premium-text-link">
                    {s.link} <ArrowIcon />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <div className="premium-answers">
            <h3>A few useful answers.</h3>
            <div>
              {answers.map(([q, a]) => (
                <details key={q}>
                  <summary>{q}</summary>
                  <p>
                    {a}{" "}
                    {q === "How much does it cost?" && (
                      <Link href="/pricing">See plans and pricing.</Link>
                    )}
                  </p>
                </details>
              ))}
            </div>
          </div>
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
            <p className="premium-eyebrow">02 / ABOUT ME</p>
            <h2 id="about-title">
              A real person.
              <br />
              <em>On your side.</em>
            </h2>
            <p className="premium-lead">
              I’m Marco. I run Hexacomb from Clovis, and I work directly with
              the people behind the businesses.
            </p>
            <p>
              You don’t need another dashboard to babysit. You need someone who
              understands what you do, makes the website clearer, and keeps it
              working after launch.
            </p>
            <p>
              From the first conversation to the next update, you’re talking to
              the person doing the work.
            </p>
            <Link className="premium-text-link" href="/about">
              A little more about me <ArrowIcon />
            </Link>
          </div>
        </div>
      </section>
      <ClientTestimonials />
      <AgencyContact />
    </main>
  );
}
