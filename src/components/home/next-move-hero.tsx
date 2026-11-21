"use client";

import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import type { Recommendation } from "@/contracts";
import { useRecord } from "@/components/guide/guide-provider";
import { isOutstanding } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { PriorityTag } from "@/components/ui/priority";
import { Button } from "@/components/ui/primitives";

/** The flagship panel: one recommendation, set like a strategy-guide chapter opener. */
export function NextMoveHero({ move }: { move: Recommendation }) {
  const record = useRecord(move.recordId);
  const { mark, openRecord } = useActions();
  const canComplete = record && isOutstanding(record) && !record.nameWithheld;

  return (
    <section
      aria-labelledby="next-move-title"
      className="rise-in relative overflow-hidden rounded-[1.6rem] border border-rule-strong bg-panel"
    >
      {/* horizon glow + chart grid */}
      <div
        aria-hidden
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 0% 100%, rgb(240 141 112 / 0.22), transparent 55%), radial-gradient(90% 70% at 100% 0%, rgb(118 188 175 / 0.16), transparent 60%)",
        }}
      />
      <div aria-hidden className="chart-grid absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />
      <div aria-hidden className="absolute bottom-0 left-6 top-0 w-px bg-gradient-to-b from-transparent via-gold/50 to-transparent" />

      <div className="relative p-5 pl-10">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow text-ivory-2">Your next best move</p>
          <PriorityTag priority={move.priority} />
        </div>

        <h2 id="next-move-title" className="headline mt-4 text-[2rem] leading-[1.05] text-ivory text-balance">
          {move.title}
        </h2>
        <p className="mt-3 max-w-[38ch] text-[1.025rem] leading-relaxed text-ivory-2">{move.body}</p>

        <div className="mt-5 flex flex-wrap gap-2">
          {canComplete ? (
            <Button variant="primary" size="lg" onClick={() => mark(record, "complete")}>
              <Check size={18} aria-hidden /> Mark complete
            </Button>
          ) : (
            move.recordId && (
              <Button variant="primary" size="lg" onClick={() => openRecord(move.recordId!)}>
                Details <ArrowRight size={18} aria-hidden />
              </Button>
            )
          )}
          <Link
            href="/strategy"
            className="tap inline-flex min-h-12 items-center gap-2 rounded-full bg-ivory/8 px-5 text-[0.95rem] text-ivory ring-1 ring-inset ring-rule-strong hover:bg-ivory/12"
          >
            View strategy
          </Link>
        </div>
        {canComplete && move.recordId && (
          <button
            type="button"
            onClick={() => openRecord(move.recordId!)}
            className="mt-3 min-h-11 text-[0.875rem] text-ivory-3 underline-offset-4 hover:text-ivory-2 hover:underline"
          >
            Why this, and how
          </button>
        )}
      </div>
    </section>
  );
}
