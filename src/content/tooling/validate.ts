/**
 * Authoring-time validation for the guide dataset (owner: Claude).
 * Pure function — no server-only import — so tests and the CLI can run it.
 *
 * Checks beyond the zod schema:
 *  - unique ids; every id referenced by a Requirement or area exists
 *  - evidence rules: verified ⇒ evidence + ≥ medium confidence; high ⇒ 2+ sources or an official one
 *  - story chain sanity: story missions/stages carry sequence + chapter
 *  - spoiler lint on public copy:
 *      · banned "why" phrasing (because, next chapter, you'll lose …)
 *      · a record's public copy must not mention the name of any story mission
 *        that comes later than everything the record's visibility depends on
 */
import { guideDatasetSchema } from "@/contracts/schemas";
import { CONFIDENCE_RANK, type GuideDataset, type GuideRecord, type Requirement } from "@/contracts";

export interface ContentIssue {
  level: "error" | "warning";
  recordId?: string;
  message: string;
}

const BANNED_PHRASES: RegExp[] = [
  /\bbecause\b/i,
  /\bnext chapter\b/i,
  /\blater (?:in|chapter)\b/i,
  /\byou'?ll lose\b/i,
  /\bwon'?t be able to return\b/i,
  /\bfinal (?:mission|chapter)\b/i,
  /\bpoint of no return\b/i,
  /\bthe story (?:moves|takes)\b/i,
  /\bchapter (?:three|four|five|six|seven)\b/i,
];

/**
 * A record titled "Spoiler" hides its real title because the mission itself
 * gives things away, so its copy must stay content-free: no tips, and guidance
 * drawn only from this neutral set.
 */
export const SPOILER_GUIDANCE = new Set([
  "Take it when the text arrives.",
  "Take it when he gets in touch.",
  "Take it when she gets in touch.",
  "Take it when it shows up.",
  "Head over when he gets in touch.",
  "Do this soon. It won't wait forever.",
  "Time-limited. Take it as soon as the message arrives.",
]);
const SPOILER_SUMMARY = /^(?:[A-Z][a-z]+ (?:has another job for you|has a job offer waiting|has another job waiting|wants to see you|gets a message)|One of your crew has a job for you)\.$/;

/** "Chapter N" mentions are only allowed up to the record's own chapter. */
function laterChapterMention(text: string, ownChapter: number): number | null {
  for (const match of text.matchAll(/\bchapter\s+0*(\d+)\b/gi)) {
    const n = Number(match[1]);
    if (n > ownChapter) return n;
  }
  return null;
}

function requirementIds(req: Requirement, out: Set<string> = new Set()): Set<string> {
  if ("completed" in req) out.add(req.completed);
  else if ("discovered" in req) out.add(req.discovered);
  else if ("all" in req) req.all.forEach((r) => requirementIds(r, out));
  else if ("any" in req) req.any.forEach((r) => requirementIds(r, out));
  else if ("not" in req) requirementIds(req.not, out);
  return out;
}

/** Ids that must be complete for `req` to hold (ignores `any`/`not` branches). */
function positiveIds(req: Requirement, out: Set<string> = new Set()): Set<string> {
  if ("completed" in req) out.add(req.completed);
  else if ("discovered" in req) out.add(req.discovered);
  else if ("all" in req) req.all.forEach((r) => positiveIds(r, out));
  return out;
}

function publicStrings(record: GuideRecord): string[] {
  const p = record.public;
  const editorial = "editorial" in record && record.editorial ? Object.values(record.editorial as object) : [];
  return [
    p.summary,
    p.guidance,
    p.lastChanceCopy ?? "",
    p.neutralLabel ?? "",
    ...(p.tips ?? []),
    p.money?.payout?.note ?? "",
    p.money?.cooldownNote ?? "",
    ...editorial.filter((v): v is string => typeof v === "string"),
  ].filter(Boolean);
}

export function validateDataset(input: unknown): { dataset: GuideDataset | null; issues: ContentIssue[] } {
  const issues: ContentIssue[] = [];
  const parsed = guideDatasetSchema.safeParse(input);
  if (!parsed.success) {
    for (const issue of parsed.error.issues.slice(0, 50)) {
      issues.push({ level: "error", message: `schema: ${issue.path.join(".")} — ${issue.message}` });
    }
    return { dataset: null, issues };
  }
  const dataset = parsed.data;
  const byId = new Map<string, GuideRecord>();
  for (const record of dataset.records) {
    if (byId.has(record.id)) issues.push({ level: "error", recordId: record.id, message: "duplicate id" });
    byId.set(record.id, record);
  }
  const areaIds = new Set(dataset.areas.map((a) => a.id));

  // Story order: sequence of each story mission.
  const storySeq = new Map<string, number>();
  for (const r of dataset.records) if (r.kind === "story-mission" && r.sequence !== undefined) storySeq.set(r.id, r.sequence);

  /** Latest story sequence the record's visibility guarantees has been reached. */
  const reached = (record: GuideRecord): number => {
    let max = -Infinity;
    const visit = (id: string, seen: Set<string>) => {
      if (seen.has(id)) return;
      seen.add(id);
      const seq = storySeq.get(id);
      if (seq !== undefined) max = Math.max(max, seq);
      const dep = byId.get(id);
      if (dep) positiveIds(dep.visibleWhen).forEach((d) => visit(d, seen));
    };
    const seen = new Set<string>();
    positiveIds(record.visibleWhen).forEach((id) => visit(id, seen));
    if (record.kind === "story-mission" && record.sequence !== undefined) max = Math.max(max, record.sequence);
    return max;
  };

  for (const record of dataset.records) {
    const at = (message: string, level: ContentIssue["level"] = "error") => issues.push({ level, recordId: record.id, message });

    for (const req of [record.visibleWhen, record.availableWhen, record.expiresWhen]) {
      if (!req) continue;
      for (const id of requirementIds(req)) if (!byId.has(id)) at(`requirement references unknown id "${id}"`);
    }
    if (record.public.area && !areaIds.has(record.public.area)) at(`unknown area "${record.public.area}"`);

    if (record.verification === "verified") {
      if (record.evidence.length === 0) at("verified record has no evidence");
      if (CONFIDENCE_RANK[record.confidence] < CONFIDENCE_RANK.medium) at("verified record needs at least medium confidence");
    }
    if (record.confidence === "high") {
      const official = record.evidence.some((e) => e.kind === "official");
      const publishers = new Set(record.evidence.map((e) => e.publisher));
      if (!official && publishers.size < 2) at("high confidence needs an official source or 2+ independent publishers");
    }
    if (record.restricted.conflicts && record.verification === "verified") {
      at("record with recorded conflicts should be 'conflicted' or 'partial', not 'verified'", "warning");
    }
    if ((record.kind === "story-mission" || record.kind === "stage") && (record.sequence === undefined || record.chapter === undefined)) {
      at("story missions and stages need sequence and chapter");
    }
    if (record.kind === "stage" && !("editorial" in record && record.editorial)) at("stage record missing editorial");
    // Ids reach the client even when a story mission's name is withheld, so they must be opaque.
    if (record.kind === "story-mission" && !/^story-\d+$/.test(record.id)) at('story mission ids must be opaque ("story-<n>")');
    if (record.expiresWhen && !record.public.lastChanceCopy) at("expiring record should provide lastChanceCopy", "warning");
    if (record.public.money?.payout && record.evidence.length === 0) at("payout stated without evidence");

    if (record.public.name === "Spoiler") {
      if (record.public.tips?.length) at("'Spoiler' records may not have tips");
      if (!SPOILER_GUIDANCE.has(record.public.guidance)) at(`'Spoiler' guidance must be neutral, got "${record.public.guidance}"`);
      if (!SPOILER_SUMMARY.test(record.public.summary)) at(`'Spoiler' summary must be neutral, got "${record.public.summary}"`);
      if (record.public.lastChanceCopy && !/^Last chance: do this before your next story mission\.$/.test(record.public.lastChanceCopy)) at("'Spoiler' last-chance copy must be neutral");
    }

    // Spoiler lint.
    const strings = publicStrings(record);
    for (const text of strings) {
      for (const pattern of BANNED_PHRASES) if (pattern.test(text)) at(`spoiler lint: "${text}" matches ${pattern}`);
    }
    const horizon = reached(record);
    const horizonStory = [...storySeq].filter(([, seq]) => seq <= horizon).sort((a, b) => b[1] - a[1])[0];
    const ownChapter = record.chapter ?? (horizonStory ? byId.get(horizonStory[0])?.chapter : undefined) ?? 1;
    for (const text of strings) {
      const later = laterChapterMention(text, ownChapter);
      if (later !== null) at(`spoiler lint: "${text}" mentions chapter ${later}`);
    }
    const nameStrings = [record.public.name, ...record.public.aliases, ...strings];
    for (const [storyId, seq] of storySeq) {
      if (storyId === record.id || seq <= horizon) continue;
      const story = byId.get(storyId)!;
      const needle = story.public.name.toLowerCase();
      if (needle.length < 4) continue;
      if (nameStrings.some((t) => t.toLowerCase().includes(needle))) {
        at(`spoiler lint: mentions later story mission "${story.public.name}"`);
      }
    }
  }
  return { dataset, issues };
}
