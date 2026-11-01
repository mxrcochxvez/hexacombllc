export const projectStories = {
  "m5-painting": {
    name: "M5 Painting",
    title: "A painting website with a clear path to an estimate.",
    description:
      "How the M5 Painting website brings painting services, project work and estimate requests together for a Sanger-based business.",
    city: "Sanger, California",
    sector: "Residential & commercial painting",
    url: "https://m5painting.com/",
    image: "/images/cases/m5painting-home.jpg",
    intro:
      "M5 Painting is a family-owned painting business based in Sanger, serving the Central Valley. The website connects a homeowner or commercial customer with the information they need before asking for an estimate.",
    focus:
      "Painting is visual, but photos alone do not answer every question. A visitor also needs to know which services are available, where the company works and how to discuss a job. The site puts those pieces in one browsing path.",
    decisions: [
      {
        heading: "Make the service range easy to find.",
        body: "Dedicated pages explain interior, exterior, residential and commercial painting. The service-area page helps visitors check whether the company covers their location before making contact.",
      },
      {
        heading: "Put the work beside the business information.",
        body: "Project media, a customer-review section and displayed business credentials give visitors more context than a short service list alone. The FAQ adds practical answers without requiring a call for every initial question.",
      },
      {
        heading: "Offer more than one way to ask for an estimate.",
        body: "The website includes an estimate contact form, telephone and email links. This is a request path for discussing the work—not an instant price calculator or a promise of a fixed painting price.",
      },
    ],
    takeaway:
      "For a local contractor, useful website content connects the service, the evidence of the work and the next step. M5’s site shows that pattern through service pages, project media and direct estimate options.",
    relatedSlug: "the-bug-dude",
    relatedName: "The Bug Dude Fresno",
  },
  "the-bug-dude": {
    name: "The Bug Dude Fresno",
    title: "Local pest-control information. Direct ways to get help.",
    description:
      "A look at The Bug Dude website: pest and property-service pages, coverage information and direct call, text, booking and estimate options.",
    city: "Fresno & Madera counties",
    sector: "Pest control",
    url: "https://www.thebugdudepestcontrol.com/",
    image: "/images/cases/thebugdude-home.jpg",
    intro:
      "The Bug Dude serves homes, rentals and commercial properties in Fresno and Madera counties. Its website gives visitors different ways to explore a pest problem, check the service area and contact the business.",
    focus:
      "A homeowner with a pest problem and a commercial property manager do not necessarily need the same information. The website separates service details while keeping direct contact options available.",
    decisions: [
      {
        heading: "Organize by the work people need.",
        body: "The site includes commercial services, a general services page and pest-specific pages for problems such as bed bugs, cockroaches and rodents. These pages give a visitor a more useful starting point than a single generic pest-control description.",
      },
      {
        heading: "Show where the company works.",
        body: "Service-area information identifies Fresno and Madera counties. Field photos and video, frequently asked questions and links to Google and Yelp reviews add context about the business and its work.",
      },
      {
        heading: "Keep the next step direct.",
        body: "Call, text and booking links sit alongside an estimate request form. A visitor can choose a contact method instead of being forced through one long route before reaching the company.",
      },
    ],
    takeaway:
      "A service website can support different customers without making navigation complicated. Clear service categories, honest coverage information and practical contact options are the useful pattern here—not an unverified promise about rankings or lead volume.",
    relatedSlug: "m5-painting",
    relatedName: "M5 Painting",
  },
} as const;
export type ProjectStorySlug = keyof typeof projectStories;
