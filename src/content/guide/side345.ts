import "server-only";
import type { Confidence, GuideRecord, MoneyFacts, PublicContent, Requirement, SourceEvidence } from "@/contracts";
import { REVIEWED, cite } from "./sources";

/**
 * Chapter 3–4 side content and money (verified 2026-11-21; research:
 * docs/research/restricted/SIDE_MONEY_CH3_END.md). GTABase credits PowerPyx for
 * its stranger guide, so PPX+GB agreement is rated medium.
 * Titles that give things away are shown as "Spoiler" (player preference);
 * canonical titles live in LATER_TITLE_NOTES (server-only).
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const ppx = (slug: string) => src(`https://www.powerpyx.com/gta-6-${slug}-walkthrough/`, "PowerPyx", `GTA 6 ${slug} walkthrough`);
const gbs = (slug: string) => src(`https://www.gtabase.com/gta-6/strangers/${slug}`, "GTABase", `GTA 6 ${slug}`);
const PPX_MONEY = src("https://www.powerpyx.com/gta-6-money-guide-how-to-get-money-fast/", "PowerPyx", "GTA 6 Money Guide");
const PPX_FENCE = src("https://www.powerpyx.com/gta-6-all-fence-locations-how-to-fence-stolen-goods/", "PowerPyx", "GTA 6 All Fence Locations");
const PPX_BANK = src("https://www.powerpyx.com/gta-6-all-bank-jobs-locations-bank-vaults/", "PowerPyx", "GTA 6 All Bank Jobs Locations");
const PPX_PAYDAY = src("https://www.powerpyx.com/gta-6-all-payday-loans-jobs-locations/", "PowerPyx", "GTA 6 All Payday Loans Jobs");
const PPX_SNG = src("https://www.powerpyx.com/gta-6-all-smash-n-grabs-locations/", "PowerPyx", "GTA 6 All Smash 'n' Grabs");
const PPX_LABS = src("https://www.powerpyx.com/gta-6-all-kitty-litter-lab-locations/", "PowerPyx", "GTA 6 All Kitty Litter Lab Locations");
const PPX_GANG = src("https://www.powerpyx.com/gta-6-all-illegal-gang-operations-locations/", "PowerPyx", "GTA 6 All Illegal Gang Operations");
const PPX_PNS = src("https://www.powerpyx.com/gta-6-all-pay-n-spray-locations/", "PowerPyx", "GTA 6 All Pay 'n' Spray Locations");
const GB_MONEY = src("https://www.gtabase.com/gta-6/articles/how-to-make-money-fast-in-gta-6", "GTABase", "How to Make Money Fast in GTA 6");
const G8_ROB = src("https://game8.co/games/GTA-6/archives/638730", "Game8", "How to Rob Stores");
const G8_OPS = src("https://game8.co/games/GTA-6/archives/638612", "Game8", "All Robbery Opportunities and Illegal Operations");
const G8_MONEY = src("https://game8.co/games/GTA-6/archives/638321", "Game8", "Best Ways to Make Money");
const G8_PRIO = src("https://game8.co/games/GTA-6/archives/637141", "Game8", "Best Missions to Prioritize");
const G8_RANDY = src("https://game8.co/games/GTA-6/archives/639137", "Game8", "All Randy's Wishlist Vehicle Locations");
const PCG_FENCE = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-fence-locations/", "PC Gamer", "GTA 6 fence locations");

const done = (...ids: string[]): Requirement => (ids.length === 1 ? { completed: ids[0] } : { all: ids.map((completed) => ({ completed })) });
const S = (n: number) => `story-${n}`;

interface Spec {
  id: string;
  kind?: GuideRecord["kind"];
  seq: number;
  visibleWhen: Requirement;
  expiresWhen?: Requirement;
  missable?: GuideRecord["missable"];
  confidence?: Confidence;
  verification?: GuideRecord["verification"];
  evidence: SourceEvidence[];
  notes?: string;
  conflicts?: string;
  pub: Partial<PublicContent> & Pick<PublicContent, "name" | "summary" | "guidance">;
}

function rec(s: Spec): GuideRecord {
  return {
    id: s.id,
    kind: s.kind ?? "side-mission",
    sequence: s.seq,
    visibleWhen: s.visibleWhen,
    expiresWhen: s.expiresWhen,
    missable: s.missable ?? (s.expiresWhen ? "yes" : "no"),
    public: {
      aliases: [],
      tags: [],
      uniqueExperience: s.kind === "money-method" ? false : true,
      officialCompletion: "unknown",
      timing: "anytime",
      ...s.pub,
    },
    restricted: { ...(s.notes ? { notes: s.notes } : {}), ...(s.conflicts ? { conflicts: s.conflicts } : {}) },
    evidence: s.evidence,
    confidence: s.confidence ?? "medium",
    verification: s.verification ?? "verified",
    lastReviewed: REVIEWED,
  };
}

const money = (facts: MoneyFacts) => facts;

export const LATER_TITLE_NOTES: Record<string, string> = {
  "side-andy-4": "Read the Label (Retrieve the Cellerica Van)",
  "side-andy-5": "Puff Puff Pass (Meet at the Warehouse)",
  "side-pete-1": "The Last Mile: Passing the Torch",
  "side-bad-driver": "Bad Driver! (Find Felipe)",
  "side-shayna": "This is a Free Call From… (Pick up Shayna)",
};

export const side345: GuideRecord[] = [
  // ── Chapter 3 · side missions ─────────────────────────────────────────────
  rec({
    id: "side-get-wheels", seq: 302.1, visibleWhen: done(S(302)),
    evidence: [cite(ppx("get-your-wheels"), "Optional task after Dealer's Choice: pay ~$700–900 to retrieve an impounded car or register one at Pay 'n' Spray.")],
    pub: { name: "Get Your Wheels", summary: "You need a personal car in the new city.", guidance: "Get it sorted early. It makes everything else easier.", tips: ["Recovering an impounded car costs about $700–900 through the recovery app.", "Or register another car at a Pay 'n' Spray if you have a free garage slot."], timing: "now", uniqueExperience: false, estimatedMinutes: { min: 5, max: 10 } },
  }),
  rec({
    id: "side-yago-1", seq: 302.2, visibleWhen: done(S(302)),
    evidence: [cite(ppx("join-a-street-race"), "Text from Manuel after Dealer's Choice; rent a car $600–900; first place pays $3,000."), cite(gbs("join-a-street-race"), "Yago strand opener; counts for Strangers & Freaks.")],
    pub: { name: "Join a Street Race", summary: "An invitation to an underground street race.", guidance: "Worth doing. It pays well for a win and starts a questline that counts toward the stranger trophy.", tips: ["Renting a car costs $600–900; a win pays $3,000."], area: undefined, estimatedMinutes: { min: 10, max: 15 }, money: money({ payout: { min: 3000, max: 3000, note: "For first place." }, repeatability: "one-time", risk: "low", efficiency: 3 }) },
  }),
  rec({
    id: "side-yago-2", seq: 302.3, visibleWhen: done("side-yago-1"),
    evidence: [cite(ppx("bumper-to-bumper-mentor-yago"), "Several days after the first race; $500; police chase afterwards."), cite(gbs("bumper-to-bumper"), "Second Yago mission.")],
    pub: { name: "Bumper to Bumper", summary: "Yago has more racing in mind.", guidance: "If it shows a lock icon, sleep and come back in the afternoon or evening.", tips: ["Expect the police afterwards."] },
  }),
  rec({
    id: "side-yago-3", seq: 302.4, visibleWhen: done("side-yago-2"), missable: "yes",
    evidence: [cite(ppx("race-against-yago"), "Time-limited (hourglass); up to $3,800 for first."), cite(gbs("race-against-yago"), "Time-limited optional mission."), cite(src("https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions", "Push Square", "GTA 6 Chapters & Story Missions"), "Marked time sensitive.")],
    confidence: "high",
    notes: "Hourglass mission; expires if the timer runs out. No trophy/100% impact.",
    pub: { name: "Race Against Yago", summary: "A head-to-head race with a timer on the invitation.", guidance: "Do it the moment it appears. It's time-limited and won't come back.", tips: ["Pick the freeway run when you talk to the organizer."], timing: "now", money: money({ payout: { min: 3800, max: 3800, note: "For first place." }, repeatability: "one-time", risk: "low", efficiency: 4 }) },
  }),
  rec({
    id: "side-yago-4", seq: 302.5, visibleWhen: done("side-yago-2"),
    evidence: [cite(ppx("brother-to-brother-back-up-yago"), "Final Yago mission, a few days after earlier ones; completes the stranger strand."), cite(gbs("brother-to-brother"), "Counts for Strangers & Freaks.")],
    pub: { name: "Brother to Brother", summary: "Yago asks Jason for backup.", guidance: "Finishing this completes a questline that counts toward the stranger trophy." },
  }),
  rec({
    id: "side-kyle-3", seq: 302.6, visibleWhen: done("side-collect-chemicals", S(301)),
    evidence: [cite(ppx("buddy-check-on-kyle"), "Kyle texts after a long delay (around mid Chapter 3); either outcome counts for Strangers & Freaks."), cite(gbs("buddy"), "Final Kyle mission.")],
    pub: { name: "Buddy?", summary: "Kyle gets back in touch after a long silence.", guidance: "Head out to the farm when he texts. It counts toward the stranger trophy.", area: "kelly-county" },
  }),
  rec({
    id: "side-billy-3", seq: 316.1, visibleWhen: done("side-twist-wrist", S(301)),
    evidence: [cite(ppx("mall-rats"), "After a long delay following Billy's second job; solo; pays $12,000."), cite(gbs("mall-rats"), "Billy 3.")],
    pub: { name: "Mall Rats", summary: "Billy has a bigger job lined up.", guidance: "Good money. Do it when it shows up.", money: money({ payout: { min: 12000, max: 12000 }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "side-billy-4", seq: 316.2, visibleWhen: done("side-billy-3"),
    evidence: [cite(ppx("the-impaler-steal-the-impaler"), "Billy calls, then Wyman texts; reply to mark it; 3-star wanted level; escape via the tunnel north of Ambrosia."), cite(gbs("the-impaler"), "Billy 4.")],
    pub: { name: "The Impaler", summary: "Billy's crew wants a very particular vehicle.", guidance: "Reply to the text to mark the job. Plan your escape before you grab anything.", tips: ["Expect a three-star wanted level. A train tunnel north of Ambrosia is a good escape route."] },
  }),
  rec({
    id: "side-billy-5", seq: 316.3, visibleWhen: done("side-billy-4"),
    evidence: [cite(ppx("hometown-heroes"), "Needs both protagonists; pays $10,000; earns The Lone Rider."), cite(gbs("hometown-heroes"), "Billy 5.")],
    pub: { name: "Hometown Heroes", summary: "The last job for Billy's crew. Both of you are needed.", guidance: "Finish it for a trophy and a solid payday.", area: "kelly-county", money: money({ payout: { min: 10000, max: 10000 }, repeatability: "one-time", risk: "medium", efficiency: 4 }) },
  }),
  rec({
    id: "side-andy-1", seq: 309.1, visibleWhen: done(S(305), S(309)),
    evidence: [cite(ppx("climbing-the-cellerichain"), "Andy calls Lucia during Chapter 3; Lucia only."), cite(gbs("climbing-the-cellerichain"), "Andy 1.")],
    pub: { name: "Climbing the Cellerichain", summary: "An old acquaintance calls Lucia with a business opportunity.", guidance: "Lucia only. This questline earns a trophy at the end." },
  }),
  rec({
    id: "side-andy-2", seq: 309.2, visibleWhen: done("side-andy-1"),
    evidence: [cite(ppx("pay-the-cellerica-fee"), "Costs $5,000 via BuckMe; refunded at the end of the strand."), cite(gbs("pay-the-cellerica-fee"), "Andy 2.")],
    pub: { name: "Pay the Cellerica Fee", summary: "Andy wants $5,000 up front.", guidance: "Pay it if you want to finish the questline. It works out in the end." },
  }),
  rec({
    id: "side-andy-3", seq: 309.3, visibleWhen: done("side-andy-2"),
    evidence: [cite(ppx("peach-join-the-cellerica-initiation"), "Andy texts after the fee; choices don't change the outcome."), cite(gbs("peach"), "Andy 3.")],
    pub: { name: "Peach!", summary: "An invitation to Andy's company campus.", guidance: "Your choices here don't change how it turns out. Relax and enjoy it." },
  }),
  rec({
    id: "side-andy-4", seq: 309.4, visibleWhen: done("side-andy-3"),
    evidence: [cite(ppx("read-the-label-retrieve-the-cellerica-van"), "After Peach!, play as Lucia; pays $1,800."), cite(gbs("read-the-label"), "Andy 4.")],
    pub: { name: "Spoiler", summary: "Lucia has another job waiting.", guidance: "Take it when it shows up." },
  }),
  rec({
    id: "side-andy-5", seq: 309.5, visibleWhen: done("side-andy-4"),
    evidence: [cite(ppx("puff-puff-pass-meet-at-the-warehouse"), "Final Andy job; pays $10,000 plus the $5,000 fee back; Road to Rehabilitation trophy."), cite(gbs("puff-puff-pass"), "Andy 5.")],
    pub: { name: "Spoiler", summary: "Lucia has another job waiting.", guidance: "Take it when it shows up.", money: money({ payout: { min: 10000, max: 10000 }, repeatability: "one-time", risk: "medium" }) },
  }),
  rec({
    id: "side-yasmani-jewelry", seq: 312.1, visibleWhen: done(S(312)),
    confidence: "high",
    evidence: [cite(ppx("yasmanis-jewelry-jobs"), "After Boobie Time; $20,000 for three requested items; unlocks the Snap Gun."), cite(gbs("yasmanis-atm-jobs"), "Yasmani strand."), cite(G8_PRIO, "Prioritize Yasmani's Jewelry Jobs.")],
    conflicts: undefined,
    notes: "Classification conflicts (PPX main #53 vs optional elsewhere). Safe codes PPX: Casa de Empeño 1680, Richardson 6815, Donovan Banks 0104.",
    pub: { name: "Yasmani's Jewelry Jobs", summary: "Yasmani wants three specific pieces from three stores.", guidance: "High priority. It pays well and unlocks a tool that makes later break-ins much easier.", timing: "now", money: money({ payout: { min: 20000, max: 20000, note: "For the three requested items, plus whatever else you take." }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "act-tyrone-labs", kind: "collectible-set", seq: 307.1, visibleWhen: done(S(307)),
    evidence: [cite(PPX_LABS, "14 labs; $2,000–$2,500 each via BuckMe; Jason only."), cite(gbs("take-out-kitty-litter"), "Tyrone's lab strand.")],
    pub: { name: "Take out the drug labs", summary: "Tyrone wants the labs around the city shut down. Jason only.", guidance: "Each lab pays $2,000–$2,500. Clear enough of them and Tyrone has a final job.", collectibleTotal: 14, uniqueExperience: false, money: money({ payout: { min: 2000, max: 2500, note: "Per lab." }, repeatability: "limited", risk: "medium", efficiency: 3 }) },
  }),
  rec({
    id: "side-spin-on-this", seq: 307.2, visibleWhen: done(S(307)),
    evidence: [cite(ppx("spin-on-this-shut-down-the-labs"), "After enough labs; $10,000; trophy; weapons locked in on approach."), cite(gbs("spin-on-this"), "Tyrone final.")],
    pub: { name: "Spin On This", summary: "Tyrone's final job, once you've cleared enough labs.", guidance: "Gear up before you approach. You'll be locked into your loadout.", money: money({ payout: { min: 10000, max: 10000 }, repeatability: "one-time", risk: "medium" }) },
  }),
  rec({
    id: "act-randy-wishlist", kind: "activity", seq: 317.1, visibleWhen: done(S(317)), confidence: "high",
    evidence: [cite(PPX_MONEY, "Randy's Wish List supercars usually pay $30,000+ in perfect condition."), cite(GB_MONEY, "Upward of $30,000."), cite(G8_RANDY, "Wish list locations; payouts vary."), cite(G8_MONEY, "$5k–$30k.")],
    notes: "Car count conflicts (16/18/21/22). Advanced trackers ping police if you drive slowly; switch off near Randy.",
    pub: { name: "Randy's Wish List", summary: "Randy wants specific high-end cars, and pays big for them.", guidance: "The best money in this part of the game. Steal his listed cars between missions.", tips: ["These cars have advanced trackers. Keep moving; driving slowly alerts the police.", "Damage cuts the price, so drive carefully.", "Scan a car to check whether he wants it."], officialCompletion: "no", money: money({ payout: { min: 5000, max: 30000, note: "Per car. Sources range from $5,000 to $30,000+." }, repeatability: "limited", risk: "medium", efficiency: 5 }) },
  }),

  // ── Chapter 3 · money methods ────────────────────────────────────────────
  rec({
    id: "money-pay-n-spray", kind: "money-method", seq: 301.1, visibleWhen: done(S(301)),
    evidence: [cite(PPX_MONEY, "Standard-tracker cars sell at any Pay 'n' Spray for about $4,000+."), cite(PPX_PNS, "19 Pay 'n' Spray locations.")],
    notes: "Game8 says Pay 'n' Spray pays considerably less; conflict.",
    pub: { name: "Sell tracked cars at Pay 'n' Spray", summary: "Pay 'n' Spray now buys cars with standard trackers.", guidance: "A step up from the old car buyer. Bigger cars, bigger payouts.", tips: ["Sources disagree on how much it pays. Check a car's value first."], money: money({ payout: { min: 4000, max: 4000, note: "About $4,000+ for a good car (one source)." }, repeatability: "repeatable", risk: "medium", efficiency: 3 }) },
  }),
  rec({
    id: "money-fence-tyrone", kind: "money-method", seq: 307.3, visibleWhen: done(S(307)), confidence: "high",
    evidence: [cite(PPX_FENCE, "Tyrone in La Perle: narcotics high, jewelry medium, bills medium."), cite(PCG_FENCE, "Tyrone fence.")],
    pub: { name: "Fence narcotics with Tyrone", summary: "Tyrone pays the best rate for narcotics.", guidance: "Bring drugs here rather than anywhere else.", money: money({ repeatability: "repeatable", risk: "low", efficiency: 3 }) },
  }),
  rec({
    id: "money-fence-yasmani", kind: "money-method", seq: 312.2, visibleWhen: done(S(312)), confidence: "high",
    evidence: [cite(PPX_FENCE, "Yasmani in Little Cuba: jewelry high, bills high, narcotics medium."), cite(PCG_FENCE, "Yasmani fence.")],
    pub: { name: "Fence jewelry and bills with Yasmani", summary: "Yasmani pays top rates for jewelry and marked bills.", guidance: "Your main fence for robbery loot from here on.", tips: ["Once set up, you can drop loot at a garage for pickup, for a fee."], money: money({ repeatability: "repeatable", risk: "low", efficiency: 4 }) },
  }),
  rec({
    id: "money-jewelry-stores", kind: "money-method", seq: 312.3, visibleWhen: done("side-yasmani-jewelry"), confidence: "high",
    evidence: [cite(PPX_MONEY, "$10,000–$25,000 per jewelry store robbery."), cite(GB_MONEY, "$10k–$25k+."), cite(PPX_SNG, "35 Smash 'n' Grab stores; restock time.")],
    pub: { name: "Rob jewelry stores", summary: "Jewelry stores are now worth hitting.", guidance: "Strong repeatable money. Sell the haul to Yasmani.", tips: ["Use your new lockpick tool on the back door, wipe the camera footage, and crack the safe.", "Stores need time to restock and pay less if you hit them again soon."], money: money({ payout: { min: 10000, max: 25000, note: "Per robbery." }, repeatability: "cooldown", cooldownNote: "Each store needs time to restock.", risk: "medium", efficiency: 4 }) },
  }),
  rec({
    id: "money-small-banks", kind: "money-method", seq: 316.4, visibleWhen: done(S(316)), confidence: "high",
    evidence: [cite(PPX_BANK, "14 small banks; $5k–$45k each; Dye Pack Jammer from Credit Check."), cite(GB_MONEY, "Banks about $5k–$45k."), cite(G8_ROB, "Bank robberies unlock after Credit Check.")],
    pub: { name: "Rob small banks", summary: "Small bank branches are now on the table.", guidance: "Good money. Fence the marked bills with Yasmani.", tips: ["Your new jammer stops the dye packs going off."], money: money({ payout: { min: 5000, max: 45000, note: "Per bank." }, repeatability: "repeatable", risk: "high", efficiency: 4 }) },
  }),
  rec({
    id: "money-payday-loans", kind: "money-method", seq: 316.5, visibleWhen: done(S(316)), confidence: "high",
    evidence: [cite(PPX_PAYDAY, "7 payday loan stores; $2k–$25k."), cite(G8_ROB, "Payday loans unlock after Credit Check.")],
    pub: { name: "Rob payday loan stores", summary: "Seven payday loan stores, each with cash on hand.", guidance: "Quick, solid money. The Little Cuba store pays best.", money: money({ payout: { min: 2000, max: 25000, note: "Per store." }, repeatability: "repeatable", risk: "medium", efficiency: 4 }) },
  }),
  rec({
    id: "money-gang-ops", kind: "money-method", seq: 301.2, visibleWhen: done(S(301)),
    evidence: [cite(PPX_GANG, "39 gang operations; they respawn."), cite(G8_OPS, "Guardia ops average $9k–$20k.")],
    pub: { name: "Hit gang operations", summary: "Gang hideouts hold cash, drugs and valuables.", guidance: "Good loot, and they count toward 100%. Clear them as you find them.", tips: ["They slowly restock, so you can come back."], money: money({ payout: { min: 9000, max: 20000, note: "Typical haul at city gang sites (one source)." }, repeatability: "cooldown", risk: "high", efficiency: 3 }) },
  }),
  rec({
    id: "money-rob-criminals", kind: "money-method", seq: 201.4, visibleWhen: done(S(201)),
    evidence: [cite(GB_MONEY, "Robbing criminals in random events: about $1,000–$15,000.")],
    pub: { name: "Rob criminals mid-crime", summary: "Random street crimes are a chance to rob the robbers.", guidance: "When you stumble on one, it's often worth stepping in.", money: money({ payout: { min: 1000, max: 15000, note: "Per encounter (one source)." }, repeatability: "unknown", risk: "medium", efficiency: 2 }) },
  }),

  // ── Chapter 4 ─────────────────────────────────────────────────────────────
  rec({
    id: "side-eddie-party", seq: 403.1, visibleWhen: done(S(403)),
    evidence: [cite(ppx("attend-eddie-acostas-party"), "Paying $50,000 buys a worthless NFT; refuse."), cite(gbs("attend-eddie-acostas-party"), "No reward.")],
    pub: { name: "Attend Eddie Acosta's Party", summary: "An invitation to a party in the hills.", guidance: "Go if you like, but don't hand over money for any investment you're offered.", timing: "anytime" },
  }),
  rec({
    id: "side-pete-1", seq: 403.2, visibleWhen: done(S(403)),
    evidence: [cite(ppx("the-last-mile-passing-the-torch-recover-petes-plane"), "Pete calls Jason early in Ch4; $12,000; unique rifle on the hangar table (safe 3718)."), cite(gbs("the-last-mile-passing-the-torch"), "Counts for Strangers & Freaks.")],
    pub: { name: "Spoiler", summary: "Jason has a job offer waiting.", guidance: "Take it when he gets in touch.", money: money({ payout: { min: 12000, max: 12000 }, repeatability: "one-time", risk: "medium", efficiency: 4 }) },
  }),
  rec({
    id: "side-pete-2", seq: 403.3, visibleWhen: done("side-pete-1"),
    evidence: [cite(ppx("the-last-mile-backseat-pilot-deliver-packages"), "$20,000 for all 7 drops within the time limit."), cite(gbs("the-last-mile-backseat-pilot"), "Pete 2.")],
    pub: { name: "Backseat Pilot", summary: "Airdrop deliveries against the clock.", guidance: "Hit all seven drops in time for the full $20,000.", tips: ["Avoid the red circles on the map. They bring a wanted level."], money: money({ payout: { min: 20000, max: 20000 }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "side-pete-3", seq: 403.4, visibleWhen: done("side-pete-2"),
    evidence: [cite(ppx("petes-deliveries-southpoint-airfield-avery-allen-co"), "Two delivery runs, either order; $20,000 each."), cite(gbs("petes-deliveries-southpoint-airfield"), "Pete deliveries.")],
    pub: { name: "Pete's Deliveries: Southpoint Airfield", summary: "Another timed delivery run.", guidance: "Seven drops before the deadline. Expect a fight at the pickup.", money: money({ payout: { min: 20000, max: 20000 }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "side-pete-4", seq: 403.5, visibleWhen: done("side-pete-2"),
    evidence: [cite(ppx("petes-deliveries-southpoint-airfield-avery-allen-co"), "$20,000; 7 drops by 14:00."), cite(gbs("petes-deliveries-avery-allen-co"), "Pete deliveries.")],
    pub: { name: "Pete's Deliveries: Avery Allen & Co.", summary: "Another timed delivery run.", guidance: "Seven drops before the deadline.", money: money({ payout: { min: 20000, max: 20000 }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "side-pete-5", seq: 403.6, visibleWhen: done("side-pete-3", "side-pete-4"),
    evidence: [cite(src("https://www.gtabase.com/gta-6/strangers/deliver-packages-pilot-pete", "GTABase", "Deliver Packages (Pilot Pete)"), "Final Pete job; $20,000; completes the strand.")],
    pub: { name: "Deliver Packages", summary: "Pete's last delivery run.", guidance: "Finish it to complete a questline that counts toward the stranger trophy.", money: money({ payout: { min: 20000, max: 20000 }, repeatability: "one-time", risk: "medium", efficiency: 5 }) },
  }),
  rec({
    id: "side-date-night", seq: 406.1, visibleWhen: done(S(406)),
    evidence: [cite(ppx("its-a-date"), "Optional date after Heavy Lifting; relationship boost.")],
    pub: { name: "It's A Date!", summary: "A night out together.", guidance: "Go. Your relationship matters, and now's a good time.", timing: "now", estimatedMinutes: { min: 10, max: 15 } },
  }),
  rec({
    id: "side-bad-driver", seq: 407.1, visibleWhen: done(S(407)), expiresWhen: { completed: S(420) },
    evidence: [cite(ppx("bad-driver-find-felipe"), "After Party Hard; permanently gone once Power Play starts."), cite(gbs("bad-driver-find-felipe"), "Missable optional mission.")],
    notes: "Gone when Power Play starts (warning shows before it via last chance).",
    pub: { name: "Spoiler", summary: "One of your crew has a job for you.", guidance: "Do this soon. It won't wait forever.", lastChanceCopy: "Last chance: do this before your next story mission.", timing: "before-advancing" },
  }),
  rec({
    id: "side-shayna", seq: 405.1, visibleWhen: done(S(405)), missable: "yes",
    evidence: [cite(ppx("this-is-a-free-call-from-pick-up-shayna"), "Lucia only; time-limited; up to ~$6,500 in goods.")],
    notes: "Chapter conflict: GTABase puts it in Ch3.",
    pub: { name: "Spoiler", summary: "Lucia gets a message.", guidance: "Time-limited. Take it as soon as the message arrives.", timing: "now" },
  }),
  rec({
    id: "side-wheres-the-money", seq: 426.1, visibleWhen: done(S(426)), confidence: "high",
    evidence: [cite(PPX_MONEY, "That's Where The Money Is… unlocks large bank vaults; ~$80,000 in marked bills."), cite(PPX_BANK, "Large vaults unlock after this mission."), cite(GB_MONEY, "Vaults are the best money.")],
    pub: { name: "That's Where The Money Is…", summary: "Yasmani has a tip about a security van.", guidance: "Do this now. It opens up the best money-maker in the game.", tips: ["Expect an instant four-star response. Have a fast getaway ready."], timing: "now", money: money({ payout: { min: 80000, max: 80000, note: "If you grab all the marked bills." }, repeatability: "one-time", risk: "high", efficiency: 5 }) },
  }),
  rec({
    id: "money-bank-vaults", kind: "money-method", seq: 426.2, visibleWhen: done("side-wheres-the-money"), confidence: "high",
    evidence: [cite(PPX_BANK, "8 large bank vaults; $65k–$205k each."), cite(PPX_MONEY, "Best money for the time; repeatable."), cite(GB_MONEY, "Vaults are by far the best money.")],
    pub: { name: "Rob bank vaults", summary: "Follow a security van and let its guard open the vault.", guidance: "By far the best money in the game. Repeat it as often as you like.", tips: ["Bring two bags. Hand one to your partner.", "A fast motorbike, then a car swap, shakes the police.", "Yasmani sells van tips for $10,000."], money: money({ payout: { min: 65000, max: 205000, note: "Per vault." }, repeatability: "repeatable", risk: "high", efficiency: 5 }) },
  }),
];
