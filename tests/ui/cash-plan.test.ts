import { describe, expect, it } from "vitest";
import type { PublicGuideRecord } from "@/contracts";
import { buildCashPlan, cashGoalOf } from "@/components/money/plan";

type Money = NonNullable<PublicGuideRecord["money"]>;

function earner(id: string, repeatability: Money["repeatability"], min: number, max = min, extra: Partial<PublicGuideRecord> = {}): PublicGuideRecord {
  return {
    id,
    kind: "money-method",
    name: `Synthetic ${id}`,
    status: "available",
    timing: "anytime",
    tags: [],
    money: { payout: { min, max }, repeatability, risk: "low", efficiency: undefined },
    ...extra,
  } as unknown as PublicGuideRecord;
}

describe("cash goal plan", () => {
  it("reads the goal amount from the record's tag", () => {
    expect(cashGoalOf({ tags: ["prepare", "cash-goal:15000"] })).toBe(15000);
    expect(cashGoalOf({ tags: ["prepare"] })).toBeNull();
    expect(cashGoalOf({ tags: ["cash-goal:nope"] })).toBeNull();
    expect(cashGoalOf(null)).toBeNull();
  });

  it("uses one-off jobs first, then a repeatable earner with a count", () => {
    const plan = buildCashPlan([earner("a", "one-time", 2000, 3000), earner("b", "cooldown", 1000), earner("c", "limited", 1500, 4000)], 6000);
    expect(plan.steps.map((s) => s.recordId)).toEqual(["a", "c", "b"]);
    expect(plan.steps.at(-1)).toMatchObject({ recordId: "b", repeat: 3, amount: 3000 });
    expect(plan.covered).toBeGreaterThanOrEqual(6000);
  });

  it("stops once the gap is covered", () => {
    const plan = buildCashPlan([earner("a", "one-time", 9000), earner("b", "repeatable", 500)], 5000);
    expect(plan.steps.map((s) => s.recordId)).toEqual(["a"]);
  });

  it("skips anything done, locked, undocumented or better left for later", () => {
    const records = [
      earner("done", "one-time", 5000, 5000, { status: "completed" }),
      earner("closed", "one-time", 5000, 5000, { status: "closed" }),
      earner("later", "one-time", 5000, 5000, { timing: "later-better" }),
      earner("zero", "repeatable", 0),
      earner("unknown", "unknown", 5000),
    ];
    expect(buildCashPlan(records, 1000).steps).toEqual([]);
  });

  it("reports a shortfall when there's nothing repeatable to close the gap", () => {
    const plan = buildCashPlan([earner("a", "one-time", 1000)], 5000);
    expect(plan.covered).toBe(1000);
  });
});
