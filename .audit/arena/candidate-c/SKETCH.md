# Sketch. Role-owned spacing kit

Types and signatures follow [USAGE.md](./USAGE.md). If they disagree, change this file.

## Invariants

1. Every padding, margin, and gap in `src/` is a named 4px-increment step or a semantic role that resolves to one.
2. Page authors can only name roles, and only the roles that layout component accepts. A section pad is not a legal stack gap.
3. `SPACE` in TypeScript is the only list of pixel values. Theme CSS is generated from it. Hand-edited spacing tokens are a bug.
4. Density remaps roles. It does not add components.
5. `globals.css` is deleted, not wrapped. `.btn` has no alias.

Hairline borders and outline thickness are not spacing. 1px and 3px focus rings stay allowed. `check:space` does not treat `border-width` as a violation.

## Scale (construction)

Steps are 4px increments. The set is curated (not every integer) so adjacent values are distinguishable.

```ts
// src/ui/space.ts

/** Pixel lengths on the 4px grid. The only numeric spacing that exists. */
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
  throw new Error("not implemented");
}

export function spaceVar(step: SpaceStep): string {
  // `--space-4` etc.
  throw new Error("not implemented");
}
```

There is no `SpaceStep` on any public component prop.

## Roles (what layout means)

```ts
// src/ui/roles.ts

export type Density = "persuade" | "operate";

/**
 * Semantic spacing. Pages pick these only through the matching component.
 * Values are SpaceStep indexes into SPACE.
 */
export type SpaceRole =
  | "flush"
  | "tight"
  | "cluster"
  | "stack"
  | "inset"
  | "section"
  | "hero"
  | "gutter";

export const ROLE_STEP: Record<
  Density,
  Record<SpaceRole, SpaceStep>
> = {
  operate: {
    flush: 0,
    tight: 2,     // 8
    cluster: 3,   // 12
    stack: 4,     // 16
    inset: 4,     // 16
    section: 10,  // 40  (today's dash vertical rhythm)
    hero: 12,     // 48
    gutter: 10,   // 40  (growth-shell 2.5rem)
  },
  persuade: {
    flush: 0,
    tight: 2,     // 8
    cluster: 4,   // 16
    stack: 6,     // 24
    inset: 8,     // 32
    section: 20,  // 80  (today's section padding, snapped)
    hero: 24,     // 96
    gutter: 10,   // 40
  },
};

/** CSS custom properties `--space-flush` … `--space-gutter` for the active density. */
export function roleVars(density: Density): Record<string, string> {
  throw new Error("not implemented");
}
```

Access pattern. Read `ROLE_STEP[density][role]`, then `SPACE[step]`. No reverse map, no stringly pixel parse.

## Public component types

Narrow gap/pad unions encode "section vs stack vs cluster" in the component you chose.

```ts
// src/ui/types.ts
import type { ReactNode } from "react";
import type { Density } from "./roles";

export type PageProps = {
  density: Density;
  children: ReactNode;
};

export type SectionPad = "flush" | "section" | "hero";

export type SectionProps = {
  pad?: SectionPad; // default "section"
  labeledBy?: string;
  children: ReactNode;
};

export type StackGap = "tight" | "stack";

export type StackProps = {
  gap?: StackGap; // default "stack"
  children: ReactNode;
};

export type ClusterGap = "tight" | "cluster";

export type ClusterProps = {
  gap?: ClusterGap; // default "cluster"
  children: ReactNode;
};

export type PanelProps = {
  children: ReactNode;
};

export type ButtonIntent = "solid" | "signal" | "quiet";

type ButtonShared = {
  intent?: ButtonIntent; // default "solid"
  pending?: boolean;
  children: ReactNode;
};

export type ButtonAsButton = ButtonShared &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, "className"> & {
    href?: undefined;
  };

export type ButtonAsLink = ButtonShared & {
  href: string;
  type?: never;
};

export type ButtonProps = ButtonAsButton | ButtonAsLink;

export type FieldProps = {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode; // one native control
};
```

`className` is omitted on `Button` so pages cannot smuggle `p-8`. Chrome exceptions live in `brand.css` with `var(--space-*)`.

Do not add `size`, `density`, or `padPx` to `Button`. Density inherits from `Page`.

## Signatures (bodies not implemented)

```tsx
// src/ui/Page.tsx
export function Page(_props: PageProps): React.JSX.Element {
  // TODO set data-density on a wrapper. CSS variables on :root[data-density]
  // already exist from generated theme; this attribute selects the map.
  throw new Error("not implemented");
}

// src/ui/Section.tsx
export function Section(_props: SectionProps): React.JSX.Element {
  // TODO <section data-pad> with .ui-section. Inner .growth-shell width
  // using padding-inline: var(--space-gutter) and max-width 78rem.
  throw new Error("not implemented");
}

// src/ui/Stack.tsx
export function Stack(_props: StackProps): React.JSX.Element {
  // TODO flex column, gap: var(--space-{gap})
  throw new Error("not implemented");
}

// src/ui/Cluster.tsx
export function Cluster(_props: ClusterProps): React.JSX.Element {
  // TODO flex row wrap, align center, gap: var(--space-{gap})
  throw new Error("not implemented");
}

// src/ui/Panel.tsx
export function Panel(_props: PanelProps): React.JSX.Element {
  // TODO background surface, border border-color, padding var(--space-inset)
  throw new Error("not implemented");
}

// src/ui/Button.tsx
export function Button(_props: ButtonProps): React.JSX.Element {
  // TODO solid = ink on canvas text (growth-button).
  // signal = yellow (growth-button-signal).
  // quiet = text link weight, no chrome fill.
  // min-height var(--space-12) = 48px. Horizontal pad var(--space-4).
  // If href, render next/link. If pending, aria-busy and disable.
  throw new Error("not implemented");
}

// src/ui/Field.tsx
export function Field(_props: FieldProps): React.JSX.Element {
  // TODO Stack gap="tight". Label htmlFor derived.
  // Clone child to merge id, aria-invalid, aria-describedby.
  // Error as role="alert".
  throw new Error("not implemented");
}

// src/ui/index.ts
export { Page } from "./Page";
export { Section } from "./Section";
export { Stack } from "./Stack";
export { Cluster } from "./Cluster";
export { Panel } from "./Panel";
export { Button } from "./Button";
export { Field } from "./Field";
export type { Density } from "./roles";
export type { ButtonIntent, ButtonProps, FieldProps } from "./types";
// Do not export SPACE, SpaceStep, ROLE_STEP, px, spaceVar.
```

## Generated theme CSS

```ts
// scripts/emit-space-theme.mjs
// Writes src/ui/space.theme.css. Idempotent. Running twice with the same
// space.ts yields a byte-identical file.

export function emitSpaceTheme(_spaceModuleUrl: string): string {
  // TODO for each SpaceStep, `--space-N: {px}px;`
  // TODO under [data-density="operate"] and [data-density="persuade"],
  // `--space-flush` … `--space-gutter` from ROLE_STEP.
  // TODO @theme { --spacing-N: var(--space-N) } for integer utilities that
  // match the scale. Do not emit 2.5 / 3.5 keys.
  throw new Error("not implemented");
}
```

`brand.css` keeps `@import "tailwindcss"`, fonts, colors, growth chrome. It `@import`s `../ui/space.theme.css`. Growth chrome replaces hardcoded `2.5rem` / `2rem` / `0.8rem` pads with `var(--space-gutter)`, `var(--space-8)`, `var(--space-4)`.

Snap growth button padding to the scale (16px / 48px min-height). Keep ink, signal, square corners, Archivo/Public Sans.

## Lever

```js
// scripts/check-space.mjs
// npm run check:space
//
// Scan src/**/*.{css,ts,tsx} except src/ui/space.theme.css (generated).
// Fail the process on the first file that violates, printing path:line.
//
// Hits (spacing only):
//   - CSS padding|margin|gap|inset|row-gap|column-gap with px, rem, em, vw,
//     clamp(), or hex-unrelated literals other than 0, auto, inherit,
//     and var(--space-…)
//   - Tailwind p-|m-|gap-|inset-|space-x-|space-y- including arbitrary
//     values […] and fractions (2.5, 3.5, 0.5)
//   - Integer Tailwind spacing whose key is not in SPACE (p-7, gap-11)
//   - style={{ padding|margin|gap: … }} in TSX
//
// Allow:
//   - 0, auto
//   - var(--space-*)
//   - Tailwind p-0 … keys that exist on SPACE
//   - border / outline / translate (not spacing)
//   - src/ui/space.ts numbers (the source of truth)
//
// Do not try to "understand" comments. A commented `padding: 80px` still fails
// until it is gone. Deletion is the fix.

function checkSpace(_root = "src") {
  throw new Error("not implemented");
}
```

Wire `check:space` in `package.json` and as a CI step beside `npm run lint`. Optionally add ESLint `no-restricted-syntax` for `JSXAttribute[name.name='style']` containing padding. The script is the source of pass/fail. ESLint is extra noise at the caret.

## Module map

```
src/ui/                 knowledge: the scale, roles, shared controls
  space.ts              SPACE table, px(), spaceVar()
  roles.ts              Density, SpaceRole, ROLE_STEP
  types.ts              public prop types
  space.theme.css       generated, do not edit
  Page.tsx
  Section.tsx
  Stack.tsx
  Cluster.tsx
  Panel.tsx
  Button.tsx
  Field.tsx
  index.ts              public exports only
src/app/brand.css       look (color, type, growth chrome) + import theme
src/app/layout.tsx      import brand.css only (globals.css gone)
scripts/emit-space-theme.mjs
scripts/check-space.mjs
```

No `src/ui/migrate/` folder. No `LegacyButton`. Migration is a procedure. Inventory callers of `.btn`, `.dash-*`, `.form-group`, `.audit-*`, `.contract-shell`, `.review-*`, `.blog-*`, `.container`. Rewrite each route onto `@/ui`. Delete the selector. When `globals.css` is empty of used rules, delete the file.

Navbar and Footer stay in `src/components/` and consume `Button` / `Cluster` plus growth type classes. They are not a second kit.

## Data flow

```
SPACE  --emit-->  space.theme.css  --import-->  brand.css
ROLE_STEP[density] --css--> --space-section etc. on [data-density]
Page density attr --selects--> those role variables
Section|Stack|Cluster|Panel --read--> var(--space-{role})
check-space --reads--> SPACE keys + src/ files  --fail--> off-scale
```

One number changes in `space.ts`. Emit. Check. Callers do not update.

## Deliberately absent

- React context for density (CSS inheritance is enough)
- `sx` / `css` / `p={4}` style props
- Card, Badge, Table, Modal, Tabs
- `gap: SpaceStep` on public components
- Wrappers that re-export `.growth-button` as `Button` with the same className-only API
- DESIGN.md fonts, hue 75, 72rem, 6px radius
