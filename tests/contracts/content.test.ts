import { describe, expect, it } from "vitest";
import { loadGuideDataset } from "@/content/guide";
import { validateDataset } from "@/content/tooling/validate";

describe("authored guide dataset", () => {
  it("passes schema, integrity, evidence and spoiler-lint validation", () => {
    const { dataset, issues } = validateDataset(loadGuideDataset());
    expect(dataset).not.toBeNull();
    expect(issues.filter((i) => i.level === "error")).toEqual([]);
  });

  it("flags copy that names a later story mission", () => {
    const base = {
      kind: "story-mission" as const,
      missable: "no" as const,
      restricted: {},
      evidence: [],
      confidence: "unverified" as const,
      verification: "unverified" as const,
      lastReviewed: "2026-11-21",
      chapter: 1,
    };
    const pub = (name: string, guidance: string) => ({
      name, aliases: [], summary: "Synthetic.", tags: [], uniqueExperience: false,
      officialCompletion: "unknown" as const, timing: "anytime" as const, guidance,
    });
    const { issues } = validateDataset({
      contentVersion: "t", generatedOn: "2026-11-21", coverageNote: "t", areas: [],
      records: [
        { ...base, id: "synthetic-a", sequence: 1, visibleWhen: { always: true }, public: pub("Synthetic Alpha", "Do this before Synthetic Omega.") },
        { ...base, id: "synthetic-b", sequence: 2, visibleWhen: { completed: "synthetic-a" }, public: pub("Synthetic Omega", "Fine.") },
      ],
    });
    expect(issues.some((i) => i.recordId === "synthetic-a" && /later story mission/.test(i.message))).toBe(true);
  });
});
