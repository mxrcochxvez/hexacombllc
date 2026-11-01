/** Publish only genuine, approved customer feedback. Empty means no testimonial UI.
 * Add the exact quote, real attribution, optional local photo and public source.
 * Never seed this collection with sample people, ratings or invented statements.
 */
export type Testimonial = {
  quote: string;
  name: string;
  company?: string;
  photo?: string;
  sourceUrl: string;
  approvedForPublication: boolean;
};
export const testimonials: Testimonial[] = [];
