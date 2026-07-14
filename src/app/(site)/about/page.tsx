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
import RevealSection from "@/components/RevealSection";

const baseUrl = "https://hexacombllc.com";
const ogImage = {
  url: "/hexacomb_logo_wordmark.png",
  width: 1200,
  height: 630,
  alt: "Hexacomb — Modern Websites for the Central Valley",
};

export const metadata: Metadata = {
  title: "About Marco — Local Web Developer",
  description:
    "Marco is a web developer based in Clovis, CA, building custom websites for local businesses in the Central Valley. No jargon, no shortcuts — just honest work.",
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
    title: "About Marco — Local Web Developer | Hexacomb",
    description:
      "Marco is a web developer based in Clovis, CA, building custom websites for local businesses in the Central Valley. No jargon, no shortcuts.",
    images: ["/hexacomb_logo_wordmark.png"],
  },
};

const iconProps = { size: 28, strokeWidth: 1.75 };

const milestones = [
  {
    side: "left" as const,
    period: "Before Code",
    title: "Precision in a Chemistry Lab",
    body: "I started at BouMatic testing chemicals, ensuring every batch was within spec and inventory stayed accurate. It was repetitive, precise work — and it taught me the same discipline I bring to software: check your work, stay organized, and never assume anything is \"close enough.\"",
    image: null,
  },
  {
    side: "right" as const,
    period: "Career Start",
    title: "Taught Myself to Code",
    body: "My first real project was a reporting tool for Ordrslip that the Chief Product Officer used to present insights across sales, marketing, and engineering. That project led to a full role on the core dev team, building mobile ordering sites for restaurants nationwide. I learned that good software doesn't just work — it makes someone else's job easier.",
    image: null,
  },
  {
    side: "left" as const,
    period: "Mentor",
    title: "Teaching at Woz U",
    body: "I mentored aspiring developers in JavaScript, C#, and Java — making sure they weren't just completing assignments, but actually understanding what they were building. Teaching forces you to truly know your craft. It also teaches you patience, clarity, and how to communicate technical ideas to non-technical people. Those skills show up in every client conversation I have today.",
    image: null,
  },
  {
    side: "right" as const,
    period: "Leader",
    title: "Leading Frontend Modernization",
    body: "At Bitwise, I led the modernization of outdated websites and apps. More importantly, I led a team of six junior developers. I introduced accessibility best practices, streamlined our build process, and helped a team with almost no professional experience deliver production code with confidence. I also taught evening classes in web development basics — because I genuinely enjoy helping people break into this industry.",
    image: "/images/marco-bitwise.jpg",
  },
  {
    side: "left" as const,
    period: "Expert",
    title: "Accessibility at Scale",
    body: "At Pressed Juicery, I focused on making sure the website worked for everyone — including people with disabilities. I built reusable website components, sped up load times, and co-created tools that marketing and operations teams actually enjoyed using. It was retail e-commerce at scale, and I learned that accessibility isn't a compliance checkbox. It's respect for every person who uses your product.",
    image: null,
  },
  {
    side: "right" as const,
    period: "Founder",
    title: "Starting Hexacomb",
    body: "Today, I run Hexacomb. I build custom websites, apps, and integrations for local businesses in the Central Valley. I take on projects I believe in, work at a pace that doesn't burn anyone out, and treat every client like a long-term partner — not a transaction.",
    image: null,
    featured: true,
  },
];

const values = [
  {
    icon: <Eye {...iconProps} />,
    title: "Accessibility is not a feature.",
    body: "It's the baseline. Every site I ship works with screen readers, keyboard navigation, and text large enough for everyone to read comfortably. I don't bolt accessibility on at the end. It's built in from day one.",
  },
  {
    icon: <Code {...iconProps} />,
    title: "Code should outlast the project.",
    body: "I write code that the next developer can read without wanting to quit. Clean architecture, meaningful names, no clever tricks. You might not care about this — but you will when someone needs to update your site in three years and doesn't have to rebuild it from scratch.",
  },
  {
    icon: <Heart {...iconProps} />,
    title: "Speed without burnout.",
    body: "I move fast when it matters, but I don't cut corners. The high-leverage workflow I use isn't about rushing. It's about using modern tooling and pre-built foundations so the creative work happens faster — without sacrificing quality or burning anyone out in the process.",
  },
];

const trustItems = [
  {
    title: "15+ projects shipped, zero abandoned.",
    body: "Every project I've started has made it to launch. I don't overpromise and I don't disappear when things get complicated.",
  },
  {
    title: "I live here.",
    body: "Clovis, California. This isn't a remote freelancer three time zones away who might ghost you. I'm in your community. My reputation is attached to every project.",
  },
  {
    title: "I'll tell you the truth.",
    body: "If what you need isn't something I'm the right fit for, I'll say so. If a Squarespace template would serve you better than a custom build, I'll tell you that too. I want long-term trust, not a quick sale.",
  },
  {
    title: "I teach, I don't gatekeep.",
    body: "Every client I work with walks away understanding their site. You'll know how to update content, read your analytics, and make small changes without needing to call me. I want you to feel ownership, not dependency.",
  },
];

export default function About() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": `${baseUrl}/about#person`,
        name: "Marco",
        jobTitle: "Web Developer",
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
          "Web developer based in Clovis, CA, building custom websites for local businesses in the Central Valley.",
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
        {/* ── Hero ── */}
        <section className="about-hero-v2 hex-bg" aria-labelledby="about-heading">
          <div className="container about-hero-grid">
            <div className="about-hero-photo">
              <Image
                src="/images/marco-portrait.jpg"
                alt="Portrait of Marco"
                className="about-portrait"
                width={340}
                height={454}
                priority
              />
            </div>
            <div className="about-hero-text">
              <p className="brand-kicker">The person behind the work</p>
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
          <div className="hero-ornament hero-ornament-1" aria-hidden />
          <div className="hero-ornament hero-ornament-2" aria-hidden />
        </section>

        {/* ── Timeline ── */}
        <RevealSection className="about-timeline" ariaLabelledBy="story-heading">
          <div className="container">
            <p className="brand-kicker">How I Got Here</p>
            <h2 id="story-heading">I didn&rsquo;t take the usual path.</h2>

            <div className="timeline">
              <div className="timeline-line" aria-hidden="true" />

              {milestones.map((m, i) => (
                <div
                  key={m.title}
                  className={`timeline-item ${m.side} reveal-item`}
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <div className="timeline-dot" aria-hidden="true" />
                  <div className={`timeline-content ${m.featured ? "timeline-content--featured" : ""}`}>
                    {m.image && (
                      <Image
                        src={m.image}
                        alt="Marco with the Bitwise team"
                        className="timeline-photo"
                        width={1080}
                        height={810}
                      />
                    )}
                    {m.featured && (
                      <div className="hexacomb-visual" aria-hidden="true">
                        <div className="hexacomb-orbital" />
                        <div className="hexacomb-glow" />
                        <Hexagon size={52} strokeWidth={1.5} />
                      </div>
                    )}
                    {m.featured && <span className="badge-current">Current</span>}
                    <span className="timeline-period">{m.period}</span>
                    <h3>{m.title}</h3>
                    <p>{m.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── Values ── */}
        <RevealSection className="about-values" ariaLabelledBy="values-heading">
          <div className="container">
            <p className="brand-kicker">What I Believe</p>
            <h2 id="values-heading">
              The principles that guide every project I take on.
            </h2>
            <div className="cards">
              {values.map((v, i) => (
                <article
                  className="card reveal-item"
                  key={v.title}
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <div className="card-icon" aria-hidden>
                    {v.icon}
                  </div>
                  <h3>{v.title}</h3>
                  <p>{v.body}</p>
                </article>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── Trust ── */}
        <RevealSection className="about-trust" ariaLabelledBy="trust-heading">
          <div className="container">
            <p className="brand-kicker">Why Trust Me</p>
            <h2 id="trust-heading">
              I don&rsquo;t take on work I can&rsquo;t do well.
            </h2>
            <div className="about-trust-grid">
              {trustItems.map((item, i) => (
                <div
                  className="trust-item reveal-item"
                  key={item.title}
                  style={{ "--reveal-delay": `${i * 120}ms` } as React.CSSProperties}
                >
                  <strong>{item.title}</strong>
                  <p>{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </RevealSection>

        {/* ── CTA ── */}
        <section className="about-talk" aria-labelledby="talk-heading">
          <div className="container">
            <div className="about-talk-box">
              <MessageCircle size={40} strokeWidth={1.5} aria-hidden />
              <p className="brand-kicker">Start a conversation</p>
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
                Schedule a Free Call →
              </Link>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
