import "fake-indexeddb/auto";
import { beforeEach, describe, expect, it } from "vitest";
import { createProgressStore, toProgressSnapshot } from "@/persistence";

const store = createProgressStore();

beforeEach(async () => {
  await store.reset();
});

describe("local progress store (synthetic progress)", () => {
  it("persists concurrent writes from separate connections and reflects them after reload", async () => {
    const other = createProgressStore();
    await Promise.all([
      store.apply({ type: "mark-record", recordId: "synthetic-a", mark: "complete", via: "journal" }, "A"),
      other.apply({ type: "mark-record", recordId: "synthetic-b", mark: "unsure", via: "journal" }, "B"),
    ]);
    const state = await createProgressStore().load();
    expect(toProgressSnapshot(state)).toMatchObject({ completed: ["synthetic-a"], unsure: ["synthetic-b"] });
    expect(state.timeline).toHaveLength(2);
  });

  it("reverses note deletion and restores the original identity and timestamps", async () => {
    const added = await store.apply({ type: "add-note", body: "Synthetic note" }, "Add note");
    const note = added.notes[0];
    await store.apply({ type: "delete-note", noteId: note.id }, "Delete note");
    const restored = await createProgressStore().undo();
    expect(restored.notes).toEqual([note]);
    expect(restored.timeline.at(-1)?.undone).toBe(true);
    expect((await store.undo()).notes).toEqual([]);
  });

  it("round-trips replacement backups, previews without writing, and rejects invalid data", async () => {
    const state = await store.apply({ type: "set-cash", amount: 500 }, "Cash");
    const backup = await store.exportBackup();
    await store.reset();
    const raw = JSON.stringify(backup);
    expect(await store.previewImport(raw)).toMatchObject({ valid: true, summary: { marks: 0 } });
    expect((await store.load()).cash.amount).toBeNull();
    expect(await store.importBackup({ ...backup, formatVersion: 2 }, "replace")).toMatchObject({ ok: false });
    expect(await store.importBackup("{", "replace")).toMatchObject({ ok: false });
    expect((await store.load()).cash.amount).toBeNull();
    expect(await store.importBackup(raw, "replace")).toMatchObject({ ok: true, state });
    expect(await store.load()).toEqual(state);
  });

  it("merges missing progress without replacing locally recorded values", async () => {
    await store.apply({ type: "mark-records", recordIds: ["synthetic-a", "synthetic-b"], mark: "complete", via: "journal" }, "Old");
    const backup = await store.exportBackup();
    await store.reset();
    await store.apply({ type: "mark-record", recordId: "synthetic-a", mark: "unsure", via: "journal" }, "Correction");
    expect(await store.importBackup(backup, "merge")).toMatchObject({ ok: true });
    expect(toProgressSnapshot(await store.load())).toMatchObject({ completed: ["synthetic-b"], unsure: ["synthetic-a"] });
  });

  it("publishes state after a commit and reports failed writes as rejections", async () => {
    const changes: number[] = [];
    const unsubscribe = store.subscribe(state => changes.push(state.timeline.length));
    await store.apply({ type: "set-cash-target", target: 10 }, "Target");
    await expect(store.apply({ type: "delete-note", noteId: "does-not-exist" }, "Delete")).rejects.toThrow();
    unsubscribe();
    expect(changes).toEqual([1]);
    expect((await store.load()).cash.target).toBe(10);
  });
});
