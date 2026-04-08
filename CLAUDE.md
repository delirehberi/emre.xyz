# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Static personal website for emre.xyz, deployed via Cloudflare Workers using Wrangler. The site serves a single-page personal hub linking to social profiles, blog, resume, and other projects.

## Deployment

This is a **Cloudflare Pages** project. Requires Node 22 via nvm.

```bash
make deploy  # sources ~/.nvm/nvm.sh, switches to Node 22, runs: npx wrangler pages deploy .
```

`CLAUDE.md`, `Makefile`, and `.wranglerignore` are excluded from uploads via `.wranglerignore`.

## Structure

- `index.html` — the entire single-page site; no build step, no bundler
- `dist/` — static assets served by Cloudflare (`[assets]` binding in wrangler.toml)
- `.well-known/nostr.json` — Nostr NIP-05 identity verification for `delirehberi@emre.xyz`
- `fikret-mualla/` and `gulsum-sayim/` — image galleries for Turkish painters
- `me.vcf`, `resume.pdf` — personal files served as static assets

## Styling & Dependencies

All loaded from CDN, no local package.json:
- **Tailwind CSS** — loaded via CDN with custom config inline in `index.html`
- **Phosphor Icons** — `@phosphor-icons/web` via unpkg
- **Inter font** — Google Fonts
- **lightning-messageboard** — `@getalby/lightning-messageboard` via esm.sh (Bitcoin Lightning message board)

Dark mode is implemented with Tailwind's `class` strategy, toggled via JS and persisted in `localStorage`.
