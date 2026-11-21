"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EvaluateResponse, PlayerState, ProgressSnapshot, ProgressStore, ProgressUpdate } from "@/contracts";
import { createProgressStore, toProgressSnapshot } from "@/persistence";
import { coversSnapshot, guideClient, readCachedEvaluation, snapshotKey, writeCachedEvaluation, type CachedEvaluation } from "./guide-client";

export type EvaluationStatus = "loading" | "fresh" | "stale" | "offline-empty" | "error";

interface GuideContextValue {
  /** null until IndexedDB has loaded. */
  state: PlayerState | null;
  snapshot: ProgressSnapshot | null;
  evaluation: EvaluateResponse | null;
  status: EvaluationStatus;
  storageError: string | null;
  /** Apply a progress update. Resolves once IndexedDB has committed it. */
  apply: (update: ProgressUpdate, label: string) => Promise<boolean>;
  undo: () => Promise<boolean>;
  refresh: () => void;
  store: ProgressStore;
}

const GuideContext = createContext<GuideContextValue | null>(null);

export function GuideProvider({ children }: { children: React.ReactNode }) {
  // One store per UI (persistence contract). Creating it opens nothing until load().
  const [store] = useState<ProgressStore>(() => createProgressStore());
  const [state, setState] = useState<PlayerState | null>(null);
  // The latest server view, bound to the snapshot that authorized it.
  const [authorized, setAuthorized] = useState<CachedEvaluation | null>(null);
  const [fetchFailed, setFetchFailed] = useState<{ key: string; offline: boolean } | null>(null);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(setState);
    store
      .load()
      .then(setState)
      .catch(() => setStorageError("Your progress couldn't be opened on this device. Private browsing can block storage."));
    return unsubscribe;
  }, [store]);

  const snapshot = useMemo(() => (state ? toProgressSnapshot(state) : null), [state]);
  const key = useMemo(() => (snapshot ? snapshotKey(snapshot) : null), [snapshot]);

  // Load the last authorized view from the offline cache, then refresh from the server.
  // Responses for a snapshot that is no longer current are aborted and dropped.
  useEffect(() => {
    if (!snapshot || !key) return;
    const cached = readCachedEvaluation();
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (!cached || controller.signal.aborted) return;
      setAuthorized((current) => current ?? cached);
    });
    const timer = window.setTimeout(() => {
      guideClient
        .evaluate(snapshot, controller.signal)
        .then((evaluation) => {
          if (controller.signal.aborted) return;
          const entry = { key, snapshot, evaluation };
          setAuthorized(entry);
          setFetchFailed(null);
          writeCachedEvaluation(entry);
        })
        .catch(() => {
          if (controller.signal.aborted) return;
          setFetchFailed({ key, offline: !navigator.onLine });
        });
    }, 120);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [key, snapshot, nonce]);

  // Render-time guard: a view is shown only if current progress still covers the
  // snapshot it was authorized for. After any rollback it is withheld immediately.
  const view = useMemo(() => {
    if (!authorized || !snapshot || !key) return null;
    if (authorized.key === key) return { evaluation: authorized.evaluation, stale: false };
    if (coversSnapshot(snapshot, authorized.snapshot)) return { evaluation: authorized.evaluation, stale: true };
    return null;
  }, [authorized, snapshot, key]);

  const evaluation = view?.evaluation ?? null;
  const failedNow = fetchFailed && fetchFailed.key === key ? fetchFailed : null;
  const status: EvaluationStatus = view
    ? view.stale && failedNow
      ? "stale"
      : "fresh"
    : failedNow
      ? failedNow.offline
        ? "offline-empty"
        : "error"
      : "loading";

  const apply = useCallback(async (update: ProgressUpdate, label: string) => {
    try {
      setState(await store.apply(update, label));
      return true;
    } catch {
      setStorageError("That change couldn't be saved. Try again.");
      return false;
    }
  }, [store]);

  const undo = useCallback(async () => {
    try {
      setState(await store.undo());
      return true;
    } catch {
      setStorageError("Undo couldn't be saved. Try again.");
      return false;
    }
  }, [store]);

  const refresh = useCallback(() => setNonce((n) => n + 1), []);

  const value = useMemo<GuideContextValue>(
    () => ({ state, snapshot, evaluation, status, storageError, apply, undo, refresh, store }),
    [state, snapshot, evaluation, status, storageError, apply, undo, refresh, store],
  );

  return <GuideContext.Provider value={value}>{children}</GuideContext.Provider>;
}

export function useGuide(): GuideContextValue {
  const value = useContext(GuideContext);
  if (!value) throw new Error("useGuide must be used inside <GuideProvider>");
  return value;
}

/** Look up a visible record in the current evaluation. */
export function useRecord(recordId: string | undefined) {
  const { evaluation } = useGuide();
  return useMemo(
    () => (recordId ? evaluation?.records.find((r) => r.id === recordId) ?? null : null),
    [evaluation, recordId],
  );
}
