import { describe, expect, it } from "vitest";
import type { GuideDataset, GuideRecord, ProgressSnapshot, StageRecord } from "@/contracts";
import { evaluateGuide } from "@/server/guide/evaluate";
import { checkMission, identifyMission, suggestMissions } from "@/server/guide/missions";
import { checkPost, evaluatePost } from "@/server/guide/http";

const date = "2026-11-21";
const progress: ProgressSnapshot = {
  schemaVersion: 1, completed: [], unsure: [], discovered: [], collectibles: {}, cash: null, cashTarget: null,
};

function record(id: string, kind: GuideRecord["kind"], name: string): GuideRecord {
  return {
    id: `synthetic-${id}`, kind, visibleWhen: { always: true }, missable: "unknown",
    public: {
      name, aliases: [], summary: "Synthetic summary.", guidance: "Synthetic guidance.",
      tags: [], uniqueExperience: false, officialCompletion: "unknown",
      timing: "anytime", nameSafeBeforeStart: true,
    },
    evidence: [{
      id: "synthetic-source", url: "https://example.test/SYNTHETIC-url", publisher: "Synthetic source",
      title: "SYNTHETIC private title", kind: "firsthand", checkedOn: date, supports: "SYNTHETIC private claim",
    }],
    confidence: "medium", verification: "verified", lastReviewed: date,
    restricted: { notes: "SYNTHETIC private notes" },
  };
}

const mission = record("mission", "story-mission", "Synthetic first mission");
const future: GuideRecord = {
  ...record("future", "story-mission", "Synthetic secret future title"),
  visibleWhen: { completed: mission.id },
};
const missable: GuideRecord = {
  ...record("option", "side-mission", "Synthetic side activity"),
  expiresWhen: { completed: mission.id }, missable: "yes",
};
const stage: StageRecord = {
  ...record("stage", "stage", "Synthetic stage"), kind: "stage", chapter: 1,
  editorial: { chapterLabel: "Synthetic chapter", title: "Synthetic stage", intro: "Synthetic intro", verification: "verified" },
};

function data(...records: GuideRecord[]): GuideDataset {
  return { records, areas: [], contentVersion: "synthetic-v1", generatedOn: date, coverageNote: "Synthetic coverage." };
}

describe("guide gateway (synthetic dataset)", () => {
  it("warns about the exact activity before its trigger and clears it after completion", () => {
    const dataset = data(stage, mission, future, missable);
    const warning = checkMission(dataset, progress, { recordId: mission.id });
    expect(warning.verdict).toBe("last-chance");
    expect(warning.tasks).toEqual([expect.objectContaining({ recordId: missable.id, name: missable.public.name })]);
    expect(evaluateGuide(dataset, progress).nextBestMove?.recordId).toBe(missable.id);

    const complete = { ...progress, completed: [missable.id] };
    expect(checkMission(dataset, complete, { recordId: mission.id }).verdict).toBe("go-ahead");
    expect(evaluateGuide(dataset, complete).queue.map(item => item.recordId)).not.toContain(missable.id);
    expect(evaluateGuide(dataset, progress).queue.map(item => item.recordId)).toContain(missable.id);
  });

  it("does not fabricate expiry warnings or safety with incomplete research", () => {
    const dataset = data(mission, { ...missable, verification: "conflicted" });
    const result = checkMission(dataset, progress, { recordId: mission.id });
    expect(result.verdict).toBe("unverified");
    expect(result.tasks).toEqual([]);
    expect(evaluateGuide(dataset, progress).readiness.status).toBe("not-fully-verified");
  });

  it("projects only eligible data and keeps a lookup miss identical for unknown and future input", () => {
    const neutral = { ...mission, public: { ...mission.public, nameSafeBeforeStart: false, aliases: ["Synthetic withheld alias"] } };
    const dataset = data(stage, neutral, future);
    const view = evaluateGuide(dataset, progress);
    const json = JSON.stringify(view);
    for (const secret of [future.public.name, future.id, neutral.public.name, "Synthetic withheld alias", "SYNTHETIC private", "example.test"]) {
      expect(json).not.toContain(secret);
    }
    expect(view.records[0].name).toBe("Story mission");
    expect(view.progress).toEqual({ visibleCompleted: 0, uniqueExperienced: 0 });
    expect(suggestMissions(dataset, { snapshot: progress, query: future.public.name })).toEqual({ suggestions: [] });
    expect(checkMission(dataset, progress, { recordId: future.id }))
      .toEqual(checkMission(dataset, progress, { query: "Unknown input" }));
    expect(identifyMission(dataset, { snapshot: progress, query: future.public.name }))
      .toEqual({ matched: null, impliedComplete: [] });
  });

  it("requires exact, unambiguous identification and never invents earlier completion", () => {
    const withAlias = { ...mission, public: { ...mission.public, aliases: ["synthetic alias"] } };
    const other = { ...withAlias, id: "synthetic-other" };
    expect(identifyMission(data(withAlias, other), { snapshot: progress, query: "synthetic alias" }).matched).toBeNull();
    expect(identifyMission(data(withAlias), { snapshot: progress, query: "synthetic" }).matched).toBeNull();
    expect(identifyMission(data(withAlias), { snapshot: progress, query: "  SYNTHETIC   ALIAS " }).impliedComplete)
      .toEqual([mission.id]);
  });

  it("responds to cash goals and removes completed one-time earnings", () => {
    const pay = (id: string, amount: number, minutes: number): GuideRecord => {
      const opportunity = record(id, "money-method", `Synthetic earning method ${id}`);
      return { ...opportunity, public: { ...opportunity.public, money: {
        payout: { min: amount, max: amount }, repeatability: "one-time",
        risk: "low", timeMinutes: { min: minutes, max: minutes },
      } } };
    };
    const large = pay("large", 100, 20);
    const quick = pay("quick", 50, 5);
    const dataset = data(large, quick);
    const saving = { ...progress, cash: 20, cashTarget: 100 };
    expect(evaluateGuide(dataset, saving).money.bestMethodId).toBe(large.id);
    expect(evaluateGuide(dataset, { ...saving, cash: 60 }).money.bestMethodId).toBe(quick.id);
    expect(evaluateGuide(dataset, { ...saving, cash: 100 }).money.grind).toBe("not-needed");
    expect(evaluateGuide(dataset, { ...saving, completed: [large.id] }).money.methodIds).toEqual([quick.id]);
  });

  it("returns no-store responses and generic validation errors", async () => {
    const request = (body: unknown) => new Request("https://example.test", { method: "POST", body: JSON.stringify(body) });
    const response = await evaluatePost(request({ snapshot: progress }));
    expect(response.status).toBe(200);
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect(await response.json()).toMatchObject({ records: [], readiness: { status: "not-fully-verified" } });
    const invalid = await checkPost(request({ snapshot: progress, recordId: "SYNTHETIC secret!" }));
    expect(invalid.status).toBe(400);
    expect(invalid.headers.get("cache-control")).toBe("no-store");
    expect(await invalid.text()).not.toContain("secret");
  });
});

describe("authored dataset validation", () => {
  it("rejects mandatory cycles and contradictory requirements", async () => {
    const { validateDataset } = await import("@/server/guide/validate");
    expect(() => validateDataset(data(
      { ...mission, visibleWhen: { completed: future.id } }, future,
    ))).toThrow("Circular");
    expect(() => validateDataset(data(mission, {
      ...future, availableWhen: { not: { completed: mission.id } },
    }))).toThrow("Contradictory");
  });

  it("does not let conflicting risk evidence inherit a safe stage verdict", () => {
    const dataset = data(stage, mission, { ...missable, verification: "conflicted" });
    expect(evaluateGuide(dataset, progress).readiness).toMatchObject({
      status: "not-fully-verified", verification: "conflicted",
    });
    expect(checkMission(dataset, progress, { recordId: mission.id }).verdict).toBe("unverified");
  });
});

it("keeps known progress when guide records are added or temporarily absent", () => {
  const played = { ...progress, completed: [mission.id, "synthetic-previous-record"] };
  expect(evaluateGuide(data(mission), played).progress.visibleCompleted).toBe(1);
  expect(evaluateGuide(data(mission, future), played).records.map(record => record.id))
    .toEqual([mission.id, future.id]);
  expect(played.completed).toEqual([mission.id, "synthetic-previous-record"]);
});

it("uses generic postponement copy and never forwards authored timing explanations into wait recommendations", () => {
  const later = record("later", "activity", "Synthetic visible activity");
  later.public.timing = "later-better";
  later.public.guidance = "SYNTHETIC authored timing rationale";
  const view = evaluateGuide(data(later), progress);
  expect(view.queue[0]).toMatchObject({ priority: "wait", body: "You can leave this for later." });
  expect(view.nextBestMove).toBeNull();
  expect(JSON.stringify(view)).not.toContain(later.public.guidance);
});

describe("readiness coverage", () => {
  it.each([
    { ...missable, verification: "partial" as const },
    { ...missable, confidence: "low" as const },
    { ...missable, evidence: [] },
    { ...missable, expiresWhen: undefined },
  ])("withholds a safety verdict when an outstanding risk is unresolved", (risk) => {
    const dataset = data(stage, mission, risk);
    expect(evaluateGuide(dataset, progress).readiness).toMatchObject({
      status: "not-fully-verified", verification: "partial", blocking: [],
    });
    expect(checkMission(dataset, progress, { recordId: mission.id })).toMatchObject({
      verdict: "unverified", tasks: [],
    });
    const completed = { ...progress, completed: [risk.id] };
    expect(checkMission(dataset, completed, { recordId: mission.id }).verdict).toBe("go-ahead");
  });

  it("keeps hidden risk data from changing the current public verdict", () => {
    const hidden = { ...missable, verification: "partial" as const, visibleWhen: { never: true } as const };
    const dataset = data(stage, mission, hidden);
    expect(evaluateGuide(dataset, progress).readiness.status).toBe("safe-to-advance");
    expect(checkMission(dataset, progress, { recordId: mission.id }).verdict).toBe("go-ahead");
  });
});
