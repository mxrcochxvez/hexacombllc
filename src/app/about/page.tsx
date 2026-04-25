import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Code,
  Heart,
  Eye,
  MessageCircle,
  MapPin,
  Briefcase,
  Coffee,
  Hexagon,
} from "lucide-react";

const baseUrl = "https://hexacombllc.com";
const ogImage = {
  url: "/hexacomb_logo_wordmark.png",
  width: 1200,
  height: 630,
  alt: "Hexacomb — Modern Websites for the Central Valley",
};

export const metadata: Metadata = {
  title: "About Marco — Senior Software Engineer",
  description:
    "Marco is a Senior Software Engineer based in Clovis, CA, building custom websites and apps for local businesses in the Central Valley. Accessibility-first, no shortcuts.",
  alternates: {
    canonical: `${baseUrl}/about`,
  },
  openGraph: {
    title: "About Marco — Senior Software Engineer | Hexacomb",
    description:
      "Marco is a Senior Software Engineer based in Clovis, CA, building custom websites and apps for local businesses in the Central Valley.",
    url: `${baseUrl}/about`,
    images: [ogImage],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Marco — Senior Software Engineer | Hexacomb",
    description:
      "Marco is a Senior Software Engineer based in Clovis, CA, building custom websites and apps for local businesses in the Central Valley.",
    images: ["/hexacomb_logo_wordmark.png"],
  },
};

const iconProps = { size: 28, strokeWidth: 1.75 };

function PhotoPlaceholder({
  label,
  icon: Icon,
  className = "",
}: {
  label: string;
  icon: React.ElementType;
  className?: string;
}) {
  return (
    <div className={`photo-placeholder ${className}`}>
      <Icon size={32} strokeWidth={1.5} />
      <span>{label}</span>
    </div>
  );
}

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/about#person`,
        name: "Marco",
        jobTitle: "Senior Software Engineer",
        worksFor: {
          "@id": `${baseUrl}/#organization`,
        },
        url: `${baseUrl}/about`,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Clovis",
          addressRegion: "CA",
          addressCountry: "US",
        },
        description:
          "Senior Software Engineer based in Clovis, CA, building custom websites and apps for local businesses in the Central Valley.",
        knowsAbout: [
          "Web Development",
          "Accessibility",
          "SEO",
          "React",
          "Next.js",
          "JavaScript",
          "TypeScript",
        ],
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/about#breadcrumb`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: baseUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "About",
            item: `${baseUrl}/about`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
      {/* ── Hero: Split with portrait ── */}
      <section className="about-hero-v2" aria-labelledby="about-heading">
        <div className="container about-hero-grid">
          <div className="about-hero-photo">
            <Image
              src="/images/marco-portrait.jpg"
              alt="Portrait of Marco"
              className="about-portrait"
              width={680}
              height={907}
              priority
            />
          </div>
          <div className="about-hero-text">
            <h1 id="about-heading">
              I&rsquo;m Marco. I build software that feels like it was made
              by a person, not a machine.
            </h1>
            <p className="about-hero-sub">
              Senior Software Engineer based in Clovis, California. Six years
              of turning messy problems into clean, maintainable code — across
              startups, agencies, and now my own shop.
            </p>
            <div className="about-hero-meta">
              <span className="meta-tag">
                <MapPin size={16} strokeWidth={2} />
                Clovis, CA
              </span>
              <span className="meta-tag">
                <Briefcase size={16} strokeWidth={2} />
                6+ Years Experience
              </span>
              <span className="meta-tag">
                <Coffee size={16} strokeWidth={2} />
                15+ Projects Shipped
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Timeline: My Story ── */}
      <section className="about-timeline" aria-labelledby="story-heading">
        <div className="container">
          <span className="section-label">How I Got Here</span>
          <h2 id="story-heading">I didn&rsquo;t take the usual path.</h2>

          <div className="timeline">
            <div className="timeline-line" aria-hidden="true" />

            {/* Milestone 1 — Chemistry */}
            <div className="timeline-item left">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-period">Before Code</span>
                <h3>Precision in a Chemistry Lab</h3>
                <p>
                  I started at BouMatic testing chemicals, ensuring every batch
                  was within spec and inventory stayed accurate. It was
                  repetitive, precise work — and it taught me the same
                  discipline I bring to software: check your work, stay
                  organized, and never assume anything is &ldquo;close
                  enough.&rdquo;
                </p>
              </div>
            </div>

            {/* Milestone 2 — First Code */}
            <div className="timeline-item right">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-period">Career Start</span>
                <h3>Taught Myself to Code</h3>
                <p>
                  My first real project was a reporting tool for Ordrslip that
                  the Chief Product Officer used to present insights across
                  sales, marketing, and engineering. That project led to a full
                  role on the core dev team, building mobile ordering sites for
                  restaurants nationwide. I learned that good software
                  doesn&rsquo;t just work — it makes someone else&rsquo;s job
                  easier.
                </p>
              </div>
            </div>

            {/* Milestone 3 — Teaching */}
            <div className="timeline-item left">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-period">Mentor</span>
                <h3>Teaching at Woz U</h3>
                <p>
                  I mentored aspiring developers in JavaScript, C#, and Java —
                  making sure they weren&rsquo;t just completing assignments,
                  but actually understanding what they were building. Teaching
                  forces you to truly know your craft. It also teaches you
                  patience, clarity, and how to communicate technical ideas to
                  non-technical people. Those skills show up in every client
                  conversation I have today.
                </p>
              </div>
            </div>

            {/* Milestone 4 — Bitwise + photo */}
            <div className="timeline-item right">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <Image
                  src="/images/marco-bitwise.jpg"
                  alt="Marco with the Bitwise team"
                  className="timeline-photo"
                  width={1080}
                  height={810}
                />
                <span className="timeline-period">Leader</span>
                <h3>Leading Frontend Modernization</h3>
                <p>
                  At Bitwise, I led the migration of legacy Angular apps to
                  React and Next.js. More importantly, I led a team of six
                  junior and apprentice developers. I introduced accessibility
                  best practices, wrote CI/CD pipelines, and helped a team with
                  almost no professional experience deliver production code
                  with confidence. I also taught evening classes — HTML, CSS,
                  React — because I genuinely enjoy helping people break into
                  this industry.
                </p>
              </div>
            </div>

            {/* Milestone 5 — Pressed Juicery */}
            <div className="timeline-item left">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <span className="timeline-period">Expert</span>
                <h3>Accessibility at Scale</h3>
                <p>
                  At Pressed Juicery, I went deep on accessibility — resolving
                  audit after audit until every screen met WCAG standards. I
                  built shared component libraries, optimized APIs, and
                  co-created tools that marketing and operations teams actually
                  enjoyed using. It was retail e-commerce at scale, and I
                  learned that accessibility isn&rsquo;t a compliance checkbox.
                  It&rsquo;s respect for every person who uses your product.
                </p>
              </div>
            </div>

            {/* Milestone 6 — Hexacomb + photo */}
            <div className="timeline-item right">
              <div className="timeline-dot" aria-hidden="true" />
              <div className="timeline-content">
                <PhotoPlaceholder
                  label="Current / Hexacomb photo"
                  icon={Hexagon}
                  className="wide"
                />
                <span className="timeline-period">Founder</span>
                <h3>Starting Hexacomb</h3>
                <p>
                  Today, I run Hexacomb. I build custom websites, apps, and
                  integrations for local businesses in the Central Valley. I
                  take on projects I believe in, work at a pace that
                  doesn&rsquo;t burn anyone out, and treat every client like a
                  long-term partner — not a transaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── What I Believe ── */}
      <section className="about-values" aria-labelledby="values-heading">
        <div className="container">
          <span className="section-label">What I Believe</span>
          <h2 id="values-heading">
            The principles that guide every project I take on.
          </h2>
          <div className="cards">
            <article className="card">
              <div className="card-icon" aria-hidden>
                <Eye {...iconProps} />
              </div>
              <h3>Accessibility is not a feature.</h3>
              <p>
                It&rsquo;s the baseline. Every site I ship meets WCAG 2.1 AA
                standards — proper landmarks, keyboard navigation,
                screen-reader support, and contrast ratios that don&rsquo;t
                strain eyes. I don&rsquo;t bolt accessibility on at the end.
                It&rsquo;s in every commit.
              </p>
            </article>
            <article className="card">
              <div className="card-icon" aria-hidden>
                <Code {...iconProps} />
              </div>
              <h3>Code should outlast the project.</h3>
              <p>
                I write code that the next developer can read without
                wanting to quit. Clean architecture, meaningful names, no
                clever tricks. You might not care about this — but you will
                when someone needs to update your site in three years and
                doesn&rsquo;t have to rebuild it from scratch.
              </p>
            </article>
            <article className="card">
              <div className="card-icon" aria-hidden>
                <Heart {...iconProps} />
              </div>
              <h3>Speed without burnout.</h3>
              <p>
                I move fast when it matters, but I don&rsquo;t cut corners.
                The high-leverage workflow I use isn&rsquo;t about rushing.
                It&rsquo;s about using modern tooling and pre-built
                foundations so the creative work happens faster — without
                sacrificing quality or burning anyone out in the process.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* ── Trust ── */}
      <section className="about-trust" aria-labelledby="trust-heading">
        <div className="container">
          <span className="section-label">Why Trust Me</span>
          <h2 id="trust-heading">
            I don&rsquo;t take on work I can&rsquo;t do well.
          </h2>
          <div className="about-trust-grid">
            <div className="trust-item">
              <strong>15+ projects shipped, zero abandoned.</strong>
              <p>
                Every project I&rsquo;ve started has made it to launch. I
                don&rsquo;t overpromise and I don&rsquo;t disappear when
                things get complicated.
              </p>
            </div>
            <div className="trust-item">
              <strong>I live here.</strong>
              <p>
                Clovis, California. This isn&rsquo;t a remote freelancer
                three time zones away who might ghost you. I&rsquo;m in your
                community. My reputation is attached to every project.
              </p>
            </div>
            <div className="trust-item">
              <strong>I&rsquo;ll tell you the truth.</strong>
              <p>
                If what you need isn&rsquo;t something I&rsquo;m the right
                fit for, I&rsquo;ll say so. If a Squarespace template would
                serve you better than a custom build, I&rsquo;ll tell you
                that too. I want long-term trust, not a quick sale.
              </p>
            </div>
            <div className="trust-item">
              <strong>I teach, I don&rsquo;t gatekeep.</strong>
              <p>
                Every client I work with walks away understanding their
                site. You&rsquo;ll know how to update content, read your
                analytics, and make small changes without needing to call
                me. I want you to feel ownership, not dependency.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Let's Talk ── */}
      <section className="about-talk" aria-labelledby="talk-heading">
        <div className="container">
          <div className="about-talk-box">
            <MessageCircle size={40} strokeWidth={1.5} aria-hidden />
            <h2 id="talk-heading">Let&rsquo;s have an honest conversation.</h2>
            <p>
              No pressure. No pitch. Just a conversation about where your
              business is, where you want it to go, and whether I can help.
              If I&rsquo;m not the right fit, I&rsquo;ll point you in the
              right direction.
            </p>
            <Link
              href="/#contact"
              className="btn btn-primary"
              data-track="cta_about_reach_out"
            >
              Reach Out →
            </Link>
          </div>
        </div>
      </section>
    </main>
    </>
  );
}
