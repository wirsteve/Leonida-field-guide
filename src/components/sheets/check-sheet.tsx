"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Check, Search, ShieldCheck } from "lucide-react";
import type { MissionCheckResult, MissionSuggestion } from "@/contracts";
import { guideClient } from "@/components/guide/guide-client";
import { useGuide } from "@/components/guide/guide-provider";
import { VERDICT_META } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { Button } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";
import { cx } from "@/components/ui/cx";

/**
 * "Check Before Starting". Suggestions come from the server and include only
 * missions the player can currently start. Free text is checked server-side; a
 * miss never reveals whether the text names a future mission.
 */
export function CheckSheet({
  open,
  initialRecordId,
  onClose,
}: {
  open: boolean;
  initialRecordId?: string;
  onClose: () => void;
}) {
  const { snapshot } = useGuide();
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<MissionSuggestion[]>([]);
  const [result, setResult] = useState<MissionCheckResult | null>(null);
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  // Remounted on every open; auto-check when opened from a specific mission.
  useEffect(() => {
    if (!open || !initialRecordId) return;
    void Promise.resolve().then(() => run({ recordId: initialRecordId }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!open || !snapshot) return;
    const controller = new AbortController();
    const t = window.setTimeout(() => {
      guideClient
        .suggest(snapshot, query, controller.signal)
        .then((r) => setSuggestions(r.suggestions))
        .catch(() => {});
    }, 140);
    return () => {
      controller.abort();
      window.clearTimeout(t);
    };
  }, [open, query, snapshot]);

  async function run(target: { recordId?: string; query?: string }) {
    if (!snapshot) return;
    setBusy(true);
    setFailed(false);
    try {
      setResult(await guideClient.check({ snapshot, ...target }));
    } catch {
      setFailed(true);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Check before starting" title={result ? "Your verdict" : "Which mission is next?"}>
      {!result && (
        <>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (query.trim()) void run({ query: query.trim() });
            }}
            className="relative"
          >
            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ivory-3" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Type the mission name"
              aria-label="Mission name"
              autoComplete="off"
              autoCorrect="off"
              enterKeyHint="search"
              className="h-12 w-full rounded-2xl border border-rule-strong bg-panel pl-11 pr-4 text-[1rem] text-ivory placeholder:text-ivory-3 focus:border-gold/60 focus:outline-none"
            />
          </form>
          <p className="mt-2 text-[0.8125rem] text-ivory-3">
            Pick from what you can start right now, or type the name shown in game.
          </p>

          <ul className="mt-4 divide-y divide-rule overflow-hidden rounded-2xl border border-rule">
            {suggestions.map((s) => (
              <li key={s.recordId}>
                <button
                  type="button"
                  onClick={() => run({ recordId: s.recordId })}
                  className="tap flex min-h-14 w-full items-center gap-3 bg-panel/50 px-4 text-left hover:bg-panel-2"
                >
                  <ShieldCheck size={18} className="shrink-0 text-sea" aria-hidden />
                  <span className="min-w-0 flex-1 truncate text-[0.975rem] text-ivory">{s.name}</span>
                  {s.status === "unsure" && <span className="text-[0.75rem] text-ivory-3">Not sure</span>}
                </button>
              </li>
            ))}
            {suggestions.length === 0 && (
              <li className="bg-panel/40 px-4 py-4 text-[0.9rem] text-ivory-3">
                {query ? "No available mission matches that. Press Search to check it anyway." : "No missions to check right now."}
              </li>
            )}
          </ul>
          {busy && <p className="mt-3 text-[0.875rem] text-ivory-3">Checking…</p>}
          {failed && <p className="mt-3 text-[0.875rem] text-flare">Couldn&apos;t reach the guide. Check your connection.</p>}
        </>
      )}

      {result && <Verdict result={result} onBack={() => setResult(null)} />}
    </Sheet>
  );
}

function Verdict({ result, onBack }: { result: MissionCheckResult; onBack: () => void }) {
  const { mark } = useActions();
  const { evaluation } = useGuide();
  const meta = VERDICT_META[result.verdict];
  return (
    <div className="rise-in">
      <div className={cx("rounded-[1.4rem] p-5 ring-1 ring-inset", meta.bg, meta.ring)}>
        {result.matched && <p className="text-[0.875rem] text-ivory-2">{result.matched.name}</p>}
        <p className={cx("headline mt-1 text-[2rem] leading-none", meta.text)}>{meta.label}</p>
        <p className="mt-3 text-[1rem] leading-relaxed text-ivory">{result.headline}.</p>
        <p className="mt-1 text-[0.95rem] leading-relaxed text-ivory-2">{result.body}</p>
        {result.saveFirst && result.verdict !== "save-first" && (
          <p className="mt-3 text-[0.9rem] text-coral">Also make a separate manual save first.</p>
        )}
      </div>

      {result.tasks.length > 0 && (
        <div className="mt-5">
          <p className="eyebrow text-ivory-3">Finish first</p>
          <ul className="mt-2 space-y-2">
            {result.tasks.map((task) => {
              const done = evaluation?.records.find((r) => r.id === task.recordId)?.status === "completed";
              return (
                <li key={task.recordId} className="flex items-center gap-3 rounded-2xl border border-rule bg-panel/60 p-3">
                  <div className="min-w-0 flex-1">
                    <p className={cx("text-[0.975rem]", done ? "text-ivory-3 line-through" : "text-ivory")}>{task.name}</p>
                    <p className={cx("mt-0.5 text-[0.8125rem]", task.lastChance ? "text-flare" : "text-ivory-3")}>{task.guidance}</p>
                  </div>
                  {!done && (
                    <button
                      type="button"
                      aria-label={`Mark ${task.name} complete`}
                      onClick={() => mark({ id: task.recordId, name: task.name }, "complete")}
                      className="tap grid size-11 shrink-0 place-items-center rounded-full bg-ivory/6 text-ivory hover:bg-ivory/12"
                    >
                      <Check size={18} aria-hidden />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <Button variant="ghost" className="mt-5" onClick={onBack}>
        <ArrowLeft size={18} aria-hidden /> Check another mission
      </Button>
    </div>
  );
}
