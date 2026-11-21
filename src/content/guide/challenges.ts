import "server-only";
import type { GuideRecord, SourceEvidence } from "@/contracts";
import { CH1_LAST } from "./story";
import { REVIEWED, cite } from "./sources";

/**
 * "Challenge ideas": sandbox challenges WE made up for fun (player request:
 * "no bad ideas"). The challenge is ours; every mechanic it relies on is
 * confirmed by a cited post-launch source. Tagged "idea" so the UI labels them
 * as ideas, not discoveries. Not missions, not trophies, not 100% items.
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const PCG_HIDDEN = src("https://www.pcgamer.com/games/grand-theft-auto/15-hidden-gta-6-controls-and-features-you-should-know-about/", "PC Gamer", "15 hidden GTA 6 controls and features");
const GR_HONK = src("https://gamerant.com/gta-6-how-honk-flip-people-off/", "Game Rant", "How to Honk and Trash Talk While Driving");
const GR_ATM = src("https://gamerant.com/gta-6-atm-find-use-rob/", "Game Rant", "How to Find, Use, and Rob ATMs");
const PPX_JET = src("https://www.powerpyx.com/gta-6-military-fighter-jet-location/", "PowerPyx", "GTA 6 Military Fighter Jet Location");
const PPX_PARA = src("https://www.powerpyx.com/gta-6-how-to-get-parachute/", "PowerPyx", "GTA 6 How to Get Parachute");
const PPX_AIR = src("https://www.powerpyx.com/gta-6-helicopter-plane-locations/", "PowerPyx", "GTA 6 Helicopter & Plane Locations");
const PPX_MOD = src("https://www.powerpyx.com/gta-6-all-mod-shops-locations/", "PowerPyx", "GTA 6 All Mod Shops Locations");
const PS_TIPS = src("https://www.pushsquare.com/guides/gta-6-tips-and-tricks-you-need-to-know", "Push Square", "GTA 6: Tips & Tricks You Need to Know");
const PPX_RACES = src("https://www.powerpyx.com/gta-6-all-unique-race-locations-racing-activities/", "PowerPyx", "GTA 6 All Unique Race Locations");

function idea(
  id: string,
  name: string,
  summary: string,
  guidance: string,
  tips: string[],
  tags: string[],
  evidence: SourceEvidence[],
  minutes?: [number, number],
): GuideRecord {
  return {
    id,
    kind: "activity",
    visibleWhen: { completed: CH1_LAST },
    missable: "no",
    public: {
      name,
      aliases: [],
      summary,
      guidance,
      tips,
      tags: ["try-this", "idea", ...tags],
      uniqueExperience: true,
      officialCompletion: "no",
      timing: "anytime",
      estimatedMinutes: minutes ? { min: minutes[0], max: minutes[1] } : undefined,
    },
    restricted: { notes: "Challenge invented by the guide; mechanics cited." },
    evidence,
    confidence: "medium",
    verification: "verified",
    lastReviewed: REVIEWED,
  };
}

export const challengeIdeas: GuideRecord[] = [
  idea(
    "idea-road-rage-roulette",
    "Road rage roulette",
    "Honk at ten drivers in a row and keep score: how many apologize, how many swear, how many get out swinging?",
    "Lean on the horn behind or beside each driver, then trash-talk them. Tally the results.",
    ["Each driver only reacts so many times, so move on to the next one.", "Skip police cars, or don't: that's a wanted star."],
    ["funny", "chaos"],
    [cite(GR_HONK, "Honking and trash talk get varied NPC reactions, including fights; insulting police gives a wanted star.")],
    [5, 15],
  ),
  idea(
    "idea-one-star-forever",
    "One star forever",
    "Earn a single wanted star, then see how long you can keep it without it getting any worse.",
    "Mouth off at a police car to earn one star, then keep driving around without escalating it.",
    ["No hitting cops, no shooting, no crashing into them.", "Bank your cash first just in case."],
    ["police", "chaos"],
    [cite(GR_HONK, "Trash-talking police gives a one-star wanted level.")],
    [5, 20],
  ),
  idea(
    "idea-tow-truck-taxi",
    "Tow-truck taxi service",
    "Grab a tow truck and 'rescue' parked cars all over town, whether their owners like it or not.",
    "Hook a parked car, drag it somewhere absurd (a beach, a rooftop car park, the middle of a highway) and go get another.",
    ["Impound lots are the easiest place to find a tow truck.", "Lower the hook until it latches, then drive off slowly."],
    ["funny", "physics"],
    [cite(GR_ATM, "Tow trucks can hook objects and drag them; impound lots are a reliable source of tow trucks.")],
    [10, 20],
  ),
  idea(
    "idea-sea-push",
    "Into the sea",
    "Find a parked car near the water and push it in by hand. No engine allowed.",
    "Walk into a car and hold to shove it. Line it up with a ramp, dock or beach and keep pushing.",
    ["Downhill helps a lot.", "Pick a car nobody's sitting in."],
    ["physics", "funny"],
    [cite(PCG_HIDDEN, "You can push vehicles by walking into them and holding the button.")],
    [5, 10],
  ),
  idea(
    "idea-no-brakes",
    "No-brakes beach run",
    "Drive from your front door to the nearest beach without touching the brake once.",
    "Pick any car, take a deep breath, and only steer and lift off the gas.",
    ["Turn on Reduced Vehicle Damage first if you want the car to survive.", "Try it again on a motorbike."],
    ["stunt"],
    [cite(PS_TIPS, "The Reduced Vehicle Damage setting exists and doesn't disable trophies.")],
    [5, 10],
  ),
  idea(
    "idea-highest-skydive",
    "Highest skydive in Leonida",
    "Climb a small plane as high as it will go, step out, and parachute down.",
    "Buy a parachute first, borrow a plane from an airfield, climb until it won't go any higher, then bail.",
    ["Parachutes are sold at gun stores under Equipment.", "Planes need fuel, so don't wait around on the runway.", "Try to land on a rooftop."],
    ["stunt"],
    [cite(PPX_PARA, "Parachutes are sold at Ammu-Nation as equipment."), cite(PPX_AIR, "Planes and helicopters spawn at airfields.")],
    [10, 15],
  ),
  idea(
    "idea-fighter-jet",
    "Borrow a fighter jet",
    "There's a military jet sitting at the air station. Take it for a spin and see how long you last.",
    "Head to the military air station in Mariana County, get into the jet, and get airborne fast.",
    ["Expect a four-star response and company in the sky.", "Bank your cash first.", "This one isn't a trophy. It's just chaos."],
    ["chaos", "stunt"],
    [cite(PPX_JET, "A fighter jet can be stolen at Mile Zero Air Station; it brings four stars and pursuing jets.")],
    [5, 15],
  ),
  idea(
    "idea-ugliest-car",
    "Ugliest car in Leonida",
    "Find the saddest, most beaten-up car on the street and give it the most ridiculous makeover a mod shop allows.",
    "Grab a wreck, take it to a mod shop, and pick every clashing option you can find.",
    ["There are mod shops all over the map, and each specializes in different vehicles.", "Bonus: drive it to the fanciest street you know and park it there."],
    ["funny"],
    [cite(PPX_MOD, "There are 14 mod shops, specialized by vehicle type.")],
    [10, 20],
  ),
  idea(
    "idea-coast-without-cars",
    "Coast to coast, no cars",
    "Cross the map without ever getting into a car: only boats, bikes, swimming and your own two feet.",
    "Pick a start and finish on opposite sides of the map and improvise.",
    ["Dirt bikes can be rented at the mud-racing club.", "If you swim out far enough, you may get some unexpected help."],
    ["stunt"],
    [cite(PPX_RACES, "The Mud Club rents dirt bikes for its races."), cite(PCG_HIDDEN, "Boats can be left cruising with the engine running.")],
    [30, 60],
  ),
  idea(
    "idea-golden-hour",
    "Golden hour tour",
    "Find the most beautiful evening view in Leonida and just sit there.",
    "Head to a dock or pool edge in the evening and use Rest to sit and dip your feet.",
    ["Hold Circle/B to Rest.", "Try it from a different coast every in-game evening."],
    ["funny"],
    [cite(PCG_HIDDEN, "The Rest action lets you sit at pool edges and docks.")],
    [5, 10],
  ),
  idea(
    "idea-escape-on-foot",
    "Lose them on foot",
    "Get a two-star wanted level and shake it without using any vehicle.",
    "Earn two stars, then lose the police using only alleys, rooftops, water and luck.",
    ["Water is your friend.", "Bank your cash first."],
    ["police", "chaos"],
    [cite(GR_HONK, "Wanted levels can be earned in free roam (e.g. by provoking police).")],
    [5, 15],
  ),
];
