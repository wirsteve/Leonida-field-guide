import "server-only";
import type { SourceEvidence, SourceKind } from "@/contracts";

/**
 * Source catalog — every page here was opened and read directly on 2026-11-21
 * (see docs/research/restricted/CHAPTER2_VERIFICATION.md). SERVER-ONLY: URLs can
 * point at full walkthroughs and must never reach the player.
 */
interface Source {
  url: string;
  publisher: string;
  title: string;
  kind: SourceKind;
}

const S = {
  "rs-out": { url: "https://www.rockstargames.com/VI/out-now", publisher: "Rockstar Games", title: "Grand Theft Auto VI: Out Now", kind: "official" },
  "ps-chapters": { url: "https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions", publisher: "Push Square", title: "GTA 6: Chapters & Story Missions", kind: "guide-site" },
  "ps-moses": { url: "https://www.pushsquare.com/guides/gta-6-moses-vehicle-drop-off-locations", publisher: "Push Square", title: "GTA 6: Moses Vehicle Drop-Off Locations", kind: "guide-site" },
  "ps-trophies": { url: "https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap", publisher: "Push Square", title: "GTA 6: Trophy Guide & Roadmap", kind: "guide-site" },
  "ppx-full": { url: "https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/", publisher: "PowerPyx", title: "GTA 6 Full Walkthrough – All Missions", kind: "guide-site" },
  "ppx-money": { url: "https://www.powerpyx.com/gta-6-money-guide-how-to-get-money-fast/", publisher: "PowerPyx", title: "GTA 6 Money Guide", kind: "guide-site" },
  "ppx-fence": { url: "https://www.powerpyx.com/gta-6-all-fence-locations-how-to-fence-stolen-goods/", publisher: "PowerPyx", title: "GTA 6 All Fence Locations", kind: "guide-site" },
  "ppx-races": { url: "https://www.powerpyx.com/gta-6-all-unique-race-locations-racing-activities/", publisher: "PowerPyx", title: "GTA 6 All Unique Race Locations", kind: "guide-site" },
  "ppx-trophies": { url: "https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/", publisher: "PowerPyx", title: "GTA 6 Trophy Guide & Roadmap", kind: "guide-site" },
  "ppx-sf": { url: "https://www.powerpyx.com/gta-6-all-strangers-freaks-side-missions/", publisher: "PowerPyx", title: "GTA 6 All Strangers & Freaks Side Missions", kind: "guide-site" },
  "ppx-garages": { url: "https://www.powerpyx.com/gta-6-all-garage-locations/", publisher: "PowerPyx", title: "GTA 6 All Garage Locations", kind: "guide-site" },
  "g8-ch1": { url: "https://game8.co/games/GTA-6/archives/638816", publisher: "Game8", title: "Chapter 1 Walkthrough and All Missions", kind: "guide-site" },
  "g8-ch2": { url: "https://game8.co/games/GTA-6/archives/638834", publisher: "Game8", title: "Chapter 2 Walkthrough and All Missions", kind: "guide-site" },
  "g8-moses": { url: "https://game8.co/games/GTA-6/archives/638877", publisher: "Game8", title: "Moses Walkthrough", kind: "guide-site" },
  "g8-breakfast": { url: "https://game8.co/games/GTA-6/archives/639067", publisher: "Game8", title: "Breakfast Run Walkthrough", kind: "guide-site" },
  "g8-coffee": { url: "https://game8.co/games/GTA-6/archives/638890", publisher: "Game8", title: "Coffee Break Walkthrough", kind: "guide-site" },
  "g8-checkout": { url: "https://game8.co/games/GTA-6/archives/639072", publisher: "Game8", title: "Checking Out Walkthrough (WIP)", kind: "guide-site" },
  "g8-missables": { url: "https://game8.co/games/GTA-6/archives/638531", publisher: "Game8", title: "Missables and Points of No Return", kind: "guide-site" },
  "g8-trophies": { url: "https://game8.co/games/GTA-6/archives/638536", publisher: "Game8", title: "List of All Trophies and Achievements", kind: "guide-site" },
  "gb-missions": { url: "https://www.gtabase.com/gta-6/missions/", publisher: "GTABase", title: "GTA 6 Missions List", kind: "guide-site" },
  "gb-money": { url: "https://www.gtabase.com/gta-6/articles/how-to-make-money-fast-in-gta-6", publisher: "GTABase", title: "How to Make Money Fast in GTA 6", kind: "guide-site" },
  "gb-safe": { url: "https://www.gtabase.com/gta-6/articles/how-to-keep-your-money-safe-in-gta-6", publisher: "GTABase", title: "How to Keep Your Money Safe in GTA 6", kind: "guide-site" },
  "gb-moses-char": { url: "https://www.gtabase.com/gta-6/characters/moses", publisher: "GTABase", title: "Moses | GTA 6 Characters Guide", kind: "guide-site" },
  "gr-missions": { url: "https://gamerant.com/gta-6-main-story-missions-chapters-list/", publisher: "Game Rant", title: "All Chapters & Main Story Missions in GTA 6", kind: "guide-site" },
  "gr-sell": { url: "https://gamerant.com/how-to-sell-vehicles-gta-6/", publisher: "Game Rant", title: "How to Sell Stolen Cars in GTA 6", kind: "guide-site" },
  "gr-fence": { url: "https://gamerant.com/gta-6-where-to-sell-stolen-goods-after-brian-retires/", publisher: "Game Rant", title: "Where to Sell Stolen Goods After Brian Retires", kind: "guide-site" },
  "pcg-missions": { url: "https://www.pcgamer.com/games/grand-theft-auto/gta-6-mission-list/", publisher: "PC Gamer", title: "GTA 6 mission list", kind: "guide-site" },
  "pcg-bank": { url: "https://www.pcgamer.com/games/grand-theft-auto/gta-6-bank-cash/", publisher: "PC Gamer", title: "Bank your cash in GTA 6", kind: "guide-site" },
  "gra-buckme": { url: "https://www.gamesradar.com/games/grand-theft-auto/gta-6-money-buckme-bank-account-manage/", publisher: "GamesRadar+", title: "GTA 6 money management and BuckMe Bank explained", kind: "guide-site" },
} satisfies Record<string, Source>;

export type SourceKey = keyof typeof S;

/** PowerPyx per-mission walkthrough page. */
export function ppx(slug: string): Source {
  return { url: `https://www.powerpyx.com/gta-6-${slug}-walkthrough/`, publisher: "PowerPyx", title: `GTA 6 ${slug} walkthrough`, kind: "guide-site" };
}
/** GTABase per-mission page. */
export function gb(slug: string, section = "missions"): Source {
  return { url: `https://www.gtabase.com/gta-6/${section}/${slug}`, publisher: "GTABase", title: `GTA 6 ${slug} guide`, kind: "guide-site" };
}

const CHECKED_ON = "2026-11-21";
let counter = 0;

/** Build one evidence entry. `supports` is our own paraphrase of what the page says. */
export function cite(source: SourceKey | Source, supports: string, notes?: string): SourceEvidence {
  const s: Source = typeof source === "string" ? S[source] : source;
  counter += 1;
  return {
    id: `src-${counter.toString().padStart(3, "0")}`,
    url: s.url,
    publisher: s.publisher,
    title: s.title,
    kind: s.kind,
    checkedOn: CHECKED_ON,
    supports,
    ...(notes ? { notes } : {}),
  };
}

export const REVIEWED = CHECKED_ON;
