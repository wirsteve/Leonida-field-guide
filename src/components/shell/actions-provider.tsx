"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import type { ProgressMark, PublicGuideRecord } from "@/contracts";
import { useGuide } from "@/components/guide/guide-provider";
import { RecordSheet } from "@/components/sheets/record-sheet";
import { CheckSheet } from "@/components/sheets/check-sheet";
import { CompleteSheet } from "@/components/sheets/complete-sheet";
import { CashSheet } from "@/components/sheets/cash-sheet";

type SheetState =
  | { kind: "record"; recordId: string }
  | { kind: "check"; recordId?: string }
  | { kind: "complete" }
  | { kind: "cash" }
  | null;

interface Toast {
  id: number;
  message: string;
  undoable: boolean;
}

interface ActionsValue {
  openRecord: (recordId: string) => void;
  openCheck: (recordId?: string) => void;
  openComplete: () => void;
  openCash: () => void;
  close: () => void;
  /** Mark a visible record and show an undo toast. */
  mark: (record: Pick<PublicGuideRecord, "id" | "name">, mark: ProgressMark | null) => Promise<void>;
  notify: (message: string, undoable?: boolean) => void;
}

const ActionsContext = createContext<ActionsValue | null>(null);

const MARK_VERB: Record<ProgressMark | "clear", string> = {
  complete: "Marked complete",
  incomplete: "Marked not done",
  unsure: "Marked not sure",
  clear: "Cleared",
};

export function ActionsProvider({ children }: { children: React.ReactNode }) {
  const { apply, undo } = useGuide();
  const [sheet, setSheetState] = useState<SheetState>(null);
  // Bumped on every open so sheet contents remount with fresh state.
  const [openCount, setOpenCount] = useState(0);
  const setSheet = useCallback((next: SheetState) => {
    if (next) setOpenCount((n) => n + 1);
    setSheetState(next);
  }, []);
  const [toast, setToast] = useState<Toast | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const notify = useCallback((message: string, undoable = false) => {
    window.clearTimeout(timer.current);
    setToast({ id: Date.now(), message, undoable });
    timer.current = window.setTimeout(() => setToast(null), undoable ? 6000 : 3200);
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const mark = useCallback(
    async (record: Pick<PublicGuideRecord, "id" | "name">, value: ProgressMark | null) => {
      const verb = MARK_VERB[value ?? "clear"];
      const ok = await apply({ type: "mark-record", recordId: record.id, mark: value, via: "home" }, `${verb}: ${record.name}`);
      if (ok) notify(`${verb} · ${record.name}`, true);
    },
    [apply, notify],
  );

  const value = useMemo<ActionsValue>(
    () => ({
      openRecord: (recordId) => setSheet({ kind: "record", recordId }),
      openCheck: (recordId) => setSheet({ kind: "check", recordId }),
      openComplete: () => setSheet({ kind: "complete" }),
      openCash: () => setSheet({ kind: "cash" }),
      close: () => setSheet(null),
      mark,
      notify,
    }),
    [mark, notify, setSheet],
  );

  const close = () => setSheet(null);

  return (
    <ActionsContext.Provider value={value}>
      {children}
      <RecordSheet recordId={sheet?.kind === "record" ? sheet.recordId : undefined} onClose={close} />
      <CheckSheet key={`check-${openCount}`} open={sheet?.kind === "check"} initialRecordId={sheet?.kind === "check" ? sheet.recordId : undefined} onClose={close} />
      <CompleteSheet open={sheet?.kind === "complete"} onClose={close} />
      <CashSheet key={`cash-${openCount}`} open={sheet?.kind === "cash"} onClose={close} />
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 z-50 flex justify-center px-4"
        style={{ bottom: "calc(var(--tabbar-h) + var(--safe-bottom) + 12px)" }}
      >
        {toast && (
          <div
            key={toast.id}
            className="rise-in pointer-events-auto flex min-h-12 max-w-[600px] items-center gap-3 rounded-2xl border border-rule-strong bg-panel-2/95 py-1.5 pl-4 pr-1.5 shadow-2xl backdrop-blur"
          >
            <p className="min-w-0 flex-1 truncate text-[0.9rem] text-ivory">{toast.message}</p>
            {toast.undoable && (
              <button
                type="button"
                className="tap min-h-11 rounded-xl px-3 font-semibold text-gold hover:bg-ivory/5"
                onClick={async () => {
                  setToast(null);
                  if (await undo()) notify("Undone");
                }}
              >
                Undo
              </button>
            )}
          </div>
        )}
      </div>
    </ActionsContext.Provider>
  );
}

export function useActions(): ActionsValue {
  const value = useContext(ActionsContext);
  if (!value) throw new Error("useActions must be used inside <ActionsProvider>");
  return value;
}
