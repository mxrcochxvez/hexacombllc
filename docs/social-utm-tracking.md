# Instagram and Facebook UTM tracking

Google Analytics 4 is already installed. Use **tagged links** in social bios, posts, Stories and ads so GA4 can attribute visits and Hexacomb can identify the campaigns that produce leads.

## Ready-to-use links

- Instagram bio: https://hexacombllc.com/?utm_source=instagram&utm_medium=social&utm_campaign=profile&utm_content=bio
- Instagram Story: https://hexacombllc.com/?utm_source=instagram&utm_medium=social&utm_campaign=profile&utm_content=story
- Facebook page: https://hexacombllc.com/?utm_source=facebook&utm_medium=social&utm_campaign=profile&utm_content=page
- Facebook ad: https://hexacombllc.com/?utm_source=facebook&utm_medium=paid_social&utm_campaign=website_growth&utm_content=creative_a

For a promotion, choose a stable lowercase `utm_campaign` (e.g. `october_website_promo`). Use `utm_content` for placements and creative variants. Keep `utm_source` as `instagram` or `facebook` consistently.

## Reporting

In GA4, open **Reports → Acquisition → Traffic acquisition** and review Session source / medium or Session campaign. The site already emits GA4 `generate_lead` events after a form succeeds.

In Hexacomb's `/dashboard`, the leads table shows marketing source and campaign; lead details show all five fields. A lead's **Form** field (contact/intake) is separate from its marketing source. Contact and intake notifications include campaign details. The first-party `/api/track` endpoint writes events to Worker logs rather than a reporting database.

## Consent and limitations

UTM capture runs **only after cookie/analytics consent is accepted**; data is stored in `sessionStorage` in that browser tab. The last explicitly tagged campaign wins, and untagged navigation keeps it. Declining consent clears the stored attribution. Only the five allowlisted UTM fields are collected; no arbitrary URL parameters are saved.

Untagged organic social links may show up as referrals in GA4 but will not produce a campaign label in Convex. This feature does not install the Meta Pixel or Conversions API.

**Deployment:** Push the Convex schema/functions to production (e.g. `npx convex deploy`) as well as the Next.js Cloudflare Worker, then test tagged click → accept consent → navigate → submit lead → inspect dashboard and email. GA4 Realtime / DebugView can help verify campaign reporting.
