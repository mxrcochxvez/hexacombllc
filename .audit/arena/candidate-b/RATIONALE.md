# Lattice UI — rationale

## Problem

Hexacomb ships two CSS worlds on every page: `brand.css` (growth look, OKLCH tokens, `growth-*` chrome) and `globals.css` (legacy honey/amber kit, `dash-*`, `.btn`, global `section { padding: 80px 0 }`). There is no spacing scale. Marketing pages use one-off rem and clamp values; operate surfaces use raw px and a hand-copied `mb-*` island in globals. Tailwind v4 is imported in brand.css but pages cannot rely on utility spacing without reintroducing guesswork.

The day-one visual system must preserve the shipped growth identity (Archivo Black, Public Sans, ink/signal palette, 78rem shell), give operate surfaces a tighter task-first rhythm without a second visual kit, and make off-scale padding/margin/gap unrepresentable at the page layer. The obvious default (CSS custom properties plus spacing class names) still lets any author write `padding: 14px` or `gap-3.5` beside the scale. That leaks the invariant.

## Usage (caller's view)

See [USAGE.md](./USAGE.md). Pages import `@/ui` primitives, pass semantic tokens (`gap="md"`, `py="hero"`), and set density once per layout (`persuade` for marketing, `operate` for dashboard/contract/review). They never import pixel maps or Tailwind spacing utilities.

## Shape

**Lattice** is a typed spatial registry with a density resolver and a small primitive library. Three layers:

1. **Registry** (`src/ui/space/`): `STEPS` is the only object that maps token → px. `ROLE_TABLE` maps semantic roles × density mode → step. Pure `resolveSpace` functions.
2. **Primitives** (`src/ui/primitives/`): `Stack`, `Shell`, `Field`, etc. accept `SpacingProps` typed as `SpaceToken`. They call `useDensity()` and apply resolved inline styles. Visual chrome (color, type, button shape) comes from `growth.css` classes keyed by `variant`.
3. **Enforcement** (`src/ui/lint/no-raw-spacing.mjs`): ESLint fails Tailwind spacing utilities, raw px/rem in styles, and off-scale CSS outside `src/ui/theme/`. A baseline file grandfathers existing debt and must shrink each PR.

**Load-bearing decisions:**

| Decision | Invariant encoded | Principle |
|----------|-------------------|-----------|
| `SpaceStep` union (1,2,3…24 only) | Off-grid values are compile errors | type-system-discipline |
| `SpaceRole` + `ROLE_TABLE` | Persuade vs operate rhythm without duplicate components | model-the-domain |
| `resolveSpace` only inside primitives | Pages cannot construct `LatticeCssLength` | boundary-discipline |
| ESLint + monotonic baseline | Escape hatches fail CI | encode-lessons-in-structure, build-the-lever |
| Generated `lattice.css` from `STEPS` | CSS prose islands share registry without hand sync | single source of truth |
| Delete `globals.css` after migration | No permanent dual kit | migrate-callers-then-delete-legacy-apis, subtract-before-you-add |

**Interface depth:** Callers see ~10 primitives and a token vocabulary. They do not see the step table, density matrix, codegen, or style merger. A marketing author thinks in `Stack gap="md"`; the system picks 24px or 16px based on layout context. That hides the 4px grid math, responsive shell caps, and operate/persuade policy behind one prop.

The public surface stays small on purpose. `Text` has no spacing props (typography rhythm is variant-owned). `Button` sizes map to fixed internal steps so hit targets stay consistent. Layout spacing and control spacing are separate concerns, which keeps the prop surface from becoming a second Tailwind.

**What Lattice does not do:** It does not expose CSS variables to pages for ad-hoc `var(--space-*)` usage. It does not add a third density or a parallel `dash-*` class family. It does not preserve `globals.css` as a compatibility layer after migration.

## Synthesis decision

parent will fill

## Tradeoffs accepted

- **We accept inline styles on layout primitives in exchange for making off-scale spacing unrepresentable.** Primitives resolve tokens to `style={{ gap: "16px" }}` inside `src/ui/`. DevTools show px values, but pages cannot set them. Alternative (data-attribute + generated utility classes per step) adds build complexity for marginal runtime gain.

- **We accept a React-only spacing API in exchange for TypeScript enforcement.** Server components can use primitives that forward refs without client hooks where density is passed as an explicit prop on `Shell`/`Stack` for RSC leaves. Most marketing sections are already client or can wrap a thin client `Stack`. Agreement HTML ports use generated `--lat-*` vars, not React.

- **We accept a grandfather baseline file in exchange for landing the lint lever on day one.** The rule is real immediately; existing violations are listed and must decrease. Without baseline, the migration cannot start incrementally.

- **We accept fixed button padding steps across densities in exchange for familiar control sizes.** Operate and persuade differ in section rhythm, not button hit targets. Dashboard buttons stay `md`; marketing hero uses `lg`.

- **We accept deleting all `growth-*` layout classes after migration in exchange for one composition model.** Short-term duplication (class + primitive) during migration is allowed; end state is primitives + theme CSS only.

## Alternatives considered

**CSS custom properties + Tailwind spacing theme (the default shape).** Add `--space-1…--space-24` to `@theme`, map Tailwind `p-4` to the scale, document the table. **Lost because** callers can still write `p-[14px]`, arbitrary values, and one-off rem in CSS. The scale is advisory, not structural. Interface depth is shallow: every author must learn the variable table and police themselves. Lattice concentrates spacing policy in `resolveSpace` and makes the page layer incapable of expressing violations.

**Style Dictionary / tokens JSON → CSS only.** Single JSON drives CSS and docs; no React layer. **Lost because** React components (`DashboardLeadList`, forms) are where spacing drift happens today. Generated CSS does not stop `style={{ marginBottom: 10 }}` in TSX. No density-aware semantic roles without a runtime resolver anyway.

**Vanilla Extract or CSS Modules with typed `sprinkles()`.** Compile-time spacing unions on class names. **Lost because** the repo already loads custom CSS for growth chrome; adding a second styling runtime splits visual authority. Sprinkles still expose class names to pages and read as "Tailwind with extra steps." Lattice keeps growth.css for color/type and owns space exclusively through props.

## Open questions and risks

- **RSC boundaries:** Which primitives must be client components because of `useDensity()`? Should `Shell` accept an optional `mode` prop override for server-rendered leaves instead of context?
- **WebsiteWorkStack and decorative components:** Do motion/illustration components get spacing props, or are they wrapped in `Box p={…}` only?
- **Blog markdown prose:** Does `MarkdownContent` map heading margins to `--lat-*` in CSS, or wrap blocks in `Stack`?
- **Baseline size:** How many existing Tailwind spacing utilities exist in `src/components` today? If the baseline is huge, should phase 1 lint warn instead of error for one week?
- **AgreementTerms HTML port:** Large static HTML may need a scoped `agreement.css` using only `--lat-*` vars. Who owns converting its px literals?

## Next implementation step

Scaffold `src/ui/space/{scale,roles,resolve,types}.ts`, `DensityProvider`, `Stack` + `Shell`, run `scripts/lattice-codegen.mjs`, and land the ESLint rule with a generated `spacing-baseline.txt` from the current tree so `npm run lint` enforces monotonic cleanup from the first PR.
