# Shape sketch — `@/ui` lattice

## Module map

```
src/ui/
  index.ts                 # public exports only
  space.ts                 # SpaceStep, role unions, maps (no runtime CSS)
  density.ts               # Density type + React context
  tokens/
    space.css              # --space-{step} base ladder + semantic aliases
    density.css            # [data-density] inset/section overrides
    brand.css              # colors, fonts, motion (moved from app/brand.css)
    tailwind.css           # @import tailwindcss; @theme spacing from space.css
  primitives/
    Page.tsx
    Section.tsx
    Stack.tsx
    Button.tsx
    Field.tsx
    Panel.tsx
  styles/
    button.css             # variant rules (signal, primary, ghost)
    field.css
    panel.css

scripts/
  check-spacing.mjs        # off-scale spacing gate
  spacing-allowlist.json   # generated from space.ts (single source)

src/app/
  layout.tsx               # imports @/ui/tokens/tailwind.css only (globals.css deleted)
```

Public surface: seven primitives + `Density` context. Everything else is private.

---

## Core types (`src/ui/space.ts`)

```typescript
/** Base ladder: 4px × n. Only these integers exist. */
export const SPACE_STEPS = [
  1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24, 30,
] as const;
export type SpaceStep = (typeof SPACE_STEPS)[number];

/** px = step × 4. Compile-time map, not user input. */
export type SpacePx = {
  readonly [K in SpaceStep]: K extends number ? K extends 30 ? 120 : K extends 24 ? 96 : K extends 20 ? 80
    : K extends 16 ? 64 : K extends 12 ? 48 : K extends 10 ? 40 : K extends 8 ? 32
    : K extends 6 ? 24 : K extends 5 ? 20 : K extends 4 ? 16 : K extends 3 ? 12
    : K extends 2 ? 8 : 4 : never;
};

export const STACK_GAP = ["tight", "default", "loose", "section"] as const;
export type StackGap = (typeof STACK_GAP)[number];

export const INSET = ["sm", "md", "lg"] as const;
export type Inset = (typeof INSET)[number];

export const SECTION_SPACE = ["sm", "md", "lg", "hero"] as const;
export type SectionSpace = (typeof SECTION_SPACE)[number];

export const PAGE_WIDTH = ["full", "shell", "content", "narrow"] as const;
export type PageWidth = (typeof PAGE_WIDTH)[number];

/** Semantic → base step. Single source; CSS aliases generated from this table. */
export const SPACE_ROLE: {
  stack: Record<StackGap, SpaceStep>;
  inset: Record<Inset, SpaceStep>;
  section: Record<SectionSpace, SpaceStep | "clamp">;
} = {
  stack: { tight: 2, default: 4, loose: 6, section: 8 },
  inset: { sm: 3, md: 4, lg: 6 },
  section: { sm: 16, md: 20, lg: 24, hero: "clamp" },
} as const;

export type Density = "persuade" | "operate";
```

`hero` clamp in CSS (endpoints on-scale):

```css
--space-section-hero: clamp(var(--space-16), 8vw, var(--space-24));
```

---

## Primitive signatures

```typescript
// src/ui/density.ts
export const DensityContext: React.Context<Density>;
export function useDensity(): Density;

// src/ui/primitives/Page.tsx
export type PageProps = {
  density: Density;
  width?: PageWidth;
  children: React.ReactNode;
  /** Non-spacing only (typography, color). Spacing classes stripped by lint. */
  className?: string;
};
export function Page(props: PageProps): JSX.Element;
// Renders: <div data-density={density} data-ui-page data-width={width}>

// src/ui/primitives/Section.tsx
export type SectionProps = {
  space: SectionSpace;
  width?: PageWidth;
  as?: "section" | "div" | "article" | "header" | "footer";
  children: React.ReactNode;
  className?: string;
};
export function Section(props: SectionProps): JSX.Element;
// Applies block-axis padding from --space-section-{space}; zeroes legacy global section { padding: 80px }

// src/ui/primitives/Stack.tsx
export type StackProps = {
  gap: StackGap;
  direction?: "column" | "row";
  as?: React.ElementType;
  children: React.ReactNode;
  className?: string;
} & Omit<React.HTMLAttributes<HTMLElement>, "className">; // when as=form, etc.
export function Stack(props: StackProps): JSX.Element;
// style={{ gap: "var(--space-stack-{gap})" }} + flex; no className gap-*

// src/ui/primitives/Button.tsx
export type ButtonVariant = "primary" | "signal" | "ghost" | "danger";
export type ButtonProps = {
  variant: ButtonVariant;
  href?: string;
  pending?: boolean;
  type?: "button" | "submit";
  children: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;
export function Button(props: ButtonProps): JSX.Element;
// Padding from --space-inset-* × density; replaces growth-button + .btn

// src/ui/primitives/Field.tsx
export type FieldProps = {
  label: string;
  name: string;
  type?: React.HTMLInputTypeAttribute;
  error?: string;
  hint?: string;
  required?: boolean;
} & React.InputHTMLAttributes<HTMLInputElement>;
export function Field(props: FieldProps): JSX.Element;
// Stack tight inside: label→control→error; replaces .form-group + Tailwind one-offs

// src/ui/primitives/Panel.tsx
export type PanelProps = {
  inset?: Inset;
  children: React.ReactNode;
  className?: string;
};
export function Panel(props: PanelProps): JSX.Element;
// Surface bg + border + inset padding; replaces .dash-card
```

No `gap?: number`. No `padding?: string`. Illegal states are unrepresentable on primitives (per **type-system-discipline**).

---

## CSS token layer (`src/ui/tokens/space.css`)

```css
:root {
  /* Base ladder — only 4px multiples */
  --space-1: 0.25rem;   /* 4px */
  --space-2: 0.5rem;    /* 8px */
  --space-3: 0.75rem;   /* 12px */
  --space-4: 1rem;      /* 16px */
  --space-5: 1.25rem;   /* 20px */
  --space-6: 1.5rem;    /* 24px */
  --space-8: 2rem;      /* 32px */
  --space-10: 2.5rem;   /* 40px */
  --space-12: 3rem;     /* 48px */
  --space-16: 4rem;     /* 64px */
  --space-20: 5rem;     /* 80px */
  --space-24: 6rem;     /* 96px */
  --space-30: 7.5rem;   /* 120px */

  --space-gutter: var(--space-10);

  /* Semantic aliases (generated from SPACE_ROLE) */
  --space-stack-tight: var(--space-2);
  --space-stack-default: var(--space-4);
  --space-stack-loose: var(--space-6);
  --space-stack-section: var(--space-8);

  --space-inset-sm: var(--space-3);
  --space-inset-md: var(--space-4);
  --space-inset-lg: var(--space-6);

  --space-section-sm: var(--space-16);
  --space-section-md: var(--space-20);
  --space-section-lg: var(--space-24);
  --space-section-hero: clamp(var(--space-16), 8vw, var(--space-24));
}
```

Tailwind `@theme` in `tailwind.css` exposes **only** these names as spacing scale (no default `3.5`, `1.5`, `7`, …). Marketing Tailwind in forms (Turnstile wrappers) must use `gap-stack-default`, not `mb-1.5`.

---

## Density tokens (`src/ui/tokens/density.css`)

```css
[data-density="persuade"] {
  --ui-button-pad-y: var(--space-4);
  --ui-button-pad-x: var(--space-6);
  --ui-field-pad-y: var(--space-3);
  --ui-section-scale: 1;
}

[data-density="operate"] {
  --ui-button-pad-y: var(--space-3);
  --ui-button-pad-x: var(--space-4);
  --ui-field-pad-y: var(--space-2);
  --ui-section-scale: 0.85; /* section padding × scale, still snaps to steps via calc on vars */
}
```

Operate stays task-first: smaller inset, primary blue not signal yellow default on `Button variant="primary"`. Persuade keeps signal CTA as today.

---

## Layout widths (replaces `.growth-shell`, `.container`, `.dash-shell`)

```css
[data-width="shell"] { width: min(100% - var(--space-gutter) * 2, 78rem); margin-inline: auto; }
[data-width="content"] { max-width: 48rem; margin-inline: auto; }
[data-width="narrow"] { max-width: 28rem; margin-inline: auto; }
```

---

## Lint script (`scripts/check-spacing.mjs`)

```typescript
// Pseudocode — real script walks AST + regex
const ALLOWED_TAILWIND_SPACING = readJson("scripts/spacing-allowlist.json");
// Generated: node scripts/gen-spacing-allowlist.mjs ← imports SPACE_ROLE from space.ts

function checkFile(path: string): Violation[] {
  // 1. className: forbid /(?:^|\s)([pm][trblxy]?|gap|space-[xy])-((?!...allowlist).)+/
  // 2. forbid arbitrary: /\[(\d+(\.\d+)?)(px|rem)\]/
  // 3. forbid inline style padding|margin|gap with non-token values
  // 4. in .css under src/app|components: forbid padding/margin/gap declarations not using var(--space-
}

// Exit 1 on any violation. npm run lint chains eslint && node scripts/check-spacing.mjs
```

Allowlist generation from `SPACE_ROLE` keeps lint and types in sync (per **encode-lessons-in-structure**).

---

## Data flow

```
Page (density, width)
  └─ Section (space, width)
       └─ Stack (gap)
            ├─ Button (variant) → density vars
            ├─ Field → Stack tight internally
            └─ Panel (inset)
```

Call chain depth: page → section → stack → leaf. Three hops max (per **minimize-reader-load**).

---

## Deliberately not built

- No third "blog" or "audit" kit. Blog and audit migrate to `density="persuade"` + `Panel`.
- No `className` spacing escape hatch on primitives.
- No `globals.css` shim or `@import` of legacy `.btn`.
- No arbitrary Tailwind spacing in theme. Extended colors stay in `brand.css` `@theme`.
- No CSS-in-JS runtime.

---

## growth-* retirement

| Today | Replacement |
|-------|-------------|
| `.growth-shell` | `Section width="shell"` or `Page width="shell"` |
| `.growth-hero` | `Section space="hero"` + typography utilities |
| `.growth-button-signal` | `Button variant="signal"` |
| `.growth-section` | `Section space="md"` |
| `.btn`, `.form-group` | `Button`, `Field` |
| `.dash-card`, `.dash-page` | `Panel`, `Page density="operate"` |

Visual parity comes from tokens matching measured growth/operate padding, not from keeping class names.
