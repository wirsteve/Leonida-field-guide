import type { Requirement } from "@/contracts";

export function requiredCompletions(rule: Requirement): Set<string> {
  return collectRequiredCompletions(rule, false);
}

function collectRequiredCompletions(rule: Requirement, negated: boolean): Set<string> {
  if ("not" in rule) return collectRequiredCompletions(rule.not, !negated);
  if ("completed" in rule && !negated) return new Set([rule.completed]);

  if ("all" in rule || "any" in rule) {
    const isAll = "all" in rule;
    const children = isAll ? rule.all : rule.any;
    const completions = children.map(child => collectRequiredCompletions(child, negated));
    // Negation swaps conjunction and disjunction.
    if (isAll !== negated) return new Set(completions.flatMap(ids => [...ids]));
    const [first, ...rest] = completions;
    return new Set([...(first ?? [])].filter(id => rest.every(ids => ids.has(id))));
  }
  return new Set();
}
