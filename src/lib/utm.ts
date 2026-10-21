/** Only explicitly tagged campaign fields are kept, not arbitrary URL data. */
export type UtmAttribution = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
};

export const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

/** Sanitize values from browsers and untrusted form requests. */
export function sanitizeUtm(input: unknown): UtmAttribution | undefined {
  if (!input || typeof input !== "object" || Array.isArray(input)) return undefined;
  const raw = input as Record<string, unknown>;
  const cleaned: UtmAttribution = {};
  for (const key of UTM_KEYS) {
    if (typeof raw[key] !== "string") continue;
    const value = (raw[key] as string).trim().slice(0, 150);
    if (value) cleaned[key] = value;
  }
  return Object.keys(cleaned).length ? cleaned : undefined;
}
