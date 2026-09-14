# Rationale — candidate A (`@/ui` lattice)

## Problem

Hexacomb ships two visual kits in parallel: `brand.css` (growth world, Tailwind-backed) and `globals.css` (honey/amber `.btn`, `.dash-*`, fake `mb-*` utilities, hardcoded px). Spacing is guessed per file (`14px 32px`, `mb-1.5`, `clamp(5rem, 9vw, 8.5rem)` with no shared ladder). The user wants a day-one system: 4px increments, semantic roles, shared primitives, growth look preserved, operate surfaces task-first, and enforcement so pages cannot reintroduce off-scale values. DESIGN.md is explicitly out of scope; `brand.css` is the visual authority.

## Usage (caller's view)

See [USAGE.md](./USAGE.md). Pages import `@/ui` primitives, set `Page density="persuade"|"operate"`, compose with `Section` + `Stack`, and never pass numeric spacing. Marketing and dashboard share `Button`/`Field`; density swaps padding tokens, not components.

## Shape

**Single lattice, semantic roles, typed primitives, CSS enforcement.**

1. **Space lattice** — thirteen base steps (`SpaceStep`), all 4px multiples, defined once in `space.ts` and `tokens/space.css`. Semantic roles (`stack`, `inset`, `section`) map to steps via `SPACE_ROLE`; callers use role names, not numbers.

2. **Unrepresentable off-scale at page layer** — `Stack gap` and `Section space` are string unions, not `number` or `string`. Tailwind spacing in `@theme` is regenerated from the same table (no default `3.5`/`1.5` steps). `scripts/check-spacing.mjs` fails builds on arbitrary utilities, inline px, and raw padding/margin/gap in `src/app` and `src/components`. Only `src/ui/**` may reference `--space-N` directly during migration (per **boundary-discipline**: validate at the kit boundary, trust types inside pages).

3. **Seven primitives** — `Page`, `Section`, `Stack`, `Button`, `Field`, `Panel`. They own all layout spacing policy. `Page` sets `data-density` for persuade vs operate; components read density CSS variables, not separate kits (per **subtract-before-you-add**: one kit, two token profiles).

4. **brand.css absorption** — colors, fonts, OKLCH `@theme`, motion stay in `src/ui/tokens/brand.css`. Layout-specific `growth-*` rules are deleted as pages migrate to primitives, not duplicated alongside them (per **migrate-callers-then-delete-legacy-apis**).

5. **globals.css deletion** — no wrapper layer. Dashboard, contract, blog post, and audit tool move to primitives; then `globals.css` is removed from `layout.tsx` and deleted. Honey hex vars and `.btn` die with it.

6. **Lint as lever** — allowlist generated from `SPACE_ROLE` so types, CSS aliases, Tailwind theme, and CI check cannot drift (per **build-the-lever** and **encode-lessons-in-structure**).

**Interface depth:** callers choose `gap="default"` and `space="md"`; the kit resolves tokens, density, max-width, and focus rings. Callers do not learn the 4px ladder or which rem equals 80px. The public surface is seven components and four role enums; complexity sits in token CSS and the lint script.

## Synthesis decision

parent will fill

## Tradeoffs accepted

- We accept a migration burst (touch every page and dashboard component) in exchange for deleting ~5k lines of `globals.css` instead of carrying a permanent compatibility shim.
- We accept restricting Tailwind spacing in app code in exchange for guaranteed on-scale values; authors lose `mb-1.5`-style shortcuts.
- We accept `className` on primitives for non-spacing concerns only, enforced by lint rather than TypeScript exhaustiveness, in exchange for not fighting React patterns for typography hooks.
- We accept hero vertical rhythm via a single `clamp()` semantic (`section="hero"`) in exchange for marketing flexibility without reopening arbitrary spacing on pages.
- We accept operate section padding scaled by a CSS multiplier in exchange for tighter dashboards without forking `Section`.

## Alternatives considered

**A. Tailwind-only scale (no React primitives)** — Extend `@theme` with `--spacing-*` and document allowed classes. Rejected because pages can still write `p-[13px]` and `gap-7`; enforcement is lint-only with no ergonomic API, and dashboard/marketing would keep parallel class vocabularies (`.growth-button` vs `.btn`). Exposes the ladder to every caller.

**B. Keep globals.css, wrap with primitives** — Primitives delegate to existing `.btn` / `.dash-card` classes. Rejected as shallow modules (per design red flags): dual token systems remain, honey amber leaks into operate surfaces, and deletion never happens. Information leakage across brand and legacy vars.

**C. Two component kits (`@/ui/marketing` and `@/ui/ops`)** — Faster mental model short term. Rejected: duplicates `Button`/`Field`, guarantees drift, violates "no third identity." Density tokens on one kit hide the policy difference without doubling maintenance.

## Open questions and risks

- Should `(bare)` routes (`/review`, `/contract`) use `Page density="operate"` with `width="content"`, or a chrome-free `Stack` only? Contract legal density may need a one-off `Section space="sm"` approval.
- Blog post prose spacing (`.blog-post` margins between headings) may need a `Prose` primitive or typography plugin; is that in scope for day one or phase two?
- `WebsiteAuditTool` mixes growth page + legacy `.btn`; visual QA after `Button variant="signal"` swap is the main regression risk.
- Global `section { padding: 80px 0 }` in old globals must be zeroed when removed; until migration completes, `Section` should set `padding-block` explicitly to avoid double padding.

## Next implementation step

Add `src/ui/space.ts`, `src/ui/tokens/space.css`, and `scripts/check-spacing.mjs` with allowlist generation, wire `lint:spacing` into CI, then migrate `DashboardLoginForm` as the first operate proof (replacing `.dash-card`, `.form-group`, `.btn` in one PR).
