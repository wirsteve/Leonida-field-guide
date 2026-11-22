import "server-only";
import type { GuideRecord, Requirement, StageRecord } from "@/contracts";
import { REVIEWED, cite } from "./sources";
import { after, stage, story } from "./story";

/**
 * Chapters 3–5 (verified 2026-11-21; research: docs/research/restricted/STORY_CH3_END.md).
 * Gating follows what PowerPyx/GTABase pages state. Chapters 3–4 are open, so
 * withheld story missions carry a character-only neutral label to tell them apart.
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const PPX_FULL = src("https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/", "PowerPyx", "GTA 6 Full Walkthrough – All Missions");
const GB_LIST = src("https://www.gtabase.com/gta-6/missions/", "GTABase", "GTA 6 Story Missions Guide");
const PCG_LIST = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-mission-list/", "PC Gamer", "GTA 6 mission list");
const GRD_LIST = src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-mission-list/", "GamesRadar+", "GTA 6: Every mission and chapter");
const PS_CH = src("https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions", "Push Square", "GTA 6: Chapters & Story Missions");
const G8_CH3 = src("https://game8.co/games/GTA-6/archives/639173", "Game8", "Chapter 3 Walkthrough and All Missions");
const G8_MISS = src("https://game8.co/games/GTA-6/archives/638531", "Game8", "Missables and Points of No Return");
const GB_END = src("https://www.gtabase.com/gta-6/articles/gta-6-endings-explained", "GTABase", "All GTA 6 Endings Explained");
const PCG_PC = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-protective-custody-choice-proceed-or-postpone-meet-abe/", "PC Gamer", "Protective Custody: proceed or postpone");

type Who = "Jason" | "Lucia" | "both";
type Conf = "core" | "ppx-gb" | "ppx";

/** Evidence by how widely the title is listed. */
function evidence(title: string, gate: string, conf: Conf) {
  const base = [cite(PPX_FULL, `${title}: ${gate}.`), cite(GB_LIST, `${title} listed in order.`)];
  if (conf === "ppx") return [cite(PPX_FULL, `${title}: ${gate}.`)];
  if (conf === "ppx-gb") return base;
  return [...base, cite(PCG_LIST, `${title} in the chapter's main mission list.`), cite(GRD_LIST, `${title} in the chapter's main mission list.`), cite(PS_CH, `${title} listed.`)];
}

function mission(
  id: string,
  seq: number,
  chapter: number,
  name: string,
  visibleWhen: Requirement,
  who: Who,
  opts: { conf?: Conf; aliases?: string[]; save?: boolean; gateNote?: string; notes?: string; area?: string } = {},
): GuideRecord {
  const conf = opts.conf ?? "core";
  const record = story(id, seq, chapter, name, visibleWhen, {
    aliases: opts.aliases,
    saveBeforeStarting: opts.save,
    area: opts.area,
    evidence: evidence(name, opts.gateNote ?? "unlock as stated by the walkthrough", conf),
    confidence: conf === "ppx" ? "medium" : "high",
    restricted: opts.notes ? { notes: opts.notes } : {},
  });
  return withLabel(record, who);
}

function withLabel(record: GuideRecord, who: Who): GuideRecord {
  const label = who === "both" ? "Story mission (together)" : `Story mission (${who})`;
  return { ...record, public: { ...record.public, neutralLabel: label } };
}

const CH2_LAST = "story-215";
const all = (from: number, to: number, chapter: number, except: number[] = []) =>
  Array.from({ length: to - from + 1 }, (_, i) => from + i)
    .filter((n) => !except.includes(n))
    .map((n) => `story-${chapter}${String(n).padStart(2, "0")}`);

// ── Chapter 3 ────────────────────────────────────────────────────────────────
const c3 = (n: number) => `story-3${String(n).padStart(2, "0")}`;
const chapter3: GuideRecord[] = [
  mission(c3(1), 301, 3, "Welcome to Vice City", after(CH2_LAST), "both", { gateNote: "starts automatically after the Chapter 2 finale" }),
  mission(c3(2), 302, 3, "Dealer's Choice", after(c3(1)), "Jason"),
  mission(c3(3), 303, 3, "Meet the Heders", after(c3(2)), "both", { gateNote: "after Dealer's Choice and a call a day or two later" }),
  mission(c3(4), 304, 3, "Dubious Provenance", after(c3(2)), "both"),
  mission(c3(5), 305, 3, "Mami Knows Best", after(c3(2)), "Lucia"),
  mission(c3(6), 306, 3, "South Leonida Real Estate", after(c3(5)), "Lucia", { gateNote: "after Mami Knows Best once contact is made, which can take a few days" }),
  mission(c3(7), 307, 3, "Here, Kitty Kitty", after(c3(4)), "Jason", { conf: "ppx-gb", gateNote: "after the first part of Dubious Provenance" }),
  mission(c3(8), 308, 3, "Send Money to Lorena", after(c3(5)), "Lucia", { conf: "ppx-gb", notes: "BuckMe payment of $5,000 (PPX)." }),
  mission(c3(9), 309, 3, "Car Service", after(c3(3)), "Lucia", { aliases: ["Car Services"] }),
  mission(c3(10), 310, 3, "Send More Money to Lorena", after(c3(8)), "both", { conf: "ppx-gb", notes: "Second $5,000 payment (PPX)." }),
  mission(c3(11), 311, 3, "Top Billing", after(c3(9)), "both"),
  mission(c3(12), 312, 3, "Boobie Time", after(c3(4)), "Jason"),
  mission(c3(13), 313, 3, "First Impressions", after(c3(9)), "both"),
  mission(c3(14), 314, 3, "Caught Slipping", after(c3(12), c3(13)), "both", { conf: "ppx-gb" }),
  mission(c3(15), 315, 3, "Crosstown Traffic", after(c3(9)), "both"),
  mission(c3(16), 316, 3, "Credit Check", after(c3(15)), "both"),
  mission(c3(17), 317, 3, "Steal the Zorrusso for Randy", after(c3(15)), "both", { aliases: ["Clonin' Keys, Makin' Gs", "Clonin' Keys, Makin' G's", "Steal the Zorruso for Randy"] }),
  mission(c3(18), 318, 3, "Ride or Die", after(c3(16)), "Jason"),
  mission(c3(19), 319, 3, "Sinfrontera National Bank", after(c3(16)), "both"),
  mission(c3(20), 320, 3, "Security Expert", after(c3(19)), "both"),
  mission(c3(21), 321, 3, "Company Property", after(c3(20)), "both"),
  mission(c3(22), 322, 3, "The Missing Link", after(c3(21)), "Lucia"),
  mission(c3(23), 323, 3, "Safe Word", after(c3(21)), "both"),
  mission(c3(24), 324, 3, "Cooties", after(c3(18)), "Lucia"),
  mission(c3(25), 325, 3, "Hidden Charges", after(c3(21), c3(24)), "both"),
  mission(c3(26), 326, 3, "Bricked Up", after(...all(1, 25, 3)), "both", { gateNote: "after Hidden Charges and all other remaining Chapter 3 main missions" }),
  mission(c3(27), 327, 3, "The Cartel Heist", after(...all(1, 26, 3)), "both", { save: true, gateNote: "needs every other Chapter 3 main mission" }),
];

// ── Chapter 4 ────────────────────────────────────────────────────────────────
const c4 = (n: number) => `story-4${String(n).padStart(2, "0")}`;
const chapter4: GuideRecord[] = [
  mission(c4(1), 401, 4, "Ocean Beach", after(c3(27)), "both", { save: true }),
  mission(c4(2), 402, 4, "Another Life", after(c4(1)), "Lucia"),
  mission(c4(3), 403, 4, "Pool Day", after(c4(2)), "both", { conf: "ppx-gb" }),
  mission(c4(4), 404, 4, "Company Cars", after(c4(3)), "both"),
  mission(c4(5), 405, 4, "Lawyer Up", after(c4(3)), "both"),
  mission(c4(6), 406, 4, "Heavy Lifting", after(c4(5)), "both"),
  mission(c4(7), 407, 4, "Party Hard", after(c4(5)), "both"),
  mission(c4(8), 408, 4, "Pay Abe's Fee", after(c4(7)), "both", { conf: "ppx", notes: "Mandatory $75,000 BuckMe payment (PPX only)." }),
  mission(c4(9), 409, 4, "Photo/Shoot", after(c4(7)), "both", { aliases: ["Photo Shoot", "Photoshoot"] }),
  mission(c4(10), 410, 4, "Making Gainz", after(c4(6)), "Lucia"),
  mission(c4(11), 411, 4, "Blood Sweat and Gear", after(c4(10)), "Lucia", { conf: "ppx", aliases: ["Blood, Sweat and Gear"] }),
  mission(c4(12), 412, 4, "Too Much Baggage", after(c4(10)), "Jason"),
  mission(c4(13), 413, 4, "Watch It", after(c4(10)), "Jason"),
  mission(c4(14), 414, 4, "Amateur Hour", after(c4(11)), "Lucia"),
  mission(c4(15), 415, 4, "Cash Injections", after(c4(14)), "Lucia"),
  mission(c4(16), 416, 4, "Dirty Work", after(c4(12), c4(15)), "both"),
  mission(c4(17), 417, 4, "Adventures in Babysitting", after(c4(10)), "Jason"),
  mission(c4(18), 418, 4, "Fresh Evidence", after(c4(13), c4(17)), "Jason"),
  mission(c4(19), 419, 4, "Child's Play", after(c4(18)), "both"),
  mission(c4(20), 420, 4, "Power Play", after(c4(19)), "Lucia"),
  mission(c4(21), 421, 4, "Close Surveillance", after(c4(20)), "Jason"),
  mission(c4(22), 422, 4, "Delivery Method", after(c4(20)), "Jason"),
  mission(c4(23), 423, 4, "Team Building", after(c4(20)), "Lucia"),
  mission(c4(24), 424, 4, "Fully Catered", after(c4(20)), "both"),
  mission(c4(25), 425, 4, "Headliners", after(...all(1, 24, 4)), "both", { gateNote: "after all other Chapter 4 main missions before the airport job" }),
  mission(c4(26), 426, 4, "VCIA Takedown", after(c4(25)), "both", { save: true }),
  mission(c4(27), 427, 4, "Sunset", after(c4(26)), "both", { save: true, notes: "Chapter 4 point of no return." }),
  mission(c4(28), 428, 4, "Starting From Zero", after(c4(27)), "both", { aliases: ["Starting from Zero"] }),
];

// ── Chapter 5 ────────────────────────────────────────────────────────────────
const c5 = (n: number) => `story-5${String(n).padStart(2, "0")}`;
const chapter5: GuideRecord[] = [
  mission(c5(1), 501, 5, "Bird in the Hand", after(c4(28)), "both"),
  mission(c5(2), 502, 5, "Taking Liberties", after(c5(1)), "both"),
  mission(c5(3), 503, 5, "Doggie Bag", after(c5(2)), "Lucia"),
  mission(c5(4), 504, 5, "VC Baby", after(c5(2)), "both"),
  mission(c5(5), 505, 5, "Operation Savage Glory", after(c5(3), c5(4)), "both"),
  mission(c5(6), 506, 5, "Honest Abe", after(c5(5)), "both", { conf: "ppx-gb" }),
  mission(c5(7), 507, 5, "Protective Custody", after(c5(6)), "both", { save: true }),
  mission(c5(8), 508, 5, "The End of the Road", after(c5(7)), "both", { save: true }),
];

export const CH5_LAST = c5(8);

// ── Stages ───────────────────────────────────────────────────────────────────
export const laterStages: StageRecord[] = [
  stage("stage-ch3", 300, 3, after(CH2_LAST), {
    chapterLabel: "Chapter 03",
    title: "Tits, Ass, Drug Money",
    intro:
      "A bigger city and a far more open chapter. Several story threads run at once and can be played in any order, so mix them with the new side work as it opens up.",
    saveAdvice: "Keep a separate manual save from the start of this chapter. There's no mission replay.",
    verification: "partial",
  }),
  stage("stage-ch4", 400, 4, after(c3(27)), {
    chapterLabel: "Chapter 04",
    title: "Vice City, Baby",
    intro:
      "Several story threads run at once again. Keep money coming in: at one point this chapter asks for a large sum on hand.",
    saveAdvice: "Make a new chapter-start save and keep it.",
    verification: "partial",
  }),
  stage("stage-ch5", 500, 5, after(c4(28)), {
    chapterLabel: "Chapter 05",
    title: "Top of the World, Ma",
    intro: "A tighter, more linear stretch. Follow the story. The guide flags when it's worth stopping to prepare.",
    saveAdvice: "Keep a save from the start of this chapter, and another before you wrap up the story.",
    verification: "partial",
  }),
  stage("stage-post-game", 600, 5, after(CH5_LAST), {
    chapterLabel: "After the story",
    title: "Leonida is yours",
    intro:
      "The story's done, and the world stays open. Both characters are playable. The 100% checklist, cheats and every leftover side job are waiting. You can also go back and see how things play out differently.",
    verification: "partial",
  }),
];

// ── Preparation, last chances and advice ────────────────────────────────────
function prep(
  id: string,
  seq: number,
  name: string,
  visibleWhen: Requirement,
  copy: { summary: string; guidance: string; lastChanceCopy?: string; tips?: string[] },
  opts: { expiresWhen?: Requirement; confidence: "high" | "medium"; evidence: GuideRecord["evidence"]; notes: string; timing?: "before-advancing" | "now"; tags?: string[] },
): GuideRecord {
  return {
    id,
    kind: "activity",
    sequence: seq,
    visibleWhen,
    expiresWhen: opts.expiresWhen,
    missable: opts.expiresWhen ? "yes" : "no",
    public: {
      name,
      aliases: [],
      summary: copy.summary,
      guidance: copy.guidance,
      tips: copy.tips,
      lastChanceCopy: copy.lastChanceCopy,
      tags: ["prepare", ...(opts.tags ?? [])],
      uniqueExperience: false,
      officialCompletion: "no",
      timing: opts.timing ?? "before-advancing",
    },
    restricted: { internalExplanation: opts.notes },
    evidence: opts.evidence,
    confidence: opts.confidence,
    verification: "verified",
    lastReviewed: REVIEWED,
  };
}

/** Standing money advice lives in the Money tab, not the Home route. */
const asMoneyAdvice = (record: GuideRecord): GuideRecord => ({
  ...record,
  kind: "money-method",
  public: { ...record.public, timing: "anytime", money: { repeatability: "repeatable", risk: "low" } },
});

export const laterPrep: GuideRecord[] = [
  prep(
    "prep-heist-charges",
    324.5,
    "Heist prep: do every objective",
    after(c3(21), c3(24)),
    {
      summary: "The next heist-prep job has objectives you could skip.",
      guidance: "Don't skip any. Completing every objective in the next prep job pays off later.",
      lastChanceCopy: "Last chance: complete every objective in the next prep job.",
    },
    {
      expiresWhen: { completed: c3(25) },
      confidence: "medium",
      evidence: [cite(G8_CH3, "Plant all three charges in Hidden Charges for a longer vault timer."), cite(PPX_FULL, "All charges planted gives more time in the heist.")],
      notes: "Hidden Charges: planting all 3 charges extends the Cartel Heist vault timer (more money).",
      timing: "now",
    },
  ),
  prep(
    "prep-laptop-puzzle",
    326.5,
    "Solve the laptop puzzle at home",
    after(c3(1)),
    {
      summary: "There's a puzzle waiting on the laptop in your apartment.",
      guidance: "Solve it. The reward is worth the few minutes.",
      lastChanceCopy: "Last chance: solve the laptop puzzle before continuing.",
    },
    {
      expiresWhen: { completed: c4(1) },
      confidence: "medium",
      evidence: [cite(G8_MISS, "Solve Boobie's laptop puzzle before Ocean Beach for a free garage and a Standout car.")],
      notes: "Boobie's apartment is lost at Ocean Beach; puzzle gives Del Rio Boulevard Garage + Vanessa's Growler.",
      timing: "now",
    },
  ),
  prep(
    "prep-abe-fee",
    407.5,
    "Have $75,000 ready",
    after(c4(7)),
    {
      summary: "An upcoming story step needs $75,000 from your bank.",
      guidance: "Get $75,000 into BuckMe. The jobs and fences you have now are the way there.",
    },
    { confidence: "medium", evidence: [cite(PPX_FULL, "Pay Abe's Fee: mandatory $75,000 payment after Party Hard.")], notes: "Pay Abe's Fee ($75k) is mandatory to advance (PPX).", tags: ["cash-goal:75000"] },
  ),
  prep(
    "prep-wrap-up-ch4",
    426.5,
    "Wrap up loose ends",
    after(c4(26)),
    {
      summary: "A quiet stretch before the story picks up again.",
      guidance: "Finish the side jobs, races and errands you care about, then make a separate save before you continue the story.",
      lastChanceCopy: "Last chance: finish what you want to do at your own pace, and save, before continuing.",
    },
    {
      expiresWhen: { completed: c4(27) },
      confidence: "medium",
      evidence: [cite(PPX_FULL, "Sunset is the Chapter 4 point of no return; Tie Up Loose Ends is the window before it."), cite(GB_LIST, "Sunset listed as Chapter 4 point of no return.")],
      notes: "Sunset → no free roam until Honest Abe in Ch5; bank accounts frozen in Starting From Zero (never mention money).",
    },
  ),
  prep(
    "prep-before-wrapping-up",
    506.5,
    "Best-outcome checklist",
    after(c5(6)),
    {
      summary: "The game will ask if you're ready to wrap up. You can postpone.",
      guidance:
        "Before you say yes: make a separate save. For the best outcome, have $2,000,000 in Family Savings, keep your relationship at its highest level, and keep both criminal profiles clean.",
      tips: ["There's no saving partway through what follows.", "Postponing keeps the marker and returns you to free roam."],
    },
    {
      confidence: "high",
      evidence: [cite(PCG_PC, "Proceed/Postpone prompt; postponing returns to free roam; one outcome needs $2M in Family Savings."), cite(GB_END, "Best ending needs $2M Family Savings, top relationship level and clean criminal profiles.")],
      notes: "Endings depend on Mendez choice, bridge choice, relationship, Family Savings and criminal profiles.",
    },
  ),
  asMoneyAdvice(prep(
    "prep-family-savings",
    101.5,
    "Feed the Family Savings account",
    { always: true },
    {
      summary: "The shared Family Savings account has goals the game sets for you.",
      guidance: "Put money in whenever you can spare it. Deposits can't be withdrawn, but hitting the goals pays off.",
      tips: ["Only deposit what you won't need soon."],
    },
    {
      confidence: "high",
      evidence: [cite(GB_END, "Family Savings goals step up over the game; deposits can't be withdrawn."), cite(src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-money-buckme-bank-account-manage/", "GamesRadar+", "BuckMe explained"), "Family Savings is shared and one-way.")],
      notes: "Goals $5k → $15k → $100k → $2M; $2M needed for the best ending.",
      timing: "now",
    },
  )),
];

export const laterStory: GuideRecord[] = [...chapter3, ...chapter4, ...chapter5];
