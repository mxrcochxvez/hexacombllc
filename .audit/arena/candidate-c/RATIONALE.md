# Rationale. Role-owned spacing kit

## Problem

Hexacomb already has a shipped look in `brand.css` and a second, older look in `globals.css`. Every route loads both. Spacing is guessed in rem, clamp, 80px section padding, dashboard 40/20/80, and Tailwind `mb-6` copied into CSS. There is no `--space-*` scale and no `src/ui`. The job is a day-one system. 4px steps, shared controls for marketing and operate routes, growth world preserved, dual kit gone. The non-obvious part is how to make off-scale values unrepresentable at the page layer without a second visual language or a compatibility wrapper around `.btn`.

## Usage (caller's view)

See [USAGE.md](./USAGE.md). A page imports `Page`, `Section`, `Stack`, `Cluster`, `Panel`, `Button`, and `Field`. It sets `density` once. It never passes pixels. Hero, dashboard login, and contract accept are the three proof call sites. `npm run check:space` is the after-the-fact net for CSS the types cannot see.

## Shape

The load-bearing type is not `number` and not a fully open 4px integer. It is two stacked constructions.

`SPACE` is a closed table of 4px lengths. That is the only numeric spacing in the program. Theme CSS is generated from it (`encode-lessons-in-structure`, `foundational-thinking`).

`SpaceRole` plus per-component unions (`SectionPad`, `StackGap`, `ClusterGap`) are what authors type. A page cannot write section padding on a stack because `Stack` does not accept `"section"` (`type-system-discipline`). The layout component you pick *is* the role. That is the domain model (`model-the-domain`), not a bag of `p`/`m`/`gap` props.

Density is one attribute on `Page`. Role tokens remap in CSS. Operate stays compact (40px section, 16px inset). Persuade stays roomy (80px section, 32px inset). Same `Button` and `Field`. Ink and signal stay the growth chrome. We snap growth's 0.8rem pad to 16px so the look holds and the scale holds (`experience-first`). We do not keep DESIGN.md paper, Libre Franklin, or 6px radius.

Validation lives at two boundaries (`boundary-discipline`). Typecheck at component props. `scripts/check-space.mjs` at the `src/` tree for CSS and Tailwind the compiler will not see. Inside `src/ui`, trust `SPACE` and `ROLE_STEP`. Do not re-parse pixels in `Button`.

Public imports stay seven components plus `Density`. Complexity behind that list includes the scale table, density maps, generated `@theme` keys, shell width, field labelling, button-as-link, and the space check. Callers do not learn Tailwind spacing keys or `--space-20`. That is interface depth. A larger prop bag (`p`, `m`, `gap`, `px`, `sx`) would expose the scale and hide nothing.

`globals.css` is deleted in the same wave as its last caller (`migrate-callers-then-delete-legacy-apis`, `subtract-before-you-add`, `outcome-oriented-execution`). No `.btn { @extend growth-button }`. Planned breakage on unmigrated routes is acceptable inside a stacked change that ends with `check:space` green and one stylesheet.

The check script is the lever (`build-the-lever`). A comment in AGENTS.md that says "use the scale" would be the instruction we are encoding away (`encode-lessons-in-structure`).

Call chains stay flat (`laziness-protocol`, `minimize-reader-load`). Page to Section to Stack to Button. No theme provider, no styled-system, no migrate adapter folder.

## Synthesis decision

parent will fill

## Tradeoffs accepted

- We accept a curated step table (no 28px, no 44px) in exchange for a scale people can remember. Every multiple of 4 would still invite picking 20 vs 24 on a page if we ever leaked `SpaceStep`.
- We accept that `check:space` is regex-hard, not a full CSS parser, in exchange for a script a reviewer can rerun. False positives on `padding: 0` and generated files are handled by allowlists, not by weakening the fail.
- We accept snapping growth button padding onto the scale in exchange for one spacing law. Pixel-perfect freeze of 0.8rem / 1.1rem would keep guesswork as policy.
- We accept no `className` on `Button` in exchange for stopping `p-8` smuggling. Navbar-only exceptions go through `brand.css` variables.
- We accept Field cloning a single native child in exchange for not shipping a fake `<Input>` API. Multiple children in Field is a type we do not model. Put helper text in `hint`.
- We accept operate contract/review sharing dashboard density in exchange for one kit. Those routes are tasks, not landing pages.
- We accept deleting `globals.css` rather than a compatibility period in exchange for not teaching two button classes. Unmigrated pages look wrong until their commit lands. Sequence by route so each commit is checkable (`sequence-verifiable-units`).

## Alternatives considered

- **Tailwind utilities as the system.** Pages write `py-20 gap-6`. The public "API" is the entire spacing scale plus arbitrary values. Callers still guess. Off-scale `gap-2.5` and `p-[13px]` stay representable. Types hide nothing. Lost on interface depth and on unrepresentability.
- **Numeric `gap={4}` / `p={4}` on a Box.** One Box is a shallow module. Every page re-implements section vs stack by picking numbers. The role knowledge leaks to every caller. Lost to role-owned components.
- **Wrap `globals.css`.** Map `.btn` to `.growth-button`, keep honey hex on contract. Dual kit becomes architecture. Lost (`migrate-callers-then-delete-legacy-apis`). The task already forbids wrapping.
- **Two kits, persuade vs operate.** Doubles every control. Density is a token map, not a fork. Lost on laziness and on "do not invent a third identity."
- **CSS variables only, no React kit.** Marketing would still paste `padding: var(--space-20)` or the old 80px. The page layer can represent anything CSS can. Lost. Variables are the implementation. Roles-as-components are the constraint.
- **React ThemeProvider plus context density.** Pass-through of a string CSS already inherits. Extra file on every trace. Lost (`minimize-reader-load`).

## Open questions and risks

- Should blog post chrome (`blog-*`) move onto `Section`/`Stack` in the first wave, or wait until marketing routes are green? The space check will fail `blog-*` padding until someone rewrites or the selectors die.
- Is 78rem still the shell max after gutters snap to 40px? Growth already uses `min(100% - 2.5rem, 78rem)`. I kept both. Should the max width be a token next to `SPACE`?
- Do we fail `check:space` on `src/app/brand.css` growth chrome in the same PR as the scale, or emit a temporary allowlist for unsnapped chrome? I would snap chrome in the scaffold PR so the check is honest from commit one.
- Intake already uses Tailwind form utilities. Does that route migrate to `Field` immediately, or only after `check:space` bans `mb-2`?

## Next implementation step

Add `src/ui/space.ts` and `scripts/check-space.mjs`, generate `space.theme.css`, run the check so it fails on current `globals.css`, then implement `Page`/`Section`/`Stack` against that red check.
