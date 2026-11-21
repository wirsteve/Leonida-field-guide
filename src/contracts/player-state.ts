/**
 * Player state & progress updates — CONTRACT v1
 *
 * PlayerState is the player's personal progress. It lives ONLY on the device
 * (IndexedDB via the shared persistence layer, src/persistence). The app never
 * reads console save files and never claims automatic synchronization.
 */
import type { IsoDateTime } from "./evidence";
import type { RecordId } from "./guide-record";

export const PLAYER_STATE_SCHEMA_VERSION = 1 as const;

/**
 * How the player has recorded a record.
 * - complete:   done.
 * - incomplete: explicitly not done.
 * - unsure:     the player doesn't remember. Never treated as complete; the
 *               engine may hedge recommendations ("if you haven't already…").
 * Absent from `marks` = never recorded (treated like incomplete).
 */
export type ProgressMark = "complete" | "incomplete" | "unsure";

export interface RecordMark {
  mark: ProgressMark;
  at: IsoDateTime;
  /** Where the mark came from. */
  via: "onboarding" | "journal" | "home" | "check" | "import" | "seed";
}

export interface Note {
  id: string;
  body: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  /** Optional link to a visible record. */
  recordId?: RecordId;
}

export interface CashState {
  /** Last cash amount the player entered. null = never entered. */
  amount: number | null;
  updatedAt: IsoDateTime | null;
  /** Optional savings goal. */
  target: number | null;
}

export interface PlayerState {
  schemaVersion: typeof PLAYER_STATE_SCHEMA_VERSION;
  profileId: string;
  createdAt: IsoDateTime;
  updatedAt: IsoDateTime;
  game: "gta-vi";

  /** Record completion marks keyed by RecordId (missions, activities, …). */
  marks: Record<RecordId, RecordMark>;
  /** Locations and contacts the player has discovered/met, keyed by RecordId. */
  discovered: Record<RecordId, IsoDateTime>;
  /** Collectible progress: set RecordId → number of items found. */
  collectibles: Record<RecordId, number>;
  cash: CashState;
  notes: Note[];

  onboarding: {
    status: "not-started" | "in-progress" | "complete";
    completedAt?: IsoDateTime;
    /** Free-text description the player gave of their latest milestone. */
    reportedMilestone?: string;
  };

  /** Append-only history; powers the Journal timeline and Undo. */
  timeline: TimelineEvent[];
}

/** Every user-initiated change to PlayerState is a ProgressUpdate. */
export type ProgressUpdate =
  | { type: "mark-record"; recordId: RecordId; mark: ProgressMark | null; via: RecordMark["via"] }
  | { type: "mark-records"; recordIds: RecordId[]; mark: ProgressMark | null; via: RecordMark["via"] }
  | { type: "set-discovered"; recordId: RecordId; discovered: boolean }
  | { type: "set-collectible-count"; setId: RecordId; count: number }
  | { type: "set-cash"; amount: number | null }
  | { type: "set-cash-target"; target: number | null }
  | { type: "add-note"; body: string; recordId?: RecordId }
  | { type: "edit-note"; noteId: string; body: string }
  | { type: "delete-note"; noteId: string }
  | { type: "set-onboarding"; status: PlayerState["onboarding"]["status"]; reportedMilestone?: string };

/**
 * A timeline entry. `inverse` holds the update(s) that undo this event, computed
 * by the persistence layer at apply time. `label` is a short, spoiler-safe
 * description written by the persistence layer from data the player already sees
 * (e.g. the visible record name captured at the moment of the update).
 */
export interface TimelineEvent {
  id: string;
  at: IsoDateTime;
  update: ProgressUpdate;
  inverse: ProgressUpdate[];
  label: string;
  /** True once this event has been undone (kept for audit; excluded from timeline UI). */
  undone?: boolean;
}

/**
 * The minimal, server-evaluable view of progress. This is what the client sends
 * to the guide API. It contains only ids the player has recorded — no notes,
 * no timeline, nothing personal beyond progress.
 */
export interface ProgressSnapshot {
  schemaVersion: typeof PLAYER_STATE_SCHEMA_VERSION;
  completed: RecordId[];
  unsure: RecordId[];
  discovered: RecordId[];
  collectibles: Record<RecordId, number>;
  cash: number | null;
  cashTarget: number | null;
}

/** Export/backup envelope. */
export interface BackupFile {
  format: "leonida-field-guide-backup";
  formatVersion: 1;
  exportedAt: IsoDateTime;
  appVersion: string;
  state: PlayerState;
}

export type ImportMode = "replace" | "merge";

export interface ImportPreview {
  valid: boolean;
  issues: string[];
  /** Spoiler-safe summary of what the file contains, e.g. counts of marks/notes. */
  summary: { marks: number; discovered: number; notes: number; exportedAt: IsoDateTime | null };
}

export interface ImportResult {
  ok: boolean;
  state?: PlayerState;
  /** Human-readable, spoiler-safe problems found during validation. */
  issues: string[];
}

/**
 * The persistence layer's public interface (implemented in src/persistence).
 * UI code talks ONLY to this interface — there is no second storage path.
 */
export interface ProgressStore {
  load(): Promise<PlayerState>;
  apply(update: ProgressUpdate, label: string): Promise<PlayerState>;
  /** Undo the most recent not-yet-undone timeline event. */
  undo(): Promise<PlayerState>;
  exportBackup(): Promise<BackupFile>;
  /** Validate a backup without writing anything. */
  previewImport(file: unknown): Promise<ImportPreview>;
  importBackup(file: unknown, mode: ImportMode): Promise<ImportResult>;
  /** Erase all progress (requires explicit confirmation in the UI). */
  reset(): Promise<PlayerState>;
  subscribe(listener: (state: PlayerState) => void): () => void;
}
