import { describe, expect, it } from "vitest";
import { PLAYER_STATE_SCHEMA_VERSION, type ProgressSnapshot } from "@/contracts";
import { loadGuideDataset } from "@/content/guide";
import { evaluateGuide } from "@/server/guide/evaluate";
import { answer, SUGGESTIONS } from "@/components/ask/answer";

const dataset = loadGuideDataset();
const storyIds = dataset.records.filter((r) => r.kind === "story-mission").map((r) => r.id);

function evaluationThrough(lastId: string, cash: number | null = 9200) {
  const done = storyIds.slice(0, storyIds.indexOf(lastId) + 1);
  const snapshot: ProgressSnapshot = {
    schemaVersion: PLAYER_STATE_SCHEMA_VERSION,
    completed: done,
    unsure: [],
    discovered: [],
    collectibles: {},
    cash,
    cashTarget: null,
  };
  return { evaluation: evaluateGuide(dataset, snapshot), done: new Set(done) };
}

describe("Ask the guide", () => {
  const { evaluation } = evaluationThrough("story-214");

  it("answers money questions with the gap to the current goal", () => {
    const a = answer("how do I get 15k fast", evaluation);
    expect(a.topic).toBe("money");
    expect(a.headline).toBe("$5,800 to go to reach $15,000.");
    expect(a.actions.some((x) => x.kind === "record")).toBe(true);
  });

  it("answers 'how much more before I leave' from readiness", () => {
    const a = answer("how much more should I do here before moving on?", evaluation);
    expect(a.topic).toBe("advance");
    expect(a.actions.at(-1)).toEqual({ kind: "check", label: "Check the next mission" });
  });

  it("routes the classic questions", () => {
    expect(answer("what should I do next", evaluation).topic).toBe("next");
    expect(answer("anything missable?", evaluation).topic).toBe("missable");
    expect(answer("I'm bored, something stupid", evaluation).topic).toBe("fun");
    expect(answer("how many trophies left", evaluation).topic).toBe("completion");
    expect(answer("where can I golf", evaluation).topic).toBe("pastime");
    expect(answer("shoot hoops", evaluation).topic).toBe("pastime");
  });

  it("falls back to search, then to an honest 'nothing matches'", () => {
    const hit = answer("mud club", evaluation);
    expect(hit.topic).toBe("search");
    expect(answer("zzqx flurble", evaluation).topic).toBe("none");
  });

  it("never names anything the player hasn't reached", () => {
    const { evaluation: early, done } = evaluationThrough("story-212");
    const future = dataset.records
      .filter((r) => r.kind === "story-mission" && !done.has(r.id))
      .map((r) => r.public.name.toLowerCase())
      .filter((n) => n.length > 4);
    const visible = new Set(early.records.map((r) => r.id));
    const unseen = dataset.records.filter((r) => !visible.has(r.id) && r.public.name.length > 5).map((r) => r.public.name.toLowerCase());
    const queries = [...SUGGESTIONS, "money", "what next", "is anything missable", "leave", "trophy", "fun", "golf", "car", "heist", "vice city", "boat", "plane"];
    for (const q of queries) {
      const a = answer(q, early);
      const text = [a.headline, a.body ?? "", ...a.actions.map((x) => x.label)].join(" ").toLowerCase();
      for (const name of [...future, ...unseen]) expect(text, `query "${q}" leaked "${name}"`).not.toContain(name);
      for (const x of a.actions) if (x.kind === "record") expect(visible.has(x.recordId)).toBe(true);
    }
  });
});
