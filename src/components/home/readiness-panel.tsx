"use client";

import { AlertTriangle, CircleCheck, CircleDashed, ListChecks } from "lucide-react";
import type { AdvancementReadiness } from "@/contracts";
import { useActions } from "@/components/shell/actions-provider";
import { READINESS_META } from "@/components/ui/priority";
import { cx } from "@/components/ui/cx";

const ICONS = {
  "safe-to-advance": CircleCheck,
  "complete-these-first": ListChecks,
  "last-chance": AlertTriangle,
  "not-fully-verified": CircleDashed,
} as const;

export function ReadinessPanel({ readiness, compact = false }: { readiness: AdvancementReadiness; compact?: boolean }) {
  const { openRecord } = useActions();
  const meta = READINESS_META[readiness.status];
  const Icon = ICONS[readiness.status];

  return (
    <section className={cx("rounded-[var(--radius-card)] p-4 ring-1 ring-inset", meta.bg, meta.ring)}>
      <div className="flex items-start gap-3">
        <Icon size={24} className={cx("mt-0.5 shrink-0", meta.text)} aria-hidden />
        <div className="min-w-0 flex-1">
          <p className={cx("eyebrow", meta.text)}>{meta.label}</p>
          <p className="mt-1.5 text-[1rem] font-medium text-ivory">{readiness.headline}</p>
          {!compact && <p className="mt-1 text-[0.875rem] leading-relaxed text-ivory-3">{readiness.detail}</p>}
        </div>
      </div>
      {readiness.blocking.length > 0 && (
        <ul className="mt-3 space-y-1.5 border-t border-rule pt-3">
          {readiness.blocking.slice(0, compact ? 3 : undefined).map((item) => (
            <li key={item.recordId}>
              <button
                type="button"
                onClick={() => openRecord(item.recordId)}
                className="tap flex min-h-11 w-full items-center gap-2.5 rounded-xl px-2 text-left hover:bg-ivory/5"
              >
                <span className={cx("size-2 shrink-0 rounded-full", item.lastChance ? "bg-flare" : "bg-gold")} aria-hidden />
                <span className="min-w-0 flex-1 truncate text-[0.95rem] text-ivory-2">{item.name}</span>
                {item.lastChance && <span className="eyebrow text-[0.6875rem] text-flare">Last chance</span>}
              </button>
            </li>
          ))}
          {compact && readiness.blocking.length > 3 && (
            <li className="px-2 text-[0.8125rem] text-ivory-3">+{readiness.blocking.length - 3} more in Strategy</li>
          )}
        </ul>
      )}
    </section>
  );
}
