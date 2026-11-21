# Leonida Field Guide

A spoiler-free, progress-aware playthrough companion for *Grand Theft Auto VI*, built as an iPhone-first Progressive Web App.

It answers one question: **"Given exactly where I am right now, what's the smartest thing to do next?"** It never reveals what happens next.

> Unofficial fan project. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. No Rockstar artwork or branding is used.

## Status

- **App:** all five tabs (Home, Strategy, Money, Explore, Journal), plus Check Before Starting, one-tap completion with undo, onboarding with one-tap starting points, backup and import, and offline shell. Installable on iPhone.
- **Try this:** 11 viral, community-discovered stunts in Explore (ATM yank, plane pinball, and more), each with sources and a confidence label. Not missions, not 100%.
- **Engine, persistence and gateway** (Codex): integrated. Progress lives in IndexedDB on your device, and guide content is filtered server-side for your progress.
- **Content:** the whole game, from the prologue through the finale and the post-game: 267 researched records verified against guide pages read on Nov 21, 2026. That covers story, side questlines, money, points of no return, the 100% checklist, all 55 trophies and viral stunts. See [`docs/research/COVERAGE.md`](docs/research/COVERAGE.md).
- **Install on iPhone:** see [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md).

### Known limitations
- The guide can't read your console save. It knows only what you record.
- Research is two days post-launch. Where sources disagree, the guide says "Not fully verified" rather than "Safe to advance".
- Collectible locations aren't mapped (totals and tips only); sources haven't finished them yet.
- Onboarding: pick a one-tap starting point (your milestone or any chapter), or type the last mission you finished. Any exact title or verified nickname works.
- Optional missions whose real titles give things away show as **"Spoiler"**.

## Develop

```bash
npm install
npm run dev          # http://localhost:3000
npm run check        # typecheck + lint + unit tests
npm run build
npm run test:e2e     # Playwright on iPhone 15 / iPhone SE viewports (after a build)
```

## Docs

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md): stack, the spoiler boundary, data flow
- [`docs/CONTRACTS.md`](docs/CONTRACTS.md): shared interfaces (`src/contracts/`)
- [`docs/COLLABORATION.md`](docs/COLLABORATION.md): Claude ↔ Codex ownership and workflow
- [`docs/research/SPOILER_STYLE.md`](docs/research/SPOILER_STYLE.md): rules for player-facing copy and titles
- [`docs/DEPLOYMENT.md`](docs/DEPLOYMENT.md): Vercel + iPhone Home Screen install
- `npm run content:validate`: dataset schema, integrity, evidence and spoiler lint

The core guide needs no API keys and has no recurring costs.
