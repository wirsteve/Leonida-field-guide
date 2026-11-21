"use client";

import Link from "next/link";
import { ChevronRight, Pencil } from "lucide-react";
import type { GuideEvaluation } from "@/contracts";
import { useActions } from "@/components/shell/actions-provider";
import { formatCash } from "@/components/ui/primitives";

const GRIND = {
  worthwhile: { label: "Worth grinding", tone: "text-gold" },
  "not-needed": { label: "No need to grind", tone: "text-sea" },
  unknown: { label: "Grinding: not assessed", tone: "text-ivory-3" },
} as const;

export function MoneySnapshot({ evaluation }: { evaluation: GuideEvaluation }) {
  const { openCash } = useActions();
  const { money } = evaluation;
  const best = money.bestMethodId ? evaluation.records.find((r) => r.id === money.bestMethodId) : null;
  const pct = money.cash !== null && money.target ? Math.min(100, Math.round((money.cash / money.target) * 100)) : null;
  const grind = GRIND[money.grind];

  return (
    <section className="overflow-hidden rounded-[var(--radius-card)] border border-rule bg-panel/70">
      <div className="flex items-end justify-between gap-3 p-4 pb-3">
        <div>
          <p className="eyebrow text-ivory-3">Recorded cash</p>
          <p className="headline mt-1.5 text-[2rem] leading-none text-gold">{formatCash(money.cash)}</p>
        </div>
        <button
          type="button"
          onClick={openCash}
          className="tap flex min-h-11 items-center gap-1.5 rounded-full bg-ivory/6 px-3.5 text-[0.875rem] text-ivory hover:bg-ivory/10"
        >
          <Pencil size={15} aria-hidden /> Update
        </button>
      </div>
      {pct !== null && (
        <div className="px-4 pb-3">
          <div className="h-1.5 overflow-hidden rounded-full bg-ivory/8" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to savings goal">
            <div className="h-full rounded-full bg-gradient-to-r from-gold-deep to-gold" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-1.5 text-[0.8125rem] text-ivory-3">
            {pct}% of your {formatCash(money.target)} goal
          </p>
        </div>
      )}
      <Link href="/money" className="tap flex min-h-14 items-center gap-3 border-t border-rule px-4 py-3 hover:bg-panel-2/60">
        <div className="min-w-0 flex-1">
          <p className={`text-[0.8125rem] font-medium ${grind.tone}`}>{grind.label}</p>
          <p className="truncate text-[0.95rem] text-ivory">{best ? `Best now: ${best.name}` : money.headline}</p>
        </div>
        <ChevronRight size={18} className="text-ivory-3" aria-hidden />
      </Link>
    </section>
  );
}

export function ExploreTeaser({ evaluation }: { evaluation: GuideEvaluation }) {
  const { openRecord } = useActions();
  const explore = evaluation.explore;
  if (!explore) {
    return (
      <Link href="/explore" className="tap flex min-h-14 items-center gap-3 rounded-[var(--radius-card)] border border-rule bg-panel/50 p-4 hover:bg-panel-2/60">
        <p className="min-w-0 flex-1 text-[0.95rem] text-ivory-2">See what you can explore right now</p>
        <ChevronRight size={18} className="text-ivory-3" aria-hidden />
      </Link>
    );
  }
  return (
    <button
      type="button"
      onClick={() => openRecord(explore.recordId)}
      className="tap relative w-full overflow-hidden rounded-[var(--radius-card)] border border-rule bg-panel/70 p-4 text-left hover:bg-panel-2/60"
    >
      <span aria-hidden className="chart-grid absolute inset-y-0 right-0 w-1/3 opacity-60 [mask-image:linear-gradient(to_left,black,transparent)]" />
      <p className="eyebrow text-sea">Worth exploring</p>
      <p className="headline mt-2 text-[1.35rem] leading-tight text-ivory">{explore.title}</p>
      <p className="mt-1.5 line-clamp-2 text-[0.9rem] leading-relaxed text-ivory-3">{explore.body}</p>
    </button>
  );
}
