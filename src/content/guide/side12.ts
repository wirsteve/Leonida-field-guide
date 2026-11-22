import "server-only";
import type { Confidence, GuideRecord, PublicContent, Requirement, SourceEvidence } from "@/contracts";
import { REVIEWED, cite } from "./sources";
import { CH1_LAST } from "./story";

/**
 * Chapter 1–2 side content found in the 2026-11-22 research pass
 * (docs/research/restricted/SIDE_CONTENT_CH1_CH2.md). Everything is gated to
 * Chapter 2 or later, the earliest point the owner's sources agree on. Copy names
 * no place or person beyond what's reachable at that gate; anything set in the
 * next city is gated to the Chapter 2 finale.
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const PPX = (slug: string) => src(`https://www.powerpyx.com/gta-6-${slug}/`, "PowerPyx", `GTA 6 ${slug}`);
const GB = (path: string) => src(`https://www.gtabase.com/gta-6/${path}`, "GTABase", `GTA 6 ${path}`);
const PPX_SF = PPX("all-strangers-freaks-side-missions");
const GB_RE = GB("map/?feature=random-event");
const PS_WYMAN = src("https://www.pushsquare.com/guides/gta-6-wymans-classic-car-locations", "Push Square", "GTA 6: Wyman's Classic Car Locations");
const PS_KIRK2 = src("https://www.pushsquare.com/guides/gta-6-search-for-tree-effigies-kirk-walkthrough", "Push Square", "GTA 6: Search for Tree Effigies (Kirk)");
const PCG_UE = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-ultimate-edition-bonuses/", "PC Gamer", "How to collect your GTA 6 Ultimate Edition bonuses");
const PCG_TRANS = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-transgressor-locations/", "PC Gamer", "GTA 6 Transgressor locations");
const G8_OPT = src("https://game8.co/games/GTA-6/archives/638130", "Game8", "List of All Optional Missions");

const done = (...ids: string[]): Requirement => (ids.length === 1 ? { completed: ids[0] } : { all: ids.map((completed) => ({ completed })) });

interface Spec {
  id: string;
  kind?: GuideRecord["kind"];
  seq: number;
  visibleWhen: Requirement;
  confidence?: Confidence;
  verification?: GuideRecord["verification"];
  evidence: SourceEvidence[];
  notes?: string;
  pub: Partial<PublicContent> & Pick<PublicContent, "name" | "summary" | "guidance">;
}

function rec(s: Spec): GuideRecord {
  return {
    id: s.id,
    kind: s.kind ?? "side-mission",
    sequence: s.seq,
    visibleWhen: s.visibleWhen,
    missable: "no",
    public: { aliases: [], tags: [], uniqueExperience: true, officialCompletion: "no", timing: "anytime", ...s.pub },
    restricted: s.notes ? { notes: s.notes } : {},
    evidence: s.evidence,
    confidence: s.confidence ?? "medium",
    verification: s.verification ?? "verified",
    lastReviewed: REVIEWED,
  };
}

export const side12: GuideRecord[] = [
  // ── Sal (the owner has done this one) ──────────────────────────────────────
  rec({
    id: "enc-sal",
    kind: "encounter",
    seq: 213.61,
    visibleWhen: done(CH1_LAST),
    confidence: "low",
    verification: "partial",
    evidence: [
      cite(GB_RE, "User-submitted random events #118 'Sal, Shooting Victim' and #129 'Revenge on Kolt Associates' in Port Gellhorn."),
      cite(GB("vehicles/sals-chino"), "Vehicle DB entry: Dundreary Sal's Chino, given for helping Sal against the Kolts."),
    ],
    notes: "Random-event chain; unlock condition, character, cash and S&F credit unknown. Owner completed it.",
    pub: {
      name: "Help Sal",
      aliases: ["sal", "sals chino", "sal's car"],
      summary: "An old man in Port Gellhorn has been robbed and shot. Give him a ride, then help him get even.",
      guidance: "It's a random encounter, so it isn't on the map. If you've already done it, mark it done.",
      tips: [
        "The reward is his custom Chino. Register it at a Pay 'n' Spray or park it in a garage so you keep it.",
        "Do that before you move on: one guide warns your personal cars can end up impounded at the end of this chapter.",
      ],
      area: "port-gellhorn",
      tags: ["vehicle"],
      estimatedMinutes: { min: 10, max: 25 },
    },
  }),

  // ── Kirk's swamp strand (Strangers & Freaks) ───────────────────────────────
  rec({
    id: "side-kirk-1",
    seq: 213.62,
    visibleWhen: done(CH1_LAST),
    confidence: "high",
    evidence: [
      cite(PPX("search-for-the-skunk-ape-walkthrough"), "Read a Skunk Ape flyer (e.g. Skeeter's bar), call Kirk; night only; $1,000."),
      cite(GB("strangers/search-for-the-skunk-ape"), "Kirk's first stranger mission; night only; pays $1,000."),
      cite(G8_OPT, "Listed as an optional Kirk mission in the swamps."),
    ],
    pub: {
      name: "Search for the Skunk Ape",
      aliases: ["kirk", "skunk ape"],
      summary: "A cryptid hunter named Kirk wants help finding a swamp monster. Read one of his Skunk Ape flyers, then call him.",
      guidance: "A quick, goofy job that pays $1,000 and starts a three-part strand.",
      tips: ["Night only. Sleep to skip ahead if it's daytime.", "One of the flyers is in a bar in Hamlet.", "Bring a flashlight."],
      tags: ["strangers"],
      estimatedMinutes: { min: 10, max: 20 },
      money: { payout: { min: 1000, max: 1000 }, repeatability: "one-time", risk: "low", efficiency: 2 },
    },
  }),
  rec({
    id: "side-kirk-2",
    seq: 213.63,
    visibleWhen: done(CH1_LAST, "side-kirk-1"),
    confidence: "high",
    evidence: [
      cite(PPX("search-for-tree-effigies-locations-walkthrough"), "Kirk texts after part 1; find 3 tree effigies; no cash."),
      cite(PS_KIRK2, "Three effigies in a large swamp search area, any order."),
      cite(GB("strangers/search-for-tree-effigies"), "Second Kirk mission."),
    ],
    pub: {
      name: "Search for Tree Effigies",
      aliases: ["kirk 2"],
      summary: "Kirk texts a while after the first hunt. Find three strange effigies out in the swamp.",
      guidance: "No cash for this one, but it keeps Kirk's strand going.",
      tips: ["Any order. Search the whole marked area: one guide found an extra effigy outside the usual spots."],
      tags: ["strangers"],
      estimatedMinutes: { min: 10, max: 20 },
    },
  }),
  rec({
    id: "side-kirk-3",
    seq: 213.64,
    visibleWhen: done(CH1_LAST, "side-kirk-2"),
    confidence: "high",
    evidence: [
      cite(PPX("help-kirk-find-mr-mangrove-walkthrough"), "Lucia only, night only; unique tranquilizer rifle; $10,000 only in one ending."),
      cite(GB("strangers/help-kirk-find-mr-mangrove"), "Can't trigger before Chapter 2; Lucia only; same rewards."),
    ],
    pub: {
      name: "Help Kirk Find Mr. Mangrove",
      aliases: ["kirk 3", "mr mangrove"],
      summary: "Kirk's last hunt. It comes as a text a few days after the effigies. Lucia only, at night.",
      guidance: "You get a unique tranquilizer rifle either way. Save before the end: one choice pays $10,000 and the others pay nothing.",
      tips: ["For the cash, use the tranquilizer and hand over what you find."],
      saveBeforeStarting: true,
      tags: ["strangers"],
      estimatedMinutes: { min: 10, max: 20 },
      money: { payout: { min: 0, max: 10000, note: "Only in one ending" }, repeatability: "one-time", risk: "low", efficiency: 3 },
    },
  }),

  // ── Freddie ────────────────────────────────────────────────────────────────
  rec({
    id: "side-freddie",
    seq: 213.65,
    visibleWhen: done(CH1_LAST),
    confidence: "medium",
    evidence: [cite(PPX("retest-freddies-defenses-walkthrough"), "Break into the prepper compound north of Lake Leonida once; he texts days later; $10,000; unlocks hurricane weather.")],
    notes: "Payout conflict: PowerPyx $10,000; snippet sites say $5,000 plus his 'Dubster' vehicle. Shown as a range.",
    pub: {
      name: "Retest Freddie's Defenses",
      aliases: ["freddie", "prepper", "bunker"],
      summary: "A doomsday prepper has a fortified compound on the north side of Lake Leonida. Break in once on your own, and a few days later he asks you to test it properly.",
      guidance: "Worth it for the cash, and finishing it unlocks hurricane weather.",
      tips: [
        "To get in the first time, use the loader on the east side to shift the lone container. There's a staircase under it.",
        "Watch for proximity mines and explosive drones. Bring an automatic weapon.",
        "The second time, the tunnel is sealed. Climb the water tower and drop onto the roof.",
      ],
      tags: ["strangers"],
      estimatedMinutes: { min: 15, max: 30 },
      money: { payout: { min: 5000, max: 10000, note: "Sources disagree on the amount" }, repeatability: "one-time", risk: "medium", efficiency: 3 },
    },
  }),

  // ── Dr. Merle (any chapter, but the job itself is in the next city) ────────
  rec({
    id: "side-final-flush",
    seq: 215.5,
    visibleWhen: done("story-215"),
    confidence: "medium",
    evidence: [
      cite(PPX("the-final-flush-meet-at-franks-waffles-walkthrough"), "Scan a No Flusher QR poster, reply TRUTH; reward is a permanent stamina increase."),
      cite(PPX_SF, "Listed as an Any Chapter Strangers & Freaks strand."),
    ],
    pub: {
      name: "The Final Flush",
      aliases: ["no flushers", "dr merle", "qr poster"],
      summary: "Scan one of the odd 'No Flusher' QR posters with WAiNK. They're usually near bathrooms. Reply \"TRUTH\" to the text that follows.",
      guidance: "Do it for the reward: a permanent stamina boost.",
      tips: [
        "If you don't answer the text, the mission never shows up.",
        "Inside, use the console on the upper walkway: turn every light green, then pull the lever.",
      ],
      tags: ["strangers"],
      estimatedMinutes: { min: 15, max: 25 },
    },
  }),

  // ── Port Gellhorn investigation ────────────────────────────────────────────
  rec({
    id: "side-missing-tourists",
    seq: 213.66,
    visibleWhen: done(CH1_LAST),
    confidence: "low",
    verification: "partial",
    evidence: [
      cite(GB("missions/overnight-charges"), "Tip: the missing posters in the motel reception add 'Gellhorn's Missing Tourists' to the map."),
      cite(GB_RE, "User-submitted clue entries around Port Gellhorn."),
    ],
    notes: "Ending details, victims' locations and the killer's name conflict across snippet sites. No cash reward reported.",
    pub: {
      name: "Gellhorn's Missing Tourists",
      aliases: ["missing posters", "missing persons"],
      summary: "Missing-person posters in the motel reception start a quiet investigation around Port Gellhorn.",
      guidance: "There's no marker. Follow the clues around town. Look at the posters before you move out of the motel, in case they're gone later.",
      tips: ["It pays no cash. It's for the story it tells."],
      area: "port-gellhorn",
      estimatedMinutes: { min: 30, max: 60 },
    },
  }),

  // ── Wyman (Ultimate Edition) ───────────────────────────────────────────────
  rec({
    id: "act-wyman-cars",
    kind: "activity",
    seq: 213.67,
    visibleWhen: done(CH1_LAST, "side-thrillbillies"),
    confidence: "high",
    evidence: [
      cite(PS_WYMAN, "Ultimate Edition: collect the Dominator buggy after Thrillbillies; Wyman texts; scan scrap cars; $1,500 labor each."),
      cite(PCG_UE, "Ultimate Edition bonuses: the Dominator buggy and its garage open the Wyman questline."),
      cite(PCG_TRANS, "First car: three Transgressor scrap spots in Port Gellhorn."),
      cite(PPX("wyman-character"), "Wyman restores classic cars; five in total."),
    ],
    pub: {
      name: "Find Cars for Wyman",
      aliases: ["wyman", "classic cars", "ultimate edition"],
      summary: "Ultimate Edition only. Scan scrapped classic cars with WAiNK and Wyman rebuilds them for $1,500 each.",
      guidance: "If you have the Ultimate Edition, collect the purple-marked buggy after Thrillbillies, then wait for Wyman's text.",
      tips: [
        "The first car's three scrap spots are all in Port Gellhorn: a trailer park north of Sarena's Bargain Store, the garage of a blue house with sunflowers, and behind Dirt Merchants at the south tip of town.",
        "The second car's scrap spots are in the Keys. One is in a 4-star area, so be quick.",
        "Register each finished car at a Pay 'n' Spray ($100) or garage it, or it goes back to Wyman.",
      ],
      area: "port-gellhorn",
      tags: ["vehicle"],
      estimatedMinutes: { min: 20, max: 40 },
    },
  }),

  // ── Random events worth stopping for ───────────────────────────────────────
  rec({
    id: "enc-random-gellhorn",
    kind: "encounter",
    seq: 213.68,
    visibleWhen: done(CH1_LAST),
    confidence: "low",
    verification: "partial",
    evidence: [cite(GB_RE, "User-submitted random-event map: rewards for Port Gellhorn and Keys events.")],
    notes: "All from user-submitted map entries; amounts approximate.",
    pub: {
      name: "Random events worth stopping for",
      aliases: ["random events", "encounters"],
      summary: "Street encounters aren't on the map and don't come back once you finish them. These are the ones players say pay off.",
      guidance: "Stop when you see one. They're quick cash on the way somewhere else.",
      tips: [
        "Iguana target practice in Port Gellhorn: a shooting contest worth about $250.",
        "An ATV rally in Port Gellhorn: jump the concession stand for about $500.",
        "A burning pickup after a crash in Port Gellhorn: check the chest in the bed for cash, drugs and a pistol.",
        "Cops sitting on a seized stash in Port Gellhorn: about $1,200 of product to fence, but it brings heat.",
        "Night in Key Lento: a drug deal, a gang trade and a liquor-store robbery you can hijack, each worth about $1,500.",
        "Exploding boats in the Keys drop packages worth about $400 each.",
        "A van stuck in the mud in Key Lento: push it out for $200.",
      ],
      tags: ["money"],
      estimatedMinutes: { min: 2, max: 10 },
    },
  }),
];
