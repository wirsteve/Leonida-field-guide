import "server-only";
import type { GuideDataset } from "@/contracts";
import { chapter2Records } from "./chapter2";
import { CH1_LAST, stages, storyRecords } from "./story";
import { tryThisRecords } from "./try-this";
import { challengeIdeas } from "./challenges";
import { tryThisRecords2 } from "./try-this-2";
import { pastimes } from "./pastimes";
import { completionRecords } from "./completion";
import { laterPrep, laterStages, laterStory } from "./chapters345";
import { side345 } from "./side345";

/**
 * Authored guide dataset — SERVER-ONLY (owner: Claude).
 *
 * The content gateway (src/server/guide, owner: Codex) is the only consumer.
 * Importing this module from a client component fails the build by design.
 * Validate with `npm run content:validate`.
 */
const allStory = [...storyRecords, ...laterStory];
const storyByName = new Map(
  allStory.filter((r) => r.kind === "story-mission").map((r) => [r.public.name.toLowerCase(), r.id] as const),
);

const dataset: GuideDataset = {
  contentVersion: "2026.11.21-full.1",
  generatedOn: "2026-11-21",
  coverageNote:
    "Researched from guide pages checked on Nov 21, 2026, two days after launch. The whole story is covered, but sources still disagree on a few points, so the guide won't call anything fully safe yet.",
  areas: [
    { id: "port-gellhorn", label: "Port Gellhorn", visibleWhen: { completed: CH1_LAST } },
    { id: "kelly-county", label: "Kelly County", visibleWhen: { completed: CH1_LAST } },
  ],
  records: [...stages, ...laterStages, ...allStory, ...chapter2Records, ...side345, ...laterPrep, ...tryThisRecords, ...tryThisRecords2, ...challengeIdeas, ...pastimes, ...completionRecords(storyByName)],
};

export function loadGuideDataset(): GuideDataset {
  return dataset;
}
