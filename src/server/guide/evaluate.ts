import "server-only";
import { CONTRACT_VERSION } from "@/contracts";
import type {
  GuideDataset, GuideEvaluation, ProgressSnapshot, PublicGuideRecord, Recommendation,
  StageRecord, StrategySection,
} from "@/contracts";
import { eligibleGuide, isOutstanding } from "../../engine/eligibility";
import { adviseMoney } from "../../engine/money-advice";
import { rankRecommendations } from "../../engine/recommendation-priority";
import { assessReadiness } from "../../engine/readiness-policy";

export function currentStage(entries: ReturnType<typeof eligibleGuide>["entries"]) {
  const stages = entries.flatMap(({ record, verified, projected }) => {
    if (record.kind !== "stage" || !("editorial" in record) || !record.chapter ||
      !isOutstanding(projected)) return [];
    return [{ record: record as StageRecord, verified }];
  });
  stages.sort((a, b) => (b.record.sequence ?? b.record.chapter ?? 0) -
    (a.record.sequence ?? a.record.chapter ?? 0));
  const current = stages[0];
  if (!current) return null;
  const { record, verified } = current;
  const { chapterLabel, title, intro, saveAdvice, verification } = record.editorial;
  return {
    id: record.id, chapter: record.chapter!, chapterLabel, title, intro, saveAdvice,
    verification: verification === "verified" && !verified ? "unverified" as const : verification,
  };
}

export function readinessCoverage(
  entries: ReturnType<typeof eligibleGuide>["entries"],
  stageCoverage = currentStage(entries)?.verification,
) {
  const disputedRisk = entries.some(({ record, projected }) =>
    isOutstanding(projected) && (record.verification === "conflicted" || record.restricted.conflicts) &&
    (record.expiresWhen || record.public.timing === "before-advancing"));
  return disputedRisk ? "conflicted" : stageCoverage ?? "unverified";
}

const kinds: Partial<Record<PublicGuideRecord["kind"], Recommendation["kind"]>> = {
  "story-mission": "story",
  "side-mission": "optional-mission",
  "money-method": "money",
  "collectible-set": "collect",
  location: "explore",
  equipment: "prepare",
};

function toRecommendation(record: PublicGuideRecord): Recommendation {
  const priority = record.lastChance ? "last-chance"
    : record.timing === "before-advancing" || record.timing === "now" ? "do-now"
    : record.timing === "later-better" ? "wait"
    : record.uniqueExperience || record.kind === "story-mission" ? "recommended" : "optional";
  return {
    id: record.id, recordId: record.id, confidence: record.confidence, priority,
    kind: priority === "wait" ? "postpone" : kinds[record.kind] ?? "activity",
    title: record.name,
    body: priority === "wait" ? "You can leave this for later."
      : record.lastChance ? record.lastChanceCopy ?? "Finish this before continuing the story."
      : record.guidance,
    actions: [{ type: "view-record", recordId: record.id }],
  };
}

export function evaluateGuide(dataset: GuideDataset, snapshot: ProgressSnapshot): GuideEvaluation {
  const { entries, areas } = eligibleGuide(dataset, snapshot);
  const stage = currentStage(entries);
  const records = entries.filter(({ projected }) => projected.kind !== "stage").map(({ projected }) => projected);
  const outstanding = entries.filter(({ projected }) => projected.kind !== "stage" && isOutstanding(projected));
  outstanding.sort((left, right) => (left.record.sequence ?? Infinity) - (right.record.sequence ?? Infinity));
  const ranked = rankRecommendations(outstanding, ({ projected }) => {
    if (projected.lastChance) return "missable";
    if (projected.timing === "before-advancing") return "preparation";
    if (projected.timing === "later-better") return "postponable";
    if (projected.timing === "now" || projected.kind === "story-mission") return "current-stage";
    if (projected.kind === "location") return "exploration";
    return "optional";
  }).map(({ projected }) => projected);
  const queue = ranked.map(toRecommendation);
  const blocking = ranked.filter(record => record.lastChance || record.timing === "before-advancing")
    .map(({ id, name, lastChance }) => ({ recordId: id, name, lastChance }));
  const verification = readinessCoverage(entries, stage?.verification);
  const decision = assessReadiness(
    verification === "verified" ? "verified-safe" : verification === "conflicted" ? "conflicted" : "incomplete",
    blocking.map(record => record.lastChance ? "last-chance" : "prepare"),
  );
  const readiness = {
    LAST_CHANCE: ["last-chance", "Finish time-sensitive activities first"],
    DO_THESE_FIRST: ["complete-these-first", "Prepare before advancing"],
    GO_AHEAD: ["safe-to-advance", "Ready to advance"],
    SAVE_FIRST: ["not-fully-verified", "Readiness is still being verified"],
    UNVERIFIED: ["not-fully-verified", "Readiness is still being verified"],
  } as const;
  const [status, headline] = readiness[decision];
  const sections: StrategySection[] = [];
  const section = (
    kind: StrategySection["kind"], title: string, emptyText: string,
    items: Recommendation[],
  ) => {
    sections.push({ kind, title, emptyText,
      items: items.map(({ recordId, title, body, priority }) => ({ recordId, title, body, priority })),
    });
  };
  section("recommended-order", "Recommended order", "No current recommendations.",
    queue.filter(item => item.priority !== "wait"));
  section("missable", "Last chance", "No verified last-chance opportunity.",
    queue.filter(item => item.priority === "last-chance"));
  section("high-value-optional", "Optional highlights", "No verified optional highlights.",
    queue.filter(item => item.kind === "optional-mission" && item.priority === "recommended"));
  section("preparation", "Preparation", "No verified preparation requirements.",
    queue.filter(item => item.kind === "prepare" && item.priority !== "wait"));
  section("exploration", "Exploration", "No current exploration suggestions.",
    queue.filter(item => item.kind === "explore" && item.priority !== "wait"));
  section("postpone", "Save for later", "No verified reasons to postpone an activity.",
    queue.filter(item => item.priority === "wait"));
  const explore = queue.find(item => item.kind === "explore" && item.priority !== "wait");
  return {
    contractVersion: CONTRACT_VERSION, contentVersion: dataset.contentVersion, generatedAt: new Date().toISOString(),
    stage, records, areas, queue, nextBestMove: queue.find(item => item.priority !== "wait") ?? null,
    readiness: { status, headline, blocking, verification, detail: dataset.coverageNote },
    money: adviseMoney(entries.filter(entry => entry.available).map(entry => entry.projected), snapshot), strategy: { stage, sections },
    explore: explore?.recordId ? { recordId: explore.recordId, title: explore.title, body: explore.body } : null,
    coverageNote: dataset.coverageNote,
    progress: {
      visibleCompleted: records.filter(record => record.status === "completed").length,
      uniqueExperienced: records.filter(record => record.status === "completed" && record.uniqueExperience).length,
    },
  };
}
