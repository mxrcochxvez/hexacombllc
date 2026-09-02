import type { SpaceStep } from "./space";

export type Density = "persuade" | "operate";

export type SpaceRole =
  | "flush"
  | "tight"
  | "cluster"
  | "stack"
  | "inset"
  | "section"
  | "hero"
  | "gutter";

export const ROLE_STEP: Record<Density, Record<SpaceRole, SpaceStep>> = {
  operate: {
    flush: 0,
    tight: 2,
    cluster: 3,
    stack: 4,
    inset: 4,
    section: 10,
    hero: 12,
    gutter: 10,
  },
  persuade: {
    flush: 0,
    tight: 2,
    cluster: 4,
    stack: 6,
    inset: 8,
    section: 20,
    hero: 24,
    gutter: 10,
  },
};
