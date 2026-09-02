import type { LeadStatus } from "@/lib/statuses";

/** Stage tags — names must match systeme.io Tags exactly. */
export const LEAD_STATUS_TAGS: Record<LeadStatus, string> = {
  fresh: "lead_fresh",
  contacted: "lead_contacted",
  qualified: "lead_qualified",
  proposal_sent: "lead_proposal_sent",
  negotiating: "lead_negotiating",
  contracted: "lead_contracted",
  lost: "lead_lost",
  nurture: "lead_nurture",
};

export const SOURCE_TAGS = {
  contact: "source_contact",
  intake: "source_intake",
} as const;

export type LeadSourceTag = keyof typeof SOURCE_TAGS;

/** Custom + standard contact field slugs used for Hexacomb sync. */
export const SYSTEME_FIELD_DEFS: Array<{ slug: string; fieldName: string }> = [
  { slug: "website", fieldName: "Website" },
  { slug: "industry", fieldName: "Industry" },
  { slug: "has_existing_website", fieldName: "Has existing website" },
  { slug: "goal", fieldName: "Goal" },
  { slug: "page_count", fieldName: "Page count" },
  { slug: "visitors", fieldName: "Monthly visitors" },
  { slug: "features", fieldName: "Features" },
  { slug: "timeline", fieldName: "Timeline" },
  { slug: "notes", fieldName: "Notes" },
  { slug: "message", fieldName: "Message" },
  { slug: "hexacomb_lead_id", fieldName: "Hexacomb lead ID" },
  { slug: "temperature", fieldName: "Temperature" },
  { slug: "hexacomb_status", fieldName: "Hexacomb status" },
];

export function statusFromLeadTag(tagName: string): LeadStatus | null {
  const entry = Object.entries(LEAD_STATUS_TAGS).find(
    ([, name]) => name === tagName,
  );
  return entry ? (entry[0] as LeadStatus) : null;
}

export function splitName(fullName: string): {
  firstName: string;
  surname: string;
} {
  const trimmed = fullName.trim();
  const space = trimmed.indexOf(" ");
  if (space === -1) {
    return { firstName: trimmed, surname: "" };
  }
  return {
    firstName: trimmed.slice(0, space).trim(),
    surname: trimmed.slice(space + 1).trim(),
  };
}
