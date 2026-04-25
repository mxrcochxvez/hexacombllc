<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Commands
- `npm run dev` — development server (Cloudflare dev via `@opennextjs/cloudflare` init in next.config.ts)
- `npm run build` — `next build`
- `npm run lint` — ESLint (flat config, no `--fix` flag by default)
- `npm run preview` — build + Cloudflare preview
- `npm run deploy` — build + deploy to Cloudflare Workers
- `npm run cf-typegen` — generate `cloudflare-env.d.ts` from wrangler config
- No dedicated typecheck or test commands exist in this repo.

## Architecture
- **Next.js 16 App Router** (`src/app/`), deployed to **Cloudflare Workers** via `@opennextjs/cloudflare`, not Vercel.
- **Styling**: Tailwind CSS v4 with `@tailwindcss/postcss` PostCSS plugin (not the v3 CLI). Global styles in `src/app/globals.css`.
- **Path alias**: `@/*` → `./src/*` (tsconfig paths).
- **OpenNext config**: uses R2 incremental cache (`open-next.config.ts`).
- **Wrangler config**: worker `hexacombllc`, self-reference binding, R2 bucket for cache, image optimization enabled.
- **Environment**: `.dev.vars` sets `NEXTJS_ENV=development` for Cloudflare local dev. Don't use `.env.local`.

## Conventions
- All source code lives under `src/` (app router, no pages router).
- TypeScript strict mode, `noEmit: true`, `moduleResolution: bundler`.
- Flat ESLint config (`eslint.config.mjs`) with `eslint-config-next` core-web-vitals + typescript rules.
- This is a static marketing/landing page site — no backend API routes, no database, no auth.
