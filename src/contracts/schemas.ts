/**
 * Runtime schemas for the contracts — CONTRACT v1
 *
 * Used at trust boundaries:
 *  - API request bodies (server validates every snapshot).
 *  - Backup import (persistence validates every file).
 *  - Authored guide dataset (content tooling validates every record).
 *
 * Each schema is type-checked against its TypeScript interface, so the two
 * cannot drift silently.
 */
import { z } from "zod";
import type { SourceEvidence } from "./evidence";
import type { GuideDataset, GuideRecord, PublicContent, Requirement } from "./guide-record";
import type { BackupFile, PlayerState, ProgressSnapshot, ProgressUpdate } from "./player-state";

const id = z.string().min(1).max(120).regex(/^[a-z0-9][a-z0-9-]*$/, "ids are lowercase kebab-case");
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const isoDateTime = z.string().min(10).max(40);
const nonNegInt = z.number().int().min(0).max(1_000_000_000);
const cash = z.number().int().min(0).max(100_000_000_000).nullable();

// ── Player progress ──────────────────────────────────────────────────────────

export const progressSnapshotSchema: z.ZodType<ProgressSnapshot> = z.object({
  schemaVersion: z.literal(1),
  completed: z.array(id).max(5000),
  unsure: z.array(id).max(5000),
  discovered: z.array(id).max(5000),
  collectibles: z.record(id, nonNegInt),
  cash,
  cashTarget: cash,
});

const progressMark = z.enum(["complete", "incomplete", "unsure"]);
const markVia = z.enum(["onboarding", "journal", "home", "check", "import", "seed"]);

export const progressUpdateSchema: z.ZodType<ProgressUpdate> = z.discriminatedUnion("type", [
  z.object({ type: z.literal("mark-record"), recordId: id, mark: progressMark.nullable(), via: markVia }),
  z.object({ type: z.literal("mark-records"), recordIds: z.array(id), mark: progressMark.nullable(), via: markVia }),
  z.object({ type: z.literal("set-discovered"), recordId: id, discovered: z.boolean() }),
  z.object({ type: z.literal("set-collectible-count"), setId: id, count: nonNegInt }),
  z.object({ type: z.literal("set-cash"), amount: cash }),
  z.object({ type: z.literal("set-cash-target"), target: cash }),
  z.object({ type: z.literal("add-note"), body: z.string().max(10_000), recordId: id.optional() }),
  z.object({ type: z.literal("edit-note"), noteId: z.string(), body: z.string().max(10_000) }),
  z.object({ type: z.literal("delete-note"), noteId: z.string() }),
  z.object({
    type: z.literal("set-onboarding"),
    status: z.enum(["not-started", "in-progress", "complete"]),
    reportedMilestone: z.string().max(500).optional(),
  }),
]);

export const playerStateSchema: z.ZodType<PlayerState> = z.object({
  schemaVersion: z.literal(1),
  profileId: z.string().min(1),
  createdAt: isoDateTime,
  updatedAt: isoDateTime,
  game: z.literal("gta-vi"),
  marks: z.record(id, z.object({ mark: progressMark, at: isoDateTime, via: markVia })),
  discovered: z.record(id, isoDateTime),
  collectibles: z.record(id, nonNegInt),
  cash: z.object({ amount: cash, updatedAt: isoDateTime.nullable(), target: cash }),
  notes: z.array(
    z.object({
      id: z.string(),
      body: z.string().max(10_000),
      createdAt: isoDateTime,
      updatedAt: isoDateTime,
      recordId: id.optional(),
    }),
  ),
  onboarding: z.object({
    status: z.enum(["not-started", "in-progress", "complete"]),
    completedAt: isoDateTime.optional(),
    reportedMilestone: z.string().max(500).optional(),
  }),
  timeline: z.array(
    z.object({
      id: z.string(),
      at: isoDateTime,
      update: progressUpdateSchema,
      inverse: z.array(progressUpdateSchema),
      label: z.string().max(300),
      undone: z.boolean().optional(),
    }),
  ),
});

export const backupFileSchema: z.ZodType<BackupFile> = z.object({
  format: z.literal("leonida-field-guide-backup"),
  formatVersion: z.literal(1),
  exportedAt: isoDateTime,
  appVersion: z.string(),
  state: playerStateSchema,
});

// ── Authored guide dataset ──────────────────────────────────────────────────

export const requirementSchema: z.ZodType<Requirement> = z.lazy(() =>
  z.union([
    z.object({ always: z.literal(true) }).strict(),
    z.object({ never: z.literal(true) }).strict(),
    z.object({ completed: id }).strict(),
    z.object({ discovered: id }).strict(),
    z.object({ all: z.array(requirementSchema).min(1) }).strict(),
    z.object({ any: z.array(requirementSchema).min(1) }).strict(),
    z.object({ not: requirementSchema }).strict(),
  ]),
);

const confidence = z.enum(["high", "medium", "low", "unverified"]);
const verification = z.enum(["verified", "partial", "conflicted", "unverified"]);
const tri = z.enum(["yes", "no", "unknown"]);
const minutes = z.object({ min: z.number().min(0), max: z.number().min(0) });

export const sourceEvidenceSchema: z.ZodType<SourceEvidence> = z.object({
  id,
  url: z.url(),
  publisher: z.string().min(1),
  title: z.string().min(1),
  kind: z.enum(["official", "guide-site", "video", "forum", "firsthand"]),
  checkedOn: isoDate,
  supports: z.string().min(1),
  notes: z.string().optional(),
});

export const publicContentSchema: z.ZodType<PublicContent> = z.object({
  name: z.string().min(1).max(120),
  aliases: z.array(z.string().min(1).max(120)),
  summary: z.string().min(1).max(400),
  area: id.optional(),
  tags: z.array(z.string()),
  estimatedMinutes: minutes.optional(),
  uniqueExperience: z.boolean(),
  officialCompletion: tri,
  timing: z.enum(["now", "before-advancing", "anytime", "later-better", "unknown"]),
  guidance: z.string().min(1).max(300),
  tips: z.array(z.string().max(400)).optional(),
  lastChanceCopy: z.string().max(300).optional(),
  saveBeforeStarting: z.boolean().optional(),
  money: z
    .object({
      payout: z.object({ min: z.number(), max: z.number(), note: z.string().optional() }).optional(),
      repeatability: z.enum(["one-time", "repeatable", "cooldown", "limited", "unknown"]),
      cooldownNote: z.string().optional(),
      risk: z.enum(["low", "medium", "high", "unknown"]),
      timeMinutes: minutes.optional(),
      efficiency: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5)]).optional(),
    })
    .optional(),
  collectibleTotal: z.number().int().min(1).optional(),
  nameSafeBeforeStart: z.boolean().optional(),
  neutralLabel: z.string().max(80).optional(),
});

const recordKind = z.enum([
  "story-mission",
  "side-mission",
  "activity",
  "race",
  "encounter",
  "collectible-set",
  "location",
  "money-method",
  "vehicle",
  "equipment",
  "contact",
  "achievement",
  "stage",
]);

const baseRecord = z.object({
  id,
  kind: recordKind,
  sequence: z.number().optional(),
  chapter: z.number().int().min(1).optional(),
  visibleWhen: requirementSchema,
  availableWhen: requirementSchema.optional(),
  expiresWhen: requirementSchema.optional(),
  missable: tri,
  public: publicContentSchema,
  restricted: z.object({
    internalExplanation: z.string().optional(),
    notes: z.string().optional(),
    conflicts: z.string().optional(),
  }),
  evidence: z.array(sourceEvidenceSchema),
  confidence,
  verification,
  lastReviewed: isoDate,
  editorial: z
    .object({
      chapterLabel: z.string(),
      title: z.string(),
      intro: z.string(),
      saveAdvice: z.string().optional(),
      verification,
    })
    .optional(),
});

export const guideRecordSchema: z.ZodType<GuideRecord> = baseRecord;

export const guideDatasetSchema: z.ZodType<GuideDataset> = z.object({
  contentVersion: z.string().min(1),
  generatedOn: isoDate,
  coverageNote: z.string().min(1),
  areas: z.array(z.object({ id, label: z.string().min(1), visibleWhen: requirementSchema })),
  records: z.array(guideRecordSchema),
});
