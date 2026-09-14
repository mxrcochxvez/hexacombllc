# Visual system grounding (how explorers)

Repo: `/Users/marcochavez/Desktop/projects/hexacombllc`
Worktree for edits: `.worktrees/ui-system` on `feat/ui-system`

## Live look (not DESIGN.md)

Shipped look is `src/app/brand.css` "Search-to-call growth world":
- Fonts: Archivo Black (`--font-display`) + Public Sans (`--font-sans`) in `src/app/layout.tsx`
- Colors: OKLCH canvas/surface/ink/accent/signal/deep in `@theme`
- Chrome: `.growth-*` classes, shell `min(100% - 2.5rem, 78rem)`, square-ish growth buttons (ink / signal yellow)
- Tailwind v4 is imported in `brand.css` (`@import "tailwindcss"`). Forms/cookie use utilities. Marketing layout is custom classes.

DESIGN.md (Libre Franklin, Literata, warm paper hue 75, py-20, 72rem, 6px radius) is not what ships.

## Dual CSS

Every page loads `brand.css` then `globals.css`.
- New: `growth-*`, `@theme` tokens
- Old: `.btn`, `.form-group`, `.dash-*`, `.blog-*`, `.audit-*`, `.contract-shell`, `.review-*`, honey/amber hex `:root`
- No `src/ui` folder. No `--space-*` scale.

## Pages

New: home, about, pricing, how-it-works, plus growth chrome on about/pricing/how-it-works.
Mixed: website-audit (growth page + `.audit-tool` / `.btn`), intake (growth page + Tailwind form), blog index (growth-shell + `blog-*`).
Older: blog post (`.blog-post`, `.btn-primary`), dashboard, contract, feedback, review (hardcoded hex).

Navbar: About, How it works, Website audit, Plans, Blog. Footer omits How it works. PromoBanner unused.

## Spacing today

No scale. Marketing: one-off rem + clamp. Global `section { padding: 80px 0 }` still applies; `.growth-hero` does not override it. Dashboard: 40/20/80 px. Hand-copied `mb-2`…`mt-8` in globals even though Tailwind exists.

## Constraints for the new library

User: 4px increments, no guesswork, small UI library, redesign as if this was day one, align every page to the new (growth) look. Impeccable: preserve shipped growth world; Operate surfaces should stay task-first (familiar controls, restrained accent). Do not invent a third visual identity.
