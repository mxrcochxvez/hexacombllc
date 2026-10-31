export type CaseId = "unreelviews" | "thebugdude" | "m5painting" | "aacpainters" | "ruiz";

export type CaseStudy = {
  id: CaseId;
  title: string;
  liveUrl: string;
  imageSrc: string;
  tags: string[];
  summary: string;
  city: string;
  isPreview?: boolean;
  clientDescription: string;
  solutionDescription: string;
  highlights: string[];
};

export const clientCaseStudies: CaseStudy[] = [
  {
    id: "aacpainters",
    title: "AAC Painters Inc.",
    liveUrl: "https://aac-painters.marcode-chavez-jr.workers.dev/",
    imageSrc: "/images/cases/aacpainters-home.jpg",
    tags: ["Painting", "Epoxy flooring", "Estimates"],
    summary: "A colorful home for painting, commercial finishes and epoxy flooring. Clear services, real project work, and an easy next step.",
    city: "Central Valley & Bay Area",
    isPreview: true,
    clientDescription: "AAC Painters offers residential and commercial painting, epoxy flooring and surface services across the Central Valley and Bay Area.",
    solutionDescription: "The website brings their services, project gallery and estimate request into one straightforward browsing experience.",
    highlights: ["Dedicated service pages", "Project photos and videos", "Clear estimate and phone links"],
  },
  {
    id: "ruiz",
    title: "Ruiz Family Enterprises",
    liveUrl: "https://ruiz-ent.marcode-chavez-jr.workers.dev/",
    imageSrc: "/images/cases/ruiz-home.jpg",
    tags: ["Engineering", "Concrete", "Masonry"],
    summary: "Big plans, solid work. A practical showcase for general engineering, concrete and masonry, with the work front and center.",
    city: "Kingsburg, California",
    isPreview: true,
    clientDescription: "Ruiz Family Enterprises is based in Kingsburg and handles general engineering, concrete and masonry projects across the Central Valley.",
    solutionDescription: "The website organizes the service range and project work so visitors can find the right service and discuss their project.",
    highlights: ["Organized service categories", "Project work galleries", "Direct project inquiry links"],
  },
  {
    id: "unreelviews",
    title: "Unreelviews",
    liveUrl: "https://unreelviews.com/",
    imageSrc: "/images/cases/unreelviews-home.jpg",
    tags: ["Brand", "Web", "Video"],
    summary: "A video and positioning studio in Fresno. The site has to feel as sharp as the work.",
    city: "Fresno",
    clientDescription:
      "Unreelviews is a Fresno video production and brand-positioning studio. Their site had to carry the same energy as the films they make, without slowing down on a phone.",
    solutionDescription:
      "We built a custom Next.js site around their velocity offer, with a mobile path that gets a serious inquiry in as few taps as possible.",
    highlights: [
      "Custom offer architecture for their velocity tiers",
      "Fast loading for heavy video embeds",
      "Copy that qualifies the right clients before a call",
    ],
  },
  {
    id: "thebugdude",
    title: "The Bug Dude Fresno",
    liveUrl: "https://www.thebugdudepestcontrol.com/",
    imageSrc: "/images/cases/thebugdude-home.jpg",
    tags: ["Local search", "Web", "Calls"],
    summary: "Pest control in Fresno and Clovis. When something is in the house, the next tap is a phone call.",
    city: "Fresno",
    clientDescription:
      "A Fresno and Clovis pest-control company. People find them in a hurry, usually on a phone, usually after they have already seen the bug.",
    solutionDescription:
      "We designed a one-purpose site: prove they are local, show the service area, and put a call button where a thumb already is.",
    highlights: [
      "Tap-to-call on every screen",
      "Service-area pages for Fresno neighborhoods",
      "Local search markup for the Google map pack",
    ],
  },
  {
    id: "m5painting",
    title: "M5 Painting",
    liveUrl: "https://m5painting.com/",
    imageSrc: "/images/cases/m5painting-home.jpg",
    tags: ["Brand", "Web", "Estimates"],
    summary: "A Sanger painting contractor. Licensed, bonded, and easy to request an estimate from.",
    city: "Sanger",
    clientDescription:
      "M5 Painting is a family painting contractor in Sanger, working homes and commercial jobs across the Central Valley.",
    solutionDescription:
      "We gave them a site that leads with proof (license, insurance, reviews) and an estimate path that does not feel like a form gauntlet.",
    highlights: [
      "Instant estimate path by room and square footage",
      "Trust credentials on the first screen",
      "Before-and-after work in a layout that still loads quickly",
    ],
  },
];
