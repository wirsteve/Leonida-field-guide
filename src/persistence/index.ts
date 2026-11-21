import { openDB, type DBSchema, type IDBPDatabase } from "idb";
import { backupFileSchema, playerStateSchema, progressUpdateSchema } from "@/contracts/schemas";
import type { BackupFile, ImportResult, PlayerState, ProgressStore } from "@/contracts";
import { applyUpdate, emptyProgress, restorePrevious, type StoredProgress } from "./progress";

export { toProgressSnapshot } from "./progress";

interface ProgressDatabase extends DBSchema {
  progress: { key: "player"; value: StoredProgress };
}

function parseBackup(file: unknown) {
  if (typeof file === "string") {
    try {
      file = JSON.parse(file) as unknown;
    } catch {
      return null;
    }
  }
  const parsed = backupFileSchema.safeParse(file);
  if (!parsed.success) return null;
  const { notes, timeline } = parsed.data.state;
  if (new Set(notes.map(note => note.id)).size !== notes.length ||
    new Set(timeline.map(event => event.id)).size !== timeline.length) return null;
  return parsed.data;
}

const invalidBackup = "The backup is corrupted or uses an unsupported format.";

export function createProgressStore(): ProgressStore {
  let connection: Promise<IDBPDatabase<ProgressDatabase>> | undefined;
  const listeners = new Set<(state: PlayerState) => void>();
  const now = () => new Date().toISOString();

  function database() {
    connection ??= openDB<ProgressDatabase>("leonida-field-guide", 1, {
      upgrade(db) { db.createObjectStore("progress"); },
      blocking(_current, _next, event) {
        (event.target as IDBDatabase).close();
        connection = undefined;
      },
      terminated() { connection = undefined; },
    }).catch((error: unknown) => {
      connection = undefined;
      throw error;
    });
    return connection;
  }

  async function write(change: (value: StoredProgress) => StoredProgress, notify = true) {
    const db = await database();
    const transaction = db.transaction("progress", "readwrite");
    let updated: StoredProgress;
    try {
      const stored = await transaction.store.get("player");
      const current = stored ?? { state: emptyProgress(now()), undo: {} };
      const state = playerStateSchema.parse(current.state);
      updated = change({ state, undo: current.undo });
      if (!stored || notify) {
        playerStateSchema.parse(updated.state);
        await transaction.store.put(updated, "player");
      }
      await transaction.done;
    } catch (error) {
      try { transaction.abort(); } catch { /* The transaction may already be closed. */ }
      await transaction.done.catch(() => undefined);
      throw error;
    }
    if (notify) {
      for (const listener of listeners) {
        try {
          listener(structuredClone(updated.state));
        } catch (error) {
          if (typeof globalThis.reportError === "function") globalThis.reportError(error);
        }
      }
    }
    return updated.state;
  }

  return {
    load: () => write(value => value, false),
    async apply(update, label) {
      const validated = progressUpdateSchema.parse(update);
      return write(value => {
        const event = { id: crypto.randomUUID(), at: now() };
        const { previous, inverse } = applyUpdate(value.state, validated, event);
        value.undo[event.id] = previous;
        value.state.updatedAt = event.at;
        value.state.timeline.push({ ...event, update: validated, inverse, label });
        return value;
      });
    },
    undo() {
      return write(value => {
        const event = [...value.state.timeline].reverse().find(item => !item.undone);
        if (!event) return value;
        const exact = Object.hasOwn(value.undo, event.id) ? value.undo[event.id] : undefined;
        const at = now();
        if (exact) {
          restorePrevious(value.state, exact);
          delete value.undo[event.id];
        } else {
          for (const inverse of event.inverse) {
            const id = event.update.type === "delete-note" ? event.update.noteId : event.id;
            applyUpdate(value.state, inverse, { id, at });
          }
        }
        event.undone = true;
        value.state.updatedAt = at;
        return value;
      });
    },
    async exportBackup(): Promise<BackupFile> {
      const state = await write(value => value, false);
      return { format: "leonida-field-guide-backup", formatVersion: 1, exportedAt: now(), appVersion: "0.1.0", state };
    },
    async previewImport(file) {
      const backup = parseBackup(file);
      return {
        valid: !!backup, issues: backup ? [] : [invalidBackup],
        summary: { marks: Object.keys(backup?.state.marks ?? {}).length,
          discovered: Object.keys(backup?.state.discovered ?? {}).length,
          notes: backup?.state.notes.length ?? 0, exportedAt: backup?.exportedAt ?? null },
      };
    },
    async importBackup(file, mode): Promise<ImportResult> {
      const backup = parseBackup(file);
      if (!backup) return { ok: false, issues: [invalidBackup] };
      try {
        const state = await write(current => {
          if (mode === "replace") return { state: backup.state, undo: {} };
          const incoming = backup.state;
          const local = current.state;
          const localNotes = new Set(local.notes.map(note => note.id));
          const merged: PlayerState = {
            ...local,
            marks: { ...incoming.marks, ...local.marks },
            discovered: { ...incoming.discovered, ...local.discovered },
            collectibles: { ...incoming.collectibles, ...local.collectibles },
            cash: {
              amount: local.cash.amount ?? incoming.cash.amount,
              updatedAt: local.cash.amount === null ? incoming.cash.updatedAt : local.cash.updatedAt,
              target: local.cash.target ?? incoming.cash.target,
            },
            notes: [...incoming.notes.filter(note => !localNotes.has(note.id)), ...local.notes],
            updatedAt: now(),
          };
          // Retain local history. Imported inverses describe a different state
          // and cannot safely be replayed against a merged profile.
          return { state: merged, undo: current.undo };
        });
        return { ok: true, state, issues: [] };
      } catch {
        return { ok: false, issues: ["The backup could not be saved to this device."] };
      }
    },
    reset: () => write(() => ({ state: emptyProgress(now()), undo: {} })),
    subscribe(listener) {
      listeners.add(listener);
      return () => { listeners.delete(listener); };
    },
  };
}
