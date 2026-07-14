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
  DESIGN_DEMO_STATUSES,
  DESIGN_DEMO_STATUS_LABELS,
  isDesignDemoStatus,
} from "../../convex/statuses";

export type {
  LeadStatus,
  ContractStatus,
  ClientPhase,
  DesignDemoStatus,
} from "../../convex/statuses";
