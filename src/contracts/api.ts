/**
 * Guide API — CONTRACT v1
 *
 * All guide content reaches the client through these endpoints (implemented by
 * Codex in src/app/api/guide). The client sends a ProgressSnapshot; the server
 * evaluates eligibility and returns ONLY spoiler-safe projections.
 *
 * All endpoints are POST so snapshots never appear in URLs, logs or caches,
 * and responses carry `Cache-Control: no-store`.
 */
import type { ProgressSnapshot } from "./player-state";
import type { GuideEvaluation, MissionCheckResult, MissionSuggestion } from "./public-guide";

export const CONTRACT_VERSION = 1 as const;

export const GUIDE_API = {
  evaluate: "/api/guide/evaluate",
  check: "/api/guide/check",
  suggest: "/api/guide/suggest",
  identify: "/api/guide/identify",
} as const;

/** POST /api/guide/evaluate */
export interface EvaluateRequest {
  snapshot: ProgressSnapshot;
}
export type EvaluateResponse = GuideEvaluation;

/** POST /api/guide/check — "Check Before Starting". */
export interface CheckRequest {
  snapshot: ProgressSnapshot;
  /** A record id picked from suggestions, or free text the player typed. */
  recordId?: string;
  query?: string;
}
export type CheckResponse = MissionCheckResult;

/**
 * POST /api/guide/suggest — autocomplete for Check Before Starting.
 * Returns ONLY eligible (visible) story/side missions whose name or alias
 * matches. Never returns, counts or hints at ineligible missions.
 */
export interface SuggestRequest {
  snapshot: ProgressSnapshot;
  query: string;
  limit?: number;
}
export interface SuggestResponse {
  suggestions: MissionSuggestion[];
}

/**
 * POST /api/guide/identify — onboarding reconciliation.
 * The player types the name (or a verified alias) of the most recent story
 * mission they COMPLETED. The server answers with an EXACT normalized match
 * only (no fuzzy/prefix matching outside the visible set), so it cannot be used
 * to probe for future titles. On a match it returns the ids the client should
 * mark complete: the mission plus every story mission that necessarily precedes it.
 */
export interface IdentifyRequest {
  snapshot: ProgressSnapshot;
  query: string;
}
export interface IdentifyResponse {
  matched: { recordId: string; name: string } | null;
  /** Story missions that must already be complete if `matched` is complete. */
  impliedComplete: string[];
}

/** Error envelope for 4xx/5xx responses. Messages must be spoiler-safe. */
export interface GuideApiError {
  error: { code: "invalid-request" | "unsupported-version" | "internal"; message: string };
}
