<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` — development server (initializes `@opennextjs/cloudflare` via side-effect in `next.config.ts`)
- `npm run build` — `next build`
- `npm run lint` — ESLint (flat config, no `--fix` flag by default)
- `npm run preview` — build + Cloudflare preview
- `npm run deploy` — build + deploy to Cloudflare Workers
- `npm run upload` — build + upload to Cloudflare (separate from deploy)
- `npm run cf-typegen` — generate `cloudflare-env.d.ts` from wrangler config
- No dedicated typecheck or test commands exist in this repo.

## Architecture
- **Next.js 16 App Router** (`src/app/`), deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`, not Vercel.
- **API routes** exist in `src/app/api/`:
  - `contact/route.ts` — accepts form submissions, verifies Turnstile token, sends email via Resend.
  - `track/route.ts` — lightweight analytics ingestion (logs to worker console).
- **Styling**: Tailwind CSS v4 is configured in `postcss.config.mjs`, but `src/app/globals.css` uses **custom CSS** (no `@import "tailwindcss"`). Do not assume Tailwind utility classes are available.
- **Path alias**: `@/*` → `./src/*` (tsconfig paths).
- **OpenNext config**: uses R2 incremental cache (`open-next.config.ts`).
- **Wrangler config**: `wrangler.jsonc` (JSON with comments). Worker `hexacombllc`, self-reference binding, R2 bucket for cache, image optimization enabled.
- **Environment**: `.dev.vars` sets `NEXTJS_ENV=development` for Cloudflare local dev. Don't use `.env.local`.

## Secrets & Env Vars
- **Local dev secrets** live in `.dev.vars` (never commit). Current keys:
  - `RESEND_API_KEY` (placeholder value `re_placeholder` — replace for real email sending)
  - `TURNSTILE_SECRET_KEY`
  - `CONTACT_TO_EMAIL`
  - `NEXTJS_ENV=development`
- **Public vars** are defined in `wrangler.jsonc` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CONTACT_TO_EMAIL`).
- `CONTACT_FROM_EMAIL` defaults to `onboarding@resend.dev` in code if unset.

## Conventions
- All source code lives under `src/` (app router, no pages router).
- TypeScript strict mode, `noEmit: true`, `moduleResolution: bundler`.
- Flat ESLint config (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals + typescript rules.
- `next.config.ts` exports an empty config object; the `@opennextjs/cloudflare` dev init is a **side-effect dynamic import at the bottom of the file** — do not remove or reorder.
