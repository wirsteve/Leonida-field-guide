import { describe, expect, it } from "vitest";
import { PLAYER_STATE_SCHEMA_VERSION, type ProgressSnapshot } from "@/contracts";
import { loadGuideDataset } from "@/content/guide";
import { evaluateGuide, withImpliedProgress } from "@/server/guide/evaluate";
import { checkMission } from "@/server/guide/missions";
import { LINK_CHECKPOINTS } from "@/components/onboarding/checkpoints";

const dataset = loadGuideDataset();
const story = dataset.records.filter((r) => r.kind === "story-mission");
const chapter = (n: number) => story.filter((r) => r.chapter === n).sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
const finale = (n: number) => chapter(n).at(-1)!.id;

const snap = (completed: string[], cash: number | null = 15200): ProgressSnapshot => ({
  schemaVersion: PLAYER_STATE_SCHEMA_VERSION, completed, unsure: [], discovered: [], collectibles: {}, cash, cashTarget: null,
});

// Real owner case: reached the finale via the catch-up link (which skips non-prerequisite errands), then marked the finale done.
const beforeMove = LINK_CHECKPOINTS[0].storyIds;
const afterMove = [...beforeMove, finale(2)];

describe("moving to a new chapter", () => {
  it("treats every story mission and 'before advancing' requirement of a finished chapter as done", () => {
    const implied = new Set(withImpliedProgress(dataset, snap(afterMove)).completed);
    for (const r of chapter(2)) expect(implied.has(r.id), r.id).toBe(true);
    expect(implied.has("money-cash-goal")).toBe(true);
  });

  it("never implies anything in the current or a later chapter", () => {
    const implied = withImpliedProgress(dataset, snap(afterMove)).completed;
    const added = implied.filter((id) => !afterMove.includes(id));
    for (const id of added) {
      const r = dataset.records.find((x) => x.id === id)!;
      expect(r.chapter ?? Math.floor((r.sequence ?? 0) / 100), id).toBeLessThanOrEqual(2);
    }
    // Before the finale, nothing in Chapter 2 is implied.
    const before = withImpliedProgress(dataset, snap(beforeMove)).completed;
    expect(before.filter((id) => !beforeMove.includes(id)).every((id) => !/^story-2/.test(id) && id !== "money-cash-goal")).toBe(true);
  });

  it("puts the new chapter first and drops old 'do now' leftovers out of the way", () => {
    const e = evaluateGuide(dataset, snap(afterMove));
    expect(e.stage?.chapter).toBe(3);
    expect(e.nextBestMove?.recordId).toBe(chapter(3)[0].id);
    expect(e.readiness.blocking).toEqual([]);
    const firstOld = e.queue.findIndex((q) => /^(side|act|money|prep)-/.test(q.recordId ?? "") && dataset.records.find((r) => r.id === q.recordId)!.sequence! < 300);
    const lastNew = e.queue.findLastIndex((q) => (dataset.records.find((r) => r.id === q.recordId)?.sequence ?? 0) >= 300);
    if (firstOld !== -1 && lastNew !== -1) expect(firstOld).toBeGreaterThan(lastNew);
    for (const q of e.queue) {
      const r = dataset.records.find((x) => x.id === q.recordId);
      if (r && r.kind !== "story-mission" && (r.sequence ?? 999) < 300 && !q.priority.startsWith("last")) {
        expect(["optional", "wait"]).toContain(q.priority);
      }
    }
  });

  it("keeps the pre-move plan intact before the finale", () => {
    const e = evaluateGuide(dataset, snap(beforeMove));
    expect(e.stage?.chapter).toBe(2);
    expect(e.readiness.blocking.map((b) => b.recordId)).toContain("money-cash-goal");
  });

  it("checks the first new-chapter mission without the old errands blocking it", () => {
    const result = checkMission(dataset, snap(afterMove), { recordId: chapter(3)[0].id });
    expect(result.matched?.recordId).toBe(chapter(3)[0].id);
    expect(result.tasks.map((t) => t.recordId)).not.toContain("money-cash-goal");
  });
});
