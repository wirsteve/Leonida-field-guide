import {
  GUIDE_API,
  type CheckRequest,
  type CheckResponse,
  type EvaluateResponse,
  type IdentifyResponse,
  type ProgressSnapshot,
  type SuggestResponse,
} from "@/contracts";

/** Thin client for the spoiler-safe guide API. Every call sends the snapshot in a POST body. */
async function post<T>(path: string, body: unknown, signal?: AbortSignal): Promise<T> {
  const response = await fetch(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
    cache: "no-store",
    signal,
  });
  if (!response.ok) throw new Error(`Guide request failed (${response.status})`);
  return (await response.json()) as T;
}

export const guideClient = {
  evaluate: (snapshot: ProgressSnapshot, signal?: AbortSignal) =>
    post<EvaluateResponse>(GUIDE_API.evaluate, { snapshot }, signal),
  check: (request: CheckRequest, signal?: AbortSignal) => post<CheckResponse>(GUIDE_API.check, request, signal),
  suggest: (snapshot: ProgressSnapshot, query: string, signal?: AbortSignal) =>
    post<SuggestResponse>(GUIDE_API.suggest, { snapshot, query, limit: 8 }, signal),
  identify: (snapshot: ProgressSnapshot, query: string, signal?: AbortSignal) =>
    post<IdentifyResponse>(GUIDE_API.identify, { snapshot, query }, signal),
};

/** Stable key for a snapshot, used to tell whether a cached evaluation still matches progress. */
export function snapshotKey(snapshot: ProgressSnapshot): string {
  const sorted = {
    ...snapshot,
    completed: [...snapshot.completed].sort(),
    unsure: [...snapshot.unsure].sort(),
    discovered: [...snapshot.discovered].sort(),
    collectibles: Object.fromEntries(Object.entries(snapshot.collectibles).sort()),
  };
  return JSON.stringify(sorted);
}

/**
 * Offline cache for the LAST evaluation the server authorized. It only ever holds
 * a server response (already filtered), so it can never widen eligibility.
 * Stored in localStorage: this is a view cache, not progress.
 */
const CACHE_KEY = "lfg:last-evaluation:v2";

/** An evaluation bound to the exact snapshot the server authorized it for. */
export interface CachedEvaluation {
  key: string;
  snapshot: ProgressSnapshot;
  evaluation: EvaluateResponse;
}

/**
 * True when `current` progress includes everything `authorizedFor` did, so a
 * view authorized for the older snapshot reveals nothing the player hasn't
 * reached. Any rollback (undo, reset, older import) fails this check.
 */
export function coversSnapshot(current: ProgressSnapshot, authorizedFor: ProgressSnapshot): boolean {
  const done = new Set(current.completed.filter((id) => !current.unsure.includes(id)));
  const found = new Set(current.discovered);
  return authorizedFor.completed.every((id) => done.has(id)) && authorizedFor.discovered.every((id) => found.has(id));
}

export function readCachedEvaluation(): CachedEvaluation | null {
  try {
    const raw = window.localStorage.getItem(CACHE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Partial<CachedEvaluation>) : null;
    return parsed?.key && parsed.snapshot && parsed.evaluation ? (parsed as CachedEvaluation) : null;
  } catch {
    return null;
  }
}

export function writeCachedEvaluation(entry: CachedEvaluation): void {
  try {
    window.localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch {
    /* storage unavailable (private mode) — the app still works online */
  }
}
