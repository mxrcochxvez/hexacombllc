/** Exact customer feedback supplied and approved by the site owner.
 * Optional sourceUrl is only for an actual public review, never a company homepage.
 * Do not invent ratings, dates, names, photos or additional claims.
 */
export type Testimonial = {
  quote: string;
  name: string;
  company?: string;
  photo?: string;
  sourceUrl?: string;
  approvedForPublication: boolean;
};
export const testimonials: Testimonial[] = [
  {
    name: "Christian",
    company: "Unreelviews",
    quote: "he made it easy.",
    approvedForPublication: true,
  },
  {
    name: "AAC Painters",
    quote: "Your work is badass, my new website is 🔥",
    approvedForPublication: true,
  },
  {
    name: "Bug Dude Fresno",
    quote: "Thank you for always updating me about my websites performance",
    approvedForPublication: true,
  },
  {
    name: "M5 Painting",
    quote: "we got leads the next day after you finished our website!",
    approvedForPublication: true,
  },
];
