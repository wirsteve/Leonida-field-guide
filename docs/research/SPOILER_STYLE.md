# Spoiler style guide for player-facing copy

Every string in `PublicContent`, stage editorial and recommendation copy must pass these rules. Restricted fields (`restricted.*`, `evidence[].supports/notes`) are where the reasons live. They never reach the player.

**Tell the player what to do and when. Never reveal what happens because of it.**

| ✅ Write | ❌ Never write |
|---|---|
| "Complete the remaining optional job before advancing." | "Finish this because a character leaves later." |
| "Last chance: finish this activity before continuing." | "Spend your cash — you'll lose it next chapter." |
| "Make a separate save before starting." | "Explore here because the story moves you somewhere else." |
| "You don't need to grind money right now." | "You'll get a big payout soon." |
| "Safe to leave for later." | "This unlocks again after the heist." |

## Titles

- **Story missions:** the real title is withheld until the player completes the mission. Before that, the gateway shows the neutral label ("Continue the story"). Exception: errand-style steps whose titles only describe the visible task (`nameSafeBeforeStart`).
- **Optional missions and activities:** their names are shown as soon as they unlock. If the official title reveals what happens (a twist, a reward, who gets hurt), author a neutral label as the public `name` ("Billy's next job") and record the canonical title in `TITLE_NOTES` (server-only). The leak test fails if a withheld title ever reaches a response.
- When in doubt, use a neutral label. The player can still find the mission from the Check Before Starting list.

Checklist for each string:
1. It names no mission, character, location, vehicle, item or reward the player hasn't already been shown.
2. It gives no reason grounded in future events: no "because", "before X happens", "you'll lose", "won't be able to return".
3. It implies no future structure: no "next chapter", "final", "later in the story", and no counts of remaining missions.
4. Money advice is about now. "Not worth grinding now" is fine. Hinting at future windfalls or losses is not.
5. Urgency comes from the priority label (LAST CHANCE, DO NOW), not from narrative hints.
6. Write it in our own words. Never paste walkthrough text.
7. If a fact is `partial`, `conflicted` or `unverified`, the copy hedges: "Not fully verified yet — …".

Spoiler-leak tests scan every gateway response for names and strings from ineligible records. Copy that slips through review should still fail CI.
