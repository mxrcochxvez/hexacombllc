# Lattice UI — usage (caller's view)

Hexacomb pages compose layout through **`@/ui` primitives**. Spacing is a **named token** (`"md"`, `"section"`, `"hero"`) or a **scale step** (`4`, `6`, `12`). Raw pixels, rem strings, and Tailwind `p-*` / `gap-*` utilities are not part of the page API.

Density is chosen once per route tree. Marketing routes use **persuade** (roomier rhythm). Dashboard, contract, feedback, and review use **operate** (tighter, task-first). Same components, different resolved px behind semantic roles.

---

## Quickstart

```tsx
// src/app/(site)/layout.tsx
import { DensityProvider } from "@/ui";

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return <DensityProvider mode="persuade">{children}</DensityProvider>;
}
```

```tsx
// src/app/(site)/dashboard/layout.tsx
import { DensityProvider } from "@/ui";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DensityProvider mode="operate">{children}</DensityProvider>;
}
```

Import primitives from the barrel only:

```tsx
import { Shell, Stack, Inline, Text, Button, Field, Table } from "@/ui";
```

Do **not** import from `@/ui/space/*`. The scale registry is internal.

---

## Call site 1 — marketing hero (replaces `growth-*` layout classes)

```tsx
import { Shell, Stack, Inline, Text, Button } from "@/ui";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import WebsiteWorkStack from "@/components/WebsiteWorkStack";

export function HeroSection() {
  return (
    <Shell as="section" py="hero" width="content">
      <Stack direction="row" gap="xl" align="center" split="2-1">
        <Stack gap="md">
          <Text as="h1" variant="display-xl">
            You run the business.
            <Text as="span" variant="display-xl" tone="accent">
              {" "}We run the website.
            </Text>
          </Text>
          <Text variant="body-lg" tone="muted">
            Hexacomb manages your site, attacks SEO, reads the reports, and
            improves the copy—month after month.
          </Text>
          <Inline gap="sm" wrap align="center">
            <Button asChild variant="signal" size="lg">
              <Link href="#contact">
                Take it off my plate <ArrowUpRight size={19} aria-hidden />
              </Link>
            </Button>
            <Button asChild variant="ghost" size="lg">
              <Link href="/website-audit">Check my current site</Link>
            </Button>
          </Inline>
          <Text variant="caption" tone="muted">
            Founder-led in Fresno. No account-manager relay.
          </Text>
        </Stack>
        <WebsiteWorkStack />
      </Stack>
    </Shell>
  );
}
```

`py="hero"` resolves to **64px** under persuade and **32px** under operate. The page never names a number.

---

## Call site 2 — dashboard lead list (replaces `dash-*` shell)

```tsx
"use client";

import Link from "next/link";
import { Shell, Stack, Text, Table, TableRow, TableCell } from "@/ui";
import { DashboardNav } from "@/components/DashboardNav";
import type { DashboardLeadRow } from "./types";

export function DashboardLeadList({ leads }: { leads: DashboardLeadRow[] }) {
  return (
    <Shell py="page" width="wide">
      <Stack gap="md">
        <DashboardNav title="Leads" subtitle="Manage pipeline status and agreements." />

        {leads.length === 0 ? (
          <Text tone="muted">No leads yet.</Text>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Temp</th>
                <th>Source</th>
                <th>Created</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => (
                <TableRow key={lead._id}>
                  <TableCell>
                    <Link href={`/dashboard/leads/${lead._id}`}>{lead.name}</Link>
                    {lead.business ? (
                      <Text as="span" variant="caption" tone="muted" block>
                        {lead.business}
                      </Text>
                    ) : null}
                  </TableCell>
                  {/* … */}
                </TableRow>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </Shell>
  );
}
```

`gap="md"` is **16px** in operate, **24px** in persuade. Dashboard layout sets operate at the layout boundary, so list density stays task-first without a second component kit.

---

## Call site 3 — intake form field (replaces Tailwind `mb-*` island)

```tsx
import { Stack, Field, Input, Textarea, Button } from "@/ui";

export function IntakeForm() {
  return (
    <form onSubmit={handleSubmit}>
      <Stack gap="lg">
        <Field label="Business name" required>
          <Input name="business" />
        </Field>
        <Field label="What do you need help with?" required>
          <Textarea name="goals" rows={4} />
        </Field>
        <Button type="submit" variant="signal" size="lg">
          Send intake
        </Button>
      </Stack>
    </form>
  );
}
```

`Field` owns label-to-control spacing (`gap="xs"` → 8px operate / 12px persuade). Form pages do not hand-tune margins.

---

## Space tokens (what pages may pass)

### Scale steps (4px grid)

| Token | px |
|-------|-----|
| `1` | 4 |
| `2` | 8 |
| `3` | 12 |
| `4` | 16 |
| `5` | 20 |
| `6` | 24 |
| `8` | 32 |
| `10` | 40 |
| `12` | 48 |
| `16` | 64 |
| `20` | 80 |
| `24` | 96 |

Steps outside this table are a **type error**. There is no `7`, no `15`, no `"18px"`.

### Semantic roles (density-aware)

| Role | Persuade | Operate | Typical use |
|------|----------|---------|-------------|
| `xs` | 8 | 4 | Icon-to-label, tight inline |
| `sm` | 12 | 8 | Button groups, chip rows |
| `md` | 24 | 16 | Default stack gap |
| `lg` | 32 | 24 | Card innards |
| `xl` | 48 | 32 | Major blocks |
| `section` | 80 | 48 | Section vertical rhythm |
| `hero` | 64 | 32 | Hero vertical padding |
| `page` | 40 | 24 | Operate page shell padding |
| `gutter` | 20 | 16 | Shell horizontal inset |

Roles are the preferred API. Reach for numeric steps only when a one-off layout truly needs a specific rung (e.g. `gap={4}` for a 16px grid).

---

## Primitive props cheat sheet

| Primitive | Spacing props | Notes |
|-----------|---------------|-------|
| `Stack` | `gap`, `p`, `px`, `py` | Vertical or horizontal flex; `split` for responsive columns |
| `Inline` | `gap`, `p` | Horizontal flex with wrap |
| `Box` | `p`, `px`, `py`, `m`, `mx`, `my` | Generic container; prefer `Stack` for flow |
| `Shell` | `py`, `px`, `width` | Page-level chrome; `width="content"` → 78rem cap (growth shell) |
| `Grid` | `gap`, `columns` | CSS grid wrapper |
| `Field` | internal `xs` | Label + control + hint spacing baked in |
| `Button` | `size` sm/md/lg | Padding from size map, not manual `p` |

All spacing props accept `SpaceToken = SpaceStep | SpaceRole`.

---

## What is forbidden at the page layer

The repo lint lever (`npm run lint`) fails on:

- Tailwind spacing utilities (`p-*`, `m-*`, `gap-*`, `space-x-*`, `space-y-*`) in `src/**` outside `src/ui/**`
- Inline `style={{ padding: "14px" }}` or any `*px` / `*rem` margin, padding, or gap in app/components
- New rules in CSS files outside `src/ui/theme/**` that set `padding`, `margin`, or `gap` with length values

Allowed exceptions: `src/ui/**` (implementation), `brand.css` / `growth.css` during migration only until the matching `growth-*` class is deleted.

---

## Visual identity

Colors, fonts, and button chrome come from **`src/ui/theme/growth.css`** (extracted from today's `brand.css` `@theme` and growth button styles). Lattice does not introduce a third palette. Operate surfaces use the same ink/signal tokens with restrained accent and familiar control shapes.

---

## Migration order (for implementers)

1. Add `src/ui/` scaffold + lint rule (fails on new violations; grandfather existing with a baseline file).
2. Site layout: `DensityProvider mode="persuade"`.
3. Migrate marketing pages top-down (home → about → pricing → how-it-works → blog shell).
4. Dashboard layout: `DensityProvider mode="operate"`; migrate `dash-*` tables and forms.
5. Contract, feedback, review, audit tool.
6. Delete `globals.css` import from root layout; remove file.
7. Strip migrated `growth-*` layout rules from `brand.css`; keep `@theme` until `growth.css` owns tokens.
