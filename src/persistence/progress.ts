import type { Note, PlayerState, ProgressSnapshot, ProgressUpdate, TimelineEvent } from "@/contracts";

export function emptyProgress(at: string): PlayerState {
  return {
    schemaVersion: 1, profileId: crypto.randomUUID(), createdAt: at, updatedAt: at, game: "gta-vi",
    marks: {}, discovered: {}, collectibles: {}, cash: { amount: null, target: null, updatedAt: null },
    notes: [], timeline: [], onboarding: { status: "not-started" },
  };
}

export function toProgressSnapshot(state: PlayerState): ProgressSnapshot {
  const marks = Object.entries(state.marks);
  return {
    schemaVersion: state.schemaVersion,
    completed: marks.filter(([, value]) => value.mark === "complete").map(([id]) => id),
    unsure: marks.filter(([, value]) => value.mark === "unsure").map(([id]) => id),
    discovered: Object.keys(state.discovered), collectibles: { ...state.collectibles },
    cash: state.cash.amount, cashTarget: state.cash.target,
  };
}

// IndexedDB stores exact previous values separately because v1 timeline updates
// cannot represent every previous timestamp or the absence of a collectible count.
type PreviousEntries<Value> = [string, Value | null][];
export type UndoValues =
  | { marks: PreviousEntries<PlayerState["marks"][string]> }
  | { discovered: PreviousEntries<string> }
  | { collectibles: PreviousEntries<number> }
  | { cash: PlayerState["cash"] }
  | { note: { id: string; previous: Note | null; index: number } }
  | { onboarding: PlayerState["onboarding"] };

function previousEntry<Value>(map: Record<string, Value>, id: string): [string, Value | null] {
  return [id, Object.hasOwn(map, id) ? map[id] : null];
}

function restoreEntries<Value>(map: Record<string, Value>, entries: PreviousEntries<Value>): void {
  for (const [id, previous] of entries) {
    if (previous === null) delete map[id];
    else Object.defineProperty(map, id, {
      value: previous, enumerable: true, configurable: true, writable: true,
    });
  }
}

export function restorePrevious(state: PlayerState, previous: UndoValues): void {
  if ("marks" in previous) restoreEntries(state.marks, previous.marks);
  if ("discovered" in previous) restoreEntries(state.discovered, previous.discovered);
  if ("collectibles" in previous) restoreEntries(state.collectibles, previous.collectibles);
  if ("cash" in previous) state.cash = previous.cash;
  if ("onboarding" in previous) state.onboarding = previous.onboarding;
  if ("note" in previous) {
    const { id, previous: note, index } = previous.note;
    state.notes = state.notes.filter(item => item.id !== id);
    if (note) state.notes.splice(index, 0, note);
  }
}
export interface StoredProgress {
  state: PlayerState;
  undo: Record<string, UndoValues>;
}

export function applyUpdate(
  state: PlayerState, update: ProgressUpdate, event: Pick<TimelineEvent, "id" | "at">,
): { previous: UndoValues; inverse: ProgressUpdate[] } {
  const { at, id } = event;
  switch (update.type) {
    case "mark-record":
    case "mark-records": {
      const ids = update.type === "mark-record" ? [update.recordId] : [...new Set(update.recordIds)];
      const marks = { ...state.marks };
      const inverse = ids.map((recordId): ProgressUpdate => ({
        type: "mark-record", recordId, mark: Object.hasOwn(marks, recordId) ? marks[recordId].mark : null,
        via: Object.hasOwn(marks, recordId) ? marks[recordId].via : update.via,
      }));
      for (const recordId of ids) {
        if (update.mark === null) delete marks[recordId];
        else Object.defineProperty(marks, recordId, { value: { mark: update.mark, at, via: update.via },
          enumerable: true, writable: true, configurable: true });
      }
      const previous = { marks: ids.map(recordId => previousEntry(state.marks, recordId)) };
      state.marks = marks;
      return { previous, inverse };
    }
    case "set-discovered": {
      const previous = { discovered: [previousEntry(state.discovered, update.recordId)] };
      const inverse = { ...update, discovered: Object.hasOwn(state.discovered, update.recordId) };
      state.discovered = { ...state.discovered };
      if (update.discovered) Object.defineProperty(state.discovered, update.recordId, { value: at,
        enumerable: true, writable: true, configurable: true });
      else delete state.discovered[update.recordId];
      return { previous, inverse: [inverse] };
    }
    case "set-collectible-count": {
      const previous = { collectibles: [previousEntry(state.collectibles, update.setId)] };
      const count = Object.hasOwn(state.collectibles, update.setId) ? state.collectibles[update.setId] : 0;
      state.collectibles = { ...state.collectibles, [update.setId]: update.count };
      return { previous, inverse: [{ ...update, count }] };
    }
    case "set-cash":
    case "set-cash-target": {
      const previous = { cash: state.cash };
      const inverse = update.type === "set-cash" ? { ...update, amount: state.cash.amount }
        : { ...update, target: state.cash.target };
      state.cash = update.type === "set-cash" ? { ...state.cash, amount: update.amount, updatedAt: at }
        : { ...state.cash, target: update.target };
      return { previous, inverse: [inverse] };
    }
    case "add-note": {
      const previous = { note: { id, previous: null, index: state.notes.length } };
      state.notes = [...state.notes, { id, body: update.body, recordId: update.recordId, createdAt: at, updatedAt: at }];
      return { previous, inverse: [{ type: "delete-note", noteId: id }] };
    }
    case "edit-note":
    case "delete-note": {
      const note = state.notes.find(note => note.id === update.noteId);
      if (!note) throw new Error("The note could not be found.");
      const previous = { note: { id: note.id, previous: note, index: state.notes.indexOf(note) } };
      if (update.type === "edit-note") {
        state.notes = state.notes.map(item => item.id === note.id ? { ...item, body: update.body, updatedAt: at } : item);
        return { previous, inverse: [{ ...update, body: note.body }] };
      }
      state.notes = state.notes.filter(item => item.id !== note.id);
      return { previous, inverse: [{ type: "add-note", body: note.body, recordId: note.recordId }] };
    }
    case "set-onboarding": {
      const previous = { onboarding: state.onboarding };
      const { status, reportedMilestone } = state.onboarding;
      state.onboarding = { status: update.status, reportedMilestone: update.reportedMilestone,
        completedAt: update.status === "complete" ? state.onboarding.completedAt ?? at : undefined };
      return { previous, inverse: [{ ...update, status, reportedMilestone }] };
    }
  }
}
