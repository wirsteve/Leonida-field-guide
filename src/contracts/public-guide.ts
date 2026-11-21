/**
 * Public, spoiler-safe guide projections — CONTRACT v1
 *
 * Everything in this file may be sent to the client. The server gateway
 * (src/server/guide) is the ONLY producer of these objects, and it produces
 * them only for records the player is currently eligible to see.
 *
 * Invariants (enforced by tests/contracts):
 *  - No Requirement trees, sequence numbers, restricted notes, or evidence URLs.
 *  - No counts/denominators of ineligible records.
 *  - No names of ineligible records anywhere in the payload.
 */
import type { Confidence, PublicSourceSummary, VerificationStatus } from "./evidence";
import type {
  AreaId,
  MinutesRange,
  MoneyFacts,
  RecordId,
  RecordKind,
  Timing,
  Tri,
} from "./guide-record";
import type { ProgressMark } from "./player-state";

/**
 * Status of a VISIBLE record from the player's point of view.
 * - available:  can be done now.
 * - completed:  the player marked it complete.
 * - unsure:     the player isn't sure whether they did it.
 * - closed:     no longer available (shown only after the fact; reason never given).
 */
export type PublicRecordStatus = "available" | "completed" | "unsure" | "closed";

export interface PublicGuideRecord {
  id: RecordId;
  kind: RecordKind;
  /** Display name. For an un-started story mission whose name is not safe, this is the neutral label. */
  name: string;
  /** True when `name` is a neutral label rather than the real title. */
  nameWithheld: boolean;
  aliases: string[];
  summary: string;
  area?: { id: AreaId; label: string };
  tags: string[];
  estimatedMinutes?: MinutesRange;
  uniqueExperience: boolean;
  officialCompletion: Tri;
  timing: Timing;
  guidance: string;
  tips: string[];
  saveBeforeStarting: boolean;
  /** True while the record is in a verified last-chance window. */
  lastChance: boolean;
  /** Set only when lastChance is true. */
  lastChanceCopy?: string;
  missable: Tri;
  money?: MoneyFacts;
  collectibleTotal?: number;
  status: PublicRecordStatus;
  playerMark?: ProgressMark;
  confidence: Confidence;
  sources: PublicSourceSummary[];
}

export type Priority = "do-now" | "recommended" | "wait" | "optional" | "last-chance";

export type RecommendationKind =
  | "story" // continue the story
  | "optional-mission"
  | "activity"
  | "money"
  | "explore"
  | "collect"
  | "prepare" // buy/obtain something
  | "save" // make a manual save
  | "postpone" // don't do this yet
  | "reconcile"; // tell the guide what you've done

export type RecommendationAction =
  | { type: "mark-complete"; recordId: RecordId }
  | { type: "view-strategy" }
  | { type: "view-record"; recordId: RecordId }
  | { type: "open-money" }
  | { type: "open-explore" }
  | { type: "open-onboarding" };

export interface Recommendation {
  /** Stable for a given (snapshot, content version) pair. */
  id: string;
  priority: Priority;
  kind: RecommendationKind;
  /** Imperative headline: "Finish your outstanding optional activities." */
  title: string;
  /** One or two spoiler-safe sentences. */
  body: string;
  recordId?: RecordId;
  confidence: Confidence;
  actions: RecommendationAction[];
}

export type ReadinessStatus =
  | "safe-to-advance"
  | "complete-these-first"
  | "last-chance"
  | "not-fully-verified";

export interface AdvancementReadiness {
  status: ReadinessStatus;
  headline: string;
  detail: string;
  /** Visible records the player should finish before advancing. */
  blocking: { recordId: RecordId; name: string; lastChance: boolean }[];
  /** "safe-to-advance" is only ever emitted when this is "verified". */
  verification: VerificationStatus;
}

export interface MoneyAdvice {
  headline: string;
  body: string;
  /** Is grinding worthwhile right now? */
  grind: "worthwhile" | "not-needed" | "unknown";
  bestMethodId?: RecordId;
  /** Visible, available money methods, best first. */
  methodIds: RecordId[];
  cash: number | null;
  target: number | null;
}

export interface ExploreSuggestion {
  recordId: RecordId;
  title: string;
  body: string;
}

export type StrategySectionKind =
  | "recommended-order"
  | "high-value-optional"
  | "missable"
  | "preparation"
  | "exploration"
  | "money"
  | "equipment"
  | "postpone"
  | "saves";

export interface StrategyItem {
  recordId?: RecordId;
  title: string;
  body: string;
  priority?: Priority;
  status?: PublicRecordStatus;
}

export interface StrategySection {
  kind: StrategySectionKind;
  title: string;
  items: StrategyItem[];
  /** Shown when items is empty — honest, e.g. "Nothing verified yet for this stage." */
  emptyText: string;
}

export interface PublicStage {
  id: RecordId;
  chapter: number;
  chapterLabel: string;
  title: string;
  intro: string;
  saveAdvice?: string;
  verification: VerificationStatus;
}

export interface StrategyPlan {
  stage: PublicStage | null;
  sections: StrategySection[];
}

/** The full, filtered view returned by POST /api/guide/evaluate. */
export interface GuideEvaluation {
  contractVersion: number;
  contentVersion: string;
  generatedAt: string;
  stage: PublicStage | null;
  records: PublicGuideRecord[];
  nextBestMove: Recommendation | null;
  queue: Recommendation[];
  readiness: AdvancementReadiness;
  money: MoneyAdvice;
  explore: ExploreSuggestion | null;
  strategy: StrategyPlan;
  /** Visible areas only. */
  areas: { id: AreaId; label: string }[];
  /** Honest research-coverage disclaimer. */
  coverageNote: string;
  /** Counters computed over VISIBLE records only — never over the full dataset. */
  progress: {
    visibleCompleted: number;
    uniqueExperienced: number;
  };
}

export type CheckVerdict = "go-ahead" | "do-these-first" | "last-chance" | "save-first" | "unverified";

export interface MissionCheckResult {
  verdict: CheckVerdict;
  /** null when the query didn't match an eligible mission. Responses for
   *  ineligible (future) missions MUST be indistinguishable from unknown text. */
  matched: { recordId: RecordId; name: string } | null;
  headline: string;
  body: string;
  tasks: { recordId: RecordId; name: string; lastChance: boolean; guidance: string }[];
  saveFirst: boolean;
  confidence: Confidence;
}

/** Search suggestions for Check Before Starting / onboarding. Eligible records only. */
export interface MissionSuggestion {
  recordId: RecordId;
  name: string;
  status: PublicRecordStatus;
}
