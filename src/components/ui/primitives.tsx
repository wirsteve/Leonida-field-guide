import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cx } from "./cx";

type Variant = "primary" | "secondary" | "ghost" | "quiet";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-coral text-ink hover:bg-[#f39b80] font-semibold",
  secondary: "bg-panel-2 text-ivory ring-1 ring-inset ring-rule-strong hover:bg-panel-3",
  ghost: "text-ivory-2 hover:text-ivory hover:bg-panel-2/60",
  quiet: "bg-ivory/6 text-ivory hover:bg-ivory/10",
};

export function Button({
  variant = "secondary",
  size = "md",
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: "md" | "lg" | "sm" }) {
  return (
    <button
      type="button"
      {...props}
      className={cx(
        "tap inline-flex select-none items-center justify-center gap-2 rounded-full text-[0.95rem] disabled:pointer-events-none disabled:opacity-45",
        size === "lg" && "min-h-12 px-5",
        size === "md" && "min-h-11 px-4",
        size === "sm" && "min-h-11 px-3 text-[0.875rem]",
        VARIANTS[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

/** Small-caps section label with a hairline rule — the strategy-guide "chapter rule". */
export function SectionLabel({ children, aside, className }: { children: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <div className={cx("mb-3 flex items-center gap-3", className)}>
      <h2 className="eyebrow shrink-0 text-ivory-3">{children}</h2>
      <span className="h-px flex-1 bg-rule" aria-hidden />
      {aside}
    </div>
  );
}

export function Card({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <section className={cx("rounded-[var(--radius-card)] border border-rule bg-panel/70 p-4", className)}>{children}</section>
  );
}

/** Honest hedge shown wherever research coverage isn't verified. */
export function VerificationNote({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cx("flex gap-2 text-[0.8125rem] leading-snug text-ivory-3", className)}>
      <span aria-hidden className="mt-[0.45em] size-1.5 shrink-0 rounded-full border border-ivory-3" />
      <span>{children}</span>
    </p>
  );
}

export function Meta({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cx("text-[0.8125rem] text-ivory-3", className)}>{children}</span>;
}

export function formatMinutes(range?: { min: number; max: number }): string | null {
  if (!range) return null;
  if (range.min === range.max) return `~${range.min} min`;
  return `${range.min}–${range.max} min`;
}

export function formatCash(amount: number | null | undefined): string {
  if (amount === null || amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(amount);
}
