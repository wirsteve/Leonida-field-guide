import "server-only";
import type { GuideDataset, GuideRecord, ProgressSnapshot, PublicGuideRecord, Requirement } from "@/contracts";

interface Milestones {
  completed: ReadonlySet<string>;
  discovered: ReadonlySet<string>;
}

function meets(requirement: Requirement, progress: Milestones, addedCompletion?: string): boolean {
  if ("completed" in requirement) {
    return requirement.completed === addedCompletion || progress.completed.has(requirement.completed);
  }
  if ("discovered" in requirement) return progress.discovered.has(requirement.discovered);
  if ("all" in requirement) return requirement.all.every(rule => meets(rule, progress, addedCompletion));
  if ("any" in requirement) return requirement.any.some(rule => meets(rule, progress, addedCompletion));
  if ("not" in requirement) return !meets(requirement.not, progress, addedCompletion);
  return "always" in requirement;
}

export function hasVerifiedEvidence(record: GuideRecord): boolean {
  return record.verification === "verified" && !record.restricted.conflicts &&
    (record.confidence === "medium" || record.confidence === "high") && record.evidence.length > 0;
}

export function eligibleGuide(dataset: GuideDataset, snapshot: ProgressSnapshot) {
  const ids = new Set(dataset.records.map(record => record.id));
  const unsure = new Set(snapshot.unsure);
  const progress: Milestones = {
    completed: new Set(snapshot.completed.filter(id => ids.has(id) && !unsure.has(id))),
    discovered: new Set(snapshot.discovered.filter(id => ids.has(id))),
  };
  const visible = dataset.records.filter(record => meets(record.visibleWhen, progress));
  const areas = dataset.areas.filter(area => meets(area.visibleWhen, progress))
    .map(({ id, label }) => ({ id, label }));
  const entries = visible.flatMap(record => {
    const complete = progress.completed.has(record.id);
    const verified = hasVerifiedEvidence(record);
    const expired = verified && !!record.expiresWhen && meets(record.expiresWhen, progress);
    const available = !expired && meets(record.availableWhen ?? record.visibleWhen, progress);
    const closed = !complete && expired;
    if (!complete && !closed && !available) return [];

    const content = record.public;
    const nameWithheld = record.kind === "story-mission" && !complete &&
      !content.nameSafeBeforeStart;
    const status: PublicGuideRecord["status"] = complete ? "completed"
      : closed ? "closed" : unsure.has(record.id) ? "unsure" : "available";
    const postponable = verified && content.timing === "later-better";
    const projected: PublicGuideRecord = {
      id: record.id,
      kind: record.kind,
      name: nameWithheld ? content.neutralLabel ?? "Story mission" : content.name,
      nameWithheld,
      aliases: nameWithheld || !verified ? [] : content.aliases,
      summary: nameWithheld ? "An available story mission." : content.summary,
      area: nameWithheld ? undefined : areas.find(area => area.id === content.area),
      tags: nameWithheld ? [] : content.tags,
      estimatedMinutes: nameWithheld ? undefined : content.estimatedMinutes,
      uniqueExperience: !nameWithheld && content.uniqueExperience,
      officialCompletion: nameWithheld ? "unknown" : content.officialCompletion,
      timing: verified ? content.timing : "unknown",
      guidance: nameWithheld ? "Review readiness before starting."
        : postponable ? "You can leave this for later." : content.guidance,
      tips: nameWithheld || postponable ? [] : content.tips ?? [],
      saveBeforeStarting: verified && !!content.saveBeforeStarting,
      lastChance: false,
      missable: verified ? record.missable : "unknown",
      money: nameWithheld || !verified ? undefined : content.money,
      collectibleTotal: nameWithheld ? undefined : content.collectibleTotal,
      status,
      playerMark: complete ? "complete" : unsure.has(record.id) ? "unsure" : undefined,
      confidence: record.verification === "conflicted" || record.restricted.conflicts
        ? "unverified" : record.confidence,
      sources: nameWithheld ? [] : record.evidence.map(({ publisher, kind, checkedOn }) =>
        ({ publisher, kind, checkedOn })),
    };
    return [{ record, projected, verified, available }];
  });

  const triggers = entries.filter(({ record, projected }) =>
    record.kind === "story-mission" && isOutstanding(projected));
  const expiryTriggers = new Map<string, Set<string>>();
  for (const { record, projected, verified } of entries) {
    const expiry = record.expiresWhen;
    if (!expiry || !verified || !isOutstanding(projected)) continue;
    const triggeredBy = triggers.filter(({ record: mission }) =>
      mission.id !== record.id && meets(expiry, progress, mission.id));
    if (triggeredBy.length === 0) continue;
    expiryTriggers.set(record.id, new Set(triggeredBy.map(({ record }) => record.id)));
    projected.lastChance = true;
    projected.lastChanceCopy = projected.nameWithheld ? undefined : record.public.lastChanceCopy;
  }
  return { entries, areas, expiryTriggers };
}

export function isOutstanding(record: PublicGuideRecord): boolean {
  return record.status === "available" || record.status === "unsure";
}
