# Hexacomb — Design system

## Theme

**Dark / Irrigation Canal Blueprint, night water.** A Central Valley owner still needs obvious contrast; the committed marketing world is now dark ink, bright type, and saturated scene color. Care is continuous flow: search → site → call stays open when someone owns the website.

## Color (OKLCH, committed canal teal)

| Role | Value | Usage |
|------|--------|--------|
| Canvas | `oklch(96.5% 0.012 95)` | Sun-bleached concrete page ground |
| Surface | `oklch(93% 0.028 200)` | Water-tinted panels |
| Ink | `oklch(24% 0.045 250)` | Blueprint navy text |
| Ink muted | `oklch(42% 0.03 240)` | Secondary copy |
| Border | `oklch(82% 0.025 210)` | Rules, inputs |
| Accent | `oklch(48% 0.11 210)` | Links, chapter marks, flow ink |
| Accent hover | `oklch(40% 0.1 210)` | Hover |
| Flow | `oklch(62% 0.12 195)` | Active canals / progress |
| Signal | `oklch(78% 0.16 85)` | Citrus sluice-gate CTAs / focus |
| Deep | `oklch(28% 0.055 230)` | Problem / footer water depth |

Never pure `#000` / `#fff`. Neutrals lean warm concrete or cool canal.

## Typography

- **Display:** Geologica — brand marks, chapter titles, buttons
- **Body:** Atkinson Hyperlegible — daylight-readable paragraphs and forms
- Scale: fluid `clamp()` for brand mark and page H1s; body ~1rem / 1.6
- Hierarchy via weight (600–700 display, 400/700 body) and size steps ≥1.25

## Components

- **Primary button:** citrus signal fill, restrained 6px corners, no glow
- **Nav:** dark ink bar / deep mobile drawer; one pill CTA (“Keep it flowing”)
- **Workstreams:** interactive typographic Care / Find / Understand / Improve selector, with contextual illustrative website previews and plain-English tasks.
- **Problem section:** open two-column explanation; no hold gesture required
- **Call flow diagram:** interactive Search → Site → Call
- **Report hotspots:** plain-English callouts, not fake analytics
- **Hero devices:** detailed rounded laptop and phone, matching illustrative screens, studio environment lighting; scroll shifts emphasis scene by scene on desktop and phones; reduced-motion and no-WebGL stay static
- **Subpages:** same dark canvas, Geologica titles, muted body, pill CTAs, and contact close as the homepage. No WebGL journey.

## Layout

- Max content width: ~78rem shell
- Homepage: device-led scroll journey → monthly process + founder → contact
- Subpages inherit the same dark chrome, type, buttons, and contact close
- Left-aligned editorial. No decorative chapter numbers, numbered badges, or redundant eyebrow labels
- Dashboard/CRM kits stay task-focused on a light plane under the same nav and footer

## Motion

- Native scroll with a pinned homepage journey on desktop and phones. Each scene holds until you scroll out of it, then the next scene takes over. Subpages stay regular document flow.
- Render 3D on demand; pause offscreen or in a hidden tab
- Respect `prefers-reduced-motion` with a static device composition and no pinned scroll track
- No site-wide reveal animations or floating signal decorations

## Seed

Irrigation Canal Blueprint — grounded candidate 3, seed `5fa491f1` (degraded roll, no catalog challengers).

## Interaction refinement

- Keep native scrolling. Hero is the focal device story, with an accessible range input and named view buttons so touch and keyboard visitors can explore it directly.
- The laptop recedes as the phone becomes the focus. Keep clear physical separation at every position.
- Service choices update the preview and explanation in place; report choices remain direct controls. Respect reduced motion for every transition.
- User preference: remove all decorative 00/01/02 styling. Personality comes from the devices, expressive typography, restrained color, and purposeful interaction.

### September 2026 marketing direction update

The current marketing direction supersedes the pale canal presentation: dark ink, saturated scene-dependent color, bright typography, and a restrained device-led presentation. The user explicitly requested an Apple-like level of finish, then stronger dark contrast and lively color tied to scroll position. No decorative chapter numbers or floating feature cards.

This world is site-wide on public marketing pages (home, about, how it works, audit, plans, blog, intake). Nav, footer, type, buttons, and the contact close share one chrome. The homepage uniquely owns the WebGL scroll journey. `HeroSection` owns a single time-based scroll clock shared with `HeroWebGL`. Five held compositions sell website creation, responsive design, discovery, inquiry, and ongoing care. Violet moves through aqua, amber, pink, and violet again. HTML remains the source of the sales copy; inactive links leave the tab order. Reduced motion, unavailable WebGL, and no JavaScript use static content. The displayed Fieldwork website is an illustrative concept, not claimed client work. Dashboard, contract, and feedback stay task-focused on a light plane under the same dark chrome.
