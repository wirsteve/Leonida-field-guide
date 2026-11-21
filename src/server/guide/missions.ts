import "server-only";
import type { CheckRequest, GuideDataset, IdentifyRequest, IdentifyResponse, MissionCheckResult,
  ProgressSnapshot, PublicGuideRecord, SuggestRequest, SuggestResponse } from "@/contracts";
import { eligibleGuide, isOutstanding } from "../../engine/eligibility";
import { assessReadiness } from "../../engine/readiness-policy";
import { requiredCompletions } from "../../engine/requirements";
import { readinessCoverage } from "./evaluate";

function normalize(text: string): string {
  return text.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
}

function names(record: PublicGuideRecord): string[] {
  return record.nameWithheld ? [] : [record.name, ...record.aliases].map(normalize);
}

function uniqueMatch<T extends { projected: PublicGuideRecord }>(entries: T[], query: string): T | undefined {
  const matches = entries.filter(({ projected }) => names(projected).includes(normalize(query)));
  return matches.length === 1 ? matches[0] : undefined;
}

function missions(entries: ReturnType<typeof eligibleGuide>["entries"]) {
  return entries.filter(({ projected }) => projected.kind === "story-mission" || projected.kind === "side-mission");
}

export function suggestMissions(dataset: GuideDataset, { snapshot, query, limit = 8 }: SuggestRequest): SuggestResponse {
  const search = normalize(query);
  const suggestions = missions(eligibleGuide(dataset, snapshot).entries)
    .filter(({ projected }) => isOutstanding(projected) &&
      (!search || names(projected).some(name => name.startsWith(search))))
    .slice(0, limit)
    .map(({ projected: { id, name, status } }) => ({ recordId: id, name, status }));
  return { suggestions };
}

export function identifyMission(dataset: GuideDataset, { snapshot, query }: IdentifyRequest): IdentifyResponse {
  const entries = missions(eligibleGuide(dataset, snapshot).entries)
    .filter(({ record, verified }) => record.kind === "story-mission" && verified);
  const match = uniqueMatch(entries, query);
  if (!match) return { matched: null, impliedComplete: [] };
  const byId = new Map(entries.map(entry => [entry.record.id, entry.record]));
  const confirmed = new Set<string>([match.record.id]);
  for (const id of confirmed) {
    const record = byId.get(id)!;
    const requirements = [record.visibleWhen, record.availableWhen ?? record.visibleWhen];
    for (const requirement of requirements) {
      for (const predecessor of requiredCompletions(requirement)) {
        if (byId.has(predecessor)) confirmed.add(predecessor);
      }
    }
  }
  return { matched: { recordId: match.record.id, name: match.projected.name }, impliedComplete: [...confirmed] };
}

export function checkMission(dataset: GuideDataset, snapshot: ProgressSnapshot,
  { query, recordId }: Omit<CheckRequest, "snapshot">): MissionCheckResult {
  const { entries, expiryTriggers } = eligibleGuide(dataset, snapshot);
  const available = missions(entries).filter(({ projected }) => isOutstanding(projected));
  const match = recordId ? available.find(({ record }) => record.id === recordId)
    : query ? uniqueMatch(available, query) : undefined;
  if (!match) return {
    matched: null, verdict: "unverified", headline: "Mission could not be confirmed",
    body: "Choose a currently available mission.", tasks: [], saveFirst: false, confidence: "unverified",
  };

  const tasks = entries.flatMap(({ projected }) => {
    if (!isOutstanding(projected) || projected.id === match.record.id || projected.kind === "stage") return [];
    const lastChance = expiryTriggers.get(projected.id)?.has(match.record.id) ?? false;
    if (!lastChance && (match.record.kind !== "story-mission" || projected.timing !== "before-advancing")) return [];
    return [{ recordId: projected.id, name: projected.name, lastChance,
      guidance: lastChance ? projected.lastChanceCopy ?? "Finish this before starting."
        : "Complete this preparation before advancing." }];
  }).sort((a, b) => Number(b.lastChance) - Number(a.lastChance));
  const coverage = readinessCoverage(entries);
  const safe = coverage === "verified" && match.verified;
  const saveFirst = match.projected.saveBeforeStarting;
  const warnings: Parameters<typeof assessReadiness>[1] = [
    ...tasks.map(task => task.lastChance ? "last-chance" as const : "prepare" as const),
    ...(safe && saveFirst ? ["save-first" as const] : []),
  ];
  const decision = assessReadiness(safe ? "verified-safe" : "incomplete", warnings);
  const verdicts = {
    LAST_CHANCE: ["last-chance", "Last chance", "Finish the listed activities before starting."],
    DO_THESE_FIRST: ["do-these-first", "Prepare before starting", "Complete the listed preparation first."],
    SAVE_FIRST: ["save-first", "Save before starting", "Make a separate manual save first."],
    GO_AHEAD: ["go-ahead", "Ready to start", "Verified coverage supports starting this mission."],
    UNVERIFIED: ["unverified", "Readiness is unverified", "Research does not establish whether it is safe to start."],
  } as const;
  const [verdict, headline, body] = verdicts[decision];
  return {
    matched: { recordId: match.record.id, name: match.projected.name },
    verdict, headline, body, tasks, saveFirst,
    confidence: verdict === "unverified" ? "unverified" : safe ? match.projected.confidence : "medium",
  };
}
