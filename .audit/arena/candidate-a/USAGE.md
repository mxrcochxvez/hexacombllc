# Hexacomb UI (`@/ui`) — usage

Day-one visual system for Hexacomb. One spacing lattice (4px steps), one primitive kit, two densities on the same components. Colors and typography stay in `brand.css` (growth world). Spacing and layout never use raw numbers in pages.

## Install (implementation)

```bash
# After merge: primitives live at src/ui/
import { Page, Section, Stack, Button, Field, Panel } from "@/ui";
```

Pages and feature components import primitives only. They do not import spacing CSS or pass arbitrary `padding`/`gap`/`margin` utilities.

## Quickstart

```tsx
// src/app/(site)/pricing/page.tsx — Persuade (marketing)
import { Page, Section, Stack, Button } from "@/ui";

export default function PricingPage() {
  return (
    <Page density="persuade">
      <Section space="lg" width="shell">
        <Stack gap="section">
          <h1>Plans that pay for themselves</h1>
          <Stack gap="default">
            <p>One partner. One monthly fee. No surprise invoices.</p>
            <Button variant="signal" href="/intake">
              Start intake
            </Button>
          </Stack>
        </Stack>
      </Section>
    </Page>
  );
}
```

```tsx
// src/components/DashboardLoginForm.tsx — Operate (task surfaces)
import { Page, Panel, Stack, Field, Button } from "@/ui";

export function DashboardLoginForm() {
  return (
    <Page density="operate" width="narrow">
      <Panel>
        <Stack gap="loose">
          <h1>Dashboard</h1>
          <p>Enter the admin password to manage leads and agreements.</p>
          <Stack gap="default" as="form" onSubmit={onSubmit}>
            <Field label="Password" name="password" type="password" required />
            <Button variant="primary" type="submit" pending={pending}>
              Sign in
            </Button>
          </Stack>
        </Stack>
      </Panel>
    </Page>
  );
}
```

```tsx
// src/components/IntakeForm.tsx — Operate form inside Persuade page shell
import { Stack, Field, Section } from "@/ui";

export function IntakeForm() {
  return (
    <Section space="md" width="content">
      <Stack gap="loose" as="form">
        <Field label="Full name" name="name" error={errors.name} />
        <Field label="Email" name="email" type="email" error={errors.email} />
        {/* section titles are typography, not spacing hacks */}
      </Stack>
    </Section>
  );
}
```

## Spacing rules (what callers see)

| Role | Token | px | Use |
|------|-------|-----|-----|
| **stack** `tight` | `--space-stack-tight` | 8 | Label → control, icon + text |
| **stack** `default` | `--space-stack-default` | 16 | Paragraph blocks, form fields |
| **stack** `loose` | `--space-stack-loose` | 24 | Subsections inside a card |
| **stack** `section` | `--space-stack-section` | 32 | Hero actions, card grids |
| **inset** `sm` | `--space-inset-sm` | 12 | Operate inputs, compact chips |
| **inset** `md` | `--space-inset-md` | 16 | Default panel padding |
| **inset** `lg` | `--space-inset-lg` | 24 | Persuade cards, marketing panels |
| **section** `sm` | `--space-section-sm` | 64 | Footer bands |
| **section** `md` | `--space-section-md` | 80 | Standard marketing section |
| **section** `lg` | `--space-section-lg` | 96 | Pricing, about bands |
| **section** `hero` | `--space-section-hero` | clamp on-scale | Hero vertical only (endpoints 64/96) |

**Gutter:** `Page` / `Section` `width="shell"` applies `max-width: 78rem` and horizontal gutter `--space-gutter` (40px). No `min(100% - 2.5rem, …)` copies in pages.

## Density

Set once on `Page` (or inherited from layout):

- **`persuade`** — marketing: larger section rhythm, signal yellow CTAs, display type. Replaces `growth-*` layout classes.
- **`operate`** — dashboard, forms, contract, review: tighter inset, restrained accent, familiar controls. Replaces `dash-*`, `.btn`, `.form-group`.

Same `Button`, `Field`, `Panel`. Density swaps token multipliers in CSS (`data-density` on `Page`), not a second component set.

## What pages cannot do

```tsx
// ❌ Illegal at page layer — does not compile or fails lint
<Stack gap={20} />
<div className="mb-5 px-3.5 gap-7" />
<section style={{ padding: "14px 32px" }} />

// ✅ Legal
<Stack gap="default" />
<Section space="md" />
```

Off-scale spacing is unrepresentable: `Stack`/`Section` props are string unions, Tailwind spacing utilities in `src/app` and `src/components` are allowlist-only, and `npm run lint:spacing` fails on raw `px`/`rem` in `padding`/`margin`/`gap`.

## Migration sketch

1. Add `src/ui/` + `scripts/check-spacing.mjs`; wire into `npm run lint`.
2. Move color/type tokens from `brand.css` into `src/ui/tokens/brand.css`; keep growth look.
3. Rebuild marketing pages on `Page`/`Section`/`Stack`/`Button`; delete corresponding `growth-*` layout rules from CSS.
4. Rebuild dashboard, contract, feedback, review, blog post on primitives; delete `globals.css` entirely (no wrapper, no re-export).
5. Remove fake Tailwind margin island from old globals (`mb-2`…`mt-8` block).

## Lint lever

```bash
npm run lint:spacing   # fails CI on off-scale spacing in src/
```

Scans `src/app/**`, `src/components/**` for:

- Tailwind spacing classes not in the generated allowlist (`p-inset-md`, `gap-stack-default`, …)
- Arbitrary values: `p-[…]`, `gap-[14px]`, `mb-1.5`
- Raw `padding`/`margin`/`gap` in inline styles and co-located CSS modules

`src/ui/**` and `src/ui/tokens/**` are the only places allowed to reference `--space-*` steps directly during stabilization.
