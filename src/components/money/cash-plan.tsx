"use client";

import { useMemo } from "react";
import { Flag, Target } from "lucide-react";
import type { GuideEvaluation } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { useActions } from "@/components/shell/actions-provider";
import { Button, formatCash } from "@/components/ui/primitives";
import { buildCashPlan } from "./plan";

export { cashGoalOf } from "./plan";
import { cx } from "@/components/ui/cx";

export function CashPlan({ evaluation, target, compact = false }: { evaluation: GuideEvaluation; target: number; compact?: boolean }) {
  const { state, apply } = useGuide();
  const { openRecord, openCash, notify } = useActions();
  const cash = state?.cash.amount ?? null;
  const gap = cash === null ? target : Math.max(0, target - cash);
  const plan = useMemo(() => buildCashPlan(evaluation.records, gap), [evaluation.records, gap]);
  const goalSet = state?.cash.target === target;

  return (
    <section aria-label="Cash plan" className="rounded-[var(--radius-card)] border border-gold/30 bg-gold/8 p-4">
      <div className="flex items-start gap-3">
        <Target size={20} className="mt-0.5 shrink-0 text-gold" aria-hidden />
        <div className="min-w-0 flex-1">
          <p className="eyebrow text-gold">Your plan to {formatCash(target)}</p>
          {cash === null ? (
            <p className="mt-1.5 text-[0.95rem] text-ivory">Tell the guide how much cash you have to see what&apos;s left to earn.</p>
          ) : gap === 0 ? (
            <p className="mt-1.5 text-[0.95rem] text-ivory">You&apos;re there. Keep it in BuckMe and mark the goal done.</p>
          ) : (
            <p className="mt-1.5 text-[0.95rem] text-ivory">
              You have {formatCash(cash)}. <span className="font-semibold text-gold">{formatCash(gap)}</span> to go.
            </p>
          )}
        </div>
      </div>

      {gap > 0 && (
        <ol className="mt-3 space-y-1.5">
          {plan.steps.map((step, i) => (
            <li key={step.recordId}>
              <button
                type="button"
                onClick={() => openRecord(step.recordId)}
                className="tap flex min-h-12 w-full items-center gap-3 rounded-xl bg-ink/40 px-3 py-2 text-left hover:bg-ink/60"
              >
                <span className="w-5 shrink-0 font-[family-name:var(--font-display)] text-[0.95rem] font-semibold text-gold">{i + 1}</span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[0.95rem] text-ivory">
                    {step.repeat ? `${step.name} ×${step.repeat}` : step.name}
                  </span>
                  <span className="block text-[0.75rem] text-ivory-3">{step.note}</span>
                </span>
                <span className="shrink-0 text-[0.875rem] font-medium text-sea">+{formatCash(step.amount)}</span>
              </button>
            </li>
          ))}
          {plan.steps.length === 0 && (
            <li className="text-[0.875rem] text-ivory-3">No documented earners are open to you yet. Check the Money tab as new jobs appear.</li>
          )}
        </ol>
      )}
      {gap > 0 && plan.steps.length > 0 && (
        <p className={cx("mt-2 flex items-center gap-1.5 text-[0.75rem]", plan.covered >= gap ? "text-sea" : "text-ivory-3")}>
          <Flag size={12} aria-hidden />
          {plan.covered >= gap
            ? "That gets you there, using the low end of each payout."
            : `That covers about ${formatCash(plan.covered)}. More jobs will open as you play.`}
        </p>
      )}

      {!compact && (
        <div className="mt-3 flex flex-wrap gap-2">
          <Button size="sm" onClick={openCash}>Update my cash</Button>
          {!goalSet && (
            <Button
              size="sm"
              variant="quiet"
              onClick={async () => {
                if (await apply({ type: "set-cash-target", target }, `Savings goal: ${formatCash(target)}`)) notify(`Goal set to ${formatCash(target)}`, true);
              }}
            >
              Track this goal
            </Button>
          )}
        </div>
      )}
    </section>
  );
}
