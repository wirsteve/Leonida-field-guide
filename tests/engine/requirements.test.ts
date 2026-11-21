import { describe, expect, it } from "vitest";
import { requiredCompletions } from "@/engine/requirements";

describe("mandatory mission prerequisites (synthetic rules)", () => {
  it("includes completions required by every alternative and drops optional paths", () => {
    const mandatory = { completed: "synthetic-mandatory" } as const;
    expect(requiredCompletions({ any: [
      { all: [mandatory, { completed: "synthetic-branch-a" }] },
      { all: [mandatory, { discovered: "synthetic-branch-b" }] },
    ] })).toEqual(new Set(["synthetic-mandatory"]));
  });

  it("finds positive prerequisites through double negation and De Morgan's laws", () => {
    expect(requiredCompletions({ not: { any: [
      { not: { completed: "synthetic-mandatory" } },
      { discovered: "synthetic-closed-path" },
    ] } })).toEqual(new Set(["synthetic-mandatory"]));
  });

  it("does not treat an excluded completion or a bypassable dependency as mandatory", () => {
    expect(requiredCompletions({ any: [
      { completed: "synthetic-optional" },
      { not: { completed: "synthetic-excluded" } },
    ] })).toEqual(new Set());
  });
});
