# GTA VI: Side content and money, Chapter 3 to the end (RESTRICTED: research only, contains spoilers)

- Date checked for every row: **2026-11-21** (launch +2 days). Guides are still being updated, and several pages say they are work in progress.
- Method: each page was fetched directly with `curl` into `research/full/raw-side/` (raw HTML, never executed). Text was extracted with `python3 -I` scripts kept in `research/full/scripts-side/` and `research/scripts/`, into `research/full/txt-side/`. All wording here is my own paraphrase.
- Confidence: **high** = 2+ independent reputable pages that I actually read agree. **medium** = one page read, or PowerPyx + GTABase only (about 1.5 sources). **low** = snippets or search summaries only.
- **Independence caveat (important):** the GTABase Strangers & Freaks index says it thanks "PowerPyx for their great work ... which helped us complete this guide". Its mission pages repeat PowerPyx facts, often in the same order. Where PPX + GB are the only agreement, I mark the row **medium**, not high.
- **Unreachable this pass:** gamerant.com. Every fetch failed with an HTTP/2 PROTOCOL_ERROR, and with HTTP/1.1 the server sent an empty reply. GameRant facts below come only from the earlier Chapter 2 pass, or are left out.
- Chapter labels: Chapter 3 is "Tits, Ass, Drug Money", Chapter 4 "Vice City, Baby" and Chapter 5 "Top of the World, Ma" (Game8 chapter table).

## Pages actually read

| Key | Page title | URL |
|---|---|---|
| PPX-FULL | GTA 6 Full Walkthrough – All Missions (Nov 18) | https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/ |
| PPX-SF | GTA 6 All Strangers & Freaks Side Missions (Nov 18) | https://www.powerpyx.com/gta-6-all-strangers-freaks-side-missions/ |
| PPX-MONEY | GTA 6 Money Guide – How to Get Money Fast (Nov 18) | https://www.powerpyx.com/gta-6-money-guide-how-to-get-money-fast/ |
| PPX-FENCE | GTA 6 All Fence Locations (Nov 18) | https://www.powerpyx.com/gta-6-all-fence-locations-how-to-fence-stolen-goods/ |
| PPX-GAR | GTA 6 All Garage Locations (Nov 18) | https://www.powerpyx.com/gta-6-all-garage-locations/ |
| PPX-RACE | GTA 6 All Unique Race Locations (Nov 18) | https://www.powerpyx.com/gta-6-all-unique-race-locations-racing-activities/ |
| PPX-RACECH | GTA 6 All 13 Race Challenge Gold Medals | https://www.powerpyx.com/gta-6-all-race-challenge-locations-gold-medals/ |
| PPX-BANK | GTA 6 All Bank Jobs Locations (Bank Vaults) | https://www.powerpyx.com/gta-6-all-bank-jobs-locations-bank-vaults/ |
| PPX-PAYDAY | GTA 6 All Payday Loans Jobs Locations | https://www.powerpyx.com/gta-6-all-payday-loans-jobs-locations/ |
| PPX-SNG | GTA 6 All Smash 'n' Grabs Locations | https://www.powerpyx.com/gta-6-all-smash-n-grabs-locations/ |
| PPX-GANG | GTA 6 All Illegal Gang Operations Locations | https://www.powerpyx.com/gta-6-all-illegal-gang-operations-locations/ |
| PPX-LABS | GTA 6 All Kitty Litter Lab Locations | https://www.powerpyx.com/gta-6-all-kitty-litter-lab-locations/ |
| PPX-PNS | GTA 6 All Pay 'n' Spray Locations | https://www.powerpyx.com/gta-6-all-pay-n-spray-locations/ |
| PPX-MOD | GTA 6 All Mod Shops Locations | https://www.powerpyx.com/gta-6-all-mod-shops-locations/ |
| PPX-100 | GTA 6 100% Completion Checklist | https://www.powerpyx.com/gta-6-100-completion-checklist-guide/ |
| PPX-CHAL | GTA 6 All Challenges Guide | https://www.powerpyx.com/gta-6-all-challenges-guide/ |
| PPX-SHOOT | GTA 6 All Shooting Range Gold Medal Challenges | https://www.powerpyx.com/gta-6-all-shooting-range-gold-medal-challenges/ |
| PPX-TIPS | GTA 6 Tips & Tricks | https://www.powerpyx.com/gta-6-tips-tricks/ |
| PPX-HELI / POOL / GOLF / DRONE | Helicopter & Plane Locations; Pool Opponents; Golf Courses; Top Fun Drone Races | https://www.powerpyx.com/gta-6-helicopter-plane-locations/ , …/gta-6-all-pool-opponent-locations/ , …/gta-6-all-golf-course-locations/ , …/gta-6-all-top-fun-drone-race-time-trial-locations/ |
| PPX-KEYCL / TANK / JET / GL / SNIPER / PARA / CAR | How to Get Key Cloner; Military Tank; Fighter Jet; Grenade & Rocket Launcher; Sniper Rifle; Parachute; New Personal Car | https://www.powerpyx.com/gta-6-how-to-get-key-cloner/ (others use the same pattern: military-tank-location, military-fighter-jet-location, how-to-get-grenade-launcher-rocket-launcher, how-to-get-sniper-rifle, how-to-get-parachute, how-to-get-new-personal-car) |
| PPX-SAVE | Save for the Future Walkthrough | https://www.powerpyx.com/gta-6-save-for-the-future-walkthrough/ |
| PPX-TROPHY | GTA 6 Trophy Guide & Roadmap (fetched in the earlier pass; text at `research/trophy.txt`) | https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/ |
| PPX-[slug] | One walkthrough per mission | https://www.powerpyx.com/gta-6-<slug>-walkthrough/. Side slugs: get-your-wheels, join-a-street-race, bumper-to-bumper-mentor-yago, race-against-yago, brother-to-brother-back-up-yago, mall-rats, the-impaler-steal-the-impaler, hometown-heroes, climbing-the-cellerichain, pay-the-cellerica-fee, peach-join-the-cellerica-initiation, read-the-label-retrieve-the-cellerica-van, puff-puff-pass-meet-at-the-warehouse, buddy-check-on-kyle, yasmanis-jewelry-jobs, here-kitty-kitty-speak-with-tyrone, spin-on-this-shut-down-the-labs, clonin-keys-makin-gs-steal-the-zorrusso-for-randy, its-a-date, bad-driver-find-felipe, attend-eddie-acostas-party, this-is-a-free-call-from-pick-up-shayna, thats-where-the-money-is-wait-at-the-cafe, the-last-mile-passing-the-torch-recover-petes-plane, the-last-mile-backseat-pilot-deliver-packages, petes-deliveries-southpoint-airfield-avery-allen-co. Money-relevant main slugs: send-money-to-lorena, send-more-money-to-lorena, company-cars-speak-to-the-concierge, pay-abes-fee, credit-check-meet-rauls-crew, boobie-time-talk-to-boobie, the-cartel-heist, dealers-choice-go-see-drequan, meet-the-heders, dubious-provenance-visit-the-antique-store, welcome-to-vice-city, vcia-takedown, tie-up-loose-ends, call-valentina-back, sunset-stop-by-the-front-desk, starting-from-zero, bird-in-the-hand, taking-liberties, operation-savage-glory, honest-abe-negotiate-a-deal-with-abe, doggie-bag-meet-vinny, vc-baby-talk-to-mattia. (Unfinished Business, Protective Custody and The End of the Road returned a stub page, about 28 KB with no content.) |
| GB-MONEY | How to Make Money Fast in GTA 6: 8 Best Methods (Nov 20) | https://www.gtabase.com/gta-6/articles/how-to-make-money-fast-in-gta-6 |
| GB-SF | GTA 6 Strangers & Freaks Missions List & Guide | https://www.gtabase.com/gta-6/strangers-missions/ |
| GB-[slug] | GTABase stranger pages | https://www.gtabase.com/gta-6/strangers/<slug>. Read: join-a-street-race, bumper-to-bumper, race-against-yago, brother-to-brother, buddy, mall-rats, the-impaler, hometown-heroes, climbing-the-cellerichain, pay-the-cellerica-fee, peach, read-the-label, puff-puff-pass, yasmanis-atm-jobs, yasmanis-payday-loans-jobs, tail-the-security-van, randys-wish-list, take-out-kitty-litter, spin-on-this, dunks-robbery-tips, attend-eddie-acostas-party, the-last-mile-passing-the-torch, the-last-mile-backseat-pilot, petes-deliveries-southpoint-airfield, petes-deliveries-avery-allen-co, deliver-packages-pilot-pete. Also /gta-6/missions/race-against-yago and /gta-6/missions/yasmanis-jewelry-jobs |
| GB-PROP | GTA 6 Properties & Garages: Full List & Guide; plus property pages for the Y Hotel (ocean-beach-safehouse), Thompson Court, Mitchell Auto Center and the GTA+ Crosstown Garage | https://www.gtabase.com/gta-6/properties/ |
| GB-SIDE | GTA 6 Activities List & Side Missions Guide (**pre-release style text, not used for facts**) | https://www.gtabase.com/gta-6/side-missions/ |
| G8-CH3 | Chapter 3 Walkthrough and All Missions (upd. Nov 21) | https://game8.co/games/GTA-6/archives/639173 |
| G8-OPT | List of All Optional Missions (upd. Nov 21; **only covers Ch1–2 so far**) | https://game8.co/games/GTA-6/archives/638130 |
| G8-MISS | Missables and Points of No Return (upd. Nov 21; spoilers to start of Ch4) | https://game8.co/games/GTA-6/archives/638531 |
| G8-MONEY | Best Ways to Make Money (upd. Nov 21) | https://game8.co/games/GTA-6/archives/638321 |
| G8-BUY / G8-SELL | What to Buy First; What to Sell | https://game8.co/games/GTA-6/archives/638293 , …/638294 |
| G8-PRIO | Best Missions to Prioritize | https://game8.co/games/GTA-6/archives/637141 |
| G8-ROB | How to Rob Stores (includes a table of when each robbery type unlocks) | https://game8.co/games/GTA-6/archives/638730 |
| G8-OPS | All Robbery Opportunities and Illegal Operations | https://game8.co/games/GTA-6/archives/638612 |
| G8-RANDY | All Randy's Wishlist Vehicle Locations (upd. Nov 21) | https://game8.co/games/GTA-6/archives/639137 |
| G8-CARTEL | What to Do Before The Cartel Heist | https://game8.co/games/GTA-6/archives/639182 |
| G8-BOOBIE / G8-DEALER / G8-KITTY | Boobie Time, Dealer's Choice and Here, Kitty Kitty walkthroughs | https://game8.co/games/GTA-6/archives/639282 , …/639174 , …/639198 |
| G8-DRUGS / G8-CARDS / G8-DEATH / G8-BEGIN | Where to Sell Drugs; Should You Sell Your Collectible Cards?; Death Penalty; Beginner's Guide | https://game8.co/games/GTA-6/archives/639178 , …/638746 , …/638541 , …/637017 |
| PS-CH | GTA 6: Chapters & Story Missions (WIP, Nov 18) | https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions |
| PS-RANDY | GTA 6: Randy's Wish List Vehicle Locations (WIP, Nov 18; 10 of 22 cars written up) | https://www.pushsquare.com/guides/gta-6-randys-wish-list-vehicle-locations |
| PS-TR / PS-100 / PS-HUB | Trophy Guide & Roadmap; 100% Completion Checklist; Guide hub | https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap , …/gta-6-100percent-completion-checklist , …/gta-6-guide |
| PCG-FENCE | GTA 6 fence locations (Nov 18) | https://www.pcgamer.com/games/grand-theft-auto/gta-6-fence-locations/ |
| PCG-SNAP | How to get a snap gun in GTA 6 (Nov 18) | https://www.pcgamer.com/games/grand-theft-auto/gta-6-snap-gun/ |
| PCG-BANK | Bank your cash in GTA 6 (Nov 19) | https://www.pcgamer.com/games/grand-theft-auto/gta-6-bank-cash/ |
| GRD-MONEY | How to farm money in GTA 6 (Nov 19) | https://www.gamesradar.com/games/grand-theft-auto/gta-6-make-money-fast/ |
| GRD-EQUIP | GTA 6 Equipment: All 12 pieces explained | https://www.gamesradar.com/games/grand-theft-auto/all-gta-6-equipment-explained/ |
| GRD-SIDE | GTA 6 side activities (mixes in pre-release text, so weak) | https://www.gamesradar.com/games/grand-theft-auto/gta-6-side-activities/ |
| GRD-BROKE | "GTA 6 will lock you out of story missions if you're too broke…" (**pre-release preview**, only shows the claim is old) | https://www.gamesradar.com/games/grand-theft-auto/gta-6-will-lock-you-out-of-story-missions-if-youre-too-broke-so-its-good-to-know-the-robbery-mechanics-have-been-massively-expanded/ |

---

## Cross-chapter rules (apply to everything below)

- **Strangers & Freaks (S&F) trophy:** complete 8 strands. The game never shows which strands count, so the only check is the trophy counter before and after a strand's last mission (PPX-SF, GB-SF). Strands confirmed to count: **Kirk, Kyle, Yago, Pilot Pete**. Strands that do not count: Billy, Andy, Yasmani, Tyrone, Eddie Acosta, Moses, Shirley, Cal (PPX-SF, GB-SF, PPX-TROPHY). Bret, Randy, Dunk and Kenton are listed without a count/no-count mark. PPX-TROPHY says more counting strangers are "yet to be discovered". **Confidence: medium**: PPX + GB only, and GB credits PPX. Game8's S&F checkmarks only go up to Chapter 2 so far.
- **Delays:** after each side quest, the next one arrives by call or text after some in-game days. A wait can cross into a later chapter. Sleeping on repeat usually doesn't trigger it, so do other tasks instead (PPX-SF, PPX-TIPS, GB-SF). Confidence **medium**.
- **After the story:** every trophy-related strand stays available in free roam, and nothing needed for 100% can be missed. Only the hourglass (time-limited) quests can be missed, and those don't affect trophies or 100% (PPX-FULL, PPX-100, PPX-TROPHY, GB-SF). Confidence **medium**.
- **Hourglass icon** = time-sensitive optional mission. Do it as soon as it appears (PPX-FULL, GB race-against-yago).
- **No mission replay and no mission medals.** Make manual saves at the start and end of each chapter (PPX-FULL, PS-CH). Confidence **high**.
- **Map icon key:** pink bubble with black letters = main mission. Black bubble with pink letters = optional mission. Purple = small side task (PPX-FULL, PPX-TIPS).

---

## Chapter 3 ("Tits, Ass, Drug Money")

Game8 notes that Chapter 3 is much more open than Chapters 1–2: main missions can be done in any order, and some are locked to Jason, Lucia or both (G8-CH3).

### 3.1 Side missions and questlines

| Title | Type / giver | Unlock (as stated) | Area | Rewards / payout (as stated) | Missable? | S&F? | Spoiler-title? | Sources | Conf. |
|---|---|---|---|---|---|---|---|---|---|
| Get Your Wheels | Optional "main" task, no marker (self) | Appears in the story list after Dealer's Choice, once you arrive at Bayside Apartments | Anywhere (Vice City) | A personal car for Ch3. Either pay about **$700–$900** to retrieve an impounded car via Scooter Bros, or register another car at a Pay 'n' Spray (needs a free garage slot) | No | No | No | PPX | medium |
| Join a Street Race (Yago 1) | S&F, Yago (via Manuel's text) | A few minutes after **Dealer's Choice** | Salton, Vice City | Rent a car for **$600–$900**. 1st place pays **$3,000**; other places pay less | No | **Yes** (Yago strand) | No | PPX, GB | medium |
| Bumper to Bumper (Mentor Yago) (Yago 2) | S&F, Yago | Several in-game days after Join a Street Race. If it shows a **lock** icon, sleep at the apartment and come back in the afternoon or evening | Little Cuba (Yago's restaurant) → mod shop → race | **$500**. Yago pays for the upgrades. The race itself pays nothing; police chase you afterwards | No | Yes | No | PPX, GB | medium |
| Race Against Yago (Yago 3) | Optional, **hourglass** | Several in-game days after Bumper to Bumper (text to Jason) | Salton meet; talk to Santiago and pick "Freeway Run" | Up to **$3,800** for 1st | **YES: time-limited, missable** | Listed in the Yago strand (PPX). GB files it under non-S&F "other optional" missions | No | PPX, GB, PS-CH ("Time Sensitive") | high (missable flag) |
| Brother to Brother (Back Up Yago) (Yago 4) | S&F, Yago | A text a few in-game days after Yago's earlier missions. Start at the back door of El Rincon Notorio | Little Cuba → deal in west Vice City | No cash. You can take **Yago's car** (garage it, or sell at Pay 'n' Spray). Finishes the Yago S&F strand | No | **Yes** | Title no; **content is a heavy spoiler** (Yago always dies; reveals his secret) | PPX, GB | medium |
| Buddy? (Check on Kyle) (Kyle 3) | S&F, Kyle | Kyle's text after Collect Chemicals for Kyle. A long delay: for PPX it came about halfway through Ch3, after several in-game weeks | McKittrick Farm, Kelly County | **$5,000** (via BuckMe) if you side with the police; nothing if you let Kyle win. Either ending counts for S&F | No | **Yes** | Title no; content spoils Kyle's fate | PPX, GB | medium |
| Mall Rats (Billy 3) | Optional, Billy. **Solo only** | Long delay after Twist Wrist, Smash, Grab. PPX and GB both say it came around **Credit Check / Clonin' Keys** | Ocean Beach (behind the Malibu) → mall jewelry store | **$12,000** | No | No | No | PPX, GB | medium |
| The Impaler (Steal the Impaler) (Billy 4) | Optional, Billy/Wyman | A few in-game days after Mall Rats: Billy calls, then Wyman texts. **Reply to Wyman** to mark it | Ambrosia police impound, Kelly County | None. Gives a 3-star wanted level. PPX suggests escaping through the train tunnel north of Ambrosia | No | No | No | PPX, GB | medium |
| Hometown Heroes (Billy 5) | Optional, Billy. Needs both protagonists | A few in-game days after The Impaler, by text | Thrillbilly Mud Club, Kelly County | **$10,000** and "The Lone Rider" trophy | No | No (own trophy) | Title no; content spoils crew deaths | PPX, GB, PS-TR | medium |
| Climbing the Cellerichain (parts 1–3) (Andy 1) | Optional, Andy. **Lucia only** | Andy calls Lucia during Ch3. For PPX this was after **Mami Knows Best** and **Car Service**; she then texts her address | Andy's house in Belville (Leonard County). Deliveries to Waning Sands, a north Vice City market and Ambrosia | Welcome kit (Pure Manifestick and Cellerica Cap) | No | No | No | PPX, GB | medium |
| Pay the Cellerica Fee (Andy 2) | Optional, Andy. Lucia | Andy calls after the deliveries | Anywhere (BuckMe) | **Costs $5,000** (refunded at the end of the strand) | No | No | No | PPX, GB | medium |
| Peach! (Join the Cellerica Initiation) (Andy 3) | Optional, Andy. Lucia | Andy texts some time after the fee | Cellerica campus, Belville | None. Choices don't change the outcome | No | No | No | PPX, GB | medium |
| Read the Label (Retrieve the Cellerica Van) (Andy 4) | Optional, Cecilia. Lucia | Some time after Peach! (play as Lucia) | North Vice City → Belville warehouse | **$1,800** (BuckMe) | No | No | Mild | PPX, GB | medium |
| Puff Puff Pass (Meet at the Warehouse) (Andy 5) | Optional, Cecilia. Lucia | Some time after Read the Label (play as Lucia) | Paper Boys warehouse, Belville → Cecilia's mansion | **$10,000**, the **$5,000 fee back**, and the "Road to Rehabilitation" trophy | No | No (own trophy) | Mild (drug pun); **content spoils the cult twist** | PPX, GB, PS-TR | medium |
| Yasmani's Jewelry Jobs (Casa de Empeño, Richardson Jewelry, Donovan Banks & Co.) | Yasmani. **Classification conflicts**: PPX calls it main mission #53; GB, Game8 and Push Square call it optional | After **Boobie Time** | Vice City / Ocean Beach stores; deliver to Yasmani in Little Cuba | **$20,000** for the three requested items, plus whatever else you steal. Unlocks the **Snap Gun** and Yasmani's pickup of goods dropped at your garages. PPX safe codes: Casa de Empeño 1680, Richardson 6815, Donovan Banks 0104 | No | No | No | PPX, GB, G8-PRIO, GRD-EQUIP | high (unlock); medium (payout) |
| Yasmani's ATM Jobs | S&F-type listing, Yasmani | **Not found** (no walkthrough yet, GB placeholder only) | — | Not stated. ATMs need a car with a **winch** to pull them out (PPX-FENCE); GRD-MONEY says to fit the winch at a Mod Shop | ? | No | No | PPX-SF, GB (stub), PPX-FENCE, GRD-MONEY | low |
| Yasmani's Payday Loans Jobs | Yasmani | **Not found**. Payday Loans as a type open after **Credit Check** | Payday Loans stores (see 3.2) | Not stated. Doing 2 Payday Loans for Yasmani is a prerequisite for his security-van tips (PPX-MONEY, PPX-BANK). PCG says it also enables garage pickup (with a fee) | ? | No | No | PPX-SF, GB (stub), PPX-BANK, PCG-FENCE | low–medium |
| Tail the Security Van | Yasmani | **Not found** | — | Not stated | ? | No | No | PPX-SF, GB (stub) | low |
| Randy's Wish List | Randy | Marked automatically after **Clonin' Keys, Makin' Gs (Steal the Zorrusso for Randy)** | Randy is "west of Vice City" with an RK icon (PPX-TROPHY); PCG puts him in **Balsero**; PS says talk to him at "Leonida Auto World" for hints | High payouts; see the money table. Finishing it unlocks the "Supply & Demand" trophy. The car count conflicts (see Conflicts) | No (post-story too) | Not marked | No | PPX-MONEY, PPX-TROPHY, GB-MONEY, G8-RANDY, G8-PRIO, PS-RANDY, PS-TR | high (exists, unlock); conflicting (count, pay) |
| ¡Dale Mamba! | Randy | Added after you have delivered some Wish List cars (PS). Game8: after you progress far in Randy's missions, he marks a '64 Mamba GT | Leaf Links mansion, Vice Beach. The key is in a bowl behind a sofa; guarded, and the Snap Gun helps | Not stated. The Mamba has a tracker | No | — | No | PS-RANDY, PS-CH, G8-RANDY | high (exists) |
| Take Out Kitty Litter (Kitty Litter Labs) | Tyrone. **Jason only** (PPX-TROPHY) | Right after **Here, Kitty Kitty**. The first "story lab" is assigned at once; later labs come from Tyrone or Dook on request, or you can just visit the search areas | 14 labs: Balsero ×3, Central Rockridge, Crosstown ×3, Decor District, Little Cuba, Salton, Tequesta, Vice-Dale, plus the story lab | **$2,000 or $2,500 per lab** (BuckMe) | No (post-story too) | No | No | PPX-LABS, GB, PPX-TROPHY. Game8 and PS list "Kitty Litter Labs" as a **main** mission | medium (payout); conflicting (main vs optional) |
| Spin On This (Shut Down the Labs) | Tyrone, Jason | After destroying "enough" labs (number not stated) | Diner outside Grayson, Lummox County. Your weapons are locked in once you approach, so gear up first | **$10,000** and the "Spin On This!" trophy | No | No | No | PPX, GB, PS-TR | medium |
| Dunk's Robbery Tips | Dunk | **Not found** (GB stub: "Dunk knows a few places that are ripe for a robbery") | — | Not stated | ? | Not marked | No | PPX-SF, GB (stub) | low |
| Papa Audacity strand: The Unknown Stuntman, Trial by Tire, Quit Your Job, Sell Your House, Stunt Audacity | Side missions, "Papa Audacity" | **Not found** (chapter and unlock unknown). Only Push Square lists it; PPX and GB don't have it yet | — | Not stated | ? | ? | No | PS-CH only | low |
| Kenton: "Maritime Disputes" (PS spells it "Martime Disputes") | Kenton | PPX: Kenton comes back by text to Jason somewhere in Ch2–3 (calling Brian as Jason in Ch2 speeds this up) | Key Lento | Not stated | No | Not marked (own trophy) | No | PS-CH, PPX-TROPHY, PPX-100 | low |
| Vanessa's laptop → free garage and car | Hidden apartment task | Inside the Ch3 Vice City apartment. Solve the laptop password; it reveals a garage and its keypad code | GB/PPX don't name it. Game8 calls the garage "Del Rio Boulevard Garage" | A free garage, plus **Vanessa's Growler** (Standout car): sells for **$20,500** (G8-MISS) or **$20,600** (G8-CARTEL); costs **$29,450** to register | **YES**: lost once you leave the apartment in Ch4 "Ocean Beach" | No | No | G8-MISS, G8-CARTEL (both Game8) | medium |

Also from story missions in Ch3 (not side content, but they gate side content): Dealer's Choice gives **$1,500**, whichever product you take (PPX, G8-DEALER). Meet the Heders gives the **Cut-Off Tool** for orange SCOOP containers (PPX, GRD-EQUIP). Credit Check gives **$6,000** and the **Dye Pack Jammer** (PPX, GRD-EQUIP). Clonin' Keys gives **$21,250 + $10,000** for good condition, plus the **Key Cloner** (PPX). The Cartel Heist pays **$120,000** (PPX). Dubious Provenance part 3 lets you loot about $2,500 and take a **'32 Hustler** (PPX).

**Mandatory money sinks in Ch3:** Send Money to Lorena (**$5,000**, Lucia, after Mami Knows Best), then Send More Money to Lorena (**$5,000**, a few in-game days later). PPX labels both mandatory main steps.

### 3.2 Activities, robberies and recurring jobs unlocked in Ch3

| Activity | Unlock | Area | Payout as stated | Sources | Conf. |
|---|---|---|---|---|---|
| Sell or register **Standard-Tracker** cars at **any Pay 'n' Spray** | "Early Ch3". PPX's Welcome to Vice City page says Moses texts you this after that mission | 19 Pay 'n' Sprays (Mariana 4, Vice-Dale 10, Leonard 1, Kelly 2, Lummox 2) | PPX: about **$4,000+** for a good car. Game8: Pay 'n' Spray pays "considerably less" (conflict) | PPX-MONEY, PPX-CAR, PPX-PNS, G8-MONEY | medium |
| Hit 'N Run VC street races (9 races: Salton 3, La Perle 2, Ocean Beach 2, Gloriana Key 2) | After Dealer's Choice (via Join a Street Race) | Vice City | Entry and rental fees, but "you make a profit" by winning | PPX-RACE | medium |
| Jewelry-store Smash 'n' Grabs | After **Yasmani's Jewelry Jobs** (pawn shops opened at Ch2 Coffee Break) | 35 stores in total. Jewelry ranges run $1k–$10k up to $14k–$25k; pawn shops $1k–$12k | PPX: **$10,000–$25,000 per robbery**. GB: $10k–$25k+. Stores need time to restock | PPX-MONEY, PPX-SNG, GB-MONEY, G8-ROB | high |
| Small banks (14) | After **Credit Check** (Dye Pack Jammer) | Mariana 3, Vice City 9, Leonard 1, Kelly 1 | Per bank $5k–$15k up to **$15k–$45k** (Lombank Bayside, Lombank Ocean Beach, Druthers State Bank). GB: about $5k–$45k | PPX-BANK, GB-MONEY, G8-ROB, GRD-EQUIP | high |
| Payday Loans (7) | After **Credit Check** | Vice-Dale 6, Kelly 1 | $5k–$15k each. Little Cuba pays **$15k–$25k**; Cash Flow (Kelly) $2k–$10k | PPX-PAYDAY, G8-ROB | high (unlock) / medium (pay) |
| ATM theft | PPX ties it to Yasmani's jobs; GRD says you need a winch fitted at a Mod Shop | Anywhere | Not stated | PPX-FENCE, GRD-MONEY | low |
| Security trucks (sticky bomb on the back door) | Sticky bombs are in the back of Yasmani's shop after his Ch3 jobs | Vice City | Not stated. Can earn the "A Classic Blitz Play" trophy early | PPX-FENCE, PPX-TROPHY | medium |
| Gang Operations (39, respawn after a while) | Gradually, as you meet each gang. Guardia Brothers ops appear in Vice City | Map-wide | Game8 averages: Guardia ops **$9k–$20k**; Kolt's La Cascara Motel **$14.6k–$32.1k** (averages vary between playthroughs) | PPX-GANG, G8-OPS | medium |
| Vice City Kitty Litter labs | See 3.1 | — | $2,000–$2,500 each | PPX-LABS, GB | medium |
| Garage drop-off fencing | PPX: after unlocking Yasmani in Ch3, leave goods in any garage and choose a fence. PCG: after **two Payday Loan jobs for Yasmani**, for a fee (conflict on timing) | Your garages | PCG says the convenience costs an extra fee | PPX-FENCE, PCG-FENCE | medium |
| Partner fencing ("Fence Goods" command) | Whenever both are together; put the bag in your car's trunk | — | PCG: you get a bit less than doing it yourself | PPX-FENCE, PCG-FENCE | high |
| Home TV video games accessible again | From Ch3 | Safehouse | — | PPX-100 | medium |
| GTA+ Crosstown Garage and Venturas BLVD Elegy | On reaching Ch3 with an active GTA+ membership | Crosstown | — | GB-PROP | medium |
| "In The Beginning…" (the blue Banshee easter-egg trophy) | Needs the Key Cloner (Ch3) | — | — | PPX-TROPHY | medium |

### 3.3 Money methods, Chapter 3

| Method | Payout (as stated) | Repeatable / cooldown | Risk | Sources | Conf. |
|---|---|---|---|---|---|
| Randy's Wish List supercars (Key Cloner, Advanced Trackers) | PPX: usually **$30,000+** in perfect condition. GB: upward of $30,000. G8-MONEY: **$5k–$30k**. G8-PRIO: some sell for over $20,000 | One delivery per listed car (a finite list) | An Advanced Tracker pings the police if you drive too slowly; it switches off near Randy's. Damage cuts the pay | PPX-MONEY, GB-MONEY, G8-MONEY, G8-PRIO | high (big payer); conflicting (exact range) |
| Jewelry stores (sell to Yasmani) | **$10,000–$25,000** per robbery | Repeatable; stores need restock time and pay less if hit again soon | Alarms and police. Use the Snap Gun on back doors, destroy footage, crack the safe with the code | PPX-MONEY, GB-MONEY, PPX-SNG | high |
| Small banks / Payday Loans (marked bills to Yasmani) | Banks $5k–$45k; Payday Loans $2k–$25k | Repeatable | Without the jammer, dye packs explode | PPX-BANK, PPX-PAYDAY, GB-MONEY | high |
| Standard-Tracker cars at Pay 'n' Spray | About $4,000+ (PPX) | Repeatable | Tracker heat | PPX-MONEY | medium |
| Moses (cars with no tracker) | About $1,000+, roughly a 2-minute cooldown (Ch2 data) | Repeatable | Low | PPX-MONEY, GB-MONEY | high |
| Billy jobs | Mall Rats $12,000; Hometown Heroes $10,000 | One-off | Combat | PPX, GB | medium |
| Kitty Litter labs and Spin On This | $2,000–$2,500 per lab ×14; then $10,000 | One-off per lab | Combat | PPX-LABS, GB | medium |
| Andy strand | +$1,800 and +$10,000, plus the $5,000 back (net +$11,800) | One-off | — | PPX, GB | medium |
| Yago races | $3,000; $500; $3,800 | One-off (the Freeway Run race is time-limited) | Police after Bumper to Bumper | PPX, GB | medium |
| Robbing other criminals (random events) | GB: about **$1,000–$15,000** per encounter | Random | Police | GB-MONEY | medium |
| Collectible cards sold at pawnshops | Standard about $20, Silver over $2,000. Selling doesn't reset collection progress | Per card | None | G8-CARDS | medium |
| End-of-chapter heist (story) | **$120,000** at the end of Ch3 | One-off | — | PPX-MONEY, PPX cartel page | medium |

**What the guides recommend for Ch3:** PowerPyx says Ch3 is where farming becomes efficient. Do jewelry stores (Yasmani) and Pay 'n' Spray tracker cars first, then **Randy's Wish List** once the Key Cloner arrives (PPX-MONEY). Game8 says to prioritize Steal the Zorrusso, Randy's Wish List and Yasmani's Jewelry Jobs; steal Randy cars between missions; and sell robbery goods to Yasmani, except narcotics, which go to Tyrone (G8-CH3, G8-PRIO). PPX-TIPS: from mid-Ch3, money "isn't really an issue anymore". **Before the Cartel Heist** (Game8): unlock Vanessa's laptop, grab Randy cars from the **Y Hotel** driveway (frequent spawns, and lost once it becomes your Ch4 base), plant all 3 bombs for the full 12-minute vault timer, and practise the safe with Nicole (G8-CARTEL, G8-MISS).

---

## Chapter 4 ("Vice City, Baby")

### 4.1 Side missions and questlines

| Title | Type / giver | Unlock (as stated) | Area | Rewards / payout (as stated) | Missable? | S&F? | Spoiler-title? | Sources | Conf. |
|---|---|---|---|---|---|---|---|---|---|
| Attend Eddie Acosta's Party | Optional, Eddie Acosta. **Solo only** | Meet Eddie at the hotel bar during **Pool Day**, then his text a few days later | Heathcliff Heights, Vice City | **No reward.** It is a scam: paying costs **$50,000** for a worthless NFT, so refuse | No | **No** (single mission) | No (the content is a scam reveal) | PPX, GB | medium |
| The Last Mile: Passing the Torch (Recover Pete's Plane) | S&F, Pilot Pete. **Jason only** | Pete calls early in Ch4, shortly after **Pool Day** | Sundown Private Airfield (Leonard County); land south of Port Gellhorn | **$12,000**, plus the unique **Pete's KZ-59 Assault Rifle** on the hangar table (safe code 3718) | No | **Yes** | Mild ("Passing the Torch") | PPX, GB | medium |
| The Last Mile: Backseat Pilot (Deliver Packages) | S&F, Pete. Jason | About half an in-game day after the first job | GB: Wild Hog Airfield, Kelly County. PPX body text says "return to the Gellhorn airfield" | **$20,000** if all 7 drops are made within the roughly 2-hour limit. Red circles on the map give a wanted level | No | Yes | No | PPX, GB | medium |
| Pete's Deliveries: Southpoint Airfield | S&F, Pete. Jason | Marked together with Avery Allen & Co. after Backseat Pilot (either order) | Mariana County (gunfight at pickup) | **$20,000** (7 drops by 20:00) | No | Yes | No | PPX, GB | medium |
| Pete's Deliveries: Avery Allen & Co. | S&F, Pete. Jason | Same as above | Kelly County | **$20,000** (7 drops by 14:00) | No | Yes | No | PPX, GB | medium |
| Deliver Packages (Pete's final) | S&F, Pete. Jason | A couple of in-game days after both Pete's Deliveries | Leonard County | **$20,000** (7 drops by 08:00). Completes the Pete S&F strand | No | **Yes** | No | PPX, GB | medium |
| *(Pete titles per Push Square: Passing the Torch, Backseat Pilot, **Hostile Takeover, Stormy Weather, Over and Out**)* | — | — | — | — | — | — | "Over and Out" is mild | PS-CH | low (name conflict) |
| It's A Date! | Optional (both together) | Marked right after **Heavy Lifting** | Courtyard Bar, Stockyard | Relationship boost only | No | No | No | PPX | medium |
| Bad Driver! (Find Felipe) | Optional, Andrea | After **Party Hard** | A bar in Millport, Lummox County | Kill Felipe: **$20,000** from Andrea. Spare him: he later offers "Collect Felipe's Gift" (his vehicle) | **YES: gone permanently after "Power Play"** | No | **YES**: the title and description reveal who bailed on the Cartel Heist | PPX | medium |
| Collect Felipe's Gift | Optional | Only if you spare Felipe | **Not found** | Felipe's vehicle | ? | No | **YES** (reveals the spare outcome) | PPX (mention only) | low |
| This is a Free Call From… (Pick up Shayna) | Optional, Shayna. **Lucia only** | After **Lawyer Up**: drive near Hamlet as Lucia and Shayna messages you | Prison near Hamlet → Southside house | Up to about **$6,500** in fenceable loot and drugs (about $1,500 of items, plus a $5,000 drug half if you fight; about $1,200 if you talk the gang down) | **YES: limited time** in Ch4 (PPX-FULL: time-sensitive) | No | Mild (implies a prison release) | PPX | medium |
| That's Where The Money Is… (Wait at the Cafe) | Optional, **Yasmani** | After **VCIA Takedown** (the very end of Ch4) | Café Orquídea, Ocean Beach → tail a security van to the bank | About **$80,000** if you grab all the marked bills. Unlocks **Large Bank Vaults** and Yasmani's **security-van tips**, plus the "A Classic Blitz Play" trophy if not already earned. Automatic 4-star wanted level | Not stated. PPX-MONEY calls it "effectively at the Point of No Return" | No | No | PPX, PPX-MONEY, PPX-BANK, PPX-100, GB-MONEY | high (unlock); medium (payout) |
| Boobie's apartment items (laptop garage, Y Hotel cars) | — | Lost when you leave Boobie's apartment in Ch4 "Ocean Beach" | — | — | **YES** | — | No | G8-MISS | medium |

### 4.2 Activities, unlocks and purchases in Ch4

| Item | Unlock | Detail | Sources | Conf. |
|---|---|---|---|---|
| The Y Hotel safehouse (room 701): free ride service, Zenith Gym, concierge | Ch4 "Ocean Beach" | You can no longer steal cars from its driveway once it is your base | GB-PROP, G8-MISS | medium |
| Company Cars: a new high-end car each for Jason and Lucia (yours to mod or sell) | After **Pool Day** (talk to Santino) | Status Auto Imports. PPX says the Pfister Comet S2 has the best base stats | PPX | medium |
| **Thompson Court Garage** (2 spots, free) | Finish **Company Cars** | Ocean Beach | PPX-GAR, GB-PROP | medium |
| BuckMe **Premium/"Black"** tier (checking limit **$2,000,000**; 10% off liveries) | Given automatically at the start of Ch4, whatever your savings | — | PPX-SAVE | medium |
| Large Bank Vaults (8) | After **That's Where The Money Is…** | $65k–$110k up to **$135k–$205k** (Lombank Downtown and Lombank Ocean Beach are the top ones). Follow a security van; its guard opens the vault. Needs two bags: hand one to your partner | PPX-BANK, PPX-MONEY, GB-MONEY | high |
| Yasmani's security-van tips | After That's Where The Money Is…, **and** Yasmani's earlier quests (robbing 2 Payday Loans) | **$10,000** per tip (PPX) | PPX-MONEY, PPX-BANK, PPX-TROPHY | medium |
| "Tie Up Loose Ends" waiting period | After VCIA Takedown | The game openly gives you this time to do side activities and earn money. **Call Valentina Back** shortens the wait, so only call her once you're done | PPX tie-up, PPX call-valentina | medium |
| **Chapter 4 point of no return: Sunset** | Starting "Sunset" | Locks you into most of Ch5's missions before open-world access returns | PPX sunset | medium |

**Mandatory Ch4 money sink:** **Pay Abe's Fee, $75,000** via BuckMe, given right after **Party Hard**. It is required to advance (PPX). VCIA Takedown (main) pays **$250,000**, plus Francisco's LMG-6 variant if you pick it up (PPX).

### 4.3 Money methods, Chapter 4

| Method | Payout (as stated) | Repeatable | Risk | Sources | Conf. |
|---|---|---|---|---|---|
| Large Bank Vaults | Up to **$205,000** per bank, "for 5 minutes of work". Post-story: about **$100k–$200k every 5 minutes** | Repeatable (follow vans, wait at a bank, or buy Yasmani's tips) | Instant 4 stars. Use a fast motorbike, then swap cars | PPX-MONEY, PPX-BANK, GB-MONEY | high |
| Pilot Pete deliveries (Jason) | $12,000, then **$20,000** each for 4 more jobs. GB-MONEY gives $10k–$20k (*$92,000 total is my sum, not stated*) | One-off chain | A time limit; red circles give a wanted level | PPX, GB, GB-MONEY | medium |
| Randy, jewelry, banks, Payday Loans (from Ch3) | As in Ch3 | — | — | — | — |
| Bad Driver! (kill route) | $20,000 | One-off, missable | — | PPX | medium |
| Pick up Shayna | Up to about $6,500 in goods | One-off, time-limited | Police | PPX | medium |
| Avoid: Eddie Acosta | −$50,000 if you pay | — | — | PPX, GB | medium |

**What the guides recommend for Ch4:** finish That's Where The Money Is… and farm **bank vaults**; PPX and GB both call this by far the best money for the time (PPX-MONEY, GB-MONEY). Before you leave Boobie's apartment, take the laptop garage and car, and sell Randy cars from the Y Hotel driveway (G8-MISS). Make sure you have **$75,000** for Abe's fee.

---

## Chapter 5 ("Top of the World, Ma") and post-story

| Item | Unlock / detail | Rewards / payout (as stated) | Missable? | Spoiler-title? | Sources | Conf. |
|---|---|---|---|---|---|---|
| Locked story stretch | After **Sunset** (the Ch4 point of no return) you play most Ch5 missions in a row. Full open-world access returns when you leave Abe's office in **Honest Abe**, which follows **Operation Savage Glory** | — | — | **Yes**: "Starting From Zero" (its description says your **bank accounts are frozen**), "Protective Custody", "The End of the Road", "Unfinished Business", "Honest Abe" | PPX sunset, PPX starting-from-zero, PPX honest-abe | medium |
| Operation Savage Glory (main) | After Doggie Bag and VC Baby | **$50,000**, the Pegassi Residences penthouse, and all weapons, equipment and outfits returned. **Unlocks NE 15th Street Garage (2 spots) and Pegassi Residences Garage (3 spots)** | — | — | PPX, PPX-GAR, GB-PROP | medium |
| Second "Pay Abe's Fee" (Ch5 list entry) | PPX-FULL lists Pay Abe's Fee again in Ch5 | **Amount not found** (the PPX page describes only the Ch4 $75,000) | — | — | PPX-FULL | low |
| Side content in Ch5 | No new Ch5 side questlines are listed by PPX-SF, GB-SF or PS-CH | — | — | — | PPX-SF, GB-SF | medium (absence) |
| Post-story | Every S&F and trophy strand stays available. PPX's endgame loop: rob vaults → drop the cash at Yasmani or at a garage for pickup → repeat | $100k–$200k per 5 minutes | — | — | PPX-MONEY, PPX-FULL | medium |

Whether your **money** comes back after the frozen accounts is **not stated**. PPX says only that weapons, equipment and outfits "etc." are returned in Operation Savage Glory.

---

## Fences and buyers (state from Ch3 on)

| Fence / buyer | Location | Unlocks | Buys (map tooltip rating) | Still available? | Sources | Conf. |
|---|---|---|---|---|---|---|
| Brian | Key Lento | Ch1 Lab Fees | All "Very Low" | Gone after Ch1 | PPX-FENCE, PCG-FENCE | high |
| Donnie | Key Lento | Ch1 Clean Up After Donnie | Narcotics Low | Gone after Swamped | PPX-FENCE, PCG-FENCE, G8-MISS | high |
| Moses (vehicles) | Port Gellhorn | Ch2 Moses | Cars with **no tracker** only; also registers cars | Yes, post-story | PPX-FENCE, PCG-FENCE, GB-MONEY | high |
| Dunk | Port Gellhorn | Ch2 Slam Dunk | Narcotics Low, Jewelry Low, Bills Very Low | Yes (temporarily unavailable during the story) | PPX-FENCE, PCG-FENCE, G8-DRUGS | high |
| **Pay 'n' Spray** (vehicles) | Any of 19 | Early Ch3 (Moses texts after Welcome to Vice City) | **Standard-Tracker** cars (sell or register) | Yes | PPX-MONEY, PPX-CAR, PPX welcome | medium |
| **Tyrone** | La Perle, Vice City | Ch3 **Here, Kitty Kitty** | Narcotics **High**, Jewelry Medium, Bills Medium | Yes | PPX-FENCE, PPX kitty, PCG-FENCE, G8-KITTY, G8-DRUGS | high |
| **Yasmani** | Little Cuba, Vice City (smoke shop) | Ch3 **Boobie Time** | Narcotics Medium, Jewelry **High**, Bills **High**. Also sells security-van tips ($10,000) after Ch4 | Yes | PPX-FENCE, PPX boobie, G8-BOOBIE, PCG-FENCE | high |
| **Randy** (high-end vehicles; Key Cloner cars) | Balsero, Vice City (PPX/PCG). PS says hints are at "Leonida Auto World" | Ch3 **Clonin' Keys, Makin' Gs / Steal the Zorrusso** | Advanced-Tracker supercars (Wish List) | Yes | PPX-FENCE, PCG-FENCE, G8-PRIO, PS-RANDY | high |
| Garage pickup | Your garages | PPX: after Yasmani unlocks. PCG: after 2 Payday Loan jobs for Yasmani | Choose a fence; PCG says there is a fee | Yes | PPX-FENCE, PCG-FENCE | medium |
| Bret Vogel (carcasses) | Lummox County | Ch2 (after Coffee Break, Jason) | Animals in Good/Pristine condition, about $500 to a few thousand each | Yes | GB-MONEY | medium |
| Pawnshops (collectible cards) | Hamlet, Southside, Salton, Crosstown, Rockridge… | From the start | Cards: about $20 (Standard) up to over $2,000 (Silver) | — | G8-CARDS | medium |

Notes: PCG counts "five fences for goods and two vehicle dealers", leaving out Pay 'n' Spray. Weapons can't be sold (G8-SELL). The map tooltip on each fence shows its rates (PPX-FENCE, G8-MONEY).

---

## Big purchases and costs

| Purchase | Cost | Unlock | Notes | Sources | Conf. |
|---|---|---|---|---|---|
| 8 garages (Vice City Real Estate app) | Mitchell Auto Center **$4,000**; Persistence Road **$7,600**; 7th Avenue **$12,000**; Store n' Bolt **$16,800**; Wyatt Motors **$21,600**; Vela Rota Drive **$24,000**; Bonita Court **$34,000**; Atlantic Court **$40,000**. **$160,000 total** | After Ch2 Daily Driver | All 8 → "Little Boxes" trophy. Each adds one registration slot. Max 18 vehicles = 16 garage spots + 2 personal cars | PPX-GAR, GB-PROP, PS-TR | high |
| Garage discount | 20% off all garage purchases at **BuckMe Gold** ($100,000 in Family Savings) | — | **Caution:** Family Savings money is gone for good and can't be withdrawn (PPX-TIPS, PCG-BANK). It does raise the checking limit (Gold = $500,000). G8-BUY says savings also feed the relationship and can't be lost on death | PPX-SAVE, PPX-TIPS, PCG-BANK, G8-BUY | medium |
| Family Savings tiers | $5k → $15k limit; $10k → $100k limit + 20% off RydeMe; $100k → $500k limit + 20% off garages; $500k Premium → $2M limit + 10% off liveries (auto in Ch4); $1M "Rich as Buck"; $2M final tier (perk unknown) | Story-gated | The "Save for the Future" questline | PPX-SAVE | medium |
| Heavy weapons (Expanded Ammu-Nations: Big Shots/Hamlet, Woodhatch/Capri, Phil's, Black Eagle, Iron & Oak, Prestige Firearms/Ocean Beach) | Grenade launchers **$12,000** (Hillinger Boomer) and **$15,500** (Deever Tech GLR40); rocket launcher **$16,000** (Hauners H-AT); snipers **$950–$3,975**; Shrewsbury SMS-01 **$2,150** after Bret's 9th hunt | Chapter not stated | PPX says "5 expanded" stores but lists 6 names | PPX-GL, PPX-SNIPER | medium |
| Register Vanessa's Growler | **$29,450** (or sell it for $20,500/$20,600) | Ch3 laptop | Missable | G8-MISS, G8-CARTEL | medium |
| Yasmani security-van tip | **$10,000** | Ch4 end | — | PPX-MONEY | medium |
| Car registration and mods | Not stated. Game8 warns registering can cost "a hefty sum" | — | Mod shops specialise by vehicle type; there are 14 | G8-BUY, PPX-MOD | low |
| Properties or businesses to buy | **None besides garages.** GB says garages are the only purchasable properties; safehouses come from the story | — | No business or empire system was found | GB-PROP | medium |

---

## Unique vehicles, weapons and equipment from Ch3 on

| Item | Where / when | Missable? | Sources | Conf. |
|---|---|---|---|---|
| Cut-Off Tool | Ch3 Meet the Heders | No | PPX, GRD-EQUIP | high |
| Snap Gun | Ch3 Yasmani's Jewelry Jobs (timing conflicts; see Conflicts) | No | PPX, GB, G8-PRIO, GRD-EQUIP, PCG-SNAP | high (Ch3 Yasmani) |
| Key Cloner | Ch3 Clonin' Keys (about 40 hours in, per PPX) | No | PPX-KEYCL, GRD-EQUIP, G8-PRIO | high |
| Dye Pack Jammer | Ch3 Credit Check | No | PPX, GRD-EQUIP | high |
| Yago's car | Ch3 Brother to Brother | Not stated | PPX, GB | medium |
| '32 Hustler | Ch3 Dubious Provenance part 3 (main) | — | PPX | medium |
| Vanessa's Growler (Standout) and a free garage | Ch3 apartment laptop | **Yes** (Ch4 Ocean Beach) | G8-MISS, G8-CARTEL | medium |
| Mamba GT | ¡Dale Mamba! (Randy) | No | PS-RANDY, G8-RANDY | high |
| Cellerica Cap / Manifestick | Ch3 Andy 1 | — | PPX | medium |
| Pete's KZ-59 Assault Rifle (unique) | Ch4 Passing the Torch, on the hangar table | Not stated | PPX | medium |
| Francisco's LMG-6 variant | Ch4 VCIA Takedown (main), if you pick it up | Likely during that mission only | PPX | medium |
| Company Cars (one each) | Ch4 Company Cars | — | PPX | medium |
| Felipe's vehicle | Ch4, if you spare Felipe | **Yes** (Bad Driver! expires at Power Play) | PPX | medium |
| Unique weapon variants and luxury watches | "Key valuables" at gang operations | Respawn | PPX-GANG | medium |
| Tank / fighter jet | Mile Zero Air Station (Mariana). Tank = 3 stars, can't be garaged, "Challenging Tank" trophy. Jet = 4 stars plus 2 pursuing jets. No chapter gate stated | No | PPX-TANK, PPX-JET | medium |
| Parachute | Any Ammu-Nation ("Equipment") | No | PPX-PARA | medium |

**Time-limited or missable, all of Ch3+ in one list:** Race Against Yago (hourglass). Vanessa's laptop garage and car, and Y Hotel driveway car theft (until Ch4 Ocean Beach). Bad Driver! (until Power Play) and with it Felipe's Gift. Pick up Shayna (limited window in Ch4). None of these affect trophies or 100% (PPX-TROPHY, GB).

---

## Spoiler-sensitive titles (flag for the Public* boundary)

- **Side content:** "Bad Driver! (Find Felipe)" and "Collect Felipe's Gift" reveal what happened with the Cartel Heist crew. "Brother to Brother": the title is safe, but every guide description reveals Yago's death and secret. "Buddy?": the title is safe, the content is not. "Puff Puff Pass" and "Read the Label" hint at the Cellerica drug twist. "The Last Mile: Passing the Torch" and Push Square's "Over and Out" mildly hint at Pete's arc. "This is a Free Call From…" implies a prison release.
- **Main titles near side content (guard them in money tips):** "Starting From Zero" (frozen accounts), "Tie Up Loose Ends", "Sunset", "Rafa's Kidnapping", "Child's Play (Rescue Rafa from Kidnappers)", "Protective Custody", "The End of the Road", "Unfinished Business", "Honest Abe (Negotiate a Deal with Abe)", "Pay Abe's Fee" (reveals new identities, per its description).
- **Safe to show:** the names of activities and tools (Key Cloner, Snap Gun, bank vaults), with unlock text worded neutrally, e.g. "after a late Chapter 4 optional mission from Yasmani".

---

## Conflicts

1. **When bank vaults unlock:** PPX-FENCE says Chapter 5. PPX-MONEY, PPX-BANK, PPX-100, PPX-TROPHY and GB-MONEY all say **end of Chapter 4, after That's Where The Money Is…**. Game8 says large banks "can be accessed in Chapter 3", but are fully open only after that mission. **Use the end of Ch4.**
2. **When small banks unlock:** PPX-FENCE says "Chapter 3", which matches every other source's **Credit Check** (Dye Pack Jammer).
3. **Size of Randy's Wish List:** PPX-MONEY says **18**, PPX-TROPHY says **16** (and lists 16, counting the Zorrusso), Game8 lists **21** cars (Mamba included), and Push Square says **22** (Mamba added via ¡Dale Mamba!). **Unresolved.** Show "about 20", or no number at all.
4. **Randy payouts:** PPX says usually $30k+ in perfect condition, and GB says upward of $30k. Game8 says $5k–$30k, and "some over $20k".
5. **When you get the Snap Gun:** PPX says after delivering the first jewelry job's item, and GB says as soon as you deliver the first item. Game8 says after **2 of 3** stores. GRD says "during Boobie Time", but its equipment list puts it in Yasmani's Jewelry Jobs. PCG says "after the jewelry heist in Dubious Provenance". **Majority: during or after Yasmani's Jewelry Jobs.**
6. **Classification of Yasmani's Jewelry Jobs:** PPX calls it a main mission (#53). GB, Game8 (G8-PRIO) and PS's lists treat it as optional.
7. **Kitty Litter Labs:** Game8 and PS count it as a Ch3 **main** story mission. PPX and GB treat Take Out Kitty Litter as an optional Tyrone strand.
8. **Who can play Join a Street Race:** PPX says Jason. GB says Lucia and Jason.
9. **Race Against Yago and 100%:** GB's text says it isn't required for 100%, but its own info box says "Required for 100%: Yes". It is also **unclear whether missing it blocks Brother to Brother**: GB says Brother to Brother needs both earlier missions, while PPX says only "previous missions". Not verified; advise doing it the moment it appears.
10. **Pilot Pete mission names:** PPX and GB use Pete's Deliveries: Southpoint Airfield / Avery Allen & Co. / Deliver Packages. Push Square uses **Hostile Takeover / Stormy Weather / Over and Out**. These may be map names versus in-mission titles (PPX-FULL notes that the two differ). Unresolved.
11. **Where Backseat Pilot starts:** GB says Wild Hog Airfield (Kelly). PPX's header agrees, but its body text says "return to the Gellhorn airfield".
12. **Pay 'n' Spray car value:** PPX says about $4,000+ for a good Standard-Tracker car. Game8 says Pay 'n' Spray pays "considerably less".
13. **Garage pickup unlock:** PPX says after Yasmani unlocks. PCG says after 2 Payday Loan jobs for Yasmani, with a fee.
14. **Dealer's Choice money:** G8-CH3 says Cut gives more cash. G8-DEALER and PPX say $1,500 either way. **Use $1,500 either way.**
15. **Vanessa's Growler sale price:** $20,500 (G8-MISS) vs $20,600 (G8-CARTEL), both Game8.
16. **Narcotics fenced target (100%):** PPX-100 and PS-100 say $100,000, but PPX's cocaine-flamingo note says "$200,000".
17. **Race Challenge gold medals needed (100%):** PPX says 10 of 13. PS says "30". PS looks wrong, since only 13 exist.
18. **GRD-SIDE** says the Key Cloner comes in **Chapter 4** (for yachts). Every other source says Ch3 Clonin' Keys. Treat GRD-SIDE as unreliable.
19. **Expanded Ammu-Nations:** PPX says "5", but lists 6.
20. **Ch2 Coffee Break BuckMe "Silver" (from the earlier pass) vs PPX-SAVE tiers:** PPX-SAVE names the $10k tier "BuckeDry" ($100k limit). Possibly the same tier under another name.

## Not found (this pass)

- The unlock conditions and payouts for **Yasmani's ATM Jobs, Yasmani's Payday Loans Jobs and Tail the Security Van**. GB has stubs only and PPX has no pages.
- **Dunk's Robbery Tips**: any detail at all.
- **Papa Audacity** strand (4 titles): chapter, unlock and rewards. Push Square only.
- **Kenton "Maritime Disputes"**: unlock and reward.
- **Collect Felipe's Gift**: location and the vehicle.
- **The Ch5 "Pay Abe's Fee" amount**, and whether frozen bank money comes back after Operation Savage Glory.
- Whether **That's Where The Money Is…** ever expires (it is not marked missable, and vaults are needed for 100%).
- Exact number of labs needed to trigger Spin On This.
- Costs for the winch, mod-shop upgrades and vehicle registration (beyond the Growler).
- Payouts for demolition derbies and races after Ch2. GB-MONEY gives $3,800–$6,300 for an Ambrosia derby win, without a chapter.
- Any purchasable business or property besides garages (GB says there are none).
- Game8's Optional Missions table for Ch3+ (it currently stops at Ch2). GameRant was unreachable.
