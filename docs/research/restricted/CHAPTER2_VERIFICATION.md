# GTA VI: Chapter 2 verification pass (RESTRICTED: research only, contains spoilers)

- Date checked for every row: **2026-11-21** (launch +2 days).
- Method: pages were opened directly with `curl` (the WebFetch tool still failed DNS for these hosts). Raw HTML is saved in `scratchpad/research/raw/`, extracted text in `scratchpad/research/txt/`. All wording below is my own paraphrase.
- Confidence: **high** = official, or 2+ independent reputable pages that I actually read agree. **medium** = one reputable page read directly. **low** = anything else.
- **Independence caveat:** GTABase's mission pages often follow PowerPyx's wording and structure closely, sometimes nearly sentence for sentence (for example Breakfast Run, Slam Dunk, Impounded Vehicle and Checking Out). So when the only agreement is PowerPyx + GTABase, treat it as about 1.5 sources. Rows where that matters say so.
- **Unreachable this pass:** trueachievements.com and psnprofiles.com (Cloudflare 403 to curl, even with browser headers); support.rockstargames.com (the connection failed). The Rockstar Newswire article only gives its title: the body is rendered by JavaScript.

## Pages actually read (title, URL)

| Key | Page title | URL |
|---|---|---|
| PS-CH | GTA 6: Chapters & Story Missions (WIP) | https://www.pushsquare.com/guides/gta-6-chapters-and-story-missions |
| PS-MO | GTA 6: Moses Vehicle Drop-Off Locations | https://www.pushsquare.com/guides/gta-6-moses-vehicle-drop-off-locations |
| PS-TR | GTA 6: Trophy Guide & Roadmap | https://www.pushsquare.com/guides/gta-6-trophy-guide-and-roadmap |
| PPX-FULL | GTA 6 Full Walkthrough – All Missions | https://www.powerpyx.com/gta-6-full-walkthrough-all-missions/ |
| PPX-[slug] | "GTA 6 <Mission> Walkthrough" (one page per mission) | https://www.powerpyx.com/gta-6-<slug>-walkthrough/. Slugs read: whats-in-the-bag, take-care-of-jason, overnight-charges-see-linda-the-manager, just-moved-in, girls-trip-find-painkillers, pick-up-a-gun, moses-take-a-vehicle-to-moses, new-look, how-do-i-look, painkiller-supplier, ambulance-chaser-move-the-ambulance, behind-on-payments, slam-dunk, daily-driver-steal-the-crawler-for-moses, breakfast-run-check-on-jason, coffee-break, thrillbillies-check-out-the-mud-club, twist-wrist-smash-grab-join-billy-on-a-job, hit-avery-pawn, hit-kingpin-bowling, impounded-vehicle, prepare-for-vice-city, veteran-hunted-meet-bret, afternoon-delight-rob-vickis-boss, checking-out-move-to-vice-city, steal-vehicles-for-moses, collect-moses-gift, check-out-mckittrick-farm, collect-chemicals-for-kyle, buddy-check-on-kyle |
| PPX-MONEY | GTA 6 Money Guide – How to Get Money Fast | https://www.powerpyx.com/gta-6-money-guide-how-to-get-money-fast/ |
| PPX-FENCE | GTA 6 All Fence Locations (How to Fence Stolen Goods) | https://www.powerpyx.com/gta-6-all-fence-locations-how-to-fence-stolen-goods/ |
| PPX-RACE | GTA 6 All Unique Race Locations (Racing Activities) | https://www.powerpyx.com/gta-6-all-unique-race-locations-racing-activities/ |
| PPX-TROPHY | GTA 6 (Grand Theft Auto VI) Trophy Guide & Roadmap | https://www.powerpyx.com/gta-6-grand-theft-auto-vi-trophy-guide-roadmap/ |
| PPX-SF | GTA 6 All Strangers & Freaks Side Missions | https://www.powerpyx.com/gta-6-all-strangers-freaks-side-missions/ |
| PPX-GAR | GTA 6 All Garage Locations | https://www.powerpyx.com/gta-6-all-garage-locations/ |
| G8-CH1 | Chapter 1 Walkthrough and All Missions (upd. Nov 21, 2026) | https://game8.co/games/GTA-6/archives/638816 |
| G8-CH2 | Chapter 2 Walkthrough and All Missions (upd. Nov 21, 2026) | https://game8.co/games/GTA-6/archives/638834 |
| G8-MOSES | Moses Walkthrough (upd. Nov 20) | https://game8.co/games/GTA-6/archives/638877 |
| G8-BR | Breakfast Run Walkthrough (upd. Nov 20) | https://game8.co/games/GTA-6/archives/639067 |
| G8-CB | Coffee Break Walkthrough and Lucia's Suggestions (upd. Nov 20) | https://game8.co/games/GTA-6/archives/638890 |
| G8-CO | Checking Out Walkthrough (upd. Nov 20, marked WIP) | https://game8.co/games/GTA-6/archives/639072 |
| G8-MISS | Missables and Points of No Return (upd. Nov 21) | https://game8.co/games/GTA-6/archives/638531 |
| G8-TR | List of All Trophies and Achievements (upd. Nov 18) | https://game8.co/games/GTA-6/archives/638536 |
| GB-LIST | GTA 6 Missions List: Story Mode Guide & Walkthrough | https://www.gtabase.com/gta-6/missions/ |
| GB-[slug] | "<Mission> \| GTA 6 Mission Guide & Walkthrough" | https://www.gtabase.com/gta-6/missions/<slug>. Slugs read: whats-in-the-bag, overnight-charges, girls-trip, moses, painkiller-supplier (its page title is **"Got Pills?"**), daily-driver, slam-dunk, breakfast-run, coffee-break, thrillbillies, twist-wrist-smash-grab, hit-avery-pawn, hit-kingpin-bowling, impounded-vehicle, prepare-for-vice-city, afternoon-delight, checking-out |
| GB-MONEY | How to Make Money Fast in GTA 6: 8 Best Methods (Nov 20) | https://www.gtabase.com/gta-6/articles/how-to-make-money-fast-in-gta-6 |
| GB-SAFE | How to Keep Your Money Safe in GTA 6: BuckMe & Family Savings (Nov 19; guest author) | https://www.gtabase.com/gta-6/articles/how-to-keep-your-money-safe-in-gta-6 |
| GB-FENCE | GTA 6 Fence Locations: All 7 Fences & What They Buy (Nov 19; guest author; mixes in pre-release Edge/Famitsu material) | https://www.gtabase.com/gta-6/articles/gta-6-fence-locations-all-fences-what-they-buy |
| GB-MOSESCHAR | Moses \| GTA 6 Characters Guide, Bio & Voice Actor | https://www.gtabase.com/gta-6/characters/moses |
| GR-MISS | All Chapters & Main Story Missions in GTA 6 (Nov 19) | https://gamerant.com/gta-6-main-story-missions-chapters-list/ |
| GR-SELL | How to Sell Stolen Cars in GTA 6 | https://gamerant.com/how-to-sell-vehicles-gta-6/ |
| GR-FENCE | Where to Sell Stolen Goods After Brian Retires in GTA 6 | https://gamerant.com/gta-6-where-to-sell-stolen-goods-after-brian-retires/ |
| PCG-MISS | GTA 6 mission list: All chapters and missions (Nov 18) | https://www.pcgamer.com/games/grand-theft-auto/gta-6-mission-list/ |
| PCG-BANK | Bank your cash in GTA 6, but always keep a few hundred on you… | https://www.pcgamer.com/games/grand-theft-auto/gta-6-bank-cash/ |
| GRA-BUCK | GTA 6 money management and BuckMe Bank explained | https://www.gamesradar.com/games/grand-theft-auto/gta-6-money-buckme-bank-account-manage/ |
| RS-OUT | Grand Theft Auto VI: Out Now | https://www.rockstargames.com/VI/out-now |

---

## 1. Chapter 2 mission order, names, required/optional, unlocks

### 1.1 Chapter 2's title is "Paradise Lost"
- Read: G8-CH2, GR-MISS, PCG-MISS, GB-LIST. Confidence: **high**.
- What they say: all four name Chapter 2 "Paradise Lost" and Chapter 1 "Just Like Paradise".
- Note: there is also a trophy called "Paradise Lost", but it is for *completing Chapter 1*. It unlocks during What's in the Bag? (PPX-TROPHY, G8-TR, PS-TR, GB-whats-in-the-bag). Don't confuse the chapter title with the trophy.

### 1.2 Required main-mission spine of Chapter 2 (the main missions every list agrees on)
- Read: G8-CH2, PCG-MISS, GR-MISS, PS-CH, GB-LIST, PPX-FULL. Confidence: **high** for the set of names, **medium** for the exact order.
- Order shown on the consumer lists (Game8, PC Gamer, GameRant, Push Square): What's in the Bag? → Ambulance Chaser → Just Moved In → Girls' Trip → Moses → Daily Driver → Slam Dunk → Breakfast Run → Coffee Break → Afternoon Delight → Checking Out. PC Gamer lists exactly these 11 as Chapter 2's main missions.
- Order shown by PowerPyx and GTABase, which also list the small steps:
  - **GTABase (numbered #26–#43):** What's in the Bag? → Ambulance Chaser → Play Nurse → Overnight Charges → Just Moved In → Girls' Trip → (opt. Pick Up a Gun) → Moses → New Look → How Do I Look? → Got Pills? → Daily Driver → Behind on Payments → Slam Dunk → Breakfast Run → Coffee Break → (opt. Thrillbillies, Twist Wrist Smash Grab, Hit Avery Pawn, Hit Kingpin Bowling, Impounded Vehicle) → Prepare for Vice City → Afternoon Delight → Checking Out.
  - **PowerPyx:** similar, but puts Ambulance Chaser after Painkiller Supplier, and Daily Driver *after* Slam Dunk (PPX mission #38, Slam Dunk #37). PPX-FULL says up front that missions can show up in a slightly different order, and that order doesn't matter as long as you keep doing what is available.
- **Gating that the pages actually state:**
  - Ambulance Chaser and Just Moved In each need only What's in the Bag? (PPX).
  - Overnight Charges needs only What's in the Bag? (PPX).
  - Girls' Trip needs Overnight Charges and Just Moved In (PPX, GB).
  - Moses, New Look, How Do I Look?, Pick Up a Gun and Painkiller Supplier each need Girls' Trip (PPX, GB, G8-MOSES "previous mission").
  - Daily Driver needs only Moses. Moses texts a photo of the car shortly afterwards (PPX, GB).
  - Behind on Payments needs Overnight Charges (PPX).
  - Slam Dunk needs all earlier Chapter 2 main missions done, then two calls from Dunk (PPX, GB).
  - So **Daily Driver is not a stated hard prerequisite of Slam Dunk or Breakfast Run.** It is just listed among the missions that make the calls come sooner. Treat its place before Breakfast Run as typical, not enforced.
- Expiry: all of these are main missions and auto-required. Nothing here is missable.

### 1.3 Spelling of "Girls' Trip"
- Read: PPX, G8-CH2, GB-girls-trip, PCG-MISS, PS-CH, GR-MISS. Confidence: **high** that the second word is "Trip". The apostrophe is **conflicting**.
- What they say:
  - "Girls' Trip": GTABase, PC Gamer.
  - "Girl's Trip": PowerPyx, Game8.
  - "Girls' Trap" (Push Square) and "Girl's Trap" (GameRant): almost certainly typos, because three other sites and every mission description are about a trip to find painkillers.
- Recommendation: display **"Girls' Trip"**. Two reputable sites use it, and it is the grammatical form. Flag the apostrophe as unconfirmed against the in-game card.

### 1.4 "Overnight Charges" is a real mission
- Read: PPX-overnight-charges, GB-overnight-charges, GB-LIST. Confidence: **high**.
- What they say: it is a short main step at the start of Chapter 2. Lucia sees Linda, the manager, at the Starlet Motel front desk about the room bill. If Jason bought Lucia the necklace in Chapter 1, she hands it over as collateral. GTABase adds that Linda wants $900 (rent plus 10%), and that Lucia starts Chapter 2 with only about $146.
- Follow-up: **Behind on Payments** (pay Linda $900, which also gets the necklace back) unlocks after Overnight Charges (PPX, GB). It is a main step.
- Availability: right after What's in the Bag?. No expiry stated.
- Not on the Game8, PC Gamer, GameRant or Push Square lists, which leave out the small steps.

### 1.5 "Painkiller Supplier" is real, but its name conflicts
- Read: PPX-painkiller-supplier, GB-painkiller-supplier (page title "Got Pills?"), GB-LIST. Confidence: **high** that the step exists, **conflicting** on its name.
- What they say: both describe a waiting quest with no map marker, which appears after Girls' Trip. Dunk calls after a few in-game days. After that first call the entry changes to "Dunk Will Be in Touch", and a second call unlocks Slam Dunk.
  - PowerPyx calls the step "Painkiller Supplier".
  - GTABase calls it **"Got Pills?"**, and adds that calling Dunk yourself may trigger Slam Dunk sooner.
- Recommendation: don't show either name as canonical in player-facing text. Describe it as "wait for Dunk's call".

### 1.6 Other small Chapter 2 steps
- Read: PPX, GB-LIST.
- What they say:
  - Take Care of Jason / "Play Nurse": a background objective that completes on its own after Breakfast Run. PowerPyx says "Play Nurse" only shows on the pause screen; GTABase uses it as the title.
  - New Look: buy a haircut at the Pearl House salon.
  - How Do I Look?: buy a top and pants, for example at Bargain World.
  - Pick Up a Gun: optional, at Gellhorn Outfitters (Ammu-Nation).
- Confidence: **high** (PPX + GB). Expiry: none stated.

### 1.7 Coffee Break: unlock and what it opens
- Read: PPX-coffee-break, G8-CB, GB-coffee-break. Confidence: **high**.
- Unlock: it starts straight after Breakfast Run. All three agree.
- What it does:
  - Wyman points the couple to the Mud Club.
  - They buy a coffee for $2 in the motel kitchen and plan the next move.
  - Four jobs are then all marked at once and can be done in any order: Impounded Vehicle, Hit Kingpin Bowling, Hit Avery Pawn, and Thrillbillies (Mud Club). Game8 says choosing one does not lock out the others.
  - Free switching between Jason and Lucia, and the partner menu, unlock here.
- Rewards (G8-CB, GB): BuckMe is upgraded to Silver, with a $100,000 checking limit. Game8 lists a $2,000 BuckMe reward; GTABase makes the $2,000 interest conditional on having reached the Chapter 1 Family Savings goal of $5,000. GTABase also lists 20% off RydeMe.
- Minor conflicts:
  - GTABase's Breakfast Run reward list also says "character switching unlocked". Three pages put it at Coffee Break.
  - PowerPyx's Coffee Break page says "you will have to do all of them anyway", yet its own pages for those jobs label them optional.

### 1.8 Required vs optional after Coffee Break: CONFLICT
- **Afternoon Delight is required.** Every source treats it as a main mission (PPX #42, GB #42 "Mandatory", G8-CH2, PCG-MISS, GR-MISS). Confidence **high**.
  - Unlock: some time after Coffee Break, Vicki calls (a group call). PowerPyx says to clear the other pending main quests first.
  - Reward: $10,000 via BuckMe the next day (PPX, GB). GTABase adds at least about $1,800 in cash picked up during the mission.
  - Safe code: 2008 (PPX, GB).
  - The dance / don't-dance choice affects only this mission (GB, PPX).
- **Prepare for Vice City** is listed as a main step (PPX #41, GB #41 "Mandatory"). It is a passive objective that unlocks after Coffee Break. See 4.4.
- **Thrillbillies and Twist Wrist, Smash, Grab: conflicting.**
  - Optional: PowerPyx (Billy's optional Strangers & Freaks chain; it does not count toward the S&F trophy), GTABase ("Optional (Side Mission)"), GameRant ("optional"). PC Gamer leaves both out of its main list.
  - Required: **Game8** says that, after Coffee Break, only Thrillbillies, Twist Wrist Smash Grab and Afternoon Delight count as main missions needed to progress. Game8's Checking Out page also shows Twist Wrist as the "previous mission". Push Square lists both inside its Chapter 2 story list and again under Billy's side missions.
  - Verdict: most reputable sources say optional; Game8 says required. Confidence **medium** for "optional". The app should say "optional per most guides", or suggest doing them anyway because they pay well: up to $2,500 and $2,000.
- **Hit Avery Pawn, Hit Kingpin Bowling and Impounded Vehicle are optional.** PPX says "optional main mission", GB says "Optional (Side Mission)", and G8-CB says "optional missions". Confidence **high**.
- **Veteran Hunted (Bret) is optional and Jason-only.** PPX, GB-MONEY, GR-MISS. Confidence **high**. See 6.4.

### 1.9 Unlock conditions for the four Coffee Break jobs

**Thrillbillies (Check Out the Mud Club)**
- Unlock: marked automatically after Coffee Break, once Wyman mentions the Mud Club.
- What it is: buy an outfit at the merch stall, rent a Manchez or Sanchez, then race 13 others. You only need to avoid finishing last. First place pays $2,500, third about $625.
- Next: Twist Wrist, Smash, Grab, a few in-game hours later by text from Billy. It pays $2,000 and is an armored-van robbery.
- Billy's full chain: Thrillbillies → Twist Wrist, Smash, Grab → Mall Rats → The Impaler → Hometown Heroes. Finishing it earns "The Lone Rider".
- Sources: PPX + GB. Confidence **high**.

**Hit Avery Pawn**
- Unlock: after Coffee Break.
- What it is: rob the Port Gellhorn pawn shop. Breaking a display case gives a 2-star wanted level. Threatening the staff may reveal the safe code, which is randomized (PPX saw 6499, GB saw 6943). Fence the loot at Dunk's trailer.
- Sources: PPX + GB. Confidence **high**.

**Hit Kingpin Bowling**
- Unlock: after Coffee Break.
- What it is: an assault on the Kolts' bowling alley. Bring sticky bombs from Ammu-Nation for the safe. Three key valuables: the Luxury Watch (south-east room), the Gutterball Moreland 850 unique shotgun (pool table, north-east), and the safe (north-east office). Taking all three earns "Let's Go Bowling" shortly after you escape.
- Not missable: the robbery respawns weeks later (in-game), during Chapter 3.
- Sources: PPX + GB + G8-CB. Confidence **high**.

**Impounded Vehicle**
- Unlock: Lucia's car is impounded automatically after Breakfast Run. It shows as a green car icon near the Port Gellhorn police station. The job is marked after Coffee Break.
- What it is: drive through the fence; the two officers there give you 2 stars. It works as a tutorial. Later, Scooter Bros can recover impounded cars for a fee, or free with daily credits on a $12,500 premium tier.
- Sources: PPX + GB + G8-CB. Confidence **high**.
- Note: the earlier claim that "Impounded Vehicle feeds Prepare for Vice City" only means that PPX and GB list it among the recommended jobs to do while earning the $15,000. It pays nothing itself.

### 1.10 Checking Out: unlock condition
- Read: PPX-checking-out, GB-checking-out, G8-CO, G8-CH2, PPX-prepare. Confidence: **high**.
- What they say:
  - Requirement: at least $15,000 plus all available Chapter 2 main missions done.
  - Trigger: your partner phones about an article Cal sent (Game8: a text from Cal about a dead couple). The motel room is then marked, and you interact with the bathroom door to start.
  - It ends Chapter 2 and moves straight into Chapter 3's Welcome to Vice City.
  - Bug: if you die during the bike chase, Jason can vanish as an objective and the police search area may never clear. The fix is to restart the mission (PPX, GB).
- Trophy: "T\*\*s Ass Drug Money" (Complete Chapter 2) unlocks on arrival in Vice City / after Welcome to Vice City (G8-CO, PPX-TROPHY).

## 2. Breakfast Run
- Read: PPX-breakfast-run, G8-BR, GB-breakfast-run. Confidence: **high**.
- **Title:** "Breakfast Run". PowerPyx adds the map label "(Check on Jason)".
- **Before it:** you finish Slam Dunk, then wait about half an in-game day for Jason's call; doing any pending main missions helps. The motel icon then turns pink. It is started as Lucia. All three pages agree.
- **What happens:** a cutscene skips time until Jason is healed. The couple robs Hank's Waffles, then a liquor store, a thrift store, and more stores (a gas station / convenience store and another liquor store). They escape a 2-star wanted level. Timers: PPX/GB say about 1 minute per store; Game8 gives 1 min, 40 s, 40 s, 30 s, 30 s.
  - Detail conflict: Game8 adds a liquor store in Watson Bay and a botched convenience-store robbery; PPX/GB summarize these more briefly.
- **What it unlocks:**
  - The "Trust" trophy (bronze, hidden).
  - Personal vehicles. PPX: both characters get one. G8: Jason's personal vehicle. GB names Jason's Declasse Tulip.
  - Jason becomes playable again.
  - Lucia's car is impounded automatically (PPX/GB).
  - Coffee Break follows straight away (all three).
- Expiry: not missable.

## 3. Moses

### 3.1 The "Moses" mission
- Read: PPX-moses, G8-MOSES, GB-moses, GR-SELL, PPX-FENCE, GB-FENCE. Confidence: **high**.
- **Unlock:** Girls' Trip. Vicki has recommended him.
- **Flow:** drive any car into his Port Gellhorn garage. In the yard, scan three cars with WAiNK and pick up the Slim Jim. Use it on the Montagne XL. Then respray and register a car.
- **Rewards:**
  - Slim Jim.
  - Scooter Bros app.
  - An upgraded WAiNK that shows sell and register values.
  - A free registered personal car for Lucia.
  - The ability to sell untracked stolen cars to Moses and register cars with him.
- **Name:** Game8's mission info names him **Moses Watkins**. Confidence **medium**: one page read.
- **The "Mo" nickname:** GTABase's character page gives his alias as "Moses (Don't call him Mo!)". Confidence **medium**. Display "Moses"; "Mo" matches the player's shorthand.

### 3.2 Daily Driver
- Read: PPX-daily-driver, GB-daily-driver. Confidence: **high** (PPX + GB, partly derivative).
- **Unlock:** a text from Moses with a photo, shortly after the Moses mission.
- **Task:** steal the white '82 Canis Crawler by the old Traders' Union building and deliver it to Moses. Push Square's first drop-off (PS-MO) is the same car.
- **Payout: CONFLICT.**
  - PPX and the GB walkthrough text: $1,250, plus $500 if the car is in good condition.
  - GB's summary box: "up to $1,375, less if damaged".
  - Confidence **medium**. Say "about $1,250–$1,750 depending on condition, sources differ".
- **After it:** soon afterwards Moses gives you the Port Gellhorn (Station) Garage, and the Vice City Real Estate app installs for buying the 8 purchasable garages, $160,000 total (PPX, GB, PPX-GAR, PPX-TROPHY). Confidence **high**.

### 3.3 Steal Vehicles for Moses
- Read: PPX-steal-vehicles-for-moses, PS-MO. Confidence: **high** for the list, **medium** for payouts and order.
- **Unlock:** Daily Driver. Moses texts targets in batches, and each batch must be done before he sends more (PPX).
- **The six vehicles** (both sources agree on the names and locations):

| Vehicle | Location | Payout (PPX only, plus a condition bonus) |
|---|---|---|
| Declasse Yosemite 1500 | Bastion St, SW Port Gellhorn; being towed | $1,850 |
| Karin Futo | lockup on Draper Island docks | $1,500 |
| Annis Hellion | Orchard Ave, south Port Gellhorn; a dog in the yard | $1,400 |
| BF Bandito | Buckskin Swamp, SE Kelly County; single-seat car | $3,350 |
| Declasse Vamos | shed near Grayson (Lummox County); keypad code 2727 in both sources | $4,200 |
| Western Nightblade | Final Chapter MC compound in Ambrosia | $6,310 |

- **Count:** Push Square counts 7 drop-offs because it includes the Daily Driver Crawler; PowerPyx counts 6. The two figures reconcile.
- **Order conflict:** PowerPyx's order is the table order above. Push Square's is Crawler, Yosemite, Bandito, Hellion, Futo, Nightblade, Vamos. Don't present a fixed order.
- **Tracking:** Push Square says the menu path is Touch Pad > Robberies > Moses Drop-Offs.
- **100%:** each delivery counts as one optional task toward the 100 needed for the checklist (PPX-TROPHY).
- **Strangers & Freaks:** Moses's chain does **not** count toward the trophy (PPX-SF, PPX-TROPHY).

### 3.4 Collect Moses' Gift
- Read: PPX-collect-moses-gift, PS-MO. Confidence: **high**.
- **Unlock:** deliver all the requested cars. Moses then texts you.
- **Reward:** a unique Sultan, in the small garage next to his shop. It can be sold or registered.
  - PPX calls it "Moses' Sultan". PS calls it the "Emperor Sultan" and says registering it costs $1,600 (**medium**, PS only).

### 3.5 Selling cars to Moses
- **Tracker and proximity rule.** Confidence **high**.
  - Read: PPX-moses, PPX-MONEY, PPX-FENCE, G8-MOSES, GB-moses, GB-MONEY, GB-FENCE, GR-SELL.
  - What they say: Moses buys only cars with **no** tracker, and refuses cars stolen too close to his shop. Take them from the main road through Port Gellhorn, or a few streets away.
  - Standard-tracked cars become sellable at Pay 'n' Spray in Chapter 3. Advanced-tracked cars need the Key Cloner and Randy, also in Chapter 3.
- **Payout per car.** Confidence **medium**: "about $1,000 or more", and no source gives a range.
  - Read: PPX-MONEY ("typically $1000+"), GB-MONEY ("around $1,000 or more depending on model and condition").
  - Damage lowers the payout (GB). You can check a car's value with WAiNK or by hovering over Moses's map icon (GR-SELL, GB-MONEY).
  - GameRant says the money goes to BuckMe.
- **Cooldown: still CONFLICTING.**
  - PowerPyx Moses page: the garage is closed 1–2 minutes after each sale. PowerPyx money guide: about 2 minutes. GTABase Moses page: "a minute or two". GTABase money guide: just "a short cooldown".
  - GameRant: "a few in-game hours".
  - Those can be the same wait if one in-game hour is about one real minute (as in past GTA games). **No page states GTA VI's time scale**, so this stays unresolved. Recommended wording: "a short wait between sales (a couple of minutes, per most guides)".
- **Daily cap:** not mentioned on any page I read. **Unverified.**
- **Registration fee.** Confidence **medium**.
  - Read: G8-MOSES, PPX-moses, PPX-TROPHY, GB-slam-dunk, PS-MO, GB-FENCE.
  - What they say: the first registration in the Moses mission is free (G8, GB). Later ones cost money, and the price varies by vehicle. WAiNK shows the cost.
  - Example costs: GB gives $6,400 / $8,000 / $7,400 for three cheap cars, PS gives $1,600 for the Sultan, and G8 gives $29,450 for a Chapter 4 car.
  - PowerPyx's "usually a couple thousand dollars" conflicts with GB's examples. **Don't publish a single fee.** Registering more cars also needs garage slots (PPX).

## 4. Money in Chapter 2

### 4.1 Methods available in Chapter 2
- Read: PPX-MONEY, GB-MONEY, mission pages.
- **Selling cars to Moses** is the best repeatable earner in Chapter 2. Both guides agree. Confidence **high**.
- **Other methods:**
  - Mugging and robbing store registers (PPX new-look / behind-on-payments). Confidence **medium**.
  - Robbing criminals caught mid-crime: GB says $1,000–$15,000, and the chapter isn't stated. Confidence **medium**.
  - Gang Operations and races (PPX lists them under Chapter 1, so they presumably continue).
  - Hunting for Bret after Coffee Break, Jason only: $500 to a few thousand per animal (GB-MONEY). Confidence **medium**.
  - Demolition Derby at Ambrosia Raceway: GB says $3,800–$6,300, **with no chapter stated**. Ambrosia is reachable in Chapter 2 (the Nightblade is there), but availability is not confirmed.
- **One-time mission money in Chapter 2:**
  - Girls' Trip: the $50 comes back from Vicki.
  - Daily Driver: about $1,250 + $500.
  - Slam Dunk: $1,700 from Dunk the next day, plus about $1,000 from looting Dr. Bill.
  - Thrillbillies: up to $2,500.
  - Twist Wrist, Smash, Grab: $2,000.
  - Veteran Hunted: $500.
  - Check Out McKittrick Farm: $400.
  - Collect Chemicals for Kyle: $1,000.
  - Afternoon Delight: $10,000.
  - Coffee Break: $2,000 interest, conditional.
  - Moses's six cars: about $18,610 total, per PowerPyx only.
  - Confidence: **medium**. Most are PPX + GB, but GB is partly derivative.
- **PowerPyx advice:** don't grind money in Chapter 2. Chapter 3 opens far better methods.

### 4.2 Dunk (the Port Gellhorn fence)
- Read: PPX-slam-dunk, GB-slam-dunk, PPX-FENCE, GB-FENCE, GR-FENCE. Confidence: **high** for the unlock and goods, **medium** for rates.
- **Unlock:** Slam Dunk. The next day he also marks 2 robbery locations (PPX, GB).
- **What he buys:** narcotics, jewelry and marked bills, the same as Brian (GR, GB, PPX).
- **Rates** (PPX map tooltips): narcotics Low, jewelry Low, marked bills Very Low. GB says low across the board. Exact dollar prices: **none published**. Fences show their rates when you hover over the map icon (PPX, GB).
- **How to sell:**
  - GameRant: drop the bag in the trunk of a broken-down car behind his trailer, and the cash arrives in your mailbox.
  - PowerPyx and GTABase instead describe pay-out to the bank or BuckMe after the drop-off.
  - Minor conflict; GameRant's page also has an obvious error about Chapter 1.
- **Availability:** PowerPyx says Dunk becomes temporarily unavailable during the story but is still available after it.
- Brian and Donnie, the Chapter 1 fences, are gone (PPX, GR).

### 4.3 Pocket cash, BuckMe and death or arrest
- **Pocket cap:** $20,000 per character. Confidence **high** (GB-SAFE, PCG-BANK, GRA-BUCK).
- **Loss on death or arrest: CONFLICT.**
  - GB-SAFE: you lose **all** pocket cash, plus a small BuckMe fee and probably any stash bags you carry.
  - GRA-BUCK: **all** pocket cash.
  - PCG-BANK: a penalty of "a few hundred dollars".
  - Majority: all pocket cash. Confidence **medium**. Advise banking often either way.
- **Loot:** loot not yet fenced is lost if you are wasted or busted (GB-MONEY, GB-SAFE). Bags in your own car's trunk can be recovered even if the car is impounded (PCG-BANK); GB-SAFE warns that bags in the trunk can still be lost if you don't shake the cops. Confidence **medium**.
- **Cash vs BuckMe purchases:** purchases over about $1,000 come from BuckMe automatically (GB-SAFE says up to $999 in cash; GRA-BUCK says $1,000). Confidence **high** that the threshold is about $1,000.
- **Shared or separate money: resolved.**
  - GRA-BUCK: Jason and Lucia each have their own checking account and pocket cash.
  - Family Savings is shared and one-way: money cannot be withdrawn (GRA-BUCK, GB-SAFE, PCG-BANK "joint savings").
  - Confidence: **high** for shared savings, **medium** for separate checking accounts (GamesRadar only).
- **Checking limit:** once checking reaches its limit, new income is held as pending (GRA-BUCK, GB-SAFE). The Silver upgrade at Coffee Break raises the limit to $100,000 (G8-CB, GB-coffee-break).

### 4.4 "Prepare for Vice City": the $15,000 requirement
- Read: PPX-prepare, GB-prepare, G8-CO, G8-CH2, GB-SAFE, GB-LIST FAQ. Confidence: **high**.
- **What they say:** a passive objective that appears after Coffee Break: have at least **$15,000** while Dre'Quan arranges a place in Vice City. A while after reaching $15,000 *and* clearing the other main missions, the motel room is marked for Checking Out.
- **What counts toward the $15,000: unclear.**
  - PPX: "make at least $15,000"; GB: "earning at least $15,000 (keep it safe in BuckMe)"; G8: "owning at least $15,000".
  - No page says whether it counts BuckMe only, BuckMe plus pocket cash, or one character or both. **Unverified.** Advise keeping $15,000+ in BuckMe.
- Expiry: required before Chapter 2 ends.

## 5. Missables and the point of no return

### 5.1 Checking Out is Chapter 2's point of no return
- Read: PPX-checking-out, GB-checking-out. Confidence: **high** (PPX + GB).
- What they say: starting Checking Out ends Chapter 2 and permanently removes the Starlet Motel as your home.

### 5.2 What to do before Checking Out
- **Empty your personal cars' storage:** **medium**, from G8-CO only. Game8 says to take everything stored in your personal cars before starting, because the cars get impounded after the mission. PowerPyx and GTABase's Checking Out pages **do not mention** the impound.
- **Sell loot to Dunk first:** **not stated on any page read.** This is inference: Dunk stays in Port Gellhorn, and PPX says he is temporarily unavailable during the story. Present it as a tip, not a sourced fact.
- **Make a manual save:** PPX-FULL, PPX-TROPHY and GB-LIST recommend a manual save at the start and end of each chapter, because there is no mission replay. PS-CH agrees there is no replay. Confidence **high**.
- **Motel collectible card:** G8-CB notes a lootable Victor Marabilla collectible card on the motel kitchen fridge. That is one reputable page, so **medium** that it exists there. No page read says it becomes missable at Checking Out; PPX-TROPHY says collectibles and 100% items are not missable. The "Delights Dancers Vicki card in the office bathroom" claim is still **unverified**, from low-quality sites only.

### 5.3 Game8's missables page
- Read: G8-MISS (upd. Nov 21, spoilers to the start of Chapter 4).
- What it says: it lists Swamped (Donnie's drop-off lost), Don Gone (Donnie's H&L .38 revolver), Tourist Trap (the Chapter 1 point of no return), the McKittrick Farm soft-lock, and Ocean Beach (Chapter 4).
- **It does not list a Chapter 2 / Checking Out entry.** The Checking Out car warning appears only on G8-CO.

### 5.4 McKittrick Farm soft-lock: CONFLICT on impact
- Read: G8-MISS (warning), PPX-check-out-mckittrick-farm and PPX-TROPHY (no warning).
- What Game8 says:
  - If Kyle dies or the crop duster crashes during Check Out McKittrick Farm, the rest of the questline can soft-lock: Collect Chemicals, Buddy?, the S&F trophy credit and a Red Hulk easter egg.
  - Advice: keep several saves.
  - Workaround: go back and steal the plane, after which Kyle texts the next job. Game8's wording ("which has been fixed") is ambiguous: it could mean a patch fixed the bug or that the workaround was fixed.
- What PowerPyx says instead: Strangers & Freaks are **not** needed for 100%, and nothing toward 100% is missable. That contradicts Game8's claim that the soft-lock blocks 100%.
- Confidence: **medium** that the risk exists (one page); **conflicting** on whether it affects 100%. Advise: save before the crop-dusting flight.

### 5.5 Tourist Trap (Chapter 1 point of no return), for context
- Read: G8-MISS, GB-SAFE. Confidence: **high**.
- What they say: you lose pocket cash, BuckMe checking, the floor stash, the Key Lento house and your personal cars, and Jason's fitness takes a temporary hit. You keep Family Savings (up to $5,000), the relationship level and unique weapons. GB adds that pocket cash brought into Recalibration is also lost.
- Expiry: already passed for this player.

### 5.6 Missability in general
- Read: PPX-TROPHY, PPX-FULL, GB-LIST, PS-TR.
- What they say:
  - No mission replay; story missions can't be replayed (PS-CH, GB).
  - Time-sensitive optional missions show an hourglass icon. PPX and GB say none are needed for trophies or 100%.
  - The only potentially missable trophy is Positive Mental Attitude, because of the Chapter 1 meditation. PPX is unsure it is required; PS-TR says "none known yet".
  - Shirley's two missions are exclusive to Chapter 1 (PS-CH, PPX).
- Confidence: **high**.

## 6. Chapter 2 side activities around Port Gellhorn

### 6.1 Gellhorn International Raceway and "Keep it PG"
- Read: PPX-RACE. Confidence: **medium**, PowerPyx only.
- What it says: the raceway is in Kelly County, south of Port Gellhorn. Its introduction race unlocks the 5-race amateur series "Keep it PG". Placing in those unlocks more races, 11 unique races in total. There are 40 unique races overall: winning 20 earns "Earn Cash, Not Kudos", and 30 are needed for 100%. Races charge an entry fee plus vehicle rental.
- **Availability in Chapter 2 specifically: not stated. Unverified.** It is geographically next to the Chapter 2 hub.

### 6.2 Thrillbilly Mud Club
- Read: PPX-RACE, PPX-thrillbillies, GB-thrillbillies. Confidence: **high**.
- What they say: North Kelly County. It is introduced by Thrillbillies after Coffee Break. 8 unique races: 6 dirt-track and 2 oval.

### 6.3 McKittrick Farm questline (Kyle)
- Read: PPX-check-out-mckittrick-farm, PPX-collect-chemicals-for-kyle, PPX-buddy, GB-overnight-charges, PPX-SF, PPX-TROPHY. Confidence: **high** for the start; the rest is PPX only.
- Kyle's questline **counts** toward the S&F trophy (PPX-SF, PPX-TROPHY).

| Step | Unlock | Reward / notes |
|---|---|---|
| Check Out McKittrick Farm | read Kyle's flyer on the wall outside the Starlet Motel reception, so it is available from the start of Chapter 2 (GB also mentions the flyer) | crop dusting; $400 |
| Collect Chemicals for Kyle | about 1 in-game day later, by text; Leonard County | the Final Chapter gang asks $5,000, but you can steal the van instead; $1,000 |
| Buddy? (Check on Kyle) | a text **in Chapter 3**, after a long delay | finishes the strand; one ending pays $5,000 |

### 6.4 Strangers & Freaks and other side content reachable in Chapter 2
- Read: PPX-SF, PPX-FULL, PPX-TROPHY. Confidence: **medium–high**.
- **Kyle:** counts for the trophy; see 6.3.
- **Bret Vogel (Veteran Hunted):**
  - Unlock: a text to Jason only, at some point after Coffee Break.
  - Place: Lummox County. Jason must go alone.
  - Rewards: $500 and the Killtelligence SM-69 rifle. It then opens hunting requests and the "Fair Game" trophy (PPX, GB-MONEY).
  - Trophy credit: PPX doesn't say whether it counts for S&F.
- **Billy:** see 1.9. Does not count for S&F. "The Lone Rider" for the full chain.
- **Moses:** does not count for S&F.
- **Carry-overs:** Kirk's Chapter 1 questline can be finished in Chapter 2. Kenton returns in Chapter 2–3 (calling Brian as Jason in Chapter 2 speeds it up).
- **Shirley:** gone after Chapter 1.
- **The trophy rule:** 8 qualifying strands are needed. PPX confirms Kirk, Kyle, Yago and Pilot Pete; the list of counted strands isn't complete yet.
- **Missing persons:** GTABase (Overnight Charges tip) says the missing-person posters at the motel reception add "Gellhorn's Missing Tourists" to the map. The serial-killer chain details are still **unverified**.

## 7. Trophies
- **Count:** 55 trophies: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze. Confidence **high**.
  - Read: PPX-TROPHY, G8-TR, PS-TR (count only).
  - Hidden trophies: **27** on both Game8 and Push Square, though the two lists differ by one entry: Game8 hides "Personal Best", Push Square hides "T\*\*s Ass Drug Money". The earlier figure of 28 came from TrueAchievements/PowerPyx excerpts; PowerPyx's page gives no hidden count, and TrueAchievements was unreachable. **Correct to 27, medium.**
- **Platinum:** "Vice Got a Price!". Confidence **high** (PPX, G8).
- **"Trust":** bronze, hidden, for completing Breakfast Run. Confidence **high** (PPX, G8-TR, G8-BR, PS-TR, GB-breakfast-run). It is story-related and can't be missed.
- **Other trophies tied to Chapter 2 content.** Confidence **high** unless noted.
  - **Let's Go Bowling** (hidden bronze): loot all 3 key valuables at Kingpin Bowling. Not missable, because the robbery respawns (PPX, GB, G8-TR, PS-TR).
  - **Paradise Lost:** completing Chapter 1; unlocks during What's in the Bag?.
  - **T\*\*s Ass Drug Money:** completing Chapter 2; unlocks on arrival in Vice City.
  - **The Lone Rider:** Billy's final mission, Hometown Heroes. **Fair Game:** hunting Bret's unique animal.
  - **Little Boxes:** buy all 8 garages ($160,000); purchasable from Daily Driver onward. **On the Spot:** register 10 vehicles with Scooter Bros; registration opens with the Moses mission.
  - **Retail Therapy** and **Hot Together:** possible from Coffee Break onward, once both characters can play together (PPX).
  - **Strangers & Freaks** (silver): 8 strands; Kyle's counts.
  - Gamerscore (GB only, so **medium**): Paradise Lost 20G, Trust 10G, Let's Go Bowling 5G.
- **Difficulty and time:**
  - PPX: 4/10 and about 200 h. PS-TR: 4/10 and 250+ h.
  - The 100% trophy is "A Long Road". PPX says 100% is only about 60% of true completion, its checklist becomes visible only after the story, and nothing for it is missable.

## 8. Chapter 1 mission list (22 titles, in order)
- Read: PS-CH, G8-CH1, GR-MISS, PCG-MISS (which redacts #18). Confidence: **high**.
- The list: Prologue; Gone Fishing; Gear Up; Just a Scratch; Lab Fees; Unwanted Attention; Pipework; Hey Arnold!; Island Dreams; Feng Shui; Coming Home; Buck Me; Clean Up After Donnie; Down to Earth; Clear Skies; Day Release; Swamped; Don Gone; Recalibration; Tourist Trap; Home Sweet Home; Discharge Time.
  - All four list these in this order. PC Gamer hides #18 (Don Gone) as a spoiler.
- **Conflicts:**
  - GTABase counts 24 main missions, because it adds Deposit Cash Into BuckMe, Save for the Future and Building a Life, and numbers Prologue as #1. It also orders some differently: Unwanted Attention and Lab Fees before Just a Scratch.
  - PowerPyx also orders the early missions differently: Lab Fees before Just a Scratch, Buck Me after Clean Up After Donnie, Day Release before Clear Skies.
  - Push Square, GameRant and Game8 list 22. Use the 22-title order for display and allow flexible order early in the chapter.
- **Free roam:** free roam as Jason opens after Gone Fishing, and most of the map is open, with some areas story-gated (G8-CH1). Confidence **medium**.

## 9. Other checks
- **Release:** the Rockstar "Out Now" page (dated November 19, 2026) says the game is out worldwide on PS5 and Xbox Series X|S. Confidence **high**, official.
- **Chapter 2 geography:** Chapter 2 jobs reach well beyond Port Gellhorn: Leonard County (Collect Chemicals), Lummox County and Grayson (Veteran Hunted, Vamos), Ambrosia (Nightblade), and an airstrip south-west of Port Gellhorn (Slam Dunk). So those areas are reachable in Chapter 2 (PPX, PS-MO). Confidence **high**. This partly answers the earlier "region unlocks" gap.

---

## Changes vs. earlier excerpt findings

1. **Mission order (2.5):**
   - The required spine is confirmed.
   - Daily Driver does **not** appear to be a hard prerequisite of Slam Dunk or Breakfast Run. PowerPyx numbers it after Slam Dunk, and both PPX and GB gate it only on Moses.
   - Added the real small steps: Overnight Charges, Behind on Payments ($900), New Look, How Do I Look?, Take Care of Jason/Play Nurse, Pick Up a Gun, Prepare for Vice City.
2. **"Overnight Charges" is a prerequisite of Girls' Trip.** Confirmed: it is real and is a prerequisite, together with Just Moved In.
3. **"Painkiller Supplier":** the step exists, but **GTABase calls it "Got Pills?"**. The name is now flagged as conflicting.
4. **Girls' Trip spelling:** "Trap" (Push Square, GameRant) is a typo-level outlier. "Trip" is settled; the apostrophe still conflicts.
5. **Thrillbillies and Twist Wrist, Smash, Grab:** the conflict is now pinned to **Game8**, which calls them required. PowerPyx, GTABase and GameRant call them optional.
6. **Coffee Break:** confirmed as the point where character switching unlocks (not Breakfast Run), plus the BuckMe Silver upgrade and a $2,000 interest payment that is conditional (GB) or stated flatly (G8).
7. **Checking Out (6.3):** the earlier claim that all three sites agree on impounding personal cars and emptying storage was **wrong**.
   - Only Game8's Checking Out page says it; PowerPyx and GTABase are silent.
   - "Sell loot to Dunk first" isn't on any page.
   - Game8's *missables* page has no Chapter 2 entry.
   - Downgraded to medium (cars) and unsourced (loot).
8. **Trust trophy:** upgraded to **high**.
9. **Hidden trophies:** 27 (Game8, Push Square), not 28.
10. **Pocket cash:**
    - The $20,000 cap is upgraded to **high** (three pages).
    - The shared/separate question is resolved: savings are shared, checking is per character (GamesRadar).
    - New conflict: PC Gamer says death or arrest costs only "a few hundred dollars".
11. **Moses:**
    - Payout figures are now read on the page (PPX), and Hellion $1,400, Bandito $3,350 and Vamos $4,200 are added.
    - Daily Driver's payout has a new internal conflict on GTABase ($1,375 vs $1,250 + $500).
    - The registration fee varies by car (examples gathered). The first registration is free.
    - The cooldown is still conflicting; a possible time-scale reconciliation is noted but unconfirmed.
    - The nickname "Mo" is now **medium**: GTABase's character page says "Don't call him Mo!".
    - The surname Watkins is now **medium** (Game8).
12. **McKittrick soft-lock:** confirmed on Game8, with the workaround. It conflicts with PowerPyx's statements that 100% needs no Strangers & Freaks and has nothing missable.
13. **Gellhorn Raceway:** confirmed on the PowerPyx page (11 races, intro then "Keep it PG" ×5). Its Chapter 2 availability is still not stated.
14. **Hit Avery Pawn "required for 100%":** GTABase puts "Required for 100%: Yes" on every mission, including the optional ones, so it looks like a template field. PowerPyx says 100% needs any 100 optional tasks. **Not specifically required.**
15. **Chapter 1 list:** upgraded to **high** (four pages agree). GTABase's 24 and PowerPyx's different early order are explained above.
16. **Dunk:** the rate tiers are confirmed (Low / Low / Very Low). The pay-out method conflicts: mailbox (GameRant) vs bank (PPX/GB).

## Still unverified

- What exactly counts toward the $15,000: BuckMe only or also pocket cash, and one character or both.
- Moses's cooldown in real time, and whether he has a daily cap.
- A typical registration fee (it varies; no formula is published). Dunk's actual dollar rates.
- Whether personal cars are really impounded at Checking Out. Only Game8 says so, on a page marked WIP.
- Whether the Billy missions are required before Checking Out (Game8 vs everyone else).
- The exact in-game titles "Painkiller Supplier" vs "Got Pills?", and the apostrophe in "Girls' Trip".
- When Gellhorn Raceway becomes available, and whether the Ambrosia Demolition Derby is available in Chapter 2.
- Whether the McKittrick soft-lock still happens after any patch (Game8's wording is ambiguous), and whether it affects 100%.
- The motel collectible cards and whether they can be missed. The Missing Persons / serial-killer chain details.
- Trophy pages on TrueAchievements and PSNProfiles (unreachable, 403). Rockstar Support pages (unreachable). The Rockstar Newswire article body (JavaScript-only).
- No Reddit corroboration was attempted (not on the allowlist).
