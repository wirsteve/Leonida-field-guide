/**
 * Spoiler-leak contract tests over the REAL dataset and the REAL gateway.
 *
 * For every point along the authored story chain, we build the snapshot a
 * player would have, call every guide endpoint's server function, serialize the
 * responses exactly as the client would receive them, and assert that nothing
 * the player isn't eligible to see is present.
 *
 * Eligibility is recomputed here independently of the engine, so a gateway bug
 * can't hide itself.
 */
import { describe, expect, it } from "vitest";
import type { GuideRecord, ProgressSnapshot, Requirement } from "@/contracts";
import { loadGuideDataset } from "@/content/guide";
import { TITLE_NOTES } from "@/content/guide/chapter2";
import { LATER_TITLE_NOTES } from "@/content/guide/side345";
import { evaluateGuide } from "@/server/guide/evaluate";
import { checkMission, identifyMission, suggestMissions } from "@/server/guide/missions";

const dataset = loadGuideDataset();
const story = dataset.records
  .filter((r) => r.kind === "story-mission")
  .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));

function meets(req: Requirement, done: Set<string>): boolean {
  if ("completed" in req) return done.has(req.completed);
  if ("discovered" in req) return done.has(req.discovered);
  if ("all" in req) return req.all.every((r) => meets(r, done));
  if ("any" in req) return req.any.some((r) => meets(r, done));
  if ("not" in req) return !meets(req.not, done);
  return "always" in req;
}

function snapshotAfter(index: number): ProgressSnapshot {
  return {
    schemaVersion: 1,
    completed: story.slice(0, index).map((r) => r.id),
    unsure: [],
    discovered: [],
    collectibles: {},
    cash: 5000,
    cashTarget: null,
  };
}

/** Strings that must never appear for this snapshot. */
function forbidden(snapshot: ProgressSnapshot): { needle: string; why: string }[] {
  const done = new Set([...snapshot.completed, ...snapshot.discovered]);
  const visible = dataset.records.filter((r) => meets(r.visibleWhen, done));
  const visibleNames = new Set(
    visible
      .filter((r) => !(r.kind === "story-mission" && !done.has(r.id) && !r.public.nameSafeBeforeStart))
      .flatMap((r) => [r.public.name, ...r.public.aliases].map((n) => n.toLowerCase())),
  );
  const out: { needle: string; why: string }[] = [];
  const add = (needle: string | undefined, why: string) => {
    if (!needle || needle.trim().length < 4) return;
    if (visibleNames.has(needle.toLowerCase())) return;
    out.push({ needle: needle.toLowerCase(), why });
  };
  for (const record of dataset.records) {
    const isVisible = meets(record.visibleWhen, done);
    const withheld = isVisible && record.kind === "story-mission" && !done.has(record.id) && !record.public.nameSafeBeforeStart;
    if (!isVisible || withheld) {
      add(record.public.name, `${withheld ? "withheld" : "ineligible"} name of ${record.id}`);
      record.public.aliases.forEach((a) => add(a, `alias of ${record.id}`));
    }
    if (!isVisible) out.push({ needle: `"${record.id}"`, why: `ineligible id ${record.id}` });
    for (const text of Object.values(record.restricted)) if (typeof text === "string" && text.length > 20) out.push({ needle: text.toLowerCase(), why: `restricted text of ${record.id}` });
    for (const e of record.evidence) {
      out.push({ needle: e.url.toLowerCase(), why: `evidence url of ${record.id}` });
      if (e.supports.length > 20) out.push({ needle: e.supports.toLowerCase(), why: `evidence claim of ${record.id}` });
    }
  }
  // Canonical titles we deliberately withhold are never projected, at any point.
  for (const [id, title] of Object.entries({ ...TITLE_NOTES, ...LATER_TITLE_NOTES })) out.push({ needle: title.toLowerCase(), why: `withheld canonical title of ${id}` });
  for (const area of dataset.areas) if (!meets(area.visibleWhen, done)) add(area.label, `ineligible area ${area.id}`);
  return out;
}

function assertNoLeak(payload: unknown, snapshot: ProgressSnapshot, label: string) {
  const text = JSON.stringify(payload).toLowerCase();
  const leaks = forbidden(snapshot).filter(({ needle }) => text.includes(needle));
  expect(leaks.map((l) => `${label}: ${l.why}`)).toEqual([]);
  // Structural: no server-only fields cross the boundary.
  for (const key of ['"visiblewhen"', '"expireswhen"', '"availablewhen"', '"restricted"', '"evidence"', '"sequence"', '"internalexplanation"']) {
    expect(text.includes(key), `${label} contains ${key}`).toBe(false);
  }
}

describe("spoiler boundary over the authored dataset", () => {
  const points = Array.from({ length: story.length + 1 }, (_, i) => i);

  it.each(points)("evaluate/suggest/check leak nothing after %i story missions", (i) => {
    const snapshot = snapshotAfter(i);
    const evaluation = evaluateGuide(dataset, snapshot);
    assertNoLeak(evaluation, snapshot, `evaluate@${i}`);
    assertNoLeak(suggestMissions(dataset, { snapshot, query: "" }), snapshot, `suggest@${i}`);
    for (const r of evaluation.records.filter((r) => r.kind === "story-mission" || r.kind === "side-mission")) {
      assertNoLeak(checkMission(dataset, snapshot, { recordId: r.id }), snapshot, `check:${r.id}@${i}`);
    }
  });

  it("answers a future mission name exactly like gibberish", () => {
    if (story.length < 3) return;
    const snapshot = snapshotAfter(1);
    const future: GuideRecord = story[story.length - 1];
    const strip = (v: unknown) => JSON.stringify(v);
    expect(strip(checkMission(dataset, snapshot, { query: future.public.name }))).toBe(
      strip(checkMission(dataset, snapshot, { query: "zzqx not a mission" })),
    );
    expect(strip(suggestMissions(dataset, { snapshot, query: future.public.name.slice(0, 4) }))).not.toContain(
      future.public.name,
    );
    for (const alias of future.public.aliases) {
      expect(strip(checkMission(dataset, snapshot, { query: alias }))).toBe(strip(checkMission(dataset, snapshot, { query: "zzqx" })));
    }
  });

  it("never offers withheld or future names in suggestions, even by prefix", () => {
    for (let i = 0; i <= story.length; i++) {
      const snapshot = snapshotAfter(i);
      for (const later of story.slice(i)) {
        const res = JSON.stringify(suggestMissions(dataset, { snapshot, query: later.public.name.slice(0, 3) })).toLowerCase();
        if (!later.public.nameSafeBeforeStart) expect(res).not.toContain(later.public.name.toLowerCase());
      }
    }
  });

  it("identify misses for unknown text return the empty shape", () => {
    expect(identifyMission(dataset, { snapshot: snapshotAfter(0), query: "zzqx not a mission" })).toEqual({
      matched: null,
      impliedComplete: [],
    });
  });
});
