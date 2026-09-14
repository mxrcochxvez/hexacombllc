# How Hexacomb’s visual design system works

## Overview

There is no component library and no spacing scale. What ships is two CSS files stacked in the root layout: `brand.css` (Tailwind v4 + the “Search-to-call growth world”) then `globals.css` (honey/amber hex tokens plus every older kit). `DESIGN.md` describes a different system (Libre Franklin, Literata, warm paper hue 75, 72rem, 6px radius) and is not implemented.

The live marketing look is Archivo Black + Public Sans, OKLCH canvas/ink/accent/signal/deep, `.growth-*` chrome, and a 78rem shell. Home, About, Pricing, and How it works use that kit end to end. Audit, intake, and the blog index sit on growth chrome with older widgets inside. Dashboard, contract, feedback, blog posts, and the design-review viewer still use parallel kits. Dashboard lives inside the marketing Navbar/Footer.

Spacing is decided per class: rem/`clamp` in `brand.css`, a global `section { padding: 80px 0 }` in `globals.css`, dashboard `40px / 20px / 80px`, and hand-copied Tailwind-named utilities at the bottom of `globals.css`. There is no `--space-*` token.

## Key Concepts

**Growth world vs leftover kits.** `brand.css` is the intended public identity: display type, square-ish ink/signal buttons, `.growth-shell` (`min(100% - 2.5rem, 78rem)`). Everything else is leftover CSS that still wins wherever markup still uses `.btn`, `.dash-*`, `.blog-*`, `.audit-*`, `.contract-shell`, or `.review-*`.

**Two token layers.** Tailwind `@theme` in `brand.css` maps OKLCH roles (`--color-canvas`, `--color-ink`, `--color-signal`, …) and `--font-sans` / `--font-display`. `globals.css` `:root` remaps the old honey stack onto hex (`--color-amber: #b45309`, `--honey`, `--color-bg`, `--radius: 8px`) and **redeclares** `--color-border` and `--font-display`. Later `:root` wins for those names, so Tailwind `border-border` and any `var(--color-border)` after load are the slate hex, not the OKLCH theme value.

**Tailwind is on, but marketing is not utility-first.** `@import "tailwindcss"` is live. Cookie banner, contact, and intake use utilities (`bg-canvas`, `text-ink`, `mb-4`). Marketing pages are custom `.growth-*` classes. Dashboard copies a tiny subset of Tailwind spacing class names into `globals.css` instead of using the engine.

**No `src/ui`.** Controls are class names on page components. Operate surfaces share `.btn` / `.form-group` / `.dash-*`. Review is a third palette hardcoded in hex.

**Route chrome.** `(site)` wraps Navbar, Footer, cookie banner, and motion. `(bare)` is chrome-free for `/review/[token]`. Both still inherit both CSS files from `src/app/layout.tsx`.

## How It Works

Fonts are loaded in `layout.tsx` (`Archivo_Black` → `--font-archivo-black`, `Public_Sans` → `--font-public-sans`). `brand.css` `@theme` points `--font-display` / `--font-sans` at those variables. Body is `bg-canvas font-sans text-ink`. Focus is a 3px `--color-signal` ring.

Navbar and Footer are growth chrome. Nav: About, How it works, Website audit, Plans, Blog, plus “Take it off my plate”. Footer omits How it works. `PromoBanner` exists (`src/components/PromoBanner.tsx`) and is unused.

**Fully growth:** `/` (`growth-hero`, `growth-problem`, `growth-system`, `growth-proof`, `growth-close`), `/about`, `/pricing`, `/how-it-works` (`growth-page`, `growth-page-hero`, `growth-page-dark`, `growth-page-section`). Contact on home is a growth panel wrapping a Tailwind `ContactForm`.

**Mixed:**
- `/website-audit` — growth page + `WebsiteAuditTool` (`.audit-tool`, `.btn.btn-primary`, honey `.section-label`).
- `/intake` — `growth-page` / `growth-intake-*` + Tailwind field classes in `IntakeForm`.
- `/blog` — `blog-index` + `growth-shell` + `growth-eyebrow`; cards are `.blog-*`.

**Older / parallel:**
- `/blog/[slug]` — `.blog-post`, footer CTA `.btn.btn-primary`.
- `/dashboard/*` — `.dash-page` / `.dash-card` / `.dash-thread` plus `.btn` / `.form-group`. Same marketing header/footer as public pages.
- `/contract/[token]`, `/feedback/[token]` — `.contract-shell` + form kit.
- `/review/[token]` — `.review-shell` dark `#1c1916`, FAB `#1f3a2e`, chat `#fffaf4`. Not growth tokens, not honey.

**Where spacing is decided**

1. **No scale.** No `--space-*`. Increments are whatever the author typed (0.65rem, 1.25rem, 80px, clamp).
2. **Growth sections** that set `padding` on the same element beat the global rule (higher specificity): `.growth-page-hero`, `.growth-page-dark`, `.growth-page-section` use `clamp(5rem, 9vw, 8rem)`. Inner gaps are one-off rem/`clamp` on grids and copy.
3. **Global `section { padding: 80px 0 }`** in `globals.css` still applies to every `<section>` that does not override padding. `.growth-hero` does not; it only pads `.growth-hero-copy`. Home hero therefore stacks 80px section padding on top of the intended clamp padding. A comment in `globals.css` claims homepage sections neutralize this with `style={{ padding: 0 }}` — that override is gone.
4. **Dashboard:** `.dash-page { padding: 40px 20px 80px; max-width: 960px }`. Cards 1.5rem. Toolbar 16px gaps.
5. **Blog index:** `padding: clamp(72px, 10vw, 112px) 0 100px` on `.blog-index`.
6. **Utility leftovers:** `.mb-2` … `.mt-8` at the end of `globals.css` (0.5rem steps) for dashboard/contract markup that looks like Tailwind.
7. **Agreement:** `.agreement-doc section` zeros the global section padding so legal copy is not blown out.

Motion is CSS on `.growth-*` plus `SiteMotion` watching those selectors. It is not a design-token concern.

## Where Things Live

| Piece | Path |
|---|---|
| Fonts + CSS load order | `src/app/layout.tsx` (`brand.css` then `globals.css`) |
| Growth tokens, Tailwind, `.growth-*` | `src/app/brand.css` |
| Honey `:root`, `.btn`, `.form-group`, `.dash-*`, `.blog-*`, `.audit-*`, `.contract-shell`, `.review-*`, `section` padding, copied utilities | `src/app/globals.css` |
| Unshipped spec | `DESIGN.md` (repo root) |
| Site chrome | `src/components/Navbar.tsx`, `Footer.tsx`, `CookieBanner.tsx`, `SiteMotion.tsx` |
| Unused promo | `src/components/PromoBanner.tsx` |
| Marketing pages | `src/app/(site)/page.tsx`, `about/`, `pricing/`, `how-it-works/` |
| Mixed pages | `website-audit/`, `intake/`, `blog/page.tsx` |
| Older operate / legal / review | `(site)/dashboard/`, `contract/`, `feedback/`, `blog/[slug]/`, `(bare)/review/` |
| Tailwind forms on growth | `ContactForm.tsx`, `IntakeForm.tsx` |
| Audit widget | `WebsiteAuditTool.tsx` |
| Component library | none (`src/ui` does not exist) |

## Gotchas

- **`DESIGN.md` is not the source of truth.** Shipping fonts, hues, radius, and max width disagree with that file. Align to growth world, not the markdown spec.
- **Cascade order.** `globals.css` loads last. Shared names (`--color-border`, `--font-display`) and the element rule `section` can undo growth intent without a more specific override.
- **Hero padding.** `.growth-hero` does not cancel `section { padding: 80px 0 }`. Inner copy padding is not a substitute.
- **Dashboard is not a separate skin at the layout level.** It sits in `(site)`, so growth nav/footer wrap honey buttons and 8px-radius cards. Review is the only surface that drops that chrome.
- **Three button languages:** `.growth-button` / `.growth-button-signal` (near-square, ink/signal), `.btn.btn-primary` (8px, honey fill), Tailwind `bg-accent` / `rounded-md` on forms. Audit and blog posts still use honey CTAs on growth pages.
- **Review palette is isolated hex.** Aligning it to growth means rewriting `.review-*`, not swapping tokens.
- **`PromoBanner` is dead code.** Do not treat it as live chrome.
- **Tailwind utilities vs copied class names.** `mb-4` on intake hits the real Tailwind layer. `mb-4` on dashboard hits a duplicate rule in `globals.css`. They currently match; they will drift if only one side is edited.
- **No 4px scale yet.** Any new library has to introduce spacing tokens; nothing existing is wired that way.
- **Operate vs market.** Growth look is the public identity. Dashboard/contract should stay task-first (familiar controls, restrained accent) rather than a third brand or a full marketing restyle of forms.
