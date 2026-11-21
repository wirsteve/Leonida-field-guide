# Leonida Field Guide

A spoiler-free, progress-aware playthrough companion for *Grand Theft Auto VI*, built as an iPhone-first Progressive Web App.

It answers one question: **"Given exactly where I am right now, what's the smartest thing to do next?"** It never reveals what happens next.

> Unofficial fan project. Not affiliated with or endorsed by Rockstar Games or Take-Two Interactive. No Rockstar artwork or branding is used.

## Status

Foundation: stack, shared contracts v1, module ownership, and the app shell. The guide engine, persistence layer, researched content and full screens arrive in follow-up PRs. See `docs/COLLABORATION.md`.

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
- [`docs/research/SPOILER_STYLE.md`](docs/research/SPOILER_STYLE.md): rules for player-facing copy

The core guide needs no API keys and has no recurring costs.
