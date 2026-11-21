import "server-only";
import type { GuideDataset } from "@/contracts";
import { chapter2Records } from "./chapter2";
import { CH1_LAST, stages, storyRecords } from "./story";

/**
 * Authored guide dataset — SERVER-ONLY (owner: Claude).
 *
 * The content gateway (src/server/guide, owner: Codex) is the only consumer.
 * Importing this module from a client component fails the build by design.
 * Validate with `npm run content:validate`.
 */
const dataset: GuideDataset = {
  contentVersion: "2026.11.21-ch2",
  generatedOn: "2026-11-21",
  coverageNote:
    "Researched from guide pages checked on Nov 21, 2026, two days after launch. Chapter 2 is mostly verified, but sources still disagree on a few points, so the guide won't call anything fully safe yet.",
  areas: [
    { id: "port-gellhorn", label: "Port Gellhorn", visibleWhen: { completed: CH1_LAST } },
    { id: "kelly-county", label: "Kelly County", visibleWhen: { completed: CH1_LAST } },
  ],
  records: [...stages, ...storyRecords, ...chapter2Records],
};

export function loadGuideDataset(): GuideDataset {
  return dataset;
}
