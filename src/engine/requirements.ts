import type { Requirement } from "@/contracts";

export function requiredCompletions(rule: Requirement): Set<string> {
  if ("completed" in rule) return new Set([rule.completed]);
  if ("all" in rule) return new Set(rule.all.flatMap(child => [...requiredCompletions(child)]));
  if ("any" in rule) {
    const [first, ...rest] = rule.any.map(requiredCompletions);
    return new Set([...(first ?? [])].filter(id => rest.every(set => set.has(id))));
  }
  return new Set();
}
