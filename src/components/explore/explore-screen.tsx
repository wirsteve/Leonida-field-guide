"use client";

import { useMemo, useState } from "react";
import { Check, ChevronRight, Flame, MapPin, Minus, Plus, Shuffle, Sparkles, Trophy } from "lucide-react";
import type { PublicGuideRecord, RecordKind } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { CONFIDENCE_LABEL, KIND_LABEL, TRY_THIS_TAGS, isOutstanding, isTryThis } from "@/components/guide/labels";
import { useActions } from "@/components/shell/actions-provider";
import { PageHeader } from "@/components/shell/masthead";
import { StatusBanner } from "@/components/shell/status-banner";
import { SectionLabel, VerificationNote, formatMinutes } from "@/components/ui/primitives";
import { cx } from "@/components/ui/cx";

type Filter = "all" | "try" | "priority" | "unique" | "quick" | "missable" | "done";

const FILTERS: { id: Filter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "try", label: "Try this" },
  { id: "priority", label: "Do first" },
  { id: "unique", label: "Unique" },
  { id: "quick", label: "Under 20 min" },
  { id: "missable", label: "Missable" },
  { id: "done", label: "Done" },
];

const CATEGORIES: { title: string; kinds: RecordKind[]; test?: (r: PublicGuideRecord) => boolean }[] = [
  { title: "Optional missions", kinds: ["side-mission"] },
  { title: "Activities & minigames", kinds: ["activity"], test: (r) => !isTryThis(r) },
  { title: "Races", kinds: ["race"] },
  { title: "Encounters", kinds: ["encounter"] },
  { title: "Places", kinds: ["location"] },
  { title: "Collectibles & 100% checklist", kinds: ["collectible-set"] },
  { title: "Vehicles & equipment", kinds: ["vehicle", "equipment"] },
  { title: "Trophies", kinds: ["achievement"] },
];

const EXPLORE_KINDS = new Set(CATEGORIES.flatMap((c) => c.kinds));

function matches(record: PublicGuideRecord, filter: Filter, area: string | null) {
  if (area && record.area?.id !== area) return false;
  switch (filter) {
    case "try":
      return isTryThis(record) && record.status !== "closed";
    case "priority":
      return isOutstanding(record) && (record.lastChance || record.timing === "now" || record.timing === "before-advancing");
    case "unique":
      return record.uniqueExperience;
    case "quick":
      return isOutstanding(record) && !!record.estimatedMinutes && record.estimatedMinutes.max <= 20;
    case "missable":
      return isOutstanding(record) && (record.missable === "yes" || record.lastChance);
    case "done":
      return record.status === "completed";
    default:
      return record.status !== "closed" && record.timing !== "later-better";
  }
}

export function ExploreScreen() {
  const { evaluation } = useGuide();
  const [filter, setFilter] = useState<Filter>("all");
  const [area, setArea] = useState<string | null>(null);

  const records = useMemo(() => (evaluation?.records ?? []).filter((r) => EXPLORE_KINDS.has(r.kind)), [evaluation]);
  const visible = records.filter((r) => matches(r, filter, area));
  const tryThis = visible.filter(isTryThis);
  const unique = evaluation?.progress.uniqueExperienced ?? 0;
  const official = records.filter((r) => r.officialCompletion === "yes" && r.status === "completed").length;

  return (
    <main className="page">
      <PageHeader eyebrow="Explore" title="Field notes" lede="Things you can reach right now. Nothing ahead of you is listed." />
      <StatusBanner />

      <div className="grid grid-cols-2 gap-2">
        <Counter icon={<Sparkles size={16} />} label="Unique content experienced" value={unique} tone="text-sea" />
        <Counter icon={<Trophy size={16} />} label="Official 100% items done" value={official} tone="text-gold" />
      </div>
      <p className="mt-2 text-[0.75rem] leading-snug text-ivory-3">
        Two different goals. Counts include only what you can currently see, so nothing ahead is implied.
      </p>

      <div className="-mx-4 mt-5 overflow-x-auto px-4 [scrollbar-width:none]" role="toolbar" aria-label="Filters">
        <div className="flex w-max gap-2">
          {FILTERS.map((f) => (
            <Chip key={f.id} active={filter === f.id} onClick={() => setFilter(f.id)}>
              {f.label}
            </Chip>
          ))}
        </div>
      </div>
      {(evaluation?.areas.length ?? 0) > 1 && (
        <div className="-mx-4 mt-2 overflow-x-auto px-4 [scrollbar-width:none]" role="toolbar" aria-label="Areas">
          <div className="flex w-max gap-2">
            <Chip active={area === null} onClick={() => setArea(null)} subtle>
              Everywhere
            </Chip>
            {evaluation!.areas.map((a) => (
              <Chip key={a.id} active={area === a.id} onClick={() => setArea(a.id)} subtle>
                <MapPin size={13} aria-hidden /> {a.label}
              </Chip>
            ))}
          </div>
        </div>
      )}

      <div className="mt-7 space-y-8">
        {CATEGORIES.map((cat, index) => {
          const items = visible.filter((r) => cat.kinds.includes(r.kind) && (cat.test ? cat.test(r) : true));
          // Progress-related optional missions first, then the fun stuff.
          const fun = index === 0 && tryThis.length > 0 ? <TryThisSection items={tryThis} /> : null;
          if (items.length === 0) return fun ? <div key="try-this">{fun}</div> : null;
          return (
            <div key={cat.title} className="space-y-8">
            <section>
              <SectionLabel>{cat.title}</SectionLabel>
              <ul className="divide-y divide-rule overflow-hidden rounded-[var(--radius-card)] border border-rule">
                {items.map((r) => (
                  <ExploreRow key={r.id} record={r} />
                ))}
              </ul>
            </section>
            {fun}
            </div>
          );
        })}
        {evaluation && visible.length === 0 && (
          <p className="rounded-[var(--radius-card)] border border-dashed border-rule-strong p-5 text-center text-[0.95rem] text-ivory-3">
            Nothing here yet for this filter.
          </p>
        )}
      </div>

      <VerificationNote className="mt-8">
        Places appear once you&apos;ve discovered them or the guide has confirmed you can reach them.
      </VerificationNote>
    </main>
  );
}

function ExploreRow({ record }: { record: PublicGuideRecord }) {
  const { openRecord, mark } = useActions();
  const { state, apply } = useGuide();
  const isPlace = record.kind === "location";
  const done = isPlace ? Boolean(state?.discovered[record.id]) : record.status === "completed";
  const minutes = formatMinutes(record.estimatedMinutes);
  const toggle = () =>
    isPlace
      ? apply({ type: "set-discovered", recordId: record.id, discovered: !done }, `${done ? "Undiscovered" : "Discovered"}: ${record.name}`)
      : mark(record, done ? null : "complete");

  if (record.kind === "collectible-set") {
    const count = state?.collectibles[record.id] ?? 0;
    const set = (n: number) =>
      apply({ type: "set-collectible-count", setId: record.id, count: Math.max(0, n) }, `${record.name}: ${Math.max(0, n)} found`);
    return (
      <li className="flex items-center gap-3 bg-panel/50 p-3 pl-4">
        <button type="button" onClick={() => openRecord(record.id)} className="min-h-11 min-w-0 flex-1 text-left">
          <p className="truncate text-[0.975rem] text-ivory">{record.name}</p>
          <p className="text-[0.8125rem] text-ivory-3">
            {count} found{record.collectibleTotal ? ` of ${record.collectibleTotal}` : ""}
          </p>
        </button>
        <div className="flex items-center gap-1">
          <IconButton label={`One fewer ${record.name}`} onClick={() => set(count - 1)} disabled={count === 0}>
            <Minus size={16} />
          </IconButton>
          <span className="w-8 text-center font-[family-name:var(--font-display)] text-lg font-semibold text-gold">{count}</span>
          <IconButton label={`One more ${record.name}`} onClick={() => set(count + 1)}>
            <Plus size={16} />
          </IconButton>
        </div>
      </li>
    );
  }

  return (
    <li className="flex items-center gap-1 bg-panel/50">
      <button
        type="button"
        aria-label={isPlace ? `${record.name} discovered` : done ? `${record.name}: completed. Mark not done` : `Mark ${record.name} complete`}
        aria-pressed={done}
        onClick={toggle}
        className="tap grid size-14 shrink-0 place-items-center"
      >
        <span className={cx("grid size-7 place-items-center rounded-full border-2 transition", done ? "border-sea bg-sea text-ink" : "border-ivory-3/60")}>
          {done && <Check size={15} strokeWidth={3} aria-hidden />}
        </span>
      </button>
      <button type="button" onClick={() => openRecord(record.id)} className="tap flex min-h-16 min-w-0 flex-1 items-center gap-2 py-2.5 pr-3 text-left">
        <span className="min-w-0 flex-1">
          <span className={cx("block truncate text-[0.975rem]", done ? "text-ivory-3" : "text-ivory")}>{record.name}</span>
          <span className="mt-0.5 flex flex-wrap items-center gap-x-2 text-[0.75rem] text-ivory-3">
            <span>{KIND_LABEL[record.kind]}</span>
            {record.area && <span>· {record.area.label}</span>}
            {minutes && <span>· {minutes}</span>}
            {record.uniqueExperience && <span className="text-sea">· Unique</span>}
            {record.lastChance && <span className="font-medium text-flare">· Last chance</span>}
          </span>
        </span>
        <ChevronRight size={18} className="shrink-0 text-ivory-3" aria-hidden />
      </button>
    </li>
  );
}

function Chip({ active, onClick, children, subtle }: { active: boolean; onClick: () => void; children: React.ReactNode; subtle?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cx(
        "tap flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[0.875rem]",
        active ? (subtle ? "bg-sea/18 text-sea ring-1 ring-inset ring-sea/40" : "bg-ivory text-ink font-semibold") : "bg-panel text-ivory-2 ring-1 ring-inset ring-rule hover:text-ivory",
      )}
    >
      {children}
    </button>
  );
}

function Counter({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: number; tone: string }) {
  return (
    <div className="rounded-2xl border border-rule bg-panel/60 p-3.5">
      <p className={cx("flex items-center gap-1.5", tone)} aria-hidden>
        {icon}
      </p>
      <p className="headline mt-2 text-[1.9rem] leading-none text-ivory">{value}</p>
      <p className="mt-1.5 text-[0.75rem] leading-tight text-ivory-3">{label}</p>
    </div>
  );
}

function IconButton({ label, onClick, children, disabled }: { label: string; onClick: () => void; children: React.ReactNode; disabled?: boolean }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="tap grid size-11 place-items-center rounded-full bg-ivory/6 text-ivory hover:bg-ivory/12 disabled:opacity-35"
    >
      {children}
    </button>
  );
}

/** Picks a random not-yet-done "Try this" item and opens it. */
export function SurpriseButton({ items, label = "Surprise me" }: { items: PublicGuideRecord[]; label?: string }) {
  const { openRecord } = useActions();
  const pool = items.filter((r) => r.status !== "completed");
  if (pool.length === 0) return null;
  return (
    <button
      type="button"
      onClick={() => openRecord(pool[Math.floor(Math.random() * pool.length)].id)}
      className="tap flex min-h-11 shrink-0 items-center gap-1.5 rounded-full bg-coral/15 px-3.5 text-[0.8125rem] font-semibold text-coral ring-1 ring-inset ring-coral/35 hover:bg-coral/25"
    >
      <Shuffle size={14} aria-hidden /> {label}
    </button>
  );
}

/** "Try this": viral, community-discovered sandbox fun. Not missions, not 100%. */
function TryThisSection({ items }: { items: PublicGuideRecord[] }) {
  const { openRecord, mark } = useActions();
  return (
    <section aria-labelledby="try-this">
      <div className="mb-3 flex items-center gap-3">
        <h2 id="try-this" className="eyebrow flex shrink-0 items-center gap-1.5 text-coral">
          <Flame size={14} aria-hidden /> Try this
        </h2>
        <span className="h-px flex-1 bg-rule" aria-hidden />
        <SurpriseButton items={items} />
      </div>
      <p className="-mt-1 mb-3 text-[0.8125rem] leading-snug text-ivory-3">
        Stunts players have shared since launch, plus challenge ideas built on real mechanics. Pure fun, with no effect on your progress.
      </p>
      <ul className="space-y-2.5">
        {items.map((r) => {
          const done = r.status === "completed";
          const tags = r.tags.map((t) => TRY_THIS_TAGS[t]).filter(Boolean);
          return (
            <li key={r.id} className="relative overflow-hidden rounded-[var(--radius-card)] border border-rule bg-panel/70">
              <span aria-hidden className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-coral to-gold" />
              <div className="flex items-start gap-1">
                <button type="button" onClick={() => openRecord(r.id)} className="tap min-w-0 flex-1 p-4 pl-5 text-left">
                  <span className={cx("headline block text-[1.2rem] leading-tight", done ? "text-ivory-3" : "text-ivory")}>{r.name}</span>
                  <span className="mt-1.5 block text-[0.9rem] leading-relaxed text-ivory-2">{r.summary}</span>
                  <span className="mt-2.5 flex flex-wrap items-center gap-1.5">
                    {tags.map((t) => (
                      <span key={t} className="rounded-full bg-ivory/6 px-2 py-0.5 text-[0.6875rem] uppercase tracking-wider text-ivory-2">
                        {t}
                      </span>
                    ))}
                    {r.area && <span className="text-[0.75rem] text-ivory-3">· {r.area.label}</span>}
                    <span className={cx("text-[0.75rem]", r.confidence === "low" || r.confidence === "unverified" ? "text-gold" : "text-ivory-3")}>
                      · {r.tags.includes("idea") ? "Challenge idea" : r.confidence === "low" || r.confidence === "unverified" ? "Spotted by players, not confirmed" : `Players found this · ${CONFIDENCE_LABEL[r.confidence]}`}
                    </span>
                  </span>
                </button>
                <button
                  type="button"
                  aria-label={done ? `${r.name}: done. Mark not done` : `Mark ${r.name} done`}
                  aria-pressed={done}
                  onClick={() => mark(r, done ? null : "complete")}
                  className="tap grid size-14 shrink-0 place-items-center"
                >
                  <span className={cx("grid size-7 place-items-center rounded-full border-2", done ? "border-coral bg-coral text-ink" : "border-ivory-3/60")}>
                    {done && <Check size={15} strokeWidth={3} aria-hidden />}
                  </span>
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
