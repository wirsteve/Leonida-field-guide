# Research

- [`SPOILER_STYLE.md`](SPOILER_STYLE.md): rules for every player-facing string and title.
- [`COVERAGE.md`](COVERAGE.md): what's researched, at what confidence, and what isn't (spoiler-free summary).
- `restricted/`: raw research. **Contains story spoilers.**

## Method

1. Research each fact from post-launch sources. Pre-release articles and trailers are never evidence of gameplay.
2. Record it with the URL, check date, confidence, availability, expiry and an evidence note, in our own words.
3. Treat conflicts as conflicts. Never resolve them by guessing.
4. Author `GuideRecord`s in `src/content/guide/`. Player copy follows `SPOILER_STYLE.md`; reasons go in `restricted`.
5. Run `npm run content:validate` and `npm test` (spoiler-leak suite).

Confidence levels: **high** = official, or 2+ independent publishers (GTABase often mirrors PowerPyx, so the pair counts as roughly 1.5). **medium** = one reputable page read directly. **low** = forum or unclear. **unverified** = never drives a "safe" verdict.
