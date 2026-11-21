import { describe, expect, it } from "vitest";
import type { ProgressSnapshot } from "@/contracts";
import { coversSnapshot } from "@/components/guide/guide-client";

const snap = (completed: string[], extra: Partial<ProgressSnapshot> = {}): ProgressSnapshot => ({
  schemaVersion: 1, completed, unsure: [], discovered: [], collectibles: {}, cash: null, cashTarget: null, ...extra,
});

describe("offline view guard", () => {
  it("allows an older view when progress only moved forward", () => {
    expect(coversSnapshot(snap(["a", "b", "c"]), snap(["a", "b"]))).toBe(true);
  });
  it("withholds the view after undo, reset or an older import", () => {
    expect(coversSnapshot(snap(["a"]), snap(["a", "b"]))).toBe(false);
    expect(coversSnapshot(snap([]), snap(["a"]))).toBe(false);
  });
  it("treats a mark changed to 'unsure' as a rollback", () => {
    expect(coversSnapshot(snap(["a", "b"], { unsure: ["b"] }), snap(["a", "b"]))).toBe(false);
  });
  it("withholds when a discovered place is removed", () => {
    expect(coversSnapshot(snap(["a"]), snap(["a"], { discovered: ["p"] }))).toBe(false);
  });
});
