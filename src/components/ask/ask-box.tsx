"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, MessageCircleQuestion, X } from "lucide-react";
import { useGuide } from "@/components/guide/guide-provider";
import { useActions } from "@/components/shell/actions-provider";
import { answer, SUGGESTIONS, type AskAction, type AskAnswer } from "./answer";

/** Offline "Ask the guide": answers from what the player has already reached. */
export function AskBox() {
  const { evaluation } = useGuide();
  const { openRecord, openCheck, openCash } = useActions();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<{ q: string; a: AskAnswer } | null>(null);

  if (!evaluation) return null;

  const ask = (q: string) => {
    setQuery(q);
    setResult({ q, a: answer(q, evaluation) });
  };

  const run = (action: AskAction) => {
    if (action.kind === "record") openRecord(action.recordId);
    else if (action.kind === "check") openCheck();
    else if (action.kind === "cash") openCash();
  };

  return (
    <section aria-label="Ask the guide" className="mt-5">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          if (query.trim()) ask(query);
        }}
        className="flex items-center gap-2 rounded-2xl border border-rule-strong bg-panel/70 pl-3.5 focus-within:border-sea/60"
      >
        <MessageCircleQuestion size={18} className="shrink-0 text-sea" aria-hidden />
        <label htmlFor="ask-input" className="sr-only">
          Ask the guide
        </label>
        <input
          id="ask-input"
          type="search"
          enterKeyHint="search"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Ask the guide…"
          className="min-h-12 min-w-0 flex-1 bg-transparent text-[1rem] text-ivory placeholder:text-ivory-3 focus:outline-none"
        />
        {result ? (
          <button
            type="button"
            aria-label="Clear"
            onClick={() => {
              setQuery("");
              setResult(null);
            }}
            className="tap grid size-12 shrink-0 place-items-center text-ivory-3"
          >
            <X size={18} aria-hidden />
          </button>
        ) : (
          <button type="submit" aria-label="Ask" className="tap grid size-12 shrink-0 place-items-center text-sea">
            <ArrowRight size={18} aria-hidden />
          </button>
        )}
      </form>

      {!result && (
        <div className="-mx-4 mt-2.5 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none]">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="tap min-h-11 shrink-0 rounded-full border border-rule px-3.5 text-[0.8125rem] text-ivory-2 hover:bg-panel"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {result && (
        <div aria-live="polite" className="rise-in mt-3 rounded-[var(--radius-card)] border border-sea/30 bg-sea/8 p-4">
          <p className="eyebrow text-sea">Answer</p>
          <p className="headline mt-1.5 text-[1.25rem] leading-snug text-ivory">{result.a.headline}</p>
          {result.a.body && <p className="mt-1.5 text-[0.925rem] leading-relaxed text-ivory-2">{result.a.body}</p>}
          {result.a.actions.length > 0 && (
            <ul className="mt-3 flex flex-col gap-1.5">
              {result.a.actions.map((action) => (
                <li key={`${action.kind}-${action.label}`}>
                  {action.kind === "link" ? (
                    <Link href={action.href} className="tap flex min-h-11 items-center justify-between rounded-xl bg-ink/40 px-3 text-[0.925rem] text-ivory hover:bg-ink/60">
                      {action.label} <ArrowRight size={16} className="text-ivory-3" aria-hidden />
                    </Link>
                  ) : (
                    <button
                      type="button"
                      onClick={() => run(action)}
                      className="tap flex min-h-11 w-full items-center justify-between rounded-xl bg-ink/40 px-3 text-left text-[0.925rem] text-ivory hover:bg-ink/60"
                    >
                      {action.label} <ArrowRight size={16} className="shrink-0 text-ivory-3" aria-hidden />
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
