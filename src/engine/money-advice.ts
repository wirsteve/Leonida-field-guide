import type { MoneyAdvice, MoneyFacts, ProgressSnapshot, PublicGuideRecord } from "@/contracts";

function conservativeRate(facts: MoneyFacts): number | null {
  if (!facts.payout || !facts.timeMinutes || facts.timeMinutes.max <= 0) return null;
  return facts.payout.min / facts.timeMinutes.max;
}

const risks = { low: 0, medium: 1, high: 2, unknown: 3 };

export function adviseMoney(
  records: readonly PublicGuideRecord[],
  { cash, cashTarget: target }: Pick<ProgressSnapshot, "cash" | "cashTarget">,
): MoneyAdvice {
  const gap = target === null || cash === null ? null : Math.max(0, target - cash);
  const methods = records.flatMap(record =>
    record.money && (record.status !== "completed" || record.money.repeatability === "repeatable")
      ? [{ id: record.id, facts: record.money }] : []);
  methods.sort((left, right) => {
    const fillsGap = (facts: MoneyFacts) => Number(gap !== null && gap > 0 && (facts.payout?.min ?? 0) >= gap);
    return fillsGap(right.facts) - fillsGap(left.facts) ||
      (conservativeRate(right.facts) ?? -1) - (conservativeRate(left.facts) ?? -1) ||
      (right.facts.efficiency ?? 0) - (left.facts.efficiency ?? 0) ||
      risks[left.facts.risk] - risks[right.facts.risk];
  });
  const best = methods[0];
  const grind = gap === 0 ? "not-needed"
    : gap !== null && best?.facts.repeatability === "repeatable" &&
      conservativeRate(best.facts) !== null && (best.facts.payout?.min ?? 0) > 0 &&
      (best.facts.payout?.min ?? 0) < gap && best.facts.risk === "low" ? "worthwhile" : "unknown";

  return {
    cash, target, grind,
    headline: gap === 0 ? "Cash goal reached" : best ? "Current earning options" : "No verified earning option",
    body: gap === 0 ? "Your recorded cash meets your target."
      : best?.facts.payout ? "Compare the documented payouts and risks before choosing an option."
      : best ? "The ranking uses available qualitative evidence. A payout estimate is unavailable."
      : "There is insufficient research for an earning recommendation at this stage.",
    bestMethodId: gap === 0 ? undefined : best?.id,
    methodIds: methods.map(method => method.id),
  };
}
