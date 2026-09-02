export const SPACE = {
  0: 0,
  1: 4,
  2: 8,
  3: 12,
  4: 16,
  5: 20,
  6: 24,
  8: 32,
  10: 40,
  12: 48,
  16: 64,
  20: 80,
  24: 96,
} as const;

export type SpaceStep = keyof typeof SPACE;
export type SpacePx = (typeof SPACE)[SpaceStep];

export function px(step: SpaceStep): SpacePx {
  return SPACE[step];
}

export function spaceVar(step: SpaceStep): string {
  return `var(--space-${step})`;
}
