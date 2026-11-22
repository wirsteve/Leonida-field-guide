"use client";

import Link from "next/link";
import { ChevronRight, Save, Trophy } from "lucide-react";
import type { GuideEvaluation } from "@/contracts";
import type { StrategySection } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { ReadinessPanel } from "@/components/home/readiness-panel";
import { useActions } from "@/components/shell/actions-provider";
import { StatusBanner } from "@/components/shell/status-banner";
import { PriorityTag } from "@/components/ui/priority";
import { VerificationNote } from "@/components/ui/primitives";

const ORDER: StrategySection["kind"][] = [
  "missable",
  "recommended-order",
  "preparation",
  "high-value-optional",
  "exploration",
  "money",
  "equipment",
  "postpone",
  "saves",
];

const LONG_HAUL = new Set<string>(["collectible-set", "achievement"]);

const VERIFICATION_COPY = {
  verified: "Research for this stage is verified.",
  partial: "Research for this stage is partly verified. Treat the plan as a strong guide, not a guarantee.",
  conflicted: "Sources disagree on part of this stage. Where they conflict, the guide holds back.",
  unverified: "Research for this stage isn't verified yet. Recommendations are cautious.",
} as const;

export function StrategyScreen() {
  const { evaluation } = useGuide();
  const stage = evaluation?.strategy.stage ?? evaluation?.stage ?? null;
  const sections = regroup(evaluation).sort((a, b) => ORDER.indexOf(a.kind) - ORDER.indexOf(b.kind));
  const populated = sections.filter((s) => s.items.length > 0);
  const empty = sections.filter((s) => s.items.length === 0);

  return (
    <main className="page">
      <header className="pb-5 pt-4">
        <p className="eyebrow text-sea">{stage ? `${stage.chapterLabel} · Strategy` : "Strategy"}</p>
        <h1 className="headline mt-2 text-[2.1rem] leading-[1.02] text-ivory text-balance">{stage?.title ?? "Your chapter plan"}</h1>
        {stage?.intro && <p className="mt-3 text-[1rem] leading-relaxed text-ivory-2">{stage.intro}</p>}
      </header>
      <StatusBanner />

      {evaluation && <ReadinessPanel readiness={evaluation.readiness} />}

      {stage?.saveAdvice && (
        <div className="mt-4 flex gap-3 rounded-[var(--radius-card)] border border-coral/30 bg-coral/8 p-4">
          <Save size={20} className="mt-0.5 shrink-0 text-coral" aria-hidden />
          <div>
            <p className="eyebrow text-coral">Save advice</p>
            <p className="mt-1.5 text-[0.95rem] leading-relaxed text-ivory">{stage.saveAdvice}</p>
          </div>
        </div>
      )}

      <div className="mt-8 space-y-9">
        {populated.map((section, i) => (
          <Section key={section.kind} section={section} index={i + 1} />
        ))}
      </div>

      {evaluation && <LongHaul evaluation={evaluation} />}

      {empty.length > 0 && evaluation && (
        <div className="mt-9 rounded-[var(--radius-card)] border border-dashed border-rule-strong p-4">
          <p className="eyebrow text-ivory-3">Nothing to act on</p>
          <ul className="mt-2 space-y-1.5">
            {empty.map((s) => (
              <li key={s.kind} className="flex justify-between gap-3 text-[0.875rem]">
                <span className="text-ivory-2">{s.title}</span>
                <span className="text-right text-ivory-3">{s.emptyText}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stage && <VerificationNote className="mt-8">{VERIFICATION_COPY[stage.verification]}</VerificationNote>}
      {!stage && evaluation && <VerificationNote className="mt-8">{evaluation.coverageNote}</VerificationNote>}
    </main>
  );
}

/**
 * Presentation-only regrouping: money methods move out of "Recommended order"
 * into their own Money section, ordered by the engine's money ranking.
 */
function regroup(evaluation: ReturnType<typeof useGuide>["evaluation"]): StrategySection[] {
  if (!evaluation) return [];
  const kindOf = new Map(evaluation.records.map((r) => [r.id, r.kind]));
  const tryThis = new Set(evaluation.records.filter((r) => r.tags.includes("try-this") || r.tags.includes("pastime")).map((r) => r.id));
  const isMoney = (id?: string) => (id ? kindOf.get(id) === "money-method" : false);
  const isFun = (id?: string) => (id ? tryThis.has(id) : false);
  // Long-haul goals (100% checklist counters, trophies) never belong in "what to do next";
  // they live on Explore, with a pointer below.
  const checklist = new Set(evaluation.records.filter((r) => r.tags.includes("100%")).map((r) => r.id));
  const isLongHaul = (id?: string) => (id ? LONG_HAUL.has(kindOf.get(id) ?? "stage") || checklist.has(id) : false);
  let sections = evaluation.strategy.sections.map((section) =>
    section.kind === "recommended-order" || section.kind === "exploration"
      ? { ...section, items: section.items.filter((i) => !isMoney(i.recordId) && !isFun(i.recordId) && !isLongHaul(i.recordId)) }
      : section,
  );
  // An item shown in its own section (optional highlights, exploration) isn't repeated in the order.
  const elsewhere = new Set(
    sections.filter((s) => s.kind !== "recommended-order").flatMap((s) => s.items.map((i) => i.recordId)),
  );
  sections = sections.map((section) =>
    section.kind === "recommended-order"
      ? { ...section, items: section.items.filter((i) => !i.recordId || !elsewhere.has(i.recordId)) }
      : section,
  );
  const money = evaluation.money.methodIds
    .map((id) => evaluation.records.find((r) => r.id === id))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))
    .map((r) => ({ recordId: r.id, title: r.name, body: r.guidance }));
  if (!sections.some((s) => s.kind === "money")) {
    sections.push({ kind: "money", title: "Money", emptyText: "No verified earning method yet.", items: money });
  }
  return sections;
}

function Section({ section, index }: { section: StrategySection; index: number }) {
  const { openRecord } = useActions();
  return (
    <section aria-labelledby={`sec-${section.kind}`}>
      <div className="flex items-baseline gap-3 border-b border-rule pb-2">
        <span className="font-[family-name:var(--font-display)] text-[1.05rem] font-semibold text-gold">§{index}</span>
        <h2 id={`sec-${section.kind}`} className="headline text-[1.35rem] text-ivory">
          {section.title}
        </h2>
      </div>
      <ol className="mt-1">
        {section.items.map((item, i) => (
          <li key={`${item.recordId ?? item.title}-${i}`} className="border-b border-rule/70 last:border-0">
            <button
              type="button"
              onClick={() => item.recordId && openRecord(item.recordId)}
              className="tap flex w-full items-start gap-3 py-3.5 text-left"
            >
              <span className="w-6 shrink-0 pt-0.5 font-[family-name:var(--font-display)] text-[0.95rem] text-ivory-3">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-[1rem] font-medium text-ivory">{item.title}</span>
                  {item.priority && item.priority !== "optional" && item.priority !== "recommended" && (
                    <PriorityTag priority={item.priority} />
                  )}
                </span>
                <span className="mt-1 block text-[0.9rem] leading-relaxed text-ivory-3">{item.body}</span>
              </span>
              <ChevronRight size={18} className="mt-1 shrink-0 text-ivory-3" aria-hidden />
            </button>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** A one-line pointer to the long-haul goals instead of listing them in the plan. */
function LongHaul({ evaluation }: { evaluation: GuideEvaluation }) {
  const open = evaluation.records.filter(
    (r) => (LONG_HAUL.has(r.kind) || r.tags.includes("100%")) && (r.status === "available" || r.status === "unsure"),
  );
  if (open.length === 0) return null;
  const checklist = open.filter((r) => r.kind !== "achievement").length;
  const trophies = open.filter((r) => r.kind === "achievement").length;
  const missable = open.some((r) => r.missable === "yes");
  return (
    <Link
      href="/explore"
      className="tap mt-9 flex items-center gap-3 rounded-[var(--radius-card)] border border-rule bg-panel/60 p-4 hover:bg-panel"
    >
      <Trophy size={20} className="shrink-0 text-gold" aria-hidden />
      <span className="min-w-0 flex-1">
        <span className="block text-[0.95rem] font-medium text-ivory">Long-term goals</span>
        <span className="mt-0.5 block text-[0.8125rem] text-ivory-3">
          {[checklist && `${checklist} 100% checklist items`, trophies && `${trophies} trophies`].filter(Boolean).join(" · ")}
          {missable ? "" : " · nothing missable, so no rush"}
        </span>
      </span>
      <ChevronRight size={18} className="shrink-0 text-ivory-3" aria-hidden />
    </Link>
  );
}
