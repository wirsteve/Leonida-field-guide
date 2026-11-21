"use client";

import { ChevronRight } from "lucide-react";
import type { Recommendation } from "@/contracts";
import { useActions } from "@/components/shell/actions-provider";
import { PRIORITY_META, PriorityTag } from "@/components/ui/priority";
import { cx } from "@/components/ui/cx";

/**
 * A vertically connected route, numbered like a printed guide's walkthrough
 * steps. Starts at `startAt` so it continues from the hero (step 01).
 */
export function RouteQueue({ items, startAt = 2 }: { items: Recommendation[]; startAt?: number }) {
  const { openRecord } = useActions();
  return (
    <ol className="relative">
      {items.map((item, index) => {
        const meta = PRIORITY_META[item.priority];
        const last = index === items.length - 1;
        return (
          <li key={item.id} className="relative pl-12">
            {!last && <span aria-hidden className="absolute bottom-0 left-[19px] top-10 w-px bg-rule-strong" />}
            <span
              aria-hidden
              className={cx(
                "absolute left-0 top-2.5 grid size-10 place-items-center rounded-full border-2 bg-night font-[family-name:var(--font-display)] text-[0.95rem] font-semibold tracking-wide text-ivory",
                meta.rail,
              )}
            >
              {String(index + startAt).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => item.recordId && openRecord(item.recordId)}
              className="tap group mb-2 flex w-full items-start gap-2 rounded-2xl px-3 py-3 text-left hover:bg-panel/70"
            >
              <span className="min-w-0 flex-1">
                <PriorityTag priority={item.priority} />
                <span className="mt-2 block text-[1.05rem] font-medium leading-snug text-ivory">{item.title}</span>
                <span className="mt-1 line-clamp-2 block text-[0.9rem] leading-relaxed text-ivory-3">{item.body}</span>
              </span>
              <ChevronRight size={18} className="mt-8 shrink-0 text-ivory-3 transition group-hover:translate-x-0.5" aria-hidden />
            </button>
          </li>
        );
      })}
    </ol>
  );
}
