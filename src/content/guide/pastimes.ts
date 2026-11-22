import "server-only";
import type { GuideRecord, SourceEvidence, Tri } from "@/contracts";
import { CH1_LAST } from "./story";
import { REVIEWED, cite } from "./sources";

/**
 * Pastimes: classic leisure activities (researched 2026-11-22; research:
 * docs/research/restricted/PASTIMES.md). Locations nearest Port Gellhorn
 * first. Places that double as later story locations are described generically.
 */

const src = (url: string, publisher: string, title: string) => ({ url, publisher, title, kind: "guide-site" as const });
const P = (slug: string, title: string) => src(`https://www.powerpyx.com/${slug}/`, "PowerPyx", title);
const G8 = (id: number, title: string) => src(`https://game8.co/games/GTA-6/archives/${id}`, "Game8", title);
const PPX_100 = P("gta-6-100-completion-checklist-guide", "GTA 6 100% Completion Checklist");
const PPX_STATS = P("gta-6-how-to-increase-character-stats-health-cardio-focus", "GTA 6 How to Increase Character Stats");
const PPX_CHAL = P("gta-6-all-challenges-guide", "GTA 6 All Challenges");

function pastime(
  id: string,
  name: string,
  copy: { summary: string; guidance: string; tips: string[] },
  meta: { tags: string[]; official: Tri; area?: string; minutes?: [number, number]; level?: "high" | "medium" },
  evidence: SourceEvidence[],
): GuideRecord {
  return {
    id,
    kind: "activity",
    // Shown from Chapter 2: the copy names places that are new to the player there.
    visibleWhen: { completed: CH1_LAST },
    missable: "no",
    public: {
      name,
      aliases: [],
      summary: copy.summary,
      guidance: copy.guidance,
      tips: copy.tips,
      tags: ["pastime", ...meta.tags, ...(meta.official === "yes" ? ["100%"] : [])],
      area: meta.area,
      estimatedMinutes: meta.minutes ? { min: meta.minutes[0], max: meta.minutes[1] } : undefined,
      uniqueExperience: false,
      officialCompletion: meta.official,
      timing: "anytime",
    },
    restricted: {},
    evidence,
    // High only where two publishers agree (set per item); otherwise medium.
    confidence: meta.level ?? "medium",
    verification: "verified",
    lastReviewed: REVIEWED,
  };
}

export const pastimes: GuideRecord[] = [
  pastime("pastime-shooting-range", "Hit the shooting range",
    { summary: "Timed and score-attack target challenges for bronze, silver and gold medals.", guidance: "Rodgers Ranch, on the north-east edge of Port Gellhorn, is right on your doorstep. Buy the $5 waiver pass and pick a challenge.", tips: ["Every challenge you finish or quit permanently raises your Focus bar. The quick Market Range beginner run is a cheap way to farm it.", "Don't own the right gun? Rent one for $10.", "The other range, in north-west Vice City, is a run-and-gun obstacle course."] },
    { tags: ["sport"], official: "yes", area: "port-gellhorn", minutes: [5, 20] },
    [cite(P("gta-6-all-shooting-range-gold-medal-challenges", "GTA 6 All Shooting Range Challenges"), "Rodgers Ranch near Port Gellhorn and Griffin in Vice City; $5 waiver, $10 rental; 42 golds."), cite(PPX_STATS, "Range challenges raise Focus permanently.")]),
  pastime("pastime-drone-races", "Race your drone",
    { summary: "Fly a racing drone through checkpoint courses against par times.", guidance: "There's a drone hub right in Port Gellhorn with three courses. Beat par on the first two to unlock the third.", tips: ["Hold the stick fully forward and just avoid crashing.", "More hubs nearby: Ambrosia and Buckskin Swamp.", "Map › Activities › Top Fun Drones shows them all."] },
    { tags: ["sport"], official: "yes", area: "port-gellhorn", minutes: [5, 15] },
    [cite(P("gta-6-all-top-fun-drone-race-time-trial-locations", "GTA 6 All Top Fun Drone Races"), "14 drone hubs, 3 trials each; Port Gellhorn hub nearby.")]),
  pastime("pastime-raceway", "Race at the raceway",
    { summary: "Organised races with entry and car-rental fees. Win, and you more than cover them.", guidance: "Gellhorn International Raceway is just south of town. Start with the introduction race to open an amateur series.", tips: ["Demolition races run at the raceway in north Ambrosia.", "Each win unlocks the next race at that venue.", "Map › Activities › Racing lists every venue."] },
    { tags: ["sport"], official: "yes", area: "kelly-county", minutes: [5, 20] },
    [cite(P("gta-6-all-unique-race-locations-racing-activities", "GTA 6 All Unique Race Locations"), "40 races; Gellhorn Raceway intro unlocks the Keep it PG series; Ambrosia demolition races.")]),
  pastime("pastime-race-challenges", "Chase race medals",
    { summary: "Solo time trials: drag strips, track runs, hill climbs and stunt runs, for medals.", guidance: "The Gellhorn raceway and dragway and the Ambrosia raceway all have trials close by.", tips: ["Gold on 10 of the 13 counts toward 100%."] },
    { tags: ["sport"], official: "yes", area: "kelly-county", minutes: [3, 10] },
    [cite(P("gta-6-all-race-challenge-locations-gold-medals", "GTA 6 All 13 Race Challenges"), "13 trials including Gellhorn and Ambrosia."), cite(PPX_100, "10 of 13 golds for 100%.")]),
  pastime("pastime-mini-golf", "Play mini golf",
    { summary: "Themed putting courses with obstacles. Fewer strokes wins.", guidance: "Dino Golf Challenge in Frogswater is the closest course. There are two more further out.", tips: ["Two of the three courses count toward 100%.", "Each course tracks your best score and holes in one."] },
    { tags: ["sport"], official: "yes", area: "kelly-county", minutes: [10, 20] },
    [cite(P("gta-6-all-golf-course-locations", "GTA 6 All Golf Course Locations"), "Three mini golf courses: Dino Golf (Frogswater), King Gator (Buckskin Swamp), Frontier (Waning Sands)."), cite(PPX_100, "2 of 3 mini golf locations for 100%.")]),
  pastime("pastime-golf", "Play a round of golf",
    { summary: "Two full golf courses with 9- and 18-hole challenges and a driving range.", guidance: "Leaf Links in Vice Beach and Mount Hailes in Waning Sands. Both are a drive from Port Gellhorn, so make a day of it.", tips: ["Golf permanently builds your Focus.", "Full courses don't count toward 100%. They're just for fun."] },
    { tags: ["sport"], official: "no", minutes: [20, 45] },
    [cite(P("gta-6-all-golf-course-locations", "GTA 6 All Golf Course Locations"), "Leaf Links (Vice Beach) and Mount Hailes (Waning Sands)."), cite(PPX_STATS, "Golf builds Focus.")]),
  pastime("pastime-pool", "Play pool",
    { summary: "Eight-ball with proper physics. Some tables have a local who'll play you for a small stake.", guidance: "The closest opponent tables are at Kowaachobee Cafe & Bar in Buckskin Swamp and at Delights in Port Gellhorn.", tips: ["Take a cue off the wall to start.", "Matches take a while, so don't start one during a timed job.", "Beat five different opponents for 100%."] },
    { tags: ["sport", "nightlife"], official: "yes", area: "kelly-county", minutes: [10, 20], level: "high" },
    [cite(P("gta-6-all-pool-opponent-locations", "GTA 6 All Pool Opponent Locations"), "17 tables, 7 opponents; Kowaachobee Cafe and Delights nearest."), cite(src("https://gamerant.com/gta-6-how-play-pool-8-ball-table/", "Game Rant", "How to play pool in GTA 6"), "Take a cue; NPC opponents for a small fee.")]),
  pastime("pastime-hoops", "Shoot some hoops",
    { summary: "A hundred basketball hoops around Leonida, each with a ball nearby.", guidance: "There's one at the trailer park in Port Gellhorn, just north of the bargain store. Pick up the ball, aim and shoot.", tips: ["L1 picks up the ball, L2 aims, R2 shoots.", "Ten in a row in under two minutes is a challenge.", "Map › Exploration › Points of Interest › Basketball Hoops shows them all."] },
    { tags: ["sport"], official: "yes", area: "port-gellhorn", minutes: [2, 10], level: "high" },
    [cite(src("https://www.pushsquare.com/guides/gta-6-basketball-hoop-locations", "Push Square", "GTA 6 Basketball Hoop Locations"), "Controls and a Port Gellhorn trailer-park hoop."), cite(PPX_CHAL, "Basketball challenges.")]),
  pastime("pastime-fishing", "Go fishing",
    { summary: "Catch-and-release fishing from docks, shores and boats: 35 species to find.", guidance: "Grab a rod from any dock or boat. Use Focus to spot fishing patches, cast, and fight the fish by pulling against it.", tips: ["Use freshwater lures in rivers and lakes and saltwater lures at sea. Bigger lures cost $45–$125.", "Stop reeling when it thrashes or the line snaps.", "Catch a 20 lb+ fish for the Big Fish challenge."] },
    { tags: ["outdoors"], official: "no", minutes: [10, 30], level: "high" },
    [cite(G8(638719, "How to Fish"), "Rods on docks and boats; Focus shows spots; reeling mechanics."), cite(src("https://www.gtabase.com/gta-6/articles/how-to-fish-in-gta-6", "GTABase", "How to fish in GTA 6"), "35 species; lure prices.")]),
  pastime("pastime-hunting", "Go hunting",
    { summary: "Track wild animals in the swamps and countryside. A clean shot pays best.", guidance: "Head into the wilder parts of the map with a rifle. Head or heart shots keep the carcass in pristine condition.", tips: ["Too many shots ruin the pelt and the payout.", "Large animals are heavy, so bring a vehicle that can carry them."] },
    { tags: ["outdoors"], official: "no", minutes: [15, 40], level: "medium" },
    [cite(PPX_100, "Clean head/heart shots keep carcasses pristine; wilderness hunting.")]),
  pastime("pastime-arcade", "Play the arcade",
    { summary: "An arcade cabinet with its own game, right outside a store in town.", guidance: "There's one outside the Bargain World clothing store in Port Gellhorn. Walk up and play.", tips: ["Playing each of the four in-game video games counts toward 100%."] },
    { tags: ["games"], official: "yes", area: "port-gellhorn", minutes: [5, 15], level: "high" },
    [cite(P("gta-6-all-video-game-locations", "GTA 6 All Video Game Locations"), "Bang For Your Buck arcade outside Bargain World, Port Gellhorn."), cite(G8(638937, "Video games"), "Four in-game video games.")]),
  pastime("pastime-meditation", "Find a quiet spot to meditate",
    { summary: "Peaceful spots around Leonida where you can sit and clear your head.", guidance: "Three are nearby: a swamp dock in Buckskin Swamp, a river bank at Camp Moonflower, and a spot where the tracks cross the highway in Manifest Canyon.", tips: ["Each character counts separately.", "Look for the purple icon, or use Map › Exploration › Meditate Around Leonida."] },
    { tags: ["outdoors"], official: "yes", area: "kelly-county", minutes: [3, 5] },
    [cite(P("gta-6-all-meditation-spot-locations", "GTA 6 All Meditation Spots"), "Kelly County spots: Buckskin Swamp, Camp Moonflower, Manifest Canyon.")]),
  pastime("pastime-gym", "Hit the gym",
    { summary: "Strength and cardio workouts that change your body and raise your health and stamina.", guidance: "The gyms are in Vice City. A cheap membership starts around $250, and there's a free outdoor gym on the beach.", tips: ["Finish the day's workout (about three exercises) or the gains don't stick.", "Working out together counts for both characters.", "Running, cycling and swimming also build cardio for free."] },
    { tags: ["fitness"], official: "no", minutes: [10, 20], level: "high" },
    [cite(G8(639273, "Gym locations"), "Nine gyms in Vice City with membership prices; a free beach gym."), cite(PPX_STATS, "Workouts raise health and stamina.")]),
  pastime("pastime-bars", "Bar crawl",
    { summary: "About 120 bars across the map. Have a drink, tip the bartender, see how wobbly you get.", guidance: "Near you: The Hog House Bar, Anakala Sam's, Home Bar and the Paradise Wines vineyard bar.", tips: ["Around three drinks gets you tipsy. Sleep it off.", "Don't drive drunk unless you enjoy chaos.", "Map › Food & Drink › Bars."] },
    { tags: ["nightlife"], official: "no", area: "kelly-county", minutes: [10, 30], level: "high" },
    [cite(P("gta-6-all-bar-locations", "GTA 6 All Bar Locations"), "Kelly County bars listed."), cite(G8(638593, "Getting drunk"), "Drink effects.")]),
  pastime("pastime-dance", "Dance like nobody's watching",
    { summary: "Bust a move anywhere there's music playing.", guidance: "Stand near a radio or jukebox that's playing and hold R2.", tips: ["Car radios don't count.", "Clubs have proper dance floors."] },
    { tags: ["nightlife", "funny"], official: "no", minutes: [1, 5], level: "medium" },
    [cite(G8(638695, "How to dance"), "Hold R2 near a playing radio or jukebox.")]),
  pastime("pastime-nightclub", "Night out at a club",
    { summary: "Drinks, music and a dance floor.", guidance: "The Rusty Anchor in Key Lento and The Vault in Vice City are the classic nights out.", tips: ["You can't use guns inside."] },
    { tags: ["nightlife"], official: "no", minutes: [15, 30], level: "medium" },
    [cite(P("gta-6-all-strip-club-locations", "GTA 6 All Club Locations"), "Other clubs: The Vault, The Rusty Anchor.")]),
  pastime("pastime-tattoo", "Get a tattoo",
    { summary: "Eleven tattoo studios, each with its own style.", guidance: "Two are in Kelly County: Blood Sugar Tattoo for lettering and Freedom Tattoo for stick-and-poke.", tips: ["Tattoos are among the pricier purchases.", "Map › Style › Tattoos."] },
    { tags: ["style"], official: "no", area: "kelly-county", minutes: [5, 10] },
    [cite(P("gta-6-all-tattoo-studios-locations", "GTA 6 All Tattoo Studios"), "Blood Sugar and Freedom Tattoo in Kelly County.")]),
  pastime("pastime-haircut", "Get a new haircut",
    { summary: "Eighteen salons and barbers. Lucia can also do nails and makeup.", guidance: "Nearest: Pearl House Hair Salon and Captain Starlings Barber Shop.", tips: ["Spend over $1,000 on grooming for a challenge.", "Map › Style › Hair & Beauty."] },
    { tags: ["style"], official: "no", area: "kelly-county", minutes: [3, 10] },
    [cite(P("gta-6-all-hair-beauty-salon-locations", "GTA 6 All Hair & Beauty Salons"), "Pearl House and Captain Starlings in Kelly County.")]),
  pastime("pastime-clothes", "Go clothes shopping",
    { summary: "Sixty-plus clothing stores, from thrift to formal, plus separate shoe stores.", guidance: "Bargain World is the local store. The big variety is in Vice City.", tips: ["Save up to 15 favorite outfits.", "Keep a spare outfit in your car trunk."] },
    { tags: ["style"], official: "no", area: "port-gellhorn", minutes: [5, 20] },
    [cite(P("gta-6-all-clothing-stores-locations", "GTA 6 All Clothing Stores"), "67 clothing stores; Bargain World in Kelly County.")]),
  pastime("pastime-scuba", "Snorkel and scuba",
    { summary: "Swim, dive and explore reefs and wrecks.", guidance: "Press R1 to dive and X to surface. For long dives, put on scuba equipment at a dock or on certain boats.", tips: ["Watch the breath meter.", "The Keys have the best underwater scenery."] },
    { tags: ["outdoors"], official: "no", minutes: [10, 30] },
    [cite(G8(638224, "Swimming and diving"), "Diving controls; scuba gear at docks or boats.")]),
  pastime("pastime-zoo", "Day at the zoo",
    { summary: "A proper zoo with animals, snacks, souvenir shades and arcade machines.", guidance: "Wildland Zoo is on Waxman Island, east of Vice City. It's a long drive, so make it a day trip.", tips: ["Studying the animals there helps your animal count."] },
    { tags: ["outdoors"], official: "no", minutes: [15, 30], level: "medium" },
    [cite(G8(639193, "Wildland Zoo"), "Zoo on Waxman Island with snacks, shades and arcades.")]),
  pastime("pastime-stunt-jumps", "Hit some stunt jumps",
    { summary: "Ramps and gaps all over Leonida, just waiting for a fast car.", guidance: "Use Map › Exploration › Stunt Spots, pick the nearest one and send it.", tips: ["Flying under bridges counts too once you can fly.", "Turn on Reduced Vehicle Damage if you keep wrecking."] },
    { tags: ["stunt"], official: "yes", minutes: [5, 20] },
    [cite(PPX_100, "397 stunts; 300 needed; Map › Exploration › Stunt Spots.")]),
];
