export {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  LEAD_STATUS_TRANSITIONS,
  canTransitionLeadStatus,
  isLeadStatus,
  leadStatusSelectOptions,
  statusAfterContractSend,
  CONTRACT_STATUSES,
  CONTRACT_STATUS_LABELS,
  isContractStatus,
  CLIENT_PHASES,
  CLIENT_PHASE_LABELS,
  isClientPhase,
} from "../../convex/statuses";

export type {
  LeadStatus,
  ContractStatus,
  ClientPhase,
} from "../../convex/statuses";
