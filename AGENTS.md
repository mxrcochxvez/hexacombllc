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
- `npm run cf-typegen` — generate `cloudflare-env.d.ts` from wrangler config (gitignored; optional local typing aid)
- `npm run convex:dev` — sync Convex functions to the linked dev deployment (`npx convex dev`)
- No dedicated typecheck or test commands exist in this repo.

## Architecture
- **Next.js 16 App Router** (`src/app/`), deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`, not Vercel.
- **Public routes** currently include `/`, `/about`, `/pricing`, `/website-audit`, and `/intake`.
- **Internal / noindex routes** (not in Navbar or sitemap):
  - `/dashboard` — password-gated lead list + login (`ADMIN_PASSWORD` cookie session).
  - `/dashboard/leads/[id]` — lead detail, typed status changes, contract draft / “Submit for review”.
  - `/dashboard/clients` and `/dashboard/clients/[id]` — post-sale clients, notes/replies, feedback link, design demos.
  - `/contract/[token]` — client web acceptance of the website agreement (unguessable `accessToken`).
  - `/feedback/[token]` — overall / current-site client feedback form.
  - `/review/[token]` — chrome-free design-demo iframe; floating chat bubble for feedback on that demo.
- **API routes** exist in `src/app/api/`:
  - `contact/route.ts` — accepts form submissions, verifies Turnstile token, creates a Convex lead (`source: contact`, cool), then sends email via Resend. Convex write failures are logged and do not block email.
  - `intake/route.ts` — project intake submissions; creates a Convex lead (`source: intake`, warm), then emails via Resend.
  - `track/route.ts` — lightweight analytics ingestion (logs to worker console).
  - `audit/route.ts` — first-pass public website audit. Accepts a URL, fetches one HTML page server-side, and returns plain-English SEO, load-time, and issue checks. It optionally uses the Cloudflare Workers AI binding for recommendation bullets. Keep SSRF protections and public-URL validation in place when editing.
  - `dashboard/*` — login/logout, leads, clients, notes (including delete), design demos create/send/close, contract draft + send (session cookie required).
  - `contract/[token]` + `accept` — public token-gated contract read/accept; accept notifies `CONTACT_TO_EMAIL` via Resend.
  - `feedback/[token]` — public client feedback submit.
  - `review/[token]/comments` — public design-demo text feedback attached to a demo (no pins/screenshots).
- **Convex** (`convex/`) stores CRM leads, contracts, clients, notes, feedback, and design demos. Schema is in `convex/schema.ts`. Lead + contract + client phase + design-demo status constants live in `convex/statuses.ts`. Mutations/queries: `convex/leads.ts`, `convex/contracts.ts`, `convex/clients.ts`, `convex/designDemos.ts`. Form/dashboard APIs use `ConvexHttpClient` helpers in `src/lib/convex.ts` (no React `ConvexProvider` yet). Lead pipeline: `fresh` → `contacted` → `qualified` → `proposal_sent` → `negotiating` → `contracted` (terminal), with `lost` / `nurture` side paths; contract send may set `proposal_sent` if not already further along; client accept sets lead to `contracted`.
- **Interactive client components** live in `src/components/`:
  - `WebsiteAuditTool.tsx` calls `/api/audit` and renders CEO-friendly audit results.
  - `ContactForm.tsx` is dynamically loaded through `ContactFormClient.tsx` because Turnstile is client-only.
  - `IntakeForm.tsx` powers `/intake`.
  - Dashboard + contract + review UI: `DashboardLoginForm`, `DashboardLeadList`, `DashboardLeadDetail`, `DashboardClientDetail`, `ClientFeedbackForm`, `DesignReviewViewer`, `ContractAcceptForm`, `AgreementTerms` (HTML port of `public/website_agreement.pdf`).
- **Styling**: Tailwind CSS v4 is configured in `postcss.config.mjs`, but `src/app/globals.css` uses **custom CSS** (no `@import "tailwindcss"`). Do not assume Tailwind utility classes are available.
- **Path alias**: `@/*` → `./src/*` (tsconfig paths).
- **OpenNext config**: uses R2 incremental cache (`open-next.config.ts`).
- **Wrangler config**: `wrangler.jsonc` (JSON with comments). Worker `hexacombllc`, self-reference binding, R2 bucket for cache, image optimization enabled.
- **Cloudflare Workers AI**: `wrangler.jsonc` defines an `AI` binding with `remote: true`. Route handlers can access it with `getCloudflareContext().env.AI`; keep AI calls optional/failable so core flows still work locally and during demos. Workers AI uses remote Cloudflare resources and may incur usage charges during local preview/dev.
- **App route groups**: `(site)` wraps marketing/dashboard pages with Navbar/Footer; `(bare)` is chrome-free for `/review/[token]`.
- **Environment**: `.dev.vars` sets `NEXTJS_ENV=development` for Cloudflare local dev. Don't use `.env.local` for app secrets (Convex CLI may write `CONVEX_DEPLOYMENT` / `NEXT_PUBLIC_CONVEX_URL` there — keep `LEAD_INGEST_SECRET` and app secrets in `.dev.vars` as well).

## Secrets & Env Vars
- **Local dev secrets** live in `.dev.vars` (never commit). Current keys:
  - `RESEND_API_KEY` (placeholder value `re_placeholder` — replace for real email sending)
  - `TURNSTILE_SECRET_KEY`
  - `CONTACT_TO_EMAIL`
  - `NEXTJS_ENV=development`
  - `NEXT_PUBLIC_CONVEX_URL` (Convex deployment URL; local uses the dev deployment)
  - `LEAD_INGEST_SECRET` (shared with Convex env; gates `leads.*` and admin `contracts.*` writes/reads)
  - `ADMIN_PASSWORD` (gates `/dashboard` via httpOnly session cookie)
  - Optional: `ADMIN_SESSION_SECRET` (HMAC key for session cookie; defaults to `ADMIN_PASSWORD` if unset)
  - Optional: `NEXT_PUBLIC_SITE_URL` (base URL for contract / design-demo invite links; defaults to request origin on localhost, else `https://hexacombllc.com`)
- **Public vars** are defined in `wrangler.jsonc` (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`, `CONTACT_TO_EMAIL`, `NEXT_PUBLIC_CONVEX_URL` for production Convex).
- `LEAD_INGEST_SECRET` must also be set as a Cloudflare Worker secret (`wrangler secret put LEAD_INGEST_SECRET`) and via `npx convex env set LEAD_INGEST_SECRET …` on each Convex deployment.
- `ADMIN_PASSWORD` must be set as a Worker secret for production (`wrangler secret put ADMIN_PASSWORD`). Optionally also `ADMIN_SESSION_SECRET`.
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
- **Workers AI unavailable locally**: The `AI` binding is `remote: true`, so without Cloudflare login the OpenNext dev init logs a one-time `Unhandled Rejection: Failed to start the remote proxy session ... You must be logged in to use wrangler dev in remote mode` on startup. This is non-fatal — `npm run dev` still becomes ready on port 3000 and every page/API works; at runtime `env.AI` calls just fail and are caught gracefully (audit falls back to non-AI results). No Cloudflare credentials are provisioned in the cloud env.
- **Turnstile & Resend**: The contact form's bot-check and email delivery depend on real API keys in `.dev.vars`. With placeholder keys, the rest of the site still works; only contact form submission will fail validation.
- **Convex leads**: Contact and intake APIs write leads after Turnstile. Missing `NEXT_PUBLIC_CONVEX_URL` / `LEAD_INGEST_SECRET` logs and skips the write; email still sends. Manage leads at `/dashboard` (requires `ADMIN_PASSWORD`) or in the Convex dashboard. Set the Worker secret with `npx wrangler secret put LEAD_INGEST_SECRET` before production deploys that need lead writes.
- **Dashboard / contracts**: Set `ADMIN_PASSWORD` in `.dev.vars` locally and `wrangler secret put ADMIN_PASSWORD` for production. Contract invite + signed notification emails need a real `RESEND_API_KEY`.
- **`.dev.vars` not committed**: Local dev secrets are in `.dev.vars` at the repo root. If the file is missing, create it with at minimum `NEXTJS_ENV=development`.
- **Build needs Cloudflare login**: `npm run build` (`next build`) currently **fails without Cloudflare auth** because the `initOpenNextCloudflareForDev()` side-effect in `next.config.ts` also runs during build and tries to open the remote proxy for the `remote: true` AI binding (`Failed to start the remote proxy session`). This is an environment limitation in the cloud VM, not a code bug. Development (`npm run dev`), `npm run lint`, and all product flows work without it. Real builds/deploys (`npm run preview` / `npm run deploy`) require `wrangler login` or a `CLOUDFLARE_API_TOKEN`.

<!-- convex-ai-start -->

This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read
`convex/_generated/ai/guidelines.md` first** for important guidelines on
how to correctly use Convex APIs and patterns. The file contains rules that
override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running
`npx convex ai-files install`.

<!-- convex-ai-end -->
