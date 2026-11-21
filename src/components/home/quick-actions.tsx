"use client";

import { CircleCheckBig, Compass, ShieldCheck } from "lucide-react";
import { useActions } from "@/components/shell/actions-provider";

/** The three most important interactions, one tap from Home. */
export function QuickActions() {
  const { openCheck, openComplete } = useActions();
  const actions = [
    {
      label: "What next?",
      icon: Compass,
      onClick: () => document.getElementById("next-move")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    },
    { label: "Check before starting", icon: ShieldCheck, onClick: () => openCheck() },
    { label: "Mark complete", icon: CircleCheckBig, onClick: () => openComplete() },
  ];
  return (
    <div className="grid grid-cols-3 gap-2">
      {actions.map(({ label, icon: Icon, onClick }) => (
        <button
          key={label}
          type="button"
          onClick={onClick}
          className="tap flex min-h-[76px] flex-col items-start justify-between gap-2 rounded-2xl border border-rule bg-panel/60 p-3 text-left hover:bg-panel-2"
        >
          <Icon size={20} className="text-gold" aria-hidden />
          <span className="text-[0.8125rem] font-medium leading-tight text-ivory">{label}</span>
        </button>
      ))}
    </div>
  );
}
