# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static personal website for emre.xyz, deployed via Cloudflare Workers using Wrangler. The site is a personal hub (home + `/projects/`) linking to profiles, blog, resume, and subdomain projects.

## Deployment

This is a **Cloudflare Pages** project. Requires Node 22 via nvm.

```bash
make deploy  # sources ~/.nvm/nvm.sh, switches to Node 22, runs: npx wrangler pages deploy .
```

`CLAUDE.md`, `Makefile`, `.wranglerignore`, `design.md` and `.hallmark/` are excluded from uploads via `.wranglerignore`.

## Structure

- `index.html` — homepage; `projects/index.html` — full project index; `404.html`. No build step, no bundler
- `components/` — shared by every page (and loaded by subdomains): `tokens.css` (design tokens), `theme.css` (fonts + shared layout primitives), `site.css` (page-specific pieces), `ui.js` (`<emre-header>` / `<emre-footer>` web components)
- `design.md` — the locked design system (Hallmark · modern-minimal · Cobalt); read it before changing any page
- `dist/` — static assets served by Cloudflare (`[assets]` binding in wrangler.toml)
- `.well-known/nostr.json` — Nostr NIP-05 identity verification for `delirehberi@emre.xyz`
- `fikret-mualla/` and `gulsum-sayim/` — image galleries for Turkish painters
- `me.vcf`, `resume.pdf` — personal files served as static assets

## Styling & Dependencies

No Tailwind, no icon font, no package.json. Plain CSS driven by tokens in `components/tokens.css` (OKLCH colours, 4pt spacing); never hardcode colours or fonts in pages.
- **Fonts** — Space Grotesk (display), Inter (body), JetBrains Mono (labels/code) via Google Fonts, imported in `theme.css`
- Every page copies the same head block (preconnects, pre-paint theme script, `theme.css`, `site.css`, `ui.js`) and body shell (`<emre-header active-page=…>` → `<main class="page">` → `<emre-footer>`); see `design.md`

Dark mode: `.dark` on `<html>`, set before paint by an inline script and toggled by `ui.js`; persisted in `localStorage['theme']`, otherwise follows `prefers-color-scheme`.
