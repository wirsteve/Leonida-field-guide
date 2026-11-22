import type { CheckVerdict, PublicGuideRecord, RecordKind, Tri } from "@/contracts";

export const KIND_LABEL: Record<RecordKind, string> = {
  "story-mission": "Story mission",
  "side-mission": "Optional mission",
  activity: "Activity",
  race: "Race",
  encounter: "Encounter",
  "collectible-set": "Collectibles",
  location: "Place",
  "money-method": "Money",
  vehicle: "Vehicle",
  equipment: "Equipment",
  contact: "Contact",
  achievement: "Trophy",
  stage: "Chapter",
};

export function triLabel(value: Tri, yes: string, no: string): string {
  return value === "yes" ? yes : value === "no" ? no : "Not confirmed";
}

export const VERDICT_META: Record<CheckVerdict, { label: string; text: string; bg: string; ring: string }> = {
  "go-ahead": { label: "Go ahead", text: "text-sea", bg: "bg-sea/10", ring: "ring-sea/40" },
  "do-these-first": { label: "Do these first", text: "text-gold", bg: "bg-gold/10", ring: "ring-gold/40" },
  "last-chance": { label: "Last chance", text: "text-flare", bg: "bg-flare/10", ring: "ring-flare/45" },
  "save-first": { label: "Save first", text: "text-coral", bg: "bg-coral/10", ring: "ring-coral/40" },
  unverified: { label: "Unverified", text: "text-ivory-2", bg: "bg-panel-2/60", ring: "ring-rule-strong" },
};

export function isOutstanding(record: Pick<PublicGuideRecord, "status">): boolean {
  return record.status === "available" || record.status === "unsure";
}

export function sourceLine(record: PublicGuideRecord): string {
  if (record.sources.length === 0) return "No sources recorded yet";
  const publishers = [...new Set(record.sources.map((s) => s.publisher))];
  const latest = record.sources.map((s) => s.checkedOn).sort().at(-1);
  const date = latest
    ? new Date(`${latest}T12:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;
  return `${publishers.slice(0, 3).join(", ")}${publishers.length > 3 ? ` +${publishers.length - 3}` : ""}${date ? ` · checked ${date}` : ""}`;
}

export const CONFIDENCE_LABEL = {
  high: "High confidence",
  medium: "Medium confidence",
  low: "Low confidence",
  unverified: "Unverified",
} as const;

/** Community-discovered sandbox fun: never part of the story route or 100%. */
export function isTryThis(record: Pick<PublicGuideRecord, "tags"> | null | undefined): boolean {
  return Boolean(record?.tags.includes("try-this"));
}

/** Classic leisure activities (golf, pool, hoops…): fun, never part of the story route. */
export function isPastime(record: Pick<PublicGuideRecord, "tags"> | null | undefined): boolean {
  return Boolean(record?.tags.includes("pastime"));
}

/** Anything that's purely for fun: stunts, challenge ideas and pastimes. */
export function isFun(record: Pick<PublicGuideRecord, "tags"> | null | undefined): boolean {
  return isTryThis(record) || isPastime(record);
}

export const TRY_THIS_TAGS: Record<string, string> = {
  chaos: "Chaos",
  stunt: "Stunt",
  physics: "Physics",
  funny: "Funny",
  heist: "Heist-ish",
  wildlife: "Wildlife",
  police: "Police",
  hidden: "Hidden detail",
  idea: "Challenge",
};
