"use client";

import { Pencil } from "lucide-react";
import type { PublicGuideRecord } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { CONFIDENCE_LABEL } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { StatusBanner } from "@/components/shell/status-banner";
import { PageHeader } from "@/components/shell/masthead";
import { SectionLabel, VerificationNote, formatCash, formatMinutes } from "@/components/ui/primitives";
import { cx } from "@/components/ui/cx";
import { isOutstanding } from "@/components/guide/labels";
import { CashPlan, cashGoalOf } from "./cash-plan";

const GRIND_COPY = {
  worthwhile: { title: "Grinding is worth it right now", tone: "text-gold" },
  "not-needed": { title: "You don't need to grind right now", tone: "text-sea" },
  unknown: { title: "No verdict on grinding yet", tone: "text-ivory-2" },
} as const;

const REPEAT = {
  "one-time": "One time",
  repeatable: "Repeatable",
  cooldown: "Has a cooldown",
  limited: "Limited",
  unknown: "Repeatability unconfirmed",
} as const;

export function MoneyScreen() {
  const { evaluation } = useGuide();
  const { openCash, openRecord } = useActions();
  const money = evaluation?.money;
  const methods = (money?.methodIds ?? [])
    .map((id) => evaluation?.records.find((r) => r.id === id))
    .filter((r): r is PublicGuideRecord => Boolean(r));
  const best = money?.bestMethodId ? methods.find((m) => m.id === money.bestMethodId) : undefined;
  const gap = money && money.target !== null && money.cash !== null ? Math.max(0, money.target - money.cash) : null;
  const verdict = GRIND_COPY[money?.grind ?? "unknown"];
  // A story cash requirement the player can see takes precedence; otherwise the goal they set.
  const goalRecord = evaluation?.records.find((r) => cashGoalOf(r) !== null && isOutstanding(r));
  const planTarget = (goalRecord ? cashGoalOf(goalRecord) : null) ?? money?.target ?? null;

  return (
    <main className="page">
      <PageHeader eyebrow="Money" title="Money planner" />
      <StatusBanner />

      <section className="overflow-hidden rounded-[1.6rem] border border-rule-strong bg-panel">
        <div className="relative p-5">
          <div aria-hidden className="absolute inset-0" style={{ background: "radial-gradient(100% 90% at 100% 0%, rgb(228 182 108 / 0.16), transparent 60%)" }} />
          <div className="relative flex items-start justify-between gap-3">
            <div>
              <p className="eyebrow text-ivory-3">Recorded cash</p>
              <p className="headline mt-2 text-[2.6rem] leading-none text-gold">{formatCash(money?.cash)}</p>
              {money?.target != null && (
                <p className="mt-2 text-[0.9rem] text-ivory-2">
                  Goal {formatCash(money.target)}
                  {gap !== null && gap > 0 ? ` · ${formatCash(gap)} to go` : gap === 0 ? " · reached" : ""}
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={openCash}
              className="tap flex min-h-11 items-center gap-1.5 rounded-full bg-ivory/8 px-3.5 text-[0.875rem] text-ivory hover:bg-ivory/12"
            >
              <Pencil size={15} aria-hidden /> Update
            </button>
          </div>
        </div>
        <div className="border-t border-rule p-5">
          <p className={cx("eyebrow", verdict.tone)}>The verdict</p>
          <p className="headline mt-2 text-[1.5rem] leading-tight text-ivory">
            {best ? `Best way to earn now: ${best.name}` : money?.headline ?? "Loading…"}
          </p>
          <p className="mt-2 text-[0.95rem] leading-relaxed text-ivory-2">{best?.guidance ?? money?.body}</p>
          <p className={cx("mt-3 text-[0.9rem] font-medium", verdict.tone)}>{verdict.title}.</p>
        </div>
      </section>

      {evaluation && planTarget !== null && (
        <div className="mt-5">
          <CashPlan evaluation={evaluation} target={planTarget} />
        </div>
      )}

      {methods.length > 0 && (
        <div className="mt-8">
          <SectionLabel>Available earning methods</SectionLabel>
          <ul className="space-y-3">
            {methods.map((m, i) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => openRecord(m.id)}
                  className="tap w-full rounded-[var(--radius-card)] border border-rule bg-panel/70 p-4 text-left hover:bg-panel-2/70"
                >
                  <div className="flex items-start gap-3">
                    <span className="font-[family-name:var(--font-display)] text-[1.1rem] font-semibold text-gold">{String(i + 1).padStart(2, "0")}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-[1.05rem] font-medium text-ivory">{m.name}</p>
                      <p className="mt-0.5 text-[0.875rem] text-ivory-3">{m.summary}</p>
                    </div>
                    <Efficiency value={m.money?.efficiency} />
                  </div>
                  <dl className="mt-3 grid grid-cols-3 gap-2 text-[0.8125rem]">
                    <Stat label="Payout" value={m.money?.payout ? formatCash(m.money.payout.min) + (m.money.payout.max > m.money.payout.min ? "+" : "") : "Not documented"} />
                    <Stat label="Repeat" value={m.money ? REPEAT[m.money.repeatability] : "—"} />
                    <Stat label="Risk" value={m.money?.risk && m.money.risk !== "unknown" ? m.money.risk : "Unconfirmed"} />
                  </dl>
                  <p className="mt-2 text-[0.75rem] text-ivory-3">
                    {formatMinutes(m.money?.timeMinutes) ? `${formatMinutes(m.money?.timeMinutes)} · ` : ""}
                    {CONFIDENCE_LABEL[m.confidence]}
                  </p>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <VerificationNote className="mt-8">
        Only documented payouts are shown. Nothing is assumed to be repeatable unless a source confirms it.
      </VerificationNote>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-ink/40 px-2.5 py-2">
      <dt className="text-[0.6875rem] uppercase tracking-wider text-ivory-3">{label}</dt>
      <dd className="mt-0.5 text-ivory first-letter:uppercase">{value}</dd>
    </div>
  );
}

function Efficiency({ value }: { value?: number }) {
  if (!value) return null;
  return (
    <span className="flex shrink-0 gap-0.5 pt-1.5" aria-label={`Efficiency ${value} of 5`} role="img">
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={cx("h-3 w-1.5 rounded-sm", n <= value ? "bg-gold" : "bg-ivory/10")} />
      ))}
    </span>
  );
}
