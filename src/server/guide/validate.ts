import "server-only";
import type { Requirement } from "@/contracts";
import { guideDatasetSchema } from "@/contracts/schemas";
import { requiredCompletions } from "../../engine/requirements";

function references(rule: Requirement): string[] {
  if ("completed" in rule) return [rule.completed];
  if ("discovered" in rule) return [rule.discovered];
  if ("not" in rule) return references(rule.not);
  if ("all" in rule) return rule.all.flatMap(references);
  if ("any" in rule) return rule.any.flatMap(references);
  return [];
}

function checkContradictions(rule: Requirement): void {
  if ("all" in rule) {
    const positive = new Set(rule.all.filter(child => !("not" in child)).map(child => JSON.stringify(child)));
    if (rule.all.some(child => "not" in child && positive.has(JSON.stringify(child.not)))) {
      throw new Error("Contradictory guide requirements");
    }
    rule.all.forEach(checkContradictions);
  }
  if ("any" in rule) rule.any.forEach(checkContradictions);
  if ("not" in rule) checkContradictions(rule.not);
}

export function validateDataset(input: unknown) {
  const dataset = guideDatasetSchema.parse(input);
  const ids = new Set(dataset.records.map(record => record.id));
  const areas = new Set(dataset.areas.map(area => area.id));
  if (ids.size !== dataset.records.length || areas.size !== dataset.areas.length) {
    throw new Error("Duplicate guide IDs");
  }
  function checkRule(rule: Requirement) {
    if (references(rule).some(id => !ids.has(id))) throw new Error("Unknown guide requirement reference");
    checkContradictions(rule);
  }

  const dependencies = new Map<string, string[]>();
  for (const record of dataset.records) {
    const access: Requirement = { all: [record.visibleWhen, record.availableWhen ?? record.visibleWhen] };
    checkRule(access);
    if (record.expiresWhen) checkRule(record.expiresWhen);
    if (record.public.area && !areas.has(record.public.area)) throw new Error("Unknown guide area");
    if (record.kind === "stage" && (!record.chapter || !("editorial" in record) || !record.editorial)) {
      throw new Error("Incomplete stage definition");
    }
    const ranges = [record.public.estimatedMinutes, record.public.money?.payout, record.public.money?.timeMinutes];
    if (ranges.some(range => range && (range.min < 0 || range.min > range.max))) {
      throw new Error("Invalid guide estimate range");
    }
    dependencies.set(record.id, [...requiredCompletions(access)]);
  }
  dataset.areas.forEach(area => checkRule(area.visibleWhen));

  const checking = new Set<string>();
  const checked = new Set<string>();
  function visit(id: string) {
    if (checked.has(id)) return;
    if (checking.has(id)) throw new Error("Circular guide prerequisite");
    checking.add(id);
    dependencies.get(id)?.forEach(visit);
    checking.delete(id);
    checked.add(id);
  }
  ids.forEach(visit);
  return dataset;
}
