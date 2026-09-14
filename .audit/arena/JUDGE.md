# Arena verdict. Spacing + UI kit

Readonly cross-judge. Packages were scored as written. Nothing was rewritten.

Scale. 0 = misses the bar. 1 = partial, undermined by the API. 2 = meets with a concrete hole. 3 = meets with types, files, and a rerunnable check that match the claim.

## Scores

| Criterion | A | B | C |
| --- | --- | --- | --- |
| 1. 4px scale + semantic roles (section / stack / inset), not a bag of numbers | 2 | 1 | 3 |
| 2. Off-scale pad/margin/gap unrepresentable at the page layer (types + check) | 2 | 2 | 3 |
| 3. Small public primitive set. Density, not a second kit | 3 | 1 | 3 |
| 4. Delete `globals.css`. Keep shipped `brand.css` growth look | 3 | 3 | 3 |
| 5. Extend the kit without leaking the pixel table to pages | 3 | 1 | 2 |
| **Total /15** | **13** | **8** | **14** |

## Recommended base

**Candidate C.**

C is the only package that makes the layout component the spacing decision. `Section` accepts `"flush" | "section" | "hero"`. `Stack` accepts `"tight" | "stack"`. `Cluster` accepts `"tight" | "cluster"`. `Panel` owns inset. Pages cannot type section padding onto a stack. Density is one `Page` attribute that remaps CSS role variables. Seven exports. `SPACE` stays private. `globals.css` is deleted with its last caller. `DESIGN.md` paper (Libre Franklin, hue 75, 72rem, 6px radius) is listed as absent.

A is the close runner-up. Same kit size, same delete-globals story, stronger Tailwind allowlist. It loses the base because `Stack gap="section"` mixes roles, operate uses `--ui-section-scale: 0.85` (80×0.85 is 68px, off the 4px ladder), and `className` stays on every primitive.

B is not a base. It is a typed sprinkles layer with a Box.

## Criterion notes

### 1. Scale and roles

**C = 3.** `SPACE` is a closed 4px table. `ROLE_STEP` is density × role. Public props are per-component role unions, not `SpaceStep`. Inset is Panel, not a gap the page picks.

**A = 2.** `SPACE_ROLE` names stack, inset, and section, and callers pass those names. Then `Stack` also takes `gap="section"`, which is the section role used as a stack size. The USAGE table prints px next to every token. The ladder exists. The domain split is leaky.

**B = 1.** `STEPS` is a real 4px grid. `SpaceRole` is `xs`…`xl` plus `section`/`hero`/`page`/`gutter`. Every layout primitive takes `SpaceToken = SpaceStep | SpaceRole` and the full `p`/`m`/`gap` bag. USAGE tells authors to use `gap={4}` for a 16px grid. That is a bag of numbers with nicknames.

### 2. Unrepresentable off-scale at the page layer

**C = 3.** No `SpaceStep` on public props. `scripts/check-space.mjs` is specified as a process-killing scan: raw px/rem/em/vw/clamp, arbitrary Tailwind, fraction keys, integer keys not in `SPACE`, inline style padding/margin/gap, even commented `padding: 80px`. Hairlines and focus rings are carved out. Wire it as `npm run check:space`. Types catch the component API. The script catches CSS the compiler will not see.

**A = 2.** String unions plus `check-spacing.mjs` plus an allowlist generated from `SPACE_ROLE` is the right shape. Holes: `className?` on Page/Section/Stack/Button/Panel, with lint as the only stripper. Operate section padding scaled by 0.85 is off-ladder inside the kit. Hero clamp endpoints are on-scale. The multiplier is not.

**B = 2.** `SpaceStep` rejects 7 and `"18px"`. ESLint `no-raw-spacing` plus CSS `var(--lat-` is a real lever. `spacing-baseline.txt` subtracts current violations, so off-scale remains representable until someone deletes the line. Pages may still pass any on-scale integer through `Box`. Types block off-grid. They do not block a page-level pixel API.

### 3. Small primitive set. Density, not a second kit

**A = 3.** `Page`, `Section`, `Stack`, `Button`, `Field`, `Panel`. Density on `Page` via `data-density`. Same Button/Field. No Box. No marketing/ops fork.

**C = 3.** Same count, plus `Cluster` instead of asking `Stack` to be a row. No Box, no `sx`, no Card/Badge/Table/Modal in v1. Density is CSS on `[data-density]`, not a second kit and not a ThemeProvider.

**B = 1.** DensityProvider is the right idea. The public list is Stack, Inline, Box, Shell, Grid, Text, Button, Field, Input, Textarea, Table and friends, plus `SpacingProps` with 15 keys. Sketch even has a `…` under primitives. That is Box/sprinkles soup. Operate vs persuade is density. The primitive set fails the first sentence of the criterion.

### 4. Delete globals. Keep growth `brand.css`

**All = 3.**

A moves colors/type into `src/ui/tokens/brand.css`, migrates callers, deletes `globals.css` with no `.btn` wrapper.

B extracts `growth.css` from today's `brand.css`, deletes `globals.css` after the last `dash-*` / `.btn` caller, keeps 78rem shell and ink/signal.

C keeps `src/app/brand.css` as the look file, `@import`s generated `space.theme.css`, snaps growth button pad onto the scale, forbids wrapping `.btn`, names DESIGN.md as out.

None of the three keep honey/amber as architecture.

### 5. Extend without leaking the pixel table

**A = 3.** New rhythm is a new `SPACE_ROLE` key. Allowlist, CSS aliases, and `@theme` regenerate from that table. Pages get `gap-stack-default`, not `p-8`. `space.ts` is not in the public barrel. Maintainers edit one map.

**C = 2.** `index.ts` does not export `SPACE` / `px` / `ROLE_STEP`. One change in `space.ts`, emit, check, callers stay on roles. Then `emitSpaceTheme` writes `@theme { --spacing-N }` and `check:space` allows Tailwind keys that exist on `SPACE`. A page can still write `p-8` on a raw `div` and pass the check. Role types on primitives hide the table. The Tailwind emit puts it back in the class namespace.

**B = 1.** The barrel exports `SpaceStep` and `SpaceToken`. Call sites take `gap={4}`. Custom wrappers are invited to re-implement spacing. Adding a rung teaches every page a new integer. `STEPS` is private to import path, public to the prop type.

## What to graft from the losers

### From A onto C

- Generate the lint allowlist from the role table, semantic names only (`gap-stack`, `p-inset`). Do not allowlist `p-8` / `gap-4` in `src/app` or `src/components`.
- `Page`/`Section` width tokens (`shell` 78rem, `content`, `narrow`) so gutters are not re-copied as `min(100% - 2.5rem, 78rem)`.
- Hero as `clamp(var(--space-16), 8vw, var(--space-24))` with both ends on the ladder. Do not invent a density multiplier that leaves the ladder.
- Optional `Panel inset` if operate vs persuade inset should be choosable without a new component. Default stays role-owned.
- `as` on Section/Stack for `form` / `footer` without a second primitive.
- Wire the space check into `npm run lint`, not only a sidecar script.

### From B onto C (narrowly)

- Layout-level density default so every dashboard page does not repeat `density="operate"`. C should keep CSS `data-density`, not B's client `useDensity()` on every Stack. Set the attribute in `(site)/dashboard/layout.tsx` and `(site)/layout.tsx`, still overridable on `Page`.
- Monotonic baseline file only if the first PR cannot migrate every route. C wants the check red on `globals.css` from commit one. If CI must stay green, B's shrink-only baseline is the escape. It must not become a permanent permit.
- Button hit targets as fixed steps across densities (B's `BUTTON_PADDING` map). Rhythm changes. Controls do not. C already snaps to 48px min-height. Keep that. Do not take B's `size="sm|md|lg"` unless marketing and dashboard actually need three control sizes.
- Generated CSS variables for non-React islands (agreement HTML, markdown). C already emits `--space-N` for the kit. Restrict page CSS to `--space-{role}` (`--space-gutter`, `--space-stack`), not `--space-20`.

Do not graft B's `Box`, `SpacingProps`, `Inline`+`Grid`+`Text` as a parallel type scale, numeric `SpaceToken` on pages, or `asChild` Button soup.

## Rejections

**B as the implementation base.** Rejected. Public `Box` + 15 spacing props + `SpaceStep` on every stack is the failure mode the rubric names. Exporting `SpaceStep` from `@/ui` leaks the ladder. Inline `style={{ gap: "16px" }}` inside primitives makes DevTools lie that px is the API. Grandfather baseline plus a 12-component kit will not delete `globals.css`. It will wrap it in React.

**A's operate `0.85` section scale.** Rejected. Semantic roles that resolve off-grid under density break criterion 1 and 2 inside the kit. Density must pick another `SpaceStep` (C's table already does: persuade section 20, operate section 10).

**A's `Stack gap="section"`.** Rejected. Section is a band. Stack is a column. C's unions are the fix.

**C's `@theme` integer spacing keys allowed at the page layer.** Rejected as shipped. Keep generated `--space-N` private to `src/ui` and snapped `brand.css` chrome. Pages get role classes or components only.

**C's leftover `growth-hero-grid` in the hero example.** Rejected as a pattern. Chrome may stay in `brand.css` during the first route. New bands are Section + Stack + Cluster. Do not grow a third class family beside the kit.

**Any `.btn { }` alias, `@extend`, or `LegacyButton`.** Rejected. All three packages already say this. Do not reintroduce it in synthesis.

**A third density, a blog kit, or DESIGN.md type/color.** Rejected. Growth `brand.css` is the look file.

**Vanilla Extract / sprinkles / Style Dictionary as the page API.** Rejected in B's own alternatives. Correct.

## Synthesis (for the parent, not a rewrite)

Implement C's module map and public types. Steal A's semantic allowlist and width tokens. Steal B's layout-level density default and optional shrink-only baseline. Kill B's Box. Kill A's 0.85 multiplier. Kill C's page-layer `p-8`.

First implementation slice stays C's: `space.ts` + `check-space.mjs` failing on current `globals.css`, then `Page` / `Section` / `Stack` against that red check.
