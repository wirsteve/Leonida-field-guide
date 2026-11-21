/**
 * Source evidence & confidence — CONTRACT v1
 *
 * Every authored guide fact carries the evidence it rests on. Evidence is
 * SERVER-ONLY: URLs and claim text can themselves contain spoilers (a link to a
 * full walkthrough, a claim describing a later mission). The client only ever
 * receives the redacted `PublicSourceSummary`.
 */

/** ISO-8601 calendar date, e.g. "2026-11-21". */
export type IsoDate = string;
/** ISO-8601 timestamp, e.g. "2026-11-21T16:25:00.000Z". */
export type IsoDateTime = string;

/**
 * How much we trust a fact.
 * - high:        official Rockstar documentation, or 2+ independent post-launch sources agree.
 * - medium:      one reputable post-launch source (established guide site, clear video evidence).
 * - low:         a single forum post, ambiguous footage, or a source of unknown reliability.
 * - unverified:  authored placeholder / hypothesis. Must never drive a "safe" verdict.
 */
export type Confidence = "high" | "medium" | "low" | "unverified";

export const CONFIDENCE_RANK: Record<Confidence, number> = {
  unverified: 0,
  low: 1,
  medium: 2,
  high: 3,
};

export type SourceKind =
  | "official" // rockstargames.com, in-game text, official manuals
  | "guide-site" // PowerPyx, GTABase, IGN, Game8 …
  | "video" // firsthand gameplay footage
  | "forum" // Reddit, GTAForums — corroboration required for >= medium
  | "firsthand"; // verified by the project's own play-testing notes

export interface SourceEvidence {
  /** Stable id, unique within the dataset, e.g. "src-powerpyx-ch2-missions". */
  id: string;
  url: string;
  publisher: string;
  title: string;
  kind: SourceKind;
  /** When a human/agent last checked the source supports the claim. */
  checkedOn: IsoDate;
  /** The specific claim this source supports — in our own words. RESTRICTED. */
  supports: string;
  /** Free-form notes: caveats, timestamps in a video, conflicting details. RESTRICTED. */
  notes?: string;
}

/** Redacted evidence summary that may be shown to the player. No URLs, no claim text. */
export interface PublicSourceSummary {
  publisher: string;
  kind: SourceKind;
  checkedOn: IsoDate;
}

/**
 * Research verification state for a record or a progression stage.
 * - verified:   all decision-relevant facts are >= medium confidence with evidence.
 * - partial:    some facts verified, others missing — guidance is usable but hedged.
 * - conflicted: reputable sources disagree on a decision-relevant fact. Treated
 *               like "unverified" for safety verdicts; never resolved by guessing.
 * - unverified: not researched yet, or only speculative information exists.
 *
 * Absence of a warning is NEVER evidence of safety: only "verified" coverage
 * can produce GO AHEAD / SAFE TO ADVANCE.
 */
export type VerificationStatus = "verified" | "partial" | "conflicted" | "unverified";
