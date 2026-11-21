"use client";

import { useState } from "react";
import { useGuide } from "@/components/guide/guide-provider";
import { useActions } from "@/components/shell/actions-provider";
import { Button } from "@/components/ui/primitives";
import { Sheet } from "@/components/ui/sheet";

function parseAmount(text: string): number | null | "invalid" {
  const cleaned = text.replace(/[$,\s]/g, "");
  if (!cleaned) return null;
  if (!/^\d+$/.test(cleaned)) return "invalid";
  return Number(cleaned);
}

export function CashSheet({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, apply } = useGuide();
  const { notify } = useActions();
  // The sheet is remounted on every open, so these initializers reset it.
  const [cash, setCash] = useState(state?.cash.amount?.toString() ?? "");
  const [target, setTarget] = useState(state?.cash.target?.toString() ?? "");
  const [error, setError] = useState<string | null>(null);

  async function save() {
    const nextCash = parseAmount(cash);
    const nextTarget = parseAmount(target);
    if (nextCash === "invalid" || nextTarget === "invalid") {
      setError("Use whole dollars, like 12500.");
      return;
    }
    let ok = true;
    if (nextCash !== (state?.cash.amount ?? null)) ok = await apply({ type: "set-cash", amount: nextCash }, "Updated cash");
    if (ok && nextTarget !== (state?.cash.target ?? null))
      ok = await apply({ type: "set-cash-target", target: nextTarget }, "Updated savings goal");
    if (ok) {
      notify("Money updated", true);
      onClose();
    }
  }

  return (
    <Sheet
      open={open}
      onClose={onClose}
      eyebrow="Money"
      title="Update your cash"
      footer={
        <Button variant="primary" size="lg" className="w-full" onClick={save}>
          Save
        </Button>
      }
    >
      <p className="text-[0.95rem] leading-relaxed text-ivory-2">
        Enter what you have in game. The guide can&apos;t read your console save, so this is only as current as you keep it.
      </p>
      <label className="mt-5 block">
        <span className="eyebrow text-ivory-3">Cash on hand</span>
        <MoneyInput value={cash} onChange={setCash} label="Cash on hand" />
      </label>
      <label className="mt-4 block">
        <span className="eyebrow text-ivory-3">Savings goal (optional)</span>
        <MoneyInput value={target} onChange={setTarget} label="Savings goal" />
      </label>
      {error && <p className="mt-3 text-[0.875rem] text-flare">{error}</p>}
    </Sheet>
  );
}

function MoneyInput({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) {
  return (
    <div className="relative mt-2">
      <span className="headline pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gold" aria-hidden>
        $
      </span>
      <input
        inputMode="numeric"
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="0"
        className="headline h-14 w-full rounded-2xl border border-rule-strong bg-panel pl-9 pr-4 text-[1.5rem] text-ivory placeholder:text-ivory-3/60 focus:border-gold/60 focus:outline-none"
      />
    </div>
  );
}
