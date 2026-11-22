import "server-only";
import type { Confidence, GuideRecord, PublicContent, Requirement, VerificationStatus } from "@/contracts";
import { REVIEWED, cite, gb, ppx } from "./sources";

/**
 * Chapter 2 optional content, money methods, contacts and places.
 * Every player-facing string follows docs/research/SPOILER_STYLE.md: what and
 * when, never why. Reasons live in `restricted`.
 */

type Base = Omit<GuideRecord, "public" | "restricted" | "lastReviewed" | "missable"> & {
  missable?: GuideRecord["missable"];
  restricted?: GuideRecord["restricted"];
};

function record(base: Base, content: Partial<PublicContent> & Pick<PublicContent, "name" | "summary" | "guidance">): GuideRecord {
  return {
    missable: "no",
    restricted: {},
    lastReviewed: REVIEWED,
    ...base,
    public: {
      aliases: [],
      tags: [],
      uniqueExperience: false,
      officialCompletion: "unknown",
      timing: "anytime",
      area: "port-gellhorn",
      ...content,
    },
  };
}

const done = (id: string): Requirement => ({ completed: id });
const verified = (confidence: Confidence = "high"): { confidence: Confidence; verification: VerificationStatus } => ({ confidence, verification: "verified" });

export const chapter2Records: GuideRecord[] = [
  // ── Side missions & jobs ───────────────────────────────────────────────────
  record(
    {
      id: "side-mckittrick-farm",
      kind: "side-mission",
      sequence: 201.5,
      visibleWhen: done("story-201"),
      ...verified("medium"),
      evidence: [
        cite(ppx("check-out-mckittrick-farm"), "Starts from the flyer outside the motel reception; available from the start of Chapter 2; pays $400."),
        cite("g8-missables", "Warns that if Kyle dies or the crop duster crashes, the questline can soft-lock; keep several saves."),
      ],
      restricted: {
        internalExplanation: "Soft-lock risk (Game8): Kyle dying or the plane crashing can break the rest of the questline. Workaround reported: return and steal the plane.",
        notes: "Impact conflict: Game8 says the soft-lock blocks 100%; PowerPyx says nothing for 100% is missable. The save-first advice holds either way.",
      },
    },
    {
      name: "Check Out McKittrick Farm",
      summary: "A farm job you pick up from the flyer outside the motel reception.",
      guidance: "Make a separate save before you start, and keep it until this questline is finished.",
      tips: ["Fly carefully and keep the farmer safe. A failed run here can be hard to recover from.", "Keep more than one save slot going while you work through this questline."],
      saveBeforeStarting: true,
      uniqueExperience: true,
      timing: "anytime",
      estimatedMinutes: { min: 10, max: 20 },
    },
  ),
  record(
    {
      id: "side-collect-chemicals",
      kind: "side-mission",
      sequence: 201.6,
      visibleWhen: done("side-mckittrick-farm"),
      ...verified("medium"),
      evidence: [cite(ppx("collect-chemicals-for-kyle"), "Texted about a day after the farm job; you can steal the van instead of paying; pays $1,000.")],
    },
    {
      name: "Spoiler",
      // Real title gives something away (player preference): see TITLE_NOTES.
      summary: "Kyle has another job for you.",
      guidance: "Take it when he gets in touch.",
      uniqueExperience: true,
      area: undefined,
    },
  ),
  record(
    {
      id: "side-pick-up-a-gun",
      kind: "side-mission",
      sequence: 206.5,
      visibleWhen: done("story-206"),
      ...verified("high"),
      evidence: [cite(ppx("pick-up-a-gun"), "Optional step after Girls' Trip at the Port Gellhorn gun store."), cite("gb-missions", "Listed as optional after Girls' Trip.")],
    },
    {
      name: "Pick Up a Gun",
      summary: "An optional stop at the local gun store.",
      guidance: "Worth doing early. You'll want a weapon for the jobs around town.",
      estimatedMinutes: { min: 3, max: 5 },
    },
  ),
  record(
    {
      id: "side-impounded-vehicle",
      kind: "side-mission",
      sequence: 212.4,
      visibleWhen: done("story-212"),
      ...verified("high"),
      evidence: [
        cite(ppx("impounded-vehicle"), "Lucia's car is impounded after Breakfast Run; green car icon near the Port Gellhorn police station; taking it gives two stars."),
        cite(gb("impounded-vehicle", "strangers"), "Optional; car impounded after Breakfast Run."),
        cite("g8-coffee", "Listed among the optional jobs after Coffee Break."),
      ],
    },
    {
      name: "Impounded Vehicle",
      summary: "Your car is in the impound lot near the Port Gellhorn police station.",
      guidance: "Get your car back. It's quick, and it teaches you how impound recovery works.",
      tips: ["Look for the green car icon on the map.", "Driving out through the fence earns a two-star wanted level, so have an escape route in mind."],
      timing: "now",
      estimatedMinutes: { min: 5, max: 10 },
    },
  ),
  record(
    {
      id: "side-thrillbillies",
      kind: "side-mission",
      sequence: 213.1,
      visibleWhen: done("story-213"),
      confidence: "medium",
      verification: "partial",
      evidence: [
        cite(ppx("thrillbillies-check-out-the-mud-club"), "Optional; marked after Coffee Break; dirt race where you only need to avoid last place; first place pays $2,500."),
        cite(gb("thrillbillies"), "Optional (side mission)."),
        cite("g8-ch2", "Lists it among missions needed to progress after Coffee Break."),
      ],
      restricted: { conflicts: "Game8 calls Thrillbillies and its follow-up required; PowerPyx, GTABase and Game Rant call them optional." },
    },
    {
      name: "Thrillbillies",
      summary: "A dirt-track race at the Mud Club north of Port Gellhorn.",
      guidance: "Do it. Most guides call it optional, but it pays well and opens a run of jobs.",
      tips: ["You only need to avoid finishing last, but a win pays the most.", "Buy the outfit at the merch stall and rent a bike on site."],
      uniqueExperience: true,
      timing: "now",
      area: "kelly-county",
      estimatedMinutes: { min: 10, max: 15 },
      money: { payout: { min: 625, max: 2500, note: "Depends on where you finish." }, repeatability: "one-time", risk: "low", efficiency: 4, timeMinutes: { min: 10, max: 15 } },
    },
  ),
  record(
    {
      id: "side-twist-wrist",
      kind: "side-mission",
      sequence: 213.15,
      visibleWhen: done("side-thrillbillies"),
      confidence: "medium",
      verification: "partial",
      evidence: [cite(ppx("twist-wrist-smash-grab-join-billy-on-a-job"), "Texted a few in-game hours after Thrillbillies; armored-van job paying $2,000."), cite(gb("twist-wrist-smash-grab"), "Optional side mission.")],
      restricted: { conflicts: "Game8 lists it as required to progress; others call it optional." },
    },
    {
      name: "Spoiler",
      // Real title gives something away (player preference): see TITLE_NOTES.
      summary: "Billy has another job for you.",
      guidance: "Take it when the text arrives.",
      uniqueExperience: true,
      timing: "now",
      area: "kelly-county",
      money: { payout: { min: 2000, max: 2000 }, repeatability: "one-time", risk: "medium", efficiency: 4 },
    },
  ),
  record(
    {
      id: "side-hit-avery-pawn",
      kind: "side-mission",
      sequence: 213.2,
      visibleWhen: done("story-213"),
      ...verified("high"),
      evidence: [cite(ppx("hit-avery-pawn"), "Optional robbery after Coffee Break; safe code is randomized; fence loot at Dunk's."), cite(gb("hit-avery-pawn"), "Optional side mission after Coffee Break.")],
      restricted: { notes: "GTABase's 'Required for 100%: Yes' is a template field on every page; not specifically required." },
    },
    {
      name: "Hit Avery Pawn",
      summary: "Rob the pawn shop in Port Gellhorn.",
      guidance: "A solid optional score. Fence what you take right away.",
      tips: ["Threatening the staff can get you the safe code. It changes each time.", "Smashing display cases brings a two-star response."],
      uniqueExperience: true,
      estimatedMinutes: { min: 10, max: 20 },
    },
  ),
  record(
    {
      id: "side-hit-kingpin-bowling",
      kind: "side-mission",
      sequence: 213.3,
      visibleWhen: done("story-213"),
      ...verified("high"),
      evidence: [
        cite(ppx("hit-kingpin-bowling"), "Optional bowling-alley assault after Coffee Break; bring sticky bombs for the safe; three key valuables."),
        cite(gb("hit-kingpin-bowling"), "Optional side mission."),
        cite("g8-coffee", "One of four optional jobs after Coffee Break."),
      ],
      restricted: { notes: "Trophy 'Let's Go Bowling' for all three valuables; the robbery respawns later, so not missable." },
    },
    {
      name: "Hit Kingpin Bowling",
      summary: "Hit the bowling alley that a local crew has taken over.",
      guidance: "Prepare before you go: buy explosives at the gun store first.",
      tips: ["Sticky bombs make short work of the safe.", "Search every room. The best haul isn't all in one place."],
      uniqueExperience: true,
      timing: "anytime",
      estimatedMinutes: { min: 15, max: 25 },
    },
  ),
  record(
    {
      id: "side-veteran-hunted",
      kind: "side-mission",
      sequence: 213.4,
      visibleWhen: done("story-213"),
      ...verified("high"),
      evidence: [cite(ppx("veteran-hunted-meet-bret"), "Optional, Jason-only text some time after Coffee Break; pays $500; opens hunting."), cite("gb-money", "Hunting requests open after this mission.")],
    },
    {
      name: "Spoiler",
      // Real title gives something away (player preference): see TITLE_NOTES.
      summary: "Jason has a job offer waiting.",
      guidance: "Take it when the text arrives.",
      uniqueExperience: true,
      area: undefined,
    },
  ),

  // ── Moses ──────────────────────────────────────────────────────────────────
  record(
    {
      id: "act-moses-requests",
      kind: "activity",
      sequence: 210.5,
      visibleWhen: done("story-210"),
      ...verified("medium"),
      evidence: [
        cite(ppx("steal-vehicles-for-moses"), "After Daily Driver, Moses texts vehicle requests in batches; six named vehicles; per-car payouts $1,400–$6,310 plus a condition bonus."),
        cite("ps-moses", "Same vehicles and locations; counts seven including the Daily Driver car."),
      ],
      restricted: { notes: "Each delivery counts as an optional task toward 100% (PPX trophy guide). Moses's chain does not count for Strangers & Freaks." },
    },
    {
      name: "Moses's vehicle requests",
      summary: "Moses texts you cars he wants, a few at a time.",
      guidance: "Work through each batch as it arrives. These pay far better than random car sales.",
      tips: ["Deliver in good condition. Damage cuts the payout.", "He sends the next batch only after you finish the current one.", "Track them from the in-game menu under robberies and Moses drop-offs."],
      uniqueExperience: true,
      officialCompletion: "yes",
      timing: "anytime",
      money: { payout: { min: 1400, max: 6310, note: "Per car, plus a bonus for good condition. One source." }, repeatability: "limited", risk: "medium", efficiency: 5 },
    },
  ),
  record(
    {
      id: "veh-moses-gift",
      kind: "vehicle",
      sequence: 210.6,
      visibleWhen: done("act-moses-requests"),
      ...verified("high"),
      evidence: [cite(ppx("collect-moses-gift"), "After all requested cars, Moses texts; a unique Sultan waits next to his shop."), cite("ps-moses", "Gift car after the final drop-off.")],
    },
    {
      name: "Spoiler",
      // Real title gives something away (player preference): see TITLE_NOTES.
      summary: "Moses wants to see you.",
      guidance: "Head over when he gets in touch.",
      uniqueExperience: true,
    },
  ),

  // ── Money ──────────────────────────────────────────────────────────────────
  record(
    {
      id: "money-sell-to-moses",
      kind: "money-method",
      sequence: 207.5,
      visibleWhen: done("story-207"),
      ...verified("high"),
      evidence: [
        cite(ppx("moses-take-a-vehicle-to-moses"), "Moses buys untracked stolen cars; garage closes 1–2 minutes after each sale."),
        cite("ppx-money", "Selling cars to Moses is the best repeatable Chapter 2 earner, typically $1,000+ per car."),
        cite("gb-money", "Around $1,000 or more per car depending on model and condition."),
        cite("gr-sell", "Only untracked cars; cooldown described as a few in-game hours."),
      ],
      restricted: {
        notes:
          "Cooldown conflict (hedged in public copy): 1–2 real minutes (PPX, GB) vs 'a few in-game hours' (Game Rant); possibly the same wait. Daily cap unverified. PowerPyx advises against grinding in Chapter 2.",
      },
    },
    {
      name: "Sell untracked cars to Moses",
      summary: "Moses buys stolen cars that have no tracker.",
      guidance: "Your best repeatable earner right now. Sell a car whenever you're passing, but long grinding sessions aren't worth it at this stage.",
      tips: [
        "Scan cars with the phone app first. Only cars with no tracker sell.",
        "Steal them a few streets away. He refuses cars taken right by his shop.",
        "Damage lowers the price. Drive carefully on the way in.",
        "There's a short wait between sales, a couple of minutes per most guides.",
      ],
      timing: "anytime",
      money: {
        payout: { min: 1000, max: 1000, note: "About $1,000 or more, depending on the car and its condition." },
        repeatability: "cooldown",
        cooldownNote: "A short wait between sales. Guides disagree on exactly how long.",
        risk: "low",
        efficiency: 4,
      },
    },
  ),
  record(
    {
      id: "money-fence-dunk",
      kind: "money-method",
      sequence: 211.5,
      visibleWhen: done("story-211"),
      ...verified("high"),
      evidence: [
        cite("gb-safe", "Pocket cash is lost on death or arrest; pocket cap $20,000 per character."),
        cite("gra-buckme", "Pocket cash lost on death or arrest; checking per character; savings shared and one-way."),
        cite("ppx-fence", "Dunk is the Port Gellhorn fence after Slam Dunk; narcotics low, jewelry low, marked bills very low."),
        cite("gr-fence", "Dunk takes the same goods Brian did."),
        cite("gb-money", "Loot only becomes money once fenced; lost if wasted or busted."),
      ],
    },
    {
      name: "Fence loot with Dunk",
      summary: "Dunk's trailer is where robbery loot turns into money.",
      guidance: "Fence loot as soon as you can. Anything you're carrying is lost if you're wasted or busted.",
      tips: [
        "His rates are low, and marked bills fetch the least.",
        "Check his rates on the map before you drive over.",
        "Bank the cash once it lands. Most guides say pocket cash is lost if you're wasted or busted.",
        "Each character carries their own pocket cash, up to $20,000. Family Savings is shared and can't be withdrawn.",
      ],
      money: { repeatability: "repeatable", risk: "low", efficiency: 3 },
    },
  ),
  record(
    {
      id: "money-cash-goal",
      kind: "activity",
      sequence: 213.5,
      visibleWhen: done("story-213"),
      ...verified("high"),
      evidence: [
        cite(ppx("prepare-for-vice-city"), "Passive objective after Coffee Break: have at least $15,000."),
        cite(gb("prepare-for-vice-city"), "Earn at least $15,000; keep it safe in BuckMe."),
        cite("g8-checkout", "Owning at least $15,000 is required."),
      ],
      restricted: {
        internalExplanation: "Cash gate for the Chapter 2 finale (Checking Out). Unclear whether pocket cash counts or both characters' balances.",
      },
    },
    {
      name: "Build up $15,000",
      summary: "The game now asks you to have at least $15,000.",
      guidance: "Reach $15,000 and keep it in BuckMe. Mark this done once you're there.",
      tips: ["The optional jobs around town are the quickest way there.", "It isn't confirmed whether pocket cash counts, so bank it to be safe."],
      timing: "before-advancing",
      tags: ["cash-goal:15000"],
    },
  ),
  record(
    {
      id: "money-store-robberies",
      kind: "money-method",
      sequence: 201.3,
      visibleWhen: done("story-201"),
      confidence: "medium",
      verification: "verified",
      evidence: [cite(ppx("behind-on-payments"), "Suggests robbing store registers or mugging people to raise early Chapter 2 cash.")],
    },
    {
      name: "Rob store registers",
      summary: "Quick cash from convenience-store registers.",
      guidance: "Fine for small amounts when you're broke. Bank the cash straight after.",
      money: { repeatability: "repeatable", risk: "medium", efficiency: 2 },
    },
  ),

  // ── Wait / postpone ────────────────────────────────────────────────────────
  record(
    {
      id: "wait-extra-garages",
      kind: "activity",
      sequence: 210.7,
      visibleWhen: done("story-210"),
      ...verified("medium"),
      evidence: [cite("ppx-garages", "Real Estate app sells 8 garages totaling $160,000."), cite(ppx("daily-driver-steal-the-crawler-for-moses"), "Moses gives the Port Gellhorn garage after Daily Driver; Real Estate app installs.")],
    },
    {
      name: "Buying more garages",
      summary: "The real estate app sells extra garages.",
      guidance: "Hold off. Your cash is worth more right now than extra parking.",
      timing: "later-better",
    },
  ),

  // ── Places ─────────────────────────────────────────────────────────────────
  record(
    {
      id: "place-mud-club",
      kind: "location",
      sequence: 213.05,
      visibleWhen: done("story-213"),
      ...verified("medium"),
      evidence: [cite("ppx-races", "Thrilbilly Mud Club in north Kelly County hosts 8 unique races."), cite(ppx("thrillbillies-check-out-the-mud-club"), "Introduced after Coffee Break.")],
    },
    {
      name: "The Mud Club",
      summary: "A dirt-track racing venue north of Port Gellhorn.",
      guidance: "Come back for more races once you've been introduced.",
      area: "kelly-county",
      uniqueExperience: true,
    },
  ),
];

/**
 * Canonical titles shown to the player as "Spoiler" because the real title
 * gives away what happens (player request, 2026-11-21).
 * SERVER-ONLY research reference; never projected.
 */
export const TITLE_NOTES: Record<string, string> = {
  "side-collect-chemicals": "Collect Chemicals for Kyle",
  "side-twist-wrist": "Twist Wrist, Smash, Grab",
  "side-veteran-hunted": "Veteran Hunted",
  "veh-moses-gift": "Collect Moses' Gift",
};
