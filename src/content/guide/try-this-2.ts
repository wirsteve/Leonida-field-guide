import "server-only";
import type { GuideRecord, Requirement, SourceEvidence } from "@/contracts";
import { CH1_LAST } from "./story";
import { REVIEWED, cite } from "./sources";

/**
 * "Try this", pass 2: more post-launch community discoveries (researched
 * 2026-11-21; docs/research/restricted/VIRAL_STUNTS_2.md). Surprises stay out
 * of titles and summaries; the punchline is what you find when you go.
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const SNIP = "Search-result snippet only; page not fetched.";
const G8_EGGS = src("https://game8.co/games/GTA-6/archives/638651", "Game8", "All Easter Eggs and Secrets");
const PCG_HIDDEN = src("https://www.pcgamer.com/games/grand-theft-auto/15-hidden-gta-6-controls-and-features-you-should-know-about/", "PC Gamer", "15 hidden GTA 6 controls and features");
const PCG_COZY = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-is-a-cozy-game/", "PC Gamer", "GTA 6 is a cozy game");
const PCG_CLUB = src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-strip-club-locations/", "PC Gamer", "GTA 6 strip club locations");
const PPX_TIPS = src("https://www.powerpyx.com/gta-6-tips-tricks", "PowerPyx", "GTA 6 Tips & Tricks");
const GRA_MOVIES = src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-is-a-movie-and-tv-goldmine-as-players-discover-everything-from-fast-and-furious-cars-to-dexters-apartment/", "GamesRadar+", "GTA 6 is a movie and TV goldmine");
const KOTAKU = src("https://kotaku.com/18-coolest-details-players-have-spotted-in-gta-6-so-far-2000758435", "Kotaku", "18 coolest details players have spotted");

type Level = "high" | "medium" | "low";
const RATING = {
  high: { confidence: "high" as const, verification: "verified" as const },
  medium: { confidence: "medium" as const, verification: "verified" as const },
  low: { confidence: "low" as const, verification: "partial" as const },
};

function find(
  id: string,
  level: Level,
  evidence: SourceEvidence[],
  pub: { name: string; summary: string; guidance: string; tips: string[]; tags: string[]; area?: string; minutes?: [number, number] },
  opts: { visibleWhen?: Requirement; surprise?: string } = {},
): GuideRecord {
  return {
    id,
    kind: "activity",
    visibleWhen: opts.visibleWhen ?? { completed: CH1_LAST },
    missable: "no",
    public: {
      name: pub.name,
      aliases: [],
      summary: pub.summary,
      guidance: pub.guidance,
      tips: pub.tips,
      tags: ["try-this", ...pub.tags],
      area: pub.area,
      estimatedMinutes: pub.minutes ? { min: pub.minutes[0], max: pub.minutes[1] } : undefined,
      uniqueExperience: true,
      officialCompletion: "no",
      timing: "anytime",
    },
    restricted: opts.surprise ? { notes: `Surprise: ${opts.surprise}` } : {},
    evidence,
    ...RATING[level],
    lastReviewed: REVIEWED,
  };
}

export const tryThisRecords2: GuideRecord[] = [
  find("try-cryptid", "high",
    [cite(G8_EGGS, "Bigfoot eating a carcass by a swamp dirt road; follow him to an effigy in green mist."), cite(src("https://www.powerpyx.com/gta-6-bigfoot-sasquatch-easter-egg-location/", "PowerPyx", "GTA 6 Bigfoot Easter Egg Location"), "Roadside Bigfoot sighting location."), cite(src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-bigfoot-sightings-are-already-ramping-up-as-rockstar-honors-a-22-year-old-grand-theft-auto-legend/", "GamesRadar+", "GTA 6 Bigfoot sightings"), "Players report Bigfoot sightings.")],
    { name: "Something in the swamp", summary: "On a quiet swamp road there's something big and hairy having a roadside snack. Follow it.", guidance: "Drive the dirt roads south of Hamlet near Cottonmouth Lake and keep your eyes open. When you spot it, chase it on foot into the trees.", tips: ["Keep following, deeper than feels sensible.", "There's nothing to fight here. Just see where it leads."], tags: ["hidden", "wildlife"], minutes: [10, 20] },
    { surprise: "Bigfoot; an effigy in green mist knocks you out and you wake by the lake." }),
  find("try-yard-sale", "high",
    [cite(src("https://www.pcgamer.com/games/grand-theft-auto/arthur-morgan-hat-location-rdr2/", "PC Gamer", "Arthur Morgan hat location"), "A $5 'Genuine Cowboy Hat' at a southern Port Gellhorn yard sale is Arthur Morgan's hat."), cite(G8_EGGS, "Same yard-sale hat.")],
    { name: "Yard-sale treasure", summary: "Somebody's selling junk off their driveway in Port Gellhorn. One item there has a history.", guidance: "Follow the balloon-tied yard-sale signs near the southern tip of Port Gellhorn, northwest of the dirt-bike mod shop, and dig around the back.", tips: ["Look on the couch at the back of the driveway.", "It costs $5. Buy it and wear it."], tags: ["hidden", "funny"], area: "port-gellhorn", minutes: [5, 10] },
    { surprise: "Arthur Morgan's RDR2 hat for $5." }),
  find("try-conspiracy-garage", "high",
    [cite(src("https://www.pcgamer.com/games/grand-theft-auto/the-5-year-long-mystery-of-the-ufo-house-has-finally-been-solved-in-gta-6-but-one-npc-knows-too-much/", "PC Gamer", "The mystery of the UFO house solved"), "A Belville bungalow garage has a red-string 'IT'S A SIMULATION' wall."), cite(src("https://www.dexerto.com/gta/gta-6-screenshot-hidden-in-san-andreas-back-in-2021-was-real-and-the-house-has-a-dark-secret-3429837/", "Dexerto", "The house has a dark secret"), "Same garage.", SNIP)],
    { name: "The man who knows too much", summary: "A modest bungalow in Belville with two palm trees out front has something odd in its garage.", guidance: "Go in daylight, find the cream bungalow with two front-yard palms in Belville, and get a look inside the garage.", tips: ["Getting in may count as trespassing. Bank your cash first.", "Read the papers lying around."], tags: ["hidden"], minutes: [10, 20] },
    { surprise: "A resident has figured out he's in a simulation (red-string wall, boat brochures)." }),
  find("try-familiar-apartment", "high",
    [cite(G8_EGGS, "Dexter Morgan's apartment on Washington Island with his tools on the roof."), cite(GRA_MOVIES, "Players found Dexter's apartment.")],
    { name: "A very familiar apartment", summary: "A second-floor flat on Washington Island will look familiar to TV fans. Check the roof too.", guidance: "Head to Washington Island in Vice Beach, near the Pay 'n' Spray and the drone-race icon, look around the second floor, then climb up.", tips: ["Don't skip the roof."], tags: ["hidden"], minutes: [10, 15] },
    { surprise: "Dexter Morgan's apartment; his tools are on the roof." }),
  find("try-movie-car", "high",
    [cite(GRA_MOVIES, "A villa garage on Vespucci Island holds Brian O'Conner's 1995 Eclipse."), cite(G8_EGGS, "Same movie car.")],
    { name: "Movie-car garage heist", summary: "A villa garage on Vespucci Island is hiding a car that film fans will know instantly.", guidance: "Get to the villa on Vespucci Island, break into the garage and drive it off.", tips: ["Breaking in can draw the police.", "Register it at a Pay 'n' Spray if you want to keep it."], tags: ["heist", "hidden"], minutes: [10, 20] },
    { surprise: "Brian O'Conner's Eclipse from The Fast and the Furious." }),
  find("try-80s-radio", "high",
    [cite(src("https://www.pcgamer.com/games/grand-theft-auto/yes-youre-hearing-weird-al-yankovic-hosting-a-radio-station-in-gta-6/", "PC Gamer", "Weird Al hosts a radio station"), "Weird Al co-hosts Vice City FM and voices ads."), cite(G8_EGGS, "Same radio cameo.")],
    { name: "Listen to the '80s DJ", summary: "The host on the non-stop '80s station is someone you may recognize. Listen to the ads too.", guidance: "Tune any car radio to Vice City FM and actually listen to the chatter and the burger ads.", tips: ["Earbuds from the gadget store let you listen on foot."], tags: ["hidden", "funny"], minutes: [5, 15] },
    { surprise: "'Weird Al' Yankovic, with Brigitte Nielsen; he wrote and voices some ads." }),
  find("try-incognito", "high",
    [cite(PCG_HIDDEN, "Masks and accessories make you harder to recognize; you can duck below the dash."), cite(PPX_TIPS, "Disguise and ducking tips.")],
    { name: "Incognito getaway", summary: "Put on a mask, commit a small crime, and try to slip right past a patrol car.", guidance: "Buy a mask and wear it over your face, get in a car after a crime, and hold Circle/B to duck as the police search.", tips: ["Masks are sold at most gun stores.", "Bandanas, glasses and hats help too.", "Bank your cash first."], tags: ["police", "chaos"], minutes: [5, 15] }),
  find("try-skeeters", "medium",
    [cite(src("https://gamerant.com/gta-6-south-park-easter-egg/", "Game Rant", "GTA 6 South Park easter egg"), "Fans think Skeeter's in southern Hamlet nods to South Park.")],
    { name: "A bar from a cartoon town?", summary: "There's a dive bar in southern Hamlet that animation fans think they recognize.", guidance: "Find Skeeter's in southern Hamlet and read its in-game description. Decide for yourself.", tips: ["This is a fan theory, not confirmed."], tags: ["hidden"], minutes: [5, 10] }),
  find("try-bulk-up", "medium",
    [cite(src("https://www.gamesradar.com/games/grand-theft-auto/gta-6-players-confirm-true-fat-jason-and-max-weight-lucia-arent-very-fat-at-all-setting-the-stage-for-the-first-pc-mod-to-super-size-them/", "GamesRadar+", "True Fat Jason"), "Players hit the max weight by eating fast food and skipping workouts.")],
    { name: "The fast-food bulk", summary: "How heavy can your character get? Eat junk, skip the gym, and find out.", guidance: "Eat several burgers or tacos, sleep, repeat, and avoid working out.", tips: ["Try it on a spare save. It may affect your stats.", "A loading screen seems to make the change show up."], tags: ["funny"], minutes: [15, 30] },
    { surprise: "Max weight turns out to be surprisingly modest." }),
  find("try-basketball-brawl", "medium",
    [cite(PCG_COZY, "A PC Gamer writer used a basketball in a fistfight.")],
    { name: "Basketball brawl", summary: "Can a basketball win a street fight? Find out.", guidance: "Grab a loose ball at a court and use it next time things get physical.", tips: ["The exact button isn't documented. Experiment.", "Fights can bring police."], tags: ["funny", "chaos"], minutes: [5, 10] }),
  find("try-cop-truck", "medium",
    [cite(src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-free-guns-cop-cars/", "PC Gamer", "GTA 6 free guns from cop cars"), "Unattended police pickups have an unalarmed crate with weapons.")],
    { name: "Raid the cop truck", summary: "Police pickups parked without their officers have something worth checking in the back.", guidance: "Find an unattended police pickup truck, climb onto the bed and open the crate.", tips: ["Pickups have no alarm. Regular cruisers do.", "Only do it with no officers watching."], tags: ["police", "heist"], minutes: [5, 10] }),
  find("try-rail-escape", "medium",
    [cite(PPX_TIPS, "Police rarely spawn along wilderness rail lines; use them to escape.")],
    { name: "Escape by rail", summary: "When the helicopters show up, leave the roads and follow the train tracks out.", guidance: "Get a fast bike, earn some heat, then ride the rail lines out of the search area.", tips: ["Southwest Vice City and the tunnel north of Ambrosia are good routes.", "Bank your cash first."], tags: ["police", "stunt"], minutes: [5, 15] }),
  find("try-earbuds", "medium",
    [cite(PCG_HIDDEN, "Earbuds from Zeke's Gadgets (~$150) let you play radio on foot.")],
    { name: "Walking soundtrack", summary: "Buy earbuds and stroll the beach with your favorite station playing.", guidance: "Pick up earbuds at the gadget store (about $150), equip them from the item wheel and go for a walk.", tips: ["They come in different colors."], tags: ["funny"], minutes: [5, 10] }),
  find("try-seaplane-dash", "medium",
    [cite(src("https://www.pcgamer.com/games/grand-theft-auto/gta-6-how-long-to-fly-across-map/", "PC Gamer", "How long to fly across the GTA 6 map"), "Flew south to north in a seaplane in about 4 min 18 s.")],
    { name: "Seaplane speed run", summary: "Fly from the very south of the map to the very north and beat about 4 minutes 18 seconds.", guidance: "Borrow a seaplane, line up in the far south, and fly straight north with a timer running.", tips: ["Stay away from the military base unless you want four stars.", "Bring a parachute. Planes need fuel."], tags: ["stunt"], minutes: [10, 15] }),
  find("try-tv-night", "medium",
    [cite(src("https://www.gtabase.com/gta-6/articles/all-activities-in-jasons-house-in-gta-6", "GTABase", "All activities in Jason's house"), "Safehouse TVs show shows, ads and music videos."), cite(src("https://esports.gg/news/grand-theft-auto-6/gta-6-eager-beaver-and-furry-psa-leave-timthetatman-cackling/", "esports.gg", "Eager Beaver and furry PSA"), "Streamers laughing at TV ads.", SNIP)],
    { name: "Couch-potato hour", summary: "Leonida's TV is full of satire. Sit down and flip channels.", guidance: "At your safehouse, sit on the couch, turn on the TV and channel-surf.", tips: ["The ad breaks are half the fun."], tags: ["funny"], minutes: [10, 20] }),
  find("try-delights", "medium",
    [cite(PCG_CLUB, "Delights in Port Gellhorn: pool, drinks, dancers with comments; odd scenes outside.")],
    { name: "A night at Delights", summary: "The roughest club in Leonida is right in Port Gellhorn. Shoot some pool and listen.", guidance: "Find the Delights billboard in Port Gellhorn, go in, play pool and buy a drink.", tips: ["Pay attention to what people say to you.", "Keep an eye on the parking lot outside."], tags: ["funny"], area: "port-gellhorn", minutes: [10, 20] }),
  find("try-florida-man-bingo", "medium",
    [cite(PCG_COZY, "Writers ran into strange roadside scenes while cruising."), cite(PCG_CLUB, "A granny on a mobility scooter mugging someone outside.")],
    { name: "Florida Man bingo", summary: "Spend an evening just cruising and stopping for every strange thing you see.", guidance: "Turn off your waypoint, drive slowly through drive-thrus and strip-mall lots, and stop whenever something weird is happening.", tips: ["Score a point for every scene you'd text a friend about.", "Step in if you're feeling heroic, or don't."], tags: ["funny"], minutes: [20, 40] }),
  find("try-fox-suit", "low",
    [cite(src("https://www.dexerto.com/gta/gta-6-outlaws-furries-and-lets-you-help-them-escape-the-cops-3429724/", "Dexerto", "GTA 6 lets you help them escape the cops"), "A man in a costume fleeing police; you can help.", SNIP), cite(src("https://www.thepinknews.com/2026/11/19/gta-6-furry-law/", "PinkNews", "GTA 6 furry law"), "In-world law coverage.", SNIP)],
    { name: "Night-time fugitive", summary: "At night, watch for a police helicopter spotlighting someone in an unusual outfit. Help or watch?", guidance: "Cruise at night and look for a chopper spotlight on a pedestrian. Decide whose side you're on.", tips: ["Breaking a police blockade earns a wanted level.", "Check the in-game news afterwards."], tags: ["police", "funny"], minutes: [10, 30] }),
  find("try-dont-scope", "low",
    [cite(src("https://www.gamingbible.com/news/gta-6-easter-eggs-778903-20261120", "GamingBible", "GTA 6 easter eggs"), "Players report a scoped NPC appearing behind them.", SNIP)],
    { name: "Don't stare too long", summary: "At night, watch a lone stranger through a sniper scope. Keep watching.", guidance: "With a sniper rifle, at night, aim at a distant pedestrian and don't look away.", tips: ["Nobody knows yet whether this is intentional.", "Bank your cash first."], tags: ["hidden"], minutes: [5, 10] },
    { surprise: "The NPC may seem invincible and appear behind you." }),
  find("try-lizard-toss", "low",
    [cite(KOTAKU, "You can throw lizards and trash at people.", SNIP)],
    { name: "Lizard toss", summary: "Pick up something small and wriggly off the sidewalk and see who you can hit with it.", guidance: "Look for lizards or loose trash on the street, pick one up and throw it at a passer-by.", tips: ["They may fight back."], tags: ["funny", "chaos"], minutes: [2, 5] }),
  find("try-holster", "low",
    [cite(src("https://www.techradar.com/live/news/gta-6-launch-day-november-19", "TechRadar", "GTA 6 launch day live blog"), "Putting guns away may calm police.", SNIP)],
    { name: "Holster and chill", summary: "In a standoff with police, put your gun away instead of shooting and see how they react.", guidance: "When officers confront you, holster your weapon and don't make sudden moves.", tips: ["Long guns can't be hidden. Keep them in your trunk.", "Surrendering counts as busted. Bank your cash first."], tags: ["police"], minutes: [2, 5] }),
];
