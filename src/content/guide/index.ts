import "server-only";
import type { GuideDataset } from "@/contracts";

/**
 * Authored guide dataset — SERVER-ONLY (owner: Claude).
 *
 * The content gateway (src/server/guide, owner: Codex) is the only consumer.
 * Importing this module from a client component fails the build by design.
 *
 * Foundation state: intentionally empty. Researched records land in the
 * content PR after verification (see docs/research/).
 */
const dataset: GuideDataset = {
  contentVersion: "0.0.0-foundation",
  generatedOn: "2026-11-21",
  coverageNote: "Guide research is still being verified. Nothing is marked safe until it is.",
  areas: [],
  records: [],
};

export function loadGuideDataset(): GuideDataset {
  return dataset;
}
