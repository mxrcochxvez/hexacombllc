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
- `npm run convex:dev` — sync Convex functions to the linked dev deployment (`npx convex dev`)
- No dedicated typecheck or test commands exist in this repo.

## Architecture
- **Next.js 16 App Router** (`src/app/`), deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`, not Vercel.
- **Public routes** currently include `/`, `/about`, `/pricing`, and `/website-audit`.
- **API routes** exist in `src/app/api/`:
  - `contact/route.ts` — accepts form submissions, verifies Turnstile token, creates a Convex lead (`source: contact`, cool), then sends email via Resend. Convex write failures are logged and do not block email.
  - `intake/route.ts` — project intake submissions; creates a Convex lead (`source: intake`, warm), then emails via Resend.
  - `track/route.ts` — lightweight analytics ingestion (logs to worker console).
  - `audit/route.ts` — first-pass public website audit. Accepts a URL, fetches one HTML page server-side, and returns plain-English SEO, load-time, and issue checks. It optionally uses the Cloudflare Workers AI binding for recommendation bullets. Keep SSRF protections and public-URL validation in place when editing.
- **Convex** (`convex/`) stores CRM leads. Schema is in `convex/schema.ts`; mutations/queries in `convex/leads.ts`. Form APIs call `createLead` via `ConvexHttpClient` in `src/lib/convex.ts` (no React `ConvexProvider` yet). Lead statuses: `fresh` → `contacted` → `qualified` → `proposal_sent` → `negotiating` → `contracted` | `lost` | `nurture`. Manage/update in the Convex dashboard for now; there is no admin UI.
- **Interactive client components** live in `src/components/`:
  - `WebsiteAuditTool.tsx` calls `/api/audit` and renders CEO-friendly audit results.
  - `ContactForm.tsx` is dynamically loaded through `ContactFormClient.tsx` because Turnstile is client-only.
  - `IntakeForm.tsx` powers `/intake`.
- **Styling**: Tailwind CSS v4 is configured in `postcss.config.mjs`, but `src/app/globals.css` uses **custom CSS** (no `@import "tailwindcss"`). Do not assume Tailwind utility classes are available.
- **Path alias**: `@/*` → `./src/*` (tsconfig paths).
- **OpenNext config**: uses R2 incremental cache (`open-next.config.ts`).
- **Wrangler config**: `wrangler.jsonc` (JSON with comments). Worker `hexacombllc`, self-reference binding, R2 bucket for cache, image optimization enabled.
- **Cloudflare Workers AI**: `wrangler.jsonc` defines an `AI` binding with `remote: true`. Route handlers can access it with `getCloudflareContext().env.AI`; keep AI calls optional/failable so core flows still work locally and during demos. Workers AI uses remote Cloudflare resources and may incur usage charges during local preview/dev.
- **Environment**: `.dev.vars` sets `NEXTJS_ENV=development` for Cloudflare local dev. Don't use `.env.local` for app secrets (Convex CLI may write `CONVEX_DEPLOYMENT` / `NEXT_PUBLIC_CONVEX_URL` there — keep `LEAD_INGEST_SECRET` and app secrets in `.dev.vars` as well).

## Secrets & Env Vars
- **Local dev secrets** live in `.dev.vars` (never commit). Current keys:
  - `RESEND_API_KEY` (placeholder value `re_placeholder` — replace for real email sending)
  - `TURNSTILE_SECRET_KEY`
  - `CONTACT_TO_EMAIL`
  - `NEXTJS_ENV=development`
  - `NEXT_PUBLIC_CONVEX_URL` (Convex deployment URL; local uses the dev deployment)
  - `LEAD_INGEST_SECRET` (shared with Convex env; gates `leads.create` / `updateStatus` / `list` / `getByEmail`)
- **Public vars** are defined in `wrangler.jsonc` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CONVEX_URL` for production Convex).
- `LEAD_INGEST_SECRET` must also be set as a Cloudflare Worker secret (`wrangler secret put LEAD_INGEST_SECRET`) and via `npx convex env set LEAD_INGEST_SECRET …` on each Convex deployment.
- `CONTACT_FROM_EMAIL` defaults to `onboarding@resend.dev` in code if unset.
- Day-to-day Convex: `npm run convex:dev`. Production Convex push: `npx convex deploy` (only when intentionally shipping backend changes).

## Conventions
- All source code lives under `src/` (app router, no pages router).
- TypeScript strict mode, `noEmit: true`, `moduleResolution: bundler`.
- Flat ESLint config (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals + typescript rules.
- ESLint ignores generated `.next/`, `.open-next/`, `.wrangler/`, `out/`, `build/`, and `convex/_generated/` output. Do not lint or edit generated OpenNext/Wrangler/Convex artifacts directly.
- `next.config.ts` exports an empty config object; the `@opennextjs/cloudflare` dev init is a **side-effect dynamic import at the bottom of the file** — do not remove or reorder.
- User-facing copy targets small business owners and CEOs who are not technical. Translate SEO, performance, accessibility, and security findings into business impact.
- When adding public pages, update `src/app/sitemap.ts`, page-level `metadata`, and the shared `Navbar` if the route should be discoverable.

## Cursor Cloud specific instructions

- **Single service**: `npm run dev` starts the entire app (Next.js 16 + Turbopack on port 3000). For lead tracking, also run `npm run convex:dev` (or ensure Convex functions were pushed). No databases, Docker, or other local services are required beyond Convex’s cloud backend.
- **No test suite**: There are no automated test commands. Validate changes with `npm run lint` and manual browser testing.
- **Workers AI unavailable locally**: The `AI` binding only works via `wrangler dev` / `npm run preview`. In plain `npm run dev`, Workers AI calls return `undefined` and are caught gracefully — this is expected, not an error.
- **Turnstile & Resend**: The contact form's bot-check and email delivery depend on real API keys in `.dev.vars`. With placeholder keys, the rest of the site still works; only contact form submission will fail validation.
- **Convex leads**: Contact and intake APIs write leads after Turnstile. Missing `NEXT_PUBLIC_CONVEX_URL` / `LEAD_INGEST_SECRET` logs and skips the write; email still sends. View leads in the Convex dashboard. Set the Worker secret with `npx wrangler secret put LEAD_INGEST_SECRET` before production deploys that need lead writes.
- **`.dev.vars` not committed**: Local dev secrets are in `.dev.vars` at the repo root. If the file is missing, create it with at minimum `NEXTJS_ENV=development`.
- **Build**: `npm run build` runs `next build`. For Cloudflare-specific builds use `npm run preview` (builds + local wrangler preview) or `npm run deploy`.
