# Halloween edition

## Return to the normal website

In `src/lib/seasonal-theme.ts`, change just the value of `SITE_THEME` from
`"halloween"` to `"default"`, then build/deploy through the normal process.
This restores the original homepage hero, original sales copy, normal colors,
and original visual components. It removes the seasonal atmosphere and all
seasonal styling. The holiday does not depend on visitor storage or the date.
Reverting this PR is an alternative.

## Coverage

- Home: original illustrated haunted-studio hero, sales-led headline and CTA,
  updated service headings, portfolio heading, contact and founder sections.
- About, how it works, pricing, website audit, nonprofit/causes, blog index:
  shared seasonal page heroes with page-specific sales headlines, all content
  panels, cards, navigation, footer, buttons and contact forms.
- Intake: seasonal project headline and themed form.
- Blog articles: seasonal reading surfaces; article content remains intact.
- Dashboard and nested lead/client/blog screens, contract and feedback pages:
  shared palette, controls and chrome. Workflow labels and agreement text stay
  literal. No decorative overlay on transactional pages.
- Design-review route: seasonal outer surface and shared tokens; client design
  iframes intentionally retain the client’s own design.
- 404: seasonal colors and message.
- API, metadata, analytics and business logic are unchanged.

## Effects and accessibility

CSS-only slow fog and three drifting embers sit outside the content, never
capture input, and can be paused via the fixed “Pause atmosphere” button.
Reduced-motion visitors get a static atmosphere and no animated hover movement.
No rapid flashing, added canvas/WebGL, remote assets or external dependencies.
Original data-heavy water/metal/wave artwork is not mounted in holiday mode.
All Halloween artwork is authored local SVG, not third-party stock.

## Verification

Run `npx tsc --noEmit` and lint the changed files. The repository’s existing
StaggeredMenu ref-during-render errors affect full-repository lint independently
of this feature. The original Next/OpenNext development setup requires Cloudflare
remote bindings; local visual checks may use a temporary uncommitted
`initOpenNextCloudflareForDev({ remoteBindings: false })` setting. Never commit
that QA-only override or deploy it.

Before merge, verify every public route at desktop/mobile sizes, mobile menu,
contact/intake validation without submitting real leads, the atmosphere pause,
reduced motion, and the single-switch normal edition. Do not send production
contact requests or create CRM records during preview verification.
