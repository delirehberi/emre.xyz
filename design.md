# Design — emre.xyz

The locked design system for emre.xyz and its subdomains. Every page reads this file before it changes. Don't regenerate the system per page; extend or amend this file when it needs to grow.

## Genre
modern-minimal, with the Cobalt theme: a cool engineered canvas, one cobalt signal, hairlines instead of shadows, and mono labels.

## Macrostructure family
- **Hub pages** (home, projects): Index-First. A short intro, then categorised index rows (`.index` > `.row`). Section heads are stacked (heading, then an optional one-line lede). There are no tag-left/heading-right layouts and no numbered eyebrows.
- **Utility pages** (404): a single `.not-found` block inside `.page`.
- Each page may have **one** dark graphite `.band` (the home page uses it for Nostr/Lightning identity).

## Shared skeleton (every page)
Head, in this order: Google Fonts preconnects → the inline pre-paint theme script (copy it verbatim from `index.html`) → `/components/theme.css` → `/components/site.css` → `<script type="module" src="/components/ui.js">`.

Body: `.skip-link` → `<emre-header active-page="home|projects|blog|news|nostr|none">` → `<main id="main-content" class="page">` → `<emre-footer>`.

## Theme (`components/tokens.css`)
| Token | Light | Dark (`.dark`) |
|---|---|---|
| `--color-paper` | oklch(98.5% 0.004 250) | oklch(17.5% 0.012 260) |
| `--color-paper-2` | oklch(96.2% 0.006 252) | oklch(21% 0.014 260) |
| `--color-ink` | oklch(24% 0.02 258) | oklch(95% 0.006 255) |
| `--color-ink-2` | oklch(34% 0.018 257) | oklch(84% 0.01 256) |
| `--color-ink-3` | oklch(48% 0.016 257) | oklch(68% 0.014 256) |
| `--color-rule` | oklch(90.5% 0.008 255) | oklch(28% 0.016 260) |
| `--color-accent` | oklch(52% 0.2 258) | oklch(72% 0.15 256) |
| `--color-focus` | oklch(55% 0.2 256) | oklch(74% 0.15 256) |
| `--color-band` | oklch(21% 0.016 260) | oklch(13.5% 0.012 262) |

Keep the accent under ~5% of any viewport. Use it only for the primary button, link hovers, the active nav underline and focus rings.

## Typography
- Display: Space Grotesk 600 (h3: 500), tracking -0.03em, always upright.
- Body: Inter 400/500/600.
- Mono: JetBrains Mono 400/500, for labels (UPPERCASE, 0.06em), URLs, tags and key–value lists.
- Scale: `--text-display` clamp(2.25rem → 3.75rem), `--text-2xl` for section heads.

## Spacing
4pt named scale (`--space-3xs` … `--space-3xl`). Sections are separated by `--space-3xl` (`--space-2xl` below 40rem). Pages use named tokens only.

## Shape
1px hairlines (`--rule-width`), 6px radius on controls, 10px on panels. No drop shadows, gradients, glass or blur.

## Motion
- Easings: `--ease-out` cubic-bezier(0.22, 1, 0.36, 1), `--ease-in`, `--ease-in-out`.
- Allowed: colour/border transitions (`--dur-fast`), the nav underline grow (`--dur-base`). No scroll reveals and no autoplay.
- Reduced motion: all transitions drop to 0ms.

## Microinteractions stance
Silent. Links shift colour on hover. `:focus-visible` shows a 2px `--color-focus` ring right away, never animated. Hit targets are ≥ 44px on mobile.

## Components (in `theme.css` unless noted)
`.btn.btn-primary` (one per view), `.btn-secondary`, `.arrow-link`, `.index` / `.row` / `.row-title` / `.row-url` / `.row-body` / `.row-links`, `.tags`, `.kv`, `.inline-list`, `.label`, `.lede`. In `site.css`: `.intro`, `.whoami`, `.row-pair`, `.band`, `.anchors`, `.communities`, `.more`, `.not-found`.

## Copy
Declarative and specific. Name the protocol, the language, the destination. Never invent metrics or testimonials. Link text names where it goes ("Hackage", "Book a call"), never "click here".

## Breakpoints
60rem: grids collapse to one column. 40rem: page padding tightens and the key–value lists stack. 48rem: the header switches to the menu button. Verify at 320 / 375 / 414 / 768 px.
