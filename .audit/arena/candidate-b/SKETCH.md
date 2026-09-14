# Lattice UI — type sketch

**Lattice** = typed 4px space registry + density resolver + layout primitives. Pages talk in tokens; only `src/ui/space/` holds pixel math.

---

## Module map

```
src/ui/
  index.ts                 # public barrel — primitives + DensityProvider only
  density/
    DensityContext.tsx     # React context: "persuade" | "operate"
    DensityProvider.tsx
  space/
    scale.ts               # STEPS map (sole numeric source) — NOT exported from index
    roles.ts               # ROLE_TABLE: mode × role → Step
    resolve.ts             # resolveSpace(token, mode) → `${n}px`
    types.ts               # SpaceStep, SpaceRole, SpaceToken, SpacingProps
    codegen.ts             # buildLatticeCss() → writes lattice.css at build/predev
  primitives/
    Stack.tsx
    Inline.tsx
    Box.tsx
    Shell.tsx
    Grid.tsx
    Text.tsx
    Button.tsx
    Field.tsx
    Input.tsx
    Textarea.tsx
    Table.tsx
    …
  theme/
    growth.css             # @theme colors/fonts, primitive surface styles
    lattice.css            # generated: --lat-{step} custom props (build artifact)
  lint/
    no-raw-spacing.mjs     # ESLint rule implementation
scripts/
  lattice-codegen.mjs      # `node scripts/lattice-codegen.mjs` → lattice.css
```

**Load-bearing boundary:** `src/app/**` and `src/components/**` import `@/ui` only. `src/ui/space/*` is private. ESLint enforces the fence.

---

## Core types (`src/ui/space/types.ts`)

```typescript
/** Multiples of 4px. Off-scale values are unrepresentable. */
export type SpaceStep = 1 | 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 | 24;

export type SpaceRole =
  | "xs"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "section"
  | "hero"
  | "page"
  | "gutter";

export type SpaceToken = SpaceStep | SpaceRole;

export type DensityMode = "persuade" | "operate";

/** Props shared by layout primitives */
export type SpacingProps = {
  p?: SpaceToken;
  px?: SpaceToken;
  py?: SpaceToken;
  pt?: SpaceToken;
  pr?: SpaceToken;
  pb?: SpaceToken;
  pl?: SpaceToken;
  m?: SpaceToken;
  mx?: SpaceToken;
  my?: SpaceToken;
  mt?: SpaceToken;
  mr?: SpaceToken;
  mb?: SpaceToken;
  ml?: SpaceToken;
  gap?: SpaceToken;
};

export type ShellWidth = "content" | "wide" | "full";
// content → min(100% - gutter×2, 78rem) — matches growth-shell
// wide    → min(100% - gutter×2, 96rem) — dashboard tables
// full    → 100%
```

```typescript
// Branded CSS value — pages never construct this
declare const LatticeCssLength: unique symbol;
export type LatticeCssLength = string & { readonly [LatticeCssLength]: never };
```

---

## Scale registry (`src/ui/space/scale.ts`)

```typescript
/** SINGLE SOURCE OF TRUTH for pixel magnitudes. */
export const STEPS: Readonly<Record<SpaceStep, number>> = {
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

export function stepToPx(step: SpaceStep): number {
  return STEPS[step];
}

export function assertSpaceStep(n: number): asserts n is SpaceStep {
  if (!(n in STEPS)) {
    throw new Error(`Off-scale space step: ${n}. Use SpaceStep or SpaceRole.`);
  }
}
```

---

## Role table (`src/ui/space/roles.ts`)

```typescript
import type { DensityMode, SpaceRole, SpaceStep } from "./types";

export const ROLE_TABLE: Readonly<
  Record<DensityMode, Readonly<Record<SpaceRole, SpaceStep>>>
> = {
  persuade: {
    xs: 2,
    sm: 3,
    md: 6,
    lg: 8,
    xl: 12,
    section: 20,
    hero: 16,
    page: 10,
    gutter: 5,
  },
  operate: {
    xs: 1,
    sm: 2,
    md: 4,
    lg: 6,
    xl: 8,
    section: 12,
    hero: 8,
    page: 6,
    gutter: 4,
  },
} as const;
```

Semantic roles encode **intent**; density encodes **surface class** (marketing vs task UI). One table, not two kits.

---

## Resolver (`src/ui/space/resolve.ts`)

```typescript
import type { DensityMode, SpaceRole, SpaceStep, SpaceToken, LatticeCssLength } from "./types";
import { STEPS } from "./scale";
import { ROLE_TABLE } from "./roles";

function isRole(token: SpaceToken): token is SpaceRole {
  return typeof token === "string";
}

export function resolveStep(token: SpaceToken, mode: DensityMode): SpaceStep {
  if (isRole(token)) return ROLE_TABLE[mode][token];
  return token;
}

export function resolveSpace(token: SpaceToken, mode: DensityMode): LatticeCssLength {
  const step = resolveStep(token, mode);
  return `${STEPS[step]}px` as LatticeCssLength;
}

/** Build style object fragment for primitives — keeps inline styles inside ui/ */
export function spacingStyles(
  props: SpacingProps,
  mode: DensityMode,
): React.CSSProperties {
  const out: React.CSSProperties = {};
  const map: Array<[keyof SpacingProps, keyof React.CSSProperties]> = [
    ["p", "padding"],
    ["px", "paddingInline"],
    ["py", "paddingBlock"],
    ["pt", "paddingTop"],
    ["pr", "paddingRight"],
    ["pb", "paddingBottom"],
    ["pl", "paddingLeft"],
    ["m", "margin"],
    ["mx", "marginInline"],
    ["my", "marginBlock"],
    ["mt", "marginTop"],
    ["mr", "marginRight"],
    ["mb", "marginBottom"],
    ["ml", "marginLeft"],
    ["gap", "gap"],
  ];
  for (const [prop, cssKey] of map) {
    const token = props[prop];
    if (token !== undefined) {
      (out as Record<string, string>)[cssKey] = resolveSpace(token, mode);
    }
  }
  return out;
}
```

Pure functions. No React in this file except the `CSSProperties` type import.

---

## Density context (`src/ui/density/DensityContext.tsx`)

```typescript
"use client";

import { createContext, useContext } from "react";
import type { DensityMode } from "../space/types";

const DensityContext = createContext<DensityMode>("persuade");

export function DensityProvider({
  mode,
  children,
}: {
  mode: DensityMode;
  children: React.ReactNode;
}) {
  return (
    <DensityContext.Provider value={mode}>{children}</DensityContext.Provider>
  );
}

export function useDensity(): DensityMode {
  return useContext(DensityContext);
}
```

Layouts set mode once. Primitives call `useDensity()` internally. Pages never pass `mode` per gap.

---

## Stack primitive (`src/ui/primitives/Stack.tsx`)

```typescript
"use client";

import { forwardRef } from "react";
import type { SpacingProps, SpaceToken } from "../space/types";
import { spacingStyles } from "../space/resolve";
import { useDensity } from "../density/DensityContext";

export type StackProps = SpacingProps & {
  as?: keyof React.JSX.IntrinsicElements;
  direction?: "column" | "row";
  align?: "start" | "center" | "end" | "stretch";
  justify?: "start" | "center" | "end" | "between";
  wrap?: boolean;
  split?: "1-1" | "2-1" | "1-2"; // responsive grid fractions for hero-style layouts
  children: React.ReactNode;
  className?: string; // visual only — no spacing utilities allowed by lint
};

export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  {
    as: Tag = "div",
    direction = "column",
    align,
    justify,
    wrap,
    split,
    gap = "md",
    className,
    children,
    ...spacing
  },
  ref,
) {
  const mode = useDensity();
  const style = {
    display: split ? "grid" : "flex",
    flexDirection: split ? undefined : direction,
    gridTemplateColumns: split ? gridTemplateFor(split) : undefined,
    alignItems: align,
    justifyContent: justify,
    flexWrap: wrap ? "wrap" : undefined,
    ...spacingStyles({ ...spacing, gap }, mode),
  };

  return (
    <Tag ref={ref} className={className} style={style}>
      {children}
    </Tag>
  );
});

function gridTemplateFor(split: NonNullable<StackProps["split"]>): string {
  switch (split) {
    case "2-1":
      return "minmax(0, 2fr) minmax(0, 1fr)";
    case "1-2":
      return "minmax(0, 1fr) minmax(0, 2fr)";
    default:
      return "1fr 1fr";
  }
}
```

`Shell`, `Inline`, `Box`, `Grid` follow the same pattern: merge `spacingStyles` + structural CSS + growth theme classes for color/type.

---

## Shell primitive (`src/ui/primitives/Shell.tsx`)

```typescript
export type ShellProps = {
  as?: keyof React.JSX.IntrinsicElements;
  width?: ShellWidth;
  py?: SpaceToken;
  px?: SpaceToken;
  children: React.ReactNode;
  className?: string;
};

export function Shell({ width = "content", py = "section", px = "gutter", ... }: ShellProps) {
  const mode = useDensity();
  const maxWidth = resolveShellWidth(width, mode);
  // inline maxWidth + horizontal margin auto + spacingStyles
  // className attaches growth surface tokens only (bg-canvas, etc.)
}
```

`resolveShellWidth` uses `STEPS[ROLE_TABLE[mode].gutter]` for horizontal inset and fixed rem caps for content/wide.

---

## Text + Button (visual tokens, spacing internal)

```typescript
export type TextVariant =
  | "display-xl"
  | "display-lg"
  | "heading"
  | "body"
  | "body-lg"
  | "caption"
  | "mono";

export type TextProps = {
  as?: keyof React.JSX.IntrinsicElements;
  variant: TextVariant;
  tone?: "default" | "muted" | "accent" | "danger" | "on-deep";
  block?: boolean;
  children: React.ReactNode;
};

// variant → growth.css class map; NO spacing props on Text

export type ButtonVariant = "signal" | "ink" | "ghost" | "outline" | "danger";
export type ButtonSize = "sm" | "md" | "lg";

const BUTTON_PADDING: Record<ButtonSize, { x: SpaceStep; y: SpaceStep }> = {
  sm: { x: 3, y: 2 },
  md: { x: 4, y: 3 },
  lg: { x: 6, y: 4 },
};
// Button reads density only for font size, not padding — operate/persuade share control sizes
```

Button padding uses **fixed steps** so controls stay familiar across surfaces. Marketing hero uses `size="lg"`; dashboard uses `size="md"`. Density affects **layout rhythm**, not hit-target geometry.

---

## CSS codegen (`src/ui/space/codegen.ts` + `scripts/lattice-codegen.mjs`)

```typescript
export function buildLatticeCss(): string {
  const lines = [":root {"];
  for (const [step, px] of Object.entries(STEPS)) {
    lines.push(`  --lat-${step}: ${px}px;`);
  }
  lines.push("}");
  return lines.join("\n");
}
```

`lattice.css` exists so **non-React islands** (e.g. AgreementTerms HTML port, markdown prose) can use `var(--lat-4)` without inventing px. Still generated from `STEPS`; never hand-edited.

`package.json` addition:

```json
"predev": "node scripts/lattice-codegen.mjs",
"prebuild": "node scripts/lattice-codegen.mjs"
```

---

## Lint lever (`src/ui/lint/no-raw-spacing.mjs`)

Registered in `eslint.config.mjs`:

```javascript
import noRawSpacing from "./src/ui/lint/no-raw-spacing.mjs";

export default defineConfig([
  // ...
  {
    files: ["src/**/*.{ts,tsx}"],
    ignores: ["src/ui/**"],
    plugins: { "hexacomb": { rules: { "no-raw-spacing": noRawSpacing } } },
    rules: { "hexacomb/no-raw-spacing": "error" },
  },
  {
    files: ["src/**/*.css"],
    ignores: ["src/ui/theme/**"],
    rules: { "hexacomb/no-raw-spacing": "error" },
  },
]);
```

Rule checks:

1. JSX `className` containing Tailwind spacing pattern `/(^|\\s)(-?)(p|m|gap|space-[xy])-\\d/`
2. JSX `style` props with `padding|margin|gap` keys whose values match `/\\d+px|\\d+rem/`
3. CSS declarations `padding|margin|gap` with length values not referencing `var(--lat-`

Violations print the nearest `SpaceRole` suggestion from a static lookup table.

**Grandfathering:** `src/ui/lint/spacing-baseline.txt` lists existing violations (glob scan at scaffold time). Rule subtracts baseline until migration clears entries. Baseline file must monotonically shrink; CI fails if it grows.

---

## Public barrel (`src/ui/index.ts`)

```typescript
export { DensityProvider } from "./density/DensityProvider";
export { Stack } from "./primitives/Stack";
export { Inline } from "./primitives/Inline";
export { Box } from "./primitives/Box";
export { Shell } from "./primitives/Shell";
export { Grid } from "./primitives/Grid";
export { Text } from "./primitives/Text";
export { Button } from "./primitives/Button";
export { Field, Input, Textarea } from "./primitives/Field";
export { Table, TableRow, TableCell } from "./primitives/Table";
export type { SpaceToken, SpaceRole, SpaceStep, DensityMode } from "./space/types";
// STEPS, resolveSpace, ROLE_TABLE are NOT exported
```

Exporting `SpaceToken` types lets pages type custom wrappers without accessing pixel math.

---

## Data flow

```
Page passes gap="md"
  → Stack calls useDensity() → "operate"
  → resolveSpace("md", "operate")
  → ROLE_TABLE.operate.md → step 4
  → STEPS[4] → 16
  → style={{ gap: "16px" }}
```

```
Layout sets <DensityProvider mode="persuade">
  → all descendant Stacks resolve roles against persuade column
```

Invariant: **no path from `src/components` to a bare number**. TypeScript rejects invalid tokens at compile time; ESLint rejects escape hatches at lint time.

---

## Deliberately not in v1

- Responsive space tokens (e.g. `md@sm`). Use `Stack split` or a one-off `gap={6}` step until a pattern repeats.
- `className` spacing on primitives. Visual classes only (`tone`, `variant`).
- Third density mode. Two surfaces (persuade/operate) match the product split.
- Re-exporting Tailwind spacing config to pages.
