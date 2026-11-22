import type { PublicGuideRecord } from "@/contracts";

const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** A record that asks the player to reach a cash amount carries a "cash-goal:<amount>" tag. */
export function cashGoalOf(record: Pick<PublicGuideRecord, "tags"> | null | undefined): number | null {
  const tag = record?.tags.find((t) => t.startsWith("cash-goal:"));
  const value = tag ? Number(tag.slice("cash-goal:".length)) : NaN;
  return Number.isFinite(value) && value > 0 ? value : null;
}

export interface CashStep {
  recordId: string;
  name: string;
  amount: number;
  note: string;
  repeat?: number;
}

/**
 * Builds a plan from what the player can see right now: one-off paying jobs
 * first (best value first), then a repeatable earner to close any gap.
 * Uses the LOW end of each documented payout so the plan doesn't overpromise.
 */
export function buildCashPlan(records: PublicGuideRecord[], gap: number): { steps: CashStep[]; covered: number } {
  const open = records.filter(
    (r) => (r.status === "available" || r.status === "unsure") && r.money?.payout && r.money.payout.min > 0 && r.timing !== "later-better",
  );
  const oneOffs = open
    .filter((r) => r.money!.repeatability === "one-time" || r.money!.repeatability === "limited")
    .sort((a, b) => (b.money!.efficiency ?? 0) - (a.money!.efficiency ?? 0) || b.money!.payout!.min - a.money!.payout!.min);
  const repeatables = open
    .filter((r) => r.money!.repeatability === "repeatable" || r.money!.repeatability === "cooldown")
    .sort((a, b) => (b.money!.efficiency ?? 0) - (a.money!.efficiency ?? 0) || b.money!.payout!.min - a.money!.payout!.min);

  const steps: CashStep[] = [];
  let covered = 0;
  for (const r of oneOffs) {
    if (covered >= gap) break;
    const p = r.money!.payout!;
    const amount = p.min;
    covered += amount;
    steps.push({
      recordId: r.id,
      name: r.name,
      amount,
      note: r.money!.repeatability === "limited" ? `${usd(p.min)}–${usd(p.max)} per job` : p.max > p.min ? `up to ${usd(p.max)}` : "one-time",
    });
  }
  const best = repeatables[0];
  if (covered < gap && best) {
    const each = best.money!.payout!.min;
    const repeat = Math.ceil((gap - covered) / each);
    covered += repeat * each;
    steps.push({ recordId: best.id, name: best.name, amount: repeat * each, note: `about ${usd(each)} each`, repeat });
  }
  return { steps, covered };
}
