# Premium everyday edition

Homepage order: video hero → services (with plain-language answers) → Marco → review layout → contact → footer.

## Media

`src/lib/hero-media.ts` points to the owner's selected Drive advert, not a substitute stock video. The original is a49.49-second1080×1920 portrait clip. A480×854 H.264/AAC fast-start edition keeps its full framing, captions and audio while reducing transfer to about2.61MB from52.47MB. Poster is90KB. Autoplay is muted; sound is opt-in. Reduced-motion and Save-Data visitors get the poster and an explicit Play control. Do not crop the portrait video into a landscape background. No Instagram iframe or external social script is required.

## Reviews

`src/lib/testimonials.ts` contains an empty editable collection. Neutral, non-animated skeleton shapes show the agreed layout until genuine approved reviews are available. No quotes, people, stars or review/rating schema are invented. Add the exact quote, attribution, optional local photo and original public source; set `approvedForPublication` only with real approval. Approved entries replace the skeletons automatically.

## Work

All five existing projects remain at`/work`, linked from the header, hero, services and footer. AAC and Ruiz retain their verified preview URLs and honest preview labels.

## Search foundation

- Server-rendered service/bio/answer text, semantic headings and crawlable links.
- Unique route metadata, canonicals, Open Graph and Twitter values.
- Organization/ProfessionalService, Person, Website and actual Service entities describe visible business facts; no fabricated awards, ratings or establishment dates.
- Sitemap includes /work and keeps static entries available during a blog-service outage. Private workflows stay noindex and keep their existing authentication/token requirements.
- Native scrolling/navigation, server page heroes/footer, fewer font families, no WebGL/canvas/GSAP homepage effects, no custom cursor or perpetual footer timer.

These are eligibility, usability and performance improvements—not a promise of rankings, AI citations or traffic. Google documents no special AI schema requirement: https://developers.google.com/search/docs/appearance/ai-features . Bing emphasizes crawlable useful content and accurate sitemaps: https://www.bing.com/webmasters/help/bing-webmaster-guidelines-30fba23a .

## Seasonal switch

`SITE_THEME` is`default`. Archived Halloween styling/artwork stays dormant; it is not mounted on public pages. The premium homepage is the new baseline, not the old animated laptop hero.

## Hero background

The selected portrait advert fills the hero behind the copy. Desktop uses a cover crop with a 32% vertical focal point, a flat dark overlay, muted inline autoplay and visible pause/sound controls. Reduced-motion and Save-Data visitors see the poster until they choose play. The full portrait composition is necessarily cropped on wider screens.
