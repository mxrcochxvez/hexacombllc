/** One switch restores ALL original copy, artwork, colors, and effects.
 * Change to "default" and rebuild after Halloween. No dates or visitor state.
 */
export const SITE_THEME = "default" as "halloween" | "default";
export const isHalloween = SITE_THEME === "halloween";

export function seasonalCopy(original: string, halloween: string): string {
  return isHalloween ? halloween : original;
}

const headlines: Record<string, string> = {
  "Your website should be owned by someone who knows your business.": "A real human behind the magic.",
  "The design keeps going until you like it. Then the site goes live. Then we talk every month.": "From a spark of an idea to a site with a pulse.",
  "Choose the level of website support that fits your business.": "Less website fright. More business life.",
  "See what your website is leaving on the table.": "Find out what’s haunting your website.",
  "Your cause deserves a face.": "Bring your mission into the light.",
  "A better website, explained plainly.": "Good ideas. No dark arts required.",
};

export function seasonalHeadline(original: string): string {
  return isHalloween ? headlines[original] ?? original : original;
}
