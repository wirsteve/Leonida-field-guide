"use client";

import { useMemo } from "react";
import { Check } from "lucide-react";
import type { PublicGuideRecord } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { KIND_LABEL, isOutstanding } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { Sheet } from "@/components/ui/sheet";

const GROUPS: { title: string; kinds: PublicGuideRecord["kind"][] }[] = [
  { title: "Story", kinds: ["story-mission"] },
  { title: "Optional missions", kinds: ["side-mission"] },
  { title: "Activities & more", kinds: ["activity", "race", "encounter", "money-method", "vehicle", "equipment", "achievement"] },
];

/** One-tap completion for everything currently outstanding. */
export function CompleteSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { evaluation } = useGuide();
  const { mark } = useActions();

  const groups = useMemo(() => {
    const outstanding = (evaluation?.records ?? []).filter(isOutstanding);
    return GROUPS.map((g) => ({ ...g, items: outstanding.filter((r) => g.kinds.includes(r.kind)) })).filter(
      (g) => g.items.length > 0,
    );
  }, [evaluation]);

  return (
    <Sheet open={open} onClose={onClose} eyebrow="Mark complete" title="What did you just finish?">
      {groups.length === 0 && (
        <p className="rounded-2xl bg-panel/60 p-4 text-[0.95rem] text-ivory-2">Nothing outstanding is recorded right now.</p>
      )}
      <div className="space-y-5">
        {groups.map((group) => (
          <section key={group.title}>
            <p className="eyebrow mb-2 text-ivory-3">{group.title}</p>
            <ul className="divide-y divide-rule overflow-hidden rounded-2xl border border-rule">
              {group.items.map((record) => (
                <li key={record.id} className="flex items-center gap-3 bg-panel/50 py-2 pl-4 pr-2">
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[0.975rem] text-ivory">{record.name}</p>
                    <p className="text-[0.75rem] text-ivory-3">
                      {KIND_LABEL[record.kind]}
                      {record.status === "unsure" ? " · not sure" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => mark(record, "complete")}
                    className="tap flex min-h-11 items-center gap-1.5 rounded-full bg-sea/14 px-3.5 text-[0.875rem] font-semibold text-sea ring-1 ring-inset ring-sea/30 hover:bg-sea/22"
                  >
                    <Check size={16} aria-hidden /> Done
                  </button>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </Sheet>
  );
}
