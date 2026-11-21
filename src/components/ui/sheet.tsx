"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { X } from "lucide-react";
import { cx } from "./cx";

/**
 * iOS-style bottom sheet built on the native <dialog> element:
 * focus trapping, Escape-to-close and inert background come from the platform.
 */
export function Sheet({
  open,
  onClose,
  title,
  eyebrow,
  children,
  footer,
  labelledBy,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  eyebrow?: string;
  children: ReactNode;
  footer?: ReactNode;
  labelledBy?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = labelledBy ?? `sheet-${title.replace(/\W+/g, "-").toLowerCase()}`;

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
      className={cx(
        "sheet m-0 mt-auto w-full max-w-none bg-transparent p-0 text-ivory backdrop:bg-ink/70 backdrop:backdrop-blur-sm",
        "max-h-[92dvh] overflow-visible",
      )}
    >
      <div className="mx-auto flex max-h-[92dvh] w-full max-w-[640px] flex-col rounded-t-[1.75rem] border-t border-rule-strong bg-night shadow-[0_-20px_60px_rgb(0_0_0/0.5)]">
        <div className="flex justify-center pt-2.5" aria-hidden>
          <span className="h-1 w-10 rounded-full bg-ivory/20" />
        </div>
        <header className="flex items-start gap-3 px-5 pb-3 pt-3">
          <div className="min-w-0 flex-1">
            {eyebrow && <p className="eyebrow text-sea">{eyebrow}</p>}
            <h2 id={titleId} className="headline mt-1.5 text-[1.5rem] leading-tight">
              {title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="tap -mr-2 grid size-11 shrink-0 place-items-center rounded-full text-ivory-2 hover:bg-panel-2"
            aria-label="Close"
          >
            <X size={20} aria-hidden />
          </button>
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-4">{children}</div>
        {footer && (
          <footer
            className="border-t border-rule px-5 pt-3"
            style={{ paddingBottom: "max(14px, var(--safe-bottom))" }}
          >
            {footer}
          </footer>
        )}
        {!footer && <div style={{ height: "max(14px, var(--safe-bottom))" }} aria-hidden />}
      </div>
    </dialog>
  );
}
