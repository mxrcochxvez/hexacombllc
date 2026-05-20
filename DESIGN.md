# Hexacomb — Design system

## Theme

**Light.** A business owner reviews the site on a phone in a bright shop or truck cab; the UI should feel like a clean letter, not a dim product dashboard.

## Color (OKLCH, restrained strategy)

| Role | Value | Usage |
|------|--------|--------|
| Canvas | `oklch(98.5% 0.008 75)` | Page background, warm paper |
| Surface | `oklch(96% 0.012 75)` | Alternating sections |
| Ink | `oklch(22% 0.025 265)` | Headings, body |
| Ink muted | `oklch(48% 0.02 265)` | Secondary text |
| Border | `oklch(88% 0.015 75)` | Dividers, inputs |
| Accent | `oklch(52% 0.14 45)` | CTAs, links, focus (~8% of UI) |
| Accent hover | `oklch(46% 0.14 45)` | Button hover |
| Deep | `oklch(24% 0.03 265)` | Contact section background |

Never use pure `#000` or `#fff`. Neutrals are tinted warm (hue ~75).

## Typography

- **Display:** Libre Franklin — headings, nav, buttons
- **Body:** Literata — paragraphs, form labels, long copy
- Scale: fluid `clamp()` for h1/h2; body 1.0625rem / 1.65 line-height; max line length 65ch
- Hierarchy via weight (600/700 display, 400 body) and size steps ≥1.25

## Components

- **Primary button:** filled accent, 6px radius, no glow shadows
- **Secondary button:** ink border on canvas
- **Nav:** solid canvas background, 1px border-bottom, no blur/glass
- **Service rows:** numbered list with horizontal rules, not card grid
- **Form:** white surface on deep section; 6px radius inputs, accent focus ring

## Layout

- Max content width: 72rem (`max-w-6xl`)
- Hero: asymmetric 2-column (copy left, photo right on lg+)
- Section rhythm: `py-20` / `py-28` alternating canvas/surface
- Left-aligned headings; avoid centered stacks

## Imagery

Hero: verified Unsplash — small business owner at laptop (`photo-1600880292203`). Alt text describes the scene, not "business photo".

## Motion

Subtle opacity/transform on hero image only. Ease-out cubic-bezier. No bounce. Respect reduced motion.
