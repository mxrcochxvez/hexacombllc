/**
 * Single source of truth for lead + contract status values, labels, and
 * allowed lead pipeline transitions. Used by Convex validators, dashboard UI,
 * and API validation.
 */

export const LEAD_STATUSES = [
  "fresh",
  "contacted",
  "qualified",
  "proposal_sent",
  "negotiating",
  "contracted",
  "lost",
  "nurture",
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  fresh: "Fresh",
  contacted: "Contacted",
  qualified: "Qualified",
  proposal_sent: "Proposal sent",
  negotiating: "Negotiating",
  contracted: "Client",
  lost: "Lost",
  nurture: "Nurture",
};

/** Allowed next statuses from each status (same-status no-ops are always allowed). */
export const LEAD_STATUS_TRANSITIONS: Record<
  LeadStatus,
  readonly LeadStatus[]
> = {
  fresh: ["contacted", "lost", "nurture"],
  contacted: ["qualified", "lost", "nurture"],
  qualified: ["proposal_sent", "lost", "nurture"],
  proposal_sent: ["negotiating", "contracted", "lost", "nurture"],
  negotiating: ["contracted", "lost", "nurture"],
  contracted: [],
  lost: ["contacted", "qualified", "nurture", "lost"],
  nurture: ["contacted", "qualified", "nurture", "lost"],
};

export function isLeadStatus(value: string): value is LeadStatus {
  return (LEAD_STATUSES as readonly string[]).includes(value);
}

export function canTransitionLeadStatus(
  from: LeadStatus,
  to: LeadStatus,
): boolean {
  if (from === to) return true;
  return LEAD_STATUS_TRANSITIONS[from].includes(to);
}

/** Options for a typed status select, including the current value. */
export function leadStatusSelectOptions(
  current: LeadStatus,
): Array<{ value: LeadStatus; label: string }> {
  const allowed = new Set<LeadStatus>([
    current,
    ...LEAD_STATUS_TRANSITIONS[current],
  ]);
  return LEAD_STATUSES.filter((s) => allowed.has(s)).map((value) => ({
    value,
    label: LEAD_STATUS_LABELS[value],
  }));
}

/**
 * When a contract is sent for review: move to proposal_sent unless the lead is
 * already negotiating or contracted (or already proposal_sent).
 */
export function statusAfterContractSend(
  current: LeadStatus,
): LeadStatus | null {
  if (
    current === "proposal_sent" ||
    current === "negotiating" ||
    current === "contracted"
  ) {
    return null;
  }
  return "proposal_sent";
}

export const CONTRACT_STATUSES = ["draft", "sent", "signed"] as const;

export type ContractStatus = (typeof CONTRACT_STATUSES)[number];

export const CONTRACT_STATUS_LABELS: Record<ContractStatus, string> = {
  draft: "Draft",
  sent: "Sent for review",
  signed: "Signed",
};

export function isContractStatus(value: string): value is ContractStatus {
  return (CONTRACT_STATUSES as readonly string[]).includes(value);
}

export const CLIENT_PHASES = [
  "design",
  "build",
  "review",
  "live",
  "paused",
] as const;

export type ClientPhase = (typeof CLIENT_PHASES)[number];

export const CLIENT_PHASE_LABELS: Record<ClientPhase, string> = {
  design: "Design",
  build: "Build",
  review: "Review",
  live: "Live",
  paused: "Paused",
};

export function isClientPhase(value: string): value is ClientPhase {
  return (CLIENT_PHASES as readonly string[]).includes(value);
}
