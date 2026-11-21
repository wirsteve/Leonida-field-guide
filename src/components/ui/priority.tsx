import type { Priority, ReadinessStatus } from "@/contracts";
import { cx } from "./cx";

export const PRIORITY_META: Record<Priority, { label: string; tone: string; dot: string; rail: string }> = {
  "last-chance": {
    label: "Last chance",
    tone: "bg-flare/15 text-flare ring-1 ring-inset ring-flare/40",
    dot: "bg-flare",
    rail: "border-flare",
  },
  "do-now": {
    label: "Do now",
    tone: "bg-coral text-ink",
    dot: "bg-coral",
    rail: "border-coral",
  },
  recommended: {
    label: "Recommended",
    tone: "bg-gold/12 text-gold ring-1 ring-inset ring-gold/35",
    dot: "bg-gold",
    rail: "border-gold",
  },
  optional: {
    label: "Optional",
    tone: "bg-sea/10 text-sea ring-1 ring-inset ring-sea/30",
    dot: "bg-sea",
    rail: "border-sea",
  },
  wait: {
    label: "Wait",
    tone: "bg-slate/10 text-slate ring-1 ring-inset ring-slate/30",
    dot: "bg-slate",
    rail: "border-slate",
  },
};

export function PriorityTag({ priority, className }: { priority: Priority; className?: string }) {
  const meta = PRIORITY_META[priority];
  return (
    <span
      className={cx(
        "eyebrow inline-flex h-6 shrink-0 items-center gap-1.5 rounded-full px-2.5 text-[0.6875rem] tracking-[0.14em]",
        meta.tone,
        className,
      )}
    >
      {priority === "last-chance" && <span className="size-1.5 animate-pulse rounded-full bg-flare" aria-hidden />}
      {meta.label}
    </span>
  );
}

export const READINESS_META: Record<ReadinessStatus, { label: string; text: string; ring: string; bg: string }> = {
  "safe-to-advance": { label: "Safe to advance", text: "text-sea", ring: "ring-sea/35", bg: "bg-sea/8" },
  "complete-these-first": { label: "Complete these first", text: "text-gold", ring: "ring-gold/35", bg: "bg-gold/8" },
  "last-chance": { label: "Last chance", text: "text-flare", ring: "ring-flare/40", bg: "bg-flare/8" },
  "not-fully-verified": { label: "Not fully verified", text: "text-ivory-2", ring: "ring-rule-strong", bg: "bg-panel-2/40" },
};
