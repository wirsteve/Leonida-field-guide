import { describe, expect, it } from "vitest";
import { backupFileSchema, guideRecordSchema, progressSnapshotSchema, requirementSchema } from "@/contracts/schemas";
import { CONTRACT_VERSION, PLAYER_STATE_SCHEMA_VERSION } from "@/contracts";

describe("contract schemas", () => {
  it("exposes contract and state versions", () => {
    expect(CONTRACT_VERSION).toBe(1);
    expect(PLAYER_STATE_SCHEMA_VERSION).toBe(1);
  });

  it("accepts a minimal progress snapshot and rejects malformed ids", () => {
    const ok = { schemaVersion: 1, completed: ["m-alpha"], unsure: [], discovered: [], collectibles: {}, cash: null, cashTarget: null };
    expect(progressSnapshotSchema.safeParse(ok).success).toBe(true);
    expect(progressSnapshotSchema.safeParse({ ...ok, completed: ["<script>"] }).success).toBe(false);
    expect(progressSnapshotSchema.safeParse({ ...ok, cash: -5 }).success).toBe(false);
  });

  it("parses nested requirements and rejects unknown keys", () => {
    expect(requirementSchema.safeParse({ all: [{ completed: "m-a" }, { not: { completed: "m-b" } }] }).success).toBe(true);
    expect(requirementSchema.safeParse({ completed: "m-a", extra: 1 }).success).toBe(false);
  });

  it("validates a synthetic guide record", () => {
    const record = {
      id: "synthetic-side-job",
      kind: "side-mission",
      visibleWhen: { completed: "synthetic-story-1" },
      expiresWhen: { completed: "synthetic-story-2" },
      missable: "yes",
      public: {
        name: "Synthetic Side Job",
        aliases: [],
        summary: "A synthetic test record.",
        tags: [],
        uniqueExperience: true,
        officialCompletion: "unknown",
        timing: "before-advancing",
        guidance: "Finish this before your next story mission.",
      },
      restricted: { internalExplanation: "SYNTHETIC — not a gameplay claim." },
      evidence: [],
      confidence: "unverified",
      verification: "unverified",
      lastReviewed: "2026-11-21",
    };
    expect(guideRecordSchema.safeParse(record).success).toBe(true);
  });

  it("rejects a backup with the wrong format marker", () => {
    expect(backupFileSchema.safeParse({ format: "something-else" }).success).toBe(false);
  });
});
