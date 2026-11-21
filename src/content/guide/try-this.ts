import "server-only";
import type { Confidence, GuideRecord, PublicContent, SourceKind, VerificationStatus } from "@/contracts";
import { CH1_LAST } from "./story";
import { REVIEWED, cite } from "./sources";

/**
 * "Try this": viral, community-discovered sandbox fun (player request).
 * Not missions, not trophies, not 100% items. Each stunt was checked against
 * the PowerPyx trophy/100% guide. Research: docs/research/restricted/VIRAL_STUNTS.md.
 * Surprises keep their punchline out of the title and summary.
 */

const page = (url: string, publisher: string, title: string, kind: SourceKind = "guide-site") => ({ url, publisher, title, kind });

const GR_ATM = page("https://gamerant.com/gta-6-atm-find-use-rob/", "Game Rant", "How to Find, Use, and Rob ATMs in GTA 6");
const ALTCHAR_ATM = page("https://www.altchar.com/guides/grand-theft-auto-6-how-to-rob-atms-by-ripping-them-out-of-the-wall-a4oUP6r4ZR5m", "Alt Char", "How to Rob ATMs by Ripping Them Out of the Wall");
const PCG_FP = page("https://www.pcgamer.com/games/grand-theft-auto/gta-6-is-playable-in-first-person-heres-how-to-activate-it/", "PC Gamer", "GTA 6 is playable in first-person");
const GRA_FP = page("https://www.gamesradar.com/games/grand-theft-auto/gta-6-glitch-adds-the-first-person-mode-that-rockstar-skipped/", "GamesRadar+", "GTA 6 glitch adds first-person mode");
const G8_EGGS = page("https://game8.co/games/GTA-6/archives/638651", "Game8", "All Easter Eggs and Secrets");
const PCG_SHAKES = page("https://www.pcgamer.com/games/grand-theft-auto/befuddled-japanese-player-fights-gta-6-controls-loses-becomes-guy-chugging-two-shakes-i-accidentally-bought-while-walking-around-in-a-squat/", "PC Gamer", "Befuddled player becomes guy chugging two shakes");
const GR_HONK = page("https://gamerant.com/gta-6-how-honk-flip-people-off/", "Game Rant", "How to Honk and Trash Talk While Driving in GTA 6");
const PCG_HIDDEN = page("https://www.pcgamer.com/games/grand-theft-auto/15-hidden-gta-6-controls-and-features-you-should-know-about/", "PC Gamer", "15 hidden GTA 6 controls and features");
const GS_CATS = page("https://www.gamespot.com/articles/jason-loves-cats-in-gta-6-but-not-all-of-them/", "GameSpot", "Jason Loves Cats In GTA 6, But Not All Of Them");
const KOTAKU_ANIMALS = page("https://kotaku.com/grand-theft-auto-6-gta6-cats-dogs-snake-pet-alligator-2000758120", "Kotaku", "GTA 6 animal clips roundup");
const VICE_ANIMALS = page("https://www.vice.com/en/article/6-wild-animal-encounters-in-gta-6-that-you-have-to-see-to-believe/", "Vice", "6 Wild Animal Encounters in GTA 6");
const PPX_TIPS = page("https://www.powerpyx.com/gta-6-tips-tricks", "PowerPyx", "GTA 6 Tips & Tricks");
const PCG_PLANES = page("https://www.pcgamer.com/games/grand-theft-auto/fact-check-does-gta-6-stop-players-from-shooting-inside-gay-nightclubs-and-crashing-planes-into-buildings/", "PC Gamer", "Fact check: crashing planes into buildings");
const PS_TIPS = page("https://www.pushsquare.com/guides/gta-6-tips-and-tricks-you-need-to-know", "Push Square", "GTA 6: Tips & Tricks You Need to Know");
const GR_EGG = page("https://gamerant.com/where-find-gta-6-literal-easter-egg/", "Game Rant", "Where to Find The Literal Easter Egg in GTA 6");
const SNIPPET = "Search-result snippet only; page not fetched.";

function stunt(
  id: string,
  rating: { confidence: Confidence; verification: VerificationStatus },
  evidence: GuideRecord["evidence"],
  content: Pick<PublicContent, "name" | "summary" | "guidance" | "tips"> & { tags: string[]; area?: string; minutes?: [number, number] },
  notes?: string,
): GuideRecord {
  return {
    id,
    kind: "activity",
    visibleWhen: { completed: CH1_LAST },
    missable: "no",
    public: {
      name: content.name,
      aliases: [],
      summary: content.summary,
      guidance: content.guidance,
      tips: content.tips,
      tags: ["try-this", ...content.tags],
      area: content.area,
      estimatedMinutes: content.minutes ? { min: content.minutes[0], max: content.minutes[1] } : undefined,
      uniqueExperience: true,
      officialCompletion: "no",
      timing: "anytime",
    },
    restricted: notes ? { notes } : {},
    evidence,
    ...rating,
    lastReviewed: REVIEWED,
  };
}

const high = { confidence: "high" as const, verification: "verified" as const };
const medium = { confidence: "medium" as const, verification: "verified" as const };
const low = { confidence: "low" as const, verification: "partial" as const };

export const tryThisRecords: GuideRecord[] = [
  stunt(
    "try-atm-yank",
    medium,
    [
      cite(GR_ATM, "Outdoor ATMs can be hooked with a tow truck and torn out of the wall; free-roam towing works now; police respond immediately."),
      cite(ALTCHAR_ATM, "Rip ATMs out of the wall with a tow truck.", SNIPPET),
    ],
    {
      name: "ATM Yank",
      summary: "Hook a tow truck to an outdoor ATM and drag the whole machine off down the street.",
      guidance: "Grab a tow truck, back it up to an outdoor ATM, latch the hook and floor it.",
      tips: [
        "Impound lots are the easiest place to find a tow truck.",
        "Only outdoor ATMs come loose. The phone's ATM finder marks the nearest one.",
        "Back up until you're flush, lower the hook until it latches, then drive away hard.",
        "The cops come the moment it leaves the wall. Bank your cash first.",
      ],
      tags: ["chaos", "heist"],
      area: "port-gellhorn",
      minutes: [5, 15],
    },
    "Unconfirmed whether free-roam ATM pulls count toward any completion category.",
  ),
  stunt(
    "try-first-person",
    high,
    [
      cite(PCG_FP, "A controller-mapping and phone trick locks the camera into a working first-person view; reload a save to exit."),
      cite(GRA_FP, "Same first-person camera glitch confirmed."),
    ],
    {
      name: "Secret first-person mode",
      summary: "There's no official first-person view, but a camera trick locks you into one you can drive, run and shoot in.",
      guidance: "Map the touch pad (or View button) to Camera, pull out your phone in a car, put it away and tap the button quickly.",
      tips: [
        "Settings → Controller: set Touch Pad (PS5) or View (Xbox) to the Camera function.",
        "It can take a few tries to catch the timing.",
        "Save and reload to get back to the normal camera.",
      ],
      tags: ["hidden"],
      minutes: [2, 5],
    },
  ),
  stunt(
    "try-lost-at-sea",
    high,
    [
      cite(G8_EGGS, "Swim far offshore and a dog on a jet ski arrives to carry you back to the beach.", "Page contains late-story spoilers; never link it."),
      cite(PCG_SHAKES, "Launch roundup mentions riding a jet ski with a dog."),
    ],
    {
      name: "Lost at sea",
      summary: "Swim way, way out to sea and wait. Someone very good comes to help.",
      guidance: "Head out from any beach into open water and keep going until you hear something.",
      tips: ["Listen for barking.", "Go along for the ride. It's worth it."],
      tags: ["funny", "wildlife"],
      minutes: [5, 10],
    },
  ),
  stunt(
    "try-honk-rage",
    high,
    [
      cite(GR_HONK, "Honk and trash-talk other drivers; some respond, some fight; insulting police earns a wanted star."),
      cite(PCG_HIDDEN, "Drive-by trash talk and flipping people off are hidden controls."),
    ],
    {
      name: "Honk rage",
      summary: "Lean on the horn and trash-talk other drivers. Some apologize, some swear back, some get out swinging.",
      guidance: "Hold L3 to honk, tap R3 (PS5) or R (Xbox) to mouth off at a driver beside you.",
      tips: [
        "On foot, hold L2/LT and press R1/RB to flip someone off.",
        "Mouthing off at the police earns a wanted star.",
        "Each driver only puts up with so much before they stop reacting.",
      ],
      tags: ["funny", "chaos"],
      minutes: [2, 10],
    },
  ),
  stunt(
    "try-plane-pinball",
    high,
    [
      cite(PCG_PLANES, "Launch clips of planes bouncing off buildings come from the Reduced Vehicle Damage setting."),
      cite(PS_TIPS, "Reduced Vehicle Damage does not disable trophies or change the story."),
    ],
    {
      name: "Plane pinball",
      summary: "Those viral clips of planes bouncing off skyscrapers are real. There's a setting for it.",
      guidance: "Turn on Settings → Gameplay → Reduced Vehicle Damage, take a small plane, and go bounce off the skyline.",
      tips: [
        "The setting doesn't disable trophies, but turn it back off for normal play.",
        "Stick to small planes from local airfields. Airports bring the police.",
        "Planes need fuel.",
      ],
      tags: ["stunt", "physics"],
      minutes: [10, 20],
    },
  ),
  stunt(
    "try-tower-climb",
    high,
    [
      cite(GR_EGG, "Climb the big red-and-white comms tower (about 5–8 minutes); a nest of painted eggs is at the top; throwing one triggers a gag."),
      cite(G8_EGGS, "Same tower easter egg described.", "Page contains late-story spoilers; never link it."),
    ],
    {
      name: "Climb the big radio tower",
      summary: "A giant red-and-white communications tower hides a little surprise at the very top. Throw what you find.",
      guidance: "Hop the fence, hold sprint to climb faster, and look around the top platform.",
      tips: [
        "It's a long climb, five to eight minutes.",
        "Bring a parachute for the trip down.",
        "If someone's filming up there, you may not be able to jump.",
      ],
      tags: ["hidden", "funny"],
      minutes: [10, 15],
    },
  ),
  stunt(
    "try-door-prize",
    medium,
    [cite(PPX_TIPS, "You can hit pedestrians with your car door while driving, or kick them from a bike.")],
    {
      name: "Door prize",
      summary: "Swing your car door into pedestrians as you roll past, or kick them off the sidewalk from a bike.",
      guidance: "Drive slowly beside someone and press the door prompt shown on screen.",
      tips: ["It's assault, so expect a wanted level.", "Lots of violence makes the police more trigger-happy with you."],
      tags: ["chaos", "physics"],
      minutes: [2, 5],
    },
  ),
  stunt(
    "try-raccoon-mode",
    medium,
    [
      cite(PCG_SHAKES, "A player went viral crouch-walking around a parking lot drinking two shakes bought by accident."),
      cite(PCG_HIDDEN, "The Rest action lets you sit at pool edges and docks."),
    ],
    {
      name: "Raccoon mode",
      summary: "Recreate the launch-night meme: two shakes, a crouch-waddle and a dark parking lot.",
      guidance: "Buy two shakes at a convenience store, crouch, and waddle out into the night drinking them.",
      tips: ["Hold Circle/B to Rest. It's great at a pool edge or dock."],
      tags: ["funny"],
      minutes: [2, 5],
    },
  ),
  stunt(
    "try-ghost-ship",
    medium,
    [cite(PCG_HIDDEN, "You can push vehicles by walking into them; double-tapping exit leaves the engine running, reportedly on boats too.")],
    {
      name: "Ghost ship",
      summary: "Step away from a moving boat's controls and stroll the deck while it keeps cruising.",
      guidance: "Get a boat moving, double-tap Triangle/Y to leave the helm, then walk around.",
      tips: [
        "Aim it at open water first.",
        "You can also shove parked cars and beached boats by walking into them.",
        "The boat part is less confirmed than the car push.",
      ],
      tags: ["physics", "funny"],
      minutes: [5, 10],
    },
  ),
  stunt(
    "try-cat-roulette",
    low,
    [
      cite(GS_CATS, "A cat in a stolen car can attack the driver mid-drive.", SNIPPET),
      cite(KOTAKU_ANIMALS, "Viral cat-in-car clip.", SNIPPET),
      cite(VICE_ANIMALS, "Cat encounters in cars.", SNIPPET),
    ],
    {
      name: "Cat roulette",
      summary: "Steal a car with a cat inside and see how your passenger feels about it.",
      guidance: "Spot a car with a cat in it, take it, and drive. Be nicer to the cat than the viral clip was.",
      tips: ["Reportedly a prompt lets you calm things down, then you can pull over and let it out."],
      tags: ["funny", "wildlife"],
    },
  ),
  stunt(
    "try-gator",
    low,
    [cite(KOTAKU_ANIMALS, "Streamers were attacked and dragged under by alligators at swamp edges.", SNIPPET), cite(VICE_ANIMALS, "Alligator encounters.", SNIPPET)],
    {
      name: "Don't poke the gator",
      summary: "How close can you get to a basking alligator before it decides you're lunch?",
      guidance: "Find a swampy lake edge outside town and creep closer. Have an escape route.",
      tips: ["Bank your cash first. Getting wasted costs you what's in your pocket."],
      tags: ["wildlife", "chaos"],
      minutes: [5, 10],
    },
  ),
];
