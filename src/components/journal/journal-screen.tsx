"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { Check, Download, FileUp, RotateCcw, Trash2, Undo2 } from "lucide-react";
import type { ImportPreview, PublicGuideRecord } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { useActions } from "@/components/shell/actions-provider";
import { PageHeader } from "@/components/shell/masthead";
import { Button, Card, SectionLabel } from "@/components/ui/primitives";
import { cx } from "@/components/ui/cx";

export function JournalScreen() {
  const { evaluation, state } = useGuide();
  const records = evaluation?.records ?? [];
  const story = records.filter((r) => r.kind === "story-mission");
  const optional = records.filter((r) => r.kind === "side-mission");

  return (
    <main className="page">
      <PageHeader eyebrow="Journal" title="Your journal" lede="Missions, milestones, notes and backups. Saved on this device." />

      <div className="grid grid-cols-3 gap-2">
        <Stat value={story.filter((r) => r.status === "completed").length} label="Story missions" />
        <Stat value={optional.filter((r) => r.status === "completed").length} label="Optional missions" />
        <Stat value={evaluation?.progress.uniqueExperienced ?? 0} label="Unique moments" />
      </div>

      <MissionList title="Story" records={story} />
      <MissionList title="Optional missions" records={optional} />
      <Timeline />
      <Notes />
      <Backup />

      <div className="mt-10 space-y-2">
        <SectionLabel>Setup</SectionLabel>
        <Link href="/onboarding" className="tap flex min-h-12 items-center rounded-2xl border border-rule bg-panel/60 px-4 text-[0.95rem] text-ivory hover:bg-panel-2">
          Re-run setup ({state?.onboarding.status === "complete" ? "done" : "not finished"})
        </Link>
        <ResetProgress />
      </div>
    </main>
  );
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-rule bg-panel/60 p-3">
      <p className="headline text-[1.8rem] leading-none text-ivory">{value}</p>
      <p className="mt-1.5 text-[0.75rem] leading-tight text-ivory-3">{label}</p>
    </div>
  );
}

function MissionList({ title, records }: { title: string; records: PublicGuideRecord[] }) {
  const { mark, openRecord } = useActions();
  if (records.length === 0) return null;
  const sorted = [...records].sort((a, b) => Number(a.status === "completed") - Number(b.status === "completed"));
  return (
    <section className="mt-8">
      <SectionLabel>{title}</SectionLabel>
      <ul className="divide-y divide-rule overflow-hidden rounded-[var(--radius-card)] border border-rule">
        {sorted.map((r) => {
          const done = r.status === "completed";
          return (
            <li key={r.id} className="flex items-center bg-panel/50">
              <button
                type="button"
                aria-label={done ? `${r.name}: completed. Mark not done` : `Mark ${r.name} complete`}
                aria-pressed={done}
                onClick={() => mark(r, done ? null : "complete")}
                className="tap grid size-14 shrink-0 place-items-center"
              >
                <span className={cx("grid size-7 place-items-center rounded-full border-2", done ? "border-sea bg-sea text-ink" : "border-ivory-3/60")}>
                  {done && <Check size={15} strokeWidth={3} aria-hidden />}
                </span>
              </button>
              <button type="button" onClick={() => openRecord(r.id)} className="min-h-14 min-w-0 flex-1 py-2 pr-4 text-left">
                <span className={cx("block truncate text-[0.975rem]", done ? "text-ivory-2" : "text-ivory")}>{r.name}</span>
                {r.status === "unsure" && <span className="text-[0.75rem] text-gold">Not sure</span>}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Timeline() {
  const { state, undo } = useGuide();
  const { notify } = useActions();
  const events = useMemo(() => (state?.timeline ?? []).filter((e) => !e.undone).slice(-40).reverse(), [state]);
  if (events.length === 0) return null;
  return (
    <section className="mt-8">
      <SectionLabel
        aside={
          <button
            type="button"
            onClick={async () => {
              if (await undo()) notify("Undid last change");
            }}
            className="tap flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[0.8125rem] text-gold hover:bg-ivory/5"
          >
            <Undo2 size={15} aria-hidden /> Undo last
          </button>
        }
      >
        Timeline
      </SectionLabel>
      <ol className="relative ml-2 border-l border-rule-strong pl-5">
        {events.map((e) => (
          <li key={e.id} className="relative py-2">
            <span aria-hidden className="absolute -left-[25px] top-[15px] size-2 rounded-full bg-gold ring-4 ring-ink" />
            <p className="text-[0.95rem] text-ivory">{e.label}</p>
            <time className="text-[0.75rem] text-ivory-3" dateTime={e.at}>
              {new Date(e.at).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })}
            </time>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Notes() {
  const { state, apply } = useGuide();
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState<{ id: string; body: string } | null>(null);
  const notes = [...(state?.notes ?? [])].reverse();

  return (
    <section className="mt-8">
      <SectionLabel>Notes</SectionLabel>
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          if (!draft.trim()) return;
          if (await apply({ type: "add-note", body: draft.trim() }, "Added a note")) setDraft("");
        }}
      >
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={3}
          placeholder="Stash spot, a car you want, where you left off…"
          aria-label="New note"
          className="w-full resize-none rounded-2xl border border-rule-strong bg-panel p-3.5 text-[1rem] text-ivory placeholder:text-ivory-3 focus:border-gold/60 focus:outline-none"
        />
        <Button type="submit" variant="quiet" className="mt-2" disabled={!draft.trim()}>
          Add note
        </Button>
      </form>
      <ul className="mt-4 space-y-2">
        {notes.map((n) => (
          <li key={n.id}>
            <Card className="p-3.5">
              {editing?.id === n.id ? (
                <>
                  <textarea
                    value={editing.body}
                    onChange={(e) => setEditing({ id: n.id, body: e.target.value })}
                    rows={3}
                    aria-label="Edit note"
                    className="w-full resize-none rounded-xl bg-ink/50 p-2.5 text-[1rem] text-ivory focus:outline-none"
                  />
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={async () => {
                        if (await apply({ type: "edit-note", noteId: n.id, body: editing.body }, "Edited a note")) setEditing(null);
                      }}
                    >
                      Save
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </>
              ) : (
                <div className="flex items-start gap-2">
                  <button type="button" className="min-w-0 flex-1 whitespace-pre-wrap text-left text-[0.95rem] leading-relaxed text-ivory-2" onClick={() => setEditing({ id: n.id, body: n.body })}>
                    {n.body}
                  </button>
                  <button
                    type="button"
                    aria-label="Delete note"
                    onClick={() => apply({ type: "delete-note", noteId: n.id }, "Deleted a note")}
                    className="tap grid size-11 shrink-0 place-items-center rounded-full text-ivory-3 hover:bg-ivory/5 hover:text-flare"
                  >
                    <Trash2 size={16} aria-hidden />
                  </button>
                </div>
              )}
            </Card>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Backup() {
  const { store } = useGuide();
  const { notify } = useActions();
  const fileRef = useRef<HTMLInputElement>(null);
  const [pending, setPending] = useState<{ text: string; preview: ImportPreview } | null>(null);

  async function exportBackup() {
    if (!store) return;
    try {
      const backup = await store.exportBackup();
      const blob = new Blob([JSON.stringify(backup, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `leonida-field-guide-${backup.exportedAt.slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      notify("Backup downloaded");
    } catch {
      notify("Backup couldn't be created");
    }
  }

  async function choose(file: File) {
    if (!store) return;
    const text = await file.text();
    setPending({ text, preview: await store.previewImport(text) });
  }

  async function runImport(mode: "replace" | "merge") {
    if (!store || !pending) return;
    const result = await store.importBackup(pending.text, mode);
    setPending(null);
    notify(result.ok ? (mode === "replace" ? "Backup restored" : "Backup merged") : result.issues[0] ?? "Import failed");
  }

  return (
    <section className="mt-8">
      <SectionLabel>Backup</SectionLabel>
      <Card>
        <p className="text-[0.9rem] leading-relaxed text-ivory-2">
          Progress lives only on this device and survives app updates. Export a backup now and then. The guide can&apos;t read your console save.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={exportBackup}>
            <Download size={17} aria-hidden /> Export
          </Button>
          <Button onClick={() => fileRef.current?.click()}>
            <FileUp size={17} aria-hidden /> Import
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) void choose(file);
              e.target.value = "";
            }}
          />
        </div>
        {pending && (
          <div className="mt-4 rounded-2xl border border-rule-strong bg-ink/40 p-3.5">
            {pending.preview.valid ? (
              <>
                <p className="text-[0.95rem] text-ivory">
                  Backup from{" "}
                  {pending.preview.summary.exportedAt ? new Date(pending.preview.summary.exportedAt).toLocaleDateString() : "an unknown date"}: {pending.preview.summary.marks} marks,{" "}
                  {pending.preview.summary.notes} notes.
                </p>
                <p className="mt-1 text-[0.8125rem] text-ivory-3">Merge keeps your current entries and adds what&apos;s missing. Replace overwrites this device.</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <Button variant="primary" size="sm" onClick={() => runImport("merge")}>
                    Merge
                  </Button>
                  <Button size="sm" onClick={() => runImport("replace")}>
                    Replace
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => setPending(null)}>
                    Cancel
                  </Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-[0.95rem] text-flare">That file can&apos;t be imported.</p>
                <ul className="mt-1 text-[0.8125rem] text-ivory-3">
                  {pending.preview.issues.slice(0, 3).map((i) => (
                    <li key={i}>{i}</li>
                  ))}
                </ul>
              </>
            )}
          </div>
        )}
      </Card>
    </section>
  );
}

function ResetProgress() {
  const { store } = useGuide();
  const { notify } = useActions();
  const [armed, setArmed] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        if (!armed) {
          setArmed(true);
          window.setTimeout(() => setArmed(false), 4000);
          return;
        }
        setArmed(false);
        try {
          await store?.reset();
          notify("Progress erased on this device");
        } catch {
          notify("Couldn't erase progress");
        }
      }}
      className={cx(
        "tap flex min-h-12 w-full items-center gap-2 rounded-2xl border px-4 text-[0.95rem]",
        armed ? "border-flare bg-flare/12 text-flare" : "border-rule bg-panel/60 text-ivory-3 hover:text-ivory-2",
      )}
    >
      <RotateCcw size={16} aria-hidden /> {armed ? "Tap again to erase all progress" : "Erase all progress"}
    </button>
  );
}
