import type { Metadata } from "next";
import AgencyHome from "@/components/AgencyHome";
import { pageSocialMetadata } from "@/lib/seo";
const title = "Website Design & Local SEO in Fresno & Clovis";
const description =
  "Hexacomb is Marco Chavez’s website-focused marketing agency in Clovis, California. Website design, local SEO and ongoing care for Central Valley businesses.";
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
      url: "https://hexacombllc.com/website-audit",
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
