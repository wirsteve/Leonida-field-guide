/**
 * Guide records — CONTRACT v1
 *
 * A `GuideRecord` is the full, authored research record. It is SERVER-ONLY.
 * It contains future-progress information (eligibility rules that reference
 * later missions, restricted explanations) and must never be serialized to the
 * client. The client receives `PublicGuideRecord` (see public-guide.ts), which
 * the content gateway produces only for records the player is eligible to see.
 */
import type { Confidence, IsoDate, SourceEvidence, VerificationStatus } from "./evidence";

/** Stable, opaque-ish record identifier. Must not encode future story info
 *  (no "ch3-…" prefixes on records that are eligible earlier, no plot words). */
export type RecordId = string;

export type RecordKind =
  | "story-mission"
  | "side-mission" // optional mission with a giver
  | "activity" // repeatable or one-off side activity (jobs, minigames)
  | "race"
  | "encounter" // random / stranger encounters
  | "collectible-set" // a family of collectibles (count tracked per set)
  | "location" // a discoverable place / area of interest
  | "money-method" // a way to earn money
  | "vehicle" // unique vehicles worth acquiring
  | "equipment" // weapons, gear, upgrades
  | "contact" // a character the player has met
  | "achievement"
  | "stage"; // a progression stage — carries the chapter-strategy editorial

/** Map regions. Labels are public only once the region is eligible. */
export type AreaId = string;

/**
 * Eligibility / availability expressions evaluated against player progress.
 * Evaluated ONLY on the server. Never serialized to the client because the
 * referenced ids can reveal future content.
 */
export type Requirement =
  | { always: true }
  | { never: true }
  | { completed: RecordId } // record marked complete by the player
  | { discovered: RecordId } // location/contact marked discovered or met
  | { all: Requirement[] }
  | { any: Requirement[] }
  | { not: Requirement };

/** When it is best to do something — the core of the "when, not just what" guidance. */
export type Timing =
  | "now" // do this before anything else
  | "before-advancing" // do before the next story step
  | "anytime" // safe to save for later
  | "later-better" // postpone: easier/more rewarding later
  | "unknown";

export type Repeatability = "one-time" | "repeatable" | "cooldown" | "limited" | "unknown";
export type RiskLevel = "low" | "medium" | "high" | "unknown";
export type Tri = "yes" | "no" | "unknown";

export interface MinutesRange {
  min: number;
  max: number;
}

export interface MoneyFacts {
  /** Payout only when a source documents it. Never estimate from intuition. */
  payout?: { min: number; max: number; note?: string };
  repeatability: Repeatability;
  /** e.g. "One sale per in-game day" — only when documented. */
  cooldownNote?: string;
  risk: RiskLevel;
  timeMinutes?: MinutesRange;
  /** Authored relative efficiency within the CURRENT stage (1 = poor … 5 = best). */
  efficiency?: 1 | 2 | 3 | 4 | 5;
}

/**
 * Player-facing copy. Everything here MUST be spoiler-safe for any player who is
 * eligible to see the record. Tell the player WHAT and WHEN, never WHY in story
 * terms. See docs/research/SPOILER_STYLE.md.
 */
export interface PublicContent {
  /** Display name. For story missions: the canonical in-game title (verified). */
  name: string;
  /** Informal names the player might type ("breakfast stickup"). Verified aliases only. */
  aliases: string[];
  /** One spoiler-safe sentence. */
  summary: string;
  area?: AreaId;
  tags: string[];
  estimatedMinutes?: MinutesRange;
  /** Counts toward "Unique content experienced". */
  uniqueExperience: boolean;
  /** Counts toward the official in-game completion percentage. */
  officialCompletion: Tri;
  timing: Timing;
  /** Short imperative guidance, e.g. "Finish this before your next story mission." */
  guidance: string;
  /** Optional extra tips — preparation, efficient approach. Spoiler-safe. */
  tips?: string[];
  /** Shown only while the record is in a last-chance window. Must not explain why. */
  lastChanceCopy?: string;
  /** Recommend a separate manual save before starting (story missions mostly). */
  saveBeforeStarting?: boolean;
  money?: MoneyFacts;
  /** Collectible sets: total count only when the total itself is not a spoiler. */
  collectibleTotal?: number;
  /** Story missions: whether the name may be shown BEFORE the player starts it.
   *  Default false → the client sees a neutral label until the player names it. */
  nameSafeBeforeStart?: boolean;
  /** Neutral label used when the name is withheld, e.g. "Next story mission". */
  neutralLabel?: string;
}

/** Server-only research notes. Never leaves the server. */
export interface RestrictedResearch {
  /** Why this matters (e.g. what becomes unavailable and why). */
  internalExplanation?: string;
  /** Anything else useful for authors and the engine's maintainers. */
  notes?: string;
  /** Conflicting-source description, if any. */
  conflicts?: string;
}

export interface GuideRecord {
  id: RecordId;
  kind: RecordKind;
  /** Story ordering key for story missions & stages (server-only). */
  sequence?: number;
  /** Chapter the record belongs to (server-only; projected only when eligible). */
  chapter?: number;

  /** When the record may be DISCLOSED to the player at all. */
  visibleWhen: Requirement;
  /** When it can actually be done. Defaults to `visibleWhen`. */
  availableWhen?: Requirement;
  /** Once true, the record is permanently unavailable (missable content). */
  expiresWhen?: Requirement;
  missable: Tri;

  public: PublicContent;
  restricted: RestrictedResearch;

  evidence: SourceEvidence[];
  confidence: Confidence;
  verification: VerificationStatus;
  lastReviewed: IsoDate;
}

/** Stage records carry the chapter-strategy editorial. */
export interface StageEditorial {
  /** "Chapter 02" style label — current chapter only. */
  chapterLabel: string;
  title: string;
  intro: string;
  /** Spoiler-safe save advice for this stage. */
  saveAdvice?: string;
  /** When readiness can be "safe": research covering this stage must be verified. */
  verification: VerificationStatus;
}

export interface StageRecord extends GuideRecord {
  kind: "stage";
  editorial: StageEditorial;
}

/** The complete authored dataset as loaded by the server gateway. */
export interface GuideDataset {
  contentVersion: string;
  generatedOn: IsoDate;
  /** Honest statement of research coverage, shown to the player. Spoiler-safe. */
  coverageNote: string;
  areas: { id: AreaId; label: string; visibleWhen: Requirement }[];
  records: GuideRecord[];
}
