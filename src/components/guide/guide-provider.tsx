"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { EvaluateResponse, PlayerState, ProgressSnapshot, ProgressStore, ProgressUpdate } from "@/contracts";
import { createProgressStore, toProgressSnapshot } from "@/persistence";
import { guideClient, readCachedEvaluation, snapshotKey, writeCachedEvaluation } from "./guide-client";

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
  const [evaluation, setEvaluation] = useState<EvaluateResponse | null>(null);
  const [status, setStatus] = useState<EvaluationStatus>("loading");
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

  // Show the last authorized view immediately, then refresh from the server.
  useEffect(() => {
    if (!snapshot || !key) return;
    const cached = readCachedEvaluation();
    const controller = new AbortController();
    void Promise.resolve().then(() => {
      if (!cached || controller.signal.aborted) return;
      setEvaluation((current) => current ?? cached.evaluation);
      setStatus((current) => (current === "loading" ? (cached.key === key ? "fresh" : "stale") : current));
    });
    const timer = window.setTimeout(() => {
      guideClient
        .evaluate(snapshot, controller.signal)
        .then((result) => {
          setEvaluation(result);
          setStatus("fresh");
          writeCachedEvaluation({ key, evaluation: result });
        })
        .catch((error: unknown) => {
          if (controller.signal.aborted) return;
          void error;
          setStatus(cached ? (cached.key === key ? "fresh" : "stale") : navigator.onLine ? "error" : "offline-empty");
        });
    }, 120);
    return () => {
      controller.abort();
      window.clearTimeout(timer);
    };
  }, [key, snapshot, nonce]);

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
