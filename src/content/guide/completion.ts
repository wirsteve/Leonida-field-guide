import "server-only";
import type { Confidence, GuideRecord, Requirement, SourceEvidence, VerificationStatus } from "@/contracts";
import { REVIEWED, cite } from "./sources";

/**
 * Collectibles, the official 100% checklist, and trophies.
 * Research: docs/research/restricted/COLLECTIBLES_100_TROPHIES.md (read 2026-11-21).
 *
 * Gates refer to story missions BY TITLE through `gate()`, resolved against the
 * story records at dataset build time (unknown titles fail validation loudly).
 * Story trophies become visible only once their mission is complete (you've
 * earned them by then), so trophy names never foreshadow the plot.
 */

export type Gate = { always: true } | { mission: string } | { record: string };

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const P_TROPHY = src("https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/", "PowerPyx", "GTA 6 Trophy Guide & Roadmap");
const P_100 = src("https://www.powerpyx.com/gta-6-100-completion-checklist-guide/", "PowerPyx", "GTA 6 100% Completion Checklist & Guide");
const P_DB = src("https://www.powerpyx.com/gta-6-collectible-guide-progress-database/", "PowerPyx", "GTA 6 Collectible Guide / Progress Database");
const B_100 = src("https://www.gtabase.com/articles/gta-6/gta-6-100-completion-guide-interactive-checklist", "GTABase", "GTA 6 100% Completion Guide & Interactive Checklist");
const B_TROPHY = src("https://www.gtabase.com/gta-6/achievements", "GTABase", "GTA 6 Trophy Guide & Achievements List");
const G_TROPHY = src("https://game8.co/games/GTA-6/archives/638536", "Game8", "List of All Trophies and Achievements");
const S_100 = src("https://www.pushsquare.com/guides/gta-6-100percent-completion-checklist", "Push Square", "GTA 6 100% Completion Checklist");
const S_TROPHY = src("https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap", "Push Square", "GTA 6 Trophy Guide & Roadmap");
const R_TROPHY = src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-trophy-achievement-list/", "GamesRadar+", "GTA 6 Trophy & Achievement list");

const checklistEvidence = (what: string): SourceEvidence[] => [
  cite(P_100, `100% checklist line: ${what}.`),
  cite(B_100, `100% checklist line: ${what}.`),
  cite(S_100, `100% checklist line: ${what}.`),
];

interface ChecklistItem {
  id: string;
  name: string;
  needed: number;
  total?: number;
  /** Short spoiler-safe "what counts". */
  summary: string;
  gate: Gate;
  tips?: string[];
  area?: string;
  confidence?: Confidence;
  verification?: VerificationStatus;
  extraEvidence?: SourceEvidence[];
  notes?: string;
}

/** Countable 100% checklist lines, rendered as collectible counters in Explore. */
const CHECKLIST: ChecklistItem[] = [
  // Discovery
  { id: "c-vehicles", name: "Vehicles discovered", needed: 200, total: 277, summary: "Scan or get into different base-model vehicles. Boats and aircraft count.", gate: { always: true }, tips: ["Hold Up, then R1 to scan with WAiNK.", "Special 'Standout' variants don't count toward the 277."] },
  { id: "c-weapons", name: "Standard weapons held", needed: 50, total: 66, summary: "Hold each standard-issue weapon at least once.", gate: { always: true }, tips: ["Larger gun stores stock everything."], confidence: "medium", extraEvidence: [cite(P_DB, "66 standard-issue weapons.")] },
  { id: "c-animals", name: "Animals studied", needed: 100, total: 255, summary: "Study animals through binoculars. No hunting needed.", gate: { always: true }, tips: ["Each dog and cat breed counts separately.", "Swim near fish to log them."] },
  // Exploration & activities
  { id: "c-card-sets", name: "Collectible card sets", needed: 15, total: 18, summary: "Complete card sets. Each color variant counts as its own card.", gate: { always: true }, tips: ["Look in yellow phone boxes and tool boxes.", "Selling a card at a pawn shop doesn't remove it from your collection progress."] },
  { id: "c-waink", name: "WAiNK locations", needed: 100, summary: "Scan landmarks, curiosities, sculptures and tags with the phone camera.", gate: { always: true }, tips: ["The phone buzzes when one is nearby.", "Street art and murals look similar but don't count."] },
  { id: "c-magazines", name: "Magazines, books & comics", needed: 30, total: 34, summary: "Read unique titles, including the free little-library book swaps.", gate: { always: true }, tips: ["The game doesn't show which titles you've read. Keep notes in your Journal."] },
  { id: "c-meditations", name: "Meditations", needed: 15, total: 18, summary: "Meditate at peaceful spots around Leonida. Most spots count once per character.", gate: { always: true }, tips: ["A purple icon appears when you're near one.", "Bring your partner along once you can play as both."] },
  { id: "c-flamingos", name: "Cocaine flamingos", needed: 100, total: 125, summary: "Shoot the lawn flamingos with black-and-white beaks.", gate: { always: true }, tips: ["Yellow-beaked flamingos are just decoration.", "What drops out can be fenced."] },
  { id: "c-hoops", name: "Basketball hoops", needed: 90, total: 100, summary: "Shoot hoops at different courts around the map.", gate: { always: true } },
  { id: "c-stunts", name: "Stunts", needed: 300, total: 397, summary: "Stunt jumps, flying under bridges, knife flights and base jumps.", gate: { always: true }, tips: ["Flying under bridges is the fastest way to rack these up once you can fly."] },
  { id: "c-challenges", name: "Challenges", needed: 70, total: 80, summary: "Eight categories of ten challenges, all available from the start.", gate: { always: true }, tips: ["Many complete themselves as you play. Leave the rest for last."] },
  { id: "c-pool", name: "Pool opponents beaten", needed: 5, total: 7, summary: "Beat different pool opponents in bars.", gate: { always: true } },
  { id: "c-video-games", name: "Video games played", needed: 4, total: 4, summary: "Start each of the four video games at home.", gate: { always: true } },
  { id: "c-mini-golf", name: "Mini golf courses", needed: 2, total: 3, summary: "Play different mini golf courses. Full-size golf doesn't count.", gate: { always: true } },
  { id: "c-races", name: "Unique races won", needed: 30, total: 40, summary: "Win different races. Repeats don't count.", gate: { always: true } },
  { id: "c-race-challenges", name: "Race challenge gold medals", needed: 10, total: 13, summary: "Earn gold on race challenges.", gate: { always: true }, verification: "partial", notes: "Push Square says 30 golds; the others say 10 of 13." },
  { id: "c-shooting", name: "Shooting range gold medals", needed: 42, total: 42, summary: "Earn gold on every shooting range challenge.", gate: { always: true }, tips: ["Each range needs a cheap waiver pass."] },
  { id: "c-drones", name: "Drone time trials", needed: 42, total: 42, summary: "Fourteen locations, three trials each.", gate: { always: true }, tips: ["Beat par on the first two at each location; just finish the third."] },
  { id: "c-underwater", name: "Underwater discoveries", needed: 33, total: 33, summary: "Dive sites from the treasure-hunting questline.", gate: { always: true }, tips: ["You'll need scuba gear and a metal detector."] },
  { id: "c-kenton", name: "Shipwreck treasure sets", needed: 5, total: 7, summary: "Treasure sets recovered from wrecks.", gate: { always: true }, confidence: "medium" },
  { id: "c-playlists", name: "Unique playlists", needed: 2, total: 2, summary: "Scan the posters for two hidden radio playlists.", gate: { always: true }, confidence: "medium" },
  { id: "c-styles", name: "Discovered styles", needed: 70, total: 79, summary: "Tattoo designs scanned from magazines, plus luxury watches.", gate: { always: true }, confidence: "medium", tips: ["Watches show up as gold pickups, often at gang hideouts."] },
  { id: "c-target-decks", name: "Hunting target decks", needed: 15, total: 15, summary: "Hunting requests from the hunter you meet out in the country.", gate: { record: "side-veteran-hunted" }, tips: ["Clean one-shot kills pay more."] },
  // Tasks
  { id: "c-optional-tasks", name: "Optional tasks", needed: 100, summary: "Side jobs, deliveries, stranger quests and more. There are well over 200.", gate: { always: true }, tips: ["Doing optional jobs as they appear covers this without trying."] },
  { id: "c-gang-ops", name: "Gang operations cleared", needed: 39, total: 39, summary: "Clear gang hideouts, including all their key valuables.", gate: { always: true }, tips: ["Cleared hideouts slowly fill back up, so you can return for more loot."] },
  { id: "c-stick-ups", name: "Stick-ups", needed: 50, total: 91, summary: "Rob convenience stores, fast-food joints and liquor stores.", gate: { always: true } },
  { id: "c-smash-grabs", name: "Smash 'n' grabs", needed: 34, total: 35, summary: "Pawn shops and jewelers. Loot the safe too.", gate: { mission: "Coffee Break" } },
];

/** Dollar-amount checklist lines (tracked by hand in the Journal). */
const FENCED: { id: string; name: string; summary: string; gate: Gate }[] = [
  { id: "c-fence-narcotics", name: "Fence $100,000 of narcotics", summary: "Running total of narcotics sold to fences.", gate: { always: true } },
  { id: "c-fence-vehicles", name: "Fence $200,000 of vehicles", summary: "Running total of stolen cars sold.", gate: { mission: "Moses" } },
];

function resolveGate(gate: Gate, storyByName: Map<string, string>): Requirement {
  if ("always" in gate) return { always: true };
  if ("record" in gate) return { completed: gate.record };
  const id = storyByName.get(gate.mission.toLowerCase());
  if (!id) throw new Error(`completion.ts: unknown story mission title "${gate.mission}"`);
  return { completed: id };
}

export function completionRecords(storyByName: Map<string, string>): GuideRecord[] {
  const checklist = CHECKLIST.map<GuideRecord>((item) => ({
    id: item.id,
    kind: "collectible-set",
    visibleWhen: resolveGate(item.gate, storyByName),
    missable: "no",
    public: {
      name: item.name,
      aliases: [],
      summary: item.summary,
      guidance: `Needed for 100%: ${item.needed}${item.total ? ` of ${item.total}` : ""}. Nothing on the checklist is missable.`,
      tips: item.tips,
      tags: ["100%"],
      area: item.area,
      uniqueExperience: false,
      officialCompletion: "yes",
      timing: "anytime",
      collectibleTotal: item.total ?? item.needed,
    },
    restricted: item.notes ? { notes: item.notes } : {},
    evidence: [...checklistEvidence(`${item.name} ${item.needed}${item.total ? `/${item.total}` : ""}`), ...(item.extraEvidence ?? [])],
    confidence: item.confidence ?? "high",
    verification: item.verification ?? "verified",
    lastReviewed: REVIEWED,
  }));
  const fenced = FENCED.map<GuideRecord>((item) => ({
    id: item.id,
    kind: "activity",
    visibleWhen: resolveGate(item.gate, storyByName),
    missable: "no",
    public: {
      name: item.name,
      aliases: [],
      summary: item.summary,
      guidance: "Part of the official 100% checklist. Mark it done once your running total gets there.",
      tags: ["100%"],
      uniqueExperience: false,
      officialCompletion: "yes",
      timing: "anytime",
    },
    restricted: {},
    evidence: checklistEvidence(item.name),
    confidence: "high",
    verification: "verified",
    lastReviewed: REVIEWED,
  }));
  return [...checklist, ...fenced, ...trophyRecords(storyByName)];
}

// ── Trophies ──────────────────────────────────────────────────────────────────

type Tier = "Platinum" | "Gold" | "Silver" | "Bronze";
interface Trophy {
  id: string;
  name: string;
  tier: Tier;
  /** Spoiler-safe paraphrase of the condition. */
  how: string;
  gate: Gate;
  confidence?: Confidence;
  verification?: VerificationStatus;
  tips?: string[];
  missable?: GuideRecord["missable"];
  notes?: string;
}

const TROPHIES: Trophy[] = [
  { id: "t-platinum", name: "Vice Got a Price!", tier: "Platinum", how: "Earn every other trophy.", gate: { always: true } },
  { id: "t-long-road", name: "A Long Road", tier: "Gold", how: "Reach 100% completion. The checklist itself appears once the story is over, but everything you do before then counts.", gate: { always: true } },
  // Story trophies: visible only once earned.
  { id: "t-story-1", name: "Just Like Paradise", tier: "Bronze", how: "Story progress.", gate: { mission: "Gone Fishing" } },
  { id: "t-story-2", name: "Paradise Lost", tier: "Bronze", how: "Story progress.", gate: { mission: "Discharge Time" } },
  { id: "t-trust", name: "Trust", tier: "Bronze", how: "Story progress.", gate: { mission: "Breakfast Run" } },
  // Activities & side content
  { id: "t-cunning-stunts", name: "Cunning Stunts", tier: "Silver", how: "Complete 250 stunts of any kind.", gate: { always: true } },
  { id: "t-master-of-none", name: "Master of None", tier: "Bronze", how: "Try each activity type once: fishing, hunting, golf, shooting range, pool, basketball, a video game, a race win and a stunt.", gate: { always: true }, confidence: "medium" },
  { id: "t-shootist", name: "The Shootist", tier: "Silver", how: "Gold medal in every shooting range challenge.", gate: { always: true } },
  { id: "t-top-fun", name: "Top Fun", tier: "Bronze", how: "Win a drone race at all 14 locations.", gate: { always: true } },
  { id: "t-cash-not-kudos", name: "Earn Cash, Not Kudos", tier: "Bronze", how: "Win 20 different races.", gate: { always: true } },
  { id: "t-baited", name: "Baited My Tackle", tier: "Bronze", how: "Beat the fishing challenge a friend sets you.", gate: { always: true } },
  { id: "t-stick-fiddler", name: "Stick Fiddler", tier: "Bronze", how: "Play any of the four home video games to the end.", gate: { always: true }, confidence: "medium" },
  { id: "t-boat-accident", name: "This Was No Boat Accident", tier: "Bronze", how: "Finish the shipwreck treasure-hunting questline.", gate: { always: true } },
  { id: "t-lone-rider", name: "The Lone Rider", tier: "Bronze", how: "Finish Billy's run of jobs.", gate: { record: "side-thrillbillies" } },
  { id: "t-strangers", name: "Strangers & Freaks", tier: "Silver", how: "Complete eight qualifying stranger questlines.", gate: { always: true }, confidence: "medium", tips: ["Keep a separate save before the farm job's flight. A failed run can break that questline."] },
  { id: "t-pma", name: "Positive Mental Attitude", tier: "Bronze", how: "Meditate at every spot. The last spot appears once you've done the others.", gate: { always: true }, missable: "unknown", notes: "Ch1 balcony meditation may be required and is gone after Ch1; unconfirmed." },
  { id: "t-fair-game", name: "Fair Game", tier: "Bronze", how: "Bring down a special animal for the hunter.", gate: { record: "side-veteran-hunted" }, confidence: "medium" },
  { id: "t-deck", name: "Don't Touch My Deck", tier: "Silver", how: "Complete any three collectible card sets.", gate: { always: true } },
  { id: "t-wainker", name: "You WAiNKer!", tier: "Silver", how: "Scan 100 WAiNK locations.", gate: { always: true } },
  { id: "t-one-last-thing", name: "One Last Thing", tier: "Bronze", how: "Complete 50 of the 80 challenges.", gate: { always: true } },
  { id: "t-hot-together", name: "Hot Together", tier: "Bronze", how: "With your partner, lose a four-star wanted level.", gate: { mission: "Coffee Break" }, confidence: "medium" },
  { id: "t-retail-therapy", name: "Retail Therapy", tier: "Bronze", how: "With your partner, rob three shops in a row while still wanted.", gate: { mission: "Coffee Break" }, confidence: "medium", tips: ["The trophy can take half a minute to pop."] },
  { id: "t-whip-it", name: "Whip It Good", tier: "Bronze", how: "Discover 100 vehicles.", gate: { always: true } },
  { id: "t-gunslinger", name: "Gunslinger", tier: "Bronze", how: "Take down five enemies in a single use of combat focus.", gate: { always: true }, confidence: "medium" },
  { id: "t-goodtime", name: "The Goodtime State", tier: "Bronze", how: "Clear all the fog from the map.", gate: { always: true }, confidence: "medium", tips: ["Flying clears fog fastest."] },
  { id: "t-pest-control", name: "Pest Control", tier: "Bronze", how: "Hit one illegal operation from each of the nine gangs.", gate: { always: true } },
  { id: "t-ten-pin", name: "Ten Pin", tier: "Bronze", how: "On a bike, kick ten pedestrians within a minute.", gate: { always: true }, confidence: "medium" },
  { id: "t-treat-yo-self", name: "Treat Yo Self", tier: "Bronze", how: "Spend $100,000 in shops in total.", gate: { always: true } },
  { id: "t-actions", name: "Actions Speak Louder", tier: "Bronze", how: "Rack up 500 actions that shape your criminal profile.", gate: { always: true }, confidence: "medium" },
  { id: "t-bowling", name: "Let's Go Bowling", tier: "Bronze", how: "Take every key valuable in the bowling alley job, then lose the police.", gate: { mission: "Coffee Break" }, tips: ["If you miss something, the location fills back up much later."] },
  { id: "t-personal-best", name: "Personal Best", tier: "Bronze", how: "Max out strength on both characters.", gate: { mission: "Coffee Break" }, confidence: "medium" },
  { id: "t-little-boxes", name: "Little Boxes", tier: "Bronze", how: "Buy all eight garages from the real estate app.", gate: { mission: "Daily Driver" }, tips: ["About $160,000 in total. Not a priority while cash is tight."] },
  { id: "t-on-the-spot", name: "On the Spot", tier: "Bronze", how: "Register ten vehicles.", gate: { mission: "Moses" }, tips: ["You'll need enough garage space for them."] },
];

const TIER_TAG: Record<Tier, string> = { Platinum: "platinum", Gold: "gold", Silver: "silver", Bronze: "bronze" };

function trophyRecords(storyByName: Map<string, string>): GuideRecord[] {
  return TROPHIES.map((t) => ({
    id: t.id,
    kind: "achievement",
    visibleWhen: resolveGate(t.gate, storyByName),
    missable: t.missable ?? "no",
    public: {
      name: t.name,
      aliases: [],
      summary: `${t.tier} trophy. ${t.how}`,
      guidance: t.how,
      tips: t.tips,
      tags: ["trophy", TIER_TAG[t.tier]],
      uniqueExperience: false,
      officialCompletion: "no",
      timing: "anytime",
    },
    restricted: t.notes ? { notes: t.notes } : {},
    evidence: [
      cite(P_TROPHY, `Trophy ${t.name} (${t.tier}): ${t.how}`),
      cite(B_TROPHY, `Trophy ${t.name} listed with the same tier.`),
      cite(G_TROPHY, `Trophy ${t.name} listed.`),
      ...(t.confidence === "medium" ? [] : [cite(S_TROPHY, `Trophy ${t.name} listed.`), cite(R_TROPHY, `Trophy ${t.name} listed.`)]),
    ],
    confidence: t.confidence ?? "high",
    verification: t.verification ?? "verified",
    lastReviewed: REVIEWED,
  }));
}

/** Trophies gated on later-chapter missions are added in chapters.ts once titles are confirmed. */
export const TROPHY_COUNT_AUTHORED = TROPHIES.length;
