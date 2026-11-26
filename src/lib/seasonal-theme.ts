/** One switch restores ALL original copy, artwork, colors, and effects.
 * Change to "default" (or revert the Thanksgiving commit) to restore.
 */
export const SITE_THEME = "thanksgiving" as
  | "halloween"
  | "thanksgiving"
  | "default";
export const isHalloween = SITE_THEME === "halloween";
export const isThanksgiving = SITE_THEME === "thanksgiving";

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
