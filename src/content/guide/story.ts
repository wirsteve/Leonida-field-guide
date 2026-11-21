import "server-only";
import type { GuideRecord, Requirement, StageRecord } from "@/contracts";
import { REVIEWED, cite, gb, ppx } from "./sources";

/**
 * Story missions for Chapters 1–2 (verified 2026-11-21).
 * Order: four sites agree on Chapter 1's 22 titles; Chapter 2 gating is taken
 * from what PowerPyx/GTABase pages actually state (see restricted research).
 */

const after = (...ids: string[]): Requirement => (ids.length === 1 ? { completed: ids[0] } : { all: ids.map((completed) => ({ completed })) });

function story(
  id: string,
  sequence: number,
  chapter: number,
  name: string,
  visibleWhen: Requirement,
  extra: Partial<GuideRecord> & { summary?: string; guidance?: string; aliases?: string[]; nameSafeBeforeStart?: boolean; saveBeforeStarting?: boolean; tips?: string[] } = {},
): GuideRecord {
  const { summary, guidance, aliases, nameSafeBeforeStart, saveBeforeStarting, tips, ...rest } = extra;
  return {
    id,
    kind: "story-mission",
    sequence,
    chapter,
    visibleWhen,
    missable: "no",
    public: {
      name,
      aliases: aliases ?? [],
      summary: summary ?? "A main story mission.",
      area: chapter === 2 ? "port-gellhorn" : undefined,
      tags: ["story"],
      uniqueExperience: true,
      officialCompletion: "unknown",
      timing: "now",
      guidance: guidance ?? "Continue the story when you're ready.",
      nameSafeBeforeStart: nameSafeBeforeStart ?? false,
      neutralLabel: "Continue the story",
      saveBeforeStarting,
      tips,
    },
    restricted: {},
    evidence: [],
    confidence: "high",
    verification: "verified",
    lastReviewed: REVIEWED,
    ...rest,
  };
}

// ── Chapter 1 ────────────────────────────────────────────────────────────────
const CH1_TITLES = [
  ["story-101", "Prologue"],
  ["story-102", "Gone Fishing"],
  ["story-103", "Gear Up"],
  ["story-104", "Just a Scratch"],
  ["story-105", "Lab Fees"],
  ["story-106", "Unwanted Attention"],
  ["story-107", "Pipework"],
  ["story-108", "Hey Arnold!"],
  ["story-109", "Island Dreams"],
  ["story-110", "Feng Shui"],
  ["story-111", "Coming Home"],
  ["story-112", "Buck Me"],
  ["story-113", "Clean Up After Donnie"],
  ["story-114", "Down to Earth"],
  ["story-115", "Clear Skies"],
  ["story-116", "Day Release"],
  ["story-117", "Swamped"],
  ["story-118", "Don Gone"],
  ["story-119", "Recalibration"],
  ["story-120", "Tourist Trap"],
  ["story-121", "Home Sweet Home"],
  ["story-122", "Discharge Time"],
] as const;

const ch1Evidence = () => [
  cite("ps-chapters", "Lists the 22 Chapter 1 main missions in this order."),
  cite("g8-ch1", "Lists the 22 Chapter 1 main missions in this order."),
  cite("gr-missions", "Lists the 22 Chapter 1 main missions in this order."),
  cite("pcg-missions", "Lists Chapter 1 main missions in this order (redacts #18)."),
];

export const CH1_LAST = "story-122";

const chapter1: GuideRecord[] = CH1_TITLES.map(([id, name], i) =>
  story(id, 101 + i, 1, name, i === 0 ? { always: true } : { completed: CH1_TITLES[i - 1][0] }, {
    evidence: ch1Evidence(),
    restricted: {
      notes:
        "GTABase counts 24 (adds BuckMe/savings steps) and PowerPyx orders some early missions differently; display order follows the 22-title consensus.",
    },
  }),
);

// ── Chapter 2 ────────────────────────────────────────────────────────────────
const BAG = "story-201";

const chapter2: GuideRecord[] = [
  story(BAG, 201, 2, "What's in the Bag?", { completed: CH1_LAST }, {
    evidence: [cite(ppx("whats-in-the-bag"), "First Chapter 2 mission, at the Starlet Motel."), cite("g8-ch2", "Chapter 2 opens with What's in the Bag?."), cite(gb("whats-in-the-bag"), "First Chapter 2 mission.")],
  }),
  story("story-202", 202, 2, "Ambulance Chaser", after(BAG), {
    evidence: [cite(ppx("ambulance-chaser-move-the-ambulance"), "Unlocks after What's in the Bag?."), cite("g8-ch2", "Chapter 2 main mission.")],
  }),
  story("story-203", 203, 2, "Overnight Charges", after(BAG), {
    nameSafeBeforeStart: true,
    summary: "Sort out the motel bill with the manager at the front desk.",
    evidence: [cite(ppx("overnight-charges-see-linda-the-manager"), "Short main step after What's in the Bag?."), cite(gb("overnight-charges"), "Main step; motel bill with Linda.")],
  }),
  story("story-204", 204, 2, "Just Moved In", after(BAG), {
    evidence: [cite(ppx("just-moved-in"), "Unlocks after What's in the Bag?."), cite("g8-ch2", "Chapter 2 main mission.")],
  }),
  story("story-205", 205, 2, "Behind on Payments", after("story-203"), {
    nameSafeBeforeStart: true,
    summary: "Pay off what you owe at the motel front desk.",
    guidance: "Pay the motel bill once you have the cash.",
    evidence: [cite(ppx("behind-on-payments"), "Unlocks after Overnight Charges; pay the motel manager."), cite("gb-missions", "Listed as a main step after Overnight Charges.")],
  }),
  story("story-206", 206, 2, "Girls' Trip", after("story-203", "story-204"), {
    aliases: ["Girl's Trip"],
    evidence: [cite(ppx("girls-trip-find-painkillers"), "Requires Overnight Charges and Just Moved In."), cite(gb("girls-trip"), "Requires Overnight Charges and Just Moved In.")],
    restricted: { notes: "Apostrophe conflicts between sites (Girls' vs Girl's); 'Trap' spellings are typos." },
  }),
  story("story-207", 207, 2, "Moses", after("story-206"), {
    evidence: [cite(ppx("moses-take-a-vehicle-to-moses"), "Unlocks after Girls' Trip."), cite("g8-moses", "Unlocks after Girls' Trip; meet Moses at his Port Gellhorn garage."), cite(gb("moses"), "Unlocks after Girls' Trip.")],
  }),
  story("story-208", 208, 2, "New Look", after("story-206"), {
    nameSafeBeforeStart: true,
    summary: "Get a haircut at a salon in Port Gellhorn.",
    evidence: [cite(ppx("new-look"), "Unlocks after Girls' Trip; buy a haircut."), cite("gb-missions", "Listed as a main step after Girls' Trip.")],
  }),
  story("story-209", 209, 2, "How Do I Look?", after("story-206"), {
    nameSafeBeforeStart: true,
    summary: "Buy a new top and pants at a clothing store.",
    evidence: [cite(ppx("how-do-i-look"), "Unlocks after Girls' Trip; buy clothes."), cite("gb-missions", "Listed as a main step after Girls' Trip.")],
  }),
  story("story-210", 210, 2, "Daily Driver", after("story-207"), {
    nameSafeBeforeStart: true,
    summary: "Moses's first job: bring him the car from the photo he texts you.",
    guidance: "Deliver the car in good condition. The payout drops with damage.",
    evidence: [
      cite(ppx("daily-driver-steal-the-crawler-for-moses"), "Unlocks shortly after the Moses mission via a photo text; pays $1,250 plus $500 for good condition."),
      cite(gb("daily-driver"), "Unlocks after Moses; summary box says up to $1,375, less if damaged."),
    ],
    restricted: { notes: "Payout conflict (not shown to player): $1,250 + $500 (PPX, GB text) vs up to $1,375 (GB summary box)." },
  }),
  story("story-211", 211, 2, "Slam Dunk", after("story-202", "story-207", "story-208", "story-209"), {
    evidence: [cite(ppx("slam-dunk"), "Requires earlier Chapter 2 main missions, then two calls from Dunk."), cite(gb("slam-dunk"), "Unlocks after Dunk calls.")],
    restricted: { notes: "Exact prerequisite set is 'all earlier Chapter 2 main missions'; Daily Driver is not a stated prerequisite." },
  }),
  story("story-212", 212, 2, "Breakfast Run", after("story-211"), {
    aliases: ["breakfast stickup", "breakfast stick-up", "Check on Jason"],
    evidence: [
      cite(ppx("breakfast-run-check-on-jason"), "Starts after Slam Dunk once Jason calls; diner and store robberies."),
      cite("g8-breakfast", "Breakfast Run follows Slam Dunk; awards the Trust trophy."),
      cite(gb("breakfast-run"), "Follows Slam Dunk."),
    ],
    restricted: {
      notes:
        "'breakfast stickup' is the player's own description; it matches this mission's content (diner robbery then store stick-ups) and no other candidate exists.",
    },
  }),
  story("story-213", 213, 2, "Coffee Break", after("story-212"), {
    evidence: [cite(ppx("coffee-break"), "Starts straight after Breakfast Run."), cite("g8-coffee", "Starts after Breakfast Run; opens four jobs in any order."), cite(gb("coffee-break"), "Follows Breakfast Run.")],
  }),
  story("story-214", 214, 2, "Afternoon Delight", after("story-213"), {
    evidence: [cite(ppx("afternoon-delight-rob-vickis-boss"), "Main mission after Coffee Break; Vicki calls."), cite(gb("afternoon-delight"), "Mandatory main mission.")],
    restricted: { notes: "PowerPyx: clear other pending main quests first. Pays $10,000 next day — never surface." },
  }),
  story("story-215", 215, 2, "Checking Out", after("story-214"), {
    saveBeforeStarting: true,
    evidence: [
      cite(ppx("checking-out-move-to-vice-city"), "Requires $15,000 and all available Chapter 2 main missions; ends the chapter."),
      cite(gb("checking-out"), "Ends Chapter 2; the motel stops being home."),
      cite("g8-checkout", "Requires $15,000; starts at the motel bathroom door."),
      cite("ppx-full", "Recommends a manual save at chapter boundaries; no mission replay."),
    ],
    restricted: {
      internalExplanation:
        "Point of no return: ends Chapter 2 and permanently removes the Starlet Motel as home. Game8 (WIP page only) says personal cars are impounded after it.",
    },
  }),
];

// ── Stages (chapter-strategy editorial) ─────────────────────────────────────
function stage(id: string, sequence: number, chapter: number, visibleWhen: Requirement, editorial: StageRecord["editorial"]): StageRecord {
  return {
    id,
    kind: "stage",
    sequence,
    chapter,
    visibleWhen,
    missable: "no",
    public: {
      name: editorial.title,
      aliases: [],
      summary: editorial.intro,
      tags: [],
      uniqueExperience: false,
      officialCompletion: "no",
      timing: "anytime",
      guidance: editorial.intro,
    },
    restricted: {},
    evidence: [cite("ppx-full", "Mission structure and order for this stage.")],
    confidence: "medium",
    verification: editorial.verification,
    lastReviewed: REVIEWED,
    editorial,
  };
}

export const stages: StageRecord[] = [
  stage("stage-ch1", 100, 1, { always: true }, {
    chapterLabel: "Chapter 01",
    title: "Just Like Paradise",
    intro: "Coverage here is limited to the mission list. Mark missions as you finish them.",
    verification: "unverified",
  }),
  stage("stage-ch2-early", 200, 2, { completed: CH1_LAST }, {
    chapterLabel: "Chapter 02",
    title: "Paradise Lost: settling in",
    intro:
      "Money is tight and the motel is home. Knock out the errands as they appear, pick up the cheap jobs around Port Gellhorn, and keep any cash you can't afford to lose in the bank.",
    saveAdvice: "There's no mission replay. Keep a separate manual save at the start of each chapter.",
    verification: "partial",
  }),
  stage("stage-ch2-back-in-action", 212, 2, { completed: "story-212" }, {
    chapterLabel: "Chapter 02",
    title: "Paradise Lost: back in action",
    intro:
      "You're both on your feet again. This is the moment to slow the story down: clear the jobs available around Port Gellhorn, grab your impounded car, and build a cash cushion before pushing on.",
    saveAdvice: "Make a separate manual save now and keep it. Overwrite a different slot as you play.",
    verification: "partial",
  }),
];

export const storyRecords: GuideRecord[] = [...chapter1, ...chapter2];
