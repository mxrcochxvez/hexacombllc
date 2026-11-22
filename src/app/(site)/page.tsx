import type { Metadata } from "next";
import AgencyHome from "@/components/AgencyHome";
import { pageSocialMetadata } from "@/lib/seo";
// Refresh the hosted-blog previews periodically without rebuilding the site.
export const revalidate = 3600;

const title = "Fresno & Clovis Web Design & Local SEO Agency";
const description =
  "Custom websites for Fresno, Clovis & Central Valley small businesses—without agency overhead. Work directly with Marco on design, local SEO and care.";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/" },
  ...pageSocialMetadata("/", `${title} | Hexacomb`, description),
};
const services = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Service",
      "@id": "https://hexacombllc.com/#website-design",
      name: "Website design and development",
      serviceType: "Website design",
      description: "Website design, copy and development for small businesses.",
      provider: { "@id": "https://hexacombllc.com/#organization" },
      url: "https://hexacombllc.com/website-design",
      areaServed: ["Fresno", "Clovis", "California Central Valley"],
    },
    {
      "@type": "Service",
      "@id": "https://hexacombllc.com/#local-seo",
      name: "Local SEO and website optimization",
      description:
        "Local SEO, useful service pages and clear business information.",
      provider: { "@id": "https://hexacombllc.com/#organization" },
      url: "https://hexacombllc.com/local-seo",
      areaServed: ["Fresno", "Clovis", "California Central Valley"],
    },
    {
      "@type": "Service",
      "@id": "https://hexacombllc.com/#website-care",
      name: "Ongoing website care",
      description:
        "Website hosting, maintenance, updates and practical reporting.",
      provider: { "@id": "https://hexacombllc.com/#organization" },
      url: "https://hexacombllc.com/pricing",
    },
    {
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Is Hexacomb right for a small local business?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "That’s who I built Hexacomb for. I work with owners who are serious about their work, whether they’re starting out, replacing an outdated site, or ready to look more established online.",
          },
        },
        {
          "@type": "Question",
          name: "Do I need to know anything about websites or SEO?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Not at all. Tell me about your customers, what you do, and what isn’t working. I’ll explain the options in plain English and recommend a sensible first step.",
          },
        },
        {
          "@type": "Question",
          name: "Is the website included in the monthly plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "A new website is a one-time project with a clear quote before we start. Hosting and ongoing care are separate monthly plans; the level of ongoing Google search work depends on the plan. You can see the options before committing.",
          },
        },
        {
          "@type": "Question",
          name: "Do you only work in Clovis?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "I’m based in Clovis and work with businesses across Fresno and the Central Valley. I work directly with every owner, so you know who’s designing the site and who’s looking after it.",
          },
        },
      ],
    },
  ],
};
export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }}
      />
      <AgencyHome />
    </>
  );
}
