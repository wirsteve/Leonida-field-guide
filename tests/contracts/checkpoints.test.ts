import { describe, expect, it } from "vitest";
import type { Requirement } from "@/contracts";
import { loadGuideDataset } from "@/content/guide";
import { CHECKPOINTS } from "@/components/onboarding/checkpoints";

const dataset = loadGuideDataset();
const story = new Map(dataset.records.filter((r) => r.kind === "story-mission").map((r) => [r.id, r]));

function required(req: Requirement, out: Set<string>) {
  if ("completed" in req) out.add(req.completed);
  else if ("all" in req) req.all.forEach((r) => required(r, out));
}

/** Story missions that must be complete for `id` to be complete (transitive, plus itself). */
function prerequisites(id: string): Set<string> {
  const done = new Set([id]);
  for (const current of done) {
    const record = story.get(current);
    if (!record) continue;
    const next = new Set<string>();
    required(record.visibleWhen, next);
    next.forEach((n) => story.has(n) && done.add(n));
  }
  return done;
}

describe("onboarding checkpoints", () => {
  it.each(CHECKPOINTS)("$id lists exactly the story missions required through its milestone", (checkpoint) => {
    expect(story.has(checkpoint.through)).toBe(true);
    expect(new Set(checkpoint.storyIds)).toEqual(prerequisites(checkpoint.through));
  });

  it("uses only opaque ids and spoiler-lint-clean copy", () => {
    for (const c of CHECKPOINTS) {
      for (const id of c.storyIds) expect(id).toMatch(/^story-\d+$/);
      for (const title of [...story.values()].map((r) => r.public.name.toLowerCase()).filter((n) => n.length > 4)) {
        expect(`${c.label} ${c.detail}`.toLowerCase()).not.toContain(title);
      }
    }
  });
});
